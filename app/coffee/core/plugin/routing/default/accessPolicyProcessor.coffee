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
                    return accessPolicy
            
            throw new Error "Access policy strange way definition - use instead one of the next factories: 'wire', 'create', 'module'"

        # TODO: simplify?
        # pipeline tasks?, ["wireAccessPolicyContext", "checkAccess", "getRedirect", "navigateTo"]
        askForAccess: (child) ->
            deferred = When.defer()
            @pluginWireFn.loadModule(child.spec).then (childContext) =>
                if childContext.accessPolicy?
                    @pluginWireFn(@normalizeAccessPolicy(childContext.accessPolicy)).then (result) =>
                        if !result.checkAccess()
                            deferred.reject("NO ACCESS")
                            # access denied, take redirect if defined
                            if result.getRedirect?
                                # route hash should be replaced with the next route hash, without writing in browser history
                                if child.replaceable
                                    navigate(result.getRedirect(), "replace")
                                else
                                    navigate(result.getRedirect())
                        else
                            deferred.resolve(child)
                else
                    deferred.resolve(child)
            return deferred.promise
