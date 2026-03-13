import systemSources from "./sources.json" with {type: "json"};
import userSources from "./UserVideoSources.js";

class VideoSources {
	static all = [];
	static byId = {};
	
	static async load(path, sources) {
		for(let source of sources) {
			const sourceObject = (await import(`${path}/${source}/index.js`)).default;
			sourceObject.id = source;
			this.byId[source] = sourceObject;
			this.all.push(sourceObject);
		}
	}
}

await VideoSources.load("./", systemSources);
await VideoSources.load("../../../../data/videosources", await userSources.scan());

export default VideoSources;