import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import Tabbed from "../../util/Tabbed.js";
import VideoSources from "./sources/sources.js";
import TabbedContainer from "../../renderable/TabbedContainer/index.js";

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
	
	style = [...this.style, "app/SystemApplications/Videos/main.css"];
	render() {
		const app = super.render();
		app.classList.add("videos-app");
		
		this.tabbed = new TabbedContainer();
		
		let videosContainer,
			videosHeader,
			videosQuit,
			videosSourceTabs,
			videosSourceOptions,
			videosMainMenu;
		
		app.append(
			videosContainer = new HTML.div({class: "videos-app-main-container"},
				videosHeader = new HTML.div({class: "base-header videos-app-header"},
					new HTML.div(
						videosQuit = new HTML.div({class: "base-pillbutton videos-app-quit-button bi-x-lg"}),
					),
					this.tabbed.renderTabButtons(),
					new HTML.div(
						videosSourceOptions = new HTML.div({class: "base-pillbutton videos-app-source-options-button bi-gear-fill"}),
						videosMainMenu = new HTML.div({class: "base-pillbutton videos-app-menu-button bi-list"}),
					)
				),
				this.tabbed.renderTabContents()
			)
		);
		
		
		new Interactable(videosQuit, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		});
		
		/*
		new Interactable(videosSourceOptions, {
			activate: () => {
			}
		});
		
		new Interactable(videosMainMenu, {
			activate: () => {
				const menu = new OverlayMenu({
					menu: [
						{
							text: "Party Mode",
							callback: () => {
								
							}
						}
					]
				});
				menu.open();
			}
		})*/
		
		this.updateSources(videosContainer);
		this.updateRendered(videosContainer);
		return app;
	}
	
	updateSources(element) {
		this.tabbed.tabs.innerHTML = ""
		this.tabbed.tabButtons.innerHTML = ""
		
		for(let [id, Source] of Object.entries(VideoSources.all)) {
			const tab = this.tabbed.createTab({id, name: Source.name}).render();
			const source = new Source();
			tab.append(source.render());
		}
	}
	
	updateRendered(element) {
	}
	
}

export default Videos;
