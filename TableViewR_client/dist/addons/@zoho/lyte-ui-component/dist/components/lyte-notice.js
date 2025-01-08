Lyte.Component.register("lyte-notice", {
_template:"<template tag-name=\"lyte-notice\"> <div class=\"lyteNotice lyte{{lyteUiCapitalizeName(ltPropNoticeType)}}Notice\"> <p class=\"lyteNoticeContent\"> <lyte-yield yield-name=\"notice\"></lyte-yield> </p> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"insertYield","position":[1,1,1]}],
_observedAttributes :["ltPropNoticeType"],

	data : function(){
		return {
			'ltPropNoticeType' : Lyte.attr('string')
		}		
	},
	actions : {
		// Functions for event handling
	},
	methods : {
		// Functions which can be used as callback in the component.
	}
});
