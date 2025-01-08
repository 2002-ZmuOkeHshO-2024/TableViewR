/**
 * Renders a keyboard-navigator
 * @component lyte-keyboard-navigator
 * @version 3.0.0
 * @utility click, focus, blur
 * @dependencies lyte-shortcut
 * /plugins/lyte-keyboardNavigator.js
 */ 
Lyte.Component.register("lyte-keyboard-navigator", {
_template:"<template tag-name=\"lyte-keyboard-navigator\"> <lyte-yield yield-name=\"keyboard-navigator-content\"></lyte-yield> </template>",
_dynamicNodes : [{"type":"insertYield","position":[1]}],
_observedAttributes :["ltPropParent","ltPropHighlighted","ltPropSelected","ltPropChildren","ltPropSkipElements","ltPropIfCycle","ltPropOptions","ltPropOrientation","ltPropScope","ltPropChangeScope","ltPropTriggerClick","customDropdownSel","customDropdownClass","dropdown","ltPropAriaExpand","ltPropIgnoreMouseMove","parentObj"],

	data : function(){
		return {
			/**
             * @componentProperty {string} ltPropParent
             * @version 3.0.0
             * @default undefined
             */
			"ltPropParent": Lyte.attr("string", { "default": undefined }),
			/**
             * @componentProperty {string} ltPropHighlighted
             * @version 3.0.0
			 * @default undefined
             */
			"ltPropHighlighted": Lyte.attr("string", { "default": undefined }),
			/**
             * @componentProperty {string} ltPropSelected
             * @version 3.0.0
             * @default undefined
             */
			"ltPropSelected": Lyte.attr("string", { "default": undefined }),
			/**
             * @componentProperty {string} ltPropChildren
             * @version 3.0.0
			 * @default undefined
             */
			"ltPropChildren": Lyte.attr("string", { "default": undefined }),
			/**
             * @componentProperty {string} ltPropSkipElements
             * @version 3.0.0
             * @default undefined
             */
			"ltPropSkipElements": Lyte.attr("string", { "default": undefined }),
			/**
             * @componentProperty {boolean} ltPropIfCycle
             * @version 3.0.0
             * @default false
             */
			"ltPropIfCycle": Lyte.attr("boolean", { "default": false }),
			/**
             * @componentProperty {array} ltPropOptions
             * @version 3.0.0
			 * @default []
             */
			"ltPropOptions": Lyte.attr("array", {"default": undefined}),
			/**
             * @componentProperty {string} ltPropOrientation
             * @version 3.0.0
			 * @default vertical
             */
			"ltPropOrientation": Lyte.attr("string", { "default": "vertical" }),
			/**
             * @componentProperty {string} ltPropScope
             * @version 3.0.0
			 * @default undefined
             */
			"ltPropScope": Lyte.attr("string", { "default": undefined }),
			/**
             * @componentProperty {boolean} ltPropTriggerClick
             * @version 3.0.0
			 * @default false
             */

			"ltPropChangeScope": Lyte.attr("boolean", { "default": false }),
			/**
             * @componentProperty {boolean} ltPropTriggerClick
             * @version 3.0.0
			 * @default false
             */

			"ltPropTriggerClick": Lyte.attr("boolean", { "default": false }),
			/**
			 * @componentProperty {string} customDropdownSel
			 * @version 3.0.0
			 * @default ""
			 */
			"customDropdownSel": Lyte.attr("string", { "default": "" }),
			/**
			 * @componentProperty {string} customDropdownClass
			 * @version 3.0.0
			 * @default ""
			 */
			"customDropdownClass": Lyte.attr("string", { "default": "" }),
			/**
			 * @componentProperty {string} dropdown
			 * @version 3.0.0
			 * @default ""
			 */
			"dropdown":  Lyte.attr("string", { "default": "" }),
			/**
			 * @componentProperty {string} ltPropAriaExpand
			 * @version 3.0.0
			 * @default ""
			 */
			"ltPropAriaExpand":  Lyte.attr("string", { "default": undefined }),

			"ltPropIgnoreMouseMove":  Lyte.attr("boolean", { "default": false }),

			"parentObj": Lyte.attr("object")
		}		
	},
	didConnect: function () {
		var parent = this.getData('ltPropParent');

		this.setData('parentObj',$L(parent));

		if(document.activeElement != parent){
			$L(parent).focus();
		}

		$L(parent).keyboardNavigator({
			comp: this,
			focusableElement: this.getData('ltPropParent'),
			highlightValue: this.getData('ltPropHighlighted'),
			child: this.getData('ltPropChildren'),
			selectedClass: this.getData('ltPropSelected'),
			skipElements: this.getData('ltPropSkipElements'),
			ifCycle: this.getData('ltPropIfCycle'),
			options: this.getData('ltPropOptions'),
			orientation: this.getData('ltPropOrientation') ,
			scope: this.getData('ltPropScope'),
			triggerClick: this.getData('ltPropTriggerClick'),
			customDropdownSel: this.getData('customDropdownSel'),
			customDropdownClass: this.getData('customDropdownClass'),
			dropdown : this.getData('dropdown'),
			onBeforeHighlight: this.getMethods('onBeforeHighlight'),
			onAfterHighlight: this.getMethods('onAfterHighlight'),
			changeScope: this.getData('ltPropChangeScope'),
			ariaExpand: this.getData('ltPropAriaExpand'),
			ignoreMouseMove: this.getData('ltPropIgnoreMouseMove')
			}
		);
	},
	didDestroy: function () {
		var parent = this.getData('parentObj');
		$L(parent).keyboardNavigator('destroy');

		this.setData('parentObj',null);
	},
	actions : {
	},
	methods: {
	}
});
