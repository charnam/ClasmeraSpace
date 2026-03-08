
class InteractionLayer {
	element = null;
	acceptsInput = true;
	
	constructor(element) {
		this.element = element;
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
}

export default InteractionLayer;