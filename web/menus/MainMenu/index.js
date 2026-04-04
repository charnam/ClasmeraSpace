import { HTML } from "imperative-html";
import Overlay from "../../../app/renderable/Overlay/index.js";
import Interactable from "../../../app/util/Interactable.js";
import TabbedContainer from "../../../app/renderable/TabbedContainer/index.js";

class MainMenu extends Overlay {
	
	tabbed = new TabbedContainer();
	
	render() {
		const overlay = super.render();
		
		overlay.append(
			new HTML.div({class: "base-header"}, 
				this.tabbed.renderTabButtons()
			),
			this.tabbed.renderTabContents()
		);
		
		this.tabbed.createTab({
			icon: "bi-feather",
			name: "Test"
		}).render();
		
		return overlay;
	}
	
	
}

export default MainMenu;