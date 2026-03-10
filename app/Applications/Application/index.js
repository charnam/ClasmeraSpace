import { HTML } from "imperative-html";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";
import Interactions from "../../util/Interactions.js";
import InteractionLayer from "../../util/InteractionLayer.js";

class Application extends SingleInstanceRenderable {
	static id = ""; // Auto-replaced with filename due to naming requirement
	
	static Icon = class ApplicationIcon extends SingleInstanceRenderable {
		style = [...this.style, "Applications/Application/icon.css"];
		render() {
			const icon = super.render()
			icon.classList.add("app-icon");
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
		style = [...this.style, "Applications/Application/icon-large.css"];
		animateDisappearDuration = 2000;
		render() {
			const icon = super.render()
			icon.classList.add("app-icon-large");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.Icon {
		style = [...this.style, "Applications/Application/icon-small.css"];
		render() {
			const icon = super.render()
			icon.classList.add("app-icon-small");
			return icon;
		}
	}
	
	style = [...this.style, "Applications/Application/main.css"];
	layer = new InteractionLayer(null, {isResetLayer: true});
	
	open() {
		this.renderTo(document.getElementById("root"));
	}
	
	render() {
		const app = super.render();
		this.layer.element = app;
		app.classList.add("app");
		Interactions.addLayer(this.layer);
		return app;
	}
	
}

export default Application;
