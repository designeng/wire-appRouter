define [
    "underscore"
    "when"
    "when/pipeline"
    "./tasksFactory"
], (_, When, pipeline, TasksFactory) ->

    class ChildContextProcessor

        # should be defined in "deliver" method
        parentContext: undefined

        constructor: ->
            _.bindAll @
            tasks = [
                "filter:askForAccess"
                "wireChildContext"
                "sequenceBehavior"
                "synchronize"
            ]
            @tasksFactory = new TasksFactory(@, tasks)

        deliver: (parentContext, bundle) ->
            @parentContext = parentContext
            
            # if any filter return false, no tasks processing
            _.each bundle, (item, index) =>

                if index > 0
                    delete item.behavior
                    # delete item.route

                @tasksFactory.runTasks(item)

        # @param {Object} child - child route object definition
        # @returns {Promise}
        askForAccess: (child) ->
            registred = @contextController.getRegistredContext(child.route)
            if registred?
                return child
            else
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

                return When(@environment.loadInEnvironment(child.spec, child.mergeWith, environment, @parentContext)).then (childContext) =>
                    # register context
                    @contextController.register @parentContext, childContext, child
                    return childContext
                , (rejectReason) ->
                    console.debug "ChildContextProcessor::wireChildContext:rejectReason:", rejectReason

        sequenceBehavior: (childContext) ->
            console.debug "sequenceBehavior", childContext
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
