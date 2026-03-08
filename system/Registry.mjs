import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import Blobs from "./Blobs.mjs";

let initialRegistry = {
	user: {
		admin: {
			id: "admin",
			name: "Admin",
			administrator: true
		}
	}
}
if(existsSync("./data/registry.json")) {
	try {
		const registryFileContent = (await readFile("./data/registry.json")).toString();
		initialRegistry = JSON.parse(registryFileContent);
	} catch(err) { throw new Error("Registry is unreadable! Stopping here for safety.") }
}

class Registry {
	static registry = initialRegistry;
	
	static async update() {
		await writeFile("./data/registry.json", JSON.stringify(this.registry, null, 4));
	}
	
	static getKeyWrapper(key) {
		let currentTree = this.registry;
		const keyTree = key.split(".");
		
		while(keyTree.length > 1) {
			const currentKey = keyTree.shift();
			if(!currentTree[currentKey]) {
				currentTree[currentKey] = {};
			}
			currentTree = currentTree[currentKey];
		}
		
		return {
			tree: currentTree,
			key: keyTree[0]
		}
	}
	
	static async getKey(keyname, fallback) {
		const keywrapper = this.getKeyWrapper(keyname);
		const value = keywrapper.tree[keywrapper.key];
		return (typeof value !== "undefined") ? value : fallback;
	}
	
	static async setKey(keyname, value) {
		if(keyname == "") {
			throw new Error("Cannot reset main registry tree");
		}
		
		const keywrapper = this.getKeyWrapper(keyname);
		keywrapper.tree[keywrapper.key] = value;
		
		await this.update();
		
	}
	
	static async getBlob(keyname) {
		const keywrapper = this.getKeyWrapper(keyname);
		const blobId = keywrapper.tree[keywrapper.key];
		return await Blobs.getById(blobId);
	}
	static async setBlob(keyname, buffer) {
		const keywrapper = this.getKeyWrapper(keyname);
		keywrapper.tree[keywrapper.key] = await Blobs.store(buffer);
	}
	
}

export default Registry;