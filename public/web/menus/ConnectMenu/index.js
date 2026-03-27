import { HTML } from "imperative-html";
import Overlay from "../../../app/renderable/Overlay/index.js";
import Dialog from "../../../app/renderable/Dialog/index.js";
import Interactable from "../../../app/util/Interactable.js";

class ConnectMenu extends Overlay {
	callback() {};
	constructor(details = {}) {
		this.callback = details.callback ?? this.callback;
	}
	
	render() {
		const overlay = super.render();
		
		let input,
			button;
		
		overlay.append(
			new HTML.div({class: "connect-menu"},
				new HTML.div({class: "connect-menu-connect-title"}, "Enter the PIN as displayed on your device, and then press the Submit button to continue."),
				input = new HTML.input({class: "connect-menu-connect-input", placeholder: ""}),
				button = new HTML.div({class: "base-button"}, "Submit")
			)
		);
		
		new Interactable(button, {
			activate: () => {
			}
		})
		
		return overlay;
	}
	
	static async connectToServer() {
		const menu = new ConnectMenu();
		
		await Dialog.ask({
			prompt: "When you're ready, click the button, and a PIN will be displayed on the connecting device.",
			buttons: {
				text: "Generate PIN",
				value: null
			}
		})
		
		menu.open();
		
		
	}
}

export default ConnectMenu;