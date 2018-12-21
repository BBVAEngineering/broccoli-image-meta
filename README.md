# broccoli-image-meta

[![Build Status](https://travis-ci.org/BBVAEngineering/broccoli-image-meta.svg?branch=master)](https://travis-ci.org/BBVAEngineering/broccoli-image-meta)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-image-meta.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fbroccoli-image-meta)
[![NPM version](https://badge.fury.io/js/broccoli-image-meta.svg)](https://badge.fury.io/js/broccoli-image-meta)
[![Dependency Status](https://david-dm.org/BBVAEngineering/broccoli-image-meta.svg)](https://david-dm.org/BBVAEngineering/broccoli-image-meta)
[![codecov](https://codecov.io/gh/BBVAEngineering/broccoli-image-meta/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/broccoli-image-meta)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/broccoli-image-meta.svg)](https://greenkeeper.io/)

## Information

[![NPM](https://nodei.co/npm/broccoli-image-meta.png?downloads=true&downloadRank=true)](https://nodei.co/npm/broccoli-image-meta/)

Copy and resizes images given an input tree.

**Why?** For example, to generate a low quality copy of each image and improve the page speed when loading.

## Installation & usage

`npm install --save broccoli-image-meta`


```javascript
// Raw
const Thumbnail = require('broccoli-image-meta');

const myTree = new Funnel('assets/images');
const thumbnailTree = new Thumbnail(myTree, {
  width: 128,
  prefix: 'small-'
});
```

```javascript
// Ember addon style
const Thumbnail = require('broccoli-image-meta');

module.exports = {
  // ...

  treeForPublic() {
    return new Thumbnail('assets/images');
  }
};
```

## Options

| Option | Type     | Defaults                      | Description                               |
|--------|----------|-------------------------------|-------------------------------------------|
| prefix | `String` | `thumbnail_`                  | Prefix to be added on each thumbnail name |
| globs  | `Array`  | `['**/*.(jpg|jpeg|gif|png)']` | Files to be processed                     |
| width  | `Number` | `64`                          | Thumbnail width                           |

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/BBVAEngineering/broccoli-image-meta/tags).

## Authors

See the list of [contributors](https://github.com/BBVAEngineering/broccoli-image-meta/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
