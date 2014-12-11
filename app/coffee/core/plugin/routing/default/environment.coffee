define [
    "underscore"
    "when"
    "core/util/navigation/navigateToError"
], (_, When, navigateToError) ->

    class Environment

        loadModule: (moduleId) ->
            @pluginWireFn.loadModule(moduleId).then (resultContext) ->
                return resultContext
            , (error) ->
                navigateToError('js', error)

        # @param {String} specId - the primary target specificationId
        # @param {String | Array} mergeWith - id(s) of merging specification(s)
        # @return {Array of promises}
        getMergedModulesArrayOfPromises: (specId, mergeWith) ->
            promisedModules = []
            promisedModules.push @loadModule(specId)
            
            if mergeWith
                if _.isString mergeWith
                    promisedModules.push @loadModule(mergeWith)
                else if _.isArray mergeWith
                    for mergingModule in mergeWith
                        promisedModules.push @loadModule(mergingModule)
                else
                    throw new Error "mergeWith option has unsupported format!"

            return promisedModules

        applyEnvironment: (object, environment) ->
            object = _.extend object, environment
            if typeof environment.behavior != "undefined"
                object.$plugins = [] unless object.$plugins
                object.$plugins.push "core/plugin/behavior"
            return object

        # @param {String} specId - spec field in route configuration
        # @param {Array | String} mergeWith - module id(s) of merging with target spec specifications
        # @param {Object} environment - object of fields for result context to be extended with
        # @return {Promise}
        loadInEnvironment: (specId, mergeWith, environment) ->
            deferred = When.defer()
            promisedModules = @getMergedModulesArrayOfPromises specId, mergeWith
            When.all(promisedModules).then (modulesResult) =>
                modulesResult[0] = @applyEnvironment modulesResult[0], environment
                @pluginWireFn.createChild(modulesResult).then (context) =>
                    deferred.resolve(context)
            return deferred.promise