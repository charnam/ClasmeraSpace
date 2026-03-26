import { HTML } from "imperative-html";
import Interactable from "../../util/Interactable.js";
import Scrollable from "../../util/Scrollable.js";
import LoadingScreen from "../LoadingScreen/index.js";
import Header from "../OptionList/Header/index.js";
import ToggleOption from "../OptionList/ToggleOption/index.js";
import Overlay from "../Overlay/index.js";
import OptionList from "../OptionList/index.js";
import UserIcon from "../UserIcon/index.js";
import Registry from "../../util/system/Registry.js";
import TextOption from "../OptionList/TextOption/index.js";
import Renderable from "../../util/Renderable.js";
import ButtonOption from "../OptionList/ButtonOption/index.js";
import Dialog from "../Dialog/index.js";

class UserProfile extends Overlay {
	style = [...this.style, "app/renderable/UserProfile/main.css"];
	animateDisappearDuration = 1000;
	
	constructor(userid, mode = "viewer") {
		super();
		this.userid = userid;
		this.mode = mode;
		this.layer.isResetLayer = true;
	}
	
	render() {
		const container = super.render();
		container.classList.add("user-profile");
		
		let closeButton,
			header,
			content;
		
		container.append(
			header = new HTML.div({class: "base-header"},
				closeButton = new HTML.div({class: "base-pillbutton bi-x-lg"})
			),
			content = new HTML.div({class: "user-profile-content"})
		);
		
		new Scrollable(container, {
			padding: 120
		});
		
		new Interactable(closeButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		})
		
		this.updateRendered(container);
		
		return container;
	}
	
	async updateRendered(el) {
		const loader = new LoadingScreen();
		loader.open();
		
		const user = await Registry.getKey("user."+this.userid);
		
		const content = el.querySelector(".user-profile-content");
		content.innerHTML = "";
		
		let iconEl,
			nameEl;
		
		const managerList = [
			new Header({text: "Permissions"}),
			new ToggleOption({
				label: "Allow access to administrator settings",
				description: "You are currently in the System Settings application, which is restricted to system administrators. Disable this setting if you no longer want to allow this user to open the System Settings application.",
				enabled: {
					text: "Allowed"
				},
				disabled: {
					text: "Disallowed"
				},
				key: `user.${this.userid}.administrator`
			}),
			new ToggleOption({
				label: "Allow changing user icon",
				description: "If you don't want this user to be able to change their own icon, turn this setting off.",
				enabled: {
					text: "Can change"
				},
				disabled: {
					text: "Cannot change"
				},
				key: `user.${this.userid}.permissions.profilesettings.icon`
			}),
			new ToggleOption({
				label: "Allow name change",
				description: "If you don't want this user to be able to change their own name, turn this setting off.",
				enabled: {
					text: "Can change"
				},
				disabled: {
					text: "Cannot change"
				},
				key: `user.${this.userid}.permissions.profilesettings.name`
			}),
		];
		
		const admin = this.mode == "manager";
		
		const editorList = [
			new Header({text: "Profile"}),
			!(admin || await Registry.getKey(`user.${this.userid}.permissions.profilesettings.name`)) ? null :
				new TextOption({
					label: "Name",
					key: `user.${this.userid}.name`,
					prompt: "Enter new name...",
					onchange: () => {
						Renderable.updateInstances();
					}
				}),
		];
		
		content.append(
			new HTML.div({class: "user-profile-user-icon"},
				iconEl = new UserIcon(user.id).render()
			),
			nameEl = new HTML.div({class: "user-profile-user-name"}),
			new OptionList(this.mode == "viewer" ? [] : [
				...(this.mode == "manager" ? managerList : []),
				...(this.mode !== "viewer" ? editorList : []),
				this.mode == "manager" ? new ButtonOption({
					label: "Delete user...",
					description: "Permanently remove this user and all associated data from the system.",
					buttonText: "Delete",
					activate: async () => {
						if(await Dialog.ask({
							prompt: "Are you REALLY sure you'd like to delete this user? This cannot be undone, be careful!",
							buttons: [
								{
									text: "No, don't delete",
									value: false
								},
								{
									text: "Yes, delete forever!",
									value: true
								},
							]
						})) {
							const load = new LoadingScreen();
							load.open();
							const users = await Registry.getKey("user");
							delete users[this.userid];
							await Registry.setKey("user", users);
							await this.remove();
							load.remove();
							Renderable.updateInstances();
						}
					}
				}) : null
			]).render()
		);
		
		if(admin || await Registry.getKey(`user.${this.userid}.permissions.profilesettings.icon`)) {
			new Interactable(iconEl, {
				activate: () => {
					// TODO: Icon uploading
					Dialog.showUnfinishedMessage();
				}
			});
		}
		
		nameEl.innerText = user.name;
		
		loader.remove();
	}
	
}

export default UserProfile;