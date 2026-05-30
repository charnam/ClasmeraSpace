const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__HOST', {
	createServer: async (...paths) => {
		const namespace = crypto.randomUUID();
		const details = await ipcRenderer.invoke("host-create", {dirnames: paths, namespace});
		
		return {
			port: details.port,
			on: (event, callback) => {
				if(event == "connect") {
					ipcRenderer.on("host-websocket-connect", (_event, socket) => {
						if(socket.namespace == namespace) {
							callback({
								on: (event, callback) => {
									if(event == "message") {
										ipcRenderer.on("host-websocket-message", (_event, message) => {
											if(message.socketId == socket.socketId) {
												callback(message.message);
											}
										})
									} else if(event == "disconnect") {
										ipcRenderer.on("host-websocket-disconnect", (_event, message) => {
											if(message.socketId == socket.socketId) {
												callback();
											}
										})
									}
								},
								send: (data) => {
									ipcRenderer.emit("host-websocket-send", {
										socketId: socket.socketId,
										message: data
									});
								}
							})
						}
					})
				}
			},
			send(message) {
				ipcRenderer.emit("host-websocket-emit", {
					namespace,
					message
				});
			},
			close: () => {
				ipcRenderer.emit("host-close-server", {namespace});
			}
		}
	}
});

