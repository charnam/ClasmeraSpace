import { HTML } from "imperative-html";
import VisualOverlay from "../../../renderable/VisualOverlay/index.js";
import Interactable from "../../../util/Interactable.js";
import Scrollable from "../../../util/Scrollable.js";
import Video from "../Video/index.js";

class DownloadPage extends VisualOverlay {
	style = [...this.style, "app/SystemApplications/Videos/DownloadPage/main.css"];
	
	video = null;
	download = null;
	
	constructor(details) {
		super();
		
		if(details.video) {
			this.video = details.video;
		}
		if(details.download) {
			this.download = details.download;
		}
	}
	
	render() {
		const el = super.render();
		
		let title,
			author,
			description,
			backButton,
			buttons,
			thumbnailEl;
		
		el.append(
			new HTML.div({class: "videos-app-video-download-page"},
				backButton = new HTML.div({class: "videos-app-video-download-page-back-button base-pillbutton bi-arrow-left"}),
				new HTML.div({class: "videos-app-video-download-page-left-side"},
					thumbnailEl = new HTML.div({
						class: "videos-app-video-download-page-thumbnail",
					}),
					title = new HTML.div({class: "videos-app-video-download-page-title"}),
					author = new HTML.div({class: "videos-app-video-download-page-author-name"})
				),
				new HTML.div({class: "videos-app-video-download-page-right-side"},
					description = new HTML.div({
						class: "videos-app-video-download-page-description"
					}),
					buttons = new HTML.div({
						class: "videos-app-video-download-page-buttons"
					})
				)
			)
		);
		
		title.innerText = this.video.title;
		author.innerText = this.video.author.name;
		
		description.innerText = this.video.description;
		Video.getThumbnail(this.video).then(url => thumbnailEl.style.backgroundImage = `url("${url}")`);
		
		if(this.download) {
			let downloadButtonIcon;
			
			const downloadButton = new HTML.div({class: "videos-app-video-download-page-button base-button"},
				downloadButtonIcon = new HTML.i({class: "bi-play"}),
				" Play"
			);
			
			new Interactable(downloadButton, {
				activate: () => {
					if(downloadButton.classList.contains("progress")) return;
					
					downloadButton.classList.add("progress");
					downloadButtonIcon.classList.remove("bi-play");
					downloadButtonIcon.classList.add("bi-arrow-repeat");
					
					this.download(progress => {
						if(progress.complete) {
							downloadButton.setAttribute("style", "");
							
							downloadButton.classList.remove("progress");
							downloadButtonIcon.classList.remove("bi-arrow-repeat");
							downloadButtonIcon.classList.add("bi-play");
							
						} else if(progress.stage == 0 || progress.complete) {
							downloadButton.setAttribute("style", "");
						} else {
							downloadButton.setAttribute("style",
								`--progress: ${((progress.stage - 1) + progress.progress) / progress.stages};`);
						}
					});
				}
			});
			
			buttons.append(downloadButton);
		}
		
		new Interactable(backButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		})
		
		new Scrollable(description, {
			selectable: true
		});
		
		return el;
	}
	
}

export default DownloadPage;