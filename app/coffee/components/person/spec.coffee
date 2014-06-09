define ->
    $plugins: [
        'wire/debug'
        'wire/dom'
        'wire/dom/render'
    ]

    specMainView:
        render:
            template:
                module: "text!components/person/template.html"
            css:
                module: "css!components/person/style.css"
        insert:
            at: {$ref: 'slot'}