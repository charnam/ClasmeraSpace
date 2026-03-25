import { HTML } from "imperative-html";
import Option from "../Option/index.js";
import Interactable from "../../../util/Interactable.js";
import LoadingScreen from "../../LoadingScreen/index.js";

class TextOption extends Option {
	style = [...this.style, "app/renderable/OptionList/TextOption/main.css"];
	
	buttonText = "Edit...";
	
	constructor(details) {
		super(details);
		this.prompt = details.prompt;
		this.buttonText = details.buttonText ?? this.buttonText;
	}
	
	render() {
		const element = super.render();
		element.classList.add("options-list-option-text");
		
		const value = element.querySelector(".options-list-option-value");
		
		let button;
		value.append(
			button = new HTML.div({class: "options-list-option-value-text base-button"}, this.buttonText)
		);
		
		new Interactable(button, {
			activate: async manager => {
				const loader = new LoadingScreen();
				loader.openIn(500);
				
				let value = await this.getValue();
				
				if(typeof value !== "string") {
					value = "";
				}
				
				loader.remove();
				
				await this.setValue(
					await manager.Keyboard.ask({
						prompt: this.prompt,
						currentInput: value
					})
				);
			}
		})
		
		this.updateRendered(element);
		
		return element;
	}
	
}

export default TextOption;
