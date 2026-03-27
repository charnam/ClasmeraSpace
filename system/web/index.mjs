import express from 'express';

const app = express()
const port = 3000

app.get("/api/session/create", (req, res) => {
	
});

app.use(express.static("public"));

app.listen(port, () => {
	console.log(`Clasmera SPACE remote options listening on port ${port}`)
});
