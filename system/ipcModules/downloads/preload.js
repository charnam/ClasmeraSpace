const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__DOWNLOADS', {
	get: (id) => ipcRenderer.invoke('getDownload', {id}),
	whenUpdated: (id) => ipcRenderer.invoke('awaitDownloadUpdate', {id}),
	whenComplete: (id) => ipcRenderer.invoke('awaitDownloadComplete', {id}),
})