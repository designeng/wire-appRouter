define(["underscore", "when"], function(_, When) {
  var Environment;
  return Environment = (function() {
    function Environment() {}

    Environment.prototype.getMergedModulesArrayOfPromises = function(specId, mergeWith) {
      var mergingModule, promisedModules, _i, _len;
      promisedModules = [];
      promisedModules.push(this.pluginWireFn.loadModule(specId));
      if (mergeWith) {
        if (_.isString(mergeWith)) {
          promisedModules.push(this.pluginWireFn.loadModule(mergeWith));
        } else if (_.isArray(mergeWith)) {
          for (_i = 0, _len = mergeWith.length; _i < _len; _i++) {
            mergingModule = mergeWith[_i];
            promisedModules.push(this.pluginWireFn.loadModule(mergingModule));
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
