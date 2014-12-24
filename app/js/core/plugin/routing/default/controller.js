var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["underscore", "when", "when/pipeline", "core/util/navigation/navigateToError", "./route"], function(_, When, pipeline, navigateToError, Route) {
  var Controller;
  return Controller = (function() {
    Controller.prototype.groupsAllowedFields = {
      "ground": ["spec", "mergeWith", "slot", "rules", "behavior"],
      "child": ["spec", "slot", "behavior", "relative", "noCache", "replaceable"]
    };

    function Controller() {
      var routeHandlerTasks;
      routeHandlerTasks = ["sequenceBehavior", "synchronize"];
      _.bindAll(this);
    }

    Controller.prototype.getCurrentRoute = function() {
      return this.appRouterController.getCurrentRoute();
    };

    Controller.prototype.registerGroundRoutes = function() {
      var _this = this;
      return _.forEach(this.groundRoutes, function(routeValue, routeKey) {
        var routeHandler, routeObject;
        routeObject = _.extend({}, routeValue, {
          route: routeKey
        });
        routeHandler = (function(routeObject) {
          return function() {
            var child;
            child = _this.filterStrategy(_this.childRoutes, routeObject.route, _this.getCurrentRoute());
            return When(_this.environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {
              slot: routeObject.slot
            })).then(function(parentContext) {
              return _this.processChildRoute(parentContext, child);
            }).otherwise(function(error) {
              return navigateToError("js", error);
            });
          };
        })(routeObject);
        return new Route(routeKey, routeValue.rules, routeHandler);
      });
    };

    Controller.prototype.processChildRoute = function(context, child) {
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
