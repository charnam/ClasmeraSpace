import Registry from "./system/Registry.js";
import UserOverrides from "./system/UserOverrides.js";

class Overridable {
	all = [];
	byId = {};
	
	async getOverridesFor(userid) {
		const forceEnabled = await Registry.getKey(`user.${userid}.overrides.enabled`, []);
		const forceDisabled = await Registry.getKey(`user.${userid}.overrides.disabled`, []);
		
		return this.all
			.filter(override =>
				(!override.disabled || forceEnabled.includes(override.id))
				&& !forceDisabled.includes(override.id)
			);
	}
	
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