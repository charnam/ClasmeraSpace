import polyfill from "../../../system/ipcModules/overrides/browser-pollyfill.mjs";
export default globalThis.__OVERRIDES ?? polyfill;