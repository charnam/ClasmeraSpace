import { readdir } from "fs/promises";

let ipcModules = (await readdir(import.meta.dirname, {withFileTypes: true}))
					.filter(module => module.isDirectory())
					.map(module => module.name);

export default ipcModules;