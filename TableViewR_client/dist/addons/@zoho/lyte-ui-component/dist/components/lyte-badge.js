/**
 * Renders a notification badge
 * @component lyte-badge
 * @version 2.2.0
 */

 Lyte.Component.register("lyte-badge", {
_template:"<template tag-name=\"lyte-badge\"> <div class=\"lyteBadge\" lt-prop-title=\"{{tooltipData}}\"> <span class=\"lyteBadgeContent\">{{ltPropData}} <lyte-yield yield-name=\"lyteBadgeYield\"></lyte-yield> </span> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"insertYield","position":[1,1,2]}],
_observedAttributes :["ltPropBadgeStyle","ltPropPosition","ltPropData","tooltipData","ltPropShowTooltip","ltPropMaxLength","ltPropCountStr"],

	data : function(){
		return {
			/**
			 * @componentProperty {object} ltPropBadgeStyle
			 */

			'ltPropBadgeStyle' : Lyte.attr('object' , { default : {}
			}),

			/**
			 * @componentProperty {topRight|topLeft|bottomRight|bottomLeft} ltPropPosition
			 * @default topRight
			 */

			'ltPropPosition' : Lyte.attr('string' , {
				default : 'topRight'
			}),

			/**
			 * @componentProperty {string} ltPropData
			 */

			'ltPropData' : Lyte.attr('string' , {
				default : ''
			}),
			'tooltipData' : Lyte.attr('string',  {
				default : ''
			}),
			'ltPropShowTooltip' : Lyte.attr('boolean' , {
				default : false
			}),
			/**
			 * @componentProperty {number} ltPropMaxLength
			 * @default 0
			 */

			'ltPropMaxLength' : Lyte.attr('number' , {
				default : 0
			}),
			'ltPropCountStr' : Lyte.attr('number')
		}
	},
	didConnect : function(){

		var maxCount = this.getData('ltPropMaxLength');
		

		if(maxCount !== 0){

			var countStr = ''

			for(var i=0 ; i<maxCount ;i++){

				countStr += '9';

			}

			countStr = parseInt(countStr);
			this.setData('ltPropCountStr',countStr);
			this.setDataValue();
		}


		if(window.getComputedStyle(this.$node.parentElement).position === "static"){
			this.$node.parentElement.style.position = 'relative';
		}
		var styleObject = this.getData('ltPropBadgeStyle');
		var lyteBadgeDiv = this.$node.querySelector('.lyteBadge');
		var newStyle = '';
		for(css in styleObject){
			newStyle += css + ":" + styleObject[css] + ';';
		}
		lyteBadgeDiv.setAttribute('style' , newStyle);
		if(this.getData('ltPropData') === ''){
			lyteBadgeDiv.classList.add('lyteBadgeWidHeiWD');
		} else {
			lyteBadgeDiv.classList.add('lyteBadgeWidHeiD');
		}

		var positionData = this.getData('ltPropPosition');
		positionData = 'lyteBadge' + positionData.charAt(0).toUpperCase() + positionData.slice(1);
		lyteBadgeDiv.classList.add(positionData);
	},
	onDataValueChange : function(){
        this.setDataValue();
    }.observes('ltPropData'),
    setDataValue : function(){
        var countStr = this.getData('ltPropCountStr');
        var userData = parseInt(this.getData('ltPropData'))
        if(countStr < userData){
			if(this.getData('ltPropShowTooltip')){
				this.setData('tooltipData' , this.getData('ltPropData'))	
			}
            this.setData('ltPropData' , countStr + '+')
        }
    } 
});


/**
 * @syntax yielded
 * <lyte-badge>
 *    <template is="registerYield" yield-name='lyteBadgeYield'>
 *        *
 *    </template>
 * </lyte-badge>
 */
