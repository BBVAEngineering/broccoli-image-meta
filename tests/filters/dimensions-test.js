'use strict';

const path = require('path');
const expect = require('chai').expect;
const ImageMeta = require('../..');

const { dimensions } = ImageMeta.filters;

describe('filters/dimensions', function() {
	it('exists', function() {
		expect(dimensions).to.exist; // eslint-disable-line
		expect(dimensions).to.be.a('function'); // eslint-disable-line
	});

	it('returns an empty dimensions if the image does not exists', async function() {
		const hex = await dimensions({
			basePath: '',
			relativePath: ''
		});

		expect(hex).to.be.an('object');
		expect(hex.dimensions).to.be.equal(undefined);
	});

	it('returns the average dimensions of an image', async function() {
		const hex = await dimensions({
			basePath: path.resolve(__dirname, '..', 'assets'),
			relativePath: 'troll.jpg'
		});

		expect(hex).to.be.an('object');
		expect(hex.dimensions).to.be.deep.equal({
			width: 469,
			height: 428,
			type: 'jpg'
		});
	});
});
