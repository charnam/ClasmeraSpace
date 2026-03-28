import LoadingScreen from "../../app/renderable/LoadingScreen/index.js";
import serverConnection from "./serverConnection.js";

class ConnectionHelpers {
	static async ensureAuthPermission(permission) {
		const loader = new LoadingScreen();
		loader.open();
		if((await serverConnection.invoke("checkPermission", permission))) {
			loader.remove();
			return;
		}
		
		await Dialog.ask({
			prompt: "When you're ready, click the button below, and a short code will be displayed on the other device.",
			buttons: [
				{
					text: "Show code",
					value: null
				}
			]
		})
		
		await serverConnection.invoke("requestPermission", permission);
		loader.remove();
		
	}
	
}

export default ConnectionHelpers;