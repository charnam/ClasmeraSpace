import { HTML } from "imperative-html";
import Registry from "../../util/system/Registry.js";
import Renderable from "../../util/Renderable.js";
import Interactable from "../../util/Interactable.js";
import UserHome from "../UserHome/index.js";
import UserIcon from "../UserIcon/index.js";

class InitialLoginComponent extends Renderable {
	style = this.autoStyleByImport(import.meta.url);
	
	constructor() {
		super();
	}
	
	render() {
		const usm = super.render();
		usm.classList.add("usm");
		
		const userList = new HTML.div({class: "usm-user-list"});
		usm.appendChild(userList);
		
		this.updateRendered(usm);
		
		return usm;
	}
	
	async updateRendered(target) {
		const userList = target.querySelector(".usm-user-list");
		userList.innerHTML = "";
		
		const users = Object.values(await Registry.getKey("user"));
		
		for(let user of users) {
			let userIcon, userName;
			const userElement = new HTML.div({class: "usm-user"},
				userIcon = new UserIcon(user).render(),
				userName = new HTML.div({class: "usm-user-name"})
			);
			
			new Interactable(userElement, {
				activate: async focusManager => {
					if(!user.pin || await focusManager.PasscodeInput.check({prompt: "Enter your PIN", hash: user.pin})) {
						focusManager.userid = user.id;
						const home = new UserHome(user.id);
						home.open();
					}
				}
			});
			
			
			userName.innerText = user.name;
			
			userList.appendChild(userElement);
		}
		
	}
}

export default InitialLoginComponent;