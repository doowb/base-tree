/*!
 * base-tree <https://github.com/doowb/base-tree>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');

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

function getLabel(app, options) {
  if (typeof options.getLabel === 'function') {
    return options.getLabel(app, options);
  }

  if (typeof app === 'undefined') return;
  if (typeof app === 'string') return app;
  return app.full_name || app.nickname || app.name;
}

function getData(app, options) {
  if (typeof options.getData === 'function') {
    return options.getData(app, options);
  }
  return {};
}
