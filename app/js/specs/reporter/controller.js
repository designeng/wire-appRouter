define(["jquery"], function($) {
  var ReporterController;
  return ReporterController = (function() {
    function ReporterController() {}

    ReporterController.prototype.sendViewReport = function() {
      var html, slot;
      slot = this.slot;
      console.log("CURRENT SLOT:::", slot);
      html = $(this.specMainView).html();
      return this.templateController.registerTemplateContent(slot, html);
    };

    return ReporterController;

  })();
});
