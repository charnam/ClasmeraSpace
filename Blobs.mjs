import { randomUUID } from "crypto";
import { readFile, writeFile } from "fs/promises";

class Blobs {
	static path = "data/blobs";
	
	static async getById(uuid) {
		uuid = uuid.replace(/[^a-zA-Z0-9\-_]/g, "");
		return await readFile(`${this.path}/${uuid}`);
	}
	
	static async store(arrayBuffer) {
		const uuid = randomUUID();
		writeFile(`${this.path}/${uuid}`, arrayBuffer);
		return uuid;
	}
}

export default Blobs;
