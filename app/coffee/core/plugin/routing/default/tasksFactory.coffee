define [
    "underscore"
    "when"
    "when/sequence"
    "when/pipeline"
], (_, When, sequence, pipeline) ->

    class TasksFactory

        noop: (object) ->
            return object

        constructor: (target, tasks) ->
            @distributive = @provideFunctions(target, @prepareTasks(tasks))
            return @

        prepareTasks: (tasks) ->
            beforeRegExp = /before:/g
            afterRegExp  = /after:/g
            filterRegExp = /filter:/g
            distributive = {}

            # will be invoked anyway before all
            _befores = _.filter tasks, (item) ->
                if item.match beforeRegExp then true else false

            _filters = _.filter tasks, (item) ->
                if item.match filterRegExp then true else false

            # will be invoked anyway after all
            _afters = _.filter tasks, (item) ->
                if item.match afterRegExp then true else false

            distributive["befores"] = _.map _befores, (item) ->
                return item.split(":")[1]
            distributive["filters"] = _.map _filters, (item) ->
                return item.split(":")[1]
            distributive["afters"] = _.map _afters, (item) ->
                return item.split(":")[1]
            # will be invoked only if filters resolved
            distributive["tasks"] = _.difference tasks, _filters, _befores, _afters

            return distributive

        provideFunctions: (target, distributive) ->
            result = {}
            _.each distributive, (methods, key) ->
                result[key] = _.map methods, (method) ->
                    if !target[method]
                        throw new Error "No method with name '#{method}' provided!"
                    else
                        return target[method]
                , target
            , target
            return result

        runTasks: (item, callback) ->
            callback = @noop unless _.isFunction callback

            deferred = When.defer()

            sequence(@distributive["befores"], item).then () =>
                pipeline(@distributive["filters"], item).then (result1) =>
                    pipeline(@distributive["tasks"], result1).then (result2) ->
                        deferred.resolve(result2)
                        callback(result2)
                    , (err) ->
                        console.error "PIPELINE TASKS ERR:::", err
                , (reason) ->
                    deferred.resolve(false)
                    console.debug "PIPELINE FILTERS ERR:::", reason

            When(deferred.promise).then (resultContext) =>
                sequence(@distributive["afters"], resultContext)