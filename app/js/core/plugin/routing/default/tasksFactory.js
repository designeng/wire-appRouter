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
      var afterRegExp, beforeRegExp, distributive, filterRegExp, _afters, _befores, _filters;
      beforeRegExp = /before:/g;
      afterRegExp = /after:/g;
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
      _afters = _.filter(tasks, function(item) {
        if (item.match(afterRegExp)) {
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
      distributive["afters"] = _.map(_afters, function(item) {
        return item.split(":")[1];
      });
      distributive["tasks"] = _.difference(tasks, _filters, _befores, _afters);
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
      var deferred,
        _this = this;
      if (!_.isFunction(callback)) {
        callback = this.noop;
      }
      deferred = When.defer();
      sequence(this.distributive["befores"], item).then(function() {
        return pipeline(_this.distributive["filters"], item).then(function(result1) {
          return pipeline(_this.distributive["tasks"], result1).then(function(result2) {
            deferred.resolve(result2);
            return callback(result2);
          }, function(err) {
            return console.error("PIPELINE TASKS ERR:::", err);
          });
        }, function(reason) {
          deferred.resolve(false);
          return console.debug("PIPELINE FILTERS ERR:::", reason);
        });
      });
      return When(deferred.promise).then(function(resultContext) {
        console.debug("res::::", resultContext);
        return sequence(_this.distributive["afters"], resultContext);
      });
    };

    return TasksFactory;

  })();
});
