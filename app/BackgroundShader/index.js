import { HTML } from "imperative-html";
import Renderable from "../util/Renderable.js";
import GlslCanvas from "glslCanvas";

class BackgroundShader extends Renderable {
	style = [...this.style, "BackgroundShader/main.css"];
	
	render() {
		const container = super.render();
		const canvas = new HTML.canvas({class: "background-shader"});
		container.append(canvas);
		const sandbox = new GlslCanvas(canvas);
		(async () => {
			const shader = await fetch("app/BackgroundShader/default.glsl").then(res => res.text());
			sandbox.load(shader);
			canvas.classList.add("loaded");
			BackgroundShader.resizeLoop(canvas);
		})();
		return container;
	}
	
	static resizeLoop(canvas) {
		canvas.width = window.innerWidth / 4;
		canvas.height = window.innerHeight / 4;
		requestAnimationFrame(() => this.resizeLoop(canvas));
	}
	
}

export default BackgroundShader;