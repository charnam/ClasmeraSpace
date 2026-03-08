import Renderable from "../../util/Renderable.js";

class Application extends Renderable {
	static id = "Application";
	
	static Icon = class ApplicationIcon extends Renderable {
		style = [...this.style, "Applications/Application/icon.css"];
		render() {
			const icon = super.render()
			icon.classList.add("application-icon");
			return icon;
		}
	}
	
	static LargeIcon = class LargeApplicationIcon extends Application.Icon {
		style = [...this.style, "Applications/Application/icon-large.css"];
		render() {
			const icon = super.render()
			icon.classList.add("application-icon-large");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.Icon {
		style = [...this.style, "Applications/Application/icon-small.css"];
		render() {
			const icon = super.render()
			icon.classList.add("application-icon-small");
			return icon;
		}
	}
	
}

export default Application;
