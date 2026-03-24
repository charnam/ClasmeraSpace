import mouseFocus from "./mouseFocus.js";
import DefaultKeyboard from "../../renderable/DefaultKeyboard/index.js";
import DefaultPasscodeInput from "../../renderable/DefaultPasscodeInput/index.js";
import Interactions from "../../util/Interactions.js";
import Registry from "../../util/system/Registry.js";
import FocusManager from "../../util/FocusManager.js";
import Input from "../../util/Input.js";

let keyboardFocus = mouseFocus;
if(await Registry.getKey("system.config.useSeparateKeyboardFocus", false)) {
	keyboardFocus = new FocusManager();
}

const keymap = {
	"ArrowUp": new Input(keyboardFocus, {
		name: "Up Arrow",
		roles: ["BASE_UP"]
	}),
	"ArrowDown": new Input(keyboardFocus, {
		name: "Down Arrow",
		roles: ["BASE_DOWN"]
	}),
	"ArrowLeft": new Input(keyboardFocus, {
		name: "Left Arrow",
		roles: ["BASE_LEFT"]
	}),
	"ArrowRight": new Input(keyboardFocus, {
		name: "Right Arrow",
		roles: ["BASE_RIGHT"]
	}),
	"Enter": new Input(keyboardFocus, {
		name: "Enter Key",
		roles: ["BASE_SELECT"]
	}),
	"Shift": new Input(keyboardFocus, {
		name: "Shift Key",
		roles: ["DEFAULT_KEYBOARD_SHIFT"]
	}),
	"Backspace": new Input(keyboardFocus, {
		name: "Backspace Key",
		roles: ["BASE_BACK"]
	}),
	"BrowserBack": new Input(keyboardFocus, {
		name: "Back",
		roles: ["BASE_BACK", "DEFAULT_KEYBOARD_BACKSPACE"]
	}),
	"MediaFastForward": new Input(keyboardFocus, {
		name: "Fast-forward",
		roles: ["PLAYER_SKIP_FORWARD"]
	}),
	"MediaRewind": new Input(keyboardFocus, {
		name: "Rewind",
		roles: ["PLAYER_SKIP_BACK"]
	}),
	"MediaTrackNext": new Input(keyboardFocus, {
		name: "Fast-forward",
		roles: ["PLAYER_SKIP_FORWARD_TRACK"]
	}),
	"MediaTrackPrevious": new Input(keyboardFocus, {
		name: "Rewind",
		roles: ["PLAYER_SKIP_BACK_TRACK"]
	}),
	"MediaPlayPause": new Input(keyboardFocus, {
		name: "Pause/play",
		roles: ["PLAYER_PLAY_PAUSE"]
	}),
	"BrowserSearch": new Input(keyboardFocus, {
		name: "Search",
		roles: ["BASE_SEARCH"]
	}),
	"PageUp": new Input(keyboardFocus, {
		name: "Page Up",
		roles: ["BASE_SCROLL_UP_PAGE"]
	}),
	"PageDown": new Input(keyboardFocus, {
		name: "Page Down",
		roles: ["BASE_SCROLL_DOWN_PAGE"]
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
