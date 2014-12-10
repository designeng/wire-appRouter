require(["wire", "hasher", "wire!bootstrapSpec", "specs/prospect/prospectWireSpec"], function(wire, hasher, bootstrapCTX, prospectWireSpec) {
  return bootstrapCTX.wire(prospectWireSpec).then(function(resultCTX) {});
});
