import { HTML } from "imperative-html";
import Interactable from "../../util/Interactable.js";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";
import VisualOverlay from "../VisualOverlay/index.js";

class OverlayMenu extends SingleInstanceRenderable {
	title = "";
	menu = [];
	style = [...this.style, "app/renderable/OverlayMenu/main.css"];
	allowCancel = true;
	
	constructor(options = {}) {
		super();
		this.title = options.title ?? null;
		this.menu = options.menu;
		this.allowCancel = options.allowCancel ?? true;
		this.cancelCallback = options.cancelCallback ?? (() => {});
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
				roles: ["BASE_BACK"],
				activate: () => {
					this.overlay.remove();
					this.cancelCallback();
				}
			});
			
			menuEl.append(menuItemEl);
		}
		
		return menuEl;
	}
	
	static ask(details) {
		return new Promise((res, thrw) => {
			new OverlayMenu({
				...details,
				menu: (details.menu ?? []).map(item => ({
					...item,
					callback: () => res(item.value)
				})),
				cancelCallback: () => thrw("Cancelled")
			}).open();
		});
	}
}

export default OverlayMenu;