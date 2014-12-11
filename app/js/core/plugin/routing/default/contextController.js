define(["underscore", "when", "./RouteObserver"], function(_, When, RouteObserver) {
  var ContextController;
  return ContextController = (function() {
    function ContextController() {}

    ContextController.prototype._currentRoute = void 0;

    ContextController.prototype._currentChildRoute = void 0;

    ContextController.prototype.routeObserver = null;

    ContextController.prototype._contextHash = {};

    ContextController.prototype.onReady = function() {
      this.routeObserver = new RouteObserver();
      this.routeObserver.watch(this.setRouteData);
      return this.routeObserver.getSignal().add(function(event, entity) {
        if (event === "shift") {
          return console.debug("window.location.hash:::", window.location.hash);
        }
      });
    };

    ContextController.prototype.setRouteData = function(child, groundRouteKey) {
      this.routeObserver.update(child, groundRouteKey);
      this._currentChildRoute = child.route;
      return {
        child: child,
        groundRouteKey: groundRouteKey
      };
    };

    ContextController.prototype.getChildRoute = function() {
      return this._currentChildRoute;
    };

    ContextController.prototype.contextState = function(hash) {
      return console.debug("contextState", hash);
    };

    ContextController.prototype.registerContext = function(context, specId, type) {
      console.debug("registerContext::::", specId, context);
      return this._contextHash[specId] = context;
    };

    ContextController.prototype.getRegistredContext = function(specId) {
      console.debug("@_contextHash", this._contextHash);
      return this._contextHash[specId];
    };

    ContextController.prototype.ensureContext = function(context) {
      if (context.destroy && context.resolve && context.wire) {
        return true;
      } else {
        return false;
      }
    };

    ContextController.prototype.getContextHash = function() {
      return this._contextHash;
    };

    return ContextController;

  })();
});
