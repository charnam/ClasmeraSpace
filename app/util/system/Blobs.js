import Registry from "./Registry.js";

class Blobs {
	static async get(id) {
		const data = await Registry.getBlob(id);
		return new Blob([data.content], {type: data.meta.type});
	}
}

export default Blobs;
