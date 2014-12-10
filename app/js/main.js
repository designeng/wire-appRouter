require(["wire", "hasher", "wire!bootstrapSpec", "specs/prospect/prospectWireSpec"], function(wire, hasher, bootstrapCTX, prospectSpec) {
  return bootstrapCTX.wire(prospectSpec).then(function(resultCTX) {
    hasher.prependHash = "";
    return hasher.init();
  });
});
