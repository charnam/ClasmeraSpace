

function callToParents(target, cb) {
	while(target) {
		cb(target);
		target = target.parentElement;
	}
}

export default callToParents;