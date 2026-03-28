import "./pointers/index.js";
import MainMenu from "./menus/MainMenu/index.js";
import ConnectionHelpers from "./util/ConnectionHelpers.js";

await ConnectionHelpers.ensureAuthPermission("admin");

new MainMenu().renderTo(root);
