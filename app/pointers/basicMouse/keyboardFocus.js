import mouseFocus from "./mouseFocus.js";
import DefaultKeyboard from "../../renderable/DefaultKeyboard/index.js";
import DefaultPasscodeInput from "../../renderable/DefaultPasscodeInput/index.js";
import Interactions from "../../util/Interactions.js";
import Registry from "../../util/system/Registry.js";
import FocusManager from "../../util/FocusManager.js";
import Input from "../../util/Input.js";

let keyboardFocus = mouseFocus;
if(await Registry.getKey("system.config.useSeparateKeyboardFocus", true)) {
	keyboardFocus = new FocusManager();
}


const up = new Input(keyboardFocus, {
	name: "Up Arrow",
	roles: ["UP"]
});
const down = new Input(keyboardFocus, {
	name: "Down Arrow",
	roles: ["DOWN"]
});
const left = new Input(keyboardFocus, {
	name: "Left Arrow",
	roles: ["LEFT"]
});
const right = new Input(keyboardFocus, {
	name: "Right Arrow",
	roles: ["RIGHT"]
});

const select = new Input(keyboardFocus, {
	name: "Enter Key",
	roles: ["SELECT"]
});

const keymap = {
	"ArrowUp": new Input(keyboardFocus, {
		name: "Up Arrow",
		roles: ["UP"]
	}),
	"ArrowDown": new Input(keyboardFocus, {
		name: "Down Arrow",
		roles: ["DOWN"]
	}),
	"ArrowLeft": new Input(keyboardFocus, {
		name: "Left Arrow",
		roles: ["DEFAULT_KEYBOARD_LEFT", "LEFT"]
	}),
	"ArrowRight": new Input(keyboardFocus, {
		name: "Right Arrow",
		roles: ["DEFAULT_KEYBOARD_RIGHT", "RIGHT"]
	}),
	"Enter": new Input(keyboardFocus, {
		name: "Enter Key",
		roles: ["DEFAULT_KEYBOARD_SUBMIT", "SELECT"]
	}),
	"Shift": new Input(keyboardFocus, {
		name: "Shift Key",
		roles: ["DEFAULT_KEYBOARD_SHIFT"]
	})
};

const standardKeys = [
	..."1234567890QWERTYUIOPASDFGHJKLZXCVBNM",
	"BACKSPACE",
	"SPACE"
];
for(let key of standardKeys) {
	keymap[key] = new Input(keyboardFocus, {
		name: key+" Key",
		roles: ["DEFAULT_KEYBOARD_KEY_"+key]
	});
}

function mapKey(key) {
	if(key == " ") {
		return "SPACE";
	}
	
	
	return key.toUpperCase();
}

window.addEventListener("keydown", event => {
	if(keymap[event.key]) {
		keymap[event.key].setState(1.0);
	}
	if(keymap[mapKey(event.key)]) {
		keymap[mapKey(event.key)].setState(1.0);
	}
});
window.addEventListener("keyup", event => {
	if(keymap[event.key]) {
		keymap[event.key].setState(0.0);
	}
	if(keymap[mapKey(event.key)]) {
		keymap[mapKey(event.key)].setState(0.0);
	}
});

export default keyboardFocus;
