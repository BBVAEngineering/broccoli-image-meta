# broccoli-image-meta

[![Build Status](https://travis-ci.org/BBVAEngineering/broccoli-image-meta.svg?branch=master)](https://travis-ci.org/BBVAEngineering/broccoli-image-meta)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-image-meta.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-image-meta)
[![NPM version](https://badge.fury.io/js/broccoli-image-meta.svg)](https://badge.fury.io/js/broccoli-image-meta)
[![Dependency Status](https://david-dm.org/BBVAEngineering/broccoli-image-meta.svg)](https://david-dm.org/BBVAEngineering/broccoli-image-meta)
[![codecov](https://codecov.io/gh/BBVAEngineering/broccoli-image-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/broccoli-image-meta)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/broccoli-image-meta.svg)](https://greenkeeper.io/)

## Information

[![NPM](https://nodei.co/npm/broccoli-image-meta.png?downloads=true&downloadRank=true)](https://nodei.co/npm/broccoli-image-meta/)

Process a source of images and generate a JSON with image metadata.

**Why?** For example, to create a component able to load a thumbnail or a colored box while the real image still loading.

## Installation & usage

`npm install --save broccoli-image-meta`


```javascript
// Raw
const ImageMeta = require('broccoli-image-meta');
const { color, dimensions } = ImageMeta;

const myTree = new Funnel('assets/images');
const thumbnailTree = new ImageMeta(myTree, {
  outputFile: 'meta.json',
  globs: [
    '**/*.{jpg,jpeg,gif,png}'
  ],
  filters: [color, dimensions]
});
```

```javascript
// Ember addon style
const BroccoliImageMeta = require('broccoli-image-meta');

module.exports = {
  // ...

  treeForPublic() {
    return new BroccoliImageMeta('assets/images', { /* options */ });
  }
};
```

## Options

| Option       | Type       | Defaults                         | Description                             |
|--------------|------------|----------------------------------|-----------------------------------------|
| outputFile   | `String`   | `meta.json`                      | Output file name                        |
| extensions   | `Array`    | `['jpg', 'jpeg', 'gif', 'png']`  | Files to be processed                   |
| filters      | `Array`    | `[]`                             | Image preprocessors                     |
| persist      | `Boolean`  | `true`                           | Use disk cache                          |
| formatOutput | `Function` | `(meta) => JSON.stringify(meta)` | Content to write inside the output file |

## Filters

The filter is just a `Function` that must return an `Object` (promise compatible) and receiver an `Entry` (an object with `basePath` and `relativePath`).
The object will be merged with the rest of the data created by other filters.

[Examples in `lib/filters/`](./lib/filters/).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/broccoli-image-meta/tags).

## Authors

See the list of [contributors](https://github.com/BBVAEngineering/broccoli-image-meta/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
