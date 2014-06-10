define(function() {
  return {
    $plugins: ["wire/debug"],
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
