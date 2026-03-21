import { applyToElement, HTML } from "imperative-html";
import Renderable from "../../../util/Renderable.js";
import format_timestamp from "../../../util/simple/format_timestamp.js";
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
					this.video.duration ? format_timestamp(this.video.duration) : {class: "base-hidden"}
				)
			),
			new HTML.div({class: "videos-app-video-details"},
				videoTitle = new HTML.div({class: "videos-app-video-title"}),
				videoAuthorName = new HTML.div({class: "videos-app-video-author-name"})
			)
		)
		
		videoTitle.innerText = this.video.title ?? "";
		videoAuthorName.innerText = this.video.author?.name ?? "";
		
		if(this.video.thumbnail.includes(":")) {
			videoThumbnail.style.backgroundImage = `url("${this.video.thumbnail}")`;
		} else {
			Blobs.get(this.video.thumbnail).then(blob => {
				const url = URL.createObjectURL(blob);
				videoThumbnail.style.backgroundImage = `url("${url}")`;
			})
		}
		
		return videoEl;
	}
}

export default Video;