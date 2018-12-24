const Plugin = require('broccoli-caching-writer');
const path = require('path');
const util = require('util');
const fs = require('fs-extra');
const walkSync = require('walk-sync');
const FSTree = require('fs-tree-diff');
const Cache = require('./cache');
const color = require('./filters/color');
const dimensions = require('./filters/dimensions');

const outputFilePromise = util.promisify(fs.outputFile);

// No Plugin
class GetImageMeta extends Plugin {
	constructor(inputNode, options = {}) {
		options = Object.assign({
			outputFile: 'meta.json',
			globs: [
				'**/*.{jpg,jpeg,gif,png}'
			],
			filters: []
		}, options);
		super([inputNode], options);

		this._lastTree = FSTree.fromEntries([]);
		this.options = options;
		this._cache = new Cache(this.options);
	}

	listEntries() {
		const inputDir = this.inputPaths[0];

		return walkSync.entries(inputDir, {
			directories: false,
			globs: this.options.globs
		});
	}

	getCurrentFSTree() {
		return FSTree.fromEntries(this.listEntries());
	}

	calculatePatch() {
		const currentTree = this.getCurrentFSTree();
		const patch = this._lastTree.calculatePatch(currentTree);

		this._lastTree = currentTree;

		return patch;
	}

	async build() {
		const patch = this.calculatePatch();

		for (let i = 0; i < patch.length; i++) {
			const [type, , entry] = patch[i];

			await this._cache.push(entry, type);
		}

		const outputFile = path.join(this.outputPath, this.options.outputFile);
		const meta = {
			images: this._cache.toJSON()
		};

		await outputFilePromise(outputFile, `export default ${JSON.stringify(meta)};`);
	}
}

module.exports = GetImageMeta;
