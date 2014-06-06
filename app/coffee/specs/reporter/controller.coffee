define [
	"jquery"
], ($) ->
	class ReporterController

		sendViewReport: ->
			slot = @slot
			console.log "CURRENT SLOT:::", slot
			html = $(@specMainView).html()
			@templateController.registerTemplateContent(slot, html)