define [
    "underscore"
    "when"
    "when/sequence"
], (_, When, sequence) ->

    class BehaviorProcessor

        sequenceBehavior: (childCTX) ->
            return When(@pluginWireFn.getProxy(childCTX.behavior)
                    , (behaviorObject) ->
                        tasks = behaviorObject.target
                        # normalize tasks
                        if _.isFunction tasks
                            tasks = [tasks]
                        # @param {Array} tasks - array of tasks
                        # @param {Object} childCTX - current resulted child context
                        sequence(tasks, childCTX)
                    , () ->
                        # nothing to do, no behavior defined
            ).then () ->
                return childCTX
            , (error) ->
                console.error "BehaviorProcessor::sequenceBehavior ERROR:", error
            