const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('__DOWNLOADS', {
	downloadToBlob: async (url, progressCallback) => {
		const downloadId = await ipcRenderer.invoke("startDownload", {url});
		
		let download = null;
		do {
			download = await ipcRenderer.invoke("getDownload", {id: downloadId});
			progressCallback(download);
			await ipcRenderer.invoke("awaitDownloadUpdate", {id: downloadId});
		} while(!download.complete);
		
		if(download.failed) {
			return false;
		} else {
			return download.data;
		}
	},
	get: (id) => ipcRenderer.invoke('getDownload', {id}),
	whenUpdated: (id) => ipcRenderer.invoke('awaitDownloadUpdate', {id}),
	whenComplete: (id) => ipcRenderer.invoke('awaitDownloadComplete', {id}),
})