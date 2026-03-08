import { app, BrowserWindow, ipcMain } from 'electron'
import Registry from './system/Registry.mjs';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

if(!existsSync("./data/")) {
	mkdirSync("data");
}

if(!existsSync("./data/blobs/")) {
	mkdirSync("data/blobs");
}

function createWindow() {
	const win = new BrowserWindow({
		backgroundColor: "black",
		frame: false,
		webPreferences: {
			preload: path.join(path.resolve(path.dirname('')), "system/preload.js")
		}
	});
	
	win.loadFile('index.html');
}

app.whenReady().then(createWindow)

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
