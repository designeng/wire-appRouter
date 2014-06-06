define(function() {
  return {
    $plugins: ['wire/debug', 'wire/dom', 'wire/on', 'wire/dom/render', 'cola'],
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
    identifyBySlot: {
      create: {
        module: 'cola/identifier/property',
        args: ['slot']
      }
    },
    prospectViewTemplatesCollection: {
      create: {
        module: 'cola/Collection'
      }
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
    templateController: {
      create: "specs/prospect/complex/templateController",
      properties: {
        prospectViewTemplatesCollection: {
          $ref: 'prospectViewTemplatesCollection'
        }
      },
      ready: {
        "onReady": {}
      }
    }
  };
});
