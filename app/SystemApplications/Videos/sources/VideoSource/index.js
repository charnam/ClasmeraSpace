
class VideoSource {
	
	static showOptions() {
		
	}
	
	static async getFeatured() {
		return await this.search("Hello World");
	}
	
	static async search(query) {
		
	}
	
	static async download(id, progress = percentage => {}) {
		if(typeof id == "string") {
			return true;
		} else {
			return false;
		}
	}
}

export default VideoSource;