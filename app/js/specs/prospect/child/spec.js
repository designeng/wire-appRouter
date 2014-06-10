define(function() {
  return {
    $plugins: ["wire/debug"],
    controller: {
      create: "specs/prospect/child/controller",
      properties: {
        prospectRouter: {
          $ref: "prospectRouter"
        }
      },
      ready: {
        "onReady": {}
      }
    },
    autoCompleteRoute: {
      literal: {
        spec: "components/autocomplete/spec",
        slot: {
          $ref: "dom.first!#page"
        },
        behavior: {
          $ref: "behavior!doSmth"
        }
      }
    },
    calendarRoute: {
      literal: {
        spec: "components/calendar/spec",
        slot: {
          $ref: "dom.first!#page"
        },
        behavior: {
          $ref: "behavior!doSmth"
        }
      }
    },
    childRoutes: {
      "autocomplete": {
        $ref: 'autoCompleteRoute'
      },
      "calendar": {
        $ref: 'calendarRoute'
      }
    }
  };
});
