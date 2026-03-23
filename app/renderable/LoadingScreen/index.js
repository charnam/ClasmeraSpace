import { HTML } from "imperative-html";
import VisualOverlay from "../VisualOverlay/index.js";

class LoadingScreen extends VisualOverlay {
	style = [...this.style, "app/renderable/LoadingScreen/main.css"];
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
		this.loadTimeout = setTimeout(() => this.open(), timeout);
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