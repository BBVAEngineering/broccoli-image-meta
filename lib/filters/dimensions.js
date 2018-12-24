const sizeOf = require('image-size');
const path = require('path');

module.exports = function dimensions(entry) {
	const absolutePath = path.join(entry.basePath, entry.relativePath);
	let size;

	try {
		size = sizeOf(absolutePath);
	} catch (e) {
		// Nope
	}

	return {
		dimensions: size
	};
};
