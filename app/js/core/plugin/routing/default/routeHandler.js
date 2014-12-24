define(["./tasksFactory", "core/plugin/routing/assets/appRouterController"], function(TasksFactory, appRouterController) {
  var RouteHandler;
  return RouteHandler = (function() {
    function RouteHandler(route, rules, handler) {
      _.bindAll(this);
      this.routeHandlerTasks = ["before:defineChildObject", "getCached", "loadNotCached"];
    }

    RouteHandler.prototype.defineChildObject = function(routeObject) {
      var child;
      child = this.filterStrategy(this.childRoutes, routeObject.route, this.getCurrentRoute());
      return child;
    };

    RouteHandler.prototype.getCached = function() {};

    RouteHandler.prototype.loadNotCached = function() {
      var _this = this;
      return When(this.environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {
        slot: routeObject.slot
      })).then(function(parentContext) {
        return _this.processChildRoute(parentContext, child);
      }).otherwise(function(error) {
        return navigateToError("js", error);
      });
    };

    RouteHandler.prototype.getCurrentRoute = function() {
      return this.appRouterController.getCurrentRoute();
    };

    return RouteHandler;

  })();
});
