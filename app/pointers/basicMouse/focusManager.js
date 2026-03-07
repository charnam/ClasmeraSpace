import FocusManager from "../../util/FocusManager.js";
import DefaultKeyboard from "../../DefaultKeyboard/index.js";
import Interactions from "../../util/Interactions.js";
import DefaultPasscodeInput from "../../DefaultPasscodeInput/index.js";

const focusManager = new FocusManager({
	Keyboard: DefaultKeyboard,
	PasscodeInput: DefaultPasscodeInput
});

window.addEventListener("mousemove", event => {
	if(Interactions.getInteractable(event.target)) {
		focusManager.hover(event.target);
	} else {
		focusManager.unhover();
	}
});

window.addEventListener("mousedown", (event) => {
	if(Interactions.getInteractable(event.target)) {
		focusManager.hover(event.target);
		focusManager.beginInteract();
	}
});
window.addEventListener("mouseup", event => {
	if(Interactions.getInteractable(event.target)) {
		focusManager.hover(event.target);
		focusManager.endInteract();
	}
});

window.addEventListener("keydown", event => {
	switch(event.key) {
		case "ArrowUp":
			focusManager.moveFocus("up");
			break;
		case "ArrowDown":
			focusManager.moveFocus("down");
			break;
		case "ArrowLeft":
			focusManager.moveFocus("left");
			break;
		case "ArrowRight":
			focusManager.moveFocus("right");
			break;
		case "Enter":
			focusManager.beginInteract();
			break;
	}
});
window.addEventListener("keyup", event => {
	if(event.key == "Enter") {
		focusManager.endInteract();
	}
});

export default focusManager;
