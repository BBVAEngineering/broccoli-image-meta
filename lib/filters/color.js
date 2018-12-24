const util = require('util');
const path = require('path');
const ColorThief = require('color-thief');
const onecolor = require('onecolor');
const fs = require('fs-extra');

const readFile = util.promisify(fs.readFile);
const colorThief = new ColorThief();

module.exports = async function color(entry) {
	debugger
	const absolutePath = path.join(entry.basePath, entry.relativePath);
	let rgb;

	try {
		const content = await readFile(absolutePath);
		const [r, g, b] = colorThief.getColor(content);

		rgb = onecolor(`rgb(${r}, ${g}, ${b})`).hex();
	} catch (e) {
		// Nope
	}

	return {
		color: rgb
	};
};
