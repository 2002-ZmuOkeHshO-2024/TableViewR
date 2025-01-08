Lyte.Component.register("lyte-skip-to", {
_template:"<template tag-name=\"lyte-skip-to\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"> <div class=\"lyteSkipToClass\" tabindex=\"0\" dom-index=\"{{index}}\">{{item.message}}</div> </template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}],
_observedAttributes :["ltPropData"],

	data: function () {
		return {
			ltPropData: Lyte.attr('array', { default: [{}] })
		}
	},
	init: function () {
		var _this = this;
		document.addEventListener("keydown", (event) => {
			if (event.key == "Enter") {
				if (document.activeElement) {
					var currentIndex = parseInt($L(document.activeElement).attr('dom-index'))
					if (currentIndex >= 0) {
						var currentObj = _this.getData('ltPropData')[currentIndex]
						if (currentObj.target) {
							$L(currentObj.target)[0].focus();
						}
						else if (currentObj.container) {
							let initializeFocusEle = _lyteUiUtils.getFirstFocusableElem(currentObj.container);

							if (initializeFocusEle) {
								initializeFocusEle.focus();
							}

						}
					}
				}
			}
		});
	},
	actions: {
		// Functions for event handling
	},
	methods: {
		// Functions which can be used as callback in the component.
	}
});
