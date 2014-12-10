# it works with contextRouter

require [
    "wire"
    "hasher"
    "wire!bootstrapSpec"
    "specs/prospect/prospectWireSpec"
], (wire, hasher, bootstrapCTX, prospectWireSpec) ->

    bootstrapCTX.wire(
        prospectWireSpec
    ).then (resultCTX) ->