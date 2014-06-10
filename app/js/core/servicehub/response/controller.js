define(["underscore", "cola/adapter/Array", "core/servicehub/serviceMap"], function(_, ArrayAdapter, serviceMap) {
  var ResponseController;
  ResponseController = (function() {
    function ResponseController() {}

    ResponseController.prototype.collection = void 0;

    ResponseController.prototype.addSource = function() {
      var id, name, serviceMapNames, services, source, _i, _len;
      id = 0;
      services = [];
      serviceMapNames = _.keys(serviceMap);
      for (_i = 0, _len = serviceMapNames.length; _i < _len; _i++) {
        name = serviceMapNames[_i];
        services.push({
          id: id++,
          name: name,
          response: {}
        });
      }
      source = new ArrayAdapter(services);
      return this.collection.addSource(source);
    };

    ResponseController.prototype.storeResponse = function(serviceName, response) {
      var item;
      item = {
        id: this.getResponseIdByServiceName(serviceName),
        name: serviceName,
        response: response
      };
      return this.collection.update(item);
    };

    ResponseController.prototype.getStoredResponse = function(serviceName) {
      var id;
      id = this.getResponseIdByServiceName(serviceName);
      return this.getResponseById(id);
    };

    ResponseController.prototype.getResponseIdByServiceName = function(serviceName) {
      var list, listItemResult;
      list = this.collection.adapters[1].origSource._array;
      listItemResult = _.where(list, {
        name: serviceName
      });
      return listItemResult[0].id;
    };

    ResponseController.prototype.getResponseById = function(id) {
      var data;
      data = this.collection.adapters[0].origSource._data;
      return data[id].response;
    };

    return ResponseController;

  })();
  return ResponseController;
});
