import { HTML } from "imperative-html";
import Overlay from "../../../app/renderable/Overlay/index.js";
import Interactable from "../../../app/util/Interactable.js";

class MainMenu extends Overlay {
	render() {
		const overlay = super.render();
		
		let closeButton;
		overlay.append(
			new HTML.div({class: "base-header"}, 
				closeButton = new HTML.div({class: "base-pillbutton bi-x-lg"})
			)
		)
		
		new Interactable(closeButton, {
			activate: () => {
			}
		});
		
		return overlay;
	}
}

export default MainMenu;