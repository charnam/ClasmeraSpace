import { HTML } from "imperative-html";
import BackButton from "../../../../renderable/BackButton/index.js";
import Overlay from "../../../../renderable/Overlay/index.js";

class PartyGameGameLobby extends Overlay {
	style = this.autoStyleByImport(import.meta.url);
	
	constructor(server) {
		this.server = server;
	}
	
	render() {
		const target = super.render();
		target.classList.add("party-game-game-lobby");
		
		target.append(
			new HTML.div({class: "base-header"},
				new BackButton(this).render()
			)
		);
		
		
		
		return target;
	}
	
	async open() {
		await super.open();
		
		//this.server
		
	}
	
	startGame() {
		this.remove();
	}
}

export default PartyGameGameLobby;