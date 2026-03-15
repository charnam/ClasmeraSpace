import Overridable from "../../../util/Overridable.js";
import basedir from "../../../util/simple/basedir.js";
import systemSources from "./sources.json" with {type: "json"};

const VideoSources = new Overridable();

await VideoSources.load(basedir(import.meta.url), systemSources);
await VideoSources.loadOverride("videosources");

export default VideoSources;