define(["underscore", "when", "when/pipeline"], function(_, When, pipeline) {
  var TasksFactory;
  return TasksFactory = (function() {
    function TasksFactory(target, tasks) {
      return this.provideFunctions(target, this.distributeTasks(tasks));
    }

    TasksFactory.prototype.distributeTasks = function(tasks) {
      var distributive, filterRegExp, _filters;
      filterRegExp = /filter:/g;
      distributive = {};
      _filters = _.filter(tasks, function(item) {
        if (item.match(filterRegExp)) {
          return true;
        } else {
          return false;
        }
      });
      distributive["filters"] = _.map(_filters, function(item) {
        return item.split(":")[1];
      });
      distributive["tasks"] = _.difference(tasks, _filters);
      return distributive;
    };

    TasksFactory.prototype.provideFunctions = function(target, distributive) {
      var result;
      result = {};
      _.each(distributive, function(methods, key) {
        return result[key] = _.map(methods, function(method) {
          return target[method];
        }, target);
      }, target);
      return result;
    };

    return TasksFactory;

  })();
});
