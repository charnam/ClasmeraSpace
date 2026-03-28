import ConnectMenu from "../menus/ConnectMenu/index.js";

const handlers = {
	getPin: async res => {
		res(await ConnectMenu.getPIN());
	}
}

export default handlers;