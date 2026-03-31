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

ipcMain.handle("setVolume", async () => {
	
});

// TODO: test this more
ipcMain.handle("systemUpdate", async () => {
	const pull = await execPromise("git pull");
	const install = await execPromise("npm install");
	console.log(pull, install);
});
