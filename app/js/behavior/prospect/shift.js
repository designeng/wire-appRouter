define(["jquery", "core/util/navigation/navigateToPrevious"], function($, navigateToPrevious) {
  var controlShowLeftClass, controlShowRightClass, shiftCenter, shiftLeft, shiftRight, showSlotPartClass, slotSideCenterClass, wrapperClass;
  wrapperClass = '.layoutContent__slotWrapper';
  slotSideCenterClass = '.layoutContent__slot_side_center';
  controlShowLeftClass = '.layoutContent__show_left';
  controlShowRightClass = '.layoutContent__show_right';
  showSlotPartClass = 'layoutContent__slotWrapper_show_';
  shiftRight = function() {
    return $(wrapperClass).addClass("layoutContent__slotWrapper_show_right");
  };
  shiftLeft = function() {
    return $(wrapperClass).addClass("layoutContent__slotWrapper_show_left");
  };
  shiftCenter = function() {
    return $(wrapperClass).removeClass("layoutContent__slotWrapper_show_left layoutContent__slotWrapper_show_right");
  };
  return {
    shiftRight: shiftRight,
    shiftLeft: shiftLeft,
    shiftCenter: shiftCenter
  };
});
