import { HTML } from "imperative-html";
import Option from "../Option/index.js";

class ToggleOption extends Option {
	style = [...this.style, "app/renderable/OptionList/ToggleOption/main.css"];
	
	enabled = {
		text: "Enabled"
	};
	disabled = {
		text: "Disabled"
	};
	
	constructor(details) {
		super(details);
	}
	
	render() {
		const element = super.render();
		const value = element.querySelector(".options-list-option-value");
		
		let button;
		value.append(
			button = new HTML.div({class: "options-list-option-value-toggle base-button"})
		)
		
		//button.classList.add("bi-feather");
		button.innerText = "Loading...";
		
		this.updateRendered(element);
		
		return element;
	}
	
	async updateRendered(el) {
		const value = element.querySelector(".options-list-option-value-toggle");
		
		
	}
	
}

export default ToggleOption;
