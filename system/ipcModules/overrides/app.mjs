import path from 'path';
import { ipcMain } from "electron";
import { existsSync } from 'fs';
import { readdir } from 'fs/promises';

ipcMain.handle("getOverride", async (_event, query) => {
	const dirname = query.dirname;
	if(!/^[a-zA-Z0-9\-_]+$/.test(dirname)) return false;
	
	const overridePath = path.join("./data/overrides/", dirname);
	
	if(!existsSync(overridePath)) {
		return [];
	} else {
		return await readdir(overridePath);
	}
})
