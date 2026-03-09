import Interactions from "../util/Interactions.js";
import SingleInstanceRenderable from "../util/SingleInstanceRenderable.js";
import VisualOverlay from "../VisualOverlay/index.js";

class Keyboard extends SingleInstanceRenderable {
	prompt = "";
	currentInput = "";
	whenFinished() {}
	
	overlay = null;
	
	constructor(details = {}) {
		super();
		
		if(details.currentInput) {
			this.currentInput = details.currentInput;
		}
		if(details.prompt) {
			this.prompt = details.prompt;
		}
		if(details.whenFinished) {
			this.whenFinished = details.whenFinished;
		}
	}
	
	render() {
		const keyboard = super.render();
		keyboard.classList.add("keyboard");
		return keyboard;
	}
	
	open() {
		this.overlay = VisualOverlay.wrapRenderable(this).overlay;
	}
	close() {
		Interactions.removeLayer(this.overlay.layer);
		this.overlay.remove();
	}
	
	static async ask(details) {
		return new Promise(res => {
			const keyboard = new this({
				...details,
				whenFinished: () => res(keyboard.currentInput)
			});
			keyboard.open();
		})
	}
}

export default Keyboard;