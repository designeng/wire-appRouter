define ->

	$plugins: [
        'wire/debug'
        'wire/on'
        'wire/dom'
        'wire/dom/render'
    ]

    orderinfoView:
        render:
            template:
                module: "text!components/orderinfo/template.html"
        insert:
            at: {$ref: 'slot'}