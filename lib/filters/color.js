const path = require('path');
const getColors = require('get-image-colors');
const averageColour = require('average-colour');

module.exports = async function color(entry) {
	const absolutePath = path.join(entry.basePath, entry.relativePath);
	let average;

	try {
		const colors = await getColors(absolutePath);
		const hexs = colors.map((chroma) => chroma.hex());

		average = averageColour(hexs);
	} catch (e) {
		// Nope
	}

	return {
		color: average
	};
};
