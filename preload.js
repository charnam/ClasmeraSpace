const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('Registry', {
	getKey: (key) => ipcRenderer.invoke('readRegistry', {key}),
	setKey: (key, value) => ipcRenderer.invoke('writeRegistry', {key, value}),
	getBlob: (key) => ipcRenderer.invoke('readRegistryBlob', {key}),
	setBlob: (key, value) => ipcRenderer.invoke('writeRegistryBlob', {key, value}),
})