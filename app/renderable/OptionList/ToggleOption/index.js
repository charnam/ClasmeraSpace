import { HTML } from "imperative-html";
import Option from "../Option/index.js";
import Interactable from "../../../util/Interactable.js";

class ToggleOption extends Option {
	style = [...this.style, "app/renderable/OptionList/ToggleOption/main.css"];
	
	enabled = {
		icon: "",
		text: "Enabled"
	};
	disabled = {
		icon: "",
		text: "Disabled"
	};
	
	constructor(details) {
		super(details);
		if(details.enabled) {
			this.enabled = details.enabled;
		}
		if(details.disabled) {
			this.disabled = details.disabled;
		}
	}
	
	render() {
		const element = super.render();
		element.classList.add("options-list-option-toggle");
		
		const value = element.querySelector(".options-list-option-value");
		
		let button;
		value.append(
			button = new HTML.div({class: "options-list-option-toggle-button base-button"},
				"Loading..."
			)
		)
		
		new Interactable(button, {
			activate: async () => {
				element.classList.add("options-list-option-loading");
				await this.setValue(!await this.getValue());
				element.classList.remove("options-list-option-loading");
			}
		})
		
		this.updateRendered(element);
		
		return element;
	}
	
	async updateRendered(el) {
		const button = el.querySelector(".options-list-option-toggle-button");
		const value = await this.getValue();
		
		if(this.enabled.icon) {
			button.classList.remove(this.enabled.icon);
		}
		if(this.disabled.icon) {
			button.classList.remove(this.disabled.icon);
		}
		if(value) {
			
			if(this.enabled.icon) {
				button.classList.add(this.enabled.icon);
			}
			button.innerText = this.enabled.text;
		} else {
			
			if(this.disabled.icon) {
				button.classList.add(this.disabled.icon);
			}
			button.innerText = this.disabled.text;
		}
		
	}
	
}

export default ToggleOption;
