define(["when", "core/util/navigation/navigateToError", "./tasksFactory"], function(When, navigateToError, TasksFactory) {
  var RouteHandlerFactory;
  return RouteHandlerFactory = (function() {
    function RouteHandlerFactory() {
      var tasks;
      _.bindAll(this);
      tasks = ["before:defineChildObject", "filter:getCached", "loadNotCached", "after:sequenceBehavior"];
      this.tasksFactory = new TasksFactory(this, tasks);
    }

    RouteHandlerFactory.prototype.createHandler = function(routeObject) {
      return this.tasksFactory.runTasks(routeObject);
    };

    RouteHandlerFactory.prototype.defineChildObject = function(routeObject) {
      return this.child = this.filterStrategy(this.childRoutes, routeObject.route, this.getCurrentRoute());
    };

    RouteHandlerFactory.prototype.getCached = function(routeObject) {
      var deferred, registred;
      deferred = When.defer();
      registred = this.contextController.getRegistredContext(this.child.route);
      if (registred != null) {
        console.debug("registred:::", registred.parentContext);
        this.processChildRoute(registred.parentContext, this.child);
        deferred.reject("Cached");
      } else {
        deferred.resolve(routeObject);
      }
      return deferred.promise;
    };

    RouteHandlerFactory.prototype.loadNotCached = function(routeObject) {
      var env,
        _this = this;
      env = {
        slot: routeObject.slot,
        behavior: routeObject.behavior
      };
      return When(this.environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, env)).then(function(parentContext) {
        _this.processChildRoute(parentContext, _this.child);
        return parentContext;
      }).otherwise(function(error) {
        return navigateToError("js", error);
      });
    };

    RouteHandlerFactory.prototype.processChildRoute = function(context, child) {
      var bundle, relative;
      bundle = [];
      bundle.push(child);
      if (child.relative) {
        relative = _.where(this.childRoutes, {
          spec: child.relative
        })[0];
        bundle.push(relative);
      }
      return this.childContextProcessor.deliver(context, bundle);
    };

    RouteHandlerFactory.prototype.sequenceBehavior = function(context) {
      if (context.behavior != null) {
        return this.behaviorProcessor.sequenceBehavior(context);
      } else {
        return context;
      }
    };

    RouteHandlerFactory.prototype.getCurrentRoute = function() {
      return this.appRouterController.getCurrentRoute();
    };

    return RouteHandlerFactory;

  })();
});
