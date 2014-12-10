define(['behavior/prospect/shift'], function(shift) {
  var index;
  index = {
    shiftLeft: shift.shiftLeft,
    shiftCenter: shift.shiftCenter,
    shiftRight: shift.shiftRight,
    sendMessage: function(str) {
      return console.debug("MESSAGE:::");
    },
    doSmth: function() {
      return console.debug("DO SOMETHING");
    }
  };
  return index;
});
