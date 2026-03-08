import Interactions from "../util/Interactions.js";
import InteractionLayer from "../util/InteractionLayer.js";
import SingleInstanceRenderable from "../util/SingleInstanceRenderable.js";

class Overlay extends SingleInstanceRenderable {
	style = [...this.style, "Overlay/main.css"];
	layer = new InteractionLayer();
	
	animateDisappearDuration = 1000;
	
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
	
	async remove() {
		Interactions.removeLayer(this.layer);
		await super.remove();
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