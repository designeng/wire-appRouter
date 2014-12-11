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
      behavior: oneBehaviorHandler,
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
        childRoutes: childRoutes,
        groundContextResetRoutePositions: [2]
      }
    }
  };
  describe("appRouterWire plugin, controller.root fields", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(appRouterWireSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    it("groundRoutes, childRoutes object exist", function(done) {
      expect(this.ctx.controller.root.groundRoutes).toBeDefined();
      expect(this.ctx.controller.root.groundRoutes).toBeObject();
      expect(this.ctx.controller.root.childRoutes).toBeDefined();
      expect(this.ctx.controller.root.childRoutes).toBeObject();
      return done();
    });
    it("behaviorProcessor", function(done) {
      expect(this.ctx.controller.root.behaviorProcessor).toBeDefined();
      return done();
    });
    it("accessPolicyProcessor", function(done) {
      expect(this.ctx.controller.root.accessPolicyProcessor).toBeDefined();
      return done();
    });
    it("hasherInitializator", function(done) {
      expect(this.ctx.controller.root.hasherInitializator).toBeDefined();
      return done();
    });
    return it("filterStrategy", function(done) {
      expect(this.ctx.controller.root.filterStrategy).toBeDefined();
      return done();
    });
  });
  describe("appRouterWire plugin, controller", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(appRouterWireSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    it("process groundRoutes (filterStrategy, contextController.setChildRoute) integration", function(done) {
      var _this = this;
      return When(this.ctx.controller.root.controller.registerGroundRoutes()).then(function() {
        return setHash("order/info/123");
      }).delay(100).then(function() {
        return expect(_this.ctx.controller.root.contextController.getChildRoute()).toBe("order/info/{cpid}");
      }).delay(100).then(function() {
        var childContext;
        childContext = _this.ctx.controller.root.contextController.getRegistredContext("orderInfoComponentSpec");
        expect(childContext.behavior).not.toBeArray();
        console.debug("PLUGINS", childContext.$plugins);
        return done();
      });
    });
    it("groundRoutes checkForAllowedFields allowed", function(done) {
      var route;
      route = groundRoutes["validRoute"];
      expect(this.ctx.controller.root.controller.checkForAllowedFields(route, "ground")).toBe(true);
      return done();
    });
    return it("groundRoutes checkForAllowedFields not allowed", function(done) {
      var route;
      route = groundRoutes["notValidRoute"];
      expect(this.ctx.controller.root.controller.checkForAllowedFields(route, "ground")).toBe(false);
      return done();
    });
  });
  describe("appRouterWire plugin, environment", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(appRouterWireSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    it("getMergedModulesArrayOfPromises", function(done) {
      var array, item, _i, _len;
      array = this.ctx.controller.root.environment.getMergedModulesArrayOfPromises("oneSpec", ["secondSpec", "thirdSpec"]);
      expect(array).toBeArray();
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        expect(item).toBePromise();
      }
      return done();
    });
    it("applyEnvironment", function(done) {
      var object;
      object = this.ctx.controller.root.environment.applyEnvironment({}, {
        slot: "123"
      });
      expect(object["slot"]).toBe("123");
      return done();
    });
    return it("getMergedModulesPromise result should has named field", function(done) {
      return When(this.ctx.controller.root.environment.loadInEnvironment("oneSpec", ["secondSpec", "thirdSpec"], {
        superSlot: "123"
      })).then(function(resultContext) {
        expect(resultContext).toHaveField("superSlot");
        return done();
      });
    });
  });
  return describe("appRouterWire plugin, environment", function() {
    return beforeEach(function(done) {
      var _this = this;
      return wire(appRouterWireSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
  });
});
