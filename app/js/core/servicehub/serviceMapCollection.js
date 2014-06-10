define(["cola/Collection", "cola/adapter/Array", "cola/adapter/LocalStorage"], function(Collection, ArrayAdapter, LocalStorageAdapter) {
  var ServiceMapCollection, serviceMapCollection;
  ServiceMapCollection = (function() {
    function ServiceMapCollection() {
      return new Collection();
    }

    ServiceMapCollection.prototype.addItem = function(serviceObject) {};

    return ServiceMapCollection;

  })();
  if (typeof serviceMapCollection === "undefined" || serviceMapCollection === null) {
    return serviceMapCollection = new ServiceMapCollection();
  }
});
