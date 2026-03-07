
class SoundManager {
	
	sounds = {};
	
	constructor(basepath, sounds) {
		for(let [id, src] of Object.entries(sounds)) {
			this.sounds[id] = new Audio(basepath+"/"+src);
		}
	}
	
	playSound(sound, volume = 1) {
		this.sounds[sound].currentTime = 0;
		this.sounds[sound].volume = volume;
		this.sounds[sound].play();
	}
}

export default SoundManager;