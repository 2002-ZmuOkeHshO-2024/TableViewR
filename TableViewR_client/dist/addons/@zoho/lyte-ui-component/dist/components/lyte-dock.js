Lyte.Component.register("lyte-dock", {
_template:"<template class=\"lyteDockComp\" tag-name=\"lyte-dock\"> <template is=\"if\" value=\"{{ltPropBindToBody}}\"><template case=\"true\"> <lyte-wormhole lt-prop-query=\"{{ltPropQuery}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"lyteDock lyteIcons\" onmouseout=\"{{action('onDockOut')}}\"> <template items=\"{{ltPropIcons}}\" item=\"item\" index=\"index\" is=\"for\"> <div id=\"{{index}}\" class=\"lyteDockIconWrapper\" style=\"--lyte-dock-icon-wrapper-size : {{ltPropIconSize}};\" onmouseover=\"{{action('onOver',event,this)}}\" onclick=\"{{action('iconClick',this)}}\" onmouseleave=\"{{action('onOut',event,this)}}\"> <template is=\"if\" value=\"{{ltPropTooltipShow}}\"><template case=\"true\"><span class=\"lyteDockTooltip\">{{item.name}}</span></template></template> <img class=\"lyteIcon\" type=\"image\" src=\"{{item.src}}\" alt=\"{{item.name}}\"> </div> </template> </div> </template> </lyte-wormhole> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-dock-icon-wrapper-size : '","ltPropIconSize","';'"]}}}},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,0]}]}},"default":{}},{"type":"attr","position":[1,3]}]}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropBindToBody","ltPropPlacement","ltPropIcons","ltPropIconSize","ltPropIconZoomSize","ltPropShow","ltPropDockMinMaxSize","ltPropTooltipShow","ltPropQuery"],

	data : function(){
		return {
			ltPropBindToBody : Lyte.attr('boolean',{default:false}),
			ltPropPlacement : Lyte.attr('string',{default:"bottom"}),
			ltPropIcons : Lyte.attr('array',{default:[]}),

			ltPropIconSize : Lyte.attr('number',{default :50}),
			ltPropIconZoomSize : Lyte.attr('number',{default :74}),

			ltPropShow : Lyte.attr('boolean',{default:false}),
			ltPropDockMinMaxSize : Lyte.attr('object',{default:{"min":10,"max":55}}),
			ltPropTooltipShow : Lyte.attr('boolean' , {
				default : false
			}),
			ltPropQuery : Lyte.attr('string',{default:"body"})
		}		
	},
	actions : {
		iconClick : function (node){
             if(this.getMethods('onItemClick')){
				this.executeMethod('onItemClick',this.getData('ltPropIcons')[node.id]);
			}
		},
 
		onOver : function(event , node){
            this.iconSizeSet();
		    $L(node).prevAll().eq(1).addClass('lyteDockZoomed2');
		    $L(node).prevAll().eq(0).addClass('lyteDockZoomed1');
		    $L(node).addClass('lyteDockZoomed');
		    $L(node).nextAll().eq(0).addClass('lyteDockZoomed1');
		    $L(node).nextAll().eq(1).addClass('lyteDockZoomed2');
			
			$L(node).addClass('lyteDockEntered');
			if(this.getMethods('onOver')){
				this.executeMethod('onOver',this.getData('ltPropIcons')[node.id]);
			}
			
			
		
		},
		onOut : function(event , node){
			$L(this.actualDockDiv).find('.lyteDockZoomed2').removeClass('lyteDockZoomed2');
			$L(this.actualDockDiv).find('.lyteDockZoomed1').removeClass('lyteDockZoomed1');
			$L(node).removeClass('lyteDockZoomed');

		},
		onDockOut : function(){
			$L(this.actualDockDiv).removeClass('lyteDockEntered');
		}

	},
	methods : {
		beforeWormholeAppend : function(arg){
			
            if(this.childComp){
                delete this.childComp;
            }
            if(this.actualDockDiv){
                delete this.actualDockDiv;
            }
            this.childComp = arg;
			this.actualDockDiv = this.childComp.querySelector(".lyteDock");
        }
	
	},
	didDestroy : function(){
		// clearTimeout(this.closeModalTransition); 
		if(this.getMethods("onBeforeDestroy")){
			this.executeMethod("onBeforeDestroy",this);
		}
		if(this.childComp){
			this.childComp.remove();
		}
	},

	iconSizeSet : function(){
       let size = this.$node.getData('ltPropIconSize');
	   let zoom = this.$node.getData('ltPropIconZoomSize');
	   let zoomed = Math.abs(size - zoom);
	   let increment = zoomed/3;
		
		let icons = $L(this.actualDockDiv).find('.lyteDockIconWrapper');
		for(let i=0;i<icons.length;i++){
			icons[i].style.setProperty('--zoom',size+zoomed);
			icons[i].style.setProperty('--zoom1',size+increment+increment);
			icons[i].style.setProperty('--zoom2',size+increment);
		}
	},

	showDock : function(){
		let showFlag = this.getData('ltPropBindToBody');
		let place = this.getData('ltPropPlacement');
		let elementDiv = this.actualDockDiv;
		if(showFlag){
			this.actualDockDiv.parentNode.classList.add('lyteDockYield');
			if(this.getMethods('onBeforeShow')){
				var onBeforeShowVal = this.executeMethod('onBeforeShow');
			}
			if(onBeforeShowVal !== false){
				$L(this.childComp).removeClass('lyteDockHidden')
				if(this.getData('ltPropDockMinMaxSize').max+1 !== this.getData('ltPropIconSize')){
					Lyte.objectUtils(this.getData('ltPropDockMinMaxSize'),'add','max',this.getData('ltPropIconSize')+1);
				} 
				elementDiv.style.setProperty('--lyte-dock-icon-max-size',this.getData('ltPropDockMinMaxSize').max);
				elementDiv.style.setProperty('--lyte-dock-icon-min-size',this.getData('ltPropDockMinMaxSize').min);
				$L(elementDiv).parent().removeClass("lyteDockTopAlign","lyteDockBottomAlign","lyteDockLeftAlign", "lyteDockRightAlign");
				if(place==="left"){
					
                    elementDiv.parentElement.classList.add("lyteDockLeftAlign");
					
	
				}else if(place==="right"){
					
                    elementDiv.parentElement.classList.add("lyteDockRightAlign");
					
				}else if(place==="top"){
					
                    elementDiv.parentElement.classList.add("lyteDockTopAlign");
					
				}else{
					elementDiv.parentElement.classList.add("lyteDockBottomAlign");
				}
				setTimeout(function(){
					elementDiv.classList.add("lyteDockShow");
				},3);

				if(this.getMethods('onShow')){
					this.executeMethod('onShow');
				}
			} else {
				this.setData('ltPropShow' , false)
				this.setData('ltPropBindToBody' , false)
			}
			
		}else{
			if(elementDiv){
				elementDiv.style.display="none";
			}
		}
	},

	closeDock : function(){
		let wormhole = this.childComp;
		let elementDiv = this.actualDockDiv;
		elementDiv.classList.remove("lyteDockShow");
		var transEndFn = function(){
			wormhole.classList.add('lyteDockHidden');
			$L(elementDiv).parent().removeClass("lyteDockTopAlign","lyteDockBottomAlign","lyteDockRightAlign", "lyteDockLeftAlign");
			elementDiv.removeEventListener("transitionend", transEndFn);
		}
		elementDiv.addEventListener("transitionend", transEndFn);
		
		if(this.getMethods('onClose')){
			this.executeMethod('onClose');
		 }
	},


	// observer functions

	_show : function(){
		if(this.getData('ltPropShow')){
			
		  this.setData('ltPropBindToBody' , true);
		  this.showDock();
		}else{
		  if(this.getMethods('onBeforeClose')){
			var onBeforeCloseVal = this.executeMethod('onBeforeClose');
			}
			if(onBeforeCloseVal !== false){
				this.closeDock();	
			}
		}
	  }.observes('ltPropShow'),

	_dockShow : function(){
		if(this.getData('ltPropShow')){
			let _this = this;
			if(this.actualDockDiv!=undefined){
				this.actualDockDiv.classList.add('lyteDockPreventTransition');			
			}
			_this.showDock();
			if(this.actualDockDiv!=undefined){
				setTimeout(function(){  
					_this.actualDockDiv.classList.remove('lyteDockPreventTransition');
				},10);
			}

		}

	}.observes('ltPropPlacement')	
});
