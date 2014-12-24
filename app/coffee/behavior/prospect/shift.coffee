define [
    "jquery"
    "core/util/navigation/navigateToPrevious"
], ($, navigateToPrevious) ->

    wrapperClass = '.layoutContent__slotWrapper'
    slotSideCenterClass  = '.layoutContent__slot_side_center'
    controlShowLeftClass = '.layoutContent__show_left'
    controlShowRightClass= '.layoutContent__show_right'
    showSlotPartClass = 'layoutContent__slotWrapper_show_'

    shiftRight = () ->
        $(wrapperClass).addClass("layoutContent__slotWrapper_show_right")

    shiftLeft = () ->
        $(wrapperClass).addClass("layoutContent__slotWrapper_show_left")

    shiftCenter = () ->
        $(wrapperClass).removeClass("layoutContent__slotWrapper_show_left layoutContent__slotWrapper_show_right")

    return {
        shiftRight: shiftRight
        shiftLeft: shiftLeft
        shiftCenter: shiftCenter
    }