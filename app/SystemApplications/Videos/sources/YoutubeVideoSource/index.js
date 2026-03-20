import { HTML } from "imperative-html";
import Youtube from "../../../../util/system/ipcModules/Youtube.js";
import VideoSource from "../VideoSource/index.js";
import Interactable from "../../../../util/Interactable.js";
import DownloadPage from "../../DownloadPage/index.js";
import format_timestamp from "../../../../util/simple/format_timestamp.js";
import LoadingScreen from "../../../../renderable/LoadingScreen/index.js";
import Registry from "../../../../util/system/Registry.js";
import VideoPlayer from "../../../../renderable/VideoPlayer/index.js";
import Blobs from "../../../../util/system/Blobs.js";

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
				new HTML.div(
					{
						class: "videos-app-video-thumbnail",
						style: `background-image: url("${video.thumbnail}")`
					},
					new HTML.div({class: "videos-app-video-duration"},
						format_timestamp(video.duration)
					)
				),
				new HTML.div({class: "videos-app-video-details"},
					videoTitle = new HTML.div({class: "videos-app-video-title"}),
					videoAuthorName = new HTML.div({class: "videos-app-video-author-name"})
				)
			)
			
			videoTitle.innerText = video.title;
			videoAuthorName.innerText = video.author?.name;
			
			new Interactable(videoEl, {
				activate: async () => {
					const loading = new LoadingScreen();
					
					loading.open();
					const fullVideo = await Youtube.info(video.id)
					loading.remove();
					
					const page = new DownloadPage({
						video: fullVideo,
						download: async (progress) => {
							const details = await Youtube.getVideo(video.id, progress);
							
							if(document.body.contains(page.element)) {
								const player = new VideoPlayer({
									title: details.title,
									author: details.author.name,
									blob: await Blobs.get(details.blob)
								});
								player.open();
							}
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