define [
    "underscore"
], (_) ->

    class ContextHashController

        # the next field must be changed if we change route order
        # TODO: order/info -> order ?
        cpidRouteIndex      : 2

        contextHash         : {}

        resetHash: ->
            _.each @contextHash, (cpidCasheObject) ->
                _.each cpidCasheObject, (context) ->
                    console.debug "remove::::", context
                    context.destroy()
            @contextHash = {}

        getHash: ->
            return @contextHash

        getCpid: (route) ->
            return route.params[@cpidRouteIndex]

        # param {Object} route
        # param {String} spec
        # param {Object} context
        cacheContext: (route, spec, context) ->
            cpid        = @getCpid route

            try
                if cpid
                    @contextHash[cpid][spec] = context

            catch e
                if cpid
                    @contextHash[cpid] = {} unless @contextHash[cpid]
                    @contextHash[cpid][spec] = context unless @contextHash[cpid][spec]
            
        getCachedContext: (route, spec) ->
            cpid        = @getCpid route

            try
                if cpid
                    return @contextHash[cpid][spec]
            catch e
                return false

        removeCachedContext: (route, spec) ->
            cpid        = @getCpid route
            if cpid
                # @contextHash[cpid][spec].destroy()
                delete @contextHash[cpid][spec]

        # context duck-typing
        ensureContext: (context) ->
            if context.destroy and context.resolve and context.wire
                return true
            else
                return false

    return contextHashController = new ContextHashController() unless contextHashController?