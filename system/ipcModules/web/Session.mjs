import Connection from "../../../public/shared/Connection.mjs";

class Session {
	static PINExpireTimeMinutes = 10;
	static sessionExpireTimeMinutes = 60;
	
	permissions = {};
	connection = null;
	
	actions = {
		checkPermission: (permission) => false,
		requestPermission: async (permission) => {
			let PIN;
			while(PIN != 1234) {
				PIN = await this.connection.invoke("getPin");
			}
			
			const willParticipate = await this.connection.invoke("showDialog", {
				prompt: "Hello",
				buttons: [
					{
						text: "Hello",
						value: "yes"
					}
				]
			});
			
			console.log(willParticipate)
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