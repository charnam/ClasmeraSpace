import bcrypt from "bcryptjs";
import Keyboard from "../Keyboard/index.js";
import LoadingScreen from "../LoadingScreen/index.js";

class PasscodeInput extends Keyboard {
	constructor(details) {
		super(details);
		
		if(details.hash) {
			this.hash = details.hash;
		}
	}
	
	async checkPassword() {
		if(!this.hash) return true;
		
		console.log(this.currentInput);
		const loader = new LoadingScreen();
		loader.open();
		const out = await bcrypt.compare(this.currentInput, this.hash);
		loader.remove();
		
		return out;
	}
	
	static async check(details) {
		const loader = new LoadingScreen();
		const pin = await this.ask(details);
		loader.open();
		const out = await bcrypt.compare(pin, details.hash);
		loader.remove();
		return out;
	}
}

export default PasscodeInput;
