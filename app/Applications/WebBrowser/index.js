import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";

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
	
	style = [...this.style, "Applications/WebBrowser/main.css"];
	render() {
		const app = super.render();
		app.classList.add("browser-app");
		this.layer.music = "disabled";
		
		let backButton,
			forwardButton,
			urlBar;
		
		const navBar = new HTML.div({class: "browser-app-nav-bar"},
			backButton = new HTML.div({class: "browser-app-nav-bar-button browser-app-back-button"}),
			forwardButton = new HTML.div({class: "browser-app-nav-bar-button browser-app-forward-button"}),
			urlBar = new HTML.div({class: "browser-app-url-bar"})
		);
		
		new Interactable(backButton, {
			activate: () => {
				webview.goBack();
			}
		})
		new Interactable(forwardButton, {
			activate: () => {
				webview.goForward();
			}
		})
		new Interactable(urlBar, {
			activate: async manager => {
				const url = await manager.Keyboard.ask({prompt: "Search DuckDuckGo, or type a URL starting with https://"});
				
			}
		})
		
		const webview = document.createElement("webview");
		
		app.append(
			navBar,
			webview
		);
		
		return app;
	}
	
}

export default WebBrowser;
