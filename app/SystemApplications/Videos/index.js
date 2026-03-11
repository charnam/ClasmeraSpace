import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";

class Videos extends Application {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = [...this.style, "app/SystemApplications/Videos/icon-large.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-videos");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = [...this.style, "app/SystemApplications/Videos/icon-small.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-videos");
			return icon;
		}
	}
	
	static downloads = {};
	static startDownload(source) {
		
	}
	
	
	style = [...this.style, "app/SystemApplications/Videos/main.css"];
	render() {
		const app = super.render();
		app.classList.add("videos-app");
		
		let videosContainer,
			videosHeader,
			videosQuit,
			videosBackendSwitchContainer,
			videosOptions;
		
		app.append(
			videosContainer = new HTML.div({class: "videos-app-main-scroller"},
				videosHeader = new HTML.div({class: "base-header videos-app-header"},
					videosQuit = new HTML.div({class: "base-pillbutton videos-app-quit-button bi-x-lg"}),
					videosBackendSwitchContainer = new HTML.div({class: "videos-app-backend-switch-container"}),
					videosOptions = new HTML.div({class: "base-pillbutton videos-app-options-button bi-gear-fill"}),
				),
				videosBackends
			)
		);
		
		new Interactable(videosQuit, {
			activate: () => {
				this.remove();
			}
		});
		
		new Interactable(videosOptions, {
			activate: () => {
			}
		});
		
		this.updateRendered();
		return app;
	}
	
	updateRendered(element) {
		const videosBackendSwitchContainer = element.querySelector(".videos-app-backend-switch-container")
	}
	
}

export default Videos;
