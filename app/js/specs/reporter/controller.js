define(["jquery"], function($) {
  var ReporterController;
  return ReporterController = (function() {
    function ReporterController() {}

    ReporterController.prototype.sendViewReport = function() {
      var html;
      html = $(this.specMainView).html();
      return this.registerTemplateContent(html);
    };

    return ReporterController;

  })();
});
