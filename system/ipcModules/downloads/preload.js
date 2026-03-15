const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__DOWNLOADS', {
	get: (id) => ipcRenderer.invoke('getDownload', {id}),
})