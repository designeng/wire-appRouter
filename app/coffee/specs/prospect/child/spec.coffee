
# experimental; used in main.js
define ->

    $plugins:[
        "wire/debug"
    ]

    # prospectRouter
    controller:
        create: "specs/prospect/child/controller"
        properties:
            prospectRouter: {$ref: "prospectRouter"}
        ready:
            "onReady": {}

    autoCompleteRoute:
        literal:
            spec: "components/autocomplete/spec"
            slot: {$ref: "dom.first!#page"}
            behavior: {$ref: "behavior!doSmth"}

    calendarRoute:
        literal:
            spec: "components/calendar/spec"
            slot: {$ref: "dom.first!#page"}
            behavior: {$ref: "behavior!doSmth"}
    
    childRoutes:
        "autocomplete": {$ref: 'autoCompleteRoute'}  
        "calendar":  {$ref: 'calendarRoute'}

        # "search"  :  
        #     spec: "components/mainform/spec"
        #     slot: {$ref: "dom.first!#page"}

        # "order"  :   
        #     spec: "components/searchorderform/spec"
        #     slot: {$ref: "dom.first!#page"}

        # # complex template
        # "order/right"  : 
        #     spec: "components/orderinfo/spec"
        #     slot: {$ref: "dom.first!#pageRight"}
        #     # behavior: {$ref: "behavior!shiftCenter"}

        # "order/center"  : 
        #     spec: "components/orderinfo/spec"
        #     slot: {$ref: "dom.first!#pageCenter"}

        # # complex person route
        # "order/info/{id}/person/{personId}"  :
        #     spec: "components/person/spec"
        #     slot: {$ref: "dom.first!#pageRight"}

        # "order/info/{id}/flight/{flightId}"  :
        #     spec: "components/flight/spec"
        #     slot: {$ref: "dom.first!#pageLeft"}