import UserOverrides from "./system/UserOverrides.js";

class Overridable {
	all = [];
	byId = {};
	
	async load(path, sources) {
		for(let source of sources) {
			const sourceObject = (await import(`${path}/${source}/index.js`)).default;
			sourceObject.id = source;
			this.byId[source] = sourceObject;
			this.all.push(sourceObject);
		}
	}
	
	async loadOverride(id) {
		const overrides = await UserOverrides.get(id);
		await this.load("../../data/overrides/"+id, overrides);
	}
}

export default Overridable;