define(["underscore", "when", "core/util/navigation/navigateToError"], function(_, When, navigateToError) {
  var Environment;
  return Environment = (function() {
    function Environment() {}

    Environment.prototype.loadModule = function(moduleId) {
      return this.pluginWireFn.loadModule(moduleId).then(function(resultContext) {
        return resultContext;
      }, function(error) {
        return navigateToError("js", error);
      });
    };

    Environment.prototype.getMergedModulesArrayOfPromises = function(specId, mergeWith) {
      var mergingModule, promisedModules, _i, _len;
      promisedModules = [];
      promisedModules.push(this.loadModule(specId));
      if (mergeWith) {
        if (_.isString(mergeWith)) {
          promisedModules.push(this.loadModule(mergeWith));
        } else if (_.isArray(mergeWith)) {
          for (_i = 0, _len = mergeWith.length; _i < _len; _i++) {
            mergingModule = mergeWith[_i];
            promisedModules.push(this.loadModule(mergingModule));
          }
        } else {
          throw new Error("mergeWith option has unsupported format!");
        }
      }
      return promisedModules;
    };

    Environment.prototype.applyEnvironment = function(object, environment) {
      object = _.extend(object, environment);
      if (typeof environment.behavior !== "undefined") {
        if (!object.$plugins) {
          object.$plugins = [];
        }
        object.$plugins.push("core/plugin/behavior");
      }
      return object;
    };

    Environment.prototype.loadInEnvironment = function(specId, mergeWith, environment) {
      var deferred, promisedModules,
        _this = this;
      deferred = When.defer();
      promisedModules = this.getMergedModulesArrayOfPromises(specId, mergeWith);
      When.all(promisedModules).then(function(modulesResult) {
        modulesResult[0] = _this.applyEnvironment(modulesResult[0], environment);
        return _this.pluginWireFn.createChild(modulesResult).then(function(context) {
          return deferred.resolve(context);
        });
      });
      return deferred.promise;
    };

    return Environment;

  })();
});
