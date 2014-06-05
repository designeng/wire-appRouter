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
          },
          "{complexpart}/{infopart}": {
            spec: "specs/prospect/complex/spec",
            slot: {
              $ref: "dom.first!#prospect"
            },
            rules: {
              complexpart: /\border\b/i,
              infopart: /\binfo\b/i
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
