'use strict';

const path = require('path');
const expect = require('chai').expect;
const testHelpers = require('broccoli-test-helper');
const Funnel = require('broccoli-funnel');
const fs = require('fs-extra');
const ImageMeta = require('..');

const { color, dimensions } = ImageMeta.filters;
const createBuilder = testHelpers.createBuilder;
const createTempDir = testHelpers.createTempDir;

describe('broccoli-lint-remark', function() {
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
		const meta = await fs.readFile(path.join(output.dir, files[0]), 'utf-8');

		expect(files).to.deep.equal(['meta.json']);
		expect(meta).to.be.equal('{"troll.jpg":{}}');
	});

	it('outputs a JSON given a glob expression and an output file name', async function() {
		input.write({
			'a.txt': 'a.txt',
			'a.log': 'a.log'
		});
		const outputFile = 'foo.json';
		const tree = new Funnel(input.path());
		const pluginInstance = new ImageMeta(tree, {
			globs: ['*.jpg'],
			outputFile
		});

		output = createBuilder(pluginInstance);

		await output.build();

		expect(Object.keys(output.read())).to.deep.equal([outputFile]);
	});

	it('outputs a JSON given an input filters', async function() {
		const outputFile = 'foo.json';
		const tree = new Funnel(input.path());
		const pluginInstance = new ImageMeta(tree, {
			filters: [color, dimensions],
			outputFile
		});

		output = createBuilder(pluginInstance);

		await output.build();

		const files = Object.keys(output.read());
		const meta = await fs.readJSON(path.join(output.dir, files[0]), 'utf-8');

		expect(files).to.deep.equal([outputFile]);
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

	it('formats the output', async function() {
		const formatOutput = (meta) => `export default ${JSON.stringify(meta)}`;
		const outputFile = 'foo.json';
		const tree = new Funnel(input.path());
		const pluginInstance = new ImageMeta(tree, {
			formatOutput,
			outputFile
		});

		output = createBuilder(pluginInstance);

		await output.build();

		const files = Object.keys(output.read());
		const meta = await fs.readFile(path.join(output.dir, files[0]), 'utf-8');

		expect(files).to.deep.equal([outputFile]);
		expect(meta).to.be.equal('export default {"troll.jpg":{}}');
	});
});
