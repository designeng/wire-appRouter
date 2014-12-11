define ->
    
    childRoutes =

        "autocomplete"  :   
            spec: "components/autocomplete/spec"
            slot: {$ref: "dom.first!#page"}
            behavior: {$ref: "behavior!sendMessage"}

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
        "order/right"  : 
            spec: "components/orderinfo/spec"
            slot: {$ref: "dom.first!#pageRight"}
            # behavior: {$ref: "behavior!shiftCenter"}

        "order/center"  : 
            spec: "components/orderinfo/spec"
            slot: {$ref: "dom.first!#pageCenter"}

        "order/info/{cpid}":
            spec: "components/orderinfo/spec"
            slot: {$ref: "dom.first!#pageCenter"}