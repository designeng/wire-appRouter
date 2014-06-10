define [
	"moment"
	"underscore"
], (moment, _) ->

	getPointCode = (point, dictionary) ->
        dictionary = dictionary[point.type]
        codeObject = _.where(dictionary, {id: point.id})[0]

        return codeIata if codeIata = codeObject.codeIata
        return codeSirena if codeSirena = codeObject.codeSirena

	getStartEndCode = (startPoint, endPoint, dictionary) ->
        return getPointCode(startPoint, dictionary) + ">>" + getPointCode(endPoint, dictionary)

	getPersonsCount = (persons) ->
        length = persons.length
        # TODO: it must be localized (accordance for every language)
        accordance = ["", "а", "а", "а", "ов", "ов"]
        return length + " пассажир" + accordance[length - 1]

	getOrderInfoHeaderText = (res) ->
        airTrips        = res.data.pack.airTrips
        persons         = res.data.pack.persons

        personsCount    = getPersonsCount(persons)

        startDateTime   = airTrips[0].segments[0].startDateTime
        endDateTime     = airTrips[0].segments[0].endDateTime

        startPoint      = airTrips[0].segments[0].startPoint
        endPoint        = airTrips[0].segments[0].endPoint

        # by moment formatted
        startDateTime   = moment(startDateTime).format("DD/MM/YYYY")
        endDateTime     = moment(endDateTime).format("DD/MM/YYYY")

        endDateTimeStr = ""
        endDateTimeStr = " - #{endDateTime}" if res.data.pack.airTrips[0].segments.length > 1

        resultHeaderStr = getStartEndCode(startPoint, endPoint, res.dictionary) + ", " + startDateTime + endDateTimeStr + ", " + personsCount

        return resultHeaderStr

    return getOrderInfoHeaderText