import { ipcMain } from "electron";

class AppComms {
	static async emit(type, data) {
		ipcMain.emit("webMessage", {type, data});
	}
}

export default AppComms;