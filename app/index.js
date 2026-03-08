import "./pointers/index.js";
import Overlay from "./Overlay/index.js";
import InitialLoginComponent from "./InitialLoginComponent/index.js";

const InitialLogin = new InitialLoginComponent();

Overlay.fromRenderable(InitialLogin);