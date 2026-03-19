const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("__YOUTUBE", {
	info: (videoURL) => ipcRenderer.invoke("youtubeInfo", {videoURL}),
	search: (query) => ipcRenderer.invoke("youtubeSearch", {query}),
	downloadToBlob: async (videoID, progressCallback) => {
		const downloadId = await ipcRenderer.invoke("youtubeDownload", {
			videoURL: "https://www.youtube.com/watch?v="+videoID,
		});
		
		let download = null;
		do {
			download = await ipcRenderer.invoke("getDownload", {id: downloadId});
			progressCallback(download);
			await ipcRenderer.invoke("awaitDownloadUpdate", {id: downloadId});
		} while(!download.complete);
		
		return download.blob;
	}
});
