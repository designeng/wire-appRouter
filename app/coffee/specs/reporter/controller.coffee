define [
	"jquery"
], ($) ->
	class ReporterController

		sendViewReport: ->
			html = $(@specMainView).html()
			@registerTemplateContent(html)