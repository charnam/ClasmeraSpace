import mime from "mime";
import { randomUUID } from "crypto";
import { readFile, rename, writeFile } from "fs/promises";

class Blobs {
	static path = "data/blobs";
	
	static async getById(uuid) {
		try {
			uuid = uuid.replace(/[^a-zA-Z0-9\-_]/g, "");
			const fileContent = await readFile(`${this.path}/${uuid}`);
			const fileMeta = JSON.parse(await readFile(`${this.path}/${uuid}.meta`));
			return {
				meta: fileMeta,
				content: fileContent
			};
		} catch(err) {
			return null;
		}
	}
	
	static async writeMetadata(uuid, data) {
		await writeFile(`${this.path}/${uuid}.meta`, JSON.stringify(data));
	}
	
	static async store(arrayBuffer, type) {
		const uuid = randomUUID();
		
		await writeFile(`${this.path}/${uuid}`, Buffer.from(arrayBuffer));
		await this.writeMetadata(uuid, {type})
		
		return uuid;
	}
	static async storeFile(path) {
		const uuid = randomUUID();
		const targetPath = `${this.path}/${uuid}`;
		
		await rename(path, targetPath);
		await this.writeMetadata(uuid, {type: mime.getType(path)});
		
		return uuid;
	}
}

export default Blobs;
