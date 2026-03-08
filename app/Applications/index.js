
import applications from "../Applications/applications.json" with {type: "json"};

class Applications {
	static all = [];
	static byId = {};
	
	static async load(apps) {
		for(let app of apps) {
			const appData = (await import(`./${app}/index.js`)).default;
			appData.id = app;
			this.byId[app] = appData;
			this.all.push(appData);
		}
	}
}

await Applications.load(applications);
console.log(Applications.all);
export default Applications;