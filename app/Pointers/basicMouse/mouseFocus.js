import FocusManager from "../../util/FocusManager.js";
import Input from "../../util/Input.js";
import keyboardFocus from "./keyboardFocus.js";

const mouseFocus = new FocusManager();
let lastMouseInteraction = 0;

const selectButton = new Input(mouseFocus, {
	name: "Left Click",
	roles: ["BASE_SELECT"]
})
const backButton = new Input(mouseFocus, {
	name: "Right Click",
	roles: ["BASE_BACK"]
})
const scrollUp = new Input(mouseFocus, {
	name: "Scroll-wheel up",
	roles: ["BASE_SCROLL_UP"]
})
const scrollDown = new Input(mouseFocus, {
	name: "Scroll-wheel down",
	roles: ["BASE_SCROLL_DOWN"]
})


const scrollChangedCheck = input => {
	input._mouseScrollChangedCheck = Date.now();
	setTimeout(() => {
		if(input._mouseScrollChangedCheck < Date.now() - 150) {
			input.setState(0);
		}
	}, 200);
}
window.addEventListener("wheel", event => {
	const scrollSpeed = Math.abs(event.deltaY) * 0.05;
	if(event.deltaY > 0) {
		scrollDown.setState(scrollSpeed);
		scrollChangedCheck(scrollDown);
	}
	if(event.deltaY < 0) {
		scrollUp.setState(scrollSpeed);
		scrollChangedCheck(scrollUp);
	}
});

window.addEventListener("mousemove", event => {
	lastMouseInteraction = Date.now();
	mouseFocus.hoverAt(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
});

window.addEventListener("mousedown", (event) => {
	lastMouseInteraction = Date.now();
	if(event.button == 2) {
		backButton.setState(1);
	} else {
		selectButton.setState(1);
	}
});
window.addEventListener("mouseup", event => {
	lastMouseInteraction = Date.now();
	if(event.button == 2) {
		backButton.setState(0);
	} else {
		selectButton.setState(0);
	}
});

export default mouseFocus;
