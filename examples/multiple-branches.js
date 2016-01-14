'use strict';

var archy = require('archy');
var Base = require('base-methods');
var colors = require('ansi-colors');
var tree = require('../');

var noop = function(name) {
  var fn = function(){};
  fn.displayName = name;
  return fn;
};

function App(name) {
  Base.call(this);
  this.isApp = true;
  this.name = name;
  this.updaters = {};
  this.tasks = {};
  this.use(tree({name: ['updaters', 'tasks']}));
}

Base.extend(App);

App.prototype.child = function(app) {
  this.updaters[app.name] = app;
  return this;
};

App.prototype.task = function(name, fn) {
  this.tasks[name] = fn(name);
};

var parent = new App('parent');
parent.task('task-1', noop);
parent.task('task-2', noop);
parent.task('task-3', noop);

parent.child(new App('child1'));
parent.child(new App('child2'));
parent.child(new App('child3'));

parent.updaters.child1.task('child1-task-1', noop);
parent.updaters.child1.task('child1-task-2', noop);
parent.updaters.child1.task('child1-task-3', noop);

parent.updaters.child2.task('child2-task-1', noop);
parent.updaters.child2.task('child2-task-2', noop);
parent.updaters.child2.task('child2-task-3', noop);

parent.updaters.child3.task('child3-task-1', noop);
parent.updaters.child3.task('child3-task-2', noop);
parent.updaters.child3.task('child3-task-3', noop);

parent.updaters.child1.child(new App('grandchild-1-1'));
parent.updaters.child1.child(new App('grandchild-1-2'));
parent.updaters.child1.child(new App('grandchild-1-3'));

parent.updaters.child2.child(new App('grandchild-2-1'));
parent.updaters.child2.child(new App('grandchild-2-2'));
parent.updaters.child2.child(new App('grandchild-2-3'));

parent.updaters.child3.child(new App('grandchild-3-1'));
parent.updaters.child3.child(new App('grandchild-3-2'));
parent.updaters.child3.child(new App('grandchild-3-3'));

parent.updaters.child1.updaters['grandchild-1-1'].task('grandchild-1-1-task-1', noop);
parent.updaters.child1.updaters['grandchild-1-1'].task('grandchild-1-1-task-2', noop);
parent.updaters.child1.updaters['grandchild-1-1'].task('grandchild-1-1-task-3', noop);

parent.updaters.child1.updaters['grandchild-1-2'].task('grandchild-1-2-task-1', noop);
parent.updaters.child1.updaters['grandchild-1-2'].task('grandchild-1-2-task-2', noop);
parent.updaters.child1.updaters['grandchild-1-2'].task('grandchild-1-2-task-3', noop);

parent.updaters.child1.updaters['grandchild-1-3'].task('grandchild-1-3-task-1', noop);
parent.updaters.child1.updaters['grandchild-1-3'].task('grandchild-1-3-task-2', noop);
parent.updaters.child1.updaters['grandchild-1-3'].task('grandchild-1-3-task-3', noop);


parent.updaters.child1.updaters['grandchild-1-1'].child(new App('great-grandchild-1-1-1'));
parent.updaters.child1.updaters['grandchild-1-1'].child(new App('great-grandchild-1-1-2'));
parent.updaters.child1.updaters['grandchild-1-1'].child(new App('great-grandchild-1-1-3'));

parent.updaters.child1.updaters['grandchild-1-2'].child(new App('great-grandchild-1-2-1'));
parent.updaters.child1.updaters['grandchild-1-2'].child(new App('great-grandchild-1-2-2'));
parent.updaters.child1.updaters['grandchild-1-2'].child(new App('great-grandchild-1-2-3'));

parent.updaters.child1.updaters['grandchild-1-3'].child(new App('great-grandchild-1-3-1'));
parent.updaters.child1.updaters['grandchild-1-3'].child(new App('great-grandchild-1-3-2'));
parent.updaters.child1.updaters['grandchild-1-3'].child(new App('great-grandchild-1-3-3'));


var nodes = parent.tree({
  getLabel: function(app, options) {
    var color = app.isApp ? 'yellow' : (app.isTask || typeof app === 'function' ? 'cyan' : 'gray');
    return colors[color](app.displayName || app.name);
  },
  getMetadata: function(app, options) {
    var data = {};
    if (app.isApp) {
      data.type = 'app';
    }
    if (app.isTask || typeof app === 'function') {
      data.type = 'task';
    }
    return data;
  }
});

// nodes.forEach(function(node) {
//   if (node.metadata.type === 'app') {
//     node.label = colors.green(node.label);
//   }
//   if (node.metadata.type === 'task') {
//     node.label = colors.cyan(node.label);
//   }
// });

console.log(nodes);
console.log();
console.log(archy(nodes));
