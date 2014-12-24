define(["underscore", "when", "when/pipeline"], function(_, When, pipeline) {
  var TasksFactory;
  return TasksFactory = (function() {
    function TasksFactory(target, tasks) {
      this.distributive = this.provideFunctions(target, this.prepareTasks(tasks));
      return this;
    }

    TasksFactory.prototype.prepareTasks = function(tasks) {
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

    TasksFactory.prototype.runTasks = function(item, callback) {
      var noop,
        _this = this;
      noop = function() {};
      if (!_.isFunction(callback)) {
        callback = noop;
      }
      return pipeline(this.distributive["filters"], item).then(function(result) {
        return pipeline(_this.distributive["tasks"], result).then(function(res) {
          return callback();
        }, function(err) {
          return console.error("PIPELINE TASKS ERR:::", err);
        });
      }, function(reason) {
        return console.debug("PIPELINE FILTERS ERR:::", reason);
      });
    };

    return TasksFactory;

  })();
});
