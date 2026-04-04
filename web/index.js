import "./pointers/index.js";
import BackgroundShader from "../app/renderable/BackgroundShader/index.js";
import MainMenu from "./menus/MainMenu/index.js";
import ConnectionHelpers from "./util/ConnectionHelpers.js";

await ConnectionHelpers.ensureAuthPermission("admin");

new BackgroundShader().renderTo(root);
new MainMenu().renderTo(root);
