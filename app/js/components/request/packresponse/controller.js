define(function() {
  var RequestController;
  return RequestController = (function() {
    function RequestController() {}

    RequestController.prototype.afterSendRequest = function(res) {
      return console.log("RequestController_____afterSendRequest ENTITY RESULT", res);
    };

    return RequestController;

  })();
});
