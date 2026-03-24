import Renderable from "../../util/Renderable.js";

class OptionList extends Renderable {
	style = [...this.style, "app/renderable/OptionList/main.css"];
	options = [];
	
	constructor(options = []) {
		this.options = options;
	}
	
	render() {
		const listEl = super.render();
		listEl.classList.add("option-list");
		
		for(let option of this.options) {
			option.renderTo(listEl);
		}
		
		return listEl;
	}
}

export default OptionList;