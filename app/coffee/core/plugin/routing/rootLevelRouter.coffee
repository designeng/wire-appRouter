# rootLevelRouter plugin

define [
    "underscore"
    "crossroads"
    "hasher"
    'when'
    'wire/lib/object'
    'wire/lib/context'
    'when/sequence'
], (_, crossroads, hasher, When, object, createContext, sequence) ->

    return (options) ->

        currentContext = null
        currentProspectSpec = undefined
        tempRouter = undefined

        filterStrategy = undefined
        childRoutes = undefined

        errorHandler = (error) ->
            console.error error.stack

        parseHash = (newHash, oldHash) ->
            tempRouter.parse newHash

        createRouter = (compDef, wire) ->
            When.promise (resolve) ->
                tempRouter = crossroads.create()
                resolve tempRouter

        isRef = (it) ->
            return it and object.hasOwn(it, '$ref')


        routeBinding = (tempRouter, compDef, wire) ->
            for route, routeObject of compDef.options.routes

                spec        = routeObject.spec
                mergeWith   = routeObject.mergeWith
                slot        = routeObject.slot
                rules       = routeObject.rules
                behavior    = routeObject.behavior

                routeFn = ((spec, mergeWith, slot, route, behavior, wire) ->
                    if spec != currentProspectSpec

                        specPromise = wire.loadModule(spec)
                        mergeWithPromise = wire.loadModule(mergeWith)

                        When.all([specPromise, mergeWithPromise]).then (modulesResult) ->

                            modulesResult[0].slot = slot

                            rootContext = createContext(modulesResult)

                            rootContext.then (prospectCTX) ->
                                console.log "----------prospectCTX::::", prospectCTX


                            # for specObject in modulesResult


                        # wire.loadModule(spec).then (prospectObj) ->

                        #     currentContext?.destroy()
                        #     prospectObj.slot = slot


                        #     console.log "prospectObj::::", prospectObj

                            # if mergeWith
                            #     wire.loadModule(mergeWith).then (mergeWithObj) ->

                            #         console.log "mergeWithObj:::", mergeWithObj

                            #         # wire([mergeWithObj, prospectObj]).then (prospectCTX) ->

                            #         #     console.log "prospectCTX::::", prospectCTX

                            #         #     # do smth with prospectCTX
                            #         #     if behavior
                            #         #         sequenceBehavior(prospectCTX, route, wire)
                                
                            #         #     # renderingController.isReady state means that prospect template is rendered
                            #         #     When(prospectCTX.renderingController.isReady()).then () ->
                            #         #         # set current
                            #         #         currentContext = prospectCTX
                            #         #         currentProspectSpec = spec

                            #                 # startChildRouteWiring(prospectCTX, route, wire)
                            #         , errorHandler
                            # else
                            #     wire(prospectObj).then (prospectCTX) ->
                            #         # do smth with prospectCTX
                            #         if behavior
                            #             sequenceBehavior(prospectCTX, route, wire)
                                
                            #         # renderingController.isReady state means that prospect template is rendered
                            #         # When(prospectCTX.renderingController.isReady()).then () ->
                            #         #     # set current
                            #         #     currentContext = prospectCTX
                            #         #     currentProspectSpec = spec

                            #             # startChildRouteWiring(prospectCTX, route, wire)

                            #     , errorHandler

                    else
                        # spec module is loaded, child route wiring must be started
                        startChildRouteWiring(currentContext, route, wire)

                ).bind null, spec, mergeWith, slot, route, behavior, wire

                oneRoute = tempRouter.addRoute(route)
                oneRoute.rules = rules 
                oneRoute.matched.add routeFn

                # hasher.prependHash = "" must be somewhere in main context
                hasher.initialized.add(parseHash)
                hasher.changed.add(parseHash)
                # hasher init() call must be somewhere in main context

        initializeRouter = (resolver, compDef, wire) ->
            if isRef(compDef.options.childRoutes)
                wire(compDef.options.childRoutes).then (routes) ->
                    childRoutes = routes

            if isRef(compDef.options.routeFilterStrategy)
                wire(compDef.options.routeFilterStrategy).then (strategy) ->
                    filterStrategy = strategy
            else
                # TODO: think how to resolve

            createRouter(compDef, wire).then (tempRouter) ->
                routeBinding tempRouter, compDef, wire
                resolver.resolve(tempRouter)
            , (error) ->
                console.error error.stack

        pluginInstance = 
            ready: (resolver, proxy, wire) ->
                resolver.resolve()
            destroy: (resolver, proxy, wire) ->
                tempRouter.dispose()
                resolver.resolve()

            factories: 
                rootLevelRouter: initializeRouter

        return pluginInstance