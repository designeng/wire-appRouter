define [
    "./tasksFactory"
    "core/plugin/routing/assets/appRouterController"
], (TasksFactory, appRouterController) ->

    class RouteHandler

        constructor: (route, rules, handler) ->
            _.bindAll @
            @routeHandlerTasks = [
                "before:defineChildObject"
                "getCached"
                "loadNotCached"
            ]

        defineChildObject: (routeObject) ->
            child = @filterStrategy(@childRoutes, routeObject.route, @getCurrentRoute())
            return child

        getCached: ->
                        
                        # registred = @contextController.getRegistredContext(child.route)

                        # if registred?
                        #     @processChildRoute(registred.parentContext, child)
                        # else

        loadNotCached: ->
            When(@environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {slot: routeObject.slot})).then (parentContext) =>
                @processChildRoute(parentContext, child)
            .otherwise (error) ->
                navigateToError("js", error)

        getCurrentRoute: () ->
            return @appRouterController.getCurrentRoute()