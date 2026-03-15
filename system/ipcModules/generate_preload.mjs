// For some reason, Electron still does not support
// using `require` inside of preload files.

// We have to create one large preload by concatenating
// the contents of all preload.js files here, and wrapping
// their contents with curly brackets. Oh, man...

import path from "path";
import { readFile, writeFile } from "fs/promises";
import ipcModules from "./ipcModulesList.mjs";

let outputString = "";

for(let module of ipcModules) {
	outputString += "{"+(await readFile(path.join(import.meta.dirname, module, "preload.js"))).toString()+"}";
}

writeFile("./temp/preload_generated.js", outputString);
