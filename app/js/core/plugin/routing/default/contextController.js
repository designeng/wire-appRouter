define(["underscore", "when", "./RouteObserver"], function(_, When, RouteObserver) {
  var ContextController;
  return ContextController = (function() {
    function ContextController() {}

    ContextController.prototype.routeObserver = null;

    ContextController.prototype._contextHash = {};

    ContextController.prototype.onReady = function() {
      this.routeObserver = new RouteObserver();
      this.routeObserver.watch(this.register);
      return this.routeObserver.getSignal().add(function(event, entity) {
        if (event === "shift") {
          return console.debug("window.location.hash:::", window.location.hash);
        }
      });
    };

    ContextController.prototype.contextState = function(hash) {
      return console.debug("contextState", hash);
    };

    ContextController.prototype.register = function(parentContext, childContext, child) {
      this._contextHash[child.route] = {
        parentContext: parentContext,
        childContext: childContext
      };
      return {
        child: child
      };
    };

    ContextController.prototype.getRegistredContext = function(route) {
      return this._contextHash[route];
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
