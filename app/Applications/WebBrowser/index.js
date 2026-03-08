import Application from "../Application/index.js";

class WebBrowser extends Application {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = [...this.style, "Applications/WebBrowser/icon-large.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-web-browser");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = [...this.style, "Applications/WebBrowser/icon-small.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-web-browser");
			return icon;
		}
	}
	
}

export default WebBrowser;
