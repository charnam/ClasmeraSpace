import Input from "../../../app/util/Input.js";
import FocusManager from "../../../app/util/FocusManager.js";
import Interactions from "../../../app/util/Interactions.js";

const mouseFocus = new FocusManager();

const selectButton = new Input(mouseFocus, {
	name: "Left Click",
	roles: ["BASE_SELECT"]
});

window.addEventListener("wheel", event => {
	const scrollable = Interactions.getScrollable(event.target);
	if(scrollable) {
		scrollable.scrollBy(0, event.deltaY);
	}
});

window.addEventListener("mousemove", event => {
	mouseFocus.hoverAt(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
});

window.addEventListener("mousedown", (event) => {
	if(event.button == 0) {
		selectButton.setState(1);
	}
});
window.addEventListener("mouseup", event => {
	if(event.button == 0) {
		selectButton.setState(0);
	}
});

export default mouseFocus;
