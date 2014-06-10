define(["moment", "underscore"], function(moment, _) {
  var getOrderInfoHeaderText, getPersonsCount, getPointCode, getStartEndCode;
  getPointCode = function(point, dictionary) {
    var codeIata, codeObject, codeSirena;
    dictionary = dictionary[point.type];
    codeObject = _.where(dictionary, {
      id: point.id
    })[0];
    if (codeIata = codeObject.codeIata) {
      return codeIata;
    }
    if (codeSirena = codeObject.codeSirena) {
      return codeSirena;
    }
  };
  getStartEndCode = function(startPoint, endPoint, dictionary) {
    return getPointCode(startPoint, dictionary) + ">>" + getPointCode(endPoint, dictionary);
  };
  getPersonsCount = function(persons) {
    var accordance, length;
    length = persons.length;
    accordance = ["", "а", "а", "а", "ов", "ов"];
    return length + " пассажир" + accordance[length - 1];
  };
  getOrderInfoHeaderText = function(res) {
    var airTrips, endDateTime, endDateTimeStr, endPoint, persons, personsCount, resultHeaderStr, startDateTime, startPoint;
    airTrips = res.data.pack.airTrips;
    persons = res.data.pack.persons;
    personsCount = getPersonsCount(persons);
    startDateTime = airTrips[0].segments[0].startDateTime;
    endDateTime = airTrips[0].segments[0].endDateTime;
    startPoint = airTrips[0].segments[0].startPoint;
    endPoint = airTrips[0].segments[0].endPoint;
    startDateTime = moment(startDateTime).format("DD/MM/YYYY");
    endDateTime = moment(endDateTime).format("DD/MM/YYYY");
    endDateTimeStr = "";
    if (res.data.pack.airTrips[0].segments.length > 1) {
      endDateTimeStr = " - " + endDateTime;
    }
    resultHeaderStr = getStartEndCode(startPoint, endPoint, res.dictionary) + ", " + startDateTime + endDateTimeStr + ", " + personsCount;
    return resultHeaderStr;
  };
  return getOrderInfoHeaderText;
});
