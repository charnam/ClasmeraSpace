import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import Blobs from "./Blobs.mjs";

const initialRegistry = existsSync("./data/registry.json") ? await readFile("./data/registry.json") : {};

class Registry {
	static registry = initialRegistry;
	
	static async update() {
		await writeFile("./data/registry.json", this.registry);
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
	
	static async getKey(keyname) {
		const keywrapper = this.getKeyWrapper(keyname);
		return keywrapper.tree[keywrapper.key];
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