'use strict';

const ImageMeta = require('./lib/image-meta');
const JsonConcat = require('./lib/json-concat');
const dimensions = require('./lib/filters/dimensions');
const color = require('./lib/filters/color');

module.exports = function broccoliImageMeta(inputTree, options) {
	const tree = new ImageMeta(inputTree, options);

	return new JsonConcat(tree, options);
};
module.exports.filters = { color, dimensions };
