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

  it('should generate a tree with no children using name', function() {
    var app = new Base({name: 'app'});
    app.use(tree());
    assert.deepEqual(app.tree(), {label: 'app', data: {}});
  });

  it('should generate a tree with no children using full_name', function() {
    var app = new Base({full_name: 'app'});
    app.use(tree());
    assert.deepEqual(app.tree(), {label: 'app', data: {}});
  });

  it('should generate a tree with no children using nickname', function() {
    var app = new Base({nickname: 'app'});
    app.use(tree());
    assert.deepEqual(app.tree(), {label: 'app', data: {}});
  });

  it('should generate a tree with no children using getLabel', function() {
    var app = new Base();
    app.use(tree({
      getLabel: function() {
        return 'app';
      }
    }));
    assert.deepEqual(app.tree(), {label: 'app', data: {}});
  });

  it('should generate a tree with no children using getData', function() {
    var app = new Base({name: 'app'});
    app.use(tree({
      getData: function() {
        return {type: 'app'};
      }
    }));
    assert.deepEqual(app.tree(), {label: 'app', data: {type: 'app'}});
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
      data: {},
      nodes: [
        {label: 'one', data: {}},
        {label: 'two', data: {}},
        {label: 'three', data: {}}
      ]
    });
  });

  it('should generate a tree with children on `.children`', function() {
    var app = new Base({name: 'app'});
    app.use(tree({name: 'children'}));
    app.children = {
      one: new Base({name: 'one'}),
      two: new Base({name: 'two'}),
      three: new Base({name: 'three'})
    };

    assert.deepEqual(app.tree(), {
      label: 'app',
      data: {},
      nodes: [
        {label: 'one', data: {}},
        {label: 'two', data: {}},
        {label: 'three', data: {}}
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
      data: {},
      nodes: [
        {
          label: 'one',
          data: {},
          nodes: [
            {label: 'one-a', data: {}},
            {label: 'one-b', data: {}},
            {label: 'one-c', data: {}}
          ]
        },
        {
          label: 'two',
          data: {},
          nodes: [
            {label: 'two-a', data: {}},
            {label: 'two-b', data: {}},
            {label: 'two-c', data: {}}
          ]
        },
        {
          label: 'three',
          data: {},
          nodes: [
            {label: 'three-a', data: {}},
            {label: 'three-b', data: {}},
            {label: 'three-c', data: {}}
          ]
        },
      ]
    });
  });

  it('should generate a tree with grandchilren on `.children`', function() {
    var app = new Base({name: 'app'});
    app.use(tree({name: 'children'}));
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
      data: {},
      nodes: [
        {
          label: 'one',
          data: {},
          nodes: [
            {label: 'one-a', data: {}},
            {label: 'one-b', data: {}},
            {label: 'one-c', data: {}}
          ]
        },
        {
          label: 'two',
          data: {},
          nodes: [
            {label: 'two-a', data: {}},
            {label: 'two-b', data: {}},
            {label: 'two-c', data: {}}
          ]
        },
        {
          label: 'three',
          data: {},
          nodes: [
            {label: 'three-a', data: {}},
            {label: 'three-b', data: {}},
            {label: 'three-c', data: {}}
          ]
        },
      ]
    });
  });

  it('should generate a tree with grandchilren on `.children` using `use`', function() {
    var app = new Base({name: 'app'});
    app.use(use);
    app.use(tree({name: 'children'}));
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
      data: {},
      nodes: [
        {
          label: 'one',
          data: {},
          nodes: [
            {label: 'one-a', data: {}},
            {label: 'one-b', data: {}},
            {label: 'one-c', data: {}}
          ]
        },
        {
          label: 'two',
          data: {},
          nodes: [
            {label: 'two-a', data: {}},
            {label: 'two-b', data: {}},
            {label: 'two-c', data: {}}
          ]
        },
        {
          label: 'three',
          data: {},
          nodes: [
            {label: 'three-a', data: {}},
            {label: 'three-b', data: {}},
            {label: 'three-c', data: {}}
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
