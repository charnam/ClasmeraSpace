import Interactions from "./Interactions.js";
import DefaultKeyboard from "../renderable/DefaultKeyboard/index.js";
import DefaultPasscodeInput from "../renderable/DefaultPasscodeInput/index.js";
import callToParents from "./simple/callToParents.js";
import FocusManagerCursor from "../renderable/FocusManagerCursor/index.js";
import SoundManager from "./SoundManager.js";

class FocusManager {
	pointerId = crypto.randomUUID();
	userid = null;
	currentFocus = null;
	focusLayers = {};
	
	inputs = [];
	
	cursorSmoothing = 0.6;
	
	cursorPosition = {x: -1, y: -1};
	cursorTarget = {x: -1, y: -1};
	
	lastActiveAt = 0;
	get isActive() {
		return this.lastActiveAt > Date.now() - 3000;
	}
	set isActive(value) {
		if(value) {
			this.lastActiveAt = Date.now();
		} else {
			this.lastActiveAt = 0;
		}
	}
	
	_cursorIsClicked = false;
	cursorClickedAt = 0;
	set cursorIsClicked(value) {
		if(this._cursorIsClicked !== value) {
			this._cursorIsClicked = value;
			this.cursorClickedAt = Date.now();
		}
	}
	get cursorIsClicked() {
		return this._cursorIsClicked;
	}
	
	
	cursorWasActive = false;
	cursorActiveAt = 0;
	set cursorIsActive(value) {
		if(value == false) {
			this.cursorActiveAt = 0;
		} else {
			this.cursorActiveAt = Date.now();
		}
	}
	get cursorIsActive() {
		return (this.cursorActiveAt > Date.now() - 3000)
	}
	
	Keyboard = DefaultKeyboard;
	PasscodeInput = DefaultPasscodeInput;
	
	static sound = new SoundManager("./app/sounds/interaction", {
		click: "back.wav"
	});
	
	sound = FocusManager.sound;
	
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
	
	cursorLastFrameTime = 0;
	animateCursor() {
		const speedMult = Math.min(1, this.cursorSmoothing * Math.min(0.5, (Date.now() - this.cursorLastFrameTime) / 1000 * 120));
		
		this.cursorTarget.x = Math.max(0, Math.min(this.cursorTarget.x, window.innerWidth));
		this.cursorTarget.y = Math.max(0, Math.min(this.cursorTarget.y, window.innerHeight));
		
		let deltaX = (this.cursorTarget.x - this.cursorPosition.x) * speedMult;
		let deltaY = (this.cursorTarget.y - this.cursorPosition.y) * speedMult;
		
		this.cursorPosition.x += deltaX;
		this.cursorPosition.y += deltaY;
		
		const squashMult = (this.cursorIsClicked ? 1.0 : 0.2);
		const xMovTarget = Math.max(-10, Math.min(deltaX * squashMult, 10));
		const yMovTarget = Math.max(-4, Math.min(deltaY * squashMult, 4));
		
		this.hoverOverlay.x = this.cursorPosition.x;
		this.hoverOverlay.y = this.cursorPosition.y;
		this.hoverOverlay.xMov += (xMovTarget - this.hoverOverlay.xMov) * speedMult;
		this.hoverOverlay.yMov += (yMovTarget - this.hoverOverlay.yMov) * speedMult;
		this.hoverOverlay.active = this.cursorIsActive;
		this.hoverOverlay.updateRendered();
		
		if(this.cursorIsActive) {
			const element = document.elementFromPoint(this.cursorPosition.x, this.cursorPosition.y);
			this.hover(element);
		}
		
		if(this.cursorWasActive && !this.cursorIsActive) {
			this.unhover();
		}
		
		this.cursorWasActive = this.cursorIsActive;
		this.cursorLastFrameTime = Date.now();
	}
	
	getInputsByRole(role) {
		return this.inputs.filter(input => input.satisfiesRole(role));
	}
	
	ensureFocus() {
		if(!this.currentFocus && !this.cursorIsActive) {
			this.hover(Interactions.getAvailableTargets(this)[0].element);
		}
	}
	
	moveFocus(direction) {
		this.cursorIsActive = false;
		this.cursorWasActive = false;
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
		this.isActive = true;
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
