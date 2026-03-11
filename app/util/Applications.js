import systemApplications from "../SystemApplications/applications.json" with {type: "json"};
import UserApps from "./system/UserApps.js";

class Applications {
	static all = [];
	static byId = {};
	
	static async load(path, apps) {
		for(let app of apps) {
			const appData = (await import(`${path}/${app}/index.js`)).default;
			appData.id = app;
			this.byId[app] = appData;
			this.all.push(appData);
		}
	}
}

await Applications.load("../SystemApplications", systemApplications);
await Applications.load("../../data/applications", await UserApps.scan());

export default Applications;