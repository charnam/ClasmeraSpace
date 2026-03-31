import Registry from "./system/Registry.js";
import UserOverrides from "./system/UserOverrides.js";

class Overridable {
	all = [];
	byId = {};
	
	async getOverridesFor(userid) {
		const forceEnabled = await Registry.getKey(`user.${userid}.overrides.enabled`, []);
		const forceDisabled = await Registry.getKey(`user.${userid}.overrides.disabled`, []);
		
		const autoEnabled = [];
		
		await Promise.all(this.all.map(async override => {
			if(typeof override.enableCondition == "function") {
				if(await override.enableCondition(userid)) {
					autoEnabled.push(override);
				}
			} else if(typeof override.enableCondition == "boolean") {
				if(override.enableCondition) {
					autoEnabled.push(override)
				}
			} else {
				autoEnabled.push(override);
			}
		}));
		
		return this.all
			.filter(override =>
				(autoEnabled.includes(override) || forceEnabled.includes(override.id))
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