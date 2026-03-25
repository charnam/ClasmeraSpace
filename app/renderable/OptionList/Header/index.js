import Renderable from "../../../util/Renderable.js";

class Header extends Renderable {
	style = [...this.style, "app/renderable/OptionList/Header/main.css"];
	
	constructor(details) {
		super();
		if(details.text) {
			this.text = details.text;
		}
	}
	
	render() {
		const header = super.render();
		header.classList.add("option-list-header");
		
		header.innerText = this.text;
		
		return header;
	}
	
}

export default Header;