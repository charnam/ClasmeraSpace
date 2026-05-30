import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import BackgroundShader from "../../renderable/BackgroundShader/index.js";
import Telephone from "./Telephone/index.js";
import Host from "../../util/system/ipcModules/Host.js";

class PartyGame extends Application {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = this.autoStyleByImport(import.meta.url, "icon-large.css");
		render() {
			const icon = super.render();
			icon.classList.add("icon-party-game");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = this.autoStyleByImport(import.meta.url, "icon-small.css");
		render() {
			const icon = super.render();
			icon.classList.add("icon-party-game");
			return icon;
		}
	}
	
	style = this.autoStyleByImport(import.meta.url);
	static enableCondition = false; // THIS APP IS UNFINISHED
	
	// TEMPORARY: Convert to overrides system
	games = [
		Telephone
	];
	
	render() {
		const app = super.render();
		app.classList.add("party-game");
		this.layer.music = this.path(import.meta.url, "home-bg.mp3");
		
		let backButton, partyGames;
		app.append(
			new BackgroundShader(this.path(import.meta.url, "background.glsl"), 2).render(),
			new HTML.div({class: "base-header"},
				backButton = new HTML.div({class: "base-pillbutton bi-arrow-left"}),
				new HTML.div({class: "base-pillbutton"}, "Party Games")
			),
			partyGames = new HTML.div({class: "party-game-games"})
		)
		
		for(let Game of this.games) {
			const icon = new Game.Icon().render();
			new Interactable(icon, {
				activate: () => {
					Game.open();
				}
			})
			partyGames.append(icon);
		}
		
		new Interactable(backButton, {
			roles: ["BASE_BACK"],
			activate: () => {
				this.remove();
			}
		})
		return app;
	}
}

export default PartyGame;
