import { HTML } from "imperative-html";
import Registry from "../util/system/Registry.js";
import Renderable from "../util/Renderable.js";
import Interactable from "../util/Interactable.js";

class UserSessionManager extends Renderable {
	style = "UserSessionManager/main.css";
	
	constructor() {
		super();
	}
	
	static async getUsers() {
		const users = Object.values(await Registry.getKey("user"));
		return users.sort((a, b) => a.name < b.name ? -1 : (a.name == b.name ? 0 : 1));
	}
	static async createUser(name) {
		const id = crypto.randomUUID();
		await Registry.setKey(`user.${id}`, {
			id,
			name
		});
		await verifyUser(id);
		return id;
	}
	static async verifyUser(id) {
		const user = await Registry.getKey(`user.${id}`);
		
		return true;
	}
	
	render() {
		const usm = super.render();
		usm.classList.add("usm");
		
		const userList = new HTML.div({class: "usm-user-list"});
		usm.appendChild(userList);
		
		this.renderUsers(userList);
		
		return usm;
	}
	
	async renderUsers(target) {
		target.innerHTML = "";
		
		const users = await this.constructor.getUsers();
		
		for(let user of users) {
			let userIcon, userName;
			const userElement = new HTML.div({class: "usm-user"},
				userIcon = new HTML.div({class: "usm-user-icon"}),
				userName = new HTML.div({class: "usm-user-name"})
			);
			
			new Interactable(userElement, {
				activate: async focusManager => {
					const response = await focusManager.Keyboard.ask({prompt: "test"});
					
					console.log(response);
				}
			});
			
			
			userName.innerText = user.name;
			
			target.appendChild(userElement);
		}
		
	}
}

export default UserSessionManager;