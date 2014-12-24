define(["when", "core/util/navigation/navigateToError", "./tasksFactory"], function(When, navigateToError, TasksFactory) {
  var RouteHandlerFactory;
  return RouteHandlerFactory = (function() {
    function RouteHandlerFactory() {
      var tasks;
      _.bindAll(this);
      tasks = ["before:defineChildObject", "filter:getCached", "loadNotCached"];
      this.tasksFactory = new TasksFactory(this, tasks);
    }

    RouteHandlerFactory.prototype.createHandler = function(routeObject) {
      console.debug("routeObject", routeObject);
      return this.tasksFactory.runTasks(routeObject);
    };

    RouteHandlerFactory.prototype.defineChildObject = function(routeObject) {
      this.child = this.filterStrategy(this.childRoutes, routeObject.route, this.getCurrentRoute());
      return console.debug("defineChildObject:::", this.child);
    };

    RouteHandlerFactory.prototype.getCached = function() {
      var registred;
      registred = this.contextController.getRegistredContext(this.child.route);
      if (registred != null) {
        this.processChildRoute(registred.parentContext, this.child);
      }
      return 0;
    };

    RouteHandlerFactory.prototype.loadNotCached = function(routeObject) {
      var _this = this;
      return When(this.environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {
        slot: routeObject.slot
      })).then(function(parentContext) {
        return _this.processChildRoute(parentContext, _this.child);
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

    RouteHandlerFactory.prototype.getCurrentRoute = function() {
      return this.appRouterController.getCurrentRoute();
    };

    return RouteHandlerFactory;

  })();
});
