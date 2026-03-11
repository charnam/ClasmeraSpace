import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import OverlayMenu from "../../renderable/OverlayMenu/index.js";

class WebBrowser extends Application {
	static LargeIcon = class LargeApplicationIcon extends Application.LargeIcon {
		style = [...this.style, "app/SystemApplications/WebBrowser/icon-large.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-web-browser");
			return icon;
		}
	}
	static SmallIcon = class SmallApplicationIcon extends Application.SmallIcon {
		style = [...this.style, "app/SystemApplications/WebBrowser/icon-small.css"];
		render() {
			const icon = super.render();
			icon.classList.add("icon-web-browser");
			return icon;
		}
	}
	
	style = [...this.style, "app/SystemApplications/WebBrowser/main.css"];
	render() {
		const app = super.render();
		app.classList.add("browser-app");
		this.layer.music = "disabled";
		
		let backButton,
			forwardButton,
			urlBar,
			optionsButton;
		
		const navBar = new HTML.div({class: "browser-app-nav-bar base-header"},
			backButton = new HTML.div({class: "browser-app-nav-bar-button base-pillbutton bi-arrow-left"}),
			forwardButton = new HTML.div({class: "browser-app-nav-bar-button base-pillbutton bi-arrow-right"}),
			urlBar = new HTML.div({class: "browser-app-url-bar base-pillbutton"}),
			optionsButton = new HTML.div({class: "browser-app-nav-bar-button base-pillbutton bi-three-dots"}),
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
				if(url.includes("://")) {
					webview.src = url;
				} else {
					webview.src = "https://start.duckduckgo.com/?q="+encodeURIComponent(url);
				}
			}
		})
		new Interactable(optionsButton, {
			activate: () => {
				const menu = new OverlayMenu({
					menu: [
						{
							text: "Exit Internet",
							callback: () => this.remove()
						}
					]
				});
				menu.open();
			}
		})
		
		const webview = document.createElement("webview");
		webview.src = "https://start.duckduckgo.com/";
		
		const updateWebview = () => {
			if(this.element) {
				webview.setZoomFactor(1.25)
				urlBar.innerText = webview.src;
				requestAnimationFrame(updateWebview);
			}
		}
		
		app.append(
			navBar,
			webview
		);
		
		setTimeout(() => {
			updateWebview();
		}, 100);
		return app;
	}
}

export default WebBrowser;
