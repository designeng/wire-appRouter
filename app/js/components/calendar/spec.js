define(function() {
  return {
    $plugins: ['wire/on', 'wire/dom', 'wire/dom/render', 'wire/aop', 'cola'],
    $exports: {
      $ref: 'controller',
      $ref: 'calendarView'
    },
    controller: {
      create: "components/calendar/controller",
      properties: {
        collection: {
          $ref: 'monthCollection'
        },
        calendarView: {
          $ref: 'calendarView'
        }
      },
      ready: {
        "onReady": {}
      }
    },
    source: {
      create: "components/calendar/monthCollectionSource"
    },
    monthCollection: {
      create: {
        module: 'cola/Collection'
      },
      ready: {
        "addSource": {
          $ref: "source"
        }
      },
      after: {
        addSource: "controller.onChange"
      }
    },
    calendarView: {
      render: {
        template: {
          module: "text!components/calendar/template.html"
        },
        css: {
          module: "css!components/calendar/styles.css"
        }
      },
      insert: {
        at: {
          $ref: 'slot'
        }
      }
    },
    calendarGrid: {
      render: {
        template: {
          module: "text!components/calendar/grid.html"
        }
      },
      insert: {
        at: {
          $ref: "dom.first!.calendarGrigWrapper",
          at: 'calendarView'
        }
      },
      bind: {
        to: {
          $ref: 'monthCollection'
        },
        bindings: {
          day: '.day'
        }
      }
    }
  };
});
