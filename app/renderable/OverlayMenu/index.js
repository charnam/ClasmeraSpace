import { HTML } from "imperative-html";
import Interactable from "../../util/Interactable.js";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";
import VisualOverlay from "../VisualOverlay/index.js";

class OverlayMenu extends SingleInstanceRenderable {
	menu = [];
	style = [...this.style, "app/renderable/OverlayMenu/main.css"];
	allowCancel = true;
	
	constructor(options = {}) {
		super();
		if(options.title) {
			this.title = options.title;
		}
		if(options.menu) {
			this.menu = options.menu;
		}
	}
	
	open() {
		this.overlay = VisualOverlay.wrapRenderable(this).overlay;
	}
	
	render() {
		const menuEl = super.render();
		menuEl.classList.add("base-popup");
		menuEl.classList.add("overlay-menu");
		
		for(let item of this.menu) {
			const menuItemEl = new HTML.div({class: "base-button overlay-menu-item"})
			menuItemEl.innerText = item.text
			
			new Interactable(menuItemEl, {
				activate: (...args) => {
					this.overlay.remove();
					item.callback(...args);
				}
			});
			
			menuEl.append(menuItemEl);
		}
		
		if(this.allowCancel) {
			const menuItemEl = new HTML.div({class: "base-button overlay-menu-item"})
			menuItemEl.innerText = "Cancel"
			
			new Interactable(menuItemEl, {
				activate: () => {
					this.overlay.remove();
				}
			});
			
			menuEl.append(menuItemEl);
		}
		
		return menuEl;
	}
	
}

export default OverlayMenu;