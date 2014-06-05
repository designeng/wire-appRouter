define ["when"], (When) ->
    class RenderingController

        renderingDeferred: When.defer()

        onReady: () ->
            @renderingDeferred.resolve(@)

        isReady: ->
            return @renderingDeferred.promise