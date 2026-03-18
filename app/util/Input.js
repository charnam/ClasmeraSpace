import Interactions from "./Interactions";

class Input {
	focusManager = null;
	
	name = "Button";
	roles = [];
	
	// 0 -- not pressed
	// 1 -- pressed
	// Decimals are allowed. 0-1 is the only allowed range.
	state = 0;
	
	wasToggled = false;
	get isToggled() {
		return this.state > 0.5;
	}
	
	constructor(focusManager, details = {}) {
		this.focusManager = focusManager;
		focusManager.inputs.push(this);
		
		if(details.name) {
			this.name = details.name
		}
		if(details.roles) {
			this.roles = details.roles;
		}
	}
	
	satisfiesRole(role) {
		return this.roles.includes(role);
	}
	
	setState(value) {
		this.state = value;
		this.toggleChanged = this.isToggled !== this.wasToggled;
		Interactions.getCurrentLayer().sendInput(this);
		this.wasToggled = this.isToggled;
	}
	
	getState() {
		return this.state;
	}
}

export default Input;
