import "./pointers/index.js";
import ServerConnection from "./util/serverConnection.js";
import MainMenu from "./menus/MainMenu/index.js";
import ConnectionHelpers from "./util/ConnectionHelpers.js";

await ServerConnection.createConnection();
await ConnectionHelpers.ensureAuthPermission("admin");

new MainMenu().renderTo(root);
