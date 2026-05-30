import PartyGameGame from "../PartyGameGame/index.js";

class TextWriter extends PartyGameGame {
	style = this.autoStyleByImport(import.meta.url);
	
	render() {
		const target = super.render();
		
		target.append(
			
		);
		
		return target;
	}
}

export default TextWriter;