define(["underscore", "core/util/config/getLocalizedName"], function(_, getLocalizedName) {
  var PackResponse, getAggregatedState, getTotalPrice;
  getAggregatedState = function(id, list) {
    var aggregatedState, name, state;
    name = getLocalizedName();
    state = _.where(list, {
      id: id
    });
    aggregatedState = state[0][name];
    return aggregatedState;
  };
  getTotalPrice = function(res) {
    return res.data.pack.airTrips[0].price.total;
  };
  return PackResponse = (function() {
    function PackResponse(res) {
      return {
        orderNumber: res.data.pack.cpid,
        orderPrice: res.data.pack.airTrips[0].price.total,
        customer: res.data.pack.notification.email + "/" + res.data.pack.notification.phone,
        bookingCode: res.data.pack.airTrips[0].pnr,
        status: getAggregatedState(res.data.pack.state.id, res.dictionary.aggregatedState),
        airFare: getTotalPrice(res) + ' р',
        persons: res.data.pack.persons,
        categoryPrices: res.data.pack.airTrips[0].price.categoryPrices,
        dictionary: res.dictionary
      };
    }

    return PackResponse;

  })();
});
