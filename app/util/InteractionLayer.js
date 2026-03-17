import Interactions from "./Interactions.js";

class InteractionLayer {
	id = crypto.randomUUID();
	element = null;
	acceptsInput = true;
	isResetLayer = false;
	
	musicNode = new Audio();
	set music(value) {
		this.musicNode.src = value;
		this.musicNode.play();
		Interactions.updateMusic();
	}
	get music() {
		return this.musicNode.src;
	}
	
	musicVolume = 1.0;
	get currentMusicVolume() {
		return this.musicNode.volume;
	}
	set currentMusicVolume(value) {
		this.musicNode.volume = Math.min(Math.max(0.0, value), 1.0);
	}
	musicIsPlaying = false;
	
	constructor(element, options = {}) {
		this.musicNode.volume = 0.0;
		this.musicNode.loop = true;
		this.element = element;
		if(options.isResetLayer) {
			this.isResetLayer = options.isResetLayer;
		}
		
	}
	
	async fadeInMusic() {
		if(this.musicIsPlaying) return;
		this.musicIsPlaying = true;
		for(let i = 0; i < 40; i++) {
			this.currentMusicVolume += this.musicVolume/40;
			await new Promise(res => setTimeout(res, 10));
		}
	}
	
	async fadeOutMusic() {
		if(!this.musicIsPlaying) return;
		this.musicIsPlaying = false;
		for(let i = 0; i < 40; i++) {
			this.currentMusicVolume -= this.musicVolume/40;
			await new Promise(res => setTimeout(res, 10));
		}
	}
	
	contains(interactable) {
		return this.element.contains(interactable.element);
	}
	
	acceptsInputFrom(pointer) {
		if(typeof this.acceptsInput == "function") {
			return this.acceptsInput(pointer);
		}
		if(Array.isArray(this.acceptsInput)) {
			return this.acceptsInput.includes(pointer.pointerId);
		}
		if(typeof this.acceptsInput == "string") {
			return this.acceptsInput == pointer.pointerId;
		}
		if(typeof this.acceptsInput == "object") {
			return this.acceptsInput == pointer;
		}
		if(this.acceptsInput) {
			return true;
		}
	}
	
	onButtonPress(button, manager) {
		if(!this.acceptsInputFrom(manager)) {
			return false;
		}
		
		if(button == "left") {
			manager.moveFocus("left");
		}
		if(button == "right") {
			manager.moveFocus("right");
		}
		if(button == "up") {
			manager.moveFocus("up");
		}
		if(button == "down") {
			manager.moveFocus("down");
		}
	}
	onButtonRelease(button, manager) {
		if(!this.acceptsInputFrom(manager)) {
			return false;
		}
		
	}
}

export default InteractionLayer;