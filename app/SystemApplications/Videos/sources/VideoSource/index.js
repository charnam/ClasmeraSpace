import { HTML } from "imperative-html";
import SingleInstanceRenderable from "../../../../util/SingleInstanceRenderable.js";
import Interactable from "../../../../util/Interactable.js";
import Tabbed from "../../../../util/Tabbed.js";
import Scrollable from "../../../../util/Scrollable.js";

class VideoSource extends SingleInstanceRenderable {
	static name = "";
	
	render() {
		const target = super.render();
		target.classList.add("videos-app-source-tabbed-container");
		
		let tabbed = null;
		
		target.append(
			new HTML.div({class: "videos-app-source-tabbed-sidebar base-sidebar"}),
			tabbed = new HTML.div({class: "videos-app-source-tabbed base-tabbed"})
		)
		
		this.tabbed = new Tabbed(tabbed);
		
		return target;
	}
	
	addTab(icon, id, target) {
		// Add sidebar button
		const sidebar = target.querySelector(".videos-app-source-tabbed-sidebar");
		const button = new HTML.div({class: "base-pillbutton"});
		
		button.classList.add(icon);
		
		sidebar.append(
			button
		);
		
		new Interactable(button, {
			activate: () => {
				this.tabbed.setTab(id);
			}
		});
		
		// Add tab contents
		const tab = new HTML.div({class: "base-tabbed-tab videos-app-source-tab", tabid: id});
		
		target.querySelector(".videos-app-source-tabbed").append(tab);
		
		new Scrollable(tab);
		
		return tab;
	}
	
}

export default VideoSource;