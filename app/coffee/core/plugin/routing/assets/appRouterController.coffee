define [
    "crossroads"
    "core/util/navigation/navigateToError"
], (crossroads, navigateToError) ->

    class AppRouterController

        constructor: ->
            router = crossroads.create()

            router.bypassed.add (route) ->
                navigateToError "404", "The page with route #{route} you tried to access does not exist"

            # deprecated?
            router.getCurrentRoute = () ->
                return @._prevRoutes[0]

            # instead
            router.getCurrentRouteHash = () ->
                return @._prevRoutes[0]

            router.resetPreviousRoutes = () ->
                @._prevRoutes = []

            return router

    return appRouterController = new AppRouterController() unless appRouterController?