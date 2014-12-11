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
          return accessPolicy;
        }
      }
      throw new Error("Access policy strange way definition - use instead one of the next factories: 'wire', 'create', 'module'");
    };

    AccessPolicyProcessor.prototype.askForAccess = function(child) {
      var deferred,
        _this = this;
      deferred = When.defer();
      this.pluginWireFn.loadModule(child.spec).then(function(childContext) {
        if (childContext.accessPolicy != null) {
          return _this.pluginWireFn(_this.normalizeAccessPolicy(childContext.accessPolicy)).then(function(result) {
            if (!result.checkAccess()) {
              deferred.reject("NO ACCESS");
              if (result.getRedirect != null) {
                if (child.replaceable) {
                  return navigate(result.getRedirect(), "replace");
                } else {
                  return navigate(result.getRedirect());
                }
              }
            } else {
              return deferred.resolve(child);
            }
          });
        } else {
          return deferred.resolve(child);
        }
      });
      return deferred.promise;
    };

    return AccessPolicyProcessor;

  })();
});
