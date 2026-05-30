import { HTML } from "imperative-html";
import Interactable from "../../../app/util/Interactable.js";
import VisualOverlay from "../../../app/renderable/VisualOverlay/index.js";

class ConnectMenu extends VisualOverlay {
	style = this.autoStyleByImport(import.meta.url);
	
	callback() {};
	constructor(details = {}) {
		super();
		this.callback = details.callback ?? this.callback;
	}
	
	render() {
		const overlay = super.render();
		
		let input,
			button;
		
		overlay.append(
			new HTML.div({class: "connect-menu"},
				new HTML.div({class: "connect-menu-connect-title"}, "Check the other device for a code, and then press the Submit button to continue."),
				input = new HTML.input({class: "connect-menu-connect-input", placeholder: "Enter PIN here..."}),
				button = new HTML.div({class: "base-button"}, "Submit")
			)
		);
		
		new Interactable(button, {
			activate: () => {
				if(input.value.length > 0) {
					this.callback(input.value);
					this.remove();
				}
			}
		})
		
		return overlay;
	}
	
	static getPIN() {
		return new Promise(res => {
			const menu = new ConnectMenu({
				callback: res
			});
			menu.open();
		})
	}
	
}

export default ConnectMenu;