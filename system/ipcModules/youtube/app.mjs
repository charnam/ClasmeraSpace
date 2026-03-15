import { Download, YtDlp } from 'ytdlp-nodejs';
import Blobs from '../../Blobs.mjs';
import { ipcMain } from 'electron';
import { Innertube, UniversalCache } from 'youtubei.js';
const innertube = await Innertube.create({ cache: new UniversalCache(false) });

const ytdlp = new YtDlp();

function getLargestThumbnail(thumbnails) {
	if(!thumbnails) return null;
	
	return thumbnails.sort((thumbA, thumbB) => thumbB.width - thumbA.width)[0]
}

ipcMain.handle("youtubeSearch", async (_event, query) => {
	const search = await innertube.search(query.query, {type: "video"});
	console.log(search.results[0]);
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
	
	console.log(results);
	
	return results;
});

ipcMain.handle("youtubeInfo", async (_event, query) => {
	const info = (await innertube.getBasicInfo(query.videoURL)).basic_info;
	const thumbnail = info.thumbnail ? getLargestThumbnail(info.thumbnail) : null;
	
	let thumbnailBlob = null;
	
	if(thumbnail) {
		thumbnailBlob = await Blobs.store(await fetch(thumbnail.url).then(e => e.arrayBuffer()))
	}
	
	return {
		id: info.id,
		title: info.title,
		views: info.view_count,
		description: info.short_description,
		duration: info.duration,
		thumbnail: thumbnailBlob,
		author: {
			id: info.channel_id,
			name: info.author
		},
	}
});

ipcMain.handle("youtubeDownload", async (_event, query) => {
	const downloadID = await Download.create();
	const tempID = crypto.randomUUID();
	
	const downloadPath = `temp/${tempID}`;
	
	let predictedDownloadStages = 2;
	Download.update(downloadID, {
		stages: predictedDownloadStages,
	})
	
	const usedFilenames = [];
	
	ytdlp
		.download(query.videoURL)
		.output(downloadPath)
		.on("progress", async progress => {
			if(progress.status == "downloading") {
				if(!usedFilenames.includes(progress.filename)) {
					usedFilenames.push(progress.filename);
				}
				await Download.update(downloadID, {
					progress: progress.percentage / 100,
					stages: Math.max(usedFilenames.length, downloadStages),
					stage: usedFilenames.length
				});
				query.progressCallback(await Download.get(downloadID));
			}
		})
		.run()
		.then(async () => {
			const dir = (await readdir(downloadPath)).some(filename => filename !== "." && filename !== "..");
			if(dir[0]) {
				const blobID = await Blobs.storeFile(dir[0]);
				
				Download.update(downloadID, {
					complete: true,
					stage: (await Download.get(downloadID)).stages,
					blob: blobID
				});
			}
		});
	
	
	return downloadID;
	
	/*
	If we stop using ytdlp-nodejs, this is the backup plan.
	Should fix the possible security vulnerability first though.
	
	const downloadProcess = spawn("yt-dlp", ["-o", downloadPath, query.videoURL]);
	
	downloadProcess.stdout.on("data", data => {
		console.log(data);
	});
	
	downloadProcess.on("close", async code => {
		if(code == 0) {
			const blobID = await Blobs.storeFile(downloadPath);
			
		}
	})
	*/
})