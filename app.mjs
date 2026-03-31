import { app } from 'electron';
import { existsSync, mkdirSync } from 'fs';

if(!existsSync("./data/")) {
	mkdirSync("data");
}

if(!existsSync("./data/blobs/")) {
	mkdirSync("data/blobs");
}

if(!existsSync("./data/overrides/")) {
	mkdirSync("data/overrides");
}

if(!existsSync("./temp/")) {
	mkdirSync("temp");
}

await import("./system/ipcModules/app.mjs");
await import("./system/ipcModules/generate_preload.mjs");

import("./system/mainWindow.mjs");
