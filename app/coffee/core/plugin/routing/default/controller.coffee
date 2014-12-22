define [
    "underscore"
    "when"
    "core/util/navigation/navigateToError"
    "./route"
], (_, When, navigateToError, Route) ->

    class Controller

        # listed all allowed fields for every context type
        groupsAllowedFields:
            "ground"   : ["spec", "mergeWith", "slot", "rules", "behavior"]
            "child"    : ["spec", "slot", "behavior", "relative", "noCache", "replaceable"]

        constructor: ->
            _.bindAll @

        getCurrentRoute: () ->
            return @appRouterController.getCurrentRoute()

        registerGroundRoutes: () ->
            deferred = When.defer()
            i = 0
            size = _.size @groundRoutes
            _.forEach @groundRoutes, (routeValue, routeKey) =>
                i++

                routeObject = _.extend {}, routeValue, {route: routeKey}

                routeHandler = do (routeObject = routeObject) =>
                    return () =>
                        When(@environment.loadInEnvironment(routeObject.spec, routeObject.mergeWith, {slot: routeObject.slot})).then (context) =>
                            child = @filterStrategy(@childRoutes, routeObject.route, @getCurrentRoute())
                            @processChildRoute(context, child, routeObject.route)
                        .otherwise (error) ->
                            navigateToError("js", error)

                # register route
                new Route(routeKey, routeValue.rules, routeHandler)
                if i == size
                    deferred.resolve()
            return deferred.promise

        # "Route" - not "routes" - in method name, because only one child
        # should be choosed from @childRoutes by filterStrategy in routeHandler
        # @param {WireContext} context
        # @param {WireContext} child - object form childRoutes, choosed by filterStrategy
        processChildRoute: (context, child, routeKey) ->
            bundle = []
            bundle.push child

            if child.relative       # TODO: and no cached relative
                relative = _.where(@childRoutes, {spec: child.relative})[0]
                bundle.push relative

            @childContextProcessor.deliver(context, bundle)

        checkForAllowedFields: (object, routeGroupName) ->
            try
                throw new Error "The group '#{routeGroupName}' is not defined in groupsAllowedFields" unless @groupsAllowedFields.hasOwnProperty(routeGroupName)
                _.each object, (value, key) =>
                    throw new Error "Not allowed field: '#{key}'" unless key in @groupsAllowedFields[routeGroupName]
            catch e
                # console.error e
                return false
            return true