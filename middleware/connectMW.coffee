path = require "path"

ConnectMW = {}

ConnectMW.folderMount = (connect, point) ->
    return connect.static path.resolve(point)

# "service/stub"
ConnectMW.stubService = (req, res, next) ->
    if (req.url).match new RegExp("service/stub")

        params = require('url').parse(req.url, true).query

        body = 
            europe: 
                towns: ["Tokio", "Paris"]

        res.setHeader "Content-Type", "application/json; charset=utf-8"
        res.write JSON.stringify body
        res.end()

    else
        next()

# "service/autocomplete"
ConnectMW.autocompleteService = (req, res, next) ->
    if (req.url).match new RegExp("service/autocomplete")

        airports = ["Moscow", "Paris", "Tokio", "Rome", "London" ]
        id = 0
        body = 
            airports: []

        for port in airports
            body.airports.push {id: id, port: port}
            id++

        res.setHeader "Content-Type", "application/json; charset=utf-8"
        res.write JSON.stringify body
        res.end()

    else
        next()

module.exports = ConnectMW