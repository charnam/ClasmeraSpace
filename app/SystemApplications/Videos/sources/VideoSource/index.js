import Video from "../../Video/index.js";
import SingleInstanceRenderable from "../../../../util/SingleInstanceRenderable.js";
import TabbedContainer from "../../../../renderable/TabbedContainer/index.js";

class VideoSource extends SingleInstanceRenderable {
	static name = "";
	static Video = Video;
	
	render() {
		const target = super.render();
		target.classList.add("videos-app-source-tabbed-container");
		
		this.tabbed = new TabbedContainer({direction: "vertical"});
		this.tabbed.renderTo(target);
		
		return target;
	}
	
}

export default VideoSource;