import { HTML } from "imperative-html";
import LoadingScreen from "../../../renderable/LoadingScreen/index.js";
import Overlay from "../../../renderable/Overlay/index.js";
import UserIcon from "../../../renderable/UserIcon/index.js";
import Registry from "../../../util/system/Registry.js";

class UserSettings extends Overlay {
	style = [...this.style, "app/SystemApplications/SystemSettings/UserSettings/style.css"];
	
	constructor(userid) {
		super();
		this.userid = userid;
		this.layer.isResetLayer = true;
	}
	
	render() {
		const container = super.render();
		
		let closeButton,
			header;
		
		container.append(
			header = new HTML.div({class: "base-header"},
				closeButton = new HTML.div({class: "base-pillbutton bi-x-lg"})
			),
			new HTML.div({class: "system-settings-app-user-settings-content"})
		);
		
		return container;
	}
	
	async updateRendered(el) {
		const loader = new LoadingScreen();
		loader.open();
		
		const user = await Registry.getKey("user."+this.userid);
		
		const content = el.querySelector(".system-settings-app-user-settings-content");
		content.innerHTML = "";
		
		
		content.append(
			new HTML.div({class: "system-settings-app-user-settings-user-icon"},
				new UserIcon(user.id).render()
			)
		)
		
		
		loader.remove();
	}
	
}

export default UserSettings;