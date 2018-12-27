'use strict';

const ImageMeta = require('./lib/image-meta');
const dimensions = require('./lib/filters/dimensions');
const color = require('./lib/filters/color');

module.exports = ImageMeta;
module.exports.filters = { color, dimensions };
