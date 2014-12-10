define(["underscore", "when", "core/util/navigation/navigate"], function(_, When, navigate) {
  var AccessPolicyProcessor;
  return AccessPolicyProcessor = (function() {
    AccessPolicyProcessor.prototype.factories = ["wire", "create", "module"];

    function AccessPolicyProcessor() {
      _.bindAll(this, "normalizeAccessPolicy");
    }

    AccessPolicyProcessor.prototype.normalizeAccessPolicy = function(accessPolicy) {
      var factory, _i, _len, _ref;
      _ref = this.factories;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        factory = _ref[_i];
        if (accessPolicy[factory] != null) {
          return accessPolicy[factory];
        }
      }
      throw new Error("Access policy strange way definition - use instead one of the next factories: 'wire', 'create', 'module'");
    };

    AccessPolicyProcessor.prototype.askForAccess = function(child) {
      var deferred,
        _this = this;
      deferred = When.defer();
      if (child.accessPolicy != null) {
        this.pluginWireFn(this.normalizeAccessPolicy(accessPolicy)).then(function(checkingContext) {
          if (!checkingContext.accessPolicy.checkAccess()) {
            deferred.reject("NO ACCESS");
            if (checkingContext.accessPolicy.getRedirect != null) {
              if (childRouteObject.replaceable) {
                return navigate(checkingContext.accessPolicy.getRedirect(), "replace");
              } else {
                return navigate(checkingContext.accessPolicy.getRedirect());
              }
            }
          } else {
            return deferred.resolve(child);
          }
        });
      } else {
        deferred.resolve(child);
      }
      return deferred.promise;
    };

    return AccessPolicyProcessor;

  })();
});
