import InteractionLayer from "./InteractionLayer.js";
import callToParents from "./simple/callToParents.js";

class Interactions {
	static focusManagers = [];
	static interactionLayers = [new InteractionLayer(document.getElementById("root"))];
	static availableTargets = [];
	static availableScrollers = []
	
	
	static getCurrentLayers() {
		const layers = [];
		for(let manager of this.focusManagers) {
			layers.push(this.getCurrentLayer(manager));
		}
		return layers;
	}
	static getCurrentLayer(manager) {
		const layers = this.interactionLayers.filter(layer => layer.shouldAffect(manager));
		return layers[layers.length-1];
	}
	static getAvailableTargets(manager) {
		return this.availableTargets.filter(target =>
			this.getCurrentLayer(manager).contains(target)
		 && target.element.checkVisibility());
	}
	static getAvailableLayers() {
		const layers = [...this.interactionLayers];
		const availableLayers = [];
		let currentLayer = layers.pop();
		while(currentLayer) {
			availableLayers.push(currentLayer);
			if(currentLayer.isResetLayer) {
				break;
			}
			currentLayer = layers.pop();
		}
		return availableLayers;
	}
	static updateMusic() {
		const layers = [...this.interactionLayers];
		let currentLayer = layers.pop();
		while(currentLayer && currentLayer.music.length == 0) {
			currentLayer = layers.pop();
		}
		if(!currentLayer) {
			return;
		}
		for(let layer of this.interactionLayers) {
			if(layer !== currentLayer && layer.musicIsPlaying) {
				layer.fadeOutMusic();
			}
		}
		if(!currentLayer.musicIsPlaying) {
			currentLayer.fadeInMusic();
		}
	}
	
	static addLayer(layer) {
		this.interactionLayers.push(layer);
		for(let manager of this.focusManagers) {
			manager.update();
		}
		this.updateMusic();
	}
	static removeLayer(removedLayer) {
		this.interactionLayers = this.interactionLayers.filter(layer => {
			return layer !== removedLayer && layer.element !== removedLayer;
		});
		removedLayer.fadeOutMusic();
		for(let manager of this.focusManagers) {
			manager.update();
		}
		this.updateMusic();
	}
	
	static makeSelectable(interactable) {
		this.availableTargets.push(interactable);
	}
	static makeScrollable(scrollable) {
		this.availableScrollers.push(scrollable);
	}
	
	static isInteractable(element, manager) {
		return this.getDirectInteractable(element, manager) !== undefined;
	}
	static isLayerAvailable(layer) {
		return this.getAvailableLayers().includes(layer);
	}
	
	static getInteractable(element, manager) {
		let target = null;
		callToParents(element, testTarget => {
			if(!target) {
				target = this.getDirectInteractable(testTarget, manager);
			}
		})
		return target;
	}
	
	static getDirectInteractable(element, manager) {
		return this.getAvailableTargets(manager).find(target => target.element == element);
	}
	
	static getScrollable(element) {
		let target = null;
		callToParents(element, testTarget => {
			if(!target && testTarget !== element) {
				target = this.getDirectScrollable(testTarget);
			}
		})
		return target;
	}
	
	static getDirectScrollable(element) {
		return this.availableScrollers.find(target => target.element == element);
	}
	
	
	static getAvailableInteractableInDirection(manager, target, direction) {
		const targetEl = target.element
		const targetRect = targetEl.getBoundingClientRect();
		const otherTargets = [];
		
		for(let otherTarget of this.getAvailableTargets(manager)) {
			if(otherTarget.element == targetEl) continue;
			otherTargets.push({
				element: otherTarget.element,
				score: this.getOffsetScore(targetRect, otherTarget.element.getBoundingClientRect(), direction)
			});
		}
		
		const sortedTargets = otherTargets.filter(target => target.score >= 0).sort((a,b) => a.score - b.score);
		
		if(sortedTargets.length > 0) {
			return sortedTargets[0].element;
		} else {
			return null;
		}
	}
	
	static getOffsetScore(rect1, rect2, direction = "up") {
		let score = 0;
		
		const rect1Center = {
			x: rect1.x + rect1.width / 2,
			y: rect1.y + rect1.height / 2
		};
		const rect2Center = {
			x: rect2.x + rect2.width / 2,
			y: rect2.y + rect2.height / 2
		};
		const minimumDistanceHori = rect1.width / 2;
		const minimumDistanceVert = rect1.height / 2;
		
		if(direction == "up" && Math.round(rect2Center.y) + minimumDistanceVert >= Math.round(rect1Center.y)) {
			return -1;
		}
		
		if(direction == "down" && Math.round(rect2Center.y) - minimumDistanceVert <= Math.round(rect1Center.y)) {
			return -1;
		}
		
		if(direction == "left" && Math.round(rect2Center.x) + minimumDistanceHori >= Math.round(rect1Center.x)) {
			return -1;
		}
		
		if(direction == "right" && Math.round(rect2Center.x) - minimumDistanceHori <= Math.round(rect1Center.x)) {
			return -1;
		}
		
		if(direction == "up" || direction == "down") {
			if(rect2.right < rect1.left) {
				score += 4000;
				//score += Math.abs(rect2.right - rect1.left);
			}
			if(rect2.left > rect1.right) {
				score += 4000;
				//score += Math.abs(rect2.left - rect1.right);
			}
			score += Math.abs(rect1Center.x - rect2Center.x) * 2;
		}
		
		if(direction == "left" || direction == "right") {
			if(rect2.bottom < rect1.top) {
				score += 4000;
				//score += Math.abs(rect2.bottom - rect1.top);
			}
			if(rect2.top > rect1.bottom) {
				score += 4000;
				//score += Math.abs(rect2.top - rect1.bottom);
			}
			score += Math.abs(rect1Center.y - rect2Center.y) * 2;
		}
		
		if(direction == "up") {
			score += Math.abs(rect1.y - rect2.bottom);
		}
		if(direction == "down") {
			score += Math.abs(rect1.bottom - rect2.y);
		}
		if(direction == "left") {
			score += Math.abs(rect1.x - rect2.right);
		}
		if(direction == "right") {
			score += Math.abs(rect1.right - rect2.x);
		}
		
		//score += Math.sqrt((rect1Center.x - rect2Center.x)**2 + (rect1Center.y - rect2Center.y)**2);
		
		return score;
	}
	
}

setInterval(() => {
	const currentLayers = Interactions.getCurrentLayers();
	const availableLayers = Interactions.getAvailableLayers();
	for(let layer of currentLayers) {
		layer.element.classList.add("active-layer");
	}
	for(let element of document.querySelectorAll(".active-layer")) {
		if(!currentLayers.some(layer => layer.element == element)) {
			element.classList.remove("active-layer");
		}
	}
	
	for(let layer of availableLayers) {
		layer.element.classList.add("available-layer");
	}
	for(let element of document.querySelectorAll(".available-layer")) {
		if(!availableLayers.some(layer => layer.element == element)) {
			element.classList.remove("available-layer");
		}
	}
}, 100);

export default Interactions;