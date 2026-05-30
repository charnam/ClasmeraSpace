import { HTML } from "imperative-html";
import VisualOverlay from "../../../renderable/VisualOverlay/index.js";

class MusicPlayer extends VisualOverlay {
	style = this.autoStyleByImport(import.meta.url);
	
	render() {
		const target = super.render();
		
		target.append(
			new HTML.div({class: "videos-app-music-player"},
				
			)
		)
		
		return target;
	}
}

export default MusicPlayer;
