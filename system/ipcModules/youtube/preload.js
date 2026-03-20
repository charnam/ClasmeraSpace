const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("__YOUTUBE", {
	info: (videoID) => ipcRenderer.invoke("youtubeInfo", {videoID}),
	search: (query) => ipcRenderer.invoke("youtubeSearch", {query}),
	getVideo: async (videoID, progressCallback) => {
		const downloadId = await ipcRenderer.invoke("youtubeDownload", {videoID});
		
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
	}
});
