import Dialog from "../../app/renderable/Dialog/index.js";
import ConnectMenu from "../menus/ConnectMenu/index.js";

const handlers = {
	getPin: async () => {
		return await ConnectMenu.getPIN();
	},
	showDialog: async options => {
		return await Dialog.ask(options);
	}
};

export default handlers;