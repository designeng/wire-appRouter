# rootLevelRouter plugin

define [
    "underscore"
    "crossroads"
    "hasher"
    'when'
    'wire/lib/object'
    'wire/lib/context'
    "core/util/navigation/getCurrentRoute"
    'when/sequence'
], (_, crossroads, hasher, When, object, createContext, getCurrentRoute, sequence) ->

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

        startChildRouteWiring = (prospectCTX, route, wire) ->
            # filterStrategy must response with only one child spec we are going to load as childSpec
            # getCurrentRoute() call returns something like beginning from slash ("/.../.../..."), so must be sliced
            childRouteObject = filterStrategy(childRoutes, route, getCurrentRoute().slice(1))

            properties = 
                spec        : childRouteObject.spec                                
                slot        : childRouteObject.slot
                behavior    : childRouteObject.behavior
                subSpecs    : childRouteObject.subSpecs
                route       : childRouteObject.route
                options     : childRouteObject.options
                                
            wireChildRoute(prospectCTX, properties, wire)

        # params: childRouteObject properties
        wireChildRoute = (prospectCTX, properties, wire) ->

            wire.loadModule(properties.spec).then (childSpecObj) ->

                # childRouteObject properties
                # slot
                childSpecObj.slot = properties.slot
                # behavior
                if properties.behavior
                    injectBechavior(childSpecObj, properties.behavior)
                if properties.options
                    childSpecObj.options = properties.options

                prospectCTX.wire(childSpecObj).then (childCTX) ->

                    if properties.behavior
                        sequenceBehavior(childCTX, properties.route, wire)

                    # ---- TODO: remove? -----
                    # subSpecs as {Array}
                    if properties.subSpecs
                        for subSpec in properties.subSpecs
                            # recursive call
                            subSpec.route = properties.route
                            wireChildRoute(prospectCTX, subSpec, wire)

        injectBechavior = (childSpecObj, behavior) ->
            childSpecObj.$plugins = [] unless childSpecObj.$plugins
            childSpecObj.$plugins.push "core/plugin/behavior"
            childSpecObj.behavior = behavior

        sequenceBehavior = (childCTX, route, wire) ->
            When(wire.getProxy(childCTX.behavior)
                        , (behaviorObj) ->
                            tasks = behaviorObj.target
                            # @param {Array} tasks - array of tasks
                            # @param {Object} childCTX - current resulted child context
                            # @param {String} route - current child context route
                            sequence(tasks, childCTX, route)
                        , () ->
                            # nothing to do, no behavior defined
                    )

        routeBinding = (tempRouter, compDef, wire) ->

            for route, routeObject of compDef.options.routes

                spec        = routeObject.spec
                mergeWith   = routeObject.mergeWith
                slot        = routeObject.slot
                rules       = routeObject.rules
                behavior    = routeObject.behavior

                routeFn = ((spec, mergeWith, slot, route, behavior, wire) ->
                    if spec != currentProspectSpec

                        promisedModules = []
                        specPromise = wire.loadModule(spec)
                        promisedModules.push specPromise

                        # mergeWith may be {String | Array}
                        if _.isString mergeWith
                            promisedModules.push wire.loadModule(mergeWith)
                        else if _.isArray mergeWith
                            for mergingModule in mergeWith
                                promisedModules.push wire.loadModule(mergingModule)

                        When.all(promisedModules).then (modulesResult) ->

                            modulesResult[0].slot = slot

                            rootContext = createContext(modulesResult)

                            rootContext.then (prospectCTX) ->
                                console.log ">>>>>>>>>>>>>>>prospectCTX>>>>>>>>>>", prospectCTX
                                startChildRouteWiring(prospectCTX, route, wire)

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
                resolver.resolve(routeBinding(tempRouter, compDef, wire))

                # resolver.resolve(tempRouter)
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