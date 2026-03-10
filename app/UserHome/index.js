import { HTML } from "imperative-html";
import Overlay from "../Overlay/index.js";
import Registry from "../util/system/Registry.js";
import Interactable from "../util/Interactable.js";
import Applications from "../Applications/index.js";
import Scrollable from "../util/Scrollable.js";
import OverlayMenu from "../OverlayMenu/index.js";

class UserHome extends Overlay {
	userid = null;
	style = [...this.style, "UserHome/main.css"];
	animateDisappearDuration = 1000;
	
	constructor(userid) {
		super();
		this.userid = userid;
		this.layer.music = "app/UserHome/music.wav";
		this.layer.isResetLayer = true;
		this.layer.musicVolume = 0.12;
	}
	
	render() {
		const homeScreen = super.render();
		homeScreen.classList.add("home");
		
		let header,
			logoutButton,
			userButton,
			userName,
			applicationsList;
		
		homeScreen.append(
			header = new HTML.div({class: "home-header"},
				userButton = new HTML.div({class: "home-header-user"},
					userName = new HTML.div({class: "home-header-user-name"}, "Loading...")
				),
				logoutButton = new HTML.div({class: "home-header-logout"}),
			),
			applicationsList = new HTML.div({class: "home-applications-list"})
		);
		
		new Scrollable(applicationsList);
		
		this.updateRendered(homeScreen);
		
		new Interactable(userButton, {
			activate: manager => {
				const menu = new OverlayMenu({
					title: "Account",
					menu: [
						{
							text: "Log out",
							callback: () => this.remove()
						},
						{
							text: "Options",
							callback: manager => {
								this.userid
							}
						},
					]
				});
				menu.open();
			}
		});
		return homeScreen;
	}
	
	async updateRendered(element) {
		let userNameEl = element.querySelector(".home-header-user-name"),
			applicationsList = element.querySelector(".home-applications-list");
		
		applicationsList.innerHTML = "";
		
		const disabledApplications = await Registry.getKey(`user.${this.userid}.disabledapps`, []);
		const visibleApplications = Object.values(Applications.all).filter(app => !disabledApplications.includes(app.id));
		
		if(visibleApplications.length == 0) {
			applicationsList.append(
				new HTML.div({class: "home-applications-list-no-items-message"}, "No applications found for this user.")
			)
		} else {
			for(let App of visibleApplications) {
				const icon = new App.LargeIcon();
				const renderedIcon = icon.renderTo(applicationsList);
				new Interactable(renderedIcon, {
					activate: manager => {
						const app = new App();
						app.open();
					}
				})
			}
		}
		
		const user = await Registry.getKey(`user.${this.userid}`);
		userNameEl.innerText = `Logged in as ${user.name}`;
		
	}
}

export default UserHome;