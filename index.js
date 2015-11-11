/*!
 * base-tree <https://github.com/doowb/base-tree>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');

/**
 * Creates a `.tree` method on `app` that will recursively
 * generate a tree of nodes specified by the name option passed in.
 *
 * ```js
 * var app = new Base();
 * app.use(tree({name: 'children'}));
 *
 * app.children = {};
 * app.children.one = new Base();
 * app.children.two = new Base();
 * app.children.three = new Base();
 *
 * console.log(app.tree());
 * console.log(archy(app.tree()));
 * ```
 *
 * @param  {Object} `options` Options to use in `.tree` method
 * @param  {String} `options.name` Name of the collection object to look for child nodes.
 * @param  {Function} `options.tree` Optional `tree` function to use to generate the node or tree of nodes for the current app. Takes `app` and `options` as parameters.
 * @param  {Function} `options.getLabel` Get a label for the node being built. Takes `app` and `options` as parameters.
 * @param  {Function} `options.getData` Get a data object for the node being built. Takes `app` and `options` as parameters.
 * @return {Function} plugin
 * @api public
 * @name  tree
 */

module.exports = function(options) {
  options = options || {};
  return function fn(app) {

    // tree is already registered on this `app`
    if (typeof app.tree !== 'undefined') {
      return fn;
    }

    // create a `tree` method that will build up a tree
    // of nodes
    app.define('tree', function(opts) {
      opts = extend({}, options, opts);
      if (typeof opts.tree === 'function') {
        return opts.tree.call(this, this, opts);
      }
      return tree(this, opts);
    });

    return fn;
  };
};

/**
 * Default tree building function. Gets the label and data properties for the current `app` and
 * recursively generates the child nodes and child trees if possible.
 *
 * This method may be overriden by passing a `.tree` function on options.
 *
 * @param  {Object} `app` Current application to build a node and tree from.
 * @param  {Object} `options` Options used to control how the `label` and `data` properties are retreived.
 * @return {Object} Generated node containing `label`, `data`, and `nodes` properties for current segment of a tree.
 * @api public
 * @name  options.tree
 */

function tree(app, options) {
  var opts = extend({}, options);
  var node = {
    label: getLabel(app, opts),
    data: getData(app, opts)
  };

  // get the name of the children to lookup
  var name = opts.name || 'nodes';
  var children = app[name];
  if (typeof children !== 'object') {
    return node;
  }

  // build a tree for each child node
  var nodes = [];
  for (var key in children) {
    var child = children[key];
    if (typeof child.tree === 'function') {
      nodes.push(child.tree(opts));
    } else {
      nodes.push(tree(child, opts));
    }
  }

  if (nodes.length) {
    node.nodes = nodes;
  }
  return node;
}

/**
 * Figure out a label to add for a node in the tree.
 *
 * @param  {Object} `app` Current node/app being iterated over
 * @param  {Object} `options` Pass `getLabel` on options to handle yourself.
 * @return {String} label to be shown
 * @api public
 * @name  options.getLabel
 */

function getLabel(app, options) {
  if (typeof options.getLabel === 'function') {
    return options.getLabel(app, options);
  }
  return app.full_name || app.nickname || app.name;
}

/**
 * Additional data that should be added to a node
 *
 * @param  {Object} `app` Current node/app being iterated over
 * @param  {Object} `options` Pass `getData` on options to handle yourself.
 * @return {Object} data object to add to node
 * @api public
 * @name  options.getData
 */

function getData(app, options) {
  if (typeof options.getData === 'function') {
    return options.getData(app, options);
  }
  return {};
}
