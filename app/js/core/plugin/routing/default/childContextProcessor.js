define(["underscore", "when", "when/pipeline", "./tasksFactory"], function(_, When, pipeline, TasksFactory) {
  var ChildContextProcessor;
  return ChildContextProcessor = (function() {
    ChildContextProcessor.prototype.parentContext = void 0;

    function ChildContextProcessor() {
      var tasks;
      _.bindAll(this);
      tasks = ["filter:askForAccess", "wireChildContext", "sequenceBehavior", "synchronize"];
      this.distributive = new TasksFactory(this, tasks);
    }

    ChildContextProcessor.prototype.deliver = function(parentContext, bundle) {
      var noop,
        _this = this;
      this.parentContext = parentContext;
      noop = function() {};
      return _.each(bundle, function(item, index) {
        if (index > 0) {
          delete item.behavior;
        }
        return pipeline(_this.distributive["filters"], item).then(function(result) {
          return pipeline(_this.distributive["tasks"], result).then(function(res) {
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
      var registred;
      registred = this.contextController.getRegistredContext(child.route);
      if (registred != null) {
        return child;
      } else {
        return this.accessPolicyProcessor.askForAccess(child);
      }
    };

    ChildContextProcessor.prototype.wireChildContext = function(child) {
      var childContext, environment, registred,
        _this = this;
      registred = this.contextController.getRegistredContext(child.route);
      if (registred != null) {
        childContext = registred.childContext;
        return childContext;
      } else {
        environment = {
          slot: child.slot
        };
        if (typeof child.behavior !== "undefined") {
          environment["behavior"] = child.behavior;
        }
        return When(this.environment.loadInEnvironment(child.spec, child.mergeWith, environment, this.parentContext)).then(function(childContext) {
          _this.contextController.register(_this.parentContext, childContext, child);
          return childContext;
        }, function(rejectReason) {
          return console.debug("ChildContextProcessor::wireChildContext:rejectReason:", rejectReason);
        });
      }
    };

    ChildContextProcessor.prototype.sequenceBehavior = function(childContext) {
      console.debug("sequenceBehavior", childContext);
      if (childContext.behavior != null) {
        return this.behaviorProcessor.sequenceBehavior(childContext);
      } else {
        return childContext;
      }
    };

    ChildContextProcessor.prototype.synchronize = function(childContext) {
      if (typeof childContext.synchronizeWithRoute !== "undefined") {
        childContext.synchronizeWithRoute.call(childContext);
      }
      return childContext;
    };

    ChildContextProcessor.prototype.destroyTest = function(childContext) {
      return setTimeout(function() {
        return childContext.destroy();
      }, 1000);
    };

    return ChildContextProcessor;

  })();
});
