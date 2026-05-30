import { HTML } from "imperative-html";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";
import Interactions from "../../util/Interactions.js";
import Overlay from "../../renderable/Overlay/index.js";
import Registry from "../../util/system/Registry.js";

class Application extends Overlay {
	static id = ""; // Auto-replaced with filename due to naming requirement
	
	static Icon = class ApplicationIcon extends SingleInstanceRenderable {
		style = this.autoStyleByImport(import.meta.url, "icon.css");
		render() {
			const icon = super.render()
			icon.classList.add("app-icon");
			icon.classList.add("base-app-icon");
			icon.append(
				new HTML.div({class: "app-icon-inner"},
					new HTML.div({class: "app-icon-foreground"}),
					new HTML.div({class: "app-icon-background"})
				)
			)
			return icon;
		}
	}
	
	static LargeIcon = class LargeApplicationIcon extends Application.Icon {
		style = this.autoStyleByImport(import.meta.url, "icon-large.css");
		animateDisappearDuration = 2000;
		render() {
			const icon = super.render()
			icon.classList.add("app-icon-large");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.Icon {
		style = this.autoStyleByImport(import.meta.url, "icon-small.css");
		render() {
			const icon = super.render()
			icon.classList.add("app-icon-small");
			return icon;
		}
	}
	
	style = this.autoStyleByImport(import.meta.url);
	animateDisappearDuration = 1000;
	
	constructor(launchedBy) {
		super();
		this.launchedBy = launchedBy;
	}
	
	async getLaunchingUser() {
		return await Registry.getKey(`user.${this.launchedBy}`);
	}
	
	render() {
		const app = super.render();
		this.layer.element = app;
		this.layer.isResetLayer = true;
		app.classList.add("app");
		Interactions.addLayer(this.layer);
		return app;
	}
	
	remove() {
		Interactions.removeLayer(this.layer);
		super.remove();
	}
}

export default Application;
