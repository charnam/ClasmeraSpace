import { applyToElement, HTML } from "imperative-html";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";

class FocusManagerCursor extends SingleInstanceRenderable {
	style = [...this.style, "app/renderable/FocusManagerCursor/main.css"];
	
	x = 0;
	y = 0;
	xMov = 0;
	yMov = 0;
	
	active = false;
	
	render() {
		const cursorEl = super.render();
		cursorEl.classList.add("focus-manager-cursor", "bi-hand-index");
		return cursorEl;
	}
	
	updateRendered() {
		if(this.active) {
			this.element.classList.add("focus-manager-cursor-active")
		} else {
			this.element.classList.remove("focus-manager-cursor-active")
		}
		
		this.element.setAttribute("style", 
			`
			opacity: ${this.active ? 1 : 0};
			left: ${this.x}px;
			top: ${this.y}px;
			--transform: scaleY(${1 + this.yMov / 10}) rotate(${-this.xMov * 6}deg) scaleX(${1 - this.yMov / 10});
			`
		)
	}
}

export default FocusManagerCursor;