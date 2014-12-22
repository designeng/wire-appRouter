define [
    "underscore"
    "when"
    "./RouteObserver"
], (_, When, RouteObserver) ->

    # TODO: merge with contextHashController?

    class ContextController

        _currentRoute: undefined

        # {String} - e.g.: "order/info/{cpid}"
        _currentChildRoute: undefined

        # routeObserver is watching for @setRouteData invocations, analizing it's return
        # and desides basicly on provided data to reload context, load it from cache, or other.
        routeObserver: null

        _contextHash: {}

        onReady: ->
            @routeObserver = new RouteObserver()
            @routeObserver.watch @setRouteData
            @routeObserver.getSignal().add (event, entity) ->
                if event is "shift"
                    console.debug "window.location.hash:::", window.location.hash

        setRouteData: (child, groundRouteKey) ->
            @routeObserver.update child, groundRouteKey
            @_currentChildRoute = child.route
            return {
                child
                groundRouteKey
            }

        getChildRoute: (route) ->
            return @_currentChildRoute

        contextState: (hash) ->
            console.debug "contextState", hash

        # registration order:
        # 1. current hash
        # 2. type ("ground" / "child")
        register: (type, context, routeObject) ->

            @_contextHash[routeObject.spec] = context

        getRegistredContext: (specId) ->
            @_contextHash[specId]

        # context duck-typing
        ensureContext: (context) ->
            if context.destroy and context.resolve and context.wire
                return true
            else
                return false

        getContextHash: ->
            return @_contextHash

