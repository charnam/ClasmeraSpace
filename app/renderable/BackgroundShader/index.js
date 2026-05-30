import { HTML } from "imperative-html";
import Renderable from "../../util/Renderable.js";
import GlslCanvas from "glslCanvas";

class BackgroundShader extends Renderable {
	style = this.autoStyleByImport(import.meta.url);
	shader = this.path(import.meta.url, "default.glsl");
	
	constructor(path = null, scale = 8) {
		super();
		if(path) this.shader = path;
		this.scale = scale;
	}
	
	render() {
		const container = super.render();
		const canvas = new HTML.canvas({class: "background-shader"});
		container.append(canvas);
		const sandbox = new GlslCanvas(canvas);
		(async () => {
			const shader = await fetch(this.shader).then(res => res.text());
			sandbox.load(shader);
			setTimeout(() => {
				canvas.classList.add("loaded");
			}, 200);
			BackgroundShader.resizeLoop(canvas, this.scale);
		})();
		return container;
	}
	
	static resizeLoop(canvas, scale) {
		canvas.width = window.innerWidth / scale * window.devicePixelRatio;
		canvas.height = window.innerHeight / scale * window.devicePixelRatio;
		requestAnimationFrame(() => this.resizeLoop(canvas, scale));
	}
	
}

export default BackgroundShader;