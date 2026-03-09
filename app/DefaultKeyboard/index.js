import { HTML } from "imperative-html";
import Interactable from "../util/Interactable.js";
import Keyboard from "../Keyboard/index.js";

class DefaultKeyboard extends Keyboard {
	static lowerKeys = [
		"1234567890",
		"qwertyuiop",
		"asdfghjkl;",
		"zxcvbnm,./"
	];
	static upperKeys = [
		"!@#$%&-_()",
		"QWERTYUIOP",
		"ASDFGHJKL:",
		"ZXCVBNM\"'?"
	];
	
	style = [...this.style, "DefaultKeyboard/main.css"];
	inCapsMode = false;
	
	render() {
		const keyboardEl = super.render();
		keyboardEl.classList.add("popup-default");
		keyboardEl.classList.add("keyboard-default");
		
		let keyboardPrompt,
			keyboardInput,
			keyboardAreas;
		
		keyboardEl.append(
			keyboardPrompt = new HTML.div({class: "keyboard-default-prompt"}),
			keyboardInput = new HTML.input({type: "text", class: "keyboard-default-input"}),
			keyboardAreas = new HTML.div({class: "keyboard-default-areas"})
		)
		
		keyboardPrompt.innerText = this.prompt;
		keyboardInput.value = this.currentInput;
		
		this.renderKeys(keyboardAreas);
		
		return keyboardEl;
	}
	
	updateRendered(element) {
		const keyboardInput = element.querySelector(".keyboard-default-input");
		
		if(this.currentInput !== keyboardInput.value) {
			keyboardInput.value = this.currentInput;
		}
		
		const rows = this.inCapsMode ? this.constructor.upperKeys : this.constructor.lowerKeys;
		
		const keyElements = element.querySelectorAll(".keyboard-default-key-main");
		for(let key of keyElements) {
			key.innerText = rows[key.getAttribute("row")][key.getAttribute("column")];
		}
		
		if(this.inCapsMode) {
			element.querySelector(".keyboard-caps-button").setAttribute("is-caps", "");
		} else {
			element.querySelector(".keyboard-caps-button").removeAttribute("is-caps");
		}
	}
	
	renderKeys(areasEl) {
		areasEl.innerHTML = "";
		const keys = this.constructor.lowerKeys;
		
		let mainKeysArea,
			leftKeysArea,
			rightKeysArea,
			bottomKeysArea;
		
		areasEl.append(
			mainKeysArea = new HTML.div({class: "keyboard-default-area-rows"}),
			leftKeysArea = new HTML.div({class: "keyboard-default-area-left"}),
			rightKeysArea = new HTML.div({class: "keyboard-default-area-right"}),
			bottomKeysArea = new HTML.div({class: "keyboard-default-area-bottom"}),
		);
		
		let leftKey,
			rightKey,
			extKeyLeft,
			extKeyRight,
			capsKey,
			doneKey;
		
		leftKeysArea.append(
			leftKey = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-side"}, "Left"),
			extKeyLeft = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-side disabled"}, "..."),
			capsKey = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-side keyboard-caps-button"}, "Caps")
		);
		
		rightKeysArea.append(
			rightKey = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-side"}, "Right"),
			extKeyRight = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-side disabled"}, "..."),
			doneKey = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-side"}, "Done")
		);
		
		new Interactable(leftKey, {
			preactivate: () => {
				
			}
		});
		new Interactable(rightKey, {
			preactivate: () => {
				
			}
		});
		
		new Interactable(capsKey, {
			activate: () => {
				this.inCapsMode = !this.inCapsMode;
				this.update();
			}
		});
		
		new Interactable(doneKey, {
			activate: () => {
				this.close();
				this.whenFinished();
			}
		});
		
		for(let keyRowIndex in keys) {
			const keyRow = keys[keyRowIndex];
			const keyRowEl = new HTML.div({class: "keyboard-default-row"});
			for(let keyColumnIndex in keyRow) {
				const keyValue = keyRow[keyColumnIndex];
				
				const keyEl = new HTML.div({
					class: "base-button keyboard-default-key keyboard-default-key-main",
					row: keyRowIndex,
					column: keyColumnIndex
				});
				keyEl.innerText = keyValue;
				keyRowEl.appendChild(keyEl);
				
				new Interactable(keyEl, {
					preactivate: () => {
						this.currentInput += keyEl.innerText;
						if(this.inCapsMode) {
							this.inCapsMode = false;
						}
						this.update();
					}
				})
			}
			
			mainKeysArea.appendChild(keyRowEl);
		}
		
		let spaceKey,
			backspaceKey;
		
		bottomKeysArea.append(
			spaceKey = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-bottom"}, "Space"),
			backspaceKey = new HTML.div({class: "base-button keyboard-default-key keyboard-default-key-bottom"}, "Backspace"),
		);
		
		new Interactable(spaceKey, {
			preactivate: () => {
				this.currentInput += " ";
				this.update();
			}
		});
		new Interactable(backspaceKey, {
			preactivate: () => {
				this.currentInput = this.currentInput.slice(0,-1);
				this.update();
			}
		});
		
	}
	
}

export default DefaultKeyboard;