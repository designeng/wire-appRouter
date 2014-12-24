define [
    "underscore"
    "when"
    "when/pipeline"
    "core/util/navigation/navigateToError"
    "./tasksFactory"
    "./route"
], (_, When, pipeline, navigateToError, TasksFactory, Route) ->

    class Controller

        # listed all allowed fields for every context type
        groupsAllowedFields:
            "ground"   : ["spec", "mergeWith", "slot", "rules", "behavior"]
            "child"    : ["spec", "slot", "behavior", "relative", "noCache", "replaceable"]

        constructor: ->
            _.bindAll @
            @routeHandlerTasks = [
                "sequenceBehavior"
                "synchronize"
            ]

        getCurrentRoute: () ->
            return @appRouterController.getCurrentRoute()

        registerGroundRoutes: () ->
            _.forEach @groundRoutes, (routeValue, routeKey) =>
                routeObject = _.extend {}, routeValue, {route: routeKey}

                routeHandler = do (routeObject = routeObject) =>
                    return () =>
                        child = @filterStrategy(@childRoutes, routeObject.route, @getCurrentRoute())
                        
                        # registred = @contextController.getRegistredContext(child.route)

                        # if registred?
                        #     @processChildRoute(registred.parentContext, child)
                        # else

                        When(@environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {slot: routeObject.slot})).then (parentContext) =>
                            @processChildRoute(parentContext, child)
                        .otherwise (error) ->
                            navigateToError("js", error)

                # register route
                new Route(routeKey, routeValue.rules, routeHandler)

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

        # TODO: remove if not used
        checkForAllowedFields: (object, routeGroupName) ->
            try
                throw new Error "The group '#{routeGroupName}' is not defined in groupsAllowedFields" unless @groupsAllowedFields.hasOwnProperty(routeGroupName)
                _.each object, (value, key) =>
                    throw new Error "Not allowed field: '#{key}'" unless key in @groupsAllowedFields[routeGroupName]
            catch e
                return false
            return true