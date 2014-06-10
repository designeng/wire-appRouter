define(["when"], function(When) {
  var Controller;
  return Controller = (function() {
    function Controller() {}

    Controller.prototype.onReady = function() {
      return When(this.prospectRouter).then(function(res) {
        return console.log("RES:::::::prospectRouter::::", res);
      });
    };

    return Controller;

  })();
});
