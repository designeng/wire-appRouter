define [
    # all behavior objects
    'behavior/prospect/shift'
], (shift) ->
    index = {
        # shift group
        shiftLeft           : shift.shiftLeft
        shiftCenter         : shift.shiftCenter
        shiftRight          : shift.shiftRight

        sendMessage         : (str) ->
            console.debug "MESSAGE:::"

        doSmth				: () ->
        	console.debug "DO SOMETHING"
    }

    return index