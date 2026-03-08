import Renderable from "./Renderable.js";

class SingleInstanceRenderable extends Renderable {
	
	animateDisappearDuration = 0;
	
	get element() {
		return this.boundTo[0];
	}
	
	render() {
		if(this.element) {
			throw new Error("Attempted to re-render SingleInstanceRenderable, " + this.constructor.name);
		}
		return super.render();
	}
	
	async beforeRemove() {
		if(this.element) {
			this.element.classList.add("disappear-animation")
			await new Promise(res => setTimeout(res, this.animateDisappearDuration));
		}
	}
	
	async remove() {
		if(this.element) {
			await this.element.beforeRemove();
			this.element.remove();
			this.collectGarbageBoundNodes();
		}
	}
	
}

export default SingleInstanceRenderable;