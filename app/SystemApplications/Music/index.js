import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Videos from "../Videos/index.js";

class Music extends Videos {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = this.autoStyleByImport(import.meta.url, "icon-large.css");
		render() {
			const icon = super.render();
			icon.classList.add("icon-music");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = this.autoStyleByImport(import.meta.url, "icon-small.css");
		render() {
			const icon = super.render();
			icon.classList.add("icon-music");
			return icon;
		}
	}
	
	static isMusicApp = true;
	static enableCondition = false; // THIS APP IS UNFINISHED
	
	style = this.autoStyleByImport(import.meta.url);
	render() {
		const app = super.render();
		app.classList.add("music-app");
		return app;
	}
}

export default Music;
