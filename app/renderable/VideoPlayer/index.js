import { HTML } from "imperative-html";
import VisualOverlay from "../VisualOverlay/index.js";
import Interactable from "../../util/Interactable.js";
import formatTimestamp from "../../util/simple/formatTimestamp.js";
import Registry from "../../util/system/Registry.js";
import FocusManager from "../../util/FocusManager.js";
import Interactions from "../../util/Interactions.js";

class VideoPlayer extends VisualOverlay {
	style = [...this.style, "app/renderable/VideoPlayer/main.css"];
	
	title = undefined;
	author = undefined;
	
	loop = false;
	url = "";
	
	constructor(details = {}) {
		super();
		if(details.blob) {
			this.url = URL.createObjectURL(details.blob);
		}
		if(details.url) {
			this.url = details.url;
		}
		
		if(details.title) {
			this.title = details.title;
		}
		if(details.author) {
			this.author = details.author;
		}
		if(details.loop) {
			this.loop = details.loop;
		}
		
		if(details.timeKey) {
			this.timeKey = details.timeKey;
		}
		
		this.layer.music = "disabled";
	}
	
	render() {
		const overlay = super.render();
		
		let backEl,
			videoEl,
			skipBackEl,
			playPauseEl,
			skipForwardEl,
			playbarEl,
			currentTimeEl,
			durationEl,
			titleEl,
			authorEl;
		
		const videoPlayer = new HTML.div({class: "video-player"},
			videoEl = new HTML.video({class: "video-player-video", src: this.url, loop: this.loop}),
			new HTML.div({class: "video-player-overlay"},
				new HTML.div({class: "video-player-top-info"},
					new HTML.div({class: "video-player-top-title-wrapper"},
						backEl = new HTML.div({class: "bi-arrow-left base-pillbutton video-player-back"}),
						titleEl = new HTML.div({class: "video-player-top-title"})
					),
					authorEl = new HTML.div({class: "video-player-top-author"})
				),
				new HTML.div({class: "video-player-center-buttons"},
					skipBackEl = new HTML.div({class: "bi-arrow-left base-pillbutton video-player-center-button"}),
					playPauseEl = new HTML.div({class: "bi-play base-pillbutton video-player-center-button video-player-center-button-large"}),
					skipForwardEl = new HTML.div({class: "bi-arrow-right base-pillbutton video-player-center-button"})
				),
				new HTML.div({class: "video-player-playbar-wrapper"},
					currentTimeEl = new HTML.div({class: "video-player-time video-player-current-time"}),
					playbarEl = new HTML.div({class: "video-player-playbar"}),
					durationEl = new HTML.div({class: "video-player-time video-player-duration"}),
				)
			),
		);
		
		if(this.title) {
			titleEl.innerText = this.title;
		}
		if(this.author) {
			authorEl.innerText = this.author;
		}
		
		new Interactable(playPauseEl, {
			roles: ["PLAYER_PLAY_PAUSE", "PLAYER_PLAY", "PLAYER_PAUSE"],
			activate: () => {
				if(videoEl.paused) {
					videoEl.play();
				} else {
					videoEl.pause();
				}
			}
		});
		
		new Interactable(backEl, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		})
		
		new Interactable(skipBackEl, {
			roles: ["PLAYER_SKIP_BACK"],
			activate: () => {
				videoEl.currentTime -= 5;
			}
		});
		new Interactable(skipForwardEl, {
			roles: ["PLAYER_SKIP_FORWARD"],
			activate: () => {
				videoEl.currentTime += 5;
			}
		});
		
		const updatePlayButton = playing => {
			if(playing) {
				playPauseEl.classList.remove("bi-play");
				playPauseEl.classList.add("bi-pause");
			} else {
				playPauseEl.classList.remove("bi-pause");
				playPauseEl.classList.add("bi-play");
			}
		}
		
		let lastTimeUpdate = 0;
		const updateTimestamp = () => {
			if(document.body.contains(this.element)) {
				playbarEl.setAttribute("style", `--progress: ${videoEl.currentTime / videoEl.duration};`);
				
				currentTimeEl.innerText = formatTimestamp(videoEl.currentTime);
				durationEl.innerText = formatTimestamp(videoEl.duration);
				
				if(lastTimeUpdate < Date.now() - 10000) {
					lastTimeUpdate = Date.now();
					if(this.timeKey) {
						Registry.setKey(this.timeKey, videoEl.currentTime);
					}
				}
				
				for(let manager of Interactions.focusManagers) {
					if(manager.cursorIsActive || manager.isActive || videoEl.paused) {
						manager.addAttribute("video-player-osd", videoPlayer, false);
					} else {
						manager.clearAttribute("video-player-osd");
					}
				}
				
				updatePlayButton(!videoEl.paused);
				requestAnimationFrame(updateTimestamp);
			}
		}
		
		videoEl.onloadedmetadata = async () => {
			setTimeout(() => updateTimestamp(), 200);
			if(this.timeKey) {
				videoEl.currentTime = await Registry.getKey(this.timeKey, 0);
			}
		}
		
		videoPlayer.setAttribute("video-player-osd", "");
		
		overlay.append(videoPlayer);
		return overlay;
	}
}

export default VideoPlayer;