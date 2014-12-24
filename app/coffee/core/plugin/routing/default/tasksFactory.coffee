define [
    "underscore"
    "when"
    "when/pipeline"
], (_, When, pipeline) ->

    class TasksFactory

        constructor: (target, tasks) ->
            @distributive = @provideFunctions(target, @prepareTasks(tasks))
            return @

        prepareTasks: (tasks) ->
            filterRegExp = /filter:/g
            distributive = {}

            _filters = _.filter tasks, (item) ->
                if item.match filterRegExp then true else false

            distributive["filters"] = _.map _filters, (item) ->
                return item.split(":")[1]
            distributive["tasks"] = _.difference tasks, _filters

            return distributive

        provideFunctions: (target, distributive) ->
            result = {}
            _.each distributive, (methods, key) ->
                result[key] = _.map methods, (method) ->
                    target[method]
                , target
            , target
            return result

        runTasks: (item, callback) ->
            noop = ->
            callback = noop unless _.isFunction callback
            pipeline(@distributive["filters"], item).then (result) =>
                pipeline(@distributive["tasks"], result).then (res) =>
                    callback()
                , (err) ->
                    console.error "PIPELINE TASKS ERR:::", err
            , (reason) ->
                console.debug "PIPELINE FILTERS ERR:::", reason