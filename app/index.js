import "./pointers/index.js";
import UserSessionManager from "./UserSessionManager/index.js";

const USM = new UserSessionManager();

const root = document.getElementById("root");
USM.render(root);