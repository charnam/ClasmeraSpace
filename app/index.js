import "./pointers/index.js";
import Overlay from "./renderable/Overlay/index.js";
import BackgroundShader from "./renderable/BackgroundShader/index.js";
import InitialLoginComponent from "./renderable/InitialLoginComponent/index.js";

const background = new BackgroundShader();
const InitialLogin = new InitialLoginComponent();

Overlay.wrapRenderable(background);
Overlay.wrapRenderable(InitialLogin);