define(function() {
  return {
    $plugins: ["wire/debug", "core/plugin/routing/rootLevelRouter"],
    routeFilterStrategy: {
      module: "specs/prospect/strategy/routeFilterStrategy"
    },
    prospectRouter: {
      rootLevelRouter: {
        routes: {
          "{plain}": {
            spec: "specs/prospect/plain/spec",
            mergeWith: "components/request/packresponse/spec",
            slot: {
              $ref: "dom.first!#prospect"
            },
            rules: {
              plain: /^autocomplete|^calendar/i
            },
            behavior: {
              $ref: "behavior!doSmth"
            }
          },
          "{complexpart}/{infopart}": {
            spec: "specs/prospect/complex/spec",
            mergeWith: "components/request/packresponse/spec",
            slot: {
              $ref: "dom.first!#prospect"
            },
            rules: {
              complexpart: /\border\b/i,
              infopart: /\bright\b|\bcenter\b/i
            }
          },
          "{complexpart}/{infopart}/{id}/{side}": {
            spec: "specs/prospect/complex/spec",
            mergeWith: "components/request/packresponse/spec",
            slot: {
              $ref: "dom.first!#prospect"
            },
            rules: {
              complexpart: /\border\b/i,
              infopart: /\binfo\b/i,
              id: /[0-9]+/i,
              side: /\bflight\b/i
            }
          },
          "{complexpart}/{infopart}/{id}/{object}/{objectId}": {
            spec: "specs/prospect/complex/spec",
            mergeWith: "components/request/packresponse/spec",
            slot: {
              $ref: "dom.first!#prospect"
            },
            rules: {
              complexpart: /\border\b/i,
              infopart: /\binfo\b/i,
              id: /[0-9]+/i,
              object: /\bperson\b|\bflight\b/i,
              objectId: /[0-9]+/i
            }
          }
        },
        routeFilterStrategy: {
          $ref: "routeFilterStrategy"
        }
      }
    }
  };
});
