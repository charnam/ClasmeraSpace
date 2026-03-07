import Interactions from "../util/Interactions.js";
import InteractionLayer from "../util/InteractionLayer.js";
import SingleInstanceRenderable from "../util/SingleInstanceRenderable.js";

class Overlay extends SingleInstanceRenderable {
	style = "Overlay/main.css";
	layer = new InteractionLayer();
	
	constructor() {
		super();
		this.renderTo(document.getElementById("root"));
	}
	
	render() {
		const overlay = super.render();
		overlay.classList.add("overlay");
		this.layer.element = overlay;
		Interactions.addLayer(this.layer);
		return overlay;
	}
	
	remove() {
		super.remove();
		Interactions.removeLayer(this.layer);
	}
	
	static fromRenderable(renderable) {
		const overlay = new this();
		const child = renderable.renderTo(overlay.element);
		return {
			overlay: overlay,
			child
		}
	}
}

export default Overlay;