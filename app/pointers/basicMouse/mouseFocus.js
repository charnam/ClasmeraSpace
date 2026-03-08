import FocusManager from "../../util/FocusManager.js";
import Interactions from "../../util/Interactions.js";

const mouseFocus = new FocusManager();

window.addEventListener("mousemove", event => {
	if(Interactions.getInteractable(event.target)) {
		mouseFocus.hover(event.target);
	} else {
		mouseFocus.unhover();
	}
});

window.addEventListener("mousedown", (event) => {
	if(Interactions.getInteractable(event.target)) {
		mouseFocus.hover(event.target);
	}
	mouseFocus.beginInteract();
});
window.addEventListener("mouseup", event => {
	mouseFocus.endInteract();
});

export default mouseFocus;
