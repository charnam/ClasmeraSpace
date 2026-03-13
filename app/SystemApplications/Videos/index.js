import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import Tabbed from "../../util/Tabbed.js";
import VideoSources from "./sources/sources.js";
import OverlayMenu from "../../renderable/OverlayMenu/index.js";

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
			videosSourceSwitchContainer,
			videosSourceTabs,
			videosSourceOptions,
			videosMainMenu;
		
		app.append(
			videosContainer = new HTML.div({class: "videos-app-main-scroller"},
				videosHeader = new HTML.div({class: "base-header videos-app-header"},
					new HTML.div(
						videosQuit = new HTML.div({class: "base-pillbutton videos-app-quit-button bi-x-lg"}),
					),
					videosSourceSwitchContainer = new HTML.div({class: "videos-app-source-switch-container"}),
					new HTML.div(
						videosSourceOptions = new HTML.div({class: "base-pillbutton videos-app-source-options-button bi-gear-fill"}),
						videosMainMenu = new HTML.div({class: "base-pillbutton videos-app-menu-button bi-list"}),
					)
				),
				videosSourceTabs = new HTML.div({class: "base-tabbed"},
				)
			)
		);
		
		this.tabbed = new Tabbed(videosSourceTabs);
		
		new Interactable(videosQuit, {
			activate: () => {
				this.remove();
			}
		});
		
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
		})
		
		this.updateSources(videosContainer);
		this.updateRendered(videosContainer);
		return app;
	}
	
	updateSources(element) {
		const videosSourceSwitchContainer = element.querySelector(".videos-app-source-switch-container")
		
		this.tabbed.element.innerHTML = "";
		videosSourceSwitchContainer.innerHTML = "";
		
		for(let [id, source] of Object.entries(VideoSources.all)) {
			const tabButton = new HTML.div({class: "base-pillbutton"})
			const tabContent = new HTML.div({class: "base-tabbed-tab", tabid: id});
			
			tabButton.innerText = source.name;
			
			new Interactable(tabButton, {
				activate: () => {
					this.tabbed.setTab(id);
				}
			})
			
			tabContent.append(new HTML.div("Hello world!"));
			
			this.tabbed.element.append(tabContent);
			videosSourceSwitchContainer.append(tabButton);
		}
		
		this.tabbed.setTab(0);
		
	}
	
	updateRendered(element) {
	}
	
}

export default Videos;
