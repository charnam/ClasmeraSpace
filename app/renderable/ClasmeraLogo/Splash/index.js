import Interactable from "../../../util/Interactable.js";
import Overlay from "../../Overlay/index.js";
import ClasmeraLogo from "../index.js";

class Splash extends Overlay {
	style = this.autoStyleByImport(import.meta.url);
	constructor() {
		super();
		this.layer.isResetLayer = true;
	}
	
	render() {
		const target = super.render();
		target.classList.add("clasmera-logo-splash");
		const logo = new ClasmeraLogo().renderTo(target);
		
		new Interactable(logo, {
			activate: () => this.remove()
		});
		
		setTimeout(() => {
			this.remove();
		}, 5000);
		return target;
	}
}

export default Splash;