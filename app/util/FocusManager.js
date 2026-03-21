import Interactions from "./Interactions.js";
import DefaultKeyboard from "../renderable/DefaultKeyboard/index.js";
import DefaultPasscodeInput from "../renderable/DefaultPasscodeInput/index.js";
import callToParents from "./simple/callToParents.js";
import FocusManagerCursor from "../renderable/FocusManagerCursor/index.js";

class FocusManager {
	pointerId = crypto.randomUUID();
	userid = null;
	currentFocus = null;
	focusLayers = {};
	
	inputs = [];
	cursorIsActive = false;
	cursorPosition = {x: -1, y: -1};
	cursorTarget = {x: -1, y: -1};
	cursorIsClicked = false;
	
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
		
		this.hoverOverlay = new FocusManagerCursor();
		this.hoverOverlay.renderTo(document.getElementById("focus-manager-cursors"));
	}
	
	cursorLastFrameTime = Date.now();
	animateCursor() {
		const speedMult = 20;
		const deltaTime = (Date.now() - this.cursorLastFrameTime) / 1000;
		
		this.cursorTarget.x = Math.max(0, Math.min(this.cursorTarget.x, window.innerWidth));
		this.cursorTarget.y = Math.max(0, Math.min(this.cursorTarget.y, window.innerHeight));
		
		let deltaX = (this.cursorTarget.x - this.cursorPosition.x) * deltaTime * speedMult;
		let deltaY = (this.cursorTarget.y - this.cursorPosition.y) * deltaTime * speedMult;
		
		this.cursorPosition.x += deltaX;
		this.cursorPosition.y += deltaY;
		
		const squashMult = (this.cursorIsClicked ? 1.0 : 0.2);
		const xMovTarget = deltaX * squashMult;
		const yMovTarget = deltaY * squashMult;
		
		this.hoverOverlay.xMov += (xMovTarget - this.hoverOverlay.xMov) * deltaTime * speedMult;
		this.hoverOverlay.yMov += (yMovTarget - this.hoverOverlay.yMov) * deltaTime * speedMult;
		
		this.hoverOverlay.x = this.cursorPosition.x;
		this.hoverOverlay.y = this.cursorPosition.y;
		
		this.hoverOverlay.active = this.cursorIsActive;
		
		this.hoverOverlay.updateRendered();
		
		this.cursorIsActive = this.cursorIsActive || Interactions.getCurrentLayer(this).shouldForceCursor;
		
		if(this.cursorIsActive) {
			const element = document.elementFromPoint(this.cursorPosition.x, this.cursorPosition.y);
			this.hover(element);
		}
		
		this.cursorLastFrameTime = Date.now();
	}
	
	getInputsByRole(role) {
		return this.inputs.filter(input => input.satisfiesRole(role));
	}
	
	ensureFocus() {
		if(!this.currentFocus) {
			this.hover(Interactions.getAvailableTargets(this)[0].element);
		}
	}
	
	moveFocus(direction) {
		this.cursorIsActive = false;
		let newFocus;
		if(this.currentFocus) {
			newFocus = Interactions.getAvailableInteractableInDirection(this, this.currentFocus, direction);
		} else {
			this.ensureFocus();
			if(this.currentFocus) {
				newFocus = this.currentFocus.element;
			}
		}
		if(newFocus) {
			this.hover(newFocus);
			const scrollable = Interactions.getScrollable(newFocus);
			if(scrollable) {
				scrollable.scrollToInclude(newFocus);
			}
		}
	}
	
	hoverAt(x, y) {
		this.cursorTarget.x = x * window.innerWidth;
		this.cursorTarget.y = y * window.innerHeight;
		this.cursorIsActive = true;
	}
	
	hover(element) {
		const interactable = Interactions.getInteractable(element, this);
		if(interactable) {
			if(this.currentFocus !== interactable) {
				this.unhover();
				this.currentFocus = interactable;
				if(this.currentFocus) {
					this.currentFocus.hover(this);
					this.focusLayers[Interactions.getCurrentLayer(this).id] = this.currentFocus;
				}
			}
		} else {
			if(this.currentFocus) {
				this.unhover();
			}
		}
	}
	unhover() {
		if(this.currentFocus) {
			this.currentFocus.unhover(this);
			this.currentFocus = null;
			delete this.focusLayers[Interactions.getCurrentLayer(this).id];
		}
	}
	beginInteract() {
		if(this.currentFocus) {
			this.currentFocus.preactivate(this);
		}
		this.cursorIsClicked = true;
	}
	endInteract() {
		if(this.currentFocus) {
			this.currentFocus.activate(this);
		}
		this.cursorIsClicked = false;
	}
	
	update() {
		if(this.currentFocus && !Interactions.isInteractable(this.currentFocus.element, this)) {
			this.currentFocus.unhover(this);
			this.currentFocus = null;
		}
		const focusedOnLayer = this.focusLayers[Interactions.getCurrentLayer().id];
		if(focusedOnLayer) {
			this.hover(focusedOnLayer.element);
		}
	}
	
	remove() {
		const thisIndex = Interactions.focusManagers.indexOf(this);
		Interactions.focusManagers.splice(thisIndex, 1);
	}
	
	replaceAttribute(attr, target) {
		const didClear = this.clearAttribute(attr);
		const additions = this.addAttribute(attr, target);
		return {
			additions,
			didClear
		};
	}
	
	addAttribute(attr, target) {
		const previousValue = target.getAttribute(attr) ?? "";
		const pointers = previousValue.split(" ").filter(item => item.length > 0);
		
		if(!pointers.includes(this.pointerId)) {
			pointers.push(this.pointerId);
		}
		
		target.setAttribute(attr, pointers.join(" "));
		
		return {
			modified: previousValue !== pointers.join(" ")
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
