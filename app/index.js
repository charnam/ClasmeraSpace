import "./pointers/index.js";
import Overlay from "./Overlay/index.js";
import UserSessionManager from "./UserSessionManager/index.js";

const USM = new UserSessionManager();

Overlay.fromRenderable(USM);