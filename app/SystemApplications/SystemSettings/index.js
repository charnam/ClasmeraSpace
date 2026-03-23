import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import Registry from "../../util/system/Registry.js";
import UserIcon from "../../renderable/UserIcon/index.js";
import UserSettings from "./UserSettings/index.js";
import TabbedContainer from "../../renderable/TabbedContainer/index.js";
import LoadingScreen from "../../renderable/LoadingScreen/index.js";

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
		target.classList.add("system-settings");
		
		this.tabbedContainer = new TabbedContainer();
		
		let closeButton;
		target.append(new HTML.div({class: "system-settings-tabbed-container"},
			new HTML.div({class: "base-header"},
				closeButton = new HTML.div({class: "system-settings-exit-button base-pillbutton bi-x-lg"}),
				this.tabbedContainer.renderTabButtons(),
				new HTML.div({}) // Used for spacing
			),
			this.tabbedContainer.renderTabContents()
		));
		
		new Interactable(closeButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		});
		
		this.addTabs();
		
		return target;
	}
	
	async addTabs() {
		const loader = new LoadingScreen();
		loader.openIn(1000);
		
		// Users tab content
		const usersTab = this.tabbedContainer.createTab({id: "users", icon: "bi-person-circle", name: "Users"});
		const usersTabEl = usersTab.render();
		
		let userList = new HTML.div({class: "system-settings-app-user-settings-user-list"});
		usersTabEl.append(userList);
		
		for(let user of Object.values(await Registry.getKey("user"), {})) {
			let userEl,
				userName;
			
			usersTabEl.append(
				userEl = new HTML.div({class: "base-pillbutton system-settings-app-user-settings-user"},
					new UserIcon(user).render(),
					userName = new HTML.div({class: "system-settings-app-user-settings-user-name"})
				)
			);
			
			new Interactable(userEl, {
				activate: () => {
					new UserSettings(user.id).open();
				}
			});
			
			userName.innerText = user.name;
		}
		
		loader.remove();
	}
	
	
	addTab(icon, id) {
		const tabButton = new HTML.div({class: "system-settings-tab-button base-pillbutton "+icon});
		const tabContents = new HTML.div({class: "system-settings-tab-content", tabid: id});
		
		this.tabBar.append(tabButton);
		this.tabs.append(tabContents);
		
		new Interactable(tabButton, {
			activate: () => {
				this.tabbed.setTab(id);
			}
		})
		
		return {
			button: tabButton,
			contents: tabContents,
		};
	}
	
	updateRendered() {
		
	}
}

export default SystemSettings;