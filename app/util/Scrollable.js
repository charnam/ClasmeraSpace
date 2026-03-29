import Interactable from "./Interactable.js";
import InteractionLayer from "./InteractionLayer.js";
import Interactions from "./Interactions.js";

class Scrollable {
	element = null;
	currentScrollTarget = {x: 0, y: 0};
	currentScrollMovement = {x: 0, y: 0};
	
	padding = 80;
	maximumSpeed = Infinity;
	buttonScrollSpeed = 10;
	
	constructor(element, details = {}) {
		this.element = element;
		Interactions.makeScrollable(this);
		if(details.padding) {
			this.padding = details.padding;
		}
		if(details.selectable) {
			new Interactable(element, {
				activate: manager => {
					const layer = new InteractionLayer(element, {affects: manager});
					Interactions.addLayer(layer);
					
					manager.addAttribute("scrolling", element);
					
					layer.inputOverride = input => {
						if(input.satisfiesRole("BASE_UP") || input.satisfiesRole("BASE_SCROLL_UP")) {
							this.currentScrollMovement.y = -this.buttonScrollSpeed * input.isToggled;
						}
						if(input.satisfiesRole("BASE_DOWN") || input.satisfiesRole("BASE_SCROLL_DOWN")) {
							this.currentScrollMovement.y = this.buttonScrollSpeed * input.isToggled;
						}
						if(input.satisfiesRole("BASE_LEFT") || input.satisfiesRole("BASE_SCROLL_LEFT")) {
							this.currentScrollMovement.x = -this.buttonScrollSpeed * input.isToggled;
						}
						if(input.satisfiesRole("BASE_RIGHT") || input.satisfiesRole("BASE_SCROLL_RIGHT")) {
							this.currentScrollMovement.x = this.buttonScrollSpeed * input.isToggled;
						}
						
						if(!input.isToggled && (
							input.satisfiesRole("BASE_SELECT") || input.satisfiesRole("BASE_BACK")
						)) {
							this.currentScrollMovement.x = 0;
							this.currentScrollMovement.y = 0;
							Interactions.removeLayer(layer);
							manager.clearAttribute("scrolling");
						}
					}
				}
			})
		}
		
		this.animate();
	}
	
	lastFrameTime = 0;
	animate() {
		let deltaTime = Math.min(Date.now() - this.lastFrameTime, 500) / 1000 * 120;
		this.lastFrameTime = Date.now();
		if(this.element) {
			this.currentScrollTarget.x += this.currentScrollMovement.x * deltaTime;
			this.currentScrollTarget.y += this.currentScrollMovement.y * deltaTime;
			
			this.validateScrollPosition();
			
			this.element.scrollTop +=
				Math.min(
					Math.max(
						-this.maximumSpeed, 
						(this.currentScrollTarget.y - this.element.scrollTop) / 10 * deltaTime
					),
					this.maximumSpeed
				);
			this.element.scrollLeft +=
				Math.min(
					Math.max(
						-this.maximumSpeed,
						(this.currentScrollTarget.x - this.element.scrollLeft) / 10 * deltaTime
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