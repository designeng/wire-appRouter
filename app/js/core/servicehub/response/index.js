define(["wire!core/servicehub/response/spec"], function(serviceResponseContext) {
  var ServiceResponse, serviceResponse;
  ServiceResponse = (function() {
    function ServiceResponse() {
      return serviceResponseContext;
    }

    return ServiceResponse;

  })();
  if (typeof serviceResponse === "undefined" || serviceResponse === null) {
    return serviceResponse = new ServiceResponse();
  }
});
