define [
	"jquery"
	"cola/adapter/Array"
], ($, ArrayAdapter) ->

	class RegisterTemplateController

		onReady: ->
			templates = []
			templates.push {id: 0, slotId:"one", html: "test"}
			source = new ArrayAdapter(templates)
			@prospectViewTemplatesCollection.addSource source

		registerTemplateContent: (slot, html) ->

			# $slot as id 
			slotId = $(slot).attr("id")
			# @prospectViewTemplatesCollection.add {id: 123, slot: slot, html: html}
			@prospectViewTemplatesCollection.add {id: 123, slotId: slotId, html: html}

			# console.log "@prospectViewTemplatesCollection::::", @prospectViewTemplatesCollection.adapters[0].origSource._data
			console.log "@prospectViewTemplatesCollection::::", @prospectViewTemplatesCollection.adapters