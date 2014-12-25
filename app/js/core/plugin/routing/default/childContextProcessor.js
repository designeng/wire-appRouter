define(["underscore", "when", "when/pipeline", "./tasksFactory"], function(_, When, pipeline, TasksFactory) {
  var ChildContextProcessor;
  return ChildContextProcessor = (function() {
    ChildContextProcessor.prototype.parentContext = void 0;

    function ChildContextProcessor() {
      var tasks;
      _.bindAll(this);
      tasks = ["filter:askForAccess", "wireChildContext", "sequenceBehavior", "synchronize"];
      this.tasksFactory = new TasksFactory(this, tasks);
    }

    ChildContextProcessor.prototype.deliver = function(parentContext, bundle) {
      var _this = this;
      this.parentContext = parentContext;
      return _.each(bundle, function(item, index) {
        if (index > 0) {
          delete item.behavior;
        }
        return _this.tasksFactory.runTasks(item);
      });
    };

    ChildContextProcessor.prototype.askForAccess = function(child) {
      var registred;
      registred = this.contextController.getRegistredContext(child.route, "child");
      if (registred != null) {
        return child;
      } else {
        return this.accessPolicyProcessor.askForAccess(child);
      }
    };

    ChildContextProcessor.prototype.wireChildContext = function(child) {
      var childContext, environment, _ref,
        _this = this;
      childContext = (_ref = this.contextController.getRegistredContext(child.route, "child")) != null ? _ref.childContext : void 0;
      if (childContext != null) {
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

    return ChildContextProcessor;

  })();
});
