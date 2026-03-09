import Interactions from "../util/Interactions.js";
import InteractionLayer from "../util/InteractionLayer.js";
import SingleInstanceRenderable from "../util/SingleInstanceRenderable.js";

class Overlay extends SingleInstanceRenderable {
	style = [...this.style, "Overlay/main.css"];
	layer = new InteractionLayer();
	
	constructor() {
		super();
	}
	
	open() {
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
	
	static wrapRenderable(renderable) {
		const overlay = new this();
		overlay.open();
		overlay.element.classList.add("overlay-wrap");
		
		const child = renderable.renderTo(overlay.element);
		if(renderable instanceof SingleInstanceRenderable) {
			renderable._overlay = overlay;
		}
		
		return {
			overlay: overlay,
			child
		}
	}
}

export default Overlay;