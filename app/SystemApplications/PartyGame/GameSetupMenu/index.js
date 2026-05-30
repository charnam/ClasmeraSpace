import { HTML } from "imperative-html";
import VisualOverlay from "../../../../renderable/VisualOverlay/index.js";
import Interactable from "../../../../util/Interactable.js";

class GameSetupMenu extends VisualOverlay {
	style = this.autoStyleByImport(import.meta.url);
	
	constructor(name, optionList, algebraic) {
		super();
		this.name = name;
		this.optionList = optionList;
		this.callback = callback;
	}
	
	render() {
		const target = super.render();
		target.classList.add("party-game-game-setup-menu")
		
		const backButton = new HTML.div({class: "party-game-game-setup-menu-back-button base-pillbutton bi-arrow-left"});
		
		target.append(backButton);
		target.append(new HTML.h1(this.name));
		target.append(this.optionList.render());
		
		let playButton;
		target.append(
			playButton = new HTML.div({class: "base-button party-game-game-setup-menu-start-button"})
		)
		
		new Interactable(backButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		})
		
		return target;
	}
}

export default GameSetupMenu;