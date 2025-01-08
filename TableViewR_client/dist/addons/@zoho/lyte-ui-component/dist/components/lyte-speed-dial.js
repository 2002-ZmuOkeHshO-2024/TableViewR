Lyte.Component.register("lyte-speed-dial", {
_template:"<template class=\"lyteSpeedDialComp\" tag-name=\"lyte-speed-dial\"> <div class=\"lyteSpeedDial\" style=\"--lyte-speed-dial-icon-size : {{ltPropIconSize}}px;\"> <div class=\"lyteSpeedDialIconWrapper lyteSpeedDialButtonIcon\"> <img class=\"lyteSpeedDialMainIcon\" src=\"{{ltPropSpeedButton.src}}\" alt=\"{{ltPropSpeedButton.name}}\" onclick=\"{{action('speedIconClick',this)}}\"> </div> <template is=\"if\" value=\"{{ltPropSpeedShow}}\"><template case=\"true\"> <template items=\"{{ltPropIcons}}\" item=\"item\" index=\"index\" is=\"for\"> <div id=\"{{index}}\" class=\"lyteSpeedDialIconWrapper\" lt-prop-title=\"{{if(ifEquals(ltPropTooltipShow,true),item.name,'')}}\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\" style=\"--lyte-speed-dial-icon-index: {{index}}\" onmouseover=\"{{action('onOver',this)}}\" onclick=\"{{action('iconClick',this)}}\"> <img src=\"{{item.src}}\" class=\"lyteSpeedDialIcon\" alt=\"{{item.name}}\"> </div> </template> </template></template> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-speed-dial-icon-size : '","ltPropIconSize","'px;'"]}}}},{"type":"attr","position":[1,1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-speed-dial-icon-index: '","index"]}}}},{"type":"attr","position":[1,1]}]}]}},"default":{}}],
_observedAttributes :["ltPropSpeedShow","ltPropIcons"],

	data : function(){
		return {
            ltPropSpeedShow : Lyte.attr('boolean',{default:false}),
			ltPropIcons : Lyte.attr('array',{default:[]})
		}		
	},
	actions : {
			iconClick : function (node){
				 if(this.getMethods('onItemClick')){
					this.executeMethod('onItemClick',this.getData('ltPropIcons')[node.id]);
			   	 }
			},
		    speedIconClick : function(node){
				if($L('.lyteSpeedDialMainIcon')[0].classList.contains('lyteSpeedDialButtonIconRotated')){
					$L('.lyteSpeedDialMainIcon').removeClass('lyteSpeedDialButtonIconRotated');
				}
                this.speedShowFunction(node);
		    },
			onOver : function(node){
				if(this.getMethods('onOver')){
					this.executeMethod('onOver',this.getData('ltPropIcons')[node.id]);
				}
			}
	},
	
	methods : {

	},
	didConnect : function(){
		$L('.lyteSpeedDial')[0].style.top=this.getData('ltPropSpeedButton').offset[0]+'px';
		$L('.lyteSpeedDial')[0].style.left=this.getData('ltPropSpeedButton').offset[1]+'px';
	},
	didDestroy : function(){
		if(this.getMethods("onBeforeDestroy")){
			this.executeMethod("onBeforeDestroy",this);
		}	
	},
    circleDataAdd : function(preference,fullCircleRadius,halfCircleRadius,quaterCircleradius){
		if(preference=='circle'){
			this.$node.style.setProperty('--lyte-speed-dial-negative-deg',90);
			this.$node.style.setProperty('--lyte-speed-dial-circle-total-degree',360);
			
			this.$node.style.setProperty('--lyte-speed-dial-circle-radius',fullCircleRadius);
		}else if(preference=='topLeftCorner'){
			this.$node.style.setProperty('--lyte-speed-dial-circle-total-degree',90);
			this.$node.style.setProperty('--lyte-speed-dial-circle-radius',quaterCircleradius);
			this.$node.style.setProperty('--lyte-speed-dial-negative-deg',0);
		}else if(preference=='topRightCorner'){
			this.$node.style.setProperty('--lyte-speed-dial-circle-total-degree',90);
			this.$node.style.setProperty('--lyte-speed-dial-circle-radius',quaterCircleradius);
			this.$node.style.setProperty('--lyte-speed-dial-negative-deg',90);
		}else if(preference=='bottomLeftCorner'){
			this.$node.style.setProperty('--lyte-speed-dial-circle-total-degree',90);
			this.$node.style.setProperty('--lyte-speed-dial-circle-radius',quaterCircleradius);
			this.$node.style.setProperty('--lyte-speed-dial-negative-deg',-90);
		}else if(preference=='bottomRightCorner'){
			this.$node.style.setProperty('--lyte-speed-dial-circle-total-degree',90);
			this.$node.style.setProperty('--lyte-speed-dial-circle-radius',quaterCircleradius);
			this.$node.style.setProperty('--lyte-speed-dial-negative-deg',-180);
		}else{
			this.$node.style.setProperty('--lyte-speed-dial-circle-total-degree',180);
			this.$node.style.setProperty('--lyte-speed-dial-circle-radius',halfCircleRadius);
			if(preference==='leftSemiCircle'){
				 this.$node.style.setProperty('--lyte-speed-dial-negative-deg',90);
			}else if(preference==='rightSemiCircle'){
				this.$node.style.setProperty('--lyte-speed-dial-negative-deg',-90);
			}else if(preference==='topSemiCircle'){
				this.$node.style.setProperty('--lyte-speed-dial-negative-deg',180);
			}else if(preference==='bottomSemiCircle'){
				this.$node.style.setProperty('--lyte-speed-dial-negative-deg',0);
			}
		}
	},

	speedShowFunction : function(node){
		if(this.$node.getData('ltPropSpeedShow')){
			var onBeforeCloseVal = this.executeMethod('onBeforeClose');
			if(onBeforeCloseVal !==false){
				this.$node.setData('ltPropSpeedShow',false);
			}
			
		}else{
			if(this.getMethods('onBeforeShow')){
				var onBeforeShowVal = this.executeMethod('onBeforeShow');
			}
			if(onBeforeShowVal!==false){
				$L('.lyteSpeedDialMainIcon').addClass('lyteSpeedDialButtonIconRotated');				
				let top = this.getData('ltPropSpeedButton').offset[0];
				let left = this.getData('ltPropSpeedButton').offset[1];
	
				this.$node.style.setProperty('--lyte-speed-dial-icon-count',this.getData('ltPropIcons').length-1);
				
				let availablePositions = this.getActualPosition(500,50,[top,left],this.getData('ltPropPlacement'));
				
				// if(availablePositions!==this.getData('ltPropPlacement')){
				// 	console.log(" not available",this.getData('ltPropPlacement'));
				// }
				let lyteSpeedDial  = $L('.lyteSpeedDial');
				lyteSpeedDial.removeClass('lyteSpeedDialIconLeftAlign','lyteSpeedDialIconTopAlign','lyteSpeedDialIconRightAlign','lyteSpeedDialIconBottomAlign');
				$L('.lyteSpeedDial').removeClass('lyteSpeedDialIconCircleAlign');
					if(availablePositions==='right'){
						lyteSpeedDial.addClass('lyteSpeedDialIconRightAlign');			
					 }else if(availablePositions==='left'){
						lyteSpeedDial.addClass('lyteSpeedDialIconLeftAlign');
						
					 }else if(availablePositions==='top'){
				
						lyteSpeedDial.addClass('lyteSpeedDialIconTopAlign');
						
					 }else if(availablePositions==='bottom'){
						
						lyteSpeedDial.addClass('lyteSpeedDialIconBottomAlign');
					
					 }else if(availablePositions==='circle'){
						this.$node.style.setProperty('--lyte-speed-dial-icon-count',this.getData('ltPropIcons').length);
						$L('.lyteSpeedDial').addClass('lyteSpeedDialIconCircleAlign');
					 }else{
						$L('.lyteSpeedDial').addClass('lyteSpeedDialIconCircleAlign');
					 }	
					 this.$node.setData('ltPropSpeedShow',true);

			}			
		}
	},
	getActualPosition : function(popLength, popHeight, obj, preference){
		        let width = this.getData('ltPropIconSize');
				let heigth = this.getData('ltPropIconSize');
		        popLength = this.getData('ltPropIcons').length *(20+width);
				let fullCircleRadius = popLength/(2*Math.PI);
				let halfCircleRadius = (popLength)/Math.PI;
				let quaterCircleradius = halfCircleRadius*2;

				fullCircleRadius = fullCircleRadius+(width/2);
				if(fullCircleRadius < 70){
					fullCircleRadius = 70;
				}
				
		

		let wlength   = window.innerWidth;
		let wHeight   = window.innerHeight;

		var tarTop    = obj[0]-(heigth/2);
		var tarLeft   = obj[1]-(width/2);

		var tarRight  = wlength-(tarLeft+width);
		var tarBottom = wHeight-(tarTop+heigth);

		
		let results = {			
			top               : tarTop>=popLength ? true : false,    		   
			left              : tarLeft>=popLength ? true : false,   
			right             : tarRight>=popLength ? true : false, 
			bottom            : tarBottom>=popLength ? true : false,  
	        circle            : tarBottom>=fullCircleRadius && tarLeft>=fullCircleRadius && tarRight>=fullCircleRadius && tarTop>=fullCircleRadius ? true : false,
		   
			leftSemiCircle    : tarBottom>=halfCircleRadius && tarLeft>=halfCircleRadius && tarTop>=halfCircleRadius ? true : false,
			rightSemiCircle   : tarBottom>=halfCircleRadius && tarRight>=halfCircleRadius && tarTop>=halfCircleRadius ? true : false,
			topSemiCircle     : tarLeft>=halfCircleRadius && tarRight>=halfCircleRadius && tarTop>=halfCircleRadius ? true : false,
			bottomSemiCircle  : tarBottom>=halfCircleRadius && tarLeft>=halfCircleRadius && tarRight>=halfCircleRadius ? true : false,
		     
			topLeftCorner     : tarBottom>=quaterCircleradius && tarRight>=quaterCircleradius ? true : false,
			topRightCorner    : tarBottom>=quaterCircleradius && tarLeft>=quaterCircleradius ? true : false,
			bottomLeftCorner  : tarTop>=quaterCircleradius && tarRight>=quaterCircleradius ? true : false,
			bottomRightCorner : tarTop>=quaterCircleradius && tarLeft>=quaterCircleradius ? true : false
		
		}		
			if(results.hasOwnProperty(preference) && results[preference]){
				if(preference==='circle' || preference==='leftSemiCircle' || preference==='rightSemiCircle' || preference==='topSemiCircle' || preference==='bottomSemiCircle' || preference==='topLeftCorner' || preference==='topRightCorner' || preference==='bottomLeftCorner' || preference==='bottomRightCorner'){
				   this.circleDataAdd(preference,fullCircleRadius,halfCircleRadius,quaterCircleradius);
				}
				return preference;
			}
			for(key in results){
				if(results[key]){
					if(key==='circle' || key==='leftSemiCircle' || key==='rightSemiCircle' || key==='topSemiCircle' || key==='bottomSemiCircle' || key==='topLeftCorner' || key==='topRightCorner' || key==='bottomLeftCorner' || key==='bottomRightCorner'){
						this.circleDataAdd(preference,fullCircleRadius,halfCircleRadius,quaterCircleradius);
					 }
					return key;
				}
			}
		return "bottom";	
	},
	  _placementChange : function(){
		this.setData('ltPropSpeedShow',false);
			this.speedShowFunction();
	  }.observes('ltPropPlacement')
});
