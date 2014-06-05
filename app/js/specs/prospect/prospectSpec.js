define(function() {
  return {
    $plugins: ["wire/debug", "core/plugin/appRouter"],
    childRoutes: {
      module: "specs/prospect/child/routes"
    },
    routeFilterStrategy: {
      module: "specs/prospect/strategy/routeFilterStrategy"
    },
    prospectRouter: {
      appRouter: {
        routes: {
          "{plain}": {
            spec: "specs/prospect/plain/spec",
            slot: {
              $ref: "dom.first!#prospect"
            },
            rules: {
              plain: /^autocomplete|^calendar/i
            },
            behavior: {
              $ref: "behavior!doSmth   "
            }
          }
        },
        routeFilterStrategy: {
          $ref: "routeFilterStrategy"
        },
        childRoutes: {
          $ref: 'childRoutes'
        }
      }
    }
  };
});
