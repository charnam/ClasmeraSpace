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
			this.loadStyle(style);
		}
		
		const renderedElement = new HTML.div({class: "component"});
		this.boundTo.push(renderedElement);
		return renderedElement;
	}
	
	loadStyle(style) {
		const thisStyle = style;
		const styleElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
		
		if(![...styleElements].some(element => element.getAttribute("href") == thisStyle)) {
			const link = new HTML.link({rel: "stylesheet", href: thisStyle});
			document.head.appendChild(link);
		}
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