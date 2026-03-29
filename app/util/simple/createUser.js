import Renderable from "../Renderable.js";
import Registry from "../system/Registry.js";

async function createUser(manager) {
	const id = crypto.randomUUID();
	const name = await manager.Keyboard.ask({prompt: "Please enter a name."});
	if(name.length == 0) {
		return;
	}
	
	
	await Registry.setKey(`user.${id}`, {
		id,
		name,
	})
	
	await Renderable.updateInstances();
}

export default createUser;