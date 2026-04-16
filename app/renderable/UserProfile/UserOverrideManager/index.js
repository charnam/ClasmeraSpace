import { HTML } from "imperative-html";
import VisualOverlay from "../../VisualOverlay/index.js";
import LoadingScreen from "../../LoadingScreen/index.js";
import Registry from "../../../util/system/Registry.js";
import OptionList from "../../OptionList/index.js";
import ButtonOption from "../../OptionList/ButtonOption/index.js";
import Overridable from "../../../util/Overridable.js";
import Scrollable from "../../../util/Scrollable.js";
import Interactable from "../../../util/Interactable.js";
import Header from "../../OptionList/Header/index.js";
import OverlayMenu from "../../OverlayMenu/index.js";

class UserOverrideManager extends VisualOverlay {
	style = [...this.style, "app/renderable/UserProfile/UserOverrideManager/main.css"];
	
	constructor(userid) {
		super();
		this.userid = userid;
	}
	
	render() {
		const container = super.render();
		
		let closeButton;
		
		container.append(
			new HTML.div({class: "base-header"},
				closeButton = new HTML.div({class: "base-pillbutton bi-x-lg"})
			),
			new HTML.div({class: "user-override-manager-options-list"})
		);
		
		this.scroll = new Scrollable(container);
		
		new Interactable(closeButton, {
			activate: async () => {
				await this.save();
				this.remove();
			}
		});
		
		this.updateRendered(container);
		
		return container;
	}
	
	async updateRendered(el) {
		const optionsEl = el.querySelector(".user-override-manager-options-list");
		
		let options = [];
		
		for(let overridable of Overridable.overridables) {
			if(!overridable.user) continue;
			
			options.push(new Header({text: overridable.name}));
			
			const overrideKey = `user.${this.userid}.overrides.${overridable.id}`
			
			const enabledKey = `${overrideKey}.enabled`;
			const disabledKey = `${overrideKey}.disabled`;
			
			let forceEnabled = await Registry.getKey(enabledKey, []);
			let forceDisabled = await Registry.getKey(disabledKey, []);
			
			for(let override of overridable.all) {
				let buttonText = `${await overridable.checkEnabledFor(override, this.userid) ? "Yes" : "No"} (Default)`;
				if(forceEnabled.includes(override.id)) {
					buttonText = "Enabled";
				}
				if(forceDisabled.includes(override.id)) {
					buttonText = "Disabled";
				}
				
				options.push(
					new ButtonOption({
						label: override.name ?? override.id,
						buttonText,
						activate: async () => {
							const action = await OverlayMenu.ask({
								menu: [
									{
										text: "Enable",
										value: "enable"
									},
									{
										text: "Disable",
										value: "disable"
									},
									{
										text: "User default",
										value: "reset"
									}
								]
							})
							
							const loader = new LoadingScreen();
							loader.open();
							forceEnabled = forceEnabled.filter(id => id !== override.id);
							forceDisabled = forceDisabled.filter(id => id !== override.id);
							
							if(action == "enable") {
								forceEnabled.push(override.id);
							} else if(action == "disable") {
								forceDisabled.push(override.id);
							}
							
							await Registry.setKey(enabledKey, forceEnabled)
							await Registry.setKey(disabledKey, forceDisabled)
							
							await this.update();
							loader.remove();
						}
					})
				)
			}
		}
		
		
		const scrollOriginal = structuredClone(this.scroll.currentScrollTarget);
		optionsEl.innerHTML = "";
		new OptionList(options).renderTo(optionsEl);
		this.scroll.currentScrollTarget = scrollOriginal;
	}
	
	async save() {
	}
}

export default UserOverrideManager;