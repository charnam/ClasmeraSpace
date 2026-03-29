const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__SYSINFO', {
	getVersionInfo: () => ipcRenderer.invoke('getVersionInfo'),
	systemUpdate: () => ipcRenderer.invoke('systemUpdate'),
});

