'use strict';

const path = require('path');
const expect = require('chai').expect;
const ImageMeta = require('..');

const { color } = ImageMeta.filters;

describe('filters/color', function() {
	it('exists', function() {
		expect(color).to.exist; // eslint-disable-line
		expect(color).to.be.a('function'); // eslint-disable-line
	});

	it('returns an empty color if the image does not exists', async function() {
		const hex = await color({
			basePath: '',
			relativePath: ''
		});

		expect(hex).to.be.an('object');
		expect(hex.color).to.be.equal(undefined);
	});

	it('returns the average color of an image', async function() {
		const hex = await color({
			basePath: path.resolve(__dirname, 'assets'),
			relativePath: 'troll.jpg'
		});

		expect(hex).to.be.an('object');
		expect(hex.color).to.be.equal('#7e7e7e');
	});
});
