define ->

    return (options) ->

        experimentFn = (resolver, facet, wire) ->
            resolver.resolve()

        destroyFn = (resolver, facet, wire) ->
            console.debug "destroyFn"
            resolver.resolve()

        pluginInstance = 
            facets:
                experiment:
                    'ready'     : experimentFn
                    'destroy'   : destroyFn

        return pluginInstance