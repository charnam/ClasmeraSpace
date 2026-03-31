import Connection from "../../../public/shared/Connection.mjs";
import AppComms from "./AppComms.mjs";

class Session {
	static PINExpireTimeMinutes = 10;
	static sessionExpireTimeMinutes = 60;
	
	permissions = {};
	connection = null;
	
	actions = {
		checkPermission: (permission) => false,
		requestPermission: async (permission) => {
			let userPIN = null;
			let genPIN;
			
			do {
				genPIN = Math.round(Math.random() * 89999 + 10000);
				AppComms.emit("pinDisplay", genPIN);
				let attempts = 0;
				while(attempts < 3 && userPIN != genPIN) {
					if(attempts >= 1 && userPIN != genPIN) {
						await this.connection.invoke("dialog", {
							prompt: "Invalid PIN. Please re-read and try again.",
							buttons: [
								{
									text: "OK",
									value: true
								}
							]
						});
					}
					userPIN = await this.connection.invoke("getPin");
					attempts++;
				}
				if(userPIN != genPIN) {
					await this.connection.invoke("dialog", {
						prompt: "A new PIN must be generated after 3 failed attempts. When you are ready, click the button below.",
						buttons: [
							{
								text: "Retry",
								value: true
							}
						]
					});
				}
			} while(userPIN != genPIN)
			
			return false;
		}
	}
	
	lastActivity = Date.now();
	get isSessionActive() {
		return this.lastActivity < Date.now() - 60000;
	}
	setSessionActive() {
		this.lastActivity = Date.now();
	}
	
	constructor(ws) {
		this.setSessionActive();
		this.connection = new Connection(ws, this.actions);
	}
	
}

export default Session;