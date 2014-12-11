define(["underscore", "when", "when/pipeline"], function(_, When, pipeline) {
  var ChildContextProcessor;
  return ChildContextProcessor = (function() {
    ChildContextProcessor.prototype.parentContext = void 0;

    function ChildContextProcessor() {
      _.bindAll(this);
    }

    ChildContextProcessor.prototype.distributeTasks = function(tasks) {
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

    ChildContextProcessor.prototype.provideFunctions = function(distributive) {
      var result;
      result = {};
      _.each(distributive, function(methods, key) {
        return result[key] = _.map(methods, function(method) {
          return this[method];
        }, this);
      }, this);
      return result;
    };

    ChildContextProcessor.prototype.deliver = function(parentContext, bundle) {
      var distributive, noop, tasks;
      this.parentContext = parentContext;
      tasks = ["filter:askForAccess", "wireChildContext", "sequenceBehavior", "synchronize"];
      distributive = this.provideFunctions(this.distributeTasks(tasks));
      noop = function() {};
      return _.each(bundle, function(item, index) {
        var _this = this;
        return pipeline(distributive["filters"], item).then(function(result) {
          return pipeline(distributive["tasks"], result).then(function(res) {
            return noop();
          }, function(err) {
            return console.error("PIPELINE TASKS ERR:::", err);
          });
        }, function(reason) {
          return console.debug("PIPELINE FILTERS ERR:::", reason);
        });
      });
    };

    ChildContextProcessor.prototype.askForAccess = function(child) {
      return this.accessPolicyProcessor.askForAccess(child);
    };

    ChildContextProcessor.prototype.wireChildContext = function(child) {
      var environment,
        _this = this;
      environment = {
        slot: this.parentContext.slot
      };
      if (typeof child.behavior !== "undefined") {
        environment["behavior"] = child.behavior;
      }
      return When(this.environment.loadInEnvironment(child.spec, child.mergeWith, environment)).then(function(childResultContext) {
        _this.contextController.registerContext(childResultContext, child.spec, "child");
        return childResultContext;
      }, function(rejectReason) {
        return console.debug("rejectReason:::::", rejectReason);
      });
    };

    ChildContextProcessor.prototype.sequenceBehavior = function(childContext) {
      if (childContext.behavior != null) {
        return this.behaviorProcessor.sequenceBehavior(childContext);
      } else {
        return childContext;
      }
    };

    ChildContextProcessor.prototype.synchronize = function(childContext) {
      if (childContext.synchronizeWithRoute != null) {
        childContext.synchronizeWithRoute.call(childContext);
      }
      return childContext;
    };

    return ChildContextProcessor;

  })();
});
