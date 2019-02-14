const Plugin = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs-extra');
const walkSync = require('walk-sync');

module.exports = class JsonConcat extends Plugin {
	constructor(inputNode, options) {
		options = Object.assign({
			outputFile: 'meta.json',
			formatOutput: (meta) => JSON.stringify(meta),
			annotation: 'JsonConcat'
		}, options);

		super([inputNode], options);
		this.options = options;
	}

	listEntries() {
		const inputDir = this.inputPaths[0];

		return walkSync.entries(inputDir, {
			directories: false,
			globs: ['**/*.json']
		});
	}

	async build() {
		const outputFile = path.join(this.outputPath, this.options.outputFile);
		const entries = this.listEntries();
		const meta = {};

		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			const content = await fs.readFile(path.join(entry.basePath, entry.relativePath), 'utf-8');

			Object.assign(meta, JSON.parse(content));
		}

		await fs.outputFile(outputFile, this.options.formatOutput(meta));
	}
};
