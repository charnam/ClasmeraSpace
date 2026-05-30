import Renderable from "../../util/Renderable.js";
import Blobs from "../../util/system/Blobs.js";
import Registry from "../../util/system/Registry.js";

class UserIcon extends Renderable {
	style = this.autoStyleByImport(import.meta.url);
	
	constructor(userOrId) {
		super();
		this.userid = typeof userOrId == "string" ? userOrId : userOrId.id;
	}
	
	render() {
		const icon = super.render();
		icon.classList.add("base-user-icon");
		this.updateRendered(icon);
		return icon;
	}
	
	async updateRendered(element) {
		element.classList.remove("base-user-icon-empty");
		element.classList.add("base-user-icon-loading");
		const user = await Registry.getKey("user."+this.userid);
		const icon = user.icon ? await Blobs.get(user.icon) : false;
		
		if(icon instanceof Blob) {
			element.setAttribute("style", `--user-icon: url("${URL.createObjectURL(icon)}");`);
		} else {
			element.classList.add("base-user-icon-empty");
		}
	}
	
}

export default UserIcon;