import { app, BrowserWindow } from 'electron'
import path from 'path';

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
	
	return win;
}

export default app.whenReady().then(createWindow);