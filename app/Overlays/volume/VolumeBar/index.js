import { HTML } from "imperative-html";
import SingleInstanceRenderable from "../../../util/SingleInstanceRenderable.js";
import Interactions from "../../../util/Interactions.js";

class VolumeBar extends SingleInstanceRenderable {
	style = [...this.style, "app/Overlays/volume/VolumeBar/style.css"];
	
	render() {
		const element = super.render();
		element.classList.add("volume-bar")
		element.classList.add("has-been-hidden")
		return element;
	}
	
	lastVolumeChange = 0;
	updateRendered(el) {
		el.setAttribute("class", [...el.classList].filter(c => !c.includes("bi-")).join(" "));
		if(this.volume >= 20) {
			el.classList.add("bi-volume-up-fill");
		} else if(this.volume >= 1) {
			el.classList.add("bi-volume-down-fill");
		} else {
			el.classList.add("bi-volume-mute-fill");
		}
		
		el.setAttribute("style", `--volume: ${this.volume / 100};`);
		
		const volumeUpPressed = Interactions.hasPressedInput("BASE_VOLUME_UP");
		const volumeDownPressed = Interactions.hasPressedInput("BASE_VOLUME_DOWN");
		
		if(volumeUpPressed) {
			el.classList.add("has-pressed-volume-up");
		} else {
			el.classList.remove("has-pressed-volume-up");
		}
		if(volumeDownPressed) {
			el.classList.add("has-pressed-volume-down");
		} else {
			el.classList.remove("has-pressed-volume-down")
		}
		
		if(volumeDownPressed || volumeUpPressed) {
			this.lastVolumeChange = Date.now();
		}
		
		if(this.lastVolumeChange < Date.now() - 3000) {
			el.classList.add("has-been-hidden");
		} else {
			el.classList.remove("has-been-hidden");
		}
	}
	
}

export default VolumeBar;