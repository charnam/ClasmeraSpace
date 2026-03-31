
class SoundManager {
	
	sounds = {};
	onQuickSuccession = null;
	
	constructor(basepath, sounds) {
		for(let [id, src] of Object.entries(sounds)) {
			this.sounds[id] = new Audio(basepath+"/"+src);
		}
	}
	
	lastSoundPlayback = 0;
	playSound(sound, volume = 1) {
		if(this.lastSoundPlayback > Date.now() - 200) {
			if(this.onQuickSuccession == "use-first") {
				return;
			} else if(this.onQuickSuccession == "use-last") {
				for(let sound of Object.values(this.sounds)) {
					sound.pause();
				}
			}
		}
		this.lastSoundPlayback = Date.now();
		
		this.sounds[sound].currentTime = 0;
		this.sounds[sound].volume = volume;
		this.sounds[sound].play();
	}
}

export default SoundManager;