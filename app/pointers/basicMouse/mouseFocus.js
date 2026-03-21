import FocusManager from "../../util/FocusManager.js";
import Input from "../../util/Input.js";
import keyboardFocus from "./keyboardFocus.js";

const mouseFocus = new FocusManager();
let lastMouseInteraction = 0;

const backButton = new Input(mouseFocus, {
	name: "Right Click",
	roles: ["BASE_BACK"]
})

window.addEventListener("mousemove", event => {
	lastMouseInteraction = Date.now();
	mouseFocus.hoverAt(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
});

window.addEventListener("mousedown", (event) => {
	lastMouseInteraction = Date.now();
	if(event.button == 2) {
		backButton.setState(1);
	} else {
		mouseFocus.beginInteract();
	}
});
window.addEventListener("mouseup", event => {
	lastMouseInteraction = Date.now();
	if(event.button == 2) {
		backButton.setState(0);
	} else {
		mouseFocus.endInteract();
	}
});

export default mouseFocus;
