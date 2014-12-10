var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["underscore", "meld", "signals"], function(_, meld, Signal) {
  var RouteObserver;
  return RouteObserver = (function() {
    RouteObserver.prototype.removers = [];

    RouteObserver.prototype.currentParams = [];

    RouteObserver.prototype.currentGroundRouteKey = void 0;

    RouteObserver.prototype.currentChildRouteKey = void 0;

    function RouteObserver() {
      this.guessContextResetRoutePositions = __bind(this.guessContextResetRoutePositions, this);
      this._signal = new Signal();
    }

    RouteObserver.prototype.getSignal = function() {
      return this._signal;
    };

    RouteObserver.prototype.watch = function(targetFn) {
      return this.removers.push(meld.afterReturning(targetFn, this.update));
    };

    RouteObserver.prototype.unwatch = function() {
      return _.each(this.removers, function(remover) {
        return remover.remove();
      });
    };

    RouteObserver.prototype.guessContextResetRoutePositions = function(route) {
      var fragments, res;
      fragments = this.normalizeRoute(route);
      res = _.reduce(fragments, function(result, item, index) {
        if (item.match("\\{(.*)}")) {
          result.push(index);
        }
        return result;
      }, []);
      return res;
    };

    RouteObserver.prototype.normalizeRoute = function(route) {
      if (_.isArray(route)) {
        return route;
      } else if (_.isString(route)) {
        return route.split("/");
      }
    };

    RouteObserver.prototype.validate = function(emphasizedPositions, positions) {
      return _.reduce(emphasizedPositions, function(result, positionValue) {
        if (_.indexOf(positions, positionValue)) {
          result = result * 0;
        }
        return result;
      }, 1);
    };

    RouteObserver.prototype.calculatePositions = function(child) {
      var emphasizedPositions, isValid, positions;
      positions = this.guessContextResetRoutePositions(child.route);
      emphasizedPositions = child.contextResetRoutePositions;
      if (emphasizedPositions) {
        isValid = this.validate(emphasizedPositions, positions);
        if (!isValid) {
          throw new Error("Provided for child route '" + child.route + "' contextResetRoutePositions not valid!");
        }
        return emphasizedPositions;
      } else {
        return positions;
      }
    };

    RouteObserver.prototype.theSame = function(a, b) {
      return _.all(_.zip(a, b), function(x) {
        return x[0] === x[1];
      });
    };

    RouteObserver.prototype.indexesOfMutation = function(a, b) {
      return _.reduce(_.zip(a, b), function(result, item, index) {
        if (item[0] !== item[1]) {
          result.push(index);
        }
        return result;
      }, []);
    };

    RouteObserver.prototype.changesOccurred = function(mutations, positions) {
      return !!_.intersection(mutations, positions).length;
    };

    RouteObserver.prototype.update = function(child, groundRouteKey) {
      var mutations, positions;
      positions = this.calculatePositions(child);
      if (!this.theSame(child.params, this.currentParams)) {
        mutations = this.indexesOfMutation(child.params, this.currentParams);
        if (this.changesOccurred(mutations, positions)) {
          console.debug("changesOccurred!");
          this._signal.dispatch("shift", "ground");
        }
      }
      this.currentGroundRouteKey = groundRouteKey;
      this.currentChildRouteKey = child.route;
      return this.currentParams = child.params;
    };

    return RouteObserver;

  })();
});
