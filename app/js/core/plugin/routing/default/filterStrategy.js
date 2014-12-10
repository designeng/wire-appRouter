define(["underscore"], function(_) {
  var filterStrategy, filterZipped;
  filterZipped = function(memo, pair) {
    var first, last;
    first = pair[0];
    last = pair[1];
    if (_.isUndefined(first)) {
      return memo * 0;
    }
    if (first.match("\\{(.*)}") && !_.isUndefined(last)) {
      return memo * 1;
    }
    if (first !== last) {
      return memo * 0;
    } else {
      return memo * 1;
    }
  };
  filterStrategy = function(childRoutes, route, currentRoute) {
    var childRouteObject, childRoutesKeys, current, res, routeKey, splitted, zipped, _i, _len;
    current = currentRoute.params;
    childRoutesKeys = _.keys(childRoutes);
    for (_i = 0, _len = childRoutesKeys.length; _i < _len; _i++) {
      routeKey = childRoutesKeys[_i];
      splitted = routeKey.split("/");
      zipped = _.zip(splitted, current);
      res = _.reduce(zipped, filterZipped, 1);
      if (res) {
        childRouteObject = childRoutes[routeKey];
        childRouteObject.route = routeKey;
        childRouteObject.params = currentRoute.params;
        return childRouteObject;
      }
    }
    return void 0;
  };
  return filterStrategy;
});
