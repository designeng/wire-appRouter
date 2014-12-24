define ->
    $plugins:[
        "wire/debug"
        "wire/dom"
        "core/plugin/routing/appRouterWire"
    ]

    groundRoutes:
        module: "specs/prospect/routes/groundRoutes"

    childRoutes:
        module: "specs/prospect/routes/childRoutes"

    prospectRouter:
        appRouter:
            groundRoutes: {$ref: 'groundRoutes'}
            childRoutes: {$ref: 'childRoutes'}