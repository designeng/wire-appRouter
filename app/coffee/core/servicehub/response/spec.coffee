# servicehub response spec
define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
        'cola'
        'wire/aop'
    ]

    responseController:
        create: "core/servicehub/response/controller"
        properties:
            collection: { $ref: "serviceResponseCollection" }
        ready:
            "addSource": {}

    # collection for service response storage
    serviceResponseCollection:
        create:
            module: 'cola/Collection'

    serviceResponseStore:
        create:
            module: "cola/adapter/LocalStorage"
            args: "responses"
        bind: {$ref: 'serviceResponseCollection'}

    storeResponse: (serviceName, response) ->
        @responseController.storeResponse(serviceName, response)

    getStoredResponse: (serviceName) ->
        response = @responseController.getStoredResponse(serviceName)
        return response
