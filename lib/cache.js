module.exports = class Cache {
	constructor(options = {}) {
		this._cache = {};
		options.filters = options.filters || [];
		this.options = options;
	}

	async _add(entry) {
		const meta = {};

		for (let i = 0; i < this.options.filters.length; i++) {
			Object.assign(meta, await this.options.filters[i](entry));
		}

		this._cache[entry.relativePath] = meta;
	}

	_update(entry) {
		this._remove(entry);
		this._add(entry);
	}

	_remove(entry) {
		delete this._cache[entry.relativePath];
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
		return this._cache;
	}
};
