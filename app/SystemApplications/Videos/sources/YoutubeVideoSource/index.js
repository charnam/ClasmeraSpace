import { HTML } from "imperative-html";
import Youtube from "../../../../util/system/ipcModules/Youtube.js";
import VideoSource from "../VideoSource/index.js";
import YoutubeVideo from "./YoutubeVideo/index.js";
import Interactable from "../../../../util/Interactable.js";
import LoadingScreen from "../../../../renderable/LoadingScreen/index.js";
import Scrollable from "../../../../util/Scrollable.js";
import TabbedContainer from "../../../../renderable/TabbedContainer/index.js";

class YoutubeVideoSource extends VideoSource {
	style = [...this.style, "app/SystemApplications/Videos/sources/YoutubeVideoSource/main.css"];
	
	static name = "YouTube";
	static Video = YoutubeVideo;
	
	render() {
		const el = super.render();
		
		this.addSearchTab();
		this.addMultiTab({icon: "bi-leaf", name: "Agriculture"}, {
			"Entertainment": "real life farming videos",
			"News": "farming news latest developments",
			"Tutorials": "real life farming tips",
		});
		this.addMultiTab({icon: "bi-cookie", name: "Recipes"}, {
			"Cooking": "good home cooking recipes",
			"Sweets": "dessert recipes home ingredients",
		});
		this.addAutoTab({icon: "bi-newspaper", name: "News"}, 'latest news');
		this.addMultiTab({icon: "bi-flask", name: "Science"}, {
			"Documentaries": "science documentary",
			'News': "science news",
		});
		this.addMultiTab({icon: "bi-tags", name: "Animals"}, {
			"Wildlife": "wildlife nature documentaries",
			"Pets": "our pets"
		});
		this.addAutoTab({icon: "bi-motherboard", name: "Technology"}, 'technology news');
		
		return el;
	}
	
	async addMultiTab(button, queries) {
		const tab = this.tabbed.createTab(button).render();
		tab.classList.add("videos-app-youtube-video-source-multi-tab");
		
		new Scrollable(tab, {directions: ["vertical"]});
		
		const tabs = new TabbedContainer();
		
		const tabsRendered = tabs.renderTo(tab);
		tabsRendered.classList.add("videos-app-youtube-video-source-multi-tab-tabs");
		
		for(let [name, query] of Object.entries(queries)) {
			this.addAutoTabTo(tabs, query, {name});
		}
	}
	
	async addAutoTab(button, query) {
		const tab = await this.addAutoTabTo(this.tabbed, query, button);
		new Scrollable(tab);
		return tab;
	}
	
	async addAutoTabTo(tabbed, query, button) {
		const tab = tabbed.createTab(button).render();
		
		const videosContainer = new HTML.div({class: "videos-app-video-grid videos-app-video-grid-is-loading"});
		tab.append(videosContainer);
		
		// Wait until tab is selected before loading content
		await new Promise(res => {
			const observer = new MutationObserver(() => {
				setTimeout(() => {
					if(getComputedStyle(tab).pointerEvents !== "none") {
						observer.disconnect();
						res();
					}
				}, 300)
			});
			observer.observe(this.element, { attributes: true, subtree: true, childList: true, characterData: true });
		});
		
		const search = await Youtube.search(query);
		for(let video of search) {
			const videoRenderable = new YoutubeVideo({video});
			videoRenderable.renderTo(videosContainer);
		}
		
		videosContainer.classList.remove("videos-app-video-grid-is-loading");
		
		return tab;
	}
	
	async addSearchTab() {
		const tab = this.tabbed.createTab({icon: "bi-search", id: "search", name: "Search"}).render();
		new Scrollable(tab);
		
		const videosSearchBar = new HTML.div({class: "videos-app-search-bar base-pillbutton base-pillbutton-usertext"},
			"Search here..."
		);
		tab.append(videosSearchBar);
		let lastSearch = "";
		
		const videosContainer = new HTML.div({class: "videos-app-video-grid"});
		tab.append(videosContainer);
		
		new Interactable(videosSearchBar, {
			activate: async manager => {
				const query = await manager.Keyboard.ask({prompt: "Searching YouTube for...", currentInput: lastSearch});
				if(query == lastSearch || query == "") {
					return;
				}
				
				videosSearchBar.innerText = lastSearch = query;
				
				videosContainer.innerHTML = "";
				
				const loading = new LoadingScreen();
				loading.open();
				const search = await Youtube.search(query);
				loading.remove();
				
				for(let video of search) {
					const videoRenderable = new YoutubeVideo({video});
					videoRenderable.renderTo(videosContainer);
				}
			}
		})
	}
	
	static async getFeatured() {
		return await this.search("cat videos");
	}
	
	static async search(query) {
		
	}
	
	static async download(id, progress = percentage => {}) {
		if(!super.download(id, progress)) {
			return false;
		}
		
		const video = Youtube.download(id, percentage);
		
	}
}

export default YoutubeVideoSource;