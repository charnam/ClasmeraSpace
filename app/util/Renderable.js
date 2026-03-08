import { HTML } from "imperative-html";

class Renderable {
	style = [];
	boundTo = [];
	
	constructor() {
		setInterval(() => {
			if(this.boundTo.length > 0) {
				this.collectGarbageBoundNodes();
			}
		}, 1000);
	}
	
	renderTo(target) {
		const rendered = this.render();
		target.appendChild(rendered);
		return rendered;
	}
	
	render() {
		for(let style of this.style) {
			const thisStyle = "./app/"+style
			const styleElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
			
			if(![...styleElements].some(element => element.href == thisStyle)) {
				const link = new HTML.link({rel: "stylesheet", href: thisStyle});
				document.head.appendChild(link);
			}
		}
		
		const renderedElement = new HTML.div({class: "component"});
		this.boundTo.push(renderedElement);
		return renderedElement;
	}
	
	updateRendered(element) {
		
	}
	
	update() {
		for(let item of this.boundTo) {
			if(document.contains(item)) {
				this.updateRendered(item);
			}
		}
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