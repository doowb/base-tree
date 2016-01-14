'use strict';

require('mocha');
var assert = require('assert');
var Base = require('base-methods');
var use = require('use');
var tree = require('./');

describe('base-tree', function() {
  it('should add a .tree method to app', function() {
    var app = new Base();
    app.use(tree());
    assert(typeof app.tree === 'function');
  });

  it('should not add `.tree` method to app with a `.tree` method', function() {
    var app = new Base();
    app.define('tasks', [
      {name: 'a'},
      {name: 'b'},
      {name: 'c'}
    ]);

    app.define('tree', function() {
      return this.tasks.reduce(function(acc, task) {
        acc.nodes.push({label: task.name});
        return acc;
      }, {label: 'tasks', nodes: []});
    });

    app.use(tree());
    assert.deepEqual(app.tree(), {
      label: 'tasks',
      nodes: [
        {label: 'a'},
        {label: 'b'},
        {label: 'c'}
      ]
    });
  });

  it('should use a custom method name instead of `.tree`', function() {
    var app = new Base({name: 'app'});
    app.use(tree({method: 'hierarchy'}));
    assert(typeof app.tree === 'undefined');
    assert(typeof app.hierarchy === 'function');
    assert.deepEqual(app.hierarchy(), {label: 'app', metadata: {}});
  });

  it('should generate a tree with no children using name', function() {
    var app = new Base({name: 'app'});
    app.use(tree());
    assert.deepEqual(app.tree(), {label: 'app', metadata: {}});
  });

  it('should generate a tree with no children using full_name', function() {
    var app = new Base({full_name: 'app'});
    app.use(tree());
    assert.deepEqual(app.tree(), {label: 'app', metadata: {}});
  });

  it('should generate a tree with no children using nickname', function() {
    var app = new Base({nickname: 'app'});
    app.use(tree());
    assert.deepEqual(app.tree(), {label: 'app', metadata: {}});
  });

  it('should generate a tree with no children using getLabel', function() {
    var app = new Base();
    app.use(tree({
      getLabel: function() {
        return 'app';
      }
    }));
    assert.deepEqual(app.tree(), {label: 'app', metadata: {}});
  });

  it('should generate a tree with no children using getMetadata', function() {
    var app = new Base({name: 'app'});
    app.use(tree({
      getMetadata: function() {
        return {type: 'app'};
      }
    }));
    assert.deepEqual(app.tree(), {label: 'app', metadata: {type: 'app'}});
  });

  it('should generate a tree with children on `.nodes`', function() {
    var app = new Base({name: 'app'});
    app.use(tree());
    app.nodes = {
      one: new Base({name: 'one'}),
      two: new Base({name: 'two'}),
      three: new Base({name: 'three'})
    };

    assert.deepEqual(app.tree(), {
      label: 'app',
      metadata: {},
      nodes: [
        {label: 'one', metadata: {}},
        {label: 'two', metadata: {}},
        {label: 'three', metadata: {}}
      ]
    });
  });

  it('should generate a tree with children on `.children`', function() {
    var app = new Base({name: 'app'});
    app.use(tree({names: 'children'}));
    app.children = {
      one: new Base({name: 'one'}),
      two: new Base({name: 'two'}),
      three: new Base({name: 'three'})
    };

    assert.deepEqual(app.tree(), {
      label: 'app',
      metadata: {},
      nodes: [
        {label: 'one', metadata: {}},
        {label: 'two', metadata: {}},
        {label: 'three', metadata: {}}
      ]
    });
  });

  it('should generate a tree with grandchilren on `.nodes`', function() {
    var app = new Base({name: 'app'});
    app.use(tree());
    app.nodes = {
      one: new Base({
        name: 'one',
        nodes: {
          a: new Base({name: 'one-a'}),
          b: new Base({name: 'one-b'}),
          c: new Base({name: 'one-c'})
        }
      })
      .use(tree()),

      two: new Base({
        name: 'two',
        nodes: {
          a: new Base({name: 'two-a'}),
          b: new Base({name: 'two-b'}),
          c: new Base({name: 'two-c'})
        }
      })
      .use(tree()),

      three: new Base({
        name: 'three',
        nodes: {
          a: new Base({name: 'three-a'}),
          b: new Base({name: 'three-b'}),
          c: new Base({name: 'three-c'})
        }
      })
      .use(tree())
    };

    assert.deepEqual(app.tree(), {
      label: 'app',
      metadata: {},
      nodes: [
        {
          label: 'one',
          metadata: {},
          nodes: [
            {label: 'one-a', metadata: {}},
            {label: 'one-b', metadata: {}},
            {label: 'one-c', metadata: {}}
          ]
        },
        {
          label: 'two',
          metadata: {},
          nodes: [
            {label: 'two-a', metadata: {}},
            {label: 'two-b', metadata: {}},
            {label: 'two-c', metadata: {}}
          ]
        },
        {
          label: 'three',
          metadata: {},
          nodes: [
            {label: 'three-a', metadata: {}},
            {label: 'three-b', metadata: {}},
            {label: 'three-c', metadata: {}}
          ]
        },
      ]
    });
  });

  it('should generate a tree with grandchilren on `.children`', function() {
    var app = new Base({name: 'app'});
    app.use(tree({names: 'children'}));
    app.children = {
      one: new Base({
        name: 'one',
        children: {
          a: new Base({name: 'one-a'}),
          b: new Base({name: 'one-b'}),
          c: new Base({name: 'one-c'})
        }
      })
      .use(tree({name: 'children'})),

      two: new Base({
        name: 'two',
        children: {
          a: new Base({name: 'two-a'}),
          b: new Base({name: 'two-b'}),
          c: new Base({name: 'two-c'})
        }
      })
      .use(tree({name: 'children'})),

      three: new Base({
        name: 'three',
        children: {
          a: new Base({name: 'three-a'}),
          b: new Base({name: 'three-b'}),
          c: new Base({name: 'three-c'})
        }
      })
      .use(tree({name: 'children'}))
    };

    assert.deepEqual(app.tree(), {
      label: 'app',
      metadata: {},
      nodes: [
        {
          label: 'one',
          metadata: {},
          nodes: [
            {label: 'one-a', metadata: {}},
            {label: 'one-b', metadata: {}},
            {label: 'one-c', metadata: {}}
          ]
        },
        {
          label: 'two',
          metadata: {},
          nodes: [
            {label: 'two-a', metadata: {}},
            {label: 'two-b', metadata: {}},
            {label: 'two-c', metadata: {}}
          ]
        },
        {
          label: 'three',
          metadata: {},
          nodes: [
            {label: 'three-a', metadata: {}},
            {label: 'three-b', metadata: {}},
            {label: 'three-c', metadata: {}}
          ]
        },
      ]
    });
  });

  it('should generate a tree with grandchilren on `.children` using `use`', function() {
    var app = new Base({name: 'app'});
    app.use(use);
    app.use(tree({names: 'children'}));
    app.use(function children() {
      this.children = {};

      this.define('addChild', function(child) {
        this.children[child.name] = child;
        this.run(child);
        return this;
      });

      this.define('getChild', function(name) {
        return this.children[name];
      });

      return children;
    });

    app.addChild(new Base({name: 'one'}));
    app.addChild(new Base({name: 'two'}));
    app.addChild(new Base({name: 'three'}));

    app.getChild('one')
      .addChild(new Base({name: 'one-a'}))
      .addChild(new Base({name: 'one-b'}))
      .addChild(new Base({name: 'one-c'}));

    app.getChild('two')
      .addChild(new Base({name: 'two-a'}))
      .addChild(new Base({name: 'two-b'}))
      .addChild(new Base({name: 'two-c'}));

    app.getChild('three')
      .addChild(new Base({name: 'three-a'}))
      .addChild(new Base({name: 'three-b'}))
      .addChild(new Base({name: 'three-c'}));

    assert.deepEqual(app.tree(), {
      label: 'app',
      metadata: {},
      nodes: [
        {
          label: 'one',
          metadata: {},
          nodes: [
            {label: 'one-a', metadata: {}},
            {label: 'one-b', metadata: {}},
            {label: 'one-c', metadata: {}}
          ]
        },
        {
          label: 'two',
          metadata: {},
          nodes: [
            {label: 'two-a', metadata: {}},
            {label: 'two-b', metadata: {}},
            {label: 'two-c', metadata: {}}
          ]
        },
        {
          label: 'three',
          metadata: {},
          nodes: [
            {label: 'three-a', metadata: {}},
            {label: 'three-b', metadata: {}},
            {label: 'three-c', metadata: {}}
          ]
        },
      ]
    });
  });

  it('should generate a tree using the `.tree` option', function() {
    var app = new Base();
    app.use(tree({
      tree: function(ctx, options) {
        return ctx.tasks.reduce(function(acc, task) {
          acc.nodes.push({label: task.name});
          return acc;
        }, {label: 'tasks', nodes: []});
      }
    }));

    app.define('tasks', [
      {name: 'a'},
      {name: 'b'},
      {name: 'c'}
    ]);

    assert.deepEqual(app.tree(), {
      label: 'tasks',
      nodes: [
        {label: 'a'},
        {label: 'b'},
        {label: 'c'}
      ]
    });
  });

});
