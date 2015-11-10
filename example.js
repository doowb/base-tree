'use strict';

var archy = require('archy');
var Base = require('base-methods');
var tree = require('./');

function App(name) {
  Base.call(this);
  this.name = name;
  this.updaters = {};
  this.use(tree({plural: 'updaters'}));
}

Base.extend(App);

App.prototype.child = function(app) {
  this.updaters[app.name] = app;
  return this;
};

var parent = new App('parent');
parent.child(new App('child1'));
parent.child(new App('child2'));
parent.child(new App('child3'));

parent.updaters.child1.child(new App('grandchild-1-1'));
parent.updaters.child1.child(new App('grandchild-1-2'));
parent.updaters.child1.child(new App('grandchild-1-3'));

parent.updaters.child2.child(new App('grandchild-2-1'));
parent.updaters.child2.child(new App('grandchild-2-2'));
parent.updaters.child2.child(new App('grandchild-2-3'));

parent.updaters.child3.child(new App('grandchild-3-1'));
parent.updaters.child3.child(new App('grandchild-3-2'));
parent.updaters.child3.child(new App('grandchild-3-3'));

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
    return app.name;
  },
  getData: function(app, options) {
    if (typeof options.getLabel === 'function') {
      if (options.getLabel(app, options).indexOf('child') !== -1) {
        return {
          type: 'child'
        };
      }
    }
    return {};
  }
});

console.log(nodes);
console.log();
console.log(archy(nodes));
