import handlers from "./handlers.js";
import Connection from "../../shared/Connection.mjs";
import Dialog from "../../app/renderable/Dialog/index.js";

const socket = new WebSocket("/api");
const serverConnection = new Connection(socket, handlers);
window._conn = serverConnection;

socket.addEventListener("close", () => {
	Dialog.ask({
		prompt: "You have been disconnected.\nPlease refresh the page.",
		buttons: []
	});
})

await new Promise(res => socket.addEventListener("open", res));

export default serverConnection;
