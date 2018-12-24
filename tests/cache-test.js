'use strict';

const path = require('path');
const expect = require('chai').expect;
const Cache = require('../lib/cache');

describe('Cache', function() {
	it('exists', function() {
		expect(Cache).to.exist; // eslint-disable-line
	});

	it('returns a JSON', async function() {
		const cache = new Cache();

		expect(cache.toJSON()).to.be.deep.equal({});
	});

	it('creates an entry', async function() {
		const cache = new Cache();
		const entry = { relativePath: 'foo' };

		await cache.push(entry, 'create');

		expect(cache.toJSON()).to.be.deep.equal({
			[entry.relativePath]: {}
		});
	});

	it('changes an entry', async function() {
		const filter = (entry) => ({ entry });
		const cache = new Cache({
			filters: [filter]
		});
		const entry = { relativePath: 'foo' };

		await cache.push(entry, 'create');

		const newEntry = Object.assign({ foo: 'bar' }, entry);

		await cache.push(newEntry, 'change');

		expect(cache.toJSON()).to.be.deep.equal({
			[entry.relativePath]: { entry: newEntry }
		});
	});

	it('unlinks an entry', async function() {
		const cache = new Cache();
		const entry = { relativePath: 'foo' };

		await cache.push(entry, 'create');
		await cache.push(entry, 'unlink');

		expect(cache.toJSON()).to.be.deep.equal({});
	});

	it('preprocess the entries', async function() {
		const filter1 = (entry) => Promise.resolve({ entry });
		const filter2 = () => ({ foo: 'bar' });
		const cache = new Cache({
			filters: [filter1, filter2]
		});
		const entry = { relativePath: 'foo' };

		await cache.push(entry, 'create');

		expect(cache.toJSON()).to.be.deep.equal({
			[entry.relativePath]: { entry, foo: 'bar' }
		});
	});
});
