
class Input {
	manager = null;
	
	value = 0;
	statechange = [];
	
	roles = [];
	
	constructor(details) {
		if(details.manager) {
			this.manager = details.manager;
		}
		if(details.roles) {
			this.roles = details.roles;
		}
	}
	
	setState(value) {
		this.value = value;
		
		for(let callback of this.statechange) {
			callback(this);
		}
	}
	
	onStateChange(callback) {
		this.statechange.push(callback);
	}
}

export default Input;