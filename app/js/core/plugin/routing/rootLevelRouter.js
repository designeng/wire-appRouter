define(["underscore", "crossroads", "hasher", 'when', 'wire/lib/object', 'wire/lib/context', "core/util/navigation/getCurrentRoute", 'when/sequence'], function(_, crossroads, hasher, When, object, createContext, getCurrentRoute, sequence) {
  return function(options) {
    var childRoutes, createRouter, currentContext, currentProspectSpec, errorHandler, filterStrategy, initializeRouter, injectBechavior, isRef, parseHash, pluginInstance, routeBinding, sequenceBehavior, startChildRouteWiring, tempRouter, wireChildRoute;
    currentContext = null;
    currentProspectSpec = void 0;
    tempRouter = void 0;
    filterStrategy = void 0;
    childRoutes = void 0;
    errorHandler = function(error) {
      return console.error(error.stack);
    };
    parseHash = function(newHash, oldHash) {
      return tempRouter.parse(newHash);
    };
    createRouter = function(compDef, wire) {
      return When.promise(function(resolve) {
        tempRouter = crossroads.create();
        return resolve(tempRouter);
      });
    };
    isRef = function(it) {
      return it && object.hasOwn(it, '$ref');
    };
    startChildRouteWiring = function(prospectCTX, route, wire) {
      var childRouteObject, properties;
      childRouteObject = filterStrategy(childRoutes, route, getCurrentRoute().slice(1));
      properties = {
        spec: childRouteObject.spec,
        slot: childRouteObject.slot,
        behavior: childRouteObject.behavior,
        subSpecs: childRouteObject.subSpecs,
        route: childRouteObject.route,
        options: childRouteObject.options
      };
      return wireChildRoute(prospectCTX, properties, wire);
    };
    wireChildRoute = function(prospectCTX, properties, wire) {
      return wire.loadModule(properties.spec).then(function(childSpecObj) {
        childSpecObj.slot = properties.slot;
        if (properties.behavior) {
          injectBechavior(childSpecObj, properties.behavior);
        }
        if (properties.options) {
          childSpecObj.options = properties.options;
        }
        return prospectCTX.wire(childSpecObj).then(function(childCTX) {
          var subSpec, _i, _len, _ref, _results;
          if (properties.behavior) {
            sequenceBehavior(childCTX, properties.route, wire);
          }
          if (properties.subSpecs) {
            _ref = properties.subSpecs;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subSpec = _ref[_i];
              subSpec.route = properties.route;
              _results.push(wireChildRoute(prospectCTX, subSpec, wire));
            }
            return _results;
          }
        });
      });
    };
    injectBechavior = function(childSpecObj, behavior) {
      if (!childSpecObj.$plugins) {
        childSpecObj.$plugins = [];
      }
      childSpecObj.$plugins.push("core/plugin/behavior");
      return childSpecObj.behavior = behavior;
    };
    sequenceBehavior = function(childCTX, route, wire) {
      return When(wire.getProxy(childCTX.behavior), function(behaviorObj) {
        var tasks;
        tasks = behaviorObj.target;
        return sequence(tasks, childCTX, route);
      }, function() {});
    };
    routeBinding = function(tempRouter, compDef, wire) {
      var behavior, mergeWith, oneRoute, route, routeFn, routeObject, rules, slot, spec, _ref, _results;
      _ref = compDef.options.routes;
      _results = [];
      for (route in _ref) {
        routeObject = _ref[route];
        spec = routeObject.spec;
        mergeWith = routeObject.mergeWith;
        slot = routeObject.slot;
        rules = routeObject.rules;
        behavior = routeObject.behavior;
        routeFn = (function(spec, mergeWith, slot, route, behavior, wire) {
          var mergingModule, promisedModules, specPromise, _i, _len;
          if (spec !== currentProspectSpec) {
            promisedModules = [];
            specPromise = wire.loadModule(spec);
            promisedModules.push(specPromise);
            if (_.isString(mergeWith)) {
              promisedModules.push(wire.loadModule(mergeWith));
            } else if (_.isArray(mergeWith)) {
              for (_i = 0, _len = mergeWith.length; _i < _len; _i++) {
                mergingModule = mergeWith[_i];
                promisedModules.push(wire.loadModule(mergingModule));
              }
            }
            return When.all(promisedModules).then(function(modulesResult) {
              var rootContext;
              modulesResult[0].slot = slot;
              rootContext = createContext(modulesResult);
              return rootContext.then(function(prospectCTX) {
                return startChildRouteWiring(prospectCTX, route, wire);
              });
            });
          } else {
            return startChildRouteWiring(currentContext, route, wire);
          }
        }).bind(null, spec, mergeWith, slot, route, behavior, wire);
        oneRoute = tempRouter.addRoute(route);
        oneRoute.rules = rules;
        oneRoute.matched.add(routeFn);
        hasher.initialized.add(parseHash);
        _results.push(hasher.changed.add(parseHash));
      }
      return _results;
    };
    initializeRouter = function(resolver, compDef, wire) {
      if (isRef(compDef.options.childRoutes)) {
        wire(compDef.options.childRoutes).then(function(routes) {
          return childRoutes = routes;
        });
      }
      if (isRef(compDef.options.routeFilterStrategy)) {
        wire(compDef.options.routeFilterStrategy).then(function(strategy) {
          return filterStrategy = strategy;
        });
      } else {

      }
      return createRouter(compDef, wire).then(function(tempRouter) {
        return resolver.resolve(routeBinding(tempRouter, compDef, wire));
      }, function(error) {
        return console.error(error.stack);
      });
    };
    pluginInstance = {
      ready: function(resolver, proxy, wire) {
        return resolver.resolve();
      },
      destroy: function(resolver, proxy, wire) {
        tempRouter.dispose();
        return resolver.resolve();
      },
      factories: {
        rootLevelRouter: initializeRouter
      }
    };
    return pluginInstance;
  };
});
