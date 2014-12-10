# it works with contextRouter

require [
    "wire"
    "hasher"
    "wire!bootstrapSpec"
    "specs/prospect/prospectWireSpec"
], (wire, hasher, bootstrapCTX, prospectSpec) ->

    bootstrapCTX.wire(
        prospectSpec
    ).then (resultCTX) ->
        hasher.prependHash = ""
        hasher.init()