import { HTML } from "imperative-html";
import Youtube from "../../../../util/system/ipcModules/Youtube.js";
import VideoSource from "../VideoSource/index.js";
import Interactable from "../../../../util/Interactable.js";
import DownloadPage from "../../DownloadPage/index.js";

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
			
			let videoTitle,
				videoAuthorName;
			
			const videoEl = new HTML.div({class: "base-pillbutton videos-app-video"},
				new HTML.img({
					class: "videos-app-video-thumbnail",
					src: video.thumbnail
				}),
				new HTML.div({class: "videos-app-video-details"},
					videoTitle = new HTML.div({class: "videos-app-video-title"}),
					videoAuthorName = new HTML.div({class: "videos-app-video-author-name"})
				)
			)
			
			videoTitle.innerText = video.title;
			videoAuthorName.innerText = video.author?.name;
			
			new Interactable(videoEl, {
				activate: () => {
					const page = new DownloadPage({
						video,
						download: async (progress) => {
							const blob = await Youtube.downloadBlob(video.id, progress);
						}
					});
					page.open();
				}
			})
			
			videosContainer.append(videoEl)
		}
		
		tab.append(videosContainer);
	}
	
	async addSearchTab() {
		
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