import "./pointers/index.js";
import ServerConnection from "./util/ServerConnection.js";
import MainMenu from "./menus/MainMenu/index.js";
import ConnectMenu from "./menus/ConnectMenu/index.js";

await ServerConnection.createConnection();
await ConnectMenu.ensureAuthPermission("admin");

new MainMenu().renderTo(root);
