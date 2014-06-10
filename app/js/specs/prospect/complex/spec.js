define(function() {
  return {
    $plugins: ['wire/debug', 'wire/dom', 'wire/dom/render', "core/plugin/serviceHub"],
    prospectView: {
      render: {
        template: {
          module: "text!specs/prospect/complex/template/complex.html"
        },
        css: {
          module: "css!specs/prospect/complex/template/style.css"
        }
      },
      insert: {
        at: {
          $ref: 'slot'
        }
      }
    },
    renderingController: {
      create: "specs/prospect/common/controller",
      properties: {
        view: {
          $ref: "prospectView"
        }
      },
      ready: {
        "onReady": {}
      }
    },
    registerTemplateContent: {
      module: "specs/util/registerTemplateContent"
    }
  };
});
