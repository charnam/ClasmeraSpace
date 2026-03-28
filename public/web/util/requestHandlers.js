import ConnectMenu from "../menus/ConnectMenu/index.js";

const requestHandlers = {
	getPin: async res => {
		res(await ConnectMenu.getPIN());
	}
}

export default requestHandlers;