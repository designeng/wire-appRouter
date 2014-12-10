define [
    "hasher"
], (hasher) ->

    class HasherInitializator

        parseHash: (newHash, oldHash) =>
            @appRouterController.parse newHash
            return newHash

        initialize: () =>
            hasher.initialized.add(@parseHash)
            hasher.changed.add(@parseHash)

            hasher.prependHash = ""
            hasher.init()