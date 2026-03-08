import Interactions from "./Interactions.js";

class Scrollable {
	element = null;
	currentScrollTarget = {x: 0, y: 0};
	
	padding = 80;
	maximumSpeed = Infinity;
	
	constructor(element, details = {}) {
		this.element = element;
		Interactions.makeScrollable(this);
		if(details.padding) {
			this.padding = details.padding;
		}
		
		this.animate();
	}
	
	animate() {
		if(this.element) {
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
		let scrollAmountX = 0;
		let scrollAmountY = 0;
		
		if(containerRect.x > elementRect.x) {
			scrollAmountX -= containerRect.x - elementRect.x + this.padding;
		} else if(containerRect.right < elementRect.right) {
			scrollAmountX -= containerRect.right - elementRect.right - this.padding;
		}
		
		if(containerRect.y > elementRect.y) {
			scrollAmountY -= containerRect.y - elementRect.y + this.padding;
		} else if(containerRect.bottom < elementRect.bottom) {
			scrollAmountY -= containerRect.bottom - elementRect.bottom - this.padding;
		}
		
		this.scrollBy(scrollAmountX, scrollAmountY);
	}
}

export default Scrollable;