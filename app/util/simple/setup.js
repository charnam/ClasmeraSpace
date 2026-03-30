/*
 *  This script is used in order to load the import map from a separate file.
 *  After this is loaded, any script with the "data-app" attribute will be
 *  loaded.
 *  
 *  Ex: <script src="path/to/setup.js" data-app="path/to/app.js"></script>
 *  
 *  This file doesn't have any use other than for loading `importmap.json`
 *  separately. See `data-app` in the original HTML file for the actual
 *  app code.
 */

(async () => {
	const importmap = await fetch("./importmap.json").then(evt => evt.text());
	const scriptEl = document.createElement("script");
	
	scriptEl.type = "importmap";
	scriptEl.nonce = "importmap";
	scriptEl.textContent = importmap;
	
	document.head.append(scriptEl);

	const app = document.currentScript || document.querySelector("[data-app]");
	if(app) {
		const appScriptEl = document.createElement("script");
		appScriptEl.type = "module";
		appScriptEl.src = app.dataset.app;
		
		document.head.append(appScriptEl);
	} else {
		console.warn("No data-app script found")
	}
	
})();
