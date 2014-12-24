define ->
    groundRoutes = 
        "{plain}"  :   
            spec: "specs/prospect/plain/spec"
            slot: {$ref: "dom.first!#prospect"}
            rules:
                plain: /^autocomplete|^calendar/i
            behavior: {$ref: "behavior!doSmth   "}

        "{complexpart}/{infopart}"  :
            spec: "specs/prospect/complex/spec"
            slot: {$ref: "dom.first!#prospect"}
            rules:
                complexpart: /\border\b/i
                infopart: /\bright\b|\bcenter\b/i

        "{complexpart}/{infopart}/{id}"  :
            spec: "specs/prospect/complex/spec"
            slot: {$ref: "dom.first!#prospect"}
            rules:
                complexpart: /\border\b/i
                infopart:/\binfo\b/i
                id: /[0-9]+/i

        "{complexpart}/{infopart}/{id}/{side}"  :
            spec: "specs/prospect/complex/spec"
            slot: {$ref: "dom.first!#prospect"}
            rules:
                complexpart: /\border\b/i
                infopart:/\binfo\b/i
                id: /[0-9]+/i
                side: /\bflight\b/i