define [
    "underscore"
    "when"
    "./route"
], (_, When, Route) ->

    class Controller

        # listed all allowed fields for every context type
        groupsAllowedFields:
            "ground"   : ["spec", "mergeWith", "slot", "rules", "behavior"]
            "child"    : ["spec", "slot", "behavior", "relative", "noCache", "replaceable"]


        registerGroundRoutes: () ->
            _.forEach @groundRoutes, (routeValue, routeKey) =>
                routeObject = _.extend {}, routeValue, {route: routeKey}

                routeHandler = do (routeObject = routeObject) =>
                    return () =>
                        @routeHandlerFactory.createHandler(routeObject)

                # register route
                new Route(routeKey, routeValue.rules, routeHandler)

        # TODO: remove if not used
        checkForAllowedFields: (object, routeGroupName) ->
            try
                throw new Error "The group '#{routeGroupName}' is not defined in groupsAllowedFields" unless @groupsAllowedFields.hasOwnProperty(routeGroupName)
                _.each object, (value, key) =>
                    throw new Error "Not allowed field: '#{key}'" unless key in @groupsAllowedFields[routeGroupName]
            catch e
                return false
            return true