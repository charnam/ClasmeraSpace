
class Connection {
	
	replyHandlers = {};
	
	constructor(websocket, actions) {
		this.websocket = websocket;
		this.actions = actions ?? {};
		
		websocket.addEventListener("message", event => {
			const unparsedMessage = event.data;
			let message = null;
			try {
				message = JSON.parse(unparsedMessage);
			} catch(err) {
				console.warn("Received invalid message", unparsedMessage);
				return;
			}
			
			if(message.action) {
				this.handleAction(message);
			}
			if(message.replyTo) {
				const handler = this.replyHandlers[message.replyTo];
				if(handler) {
					handler(message.data);
				}
			}
		})
	}
	
	async handleAction(message) {
		const action = this.actions[message.action];
		
		if(typeof action !== "function") {
			console.warn("Unknown action", message.action);
			return;
		}
		
		const replyData = await action(message.data)
		this.reply(message.id, replyData);
	}
	
	request(data) {
		data.id = crypto.randomUUID();
		this.websocket.send(JSON.stringify(data));
		return data.id;
	}
	
	invoke(action, data) {
		const id = this.request({action, data});
		return new Promise(res => {
			this.replyHandlers[id] = res;
		})
	}
	
	reply(to, data) {
		return this.request({replyTo: to, data});
	}
	
}

export default Connection;
