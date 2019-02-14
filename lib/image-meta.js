const Filter = require('broccoli-persistent-filter');
const md5Hex = require('broccoli-persistent-filter/lib/md5-hex');
const path = require('path');

class ImageMeta extends Filter {
	constructor(inputNode, options = {}) {
		super(inputNode, {
			persist: options.persist,
			annotation: 'ImageMeta',
			'async': true // eslint-disable-line
		});

		this.options = Object.assign({
			filters: [],
			extensions: ['jpg', 'jpeg', 'gif', 'png']
		}, options);
	}

	baseDir() {
		return path.join(__dirname, '..');
	}

	getDestFilePath(relativePath) {
		const ext = path.extname(relativePath).replace(/^\./, '');

		if (this.options.extensions.includes(ext)) {
			return `${relativePath}.json`;
		}

		return null;
	}

	cacheKeyProcessString(string, relativePath) {
		return md5Hex(string.length + 0x00 + relativePath);
	}

	async processString(content, relativePath) {
		const meta = {};

		for (let i = 0; i < this.options.filters.length; i++) {
			const filterResult = await this.options.filters[i]({
				basePath: this.inputPaths[0],
				relativePath
			});

			Object.assign(meta, filterResult);
		}

		const output = JSON.stringify({
			[`${relativePath}`]: meta
		});

		return { output };
	}

	postProcess(results) {
		return { output: results.output };
	}
}

module.exports = ImageMeta;
