import { HTML } from "imperative-html";

class Renderable {
	static _all_renderable_instances = [];
	
	static get instances() {
		return this._all_renderable_instances.filter(instance => instance instanceof this);
	}
	
	static updateInstances() {
		return Promise.all(this.instances.map(instance => instance.update()));
	}
	
	style = [];
	boundTo = [];
	
	constructor() {
		setInterval(() => {
			if(this.boundTo.length > 0) {
				this.collectGarbageBoundNodes();
			}
		}, 1000);
		
		this.constructor._all_renderable_instances.push(this);
	}
	
	renderTo(target) {
		const rendered = this.render();
		target.appendChild(rendered);
		return rendered;
	}
	
	render() {
		const renderedElement = new HTML.div({class: "component base-system-hidden"});
		Promise.all(this.style.map(style => this.loadStyle(style))).then(() => {
			renderedElement.classList.remove("base-system-hidden");
		})
		
		this.boundTo.push(renderedElement);
		return renderedElement;
	}
	
	path(url, filename) {
		const split = url.split("/");
		split.pop();
		const basedir = split.join("/");
		return basedir+"/"+filename;
	}
	
	autoStyleByImport(url, file = "main.css") {
		return [...this.style, this.path(url, file)];
	}
	
	async loadStyle(style) {
		await new Promise(res => {
			const thisStyle = style;
			const styleElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
			
			if(![...styleElements].some(element => element.getAttribute("href") == thisStyle)) {
				const link = new HTML.link({rel: "stylesheet", href: thisStyle});
				document.head.appendChild(link);
				link.onload = link.onerror = () => res();
			} else {
				res();
			}
			
		})
		
		document.body.scrollWidth;
	}
	
	updateRendered(element) {
		
	}
	
	update() {
		let promises = [];
		for(let item of this.boundTo) {
			if(document.contains(item)) {
				promises.push(this.updateRendered(item));
			}
		}
		return Promise.all(promises);
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