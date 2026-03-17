const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld("__YOUTUBE", {
	info: (videoURL) => ipcRenderer.invoke("youtubeInfo", {videoURL}),
	search: (query) => ipcRenderer.invoke("youtubeSearch", {query}),
	downloadToBlob: (videoID, _progressCallback) => { // TODO
		
		/*ipcRenderer.on("downloadUpdate", (download) => {
			if(download.id == )
			progressCallback()
		});*/
		
		return ipcRenderer.invoke("youtubeDownload", {
			videoURL: "https://www.youtube.com/watch?v="+videoID,
		});
	}
});
