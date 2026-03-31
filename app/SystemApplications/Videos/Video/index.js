import { applyToElement, HTML } from "imperative-html";
import Renderable from "../../../util/Renderable.js";
import formatTimestamp from "../../../util/simple/formatTimestamp.js";
import Blobs from "../../../util/system/Blobs.js";
import Registry from "../../../util/system/Registry.js";
import LoadingScreen from "../../../renderable/LoadingScreen/index.js";
import UserHome from "../../../renderable/UserHome/index.js";
import VideoPlayer from "../../../renderable/VideoPlayer/index.js";

const pVideoSources = import("../sources/sources.js").then(m => m.default);

class Video extends Renderable {
	
	constructor(details = {}) {
		super();
		this.video = details.video;
	}
	
	render() {
		const videoEl = super.render();
		
		let videoTitle,
			videoAuthorName,
			videoThumbnail;
		
		applyToElement(videoEl, {class: "base-pillbutton videos-app-video"},
			videoThumbnail = new HTML.div(
				{
					class: "videos-app-video-thumbnail",
				},
				new HTML.div({class: "videos-app-video-duration"},
					this.video.duration ? formatTimestamp(this.video.duration) : {class: "base-hidden"}
				)
			),
			new HTML.div({class: "videos-app-video-details"},
				videoTitle = new HTML.div({class: "videos-app-video-title"}),
				videoAuthorName = new HTML.div({class: "videos-app-video-author-name"})
			)
		)
		
		videoTitle.innerText = this.video.title ?? "";
		videoAuthorName.innerText = this.video.author?.name ?? "";
		Video.getThumbnail(this.video).then(thumbnail => videoThumbnail.style.backgroundImage = `url("${thumbnail}")`);
		
		return videoEl;
	}
	
	async play(playerArgs) {
		const loader = new LoadingScreen();
		loader.open();
		let timeKey = null;
		if(UserHome.currentUserId) {
			const historyKey = `user.${UserHome.currentUserId}.app.videos.history.${this.video.id}`;
			const history = await Registry.getKey(historyKey, {firstPlayed: Date.now(), timesPlayed: []});
			
			history.timesPlayed.push(Date.now());
			
			await Registry.setKey(historyKey, {
				...history,
				video: this.video.id,
				lastPlayed: Date.now()
			});
			
			timeKey = `${historyKey}.lastplaybacktime`;
		}
		
		const player = new VideoPlayer({
			title: this.video.title,
			author: this.video.author.name,
			...playerArgs,
			timeKey
		});
		loader.remove();
		player.open();
		
	}
	
	static async getThumbnail(video) {
		if(!video) return false;
		if(!video.thumbnail || video.thumbnail.includes(":")) {
			return video.thumbnail;
		}
		
		const blob = await Blobs.get(video.thumbnail);
		return URL.createObjectURL(blob);
	}
	
	static async byId(videoId) {
		const video = await Registry.getKey(`app.videos.all.${videoId}`);
		const Source = (await pVideoSources).byId[video.source];
		if(Source) {
			return new Source.Video({video});
		} else {
			return null;
		}
	}
}

export default Video;