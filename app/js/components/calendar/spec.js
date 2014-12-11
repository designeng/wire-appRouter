define(function() {
  return {
    $plugins: ['wire/debug', 'wire/on', 'wire/dom', 'wire/dom/render'],
    calendarView: {
      render: {
        template: {
          module: "text!components/calendar/template.html"
        }
      },
      insert: {
        at: {
          $ref: 'slot'
        }
      }
    },
    calendarTitle: {
      wire: {
        spec: "components/calendar/title/spec",
        provide: {
          slot: {
            $ref: "dom.first!#title"
          }
        }
      }
    }
  };
});
