define ->
    
    childRoutes =

        "autocomplete"  :   
            spec: "components/autocomplete/spec"
            slot: {$ref: "dom.first!#page"}
            behavior: {$ref: "behavior!doSmth"}

        "calendar"  :  
            spec: "components/calendar/spec"
            slot: {$ref: "dom.first!#page"}
            behavior: {$ref: "behavior!doSmth"}

        "search"  :  
            spec: "components/mainform/spec"
            slot: {$ref: "dom.first!#page"}

        "order"  :   
            spec: "components/searchorderform/spec"
            slot: {$ref: "dom.first!#page"}

        # complex template
        "order/info"  : 
            spec: "components/orderinfo/spec"
            slot: {$ref: "dom.first!#pageCenter"}
            behavior: {$ref: "behavior!shiftCenter"}




    return childRoutes