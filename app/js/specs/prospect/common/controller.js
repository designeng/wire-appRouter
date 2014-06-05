define(["when", "jquery"], function(When, $) {
  var RenderingController;
  return RenderingController = (function() {
    function RenderingController() {}

    RenderingController.prototype.renderingDeferred = When.defer();

    RenderingController.prototype.onReady = function() {
      return this.renderingDeferred.resolve(this);
    };

    RenderingController.prototype.isReady = function() {
      return this.renderingDeferred.promise;
    };

    RenderingController.prototype.registerTemplateContent = function(view) {
      return console.log("registerTemplateContent------", $(view).html());
    };

    return RenderingController;

  })();
});
