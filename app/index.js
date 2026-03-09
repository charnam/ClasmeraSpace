import "./pointers/index.js";
import Overlay from "./Overlay/index.js";
import BackgroundShader from "./BackgroundShader/index.js";
import InitialLoginComponent from "./InitialLoginComponent/index.js";

const background = new BackgroundShader();
const InitialLogin = new InitialLoginComponent();

Overlay.wrapRenderable(background);
Overlay.wrapRenderable(InitialLogin);