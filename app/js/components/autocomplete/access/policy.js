define(function() {
  var AccessPolicy;
  return AccessPolicy = (function() {
    function AccessPolicy() {}

    AccessPolicy.prototype.checkAccess = function() {
      return false;
    };

    AccessPolicy.prototype.getRedirect = function() {
      return "/calendar";
    };

    return AccessPolicy;

  })();
});
