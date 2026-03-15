import path from "path";
import ipcModules from "./ipcModulesList.mjs";

for(let module of ipcModules) {
	await import(path.join(import.meta.dirname, module, "app.mjs"));
}