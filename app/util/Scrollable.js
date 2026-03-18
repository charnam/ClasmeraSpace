import Interactable from "./Interactable.js";
import InteractionLayer from "./InteractionLayer.js";
import Interactions from "./Interactions.js";

class Scrollable {
	element = null;
	currentScrollTarget = {x: 0, y: 0};
	
	padding = 80;
	maximumSpeed = Infinity;
	buttonScrollSpeed = 10;
	
	layer = new InteractionLayer();
	
	constructor(element, details = {}) {
		this.element = element;
		Interactions.makeScrollable(this);
		if(details.padding) {
			this.padding = details.padding;
		}
		if(details.selectable) {
			this.layer.element = element;
			new Interactable(element, {
				activate: () => {
					Interactions.addLayer(this.layer);
					
					this.layer.inputOverride = input => {
						
					}
					
					this.layer.onButtonPress = (button, manager) => {
						if(button == "up") {
							this.scrollBy(0, -this.buttonScrollSpeed);
						}
						if(button == "down") {
							this.scrollBy(0, this.buttonScrollSpeed);
						}
						if(button == "left") {
							this.scrollBy(-this.buttonScrollSpeed, 0);
						}
						if(button == "right") {
							this.scrollBy(this.buttonScrollSpeed, 0);
						}
					}
				}
			})
		}
		
		this.animate();
	}
	
	animate() {
		if(this.element) {
			this.validateScrollPosition();
			this.element.scrollTop +=
				Math.min(
					Math.max(
						-this.maximumSpeed, 
						(this.currentScrollTarget.y - this.element.scrollTop) / 10
					),
					this.maximumSpeed
				);
			this.element.scrollLeft +=
				Math.min(
					Math.max(
						-this.maximumSpeed,
						(this.currentScrollTarget.x - this.element.scrollLeft) / 10
					),
					this.maximumSpeed
				);
			requestAnimationFrame(() => this.animate());
		}
	}
	
	stopScrolling() {
		this.currentScrollTarget.x = this.element.scrollLeft;
		this.currentScrollTarget.y = this.element.scrollTop;
	}
	
	validateScrollPosition() {
		this.currentScrollTarget.x = Math.max(0, Math.min(this.currentScrollTarget.x, this.element.scrollWidth - this.element.clientWidth));
		this.currentScrollTarget.y = Math.max(0, Math.min(this.currentScrollTarget.y, this.element.scrollHeight - this.element.clientHeight));
	}
	
	scrollTo(x, y) {
		this.currentScrollTarget.x = x;
		this.currentScrollTarget.y = y;
	}
	
	scrollBy(x, y) {
		this.currentScrollTarget.x += x;
		this.currentScrollTarget.y += y;
	}
	
	scrollToInclude(element) {
		const containerRect = this.element.getBoundingClientRect();
		const elementRect = element.getBoundingClientRect();
		
		this.stopScrolling();
		
		let scrollAmountX = 0;
		let scrollAmountY = 0;
		
		if(containerRect.x > elementRect.x - this.padding) {
			scrollAmountX -= containerRect.x - elementRect.x + this.padding;
		} else if(containerRect.right < elementRect.right + this.padding) {
			scrollAmountX -= containerRect.right - elementRect.right - this.padding;
		}
		
		if(containerRect.y > elementRect.y - this.padding) {
			scrollAmountY -= containerRect.y - elementRect.y + this.padding;
		} else if(containerRect.bottom < elementRect.bottom + this.padding) {
			scrollAmountY -= containerRect.bottom - elementRect.bottom - this.padding;
		}
		
		this.scrollBy(scrollAmountX, scrollAmountY);
	}
}

export default Scrollable;