define ->
    $plugins:[
        "wire/debug"
        "core/plugin/appRouter"
    ]

    childRoutes:
        module: "specs/prospect/child/routes"

    routeFilterStrategy:
        module: "specs/prospect/strategy/routeFilterStrategy"

    prospectRouter:
        appRouter:
            routes: 
                "{plain}"  :   
                    spec: "specs/prospect/plain/spec"
                    slot: {$ref: "dom.first!#prospect"}
                    rules:
                        plain: /^autocomplete|^calendar/i
                    behavior: {$ref: "behavior!doSmth   "}

                # "{complexpart}/{infopart}/{id}"  :
                #     spec: "specs/prospect/complex/spec"
                #     slot: {$ref: "dom.first!#prospect"}
                #     rules:
                #         complexpart: /\border\b/i
                #         infopart: /\binfo\b/i
                #         id: /[0-9]+/i


                # "{complexpart}/{infopart}/{id}/{side}"  :
                #     spec: "specs/prospect/complex/spec"
                #     slot: {$ref: "dom.first!#prospect"}
                #     rules:
                #         complexpart: /\border\b/i
                #         infopart:/\binfo\b/i
                #         id: /[0-9]+/i
                #         side: /\baviacost\b|\badditional\b|\bflight\b/i


                # "{complexpart}/{infopart}/{id}/{person}/{personId}"  :
                #     spec: "specs/prospect/complex/spec"
                #     slot: {$ref: "dom.first!#prospect"}
                #     rules:
                #         complexpart: /\border\b/i
                #         infopart: /\binfo\b/i
                #         id: /[0-9]+/i
                #         person: /\bperson\b/i
                #         personId: /[0-9]+/i

            routeFilterStrategy: {$ref: "routeFilterStrategy"}

            childRoutes: {$ref: 'childRoutes'}