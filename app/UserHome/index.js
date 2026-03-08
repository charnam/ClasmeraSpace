import { HTML } from "imperative-html";
import Overlay from "../Overlay/index.js";
import Renderable from "../util/Renderable.js";
import Registry from "../util/system/Registry.js";
import Interactable from "../util/Interactable.js";
import Applications from "../Applications/index.js";
import Scrollable from "../util/Scrollable.js";

class UserHome extends Renderable {
	userid = null;
	style = [...this.style, "UserHome/main.css"];
	
	constructor(userid) {
		super();
		this.userid = userid;
	}
	
	render() {
		const homeScreen = super.render();
		homeScreen.classList.add("home");
		
		let header,
			logoutButton,
			userButton,
			applicationsList;
		
		homeScreen.append(
			header = new HTML.div({class: "home-header"},
				logoutButton = new HTML.div({class: "home-header-logout"}),
				userButton = new HTML.div({class: "home-header-user"})
			),
			applicationsList = new HTML.div({class: "home-applications-list"})
		);
		
		new Scrollable(applicationsList);
		
		this.updateRendered(homeScreen);
		return homeScreen;
	}
	
	async updateRendered(element) {
		let userButton = element.querySelector(".home-header-user"),
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
					activate: () => {
						console.log("Icon selected");
					}
				})
			}
		}
		
	}
	
	open() {
		Overlay.fromRenderable(this);
	}
}

export default UserHome;