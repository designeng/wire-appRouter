define ->
    class AutoCompleteController

        # @injected
        input: undefined

        # @injected
        list: undefined

        # @injected
        listCollection: undefined

        onReady: ->

            # setTimeout(()=>
            #     @listCollection.adapters[1].onAdd = (item) ->
            #         console.log "ADDED", item
            # , 1000)

        synchronizeWithRoute: ->
            # console.debug "synchronizeWithRoute aitocomplete"
            

        onItemClick: (item) ->
            console.log "____click"


        onTextInputKeyUp: (e) ->
            console.log "_____ONKEYUP", @listCollection.adapters[0]._index,  @listCollection.adapters

            @listCollection.add {port: e.target.value}

        afterAdd: (item) ->
            console.log "__@listCollection afterAdd", item