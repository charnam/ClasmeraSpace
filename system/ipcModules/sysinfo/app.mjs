import { ipcMain } from "electron";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const fillin = () => ({stdout: "err"});

ipcMain.handle("getVersionInfo", async () => {
	const branch = (await execPromise("git branch --show-current")
		.catch(fillin))?.stdout?.trim() ?? "???";
	const hash = (await execPromise("git log -1 --pretty=format:\"%h\"")
		.catch(fillin))?.stdout?.trim() ?? "???";
	const rev = (await execPromise("git rev-list --count --all")
		.catch(fillin))?.stdout?.trim() ?? "???";
	
	return {
		branch,
		hash,
		rev,
		version: `${branch}:${hash} r.${rev}`
	};
});

ipcMain.handle("setVolume", async (_event, query) => {
	await execPromise(`pactl set-sink-volume @DEFAULT_SINK@ ${Math.min(Math.max(0, query.volume), 100)}%`)
});
ipcMain.handle("getVolume", async (_event, query) => {
	const output = (await execPromise(`pactl get-sink-volume @DEFAULT_SINK@`)).stdout;
	
	const matches = output.match(/([\d\.]+\%)/) ?? [100];
	
	return parseFloat(matches[0]);
});

// TODO: test this more
ipcMain.handle("systemUpdate", async () => {
	const pull = await execPromise("git pull");
	const install = await execPromise("npm install");
	console.log(pull, install);
});
