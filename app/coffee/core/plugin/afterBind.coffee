
define [
    'jquery'
], ($) ->

    return (options) ->

        doAfterBind = (facet, options, wire) ->
            target = facet.target
            console.log "-------------------------------READY----------------------------"
            setTimeout () =>
                console.log ">>>>>>>>>>>>>>>>>HTML>>>>>>>>>>>>>>", $(target).html() 
            , 300
            

        afterBindFunc = (resolver, facet, wire) ->
            resolver.resolve(doAfterBind(facet, options, wire))


        pluginInstance = 
            facets:
                afterBind:
                    'ready': afterBindFunc

        return pluginInstance