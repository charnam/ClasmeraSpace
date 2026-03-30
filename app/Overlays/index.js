import overlays from "./overlays.json" with {type: "json"};
import Overridable from "../util/Overridable.js";

const Overlays = new Overridable();

await Overlays.load("./", overlays);
await Overlays.loadOverride("overlays");

for(let Overlay of Overlays.all) {
	const ovl = new Overlay();
	ovl.open();
}

export default Overlays;
