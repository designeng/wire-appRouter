define [
    "cola/adapter/Array"
], (ArrayAdapter) ->

        # TODO: localization?
        populateTaxCollection = (price) ->

            tax = [
                {id: 0, taxName: "Сборы авиакомпаний"   , taxValue: price.airlineTax}
                {id: 1, taxName: "Сборы Агент.Ру"       , taxValue: price.agencyTax}
            ]

            source = new ArrayAdapter(tax)
            @taxCollection.addSource source