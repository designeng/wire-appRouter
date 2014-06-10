define(function() {
  return {
    $plugins: ['wire/debug', 'wire/on', 'wire/dom', 'wire/dom/render', 'cola', 'wire/aop'],
    responseController: {
      create: "core/servicehub/response/controller",
      properties: {
        collection: {
          $ref: "serviceResponseCollection"
        }
      },
      ready: {
        "addSource": {}
      }
    },
    serviceResponseCollection: {
      create: {
        module: 'cola/Collection'
      }
    },
    serviceResponseStore: {
      create: {
        module: "cola/adapter/LocalStorage",
        args: "responses"
      },
      bind: {
        $ref: 'serviceResponseCollection'
      }
    },
    storeResponse: function(serviceName, response) {
      return this.responseController.storeResponse(serviceName, response);
    },
    getStoredResponse: function(serviceName) {
      var response;
      response = this.responseController.getStoredResponse(serviceName);
      return response;
    }
  };
});
