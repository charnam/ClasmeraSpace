
class Tabbed {
	element = null;
	
	constructor(element, details) {
		this.element = element;
	}
	
	setTab(id) {
		for(let child of this.element.children) {
			if(child.getAttribute("tabid") == id) {
				child.classList.add("visible-tab");
			} else {
				child.classList.remove("visible-tab");
			}
		}
	}
	
}

export default Tabbed;