
function downloadButtonProgress(progress, button) {
	if(progress.complete) {
		button.setAttribute("style", "");
		button.classList.remove("progress");
	} else {
		button.classList.add("progress");
		if(progress.stage == 0 || progress.complete) {
			button.setAttribute("style", "");
		} else {
			button.setAttribute("style",
				`--progress: ${((progress.stage - 1) + progress.progress) / progress.stages};`);
		}
	}
}


export default downloadButtonProgress;