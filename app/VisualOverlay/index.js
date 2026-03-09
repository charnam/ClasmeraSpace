import SoundManager from "../util/SoundManager.js";
import Overlay from "../Overlay/index.js";

class VisualOverlay extends Overlay {
	style = [...this.style, "VisualOverlay/main.css"];
	animateDisappearDuration = 1000;
	
	static sounds = new SoundManager("app/sounds/ui", {
		"open": "overlay-open.wav",
		"close": "overlay-close.wav",
	});
	
	render() {
		const overlay = super.render();
		overlay.classList.add("visual-overlay");
		VisualOverlay.sounds.playSound("open", 0.2);
		return overlay;
	}
	
	async remove() {
		VisualOverlay.sounds.playSound("close", 0.2);
		await super.remove();
	}
}

export default VisualOverlay;