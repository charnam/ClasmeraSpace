import { HTML } from "imperative-html";
import Interactable from "../../util/Interactable.js";
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
	
	// lowerKeys is used for naming
	static keyNames = {
		",": "COMMA",
		".": "DOT",
		"/": "SLASH",
		";": "SEMICOLON"
	};
	
	style = [...this.style, "app/renderable/DefaultKeyboard/main.css"];
	inCapsMode = false;
	cursorPosition = 0;
	get textBeforeCursor() {
		return this.currentInput.slice(0, this.cursorPosition);
	}
	set textBeforeCursor(value) {
		const originalValue = this.currentInput.slice(0,this.cursorPosition);
		this.currentInput = value + this.currentInput.slice(this.cursorPosition);
		this.cursorPosition += value.length - originalValue.length;
	}
	
	render() {
		const keyboardEl = super.render();
		keyboardEl.classList.add("base-popup");
		keyboardEl.classList.add("keyboard-default");
		
		let keyboardPrompt,
			keyboardInput,
			keyboardAreas;
		
		keyboardEl.append(
			keyboardPrompt = new HTML.div({class: "keyboard-default-prompt"}),
			keyboardInput = new HTML.div({class: "keyboard-default-input base-button"},
				new HTML.div({class: "keyboard-default-input-height-char"}, "M"),
				new HTML.div({class: "keyboard-default-input-before-cursor"}),
				new HTML.div({class: "keyboard-default-input-cursor"}),
				new HTML.div({class: "keyboard-default-input-after-cursor"})
			),
			keyboardAreas = new HTML.div({class: "keyboard-default-areas"})
		);
		
		keyboardPrompt.innerText = this.prompt;
		keyboardInput.value = this.currentInput;
		
		this.renderKeys(keyboardAreas);
		
		return keyboardEl;
	}
	
	updateRendered(element) {
		const keyboardInput = element.querySelector(".keyboard-default-input");
		
		const textBeforeCursor = this.currentInput.slice(0,this.cursorPosition);
		const textAfterCursor = this.currentInput.slice(this.cursorPosition);
		
		const elBeforeCursor = keyboardInput.querySelector(".keyboard-default-input-before-cursor");
		const elAfterCursor = keyboardInput.querySelector(".keyboard-default-input-after-cursor");
		
		const cursorEl = keyboardInput.querySelector(".keyboard-default-input-cursor");
		
		elBeforeCursor.innerText = textBeforeCursor;
		elAfterCursor.innerText = textAfterCursor;
		
		keyboardInput.scrollIntoViewIfNeeded(cursorEl);
		
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
			roles: ["DEFAULT_KEYBOARD_LEFT"],
			preactivate: () => {
				if(this.cursorPosition > 0) {
					this.cursorPosition--;
					this.update();
				}
			}
		});
		new Interactable(rightKey, {
			roles: ["DEFAULT_KEYBOARD_RIGHT"],
			preactivate: () => {
				if(this.cursorPosition < this.currentInput.length) {
					this.cursorPosition++;
					this.update();
				}
			}
		});
		
		new Interactable(capsKey, {
			roles: ["DEFAULT_KEYBOARD_SHIFT"],
			preactivate: focusManager => {
				this.inCapsMode = !this.inCapsMode;
				this.update();
			}
		});
		
		new Interactable(doneKey, {
			roles: ["DEFAULT_KEYBOARD_SUBMIT"],
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
				
				let keyName = keyValue.toUpperCase();
				
				if(this.constructor.keyNames[keyValue]) {
					keyName = this.constructor.keyNames[keyValue];
				}
				
				new Interactable(keyEl, {
					roles: ["DEFAULT_KEYBOARD_KEY_"+keyName],
					preactivate: () => {
						this.textBeforeCursor += keyEl.innerText;
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
			roles: ["DEFAULT_KEYBOARD_KEY_SPACE"],
			preactivate: () => {
				this.textBeforeCursor += " ";
				this.update();
			}
		});
		new Interactable(backspaceKey, {
			roles: ["DEFAULT_KEYBOARD_KEY_BACKSPACE"],
			preactivate: () => {
				this.textBeforeCursor = this.textBeforeCursor.slice(0,-1);
				this.update();
			}
		});
		
	}
	
}

export default DefaultKeyboard;