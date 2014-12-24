define(function() {
  var childRoutes;
  return childRoutes = {
    "autocomplete": {
      spec: "components/autocomplete/spec",
      slot: {
        $ref: "dom.first!#page"
      },
      behavior: {
        $ref: "behavior!sendMessage"
      }
    },
    "calendar": {
      spec: "components/calendar/spec",
      slot: {
        $ref: "dom.first!#page"
      },
      behavior: {
        $ref: "behavior!doSmth"
      },
      relative: "components/simple/spec"
    },
    "simple": {
      spec: "components/simple/spec",
      slot: {
        $ref: "dom.first!#simple"
      }
    },
    "search": {
      spec: "components/mainform/spec",
      slot: {
        $ref: "dom.first!#page"
      }
    },
    "order": {
      spec: "components/searchorderform/spec",
      slot: {
        $ref: "dom.first!#page"
      }
    },
    "order/right": {
      spec: "components/orderinfo/spec",
      slot: {
        $ref: "dom.first!#pageRight"
      }
    },
    "order/center": {
      spec: "components/orderinfo/spec",
      slot: {
        $ref: "dom.first!#pageCenter"
      }
    },
    "order/info/{cpid}": {
      spec: "components/orderinfo/spec",
      slot: {
        $ref: "dom.first!#pageCenter"
      }
    }
  };
});
