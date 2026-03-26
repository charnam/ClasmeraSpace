let registry = localStorage.getItem("registry") ?? await fetch("./system/initialRegistry.json").then(e => e.text());

try {
	registry = JSON.parse(registry);
} catch(err) {
	localStorage.setItem("registry-bck", registry);
	registry = await fetch("./system/initialRegistry.json").then(e => e.json());
}

class Registry {
	static registry = registry;
	//static fallbackRegistry = fallbackRegistry;
	
	static async update() {
		localStorage.setItem("registry", JSON.stringify(this.registry));
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
		/*const keywrapper = this.getKeyWrapper(keyname);
		const blobId = keywrapper.tree[keywrapper.key];
		return await Blobs.getById(blobId);*/
	}
	static async setBlob(keyname, buffer) {
		/*const keywrapper = this.getKeyWrapper(keyname);
		keywrapper.tree[keywrapper.key] = await Blobs.store(buffer);*/
	}
	
}

export default Registry;