window.addEventListener('click' , function(eve){
	if(_lyteUiUtils.popupStack){
		if(_lyteUiUtils.popupStack.globalStack && _lyteUiUtils.popupStack.betaModalStack &&_lyteUiUtils.popupStack.betaModalStack.length > 0){
			var lastPopup = _lyteUiUtils.popupStack.globalStack[ _lyteUiUtils.popupStack.globalStack.length - 1 ]
			if(_lyteUiUtils.popupStack.globalStack[_lyteUiUtils.popupStack.globalStack.length-1].parentElement === _lyteUiUtils.popupStack.betaModalStack[_lyteUiUtils.popupStack.betaModalStack.length-1].parentElement){
				if(lastPopup.parentElement.tagName === "LYTE-BETA-MODAL" && $L(lastPopup.parentElement).hasClass('lyteModalOpened') && ($L(eve.target).attr('id') !== 'lytedropdownfreezelayer') && (eve.target.tagName !== 'LYTE-DROP-ITEM')){
					if($L(eve.target).closest('.lyteModalElement')[0]){
						return;
					}
					if(!lastPopup.parentElement.getData('ltPropOverlayClose')){
						return
					}
					lastPopup.parentElement.setData('ltPropShow' , false);
				}
			}
		}
	}
})

window.addEventListener('resize' , function(eve){
	if(_lyteUiUtils.popupStack){
		if(_lyteUiUtils.popupStack.globalStack && _lyteUiUtils.popupStack.betaModalStack.length > 0){
			var modalArr = _lyteUiUtils.popupStack.betaModalStack
			for (let i = 0; i < modalArr.length; i++) {
				modalArr[i].parentElement.component.callOnResizeFun();
			}
		}
	}
},true);

