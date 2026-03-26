import { HTML } from "imperative-html";
import Renderable from "../../util/Renderable.js";
import GlslCanvas from "glslCanvas";

class BackgroundShader extends Renderable {
	style = [...this.style, "app/renderable/BackgroundShader/main.css"];
	
	render() {
		const container = super.render();
		const canvas = new HTML.canvas({class: "background-shader"});
		container.append(canvas);
		const sandbox = new GlslCanvas(canvas);
		(async () => {
			const shader = await fetch("app/renderable/BackgroundShader/default.glsl").then(res => res.text());
			sandbox.load(shader);
			setTimeout(() => {
				canvas.classList.add("loaded");
			}, 1000);
			BackgroundShader.resizeLoop(canvas);
		})();
		return container;
	}
	
	static resizeLoop(canvas) {
		canvas.width = window.innerWidth / 8 * window.devicePixelRatio;
		canvas.height = window.innerHeight / 8 * window.devicePixelRatio;
		requestAnimationFrame(() => this.resizeLoop(canvas));
	}
	
}

export default BackgroundShader;