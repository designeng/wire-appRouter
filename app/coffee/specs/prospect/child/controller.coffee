define [
    "when"
], (When) ->
    class Controller
        onReady: ->

            When(@prospectRouter).then (res) ->
                console.log "RES:::::::prospectRouter::::", res
