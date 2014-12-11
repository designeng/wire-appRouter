define [
    "underscore"
    "core/plugin/routing/default/spec"
    "core/plugin/routing/assets/appRouterController"
], (_, defaultAppRouter, appRouterController) ->

    return (options) ->

        pluginContext = null

        # @param {Object} compDef.options
        appRouterFactory = (resolver, compDef, wire) ->
            essentialObjects = ["groundRoutes", "childRoutes"]
            for opt in essentialObjects
                if !compDef.options[opt]?
                    throw new Error "#{opt} option should be provided for appRouter plugin usage!"
                if !_.isObject compDef.options[opt]
                    throw new Error "#{opt} option should be Object!"

            wire({
                appRouterController:
                    create: "core/plugin/routing/assets/appRouterController"
                root:
                    wire:
                        spec: defaultAppRouter
                        provide:
                            pluginWireFn           : wire
                            appRouterController    : {$ref: 'appRouterController'}
                            groundRoutes           : compDef.options.groundRoutes
                            childRoutes            : compDef.options.childRoutes
            }).then (context) ->
                pluginContext = context
                resolver.resolve(context)

        pluginInstance = 
            ready: (resolver, proxy, wire) ->
                resolver.resolve()
            destroy: (resolver, proxy, wire) ->
                appRouterController.dispose()
                pluginContext.root.contextController.routeObserver.unwatch()
                resolver.resolve()

            factories: 
                appRouter: appRouterFactory

        return pluginInstance