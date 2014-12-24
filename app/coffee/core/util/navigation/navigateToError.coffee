define [
], () -> 

    navigateToError = (type, text)->
        console.error text.stack
