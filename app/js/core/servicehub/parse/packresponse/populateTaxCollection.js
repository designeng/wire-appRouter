define(["cola/adapter/Array"], function(ArrayAdapter) {
  var populateTaxCollection;
  return populateTaxCollection = function(price) {
    var source, tax;
    tax = [
      {
        id: 0,
        taxName: "Сборы авиакомпаний",
        taxValue: price.airlineTax
      }, {
        id: 1,
        taxName: "Сборы Агент.Ру",
        taxValue: price.agencyTax
      }
    ];
    source = new ArrayAdapter(tax);
    return this.taxCollection.addSource(source);
  };
});
