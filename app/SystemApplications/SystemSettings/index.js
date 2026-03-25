import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import Registry from "../../util/system/Registry.js";
import UserIcon from "../../renderable/UserIcon/index.js";
import TabbedContainer from "../../renderable/TabbedContainer/index.js";
import LoadingScreen from "../../renderable/LoadingScreen/index.js";
import UserProfile from "../../renderable/UserProfile/index.js";

class SystemSettings extends Application {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = [...this.style, "app/SystemApplications/SystemSettings/icon-large.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-system-settings");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = [...this.style, "app/SystemApplications/SystemVideos/icon-small.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-system-settings");
			return icon;
		}
	}
	
	style = [...this.style, "app/SystemApplications/SystemSettings/main.css"];
	
	render() {
		const target = super.render();
		target.classList.add("system-settings-app");
		
		this.tabbedContainer = new TabbedContainer();
		
		let closeButton;
		target.append(new HTML.div({class: "system-settings-app-tabbed-container"},
			new HTML.div({class: "base-header"},
				closeButton = new HTML.div({class: "system-settings-app-exit-button base-pillbutton bi-x-lg"}),
				this.tabbedContainer.renderTabButtons(),
				new HTML.div({}) // Used for spacing
			),
			this.tabbedContainer.renderTabContents()
		));
		
		this.updateRendered(target);
		
		new Interactable(closeButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		});
		
		return target;
	}
	
	async updateRendered() {
		const loader = new LoadingScreen();
		loader.openIn(1000);
		
		this.element.querySelector(".tabbed-container-tab-buttons").innerHTML = "";
		this.element.querySelector(".tabbed-container-tab-contents").innerHTML = "";
		
		// Users tab content
		const usersTab = this.tabbedContainer.createTab({id: "users", icon: "bi-person-circle", name: "Users"});
		const usersTabEl = usersTab.render();
		
		let userList = new HTML.div({class: "system-settings-app-users-user-list"});
		usersTabEl.append(userList);
		
		for(let user of Object.values(await Registry.getKey("user"), {})) {
			let userEl,
				userName;
			
			userList.append(
				userEl = new HTML.div({class: "base-pillbutton system-settings-app-users-user"},
					new UserIcon(user).render(),
					userName = new HTML.div({class: "system-settings-app-users-user-name"})
				)
			);
			
			new Interactable(userEl, {
				activate: async () => {
					const loader = new LoadingScreen();
					loader.openIn(300);
					new UserProfile(user.id, (await this.getLaunchingUser()).id == user.id ? "editor" : "manager").open();
					loader.remove();
				}
			});
			
			userName.innerText = user.name;
		}
		
		loader.remove();
	}
}

export default SystemSettings;