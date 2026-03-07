import Interactions from "./Interactions.js";
import SoundManager from "./SoundManager.js";

class Interactable {
	element = null;
	disabled = false;
	interactionVolume = 0.3;
	
	sound = new SoundManager("./app/sounds/interaction", {
		back: "back.wav",
		interact_start: "interact-start.wav",
		interact_end: "interact-end.wav",
		keyboard: "keyboard.wav",
		keyboard_back: "keyboard-back.wav",
		keyboard_space: "keyboard-space.wav",
		select: "select.wav",
	})
	
	constructor(element, details) {
		this.element = element;
		this.hoverEvent = details.hover;
		this.unhoverEvent = details.unhover;
		this.preactivateEvent = details.preactivate;
		this.activateEvent = details.activate;
		
		Interactions.makeSelectable(this);
	}
	
	preactivate(focusManager) {
		focusManager.addAttribute("active", this.element);
		this.sound.playSound("interact_start", this.interactionVolume);
		if(this.preactivateEvent) {
			this.preactivateEvent(focusManager);
		}
	}
	activate(focusManager) {
		focusManager.clearAttribute("active");
		this.sound.playSound("interact_end", this.interactionVolume);
		if(this.activateEvent) {
			this.activateEvent(focusManager);
		}
	}
	hover(focusManager) {
		focusManager.replaceAttribute("hover", this.element);
		this.sound.playSound("select", this.interactionVolume);
		if(this.hoverEvent) {
			this.hoverEvent(focusManager);
		}
	}
	unhover(focusManager) {
		if(this.unhoverEvent) {
			this.unhoverEvent(focusManager);
		}
	}
	
}

export default Interactable;