Lyte.Component.register("lyte-tree-table", {
_template:"<template tag-name=\"lyte-tree-table\" class=\"lyteTreeTable\"> <lyte-tree-table-node> <template is=\"if\" value=\"{{expHandlers(calledFromInside,'!')}}\"><template case=\"true\"> <lyte-tree-table-header class=\"lyteTreeTableHeader{{if(ltPropHideHeader,' lyteTreeTableHeaderHidden','')}}\"> <lyte-yield yield-name=\"treeTableHead\" header-value=\"{{ltPropHeader}}\"></lyte-yield> </lyte-tree-table-header> </template></template> <lyte-tree-table-body class=\"lyteTreeTableBody\"> <lyte-tree-table-child lt-prop-data=\"{{ltPropData}}\"> <template is=\"registerYield\" yield-name=\"treeTableRow\"> <lyte-yield class=\"lyteTreeTableRow {{lyteTTIconHelper(listValue)}} {{lyteTThasChildHelper(listValue)}}\" yield-name=\"lyteTreeTableRow\" list-value=\"{{listValue}}\" index=\"{{index}}\" level=\"{{level}}\" style=\"--tree-level:{{level}};\" data-index=\"{{indexVar}}\"> </lyte-yield> </template> </lyte-tree-table-child> </lyte-tree-table-body> </lyte-tree-table-node> </template>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[1,3,1]},{"type":"registerYield","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--tree-level:'","level","';'"]}}}},{"type":"insertYield","position":[1]}]},{"type":"componentDynamic","position":[1,3,1]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropHeader","ltPropData","ltPropAsTree","ltPropScrollSpeed","ltPropRowSortable","ltPropColumnSortable","ltPropHideHeader","leftInterSectionArr","rootMarginArr","asTreeIndex","fixedColConfigs","initialRowVals","initialClientVals"],

	data: function () {
		return {
			// Exposed variables
			ltPropHeader: Lyte.attr('array', {
				default: []
			}),
			ltPropData: Lyte.attr('array', {
				default: [],
				watch: true
			}),
			ltPropAsTree: Lyte.attr('string', {
				default: '1'
			}),
			ltPropScrollSpeed: Lyte.attr('number', {
				default: 5
			}),
			ltPropRowSortable: Lyte.attr('boolean', {
				default: true
			}),
			ltPropColumnSortable: Lyte.attr('boolean', {
				default: true
			}),
			ltPropHideHeader : Lyte.attr('boolean' , {
				default : false
			}),

			// Internal variables
			// intersection observer variables
			leftInterSectionArr: Lyte.attr('array', {
				default: [0]
			}),
			rootMarginArr: Lyte.attr('array', {
				default: []
			}),
			asTreeIndex: Lyte.attr('number', {
				default: 1
			}),
			fixedColConfigs: Lyte.attr('array', {
				default: []
			}),

			// drag and drop variables
			initialRowVals : Lyte.attr('object' , {
				default : {
					top : 0,
					left : 0,
					right : 0,
					bottom : 0,
					width : 0,
					height : 0
				}
			}),
			initialClientVals : Lyte.attr('object' , {
				default : {
					x : 0,
					y : 0
				}
			})

		}
	},

	didConnect: function () {
		var _this = this
		this.updateNewRowProps()

		if(this.getData('ltPropRowSortable')){
			$L(this.$node).find('lyte-tree-table-body')[0].addEventListener('mousedown' , this.mouseDownFunction)
		}

		this.$node.alignTreeTable = function(){
			_this.updateNewRowProps()
		}

		// this.initiateIntersectionObserver();

	},

	mouseDownFunction : function(event){
		var _this = $L(event.target).closest('lyte-tree-table')[0].component;
		var currentDraggedRow = $L(event.target).closest('.lyteTreeTableRow')
		currentDraggedRow.addClass('lyteTTCurrentDraggedRow')
		var rowDim = currentDraggedRow[0].getBoundingClientRect()


		Lyte.objectUtils(_this.getData('initialClientVals') , 'add' , 'x' , event.clientX)
		Lyte.objectUtils(_this.getData('initialClientVals') , 'add' , 'y' , event.clientY)


		Lyte.objectUtils(_this.getData('initialRowVals') , 'add' , {
			'top' : rowDim.top,
			'left' : rowDim.left,
			'right' : rowDim.right,
			'bottom' : rowDim.bottom,
			'width' : rowDim.width,
			'height' : rowDim.height
		})

		var onDragStart = _this.executeMethod('onDragStart' , _this.getTreeObj(currentDraggedRow.attr('data-index')) , _this.getTreeData(currentDraggedRow.attr('data-index')))

		if(onDragStart !== false){
			window.addEventListener('mousemove' , _this.mouseMoveFunction)
			window.addEventListener('mouseup' , _this.mouseUpFunction)
		}
	},
	// mouseMoveFunction : function(event){
	// 	$L('.lyteTTtopPlaceHolder').removeClass('lyteTTtopPlaceHolder')
	// 	$L('.lyteTTchildPlaceHolder').removeClass('lyteTTchildPlaceHolder')
	// 	$L('.lyteTTbottomPlaceHolder').removeClass('lyteTTbottomPlaceHolder')
	// 	$L('.lyteTTnotDroppable').removeClass('lyteTTnotDroppable')
	// 	var _this = $L('.lyteTTCurrentDraggedRow').closest('lyte-tree-table')[0].component;
	// 	var currentRow = $L('.lyteTTCurrentDraggedRow').closest('.lyteTreeTableRow')

	// 	if(Math.abs(_this.getData('initialClientVals').y - event.clientY) > 5){
	// 		if(!$L('.lyteTreeCurrentSortElem')[0]){
	// 			var currentSortNode = $L(_this.$node).find('.lyteTTCurrentDraggedRow')[0]
	// 			var dummyNode = currentSortNode.cloneNode(true);
	// 			$L(dummyNode).addClass('lyteTreeCurrentSortElem')
	// 			$L(dummyNode).removeClass('lyteTTCurrentDraggedRow');
	// 			dummyNode.style.position = "absolute";
	// 			dummyNode.style.height = currentSortNode.getBoundingClientRect().height + "px"
	// 			dummyNode.style.zIndex = '100000'
	// 			dummyNode.style.border = "solid 1px #ccc"
	// 			dummyNode.style.setProperty('--treeLevel' , $L(currentSortNode).closest('lyte-tree-body').attr('data-level'))
	// 			var dummyNodeChildren = $L(dummyNode).find('lyte-tree-table-td')
		
	// 			$L(dummyNode).find('lyte-tree-icon').addClass('lyteTreeClonedIcon')
	// 			document.body.appendChild(dummyNode)
	// 			$L(dummyNode).find('.lyteTreeFixedCol').removeClass('lyteTreeFixedCol')
	// 			$L(dummyNode).find('.lyteTableTreeCol').removeClass('lyteTableTreeCol')
	// 		}
	
	// 		var currentSortElem = $L('.lyteTreeCurrentSortElem')[0]
	// 		currentSortElem.style.top = _this.getData('initialRowVals').top - (_this.getData('initialClientVals').y - event.clientY) + "px"
	// 		currentSortElem.style.left = _this.getData('initialRowVals').left - (_this.getData('initialClientVals').x - event.clientX) + "px"
	
	// 		// currentSortElem.style.top =event.clientY + "px"
	// 		// currentSortElem.style.left =event.clientX + "px"

	// 		var dragObj = {};
	// 		dragObj.component = _this
	// 		dragObj.event = event
	// 		dragObj.sourceArray = _this.getTreeData(currentRow.attr('data-index'))
	// 		dragObj.sourceObject = _this.getTreeObj(currentRow.attr('data-index'))
	// 		dragObj.sourceIndex = parseInt(_this.getTreeIndex(currentRow.attr('data-index')))


	// 		dragObj.draggedElem = currentSortElem

	
	// 		var backgroundRow = $L(event.target).closest('.lyteTreeTableRow')
			
	// 		if(backgroundRow[0]){
	// 			dragObj.overArray = _this.getTreeData(backgroundRow.attr('data-index'))
	// 			dragObj.overObject = _this.getTreeObj(backgroundRow.attr('data-index'))
	// 			if(!_this.isOverChild(currentRow.attr('data-index') , backgroundRow.attr('data-index'))){
	// 				if(backgroundRow[0]){
	// 					var backgroundRowDim = backgroundRow[0].getBoundingClientRect()
			
	// 					var topHeight = backgroundRowDim.height * .2
	// 					var midheight = backgroundRowDim.height * .8
	// 					if(!$L(event.target).closest('.lyteTreeTableRow').hasClass('lyteTTCurrentDraggedRow')){
	// 						if(event.clientY < (backgroundRowDim.top + topHeight)){
	// 							dragObj.asChild = false
	// 							_this.executeMethod('onDrag' , dragObj)
	// 							$L(backgroundRow).addClass('lyteTTtopPlaceHolder')
	// 						} else if((event.clientY > (backgroundRowDim.top + topHeight)) && (event.clientY < (backgroundRowDim.top + midheight))){
	// 							dragObj.asChild = true
	// 							_this.executeMethod('onDrag' , dragObj)
	// 							$L(backgroundRow).addClass('lyteTTchildPlaceHolder')
	// 						} else if((event.clientY > (backgroundRowDim.top + midheight)) && (event.clientY < (backgroundRowDim.top + backgroundRowDim.height))){
	// 							dragObj.asChild = false
	// 							_this.executeMethod('onDrag' , dragObj)
	// 							$L(backgroundRow).addClass('lyteTTbottomPlaceHolder')
	// 						}
	// 					}
	// 				}
	// 			} else {
	// 				$L(backgroundRow).addClass('lyteTTnotDroppable')
	// 			}
	// 		}
	// 	}

		
	// },
	mouseMoveFunction : function(event){
		$L('.lyteTTtopPlaceHolder').removeClass('lyteTTtopPlaceHolder')
		$L('.lyteTTchildPlaceHolder').removeClass('lyteTTchildPlaceHolder')
		$L('.lyteTTbottomPlaceHolder').removeClass('lyteTTbottomPlaceHolder')
		$L('.lyteTTnotDroppable').removeClass('lyteTTnotDroppable')
		var _this = $L('.lyteTTCurrentDraggedRow').closest('lyte-tree-table')[0].component;
		var currentRow = $L('.lyteTTCurrentDraggedRow').closest('.lyteTreeTableRow')

		if(Math.abs(_this.getData('initialClientVals').y - event.clientY) > 5){
			if(!$L('.lyteTreeCurrentSortElem')[0]){
				var currentSortNode = $L(_this.$node).find('.lyteTTCurrentDraggedRow')[0]
				var dummyNode = currentSortNode.cloneNode(true);
				$L(dummyNode).addClass('lyteTreeCurrentSortElem')
				$L(dummyNode).removeClass('lyteTTCurrentDraggedRow');
				dummyNode.style.position = "absolute";
				dummyNode.style.height = currentSortNode.getBoundingClientRect().height + "px"
				dummyNode.style.zIndex = '100000'
				dummyNode.style.border = "solid 1px #ccc"
				dummyNode.style.setProperty('--treeLevel' , $L(currentSortNode).closest('lyte-tree-body').attr('data-level'))
				var dummyNodeChildren = $L(dummyNode).find('lyte-tree-table-td')
		
				$L(dummyNode).find('lyte-tree-icon').addClass('lyteTreeClonedIcon')
				document.body.appendChild(dummyNode)
				$L(dummyNode).find('.lyteTreeFixedCol').removeClass('lyteTreeFixedCol')
				$L(dummyNode).find('.lyteTableTreeCol').removeClass('lyteTableTreeCol')
			}
	
			var currentSortElem = $L('.lyteTreeCurrentSortElem')[0]
			currentSortElem.style.top = _this.getData('initialRowVals').top - (_this.getData('initialClientVals').y - event.clientY) + "px"
			currentSortElem.style.left = _this.getData('initialRowVals').left - (_this.getData('initialClientVals').x - event.clientX) + "px"
		}
	},
	mouseUpFunction : function(event){
		$L('.lyteTTtopPlaceHolder').removeClass('lyteTTtopPlaceHolder')
		$L('.lyteTTchildPlaceHolder').removeClass('lyteTTchildPlaceHolder')
		$L('.lyteTTbottomPlaceHolder').removeClass('lyteTTbottomPlaceHolder')
		$L('.lyteTTnotDroppable').removeClass('lyteTTnotDroppable')
		if($L('.lyteTreeCurrentSortElem')[0]){
			$L('.lyteTreeCurrentSortElem')[0].remove()
		}
		var _this = $L('.lyteTTCurrentDraggedRow').closest('lyte-tree-table')[0].component;
		if($L(event.target).closest('lyte-tree-table')[0] == _this.$node){
			var currentRow = $L('.lyteTTCurrentDraggedRow').closest('.lyteTreeTableRow')

			var currentDraggedObject = _this.getTreeObj(currentRow.attr('data-index'))
			var currentDraggedParentArray = _this.getTreeData(currentRow.attr('data-index'))
			var currentDraggedDataIndex = parseInt(_this.getTreeIndex(currentRow.attr('data-index')))

			var dragObj = {};
			dragObj.component = _this
			dragObj.event = event
			dragObj.sourceArray = currentDraggedParentArray
			dragObj.sourceObject = currentDraggedObject
			dragObj.sourceIndex = currentDraggedDataIndex


			var backgroundRow = $L(event.target).closest('.lyteTreeTableRow')


			if(backgroundRow[0]){

				var backgroundRowDim = backgroundRow[0].getBoundingClientRect()

				var backgroundObject = _this.getTreeObj(backgroundRow.attr('data-index'))
				var backgroundParentArray = _this.getTreeData(backgroundRow.attr('data-index'))
				var backgroundDataIndex = parseInt(_this.getTreeIndex(backgroundRow.attr('data-index')))

				dragObj.overArray = backgroundParentArray
				dragObj.overObject = backgroundObject
				dragObj.overIndex = backgroundDataIndex
				dragObj.overElement = backgroundRow

				var onDragEnd = _this.executeMethod('onDragEnd' , dragObj);
				if(onDragEnd === false){
					return;
				}
	
		
				var topHeight = backgroundRowDim.height * .2
				var midheight = backgroundRowDim.height * .8
				if(!_this.isOverChild(currentRow.attr('data-index') , backgroundRow.attr('data-index'))){
					var onBeforeDrop;
					var dropObj = {}
					if(!backgroundRow.hasClass('lyteTTCurrentDraggedRow')){
						if(event.clientY < (backgroundRowDim.top + topHeight)){

							dragObj.asChild = false;

							onBeforeDrop = _this.executeMethod('onBeforeDrop' , dragObj);
							if(onBeforeDrop === false){
								return;
							}

							if((currentDraggedDataIndex > backgroundDataIndex) || (currentDraggedParentArray !== backgroundParentArray)){
								Lyte.arrayUtils(currentDraggedParentArray , 'removeObjects' , currentDraggedObject)
								Lyte.arrayUtils(backgroundParentArray , 'insertAt' , backgroundDataIndex , currentDraggedObject)
							} else if((currentDraggedDataIndex < backgroundDataIndex) || (currentDraggedParentArray !== backgroundParentArray)){
								Lyte.arrayUtils(backgroundParentArray , 'insertAt' , backgroundDataIndex , currentDraggedObject)
								Lyte.arrayUtils(currentDraggedParentArray , 'removeObjects' , currentDraggedObject)
							}
							dropObj.droppedIndex = backgroundDataIndex
						} else if((event.clientY > (backgroundRowDim.top + topHeight)) && (event.clientY < (backgroundRowDim.top + midheight))){
							if(backgroundObject){

								

								if(backgroundObject.children && backgroundObject.children.length>1){
									Lyte.objectUtils(backgroundObject , 'add' , 'collapsed' , false);
								}
								if(!backgroundObject.children){
									Lyte.objectUtils(backgroundObject , 'add' , 'children' , [])
								}

								dragObj.asChild = true;
								dragObj.overArray = backgroundObject.children

								onBeforeDrop = _this.executeMethod('onBeforeDrop' , dragObj);
								if(onBeforeDrop === false){
									return;
								}

								Lyte.arrayUtils(backgroundObject.children , 'push' , currentDraggedObject)
								Lyte.arrayUtils(currentDraggedParentArray , 'removeObjects' , currentDraggedObject)

								dropObj.droppedIndex = backgroundObject.children.length

								if(backgroundRow.hasClass('lyteTreeTableLeafNode') || backgroundRow.hasClass('lyteTreeTableClosedRow')){
									backgroundRow.removeClass('lyteTreeTableLeafNode')
									backgroundRow.removeClass('lyteTreeTableClosedRow')
									backgroundRow.addClass('lyteTreeTableOpenedRow')
								}
							}
						} else if((event.clientY > (backgroundRowDim.top + midheight)) && (event.clientY < (backgroundRowDim.top + backgroundRowDim.height))){
							dragObj.asChild = false;

							onBeforeDrop = _this.executeMethod('onBeforeDrop' , dragObj);
							if(onBeforeDrop === false){
								return;
							}
							
							if((currentDraggedDataIndex > backgroundDataIndex) || (currentDraggedParentArray !== backgroundParentArray)){
								Lyte.arrayUtils(currentDraggedParentArray , 'removeObjects' , currentDraggedObject)
								Lyte.arrayUtils(backgroundParentArray , 'insertAt' , (backgroundDataIndex+1) , currentDraggedObject)
							} else if((currentDraggedDataIndex < backgroundDataIndex) || (currentDraggedParentArray !== backgroundParentArray)){
								Lyte.arrayUtils(backgroundParentArray , 'insertAt' , (backgroundDataIndex+1) , currentDraggedObject)
								Lyte.arrayUtils(currentDraggedParentArray , 'removeObjects' , currentDraggedObject)
							}
							dropObj.droppedIndex = backgroundDataIndex
						}
						_this.updateNewRowProps()
						
						dropObj.oldArray = currentDraggedParentArray
						dropObj.droppedArray = dragObj.overArray

						_this.executeMethod('onDrop' , dropObj)
					}
				}
			}

			
		}
		
		$L('.lyteTTCurrentDraggedRow').removeClass('lyteTTCurrentDraggedRow')
		_this.resetInitialVals()
		window.removeEventListener('mousemove' , _this.mouseMoveFunction)
		window.removeEventListener('mouseup' , _this.mouseUpFunction)
	},
	resetInitialVals : function(){
		Lyte.objectUtils(this.getData('initialClientVals') , 'add' , 'x' , 0)
		Lyte.objectUtils(this.getData('initialClientVals') , 'add' , 'y' , 0)
	},

	initiateIntersectionObserver: function () {
		if (this.observer) {
			this.observer.disconnect()
		}
		var _this = this
		var toFixLeft = 0;
		var parentElem = this.$node;

		var treeTableHeaader = $L(this.$node).find('lyte-tree-table-th')
		var rootMarginLeft = 0;
		var rootMarginRight = 0;
		var thresholdArr = [];
		var rootWidth = this.$node.getBoundingClientRect().width - 2;

		// Adding fixed column class and fixing left value so when scrolling it gets sticked

		var fixedColConfig = {}

		for (var i = 0; i < treeTableHeaader.length; i++) {
			if ($L(treeTableHeaader[i]).hasClass('lyteTreeFixedHeader')) {
				$L(this.$node).find(('.lyteTreeTableCol' + i)).addClass('lyteTreeFixedCol')
				if (i === 0) {
					fixLeft(treeTableHeaader[i], 0)
					fixLeft(('.lyteTreeTableCol' + i), 0)
					fixedColConfig.left = toFixLeft
					toFixLeft += treeTableHeaader[i].getBoundingClientRect().width
				} else {
					Lyte.arrayUtils(this.getData('leftInterSectionArr'), 'push', toFixLeft);
					fixLeft(treeTableHeaader[i], toFixLeft)
					fixLeft(('.lyteTreeTableCol' + i), toFixLeft)
					fixedColConfig.left = toFixLeft
					toFixLeft += treeTableHeaader[i].getBoundingClientRect().width
				}
				fixedColConfig.index = parseInt($L(treeTableHeaader[i]).attr('head-index'))
				Lyte.arrayUtils(this.getData('fixedColConfigs'), 'push', fixedColConfig)
				fixedColConfig = {}
			}
		}

		function fixLeft(node, val) {
			$L(node).css({ "left": val })
		}

		// Looping through fixed classes and creating threshold for intersection observer

		for (var i = 0; i < treeTableHeaader.length; i++) {
			if (i === 0 && $L(treeTableHeaader[i]).hasClass('lyteTreeFixedHeader') && !$L(treeTableHeaader[i]).hasClass('supportObserverNode')) {
				$L(treeTableHeaader[i + 1]).addClass('supportObserverNode')
				thresholdArr.push(1)
			} else if ($L(treeTableHeaader[i]).hasClass('supportObserverNode') && $L(treeTableHeaader[i]).hasClass('lyteTreeFixedHeader')) {
				$L(treeTableHeaader[i]).removeClass('supportObserverNode')
				$L(treeTableHeaader[i + 1]).addClass('supportObserverNode')
				thresholdArr.push(1)
			} else if ($L(treeTableHeaader[i]).hasClass('lyteTreeFixedHeader')) {
				$L(treeTableHeaader[i]).addClass('actualObserverNode')
				thresholdArr.push(.99)
			}
		}

		// Looping through fixed classes and creating rootmargin for intersection observer

		var testArr = $L(this.$node).find('lyte-tree-table-th.lyteTreeFixedHeader')
		for (var i = 0; i < testArr.length; i++) {
			var rootMarVal = ""
			if ($L(testArr[i]).hasClass('actualObserverNode')) {
				rootMarginRight = rootWidth - (rootMarginRight + testArr[i].getBoundingClientRect().width)
				rootMarVal = "0px -" + rootMarginRight + "px 0px -" + rootMarginLeft + "px";
				rootMarginLeft += testArr[i].getBoundingClientRect().width
				rootMarginRight = rootMarginLeft
			} else {
				rootMarginLeft += testArr[i].getBoundingClientRect().width
				rootMarVal = "0px 0px 0px -" + rootMarginLeft + "px";
				rootMarginRight = rootMarginLeft
			}
			Lyte.arrayUtils(this.getData('rootMarginArr'), 'push', rootMarVal)
		}

		// Intersection observer config

		var fixedCols = $L(this.$node).find('.supportObserverNode,.actualObserverNode')
		var rootMargin = this.getData('rootMarginArr')

		function interObs(rootMargin, thresholdArr, fixedCols) {
			_this.observer = new IntersectionObserver(function (entries) {

				var entry = entries[0];

				if ($L(entry.target).hasClass('supportObserverNode')) {
					var prevInd = parseInt($L(entry.target).attr('head-index')) - 1
					var prevCol = $L(parentElem).find('lyte-tree-table-th[head-index = "' + prevInd + '"]')
					var prevBodyCol = $L(parentElem).find('lyte-tree-table-td[col-index = "' + prevInd + '"]')

					if (entry.isIntersecting) {
						if ($L(parentElem).find('.headerShadow')[0]) {
							if ($L(testArr[testArr.indexOf(prevCol[0]) - 1]).hasClass('supportObserverNode') || $L(testArr[testArr.indexOf(prevCol[0]) - 1]).hasClass('actualObserverNode')) {
								$L(testArr[testArr.indexOf(prevCol[0]) - 1]).addClass('headerShadow')
								$L(_this.getColumn($L(testArr[testArr.indexOf(prevCol[0]) - 1]))).addClass('headerShadow')
							}
						}
						$L(prevCol).removeClass('headerShadow')
						$L(prevBodyCol).removeClass('headerShadow')
					} else {
						$L(parentElem).find('.headerShadow').removeClass('headerShadow')
						$L(prevCol).addClass('headerShadow')
						$L(prevBodyCol).addClass('headerShadow')
					}

				} else if ($L(entry.target).hasClass('actualObserverNode')) {
					var curInd = parseInt($L(entry.target).attr('head-index'))
					var curBodyCol = $L(parentElem).find('lyte-tree-table-td[col-index = "' + curInd + '"]')
					if (!entry.isIntersecting) {
						if ($L(parentElem).find('.headerShadow')[0]) {
							$L(testArr[testArr.indexOf(entry.target) - 1]).addClass('headerShadow')
							$L(_this.getColumn($L(testArr[testArr.indexOf(entry.target) - 1]))).addClass('headerShadow')
						}
						$L(entry.target).removeClass('headerShadow')
						$L(curBodyCol).removeClass('headerShadow')
					} else {
						$L(parentElem).find('.headerShadow').removeClass('headerShadow')
						$L(entry.target).addClass('headerShadow')
						$L(curBodyCol).addClass('headerShadow')
					}

				}

			}, {
				root: parentElem,
				rootMargin: rootMargin,
				threshold: thresholdArr
			})

			_this.observer.observe(fixedCols)
		}

		var rootMarginLen = rootMargin.length - 1

		for (var i = fixedCols.length - 1; i >= 0; i--) {
			$L(fixedCols[i]).data('intersectionIndex', i)
			interObs(rootMargin[rootMarginLen], thresholdArr[i], fixedCols[i])
			rootMarginLen--;
		}
	},

	getColumn: function (node) {
		// This function is used in intersection observer
		var headInd = parseInt($L(node).attr('head-index'))
		return $L(this.$node).find(('.lyteTreeTableCol' + headInd));
	},

	methods: {
		onToggle: function () { },
		onToggleEnd: function () { },
		onBeforeOpen: function () { },
		onOpen: function () { },
		onBeforeClose: function () { },
		onClose: function () { },
		onDragStart: function () { },
		onDrag: function () { },
		onDragEnd: function () { },
		onBeforeDrop: function () { },
		onDrop: function () { }
	},
	actions: {
		toggleTree: function (th) {
			if ($L(th).hasClass('lyteTreeTableClosed')) {
				$L(th).removeClass('lyteTreeTableClosed')
				$L(th).addClass('lyteTreeTableOpened')
				$L(th).closest('.lyteTreeTableRow').addClass('lyteTreeTableOpenedRow')
				$L(th).closest('.lyteTreeTableRow').removeClass('lyteTreeTableClosedRow')
				this.updateNewRowProps();
			} else if ($L(th).hasClass('lyteTreeTableOpened')) {
				$L(th).closest('.lyteTreeTableRow').removeClass('lyteTreeTableOpenedRow')
				$L(th).closest('.lyteTreeTableRow').addClass('lyteTreeTableClosedRow')
				$L(th).removeClass('lyteTreeTableOpened')
				$L(th).addClass('lyteTreeTableClosed')
				this.updateNewRowProps();
			}
		}
	},

	getTreeData: function (dataIndex) {
		// Gives the array data of the element selected or passed to the function

		var indArr = dataIndex.split(" ")
		var treeData = this.getData('ltPropData')

		for (var i = 0; i < indArr.length - 1; i++) {
			treeData = treeData[parseInt(indArr[i])].children
		}

		return treeData

	},
	getTreeObj: function (dataIndex) {
		// Gives the object data of the element selected or passed to the function

		var indArr = dataIndex.split(" ")
		var treeData = this.getData('ltPropData')

		for (var i = 0; i < indArr.length - 1; i++) {
			treeData = treeData[parseInt(indArr[i])].children
		}

		return treeData[indArr[indArr.length - 1]]

	},
	getTreeIndex : function(dataIndex){
		var dataIndexArr = dataIndex.split(' ')
		return dataIndexArr[dataIndexArr.length-1];
	},
	isOverChild : function(holdIndex , hoverIndex){
		const array = hoverIndex.split(' ');
		const startIndex = holdIndex.split(' ').length;
		const endIndex = hoverIndex.split(' ').length - holdIndex.split(' ').length
		var newDataIndexArr = array.splice(startIndex, endIndex);
		var newDataIndex = array.join(' ').trim()
		if(newDataIndex === holdIndex){
			return true
		}
		return false
	},

	_dataChangeObserver: function () {
		this.updateNewRowProps()
	}.observes('ltPropData'),

	// Helpers work from component 

	updateNewRowProps: function () {

		var asTreeNode = $L(this.$node).find('lyte-tree-table-th[asTree]')

		// setting class to column that acts as tree

		if (asTreeNode[0]) {
			var headIndex = parseInt(asTreeNode.attr('head-index'))
			this.setData('asTreeIndex', headIndex)
			$L(this.$node).find("lyte-tree-table-td[col-index='" + headIndex + "']").addClass('lyteTableTreeCol')
		}

		var fixedColConfig = this.getData('fixedColConfigs')
		for (var i = 0; i < fixedColConfig.length; i++) {
			$L(this.$node).find('lyte-tree-table-td[col-index="' + fixedColConfig[i].index + '"]').addClass('lyteTreeFixedCol')
			$L(this.$node).find('lyte-tree-table-td[col-index="' + fixedColConfig[i].index + '"]').css({ "left": fixedColConfig[i].left })
		}

		this.initiateIntersectionObserver();
	},

	didDestroy: function () {
		if (this.observer) {
			this.observer.disconnect()
		}
	}

});

