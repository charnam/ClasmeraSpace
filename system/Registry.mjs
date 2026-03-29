import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import Blobs from "./Blobs.mjs";

let initialRegistry = (await readFile("./system/initialRegistry.json")).toJSON();
let fallbackRegistry = {
	user: {
		name: "(Error)",
		administrator: false,
		permissions: {
			profilesettings: {
				icon: true,
				name: true
			}
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
	static fallbackRegistry = fallbackRegistry;
	
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
	
	static getKeyFallback(key) {
		let currentValue = this.fallbackRegistry;
		const keyTree = key.split(".");
		
		while(keyTree.length > 0 && currentValue !== undefined) {
			currentValue = currentValue[keyTree.shift()];
		}
		
		return currentValue;
	}
	
	static async getFallback(keyname) {
		let keypath = keyname.split(".");
		if(keypath[0] == "user" && keypath[1]) {
			const user = await this.getKey(`${keypath[0]}.${keypath[1]}`, false);
			if(!user) {
				return undefined;
			} else {
				keyname = keyname.split(".").toSpliced(1,1).join(".");
			}
		}
		return this.getKeyFallback(keyname);
	}
	
	static async getKey(keyname, fallback) {
		if(fallback === undefined) {
			fallback = await this.getFallback(keyname);
		}
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