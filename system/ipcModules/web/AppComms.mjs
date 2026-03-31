import mainWindow from "../../mainWindow.mjs";

class AppComms {
	static async emit(type, data) {
		(await mainWindow).webContents.send("webMessage", {type, data});
	}
}

export default AppComms;