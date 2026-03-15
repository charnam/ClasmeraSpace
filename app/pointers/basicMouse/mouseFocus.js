import FocusManager from "../../util/FocusManager.js";
import Interactions from "../../util/Interactions.js";
import keyboardFocus from "./keyboardFocus.js";

const mouseFocus = new FocusManager();
let lastMouseInteraction = 0;

window.addEventListener("mousemove", event => {
	lastMouseInteraction = Date.now();
	if(Interactions.getInteractable(event.target)) {
		mouseFocus.hover(event.target);
	} else {
		mouseFocus.unhover();
	}
});

window.addEventListener("mousedown", (event) => {
	lastMouseInteraction = Date.now();
	if(Interactions.getInteractable(event.target)) {
		mouseFocus.hover(event.target);
	}
	mouseFocus.beginInteract();
});
window.addEventListener("mouseup", event => {
	lastMouseInteraction = Date.now();
	mouseFocus.endInteract();
});

setInterval(() => {
	if(lastMouseInteraction < Date.now() - 3000) {
		document.body.setAttribute("style", "cursor: none !important;");
		if(mouseFocus !== keyboardFocus) {
			mouseFocus.unhover();
		}
	} else {
		document.body.style.cursor = "";
	}
}, 100)

export default mouseFocus;
