
class Download {
	static current = {};
	static updatedPromises = {
		
	};
	
	static async create() {
		const id = crypto.randomUUID();
		this.current[id] = new Download(this);
		this.current[id].id = id;
		return id;
	}
	
	static async get(id) {
		return this.current[id];
	}
	
	static async update(id, apply) {
		const download = this.current[id];
		for(let [key, value] of Object.entries(apply)) {
			download[key] = value;
		}
		if(this.updatedPromises[id]) {
			this.updatedPromises[id].forEach(res => res());
		}
		this.updatedPromises[id] = [];
	}
	static async remove(id) {
		delete this.current[id];
		delete this.updatedPromises[id];
	}
	
	updated() {
		if(!this.constructor.updatedPromises[this.id]) {
			this.constructor.updatedPromises[this.id] = [];
		}
		
		return new Promise(res => {
			if(this.complete) {
				res();
			} else {
				this.constructor.updatedPromises[this.id].push(res);
			}
		});
	}
	async completed()  {
		while(!this.complete) {
			await this.updated();
		}
	}
	
	id = "";
	
	progress = null;
	stage = 0;
	stages = 1;
	complete = false;
	failed = false;
	data = null;
}

export default Download;
