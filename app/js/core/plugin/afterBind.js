define(['jquery'], function($) {
  return function(options) {
    var afterBindFunc, doAfterBind, pluginInstance;
    doAfterBind = function(facet, options, wire) {
      var target,
        _this = this;
      target = facet.target;
      console.log("-------------------------------READY----------------------------");
      return setTimeout(function() {
        return console.log(">>>>>>>>>>>>>>>>>HTML>>>>>>>>>>>>>>", $(target).html());
      }, 300);
    };
    afterBindFunc = function(resolver, facet, wire) {
      return resolver.resolve(doAfterBind(facet, options, wire));
    };
    pluginInstance = {
      facets: {
        afterBind: {
          'ready': afterBindFunc
        }
      }
    };
    return pluginInstance;
  };
});
