const Plugin = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs-extra');
const walkSync = require('walk-sync');
const sizeOf = require('image-size');
const util = require('util');
const FSTree = require('fs-tree-diff');
const ColorThief = require('color-thief');
const onecolor = require('onecolor');

const readFile = util.promisify(fs.readFile);
const getOutputFile = util.promisify(fs.outputFile);
const colorThief = new ColorThief();

class ImageCache {
	constructor(options) {
		this._images = {};
		this.options = options || {};
	}

	async _add(entry) {
		let dimensions;
		let color = this.options.fallbackColor;
		const absolutePath = path.join(entry.basePath, entry.relativePath);
		const basename = path.basename(entry.relativePath);
		const dirname = path.dirname(entry.relativePath);

		try {
			const content = await readFile(absolutePath);
			const [r, g, b] = colorThief.getColor(content);

			color = onecolor(`rgb(${r}, ${g}, ${b})`).hex();
			dimensions = sizeOf(absolutePath);
		} catch (e) {
			// Color fallback
		}

		this._images[entry.relativePath] = {
			color,
			dimensions,
			thumbnail: path.join(dirname, `${this.options.thumbnailPrefix}${basename}`)
		};
	}

	_update(entry) {
		this.delete(entry);
		this.add(entry);
	}

	_remove(entry) {
		delete this._images[entry.relativePath];
	}

	async push(entry, type) {
		switch (type) {
			case 'unlink':
				this._remove(entry);
				break;
			case 'change':
				this._update(entry);
				break;
			case 'create':
				await this._add(entry);
				break;
			default:
				break;
		}
	}

	toJSON() {
		return this._images;
	}
}

// No Plugin
class GetImageMeta extends Plugin {
	constructor(inputNode, options = {}) {
		options = Object.assign({
			outputFile: 'meta-images.json',
			globs: [
				'**/*.{jpg,jpeg,gif,png}'
			]
		}, options);
		super([inputNode], options);

		this._lastTree = FSTree.fromEntries([]);
		this.options = options;
		this._cache = new ImageCache(this.options);
	}

	listEntries() {
		const inputDir = this.inputPaths[0];

		return walkSync.entries(inputDir, {
			directories: false,
			globs: [
				'**/*.jpg',
				'**/*.jpeg',
				'**/*.gif',
				'**/*.png'
			]
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

		patch.forEach(([type, , entry]) => {
			this._cache.push(entry, type);
		});

		const outputFile = path.join(this.outputPath, this.options.outputFile);
		const meta = {
			images: this._cache.toJSON()
		};

		await getOutputFile(outputFile, `export default ${JSON.stringify(meta)};`);
	}
}

module.exports = GetImageMeta;
