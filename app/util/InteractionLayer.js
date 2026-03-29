import Interactions from "./Interactions.js";

class InteractionLayer {
	id = crypto.randomUUID();
	element = null;
	acceptsInput = true;
	affects = true;
	isResetLayer = false;
	
	inputOverride = null;
	shouldForceCursor = false;
	
	musicNode = new Audio();
	set music(value) {
		if(value !== "disabled") {
			this.musicNode.src = value;
			this.musicNode.play();
		} else {
			this.musicNode.src = "";
			this.musicNode.pause();
		}
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
		if(options.affects !== undefined) {
			this.affects = options.affects
		}
		if(options.shouldForceCursor) {
			this.shouldForceCursor = options.shouldForceCursor;
		}
	}
	
	lastCursorAnimateTime = Date.now();
	animateCursors() {
		if(this.lastCursorAnimateTime < Date.now() - 1000) {
			this.lastCursorAnimateTime = Date.now();
		}
		const deltaTime = (Date.now() - this.lastCursorAnimateTime) / 1000;
		const cursorSpeedPerSecond = window.innerHeight / 100 * 30;
		
		if(this.shouldForceCursor) {
			for(let manager of Interactions.focusManagers) {
				if(Interactions.getCurrentLayer(manager) !== this) continue;
				
				let cursorMovementX = 0;
				let cursorMovementY = 0;
				
				for(let input of manager.inputs) {
					const timeMultiplier = (input.timeSinceToggleChanged / 1000 + 1);
					if(input.satisfiesRole("BASE_UP")) {
						cursorMovementY -= input.state * timeMultiplier;
					}
					if(input.satisfiesRole("BASE_DOWN")) {
						cursorMovementY += input.state * timeMultiplier;
					}
					if(input.satisfiesRole("BASE_LEFT")) {
						cursorMovementX -= input.state * timeMultiplier;
					}
					if(input.satisfiesRole("BASE_RIGHT")) {
						cursorMovementX += input.state * timeMultiplier;
					}
				}
				
				if(Math.abs(cursorMovementX) > 0 || Math.abs(cursorMovementY) > 0) {
					manager.cursorIsActive = true;
				}
				
				manager.cursorTarget.x += cursorMovementX * cursorSpeedPerSecond * deltaTime;
				manager.cursorTarget.y += cursorMovementY * cursorSpeedPerSecond * deltaTime;
			}
			
		}
		
		this.lastCursorAnimateTime = Date.now();
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
	
	getInteractables() {
		return Interactions.availableTargets.filter(interactable => this.contains(interactable));
	}
	
	contains(interactable) {
		return this.element !== interactable.element && this.element.contains(interactable.element);
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
	
	shouldAffect(pointer) {
		if(Array.isArray(this.affects)) {
			return this.affects.includes(pointer) || this.affects.includes(pointer.id);
		} else if(typeof this.affects == "boolean") {
			return this.affects;
		} else {
			return this.affects == pointer;
		}
	}
	
	sendInput(input) {
		if(!this.acceptsInputFrom(input.focusManager)) {
			return false;
		}
		
		const interactables = this.getInteractables()
			.filter(interactable => interactable.roles.some(role => input.satisfiesRole(role)));
		
		if(this.inputOverride) {
			this.inputOverride(input);
		} else if(input.toggleStateChanged) {
			if(interactables.length > 0) {
				for(let interactable of interactables) {
					if(input.isToggled) {
						interactable.preactivate(input.focusManager);
					} else {
						interactable.activate(input.focusManager);
					}
				}
			} else if(!this.shouldForceCursor) {
				if(input.isToggled) {
					if(input.satisfiesRole("BASE_UP")) {
						input.focusManager.moveFocus("up");
					}
					if(input.satisfiesRole("BASE_DOWN")) {
						input.focusManager.moveFocus("down");
					}
					if(input.satisfiesRole("BASE_LEFT")) {
						input.focusManager.moveFocus("left");
					}
					if(input.satisfiesRole("BASE_RIGHT")) {
						input.focusManager.moveFocus("right");
					}
					
					if(input.satisfiesRole("BASE_SELECT")) {
						input.focusManager.ensureFocus();
						input.focusManager.beginInteract();
					}
				} else {
					if(input.satisfiesRole("BASE_SELECT")) {
						input.focusManager.endInteract();
					}
				}
			} else {
				if(input.satisfiesRole("BASE_SELECT")) {
					if(input.isToggled) {
						input.focusManager.beginInteract();
					} else {
						input.focusManager.endInteract();
					}
				}
			}
		}
	}
}

export default InteractionLayer;