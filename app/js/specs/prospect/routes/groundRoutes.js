define(function() {
  var groundRoutes;
  return groundRoutes = {
    "{base}": {
      spec: "specs/prospect/complex/spec",
      slot: {
        $ref: "dom.first!#prospect"
      },
      rules: {
        base: /^autocomplete|^calendar/i
      },
      behavior: {
        $ref: "behavior!doSmth   "
      }
    },
    "{base}/{infopart}": {
      spec: "specs/prospect/complex/spec",
      slot: {
        $ref: "dom.first!#prospect"
      },
      rules: {
        base: /\border\b|\bautocomplete\b/i,
        infopart: /\bright\b|\bcenter\b|[0-9]+/i
      }
    },
    "{complexpart}/{infopart}/{id}": {
      spec: "specs/prospect/complex/spec",
      slot: {
        $ref: "dom.first!#prospect"
      },
      rules: {
        complexpart: /\border\b/i,
        infopart: /\binfo\b/i,
        id: /[0-9]+/i
      }
    },
    "{complexpart}/{infopart}/{id}/{side}": {
      spec: "specs/prospect/complex/spec",
      slot: {
        $ref: "dom.first!#prospect"
      },
      rules: {
        complexpart: /\border\b/i,
        infopart: /\binfo\b/i,
        id: /[0-9]+/i,
        side: /\bflight\b/i
      }
    }
  };
});
