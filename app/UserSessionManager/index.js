import { HTML } from "imperative-html";
import Registry from "../Registry.js";
import Renderable from "../Renderable.js";
import Interactable from "../Interactable.js";

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
	
	async render(target) {
		const usm = super.render(target);
		usm.classList.add("usm");
		
		const userList = new HTML.div({class: "usm-user-list"});
		usm.appendChild(userList);
		
		const users = await UserSessionManager.getUsers();
		
		for(let user of users) {
			let userIcon, userName;
			const userElement = new HTML.div({class: "usm-user"},
				userIcon = new HTML.div({class: "usm-user-icon"}),
				userName = new HTML.div({class: "usm-user-name"})
			);
			
			new Interactable(userElement, {
				activate: () => {
					
				}
			});
			
			
			userName.innerText = user.name;
			
			userList.appendChild(userElement);
		}
		
	}
}

export default UserSessionManager;