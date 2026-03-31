import bcrypt from "bcryptjs";
import Keyboard from "../Keyboard/index.js";
import LoadingScreen from "../LoadingScreen/index.js";
import Registry from "../../util/system/Registry.js";

class PasscodeInput extends Keyboard {
	constructor(details) {
		super(details);
		
		if(details.hash) {
			this.hash = details.hash;
		}
	}
	
	async checkPassword() {
		if(!this.hash) return true;
		
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
	
	static async validateUser(id) {
		const hash = await Registry.getKey(`user.${id}.pin`);
		if(hash) {
			return await this.check({prompt: "Enter PIN to continue", hash});
		} else {
			return true;
		}
	}
}

export default PasscodeInput;
