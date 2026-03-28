
class ClientConnection {

	connection = null;
	needsAuth = null;

	constructor(socket) {
		this.connection = socket;
		this.connection.addEventListener("message", msg => {
			let data;
			try {
				data = JSON.parse(msg.data);
			} catch(err) {
				return;
			}
			
			console.log(data);
			this.handleRequest(data);
		});
	}

	async messageReceived(check = () => true) {
		return new Promise(res => {
			this.connection.addEventListener("message", msg => {
				const data = JSON.parse(msg.data);

				if (check(data)) {
					res(data);
				}
			});
		});
	}

	request(action, data, requestId) {
		const responseId = crypto.randomUUID();
		this.connection.send(JSON.stringify({
			action, data, requestId, responseId
		}));
		return responseId;
	}

	respond(requestId, data) {
		return this.request(null, data, requestId);
	}

	async invoke(action, data) {
		const responseId = this.request(action, data);
		return await this.messageReceived(msg => msg.requestId == responseId);
	}

	async handleRequest(msg) {
		if (msg.responseId) return;

		const handler = this.session?.actionHandlers?.[msg.action];

		if (typeof handler !== "function") {
			console.warn("Handler for", msg.action, "not found!");
			return false;
		}

		handler(data => {
			this.respond(msg.requestId, data);
		});
	}
}

export default ClientConnection;