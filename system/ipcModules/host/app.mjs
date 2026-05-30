import express from 'express';
import expressWs from 'express-ws';
import path from 'path';

import { readFile } from 'fs/promises';
import { statSync } from 'fs';
import { ipcMain } from 'electron';
import { getPortPromise } from 'portfinder';
import mainWindow from '../../mainWindow.mjs';

ipcMain.handle("host-create", async (_event, query) => {
	const targets = query.dirnames.map(dir => dir.replace(/^file\:\/\//, ""));
	const namespace = query.namespace;
	
	if(targets.some(target => !target.startsWith(process.cwd()))) throw new Error("Unsafe net host path", targets);
	
	const app = express();
	const port = await getPortPromise();
	
	expressWs(app);
	
	app.ws("/api", async function(ws, req) {
		const socketId = crypto.randomUUID();
		
		(await mainWindow).webContents.send("host-websocket-connect", {namespace, socketId});
		ws.on("message", async message => {
			(await mainWindow).webContents.send("host-websocket-message", {namespace, socketId, message});
		});
		ipcMain.on("host-websocket-send", (_event, obj) => {
			if(
				obj.socketId == socketId ||
				(obj.namespace == namespace && !obj.socketId)
			) {
				ws.emit(JSON.stringify(obj.message));
			}
		})
	});
	
	app.use("/app", express.static(path.join(process.cwd(), "app")));
	app.use("/shared", express.static(path.join(process.cwd(), "shared")));
	for(let target of targets) {
		app.use("/", express.static(target));
	}
	
	
	await new Promise(res => {
		const server = app.listen(port, () => {
			console.log("Opened localhost:" + port);
			res();
		});
		
		ipcMain.on("host-close-server", (_event, obj) => {
			if(obj.namespace == namespace) {
				server.close();
				console.log("Closed localhost:" + port);
			}
		});
	})
	
	return {
		port
	};
});