if (!_lyteUiUtils.registeredCustomElements['lyte-tree-table-icon']) {
	_lyteUiUtils.registeredCustomElements['lyte-tree-table-icon'] = true;
	Lyte.createCustomElement("lyte-tree-table-icon", {
		static: {
			"observedAttributes": {
				/* disable async function */
				get: function () {
					return [];
				}
			}
		},

		"connectedCallback": function () {

		},

		constructor: function () {

			this.addEventListener('click', function (eve) {

				var currentRow = $L(this).closest('.lyteTreeTableRow')
				var currenttreeTable = $L(this).closest('lyte-tree-table')[0]

				var currentLevel = parseInt(currentRow.attr('data-level'))
				var nextLevel = currentLevel + 1
				var currentDataIndex = currentRow.attr('data-index')

				if ((currenttreeTable.component.getTreeObj(currentDataIndex).collapsed === false) || (currenttreeTable.component.getTreeObj(currentDataIndex).collapsed === undefined)) {

					if ((currenttreeTable.component.getTreeObj(currentDataIndex).hasChild === true) && currentRow.hasClass('lyteTreeTableClosedRow')) {
						openTree()
					} else {
						closeTree()
					}

				} else if ((currenttreeTable.component.getTreeObj(currentDataIndex).collapsed)) {

					openTree()

				}

				function openTree() {

					function openFun(){
						if ((onBeforeCloseRet !== false) && ( onToggle !== false)) {
							Lyte.objectUtils(currenttreeTable.component.getTreeObj(currentDataIndex), 'add', 'collapsed', false)
							currenttreeTable.component.executeMethod('onOpen')
							currenttreeTable.component.executeMethod('onToggleEnd', true, currenttreeTable.component.getTreeObj(currentRow.attr('data-index')), eve, currentRow[0])
							currentRow.addClass('lyteTreeTableOpenedRow')
							currentRow.removeClass('lyteTreeTableClosedRow')
						}
						currenttreeTable.component.updateNewRowProps()
					}

					var onBeforeCloseRet = currenttreeTable.component.executeMethod('onBeforeOpen',
						currenttreeTable.component.getTreeObj(currentRow.attr('data-index'))     // First Arg the current clicked data obj
					)

					var onToggle = currenttreeTable.component.executeMethod('onToggle', true, currenttreeTable.component.getTreeObj(currentRow.attr('data-index')), eve, currentRow[0])
					if (onBeforeCloseRet && onBeforeCloseRet.then) {
						onBeforeCloseRet.then(function (arg) {
							openFun()
						}, function () { });
					} else if(onToggle && onToggle.then){
						onToggle.then(function (arg) {
							openFun()
						}, function () { });
					} else {
						openFun()
					}
					
				}

				function closeTree() {
					if ((currenttreeTable.component.executeMethod('onBeforeClose',
						currenttreeTable.component.getTreeObj(currentRow.attr('data-index'))) !== false) && (currenttreeTable.component.executeMethod('onToggle', false, currenttreeTable.component.getTreeObj(currentRow.attr('data-index')), eve, currentRow[0]) !== false)) {
						Lyte.objectUtils(currenttreeTable.component.getTreeObj(currentDataIndex), 'add', 'collapsed', true)

						currenttreeTable.component.executeMethod('onClose')
						currenttreeTable.component.executeMethod('onToggleEnd', false, currenttreeTable.component.getTreeObj(currentRow.attr('data-index')), eve, currentRow[0])
						currentRow.removeClass('lyteTreeTableOpenedRow')
						currentRow.addClass('lyteTreeTableClosedRow')
					}
					currenttreeTable.component.updateNewRowProps()
				}

			})

		}
	})
}

