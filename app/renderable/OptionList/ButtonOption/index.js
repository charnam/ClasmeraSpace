import { HTML } from "imperative-html";
import Option from "../Option/index.js";
import Interactable from "../../../util/Interactable.js";

class ButtonOption extends Option {
	style = [...this.style, "app/renderable/OptionList/ButtonOption/main.css"];
	
	buttonText = "Activate";
	activate() {}
	
	constructor(details) {
		super(details);
		this.buttonText = details.buttonText ?? this.buttonText;
		this.activate = details.activate ?? this.activate;
	}
	
	render() {
		const element = super.render();
		element.classList.add("options-list-option-button");
		
		const value = element.querySelector(".options-list-option-value");
		
		let button;
		value.append(
			button = new HTML.div({class: "options-list-option-value-button base-button"}, this.buttonText)
		);
		
		new Interactable(button, {
			activate: this.activate
		});
		
		this.updateRendered(element);
		
		return element;
	}
	
}

export default ButtonOption;
