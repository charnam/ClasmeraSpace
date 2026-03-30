import Video from "../../../Video/index.js";
import LoadingScreen from "../../../../../renderable/LoadingScreen/index.js";
import VideoPlayer from "../../../../../renderable/VideoPlayer/index.js";
import Interactable from "../../../../../util/Interactable.js";
import Blobs from "../../../../../util/system/Blobs.js";
import Youtube from "../../../../../util/system/ipcModules/Youtube.js";
import DownloadPage from "../../../DownloadPage/index.js";
import downloadButtonProgress from "../../../../../util/simple/downloadButtonProgress.js";

class YoutubeVideo extends Video {
	render() {
		const videoEl = super.render();
		
		new Interactable(videoEl, {
			activate: async () => {
				const loading = new LoadingScreen();
				
				loading.open();
				const fullVideo = await Youtube.info(this.video.source_id)
				loading.remove();
				
				const page = new DownloadPage({
					video: fullVideo,
					buttons: [
						{
							text: "Download",
							icon: "bi-download",
							activate: async (_manager, button) => {
								if(button.classList.contains("progress")) return;
								
								const details = await Youtube.getVideo(this.video.source_id, progress => downloadButtonProgress(progress, button));
								
								if(document.body.contains(page.element)) {
									let timeKey = null;
									if(UserHome.currentUserId) {
										
									}
									
									const player = new VideoPlayer({
										title: details.title,
										author: details.author.name,
										blob: await Blobs.get(details.blob),
									});
									player.open();
									
									button.innerText = "Play";
									button.classList.remove("bi-download");
									button.classList.add("bi-play")
								}
							}
						}
					],
				});
				page.open();
			}
		})
		
		return videoEl;
	}
}

export default YoutubeVideo;