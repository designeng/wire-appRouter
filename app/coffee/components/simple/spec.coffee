define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
    ]

    simpleView:
        render:
            template:
                module: "text!components/simple/template.html"

        insert:
            at: {$ref: 'slot'}