const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__WEB', {
	handle: (message, callback) => {
		ipcRenderer.on("webMessage", (_event, opt) => {
			console.log(opt);
			
			if(opt.type == message) {
				callback(opt.data);
			}
		})
	}
});

