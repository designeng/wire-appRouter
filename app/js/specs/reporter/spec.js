define(function() {
  return {
    $plugins: ["wire/debug"],
    reporter: {
      create: "specs/reporter/controller",
      properties: {
        specMainView: {
          $ref: 'specMainView'
        },
        registerTemplateContent: {
          $ref: 'registerTemplateContent'
        }
      },
      ready: {
        "sendViewReport": {}
      }
    }
  };
});
