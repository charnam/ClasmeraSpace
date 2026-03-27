import "./pointers/index.js";
import InteractionLayer from "../app/util/InteractionLayer.js";
import Interactions from "../app/util/Interactions.js";
import MainMenu from "./menus/MainMenu/index.js";
import globalServerConnection from "./util/globalServerConnection.js";

const root = document.getElementById("root");
const layer = new InteractionLayer(document.body, {isResetLayer: true});
Interactions.addLayer(layer);

new MainMenu().renderTo(root);
