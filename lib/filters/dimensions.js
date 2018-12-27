const sizeOf = require('image-size');
const path = require('path');

module.exports = function dimensions(entry) {
	const absolutePath = path.join(entry.basePath, entry.relativePath);
	let size;

	try {
		size = sizeOf(absolutePath);
		delete size.type;
	} catch (e) {
		// Nope
	}

	return {
		dimensions: size
	};
};
