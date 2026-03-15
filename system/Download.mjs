
class Download {
	static current = {};
	
	static async create() {
		const id = crypto.randomUUID();
		current[id] = new Download(this);
		current[id].id = id;
		return id;
	}
	
	static async get(id) {
		return this.current[id];
	}
	
	static async update(id, apply) {
		Object.apply(await this.get(id), apply);
	}
	static async remove(id) {
		
	}
	
	id = "";
	
	progress = null;
	stage = 0;
	stages = 1;
	complete = false;
	blob = null;
}

export default Download;
