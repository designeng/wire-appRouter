define(function() {
  return {
    $plugins: ['wire/dom', 'wire/on', 'wire/dom/render', 'cola'],
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
    prospectViewTemplatesCollection: {
      create: "cola/Collection"
    },
    prospectViewTemplatesStore: {
      create: {
        module: "cola/adapter/LocalStorage",
        args: "prospectViewTemplates"
      },
      bind: {
        $ref: 'prospectViewTemplatesCollection'
      }
    },
    registerTemplateContent: {
      module: "specs/util/registerTemplateContent",
      properties: {
        prospectViewTemplatesCollection: {
          $ref: 'prospectViewTemplatesCollection'
        }
      }
    }
  };
});
