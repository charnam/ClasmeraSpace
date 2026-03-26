import { HTML } from "imperative-html";
import VisualOverlay from "../VisualOverlay/index.js";
import Interactable from "../../util/Interactable.js";

class Dialog extends VisualOverlay {
	style = [...this.style, "app//renderable/Dialog/main.css"];
	
	prompt = "Are you sure you want to continue?";
	buttons = [
		{
			text: "Yes",
			activate: () => {}
		},
		{
			text: "No",
			activate: () => {}
		}
	]
	
	constructor(details) {
		super();
		this.prompt = details.prompt;
		this.buttons = details.buttons;
	}
	
	render() {
		const overlay = super.render();
		overlay.classList.add("dialog-overlay");
		
		let prompt,
			buttons;
		
		overlay.append(
			new HTML.div({class: "base-popup dialog"},
				prompt = new HTML.div({class: "dialog-prompt"}),
				buttons = new HTML.div({class: "dialog-buttons"})
			)
		)
		
		prompt.innerText = this.prompt;
		
		for(let button of this.buttons) {
			const buttonEl = new HTML.div({class: "base-button"});
			buttons.append(buttonEl);
			
			buttonEl.innerText = button.text;
			new Interactable(buttonEl, {
				activate: button.activate
			});
		}
		
		return overlay;
	}
	
	static ask(details) {
		return new Promise(res => {
			const dialog = new this({
				prompt: details.prompt,
				buttons: details.buttons.map(button => {
					button.activate = () => {
						res(button.value);
						dialog.remove();
					}
					return button;
				})
			});
			dialog.open();
		});
	}
	
	static showUnfinishedMessage() {
		this.ask({
			prompt: "Sorry, this feature has not been added yet.\nCheck back later!",
			buttons: [
				{
					text: "Okay"
				}
			]
		})
	}
	
}

export default Dialog;