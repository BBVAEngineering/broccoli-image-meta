module.exports = class Cache {
	constructor(options = {}) {
		this._images = {};
		this.options = options;
	}

	async _add(entry) {
		const meta = {};

		for (let i = 0; i < this.options.filters.length; i++) {
			Object.assign(meta, await this.options.filter[i](entry));
		}

		this._images[entry.relativePath] = meta;
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
};
