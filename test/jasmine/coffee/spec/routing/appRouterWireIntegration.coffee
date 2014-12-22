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
            behavior: [oneBehaviorHandler, secondBehaviorHandler]
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
            .delay(100).then () =>
                expect(@ctx.controller.root.contextController.getChildRoute()).toBe "order/info/{cpid}"
                childContext = @ctx.controller.root.contextController.getRegistredContext("orderInfoComponentSpec")
                console.debug "childContext:::", childContext
                expect(childContext.behavior).toBeArray()
                expect(childContext.behavior[0]).toBeFunction()
                done()