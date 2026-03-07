import { HTML } from "imperative-html";

class Renderable {
	boundTo = [];
	
	constructor() {
		setInterval(() => {
			this.collectGarbageBoundNodes();
		}, 1000);
	}
	
	render(target) {
		const thisStyle = "./app/"+this.style
		const styleElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
		
		if(![...styleElements].some(element => element.href == thisStyle)) {
			const link = new HTML.link({rel: "stylesheet", href: thisStyle});
			document.head.appendChild(link);
		}
		
		const renderedElement = new HTML.div({class: "component"});
		target.appendChild(renderedElement);
		return renderedElement;
	}
	
	collectGarbageBoundNodes() {
		for(let item of this.boundTo) {
			if(!document.contains(item)) {
				this.boundTo = this.boundTo.filter(test => test !== item);
			}
		}
	}
}

export default Renderable;