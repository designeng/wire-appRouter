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

    controller:
        create: "core/plugin/routing/default/controller"
        properties:
            appRouterController         : {$ref: 'appRouterController'}
            contextController           : {$ref: 'contextController'}
            filterStrategy              : {$ref: 'filterStrategy'}
            childContextProcessor       : {$ref: 'childContextProcessor'}
            environment                 : {$ref: 'environment'}
            # provided by plugin options:
            groundRoutes                : {$ref: 'groundRoutes'}
            childRoutes                 : {$ref: 'childRoutes'}
        afterFulfilling:
            "registerGroundRoutes": "hasherInitializator.initialize"
        ready:
            registerGroundRoutes: {}