import { HTML } from "imperative-html";
import PasscodeInput from "../PasscodeInput/index.js";
import Interactable from "../../util/Interactable.js";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";

class DefaultPasscodeInput extends PasscodeInput {
	static Dot = class Dot extends SingleInstanceRenderable {
		animateDisappearDuration = 500;
		render() {
			const dot = super.render();
			dot.classList.add("default-passcode-input-dot");
			return dot;
		}
	}
	
	style = [...this.style, "app/renderable/DefaultPasscodeInput/main.css"];
	_dots = [];
	
	render() {
		const container = super.render();
		container.classList.add("default-passcode-input-container")
		
		let buttons;
		
		container.append(
			new HTML.div({class: "default-passcode-input-prompt"}),
			new HTML.div({class: "default-passcode-input-main"},
				new HTML.div({class: "default-passcode-input-dots"}),
				buttons = new HTML.div({class: "default-passcode-input-buttons"})
			)
		)
		
		const doneButton = new HTML.div({class: "default-passcode-input-button default-passcode-input-button-done bi-check"});
		buttons.append(doneButton);
		new Interactable(doneButton, {
			activate: async () => {
				if(this.currentInput.length == 0 || await this.checkPassword()) {
					this.finish();
				} else {
					this.currentInput = "";
					container.classList.add("incorrect");
				}
			}
		})
		
		for(let i = 0; i < 10; i++) {
			const button = new HTML.div({class: "default-passcode-input-button default-passcode-input-button-"+i}, i);
			buttons.append(button);
			
			new Interactable(button, {
				roles: ["DEFAULT_KEYBOARD_KEY_"+i],
				preactivate: () => {
					this.currentInput += String(i);
					this.update();
				}
			})
		}
		
		const backspaceButton = new HTML.div({class: "default-passcode-input-button default-passcode-input-button-backspace bi-backspace-fill"});
		buttons.append(backspaceButton);
		new Interactable(backspaceButton, {
			roles: ["DEFAULT_KEYBOARD_KEY_BACKSPACE"],
			preactivate: () => {
				this.currentInput = this.currentInput.slice(0, -1);
				this.update();
			}
		})
		
		
		
		this.updateRendered(container);
		return container;
	}
	
	async updateRendered(el) {
		el.classList.remove("incorrect");
		
		const prompt = el.querySelector(".default-passcode-input-prompt");
		const dots = el.querySelector(".default-passcode-input-dots");
		
		prompt.innerText = this.prompt;
		
		for(let index = 0; index < Math.max(this._dots.length, this.currentInput.length); index++) {
			const dot = this._dots[index];
			const digit = this.currentInput[index];
			
			if(!dot && typeof digit !== "undefined") {
				const dot = new this.constructor.Dot();
				this._dots.push(dot);
				dot.renderTo(dots);
			} else if(dot && typeof digit == "undefined") {
				dot.remove();
				dot.removing = true;
			}
		}
		
		this._dots = this._dots.filter((dot) => !dot.removing);
	}
	
}

export default DefaultPasscodeInput;
