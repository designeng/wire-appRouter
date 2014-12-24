define
    $plugins:[
        "wire/debug"
        "wire/aop"
    ]

    # provided: [groundRoutes, childRoutes, pluginWireFn, appRouterController]

    filterStrategy:
        module: "core/plugin/routing/default/filterStrategy"

    behaviorProcessor:
        create: "core/plugin/routing/default/behaviorProcessor"
        properties:
            pluginWireFn                : {$ref: 'pluginWireFn'}

    accessPolicyProcessor:
        create: "core/plugin/routing/default/accessPolicyProcessor"
        properties:
            pluginWireFn                : {$ref: 'pluginWireFn'}

    hasherInitializator:
        create: "core/plugin/routing/default/hasherInitializator"
        properties:
            appRouterController: {$ref: 'appRouterController'}
        after:
            "parseHash": "contextController.contextState"

    contextController:
        create: "core/plugin/routing/default/contextController"
        properties:
            appRouterController: {$ref: 'appRouterController'}
        ready:
            onReady: {}

    childContextProcessor:
        create: "core/plugin/routing/default/childContextProcessor"
        properties:
            accessPolicyProcessor       : {$ref: 'accessPolicyProcessor'}
            behaviorProcessor           : {$ref: 'behaviorProcessor'}
            environment                 : {$ref: 'environment'}
            pluginWireFn                : {$ref: 'pluginWireFn'}
            contextController           : {$ref: 'contextController'}

    environment:
        create: "core/plugin/routing/default/environment"
        properties:
            pluginWireFn                : {$ref: 'pluginWireFn'}

    routeHandlerFactory:
        create: "core/plugin/routing/default/routeHandlerFactory"
        properties:
            appRouterController         : {$ref: 'appRouterController'}
            contextController           : {$ref: 'contextController'}
            filterStrategy              : {$ref: 'filterStrategy'}
            childContextProcessor       : {$ref: 'childContextProcessor'}
            behaviorProcessor           : {$ref: 'behaviorProcessor'}
            environment                 : {$ref: 'environment'}
            # provided by plugin options:
            groundRoutes                : {$ref: 'groundRoutes'}
            childRoutes                 : {$ref: 'childRoutes'}

    controller:
        create: "core/plugin/routing/default/controller"
        properties:
            groundRoutes                : {$ref: 'groundRoutes'}
            routeHandlerFactory         : {$ref: 'routeHandlerFactory'}
        afterFulfilling:
            "registerGroundRoutes": "hasherInitializator.initialize"
        ready:
            registerGroundRoutes: {}