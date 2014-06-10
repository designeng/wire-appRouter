define [
    "underscore"
    "cola/adapter/Array"
    "core/servicehub/serviceMap"
], (_, ArrayAdapter, serviceMap) ->

    class ResponseController

        # @injected
        collection: undefined

        # binded to serviceMap services
        addSource: ->
            id = 0
            services = []

            serviceMapNames = _.keys serviceMap

            for name in serviceMapNames
                # in response field will be stored last response
                services.push {id: id++, name: name, response: {}}

            source = new ArrayAdapter(services)

            @collection.addSource source

        storeResponse: (serviceName, response) ->            

            item = 
                id: @getResponseIdByServiceName(serviceName)
                name: serviceName
                response: response

            @collection.update item

        getStoredResponse: (serviceName) ->
            id = @getResponseIdByServiceName(serviceName)
            return @getResponseById id

        # util methods
        getResponseIdByServiceName: (serviceName) ->
            list = @collection.adapters[1].origSource._array
            listItemResult = _.where list, {name: serviceName}
            return listItemResult[0].id

        getResponseById: (id) ->
            data = @collection.adapters[0].origSource._data
            return data[id].response

        # /util methods

    return ResponseController