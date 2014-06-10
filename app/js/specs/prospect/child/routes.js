define(function() {
  var childRoutes;
  childRoutes = {
    "autocomplete": {
      spec: "components/autocomplete/spec",
      slot: {
        $ref: "dom.first!#page"
      },
      behavior: {
        $ref: "behavior!doSmth"
      }
    },
    "calendar": {
      spec: "components/calendar/spec",
      slot: {
        $ref: "dom.first!#page"
      },
      behavior: {
        $ref: "behavior!doSmth"
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
    "order/info/{id}/person/{personId}": {
      spec: "components/person/spec",
      slot: {
        $ref: "dom.first!#pageRight"
      }
    },
    "order/info/{id}/flight/{flightId}": {
      spec: "components/flight/spec",
      slot: {
        $ref: "dom.first!#pageLeft"
      }
    }
  };
  return childRoutes;
});
