import { HTML } from "imperative-html";
import SingleInstanceRenderable from "../../../util/SingleInstanceRenderable.js";

class WebPINPrompt extends SingleInstanceRenderable {
	
	
	render() {
		const prompt = super.render();
		
		let pinEl;
		prompt.append(
			new HTML.div({class: "web-pin-prompt"},
				new HTML.div({class: "web-pin-prompt-title"}, "A device is trying to access Online Settings, but needs a PIN to continue.\n\nThe PIN is:"),
				pinEl = new HTML.div({class: "web-pin-prompt-pin"})
			)
		);
		
		pinEl.innerText = this.pin;
		
		return prompt;
	}
}

export default WebPINPrompt;