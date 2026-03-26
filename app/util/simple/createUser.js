import Renderable from "../Renderable.js";

async function createUser(manager) {
	const id = crypto.randomUUID();
	const name = await manager.Keyboard.ask({prompt: "Please enter a name."});
	
	await Registry.setKey(`user.${id}`, {
		id,
		name,
	})
	
	await Renderable.updateInstances();
}

export default createUser;