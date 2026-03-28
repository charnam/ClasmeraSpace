import handlers from "./handlers.js";
import Connection from "../../shared/Connection.mjs";

const socket = new WebSocket("/api");
const serverConnection = new Connection(socket, handlers);
window._conn = serverConnection;

await new Promise(res => socket.addEventListener("open", res));

export default serverConnection;