Lyte.Component.register("lyte-beta-modal", {
_template:"<template tag-name=\"lyte-beta-modal\"> <template is=\"if\" value=\"{{expHandlers(ltPropBindToBody,'&amp;&amp;',expHandlers(reRenderModal,'!'))}}\"><template case=\"true\"> <lyte-wormhole case=\"true\" class=\"lyteModalVisibilityHidden\" lt-prop-show=\"{{ltPropShowWormhole}}\" lt-prop-focus-on-close=\"{{ltPropFocusOnClose}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"lyteModalWrapper {{ltPropWrapperClass}} lytePopupZI\"> <div class=\"lyteModalElement\"> <template is=\"if\" value=\"{{ltPropShowCloseButton}}\"> <template case=\"true\"><span class=\"lyteModalClose\" onclick=\"{{action('closeModal')}}\" tabindex=\"0\" role=\"button\"></span></template> </template> <lyte-yield class=\"lyteBetaModalYield lyteModalYield\" yield-name=\"modal\"></lyte-yield> </div> <template is=\"if\" value=\"{{showFreeze}}\"><template case=\"true\"> <lyte-modal-freeze class=\"lytePopupFreezeLayer\"></lyte-modal-freeze> </template></template> </div> </template> </lyte-wormhole> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"insertYield","position":[1,1,3]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropShow","ltPropShowWormhole","ltPropFreeze","ltPropShowCloseButton","ltPropCloseOnEscape","ltPropTransition","ltPropOffset","ltPropDimmer","ltPropDraggable","ltPropAllowMultiple","ltPropScrollable","ltPropMaxHeight","ltPropMaxWidth","ltPropWidth","ltPropHeight","ltPropWrapperClass","ltPropBindToBody","ltPropReRenderModal","ltPropOverlayClose","ltPropAria","ltPropAriaAttributes","ltPropPreventFocus","ltPropSetContentHeight","ltPropCloseDuration","ltPropOverlapModal","ltPropIgnoreInlineDirection","ltPropAllowContainment","ltPropFocusOnClose","ltPropResizeModal","ltPropResizerMinWidth","ltPropResizerMaxWidth","ltPropResizerMinHeight","ltPropResizerMaxHeight","showFreeze","initialModalDim","initialMouseDown","initialDragMouseDown","initialComputedModalDim","closeDurationTimeOut","reRenderModal","popoverclosevaluechanged","activeResizer"],


	//Lyte Attrs
	data : function(){
		return {
            /**
             * @componentProperty {boolean} ltPropShow
             * @version 1.0.0
             * @default false
             */
			 "ltPropShow":Lyte.attr("boolean",{"default": false}), //---------------------->  done
			 
			 "ltPropShowWormhole" : Lyte.attr("boolean" , {"default" : false}), //---------------------->  done
			 /**
			  * @componentProperty {boolean} ltPropFreeze
			  * @version 1.0.0
			  * @default true
			  */
			 "ltPropFreeze":Lyte.attr("boolean",{"default": true}), //---------------------->  done
			 /**
			  * @componentProperty {boolean} ltPropShowCloseButton
			  * @version 1.0.0
			  * @default true
			  */
			 "ltPropShowCloseButton":Lyte.attr("boolean",{"default": true}), //---------------------->  done 
			 /**
			  * @componentProperty {boolean} ltPropCloseOnEscape
			  * @version 1.0.0
			  * @default true
			  */
			 "ltPropCloseOnEscape":Lyte.attr("boolean",{"default": true}), //---------------------->  done
			 /**
			  * @typedef {object} transition
			  * @property {slideFromTop|slideFromBottom|slideFromLeft|slideFromRight|fadeIn|zoom} animation
			  * @property {string} duration
			  */
			 /**
			  * @componentProperty {transition} ltPropTransition
			  * @version 1.0.0
			  * @default { "animation" :"slideFromTop" , "duration":"0.5s"}
			  */
			 "ltPropTransition":Lyte.attr("object",{"default":{"animation":"slideFromTop","duration":"0.5"}}), //---------------------->  done
			 /**
			  * @typedef {object} offset
			  * @property {string} top
			  * @property {string} left
			  * @property {string} bottom
			  * @property {string} right
			  */
			 /**
			  * @componentProperty {offset} ltPropOffset
			  * @version 1.0.0
			  * @default { "top" :"center", "left" :"center"}
			  */
			 "ltPropOffset":Lyte.attr("object",{"default":{"top":"center","left":"center"}}), //---------------------->  done
			 /**
			  * @typedef {object} dimmer
			  * @property {colorstring} color
			  * @property {string} opacity
			  */
			 /**
			  * @componentProperty {dimmer} ltPropDimmer
			  * @version 1.0.0
			  */
			 "ltPropDimmer":Lyte.attr("object" , {default : {"color" : "black" , "opacity" : "0.4"}}), //---------------------->  done
			 /**
			  * @componentProperty {boolean} ltPropDraggable
			  * @version 1.0.0
			  * @default false
			  *
			  */
			 "ltPropDraggable":Lyte.attr("boolean",{"default": false}), //---------------------->  done
			 /**
			  * @componentProperty {boolean} ltPropAllowMultiple
			  * @version 1.0.0
			  * @default false
			  *
			  */
			 "ltPropAllowMultiple":Lyte.attr("boolean",{"default": false}), //---------------------->  done
 
			 /**
			  * @componentProperty {boolean} ltPropScrollable
			  * @version 1.0.0
			  * @default false
			  *
			  */
			 "ltPropScrollable":Lyte.attr("boolean",{"default": false}), //---------------------->  done
 
			 /**
			  * @componentProperty {string} ltPropMaxHeight
			  * @version 1.0.0
			  * @suffix px,pt,cm,mm,vh,vm,em
			  */
			 "ltPropMaxHeight":Lyte.attr("string",{"default":""}), //---------------------->  done
 
			 /**
			  * @componentProperty {string} ltPropMaxWidth
			  * @version 1.0.0
			  * @suffix px,pt,cm,mm,vh,vm,em
			  */
			 "ltPropMaxWidth":Lyte.attr("string",{"default":""}), //---------------------->  done
 
			 /**
			  * @componentProperty {string} ltPropWidth 
			  * @version 1.0.0
			  * @suffix px,pt,cm,mm,vh,vm,em
			  */
			 "ltPropWidth":Lyte.attr("string",{"default":""}),   //---------------------->  done
 
			 /**
			  * @componentProperty {string} ltPropHeight
			  * @version 1.0.0
			  * @default auto
			  * @suffix px,pt,cm,mm,vh,vm,em
			  */
			 "ltPropHeight":Lyte.attr("string",{"default":"auto"}),   //---------------------->  done
 
			 /**
			  * @componentProperty {string} ltPropWrapperClass
			  * @version 1.0.0
			  */
			 "ltPropWrapperClass":Lyte.attr("string",{"default":""}),   //---------------------->  done
 
			 /**
			  * @componentProperty {boolean} ltPropBindToBody
			  * @version 1.0.0
			  * @default false
			  *
			  */
			 "ltPropBindToBody":Lyte.attr("boolean",{"default":false}),   //---------------------->  done
 
			 /**
			  * @componentProperty {boolean} ltPropReRenderModal
			  * @version 1.0.0
			  * @default false
			  *
			  */
			 "ltPropReRenderModal":Lyte.attr("boolean",{"default":false}), //---------------------->  done
 
			 /**
			  * @componentProperty {boolean} ltPropOverlayClose
			  * @version 1.0.0
			  * @default false
			  *
			  */
			 "ltPropOverlayClose":Lyte.attr("boolean",{"default":false}), //---------------------->  done
 
			 /**
			  * @componentProperty {boolean} ltPropAria
			  * @version 3.1.0
			  * @default false
			  *
			  */
			 "ltPropAria" : Lyte.attr( 'boolean', { default : false } ),
 
			 /**
			  * @componentProperty {object} ltPropAriaAttributes
			  * @version 3.1.0
			  */
			 "ltPropAriaAttributes" : Lyte.attr( 'object', { default : {} } ),
 
			 /**
			  * @componentProperty {boolean} ltPropPreventFocus
			  * @version 3.3.0
			  * @default false
			  *
			  */
			 "ltPropPreventFocus" : Lyte.attr('boolean', { default : false } ),
 
			 /**
			  * @componentProperty {boolean} ltPropSetContentHeight
			  * @version 3.9.0
			  * @default false
			  *
			  */
			 "ltPropSetContentHeight" : Lyte.attr('boolean', { default : false } ), //---------------------->  done
 
			 /**
			  * @componentProperty {number} ltPropCloseDuration
			  * @version 3.10.0
			  * @default undefined
			  */
			 "ltPropCloseDuration" : Lyte.attr("number",{"default" : undefined}), //---------------------->  done
 
			 /**
			  * @componentProperty {boolean} ltPropOverlapModal
			  * @version 3.19.0
			  * @default true
			  *
			  */
			 "ltPropOverlapModal" : Lyte.attr('boolean', { default : true } ), //---------------------->  done
			 /**
			  * @componentProperty {boolean} ltPropIgnoreInlineDirection
			  * @version 3.19.0
			  * @default true
			  *
			  */
			 "ltPropIgnoreInlineDirection" : Lyte.attr('boolean', { default : false } ), //---------------------->  done
			 /**
			  * @componentProperty {boolean} ltPropAllowContainment
			  * @version 3.68.0
			  * @default false
			  *
			  */
			 "ltPropAllowContainment" : Lyte.attr('boolean' , { default : false }), //---------------------->  done
			 
			 "ltPropFocusOnClose" : Lyte.attr('boolean' , { default : false }), //---------------------->  done

		     "ltPropResizeModal": Lyte.attr('boolean', { default: false }),
			 
			 "ltPropResizerMinWidth": Lyte.attr('number', { default: 30 }),
			 
			 "ltPropResizerMaxWidth": Lyte.attr('number', { default: window.innerWidth }),
			 
			 "ltPropResizerMinHeight": Lyte.attr('number', { default: 30 }),

			 "ltPropResizerMaxHeight": Lyte.attr('number', { default: window.innerHeight }),
			 
			

			 showFreeze : Lyte.attr('boolean' , {
				default : true
			 }),
			 initialModalDim : Lyte.attr('object',{
				default : {
					top : 0,
					left : 0,
					right : 0,
					bottom : 0,
					width : 0,
					height : 0
				}
			 }),
			 initialMouseDown : Lyte.attr('object' , {
				default : {
					clientX : 0,
					clientY : 0
				}
			 }),
			 initialDragMouseDown : Lyte.attr('object' , {
				default : {
					clientX : 0,
					clientY : 0,
					height : 0,
					width : 0
				}
			 }),
			 initialComputedModalDim : Lyte.attr('object' , {
				default : {
					left : 0,
					top : 0
				}
			 }),
			 closeDurationTimeOut : Lyte.attr('number' , {
				default : 0
			 }),
			 reRenderModal : Lyte.attr('boolean' , {
				default:false
			 }),
			 popoverclosevaluechanged : Lyte.attr('boolean' , {
				default : false
			 }),
			activeResizer: Lyte.attr('string', {
				 default: ""
			})
		}		
	},
	init : function(){
		var _this = this;
		if(!_lyteUiUtils.lyteModalKeyDown){
			_lyteUiUtils.lyteModalKeyDown = true
			document.addEventListener('keydown' , function(evt){
				var modalArr = []
				var popstack = []
				if(_lyteUiUtils.popupStack && _lyteUiUtils.popupStack.betaModalStack){
					modalArr = _lyteUiUtils.popupStack.betaModalStack
				}
				if(_lyteUiUtils.popupStack && _lyteUiUtils.popupStack.globalStack){
					popstack = _lyteUiUtils.popupStack.globalStack
				}
				var isEscape = false;
				if ("key" in evt) {
					isEscape = (evt.key == "Escape" || evt.key == "Esc");
					isTabPressed = (evt.key == "Tab");
					isEnter = (evt.key == "Enter");
				} else {
					isEscape = (evt.keyCode == 27);
					isTabPressed = (evt.keyCode == 9);
					isEnter = (evt.keyCode == 13);
				}
				if(isEscape){
					if(modalArr && modalArr.length > 0){
						if(modalArr[modalArr.length - 1].parentElement.getData('ltPropCloseOnEscape')){
							if(popstack[popstack.length-1] === modalArr[modalArr.length-1]){
								modalArr[modalArr.length - 1].parentElement.setData('ltPropShow' , false);
							}
						}
					}
				}
			})
		}
		this.$node.alignModal = function(){
			console.warn('This util has been deprecated')
		}
		this.$node.alignLyteModal = function(){
			console.warn('This util has been deprecated')
		}
		this.$node.resetPosition = function(){
			console.warn('This util has been deprecated')
		}
		this.$node.calculateOffset = function(){
			console.warn('This util has been deprecated')
		}
		this.$node.reflectTransitionChange = function(){
			console.warn('This util has been deprecated')
		}
	},
	methods : {
        beforeWormholeAppend : function(arg){
            if(this.childComp){
                delete this.childComp;
            }
            if(this.actualModalDiv){
                delete this.actualModalDiv;
            }
            this.childComp = arg;
			this.actualModalDiv = this.childComp.querySelector(".lyteModalElement");

			if(this.getData('ltPropDraggable')){
				$L(this.childComp).find('lyte-modal-header')[0].style.cursor="move";
				$L(this.childComp).find('lyte-modal-header')[0].addEventListener('mousedown' , this.mousedownFun)
			}
			if(!this.getData('ltPropFreeze')){
				this.setData('showFreeze' , true)
				this.setData('ltPropDimmer' , {"color":"black","opacity":"0"});
			}

			this.setFreezeDimmer()

        }
    },
	actions : {
		closeModal : function(){
			this.setData('ltPropShow' , false);
		}
	},

	//Component functions
	setMaxWidth: function() {
		if(this.childComp && this.getData('ltPropShow')){
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			var modalInnerElem = modalElem.find('.lyteModalElement');
			modalInnerElem[0].style.maxWidth = this.getData('ltPropMaxWidth');
		}
	},
	setMaxHeight: function() {
		if(this.childComp && this.getData('ltPropShow')){
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			var modalInnerElem = modalElem.find('.lyteModalElement');
			modalInnerElem[0].style.maxHeight = this.getData('ltPropMaxHeight');
		}
	},
	setModalHeight: function() {
		if(this.childComp && this.getData('ltPropShow')){
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			var modalInnerElem = modalElem.find('.lyteModalElement');
			modalInnerElem[0].style.height = this.getData('ltPropHeight');
		}
	},
	setModalWidth: function() {
		if(this.childComp && this.getData('ltPropShow')){
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			var modalInnerElem = modalElem.find('.lyteModalElement');
			modalInnerElem[0].style.width = this.getData('ltPropWidth');
		}	
	},
	setAlignment: function(thisObj) {
		var offsetObject = thisObj.getData('ltPropOffset');
		var modalElem = $L(thisObj.childComp).find('.lyteModalWrapper');
		var animationType = thisObj.getData('ltPropTransition').animation;
		switch(animationType){
			case "fadeIn":
			case "zoom":
				if(animationType === 'fadeIn') {
					modalElem.addClass('lyteModalFadeAnimation');
				}
				else if(animationType === 'zoom') {
					modalElem.addClass('lyteModalZoomAnimation');
				}
				if(offsetObject.left) {
					if(offsetObject.left == 'center') {
						modalElem.addClass('lyteModalHorizontalCenterAlign');
					}
					else {
						modalElem.addClass('lyteModalLeftAlign');
					}
				}
				else if(offsetObject.right) {
					if(offsetObject.right == 'center') {
						modalElem.addClass('lyteModalHorizontalCenterAlign');
					}
					else {
						modalElem.addClass('lyteModalRightAlign');
					}
				}
				if(offsetObject.top) {
					if(offsetObject.top == "center") {
						modalElem.addClass('lyteModalVerticalMiddleAlign');
					}
					else {
						modalElem.addClass('lyteModalTopAlign');
					}
				}
				else if(offsetObject.bottom) {
					if(offsetObject.bottom == "center") {
						modalElem.addClass('lyteModalVerticalMiddleAlign');
					}
					else {
						modalElem.addClass('lyteModalBottomAlign');
					}
				}
			break;
			case "slideFromTop":
			case "slideFromBottom":
				if(animationType == 'slideFromTop') {
					modalElem.addClass('lyteModalTopAlign lyteModalSlideFromTop');
				}
				else if(animationType == 'slideFromBottom') {
					modalElem.addClass('lyteModalBottomAlign lyteModalSlideFromBottom');
				}
				if(offsetObject.left) {
					if(offsetObject.left == "center") {
						modalElem.addClass('lyteModalHorizontalCenterAlign');
					}
					else {
						modalElem.addClass('lyteModalLeftAlign');
					}
				}
				else if(offsetObject.right) {
					if(offsetObject.right == "center") {
						modalElem.addClass('lyteModalHorizontalCenterAlign');
					}
					else {
						modalElem.addClass('lyteModalRightAlign');
					}
				}
				if(offsetObject.top == 'center' || offsetObject.bottom == 'center') {
					modalElem.addClass('lyteModalVerticalMiddleAlign');
				}
			break; 
			case "slideFromLeft":
			case "slideFromRight":
				if(animationType == 'slideFromLeft') {
					modalElem.addClass('lyteModalLeftAlign lyteModalSlideFromLeft');
				}
				else if(animationType == 'slideFromRight') {
					modalElem.addClass('lyteModalRightAlign lyteModalSlideFromRight');
				}
				if(offsetObject.top) {
					if(offsetObject.top == "center") {
						modalElem.addClass('lyteModalVerticalMiddleAlign');
					}
					else {
						modalElem.addClass('lyteModalTopAlign');
					}
				}
				if(offsetObject.bottom) {
					if(offsetObject.bottom == "center") {
						modalElem.addClass('lyteModalVerticalMiddleAlign');
					}
					else {
						modalElem.addClass('lyteModalBottomAlign');
					}
				}
				if(offsetObject.left == 'center' || offsetObject.right == 'center') {
					modalElem.addClass('lyteModalHorizontalCenterAlign');
				}
			break;
		}
	},
	setOffsetForFadeAndZoomAnim: function(thisObj) {
		var offsetObject = thisObj.getData('ltPropOffset');
		var modalElem = $L(thisObj.childComp).find('.lyteModalWrapper');
		var modalInnerElem = modalElem.find('.lyteModalElement');
		if(offsetObject.left) {
			if(offsetObject.left != 'center') {
				modalInnerElem[0].style.left = offsetObject.left;
			}
		}
		else if(offsetObject.right) {
			if(offsetObject.right != 'center') {
				modalInnerElem[0].style.right = offsetObject.right;
			}
		}
		if(offsetObject.top) {
			if(offsetObject.top != "center") {
				modalInnerElem[0].style.top = offsetObject.top;
			}
		}
		else if(offsetObject.bottom) {
			if(offsetObject.bottom != "center") {
				modalInnerElem[0].style.bottom = offsetObject.bottom;
			}
		}
	},
	setOffsetForSlideAnimation: function(thisObj) {
		var offsetObject = thisObj.getData('ltPropOffset');
		var modalElem = $L(thisObj.childComp).find('.lyteModalWrapper');
		var modalInnerElem = modalElem.find('.lyteModalElement');
		var animationType = thisObj.getData('ltPropTransition').animation;
		if(offsetObject.left) {
			if(animationType == 'slideFromRight') {
				// left position provided for slide from right animation.
				var leftValue = offsetObject.left;
				var windowWidth = window.innerWidth;
				if( leftValue.indexOf('%') > -1 ) {
					leftValue = parseInt(leftValue);
					leftValue = (leftValue / 100) * windowWidth;
				}
				else if( leftValue.indexOf('px') > -1 ) {
					leftValue = parseInt(leftValue);
				}
				modalInnerElem[0].style.right = (windowWidth - (leftValue + modalInnerElem[0].offsetWidth)) + 'px';
			}
			else {
				modalInnerElem[0].style.left = offsetObject.left;
			}
		}
		else if(offsetObject.right) {
			if(animationType == 'slideFromLeft') {
				// Right position provided for slide from left animation.
				var rightValue = offsetObject.right;
				var windowWidth = window.innerWidth;
				if( rightValue.indexOf('%') > -1 ) {
					rightValue = parseInt(rightValue);
					rightValue = (rightValue / 100) * windowWidth;
				}
				else if(rightValue.indexOf('px') > -1) {
					rightValue = parseInt(rightValue);
				}
				modalInnerElem[0].style.left = (window.innerWidth - (rightValue + modalInnerElem[0].offsetWidth)) + 'px';
			}
			else {
				modalInnerElem[0].style.right = offsetObject.right;
			}
		}
		if(offsetObject.top) {
			if(animationType == 'slideFromBottom') {
				// top position provided for slide from bottom animation.
				var topValue = offsetObject.top;
				var windowHeight = window.innerHeight;
				if(topValue.indexOf('%') > -1) {
					topValue = parseInt(topValue);
					topValue = (topValue / 100) * windowHeight;
				}
				else if(topValue.indexOf('px') > -1) {
					topValue = parseInt(topValue);
				}
				modalInnerElem[0].style.bottom = (windowHeight - (topValue + modalInnerElem[0].offsetHeight)) + 'px';
			}
			else {
				modalInnerElem[0].style.top = offsetObject.top;
			}
		}
		else if(offsetObject.bottom) {
			if(animationType == 'slideFromTop') {
				// bottom position provided for slide from top animation.
				var bottomValue = offsetObject.bottom;
				var windowHeight = window.innerHeight;
				if(bottomValue.indexOf('%') > -1) {
					bottomValue = parseInt(bottomValue);
					bottomValue = (bottomValue / 100) * windowHeight;
				}
				else if(bottomValue.indexOf('px') > -1) {
					bottomValue = parseInt(bottomValue);
				}
				modalInnerElem[0].style.top = (windowHeight - (bottomValue + modalInnerElem[0].offsetHeight)) + 'px';
			}
			else {
				modalInnerElem[0].style.bottom = offsetObject.bottom;
			}
		}
	},	
	setDimension : function(){
		var dim = this.actualModalDiv.getBoundingClientRect();
		Lyte.objectUtils(this.getData('initialModalDim') , 'add' , 'top' , dim.top)
		Lyte.objectUtils(this.getData('initialModalDim') , 'add' , 'left' , dim.left)
		Lyte.objectUtils(this.getData('initialModalDim') , 'add' , 'right' , dim.right)
		Lyte.objectUtils(this.getData('initialModalDim') , 'add' , 'bottom' , dim.bottom)
		Lyte.objectUtils(this.getData('initialModalDim') , 'add' , 'width' , dim.width)
		Lyte.objectUtils(this.getData('initialModalDim') , 'add' , 'height' , dim.height)
	},
	setCloseDuration : function(){
		if(this.childComp && this.getData('ltPropShow')){
			if(this.getData('ltPropCloseDuration') !== undefined){
				$L(this.childComp).find('.lyteModalWrapper')[0].style.setProperty('--lyte-modal-transition-duration' , (parseInt(this.getData('ltPropCloseDuration'))/1000+'s'))
				this.setData('closeDurationTimeOut' , this.getData('ltPropCloseDuration'))
			}
			else {
				this.setData('closeDurationTimeOut' , this.getData('ltPropTransition').duration * 1000)
			}
		}
	},
	setFreezeDimmer : function(){
		if(this.childComp && this.getData('ltPropShow')){
			var freeze = $L(this.childComp).find('lyte-modal-freeze');
			if(freeze[0]){
				freeze[0].style.background = this.getData('ltPropDimmer').color
				freeze[0].style.opacity = this.getData('ltPropDimmer').opacity
			}
		}
	},
	setClickForFreeze : function(){
		if(this.childComp && this.getData('ltPropShow')){
			var freeze = $L(this.childComp).find('.lytePopupFreezeLayer')
			if(freeze[0]){
				if(this.getData('ltPropOverlayClose')){
					if(!_lyteUiUtils.modalBodyClick){
						freeze[0].addEventListener('click' , this.closeOnBodyClick)
						_lyteUiUtils.modalBodyClick = true	
					}
				} else {
					freeze[0].removeEventListener('click' , this.closeOnBodyClick)
					_lyteUiUtils.modalBodyClick = false	
				}
			}
		}
	},
	placeModalInCenter: function(modalElem) {
		var animationType = this.getData('ltPropTransition').animation;

		switch (animationType) {
			case 'fadeIn':
				modalElem.addClass('lyteModalFadeAnimation');
				break;
			case 'slideFromLeft': 
				modalElem.addClass('lyteModalSlideFromLeft');
				break;
			case 'slideFromRight':
				modalElem.addClass('lyteModalSlideFromRight');
				break;
			case 'slideFromTop':
				modalElem.addClass('lyteModalSlideFromTop');
				break;
			case 'slideFromBottom':
				modalElem.addClass('lyteModalSlideFromBottom');
				break;
		}
		modalElem.addClass('lyteModalCenterAlign lyteModalShow');
		setTimeout(function() {
			modalElem.addClass('lyteModalShowTransition');
		}, 10);
	},
	closeModal : function(event){
		var result = true;
		if(this.getMethods("onBeforeClose")){
            result = this.executeMethod("onBeforeClose", event ,this);
        }
		if(result !== false){
			if(_lyteUiUtils.popupStack){
				var popStack = _lyteUiUtils.popupStack.globalStack

				if(this.getData('ltPropFreeze') && popStack && popStack.length > 1){
					$L(this.childComp).find('lyte-modal-freeze').addClass('lyteModalFreezeLayerHidden')
					if(popStack && popStack.length > 1){
						for(var i=popStack.length-2 ; i>=0 ;i--){
							var prevFreeze = $L(popStack[i].parentElement.component.childComp).find('.lytePopupFreezeLayer')
							if(prevFreeze[0]){
								prevFreeze.removeClass('lyteModalFreezeLayerHidden')
								i=-1;
							}
						}
					}
				}
				
				this.setData('ltPropShowWormhole' , false)
				var modalElem = $L(this.childComp).find('.lyteModalElement').closest('.lyteModalWrapper');
				var modalInnerElem = modalElem.find('.lyteModalElement');
				var animationType = this.getData('ltPropTransition').animation;
				modalElem.removeClass('lyteModalShowTransition');
				modalElem.addClass('lyteModalCurrentlyClosing');
				var isOriginElementPresent = false
				
				if(animationType != 'fade') {
					if(animationType == 'slideFromLeft') {
						modalInnerElem[0].style.left = '';
					}
					else if(animationType == 'slideFromRight') {
						modalInnerElem[0].style.right = '';
					}
					else if(animationType == 'slideFromTop') {
						modalInnerElem[0].style.top = '';
					}
					else if(animationType == 'slideFromBottom') {
						modalInnerElem[0].style.bottom = '';
					}
				}
				if(animationType === 'zoom') {
					var originElem = $L(this.getData('ltPropTransition').originElement);
					if(originElem.length > 0) {
						isOriginElementPresent = true;
						var modalInnerElemClientRect = modalInnerElem[0].getBoundingClientRect();
						var modalInnerElemXCenter = modalInnerElemClientRect.x + (modalInnerElemClientRect.width / 2);
						var modalInnerElemYCenter = modalInnerElemClientRect.y + (modalInnerElemClientRect.height / 2);
						var originElemClientRect = originElem[0].getBoundingClientRect();
						var originElemXCenter = originElemClientRect.x + (originElemClientRect.width / 2);
						var originElemYCenter = originElemClientRect.y + (originElemClientRect.height / 2);
						originXDistance = modalInnerElemXCenter - originElemXCenter;
						originYDistance = modalInnerElemYCenter - originElemYCenter;
						var translateXval = (-1 * originXDistance) + 'px';
						var translateYval = (-1 * originYDistance) + 'px';
						modalInnerElem[0].style.transform = 'translate(' + translateXval + ',' + translateYval + ') scale(0)';
					}
				}
				
				var _this = this;
				this.closeModalTransition = setTimeout(function() {
					if($L('.lyteModalCurrentlyClosing').closest('lyte-wormhole')[0]){
						if(_lyteUiUtils.popupStack && _lyteUiUtils.popupStack.betaModalStack.length<1){
							$L('body').removeClass('lyteModalBodyWrapper')
						}
						modalElem.removeClass('lyteModalShow');
						modalElem.removeClass('lyteModalFadeAnimation lyteModalSlideFromLeft lyteModalSlideFromRight lyteModalSlideFromTop lyteModalSlideFromBottom lyteModalZoomAnimation');
						modalElem.removeClass('lyteModalLeftAlign lyteModalRightAlign lyteModalTopAlign lyteModalBottomAlign lyteModalCenterAlign lyteModalVerticalMiddleAlign lyteModalHorizontalCenterAlign')
						modalInnerElem[0].style.left = '';
						modalInnerElem[0].style.right = '';
						modalInnerElem[0].style.top = '';
						modalInnerElem[0].style.bottom = '';
						modalInnerElem[0].style.transform = '';
						$L('.lyteModalCurrentlyClosing').closest('lyte-wormhole')[0].style.display="none";
						$L('.lyteModalCurrentlyClosing').closest('lyte-wormhole').addClass('lyteModalHidden')
						$L('.lyteModalCurrentlyClosing').removeClass('lyteModalCurrentlyClosing');
						if(_this.getMethods("onClose")){
							result = _this.executeMethod("onClose",_this);
						}
						_this.addPopoverBodyClick()
						$L(_this.$node).removeClass('lyteModalOpened')
						_lyteUiUtils.dispatchEvent('lyteModalClosed' , _this.actualModalDiv)
						if(_this.getData('ltPropFreeze') && popStack && popStack.length < 2){
							$L(_this.childComp).find('lyte-modal-freeze').addClass('lyteModalFreezeLayerHidden')
							if(popStack && popStack.length > 1){
								for(var i=popStack.length-2 ; i>=0 ;i--){
									var prevFreeze = $L(popStack[i].parentElement.component.childComp).find('.lytePopupFreezeLayer')
									if(prevFreeze[0]){
										prevFreeze.removeClass('lyteModalFreezeLayerHidden')
										i=-1;
									}
								}
							}
						}
					}
				},this.getData('closeDurationTimeOut'));
			}
			
		}

	},
	closeOtherModals : function(){
		if(_lyteUiUtils.popupStack && _lyteUiUtils.popupStack.betaModalStack && _lyteUiUtils.popupStack.betaModalStack.length > 0){
			var prevIndex = _lyteUiUtils.popupStack.betaModalStack.length-1
			if(!_lyteUiUtils.popupStack.betaModalStack[prevIndex].parentElement.getData('ltPropAllowMultiple')){
				_lyteUiUtils.popupStack.betaModalStack[prevIndex].parentElement.setData('ltPropShow' , false);
			}
		}
	},
	closePrevPopup : function(){
		if(_lyteUiUtils.popupStack && _lyteUiUtils.popupStack.globalStack && _lyteUiUtils.popupStack.globalStack.length > 0){
			var prevIndex = _lyteUiUtils.popupStack.globalStack.length-1
			if(!_lyteUiUtils.popupStack.globalStack[prevIndex].parentElement.getData('ltPropAllowMultiple')){
				_lyteUiUtils.popupStack.globalStack[prevIndex].parentElement.setData('ltPropShow' , false);
			}
		}
	},
	closeOnBodyClick : function(eve){
		var modalArr = _lyteUiUtils.popupStack.betaModalStack
		if($L(eve.target)[0].tagName === "LYTE-MODAL-FREEZE" && modalArr.length>0){
			modalArr[modalArr.length-1].parentElement.setData('ltPropShow' , false);
		}
	},
	removePopoverBodyClick : function(){
		var popupstack = _lyteUiUtils.popupStack.globalStack;
		if(popupstack && popupstack[popupstack.length - 2]){
			if(popupstack[popupstack.length - 2].parentElement.tagName === "LYTE-NEW-POPOVER"){
				if(popupstack[popupstack.length - 2].parentElement.component.getData('ltPropCloseOnBodyClick')){
					popupstack[popupstack.length - 2].parentElement.component.setData('ltPropCloseOnBodyClick' , false)
					this.setData('popoverclosevaluechanged' , true);
				}
			}
		}
	},
	addPopoverBodyClick : function(){
		var popupstack = _lyteUiUtils.popupStack.globalStack;
		if(popupstack && popupstack[popupstack.length - 1]){
			if(popupstack[popupstack.length - 1].parentElement.tagName === "LYTE-NEW-POPOVER"){
				if(this.getData('popoverclosevaluechanged')){
					popupstack[popupstack.length - 1].parentElement.component.setData('ltPropCloseOnBodyClick' , true)
					this.setData('popoverclosevaluechanged' , false);
				}
			}
		}
	},
	callOnResizeFun : function(){
		if(this.getMethods('onResize')){
			this.executeMethod('onResize' , this)
		}
	},

	createResizeNodes: function () {

		var nodeWrapper = document.createElement('DIV');
		$L(nodeWrapper).addClass('lyteModalResizeNodeWrapper')

		var topLeftNode = document.createElement('DIV');
		$L(topLeftNode).addClass('lyteModalTopLeftNode lyteModalResizeNode lyteModalCornerResize')
		var topNode = document.createElement('DIV');
		$L(topNode).addClass('lyteModalTopNode lyteModalResizeNode lyteModalEdgeResize')
		var topRightNode = document.createElement('DIV');
		$L(topRightNode).addClass('lyteModalTopRightNode lyteModalResizeNode lyteModalCornerResize')
		var bottomLeftNode = document.createElement('DIV');
		$L(bottomLeftNode).addClass('lyteModalBottomLeftNode lyteModalResizeNode lyteModalCornerResize')
		var bottomNode = document.createElement('DIV');
		$L(bottomNode).addClass('lyteModalBottomNode lyteModalResizeNode lyteModalEdgeResize')
		var bottomRighttNode = document.createElement('DIV');
		$L(bottomRighttNode).addClass('lyteModalBottomRightNode lyteModalResizeNode lyteModalCornerResize')
		var rightNode = document.createElement('DIV');
		$L(rightNode).addClass('lyteModalRightNode lyteModalResizeNode lyteModalEdgeResize')
		var leftNode = document.createElement('DIV');
		$L(leftNode).addClass('lyteModalLeftNode lyteModalResizeNode lyteModalEdgeResize')

		var modalElem = $L(this.actualModalDiv)[0]

		nodeWrapper.appendChild(topLeftNode)
		nodeWrapper.appendChild(topNode)
		nodeWrapper.appendChild(topRightNode)
		nodeWrapper.appendChild(bottomLeftNode)
		nodeWrapper.appendChild(bottomNode)
		nodeWrapper.appendChild(bottomRighttNode)
		nodeWrapper.appendChild(rightNode)
		nodeWrapper.appendChild(leftNode)

		modalElem.appendChild(nodeWrapper)

		modalElem.addEventListener('mousedown' , this.dragMouseDown)

	},

	//Event functions
	dragMouseDown : function(eve){
		if($L(eve.target).hasClass('lyteModalResizeNode')){

			var modalElement = $L(eve.target).closest('.lyteModalElement')[0]
			$L(modalElement).addClass('lyteModalResizeRunning')
			var _this = $L(eve.target).closest('lyte-wormhole')[0].component.parent.component

			var innerModalElementRect = _this.actualModalDiv.getBoundingClientRect();
			var modalWrapperElem = _this.actualModalDiv.parentElement;
			$L(modalWrapperElem).removeClass('lyteModalVerticalMiddleAlign lyteModalHorizontalCenterAlign lyteModalBottomAlign lyteModalRightAlign').addClass('lyteModalTopAlign lyteModalLeftAlign');
			_this.actualModalDiv.style.top = innerModalElementRect.top + 'px';
			_this.actualModalDiv.style.left = innerModalElementRect.left + 'px';
			_this.actualModalDiv.style.bottom = '';
			_this.actualModalDiv.style.right = '';

			_this.actualModalDiv.style.transition = 'none';

			var maxWidth = _this.getData("ltPropResizerMaxWidth"),
				maxHeight = _this.getData("ltPropResizerMaxHeight");
			
			if (maxWidth < innerModalElementRect.width || maxHeight < innerModalElementRect.height) { 
				return
			}

			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'clientX' , eve.clientX)
			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'clientY' , eve.clientY)

			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'height' , modalElement.getBoundingClientRect().height)
			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'width' , modalElement.getBoundingClientRect().width)
			

			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'top' , innerModalElementRect.top)
			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'left' , innerModalElementRect.left)
			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'right' , innerModalElementRect.right)
			Lyte.objectUtils(_this.getData('initialDragMouseDown') , 'add' , 'bottom' , innerModalElementRect.bottom)


			if (eve.target.classList.contains("lyteModalTopLeftNode")) {
				_this.setData("activeResizer", "topLeftNode")
			} else if (eve.target.classList.contains("lyteModalTopNode")) { 
				_this.setData("activeResizer", "topNode")
			} else if (eve.target.classList.contains("lyteModalTopRightNode")) { 
				_this.setData("activeResizer", "topRightNode")
			} else if (eve.target.classList.contains("lyteModalRightNode")) { 
				_this.setData("activeResizer", "rightNode")
			} else if (eve.target.classList.contains("lyteModalBottomRightNode")) { 
				_this.setData("activeResizer", "bottomRightNode")
			} else if (eve.target.classList.contains("lyteModalBottomNode")) { 
				_this.setData("activeResizer", "bottomNode")
			} else if (eve.target.classList.contains("lyteModalBottomLeftNode")) { 
				_this.setData("activeResizer", "bottomLeftNode")
			} else if (eve.target.classList.contains("lyteModalLeftNode")) { 
				_this.setData("activeResizer", "leftNode")
			}

			let resizeStart;
			if (_this.getMethods("onResizeStart")) {
				resizeStart = _this.executeMethod("onResizeStart", _this);
			} 

			if (resizeStart === false) {
				_this.setData({
					initialDragMouseDown: null,
					activeResizer: null
				})
			} else { 
				modalElement.style.overflow = "hidden"
				window.addEventListener('mousemove' , _this.dragMouseMove)
				window.addEventListener('mouseup' , _this.dragMouseUp)	
			}
		}
	},

	dragMouseMove : function(eve){

		var modalElement = $L('.lyteModalResizeRunning')[0]
		var _this = $L(modalElement).closest('lyte-wormhole')[0].component.parent.component

		var activeResizer = _this.getData("activeResizer");
		var minWidth = _this.getData("ltPropResizerMinWidth"),
			maxWidth = 300,
		 	minHeight = _this.getData("ltPropResizerMinHeight"),
			maxHeight = 300
		
		switch (activeResizer) {
			case "topLeftNode": { 
				modalElement.style.height = Math.min(maxHeight, Math.max(_this.getData('initialDragMouseDown').height + (_this.getData('initialDragMouseDown').clientY - eve.clientY), minHeight)) + 'px'
				modalElement.style.width = Math.min(maxWidth, Math.max(_this.getData('initialDragMouseDown').width + (_this.getData('initialDragMouseDown').clientX - eve.clientX), minWidth)) + 'px'
				modalElement.style.top = Math.max(_this.getData('initialDragMouseDown').top - (maxHeight - _this.getData('initialDragMouseDown').height), Math.min(_this.getData('initialDragMouseDown').top - (_this.getData('initialDragMouseDown').clientY - eve.clientY), _this.getData('initialDragMouseDown').bottom - minHeight)) + 'px'
				modalElement.style.left = Math.max( _this.getData('initialDragMouseDown').left - (maxWidth - _this.getData('initialDragMouseDown').width), Math.min(_this.getData('initialDragMouseDown').left - (_this.getData('initialDragMouseDown').clientX - eve.clientX), _this.getData('initialDragMouseDown').right - minWidth)) + 'px'
				break;	
			}
			case "topNode": { 
				modalElement.style.height = Math.min(maxHeight, Math.max(_this.getData('initialDragMouseDown').height + (_this.getData('initialDragMouseDown').clientY - eve.clientY), minHeight)) + 'px'
				modalElement.style.top = Math.max(_this.getData('initialDragMouseDown').top - (maxHeight - _this.getData('initialDragMouseDown').height), Math.min(_this.getData('initialDragMouseDown').top - (_this.getData('initialDragMouseDown').clientY - eve.clientY), _this.getData('initialDragMouseDown').bottom - minHeight)) + 'px'
				break;
			}
			case "topRightNode": { 
				modalElement.style.height = Math.min(maxHeight, Math.max(_this.getData('initialDragMouseDown').height + (_this.getData('initialDragMouseDown').clientY - eve.clientY), minHeight)) + 'px'
				modalElement.style.width = Math.min(maxWidth, Math.max(_this.getData('initialDragMouseDown').width - (_this.getData('initialDragMouseDown').clientX - eve.clientX), minWidth)) + 'px'
				modalElement.style.top = Math.max(_this.getData('initialDragMouseDown').top - (maxHeight - _this.getData('initialDragMouseDown').height), Math.min(_this.getData('initialDragMouseDown').top - (_this.getData('initialDragMouseDown').clientY - eve.clientY), _this.getData('initialDragMouseDown').bottom - minHeight)) + 'px'
				break;
			}
			case "rightNode": { 
				modalElement.style.width = Math.min(maxWidth, Math.max(_this.getData('initialDragMouseDown').width - (_this.getData('initialDragMouseDown').clientX - eve.clientX), minWidth)) + 'px'
				modalElement.style.height = _this.getData('initialDragMouseDown').height + "px"
				break;
			}
			case "bottomRightNode": { 
				modalElement.style.width = Math.min(maxWidth, Math.max(_this.getData('initialDragMouseDown').width - (_this.getData('initialDragMouseDown').clientX - eve.clientX), minWidth)) + 'px'
				modalElement.style.height =  Math.min(maxHeight ,Math.max(_this.getData('initialDragMouseDown').height - (_this.getData('initialDragMouseDown').clientY - eve.clientY), minHeight)) + 'px'
				break;
			}
			case "bottomNode": { 
				modalElement.style.height = Math.min(maxHeight, Math.max(_this.getData('initialDragMouseDown').height - (_this.getData('initialDragMouseDown').clientY - eve.clientY), minHeight)) + 'px'
				break;
			}
			case "bottomLeftNode": { 
				modalElement.style.width = Math.min(maxWidth, Math.max(_this.getData('initialDragMouseDown').width + (_this.getData('initialDragMouseDown').clientX - eve.clientX), minWidth)) + 'px'
				modalElement.style.height =  Math.min(maxHeight,Math.max(_this.getData('initialDragMouseDown').height - (_this.getData('initialDragMouseDown').clientY - eve.clientY), minHeight)) + 'px'
				modalElement.style.left = Math.max( _this.getData('initialDragMouseDown').left - (maxWidth - _this.getData('initialDragMouseDown').width), Math.min(_this.getData('initialDragMouseDown').left - (_this.getData('initialDragMouseDown').clientX - eve.clientX), _this.getData('initialDragMouseDown').right - minWidth)) + 'px'
				break;
			}
			case "leftNode": { 
				modalElement.style.width = Math.min(maxWidth, Math.max(_this.getData('initialDragMouseDown').width + (_this.getData('initialDragMouseDown').clientX - eve.clientX), minWidth)) + 'px'
				modalElement.style.height = _this.getData('initialDragMouseDown').height + "px"
				modalElement.style.left = Math.max( _this.getData('initialDragMouseDown').left - (maxWidth - _this.getData('initialDragMouseDown').width), Math.min(_this.getData('initialDragMouseDown').left - (_this.getData('initialDragMouseDown').clientX - eve.clientX), _this.getData('initialDragMouseDown').right - minWidth)) + 'px'
				break;
			}
		}
		if (_this.getMethods("onResize")) {
			resizeStart = _this.executeMethod("onResize", _this);
		} 
	},

	dragMouseUp : function(eve){

		var modalElement = $L('.lyteModalResizeRunning')[0]
		var _this = $L(modalElement).closest('lyte-wormhole')[0].component.parent.component
		
		modalElement.style.overflow = "auto"
		_this.setData("activeResizer", "");

		if (_this.getMethods("onResizeEnd")) {
			resizeStart = _this.executeMethod("onResizeEnd", _this);
		}
		window.removeEventListener('mousemove' , _this.dragMouseMove);
		window.removeEventListener('mouseup' , _this.dragMouseUp);
	},


	mousedownFun : function(eve){
		console.log('test');
		$L(this).addClass('lyteModalDragRunning')
		var getBcr = $L(this)[0].getBoundingClientRect()
		var _this = $L(this).closest('lyte-wormhole')[0].component.parent.component
		// if((_this.getData('initialMouseDown').clientX === 0) && (_this.getData('initialMouseDown').clientY === 0)){
			Lyte.objectUtils(_this.getData('initialMouseDown') , 'add' , 'clientX' , eve.clientX)
			Lyte.objectUtils(_this.getData('initialMouseDown') , 'add' , 'clientY' , eve.clientY)
		// }

		var innerModalElementRect = _this.actualModalDiv.getBoundingClientRect();
		var modalWrapperElem = _this.actualModalDiv.parentElement;
		$L(modalWrapperElem).removeClass('lyteModalVerticalMiddleAlign lyteModalHorizontalCenterAlign lyteModalBottomAlign lyteModalRightAlign').addClass('lyteModalTopAlign lyteModalLeftAlign');
		_this.actualModalDiv.style.top = innerModalElementRect.top + 'px';
		_this.actualModalDiv.style.left = innerModalElementRect.left + 'px';
		_this.actualModalDiv.style.bottom = '';
		_this.actualModalDiv.style.right = '';

		_this.actualModalDiv.style.transition = 'none';

		Lyte.objectUtils(_this.getData('initialComputedModalDim') , 'add' , 'left' , parseFloat(getComputedStyle($L(_this.actualModalDiv)[0]).left))
		Lyte.objectUtils(_this.getData('initialComputedModalDim') , 'add' , 'top' , parseFloat(getComputedStyle($L(_this.actualModalDiv)[0]).top))
		window.addEventListener('mouseup' , _this.mouseupFun)
		window.addEventListener('mousemove' , _this.mousemoveFun);
	},
	mousemoveFun : function(eve){
		var dragHeader = $L('.lyteModalDragRunning')
		var modalEle = $L(dragHeader).closest('.lyteModalElement')[0]
		var modalComp = $L(dragHeader).closest('lyte-wormhole')[0].component.parent;

		modalEle.style.left = modalComp.getData('initialComputedModalDim').left - (modalComp.getData('initialMouseDown').clientX - eve.clientX) + "px"
		modalEle.style.top = modalComp.getData('initialComputedModalDim').top - (modalComp.getData('initialMouseDown').clientY - eve.clientY) + "px"

		if(modalComp.getData('ltPropAllowContainment')){
			if((modalComp.getData('initialComputedModalDim').left - (modalComp.getData('initialMouseDown').clientX - eve.clientX)) <= 0){
				modalEle.style.left = "0px"
			}
			if((modalComp.getData('initialComputedModalDim').top - (modalComp.getData('initialMouseDown').clientY - eve.clientY))<= 0){
				modalEle.style.top = "0px"
			}
			if((modalComp.getData('initialComputedModalDim').left - (modalComp.getData('initialMouseDown').clientX - eve.clientX)) + modalComp.getData('initialModalDim').width >= window.innerWidth){
				modalEle.style.left = (window.innerWidth - modalComp.getData('initialModalDim').width) + "px"
			}
			if((modalComp.getData('initialComputedModalDim').top - (modalComp.getData('initialMouseDown').clientY - eve.clientY)) + modalComp.getData('initialModalDim').height >= window.innerHeight){
				modalEle.style.top = (window.innerHeight - modalComp.getData('initialModalDim').height) + "px"
			}
		}

	},
	mouseupFun : function(eve){
		var dragHeader = $L('.lyteModalDragRunning')
		var _this = $L('.lyteModalDragRunning').closest('lyte-wormhole')[0].component.parent.component
		var animationType = _this.getData('ltPropTransition').animation;
		var modalEle = $L(dragHeader).closest('.lyteModalElement')[0]
		var modalWrapperElem = $L(modalEle.parentElement);
		if(animationType == 'slideFromRight') {
			var modalElemClientRect = modalEle.getBoundingClientRect();
			var modalElemLeft = modalElemClientRect.left;
			var modalElemRightValue = window.innerWidth - ( modalElemLeft + modalElemClientRect.width );
			modalEle.style.left = '';
			modalEle.style.transition = 'none';
			modalEle.style.right = modalElemRightValue + 'px';
			modalWrapperElem.removeClass('lyteModalLeftAlign').addClass('lyteModalRightAlign');
		}
		else if(animationType == 'slideFromBottom') {
			var modalElemClientRect = modalEle.getBoundingClientRect();
			var modalElemTop = modalElemClientRect.top;
			var modalElemBottomValue = window.innerHeight - ( modalElemTop + modalElemClientRect.height );
			modalEle.style.top = '';
			modalEle.style.transition = 'none';
			modalEle.style.bottom = modalElemBottomValue + 'px';
			modalWrapperElem.removeClass('lyteModalTopAlign').addClass('lyteModalBottomAlign');
		}
		setTimeout(function() {
			modalEle.style.transition = '';
		}, 0);
		dragHeader.removeClass('lyteModalDragRunning')
		window.removeEventListener('mousemove' , _this.mousemoveFun);
		window.removeEventListener('mouseup' , _this.mouseupFun);
		
	},

	//Observable functions
	_showModal : function(){

		var result = true;
		if(!this.getData('ltPropShow')){
			this.closeModal();
			return;
		}
		if(this.getData('ltPropReRenderModal')){
			this.setData('reRenderModal' , true)
			_lyteUiUtils.modalBodyClick = false;
			// this.setData('ltPropReRenderModal' , false)
			this.setData('reRenderModal' , false)
		}
		// this.closeOtherModals();
		this.closePrevPopup();


		if(this.getData('ltPropShow')){
			if(this.getMethods("onBeforeShow")){
				result = this.executeMethod("onBeforeShow",this);
			}
			this.setData('ltPropShowWormhole' , true)
			this.setData('ltPropBindToBody' , true)
			if(this.childComp){
				$L(this.childComp).removeClass('lyteModalVisibilityHidden')
			}
		}

		if(result !== false){

			if($L(this.childComp).hasClass('lyteModalHidden')){
				$L(this.childComp).removeClass('lyteModalHidden')
			}

			var offsetObject = this.getData('ltPropOffset')
			var _this = this
			$L(this.childComp)[0].style.visibility = ''
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			modalElem[0].style.zIndex = _lyteUiUtils.getZIndex();
			var modalInnerElem = modalElem.find('.lyteModalElement');
			$L(this.childComp)[0].style.display="block";
			var animationType = this.getData('ltPropTransition').animation;
			var originXDistance, originYDistance;
			var isOriginElementPresent = false;

			if(this.getData('ltPropFreeze') && this.getData('ltPropOverlapModal')){
				var popStack = _lyteUiUtils.popupStack.globalStack
				$L(this.childComp).find('lyte-modal-freeze').removeClass('lyteModalFreezeLayerHidden')
				if(popStack && popStack.length > 1){
					for(var i=popStack.length-2 ; i>=0 ;i--){
						var prevFreeze = $L(popStack[i].parentElement.component.childComp).find('.lytePopupFreezeLayer')
						if(prevFreeze[0]){
							prevFreeze.addClass('lyteModalFreezeLayerHidden')
							i=-1;
						}
					}
				}
			} else {
				this.setData('ltPropFreeze' , false)
				this.setData('showFreeze' , false)
			}

			if(this.getData('ltPropMaxWidth') != "") {
				this.setMaxWidth();
			}
			if(this.getData('ltPropMaxHeight') != "") {
				this.setMaxHeight();
				modalElem.addClass('lyteModalWithMaxHeight');
			}
			if(this.getData('ltPropWidth') != "auto") {
				this.setModalWidth();
			}
			if(this.getData('ltPropHeight') != "auto") {
				this.setModalHeight();
				modalElem.addClass('lyteModalWithHeight');
			}
			if(this.getData('ltPropSetContentHeight')) {
				modalElem.addClass('lyteModalWithContentHeight');
			}
			if(this.getData('ltPropIgnoreInlineDirection')) {
				modalElem.addClass('lyteModalIgnoreDirection');
			}
			else {
				modalElem.removeClass('lyteModalIgnoreDirection');
			}
			if(this.getData('ltPropScrollable')) {
				modalElem.addClass('lyteModalScrollable');
			}
			if(!this.getData('ltPropOverlapModal')) {
				var previousOpenedModal = _lyteUiUtils.popupStack.betaModalStack[_lyteUiUtils.popupStack.betaModalStack.length - 2].parentElement;
				var previousOpenedModalElem = $L(previousOpenedModal.component.childComp).find('.lyteModalWrapper');
				var previousOpenedModalInnerElem = previousOpenedModalElem.find('.lyteModalElement');
				var previousOpenedModalClientRect = previousOpenedModalInnerElem[0].getBoundingClientRect();
				switch(animationType) {
					case 'slideFromRight':
						modalElem[0].style.right = (window.innerWidth - previousOpenedModalClientRect.left) + 'px';
						break;
					case 'slideFromLeft': 
						modalElem[0].style.left = previousOpenedModalClientRect.right + 'px';
						break;
					case 'slideFromTop':
						modalElem[0].style.top = previousOpenedModalClientRect.bottom + 'px';
						break;
					case 'slideFromBottom':
						modalElem[0].style.bottom = (window.innerHeight - previousOpenedModalClientRect.top) + 'px';
						break;
				}
			}

			$L(this.childComp).find('.lyteModalCurrentlyClosing').removeClass('lyteModalCurrentlyClosing')

			if(this.getData('ltPropHeight') !== 'auto'){
				modalInnerElem[0].style.height = this.getData('ltPropHeight');
			}
			if(this.getData('ltPropWidth') !== 'auto'){
				modalInnerElem[0].style.width = this.getData('ltPropWidth');
			}
			if(this.getData('ltPropTransition').duration){
				modalElem[0].style.setProperty('--lyte-modal-transition-duration' , (this.getData('ltPropTransition').duration+'s'))
			}

			if(!offsetObject.left && !offsetObject.right){
				offsetObject.left = 'center'
			}
			if(!offsetObject.top && !offsetObject.bottom){
				offsetObject.top = 'center'
			}

			_lyteUiUtils.dispatchEvent('lyteModalBeforeOpen' , this.actualModalDiv)

			this.setAlignment(this);
			if(animationType == "fadeIn" || animationType == "zoom") {
				this.setOffsetForFadeAndZoomAnim(this);
			}
			modalElem.addClass('lyteModalShow');
			$L('body').addClass('lyteModalBodyWrapper')
			if(animationType === 'fadeIn' || animationType === 'zoom'){
				if(animationType === 'zoom') {
					var originElem = $L(this.getData('ltPropTransition').originElement);
					if(originElem.length > 0) {
						isOriginElementPresent = true;
						var modalInnerElemClientRect = modalInnerElem[0].getBoundingClientRect();
						var modalInnerElemXCenter = modalInnerElemClientRect.x + (modalInnerElemClientRect.width / 2);
						var modalInnerElemYCenter = modalInnerElemClientRect.y + (modalInnerElemClientRect.height / 2);
						var originElemClientRect = originElem[0].getBoundingClientRect();
						var originElemXCenter = originElemClientRect.x + (originElemClientRect.width / 2);
						var originElemYCenter = originElemClientRect.y + (originElemClientRect.height / 2);
						originXDistance = modalInnerElemXCenter - originElemXCenter;
						originYDistance = modalInnerElemYCenter - originElemYCenter;
						var translateXval = (-1 * originXDistance) + 'px';
						var translateYval = (-1 * originYDistance) + 'px';
						modalInnerElem[0].style.transition = 'none';
						modalInnerElem[0].style.transform = 'translate(' + translateXval + ',' + translateYval + ') scale(0)';
					}
				}
				setTimeout(function() {
					if(isOriginElementPresent) {
						modalInnerElem[0].style.transition = '';
						modalInnerElem[0].style.transform = 'translate(0, 0) scale(1)';
					}
					else {
						modalElem.addClass('lyteModalShowTransition');
					}
				}, 10);
			}
			else {
				setTimeout(function() {
					modalElem.addClass('lyteModalShowTransition');
					_this.setOffsetForSlideAnimation(_this);
				}, 10);
			}
			setTimeout(function(){
				if(!_lyteUiUtils.modalBodyClick || _this.getData('ltPropReRenderModal')){
					_this.setClickForFreeze()
				}
				_this.setDimension()
				if(!_this.getData('ltPropPreventFocus')){
					$L(_this.childComp).trapFocus()
				}
				if(_this.getMethods("onShow")){
					_this.executeMethod("onShow",_this);
				}
				$L(_this.$node).addClass('lyteModalOpened')

				console.log($L(_this.actualModalDiv));
				// $L( '.someexample' ).enableResize

				_this.removePopoverBodyClick()

				_lyteUiUtils.dispatchEvent('lyteModalOpened' , _this.actualModalDiv)
				_this.setCloseDuration()
				if(_this.getData('ltPropResizeModal')){
					_this.createResizeNodes()
				}
			},(this.getData('ltPropTransition').duration * 1000 + 10))
		} else {
			this.setData('ltPropShow' , false);
			this.setData('ltPropBindToBody' , false)
		}

	}.observes('ltPropShow').on('didConnect'),

	_updateMaxWidth : function(){
		this.setMaxWidth()
	}.observes('ltPropMaxWidth'),
	_updateMaxHeight : function(){
		this.setMaxHeight()
	}.observes('ltPropMaxHeight'),
	_updateWidth : function(){
		this.setModalWidth()
	}.observes('ltPropWidth'),
	_updateHeight : function(){
		this.setModalHeight()
	}.observes('ltPropHeight'),
	_changeTransition : function(){
		if(this.childComp && this.getData('ltPropShow')){
			var transitionData = this.getData('ltPropTransition');
			var animationType = transitionData.animation;
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			if(modalElem.length == 0){
				return
			}
			if(this.getData('ltPropShow')) {
				var modalInnerElem = modalElem.find('.lyteModalElement');
				modalInnerElem[0].style.transition = 'none';
				modalElem.removeClass('lyteModalFadeAnimation lyteModalZoomAnimation lyteModalSlideFromLeft lyteModalSlideFromRight lyteModalSlideFromTop lyteModalSlideFromBottom')
				modalElem.removeClass('lyteModalLeftAlign lyteModalRightAlign lyteModalTopAlign lyteModalBottomAlign lyteModalCenterAlign lyteModalVerticalMiddleAlign lyteModalHorizontalCenterAlign')

				modalInnerElem[0].style.left = '';
				modalInnerElem[0].style.right = '';
				modalInnerElem[0].style.top = '';
				modalInnerElem[0].style.bottom = '';

				this.setAlignment(this);
				if(animationType == "fadeIn" || animationType == "zoom") {
					this.setOffsetForFadeAndZoomAnim(this);
				}
				else {
					this.setOffsetForSlideAnimation(this);
				}
				if(transitionData.originElement) {
					modalInnerElem[0].style.transform = 'translate(0, 0) scale(1)';
					modalElem.removeClass('lyteModalShowTransition');
				}
				else {
					modalInnerElem[0].style.transform = '';
					modalElem.addClass('lyteModalShowTransition');
				}
				setTimeout(function() {
					modalInnerElem[0].style.transition = '';
				}, 10);
			}
		}
	}.observes('ltPropTransition'),
	_updateOffset : function(){
		if(this.childComp && this.getData('ltPropShow')){
			var offsetObject = this.getData('ltPropOffset')
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			var modalInnerElem = modalElem.find('.lyteModalElement');
			var animationType = this.getData('ltPropTransition').animation;
			if(!offsetObject.left && !offsetObject.right){
				offsetObject.left = 'center'
			}
			if(!offsetObject.top && !offsetObject.bottom){
				offsetObject.top = 'center'
			}

			modalInnerElem[0].style.transition = 'none';
			modalElem.removeClass('lyteModalLeftAlign lyteModalRightAlign lyteModalTopAlign lyteModalBottomAlign lyteModalCenterAlign lyteModalHorizontalCenterAlign lyteModalVerticalMiddleAlign');

			modalInnerElem[0].style.left = '';
			modalInnerElem[0].style.right = '';
			modalInnerElem[0].style.top = '';
			modalInnerElem[0].style.bottom = '';
			this.setAlignment(this);
			if(animationType == 'fadeIn' || animationType == 'zoom') {
				this.setOffsetForFadeAndZoomAnim(this);
			}
			else {
				this.setOffsetForSlideAnimation(this);
			}
			setTimeout(function() {
				modalInnerElem[0].style.transition = '';
			}, 10);
		}
	}.observes('ltPropOffset'),
	_upDateCloseDuration : function(){
		this.setCloseDuration();
	}.observes('ltPropCloseDuration'),
	_draggableFunction : function(){
		if(this.childComp && this.getData('ltPropShow')){
			if(this.getData('ltPropDraggable')){
				$L(this.childComp).find('lyte-modal-header')[0].style.cursor="move";
				$L(this.childComp).find('lyte-modal-header')[0].addEventListener('mousedown' , this.mousedownFun)
			} else {
				$L(this.childComp).find('lyte-modal-header')[0].style.cursor="";
				$L(this.childComp).find('lyte-modal-header')[0].removeEventListener('mousedown' , this.mousedownFun)
			}
		}
	}.observes('ltPropDraggable'),
	_updateOverlayClose : function(){
		if(this.childComp && this.getData('ltPropShow')){
			this.setClickForFreeze();
		}
	}.observes('ltPropOverlayClose'),
	_showFreezeFun : function(){
		if(this.childComp && this.getData('ltPropShow')){
			this.setData('showFreeze' , this.getData('ltPropFreeze'))
			if($L(this.childComp).find('lyte-modal-freeze')[0]){
				this.setFreezeDimmer()
			}
		}
	}.observes('ltPropFreeze', 'ltPropDimmer'),
	_scrollableObs : function(){
		if(this.childComp && this.getData('ltPropShow')){
			var modalElem = $L(this.childComp).find('.lyteModalWrapper');
			if(this.getData('ltPropScrollable')){
				modalElem.addClass('lyteModalScrollable');
			} else {
				modalElem.removeClass('lyteModalScrollable');
			}
		}
	}.observes('ltPropScrollable'),

	//Destructor
	didDestroy : function(){
		clearTimeout(this.closeModalTransition); 
		if(this.getMethods("onClose")){
			this.executeMethod("onClose",this);
		}
		if(this.childComp){
			this.childComp.remove();
		}
		// window.removeEventListener('click' , this.closeOnBodyClick)
	}
});

