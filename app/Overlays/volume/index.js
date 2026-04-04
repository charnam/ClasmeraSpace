import Interactions from "../../util/Interactions.js";
import SysInfo from "../../util/system/ipcModules/SysInfo.js";
import VolumeBar from "./VolumeBar/index.js";

const VOLUME_ADJUSTMENT_POW = 1.8;

const bar = new VolumeBar();
bar.renderTo(document.getElementById("root"));

let volume = ((await SysInfo.getVolume() / 100) ** (1/VOLUME_ADJUSTMENT_POW)) * 100;
let volumeSlow = volume;
//await SysInfo.setVolume(volume);

bar.volume = volume;
bar.update();

let wasPressed = {};
function getTimeMultiplierFromWasPressed(name) {
	return (Date.now() - wasPressed[name]) / 500 + 0.2;
}

let lastTime = Date.now();
async function checkVolumeKeys() {
	const deltaTime = Math.min((Date.now() - lastTime) / 20, 5);
	lastTime = Date.now();
	
	if(Interactions.hasPressedInput("BASE_VOLUME_UP")) {
		if(wasPressed.volumeUp) {
			volume += deltaTime * getTimeMultiplierFromWasPressed("volumeUp");
		} else {
			wasPressed.volumeUp = Date.now();
		}
	} else {
		delete wasPressed.volumeUp;
	}
	if(Interactions.hasPressedInput("BASE_VOLUME_DOWN")) {
		if(wasPressed.volumeDown) {
			volume -= deltaTime * getTimeMultiplierFromWasPressed("volumeDown");
		} else {
			wasPressed.volumeDown = Date.now();
		}
	} else {
		delete wasPressed.volumeDown;
	}
	
	volume = Math.max(0, Math.min(volume, 100));
	
	if(Interactions.hasPressedInput("BASE_VOLUME_UP") && volume == 100) {
		volumeSlow += deltaTime * getTimeMultiplierFromWasPressed("volumeUp");
		volumeSlow = Math.min(volumeSlow, 100);
	} else {
		volumeSlow += (volume - volumeSlow) * deltaTime / 4;
	}
	bar.volume = volumeSlow;
	bar.update();
	requestAnimationFrame(checkVolumeKeys);
}
checkVolumeKeys();

let lastVolume = volume;
async function setVolumeLoop() {
	if(lastVolume !== volume) {
		await SysInfo.setVolume(((volume / 100) ** VOLUME_ADJUSTMENT_POW) * 100);
		lastVolume = volume;
	}
	requestAnimationFrame(setVolumeLoop);
}
setVolumeLoop();

export default {};