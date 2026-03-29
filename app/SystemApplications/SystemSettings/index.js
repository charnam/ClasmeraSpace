import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import Registry from "../../util/system/Registry.js";
import UserIcon from "../../renderable/UserIcon/index.js";
import TabbedContainer from "../../renderable/TabbedContainer/index.js";
import LoadingScreen from "../../renderable/LoadingScreen/index.js";
import UserProfile from "../../renderable/UserProfile/index.js";
import OptionList from "../../renderable/OptionList/index.js";
import Header from "../../renderable/OptionList/Header/index.js";
import ToggleOption from "../../renderable/OptionList/ToggleOption/index.js";
import ButtonOption from "../../renderable/OptionList/ButtonOption/index.js";
import createUser from "../../util/simple/createUser.js";
import Option from "../../renderable/OptionList/Option/index.js";
import Net from "../../util/system/ipcModules/Net.js";
import SysInfo from "../../util/system/ipcModules/SysInfo.js";
import Dialog from "../../renderable/Dialog/index.js";

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
	
	static enableCondition = userid => Registry.getKey(`user.${userid}.administrator`);
	
	style = [...this.style, "app/SystemApplications/SystemSettings/main.css"];
	
	render() {
		const target = super.render();
		target.classList.add("system-settings-app");
		
		this.tabbedContainer = new TabbedContainer();
		
		let closeButton;
		target.append(new HTML.div({class: "system-settings-app-tabbed-container"},
			new HTML.div({class: "base-header base-justify-true-center"},
				new HTML.div(
					closeButton = new HTML.div({class: "system-settings-app-exit-button base-pillbutton bi-x-lg"}),
				),
				this.tabbedContainer.renderTabButtons(),
				new HTML.div({}) // Used for spacing
			),
			this.tabbedContainer.renderTabContents()
		));
		
		this.addTabs().then(
			() => this.updateRendered(target)
		);
		
		new Interactable(closeButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		});
		
		
		return target;
	}
	
	async addTabs() {
		this.element.querySelector(".tabbed-container-tab-buttons").innerHTML = "";
		this.element.querySelector(".tabbed-container-tab-contents").innerHTML = "";
		
		// General tab content
		const generalTab = this.tabbedContainer.createTab({id: "general", icon: "bi-gear", name: "General"});
		const generalTabEl = generalTab.render();
		
		new OptionList([
			new Header({text: "General"}),
			new ToggleOption({
				label: "Use separate keyboard focus",
				description: "The mouse and keyboard, by default, become one input device. Enable this setting if you'll have one person at the keyboard, and another person at the mouse. Restart for changes to take effect.",
				key: "system.config.focus.separatekeyboardfocus"
			})
			
		]).renderTo(generalTabEl);
		
		// Users tab content
		const usersTab = this.tabbedContainer.createTab({id: "users", icon: "bi-person-circle", name: "Users"});
		const usersTabEl = usersTab.render();
		
		let userList;
		new OptionList([
			new Header({text: "Users"}),
			userList = new HTML.div({class: "system-settings-app-users-user-list"}),
			new ButtonOption({
				buttonText: "Add user...",
				activate: createUser
			})
		]).renderTo(usersTabEl)
		
		// Connectivity tab content
		const connectivityTab = this.tabbedContainer.createTab({id: "connectivity", icon: "bi-reception-4", name: "Connectivity"});
		connectivityTab.render();
		
		// Info tab content
		const infoTab = this.tabbedContainer.createTab({id: "info", icon: "bi-info-circle", name: "Information"});
		infoTab.render();
	}
	
	async updateRendered() {
		const loader = new LoadingScreen();
		loader.openIn(1000);
		
		// Users tab
		const userList = this.element.querySelector(".system-settings-app-users-user-list");
		
		userList.innerHTML = "";
		
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
		
		// Connectivity tab
		const connectivityTab = this.element.querySelector('[tabid="connectivity"]');
		connectivityTab.innerHTML = "";
		new OptionList([
			new Header({text: "Connectivity"}),
			new Option({
				label: "IP Address",
				description: (await Net.getAddresses()).join("\n")
			}),
			new ButtonOption({
				label: "Wi-Fi and Networking",
				description: "Connect to Wi-Fi or manage your tethered Internet connection",
				buttonText: "Open",
				activate: () => {
					Dialog.showUnfinishedMessage();
				}
			})
		]).renderTo(connectivityTab);
		
		// Info tab
		const infoTab = this.element.querySelector('[tabid="info"]');
		infoTab.innerHTML = "";
		new OptionList([
			new Header({text: "System Info"}),
			new Option({
				label: "Version",
				description: (await SysInfo.getVersionInfo()).version
			})
		]).renderTo(infoTab);
	}
}

export default SystemSettings;