import { app, BrowserWindow } from 'electron'
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

if(!existsSync("./data/")) {
	mkdirSync("data");
}

if(!existsSync("./data/blobs/")) {
	mkdirSync("data/blobs");
}

if(!existsSync("./data/overrides/")) {
	mkdirSync("data/overrrides");
}

if(!existsSync("./temp/")) {
	mkdirSync("temp");
}

await import("./system/ipcModules/app.mjs");
await import("./system/ipcModules/generate_preload.mjs");

function createWindow() {
	const win = new BrowserWindow({
		backgroundColor: "black",
		frame: false,
		webPreferences: {
			preload: path.join(path.resolve(path.dirname('')), "temp/preload_generated.js"),
			webviewTag: true
		}
	});
	
	win.loadFile('index.html');
}

app.whenReady().then(createWindow)