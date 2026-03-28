
class Session {
	static PINExpireTimeMinutes = 10;
	static sessionExpireTimeMinutes = 60;
	
	permissions = {};
	connection = null;
	
	lastActivity = Date.now();
	get isSessionActive() {
		return this.lastActivity < Date.now() - 60000;
	}
	setSessionActive() {
		this.lastActivity = Date.now();
	}
	
	constructor(connection) {
		this.setSessionActive();
		this.connection = connection;
		connection.session = this;
		
		this.actionHandlers = {
			checkPermission: res => res(false),
			requestPermission: res => {
				const PIN = this.connection.invoke("getPin");
				console.log(PIN);
				res(false);
			}
		}
	}
	
}

export default Session;