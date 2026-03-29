const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__NET', {
	getAddresses: () => ipcRenderer.invoke('getAddresses'),
});

