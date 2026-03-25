
class Tabbed {
	element = null;
	
	constructor(element) {
		this.element = element;
		element.classList.add("base-tabbed");
	}
	
	setTab(id) {
		let hasPassedTab = false;
		for(let child of this.element.children) {
			if(child.getAttribute("tabid") == id) {
				child.classList.remove("base-tabbed-tab-before-passed");
				child.classList.remove("base-tabbed-tab-after-passed");
				child.classList.add("base-tabbed-visible-tab");
				hasPassedTab = true;
			} else {
				if(!hasPassedTab) {
					child.classList.remove("base-tabbed-tab-before-passed");
					child.classList.add("base-tabbed-tab-after-passed");
				} else {
					child.classList.remove("base-tabbed-tab-after-passed");
					child.classList.add("base-tabbed-tab-before-passed");
				}
				child.classList.remove("base-tabbed-visible-tab");
			}
		}
	}
	
}

export default Tabbed;