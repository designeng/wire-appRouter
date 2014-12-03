define [
    "underscore"
    "hasher"
    'when'
    'wire/lib/object'
    "core/util/navigation/navigate"
    "core/util/navigation/getCurrentCpid"
    "core/util/navigation/navigateToError"
    "core/plugin/routing/assets/appRouterController"
    "core/plugin/routing/assets/contextHashController"
    "when/sequence"
    "specs/reporter/spec"
], (_, hasher, When, object, navigate, getCurrentCpid, navigateToError, appRouterController, contextHashController, sequence, reporterSpec) ->

    return (options) ->

        _currentRoute = undefined

        filterStrategy = undefined
        childRoutes = undefined
        childSpecs = []

        noop = () ->

        errorHandler = (error) ->
            console.error error.stack

        parseHash = (newHash, oldHash) ->
            appRouterController.parse newHash

        getCurrentHash = () ->
            return getCurrentRoute().params.join "/"

        getCurrentRoute = () ->
            return appRouterController.getCurrentRoute()

        isRef = (it) ->
            return it and object.hasOwn(it, '$ref')

        normalizeAccessPolicy = (accessPolicy) ->
            factories = ["wire", "create", "module"]
            for factory in factories
                if accessPolicy[factory]?
                    return accessPolicy[factory]
            
            throw new Error "Access policy strange way definition - use instead one of the next factories: 'wire', 'create', 'module'"

        synchronizeWithRoute = (context) ->
            if context.synchronizeWithRoute?
                    context.synchronizeWithRoute.call context

        startChildRouteWiring = (prospectCTX, route, wire) ->

            # filterStrategy must response with only one child spec we are going to load as childSpec
            childRouteObject = filterStrategy(childRoutes, route, getCurrentHash())

            wireChildRouteSpec(prospectCTX, childRouteObject, wire)

            # wire relative spec only if it was not wired
            relative = childRouteObject.relative

            if relative and !contextHashController.getCachedContext(getCurrentRoute(), relative)

                relativeObject = _.where(childSpecs, {spec: relative})[0]
                childRouteObject = 
                    spec        : relative
                    slot        : relativeObject.slot
                    options     : relativeObject.options
                    noCache     : relativeObject.noCache
                    replaceable : relativeObject.replaceable
                    # no behavior!
                    # no route!

                wireChildRouteSpec(prospectCTX, childRouteObject, wire)

        wireChildRouteSpec = (prospectCTX, childRouteObject, wire) ->
            # {Object}
            _currentRoute = getCurrentRoute()
            _context = contextHashController.getCachedContext(_currentRoute, childRouteObject.spec)

            unless _context
                wire.loadModule(childRouteObject.spec)
                    .then (childSpecObj) ->
                        # slot
                        childSpecObj.slot = childRouteObject.slot
                        # behavior
                        if childRouteObject.behavior
                            childSpecObj = injectBechavior(childSpecObj, childRouteObject.behavior)
                        if childRouteObject.options
                            childSpecObj.options = childRouteObject.options

                        # check if access to this component is possible
                        if childSpecObj.accessPolicy?
                            prospectCTX.wire(normalizeAccessPolicy(childSpecObj.accessPolicy)).then (checkingCTX) ->
                                if !checkingCTX.accessPolicy.checkAccess()
                                    # access denied, take redirect if defined
                                    if checkingCTX.accessPolicy.getRedirect?
                                        # route hash should be replaced with the next route hash
                                        if childRouteObject.replaceable
                                            navigate(checkingCTX.accessPolicy.getRedirect(), "replace")
                                        else
                                            navigate(checkingCTX.accessPolicy.getRedirect())
                                else
                                    prospectContextWireChildObj(prospectCTX, childSpecObj, childRouteObject, wire)
                        else
                            prospectContextWireChildObj(prospectCTX, childSpecObj, childRouteObject, wire)

                    .otherwise (err) ->
                        navigateToError('js', err)

            else

                if childRouteObject.behavior

                    if _context.behavior
                        sequenceBehavior(_context, childRouteObject.route, wire)
                    else
                        # reset context
                        contextHashController.removeCachedContext(_currentRoute, childRouteObject.spec)
                        # wire it again
                        wireChildRouteSpec(prospectCTX, childRouteObject, wire)

                # synchronization with matched route
                synchronizeWithRoute _context

        prospectContextWireChildObj = (prospectCTX, childSpecObj, childRouteObject, wire) ->
            prospectCTX.wire(childSpecObj).then (childCTX) ->

                contextHashController.cacheContext(_currentRoute, childRouteObject.spec, childCTX) unless childRouteObject.noCache

                if childRouteObject.behavior
                    sequenceBehavior(childCTX, childRouteObject.route, wire)

                # synchronization with matched route
                synchronizeWithRoute childCTX

                # reporter wired
                childCTX.wire(reporterSpec).then (reporterContext) ->
                    # do smth

        injectBechavior = (childSpecObj, behavior) ->
            childSpecObj.$plugins = [] unless childSpecObj.$plugins
            childSpecObj.$plugins.push "core/plugin/behavior"
            childSpecObj.behavior = behavior
            return childSpecObj

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

        routeBinding = (appRouterController, compDef, wire) ->

            _currentContext = null
            _currentProspectSpec = undefined
            _cpid = undefined

            for route, routeObject of compDef.options.routes

                spec        = routeObject.spec
                mergeWith   = routeObject.mergeWith
                slot        = routeObject.slot
                rules       = routeObject.rules
                behavior    = routeObject.behavior

                routeFn = ((spec, mergeWith, slot, route, behavior, wire) ->
                    cpid = getCurrentCpid()

                    if spec != _currentProspectSpec or _cpid != cpid

                        _currentContext?.destroy()

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

                            rootContext = wire.createChild(modulesResult)

                            rootContext.then (prospectCTX) ->

                                # When(prospectCTX.renderingController.isReady()).then () ->
                                When(prospectCTX).then () ->
                                                
                                    # set current
                                    _currentContext = prospectCTX
                                    _currentProspectSpec = spec
                                    _cpid = cpid

                                    contextHashController.resetHash()

                                    startChildRouteWiring(prospectCTX, route, wire)

                    else
                        # spec module is loaded, child route wiring must be started
                        startChildRouteWiring(_currentContext, route, wire)

                ).bind null, spec, mergeWith, slot, route, behavior, wire

                oneRoute = appRouterController.addRoute(route)
                oneRoute.rules = rules
                oneRoute.matched.add routeFn

        initializeRouter = (resolver, compDef, wire) ->
            if isRef(compDef.options.childRoutes)
                wire(compDef.options.childRoutes).then (routes) ->
                    childRoutes = routes

                    for route, routeObject of routes
                        childSpecs.push routeObject

            if isRef(compDef.options.routeFilterStrategy)
                wire(compDef.options.routeFilterStrategy).then (strategy) ->
                    filterStrategy = strategy
            else
                # TODO: think how to resolve

            # hasher.prependHash = "" must be somewhere in main context
            hasher.initialized.add(parseHash)
            hasher.changed.add(parseHash)
            # hasher init() call must be somewhere in main context

            resolver.resolve(routeBinding(appRouterController, compDef, wire))

        pluginInstance = 
            ready: (resolver, proxy, wire) ->
                resolver.resolve()
            destroy: (resolver, proxy, wire) ->
                appRouterController.dispose()
                resolver.resolve()

            factories: 
                appRouter: initializeRouter

        return pluginInstance