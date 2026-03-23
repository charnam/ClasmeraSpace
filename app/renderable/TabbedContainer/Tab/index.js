import { HTML } from "imperative-html";
import Interactable from "../../../util/Interactable.js";
import SingleInstanceRenderable from "../../../util/SingleInstanceRenderable.js";

class Tab extends SingleInstanceRenderable {
	style = [...this.style, "app/renderable/TabbedContainer/Tab/main.css"];
	
	tabId = "";
	tabIcon = "";
	tabName = "";
	
	constructor(details) {
		super();
		this.tabId = details.id;
		this.tabIcon = details.icon;
		this.tabName = details.name;
		this.container = details.container;
	}
	
	render() {
		const tabButton = new HTML.div({class: "tabbed-container-tab-button base-pillbutton "+this.tabIcon, hovertitle: this.tabName});
		const tabContents = super.render();
		
		this.container.tabs.append(tabContents);
		
		tabContents.classList.add("tabbed-container-tab-content");
		tabContents.classList.add("base-tabbed-tab");
		tabContents.setAttribute("tabid", this.tabId);
		
		this.container.tabButtons.append(tabButton);
		this.container.tabs.append(tabContents);
		
		new Interactable(tabButton, {
			activate: () => {
				this.container.tabbed.setTab(this.tabId);
			}
		});
		
		return tabContents;
	}
}

export default Tab;