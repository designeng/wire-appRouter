define(["cola/adapter/Array"], function(ArrayAdapter) {
  var populatePersons;
  return populatePersons = function(persons, categoryPrices) {
    var i, source;
    i = 0;
    while (persons[i]) {
      persons[i].fullName = persons[i].lastName + " " + persons[i].firstName;
      persons[i].index = i + 1;
      persons[i].aviacost = categoryPrices.fare;
      i++;
    }
    source = new ArrayAdapter(persons);
    return this.personsCollection.addSource(source);
  };
});
