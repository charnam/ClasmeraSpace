import SingleInstanceRenderable from "../../../../util/SingleInstanceRenderable.js";
import TabbedContainer from "../../../../renderable/TabbedContainer/index.js";

class VideoSource extends SingleInstanceRenderable {
	static name = "";
	
	render() {
		const target = super.render();
		target.classList.add("videos-app-source-tabbed-container");
		
		this.tabbed = new TabbedContainer({direction: "vertical"});
		this.tabbed.renderTo(target);
		
		return target;
	}
	
}

export default VideoSource;