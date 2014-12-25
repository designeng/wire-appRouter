define [
    "underscore"
    "when"
    "./RouteObserver"
], (_, When, RouteObserver) ->

    # TODO: merge with contextHashController?

    class ContextController

        # routeObserver is watching for @setRouteData invocations, analizing it's return
        # and desides basicly on provided data to reload context, load it from cache, or other.
        routeObserver: null

        _contextHash: {}

        onReady: ->
            @routeObserver = new RouteObserver()
            @routeObserver.watch @register
            @routeObserver.getSignal().add (event, entity) ->
                if event is "shift"
                    console.debug "window.location.hash:::", window.location.hash

        contextState: (hash) ->

        register: (parentContext, childContext, child) ->
            # registration enter point (key): child.route
            @_contextHash[child.route] = {
                parentContext   : parentContext
                childContext    : childContext
            }

            return {
                child
            }

        getRegistredContext: (route, type) ->
            if type is "parent"
                fragments = route.split("/")
                if fragments.length > 1
                    return @_contextHash[_.initial(fragments).join("/")]
                else
                    return @_contextHash[route]
            else
                return @_contextHash[route]

        # TODO: remove if not used 
        # context duck-typing
        ensureContext: (context) ->
            if context.destroy and context.resolve and context.wire
                return true
            else
                return false

        getContextHash: ->
            return @_contextHash

