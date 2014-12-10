var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["underscore", "when", "./route"], function(_, When, Route) {
  var Controller;
  return Controller = (function() {
    Controller.prototype.groupsAllowedFields = {
      "ground": ["spec", "mergeWith", "slot", "rules", "behavior"],
      "child": ["spec", "slot", "behavior", "relative", "noCache", "replaceable"]
    };

    function Controller() {
      _.bindAll(this);
    }

    Controller.prototype.getCurrentRoute = function() {
      return this.appRouterController.getCurrentRoute();
    };

    Controller.prototype.registerGroundRoutes = function() {
      var deferred, i, size,
        _this = this;
      deferred = When.defer();
      i = 0;
      size = _.size(this.groundRoutes);
      _.forEach(this.groundRoutes, function(routeValue, routeKey) {
        var routeHandler;
        i++;
        routeHandler = (function(routeValue, routeKey) {
          return function() {
            return When(_this.environment.loadInEnvironment(routeValue.spec, routeValue.mergeWith, {
              slot: routeValue.slot
            })).then(function(context) {
              var child;
              child = _this.filterStrategy(_this.childRoutes, routeKey, _this.getCurrentRoute());
              _this.contextController.registerContext(context, routeValue.spec, "ground");
              _this.contextController.setRouteData(child, routeKey);
              return _this.processChildRoute(context, child, routeKey);
            }).otherwise(function(error) {
              return console.error("ERROR:::", error);
            });
          };
        })(routeValue, routeKey);
        new Route(routeKey, routeValue.rules, routeHandler);
        if (i === size) {
          return deferred.resolve();
        }
      });
      return deferred.promise;
    };

    Controller.prototype.processChildRoute = function(context, child, routeKey) {
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

    Controller.prototype.checkForAllowedFields = function(object, routeGroupName) {
      var e,
        _this = this;
      try {
        if (!this.groupsAllowedFields.hasOwnProperty(routeGroupName)) {
          throw new Error("The group '" + routeGroupName + "' is not defined in groupsAllowedFields");
        }
        _.each(object, function(value, key) {
          if (__indexOf.call(_this.groupsAllowedFields[routeGroupName], key) < 0) {
            throw new Error("Not allowed field: '" + key + "'");
          }
        });
      } catch (_error) {
        e = _error;
        return false;
      }
      return true;
    };

    return Controller;

  })();
});
