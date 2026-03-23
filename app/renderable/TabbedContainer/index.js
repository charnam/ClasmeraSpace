import Renderable from "../../util/Renderable.js";
import Tabbed from "../../util/Tabbed.js";
import Tab from "./Tab/index.js";

class TabbedContainer extends Renderable {
	style = [...this.style, "app/renderable/TabbedContainer/main.css"];
	direction = "horizontal";
	
	tabButtons = null;
	tabs = null;
	
	tabbed = null;
	
	constructor(details = {}) {
		super();
		this.direction = details.direction ?? this.direction;
	}
	
	renderTabButtons() {
		const target = super.render();
		target.classList.add("tabbed-container-tab-buttons");
		target.classList.add("tabbed-container-direction-"+this.direction);
		this.tabButtons = target;
		return target;
	}
	
	renderTabContents() {
		const target = super.render();
		target.classList.add("base-tabbed");
		target.classList.add("tabbed-container-tab-contents");
		target.classList.add("tabbed-container-direction-"+this.direction);
		this.tabs = target;
		this.tabbed = new Tabbed(this.tabs);
		return target;
	}
	
	render() {
		const target = super.render();
		target.classList.add("tabbed-container");
		
		target.append(
			new HTML.div({class: "base-header tabbed-container-header"},
				this.renderTabButtons()
			),
			this.renderTabContents()
		);
		
		return target;
	}
	
	createTab(details) {
		return new Tab({...details, container: this});
	}
}

export default TabbedContainer;