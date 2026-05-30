import { HTML } from "imperative-html";
import VisualOverlay from "../../../renderable/VisualOverlay/index.js";
import Interactable from "../../../util/Interactable.js";
import Scrollable from "../../../util/Scrollable.js";
import Video from "../Video/index.js";

class DownloadPage extends VisualOverlay {
	style = this.autoStyleByImport(import.meta.url);
	
	video = null;
	download = null;
	
	buttons = [];
	
	constructor(details) {
		super();
		
		if(details.video) {
			this.video = details.video;
		}
		if(details.download) {
			this.download = details.download;
		}
		if(details.buttons) {
			this.buttons = details.buttons;
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
		if(this.video.author && this.video.author.name) {
			author.innerText = this.video.author.name;
		}
		
		description.innerText = this.video.description;
		Video.getThumbnail(this.video).then(url => thumbnailEl.style.backgroundImage = `url("${url}")`);
		
		for(let button of this.buttons) {
			const buttonEl = new HTML.div({class: "videos-app-video-download-page-button base-button "+(button.icon ?? "")});
			buttonEl.innerText = button.text;
			
			new Interactable(buttonEl, {
				activate: manager => {
					button.activate(manager, buttonEl);
				}
			})
			
			buttons.append(buttonEl);
		}
		
		/*if(this.download) {
			let downloadButtonIcon;
			
			const downloadButton = new HTML.div({class: "videos-app-video-download-page-button base-button bi-play"},
				"Play"
			);
			
			new Interactable(downloadButton, {
				activate: () => {
					if(downloadButton.classList.contains("progress")) return;
					
					downloadButton.classList.add("progress");
					
					this.download(progress => {
						downloadButtonProgress(progress, downloadButton)
					});
				}
			});
			
		}*/
		
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