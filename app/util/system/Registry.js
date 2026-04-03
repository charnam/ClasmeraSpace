import polyfill from "../../../system/ipcModules/registry/browser-polyfill.mjs";
export default globalThis.__REGISTRY ?? polyfill;