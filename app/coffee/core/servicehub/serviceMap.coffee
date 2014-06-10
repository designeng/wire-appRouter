# serviceMap
define ->
    serviceMap = 
        stubService:
            path: "/service/stub"
        packResponseService:
            path: "/service/mock/pack/response"
        flightStatesSearches:
            path: "/service/mock/flightstates/search"

        # ping kadabra
        pingService:
            path: "/service/ping"