import { applyToElement, HTML } from "imperative-html";
import Renderable from "../../../util/Renderable.js";
import formatTimestamp from "../../../util/simple/formatTimestamp.js";
import Blobs from "../../../util/system/Blobs.js";

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
	
	static async getThumbnail(video) {
		if(!video) return false;
		if(!video.thumbnail || video.thumbnail.includes(":")) {
			return video.thumbnail;
		}
		
		const blob = await Blobs.get(video.thumbnail);
		return URL.createObjectURL(blob);
	}
}

export default Video;