define(["underscore", "when", "when/sequence", "when/pipeline"], function(_, When, sequence, pipeline) {
  var TasksFactory;
  return TasksFactory = (function() {
    TasksFactory.prototype.noop = function(object) {
      return object;
    };

    function TasksFactory(target, tasks) {
      this.distributive = this.provideFunctions(target, this.prepareTasks(tasks));
      return this;
    }

    TasksFactory.prototype.prepareTasks = function(tasks) {
      var beforeRegExp, distributive, filterRegExp, _befores, _filters;
      beforeRegExp = /before:/g;
      filterRegExp = /filter:/g;
      distributive = {};
      _befores = _.filter(tasks, function(item) {
        if (item.match(beforeRegExp)) {
          return true;
        } else {
          return false;
        }
      });
      _filters = _.filter(tasks, function(item) {
        if (item.match(filterRegExp)) {
          return true;
        } else {
          return false;
        }
      });
      distributive["befores"] = _.map(_befores, function(item) {
        return item.split(":")[1];
      });
      distributive["filters"] = _.map(_filters, function(item) {
        return item.split(":")[1];
      });
      distributive["tasks"] = _.difference(tasks, _filters, _befores);
      return distributive;
    };

    TasksFactory.prototype.provideFunctions = function(target, distributive) {
      var result;
      result = {};
      _.each(distributive, function(methods, key) {
        return result[key] = _.map(methods, function(method) {
          if (!target[method]) {
            throw new Error("No method with name '" + method + "' provided!");
          } else {
            return target[method];
          }
        }, target);
      }, target);
      return result;
    };

    TasksFactory.prototype.runTasks = function(item, callback) {
      var _this = this;
      if (!_.isFunction(callback)) {
        callback = this.noop;
      }
      return sequence(this.distributive["befores"], item).then(function() {
        return pipeline(_this.distributive["filters"], item).then(function(result1) {
          return pipeline(_this.distributive["tasks"], result1).then(function(result2) {
            return callback(result2);
          }, function(err) {
            return console.error("PIPELINE TASKS ERR:::", err);
          });
        }, function(reason) {
          return console.debug("PIPELINE FILTERS ERR:::", reason);
        });
      });
    };

    return TasksFactory;

  })();
});
