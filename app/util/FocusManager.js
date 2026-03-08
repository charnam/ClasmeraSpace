import Interactions from "./Interactions.js";
import DefaultKeyboard from "../DefaultKeyboard/index.js";
import DefaultPasscodeInput from "../DefaultPasscodeInput/index.js";


function withEventParents(target, cb) {
	while(target) {
		cb(target);
		target = target.parentElement;
	}
}

class FocusManager {
	volume = 0.2;
	pointerId = crypto.randomUUID();
	currentFocus = null;
	
	Keyboard = DefaultKeyboard;
	PasscodeInput = DefaultPasscodeInput;
	
	constructor(details = {}) {
		if(details.Keyboard) {
			this.Keyboard = details.Keyboard;
		}
		if(details.PasscodeInput) {
			this.PasscodeInput = details.PasscodeInput;
		}
		Interactions.focusManagers.push(this);
	}
	
	moveFocus(direction) {
		let newFocus;
		if(this.currentFocus) {
			newFocus = Interactions.getInteractableInDirection(this.currentFocus, direction);
		} else {
			newFocus = Interactions.getAvailableTargets()[0].element;
		}
		if(newFocus) {
			this.hover(newFocus);
			const scrollable = Interactions.getScrollable(newFocus);
			if(scrollable) {
				scrollable.scrollToInclude(newFocus);
			}
		}
	}
	
	hover(element) {
		const interactable = Interactions.getInteractable(element);
		if(interactable) {
			if(this.currentFocus !== interactable) {
				this.unhover();
				this.currentFocus = interactable;
				if(this.currentFocus) {
					this.currentFocus.hover(this);
				}
			}
		}
	}
	unhover() {
		if(this.currentFocus) {
			this.currentFocus.unhover(this);
			this.currentFocus = null;
		}
	}
	beginInteract() {
		if(this.currentFocus) {
			this.currentFocus.preactivate(this);
		}
	}
	endInteract() {
		if(this.currentFocus) {
			this.currentFocus.activate(this);
		}
	}
	
	update() {
		if(this.currentFocus && !Interactions.isInteractable(this.currentFocus.element)) {
			this.currentFocus.unhover(this);
			this.currentFocus = null;
		}
	}
	
	replaceAttribute(attr, target) {
		const additions = this.addAttribute(attr, target);
		const didClear = this.clearAttribute(attr, additions.selectedElements);
		return {
			additions,
			didClear
		};
	}
	
	addAttribute(attr, target) {
		let selectedElements = [];
		let modifiedElements = [];
		withEventParents(target, el => {
			if(!Interactions.isInteractable(el)) return;
			
			const previousValue = el.getAttribute(attr) ?? "";
			const pointers = previousValue.split(" ").filter(item => item.length > 0);
			
			if(!pointers.includes(this.pointerId)) {
				pointers.push(this.pointerId);
			}
			
			el.setAttribute(attr, pointers.join(" "));
			selectedElements.push(el);
			if(previousValue !== pointers.join(" ")) {
				modifiedElements.push(el);
			}
		});
		
		return {
			modifiedElements,
			selectedElements
		};
	}
	
	clearAttribute(attr, exclude = []) {
		let didClear = false;
		const elements = document.querySelectorAll(`[${attr}]`);
		for(let element of elements) {
			if(exclude.includes(element)) continue;
			
			const oldValue = element.getAttribute(attr);
			if(oldValue == null) continue;
			
			const pointers = oldValue
				.split(" ")
				.filter(pointerId => pointerId !== this.pointerId && pointerId.length > 0);
			
			if(pointers.length > 0) {
				element.setAttribute(attr, pointers.join(" "));
			} else {
				element.removeAttribute(attr);
			}
			didClear = true;
		}
		
		return didClear;
	}
}

export default FocusManager;
