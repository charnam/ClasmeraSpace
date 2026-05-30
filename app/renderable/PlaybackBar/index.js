import { HTML } from "imperative-html";
import SingleInstanceRenderable from "../../util/SingleInstanceRenderable.js";
import formatTimestamp from "../../util/simple/formatTimestamp.js";
import Interactable from "../../util/Interactable.js";
import InteractionLayer from "../../util/InteractionLayer.js";
import Interactions from "../../util/Interactions.js";

class PlaybackBar extends SingleInstanceRenderable {
	style = this.autoStyleByImport(import.meta.url);
	
	playtime = 0;
	duration = 0;
	
	constructor(details = {}) {
		super();
		this.onchange = details.onchange
	}
	
	render() {
		const target = super.render();
		target.classList.add("playback-bar")
		
		target.append(
			this.playtimeEl = new HTML.div({class: "playback-bar-playtime"}),
			this.playdurationEl = new HTML.div({class: "playback-bar-playduration"}),
			this.playbarEl = new HTML.div({class: "playback-bar-playbar"}),
		);
		
		new Interactable(this.playbarEl, {
			preactivate: async manager => {
				if(!this.onchange) return;
				
				const layer = new InteractionLayer(this.playbarEl, {affects: manager});
				Interactions.addLayer(layer);
				
				manager.addAttribute("scrubbing", target);
				
				let layerIsEnabled = true;
				let movementDeltaTarget = 0;
				let movementDelta = 0;
				
				layer.inputOverride = input => {
					if(!input.toggleStateChanged) return;
					
					if( (input.satisfiesRole("BASE_LEFT")  && input.isToggled) ||
						(input.satisfiesRole("BASE_RIGHT") && !input.isToggled)) {
						movementDeltaTarget -= 1;
					}
					
					if( (input.satisfiesRole("BASE_LEFT")  && !input.isToggled) ||
						(input.satisfiesRole("BASE_RIGHT") && input.isToggled)) {
						movementDeltaTarget += 1;
					}
					
					if(input.isToggled && (
						input.satisfiesRole("BASE_SELECT") || input.satisfiesRole("BASE_BACK")
					)) {
						Interactions.removeLayer(layer);
						manager.clearAttribute("scrubbing");
						layerIsEnabled = false;
					}
				};
				
				while(layerIsEnabled) {
					movementDelta += (movementDeltaTarget - movementDelta) / 5;
					if(Math.abs(movementDelta) > 0.1) this.onchange(movementDelta);
					await new Promise(res => setTimeout(res, 10));
				}
			}
		})
		
		return target;
	}
	
	updateRendered(target) {
		target.querySelector(".playback-bar-playtime").innerText = formatTimestamp(this.playtime);
		target.querySelector(".playback-bar-playduration").innerText = formatTimestamp(this.duration);
		target.setAttribute("style", `--progress: ${this.playtime / this.duration}`);
	}
}

export default PlaybackBar;