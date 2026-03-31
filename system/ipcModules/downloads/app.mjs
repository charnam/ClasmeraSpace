import { ipcMain } from "electron";
import Download from "../../Download.mjs";
import Blobs from "../../Blobs.mjs";

const downloadingFiles = [];
ipcMain.handle('startDownload', async (_event, query) => {
	if(downloadingFiles[query.url]) {
		return downloadingFiles[query.url];
	}
	
	const downloadID = await Download.create();
	downloadingFiles[query.url] = downloadID;
	
	fetch(query.url)
		.then(async res => {
			const reader = res.body.getReader()
			const contentLength = +(res.headers.get('Content-Length') ?? 100000);
			const chunks = [];
			
			let receivedLength = 0;
			
			while (true) {
				const { done, value } = await reader.read();
				if (done) break; // Exit the loop when done
				chunks.push(value);
				receivedLength += value.length; // Update the received length
				
				Download.update(downloadID, {
					progress: receivedLength / contentLength,
					stages: 1,
					stage: 1
				});
			}
			
			const contentType = res.headers.get("Content-Type")?.split(";")[0];
			
			const buf = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
			Download.update(downloadID, {
				complete: true,
				data: await Blobs.store(buf, contentType)
			});
		})
	
	return downloadID;
});
ipcMain.handle('getDownload', async (_event, query) => {
	return await Download.get(query.id);
});
ipcMain.handle('awaitDownloadUpdate', async (_event, query) => {
	return (await Download.get(query.id)).updated();
});
ipcMain.handle('awaitDownloadComplete', async (_event, query) => {
	return (await Download.get(query.id)).completed();
});
