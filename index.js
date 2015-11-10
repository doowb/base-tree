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
 * generate a tree of nodes specified by the plural option passed in.
 *
 * ```js
 * var app = new Base();
 * app.use(tree({plural: 'children'}));
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
 * @return {Function} plugin
 * @api true
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
      var node = {
        label: getLabel(app, opts),
        data: getData(app, opts)
      };

      // get the plural name of the children to lookup
      var plural = opts.plural || 'nodes';
      var children = app[plural];
      if (typeof children !== 'object') {
        return node;
      }

      // build a tree for each child node
      node.nodes = [];
      for (var key in children) {
        var child = children[key];
        if (typeof child.tree === 'function') {
          node.nodes.push(child.tree(opts));
        } else {
          node.nodes.push(getLabel(child, opts));
        }
      }

      return node;
    });
  };
};

/**
 * Figure out a label to add for a node in the tree.
 *
 * @param  {Object} `app` Current node/app being iterated over
 * @param  {Object} `options` Pass `getLabel` on options to handle yourself.
 * @return {String} label to be shown
 * @api public
 */

function getLabel(app, options) {
  if (typeof options.getLabel === 'function') {
    return options.getLabel(app, options);
  }

  if (typeof app === 'undefined') return;
  if (typeof app === 'string') return app;
  return app.full_name || app.nickname || app.name;
}

/**
 * Additional data that should be added to a node
 *
 * @param  {Object} `app` Current node/app being iterated over
 * @param  {Object} `options` Pass `getData` on options to handle yourself.
 * @return {Object} data object to add to node
 * @api public
 */

function getData(app, options) {
  if (typeof options.getData === 'function') {
    return options.getData(app, options);
  }
  return {};
}
