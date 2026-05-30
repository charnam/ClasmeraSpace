import { HTML } from "imperative-html";
import Interactable from "../../../util/Interactable.js";
import SingleInstanceRenderable from "../../../util/SingleInstanceRenderable.js";

class Tab extends SingleInstanceRenderable {
	style = this.autoStyleByImport(import.meta.url);
	
	tabId = "";
	tabIcon = "";
	tabName = "";
	
	constructor(details) {
		super();
		this.tabId = details.id ?? crypto.randomUUID();
		this.tabIcon = details.icon;
		this.tabName = details.name;
		this.container = details.container;
	}
	
	render() {
		const tabButton = new HTML.div({class: "tabbed-container-tab-button base-pillbutton"});
		
		let hideTabIcon = false;
		if(this.tabIcon) {
			tabButton.classList.add(this.tabIcon);
			tabButton.setAttribute("hovertitle", this.tabName);
		} else if(this.tabName) {
			tabButton.innerText = this.tabName;
		} else {
			hideTabIcon = true;
		}
		
		const tabContents = super.render();
		
		this.container.tabs.append(tabContents);
		
		tabContents.classList.add("tabbed-container-tab-content");
		tabContents.classList.add("tabbed-container-direction-"+this.container.direction);
		tabContents.classList.add("base-tabbed-tab");
		tabContents.setAttribute("tabid", this.tabId);
		
		this.container.tabs.append(tabContents);
		
		if(!hideTabIcon) {
			this.container.tabButtons.append(tabButton);
			new Interactable(tabButton, {
				activate: () => {
					this.container.tabbed.setTab(this.tabId);
				}
			});
		}
		
		return tabContents;
	}
}

export default Tab;