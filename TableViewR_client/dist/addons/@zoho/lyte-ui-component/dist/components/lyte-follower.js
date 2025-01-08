Lyte.Component.register("lyte-follower", {
_template:"<template tag-name=\"lyte-follower\"> <template is=\"if\" value=\"{{ltPropBindToBody}}\"><template case=\"true\"> <lyte-wormhole lt-prop-query=\"{{ltPropWrapperParent}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"lyteFollowerWrapper {{ltPropWrapperClass}}\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"follower\" class=\"lyteFollowerYield\"></lyte-yield> </template><template case=\"false\"> <div class=\"lyteFollowerContent\"> {{ltPropContent}} </div> </template></template> </div> </template> </lyte-wormhole> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropShow","ltPropBindToBody","ltPropOffset","ltPropYield","ltPropContent","ltPropOrientation","ltPropPosition","ltPropMouseEvent","ltPropZindex","ltPropOriginElement","ltPropRenderAtCenter","ltPropHorizontalCenter","ltPropVerticalCenter","ltPropContainer","ltPropWrapperClass","ltPropWrapperParent","topStart","topEnd","leftStart","leftEnd","marginFromCursor","offsetTop","offsetLeft","horizontalPosition","verticalPosition","marginFromElement","originElement","container","leftBoundary","topBoundary","rightBoundary","bottomBoundary","followerBcr","originElemBcr","orientationCheck","offsetParentElem","offsetParentDimensions"],

	data : function(){
		return {
			ltPropShow : Lyte.attr('boolean' , {
				default : false
			}),
			ltPropBindToBody : Lyte.attr('boolean' , {
				default : false
			}),
			ltPropOffset: Lyte.attr('object', { // will not work with renderAtCenter
				default : {}
			}),
			ltPropYield: Lyte.attr('boolean', {
				default: true
			}),
			ltPropContent: Lyte.attr('string', {
				default: "This is Follower Content"
			}),
			ltPropOrientation: Lyte.attr('string', {
				default: ""
			}),
			ltPropPosition: Lyte.attr('object', {
				default: {}
			}),
			ltPropMouseEvent: Lyte.attr('object', {
				default: {}
			}),
			ltPropZindex: Lyte.attr('number', {
				default: undefined
			}), 
			ltPropOriginElement: Lyte.attr('object', {
				default: {}
			}),
			ltPropRenderAtCenter: Lyte.attr('boolean', {
				default : false
			}),
			ltPropHorizontalCenter: Lyte.attr('boolean', {
				default : false
			}),
			ltPropVerticalCenter: Lyte.attr('boolean', {
				default : false
			}),
			ltPropContainer: Lyte.attr('object', {
				default: {}
			}),
			ltPropWrapperClass : Lyte.attr('string',{
				default : ''
			}),
			ltPropWrapperParent: Lyte.attr('string'),

			topStart: Lyte.attr('number', {
				default: 0
			}),
			topEnd: Lyte.attr('number', {
				default: window.innerHeight
			}),
			leftStart: Lyte.attr('number', {
				default: 0
			}),
			leftEnd: Lyte.attr('number', {
				default: window.innerWidth
			}),
			marginFromCursor: Lyte.attr('number', {
				default: 10
			}),
			offsetTop: Lyte.attr('number', {
				default: 0
			}),
			offsetLeft: Lyte.attr('number', {
				default: 0
			}),
			horizontalPosition: Lyte.attr('number', {
				default: undefined
			}),
			verticalPosition: Lyte.attr('number', {
				default: undefined
			}),
			marginFromElement: Lyte.attr('number', {
				default: 5
			}),

			originElement: Lyte.attr('object'),
			container: Lyte.attr('object'),
			leftBoundary: Lyte.attr('number', {
				default: 0
			}),
			topBoundary: Lyte.attr('number', {
				default: 0
			}),
			rightBoundary: Lyte.attr('number', {
				default: 0
			}),
			bottomBoundary: Lyte.attr('number', {
				default: 0
			}),
			followerBcr: Lyte.attr('object'),
			originElemBcr: Lyte.attr('object'),
			orientationCheck: Lyte.attr('boolean', {
				default: false
			}),
			offsetParentElem: Lyte.attr('object'),
			offsetParentDimensions: Lyte.attr('object')

		}		
	},
	calcInitialPosition: function (orient) {
		let mouseEvent = this.getData("ltPropMouseEvent");

		this.setBCRs();
		let originElemBcr = this.getData("originElemBcr"),
			followerBcr = this.getData("followerBcr")
		
		let clientX = mouseEvent.clientX,
			clientY = mouseEvent.clientY;
		
		let leftEnd = this.getData('leftEnd')
		let topEnd = this.getData('topEnd')
		
		let top, left;
		if (this.getData("orientationCheck")) {
			if (orient === "vertical") {
				if (this.getData('verticalPosition')) {
					left = this.getData('verticalPosition');
					top = clientY;
				} else if (originElemBcr) {
					let marginFromElement = this.getData("marginFromElement")
					left = originElemBcr.right + marginFromElement;
					top = this.getData("ltPropRenderAtCenter") ? clientY : clientY + this.getData("marginFromCursor");
					if (left + followerBcr.width > leftEnd) {
						left = originElemBcr.left - marginFromElement - followerBcr.width;
					}
				}
			} else if (orient === "horizontal") {
				if (this.getData('horizontalPosition')) {
					top = this.getData('horizontalPosition');
					left = clientX;
				} else if (originElemBcr) {
					let marginFromElement = this.getData("marginFromElement")
					top = originElemBcr.bottom + marginFromElement;
					left = this.getData("ltPropRenderAtCenter") ? clientX : clientX + this.getData("marginFromCursor");
					if (top + followerBcr.height > topEnd) {
						top = originElemBcr.top - marginFromElement - followerBcr.height;
					}
				}
			}
		}
		this.renderFollower(top + document.documentElement.scrollTop, left + document.documentElement.scrollLeft);

	},
	changeYPosition: function (_this, event, originElemCheck) {
		let followerBcr = _this.getData("followerBcr"),
			marginFromCursor = _this.getData("offsetTop"),
			topStart = _this.getData("topStart"),
			topEnd = _this.getData("topEnd"),
			leftEnd = _this.getData('leftEnd'),
			offsetParentDim = this.getData("offsetParentDimensions"),
			top;
		
		if (originElemCheck) { 
			let verticalPosition = _this.getData('verticalPosition');
			let originElemBcr = _this.getData("originElemBcr")

			if (verticalPosition) {
				$L(".lyteActiveFollowerWrapper").css("left", verticalPosition - offsetParentDim.offsetLeft);
			} else { 
				let marginFromElement = _this.getData("marginFromElement")
				let left = (originElemBcr.right - offsetParentDim.offsetLeft + marginFromElement + followerBcr.width) > leftEnd ?
					(originElemBcr.left - offsetParentDim.offsetLeft - marginFromElement - followerBcr.width) :
					(originElemBcr.right - offsetParentDim.offsetLeft + marginFromElement);
				$L(".lyteActiveFollowerWrapper").css("left", left + document.documentElement.scrollLeft);
			}
		}
	
		if (event.clientY <= topStart + offsetParentDim.offsetTop) {
			this.setBCRs();
			let followerTop = this.getData("followerBcr").top;
			top = Math.max(--followerTop, topStart + offsetParentDim.offsetTop)	
			top -=  offsetParentDim.offsetTop;
		} else { 
			let followerTop;
			// Math.min(Math.max(topStart, event.clientY), topEnd - followerBcr.height);
			if (this.getData("ltPropRenderAtCenter") || this.getData("ltPropVerticalCenter")) {
				followerTop = Math.min(Math.max(topStart, event.clientY - offsetParentDim.offsetTop), topEnd - (followerBcr.height / 2));
				top = Math.max(followerTop - (followerBcr.height / 2), topStart)
			} else { 
				followerTop = Math.min(Math.max(topStart, event.clientY + marginFromCursor - offsetParentDim.offsetTop), topEnd - followerBcr.height);
				top = Math.max(followerTop, topStart)

			}
		}

		$L(".lyteActiveFollowerWrapper").css("top", top + document.documentElement.scrollTop);


		// $L(".lyteActiveFollowerWrapper").css({
		// 	"top": event.clientY + marginFromCursor 
		// })
		// if ((event.clientY + followerBcr.height + marginFromCursor) >= topEnd) {
		// 	$L(".lyteActiveFollowerWrapper").css({
		// 		"top": (window.innerHeight - followerBcr.height)
		// 	})
		// }
		// if (event.clientY + marginFromCursor <= topStart) {
		// 	$L(".lyteActiveFollowerWrapper").css({
		// 		"top": 0
		// 	})
		// }
	},
	changeXPosition: function (_this, event, originElemCheck) {
		let followerBcr = _this.getData("followerBcr"),
			marginFromCursor = _this.getData("offsetLeft"),
			leftStart = _this.getData("leftStart"),
			leftEnd = _this.getData("leftEnd"),
			topEnd = _this.getData("topEnd"),
			offsetParentDim = this.getData("offsetParentDimensions"),
			left;
		
			if (originElemCheck) { 
				let horizontalPosition = _this.getData('horizontalPosition');
				let originElemBcr = _this.getData("originElemBcr")
	
				if (horizontalPosition) {
					$L(".lyteActiveFollowerWrapper").css("top", horizontalPosition - offsetParentDim.offsetTop);
				} else { 
					let marginFromElement = _this.getData("marginFromElement")
					let top = (originElemBcr.bottom - offsetParentDim.offsetTop + marginFromElement + followerBcr.height) > topEnd ?
						(originElemBcr.top - offsetParentDim.offsetTop - marginFromElement - followerBcr.height) :
						(originElemBcr.bottom - offsetParentDim.offsetTop + marginFromElement);
					$L(".lyteActiveFollowerWrapper").css("top", top + document.documentElement.scrollTop);
				}
			}
		
		if (event.clientX <= leftStart + offsetParentDim.offsetLeft) {
			this.setBCRs();
			let followerLeft = this.getData("followerBcr").left;
			left = Math.max(--followerLeft, leftStart + offsetParentDim.offsetLeft)
			left -= offsetParentDim.offsetLeft;
		} else { 
			let followerLeft
				// Math.min(Math.max(leftStart, event.clientX), leftEnd - followerBcr.width - marginFromCursor);
			if (this.getData("ltPropRenderAtCenter") || this.getData("ltPropHorizontalCenter")) {
				followerLeft = Math.min(Math.max(leftStart, event.clientX - offsetParentDim.offsetLeft), leftEnd - (followerBcr.width / 2))
				left = Math.max(followerLeft - (followerBcr.width / 2), leftStart)
			} else {
				followerLeft = Math.min(Math.max(leftStart, event.clientX + marginFromCursor - offsetParentDim.offsetLeft), leftEnd - followerBcr.width)
				left = Math.max(followerLeft, leftStart)
			}
		}
		
		$L(".lyteActiveFollowerWrapper").css("left", left + document.documentElement.scrollLeft);
		// $L(".lyteActiveFollowerWrapper").css({
		// 	"left": event.clientX + marginFromCursor
		// })
		// if ((event.clientX + followerBcr.width + marginFromCursor) >= leftEnd) {
		// 	$L(".lyteActiveFollowerWrapper").css({
		// 		"left": (window.innerWidth - followerBcr.width)
		// 	})
		// }
		// if (event.clientX <= leftStart) {
		// 	$L(".lyteActiveFollowerWrapper").css({
		// 		"left": 0
		// 	})
		// }
	},
	moveFollower: function (event) {

		let _this = $L(".lyteActiveFollowerWrapper").closest("lyte-wormhole")[0].component.parent.component;

		_this.setBCRs();
		
		let orientation = _this.getData("ltPropOrientation")
		if (orientation === "") { 
			_this.changeXPosition(_this, event);
			_this.changeYPosition(_this, event);
		}
		else if (orientation === "vertical" && (_this.getData("originElement") || _this.getData("verticalPosition"))) { 
			_this.changeYPosition(_this, event, true);
		}
		else if (orientation === "horizontal" && (_this.getData("originElement") || _this.getData("horizontalPosition"))) { 
			_this.changeXPosition(_this, event, true);
		} else if (orientation === "vertical" && _this.getData("horizontalPosition") || orientation === "horizontal" && _this.getData("verticalPosition")) { 
			console.warn("Provide appropriate position for follower according to the orientation provided");
		} else {
			console.warn("Provide origin element or position to render follower if orientation is applied");
		}

		if(_this.getMethods("onMove")){
			_this.executeMethod("onMove", {});
		}
	},
	initalRenderFollower: function () {
		let mouseEvent = this.getData("ltPropMouseEvent");
		let initailX = mouseEvent.clientX
		let initailY = mouseEvent.clientY

		if (this.getData("ltPropZindex") !==  undefined) { 
			$L(this.actualFollowerDiv).css("zIndex", this.getData("ltPropZindex"))
		}
		
		if (this.getData("ltPropOrientation")) {
			if (this.getData("ltPropOrientation") && (this.getData("originElement") || this.getData("verticalPosition") || this.getData("horizontalPosition"))) { 
				this.setData("orientationCheck", true);
			}
			this.calcInitialPosition(this.getData("ltPropOrientation"));
			
		} else { 
			this.renderFollower(initailY  + document.documentElement.scrollTop, initailX + document.documentElement.scrollLeft);
		}
	},
	renderFollower: function (top, left) { 
		top -= this.getData("offsetParentDimensions").offsetTop;
		left -= this.getData("offsetParentDimensions").offsetLeft;

		let followerBcr = this.getData("followerBcr");
		if (this.getData("ltPropRenderAtCenter")) { 
			if (this.getData('ltPropOrientation') === 'horizontal') {
				$L(this.actualFollowerDiv).css({
					"top": Math.min(Math.max(top , this.getData("topStart")), this.getData("topEnd") - followerBcr.height),
					"left": Math.min(Math.max(left - (followerBcr.width / 2), this.getData("leftStart")), this.getData("leftEnd") - followerBcr.width)
				})
			} else if (this.getData('ltPropOrientation') === 'vertical') {
				$L(this.actualFollowerDiv).css({
					"top": Math.min(Math.max(top - (followerBcr.height / 2), this.getData("topStart")), this.getData("topEnd") - followerBcr.height),
					"left": Math.min(Math.max(left , this.getData("leftStart")), this.getData("leftEnd") - followerBcr.width)
				})
			} 
		} else { 
			let marginTop = this.getData('offsetTop'),
				marginLeft = this.getData('offsetLeft');
			if (this.getData('ltPropHorizontalCenter')) {
				left -= (followerBcr.width / 2 + marginLeft);
			} else if (this.getData('ltPropVerticalCenter')) {
				top -= (followerBcr.height / 2 + marginTop)
			}  
			marginTop = this.getData("horizontalPosition") ? 0 : marginTop;
			marginLeft = this.getData("verticalPosition") ? 0 : marginLeft;

			$L(this.actualFollowerDiv).css({
				"top": Math.min(Math.max(top + marginTop, this.getData("topStart")), this.getData("topEnd") - followerBcr.height),
				"left": Math.min(Math.max(left + marginLeft , this.getData("leftStart")), this.getData("leftEnd") - followerBcr.width)
			})	
		}
		$L(this.actualFollowerDiv).css("visibility", "visible")
	},
	setBCRs: function () {
		if (this.getData("originElement")) { 
			this.setData("originElemBcr", this.getData("originElement").getBoundingClientRect());
		}
		this.setData("followerBcr", this.actualFollowerDiv.getBoundingClientRect())
	},
	setContainerBoundaries: function () {
		let container = this.getData('container'),
			contianerBcr = container.getBoundingClientRect(),
			wrapperParent = $L(this.getData("offsetParentElem"))[0],
			wrapperParentDim = this.getData("offsetParentDimensions");
		
		if (this.getData("ltPropContainer").selector !== this.getData("ltPropWrapperParent")) {
			this.setData({
				leftStart: contianerBcr.left - this.getData("leftBoundary"),
				leftEnd: contianerBcr.right + this.getData("rightBoundary"),
				topStart: contianerBcr.top - this.getData('topBoundary'),
				topEnd: contianerBcr.bottom + this.getData('bottomBoundary')
			})
		} else { 
			this.setData({
				leftStart: this.getData("leftBoundary"),
				// leftEnd: this.getComputedStyle(wrapperParent, "width") + this.getData("rightBoundary"),
				leftEnd: wrapperParentDim.right - wrapperParentDim.offsetLeft + this.getData("rightBoundary"),
				topStart:  this.getData('topBoundary'),
				// topEnd:  this.getComputedStyle(wrapperParent, "height") + this.getData('bottomBoundary')
				topEnd:  wrapperParentDim.bottom - wrapperParentDim.offsetTop + this.getData('bottomBoundary')
			})
		}
	},
	getComputedStyle: function (element, property) { 
		switch (property) { 
			case "width": { 
				return parseFloat(window.getComputedStyle(element).width)
			}
			case "height": { 
				return parseFloat(window.getComputedStyle(element).height)
			}
		}
	},
	showFollower: function () { 
		var _this = this;
		if (this.getData("ltPropShow")) {
			this.setData("ltPropBindToBody" , true)

			if(this.getMethods("onBeforeShow")){
				this.executeMethod("onBeforeShow", {});
			}

			$L(this.childComp).addClass("lyteFollowerWormhole")

			$L(_this.actualFollowerDiv).css("visibility", "hidden")
	
			this.tIdforShow = setTimeout(function () {

				$L(_this.actualFollowerDiv).addClass("lyteActiveFollowerWrapper")
				if (_this.nonYieldContentBox) { 
					$L(_this.nonYieldContentBox).addClass("lyteActiveFollowerContentBox")
				}

				if(_this.getMethods("onShow")){
					_this.executeMethod("onShow", {});
				}

				document.addEventListener("mousemove", _this.moveFollower)

			}, 100)

			this.initializeParameters()
			this.setBCRs()
			this.initalRenderFollower()

		} else { 

			this.setData("originElemBcr", undefined);

			if (this.getMethods("onBeforeClose")) {
				this.executeMethod("onBeforeClose", {});
			}

			$L(this.actualFollowerDiv).removeClass("lyteActiveFollowerWrapper")
			if (_this.nonYieldContentBox) { 
				$L(_this.nonYieldContentBox).removeClass("lyteActiveFollowerContentBox")
			}

			this.tIdforClose = setTimeout(function () {
				_this.setData("ltPropBindToBody", false)
			}, 100)

			if(this.getMethods("onClose")){
				this.executeMethod("onClose", {});
			}
			document.removeEventListener('mousemove' , this.moveFollower)

		}
	}.observes("ltPropShow"),
	initializeParameters: function () {

		this.getData("ltPropOffset")&& this.getData("ltPropOffset").offset ? this.setData('marginFromCursor', this.getData("ltPropOffset").offset) : undefined;
		let marginFromCursor = this.getData('marginFromCursor'),
			xMargin = this.getData("ltPropOffset") && this.getData("ltPropOffset").offsetLeft,
			yMargin = this.getData("ltPropOffset") && this.getData("ltPropOffset").offsetTop,
			originElement = this.getData("ltPropOriginElement") && this.getData("ltPropOriginElement").selector,
			marginFromElement = this.getData("ltPropOriginElement") && this.getData("ltPropOriginElement").marginFromElement,
			containerObj = this.getData("ltPropContainer"),
			container = containerObj && containerObj.selector,
			positionCoord = this.getData('ltPropPosition'),
			offsetParentElem = this.childComp.offsetParent,
			offsetParentElemBCR = offsetParentElem.getBoundingClientRect();
		
			offsetParentElemBCR.offsetLeft = offsetParentElem.offsetLeft
			offsetParentElemBCR.offsetTop = offsetParentElem.offsetTop

		this.setData("offsetParentElem", offsetParentElem);
		this.setData({
			offsetParentElem:offsetParentElem,
			offsetParentDimensions: offsetParentElemBCR
		})

		xMargin ? this.setData("offsetLeft", xMargin) : this.setData("offsetLeft", marginFromCursor)
		yMargin ? this.setData("offsetTop", yMargin) : this.setData("offsetTop", marginFromCursor)

		if (originElement) { 
			this.setData("originElement", $L(originElement)[0])
		}
		if (marginFromElement) { 
			this.setData("marginFromElement", marginFromElement)
		}
		if (container) { 
			this.setData("container", $L(container)[0]);
			if (containerObj) { 
				if (containerObj.boundary) {
					this.setData({
						leftBoundary: containerObj.boundary,
						topBoundary: containerObj.boundary,
						rightBoundary: containerObj.boundary,
						bottomBoundary: containerObj.boundary
					})
				}
				if (containerObj.verticalBoundary) { 
					this.setData({
						topBoundary: containerObj.verticalBoundary,
						bottomBoundary: containerObj.verticalBoundary
					})
				}
				if (containerObj.horizontalBoundary) { 
					this.setData({
						leftBoundary: containerObj.horizontalBoundary,
						rightBoundary: containerObj.horizontalBoundary
					})
				}
				if (containerObj.leftBoundary) {
					this.setData("leftBoundary", containerObj.leftBoundary)
				} 
				if (containerObj.topBoundary) {
					this.setData("topBoundary", containerObj.topBoundary)
				} 
				if (containerObj.rightBoundary) {
					this.setData("rightBoundary", containerObj.rightBoundary)
				} 
				if (containerObj.bottomBoundary) {
					this.setData("bottomBoundary", containerObj.bottomBoundary)
				} 
				this.setContainerBoundaries()
			}
		}
		if (positionCoord) { 
			if (positionCoord.horizontalPosition) {
				this.setData("horizontalPosition", positionCoord.horizontalPosition)
			} else if (positionCoord.verticalPosition) { 
				this.setData("verticalPosition", positionCoord.verticalPosition)
			}
		}
	},
	methods : {
		beforeWormholeAppend : function(arg){
			if(this.childComp){
                delete this.childComp;
            }
            if(this.actualFollowerDiv){
                delete this.actualFollowerDiv;
            }
            this.childComp = arg;
			this.actualFollowerDiv = $L(this.childComp).find(".lyteFollowerWrapper")[0];
			this.nonYieldContentBox = $L(this.childComp).find(".lyteFollowerContent")[0];
        }
	},
	didDestroy: function () { 

		this.tIdforClose = setTimeout(function () {
			this.setData("ltPropBindToBody", false)
		}, 100)

		if(this.childComp){
			delete this.childComp;
		}
		if(this.actualFollowerDiv){
			delete this.actualFollowerDiv;
		}
		if(this.tIdforShow){
			clearTimeout(this.tIdforShow);
            this.tIdforShow = false;
		}
		if(this.tIdforClose){
			clearTimeout(this.tIdforClose);
            this.tIdforClose = false;
		}

		document.removeEventListener('mousemove' , this.moveFollower)
	}
});