import pointers from "./pointers.json" with {type: "json"};
import Overridable from "../util/Overridable.js";

const Pointers = new Overridable({
	id: "pointers",
	name: "Input Methods",
	user: false
});

await Pointers.load("../Pointers", pointers);
await Pointers.loadOverride("pointers");

export default Pointers;
