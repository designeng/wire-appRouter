define [
    "cola/Collection"
    "cola/adapter/Array"
    "cola/adapter/LocalStorage"
], (Collection, ArrayAdapter, LocalStorageAdapter) ->

    # singleton
    class ServiceMapCollection

        constructor: ->
            return new Collection()


        # @param {Object}
        # serviceObject.name {String}
        # serviceObject.object {Object}
        addItem: (serviceObject) ->





    return serviceMapCollection = new ServiceMapCollection() unless serviceMapCollection?

