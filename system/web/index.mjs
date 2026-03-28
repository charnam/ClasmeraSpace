import express from 'express';
import Session from './Session.mjs';
import expressWs from 'express-ws';

const app = express()
const port = 3000;

expressWs(app);

app.ws('/api', function(ws, req) {
	const connection = new Session(ws);
});

app.use(express.static("public"));

app.listen(port, () => {
	console.log(`Clasmera SPACE remote options listening on port ${port}`)
});
