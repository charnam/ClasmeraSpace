import { YtDlp } from 'ytdlp-nodejs';
import Blobs from '../../Blobs.mjs';
import Download from '../../Download.mjs';
import { ipcMain } from 'electron';
import { Innertube, UniversalCache } from 'youtubei.js';
import { readdir } from 'fs/promises';
import Registry from '../../Registry.mjs';

const innertube = await Innertube.create({ cache: new UniversalCache(false) });
const ytdlp = new YtDlp();

function getLargestThumbnail(thumbnails) {
	if(!thumbnails) return null;
	
	return thumbnails.sort((thumbA, thumbB) => thumbB.width - thumbA.width)[0]
}

ipcMain.handle("youtubeSearch", async (_event, query) => {
	const search = await innertube.search(query.query, {type: "video"});
	
	const results = search.results
		.filter(result => !result.is_live)
		.map(result => {
			let duration = 0;
			let views = 0;
			try {
				let duration_split = result.length_text.text.split(":").reverse();
				duration += parseInt("0"+duration_split[0]);
				duration += parseInt("0"+duration_split[1]) * 60;
				duration += parseInt("0"+duration_split[2]) * 60 * 60;
				
				views = parseInt(result.view_count.text.replace(/\,/g, ""));
			} catch(err) {
				console.log("Failed to get video duration or views: ", err);
			}
			
			return {
				id: result.video_id,
				title: result.title?.text,
				views: views,
				duration,
				thumbnail: getLargestThumbnail(result.thumbnails)?.url,
				author: {
					id: result.author?.id,
					name: result.author?.name,
					image: result.author?.thumbnails[0]?.url
				}
			};
		});
	
	return results;
});

async function getVideoInfo(id) {
	const cachedInfo = await Registry.getKey(`applications.videos.sources.youtube.videos.${id}`);
	if(cachedInfo) {
		return cachedInfo;
	}
	
	const info = (await innertube.getBasicInfo(id)).basic_info;
	return {
		id: info.id,
		title: info.title,
		views: info.view_count,
		description: info.short_description,
		duration: info.duration,
		thumbnail: getLargestThumbnail(info.thumbnail)?.url,
		author: {
			id: info.channel_id,
			name: info.author,
		},
	}
}

ipcMain.handle("youtubeInfo", async (_event, query) => {
	return getVideoInfo(query.videoID);
});

const downloadingVideos = {};

ipcMain.handle("youtubeDownload", async (_event, query) => {
	const info = await getVideoInfo(query.videoID);
	if(!info) {
		return false;
	}
	
	if(downloadingVideos[query.videoID]) {
		return downloadingVideos[query.videoID];
	}
	
	const downloadID = await Download.create();
	downloadingVideos[query.videoID] = downloadID;
	
	const existingVideo = await Registry.getKey(`applications.videos.sources.youtube.videos.${info.id}`, {});
	
	if(!existingVideo.blob) {
		const tempID = crypto.randomUUID();
		const downloadPath = `temp/${tempID}`;
		
		let predictedDownloadStages = 2;
		Download.update(downloadID, {
			stages: predictedDownloadStages,
		})
		
		const usedFilenames = [];
		
		ytdlp
			.download("https://www.youtube.com/watch?v="+query.videoID)
			.output(downloadPath)
			.on("progress", async progress => {
				if(progress.status == "downloading") {
					if(!usedFilenames.includes(progress.filename)) {
						usedFilenames.push(progress.filename);
					}
					await Download.update(downloadID, {
						progress: progress.percentage / 100,
						stages: Math.max(usedFilenames.length, predictedDownloadStages),
						stage: usedFilenames.length
					});
				}
			})
			.run()
			.then(async () => {
				const dir = (await readdir(downloadPath)).filter(filename => filename !== "." && filename !== "..");
				if(dir[0]) {
					const blobID = await Blobs.storeFile(`${downloadPath}/${dir[0]}`);
					
					info.blob = blobID;
					await Registry.setKey(`applications.videos.sources.youtube.videos.${info.id}`, info);
					
					Download.update(downloadID, {
						complete: true,
						stage: (await Download.get(downloadID)).stages,
						data: info
					});
				} else {
					Download.update(downloadID, {
						complete: true,
						stage: (await Download.get(downloadID)).stages,
						failed: true
					});
				}
			});
		
	} else {
		Download.update(downloadID, {
			complete: true,
			stage: (await Download.get(downloadID)).stages,
			data: info
		});
	}
	
	return downloadID;
})