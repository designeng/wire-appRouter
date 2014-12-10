var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(["hasher"], function(hasher) {
  var HasherInitializator;
  return HasherInitializator = (function() {
    function HasherInitializator() {
      this.initialize = __bind(this.initialize, this);
      this.parseHash = __bind(this.parseHash, this);
    }

    HasherInitializator.prototype.parseHash = function(newHash, oldHash) {
      this.appRouterController.parse(newHash);
      return newHash;
    };

    HasherInitializator.prototype.initialize = function() {
      hasher.initialized.add(this.parseHash);
      hasher.changed.add(this.parseHash);
      hasher.prependHash = "";
      return hasher.init();
    };

    return HasherInitializator;

  })();
});
