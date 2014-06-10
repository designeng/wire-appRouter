require(["wire", "hasher", "wire!bootstrapSpec", "prospectSpec", "specs/prospect/child/spec"], function(wire, hasher, bootstrapCTX, prospectSpec, childRouteSpec) {
  return bootstrapCTX.wire(prospectSpec).then(function(resultCTX) {
    return resultCTX.wire(childRouteSpec).then(function(resultCTX) {
      console.log("resultCTX:::::---", resultCTX);
      hasher.prependHash = "";
      return hasher.init();
    });
  });
});
