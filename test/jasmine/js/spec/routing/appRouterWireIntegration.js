define(["wire", "when", "hasher"], function(wire, When, hasher) {
  var anotherSecondBehaviorHandler, appRouterWireSpec, childRoutes, groundRoutes, oneBehaviorHandler, secondBehaviorHandler, setHash;
  setHash = function(hash) {
    return window.location.hash = "/" + hash;
  };
  oneBehaviorHandler = function() {
    return console.debug("oneBehaviorHandler invoked");
  };
  secondBehaviorHandler = function() {};
  anotherSecondBehaviorHandler = function() {};
  define("oneSpec", function() {
    return {
      test: "testString form oneSpec",
      oneSpecField: {
        $ref: 'test'
      },
      testFn: function(str) {
        return console.debug("TEST FUNCTION oneSpec", str);
      }
    };
  });
  define("orderInfoComponentSpec", function() {
    return {
      controllerFn: function(str) {
        return console.debug("controllerFn orderInfoCompenentSpec", str);
      }
    };
  });
  define("secondSpec", function() {
    return {};
  });
  define("thirdSpec", function() {
    return {};
  });
  define("relativeSpec", function() {
    return {
      testFn: function(str) {
        return console.debug("TEST FUNCTION relativeSpec", str, this.oneSpecField);
      },
      relativeFn: function(str) {
        return console.debug("relativeFn in relativeSpec", str);
      }
    };
  });
  define("childWithAccessPolicy", function() {
    return {
      accessPolicy: {
        wire: "accessPolicySpec"
      }
    };
  });
  define("accessPolicySpec", function() {
    return {
      accessPolicy: {
        create: "accessPolicySpec"
      }
    };
  });
  define("behaviorPlugin", function() {
    var pluginInstance, resolveBehavior, trim;
    trim = function(str) {
      return str.replace(/^\s+|\s+$/g, '');
    };
    resolveBehavior = function(resolver, name, refObj, wire) {
      var funcs, names, _i, _len;
      funcs = [];
      if (name.indexOf(",") !== -1) {
        names = name.split(",");
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          funcs.push(trim(name));
        }
      } else {
        funcs.push(trim(name));
      }
      return resolver.resolve(funcs);
    };
    return pluginInstance = {
      resolvers: {
        behavior: resolveBehavior
      }
    };
  });
  groundRoutes = {
    "one": {},
    "two": {},
    "validRoute": {
      spec: "someSpec",
      mergeWith: "anotherSpec",
      rules: {},
      slot: "1"
    },
    "notValidRoute": {
      spec: "someSpec",
      extendWith: {}
    },
    "{plain}": {
      spec: "oneSpec",
      rules: {
        plain: /\border\b/i
      }
    },
    "{complexpart}/{infopart}/{id}": {
      spec: "oneSpec",
      mergeWith: ["secondSpec", "thirdSpec"],
      slot: "superSlot",
      rules: {
        complexpart: /\border\b/i,
        infopart: /\binfo\b/i,
        id: /[0-9]+/i
      }
    }
  };
  childRoutes = {
    "order": {
      spec: "components/order"
    },
    "order/info/{cpid}": {
      spec: "orderInfoComponentSpec",
      slot: "slot",
      behavior: [oneBehaviorHandler, secondBehaviorHandler],
      relative: "relativeSpec",
      contextResetRoutePositions: [2]
    },
    "someRoute": {
      spec: "relativeSpec",
      slot: "slot"
    }
  };
  appRouterWireSpec = {
    $plugins: ["wire/debug", "core/plugin/routing/appRouterWire", "behaviorPlugin"],
    controller: {
      appRouter: {
        groundRoutes: groundRoutes,
        childRoutes: childRoutes
      }
    }
  };
  return describe("appRouterWire plugin, controller", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(appRouterWireSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    return it("process groundRoutes (filterStrategy, contextController.setChildRoute) integration", function(done) {
      var _this = this;
      return When().then(function() {
        return setHash("order/info/123");
      }).delay(100).then(function() {
        var childContext;
        childContext = _this.ctx.controller.root.contextController.getRegistredContext("order/info/{cpid}").childContext;
        expect(childContext.behavior).toBeArray();
        expect(childContext.behavior[0]).toBeFunction();
        return done();
      });
    });
  });
});
