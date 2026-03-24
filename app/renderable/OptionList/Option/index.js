import { HTML } from "imperative-html";
import Renderable from "../../../util/Renderable.js";

class Option extends Renderable {
	style = [...this.style, "app/renderable/OptionList/Option/main.css"];
	
	key = "";
	
	label = "";
	description = "";
	
	constructor(options = {}) {
		super();
		
		this.key = options.key;
		
		this.label = options.label ?? this.label;
		this.description = options.description ?? this.description;
	}
	
	render() {
		const element = super.render();
		element.classList.add("options-list-option");
		
		let label,
			description;
		
		element.append(
			new HTML.div({class: "options-list-option-details"},
				label = new HTML.div({class: "options-list-option-label"}),
				description = new HTML.div({class: "options-list-option-description"})
			),
			new HTML.div({class: "options-list-option-value"})
		)
		
		label.innerText = this.label;
		description.innerText = this.description;
		
		return element;
	}
	
}

export default Option;