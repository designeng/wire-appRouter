define [
    "wire!core/servicehub/response/spec"
], (serviceResponseContext) ->

    # singleton (wrapper around response context)
    class ServiceResponse

        constructor: ->
            return serviceResponseContext


    return serviceResponse = new ServiceResponse() unless serviceResponse?