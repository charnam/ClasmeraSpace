import SoundManager from "../../util/SoundManager.js";
import Overlay from "../Overlay/index.js";

const sounds = new SoundManager("app/sounds/ui", {
	"open": "overlay-open.wav",
	"close": "overlay-close.wav",
});
sounds.onQuickSuccession = "use-last";

class VisualOverlay extends Overlay {
	style = this.autoStyleByImport(import.meta.url);
	animateDisappearDuration = 1000;
	
	enableSounds = true;
	
	static sounds = sounds;
	
	render() {
		const overlay = super.render();
		overlay.classList.add("visual-overlay");
		if(this.enableSounds) {
			VisualOverlay.sounds.playSound("open", 0.2);
		}
		return overlay;
	}
	
	async remove() {
		if(this.enableSounds) {
			VisualOverlay.sounds.playSound("close", 0.2);
		}
		await super.remove();
	}
}

export default VisualOverlay;