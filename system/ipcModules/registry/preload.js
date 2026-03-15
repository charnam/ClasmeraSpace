const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__REGISTRY', {
	getBlob: (id) => ipcRenderer.invoke('readBlob', {id}),
	
	getKey: (key, fallback) => ipcRenderer.invoke('readRegistry', {key, fallback}),
	setKey: (key, value) => ipcRenderer.invoke('writeRegistry', {key, value}),
	getRegistryBlob: (key) => ipcRenderer.invoke('readRegistryBlob', {key}),
	setRegistryBlob: (key, value) => ipcRenderer.invoke('writeRegistryBlob', {key, value}),
});

