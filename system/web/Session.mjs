
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
	
	constructor(websocket) {
		this.setSessionActive();
		this.connection = websocket;
		
		this.connection.on("message", msg => {
			this.handleMessage(msg);
		});
	}
	
	handleMessage(msg) {
		let parsed;
		try {
			parsed = JSON.parse(msg);
		} catch(err) {
			return false;
		}
		
		if(msg.action) {
			this.handleAction(msg.action, msg.data ?? {});
		}
	}
	
	static async messageReceived(check = () => true) {
		return new Promise(res => {
			this.connection.addEventListener("message", msg => {
				let data;
				try {
					data = JSON.parse(msg.data);
				} catch(err) {
					return;
				}
				
				if (check(data)) {
					res(data);
				}
			});
		});
	}
	
	request(action, data, responseId) {
		const requestId = crypto.randomUUID();
		this.connection.send(JSON.stringify({
			action, data, requestId, responseId
		}));
		return requestId;
	}
	
	respond(responseId, data) {
		return this.request(null, data, responseId);
	}

	async invoke(action, data) {
		const requestId = this.request(action, data);
		return await this.messageReceived(msg => msg.responseId == requestId);
	}

	async handleRequest(msg) {
		
	}
	
	handleAction(action, data) {
		
		switch(action) {
			case "authenticate":
				if(this.authRes) {
					this.authRes(data.pin == this.authPin);
				}
				break;
		}
		
	}
	
	emitMessage(msg) {
		this.connection.send(JSON.stringify(msg));
	}
	
	getAdminPin() {
		return new Promise(res => {
			this.authPin = Math.round(Math.random() * 89999 + 10000);
			this.authRes = res;
			this.emitMessage({type: "getPin"});
		});
	}
	
	handleRequestPermission(permission) {
		if(!this.permissions[permission]) {
			
		}
	}
	
}

export default Session;