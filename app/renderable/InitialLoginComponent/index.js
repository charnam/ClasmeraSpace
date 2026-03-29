import { HTML } from "imperative-html";
import Registry from "../../util/system/Registry.js";
import Renderable from "../../util/Renderable.js";
import Interactable from "../../util/Interactable.js";
import UserHome from "../UserHome/index.js";
import UserIcon from "../UserIcon/index.js";

class InitialLoginComponent extends Renderable {
	style = [...this.style, "app/renderable/InitialLoginComponent/main.css"];
	
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
					//const response = await focusManager.Keyboard.ask({prompt: "Enter your password."});
					
					focusManager.userid = user.id;
					const home = new UserHome(user.id);
					home.open();
				}
			});
			
			
			userName.innerText = user.name;
			
			userList.appendChild(userElement);
		}
		
	}
}

export default InitialLoginComponent;