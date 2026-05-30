import SingleInstanceRenderable from "/app/util/SingleInstanceRenderable.js";

class PlayerCustomization extends SingleInstanceRenderable {
	style = this.autoStyleByImport(import.meta.url);
	
	render() {
		const target = super.render();
		
		target.classList.add("party-game-player-customization")
		
		return target;
	}
}

export default PlayerCustomization;