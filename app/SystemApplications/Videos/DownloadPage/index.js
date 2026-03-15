import { HTML } from "imperative-html";
import VisualOverlay from "../../../renderable/VisualOverlay/index.js";
import Interactable from "../../../util/Interactable.js";

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
			description,
			backButton,
			buttons;
		
		el.append(
			new HTML.div({class: "videos-app-video-download-page"},
				backButton = new HTML.div({class: "videos-app-video-download-page-back-button base-pillbutton bi-arrow-left"}),
				new HTML.div({class: "videos-app-video-download-page-left-side"},
					new HTML.div({
						class: "videos-app-video-download-page-thumbnail",
						style: `background-image: url('${this.video?.thumbnail}');`
					}),
					title = new HTML.div({class: "videos-app-video-download-page-title"})
				),
				new HTML.div({class: "videos-app-video-download-page-right-side"},
					new HTML.div({
						class: "videos-app-video-download-page-description"
					}),
					buttons = new HTML.div({
						class: "videos-app-video-download-page-buttons"
					})
				)
			)
		);
		
		if(this.download) {
			const downloadButton = new HTML.div({class: "videos-app-video-download-page-button base-button"},
				new HTML.i({class: "bi-download"}),
				" Download"
			);
			
			new Interactable(downloadButton, {
				activate: () => {
					this.download(progress => {
						downloadButton.setAttribute("style",
							`--progress: ${progress}%;`);
					});
				}
			});
			
			buttons.append(downloadButton);
		}
		
		new Interactable(backButton, {
			activate: () => {
				this.remove();
			}
		})
		
		return el;
	}
	
}

export default DownloadPage;