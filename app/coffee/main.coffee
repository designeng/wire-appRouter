# it works with contextRouter

require [
    "wire"
    "hasher"
    "wire!bootstrapSpec"
    "prospectSpec"
    "specs/prospect/child/spec"
], (wire, hasher, bootstrapCTX, prospectSpec, childRouteSpec) ->

    # root (perspective) route level
    bootstrapCTX.wire(
        prospectSpec
    ).then (resultCTX) ->

        # child (components) route level
        resultCTX.wire(
            childRouteSpec
        ).then (resultCTX) ->

            console.log "resultCTX:::::---", resultCTX

            hasher.prependHash = ""
            hasher.init()