
class DeviceConnection {
	static PINExpireTimeMinutes = 10;
	static sessionExpireTimeMinutes = 60;
	
	id = "";
	permissions = {};
	
	lastActivity = Date.now();
	get isSessionActive() {
		return this.lastActivity < Date.now() - 60000;
	}
	setSessionActive() {
		this.lastActivity = Date.now();
	}
	
	constructor() {
		this.setSessionActive();
		this.id = crypto.randomUUID();
	}
	
	handleHTTPRequest() {
		
	}
	
	handleReceivePIN() {
		return new Promise(res => {
			
		});
	}
	
	handleRequestPermission(permission) {
		if(!this.permissions[permission]) {
			
		}
	}
	
}

export default DeviceConnection;