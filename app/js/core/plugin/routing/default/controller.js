var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["underscore", "when", "./route"], function(_, When, Route) {
  var Controller;
  return Controller = (function() {
    Controller.prototype.groupsAllowedFields = {
      "ground": ["spec", "mergeWith", "slot", "rules", "behavior"],
      "child": ["spec", "slot", "behavior", "relative", "noCache", "replaceable"]
    };

    function Controller() {}

    Controller.prototype.registerGroundRoutes = function() {
      var _this = this;
      return _.forEach(this.groundRoutes, function(routeValue, routeKey) {
        var routeHandler, routeObject;
        routeObject = _.extend({}, routeValue, {
          route: routeKey
        });
        routeHandler = (function(routeObject) {
          return function() {
            return _this.routeHandlerFactory.createHandler(routeObject);
          };
        })(routeObject);
        return new Route(routeKey, routeValue.rules, routeHandler);
      });
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
