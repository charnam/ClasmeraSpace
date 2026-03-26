import Renderable from "../../util/Renderable.js";

class OptionList extends Renderable {
	style = [...this.style, "app/renderable/OptionList/main.css"];
	options = [];
	
	constructor(options = []) {
		super();
		this.options = options;
	}
	
	render() {
		const listEl = super.render();
		listEl.classList.add("option-list");
		
		for(let option of this.options) {
			if(option instanceof Renderable) {
				option.renderTo(listEl);
			}
			if(option instanceof Element) {
				listEl.append(option);
			}
		}
		
		return listEl;
	}
}

export default OptionList;