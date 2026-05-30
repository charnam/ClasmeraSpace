import Interactable from "../../util/Interactable.js";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";

class BackButton extends SingleInstanceRenderable {
	style = this.autoStyleByImport(import.meta.url);
	
	constructor(layer) {
		super();
		this.layer = layer;
	}
	
	render() {
		const target = super.render();
		
		let backButton;
		target.append(
			backButton = new HTML.div({class: "base-pillbutton bi-arrow-left"})
		);
		
		new Interactable(backButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.layer.remove();
			}
		});
		
		return target;
	}
	
}

export default BackButton;