import Overlay from "../renderable/Overlay/index.js";

class VideoPlayer extends Overlay {
	constructor(url) {
		if(url instanceof Blob) {
			url = URL.createObjectURL(url);
		}
		
		this.url = url;
	}
	
	render() {
		const rendered = super.render();
		
		rendered.append()
	}
}

export default VideoPlayer