;(function(){
  if($L){
    $L.prototype.trapFocus = function(arg){
      var preventdefault = false
      if(arg && arg.preventDefault){
        preventdefault = arg.preventDefault
      }

      if((_lyteUiUtils.trappingFocus)&&($L("#"+_lyteUiUtils.focusParent)[0])){
        $L(this[0]).data('trapFocusActiveIndex' , 0)
        document.removeEventListener('keydown' , _lyteUiUtils.trapFocusFun)
        $L("#"+_lyteUiUtils.focusParent)[0].removeEventListener('keydown' , _lyteUiUtils.trapFocusFun)
        _lyteUiUtils.trappingFocus = false
        _lyteUiUtils.focusParent = "";
      }
      var parent = this[0];
      if (!parent) {
        return;
      }
      if(arg === 'destroy' || arg === "Destroy"){
        $L(this[0]).data('trapFocusActiveIndex' , 0)
        document.removeEventListener('keydown' , _lyteUiUtils.trapFocusFun)
        $L(parent)[0].removeEventListener('keydown' , _lyteUiUtils.trapFocusFun)
        _lyteUiUtils.trappingFocus = false
        _lyteUiUtils.focusParent = "";
        document.addEventListener('keydown',LytePopup.onEscape,true);
        return;
      }
      document.removeEventListener('keydown',LytePopup.onEscape,true);

      var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), *[contenteditable]';
      

      var iniFocusableItems = [];
      iniFocusableItems = $L(parent).find(focusableElementsString).filter(function(ind, item){
        return $L(item).is(':visible') && (item.tabIndex != -1) && !(item.disabled)
      })
      if(iniFocusableItems.length < 1){
        if(!$L(this).attr('tabindex')){
          $L(this).attr('tabindex' , 0)
        }
        iniFocusableItems.push($L(this)[0])
      }
      if(iniFocusableItems.indexOf(document.activeElement) < 0){
        if($L(iniFocusableItems[0]).hasClass('lyteModalClose')){
          if(iniFocusableItems[1]){
            iniFocusableItems[1].focus()
          }
        } else {
          if(arg && arg.focusTarget && $L(arg.focusTarget)[0]){
            iniFocusableItems[iniFocusableItems.indexOf($L(arg.focusTarget)[0])].focus()
          } else {
            iniFocusableItems[0].focus()
          }
        }
      }

      if(!preventdefault){

        _lyteUiUtils.trapFocusFun = function(evt){

          _lyteUiUtils.trappingFocus = true
          _lyteUiUtils.focusParent = $L(parent).attr('id');

          var focusableItems;
          focusableItems = $L(parent).find(focusableElementsString).filter(function(ind, item){
            return $L(item).is(':visible') && (item.tabIndex != -1) && !(item.disabled)
          })

          if(focusableItems.length < 1){
            focusableItems.push($L(parent)[0])
          }

          if(focusableItems.indexOf(document.activeElement) < 0){
            focusableItems[0].focus()
          }
          if(evt.keyCode === 9 || evt.keyCode === 16){
            if(focusableItems.length == 0){
                return;
            }

            var focusedItem = document.activeElement;
            var focusedParent;

            if(!(parent.contains(focusedItem))){
              focusedParent = $L(focusedItem).closest('lyte-drop-box')[0]
              if(focusedParent){
                focusedParent = focusedParent.origindd
              }
              if(!(parent.contains(focusedParent))){
                LytePopup.initializeFocus(parent);
                evt && evt.preventDefault();
                return;
              }
            }

            var numberOfFocusableItems = focusableItems.length;

            var focusedItemIndex;
            for(var i = 0; i < focusableItems.length; i++){
                if(focusableItems[i] == focusedItem){
                    focusedItemIndex = i;
                    break;
                }
            }

            if (evt.shiftKey && evt.keyCode == 9) {
                if (focusedItemIndex == 0) {
                    focusableItems.get(numberOfFocusableItems - 1).focus();
                    evt.preventDefault();
                }

            } else if(evt.keyCode == 9){
                if (focusedItemIndex == numberOfFocusableItems-1) {
                    focusableItems.get(0).focus();
                    evt.preventDefault();
                }
            }
          }
        }

        parent.addEventListener('keydown' , _lyteUiUtils.trapFocusFun)


      } else {

        $L(parent).data('trapFocusActiveIndex' , 0)

        _lyteUiUtils.trapFocusFun = function(evt){

          var index = $L(parent).data('trapFocusActiveIndex')
          var focusableItems;
          focusableItems = $L(parent).find(focusableElementsString).filter(function(ind, item){
            return $L(item).is(':visible') && (item.tabIndex != -1) && !(item.disabled)
          }).toArray()

          if(arg && arg.attachItems){
            var attachItemsString = arg.attachItems.join(',')
            var attachItemArr = $L(attachItemsString).toArray()
            for(var i=0;i<attachItemArr.length;i++){
              focusableItems.push(attachItemArr[i])
            }
          }

          if(focusableItems.indexOf(document.activeElement) !== index){
            index = focusableItems.indexOf(document.activeElement)
          }

          if (evt.shiftKey && evt.keyCode == 9) {
            index -=1
            if(index < 0){
              index = focusableItems.length - 1
            }
            focusableItems[index].focus()
            evt.preventDefault()
            $L(parent).data('trapFocusActiveIndex' , index)
          } else if(evt.keyCode == 9){
            index +=1
            if(index > focusableItems.length-1){
              index = 0
            }
            focusableItems[index].focus()
            evt.preventDefault()
            $L(parent).data('trapFocusActiveIndex' , index)
          }

        }

        document.addEventListener('keydown' , _lyteUiUtils.trapFocusFun)

      }

    }
  }
}());
