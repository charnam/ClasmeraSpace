import Registry from "./Registry.js";

class Blobs {
	static async get(id) {
		const data = await Registry.getBlob(id);
		return new Blob([data.content], {type: data.meta.type});
	}
	static async getInfo(id) {
		const data = await Registry.getBlob(id);
		if(data && data.content) {
			return {
				url: "./data/blobs/"+id,
				meta: data.meta
			};
		} else {
			return null;
		}
	}
}

export default Blobs;
