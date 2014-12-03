define(["underscore", "hasher", 'when', 'wire/lib/object', "core/util/navigation/navigate", "core/util/navigation/getCurrentCpid", "core/util/navigation/navigateToError", "core/plugin/routing/assets/appRouterController", "core/plugin/routing/assets/contextHashController", "when/sequence", "specs/reporter/spec"], function(_, hasher, When, object, navigate, getCurrentCpid, navigateToError, appRouterController, contextHashController, sequence, reporterSpec) {
  return function(options) {
    var childRoutes, childSpecs, errorHandler, filterStrategy, getCurrentHash, getCurrentRoute, initializeRouter, injectBechavior, isRef, noop, normalizeAccessPolicy, parseHash, pluginInstance, prospectContextWireChildObj, routeBinding, sequenceBehavior, startChildRouteWiring, synchronizeWithRoute, wireChildRouteSpec, _currentRoute;
    _currentRoute = void 0;
    filterStrategy = void 0;
    childRoutes = void 0;
    childSpecs = [];
    noop = function() {};
    errorHandler = function(error) {
      return console.error(error.stack);
    };
    parseHash = function(newHash, oldHash) {
      return appRouterController.parse(newHash);
    };
    getCurrentHash = function() {
      return getCurrentRoute().params.join("/");
    };
    getCurrentRoute = function() {
      return appRouterController.getCurrentRoute();
    };
    isRef = function(it) {
      return it && object.hasOwn(it, '$ref');
    };
    normalizeAccessPolicy = function(accessPolicy) {
      var factories, factory, _i, _len;
      factories = ["wire", "create", "module"];
      for (_i = 0, _len = factories.length; _i < _len; _i++) {
        factory = factories[_i];
        if (accessPolicy[factory] != null) {
          return accessPolicy[factory];
        }
      }
      throw new Error("Access policy strange way definition - use instead one of the next factories: 'wire', 'create', 'module'");
    };
    synchronizeWithRoute = function(context) {
      if (context.synchronizeWithRoute != null) {
        return context.synchronizeWithRoute.call(context);
      }
    };
    startChildRouteWiring = function(prospectCTX, route, wire) {
      var childRouteObject, relative, relativeObject;
      childRouteObject = filterStrategy(childRoutes, route, getCurrentHash());
      wireChildRouteSpec(prospectCTX, childRouteObject, wire);
      relative = childRouteObject.relative;
      if (relative && !contextHashController.getCachedContext(getCurrentRoute(), relative)) {
        relativeObject = _.where(childSpecs, {
          spec: relative
        })[0];
        childRouteObject = {
          spec: relative,
          slot: relativeObject.slot,
          options: relativeObject.options,
          noCache: relativeObject.noCache,
          replaceable: relativeObject.replaceable
        };
        return wireChildRouteSpec(prospectCTX, childRouteObject, wire);
      }
    };
    wireChildRouteSpec = function(prospectCTX, childRouteObject, wire) {
      var _context;
      _currentRoute = getCurrentRoute();
      _context = contextHashController.getCachedContext(_currentRoute, childRouteObject.spec);
      if (!_context) {
        return wire.loadModule(childRouteObject.spec).then(function(childSpecObj) {
          childSpecObj.slot = childRouteObject.slot;
          if (childRouteObject.behavior) {
            childSpecObj = injectBechavior(childSpecObj, childRouteObject.behavior);
          }
          if (childRouteObject.options) {
            childSpecObj.options = childRouteObject.options;
          }
          if (childSpecObj.accessPolicy != null) {
            return prospectCTX.wire(normalizeAccessPolicy(childSpecObj.accessPolicy)).then(function(checkingCTX) {
              if (!checkingCTX.accessPolicy.checkAccess()) {
                if (checkingCTX.accessPolicy.getRedirect != null) {
                  if (childRouteObject.replaceable) {
                    return navigate(checkingCTX.accessPolicy.getRedirect(), "replace");
                  } else {
                    return navigate(checkingCTX.accessPolicy.getRedirect());
                  }
                }
              } else {
                return prospectContextWireChildObj(prospectCTX, childSpecObj, childRouteObject, wire);
              }
            });
          } else {
            return prospectContextWireChildObj(prospectCTX, childSpecObj, childRouteObject, wire);
          }
        }).otherwise(function(err) {
          return navigateToError('js', err);
        });
      } else {
        if (childRouteObject.behavior) {
          if (_context.behavior) {
            sequenceBehavior(_context, childRouteObject.route, wire);
          } else {
            contextHashController.removeCachedContext(_currentRoute, childRouteObject.spec);
            wireChildRouteSpec(prospectCTX, childRouteObject, wire);
          }
        }
        return synchronizeWithRoute(_context);
      }
    };
    prospectContextWireChildObj = function(prospectCTX, childSpecObj, childRouteObject, wire) {
      return prospectCTX.wire(childSpecObj).then(function(childCTX) {
        if (!childRouteObject.noCache) {
          contextHashController.cacheContext(_currentRoute, childRouteObject.spec, childCTX);
        }
        if (childRouteObject.behavior) {
          sequenceBehavior(childCTX, childRouteObject.route, wire);
        }
        synchronizeWithRoute(childCTX);
        return childCTX.wire(reporterSpec).then(function(reporterContext) {});
      });
    };
    injectBechavior = function(childSpecObj, behavior) {
      if (!childSpecObj.$plugins) {
        childSpecObj.$plugins = [];
      }
      childSpecObj.$plugins.push("core/plugin/behavior");
      childSpecObj.behavior = behavior;
      return childSpecObj;
    };
    sequenceBehavior = function(childCTX, route, wire) {
      return When(wire.getProxy(childCTX.behavior), function(behaviorObj) {
        var tasks;
        tasks = behaviorObj.target;
        return sequence(tasks, childCTX, route);
      }, function() {});
    };
    routeBinding = function(appRouterController, compDef, wire) {
      var behavior, mergeWith, oneRoute, route, routeFn, routeObject, rules, slot, spec, _cpid, _currentContext, _currentProspectSpec, _ref, _results;
      _currentContext = null;
      _currentProspectSpec = void 0;
      _cpid = void 0;
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
          var cpid, mergingModule, promisedModules, specPromise, _i, _len;
          cpid = getCurrentCpid();
          if (spec !== _currentProspectSpec || _cpid !== cpid) {
            if (_currentContext != null) {
              _currentContext.destroy();
            }
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
              rootContext = wire.createChild(modulesResult);
              return rootContext.then(function(prospectCTX) {
                return When(prospectCTX).then(function() {
                  _currentContext = prospectCTX;
                  _currentProspectSpec = spec;
                  _cpid = cpid;
                  contextHashController.resetHash();
                  return startChildRouteWiring(prospectCTX, route, wire);
                });
              });
            });
          } else {
            return startChildRouteWiring(_currentContext, route, wire);
          }
        }).bind(null, spec, mergeWith, slot, route, behavior, wire);
        oneRoute = appRouterController.addRoute(route);
        oneRoute.rules = rules;
        _results.push(oneRoute.matched.add(routeFn));
      }
      return _results;
    };
    initializeRouter = function(resolver, compDef, wire) {
      if (isRef(compDef.options.childRoutes)) {
        wire(compDef.options.childRoutes).then(function(routes) {
          var route, routeObject, _results;
          childRoutes = routes;
          _results = [];
          for (route in routes) {
            routeObject = routes[route];
            _results.push(childSpecs.push(routeObject));
          }
          return _results;
        });
      }
      if (isRef(compDef.options.routeFilterStrategy)) {
        wire(compDef.options.routeFilterStrategy).then(function(strategy) {
          return filterStrategy = strategy;
        });
      } else {

      }
      hasher.initialized.add(parseHash);
      hasher.changed.add(parseHash);
      return resolver.resolve(routeBinding(appRouterController, compDef, wire));
    };
    pluginInstance = {
      ready: function(resolver, proxy, wire) {
        return resolver.resolve();
      },
      destroy: function(resolver, proxy, wire) {
        appRouterController.dispose();
        return resolver.resolve();
      },
      factories: {
        appRouter: initializeRouter
      }
    };
    return pluginInstance;
  };
});
