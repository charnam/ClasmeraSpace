import Overlay from "../../../renderable/Overlay/index.js";
import Renderable from "../../../util/Renderable.js";
import Host from "../../../util/system/ipcModules/Host.js";

class PartyGameGame extends Overlay {
	static Icon = class Icon extends Renderable {
		style = this.autoStyleByImport(import.meta.url, "game-icon.css");
		render() {
			const target = super.render();
			target.classList.add("party-game-game-icon")
			return target;
		}
	}
	
	style = this.autoStyleByImport(import.meta.url);
	
	constructor() {
		super();
	}
	
	static async open() {
	}
	
	static async createServer(...paths) {
		return await Host.createServer(this.path(import.meta.url, "client"), ...paths);
	}
	
	// Renderable probably won't even be used here...
	render() {
		const target = super.render();
		target.classList.add("party-game-game")
		return target;
	}
}

export default PartyGameGame;