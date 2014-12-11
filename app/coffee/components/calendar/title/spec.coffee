define ->

    $plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
    ]


    titleView:
        render:
            template:
                module: "text!components/calendar/title/template.html"
        insert:
            at: {$ref: 'slot'}
