import Dialog from "../../app/renderable/Dialog/index.js";
import LoadingScreen from "../../app/renderable/LoadingScreen/index.js";
import requestHandlers from "./requestHandlers.js";

class ServerConnection {
	
	connection = null;
	needsAuth = null;
	
	static createConnection() {
		return new Promise(res => {
			const connection = new WebSocket("/api");
			
			connection.addEventListener("open", () => {
				this.connection = connection;
				res();
			})
			
			connection.addEventListener("message", msg => {
				const data = JSON.parse(msg.data);
				this.handleMessage(data);
			});
		})
	}
	
	static async messageReceived(check = () => true) {
		return new Promise(res => {
			this.connection.addEventListener("message", msg => {
				const data = JSON.parse(msg.data);
				
				if(check(data)) {
					res(data);
				}
			});
		});
	}
	
	static request(action, data, responseId) {
		const requestId = crypto.randomUUID();
		this.connection.send(JSON.stringify({
			action, data, requestId, responseId
		}));
		return requestId;
	}
	
	static respond(responseId, data) {
		return this.request(null, data, responseId);
	}
	
	static async invoke(action, data) {
		const requestId = this.request(action, data);
		return await this.messageReceived(msg => msg.responseId == requestId);
	}
	
	static async handleRequest(msg) {
		if(msg.responseId) return;
		
		const handler = requestHandlers[msg.type];
		
		if(typeof handler !== "function") {
			console.warn("Handler for", msg.type, "not found!");
			return false;
		}
		
		handler(data => {
			this.respond(msg.responseId, data);
		});
	}
}

export default ServerConnection;