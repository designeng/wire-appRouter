define(function() {
  return function(options) {
    var destroyFn, experimentFn, pluginInstance;
    experimentFn = function(resolver, facet, wire) {
      return resolver.resolve();
    };
    destroyFn = function(resolver, facet, wire) {
      console.debug("destroyFn");
      return resolver.resolve();
    };
    pluginInstance = {
      facets: {
        experiment: {
          'ready': experimentFn,
          'destroy': destroyFn
        }
      }
    };
    return pluginInstance;
  };
});
