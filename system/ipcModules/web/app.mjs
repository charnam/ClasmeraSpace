import express from 'express';
import Session from './Session.mjs';
import expressWs from 'express-ws';
import path from 'path';
import { readFile } from 'fs/promises';
import { statSync } from 'fs';

const app = express()
const port = 3000;

expressWs(app);

app.ws('/api', function(ws, req) {
	new Session(ws);
});

// Automatically link files in public/LINKED_FILES.txt
let linkedFiles = (await readFile("web/LINKED_FILES.txt"))
	.toString()
	.split("\n")
	.filter(line => line.trim().length > 0);

linkedFiles = linkedFiles.slice(linkedFiles.findIndex(item => item.includes("== START")) + 1);

function link(filename) {
	if(statSync(filename).isDirectory()) {
		app.use("/"+filename, express.static(filename));
	} else {
		app.get("/"+filename, (_req, res) => res.sendFile(path.join(process.cwd(), filename)));
	}
}

for(let file of linkedFiles) {
	link(file);
}

app.use(express.static("web"));

app.listen(port, () => {
	console.log(`Clasmera SPACE remote options listening on port ${port}`)
});
