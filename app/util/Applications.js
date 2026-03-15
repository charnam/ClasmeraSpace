import systemApplications from "../SystemApplications/applications.json" with {type: "json"};
import Overridable from "./Overridable.js";

const Applications = new Overridable();

await Applications.load("../SystemApplications", systemApplications);
await Applications.loadOverride("applications");

export default Applications;