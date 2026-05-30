import Renderable from "../../util/Renderable.js";

class ClasmeraLogo extends Renderable {
	style = this.autoStyleByImport(import.meta.url);
	
	render() {
		const logo = super.render();
		logo.classList.add("clasmera-logo");
		return logo;
	}
	
}

export default ClasmeraLogo;