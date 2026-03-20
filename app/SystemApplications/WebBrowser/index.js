import { HTML } from "imperative-html";
import Application from "../Application/index.js";
import Interactable from "../../util/Interactable.js";
import OverlayMenu from "../../renderable/OverlayMenu/index.js";
import Interactions from "../../util/Interactions.js";
import InteractionLayer from "../../util/InteractionLayer.js";

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
		
		let webview,
			cursorsEl;
		
		const webviewContainer = new HTML.div({class: "browser-app-webview-container"},
			webview = document.createElement("webview"),
			cursorsEl = new HTML.div({class: "browser-app-cursors"})
		);
		
		webview.src = "https://start.duckduckgo.com/";
		
		const updateWebview = () => {
			if(this.element) {
				webview.setZoomFactor(1.25)
				urlBar.innerText = webview.src;
				requestAnimationFrame(updateWebview);
			}
		}
		
		new Interactable(webviewContainer, {
			activate: manager => {
				const webviewLayer = new InteractionLayer(webviewContainer, {affects: manager});
				Interactions.addLayer(webviewLayer);
				
				const cursorEl = new HTML.div({class: "browser-app-webview-cursor"});
				cursorsEl.append(cursorEl);
				const cursorPosition = {
					x: 50, y: 50
				}
				const cursorTarget = {
					x: 50, y: 50
				}
				const cursorMovement = {
					x: 0, y: 0
				};
				let cursorIsClicked = false;
				const speed = 20;
				const cursorSpeedPerSecond = 10 / window.innerHeight;
				
				let lastFrameTime = Date.now();
				const animateCursor = () => {
					const webviewSize = webview.getBoundingClientRect();
					if(Interactions.getCurrentLayer(manager) == webviewLayer) {
						const deltaTime = (Date.now() - lastFrameTime) / 1000;
						
						cursorPosition.x += cursorMovement.x * deltaTime * cursorSpeedPerSecond;
						cursorPosition.y += cursorMovement.y * deltaTime * cursorSpeedPerSecond;
						
						cursorTarget.x = Math.max(0, Math.min(cursorTarget.x, webviewSize.width));
						cursorTarget.y = Math.max(0, Math.min(cursorTarget.y, webviewSize.height));
						
						cursorPosition.x += (cursorTarget.x - cursorPosition.x) * deltaTime * speed;
						cursorPosition.y += (cursorTarget.y - cursorPosition.y) * deltaTime * speed;
						
						cursorEl.style.left = cursorPosition.x + "px";
						cursorEl.style.top = cursorPosition.y + "px";
						
						requestAnimationFrame(animateCursor);
					}
				}
				animateCursor();
				
				webviewLayer.inputOverride = input => {
					
					if(input.satisfiesRole("BASE_LEFT") || input.satisfiesRole("BASE_RIGHT")) {
						cursorMovement.x = 0;
					}
					if(input.satisfiesRole("BASE_UP") || input.satisfiesRole("BASE_DOWN")) {
						cursorMovement.y = 0;
					}
					
					if(input.satisfiesRole("BASE_UP")) {
						cursorMovement.y -= input.value;
					}
					if(input.satisfiesRole("BASE_DOWN")) {
						cursorMovement.y += input.value;
					}
					if(input.satisfiesRole("BASE_LEFT")) {
						cursorMovement.x -= input.value;
					}
					if(input.satisfiesRole("BASE_RIGHT")) {
						cursorMovement.x += input.value;
					}
					
					if(input.satisfiesRole("BASE_BACK")) {
						Interactions.removeLayer(webviewLayer);
						cursorIsClicked = false;
						cursorEl.remove();
					}
				}
			}
		});
		
		app.append(
			navBar,
			webviewContainer
		);
		
		setTimeout(() => {
			updateWebview();
		}, 100);
		return app;
	}
}

export default WebBrowser;