if (!_lyteUiUtils.registeredCustomElements['lyte-tree-table-tr']) {
	_lyteUiUtils.registeredCustomElements['lyte-tree-table-tr'] = true;
	Lyte.createCustomElement("lyte-tree-table-tr", {
		static: {
			"observedAttributes": {
				/* disable async function */
				get: function () {
					return [];
				}
			}
		},

		"connectedCallback": function () {

		},

		constructor: function () {

		}
	})
}

if (!_lyteUiUtils.registeredCustomElements['lyte-tree-table-th']) {
	_lyteUiUtils.registeredCustomElements['lyte-tree-table-th'] = true;
	Lyte.createCustomElement("lyte-tree-table-th", {
		static: {
			"observedAttributes": {
				/* disable async function */
				get: function () {
					return [];
				}
			}
		},

		"connectedCallback": function () {

		},

		constructor: function () {
			var currYield = $L(this).closest('lyte-yield')
			var currInd = currYield.find('lyte-tree-table-th').indexOf(this);
			$L(this).attr("head-index", currInd)
			$L(this).addClass('lyteTreeTableHead' + currInd)
			if ($L(this)[0].hasAttribute('fixed')) {
				$L(this).addClass('lyteTreeFixedHeader')
			}
		}
	})
}

if (!_lyteUiUtils.registeredCustomElements['lyte-tree-table-td']) {
	_lyteUiUtils.registeredCustomElements['lyte-tree-table-td'] = true;
	Lyte.createCustomElement("lyte-tree-table-td", {
		static: {
			"observedAttributes": {
				/* disable async function */
				get: function () {
					return [];
				}
			}
		},

		"connectedCallback": function () {

		},

		constructor: function () {

			var currentRow = $L(this).closest('.lyteTreeTableRow')
			var currenttreeTable = $L(this).closest('lyte-tree-table')[0]

			var currYield = $L(this).closest('lyte-yield')
			var currInd = currYield.find('lyte-tree-table-td').indexOf(this);
			$L(this).addClass('lyteTreeTableCol' + currInd)
			$L(this).attr("col-index", currInd)
		}
	})
}