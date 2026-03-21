import { HTML } from "imperative-html";
import Youtube from "../../../../util/system/ipcModules/Youtube.js";
import VideoSource from "../VideoSource/index.js";
import YoutubeVideo from "./YoutubeVideo/index.js";
import Interactable from "../../../../util/Interactable.js";
import LoadingScreen from "../../../../renderable/LoadingScreen/index.js";

class YoutubeVideoSource extends VideoSource {
	static name = "YouTube";
	
	render() {
		const el = super.render();
		
		this.addFeaturedTab(el);
		this.addSearchTab(el);
		
		return el;
	}
	
	async addFeaturedTab(parent) {
		const tab = this.addTab("bi-feather", "featured", parent);
		
		const videosContainer = new HTML.div({class: "videos-app-video-grid"});
		
		const search = await Youtube.search("cat videos");
		for(let video of search) {
			const videoRenderable = new YoutubeVideo({video});
			videoRenderable.renderTo(videosContainer);
		}
		
		tab.append(videosContainer);
	}
	
	async addSearchTab(parent) {
		const tab = this.addTab("bi-search", "search", parent);
		
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
	
	static async renderVideo(video, target) {
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