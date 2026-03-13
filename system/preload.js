const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__REGISTRY', {
	getKey: (key, fallback) => ipcRenderer.invoke('readRegistry', {key, fallback}),
	setKey: (key, value) => ipcRenderer.invoke('writeRegistry', {key, value}),
	getBlob: (key) => ipcRenderer.invoke('readRegistryBlob', {key}),
	setBlob: (key, value) => ipcRenderer.invoke('writeRegistryBlob', {key, value}),
})

contextBridge.exposeInMainWorld('__DOWNLOADS', {
	create: () => ipcRenderer.invoke('createDownload'),
	get: (id) => ipcRenderer.invoke('getDownload', {id}),
	update: (id, updates) => ipcRenderer.invoke('updateDownload', {id, apply: updates}),
	remove: (id) => ipcRenderer.invoke('removeDownload', {id}),
})

contextBridge.exposeInMainWorld('__APPS', {
	scan: () => ipcRenderer.invoke("getApps")
})
contextBridge.exposeInMainWorld('__VIDEO_SOURCES', {
	scan: () => ipcRenderer.invoke("getVideoSources")
})