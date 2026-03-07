import InteractionLayer from "./InteractionLayer.js";

class Interactions {
	static focusManagers = [];
	static interactionLayers = [new InteractionLayer(document.getElementById("root"))];
	static availableTargets = [];
	
	static getCurrentLayer() {
		return this.interactionLayers[this.interactionLayers.length-1];
	}
	static getAvailableTargets() {
		return this.availableTargets.filter(target =>
			this.getCurrentLayer().contains(target)
		 && target.element.checkVisibility());
	}
	
	static addLayer(layer) {
		this.interactionLayers.push(layer);
		for(let manager of this.focusManagers) {
			manager.update();
		}
	}
	static removeLayer(removedLayer) {
		this.interactionLayers = this.interactionLayers.filter(layer => {
			return layer !== removedLayer && layer.element !== removedLayer;
		});
	}
	
	static makeSelectable(interactable) {
		this.availableTargets.push(interactable);
	}
	
	static isInteractable(element) {
		return this.getDirectInteractable(element) !== undefined;
	}
	
	static getInteractable(element) {
		let testTarget = element;
		let target = null;
		while(!target && testTarget) {
			target = this.getDirectInteractable(testTarget);
			testTarget = testTarget.parentElement;
		}
		return target;
	}
	
	static getDirectInteractable(element) {
		return this.getAvailableTargets().find(target => target.element == element);
	}
	
	
	static getInteractableInDirection(target, direction) {
		const targetEl = target.element
		const targetRect = targetEl.getBoundingClientRect();
		const otherTargets = [];
		
		for(let otherTarget of this.getAvailableTargets()) {
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
		
		if(direction == "up" && rect2Center.y >= rect1Center.y) {
			return -1;
		}
		
		if(direction == "down" && rect2Center.y <= rect1Center.y) {
			return -1;
		}
		
		if(direction == "left" && rect2Center.x >= rect1Center.x) {
			return -1;
		}
		
		if(direction == "right" && rect2Center.x <= rect1Center.x) {
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
		}
		
		score += Math.sqrt((rect1Center.x - rect2Center.x)**2 + (rect1Center.y - rect2Center.y)**2);
		
		return score;
	}
	
}

export default Interactions;