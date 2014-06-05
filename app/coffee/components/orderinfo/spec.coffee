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
            css:
                module: "css!components/orderinfo/style.css"
        insert:
            at: {$ref: 'slot'}