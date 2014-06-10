define(function() {
  return {
    $plugins: ["wire/debug", 'wire/dom', 'wire/dom/render', "core/plugin/serviceHub"],
    requestController: {
      create: "components/request/packresponse/controller",
      ready: {
        "sendRequest": ["autocompleteService"]
      },
      bindToService: ["autocompleteService"]
    }
  };
});
