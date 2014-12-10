define(["underscore"], function(_) {
  var ContextHashController, contextHashController;
  ContextHashController = (function() {
    function ContextHashController() {}

    ContextHashController.prototype.cpidRouteIndex = 2;

    ContextHashController.prototype.contextHash = {};

    ContextHashController.prototype.resetHash = function() {
      _.each(this.contextHash, function(cpidCasheObject) {
        return _.each(cpidCasheObject, function(context) {
          return context.destroy();
        });
      });
      return this.contextHash = {};
    };

    ContextHashController.prototype.getHash = function() {
      return this.contextHash;
    };

    ContextHashController.prototype.getCpid = function(route) {
      return route.params[this.cpidRouteIndex];
    };

    ContextHashController.prototype.cacheContext = function(route, spec, context) {
      var cpid, e;
      cpid = this.getCpid(route);
      try {
        if (cpid) {
          return this.contextHash[cpid][spec] = context;
        }
      } catch (_error) {
        e = _error;
        if (cpid) {
          if (!this.contextHash[cpid]) {
            this.contextHash[cpid] = {};
          }
          if (!this.contextHash[cpid][spec]) {
            return this.contextHash[cpid][spec] = context;
          }
        }
      }
    };

    ContextHashController.prototype.getCachedContext = function(route, spec) {
      var cpid, e;
      cpid = this.getCpid(route);
      try {
        if (cpid) {
          return this.contextHash[cpid][spec];
        }
      } catch (_error) {
        e = _error;
        return false;
      }
    };

    ContextHashController.prototype.removeCachedContext = function(route, spec) {
      var cpid;
      cpid = this.getCpid(route);
      if (cpid) {
        this.contextHash[cpid][spec].destroy();
        return delete this.contextHash[cpid][spec];
      }
    };

    ContextHashController.prototype.ensureContext = function(context) {
      if (context.destroy && context.resolve && context.wire) {
        return true;
      } else {
        return false;
      }
    };

    return ContextHashController;

  })();
  if (typeof contextHashController === "undefined" || contextHashController === null) {
    return contextHashController = new ContextHashController();
  }
});
