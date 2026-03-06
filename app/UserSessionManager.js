import Renderable from "./Renderable.js";

class UserSessionManager extends Renderable {
	constructor() {
		super();
		
		
	}
	
	render(target) {
		const element = super(target);
		element.classList.add("usm");
		
		
	}
}

export default UserSessionManager;