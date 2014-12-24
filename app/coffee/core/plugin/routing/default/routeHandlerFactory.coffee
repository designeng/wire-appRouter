define [
    "when"
    "core/util/navigation/navigateToError"
    "./tasksFactory"
], (When, navigateToError, TasksFactory) ->

    class RouteHandlerFactory

        constructor: ->
            _.bindAll @
            tasks = [
                "before:defineChildObject"
                "filter:getCached"
                "loadNotCached"
            ]
            @tasksFactory = new TasksFactory(@, tasks)

        # public method
        createHandler: (routeObject) ->
            @tasksFactory.runTasks(routeObject)

        # tasks
        defineChildObject: (routeObject) ->
            @child = @filterStrategy(@childRoutes, routeObject.route, @getCurrentRoute())

        getCached: (routeObject) ->
            deferred = When.defer()
            registred = @contextController.getRegistredContext(@child.route)

            if registred?
                console.debug "registred:::", registred.parentContext
                @processChildRoute(registred.parentContext, @child)
                deferred.reject("Cached")
            else
                deferred.resolve(routeObject)
            return deferred.promise

        loadNotCached: (routeObject) ->
            When(@environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {slot: routeObject.slot})).then (parentContext) =>
                @processChildRoute(parentContext, @child)
            .otherwise (error) ->
                navigateToError("js", error)

        # "Route" - not "routes" - in method name, because only one child
        # should be choosed from @childRoutes by filterStrategy in routeHandler
        # @param {WireContext} context
        # @param {WireContext} child - object form childRoutes, choosed by filterStrategy
        processChildRoute: (context, child) ->
            bundle = []
            bundle.push child

            if child.relative       # TODO: and no cached relative
                relative = _.where(@childRoutes, {spec: child.relative})[0]
                bundle.push relative

            @childContextProcessor.deliver(context, bundle)

        # util methods
        getCurrentRoute: () ->
            return @appRouterController.getCurrentRoute()