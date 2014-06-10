define [
    "cola/adapter/Array"
], (ArrayAdapter) ->

        # @param {Array} persons
        # @param {Object} categoryPrices
        populatePersons = (persons, categoryPrices) ->
            # index in persons array
            i = 0

            while persons[i]
                # stuff with full name
                persons[i].fullName = persons[i].lastName + " " + persons[i].firstName
                # stuff with index (person index will be shown in header)
                persons[i].index = i + 1
                persons[i].aviacost = categoryPrices.fare
                
                i++       

            source = new ArrayAdapter(persons)
            @personsCollection.addSource source