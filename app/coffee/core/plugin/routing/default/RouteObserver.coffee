define [
    "underscore"
    "meld"
    "signals"
], (_, meld, Signal) ->

    class RouteObserver

        removers: []

        currentParams: []
        currentGroundRouteKey: undefined
        currentChildRouteKey: undefined

        constructor: () ->
            @_signal = new Signal()

        getSignal: ->
            return @_signal

        watch: (targetFn) ->
            # TODO: remove remover in destroy phase
            @removers.push meld.afterReturning targetFn, @update
            
        unwatch: ->
            _.each @removers, (remover) ->
                remover.remove()

        # contextResetRoutePositions - array of route positions to watch. 
        # If value of any position changed, the appropriate ground context will be reseted.
        # Position example: 
        #     for route "{complexpart}/{infopart}/{cpid}" we want context to be reseted on {infopart},{cpid} change.
        #     contextResetRoutePositions: [1, 2]
        # 
        # If "contextResetRoutePositions" option is not specified, it can be computed from every {..} in route definition: /.../.../{..}/.../{..}
        # If contextResetRoutePositions option is specified, the route positions to reset context should be get from it.

        guessContextResetRoutePositions: (route) =>
            fragments = @normalizeRoute route
            res = _.reduce fragments, (result, item, index) ->
                result.push index if item.match("\\{(.*)}")
                return result
            , []
            return res

        normalizeRoute: (route) ->
            if _.isArray route
                return route
            else if _.isString route
                return route.split "/"

        validate: (emphasizedPositions, positions) ->
            return _.reduce emphasizedPositions, (result, positionValue) ->
                if _.indexOf positions, positionValue
                    result = result * 0
                return result
            , 1

        calculatePositions: (child) ->
            positions = @guessContextResetRoutePositions child.route
            emphasizedPositions = child.contextResetRoutePositions
            if emphasizedPositions
                isValid = @validate emphasizedPositions, positions
                if !isValid
                    throw new Error "Provided for child route '#{child.route}' contextResetRoutePositions not valid!"
                return emphasizedPositions
            else
                return positions

        # @param {Array} a
        # @param {Array} b
        # @returns {Boolean}
        theSame: (a, b) ->
            _.all _.zip(a, b), (x) -> x[0] == x[1]

        # @param {Array} a
        # @param {Array} b
        # @returns {Array}
        indexesOfMutation: (a, b) ->
            _.reduce _.zip(a, b), (result, item, index) -> 
                if item[0] != item[1]
                    result.push index
                return result
            , []

        changesOccurred: (mutations, positions) ->
            return !!_.intersection(mutations, positions).length

        update: (child, groundRouteKey) ->
            console.debug ">>>>>update with options:::child, groundRouteKey", child, groundRouteKey

            positions = @calculatePositions child

            # it should be always different, checking is not needed in general
            if !@theSame(child.params, @currentParams)
                mutations = @indexesOfMutation(child.params, @currentParams)
                if @changesOccurred(mutations, positions)
                    # current ground context should be reseted
                    console.debug "changesOccurred!"
                    @_signal.dispatch("shift", "ground")

            # finally
            @currentGroundRouteKey = groundRouteKey
            @currentChildRouteKey = child.route
            @currentParams = child.params