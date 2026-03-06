import { HTML } from "imperative-html";

class Renderable {
	boundTo = [];
	
	render(target) {
		const renderedElement = new HTML.div({class: "component"});
		target.appendChild(renderedElement);
		
		setInterval(() => {
			this.collectGarbageBoundNodes();
		}, 1000);
		
		return renderedElement;
	}
	
	collectGarbageBoundNodes() {
		for(let item of this.boundTo) {
			if(!item) {
				this.boundTo = this.boundTo.filter(test => test !== item);
			}
		}
	}
}

export default Renderable;