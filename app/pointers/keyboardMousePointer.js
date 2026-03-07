import FocusManager from "../FocusManager.js";

const keyboardMousePointer = new FocusManager();
window.addEventListener("mousemove", event => {
	keyboardMousePointer.hover(event.target);
});

window.addEventListener("mousedown", () => {
	keyboardMousePointer.beginInteract();
});
window.addEventListener("mouseup", () => {
	keyboardMousePointer.endInteract();
});

window.addEventListener("keydown", event => {
	switch(event.key) {
		case "ArrowUp":
			keyboardMousePointer.moveFocus("up");
			break;
		case "ArrowDown":
			keyboardMousePointer.moveFocus("down");
			break;
		case "ArrowLeft":
			keyboardMousePointer.moveFocus("left");
			break;
		case "ArrowRight":
			keyboardMousePointer.moveFocus("right");
			break;
		case "Enter":
			keyboardMousePointer.beginInteract();
			break;
	}
});
window.addEventListener("keyup", event => {
	if(event.key == "Enter") {
		keyboardMousePointer.endInteract();
	}
});

export default keyboardMousePointer;
