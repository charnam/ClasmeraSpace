import mouseFocus from "./mouseFocus.js";
import DefaultKeyboard from "../../renderable/DefaultKeyboard/index.js";
import DefaultPasscodeInput from "../../renderable/DefaultPasscodeInput/index.js";
import Interactions from "../../util/Interactions.js";
import Registry from "../../util/system/Registry.js";
import FocusManager from "../../util/FocusManager.js";

let keyboardFocus = mouseFocus;
if(await Registry.getKey("system.config.useSeparateKeyboardFocus", true)) {
	keyboardFocus = new FocusManager();
}

window.addEventListener("keydown", event => {
	switch(event.key) {
		case "ArrowUp":
			keyboardFocus.moveFocus("up");
			break;
		case "ArrowDown":
			keyboardFocus.moveFocus("down");
			break;
		case "ArrowLeft":
			keyboardFocus.moveFocus("left");
			break;
		case "ArrowRight":
			keyboardFocus.moveFocus("right");
			break;
		case "Enter":
			if(event.repeat) break;
			keyboardFocus.beginInteract();
			break;
	}
});
window.addEventListener("keyup", event => {
	if(event.key == "Enter") {
		keyboardFocus.endInteract();
	}
});

export default keyboardFocus;
