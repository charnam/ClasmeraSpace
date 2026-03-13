import { app, BrowserWindow, ipcMain } from 'electron'
import Registry from './system/Registry.mjs';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { readdir } from 'fs/promises';
import Download from './system/Download.mjs';

if(!existsSync("./data/")) {
	mkdirSync("data");
}

if(!existsSync("./data/blobs/")) {
	mkdirSync("data/blobs");
}

if(!existsSync("./data/applications/")) {
	mkdirSync("data/applications");
}
if(!existsSync("./data/videosources/")) {
	mkdirSync("data/videosources");
}

function createWindow() {
	const win = new BrowserWindow({
		backgroundColor: "black",
		frame: false,
		webPreferences: {
			preload: path.join(path.resolve(path.dirname('')), "system/preload.js"),
			webviewTag: true
		}
	});
	
	win.loadFile('index.html');
}

app.whenReady().then(createWindow)

ipcMain.handle('getApps', async (_event) => {
	return await readdir("./data/applications");
});
ipcMain.handle('getVideoSources', async (_event) => {
	return await readdir("./data/videosources");
});

ipcMain.handle("ytdlp", async (_event, query) => {
	
	return  await Download.create();
})
ipcMain.handle('getDownload', async (_event, query) => {
	return await Download.get(query.id);
});
/*ipcMain.handle('updateDownload', async (_event, query) => {
	return await Download.update(query.id, query.apply);
});
ipcMain.handle('removeDownload', async (_event, query) => {
	return await Download.remove(query.id);
});*/

ipcMain.handle('readRegistry', (_event, query) => {
	return Registry.getKey(query.key, query.fallback);
});
ipcMain.handle('writeRegistry', (_event, query) => {
	return Registry.setKey(query.key, query.value);
});
ipcMain.handle('readRegistryBlob', (_event, query) => {
	return Registry.getBlob(query.key);
});
ipcMain.handle('writeRegistryBlob', (_event, query) => {
	return Registry.setBlob(query.key, query.value);
});
