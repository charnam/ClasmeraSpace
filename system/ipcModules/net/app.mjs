import { ipcMain } from "electron";
import { networkInterfaces } from "os";

ipcMain.handle("getAddresses", () => {
	const nets = networkInterfaces();
	
	const addresses =
		Object.values(nets).flat()
			.map(net => net.address)
			.filter(address => address !== "127.0.0.1" && address.split(".").length == 4);
	
	return addresses;
})