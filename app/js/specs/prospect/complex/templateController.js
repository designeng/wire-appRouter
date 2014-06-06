define(["jquery", "cola/adapter/Array"], function($, ArrayAdapter) {
  var RegisterTemplateController;
  return RegisterTemplateController = (function() {
    function RegisterTemplateController() {}

    RegisterTemplateController.prototype.onReady = function() {
      var source, templates;
      templates = [];
      templates.push({
        id: 0,
        slotId: "one",
        html: "test"
      });
      source = new ArrayAdapter(templates);
      return this.prospectViewTemplatesCollection.addSource(source);
    };

    RegisterTemplateController.prototype.registerTemplateContent = function(slot, html) {
      var slotId;
      slotId = $(slot).attr("id");
      this.prospectViewTemplatesCollection.add({
        id: 123,
        slotId: slotId,
        html: html
      });
      return console.log("@prospectViewTemplatesCollection::::", this.prospectViewTemplatesCollection.adapters);
    };

    return RegisterTemplateController;

  })();
});
