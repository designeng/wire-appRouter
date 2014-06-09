define(function() {
  return {
    $plugins: ['wire/debug', 'wire/dom', 'wire/dom/render'],
    specMainView: {
      render: {
        template: {
          module: "text!components/flight/template.html"
        },
        css: {
          module: "css!components/flight/style.css"
        }
      },
      insert: {
        at: {
          $ref: 'slot'
        }
      }
    }
  };
});
