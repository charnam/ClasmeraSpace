import Renderable from "./Renderable.js";

class SingleInstanceRenderable extends Renderable {
	
	get element() {
		return this.boundTo[0];
	}
	
	render() {
		if(this.element) {
			throw new Error("Attempted to re-render SingleInstanceRenderable, " + this.constructor.name);
		}
		return super.render();
	}
	
	remove() {
		if(this.element) {
			this.element.remove();
			this.collectGarbageBoundNodes();
		}
	}
	
}

export default SingleInstanceRenderable;