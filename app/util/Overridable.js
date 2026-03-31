import Registry from "./system/Registry.js";
import UserOverrides from "./system/UserOverrides.js";

class Overridable {
	static overridables = [];
	
	all = [];
	byId = {};
	
	constructor(details) {
		this.constructor.overridables.push(this);
		
		this.id = details.id ?? "unknown";
		this.name = details.name ?? "Unnamed Override?";
		this.user = details.user ?? true;
	}
	
	async checkEnabledFor(override, userid) {
		if(typeof override.enableCondition == "function") {
			return await override.enableCondition(userid);
		} else if(typeof override.enableCondition == "boolean") {
			return override.enableCondition;
		} else {
			return true;
		}
	}
	
	async getOverridesFor(userid) {
		const forceEnabled = await Registry.getKey(`user.${userid}.overrides.${this.id}.enabled`, []);
		const forceDisabled = await Registry.getKey(`user.${userid}.overrides.${this.id}.disabled`, []);
		
		const autoEnabled = [];
		
		await Promise.all(this.all.map(async override => {
			if(await this.checkEnabledFor(override, userid)) {
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