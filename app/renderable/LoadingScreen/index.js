import { HTML } from "imperative-html";
import VisualOverlay from "../VisualOverlay/index.js";

class LoadingScreen extends VisualOverlay {
	style = [...this.style, "app/renderable/LoadingScreen/main.css"];
	enableSounds = false;
	
	render() {
		const parent = super.render();
		parent.append(
			new HTML.div({class: "bi-arrow-clockwise loading-screen-icon"})
		)
		return parent;
	}
}

export default LoadingScreen;