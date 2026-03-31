import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import Tabbed from "../../util/Tabbed.js";
import VideoSources from "./sources/sources.js";
import TabbedContainer from "../../renderable/TabbedContainer/index.js";
import Registry from "../../util/system/Registry.js";
import UserHome from "../../renderable/UserHome/index.js";
import Video from "./Video/index.js";
import Scrollable from "../../util/Scrollable.js";

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
			videosHistory,
			videosMainMenu;
		
		app.append(
			videosContainer = new HTML.div({class: "videos-app-main-container"},
				videosHeader = new HTML.div({class: "base-header videos-app-header base-justify-true-center"},
					new HTML.div(
						videosQuit = new HTML.div({class: "base-pillbutton videos-app-quit-button bi-x-lg"}),
					),
					this.tabbed.renderTabButtons(),
					new HTML.div(
						videosHistory = new HTML.div({class: "base-pillbutton videos-app-source-options-button bi-clock-history"}),
						//videosMainMenu = new HTML.div({class: "base-pillbutton videos-app-menu-button bi-list"}),
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
		
		new Interactable(videosHistory, {
			activate: async manager => {
				if(await manager.PasscodeInput.validateUser(UserHome.currentUserId)) {
					await this.updateRendered();
					this.tabbed.tabbed.setTab("history");
				}
			}
		});
		
		/*
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
		
		this.updateSources(videosContainer).then(() => {
			this.updateRendered(videosContainer);
		});
		return app;
	}
	
	async updateSources(element) {
		this.tabbed.tabs.innerHTML = ""
		this.tabbed.tabButtons.innerHTML = ""
		
		for(let [id, Source] of Object.entries(await VideoSources.getOverridesFor((await this.getLaunchingUser()).id))) {
			const tab = this.tabbed.createTab({id, name: Source.name}).render();
			const source = new Source();
			tab.append(source.render());
		}
	}
	
	async updateRendered(element) {
		const historyTabPrev = this.tabbed.tabs.querySelector("[tabid=\"history\"]");
		if(historyTabPrev) historyTabPrev.remove();
		
		const history = Object.values(
			await Registry.getKey(`user.${UserHome.currentUserId}.app.videos.history`, {})
		).sort((a,b) => b.lastPlayed - a.lastPlayed);
		
		const historyTab = this.tabbed.createTab({id: "history"}).render();
		historyTab.classList.add("videos-app-history-tab");
		if(history.length > 0) {
			const grid = new HTML.div({class: "videos-app-video-grid"});
			for(let vidMeta of history) {
				const video = await Video.byId(vidMeta.video);
				video.renderTo(grid);
			}
			historyTab.append(grid);
		} else {
			historyTab.innerText = "No history available.";
		}
		
		new Scrollable(historyTab);
	}
	
}

export default Videos;
