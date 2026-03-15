import { ipcMain } from "electron";
import Download from "../../Download.mjs";

ipcMain.handle('getDownload', async (_event, query) => {
	return await Download.get(query.id);
});
