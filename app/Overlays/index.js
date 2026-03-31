import overlays from "./overlays.json" with {type: "json"};
import Overridable from "../util/Overridable.js";

const Overlays = new Overridable();

await Overlays.load("../Overlays", overlays);
await Overlays.loadOverride("overlays");

export default Overlays;
