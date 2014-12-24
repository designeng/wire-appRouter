define [
    "underscore"
    "when"
    "when/pipeline"
], (_, When, pipeline) ->

    class ChildContextProcessor

        # should be defined in "deliver" method
        parentContext: undefined

        constructor: ->
            _.bindAll @

        distributeTasks: (tasks) ->
            filterRegExp = /filter:/g
            distributive = {}

            _filters = _.filter tasks, (item) ->
                if item.match filterRegExp then true else false

            distributive["filters"] = _.map _filters, (item) ->
                return item.split(":")[1]
            distributive["tasks"] = _.difference tasks, _filters

            return distributive

        provideFunctions: (distributive) ->
            result = {}
            _.each distributive, (methods, key) ->
                result[key] = _.map methods, (method) ->
                    @[method]
                , @
            , @
            return result

        deliver: (parentContext, bundle) ->
            @parentContext = parentContext
            tasks = [
                "filter:askForAccess"
                "wireChildContext"
                "sequenceBehavior"
                "synchronize"
                # "destroyTest"
            ]
            distributive = @provideFunctions(@distributeTasks(tasks))
            noop = ->

            # if any filter return false, no tasks processing
            _.each bundle, (item, index) ->
                pipeline(distributive["filters"], item).then (result) =>
                    pipeline(distributive["tasks"], result).then (res) =>
                        noop()
                    , (err) ->
                        console.error "PIPELINE TASKS ERR:::", err
                , (reason) ->
                    console.debug "PIPELINE FILTERS ERR:::", reason

        # @param {Object} child - child route object definition
        # @returns {Promise}
        askForAccess: (child) ->
            return @accessPolicyProcessor.askForAccess(child)

        wireChildContext: (child) ->
            registred = @contextController.getRegistredContext(child.route)

            if registred?
                childContext = registred.childContext
                return childContext
            else
                environment = 
                    slot        : child.slot

                if typeof child.behavior != "undefined"
                    environment["behavior"] = child.behavior

                return When(@environment.loadInEnvironment(child.spec, child.mergeWith, environment)).then (childContext) =>
                    # register context
                    @contextController.register @parentContext, childContext, child
                    return childContext
                , (rejectReason) ->
                    console.debug "rejectReason:::::", rejectReason

        sequenceBehavior: (childContext) ->
            if childContext.behavior?
                return @behaviorProcessor.sequenceBehavior(childContext)
            else
                return childContext

        synchronize: (childContext) ->
            if typeof childContext.synchronizeWithRoute != "undefined"
                childContext.synchronizeWithRoute.call childContext
            return childContext

        destroyTest: (childContext) ->
            setTimeout () ->
                childContext.destroy() 
            , 1000
