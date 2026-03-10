import Application from "../Application/index.js";

class Videos extends Application {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = [...this.style, "Applications/Videos/icon-large.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-videos");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = [...this.style, "Applications/Videos/icon-small.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-videos");
			return icon;
		}
	}
	
	static downloads = {};
	static startDownload(source) {
		
	}
	
	
	style = [...this.style, "Applications/Videos/main.css"];
	render() {
		const app = super.render();
		app.classList.add("videos-app");
		return app;
	}
	
}

export default Videos;
