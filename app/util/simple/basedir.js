
function basedir(link) {
	const url = new URL(link);
	const directoryPath = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
	return directoryPath;
}

export default basedir;