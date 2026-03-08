const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__REGISTRY', {
	getKey: (key, fallback) => ipcRenderer.invoke('readRegistry', {key, fallback}),
	setKey: (key, value) => ipcRenderer.invoke('writeRegistry', {key, value}),
	getBlob: (key) => ipcRenderer.invoke('readRegistryBlob', {key}),
	setBlob: (key, value) => ipcRenderer.invoke('writeRegistryBlob', {key, value}),
})