define [
    "wire"
    "when"
    "hasher"
], (wire, When, hasher) ->

    setHash = (hash) ->
        window.location.hash = "/" + hash

    oneBehaviorHandler = () ->
        console.debug "oneBehaviorHandler invoked"
    
    secondBehaviorHandler = () ->
    
    anotherSecondBehaviorHandler = () ->

    define "oneSpec", () ->
        return {
            test: "testString form oneSpec"
            oneSpecField: {$ref: 'test'}
            testFn: (str) ->
                console.debug "TEST FUNCTION oneSpec", str
        }

    define "orderInfoComponentSpec", () ->
        return {
            controllerFn: (str) ->
                console.debug "controllerFn orderInfoCompenentSpec", str
        }


    define "secondSpec", () ->
        return {}

    define "thirdSpec", () ->
        return {}

    define "relativeSpec", () ->
        return {
            testFn: (str) ->
                console.debug "TEST FUNCTION relativeSpec", str, @oneSpecField
            relativeFn: (str) ->
                console.debug "relativeFn in relativeSpec", str
        }

    define "childWithAccessPolicy", () ->
        return {
            accessPolicy:
                wire: "accessPolicySpec"
        }

    define "accessPolicySpec", () ->
        return {
            accessPolicy:
                create: "accessPolicySpec"
        }

    define "behaviorPlugin", () ->
        trim = (str) -> 
            str.replace(/^\s+|\s+$/g,'')
        resolveBehavior = (resolver, name, refObj, wire) ->
            funcs = []
            if name.indexOf(",") != -1
                names = name.split ","
                for name in names
                    funcs.push trim(name)
            else
                funcs.push trim(name)
            resolver.resolve funcs
        return pluginInstance = 
            resolvers:
                behavior : resolveBehavior

    groundRoutes = 
        "one":  {}
        "two":  {}
        "validRoute":
            spec: "someSpec"
            mergeWith: "anotherSpec"
            rules: {}
            slot: "1"
        "notValidRoute":
            spec: "someSpec"
            extendWith: {}
        "{plain}":
            spec: "oneSpec"
            rules:
                plain: /\border\b/i
        "{complexpart}/{infopart}/{id}"  :
            spec: "oneSpec"
            mergeWith: ["secondSpec", "thirdSpec"]
            slot: "superSlot"
            rules:
                complexpart: /\border\b/i
                infopart: /\binfo\b/i
                id: /[0-9]+/i

    childRoutes =
        "order"  :
            spec: "components/order"

        "order/info/{cpid}"  :
            spec: "orderInfoComponentSpec"
            slot: "slot"
            # behavior: {$ref: "behavior!oneBehaviorHandler,secondBehaviorHandler"}
            behavior: oneBehaviorHandler
            relative: "relativeSpec"
            contextResetRoutePositions: [2]

        "someRoute":
            spec: "relativeSpec"
            slot: "slot"

    appRouterWireSpec = 
        $plugins:[
            "wire/debug"
            "core/plugin/routing/appRouterWire"
            "behaviorPlugin"
        ]

        controller:
            appRouter:
                groundRoutes                        : groundRoutes
                childRoutes                         : childRoutes
                groundContextResetRoutePositions    : [2]

    describe "appRouterWire plugin, controller.root fields", ->

        beforeEach (done) ->
            wire(appRouterWireSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        # provided
        it "groundRoutes, childRoutes object exist", (done) ->
            expect(@ctx.controller.root.groundRoutes).toBeDefined()
            expect(@ctx.controller.root.groundRoutes).toBeObject()
            expect(@ctx.controller.root.childRoutes).toBeDefined()
            expect(@ctx.controller.root.childRoutes).toBeObject()
            done()

        # own properties
        it "behaviorProcessor", (done) ->
            expect(@ctx.controller.root.behaviorProcessor).toBeDefined()
            done()

        it "accessPolicyProcessor", (done) ->
            expect(@ctx.controller.root.accessPolicyProcessor).toBeDefined()
            done()

        it "hasherInitializator", (done) ->
            expect(@ctx.controller.root.hasherInitializator).toBeDefined()
            done()

        it "filterStrategy", (done) ->
            expect(@ctx.controller.root.filterStrategy).toBeDefined()
            done()

    describe "appRouterWire plugin, controller", ->

        beforeEach (done) ->
            wire(appRouterWireSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        # PASSED
        # it "process groundRoutes (filterStrategy, contextController.setChildRoute) integration", (done) ->
        #     When(@ctx.controller.root.controller.registerGroundRoutes()).then () =>
        #         spyOn(@ctx.controller.root.contextController, "getContextResetRoutePositions")
        #         setHash "order/info/123"

        #         _.defer () =>
        #             expect(@ctx.controller.root.contextController.getChildRoute()).toBe "order/info/{cpid}"
        #             # getContextResetRoutePositions expect to be called after setChildRoute
        #             expect(@ctx.controller.root.contextController.getContextResetRoutePositions).toHaveBeenCalledWith "order/info/{cpid}"
        #             done()

        it "process groundRoutes (filterStrategy, contextController.setChildRoute) integration", (done) ->
            When(@ctx.controller.root.controller.registerGroundRoutes()).then () =>
                setHash "order/info/123"
                _.defer () =>
                    expect(@ctx.controller.root.contextController.getChildRoute()).toBe "order/info/{cpid}"
                    setTimeout () =>
                        childContext = @ctx.controller.root.contextController.getRegistredContext("orderInfoComponentSpec") 
                        expect(childContext.behavior).not.toBeArray()
                        # expect(childContext.behavior[0]).toBeFunction()
                        # console.debug "HASH:::", @ctx.controller.root.contextController.getContextHash()
                        console.debug "PLUGINS", childContext.$plugins
                        done()
                    , 100
                    

        # checkForAllowedFields
        it "groundRoutes checkForAllowedFields allowed", (done) ->
            route = groundRoutes["validRoute"]
            expect(@ctx.controller.root.controller.checkForAllowedFields(route, "ground")).toBe true
            done()

        it "groundRoutes checkForAllowedFields not allowed", (done) ->
            route = groundRoutes["notValidRoute"]
            expect(@ctx.controller.root.controller.checkForAllowedFields(route, "ground")).toBe false
            done()

    describe "appRouterWire plugin, environment", ->

        beforeEach (done) ->
            wire(appRouterWireSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        it "getMergedModulesArrayOfPromises", (done) ->
            array = @ctx.controller.root.environment.getMergedModulesArrayOfPromises("oneSpec", ["secondSpec", "thirdSpec"])
            expect(array).toBeArray()
            for item in array
                expect(item).toBePromise()
            done()

        it "applyEnvironment", (done) ->
            object = @ctx.controller.root.environment.applyEnvironment({}, {slot: "123"})
            expect(object["slot"]).toBe "123"
            done()

        it "getMergedModulesPromise result should has named field", (done) ->
            When(@ctx.controller.root.environment.loadInEnvironment("oneSpec", ["secondSpec", "thirdSpec"], {superSlot: "123"})).then (resultContext) ->
                expect(resultContext).toHaveField("superSlot")
                done()

    describe "appRouterWire plugin, environment", ->

        beforeEach (done) ->
            wire(appRouterWireSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        # PASSED
        # it "getContextResetRoutePositions", (done) ->
        #     expect(@ctx.controller.root.contextController.getContextResetRoutePositions("order/info/{cpid}/payment/{paymentId}")).toEqual [2,4]
        #     done()

        # TODO: bind routes first in before each!
        # it "setRouteModel", (done) ->
        #     setHash "validRoute"
        #     @ctx.controller.root.contextController.setRouteModel()
        #     done()