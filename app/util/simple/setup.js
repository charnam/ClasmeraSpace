/*
	This script is used in order to load the import map from a separate file.
	After this is loaded, any script with the "data-app" attribute will be
	loaded.
	
	Ex: <script type="module" src="path/to/setup.js" data-app="path/to/app.js"></script>
*/

const importmap = await fetch("./importmap.json").then(evt => evt.text());
const scriptEl = document.createElement("script");

scriptEl.type = "importmap";
scriptEl.nonce = "importmap";
scriptEl.textContent = importmap;

document.head.append(scriptEl);

const app = document.querySelector("script[data-app]");

if(app) {
	await import(new URL(app.dataset.app, document.baseURI).href);
} else {
	console.warn("No data-app script found")
}
