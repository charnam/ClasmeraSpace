import { applyToElement, HTML } from "imperative-html";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";
import Interactable from "../../util/Interactable.js";
import InteractionLayer from "../../util/InteractionLayer.js";
import Interactions from "../../util/Interactions.js";

class WebViewInteractable extends SingleInstanceRenderable {
	_src = "";
	get src() {
		return this._src;
	}
	set src(value) {
		this._src = value;
		this.updateRendered();
	}
	
	style = [...this.style, "app/renderable/WebViewInteractable/main.css"]
	render() {
		const container = super.render();
		
		let webview,
			cursorsEl;
		
		applyToElement(container, {class: "webview-container"},
			webview = document.createElement("webview"),
			cursorsEl = new HTML.div({class: "webview-cursors"})
		);
		
		this.el = webview;
		
		webview.src = this.src;
		
		new Interactable(container, {
			activate: manager => {
				const webviewLayer = new InteractionLayer(container, {affects: manager, shouldForceCursor: true});
				Interactions.addLayer(webviewLayer);
				let webviewBox = webview.getBoundingClientRect();
				const updateCursor = () => {
					webviewBox = webview.getBoundingClientRect();
					if(Interactions.interactionLayers.includes(webviewLayer)) {
						webview.sendInputEvent({type: "mouseMove", x: manager.cursorPosition.x - webviewBox.x, y: manager.cursorPosition.y - webviewBox.y});
						requestAnimationFrame(() => updateCursor());
					}
				};
				updateCursor();
				webviewLayer.inputOverride = input => {
					if(input.satisfiesRole("BASE_SELECT") && input.toggleStateChanged) {
						manager.cursorIsClicked = input.isToggled;
						if(input.isToggled) {
							webview.sendInputEvent({
								type: "mouseDown",
								x: manager.cursorPosition.x - webviewBox.x,
								y: manager.cursorPosition.y - webviewBox.y,
								clickCount: 1,
								button: "left"
							});
						} else {
							webview.sendInputEvent({
								type: "mouseUp",
								x: manager.cursorPosition.x - webviewBox.x,
								y: manager.cursorPosition.y - webviewBox.y,
								clickCount: 1,
								button: "left"
							});
						}
					}
					
					if(input.satisfiesRole("BASE_BACK") && input.isToggled) {
						Interactions.removeLayer(webviewLayer);
					}
				}
			}
		});
		
		webview.addEventListener("did-navigate", () => {
			this._src = webview.src;
			webview.setZoomFactor(1.25);
		});
		
		
		this.updateRendered();
		return container;
	}
	
	updateRendered() {
		if(
			this.element &&
			this.element.querySelector("webview") &&
			this.element.querySelector("webview").src !== this.src) {
			this.element.querySelector("webview").src = this.src;
		}
	}
}

export default WebViewInteractable;