'use strict';

const path = require('path');
const expect = require('chai').expect;
const testHelpers = require('broccoli-test-helper');
const Funnel = require('broccoli-funnel');
const fs = require('fs-extra');
const ImageMeta = require('../lib/image-meta');
const Plugin = require('..');

const { color, dimensions } = Plugin.filters;
const createBuilder = testHelpers.createBuilder;
const createTempDir = testHelpers.createTempDir;

describe('image-meta', function() {
	let input, output;

	beforeEach(async function() {
		input = await createTempDir();
		input.writeBinary('troll.jpg', await fs.readFile(path.resolve(__dirname, 'assets', 'troll.jpg')));
	});

	afterEach(async function() {
		await input.dispose();

		if (output) {
			await output.dispose();
		}
	});

	it('exists', function() {
		expect(ImageMeta).to.exist; // eslint-disable-line
	});

	it('implements "baseDir()"', function() {
		const pluginInstance = new ImageMeta('foo');

		expect(pluginInstance.baseDir).to.be.a('function');
		expect(pluginInstance.baseDir()).to.be.equal(process.cwd());
	});

	it('implements "cacheKeyProcessString()"', function() {
		const pluginInstance = new ImageMeta('foo');

		expect(pluginInstance.cacheKeyProcessString).to.be.a('function');
		expect(pluginInstance.cacheKeyProcessString('a', 'b')).to.be.equal('a35aea60fe097c885568babb48ee7d1e');
	});

	it('sets default options', async function() {
		input.write({
			'a.txt': 'a.txt',
			'a.log': 'a.log'
		});
		const tree = new Funnel(input.path());
		const pluginInstance = new ImageMeta(tree);

		output = createBuilder(pluginInstance);

		await output.build();

		const files = Object.keys(output.read());
		const meta = await fs.readFile(path.join(output.dir, files[2]), 'utf-8');

		expect(files).to.deep.equal(['a.log', 'a.txt', 'troll.jpg.json']);
		expect(meta).to.be.equal('{"troll.jpg":{}}');
	});

	it('outputs a JSON given an input filters', async function() {
		const tree = new Funnel(input.path());
		const pluginInstance = new ImageMeta(tree, {
			filters: [color, dimensions]
		});

		output = createBuilder(pluginInstance);

		await output.build();

		const files = Object.keys(output.read());
		const meta = await fs.readJSON(path.join(output.dir, files[0]), 'utf-8');

		expect(files).to.deep.equal(['troll.jpg.json']);
		expect(meta).to.deep.equal({
			'troll.jpg': {
				color: '#7e7e7e',
				dimensions: {
					height: 428,
					width: 469
				}
			}
		});
	});
});
