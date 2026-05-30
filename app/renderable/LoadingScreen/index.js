import { HTML } from "imperative-html";
import VisualOverlay from "../VisualOverlay/index.js";
import Interactions from "../../util/Interactions.js";

class LoadingScreen extends VisualOverlay {
	style = this.autoStyleByImport(import.meta.url);
	enableSounds = false;
	
	loadTimeout = null;
	
	render() {
		const parent = super.render();
		parent.append(
			new HTML.div({class: "bi-arrow-clockwise loading-screen-icon"})
		)
		return parent;
	}
	
	openIn(timeout) {
		this.open();
		this.element.classList.add("base-hidden");
		this.loadTimeout = setTimeout(() => this.element.classList.remove("base-hidden"), timeout);
	}
	
	open() {
		if(this.loadTimeout) {
			clearTimeout(this.loadTimeout);
		}
		return super.open();
	}
	remove() {
		clearTimeout(this.loadTimeout);
		this.loadTimeout = null;
		return super.remove();
	}
	
}

export default LoadingScreen;