Lyte.Component.register("lyte-tree-table-child", {
_template:"<template tag-name=\"lyte-tree-table-child\"> <template items=\"{{ltPropData}}\" item=\"item\" index=\"index\" is=\"for\"> <lyte-yield yield-name=\"treeTableRow\" index-var=\"{{lyteTableTreeIndexHelp(indexVar,index)}}\" level=\"{{lyteTableTreeLevel(indexVar,index)}}\" list-value=\"{{item}}\" index=\"{{index}}\"></lyte-yield> <template is=\"if\" value=\"{{expHandlers(item.children,'&amp;&amp;',expHandlers(item.collapsed,'!==',true))}}\"><template case=\"true\"> <lyte-tree-table-child lt-prop-data=\"{{item.children}}\" index-var=\"{{lyteTableTreeIndexHelp(indexVar,index)}}\" level=\"{{lyteTableTreeLevel(indexVar,index)}}\"> <template is=\"registerYield\" yield-name=\"treeTableRow\" from-parent=\"\" list-value=\"{{item}}\" index=\"{{index}}\"></template> </lyte-tree-table-child> </template></template> </template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}],
_observedAttributes :["ltPropData","hideTemplate","indexVar"],

	data : function(){
		return {
			ltPropData : Lyte.attr('array' , {
				default : []
			}),
			hideTemplate : Lyte.attr('boolean', {
				default : true
			}),
			indexVar: Lyte.attr('string', {
				default: ''
			})
		}		
	},
	actions : {
		// Functions for event handling
	},
	methods : {
		// Functions which can be used as callback in the component.
	}
});



Lyte.Component.registerHelper('lyteTableTreeLevel' , function(parentIndex , index){
	return ((parentIndex +" "+ index).trim()).split(' ').length
})

Lyte.Component.registerHelper('lyteTableTreeIndexHelp' , function(parentIndex , index){
	return ((parentIndex +" "+ index).trim())
})