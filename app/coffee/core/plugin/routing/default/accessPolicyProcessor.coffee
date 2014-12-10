define [
    "underscore"
    "when"
    "core/util/navigation/navigate"
], (_, When, navigate) ->

    class AccessPolicyProcessor

        factories: [
            "wire"
            "create"
            "module"
        ]

        constructor: ->
            _.bindAll @, "normalizeAccessPolicy"

        normalizeAccessPolicy: (accessPolicy) ->
            for factory in @factories
                if accessPolicy[factory]?
                    return accessPolicy[factory]
            
            throw new Error "Access policy strange way definition - use instead one of the next factories: 'wire', 'create', 'module'"

        # TODO: define childRouteObject
        # pipeline tasks?, ["wireAccessPolicyContext", "checkAccess", "getRedirect", "navigateTo"]
        askForAccess: (child) ->
            deferred = When.defer()
            if child.accessPolicy?
                @pluginWireFn(@normalizeAccessPolicy(accessPolicy)).then (checkingContext) =>
                    if !checkingContext.accessPolicy.checkAccess()
                        deferred.reject("NO ACCESS")
                        # access denied, take redirect if defined
                        if checkingContext.accessPolicy.getRedirect?
                            # route hash should be replaced with the next route hash, without writing in browser history
                            if childRouteObject.replaceable
                                navigate(checkingContext.accessPolicy.getRedirect(), "replace")
                            else
                                navigate(checkingContext.accessPolicy.getRedirect())
                    else
                        deferred.resolve(child)
            else
                deferred.resolve(child)
            return deferred.promise
