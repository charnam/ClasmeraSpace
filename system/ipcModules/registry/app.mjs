import { ipcMain } from "electron";
import Registry from "../../Registry.mjs";
import Blobs from "../../Blobs.mjs";

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

ipcMain.handle('readBlob', (_event, query) => {
	return Blobs.getById(query.id);
});