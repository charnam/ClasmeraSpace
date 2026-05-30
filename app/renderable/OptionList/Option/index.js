import { HTML } from "imperative-html";
import Renderable from "../../../util/Renderable.js";
import Registry from "../../../util/system/Registry.js";

class Option extends Renderable {
	style = this.autoStyleByImport(import.meta.url);
	
	key = "";
	default = null;
	
	label = "";
	description = "";
	
	onchange = () => {}
	
	constructor(options = {}) {
		super();
		
		this.key = options.key;
		this.default = options.default;
		
		this.label = options.label ?? this.label;
		this.description = options.description ?? this.description;
		
		this.onchange = options.onchange ?? this.onchange;
	}
	
	render() {
		const element = super.render();
		element.classList.add("options-list-option");
		element.classList.add("options-list-option-loading");
		
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
	
	async getValue() {
		return await Registry.getKey(this.key, this.default);
	}
	
	async setValue(value) {
		await Registry.setKey(this.key, value);
		await this.update();
		this.onchange();
	}
	
}

export default Option;