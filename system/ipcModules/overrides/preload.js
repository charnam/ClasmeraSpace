const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("__OVERRIDES", {
	get: (name) => ipcRenderer.invoke("getOverride", {dirname: name})
});