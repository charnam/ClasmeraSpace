/**
 * GlslCanvas is broken, requiring a module which isn't supported by this
 * environment. This JavaScript file is included in its place, in order to
 * fix GlslCanvas.
 * 
 * I really looked, for a while, trying to find a library which had no flaws,
 * but unfortunately this was the best I could get. I'm too tired for this.
 */

export default {
	get: (path, callback) => {
		fetch(path).then(data => data.text()).then(text => {
			callback(null, null, text);
		})
	}
};