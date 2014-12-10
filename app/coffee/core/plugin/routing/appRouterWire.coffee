define [
    "underscore"
    "core/plugin/routing/default/spec"
    "core/plugin/routing/assets/appRouterController"
], (_, defaultAppRouter, appRouterController) ->

    return (options) ->

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
                            pluginWireFn    : wire
                            appRouterController: {$ref: 'appRouterController'}
                            groundRoutes    : compDef.options.groundRoutes
                            childRoutes     : compDef.options.childRoutes
            }).then (context) ->
                resolver.resolve(context)

        pluginInstance = 
            ready: (resolver, proxy, wire) ->
                resolver.resolve()
            destroy: (resolver, proxy, wire) ->
                appRouterController.dispose()
                resolver.resolve()

            factories: 
                appRouter: appRouterFactory

        return pluginInstance