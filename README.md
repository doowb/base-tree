# base-tree [![NPM version](https://badge.fury.io/js/base-tree.svg)](http://badge.fury.io/js/base-tree)  [![Build Status](https://travis-ci.org/doowb/base-tree.svg)](https://travis-ci.org/doowb/base-tree)

> Add a tree method to generate a hierarchical tree structure representing nested applications and child objects.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i base-tree --save
```

## Usage

```js
var tree = require('base-tree');
```

## API

### [.tree](index.js#L39)

Creates a `.tree` method on `app` that will recursively generate a tree of nodes specified by the name option passed in.

**Params**

* `options` **{Object}**: Options to use in `.tree` method
* `options.name` **{String}**: Name of the collection object to look for child nodes.
* `options.tree` **{Function}**: Optional `tree` function to use to generate the node or tree of nodes for the current app. Takes `app` and `options` as parameters.
* `options.getLabel` **{Function}**: Get a label for the node being built. Takes `app` and `options` as parameters.
* `options.getData` **{Function}**: Get a data object for the node being built. Takes `app` and `options` as parameters.
* `returns` **{Function}**: plugin

**Example**

```js
var app = new Base();
app.use(tree({name: 'children'}));

app.children = {};
app.children.one = new Base();
app.children.two = new Base();
app.children.three = new Base();

console.log(app.tree());
console.log(archy(app.tree()));
```

### [options.tree](index.js#L75)

Default tree building function. Gets the label and data properties for the current `app` and recursively generates the child nodes and child trees if possible.

This method may be overriden by passing a `.tree` function on options.

**Params**

* `app` **{Object}**: Current application to build a node and tree from.
* `options` **{Object}**: Options used to control how the `label` and `data` properties are retreived.
* `returns` **{Object}**: Generated node containing `label`, `data`, and `nodes` properties for current segment of a tree.

### [options.getLabel](index.js#L116)

Figure out a label to add for a node in the tree.

**Params**

* `app` **{Object}**: Current node/app being iterated over
* `options` **{Object}**: Pass `getLabel` on options to handle yourself.
* `returns` **{String}**: label to be shown

### [options.getData](index.js#L133)

Additional data that should be added to a node

**Params**

* `app` **{Object}**: Current node/app being iterated over
* `options` **{Object}**: Pass `getData` on options to handle yourself.
* `returns` **{Object}**: data object to add to node

## Running Example

Clone the repository, install dependencies and run the example with `node`.

```sh
$ git clone https://github.com/doowb/base-tree
$ cd base-tree
$ npm install
$ node example.js
```

The example will output the raw object and a formatted tree structure using [archy](https://github.com/substack/node-archy)

[![image](https://cloud.githubusercontent.com/assets/995160/11600429/8648c144-9a9a-11e5-9f3e-2fd9955d87ec.png)](https://www.npmjs.com/)

## Related projects

* [base-methods](https://www.npmjs.com/package/base-methods): Starter for creating a node.js application with a handful of common methods, like `set`, `get`,… [more](https://www.npmjs.com/package/base-methods) | [homepage](https://github.com/jonschlinkert/base-methods)
* [use](https://www.npmjs.com/package/use): Easily add plugin support to your node.js application. | [homepage](https://github.com/jonschlinkert/use)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/doowb/base-tree/issues/new).

## Author

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb)

## License

Copyright © 2015 Brian Woodward
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on December 04, 2015._