/*
	Todo
	* rtl support ( ? )
	* Test cases
*/

/**
 * This component is used to create connected flow charts 
 * @component lyte-connect
 * @version 3.74.0
 * @dependency lyte-wormhole
 *  components/lyte-wormhole.js
 * @dependency lyte-connect-item
 *  components/lyte-connect/lyte-connect-item.js
 *  theme/compiledCSS/default/ltr/lyte-ui-connect-item.css
 * 	plugins/lyte-connect/lyte-connection.js
 *  plugins/connect/lyte-connection.elbow.js
 *  plugins/connect/lyte-connection.arc.js
 *  plugins/connect/lyte-connection.avoidance.js
 *  plugins/lyte-sortable.js
 *  mixins/connect/lyte-connect-positioning.js
 *  mixins/connect/lyte-shape-positioning.js
 *  mixins/connect/lyte-connect-animation.js
 *  mixins/connect/lyte-connect-magnetiser.js
 *  mixins/connect/lyte-connect-undo.js
 *  mixins/lyte-smartguide-utils.js
 *  mixins/connect/lyte-connect-group-sort.js
 *  theme/compiledCSS/default/ltr/lyte-ui-connect.css
 *  theme/compiledCSS/default/ltr/lyte-ui-sortable.css
 * @methods onScroll, onZoom, onReconnect, onConnect, onConnectionCreate, onConnectionDisconnect, afterRender, onCreate, onDelete, onPreviewDragSelect, onPreviewDragMove, onPreviewDragEnd, onDragStart, onDrag, onDragEnd, onSelect, onDrop, onClickSelect, onClickSelectEnd, onAfterContextual, onBeforeDelete, onUndoRedoQueueUpdate, onConnectionHover, onConnectionLeave, onShapeHover, onShapeLeave, onBeforeReconnectSelect, onBeforeConnectionCreation, onMove, onTextbodyClick, onKeydown, onBeforeDelete, onBeforeSelect, onShapeSelect, onShapeUnselect, onBeforeUnselect
 * @utility connect, hasConnected, disConnect, arrange, scroll_to, deleteShape, insertShape, getSelected, groupSelected, unGroup, addToGroup, removeFromGroup, moveToCenter, resetQueue, refershConnectors, renderModule, resizeView, moveToShape, hideShape, showShape, getConnections, getConnectionDetails, showFieldConnectors, hideFieldConnectors, selectShape, unSelectShape, unSelectShapes, resizeView, undo, redo, pushToQueue, addText, removeText, updateText, getConnectorFromTextbody, updateConnectorId, getConnectorTextbody, getAllConnections
 */

Lyte.Component.register("lyte-connect", {
_template:"<template tag-name=\"lyte-connect\" onmousedown=\"{{action('mousedown',event)}}\" ontouchstart=\"{{action('mousedown',event)}}\" onscroll=\"{{action('scroll',event)}}\" onkeydown=\"{{action('keydown',event)}}\" tabindex=\"0\"> <div class=\"lyteConnectWrapper\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"><template is=\"if\" value=\"{{item.children}}\"><template case=\"true\"> <lyte-connect-item lt-prop-selected=\"{{item.selected}}\" lt-prop-suggested=\"{{ltPropSuggested}}\" lt-prop-suggestion-data=\"{{ltPropSuggestionData}}\" lt-prop-render-points=\"{{ltPropRenderPoints}}\" lt-prop-ignore-corner-points=\"{{ltPropIgnoreCornerPoints}}\" lt-prop-anywhere=\"{{ltPropAnywhere}}\" lt-prop-default-anchors=\"{{ltPropDefaultAnchors}}\" lt-prop-show-anchors=\"{{ltPropShowAnchors}}\" id=\"{{ltPropIdPrefix}}{{item.id}}\" class=\"lyteConnectGroupShape {{item.class}}\" data-index=\"{{index}}\" lt-prop-item=\"{{details[item.id]}}\" style=\"{{construct_style(item.position)}}\" lt-prop-group-arrange=\"{{ltPropGroupArrange}}\" onmouseenter=\"{{action('mouseenter',this,event)}}\" onmouseleave=\"{{action('mouseleave',this,event)}}\"> <template is=\"for\" items=\"{{item.children}}\" item=\"_item\" index=\"_index\"> <lyte-connect-item lt-prop-anywhere=\"{{ltPropAnywhere}}\" lt-prop-default-anchors=\"{{ltPropDefaultAnchors}}\" id=\"{{ltPropIdPrefix}}{{_item.id}}\" class=\"lyteConnectInnerItem {{_item.class}}\" data-index=\"{{_index}}\" onmouseenter=\"{{action('mouseenter',this,event)}}\" onmouseleave=\"{{action('mouseleave',this,event)}}\" lt-prop-data=\"{{_item}}\" is-child=\"true\" lt-prop-show-anchors=\"{{ltPropShowAnchors}}\"> <lyte-yield yield-name=\"connection\" connection=\"{{_item}}\"></lyte-yield> </lyte-connect-item> </template> </lyte-connect-item> </template><template case=\"false\"> <lyte-connect-item lt-prop-selected=\"{{item.selected}}\" lt-prop-suggested=\"{{ltPropSuggested}}\" lt-prop-suggestion-data=\"{{ltPropSuggestionData}}\" lt-prop-render-points=\"{{ltPropRenderPoints}}\" lt-prop-ignore-corner-points=\"{{ltPropIgnoreCornerPoints}}\" lt-prop-readonly=\"{{ltPropReadonly}}\" lt-prop-anywhere=\"{{ltPropAnywhere}}\" lt-prop-default-anchors=\"{{ltPropDefaultAnchors}}\" lt-prop-show-anchors=\"{{ltPropShowAnchors}}\" id=\"{{ltPropIdPrefix}}{{item.id}}\" class=\"{{item.class}}\" data-index=\"{{index}}\" style=\"{{construct_style(item.position)}}\" onmouseenter=\"{{action('mouseenter',this,event)}}\" onmouseleave=\"{{action('mouseleave',this,event)}}\" lt-prop-item=\"{{details[item.id]}}\"> <lyte-yield yield-name=\"connection\" connection=\"{{item}}\"></lyte-yield> <template is=\"registerYield\" yield-name=\"suggest_icon\" from-parent=\"\"></template> </lyte-connect-item> </template></template></template><template is=\"for\" items=\"{{fakeData}}\" item=\"item\" index=\"index\"> <lyte-connect-item id=\"{{ltPropIdPrefix}}{{item.id}}\" class=\"{{item.class}}\" data-index=\"{{index}}\" style=\"{{construct_style(item.position)}}\" lt-prop-item=\"{{details[item.id]}}\"> <lyte-yield yield-name=\"fakeConnection\" connection=\"{{item}}\"></lyte-yield> </lyte-connect-item> </template> <template is=\"if\" value=\"{{expHandlers(ltPropSwimLanes,'!')}}\"><template case=\"true\"> <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"lyteConnectionMarker\" width=\"{{ltPropWidth}}\" height=\"{{ltPropHeight}}\" viewBox=\"{{viewBox}}\" style=\"{{styleValue}}\"> <defs> </defs> </svg> </template></template> <template is=\"if\" value=\"{{ltPropSmartGuide}}\"><template case=\"true\"> <div class=\"lyteSmartGuides lyteSmartHorizontal lyteConnectHiddenElem\"></div> <div class=\"lyteSmartGuides lyteSmartVertical lyteConnectHiddenElem\"></div> </template></template><template is=\"if\" value=\"{{ltPropTextBox}}\"><template case=\"true\"><template is=\"for\" items=\"{{textBoxArray}}\" item=\"item\" index=\"index\"> <lyte-textbox index=\"{{index}}\" onclick=\"{{action('textclick',event,this,index)}}\" id=\"{{item.id}}\" class=\"{{lyteTextBox(item,item.class,item.hoverClass,item.text.length)}}\" style=\"{{item.style}}\"> <lyte-yield yield-name=\"textbox\" lt-prop-item=\"{{item}}\"></lyte-yield> </lyte-textbox> </template></template></template><template is=\"if\" value=\"{{renderReconnect}}\"><template case=\"true\"> <span class=\"lyteConnectReconnectElement lyteConnectStart\" style=\"{{reconnectStart}}\"></span> <span class=\"lyteConnectReconnectElement lyteConnectEnd\" style=\"{{reconnectEnd}}\"></span> </template></template><template is=\"if\" value=\"{{ltPropAdjustLines}}\"><template case=\"true\"><template is=\"for\" items=\"{{adjustPositions}}\" item=\"item\" index=\"index\"> <span connector=\"{{item.connector}}\" onmouseenter=\"{{action('adjustEnter',event,this)}}\" onmouseleave=\"{{action('adjustEnter',event,this)}}\" class=\"lyteConnectLineAdjustElement {{item.class}}\" data-index=\"{{index}}\" style=\"{{item.style}}\"></span> </template></template></template> </div> <template is=\"if\" value=\"{{ltPropPreview}}\"><template case=\"true\"> <lyte-wormhole class=\"lyteConnectWormhole\" lt-prop-query=\"{{ltPropQuery}}\" on-before-append=\"{{method('wormhole')}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"lyteConnectPreview\" onmousedown=\"{{action('preview_down',event)}}\" ontouchstart=\"{{action('preview_down',event)}}\" onclick=\"{{action('preview_click',event)}}\"> <div class=\"lytePreviewSvg\" style=\"width: 100%;height: 100%;\"> <div class=\"lytePreviewForeignObject\" style=\"width: 100%;height: 100%;\"> <template is=\"if\" value=\"{{expHandlers(ltPropPreviewImage,'!')}}\"><template case=\"true\"> <template is=\"forIn\" object=\"{{details}}\" value=\"value\" key=\"key\"> <div id=\"preview_{{key}}\" class=\"lytePreviewElement {{value.data.class}}\" style=\"{{construct_style(value.position)}}\"> <template is=\"if\" value=\"{{expHandlers(value.data.type,'==',&quot;groupshape&quot;)}}\"><template case=\"true\"><template is=\"forIn\" object=\"{{value.children}}\" value=\"_value\" key=\"_key\"> <div id=\"preview_{{_key}}\" class=\"lytePreviewElement lyteChildPreview\" style=\"{{construct_style(_value.position)}}\"> <lyte-yield yield-name=\"preview\" data=\"{{_value.data}}\" module_id=\"{{_key}}\"></lyte-yield> </div> </template></template><template case=\"false\"> <lyte-yield yield-name=\"preview\" data=\"{{value.data}}\" module_id=\"{{key}}\"></lyte-yield> </template></template> </div> </template> </template></template> <template is=\"if\" value=\"{{ltPropRenderConnectorsInPreview}}\"><template case=\"true\"> <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"lyteConnectionPreviewMarker\" width=\"{{ltPropWidth}}\" height=\"{{ltPropHeight}}\" viewBox=\"{{viewBox}}\" style=\"{{styleValue}}\"> </svg> <template is=\"if\" value=\"{{ltPropTextBox}}\"><template case=\"true\"><template is=\"for\" items=\"{{textBoxArray}}\" item=\"item\" index=\"index\"> <lyte-textbox index=\"{{index}}\" id=\"preview_{{item.id}}\" class=\"{{lyteTextBox(item,item.class,item.hoverClass,item.text.length,true)}}\" style=\"{{item.style}}\"> <lyte-yield yield-name=\"textbox\" lt-prop-item=\"{{item}}\"></lyte-yield> </lyte-textbox> </template></template></template></template></template> </div> </div> <div class=\"lyteConnectOverlay\"></div> </div> </template> </lyte-wormhole> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"construct_style","args":["item.position"]}}}},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"construct_style","args":["item.position"]}}}},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"registerYield","position":[1,3],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"attr","position":[1,2]},{"type":"for","position":[1,2],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"construct_style","args":["item.position"]}}}},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[1,4]},{"type":"if","position":[1,4],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"styleValue"}}}]}},"default":{}},{"type":"attr","position":[1,6]},{"type":"if","position":[1,6],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"item.style"}}},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}},{"type":"attr","position":[1,8]},{"type":"if","position":[1,8],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"reconnectStart"}}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"reconnectEnd"}}}]}},"default":{}},{"type":"attr","position":[1,9]},{"type":"if","position":[1,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"item.style"}}}]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1,1]},{"type":"if","position":[1,1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"forIn","position":[1],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"construct_style","args":["value.position"]}}}},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"forIn","position":[0],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"construct_style","args":["_value.position"]}}}},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]}},"default":{}}]}]}},"default":{}},{"type":"attr","position":[1,1,1,3]},{"type":"if","position":[1,1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"styleValue"}}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"item.style"}}},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_templateAttributes :{"type":"attr","position":[]},
_observedAttributes :["ltPropData","ltPropScrollLeft","ltPropScrollTop","ltPropScale","ltPropMinScale","ltPropMaxScale","ltPropWheelZoom","ltPropZoomControl","ltPropScrollHandling","ltPropOffset","ltPropMinDiff","ltPropCenter","ltPropWidth","ltPropHeight","ltPropPreview","ltPropQuery","ltPropOverlapCheck","ltPropIgnoreOverlapOnContextual","ltPropContextualZoom","ltPropContextualZoomLevel","ltPropContextualWheel","ltPropContextualBreakPoints","ltPropContextualZoomData","ltPropSelectMode","ltPropGroupArrange","ltPropLazyLoading","ltPropUndo","ltPropQueueLength","ltPropUpdateTime","ltPropSelectors","ltPropIdPrefix","ltPropConnectionType","ltPropConnectorRadius","ltPropAvoidWithModule","ltPropCheckLineBreak","ltPropElbowArc","ltPropCurveOffset","ltPropAvoidLine","ltPropTextBox","ltPropTextBoxAvoidance","ltPropArrangeType","ltPropShakeArrange","ltPropArrangeOffset","ltPropDownwardPosition","ltPropSmartGuide","ltPropSmartBuffer","ltPropAnywhere","ltPropDefaultAnchors","ltPropBoundary","ltPropReadonly","ltPropIgnoreCornerPoints","ltPropRenderPoints","ltPropMagnetiser","ltPropRenderConnectorsInPreview","ltPropReconnectHandling","ltPropAnimationDuration","ltPropLineMarker","ltPropMarkerData","ltPropAlignDirection","ltPropRenderWithArrange","ltPropIgnoreSibling","ltPropVerticalSpacing","ltPropHorizontalSpacing","ltPropSuggestion","ltPropSuggestionData","ltPropSuggestionDistance","ltPropSuggestionMore","ltPropSuggestionDimensions","ltPropSuggestionDelay","ltPropArrangeAnimationType","ltPropTracepathAnimationSpeed","ltPropAdjustLines","ltPropAdjustLinesMinDiff","ltPropHanging","ltPropSwimLanes","ltPropSwimNodes","ltPropIgnoreMinMax","ltPropOverlapCheckOnDrag","ltPropRefreshTime","ltPropElbowAvoidance","ltPropExtraScroll","ltPropReconnectHandlingType","ltPropPreviewScroll","ltPropTextBoxAvoidanceWithLine","ltPropLineMarkerDimension","ltPropFixedArrangeLevels","ltPropMoveOthers","ltPropPreviewImage","ltPropShowAnchors","ltPropLockGroupItems","viewBox","styleValue","undoQueue","_undoQueue","redoQueue","details","textBoxArray","renderReconnect","reconnectStart","reconnectEnd","fakeData","onAnimation","adjustPositions"],


	/**
	 * @method onBeforeProcess
	 * @version 3.80.0
	 */

	/**
	 * @method onArrange
	 * @version 3.80.0
	 */

	/**
	 * @method onBeforeInterchange
	 * @version 3.86.0
	 */

	/**
	 * @method onInterchange
	 * @version 3.86.0
	 */

	/**
	 * @method onBeforeUngroup
	 * @version 3.86.0
	 */

	/**
	 * @method onUngroup
	 * @version 3.86.0
	 */

	/**
	 * @method onBeforeGroup
	 * @version 3.86.0
	 */

	/**
	 * @method onGroup
	 * @version 3.86.0
	 */
	init : function(){
		var ns = "ltPropMarkerData";

		if( !this.data[ ns ] ){
			this.setData( ns, [ 
			    {
			        tag : "marker",
			        attr : {
			            id : 'lyteConnectionHeadMarker',
			            markerUnits : 'strokeWidth',
			            markerWidth : 12,
			            markerHeight : 12,
			            refX : 6,
			            refY : 6,
			            orient : "auto"
			        },
			        children : [ 
			            {
			                tag : "ellipse",
			                attr : {
			                    cx : 6,
			                    cy : 6,
			                    rx : 2,
			                    ry : 2
			                }
			            }
			        ]
			    },
			    {
			        tag : "marker",
			        attr : {
			            id : 'lyteConnectionTailMarker',
			            markerUnits : 'strokeWidth',
			            markerWidth : 12,
			            markerHeight : 12,
			            refX : 6,
			            refY : 3,
			            orient : "auto"
			        },
			        children : [ 
			            {
			                tag : "path",
			                attr : {
			                    d : "M 6 3 L 0 6 0 0 z"
			                }
			            }
			        ]
			    }
			]);
		} 
	},

	data : function(){
		return {

			/* Basic data */

			/**
			 * @componentProperty {array} ltPropData=[]
			 * @version 3.74.0
			 */

			ltPropData : Lyte.attr( 'array', { default : [] } ),

			/* Scroll properties - here scroll means transform */

			/**
			 * @componentProperty {number} ltPropScrollLeft=0
			 * @version 3.74.0
			 */

			ltPropScrollLeft : Lyte.attr( 'number', { default : 0 } ),
			/**
			 * @componentProperty {number} ltPropScrollTop=0
			 * @version 3.74.0
			 */

			ltPropScrollTop : Lyte.attr( 'number', { default : 0 } ),

			/* Scale zoom properties */
			/**
			 * @componentProperty {number} ltPropScale=1
			 * @version 3.74.0
			 */

			ltPropScale : Lyte.attr( 'number', { default : 1 } ),
			/**
			 * @componentProperty {number} ltPropMinScale=0.001
			 * @version 3.74.0
			 */
			ltPropMinScale : Lyte.attr( 'number', { default : 0.001 } ),
			/**
			 * @componentProperty {number} ltPropMaxScale=1
			 * @version 3.74.0
			 */
			ltPropMaxScale : Lyte.attr( 'number', { default : 1 } ),
			/**
			 * @componentProperty {boolean} ltPropWheelZoom=true
			 * @version 3.74.0
			 */
			ltPropWheelZoom : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @typedef {Object } zoomControl
			 * @property {boolean} ctrlKey=true
			 * @property {boolean} metaKey=true
			 * @property {boolean} shiftKey=true
			 */

			/**
			 * @componentProperty {object} ltPropZoomControl={ "ctrlKey" : true, "metaKey" : true }
			 * @version 3.74.0
			 */
			ltPropZoomControl : Lyte.attr( 'object', { default : { ctrlKey : true, metaKey : true } } ),
			/**
			 * @componentProperty {boolean} ltPropScrollHandling=true
			 * @version 3.74.0
			 */
			ltPropScrollHandling : Lyte.attr( 'boolean', { default : true } ),
			// ltPropWheelDragControl : Lyte.attr( 'object', { default : { shiftKey : true } } ),

			/* Arrange offset */
			/**
			 * @componentProperty {number} ltPropOffset=40
			 * @version 3.74.0
			 */
			ltPropOffset : Lyte.attr( 'number', { default : 40 } ),
			/**
			 * @componentProperty {number} ltPropMinDiff=40
			 * @version 3.74.0
			 */
			ltPropMinDiff : Lyte.attr( 'number', { default : 40 } ),
			/**
			 * @componentProperty {object} ltPropCenter
			 * @version 3.74.0
			 */
			ltPropCenter : Lyte.attr( 'object' ),

			/*  SVG dimension. Change if number of connectors occupies more area*/
			/**
			 * @componentProperty {number} ltPropWidth=200000
			 * @version 3.74.0
			 */
			ltPropWidth : Lyte.attr( 'number', { default : 200000 } ),
			/**
			 * @componentProperty {number} ltPropHeight=200000
			 * @version 3.74.0
			 */
			ltPropHeight : Lyte.attr( 'number', { default : 200000 } ),

			/* Enables preview */

			/**
			 * @componentProperty {boolean} ltPropPreview=true
			 * @version 3.74.0
			 */

			ltPropPreview : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty {string} ltPropQuery
			 * @version 3.74.0
			 */
			ltPropQuery : Lyte.attr( 'string' ),
			/**
			 * @componentProperty {boolean} ltPropOverlapCheck=true
			 * @version 3.74.0
			 */
			ltPropOverlapCheck : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty {boolean} ltPropIgnoreOverlapOnContextual=false
			 * @version 3.74.0
			 */
			ltPropIgnoreOverlapOnContextual : Lyte.attr( 'boolean', { default : false } ),

			/* Contextual zoom property. Either wheel zoom or contextual zoom can present at the same time*/
			/**
			 * @componentProperty {boolean} ltPropContextualZoom=true
			 * @version 3.74.0
			 */
			ltPropContextualZoom : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty {number} ltPropContextualZoomLevel=100
			 * @version 3.74.0
			 */
			ltPropContextualZoomLevel : Lyte.attr( 'number', { default : 100 } ),
			/**
			 * @componentProperty {boolean} ltPropContextualWheel=false
			 * @version 3.74.0
			 */
			ltPropContextualWheel : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {array} ltPropContextualBreakPoints
			 * @default [ 100, 75, 50, 25, 0 ]
			 * @version 3.74.0
			 */
			ltPropContextualBreakPoints : Lyte.attr( 'array', { default : [ 100, 75, 50, 25, 0 ] } ),
			/**
			 * @componentProperty {object} ltPropContextualZoomData
			 * @default {"0":{"left":100,"top":100},"10":{"left":100,"top":100},"20":{"left":80,"top":80},"30":{"left":80,"top":80},"40":{"left":80,"top":80},"50":{"left":80,"top":80},"60":{"left":80,"top":80},"70":{"left":80,"top":80},"80":{"left":80,"top":80},"90":{"left":80,"top":80}}
			 * @version 3.74.0
			 */

			ltPropContextualZoomData : Lyte.attr( 'object', { default : {
				90 : {
					left : 80,
					top : 80
				},
				80 : {
					left : 80,
					top : 80
				},
				70 : {
					left : 80,
					top : 80
				},
				60 : {
					left : 80,
					top : 80
				},
				50 : {
					left : 80,
					top : 80
				},
				40 : {
					left : 80,
					top : 80
				},
				30 : {
					left : 80,
					top : 80
				},
				20 : {
					left : 80,
					top : 80
				},
				10 : {
					left : 100,
					top : 100
				},
				0 : {
					left : 100,
					top : 100
				}
			} } ),
			/**
			 * @componentProperty {boolean} ltPropSelectMode=false
			 * @version 3.74.0
			 */
			ltPropSelectMode : Lyte.attr( 'boolean', { default : false } ),

			/* To adjust inner children position of a group shape*/
			/**
			 * @componentProperty {boolean} ltPropGroupArrange=false
			 * @version 3.74.0
			 */
			ltPropGroupArrange : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropGroupArrange=false
			 * @version 3.74.0
			 */
			ltPropLazyLoading : Lyte.attr( 'number', { default : 15 } ),
			/**
			 * @componentProperty {boolean} ltPropUndo=false
			 * @version 3.74.0
			 */
			ltPropUndo : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {number} ltPropQueueLength=50
			 * @version 3.74.0
			 */
			ltPropQueueLength : Lyte.attr( 'number', { default : 50 } ),
			/**
			 * @componentProperty {number} ltPropUpdateTime=250
			 * @version 3.74.0
			 */
			ltPropUpdateTime : Lyte.attr( 'number', { default : 250 } ),

			/**
			 * @typedef selectors
			 * @property {string} selector=lyte-connection-footer,.lyteConnectAnchorPoint
			 * @property {string} markerEnd=url(#lyteConnectionTailMarker)
			 * @property {string} markerStart=""
			 */

			/**
			 * @componentProperty {selectors} ltPropSelectors
			 * @version 3.74.0
			 */
			ltPropSelectors : Lyte.attr( 'object', { default : {
				selector : "lyte-connection-footer,.lyteConnectAnchorPoint",
				markerEnd : "url(#lyteConnectionTailMarker)",
				markerStart : ""
			} } ),
			/**
			 * @componentProperty {string} ltPropIdPrefix=""
			 * @version 3.74.0
			 */
			ltPropIdPrefix : Lyte.attr( 'string', { default : "" } ),

			/* Elbow connector properties */
			/**
			 * @componentProperty { curve | line | curvy_line | elbow | advanced_curve | curvy_line } ltPropConnectionType='curve'
			 * @version 3.74.0
			 */
			ltPropConnectionType : Lyte.attr( "string", { default : "curve" } ),
			/**
			 * @componentProperty {number} ltPropConnectorRadius=5
			 * @version 3.74.0
			 */
			ltPropConnectorRadius : Lyte.attr( 'number', { default : 5 } ),
			/**
			 * @componentProperty {boolean} ltPropAvoidWithModule=false
			 * @version 3.74.0
			 */
			ltPropAvoidWithModule : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropCheckLineBreak=false
			 * @version 3.74.0
			 */
			ltPropCheckLineBreak : Lyte.attr( "boolean", { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropElbowArc=false
			 * @version 3.74.0
			 */
			ltPropElbowArc : Lyte.attr( "boolean", { default : false } ),
			/**
			 * @componentProperty {number} ltPropCurveOffset=0
			 * @version 3.74.0
			 */
			ltPropCurveOffset : Lyte.attr( 'number', { default : 0 } ),
			/**
			 * @componentProperty {boolean} ltPropAvoidLine=false
			 * @version 3.74.0
			 */
			ltPropAvoidLine : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropTextBox=false
			 * @version 3.74.0
			 */
			ltPropTextBox : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropTextBoxAvoidance=true
			 * @version 3.74.0
			 */
			ltPropTextBoxAvoidance : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty { siblingtree | default | random } ltPropArrangeType="default"
			 * @version 3.74.0
			 */
			ltPropArrangeType : Lyte.attr( 'string', { default : "default" } ),
			/**
			 * @componentProperty {boolean} ltPropShakeArrange=false
			 * @version 3.74.0
			 */
			ltPropShakeArrange : Lyte.attr( "boolean", { default : false } ),
			/**
			 * @componentProperty {number} ltPropArrangeOffset=0
			 * @version 3.74.0
			 */
			ltPropArrangeOffset : Lyte.attr( 'number', { default : 0 } ),
			/**
			 * @componentProperty {boolean} ltPropDownwardPosition=true
			 * @version 3.74.0
			 */
			ltPropDownwardPosition : Lyte.attr( 'boolean', { default : true } ),
			
			/**
			 * @componentProperty {boolean} ltPropSmartGuide=false
			 * @version 3.74.0
			 */
			ltPropSmartGuide : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {number} ltPropSmartBuffer=10
			 * @version 3.74.0
			 */
			ltPropSmartBuffer : Lyte.attr( 'number', { default : 10 } ),

			/*lyte-connect-item properties*/
			/**
			 * @componentProperty {boolean} ltPropAnywhere=false
			 * @version 3.74.0
			 */
			ltPropAnywhere : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty {array} ltPropDefaultAnchors
			 * @default [ [ 0, 0.5 ], [ 1, 0.5 ], [ 0.5, 0 ], [ 0.5, 1 ] ]
			 * @version 3.74.0
			 */
			ltPropDefaultAnchors : Lyte.attr( 'array', { default : [ [ 0, 0.5 ], [ 1, 0.5 ], [ 0.5, 0 ], [ 0.5, 1 ] ] } ),
			/**
			 * @componentProperty {object} ltPropBoundary
			 * @default {}
			 * @version 3.74.0
			 */
			ltPropBoundary : Lyte.attr( 'object', { default : {} } ),
			/**
			 * @componentProperty {boolean} ltPropReadonly = false
			 * @version 3.74.0
			 */
			ltPropReadonly : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropIgnoreCornerPoints=false
			 * @version 3.74.0
			 */
			ltPropIgnoreCornerPoints : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropRenderPoints=true
			 * @version 3.74.0
			 */
			ltPropRenderPoints : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty {boolean} ltPropMagnetiser=false
			 * @version 3.74.0
			 */
			ltPropMagnetiser : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropRenderConnectorsInPreview=false
			 * @version 3.74.0
			 */
			ltPropRenderConnectorsInPreview : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropReconnectHandling=false
			 * @version 3.74.0
			 */
			ltPropReconnectHandling : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {string} ltPropAnimationDuration
			 * @version 3.74.0
			 */
			ltPropAnimationDuration : Lyte.attr( 'string' ),
			/**
			 * @componentProperty {array} ltPropLineMarker
			 * @version 3.74.0
			 */
			ltPropLineMarker : Lyte.attr( 'array' ),
			/**
			 * @componentProperty {array} ltPropMarkerData
			 * @version 3.74.0
			 */
			ltPropMarkerData : Lyte.attr( 'array' ),
			/**
			 * @componentProperty { horizontal | vertical } ltPropAlignDirection="horizontal"
			 * @version 3.74.0
			 */
			ltPropAlignDirection : Lyte.attr( 'string', { default : "horizontal" } ),
			/**
			 * @componentProperty {boolean} ltPropRenderWithArrange=false
			 * @version 3.74.0
			 */
			ltPropRenderWithArrange : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {boolean} ltPropIgnoreSibling=false
			 * @version 3.80.0
			 */
			ltPropIgnoreSibling : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {number} ltPropVerticalSpacing=100
			 * @version 3.80.0
			 */
			ltPropVerticalSpacing : Lyte.attr( 'number', { default : 100 } ),
			/**
			 * @componentProperty {number} ltPropHorizontalSpacing=100
			 * @version 3.80.0
			 */
			ltPropHorizontalSpacing : Lyte.attr( 'number', { default : 100 } ),

			// suggestion
			/**
			 * @componentProperty {boolean} ltPropSuggestion=false
			 * @version 3.80.0
			 */
			ltPropSuggestion : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {String[]} ltPropSuggestionData 
			 * @default ["top","down","left","right"]
			 * @version 3.80.0
			 */
			ltPropSuggestionData : Lyte.attr( 'array', { default : ["top","down","left","right"] } ),
			/**
			 * @componentProperty {number} ltPropSuggestionDistance=50
			 * @version 3.80.0
			 */
			ltPropSuggestionDistance:Lyte.attr( 'number', { default : 50 } ),
			/**
			 * @componentProperty {boolean} ltPropSuggestionMore=false
			 * @version 3.80.0
			 */
			ltPropSuggestionMore : Lyte.attr( 'boolean', { default : false } ),
			/**
			 * @componentProperty {object} ltPropSuggestionDimensions
			 * @default {}
			 * @version 3.80.0
			 */
			ltPropSuggestionDimensions : Lyte.attr( 'object', { default : {} } ),

			ltPropSuggestionDelay : Lyte.attr( 'number', { default : 500 } ),

			ltPropArrangeAnimationType : Lyte.attr( 'string', { default : "default" } ),
			/**
			 * @componentProperty {number} ltPropTracepathAnimationSpeed
			 * @version 3.80.0
			 */
			ltPropTracepathAnimationSpeed : Lyte.attr( 'number', { default : 100 } ),

			/**
			 * @componentProperty {string} ltPropAdjustLines
			 * @version 3.95.0
			 */

			ltPropAdjustLines : Lyte.attr( 'string' ),

			ltPropAdjustLinesMinDiff : Lyte.attr( 'number', { default : 5 } ),

			ltPropHanging : Lyte.attr( 'boolean', { default : false } ),

				/* swim lanes */

			ltPropSwimLanes : Lyte.attr( 'boolean', { default : false } ),
			ltPropSwimNodes : Lyte.attr( 'boolean', { default : false } ),

			/**
			 * @componentProperty {boolean} ltPropIgnoreMinMax=false
			 * @version 3.95.0
			 */

			ltPropIgnoreMinMax : Lyte.attr( 'boolean', { default : false } ),

			ltPropOverlapCheckOnDrag : Lyte.attr( 'boolean', { default : false } ),

			ltPropRefreshTime : Lyte.attr( 'number' ),

			ltPropElbowAvoidance : Lyte.attr( 'boolean', { default : false } ),

			/**
			 * @componentProperty {string} ltPropExtraScroll
			 * @version 3.95.0
			 */

			ltPropExtraScroll : Lyte.attr( "string" ),

			ltPropReconnectHandlingType  : Lyte.attr( 'string', { default : 'click' } ),

			ltPropPreviewScroll : Lyte.attr( 'boolean', { default : false } ),

			ltPropTextBoxAvoidanceWithLine : Lyte.attr( 'boolean', { default : false } ),

			ltPropLineMarkerDimension: Lyte.attr('object', { default: { min_width: 100, min_height: 100, max_width: 1400, max_height: 1400 } }),

			ltPropFixedArrangeLevels : Lyte.attr( 'boolean', { default : false } ),

			ltPropMoveOthers : Lyte.attr( 'boolean', { default : false } ),

			ltPropPreviewImage : Lyte.attr( 'boolean', { default : false } ),

			ltPropShowAnchors : Lyte.attr( 'boolean', { default : false } ),

			ltPropLockGroupItems : Lyte.attr( 'boolean', { default : false } ),

			/* System data */

			viewBox : Lyte.attr( 'string', { default : '' } ),
			styleValue : Lyte.attr( 'string', { default : '' } ),

			undoQueue : Lyte.attr( 'array', { default : [] } ),
			_undoQueue : Lyte.attr( 'array', { default : [] } ),
			redoQueue : Lyte.attr( 'array', { default : [] } ),

			details : Lyte.attr( 'object', { default : {} } ),

			textBoxArray : Lyte.attr( 'array', { default : [] } ),

			renderReconnect : Lyte.attr( 'boolean' ),
			reconnectStart : Lyte.attr( 'string', { default : 'display:none' } ),
			reconnectEnd : Lyte.attr( 'string', { default : 'display:none' } ),
			fakeData : Lyte.attr( 'array', { default : [] } ),

			onAnimation : Lyte.attr( 'boolean', { default : false } ),

			adjustPositions : Lyte.attr( 'array', { default : [] } )
		}		
	},

	focus : function(){
		this.$node.focus({
			preventScroll : true
		});
	},

	/* rendering a particular element which is not rendered in dom due to lazy loading. it will return a promise */

	render_module : function( module_data, parent_id, group_id ){
		var _this = this,
		details = this.data.details;

		if( group_id ){
			details = details[ group_id ].children;
		}

		var data = details[ parent_id ].data,
		fields = data.fields,
		index = typeof module_data == 'string' ? fields.findIndex( function( item ){
			return item.id == module_data;
		}) : fields.indexOf( module_data ),
		renderData = data.renderData;

		return new Promise( function( res ){
			if( index == -1 || index < renderData.length ){
				res();
			} else {
				_this.push_data_in_raf( renderData, fields, _this.get_element( parent_id, group_id ), index - renderData.length + 1, res )
			}
		});
	},

	/* Rendering a data in single shot in lazy loading causing frame loss. so rendering minimum data in RAF*/

	push_data_in_raf : function( renderData, fields, elem, ext_count, cb ){

		var data = this.data;

		if( !data ){
			return;
		}

		elem._frame_running = true;

		var len = renderData.length,
		cut_len = Math.min( len + ( ext_count || data.ltPropLazyLoading ), fields.length ),
		new_arr = fields.slice( len, cut_len ),
		__count = cut_len - len,
		raf = 'requestAnimationFrame',

		fn = function( count ){
			if( count > __count ){
				delete elem._frame_running;
				this.reroute_connectors( elem, new_arr, __count );
				this.add_more_data( elem );

				if( cb ){
					cb();
				}
				return;
			}
			Lyte.arrayUtils( renderData, 'push', new_arr.slice( count, count += 2 ) );
			window[ raf ]( fn.bind( this, count ) );
		};

		window[ raf ]( fn.bind( this, 0 ) );
	},

	/* For initial lazy load footer element will act as src / target element. After rendering original element connectors are drawn to its original elements*/

	reroute_connectors : function( elem, arr, count ){

		var data = this.data;

		if( !data ){
			return;
		}

		var modules = $L( elem.getElementsByTagName( 'lyte-connection-module' ) ),
		footer_elem = $L( data.ltPropSelectors.selector + ',lyte-connection-footer', elem ),
		footer_data = footer_elem.data( 'connection_elements' ) || {},
		list = [];

		// if( footer_elem.hasClass( 'lyteConnectorFieldHidden' ) ){
		// 	return;
		// }

		if( count == void 0 ){
			count = modules.length - 1;
		}

		for( var i = 0; i <= count; i++ ){
			var cur = modules.get( -1 - i );
			if( cur ){
				this.check_reroute( footer_data, cur, list, footer_elem );
			}
		}

		this.update_position( void 0, void 0, list );
	},

	/* Changing element for a single connector*/

	check_reroute : function( footer_data, cur, list, footer_elem ){

		var src_class = 'lyteConnectionSrcElement',
		target_class = 'lyteConnectionTargetElement',
		contain_src,
		contain_target,
		connection_elements = "connection_elements";

		for( var key in footer_data ){
			var value = footer_data[ key ].connector,
			is_src = /^src_/i.test( key ),
			query = value.data( ( is_src ? 'src' : 'target' ) + '_query' );
			
			if( cur.matches( query ) ){ 
				var $elem = $L( cur ),
				ns = is_src ? 'src' : 'target',
				elem_data = $elem.data( connection_elements ),
				index = list.indexOf( cur );

				if( !elem_data ){
					$elem.data( connection_elements, elem_data = {} );
				}

				elem_data[ key ] = {
					connector : value
				};

				$elem.addClass( is_src ? src_class : target_class );

				value.data( ns, $elem );
				delete footer_data[ key ];

				if( index == -1 ){
					list.push( cur );
				}
			} else {
				if( is_src ){
					contain_src = true;
				} else {
					contain_target = true;
				}
				continue;
			}
		}

		if( !contain_src ){
			footer_elem.removeClass( src_class );
		}

		if( !contain_target ){
			footer_elem.removeClass( target_class );
		}
	},

	/* Checking scroll end*/

	add_more_data : function( elem ){

		var data = this.data;

		if( !data || data.ltPropLazyLoading == void 0 || elem._frame_running ){
			return true;
		}

		var prefix = this.data.ltPropIdPrefix, 
		id = elem.id.replace( prefix, '' ),
		is_nested = $L( elem ).hasClass( 'lyteConnectInnerItem' ),
		details,
		__details = this.data.details;

		if( is_nested ){
		   __details = __details[ elem.parentNode.id.replace( prefix, '' ) ].children;
		} 

		details = __details[ id ].data;

		var scroll_elem = elem.getElementsByTagName( 'lyte-connection-content' )[ 0 ],
		renderData = details.renderData || [],
		fields = details.fields || [];

		if( renderData.length == fields.length ){
			return true;
		}

		if( scroll_elem ){
			var sH = scroll_elem.scrollHeight,
			oH = scroll_elem.offsetHeight,
			sT = scroll_elem.scrollTop;

			if( sT + oH + 10 > sH ){
				this.push_data_in_raf( renderData, fields, elem );
				return false;
			}
		}

		return true;
	},

	/* constructing rendering elements for lazyloading */

	construct_lazy : function( item ){

		if( !this.data.ltPropLazyLoading ){
			return;
		}

		var children = item.children;
	
		if( children ){
			children.forEach( this.construct_lazy.bind( this ) );
		} else {
			var fields = item.fields;
			fields && Lyte.objectUtils( item, 'add', 'renderData', fields.slice( 0, this.data.ltPropLazyLoading ) );
		}
	},

	/* Finding elements not having positions and constructing lazy loading details*/

	data_obs : function( arg ){

		if( arg ){
			Array.from( this.$node.getElementsByClassName( 'lyteConnectionContainer' ) ).forEach( function( item ){
				this.$node.disConnect( item, false, true );
			}.bind( this ) );

			this.setData( 'details', {} );

			this._boundary();
		}

		var data = this.data.ltPropData,
		modules_without_position = {};

		data.forEach( function( item ){
			this.construct_lazy( item );
			var pos = item.position;
			if( !pos || Object.keys( pos ).length == 0 ){
				modules_without_position[ item.id ] = true;
			}
		}.bind( this ));

		this._position_find = modules_without_position;

	}.observes( 'ltPropData' ).on( 'init' ),

	readonly_obs : function(){
		var __value = this.data.ltPropReadonly;
		$L( this.$node )[ ( __value ? 'add' : 'remove' ) + 'Class' ]( 'lyteConnectReadonly' ).data( 'connection_data' ).readonly = __value;
	}.observes( 'ltPropReadonly' ).on( 'didConnect' ),

	/* Updating svg viewbox*/

	view_obs : function(){
		clearTimeout( this._viewtime );
		this._viewtime = setTimeout( this._view_obs.bind( this ), 0 );
	}.observes( 'ltPropBoundary' ),

	_view_obs : function(){
		var data = this.data,
		boundary = data.ltPropBoundary,
		offset = ( data.ltPropOffset || 0 ),
		__width = data.ltPropWidth,
		__height = data.ltPropHeight,
		_left = Math.min( Math.min( 0, boundary.left ) - offset, -__width / 2 ),
		_top = Math.min( Math.min( 0, boundary.top ) - offset, -__height / 2 );

		this.setData( 'viewBox', _left + ' ' + _top + ' ' + __width + ' ' + __height );
		this.setData( 'styleValue', "left:" + _left + 'px;top:' + _top + 'px' );

		if( this.__preview_grp ){
			this.setup_viewbox();
		}
	},

	/* Updating view box in every shape move*/

	update_viewbox : function(){
		var details = this.data.details,
		min_x = Infinity,
		min_y = min_x,
		boundary = this.data.ltPropBoundary,
		max_x = 0,
		max_y = max_x;

		for( var key in details ){
			var cur = details[ key ].position;

			min_x = Math.min( cur.left, min_x );
			min_y = Math.min( cur.top, min_y );

			max_x = Math.max( cur.left + cur.width, max_x );
			max_y = Math.max( cur.top + cur.height, max_y );
		}

		boundary.left = min_x;
		boundary.top = min_y;

		// if( !isNaN( max_x ) ){
			boundary.right = max_x;
		// }

		// if( !isNaN( max_y ) ){
			boundary.bottom = max_y;
		// }

		this._view_obs();
	},

	__update_conn : function(){
		Array.from(this.__wrapper.children).forEach( function( item ){
			this.update_position(item);
		}.bind( this ));
	},

	__update_fn : function( cb, arg ){
		this.setTranslate();
		this.getMethods( cb ) && this.executeMethod( cb, arg, this.$node );
	},

	scroll_obs : function( arg ){
		arg.event = this.__evt;
		this.__update_fn( 'onScroll', arg );
		this.data.ltPropSwimLanes && this.__update_conn();
	}.observes( 'ltPropScrollTop', 'ltPropScrollLeft' ),

	zoom_obs : function( arg ){
		this.zoom_to(arg.newValue, undefined, arg.oldValue);
		this.__update_fn( 'onZoom', arg );
		clearTimeout( this.__zoomtime );
		this.__zoomtime = setTimeout( this._boundary.bind( this, true ), 20 );
	}.observes( 'ltPropScale' ),

	setTranslate : function(){
		clearTimeout( this._transtime );
		this._transtime = setTimeout( this._setTranslate.bind( this ), 0 );
	},

	_setTranslate : function(){
		var data = this.data,
		sL = data.ltPropScrollLeft,
		sT = data.ltPropScrollTop,
		scale = data.ltPropContextualWheel ? 1 : data.ltPropScale;

		$L( this.__wrapper ).css({
			transform : "translate(" + sL + 'px,' + sT + 'px) scale(' + scale + ',' + scale + ')'
		});

		this.setup_viewbox();
	},

	didDestroy : function(){
		var _remove = "removeEventListener",
		_this = this,
		fdom = _this.___fdom;

		document[ _remove ]( 'click', _this._click );

		if( fdom ){
			$L.fastdom.clear( fdom );
			delete _this.___fdom;
		}

		$L.fastdom.clear( _this._bmeasure );

		delete _this._click;
		delete _this.__wrapper;
		delete _this._horismart;
		delete _this._vertsmart;
		if( _this._preview ){
			_this.__wormhole.remove();
			delete _this._preview;
			delete _this.__preview_grp;
			delete _this.__wormhole;
		}

		window[ _remove ]( 'resize', _this._resize, true );
		window[ _remove ]( 'orientationchange', _this._resize, true );
		clearTimeout( _this._resize_time );
		delete _this._resize;
	},

	/* Zooms to given scale wrt given origin*/

	zoom_to : function( __scale, origin, oldScale ){

		var data = this.data;
		if( data.ltPropContextualWheel ){
			return this.contextual_zoom_wheel( __scale, origin )
		}
		var elem = this.__wrapper,
		width = elem.offsetWidth * 0.01,
		height = elem.offsetHeight * 0.01,
		bcr = elem.getBoundingClientRect(),
		this_bcr = this.$node.getBoundingClientRect(),
		sl = 'ltPropScale',
		sL = 'ltPropScrollLeft',
		sT = 'ltPropScrollTop',
		new_scale = Math.max( data.ltPropMinScale, Math.min( __scale, data.ltPropMaxScale ) ),
		scale = oldScale || data[ sl ],
		origin_x = origin == void 0 ? ( this_bcr.left + this_bcr.width * 0.5 ) : origin.left,
		origin_y = origin == void 0 ? ( this_bcr.top + this_bcr.height * 0.5 ) : origin.top,
		match = [ null, 50, 50 ],
		mid_x = parseFloat( match[ 1 ] ),
		mid_y = parseFloat( match[ 2 ] ),
		new_x = ( origin_x - bcr.left ) / bcr.width * 100,
		new_y = ( origin_y - bcr.top ) / bcr.height * 100,
		obj = {};

		obj[ sl ] = new_scale;
		obj[ sL ] = data[ sL ] + ( scale - new_scale ) * width * ( new_x - mid_x );
		obj[ sT ] = data[ sT ] + ( scale - new_scale ) * height * ( new_y - mid_y );

		this.setData( obj );
	},

	scroll_to : function( sL, sT ){
		this.setData( {
			ltPropScrollLeft : sL,
			ltPropScrollTop : sT
		});
	},

	click : function( evt ){

		if(this.data.onAnimation){
			return;
		}

		if( this.__ignoreclick ){
			delete this.__ignoreclick;
			return;
		}

		var is_shift = evt.shiftKey,
		target = evt.target;

		if( !this.$node.contains( target ) ){
			return;
		}

		var elem = target.closest( 'lyte-connect-item:not(.lyteConnectInnerItem)' ),
		suggest_elem=target.closest( 'lyte-suggestion-element' );

		if( !is_shift ){
			this.resetSelected( elem, evt );
		}

		if( elem && !suggest_elem && !(this.data.ltPropGroupArrange && target.closest('.lyteConnectInnerItem'))){
			this.select( evt, elem );
		}	
	},

	select : function( evt, elem ){
		var cb = "onBeforeSelect",
		__data = this._data,
		item = this._item,
		details = this.data.details,
		data = details[ elem.id.replace( this.data.ltPropIdPrefix, '' ) ].data,
		index = __data.indexOf( data );

		if( ( index + 1 ) || ( this.getMethods( cb ) && this.executeMethod( cb, evt, elem, this.$node ) == false ) ){
			return;
		}

		item.push( $L( elem ).addClass( 'lyteConnectionSelected' ) );
		__data.push( data );

		this.hover_fn( elem, evt, 'addClass', void 0, void 0, 'lyteConnectShapeSelected' );

		this.getMethods( cb = "onShapeSelect" ) && this.executeMethod( cb, evt, elem, this.$node );
	},

	unselect : function( evt, elem ){
		var cb = "onBeforeUnselect",
		__data = this._data,
		item = this._item,
		details = this.data.details,
		data = details[ elem.id.replace( this.data.ltPropIdPrefix, '' ) ].data,
		index = __data.indexOf( data );

		if( index == -1 || ( this.getMethods( cb ) && this.executeMethod( cb, evt, elem, this.$node ) == false ) ){
			return;
		}

		item.splice( index, 1 );
		__data.splice( index, 1 );

		if (this.data.ltPropSuggestion) {
			Lyte.objectUtils(data, "delete", "selected");
		}

		$L( elem ).removeClass( 'lyteConnectionSelected' ).removeData( 'position' );
		this.hover_fn( elem, evt, 'removeClass', void 0, void 0, 'lyteConnectShapeSelected' );

		this.getMethods( cb = "onShapeUnselect" ) && this.executeMethod( cb, evt, elem, this.$node );
	},

	/* Zoom by wheel*/

	wheel_zoom : function( evt ){

		if( $L( this.$node ).data( 'transition' ) ){
			evt.preventDefault();
			return;
		}

		var deltaX = evt.deltaX,
		deltaY = evt.deltaY,
		data = this.data,
		obj = data.ltPropZoomControl,
		// drag_ctrl = data.ltPropWheelDragControl,
		fn = function( key, _obj ){
			return !!_obj[ key ] == evt[ key ];
		},
		allow = ( fn( 'metaKey', obj ) || fn( 'ctrlKey', obj ) ) && fn( 'shiftKey', obj ) && fn( 'altKey', obj ),
		// allow_drag = ( fn( 'metaKey', drag_ctrl ) || fn( 'ctrlKey', drag_ctrl ) ) && fn( 'shiftKey', drag_ctrl ) && fn( 'altKey', drag_ctrl ),
		scale = data.ltPropScale,
		is_contextual = data.ltPropContextualWheel,
		should_prevent,
		seed_pinch = is_contextual ? 0.001 : 0.01,
		abs_x = Math.abs( deltaX ),
		abs_y = Math.abs( deltaY );

		if( is_contextual && scale < 0.2 ){
			seed_pinch = 0.01;
		}

		if( allow ){
			/* Basic concept taken from pinch zoom of zoho show */
			if( abs_x < abs_y ){

				evt.preventDefault();
				// if( abs_y < 5 ){
				// 	return;
				// }

				var sign = deltaY > 0;

					if( abs_y > 120 ){
						if( sign ){
							deltaY = 120;
						} else{
							deltaY = -120;
						}
					}

				var delta = -deltaY * ( evt.deltaMode ? 120 : 1 ),
				newScale = Math.pow( 2, delta * seed_pinch ) * scale;

				if( is_contextual ){
					clearTimeout( this.__wheel );
					this.__wheel = setTimeout(function (newScale) {
						var data = this.data,
							oldScale = data.ltPropScale,
							// newScale = Math.max(Math.min(newScale, data.ltPropMaxScale), data.ltPropMinScale),
							isIncrease = newScale > oldScale,
							zoomData = Object.keys(data.ltPropContextualZoomData).map(Number),
							curLevel = data.ltPropContextualZoomLevel,
							curInd,
							updLevel;

						zoomData.indexOf(100) == -1 && zoomData.push(100);

						curInd = zoomData.indexOf(curLevel);

						// setTimeout( function(){
						// 	this.setData('wheelZoom',false);
						// }.bind( this ), 200  ) 

						if (newScale == oldScale || curInd == -1) {
							return;
						}

						if (isIncrease) {
							if (curInd < zoomData.length - 1) {
								updLevel = zoomData[curInd + 1];
							}
						} else {
							if (curInd > 0) {
								updLevel = zoomData[curInd - 1];
							}
						}

						if (updLevel == void 0 || updLevel == curLevel) {
							return;
						}

						this.setData('ltPropScale', newScale);

						this.setData('ltPropContextualZoomLevel', updLevel);

					}.bind(this), 20, newScale);
				} else {
					this.zoom_to( newScale, { left : evt.clientX, top : evt.clientY } );
				}
			}
		} else {
			var boundary = data.ltPropBoundary,
			wwidth = Math.min( window.innerWidth, this.$node.offsetWidth ),
			wheight = Math.min( window.innerHeight, this.$node.offsetHeight );

			if( evt.shiftKey ){
				if( abs_x < abs_y ){
					abs_x = abs_y;
					abs_y = 0;
					deltaX = deltaY;
				} else{
					abs_x = abs_y = 0;
				}
			}

			if( abs_x > abs_y ){
				var sl_str = "ltPropScrollLeft",
				old = data[ sl_str ];

				this.__evt = evt;
				this.setData( sl_str, this.drag_min_max( -deltaX, old, boundary, 'x', wwidth ) );
				delete this.__evt;

				should_prevent = data[ sl_str ] != old;
			} else {
				var st_str = "ltPropScrollTop",
				scroll_parent = evt.target.closest( 'lyte-connection-content' ),
				old = data[ st_str ];

				if( scroll_parent && !$L( this.__wrapper ).hasClass( 'preventWheel' ) ){
					var sH = scroll_parent.scrollHeight,
					oH = scroll_parent.offsetHeight,
					sT = scroll_parent.scrollTop,
					allow = deltaY > 0;

					if( !data.ltPropScrollHandling ){
						return;
					}

					if( allow && data.ltPropLazyLoading ){
						var act_elem = scroll_parent.closest( 'lyte-connect-item' ),
						parent = $L( act_elem ).hasClass( 'lyteConnectInnerItem' ) ? act_elem.closest( '.lyteConnectGroupShape' ) : void 0,
						details = data.details,
						act_data,
						replace_id = data.ltPropIdPrefix,
						child_id = act_elem.id.replace( replace_id, "" );

						if( parent ){
							act_data = details[ parent.id.replace( replace_id, "" ) ].children;
						} else{
							act_data = details;
						}

						act_data = act_data[ child_id ].data;

						allow = act_data.fields.length == act_data.renderData.length;
					}

					if( !( ( sT == 0 && deltaY < 0 ) || ( sT + oH == sH && allow ) ) ){
						return;
					}
				}

				this.__evt = evt;
				this.setData( st_str, this.drag_min_max( -deltaY, old, boundary, 'y', wheight ) );
				delete this.__evt;

				should_prevent = data[ st_str ] != old;

				if( should_prevent ){
					var cb = "onDrag";

					this.getMethods( cb ) && this.executeMethod( cb, evt, this.$node );
					this.getMethods( cb = "onDragEnd" ) && this.executeMethod( cb, evt, this.$node ); 
				}
			}

			if (should_prevent || $L( _lyteUiUtils.getCurrentTarget( evt ) ).hasClass("lyteConnectPreview")) {
				evt.preventDefault();
			}
		}

	},

	didConnect : function(){

		var $node = $L( this.$node ),
		node = this.$node,
		data = this.data,
		contextual = data.ltPropContextualZoom,
		_add = 'addEventListener',
		callback_fn = function( callback ){
			return this.getMethods( callback ) && this.executeMethod.apply( this, arguments );
		},
		default_obj = data.ltPropSelectors,
		markerData = data.ltPropMarkerData,
		query = (data.ltPropQuery && $L(data.ltPropQuery)) || {},
		preview = $L(".lyteConnectPreview", query.length ? query : node),
		markerDim = data.ltPropLineMarkerDimension;

		this.__wrapper = node.querySelector( '.lyteConnectWrapper' );

		this._click = this.click.bind( this );

		document[ _add ]( 'click', this._click );

		if( ( data.ltPropWheelZoom && !contextual ) || ( contextual && data.ltPropContextualWheel ) ){
			node[ _add ]( 'wheel', this.wheel_zoom.bind( this ), true );
			data.ltPropPreviewScroll && preview.get(0)[ _add ]( 'wheel', this.wheel_zoom.bind( this ), true );
		}

		this.setTranslate();

		/* Connection plugin binding*/

		var obj = $L.extend({ 
			connection_type : data.ltPropConnectionType,
			connector_radius : data.ltPropConnectorRadius,
			avoid_with_module : data.ltPropAvoidWithModule,
			check_break : data.ltPropCheckLineBreak,
			elbow_arc : data.ltPropElbowArc,
			avoid_line : data.ltPropAvoidLine,
			textbox_avoidance : data.ltPropTextBoxAvoidance,
			line_marker : data.ltPropLineMarker,
			module : "lyte-connect-item",
			default_top : "lyte-connection-header", 
			default_bottom : "lyte-connection-footer",
			scroll_parent : "lyte-connection-content",
			wrapperElement : $node.find( '.lyteConnectionMarker' ).get( 0 ),
			offset : {
				left : 12,
				top : 12,
				right : 12,
				bottom : 12
			},
			curve_offset : data.ltPropCurveOffset,
			swimlanes : data.ltPropSwimLanes,
			hanging : data.ltPropHanging,
			elbowAvoidance : data.ltPropElbowAvoidance,

			textbox_avoidance_with_line : data.ltPropTextBoxAvoidanceWithLine,

			min_width : markerDim.min_width,
			min_height : markerDim.min_height,
			max_width : markerDim.max_width,
			max_height : markerDim.max_height,

			setScroll : function( _left, value, window_dimension ){
				var ns = "ltPropScroll" + _left,
				boundary = this.data.ltPropBoundary,
				__x = _left == "Left" ? 'x' : 'y',
				scale = this.data.ltPropScale,
				exp_value = Math.min( Math.max( this.data[ ns ] + value, boundary[ 'min_mid_' + __x ] * scale - ( ( 1 - scale ) * window_dimension / 2 ) ), window_dimension - window_dimension * ( 1- scale ) / 2 + boundary[ 'max_mid_' + __x ] * scale );

				this.setData( ns, exp_value );
			}.bind( this ),

			getScroll : function(){
				var data = this.data;
				// return{
				// 	left : 0,
				// 	top : 0
				// };
				return{
					left : data.ltPropScrollLeft,
					top : data.ltPropScrollTop
				}
			}.bind( this ),

			getBoundary : function(){
				return data.ltPropBoundary;
			}.bind( this ),

			getScale : function(){
				return data.ltPropContextualWheel ? 1 : data.ltPropScale;
			}.bind( this ),

			getData: function (id) {
				return this.get_details(id)
			}.bind(this),

			getRanges : function( ignoreParent ){
				return this.getRanges( ignoreParent );
			}.bind( this ),

			splitRanges : function( ranges ){
				return this.split_ranges_with_shapes( ranges, [] );
			}.bind( this ),

			splitIndiv : this.split_ranges.bind( this ),

			join_ranges : this.join_ranges.bind( this ),

			setHanging : this.setHanging.bind( this ),

			get_element : this.get_element.bind( this )

		}, default_obj );

		obj.onReconnect = this.onReconnect.bind( this );
		obj.onConnectionCreate = this.onConnectionCreate.bind( this );
		obj.onConnectionUpdate = this.onConnectionUpdate.bind( this );
		obj.attr_fn = this.onBeforeConnectionUpdate.bind( this );
		obj.onBeforeReconnectSelect = this.onBeforeReconnectSelect.bind( this );
		obj.onBeforePathChange = function( svg, path, start, end ){
			return this.getMethods("onBeforePathChange") && this.executeMethod("onBeforePathChange",svg, path, start, end, this.$node );
		}.bind(this);

		obj.onConnectionLeave = obj.onConnectionHover = this.toggle_hover.bind( this );

		[ "onConnect", "onConnectionDisconnect", "onBeforeConnectionCreation", "onManualConnectionCreate" ].forEach( function( item ){
			obj[ item ] = callback_fn.bind( this, item );
		}.bind( this ) );

		$node.addClass( 'lyteConnectLoading' ).connection( obj );


		/* Basic utils */

		node.connect = function( src, target, options, ignore ){
			var __data = this.data,
			textBox = ( options || ( options = {} ) ).textBox;

			if( __data.ltPropTextBox && textBox != false ){
				var __arr = __data.textBoxArray,
				__index = __arr.length,
				__id;

				if( !textBox ){
					options.textBox = textBox = { text : [] };
				}

				__id = textBox.id = textBox.id || ( "text_box" + Date.now() + parseInt( Math.random() * 1000 ) );

				Lyte.arrayUtils( __data.textBoxArray, 'push', textBox );
				options.text_box = this.$node.querySelector( "#"+__id );
			}

			if( options.points ){
				options.deleteAfterUpdate = true;
			}

			if (options.hanging) {
				var hangId = 'lyteConnectFakeHangingItem_' + Date.now() + parseInt(Math.random() * 1e3),
					ignoreMinMax = this.data.ltPropIgnoreMinMax;
				this.setData('ltPropIgnoreMinMax', true);
				this.insert({
					id: hangId,
					class: "lyteConnectFakeHangingItem",
					position: options.trgPos
				});
				target = "#" + hangId;
				$L.fastdom.mutate(function () {
					$L.fastdom.measure(function () {
						$L.fastdom.mutate(function () {
							setTimeout(function () {
								this.setData('ltPropIgnoreMinMax', ignoreMinMax)
							}.bind(this), 0);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}

			$L( this.$node ).connection( 'create', src, target, options );

			delete options.text_box;

			if( !this.isUndo() && !ignore ){
				this.pushToQueue({
					type : "renderConnections",
					data : this.stringify([ { src : src, target : target, options : options } ])
				});
			}
		}.bind( this );

		node.hasConnected = function( src, target ){
			return $L( this ).connection( 'hasConnected', src, target );
		}.bind( this );

		node.disConnect = function( item, callback, ignore ){
			var is_not_undo = !this.isUndo(),
			cb = "onBeforeDisconnect",
			__data = this.data;

			if( is_not_undo && callback && this.getMethods( cb ) && this.executeMethod( cb, item.get( 0 ), this.$node ) == false ){
				return;
			}

			if( __data.ltPropPreview && __data.ltPropRenderConnectorsInPreview ){
				this.delete_connector_preview( item );
			}

			var ret = this.remove_connector( item );

			if( is_not_undo && !ignore ){
				this.pushToQueue({
					type : "deleteConnections",
					data : this.stringify( [ ret ] )
				});
			}

			return ret;
		}.bind( this );

		node.selectShape = function( elem, evt ){
			this.select( evt || {}, elem );
		}.bind( this );

		node.unSelectShape = function( elem, evt ){
			this.unselect( evt || {}, elem );
		}.bind( this );

		node.unSelectShapes = function( evt ){
			var $node = this.$node,
			selected = Array.from( $node.getSelected() );

			selected.forEach( function( item ){
				$node.unSelectShape( this.get_element( item.id ), evt );
			}.bind( this ) );
		}.bind( this );

		node.arrange = this.arrange.bind( this );

		node.scroll_to = this.scroll_to.bind( this );

		node.deleteShape = this.delete.bind( this );
		node.insertShape = this.insert.bind( this );
		node.getSelected = function(){
			return this._data || [];
		}.bind( this );

		node.resetSelected = this.resetSelected.bind( this );

		node.groupSelected = this.group.bind( this );
		node.unGroup = this.ungroup.bind( this );
		node.addToGroup = this.addgroup.bind( this );
		node.removeFromGroup = this.removegroup.bind( this );
		node.moveToCenter = this.moveToCenter.bind( this );
		node.moveToShape = this.moveToShape.bind( this );
		node.resetQueue = this.resetQueue.bind( this );
		node.hideShape = this.hideShape.bind( this );
		node.showShape = this.showShape.bind( this );
		node.getConnections = this.getConnections.bind( this );
		node.getConnectionDetails = this.getConnectionDetails.bind( this );
		node.getAllConnections = this.getAllConnections.bind( this );

		node.showFieldConnectors = this.show_field.bind( this );
		node.hideFieldConnectors = this.hide_field.bind( this );

		node.addText = this.addText.bind( this );
		node.removeText = this.removeText.bind( this );
		node.updateText = this.updateText.bind( this );
		node.getConnectorFromTextbody = this.getConnectorFromTextbody.bind( this );
		node.updateConnectorId = this.updateConnectorId.bind( this );
		node.getConnectorTextbody = this.getConnectorTextbody.bind( this );

		node.showAll = this.showAll.bind( this );

		node.hideAll = this.hideAll.bind( this );

		node.refreshConnectors = function( id, only_start ){
			var details = this.data.details;

			if( id ){
				this.update_position( this.get_element( id ), only_start );
			} else {
				for( var key in details ){
					this.update_position( this.get_element( key ), only_start );
				}
			}
		}.bind( this );

		node.renderModule = this.render_module.bind( this );

		node.resizeView = this.resize_fn.bind( this );

		node.undo = this.undo.bind( this, 'undoQueue', 'redoQueue', true );
		node.redo = this.undo.bind( this, 'redoQueue', 'undoQueue' );
		node.pushToQueue = this.pushToQueue.bind( this );

		node.checkInViewPort = this.checkInViewPort.bind(this);// check items are in visible area

		node.tracePath = this.tracePath.bind(this);// animation and highlight for the paths from src to target 

		node.showCommonConnector = this.showCommonConnector.bind(this);// connect the connections to the text box

		node.hideCommonConnector = this.hideCommonConnector.bind(this);// hide the common connector

		node.getNearestAnchor = this.getNearestAnchor.bind(this);// get nearest anchor avail point

		node.rerouteConnectors = this.reroute_connectors.bind(this);

		node.refreshItem = this.refreshItem.bind(this);

		node.updateConnectionPoint = function (connector, points) { // set points to connect (adjust points)
			var opt = $L.extend({}, $L(connector).data('options'));
			opt.points = points;
			opt.deleteAfterUpdate = true;
			$L(connector).data('options', opt);
		}.bind(this);

		node.updateIndividualConnection = function (connector) { // update Individual Connection
			$L(this.$node).connection("updateConnection", $L(connector));
		}.bind(this);

		node.updateItem = this.updateItem.bind(this), //check (item and connection)overlap and update positions

		node.getNodesInSeries = this.getNodesInSeries.bind(this);// get nodes in series both prev and next

		node.getNodesNotInSeries = this.getNodesNotInSeries.bind(this);// !getNodesInSeries

		node.insertField = function () { // insert field // parent child index
			this.updateField.apply(this, ["add"].concat(Array.from(arguments)))
		}.bind(this);

		node.deleteField = function () { // delete field // child parent
			this.updateField.apply(this, ["delete"].concat(Array.from(arguments)))
		}.bind(this);

		node.updateConnectionPosition = function (connector, src, trg) { // set connection position
			var $connector = $L(connector),
				opt = $connector.data('options');
			src && (opt.src_position = src);
			trg && (opt.target_position = trg);
			this.$node.updateIndividualConnection($connector);
		}.bind(this);

		node.updateConnectionOrigin = function (connector, src, trg) {
			if (src || trg && connector && connector.length) {
				var ret = $L(this.$node).connection("updateConnectionElement", { src: src, target: trg }, connector);
				if (ret && !this.isUndo()) {
					var id = ret.connector.id;
					src = ret.src;
					trg = ret.target;
					src && (src.old.id != src.new.id) && this.pushToQueue({
						type: "updateConnectionOrigin",
						data: this.stringify({ connector: '#' + id, oldSrc: src.old.id, src: src.new.id })
					});
					trg && (trg.old.id != trg.new.id) && this.pushToQueue({
						type: "updateConnectionOrigin",
						data: this.stringify({ connector: '#' + id, oldTrg: trg.old.id, trg: trg.new.id })
					});
					return ret;
				}
			}
		}.bind(this);

		this._resize = this.resize_fn.bind( this );
		window[ _add ]( 'resize', this._resize, true );
		window[ _add ]( 'orientationchange', this._resize, true );

		if( data.ltPropPreview ){
			this._preview = $L( '.lyteConnectPreview', this.__wormhole ).get( 0 );
			$L.fastdom.mutate( this.initiate_preview.bind( this ) );
		}

		if( data.ltPropSmartGuide ){
			var elems = $L( this.__wrapper ).children( '.lyteSmartGuides' );
			this._horismart = elems.eq( 0 );
			this._vertsmart = elems.eq( 1 );
		}

		var zoom_level = data.ltPropContextualZoomLevel;

		if( zoom_level != 100 ){
			$node.addClass( 'lyteConnectContextualLevel' + zoom_level );
			node.style.setProperty( '--contextualLevel', zoom_level );
		}

		// $L.fastdom.measure( function(){
			// 	$L.fastdom.mutate( function(){
				this.__cb = function(){
					$node.removeClass( 'lyteConnectLoading' );
					var cb = 'afterRender';

					if( this.getMethods( cb ) ){
						this.executeMethod( cb, this.$node );
					}

				}.bind( this );

				this._boundary();
			// 	}, this );
		// }, this );

		this._data = [];
		this._item = [];

		if( markerData && !data.ltPropSwimLanes){
			this.create_marker( markerData );
		}

		data.ltPropShowAnchors && $L(this.__wrapper).addClass( 'lyteConnectShowAnchor' );
	},

	showAll:function(arr){
		var tot_details = this.data.details,
			tot_details_len = Object.keys(tot_details).length,
			param_len = arr ? (arr.length == tot_details_len) ? true : false : true,
			details = arr || tot_details,
			bool = false;
		for(var i in tot_details){
			var _class = tot_details[i].data.class;
			if(_class && _class.indexOf("lyteConnectHiddenElem") != -1){
				--tot_details_len;
			}
		}
		bool=(tot_details_len == 0) && param_len ?true:false;
		if(Array.isArray(details)){
			details.forEach(function (item) {
				this.showShape(item, undefined, bool);
			}.bind(this))
		}else{
			for(var i in details ){

				if( /lyteForceHidden/i.test( i.class || "" ) ){
					continue;
				}

				this.showShape(i, undefined , bool);
			};
		}
		bool && this.arrange();
	},

	hideAll:function(arr){
		var details = arr || this.data.details;
		if(Array.isArray(details)){
			details.forEach( function( item ){
				this.hideShape(item);
			}.bind( this ))
		}else{
			for(var i in details ){
				this.hideShape(i);
			}
		}
	},

	create_marker : function( data ){
		var str = "ht" + "tp://" + "www.w3.org/2000/svg",
		svg = this.__wrapper.getElementsByTagName( 'svg' )[ 0 ].children[ 0 ],
		fn = function( __data ){
			var elem = document.createElementNS( str, __data.tag ),
			__attr = __data.attr || {};

			for( var key in __attr ){
				elem.setAttribute( key, __attr[ key ] );
			}

			( __data.children || [] ).forEach( function( item ){
				elem.appendChild( fn( item ) );
			});

			return elem;
		};

		data.forEach( function( item ){
			svg.appendChild( fn( item ) );
		});
	},

	onReconnect : function( src, old_target, new_target, $node, evt, connection, new_pos, old_pos, ns ){
		
		ns = ns || "target";

		var cb = "onReconnect",
		has_callback = this.getMethods( cb ),
		ret = has_callback && this.executeMethod( cb, src, old_target, new_target, $node, evt, connection, new_pos, old_pos, ns ),
		obj = {
			old_pos : old_pos,
			new_pos : new_pos,
			ns : ns,
			id : connection.id
		};

		if( has_callback ){
			if( ret == false ){
				return false;
			}
		}

		if( isNaN(new_pos.x) || isNaN(new_pos.y) ){
			return false;
		}

		if( ns == "src" ){
			$L.extend( obj, { 
				old_value : src.id, 
				new_value : old_target.id,
				other_value : new_target.id
			});
		} else {
			$L.extend( obj, { 
				other_value : src.id, 
				old_value : old_target.id,
				new_value : new_target.id
			});
		}

		this.pushToQueue({
			type : "reconnect",
			data : this.stringify( obj )
		});

		return new_target;
	},

	getAllConnections : function(){
		var node = this.$node,
		$node = $L( node ),
		elems = Array.from( node.getElementsByClassName( 'lyteConnectionContainer' ) );

		return elems.map( function( item ){
			return this.getConnectionDetails( item );
		}.bind( this ));
	},

	getConnections : function( elem ){
		var $node = $L( this.$node ),
		_this = this,
		fn = function( item ){
			var ret = $node.connection( 'getConnections', item ),
			src = [],
			target = [];

			ret.src.forEach( function( _item ){
				src.push( _this.getConnectionDetails( _item ) );
			});

			ret.target.forEach( function( _item ){
				target.push( _this.getConnectionDetails( _item ) );
			});

			return {
				src : src,
				target : target
			};
		};

		if( /lyte-connect-item/i.test( elem.tagName ) ){
			var elems = Array.from( elem.querySelectorAll( '.lyteConnectionSrcElement,.lyteConnectionTargetElement' ) ),
			ret = {
				src : [],
				target : []
			},
			LC = Lyte.arrayUtils;

			elems.push( elem );

			elems.forEach( function( item ){
				var indiv = fn( item );

				LC( ret.src, 'push', indiv.src );
				LC( ret.target, 'push', indiv.target );
			});

			return ret;
		} else{
			return fn( elem );
		}
	},

	getConnectionDetails : function( elem ){
		var $elem = $L( elem ),
		data = $elem.data(),
		active_src = data.active_src,
		active_target = data.active_target,
		query = 'lyte-connect-item',
		__src = data.src.get( 0 ),
		__target = data.target.get( 0 ),
		obj = {
			src : __src,
			target : __target,
			active_target : active_target || __target,
			active_src : active_src || __src,
			src_query : data.src_query,
			target_query : data.target_query,
			connection_elem : $elem.get( 0 ),
			src_module : active_src ? active_src.closest( query ) : __src,
			target_module : active_target ? active_target.closest( query ) : __target,
			src_position : data.src_position,
			target_position : data.target_position,
			textBox : data.text_box
		};

		if( this.data.ltPropAdjustLines ){
			var pts = $elem.data( "absolute_points" ) || [];
			obj.points = this.points_to_modifier( pts );
			obj.absolute_points = pts;
		}

		return obj;
	},

	checkInViewPort: function (elem) {
		var connDetails = this.getConnectionDetails(elem),
			conn = this.$node,
			data = this.data,
			details = data.details,
			connLeft = conn.offsetLeft,
			connTop = conn.offsetTop,
			$elem = $L(elem).data(),
			retVal = {};
		["src", "target"].forEach(function (item) {
			var curItem = connDetails[item],
				curPos = details[curItem.id].position,
				itemLeft = curPos.left + data.ltPropScrollLeft + curPos.width / 2,
				itemTop = curPos.top + data.ltPropScrollTop + curPos.height / 2;
			retVal[item] = curItem;
			retVal[item + "InViewPort"] = true;
			if (connLeft > itemLeft || connTop > itemTop || connLeft + conn.offsetWidth < itemLeft || connTop + conn.offsetHeight < itemTop) {
				retVal[item + "InViewPort"] = false;
			}
		})
		return retVal;
	},

	show_field : function( item ){
		this.toggle_individual_field( 1, item, 1 );
	},

	hide_field : function( item ){
		this.toggle_individual_field( 0, item, 1 );
	},

	toggle_individual_field : function( show, item, call_recheck, showAll){
		var $node = $L( this.$node ),
		__elem = $node.find( item ),
		class_name = "lyteConnectHiddenElem",
		hidden_cls = 'lyteConnectorFieldHidden',
		addClass = show ? 'removeClass' : "addClass",
		_break = this.data.ltPropCheckLineBreak,
		item_str = 'lyte-connect-item',
		outer_fn = function( ret ){
			ret.src.concat( ret.target ).forEach( function( _item ){
				var conn_data = _item.data(),
				__src = conn_data.src,
				__target = conn_data.target;

				if( call_recheck && ( item != conn_data.src_query && item != conn_data.target_query ) ){
					return;
				}

				if( show ){
					if( __src.get( 0 ).closest( '.' + class_name ) || __target.get( 0 ).closest( '.' + class_name ) ){
						return;
					}

					if( !call_recheck && _item.hasClass( hidden_cls ) ){
						return;
					}
				}

				var textBox = $L(_item.data('text_box'));

				_item[ addClass ]( class_name );
				textBox[ addClass ]( class_name );
				call_recheck && _item[ addClass ]( hidden_cls ) && textBox[ addClass ]( hidden_cls );

				if( _break && show && !showAll){
					$L.elbow.arc( _item.get( 0 ), {}, true );
				}
			});
		}

		outer_fn( $node.connection( 'getConnections', __elem.eq( 0 ) ) );

		if( __elem.length > 1 ){
			outer_fn( $node.connection( 'getConnections', __elem.eq( 1 ) ) );
		}

		if( call_recheck && !showAll){
			var shape = __elem.closest( item_str, $node ),
			prefix = this.data.ltPropIdPrefix,
			id = shape.get( 0 ).id.replace( prefix, '' ), 
			parent_id;

			if( $L( shape ).hasClass( 'lyteConnectInnerItem' ) ){
				parent_id = shape.parent().get( 0 ).id.replace( prefix, '' );
			}

			this.recheck_pos( id, parent_id );
		}
	},

	recheck_pos : function( id, parent_id, from_insert ){
		var parentOrChild = parent_id || id;

		if( from_insert ){
			var data = this.data;
			if (data.ltPropMoveOthers) {
				for (var i in data.details) {
					i != parentOrChild && this.check_position(i);
				}
			} else {
				this.check_position(parentOrChild);
			}
		} else {
			$L.fastdom.measure( function(){
				this.update_dimensions( parentOrChild );

				// if( parent_id ){
				// 	this.check_child_position( id, parent_id );
				// 	this.reset_group( parent_id );
				// }	

				this.check_position( parentOrChild );
			}.bind( this ));
		}
	},

	hideShape : function( id, parent_id, show, showAll){
		var __force;

		if( __force = parent_id == true ){
			parent_id = void 0;
		}

		var class_name = "lyteConnectHiddenElem" + ( __force ? " lyteForceHidden" : "" ),
		parentOrChild = parent_id || id,
		__detail = this.data.details[ parentOrChild ],
		elem = this.get_element( id, parent_id ),
		$node = $L( this.$node ),
		_break = this.data.ltPropCheckLineBreak,
		src_class = 'lyteConnectionSrcElement',
		target_class = 'lyteConnectionTargetElement',
		$elem = $L( elem ),
		is_src = $elem.hasClass( src_class ),
		is_target = $elem.hasClass( target_class );

		if( parent_id ){
			__detail = this.get_child_data( __detail.data.children, id );
		} else {
			__detail = __detail.data;
		}


		var __class = __detail.class || "",
		Lo = Lyte.objectUtils;

		if( show ){
			if( __class.indexOf( class_name ) == -1 ){
				return;
			}

			if( !__force && /lyteForceHidden/i.test( __class ) ){
				return;
			}

			Lo( __detail, 'add', 'class', ( __class.replace( class_name, '' ) ).trim() );
		} else {
			if( __class.indexOf( class_name ) + 1 ){
				return;
			}

			Lo( __detail, 'add', 'class', ( __class + " " + class_name ).replace( /^\s+/g, "" ) );
		}

		var connector_elems = Array.from( elem.querySelectorAll( '.' + src_class + ',.' + target_class ) );

		if( is_src || is_target ){
			connector_elems.push( elem );
			
			if( is_src ){
				$elem.addClass( src_class );
			} 

			if( is_target ){
				$elem.addClass( target_class );
			}
		}

		connector_elems.forEach( function( item ){
			this.toggle_individual_field( show, item, undefined, showAll);
		}.bind( this ) );

		if(!showAll){
			if( show ){
				this.recheck_pos( id, parent_id );
			} else {
				// if( parent_id ){
				// 	this.reset_group( parent_id );
				// }
				this._boundary();
				this.setup_viewbox();
	
				if( _break ){
					delete this._ranges;
					this.getRanges();
				}
			}
		}	
	},

	showShape : function( id, parent_id, showAll){
		this.hideShape( id, parent_id, true, showAll);
	},
 
	showCommonConnector: function (elem, avoid = []) {
		var tagName, textBox, conn,
			removeConnection = function (readOnly) {
				var connElem = $L(textBox).data('connection_elements'),
					ret = [];
				clearTimeout(this.commonConnectorTimout);
				for (var i in connElem) {
					var conn = connElem[i].connector,
						connId = conn.get(0).id;
					if (readOnly == true) {
						var data = conn.data();
						ret.push(data.active_src.id, data.active_target.id);
					} else if (connId.includes('lyteCommonConnection_')) {
						this.$node.disConnect($L('#' + connId));
					}
				}
				if (readOnly == true) {
					return ret;
				} else {
					textBox.removeEventListener('mouseleave', removeConnection);
				}
			}.bind(this),
			addConnection = function () {
				clearTimeout(this.commonConnectorTimout);
				this.commonConnectorTimout = setTimeout(() => {
					var details = this.data.details,
						textBoxPos = $L.extend({ width: textBox.offsetWidth, height: textBox.offsetHeight }, $L(textBox).data('position')),
						connDetails = this.getConnectionDetails(conn),
						curAvoid = $L.extend([], avoid);

					curAvoid.push(connDetails.src.id, connDetails.target.id);
					curAvoid = curAvoid.concat(removeConnection(true));

					textBoxPos.left = textBoxPos.x - textBoxPos.width / 2;
					textBoxPos.top = textBoxPos.y - textBoxPos.height / 2;
					textBoxPos.right = textBoxPos.left + textBoxPos.width;
					textBoxPos.bottom = textBoxPos.top + textBoxPos.height;

					for (var i in details) {
						var dataId = details[i].data.id,
							itemPos = $L.extend({}, details[i].position),
							src = { y: 0.5 },
							trg;
						if (!curAvoid.includes(dataId)) {
							itemPos.right = itemPos.left + itemPos.width;
							itemPos.bottom = itemPos.top + itemPos.height;
							if (
								(itemPos.left < textBoxPos.left && itemPos.right > textBoxPos.left) ||
								(itemPos.left < textBoxPos.right && itemPos.right > textBoxPos.right) ||
								(textBoxPos.left < itemPos.left && textBoxPos.right > itemPos.right)) {
								if (itemPos.top > textBoxPos.bottom) {
									src = { x: 0.5, y: 0 };
									trg = { x: 0.5, y: 1 };
								} else {
									src = { x: 0.5, y: 1 };
									trg = { x: 0.5, y: 0 };
								}
							} else {
								if (itemPos.left > textBoxPos.right) {
									src = { x: 0, y: 0.5 };
									trg = { x: 1, y: 0.5 };
								} else {
									src = { x: 1, y: 0.5 };
									trg = { x: 0, y: 0.5 };
								}
							}
							this.$node.connect("#" + dataId, "#" + textBox.id, { id: 'lyteCommonConnection_' + Date.now() + parseInt(Math.random() * 1e3), src_position: src, target_position: trg, textBox: false });
						}
					}
				}, 100);
				textBox.addEventListener('mouseleave', removeConnection);
			}.bind(this);

		elem = $L(typeof elem == "string" ? '#' + elem : elem).get(0);
		tagName = elem.tagName.toLowerCase();

		if (tagName == 'lyte-textbox') {
			conn = this.getConnectorFromTextbody(elem);
			textBox = elem;
		} else if (tagName == 'g') {
			conn = elem;
			textBox = this.getConnectionDetails(conn).textBox;
		} else {
			return;
		}

		this.commonConnector && this.hideCommonConnector();
		this.commonConnector = addConnection;
		textBox.addEventListener('mouseenter', this.commonConnector);
	},

	hideCommonConnector: function (elem) {
		clearTimeout(this.commonConnectorTimout);
		elem = $L(typeof elem == "string" ? '#' + elem : elem).get(0);
		(elem.tagName == 'LYTE-TEXTBOX' ? elem : this.getConnectionDetails(elem).textBox).removeEventListener('mouseenter', this.commonConnector);
		delete this.commonConnector;
	},

	tracePath : function (src, target, option) {
		if (src == "animation" || src == "removeAnimation") {
			var cur_ind = target && target.length - 1,
				speed = this.data.ltPropTracepathAnimationSpeed,
				g_tag,
				remove_event = function (element, g_tag) {
					this.setData("onAnimation", false);
					element.remove();
					g_tag.classList.remove("lyteConnectHighlightAnimation");
				}.bind(this),
				str_anime = function (item) {
					this.setData("onAnimation", true);
					g_tag = this.$node.querySelector("#" + item);
					var path_tag = g_tag.querySelector(".lyteConnectionPath"),
						path = path_tag.getAttribute('d'),
						distance = path_tag.getTotalLength(),
						time = JSON.stringify(distance / speed) + "s",
						anime_element = this.create_tag('animateMotion', {
							begin: 'indefinite',
							fill: "freeze"
						}),
						element = this.create_tag('circle', {
							r: "5",
							fill: "red"
						}),
						end_event = function () {
							remove_event(element, g_tag);
							--cur_ind >= 0 && str_anime(target[cur_ind]);
						};
					anime_element.setAttribute("dur", time);
					anime_element.setAttribute("path", path);
					g_tag.appendChild(element);
					element.appendChild(anime_element);
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							anime_element.beginElement();
						});
					});
					g_tag.classList.add("lyteConnectHighlightAnimation");
					anime_element.addEventListener('endEvent', end_event);
				}.bind(this);
			if (this.data.onAnimation || src == "removeAnimation") {
				var svg_comp = this.$node.querySelector(".lyteConnectHighlightAnimation"),
					element = svg_comp && svg_comp.querySelector('circle');
				element && remove_event(element, svg_comp);
				if (src == "removeAnimation") {
					return;
				}
			}
			cur_ind >= 0 && str_anime(target[cur_ind]);
		} else if (src == "removeHighlight") {
			var remove_class = function (_class) {
				var obj = this.$node.querySelectorAll("." + _class);
				obj.forEach(function (item) {
					item.classList.remove(_class);
				});
			}.bind(this);
			remove_class("lyteConnectShortestPathSelection");
			remove_class("lyteConnectPathSelection");
		} else if (option == "highlight" || option == "animation" || option == "removeHighlight" || option == "removeAnimation") {
			var prev_path = $L(this.$node).connection('getPrevious', target),
				possible_paths = {},
				curr_ind = 0,
				short_path_len = undefined,
				short_path_ind = undefined,
				paths = function (obj, _paths) {
					obj.parent.forEach(function (item) {
						var curr_paths = $L.extend([], _paths),
							curr_path_id = item.connector.id,
							curr_par_id = item.parent.id;
						if (("#" + curr_par_id) == src) {
							curr_paths.push(curr_path_id);
							var curr_len = curr_paths.length,
								assign = function () {
									short_path_len = curr_len;
									short_path_ind = curr_ind;
								};
							short_path_len ? (curr_len < short_path_len) ? assign() : false : assign();
							possible_paths[curr_ind] = curr_paths;
							++curr_ind;
							return;
						} else if (curr_paths.includes(curr_path_id) || "#" + curr_par_id == target) {
							return;
						} else {
							curr_paths.push(curr_path_id);
							item.previous_parent && paths(item.previous_parent, curr_paths);
						}
					});
				};
			option == "removeAnimation" && this.tracePath("removeAnimation", undefined, true);
			(option == "highlight" || option == "removeHighlight") && this.tracePath("removeHighlight", undefined, true);
			if (option == "highlight") {
				paths(prev_path, []);
				for (var i in possible_paths) {
					var short_class = "lyteConnectShortestPathSelection",
						other_class = "lyteConnectPathSelection",
						class_name = other_class;
					(i == short_path_ind) ? class_name = short_class : false;
					possible_paths[i].forEach(function (item) {
						var svg_elem = this.$node.querySelector("#" + item);
						svg_elem.classList.add(class_name);
					}.bind(this));
				}
			} else if (option == "animation") {
				paths(prev_path, []);
				if(short_path_ind != undefined){
				var short_arr = possible_paths[short_path_ind];
					short_arr && this.tracePath(option, short_arr, true);
				}
			}
		}
	},

	getNearestAnchor: function (evt) {
		var item = evt.target.closest('lyte-connect-item');
		if (item) {
			var itemBcr = item.getBoundingClientRect(),
				evtBcr = { x: (evt.clientX - itemBcr.x) / itemBcr.width, y: (evt.clientY - itemBcr.y) / itemBcr.height },
				valid = function (arr) {
					return arr && arr.length ? arr : false;
				},
				points = valid(item.getData('ltPropItem').data.anchor_points) || valid(this.data.ltPropDefaultAnchors) || [[0, 0.5], [1, 0.5], [0.5, 0], [0.5, 1]],
				minDiff = {};
			points.forEach(function(item) {
				var _x = item[0],
					_y = item[1],
					curDiff = Math.abs(evtBcr.x - _x) + Math.abs(evtBcr.y - _y);
				if (minDiff.value && curDiff >= minDiff.diff) {
					return;
				}
				minDiff.diff = curDiff;
				minDiff.value = { x: _x, y: _y };
			});
			return minDiff.value;
		}
	},

	setHanging: function (data, svg, evt, onlyInfo) {
		var src = !onlyInfo && data.element.closest('lyte-connect-item'),
			svgData = $L(svg).data(),
			srcPos = svgData.src_position || data.pos,
			_x = srcPos.x,
			_y = srcPos.y,
			src_position = { x: _x, y: _y },
			absPoint = svgData.absolute_points,
			targPos = absPoint[absPoint.length - 1],
			target_position = {},//$L.extend({}, src_position),
			options, _left, _top;

		if (_x == 0 || _x == 1) {
			target_position.y = 0.5;
			// target_position.x = _x == 0 ? 1 : 0;
			// leftExtra = _x == 0 ? 5 : 0;
			_left = targPos.x - (absPoint[0].x < targPos.x ? 0 : 5)
			_top = targPos.y - 2.5
		} else {
			target_position.x = 0.5;
			// target_position.y = _y == 0 ? 1 : 0;
			// topExtra = _y == 0 ? 5 : 0;
			_top = targPos.y - (absPoint[0].y < targPos.y ? 0 : 5)
			_left = targPos.x - 2.5
		}
		if (onlyInfo) {
			return { left: _left, top: _top }
		}
		options = {
			src_position: src_position,
			target_position: target_position,
			trgPos: {
				left: _left,
				top: _top,
				height: 5,
				width: 5
			},
			class: "lyteConnectFakeHangingConnector",
			hanging: true
		}

		if ((this.getMethods("onBeforeHanging") && this.executeMethod("onBeforeHanging", data.element, options, svg, this.$node, evt)) != false) {
			this.$node.connect("#" + src.id, undefined, options);
		}

	},

	refreshItem: function () {
		this.data.ltPropData.forEach(function (item) {
			delete item.position;
		})
		this._boundary(true);
		this.__cb = function () {
			this.arrange();
		}.bind(this);
	},

	getNodesInSeries: function (elem, options = {}) {
		var $node = $L(this.$node),
			getCorres = function (elem, next) {
				return $node.connection(next ? 'getNext' : 'getPrevious', elem)
			},
			next = options.outgoing != false && getCorres(elem, true),
			prev = options.incoming != false && getCorres(elem),
			_id = elem.get(0).id,
			retArr = [],
			paths = function (obj, out) {
				var dir = out ? "child" : "parent";
				obj[dir].forEach(function (item) {
					var currItem = item[dir],
						currId = currItem.id,
						corres = out ? item.next_child : item.previous_parent;
					if (currId && !$L(currItem).hasClass('lyteConnectFakeHangingItem') && retArr.indexOf(currId) == -1 && currId != _id) {
						retArr.push(currId);
						if (!item.recursive) {
							if (corres) {
								paths(corres, out);
							}
							if (out) {
								paths(getCorres(currItem));
							} else {
								paths(getCorres(currItem, true), true);
							}
						}
					}
				})
			}
		next && paths(next, true);
		prev && paths(prev);
		return retArr;
	},

	getNodesNotInSeries: function (elem, options) {
		var corres = this.getNodesInSeries(elem, options),
			details = this.data.details,
			retArr = [];
		for (var i in details) {
			var _id = details[i].data.id;
			elem.get(0).id != _id && !/lyteConnectFakeHangingItem_/i.test(_id) && corres.indexOf(_id) == -1 && retArr.push(_id);
		}
		return retArr;
	},

	updateItem: function (updateItem) {//check item overlap
		var data = this.data,
			overlap = data.ltPropOverlapCheck
			curId = $L(typeof updateItem == "string" ? '#' + updateItem : updateItem).get(0).id,
			curItem = $L("#" + curId);

		this.update_dimensions(curId);
		if (overlap) {
			var overlaped = false,
				newPos, ranges, ignore = [], curItemData, curDetail;
			data.ltPropData.forEach(function (item) {
				var _id = item.id;
				if (/lyteConnectFakeHangingItem_/i.test(_id)) {
					ignore.push(_id);
				}
				if (curId == _id) {
					curItemData = item;
					var pos = curItemData.position;
					newPos = { left: pos.left, top: pos.top };
				}
			})
			ignore.push(curId);
			curDetail = this.data.details[curId]
			ranges = this.overall_split(ignore);
			if (this.check_overlap(newPos, curId, ranges)) {
				Lyte.objectUtils(curItemData, 'add', 'position', newPos);
				this.set_detail(curDetail, "position", $L.extend(curDetail.position, newPos));
				this.update_position(curItem.get(0));
				overlaped = true;
			}
			this._split_indiv(curId, ranges);
			this._boundary(true);
			if (data.ltPropCheckLineBreak) {
				this.update_ignore(false);
				this._ranges = this.overall_split([]);
				overlaped || this.update_position(curItem.get(0));
				this.refresh_other_connectors([curId]);
			}
		}
	},

	updateField: function (type, key, val, index) {
		var add = type == "add",
			elem = $L(typeof key == "string" ? '#' + key : key, this.$node),
			_id = elem.length && elem.get(0).id, ind = 0,
			_this = this, data = this.data.ltPropData, isUndo = this.isUndo(),
			alreadyInQueue = false, deleted = false, parentId,
			getIndex = function (index, len) {
				return index != void 0 ? index <= len ? index : len : void 0;
			},
			updUnd = function (curField, ind) {
				if (!isUndo && !alreadyInQueue) {
					_this.pushToQueue({
						type: add ? "insertField" : "deleteField",
						index: ind,
						data: JSON.stringify(curField[ind]),
						parentId: add ? key : parentId
					});
					alreadyInQueue = true;
				}
				deleted = true;
			},
			addField = function (arr, arrPos) {
				if (arrPos != void 0) {
					Lyte.arrayUtils(arr, 'insertAt', arrPos, val);
					updUnd(arr, arrPos);
				}
			},
			remField = function (arr) {
				for (; ind < arr.length; ind++) {
					if (arr[ind].id == _id) {
						updUnd(arr, ind);
						Lyte.arrayUtils(arr, 'removeAt', ind);
						return;
					}
				}
			};

		if (!_id) {
			return false;
		}

		if (!add) {
			var parent = val || elem.closest('lyte-connect-item')[0];
			parentId = parent && parent.id;
			this.release_connectors(key, $L('#' + key)[0]);
		}

		for (var i = 0; i < data.length; i++) {
			var cur = data[i],
				render = cur.renderData,
				fields = cur.fields;
			if (add) {
				if (cur.id == _id) {
					addField(render, getIndex(index, render.length));
					addField(fields, getIndex(index, fields.length));
				}
			} else {
				if (cur.id == parentId) {
					remField(render);
					if (fields[ind] && fields[ind].id == _id) {
						updUnd(fields, ind);
						Lyte.arrayUtils(fields, 'removeAt', ind);
					} else {
						remField(fields);
					}
					break;
				}
			}
		}
		deleted && this.update_position(add ? elem.get(0) : $L('#' + parentId).get(0));
	},

	resize_fn : function( evt ){
		clearTimeout( this._resize_time );
		this._resize_time = setTimeout( function(){
			this.setup_viewbox();
			this._boundary( true );
		}. bind( this ), ( evt || {} ).type == "resize" ? 100 : 500 );
	},

	/* To recreate connectors */

	render_connectors : function( arr ){
		var $node = this.$node;
		arr.forEach( function( item ){
			$node.connect( item.src, item.target, item.options, true );
		});

		this.render_connection_queue( arr );
	},

	/* removes one module from grouped module */

	removegroup : function( group_id, id ){
		var _details = this.data.details,
		grp_detail = _details[ group_id ];

		if( !grp_detail ){
			return;
		}

		var children = grp_detail.children,
		shape_detail = children[ id ];

		if( !shape_detail ){
			return;
		}

		if( Object.keys( children ).length == 2 ){
			return this.ungroup( group_id );
		}

		var ret = this.delete( id, group_id ),
		shape_pos = ret.data.position,
		ref_pos = grp_detail.position;

		this.refresh_grp_position( grp_detail );

		shape_pos.left += ref_pos.left;
		shape_pos.top += ref_pos.top;

		this.insert( ret.data );
		this.render_connectors( ret.connections );

		this.check_position( id );
	},

	refresh_grp_position : function( grp_detail ){
		var ref_pos = grp_detail.position,

		offset = this.data.ltPropMinDiff,
		__left = Infinity,
		__top = __left,
		LC = Lyte.objectUtils,
		rendered_children = grp_detail.data.children,
		regx = /lyteConnectHiddenElem/i;

		rendered_children.forEach( function( item ){

			if( regx.test( item.class ) ){
				return;
			}

			var pos = item.position;
			__left = Math.min( __left, pos.left );
			__top = Math.min( __top, pos.top );
		});

		__left -= offset;
		__top -= offset;

		rendered_children.forEach( function( item ){

			if( regx.test( item.class ) ){
				return;
			}

			var pos = item.position;

			LC( item, 'add', 'position', {
				left : pos.left - __left,
				top : pos.top - __top
			});
		});

		LC( grp_detail.data, "add", 'position', {
			left : ref_pos.left + __left,
			top : ref_pos.top + __top
		});
	},

	/* Adds one module to a grouped module*/

	addgroup : function( group_id, id ){

		this.insert_to_a_grp( this.$node.deleteShape( id ), this.get_element(group_id) );

		// var _details = this.data.details,
		// grp_detail = _details[ group_id ],
		// shape_detail = _details[ id ];

		// if( !shape_detail || !grp_detail ){
		// 	return;
		// }

		// var grp_position = grp_detail.position,
		// data = grp_detail.data,
		// $node = $L( this.$node ),
		// ext_data = shape_detail.position,
		// ret = this.delete( id ),
		// offset = this.data.ltPropMinDiff,
		// grp_left = grp_position.left,
		// grp_top = grp_position.top,
		// ext_left = ext_data.left,
		// ext_top = ext_data.top,
		// _left = Math.min( grp_left, ext_left - offset ),
		// _top = Math.min( grp_top, ext_top - offset ),
		// _right = Math.max( grp_left + grp_position.width, ext_left + ext_data.width ),
		// _bottom = Math.max( grp_top + grp_position.height, ext_top + ext_data.height ),
		// left_diff = grp_left - _left,
		// top_diff = grp_top - _top,
		// children = grp_detail.data.children,
		// LC = Lyte.objectUtils;

		// ret.data.position = {
		// 	left : ext_data.left - _left,
		// 	top : ext_data.top - _top
		// };

		// LC( grp_detail.data.children, 'add', id, {
		// 	data : ret.data,
		// 	position : {
		// 		left : ext_data.left - _left,
		// 		top  : ext_data.top - _top,
		// 		width : ext_data.width,
		// 		height : ext_data.height
		// 	},
		// 	parent : group_id
		// });

		// if( left_diff || top_diff ){
		// 	children.forEach( function( item ){
		// 		var pos = item.position,
		// 		_pos = {
		// 			left : pos.left + left_diff,
		// 			top : pos.top + top_diff
		// 		};

		// 		LC( item, 'add', 'position', _pos );
		// 		LC( grp_detail.children[ item.id ], 'add', 'position', _pos );
		// 	});
		// }

		// var final_pos = {
		// 	left : _left,
		// 	top : _top,
		// 	width : _right - _left,
		// 	height : _bottom - _top
		// };

		// LC( grp_detail, 'add', 'position', final_pos );
		// LC( grp_detail.data, 'add', 'position', final_pos );

		// this.construct_lazy( ret.data );

		// Lyte.arrayUtils( children, 'push', ret.data );

		// this.render_connectors( ret.connections );

		// this.check_position( group_id )
	},

	ungroup : function( _id ){

		var data = this.delete( _id ),
		children = data.data.children,
		position = data.data.position,
		_left = position.left,
		_top = position.top,
		$node = this.$node;

		$node.resetSelected();

		children.forEach( function( item ){
			var pos = item.position;
			pos.left += _left;
			pos.top += _top;

			$node.insertShape( item );
		});

		this.render_connectors( data.connections );

		if( this.data.ltPropCheckLineBreak ){
			delete this._ranges;
			this.getRanges();
		}
	},

	render_connection_queue : function( arr ){
		if( !this.isUndo() ){
			this.pushToQueue({
				type : "renderConnections",
				data : this.stringify( arr )
			});
		}
	},

	group : function( __id,  fake ){
		var $node = this.$node,
		arg = ( fake || $node.getSelected() ).filter( function( item ){
			return !item.children;
		}),
		fields = this.data.ltPropData;

		if( arg.length > 1 ){

			var obj = {
				children : arg,
				id : __id || ( "LyteConnect" + Date.now() )
			},
			left = Infinity,
			top = left,
			right = -left,
			bottom = -left,
			connection_arr = [],
			off = this.data.ltPropMinDiff * this.offset_fact(),
			__$node = $L( $node );

			$node.resetSelected();
			arg.forEach( function( item ){

				var position = item.position,
				ret = this.delete( item.id );
				left = Math.min( left, position.left );
				top = Math.min( top, position.top );

				Lyte.arrayUtils( connection_arr, 'push', ret.connections );

			}.bind( this ));

			left -= off;
			top -= off;

			arg.forEach( function( item ){
				var position = item.position;

				position.left -= left;
				position.top -= top;
			});

			obj.position = {
				left : left,
				top : top
			};

			$node.insertShape( obj );

			this.check_position( obj.id );

			this.render_connectors( connection_arr );

		} else {
			console.warn( "Can't form group with one shape" )
		}
	},

	resetSelected : function( ignore, evt ){
		var _item = this._item;

		if( _item ){
			Array.from( _item ).forEach( function( item ){
				var node = item.get( 0 );

				if( node == ignore ){
					return;
				}
				this.unselect( evt || {}, node );
			}.bind( this ) );
		}
	},

	initiate_preview : function(){
		var elem = this._preview;

		if( !elem ){
			return;
		}

		var details = this.data.details,
		overlay = elem.children[ 1 ],
		cb = 'onCreate';

		this.__preview_grp = elem.children[ 0 ].children[ 0 ];

		for( var key in details ){
			var __data = details[ key ];

			this.getMethods( cb ) && this.executeMethod( cb, key, void 0, __data.data, false, this.$node );
		}

		this.setup_viewbox();
	},

	preview_down : function( evt ){
		var cb = 'onPreviewDragSelect',
		ori_evt = evt;

		if( evt.buttons == 3 || evt.target.closest( '.lytePreviewForeignObject' ) || ( evt.touches || [] ).length > 1 || this.getMethods( cb ) && this.executeMethod( cb, evt, this.$node ) == false ){
			return;
		}

		evt = ( evt.touches || [ evt ] )[ 0 ];

		this._clientX = evt.clientX;
		this._clientY = evt.clientY;

		this._move = this.preview_drag.bind( this );
		this._up = this.preview_up.bind( this );

		this.bind_evt( 'addEventListener', ori_evt );

		this.stopevt( ori_evt );

		$L( this.$node ).addClass( 'lyteConnectPreviewDown' );
	},

	preview_click : function( evt ){
		if( $L( evt.target ).hasClass( 'lyteConnectOverlay' ) ){
			return;
		}
		var preview = this._preview,
		svg = preview.children[ 0 ].__viewBox,
		overlay = preview.children[ 1 ],
		preview_bcr = preview.getBoundingClientRect(),
		bcr = overlay.getBoundingClientRect(),
		data = this.data,
		boundary = data.ltPropBoundary,
		clientX = evt.clientX,
		clientY = evt.clientY,
		mid_x = bcr.left + bcr.width / 2,
		mid_y = bcr.top + bcr.height / 2,
		sL = "ltPropScrollLeft",
		sT = "ltPropScrollTop",
		diff_x = clientX - mid_x,
		diff_y = clientY - mid_y,

		fn = function( ns, diff, width, min, max ){
			return Math.min( Math.max( data[ ns ] - ( diff / preview_bcr[ width ] * svg[ width ] ), boundary[ min ] ), boundary[ max ] );
		};


		this.setData( sL, fn( sL, diff_x, 'width', 'min_x', 'max_x' ) );
		this.setData( sT, fn( sT, diff_y, 'height', 'min_y', 'max_y' ) );
	},

	preview_drag : function( evt ){

		if( ( evt.touches || [] ).length > 1 ){
			return;
		}

		var ori_evt = evt;
		evt = ( evt.touches || [ evt ] )[ 0 ];

		this._moved = true;

		var clientX = evt.clientX,
		clientY = evt.clientY,
		data = this.data,
		boundary = data.ltPropBoundary,
		svg = this._preview.children[ 0 ],
		bcr = svg.getBoundingClientRect(),
		viewBox = svg.__viewBox,
		xInc = ( this._clientX - clientX ) / ( bcr.width / viewBox.width ),
		yInc = ( this._clientY - clientY ) / ( bcr.height / viewBox.height ),
		cb = "onPreviewDragMove",
		sL = "ltPropScrollLeft",
		sT = "ltPropScrollTop",
		__left = data[ sL ],
		__top = data[ sT ],
		wwidth = window.innerWidth,
		wheight = window.innerHeight;

		this.setData( sL, this.drag_min_max( xInc, __left, boundary, 'x', wwidth ) );
		this.setData( sT, this.drag_min_max( yInc, __top, boundary, 'y', wheight ) );

		this.getMethods( cb ) && this.executeMethod( cb, evt, this.$node );

		this._clientX = clientX;
		this._clientY = clientY;

		if( ori_evt.touches ){
			ori_evt.preventDefault();
		}
	},

	preview_up : function( evt ){
		if( this._moved ){
			var cb = "onPreviewDragEnd";
			this.getMethods( cb ) && this.executeMethod( cb, evt, this.$node );
		}

		this.bind_evt( 'removeEventListener', evt );

		[ "_move", "_up", "_clientX", "_clientY", "_move", "_moved", "_up" ].forEach( function( item ){
			delete this[ item ];
		}.bind( this ));

		$L( this.$node ).removeClass( 'lyteConnectPreviewDown' );
	},

	scale_bcr : function( bcr ){
		var data = this.data,
		scale = data.ltPropContextualWheel ? 1 : data.ltPropScale,
		width_diff = bcr.width * ( 1 - scale ),
		height_diff = bcr.height * ( 1 - scale ),
		half_width = width_diff * 0.5,
		half_height = height_diff * 0.5;

		bcr.left += half_width;
		bcr.right -= half_width;
		bcr.top += half_height;
		bcr.bottom -= half_height;

		bcr.width -= width_diff;
		bcr.height -= height_diff;

		return bcr;
	},

	fit_to_scale : function( scaled_output, wrap_bcr, this_bcr ){

		var data = this.data,
		scale = data.ltPropContextualWheel ? 1 : data.ltPropScale, 
		fn = function( bcr, _left, _width ){
			return bcr[ _left ] + bcr[ _width ] * 0.5;
		},
		diff = function( width ){
			return Math.min( 0, scaled_output[ width ] - wrap_bcr[ width ] ) * 0.5;
		},
		left_diff = fn( scaled_output, 'left', 'width' ) - fn( wrap_bcr, 'left', 'width' ) - diff( 'width' ),
		top_diff = fn( scaled_output, 'top', 'height' ) - fn( wrap_bcr, 'top', 'height' ) - diff( 'height' );

		scaled_output.left -= left_diff;
		scaled_output.right -= left_diff;

		scaled_output.top -= top_diff;
		scaled_output.bottom -= top_diff;
	},

	setup_viewbox : function(){
		var __this = this,
		__data = this.data,
		fastdom = $L.fastdom;

		if( !__data.ltPropPreview ){
			return;
		}

		fastdom.clear( __this.___fdom );

		__this.___fdom = fastdom.measure( function(){
			delete __this.___fdom;

			var boundary = __data.ltPropBoundary,
			offset = __data.ltPropOffset,
			b_left = boundary.left - offset,
			b_right = boundary.right + offset,
			b_top = boundary.top - offset,
			b_bottom = boundary.bottom + offset,
			b_width = b_right - b_left,
			b_height = b_bottom - b_top,
			preview = __this.__preview_grp,
			svg = preview ? preview.parentNode : void 0,
			scale = __data.ltPropContextualWheel ? 1 : __data.ltPropScale,
			overlay = svg ? svg.nextElementSibling : void 0,
			this_bcr = __this.$node.getBoundingClientRect(),
			width = this_bcr.width,
			height = this_bcr.height,
			__width = Math.max( width, b_width ),
			__height = Math.max( height, b_height ),
			extra_left =  Math.max( 0, __width - b_width ),
			extra_top = Math.max( 0, __height - b_height ),
			__left = b_left - extra_left / 2,
			__top = b_top - extra_top / 2,
			svg_bcr = svg ? { width : svg.offsetWidth, height : svg.offsetHeight } : void 0,
			scale_x = svg_bcr ? svg_bcr.width / __width : 1,
			scale_y = svg_bcr ? svg_bcr.height / __height : 1,
			sL = __data.ltPropScrollLeft,
			sT = __data.ltPropScrollTop,
			scale_loss = 1 - scale;

			b_left -= extra_left / 2;
			b_right += extra_left / 2;
			b_top -= extra_top / 2;
			b_bottom += extra_top / 2;

			// __width += extra_left;
			// __height += extra_top;

			fastdom.mutate( function(){
				var exp_min_sT = -b_top * scale - scale_loss * height / 2 /*- extra_top / 2 * scale*/,
				exp_max_sT = -b_bottom * scale + height - height * scale_loss / 2 /*+ extra_top / 2 * scale*/,
				exp_min_sL = -b_left * scale - scale_loss * width / 2 /*- extra_left / 2 * scale*/,
				exp_max_sL = -b_right * scale + width - width * scale_loss / 2 /*+ extra_left / 2 * scale*/,
				width_perc  = ( width / scale / __width * 100 ) /*+ ( extra_left / 2 - Math.max( 0, width - b_width ) / 2 * scale_loss ) * 100 / __width*/,
				height_perc = ( height / scale / __height * 100 ),
				max_top_perc = 100 - height_perc,
				max_left_perc = 100 - width_perc,
				top_to_be = ( max_top_perc / ( exp_max_sT - exp_min_sT ) ) * ( sT - exp_min_sT ),
				left_to_be = ( max_left_perc / ( exp_max_sL - exp_min_sL ) ) * ( sL - exp_min_sL ),
				obj = {
					width : width_perc + "%",
					height : height_perc + "%",
					top : top_to_be + "%",
					left : left_to_be + "%"
				};

				if( exp_max_sL == exp_min_sL ){
					var diff = exp_max_sL - sL;
					obj.left = ( left_to_be = ( diff / __width * 100 ) ) + "%";
				}

				if( exp_max_sT == exp_min_sT ){
					var diff = exp_max_sT - sT;
					obj.top = ( top_to_be = ( diff / __height * 100 ) ) + "%";
				}

				$L( overlay ).css( obj );

				svg ? ( svg.__viewBox = {
					width : __width,
					height : __height
				} ) : void 0;

				$L( preview ).css( {
					width : __width + 'px',
					height : __height + 'px',
					transform : 'translate(' + ( -__left * scale_x  ) + 'px,' + ( -__top * scale_y ) + 'px) scale(' + scale_x + "," + scale_y + ')',
					transformOrigin : "0% 0%"
				});
			});
		});
	},

	_boundary : function( ignore ){
		$L.fastdom.clear( this._bmeasure );
		this._bmeasure = $L.fastdom.measure( this.setup_boundary.bind( this, ignore || this.__regroup_drop ) );
	},

	update_position : function( elem, only_start, elements ){

		var $item = this.data.ltPropSwimLanes ? $L(this.$node.closest("lyte-connect-swimlanes")) : $L(this.$node),
		src = 'lyteConnectionSrcElement',
		target = 'lyteConnectionTargetElement',
		$elem = $L( elem );

		if( $elem.hasClass( 'lyteConnectHiddenElem' ) ){
			return;
		}

		Array.from( elements || elem.querySelectorAll( '.' + src + ( only_start ? '' : ',.' + target ) ) ).forEach( function( item ){
			$item.connection( 'update', item );
		});

		if( $elem.hasClass( src ) || ( !only_start && $elem.hasClass( target ) ) ){
			$item.connection( 'update', elem );
		}

		if( this.data.ltPropPreviewImage ){
			this.update_preview_position( elem );
		}
	},

	release_connectors : function( id, elem ){
		var elem = $L( elem || ( '#' + this.data.ltPropIdPrefix + id ) ),
		connected = elem.add( elem.find( '.lyteConnectionSrcElement,.lyteConnectionTargetElement' ) ),
		arr = [];

		$L.each( connected, function( index, item ){
			Lyte.arrayUtils( arr, 'push', this.release_for( item ) );
		}.bind( this ));

		return arr;
	},

	remove_connector : function( item ){
		var $item = $L( item ),
		data = $item.data(),
		options = data.options,
		src = data.src_query,
		target = data.target_query,
		__data = this.data,
		textbox = data.text_box;

		__data.ltPropTextBox && textbox && Lyte.arrayUtils( __data.textBoxArray, 'removeAt', Number( textbox.getAttribute( 'index' ) ) );

		$L( this.$node ).connection( 'delete', data.src, $item.attr( 'id' ) );

		return {
			options : options,
			src : src,
			target : target
		};
	},

	release_for : function( item ){
		var arr = [],
		connections = $L( this.$node ).connection( 'getConnections', item ),
		_this = this,
		fn = function( _arr ){
			_arr.forEach( function( _item  ){
				Lyte.arrayUtils( arr, 'push', _this.$node.disConnect( _item, true ) );
			}.bind( this ) );
		}.bind( this );

		fn( connections.src );
		fn( connections.target );

		return arr;
	},

	stringify : function( json ){
		return JSON.stringify( json );
	},

	get_child_data : function( arr, id ){
		return arr.filter( function( item ){
			return item.id == id;
		})[ 0 ];
	},

	delete : function( id, group_id ){

		var data = this.data,
		_details = data.details,
		details = _details[ group_id || id ],
		__data = group_id ? ( this.get_child_data( details.data.children, id ) /*details.children[ id ].data*/ ) : details.data,
		arr = group_id ? details.data.children : data.ltPropData,
		index = arr.indexOf( __data ),
		cb = 'onDelete',
		isUndo = this.isUndo(),
		deleted_connectors;

		if( group_id && arr.length == 1 && ( index != -1 ) ){
			return this.delete( group_id );
		}

		deleted_connectors = this.release_connectors( id );
		this.$node.resetSelected();
		
		Lyte.arrayUtils( arr, 'removeAt', index );
		if( group_id ){
			if( arr.length ){
				this.set_detail( _details, group_id, details );
			}
		} else {
			Lyte.objectUtils( _details, 'delete', id );

			if( data.ltPropPreviewImage ){
				var elem = this._preview.querySelector( "#preview_" + id );
				if( elem ){
					elem.remove();
				}
			}
		}

		this._boundary( true );
		this.setup_viewbox();

		if( !isUndo ){
			// this.pushToQueue({
			// 	type : "deleteConnections",
			// 	data : this.stringify( deleted_connectors )
			// });

			this.pushToQueue({
				type : "deleteShape",
				index : index,
				data : this.stringify( __data ),
				group_id : group_id
			});
		}

		this.getMethods( cb ) && this.executeMethod( cb, id, group_id, __data, isUndo, this.$node );

		if( group_id ){
			if( arr.length ){//Refresh connections for other items in a group.
				if( this.data.ltPropCheckLineBreak ){
					this.__cb = function(){
						this.recheck_pos( group_id, void 0, true );
						$L.fastdom.measure( function(){
							$L.fastdom.mutate( function(){
								this.refresh_other_connectors( [ group_id ] );
							}.bind( this ) );
						}.bind( this ) );
					}.bind( this );
				} else {
					this.__cb = function(){
						this.recheck_pos( group_id, void 0, true );
					}.bind( this );
				}
			} else {
				this.delete( group_id );
			}
		}

		if( this.data.ltPropCheckLineBreak ){
			delete this._ranges;
			this.getRanges();
		}

		return {
			data : __data,
			connections : deleted_connectors
		};
	},

	insert : function( data, index, group_id ){

		var details = this.data.details,
		arr = group_id ? details[ group_id ].data.children : this.data.ltPropData,
		cb = 'onCreate',
		isundo = this.isUndo(),
		__id = data.id,
		call_position_check;

		if( group_id && !arr ){
			Lyte.objectUtils( details.group_id.data, 'add', 'children', arr = [] );
		}

		if( !__id ){
			__id = data.id = "Shape" + Date.now();
		}

		if( index == void 0 ){
			index = arr.length;
		}

		if( data.position || group_id ){
			delete this._ranges;
			call_position_check = true;
		} else {
			this._position_find[ __id ] = true;
		}

		this.construct_lazy( data );

		Lyte.arrayUtils( arr, 'insertAt', index, data );

		if( !isundo ){
			this.pushToQueue({
				type : "insertShape",
				index : index,
				data : this.stringify( data ),
				group_id : group_id
			});
		}

		var fn = function(){
			$L.fastdom.mutate( function(){
				this.getMethods( cb ) && this.executeMethod( cb, __id, group_id, data, isundo, this.$node );
			}.bind( this ));
		}.bind( this );

		if( this.data.ltPropCheckLineBreak ){
			this.__cb = function(){
				if( call_position_check ){
					this.recheck_pos( group_id || __id, void 0, true )
				}
				$L.fastdom.measure( function(){
					$L.fastdom.mutate( function(){
						this.refresh_other_connectors( [ group_id || __id ] );
						fn();
					}.bind( this ) );
				}.bind( this ) );
			}.bind( this );
		} else {
			fn();

			call_position_check ? ( this.__cb = function(){
				this.recheck_pos( group_id || __id, void 0, true );
			}.bind( this ) ) : void 0;
		}

		this._boundary( true );
		this.setup_viewbox();
	},

	setup_boundary : function( ignore_min ){

		delete this._bmeasure;

		var data = this.data, 
		off = data.ltPropMinDiff * this.offset_fact(),
		// scale = data.ltPropContextualWheel ? 1 : data.ltPropScale,
		this_bcr = this.$node.getBoundingClientRect(),
		min_x,
		max_x,
		min_y,
		max_y,
        min_mid_x,
		max_mid_x,
		min_mid_y,
		max_mid_y,
		wrapper = this.__wrapper,
		children = wrapper.children,
		fn = function( value, other, fn ){
			return Math[ fn ]( value, other );
		},
		details = this.data.details,
		obj = {},
		LC = Lyte.objectUtils,
		is_same = function( obj1, obj2 ){
			var keys1 = Object.keys( obj1 ),
			keys2 = Object.keys( obj2 ),
			is_same_;

			if( keys1.length != keys2.length ){
				return false;
			}

			keys1.every( function( item ){
				return is_same_ = ( obj1[ item ] == obj2[ item ] );
			});

			return is_same_;
		},
		to_check = [],
		check_obj = this._position_find || {},
		fastdom = $L.fastdom,
		render_arrange = data.ltPropRenderWithArrange,
		final_set = [];

		data.ltPropData.forEach( function( item, index ){

			var is_hidden = /lyteConnectHiddenElem/i.test( item.class );

			// if( /lyteConnectHiddenElem/i.test( item.class ) ){
			// 	return;
			// }

			var ___fn = function( item, index, children, __width, __height, ignore ){
				var elem = children[ index ],
				position = $L.extend( { left : 0, top : 0 }, item.position ),
				_left = position.left,
				_top = position.top,
				cur = details[ item.id ],
				cur_pos = ( cur || {} ).position || {},
				width = ( __width || elem.offsetWidth ),
				height = ( __height || elem.offsetHeight ),
				position_obj = {
					left : _left,
					top : _top,
					width : width,
					height : height
				},
				shape_id = item.id;

				if( ignore ){
					return position_obj;
				}

				if( check_obj[ shape_id ] ){
					to_check.push( {
						item : item,
						index : index,
						children : children,
						width : width,
						height : height,
						ignore : ignore,
						fn : ___fn
					});
					delete check_obj[ shape_id ];
				}

				if( cur ){
					if( !is_same( position_obj, cur_pos ) ){//only pos change

						final_set.push([ cur, 'position', position_obj, item ]);

						// fastdom.mutate( function(){
						// 	// LC( cur, 'add', 'position', position_obj );
						// 	this.set_detail( cur, 'position', position_obj, item );
						// }.bind(this));
					}
				} else {
					final_set.push( [ details, item.id, { position : position_obj, data : item }, item ] );
					// fastdom.mutate( function(){
						// LC( details, 'add', item.id, {
						// 	position : position_obj,
						// 	data : item
						// });
						
					// 	this.set_detail( details, item.id, {position : position_obj,data : item}, item );
					// }.bind(this));
				}

				if( !is_hidden ){
					if( min_x == void 0 ){
						min_x = -( _left + width );
						max_x = -_left;
						min_y = -( _top + height );
						max_y = -_top;
                        min_mid_x = max_mid_x = -( _left + width / 2 );
						min_mid_y = max_mid_y = -( _top + height / 2 );
					} else {
						max_x = fn( max_x, -_left, 'max' );
						min_x = fn( min_x, -( _left + width ), 'min' );
						max_y = fn( max_y, -_top, 'max' );
						min_y = fn( min_y, -( _top + height ), 'min' );
                        min_mid_x = fn( min_mid_x, -( _left + width / 2 ), 'min' );
						max_mid_x = fn( max_mid_x, -( _left + width / 2 ), 'max' );
						min_mid_y = fn( min_mid_y, -( _top + height / 2 ), 'min' );
						max_mid_y = fn( max_mid_y, -( _top + height / 2 ), 'max' );
					}
				}
			}.bind( this );

			if( false && item.children ){
				var elem = children[ index ],
				__children = elem.children,
				_left = Infinity,
				_right = -_left,
				_top = _left,
				_bottom = _right,
				pos = item.position,
				group_id = item.id,
				grp_data = details[ group_id ],
				final_obj = {},
				allow = false;

				item.children.forEach( function( __item, __index ){

					if( /lyteConnectHiddenElem/i.test( __item.class ) ){
						return;
					}

					var ret = ___fn( __item, __index, __children, 0, 0, true ),
					cur_id = __item.id;

					_left = Math.min( _left, ret.left );
					_top = Math.min( _top, ret.top );
					_right = Math.max( _right, ret.left + ret.width );
					_bottom = Math.max( _bottom, ret.top + ret.height );

					if( details[ cur_id ] ){
						LC( details, 'delete',cur_id );
					}

					if( grp_data ){
						var grp_children = grp_data.children;
						if( grp_children ){
							var is_exist = grp_children[ cur_id ]
							if( is_exist ){
								if( !is_same( ret, is_exist.position ) ){
									LC( is_exist, 'add', 'position', ret );
								}
							} else {
								LC( grp_children, 'add', cur_id, {
									position : ret,
									data : __item,
									parent : group_id
								});
							}
						} else{
							allow = true;
						}
					} else {
						allow = true;
					}

					if( allow ){
						final_obj[ cur_id ] = { position : ret, data : __item, parent : group_id };
					}

				});

				_left -= off;
				_top -= off;
				_right += off;
				_bottom += off;

				fastdom.mutate( function(){
					LC( item, 'add', 'position', {
						left : _left,
						top : _top,
						width : _right - _left,
						height : _bottom - _top
					});
				});

				___fn( item, index, children, _right - _left,  _bottom - _top );

				if( allow ){
					fastdom.mutate( function(){
						LC( details[ group_id ], 'add', 'children', final_obj );
					});
				}
			} else {
				___fn( item, index, children );
			}

		}.bind( this ));

		if( min_x == void 0 ){
			min_x = min_y = max_x = max_y = 0;
		}

		this.setData( 'ltPropBoundary', $L.extend( true, obj,{
			left : -max_x,
			right : -min_x,
			top : -max_y,
			bottom : -min_y,
			min_mid_x : min_mid_x,
			max_mid_x : max_mid_x,
			min_mid_y : min_mid_y,
			max_mid_y : max_mid_y
		}));

		var wrap_bcr = this.get_wrap_bcr( wrapper.getBoundingClientRect(), wrapper ),
		mid_x = this_bcr.left + this_bcr.width * 0.5,
		mid_y = this_bcr.top + this_bcr.height * 0.5,
		wrap_mid_x = wrap_bcr.left + wrap_bcr.width * 0.5,
		wrap_mid_y = wrap_bcr.top + wrap_bcr.height * 0.5,
		// x_diff = mid_x - wrap_mid_x,
		// y_diff = mid_y - wrap_mid_y,
		sL_ns = 'ltPropScrollLeft',
		sT_ns = 'ltPropScrollTop',
		cb = this.__cb,

		fn2 = function( wrap_bcr, _left, _width, _right, minx, maxx, scroll ){
			var this_width = this_bcr[ _width ],
			wrap_width = wrap_bcr[ _width ];

			if( this_width >= wrap_width ){
				var mid = this_bcr[ _left ] + this_width * 0.5,
				wrap_mid = wrap_bcr[ _left ] + wrap_width * 0.5;

				obj[ minx ] = obj[ maxx ] = scroll + mid - wrap_mid;
			} else {
				obj[ maxx ] = - ( wrap_bcr[ _left ] - this_bcr[ _left ] ) + scroll;
				obj[ minx ] = - ( wrap_bcr[ _right ] - this_bcr[ _right ] ) + scroll;
			}
		};

		fn2( wrap_bcr, 'left', 'width', 'right', 'min_x', 'max_x', data[ sL_ns ] );
		fn2( wrap_bcr, 'top', 'height', 'bottom', 'min_y', 'max_y', data[ sT_ns ] );

		if( !ignore_min ){
			if( data.ltPropCenter ){
				this.moveToCenter();
			} else {
				this.setData( sL_ns, Math.min( Math.max( obj.min_x, data[ sL_ns ] ), obj.max_x ) );
				this.setData( sT_ns, Math.min( Math.max( obj.min_y, data[ sT_ns ] ), obj.max_y ) );
			}
		}

		final_set.forEach( function( item ){
			this.set_detail.apply( this, item );
		}.bind( this ) );

		if( !render_arrange && to_check.length ){
			// fastdom.mutate( function(){
				this.arrange( to_check );
				this.resetQueue();
			// }.bind( this ));
		} 

		// need this force write. In some machines multiple fastdoms are called before setTimeout 0. issue reproducible in muthusamy.s@zohocorp.com's Linux machine.
		// clearTimeout( this._transtime );
		// $L.fastdom.mutate( this._setTranslate.bind( this ) );

		if( cb || render_arrange ){
			delete this.__cb;
			// if( this.getMethods( cb ) ){
				var fastdom = $L.fastdom;

				fastdom.mutate( function(){
					 fastdom.measure( function(){
						setTimeout( function(){
							cb && cb();
							if( render_arrange && to_check.length ){
								this.arrange( to_check );
								this.resetQueue();
							}
						}.bind( this ), 0 );
					}.bind( this ) );
				}.bind( this ) );
			// }
		}
	},

	adjust_bcr : function( transform, __left, __top ){
		var __match = transform.match( /translate\((.+?)\)/ )[ 1 ],
		__map = __match.split( "," ).map( function( item ){
			return parseFloat( item.trim() );
		});

		return {
			left : __left - ( __map[ 0 ] || 0 ),
			top : __top - ( __map[ 1 ] || 0 )
		};
	},

	get_wrap_bcr : function( bcr, elem ){
		var data = this.data,
		offset = data.ltPropOffset,
		boundary = data.ltPropBoundary || { left : offset, right : -offset, top : offset, bottom : -offset },
		scale = data.ltPropContextualWheel ? 1 : data.ltPropScale,
		_left = boundary.left - offset,
		_right = boundary.right + offset,
		_top = boundary.top - offset,
		_bottom = boundary.bottom + offset,
		_width = _right - _left,
		__height = _bottom - _top,
		obj = { 
			width : _width * scale,
			height : __height * scale
		},
		bcr_adjust = this.adjust_bcr( elem.style.transform || "translate(0px, 0px)", data.ltPropScrollLeft, data.ltPropScrollTop );

		obj.left = bcr.left + bcr_adjust.left * scale + _left * scale;
		obj.top = bcr.top + bcr_adjust.top * scale + _top * scale;
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;

		return obj;
	},

	drag_min_max : function( inc, value, boundary, __x, wwidth ){
		var extra_scroll = this.data.ltPropExtraScroll,
		is_extra_scroll = extra_scroll == "true",
		mid_text = is_extra_scroll ? '_mid_' : "_",
		max = boundary[ "max" + mid_text + __x ],
		min = boundary[ "min" + mid_text + __x ],
		_new = value + inc,
		scale = this.data.ltPropScale;

		if( is_extra_scroll ){
			min =  boundary[ "min" + mid_text + __x ] * scale - ( ( 1 - scale ) * wwidth / 2 );
			max = boundary[ "max" + mid_text + __x ] * scale + wwidth - wwidth * ( 1- scale ) / 2;
		} else if( extra_scroll == "default" ){
			var __left = __x == "x" ? 'left' : 'top',
			__right = __x == 'x' ? 'right' : 'bottom',
			__width  = boundary[ __right ] - boundary[ __left ] + 80;

			max = -( boundary[ __left ] - 40 ) * scale - ( ( 1 - scale ) * wwidth / 2 );

			if( __width > wwidth ){
				min = max -  ( __width - wwidth );
			} else {
				min = max;
			}
		}

		if( inc > 0 ){
			if( _new >= max ){
				if( value >= max ){
					return value;
				}
				return max;
			}
		} else if( inc < 0 ){
			if( _new <= min ){
				if( value <= min ){
					return value;
				}
				return min;
			}
		}
		return _new;
	},

	dragmove : function( evt ){

		if( ( evt.touches || [] ).length > 1 ){
			return this.perform_pinch( evt );
		}

		var ori_evt = evt;
		evt = ( evt.touches || [ evt ] )[ 0 ];

		if( !this._moved ){
			this._moved = true;
		}

		var clientX = evt.clientX,
		clientY = evt.clientY,
		xInc = clientX - this._clientX,
		yInc = clientY - this._clientY,
		data = this.data,
		sL = 'ltPropScrollLeft',
		sT = 'ltPropScrollTop',
		cb = 'onDrag',
		// __sL = data[ sL ] + xInc,
		// __sT = data[ sT ] + yInc,
		boundary = this.data.ltPropBoundary,
		wwidth = Math.min( window.innerWidth, this.$node.offsetWidth ),
		wheight = Math.min( window.innerHeight, this.$node.offsetHeight );

		this.setData( sL, this.drag_min_max( xInc, data[ sL ], boundary, 'x', wwidth ) );
		this.setData( sT, this.drag_min_max( yInc, data[ sT ], boundary, 'y', wheight ) );

		this.getMethods( cb ) && this.executeMethod( cb, ori_evt, this.$node );

		this._clientX = clientX;
		this._clientY = clientY;

		ori_evt.preventDefault();

	},

	mousemove : function( evt ){

		if( ( evt.touches || [] ).length > 1 ){
			return this.perform_pinch( evt );
		}

		var ori_evt = evt;
		evt = ( evt.touches || [ evt ] )[ 0 ];

		// this._moved = true;

		var clientX = Math.min( Math.max( 0, evt.clientX ), window.innerWidth ),
		clientY = Math.min( Math.max( 0, evt.clientY ), window.innerHeight ),
		data = this.data,
		scale = data.ltPropContextualWheel ? 1 : data.ltPropScale,
		xInc = ( clientX - this._clientX ) / scale,
		yInc = ( clientY - this._clientY ) / scale,
		_this_node = this.$node,
		this_bcr =  this.__bcr || ( this.__bcr = _this_node.getBoundingClientRect() ),
		sL = 'ltPropScrollLeft',
		sT = 'ltPropScrollTop',
		x = 0,
		y = 0,
		moving = this._item,
		moving_length = moving.length,
		refreshTime = data.ltPropRefreshTime,
		prevent,
		cb = "onMove";

		if (data.ltPropSwimLanes) {
			var callback = "restrictLimits";
			if (this.getMethods(callback)) {
				var ret = this.executeMethod( callback, moving, xInc, yInc, _this_node );
				xInc = ret.xInc;
				yInc = ret.yInc;
			}
		}

		if(xInc || yInc){
			this._moved = true;
		}

		if( ori_evt.touches ){
			if( moving_length == 1 ){
				var elem = evt.target.closest( 'lyte-connection-content' );
				if( ( elem && yInc ) || this.touchScrolling ){
					var sTop = elem.scrollTop,
					sH = elem.scrollHeight,
					oH = elem.offsetHeight;

					if( !( ( yInc > 0 && Math.round( sTop ) == 0 ) || ( yInc < 0 && Math.round( sTop + oH ) == sH ) ) || this.touchScrolling ){
						yInc = 0;
						xInc = 0;
                        this.touchScrolling = true;
					} else {
						prevent = true;
					}
				}
			}
		}

		window.cancelAnimationFrame( this._frame );
		delete this._frame;

		moving.forEach( function( item ){
			var elem = item.get(0);
			if( data.ltPropGroupArrange ){
				this.check_grp_in_move( elem, evt );
			}
			if (data.ltPropOverlapCheck && data.ltPropOverlapCheckOnDrag) {
				var id = elem.id,
					details = this.get_details()[id].position,
					minDiff = data.ltPropMinDiff * 0.5,
					ranges = [{ _left: [], _right: [], left: details.left - minDiff, right: details.left + details.width + minDiff, top: details.top - minDiff, bottom: details.top + details.height + minDiff, width: details.width + minDiff, height: details.height + minDiff }],
					len = ranges.length,
					ignore = [];
				data.ltPropData.forEach(function (item) {
					var _id = item.id;
					if (/lyteConnectFakeHangingItem_/i.test(_id) || id == _id) {
						ignore.push(_id);
					}
				});
				this.split_ranges_with_shapes(ranges, ignore);
				if (ranges.length != len) {
					item.addClass("lyteConnectShapeOverlapped");
				} else {
					item.removeClass("lyteConnectShapeOverlapped");
				}
			}
			var bool = this.individual_move( ori_evt, item, xInc, yInc, this_bcr, moving_length );
			x = x || bool.x;
			y = y || bool.y;
		}.bind( this ));

		if (refreshTime != void 0) {
			this.update_ignore(true);
			clearTimeout(this.refreshTime);
			this.refreshTime = setTimeout(function() {
				this.update_ignore(false);
				this._ranges = this.overall_split([]);
				this.refresh_other_connectors(this._data.map(function (item) {
					return item.id;
				}));
			}.bind(this), refreshTime);
		}

		if( data.ltPropMagnetiser ){
			ori_evt.type && this.magnetiser( moving );
		}

		if ( data.ltPropSwimNodes ) {
			this.$node.style.overflow = "visible";
		} else if ((x || y)) {

			if( x ){
				this.setData( sL, data[ sL ] + x );
				clientX += x;
			}
			if( y ){
				this.setData( sT, data[ sT ] + y );
				clientY += y;
			}

			this._frame = window.requestAnimationFrame( this.mousemove.bind( this, ori_evt ) );
		}
		this._clientY = clientY;
		this._clientX = clientX;

		if( prevent ){
			ori_evt.preventDefault();
		}

		this.getMethods( cb ) && this.executeMethod( cb, moving, ori_evt, this.$node );
	},

	update_preview_position : function( elem ){
		var __elem = this._preview.querySelector( "#preview_" + elem.id );
		if( __elem ){
			var __style = elem.style,
			__len = __style.length;

			for( var i = 0; i < __len; i++ ){
				var __prop = __style[ i ];
				__elem.style[ __prop ] = __style[ __prop ];
			}
		}
	},

	set_detail : function ( obj, param, pos, elem ){

		var __data = this.data,
		__details = __data.details;

		Lyte.objectUtils( obj, 'add', param, pos );
		__data.ltPropSwimLanes && this.getMethods('setDetails') && this.executeMethod('setDetails', this, elem, pos);

		if( __data.ltPropPreviewImage && __details == obj ){
			var __elem = this._preview.children[ 0 ].children[ 0 ],
			origin_elem = this.get_element( param );

			$L.fastdom.measure( function(){
				$L.screenGrab({
					dom : origin_elem,
					externalImport : false,
					validate_request : function(){
						return false;
					},
					external_request : function(){
						return false;
					},
					ignoreImage : true
				}).then( function( arg ){

					var exst = __elem.querySelector( '#preview_' + param );

					if( exst ){
						exst.remove();
					}

					var parent = arg.svg.children[ 0 ].children[ 0 ];
					parent.id = "preview_" + param;
					__elem.appendChild( parent );
					
				});
			} )
		}

	},

	get_position : function( obj ){
		var __obj = {};

		for( var key in obj ){
			var __cur = obj[ key ];

			__obj[ key ] = __cur.position;
		}

		return __obj;
	},

	individual_move : function( evt, _item, xInc, yInc, this_bcr, moving_length ){
		var elem = _item.get( 0 ),
		position = _item.data( 'position' ),
		bcr = elem.getBoundingClientRect(),
		data = this.data,
		/*group_arrange = data.ltPropGroupArrange,*/
		__detail,
		details,
		data_details = data.details,
		id = elem.id.replace( data.ltPropIdPrefix, '' ),
		x = 0,
		y = 0;

		// if( group_arrange ){
		// 	__detail = data_details[ this.get_parent_id( id ) ].children[ id ];
		// } else {
			__detail = data_details[ id ];
		// }

		if (!position) {
			_item.data('position', $L.extend(true, {}, __detail.position));
			position = _item.data('position');
		}

		if( moving_length == 1 && data.ltPropSmartGuide /*&& !group_arrange*/ ){
			var is_x_inc = xInc > 0,
			is_y_inc = yInc > 0,
			__buffer = _item.data(),
			is_same_x = is_x_inc == __buffer.x_inc,
			is_same_y = is_y_inc == __buffer.y_inc,
			__x = is_same_x ? __buffer.x : 0,
			__y = is_same_y ? __buffer.y : 0,
			/* include lyte-smartguide-utils.js mixin file */
			ret = this.smart_guide( { id : id }, xInc + __x, yInc + __y, this.get_position( data_details ), data.ltPropSmartBuffer, 1, 1 );

			if( ret ){
				var new_x = ret.xInc,
				new_y = ret.yInc,
				hori = ret.hori,
				vert = ret.vert,
				__class = 'lyteConnectHiddenElem';

				if( is_same_x ){
					__buffer.x = xInc + __x - new_x;
				} else {
					__buffer.x_inc = is_x_inc;
					__buffer.x = 0;
				}

				if( is_same_y ){
					__buffer.y = yInc + __y - new_y;
				} else {
					__buffer.y_inc = is_y_inc;
					__buffer.y = 0;
				}

				hori && this._horismart[ hori.fn ]( __class ).css( hori.style );
				vert && this._vertsmart[ vert.fn ]( __class ).css( vert.style );

				xInc = new_x;
				yInc = new_y;
			}
		}

		details = __detail.position;

		position.left += ( xInc );
		position.top += ( yInc );

		_item.css( position );

		// Lyte.objectUtils( __detail, 'add', 'position', $L.extend( true, $L.extend( {}, details ), position ) );
		this.set_detail( __detail, 'position', $L.extend( true, $L.extend( {}, details ), position ), elem );

		this.update_viewbox();
		this.update_position( elem );

		function fn( _left, _right, inc ){
			if( this_bcr[ _left ] >= bcr[ _left ] && inc < 0 ){
				return 1;
			} else if( this_bcr[ _right ] <= bcr[ _right ] && inc > 0 ){
				return -1;
			}
		}

		var x_fact = fn( 'left', 'right', xInc ),
		y_fact = fn( 'top', 'bottom', yInc ),
		bool = { 
			x : 0,
			y : 0
		};

		if( x_fact ){
			bool.x += 5 * x_fact;
		}

		if( y_fact ){
			bool.y += 5 * y_fact;
		} 

		return bool;
	},

	dragup : function( evt ){
		var cb = 'onDragEnd';

		if( this._moved ){
			this.getMethods( cb ) && this.executeMethod( cb, evt, this.$node );
		}
		this.bind_evt( 'removeEventListener', evt );

		$L( this.$node ).removeClass( 'lyteDragSelection' );

		[ '_move', '_moved', '_up', '_clientX', '_clientY', '_frame', '_cache' ].forEach( function( item ){
			delete this[ item ];
		}.bind( this ));

		this.resetSelected( evt );
	},

	check_overlap : function( obj, cur_id, ranges, __detail, store_in ){
		var details = __detail || this.get_details( cur_id )[ cur_id ].position,
		__width = details.width,
		__height = details.height,
		dimension = {
			width : __width,
			height : __height
		},
		new_pos =  this.find_position( ranges, {
						x : obj.left + __width * 0.5,
						y : obj.top + __height * 0.5
					}, dimension, true ),
		changed = !( obj.left == new_pos.left && obj.top == new_pos.top );

		$L.extend( true, obj, new_pos );

		if( store_in ){
			this._split_indiv( cur_id, ranges, new_pos );
			this._ranges = ranges;
		}

		return changed;
	},

	_split_indiv : function( key, ranges, __obj, __detail ){
		var cur = __detail || this.get_details( key )[ key ].position,
		obj =  {
			position : __obj || {
				left : cur.left,
				top : cur.top
			},
			dimension : {
				width : cur.width,
				height : cur.height
			}
		};

		this.split_ranges( ranges, obj );
	},

	get_parent_id : function( id ){
		var prefix = this.data.ltPropIdPrefix;

		return $L( '#' + prefix + id, this.$node ).parent().attr( 'id' ).replace( prefix, '' );
	},

	get_details : function( id ){
		var data = this.data, 
		details = data.details;

		// if( id && data.ltPropGroupArrange ){
		// 	if( !details[ id ] ){
		// 		details = details[ this.get_parent_id( id ) ].children;
		// 	}
		// }
		return details;
	},

	split_ranges_with_shapes : function( ranges, ignoreList, ignoreParent ){
		var details = this.get_details( ( ignoreList || [] ) [ 0 ] );

		for( var key in details ){
			if( ignoreList.indexOf( key ) != -1 ||  $L( '#' + this.data.ltPropIdPrefix + key, this.$node ).hasClass( 'lyteConnectHiddenElem' ) ){
				continue;
			}
			if (ignoreParent && ignoreParent.includes(key)) {
				var parent = details[key],
					parentBcr = this.get_element(key).getBoundingClientRect();
				parent.data.children.forEach(function (child) {
					var childBcr = this.get_element(child.id, key).getBoundingClientRect(),
						childPos = { left: parent.position.left + (childBcr.left - parentBcr.left), top: parent.position.top + (childBcr.top - parentBcr.top), width: childBcr.width, height: childBcr.height };
					this._split_indiv(child.id, ranges, undefined, childPos);
				}.bind(this));
			} else {
				this._split_indiv(key, ranges);
			}
		}
	},

	// check_child_position : function( id, parent_id ){
	// 	var data = this.data,
	// 	ns = "ltPropGroupArrange",
	// 	old_value = data[ ns ],
	// 	ranges,
	// 	details = data.details[ parent_id ].children[ id ],
	// 	_pos = details.position,
	// 	position = {
	// 		left : _pos.left,
	// 		top : _pos.top
	// 	};

	// 	data[ ns ] = true;
	// 	ranges = this.overall_split( [ id ] );
		
	// 	if( this.check_overlap( position, id, ranges ) ){
	// 		var LC = Lyte.objectUtils;

	// 		LC( details.data, 'add', 'position', position );
	// 		LC( details, 'add', 'position', {
	// 			left : position.left,
	// 			top : position.top,
	// 			width : _pos.width,
	// 			height : _pos.height
	// 		});
	// 	}

	// 	data[ ns ] = old_value;
	// },

	check_position : function( id ){
		var _this = this/*,
		fastdom = $L.fastdom*/;

		if( !_this.data.ltPropOverlapCheck ){
			return;
		}

		// fastdom.measure( function(){
		// 	fastdom.mutate( function(){
				var ranges = _this.overall_split( [ id ] ),
				details = _this.data.details[ id ],
				__pos = details.position,
				position = {
					left : __pos.left,
					top : __pos.top
				},
				pos_str = "position",
				fn = function( obj ){
					Lyte.objectUtils( obj, 'add', pos_str,  $L.extend( !0, $L.extend( !0, {}, obj[ pos_str ] ), position )  )
				}.bind( _this );
				
				_this.check_overlap( position, id, ranges, void 0, _this.data.ltPropCheckLineBreak );
				_this.update_position( $L( '#' + _this.data.ltPropIdPrefix + id, _this.$node ).get( 0 ) );

				fn( details );
				fn( details.data );
				_this._boundary( _this.data.ltPropIgnoreMinMax );
		// 	})
		// });
	},

	overall_split : function( ignore, ignoreParent ){

		var inf = Infinity, 
		ranges = [ { _left : [], _right : [], left : -inf, right : inf, top : -inf, bottom : inf, width : inf, height : inf } ];

		this.split_ranges_with_shapes( ranges, ignore, ignoreParent );

		this._ranges = ranges;

		return ranges;
	},

	// reset_group : function( id ){
	// 	this.refresh_grp_position( this.data.details[ id ] );
	// 	this.check_position( id );
	// },

	// buff_check : function( $elem, new_position ){
	// 	var data = $elem.data(),
	// 	buff_x = data.buff_x || 0,
	// 	buff_y = data.buff_y || 0;

	// 	new_position.left += buff_x;
	// 	new_position.top += buff_y;
	// },

	/*Shape move mouseup*/

	mouseup : function( evt ){
		var _item = this._item || [],
		data = this.data,
		lineBreak = data.ltPropCheckLineBreak;

		clearTimeout(this.refreshTime);

		if( this._moved ){
			var callback = 'onDrop',
			overlap = data.ltPropOverlapCheck,
			ranges,
			call_list = [],
			cur_item = _item[0] && _item[0].get(0);

			if (data.ltPropSwimNodes && cur_item) {
				this.getMethods("swimNodes") && this.executeMethod("swimNodes", evt, this, cur_item);
			}

			if( overlap ){
				var ignore = [];
				data.ltPropData.forEach(function(item){
					var _id = item.id;
					if(/lyteConnectFakeHangingItem_/i.test(_id)){
						ignore.push(_id);
					}
				})
				ranges = this.overall_split( ignore.concat(this._data.map( function( item ){ 
					return item.id;
				} ) ) );
			}

			if( data.ltPropMagnetiser ){
				this.magnetiser_up();
			}

			this._data.forEach( function( data, index ){
				var old_position = data.position,
				$elem = _item[ index ],
				elem = $elem.get( 0 ),
				new_position = $elem.data( 'position' ),
				__id = data.id,
				final,
				call_update = false;

				if( this.data.ltPropGroupArrange && this._data.length == 1 && this.check_drop_grp( elem, evt ) ){
					return;
				}
				 
				// this.buff_check( $elem, new_position );

				if( overlap ){
					call_update = this.check_overlap( new_position, __id, ranges );
				}

				if( this.getMethods( callback ) && this.executeMethod( callback, elem, old_position, new_position, this.$node, evt ) == false ){
					$elem.css( final = old_position );
					call_update = true;
				} else {
					Lyte.objectUtils( data, 'add', 'position', final = new_position );
				}
				if( call_update ){
					this.update_position( elem );
				} else {
					this.pushToQueue({
						type : "positionUpdate",
						id : __id,
						oldValue : this.stringify( old_position ),
						newValue : this.stringify( new_position )
					});
					call_list.push( elem );
				}
				if( overlap ){
					this._split_indiv( __id, ranges, final );
				}
				$elem.removeClass("lyteConnectShapeOverlapped");
			}.bind( this ));

			this._boundary( true );

			if( lineBreak ){
				this.update_ignore( false );
				this._ranges = ranges;
				call_list.forEach( function( item ){
					this.update_position( item );
				}.bind( this ));

				this.refresh_other_connectors( this._data.map( function( item ){
					return item.id;
				}) );
			}

			// if( data.ltPropGroupArrange ){
			// 	this.reset_group( this.get_parent_id( this._data[ 0 ].id ) );
			// }

			window.cancelAnimationFrame( this._frame ); 
			// if(this.getData("ltPropSuggestion")){
			// 	var _this = this;
			// 	$L.fastdom.measure(function(){
			// 		$L.fastdom.mutate(function(){
			// 			var suggest_this=evt.target.closest( 'lyte-connect-item' );
			// 			if(suggest_this){
			// 				_this.element_selections(suggest_this,suggest_this.id,suggest_this,"remove");
			// 				_this.element_selections(suggest_this,suggest_this.id,suggest_this,"add");
			// 			}
			// 		});
			// 	});
				
			// }
		} else {
			this.getMethods('onRelease') && this.executeMethod('onRelease', _item, this.$node, evt);
			_item.length && this.data.ltPropSuggestion && Lyte.objectUtils(data.details[_item[0][0].id.replace(data.ltPropIdPrefix, '')].data, "add", "selected", true);
			if( lineBreak ) {
				this.update_ignore( false );
			}
		}
		$L( this.$node ).removeClass( "lyteConnectItemSelected" );
		this.bind_evt( 'removeEventListener', evt );

		[ '__bcr', '_move', '_moved', '_up', '_clientX', '_clientY', '_frame', '_cache', 'touchScrolling' ].forEach( function( item ){
			delete this[ item ];
		}.bind( this ));

		if( data.ltPropSmartGuide ){
			var class_name = 'lyteConnectHiddenElem',
			addClass = 'addClass';

			[ 'hori', 'vert' ].forEach( function( item ){
				this[ '_' + item + 'smart' ][ addClass ]( class_name );
			}.bind( this ));
		}

		this.focus();
	},

	refresh_other_connectors : function( arr ){
		var _this = this,
		data = _this.data,
		details = data.details,
		node = data.ltPropSwimLanes ? _this.$node.closest("lyte-connect-swimlanes") : _this.$node,
		connectors = Array.from( node.getElementsByClassName( 'lyteConnectionContainer' ) ).map( function( item ){
			return {
				id : item.id,
				elem : item,
				data : $L( item ).data()
			}
		}),
		to_refresh = [],
		$node = $L( node ),
		textBox = data.ltPropTextBox,
		lineBreak = data.ltPropCheckLineBreak,
		arrangeType = data.ltPropConnectionType;
		

		arr.forEach( function( item ){
			connectors.forEach( function( __item ){
				if( to_refresh.indexOf( __item.elem ) + 1 || $L( __item.elem ).hasClass( 'lyteConnectHiddenElem' ) ){
					return;
				}
				
				if( ((lineBreak && textBox && arrangeType == "curvyLine" && _this.isItemLineOverlap( item, __item.elem )) || _this.is_overlap( details[ item ].position, arr, __item.data ) || _this.isItemTextboxOverlap( ( __item.data.text_box || {} ).__bcr, details[item].position)) && !_this.isHangingConnect.call(_this,$L(__item.elem),item) ){
					to_refresh.push(__item.elem);
				}
			});			
		});

		to_refresh.forEach( function( item ){
			$node.connection( 'updateConnection', $L( item ) );
		});
	},

	is_overlap : function( detail, arr, data ){
		var prefix = this.data.ltPropIdPrefix, 
		query = 'lyte-connect-item,lyte-textbox',
		src = data.active_src.closest( query ).id.replace( prefix, '' ),
		target = data.active_target.closest( query ).id.replace( prefix, '' ),
		points = data.absolute_points;

		if( !points || ( arr.indexOf( src ) + 1 ) || ( arr.indexOf( target ) + 1 ) ){
			return;
		}

		var _len = points ? ( points.length - 1 ) : 0,
		ck = 40 / 2,
		_left = detail.left - ck,
		_top = detail.top - ck,
		_right = _left + detail.width + ck * 2,
		_bottom = _top + detail.height + ck * 2,
		fn = function( a, b, c ){
			return a <= c && c <= b;
		}

		for( var i = 0; i < _len; i++ ){
			var cur = points[ i ],
			next = points[ i + 1 ],
			start_x = Math.min( cur.x, next.x ),
			end_x = Math.max( cur.x, next.x ),
			start_y = Math.min( cur.y, next.y ),
			end_y = Math.max( cur.y, next.y );

			if( ( fn( _left, _right, start_x ) || fn( _left, _right, end_x ) || fn( start_x, end_x, _left ) || fn( start_x, end_x, _right ) ) && ( fn( _top, _bottom, start_y ) || fn( _top, _bottom, end_y ) || fn( start_y, end_y, _top ) || fn( start_y, end_y, _bottom ) ) ){
				return true;
			}
		}
	},

	isItemLineOverlap: function (item, elem) {//find overLap for curvyLine
		var node = this.data.ltPropSwimLanes ? this.$node.closest("lyte-connect-swimlanes") : this.$node,
			itemPos = node.component.data.details[item].position,
			elemTransform = elem.getAttribute("transform").match(/translate\((.+)\)/)[1].split(' '),
			transFormX = parseFloat(elemTransform[0]),
			transFormY = parseFloat(elemTransform[1]),
			childElem = elem.querySelector(".lyteConnectionPath"),
			start_co_ord = childElem.getPointAtLength(0),
			end_co_ord = childElem.getPointAtLength(childElem.getTotalLength()),
			elemStart = { x: transFormX + start_co_ord.x, y: transFormY + start_co_ord.y },
			elemEnd = { x: transFormX + end_co_ord.x, y: transFormY + end_co_ord.y },
			itemDim = { left: itemPos.left, right: itemPos.left + itemPos.width, top: itemPos.top, bottom: itemPos.top + itemPos.height },
			x1 = Math.abs(elemStart.x - elemEnd.x),//xDist
			y1 = Math.abs(elemStart.y - elemEnd.y),//yDist
			check_valid = function (side) {
				var min, max, cur_it = itemDim[side];
				(side == "left" || side == "right") ? (min = Math.min(elemStart.x, elemEnd.x), max = Math.max(elemStart.x, elemEnd.x)) : (min = Math.min(elemStart.y, elemEnd.y), max = Math.max(elemStart.y, elemEnd.y));
				if ((min <= cur_it && cur_it <= max)/* || (Math.abs(p1-p2) <= 1) || (Math.abs(p1-p3) <= 1)*/) {
					return true;
				}
			},
			retVal,
			elemData = $L(elem).data();
		if (elemData.active_src.id == item || elemData.active_target.id == item) {
			return;
		}
		//in here curvyLine is assumed to be straight line
		//so the formula is also for straight line, using total height and width and other param
		["left", "right", "top", "bottom"].forEach(function (side) {
			if (!retVal) {
				if (side == "left" || side == "right") {
					if (check_valid(side)) {//left side x
						var x2 = Math.abs(itemDim[side] - elemStart.x),
							y2 = y1 * x2 / x1,
							y_point = elemStart.y < elemEnd.y ? elemStart.y + y2 : elemStart.y - y2;
						if (itemDim.bottom >= y_point && itemDim.top <= y_point) {//left side y
							retVal = true;
						}
					}
				} else {
					if (check_valid(side)) {//top side y
						var y2 = Math.abs(itemDim[side] - elemStart.y),
							x2 = x1 * y2 / y1,
							x_point = elemStart.x < elemEnd.x ? elemStart.x + x2 : elemStart.x - x2;
						if (itemDim.left <= x_point && itemDim.right >= x_point) {//top side x
							retVal = true;
						}
					}
				}
			}
		});
		return retVal;
	},

	isItemTextboxOverlap: function (textBoxPos, itemPos) {

		if( !textBoxPos ){
			return false;
		}

		var minDiff = 20,
			ranges = {
				left: itemPos.left - minDiff,
				top: itemPos.top - minDiff,
				right: itemPos.left + itemPos.width + minDiff,
				bottom: itemPos.top + itemPos.height + minDiff,
				width: itemPos.width + (minDiff * 2),
				height: itemPos.height + (minDiff * 2),
				_left: [],
				_right: []
			},
			arrRanges = [ranges];

		this.split_ranges(arrRanges, textBoxPos);

		if (arrRanges.length == 1 && arrRanges[0] == ranges) {
			return false;
		}
		return true;

	},

	isHangingConnect: function (elem, item, overRide) {
		var data = elem.data(),
			bcr = data.options.trgPos,
			pos = this.get_details(item)[item].position;
		if (data.options.hanging && !/lyteConnectFakeHangingItem_/i.test(item) && (overRide || bcr.left >= pos.left && bcr.left <= pos.left + pos.width && bcr.top >= pos.top && bcr.top <= pos.top + pos.height)) {
			var srcId = data.active_src.id,
				srcPos = data.src_position,
				trgPos = data.target_position,
				abs = data.absolute_points,
				absLen = abs.length,
				connectElem = elem.get(0),
				$node = this.$node;

			if (absLen > 1) {
				var pos1 = abs[absLen - 2],
					pos2 = abs[absLen - 1],
					_x, _y;
				if (pos1.y == pos2.y) {//left or right
					_x = pos1.x < pos2.x ? 0 : 1
					_y = 0.5
				} else {
					_y = pos1.y < pos2.y ? 0 : 1
					_x = 0.5
				}
				trgPos.x = _x
				trgPos.y = _y
			}
			if (this.getMethods("onBeforeHangingConnect") ? this.executeMethod("onBeforeHangingConnect", connectElem, srcId, srcPos, item, trgPos) != false : true) {
				var targetId = data.target.get(0).id
				$node.disConnect($L(connectElem), false);
				$node.deleteShape(targetId);
				$node.connect(
					"#" + srcId,
					"#" + item,
					{
						id: data.options.id,
						src_position: srcPos,
						target_position: trgPos
					}
				);
				return true;
			}
		}
	},

	/*Event binding and removal*/

	bind_evt : function( name, evt ){
		var doc = document,
		mm = "mousemove",
		mu = "mouseup";

		if( /touch/i.test( evt.type ) ){
			mm = "touchmove";
			mu = "touchend";
		}

		doc[ name ]( mm, this._move, true );
		doc[ name ]( mu, this._up, true );
	},

	stopevt : function( evt ){
		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();
	},

	hover_fn : function( _this, evt, addClass, cb, fn_name, __class ){
		var $node = $L( _this ),
		class_name = __class || "lyteShapeHover",
		elems = $node.add( $node.find( '.lyteConnectionSrcElement,.lyteConnectionTargetElement' ) ),
		len = elems.length,
		ns = "lyteConnectionHover",
		to_call = _this[ fn_name ];

		if( to_call ){
			to_call( evt );
		}

		$node[ addClass ]( class_name );

		for( var i = 0; i < len; i++ ){
			var cur = elems.eq( i ),
			connections = cur.data( 'connection_elements' );
			cur[ addClass ]( class_name );

			for( var key in connections ){
				var value = connections[ key ],
				is_src = /^src_/.test( key ),
				name = class_name + ' ' + ns + ( is_src ? 'Src' : 'Target' ),
				__connector = value.connector;

				$L( __connector[ addClass ]( name ).data( 'text_box' ) )[ addClass ]( name );
				$L( __connector.data( "active_" + ( is_src ? 'target' : 'src' ) ) )[ addClass ]( "lyteConnectOtherEndHovered" );
			}
		}

		if( cb && this.getMethods( cb ) ){
			this.executeMethod( cb, evt, _this );
		}
	},

	methods : {
		wormhole : function( elem ){
			this.__wormhole = elem;
			return !!this.data.ltPropQuery
		}
	},

	actions : {

		textclick : function( evt, __this, index ){

			// if( this.data.ltPropReadonly ){
			// 	return;
			// }

			var $this = $L( __this ),
			connection = $this.data( 'connector' ),
			cb = "onTextbodyClick",
			arr = this.data.textBoxArray;

			this.getMethods( cb ) && this.executeMethod( cb, __this, $this.attr( 'connector-id' ), arr[ index ].text, connection.data( 'options' ), evt, this.$node );
		},

		keydown : function( evt ){
			if( this.data.ltPropReadonly ){
				return;
			}
			this.keydown( evt );
		},

		mouseenter : function( _this, evt ){
			this.hover_fn( _this, evt, 'addClass', 'onShapeHover', '_hovered' );
		},

		mouseleave : function( _this, evt ){
			this.hover_fn( _this, evt, 'removeClass', 'onShapeLeave', '_left' );
		},

		/*Preview drag*/

		preview_down : function( evt ){
			this.preview_down( evt );
			return false;
		},

		preview_click : function( evt ){
			this.preview_click( evt );
			return false;
		},

		/* entire component scroll*/

		scroll : function( evt ){
			var target = evt.target,
			element = target.closest( 'lyte-connect-item' );

			if( element ){
				if( this.add_more_data( element ) ){
					this.update_position( element );	
				}
			}
		},

		/* Main mousedown action for shape move, selection and entire area drag*/

		mousedown : function( evt ){
			if(this.data.onAnimation){
				return;
			}

			var target = evt.target,
			__data = this.data,
			group_arrange = __data.ltPropGroupArrange,
			// element = target.closest( 'lyte-connect-item' + ( group_arrange ? '.lyteConnectInnerItem' : ':not(.lyteConnectInnerItem),.lyteConnectionContainer' ) ),
			not_right = evt.buttons != 2 && evt.buttons != 3,
			is_shift = evt.shiftKey,
			select_mode = __data.ltPropSelectMode,
			ori_evt = evt,
			preview = this._preview,
			// $elem = $L( element ),
			__ns = '__selected_con',
			readonly = __data.ltPropReadonly,
			reconnect = __data.ltPropReconnectHandling,
			reconnectType = __data.ltPropReconnectHandlingType,
			adjust_lines = __data.ltPropAdjustLines,
			sub_cls = 'lyteConnectorElementSelected';

			evt = ( evt.touches || [ evt ] )[ 0 ];

			if( !not_right || evt.target.closest( 'lyte-suggestion-element' )){
				return;
			}

			if( preview && preview.contains( target ) ){
				return this.focus();;
			}

			if( !readonly && $L( target ).hasClass( 'lyteConnectReconnectElement' ) ){
				return this.reconnect_action( target, evt, ori_evt );
			}

			if( !readonly && $L( target ).hasClass( 'lyteConnectLineAdjustElement' ) ){
				return this.adjust_action( target, evt, ori_evt );
			}

			$L( $L( this[ __ns ] ).removeClass( sub_cls ).data( 'text_box' ) ).removeClass( sub_cls );
			delete this[ __ns ];

			if( group_arrange && !__data.ltPropLockGroupItems && target.closest( '.lyteConnectInnerItem' ) ){
				this.$node.unSelectShapes();
				return;
			} 

			var $connection = $L( target.closest( '.lyteConnectionContainer' ) );

			if( $connection.hasClass( 'lyteConnectionContainer' ) ){

				this[ __ns ] = $connection;
				$connection.addClass( sub_cls );
				this.focus();

				if( !readonly ){
					reconnect && reconnectType == "click" && this.show_reconnect( $connection );
					$L( $connection.data( 'text_box' ) ).addClass( sub_cls );
					( adjust_lines == "click" ) && this.show_adjust_pts( $connection );
				}

				return this.resetSelected( void 0, evt );
			}

			var element = target.closest( 'lyte-connect-item:not(.lyteConnectInnerItem)' ),
			$elem = $L( element );

			if( __data.ltPropSwimLanes ){
				if(element){
					var swimlane = element.closest("lyte-connect-swimlanes"),
						par=__data.ltPropSwimNodes?swimlane:element.closest("lyte-connect"),
						par_bcr = par.getBoundingClientRect(),
						elem_bcr = element.getBoundingClientRect(),
						obj={left:par_bcr.left>elem_bcr.left,
							right:par_bcr.right<elem_bcr.right,
							top:par_bcr.top>elem_bcr.top,
							bottom:par_bcr.bottom<elem_bcr.bottom};
					swimlane.component.setData("out_range",obj);
				}
			}

			reconnect && this.hide_reconnect();
			( adjust_lines == "click" ) && this.hide_adjust_pts();

			if( ( ori_evt.touches || [] ).length > 1 || target.closest( __data.ltPropSelectors.selector ) ){
				return this.focus();
			}

			// if( element && group_arrange ){
			// 	return;
			// }

			if( element && ( !select_mode /*|| group_arrange*/ ) ){

				var index = Number( $elem.attr( 'data-index' ) ),
				callback = 'onSelect',
				selected_class = 'lyteConnectionSelected';

				this.data.ltPropSuggestion && Lyte.objectUtils(this.data.details[element.id.replace(this.data.ltPropIdPrefix, '')].data, "delete", "selected");

				if( ( this.getMethods( callback ) && this.executeMethod( callback, ori_evt, element, this.$node ) == false ) ){
					return this.focus();;
				}

				var selected = this._data,
				item = this._item,
				cur_data,
				ltPropData = __data.ltPropData,
				is_selected = $elem.hasClass( selected_class );

				// if( group_arrange ){
				// 	cur_data = ltPropData[ Number( $elem.parent().attr( 'data-index' ) ) ].children[ index ];
				// } else{
					cur_data = ltPropData[ index ];
				// }

				if( is_shift ){
					this.stopevt( ori_evt );
					if( is_selected ){
						this.focus();
						this.__ignoreclick = true;
						return this.unselect( evt, element );
					}
				}

				$elem.data( 'position', $L.extend( true, {}, cur_data.position ) );

				this._clientX = evt.clientX;
				this._clientY = evt.clientY;

				if( !is_shift ){

					if( !readonly ){

						this._move = this.mousemove.bind( this );
						this._up = this.mouseup.bind( this );

						$L( this.$node ).addClass( "lyteConnectItemSelected" );

						this.bind_evt( 'addEventListener', ori_evt );

						var scroll_content = evt.target.closest( 'lyte-connection-content' );

						if( /touch/i.test( ori_evt.type ) ){
							if( !scroll_content ){
								ori_evt.preventDefault();
							}
						} else {
							ori_evt.preventDefault();
						}
					}

					if( !is_selected ){
						this.resetSelected( void 0, evt );
					}

				}

				this.select( evt, element );

				if( !readonly && __data.ltPropCheckLineBreak ){
					this.update_ignore( true );
				}

			} else if( !element && ( ( /*!this._data.length &&*/ !is_shift ) || select_mode ) ){

				var class_name;

				if(readonly && target.closest('.lyteConnectTextbox')){
					return;
				}

				if( select_mode /*&& !group_arrange*/ ){

					if( readonly ){
						return;
					}

					var callback = 'onClickSelect';
					class_name = 'lyteClickSelection';

					if( this.getMethods( callback ) && this.executeMethod( callback, ori_evt, this.$node ) == false ){
						return this.focus();;
					}

					this._move = this.selectmove.bind( this );
					this._up = this.selectup.bind( this );
				} else {

					var callback = 'onDragStart';
					class_name = 'lyteDragSelection';

					if( ( this.getMethods( callback ) && this.executeMethod( callback, ori_evt, this.$node ) == false ) ){
						return this.focus();;
					}

					this._move = this.dragmove.bind( this );
					this._up = this.dragup.bind( this );
				}

				if( ori_evt.touches && !__data.ltPropSuggestion ){
					// ?
					ori_evt.preventDefault();
				}

				this._clientX = evt.clientX;
				this._clientY = evt.clientY;
				this.bind_evt( 'addEventListener', ori_evt );
				$L( this.$node ).addClass( class_name );
			}
		},

		adjustEnter : function( evt, __this ){
			if( this.data.ltPropAdjustLines == "hover" ){
				this.adjustEnter( evt, __this );
			}
		}
	},
	
	adjustEnter : function( evt, __this, __force ){
		var evt_type = evt.type;
		if( evt.buttons && !__force ){
			this.__last_event = {
				evt : evt,
				__this : __this
			};
		} else {
			var rel = evt.relatedTarget,
			connector = __this.getAttribute( "connector" ),
			connector_elem = $L( '#' + connector, this.$node ),
			ns = ( evt_type == "mouseenter" ? 'add' : 'remove' ) + "Class",
			className = 'lyteConnectAdjustPointHovered';

			$L( connector_elem[ ns ]( className ).data( "text_box" ) )[ ns ]( className );

			if( !__force && rel && rel.parentNode && rel.parentNode.id == connector ){
				return;
			} else {
				this.toggle_hover( evt, connector_elem.get( 0 ) ); 	
			}
		}
	},

	/*Pushes a value if its not exist*/

	pushIfNot : function( arr, value, position_arr, __value ){
		var index = arr.indexOf( value );
		if( index == -1 ){
			arr.push( value );
			position_arr && position_arr.push( __value );
		}
	},

	/* Main arrange function*/

	arrange : function( frm_didConnect ){
		var elems = Array.from( $L( this.__wrapper ).children( 'lyte-connect-item:not(.lyteConnectHiddenElem)' ) ),
		obj = {},
		new_obj = {},
		$this = $L( this.$node ),
		data = this.data,
		_dim = {
			width : $this.width(),
			height : $this.height(),
			scrollLeft : data.ltPropScrollLeft,
			scrollTop : data.ltPropScrollTop
		},
		fastdom = $L.fastdom,
		fn_name,
		__need_sort = false,
		fixedLevels = this.data.ltPropFixedArrangeLevels;

		elems.forEach( function( item ){
			 if( $L( item ).hasClass( 'lyteConnectHiddenElem' ) ){
			 	return;
			 }
			 this.formatting( item, new_obj, 0 );
			 fixedLevels && (new_obj[item.id].level = data.details[item.id].data.level);
		}.bind( this ));

		data.ltPropAdjustLines && this.updateAdjustConnectors();

		switch( this.data.ltPropArrangeType ){
			case 'siblingtree' : {
				fn_name = 'sibling_arrange';
				__need_sort = true;
			}
			break;
			case 'default' : {
				fn_name = 'set_positions';
			}
			break;
			case 'random' : {
				fn_name = 'arrangeShapes';
			}
			break;
			case 'circle' : {
				fn_name = 'circle_arrange'
			}
		}

		if( __need_sort ){
			Object.keys( new_obj ).map( function( item ){
				return new_obj[ item ]
			}).sort( function( a, b ){
				return a.level - b.level;
			}).forEach( function( item ){
				obj[ item.id ] = item;
			});
		} else {
			obj = new_obj;
		}

		this[ fn_name ]( obj, _dim, frm_didConnect );

		fastdom.measure( function(){
			this._boundary();
			fastdom.mutate( function(){
				this.moveToCenter();
			}.bind( this ));
		}.bind( this ));
	},

	updateAdjustConnectors: function () {
		var animDur = this.data.ltPropAnimationDuration;
		Array.from(this.$node.getElementsByClassName('lyteConnectionContainer')).forEach(function (connector) {
			var $connector = $L(connector),
				data = $connector.data();
			if (data.adjustPoints) {
				setTimeout(function () {
					animDur && (this.__anime_dur = animDur);
					$L(this.$node).connection('updateConnection', $connector);
				}.bind(this), 0)
			}
		}.bind(this));

		animDur && setTimeout(function () {
			delete this.__anime_dur;
		}.bind(this), (parseFloat(animDur) * animDur.includes('ms') ? 1 : 1000) + 10)
	},

	/* Reference origin point for a shape */

	get_origin : function( _dim, obj, cur ){

		var x = 0,
		y = 0,
		modified = 0;

		cur.from.forEach( function( item ){
			var next = obj[ item ];
			if( next.modified ){
				var pos = next.position,
				dim = next.dimension;

				x += ( pos.left + dim.width * 0.5 );
				y += ( pos.top + dim.height * 0.5 );
				modified++;
			}
		});

		if( modified ){
			return {
				x : x / modified,
				y : y / modified
			}
		}

		var max_heigth = 0;

		cur.to.forEach( function( item ){
			max_heigth = Math.max( max_heigth, obj[ item ].dimension.height );
		});


		return{
			x : _dim.width * 0.5,
			y : _dim.height * 0.5 + max_heigth + 100
		};
	},

	/* It joins nearby ranges for finding bigger range*/

	individual_join : function( cur, merged, done, origin ){

		if( origin && !this._ignore_merge ){
			var offset = 500,
			exp_left = origin.left - offset,
			exp_top = origin.top - offset,
			exp_right = origin.right + offset,
			exp_bottom = origin.bottom + offset;

			if( cur.left > exp_right || cur.right < exp_left || cur.top > exp_bottom || cur.bottom < exp_top ){
				/* This function is costlier for ~500 shapes. So assuming ranges having offset 500px from expected origin don't need any merging. Ranges failed in this if check won't be merged*/
				merged.push( [ cur ] );
				done.push( cur );
				return;
			}
		}

		var right = cur._right,
		_this = this,
		is_consumed = function( src, target ){
			return src.left <= target.left && src.top <= target.top && src.right >= target.right && src.bottom >= target.bottom;
		},
		newly_merged = [],
		copy_removal = function( new_range ){
			var new_merge_len = newly_merged.length,
			push_new = true;

			for( var j = 0; j < new_merge_len; j++ ){
				var new_cur = newly_merged[ j ];

				if( is_consumed( new_cur, new_range ) ){
					push_new = false;
					break;
				} else if( is_consumed( new_range, new_cur ) ){
					newly_merged.splice( j--, 1 );
					new_merge_len--;
				}
			}

			return push_new;
		};

		if( right.length ){
			var push_current = true;

			for (var j = 0; j < right.length; j++) {
				var item = right[j],
				__index = done.indexOf( item );
				if( __index == -1 ){
					_this.individual_join( item, merged, done, origin );
					__index = done.indexOf( item );
				}

				var values = merged[ __index ],
				len = values.length;

				for( var i = 0; i < len; i++ ){
					var next = values[ i ],
					new_range = {
						top : Math.max( cur.top, next.top ),
						bottom : Math.min( cur.bottom, next.bottom ),
						left : cur.left ,
						right : next.right,
						is_hori : cur.is_hori,
						mid_x : cur.mid_x,
						mid_y : cur.mid_y
					};

					if(  is_consumed( cur, new_range ) || is_consumed( next, new_range ) ){
						continue;
					}

					if( is_consumed( new_range, next ) ){
						values.splice( i--, 1 );
						len--;
					}

					if( is_consumed( new_range, cur ) ){
						push_current = false;
					}

					new_range.width = new_range.right - new_range.left;
					new_range.height = new_range.bottom - new_range.top;

					if( copy_removal( new_range ) ){
						newly_merged.push( new_range );
					}
				}
			}
			if( push_current && copy_removal( cur ) ){
				newly_merged.push( cur );
			}
		} else {
			newly_merged.push( {
				left : cur.left,
				right : cur.right,
				top : cur.top,
				bottom : cur.bottom,
				width : cur.width,
				height : cur.height,
				is_hori : cur.is_hori,
				mid_x : cur.mid_x,
				mid_y : cur.mid_y
			} );
		}

		merged.push( newly_merged );
		done.push( cur );
	},

	join_ranges : function( ranges, width, height, origin ){
		var merged = [],
		done = [],
		_this = this,
		final = [];

		width = width || 0;
		height = height || 0;

		ranges.forEach( function( item ){
			if( done.indexOf( item ) == -1 ){
				_this.individual_join( item, merged, done, origin );
			}
		});

		merged.forEach( function( item ){
			item.forEach( function( __item ){
				if( __item.width >= width && __item.height >= height ){
					final.push( __item );
				}
			});
		});

		return final;
	},

	/* It will return best available position near to the given origin */

	find_position : function( ranges, origin, dim, frm_drop ){// cenetr dim
		var off = frm_drop ? this.data.ltPropMinDiff * 0.5 * this.offset_fact() : 100, 
		distance = Infinity,
		selected,
		width = dim.width + 2 * off,
		height = dim.height + 2 * off,
		mid_x = origin.x,
		mid_y = origin.y,
		exp_top = mid_y - height * 0.5,
		exp_bottom = mid_y + height * 0.5,
		exp_left = mid_x - width * 0.5,
		exp_right = mid_x + width * 0.5;

		this.join_ranges( ranges.slice(), width, height, { left : exp_left, top : exp_top, right : exp_right, bottom : exp_bottom } ).every( function( item ){
				var x_dist,
				y_dist,
				_distance,
				fn = function( _left, _right, mid ){
					if( item[ _left ] > mid || mid > item[ _right ] ){
						return  Math.min( Math.abs( item[ _left ] - mid ), Math.abs( item[ _right ] - mid ) )
					} 
					return 0;
				},
				is_fit = function(){
					return item.left <= exp_left && item.top <= exp_top && item.right >= exp_right && item.bottom >= exp_bottom;
				};

				x_dist = fn( 'left', 'right', mid_x );
				y_dist = fn( 'top', 'bottom', mid_y );
				_distance = Math.sqrt( x_dist * x_dist + y_dist * y_dist ); 

				if( _distance < distance ){
					distance = _distance;
					selected = item;
					if( is_fit() ){
						return false;
					}
				} else if( _distance == distance ){
					if( is_fit() ){
						distance = _distance;
						selected = item;
						return false;
					}
				}
			return true;
		});

		if( selected ){
			var fn = function( left, mid, right, item, __width ){
				var __left = item[ left ],
				__right =  item[ right ],
				left_diff = mid - __left,
				right_diff = __right - mid,
				half_width = __width * 0.5,
				is_right_great = right_diff >= half_width,
				is_left_great = left_diff >= half_width,
				cond1 = __left <= mid,
				cond2 = mid <= __right;

				if( cond1 && cond1 ){

					if( is_right_great &&  is_left_great ){
						return mid - half_width;
					}

					if( right_diff > left_diff ){
						if( is_left_great ){
							return mid - half_width;
						}
						return __left;
					} else {
						if( is_right_great ){
							return mid - half_width;
						}
						return __right - __width;
					}

				} else if( cond1 ) {
					return __right - __width;
				} else if( cond2 ){
					return __left;
				} 
			};

			return{
				left : fn( 'left', mid_x, 'right', selected, width ) + off,
				top : fn( 'top', mid_y, 'bottom', selected, height ) + off
			};
		}
		return {
			left : mid_x - width * 0.5 + off,
			top : mid_y - height * 0.5 + off
		};
	},

	is_exist : function( frm_didConnect, key ){
		return frm_didConnect.findIndex( function( item ){
			return item.item.id == key;
		}) != -1;
	},

	/* Common set position function */

	set_positions: function (obj, _dim, frm_didConnect, is_render_arrange, obj_form) {
		var _this = this,
			sibling_tree = (_this.data.ltPropArrangeType == "siblingtree"),
			siblingtree_type = _this.data.ltPropArrangeAnimationType,
			inf = Infinity,
			ranges = [{ _left: [], _right: [], left: -inf, right: inf, top: -inf, bottom: inf, width: inf, height: inf }],
			extra = [],
			obj_keys,
			obj_ind = 0,
			anim_occur = false,
			obj_keys_len,
			wrapper_evt = function (event) {
				if (event.srcElement == _this.__wrapper) {
					_this.$node.classList.remove("lyteConnectShapeOnAnimation");
					(_this.__wrapper).removeEventListener("transitionend", wrapper_evt);
				}
			},
			next_element = function (event) {
				if (typeof (event) == "object") {
					var cur_elem = _this.get_element(obj_keys[obj_ind]);
					cur_elem.removeEventListener("transitionend", next_element);
					anim_occur = true;
				}
				++obj_ind;
				if (obj_ind < obj_keys.length) {
					delay_animate(obj_keys[obj_ind]);
				} else {
					if (anim_occur) {
						_this.setup_boundary();
						(_this.__wrapper).addEventListener("transitionend", wrapper_evt);
					} else {
						_this.$node.classList.remove("lyteConnectShapeOnAnimation");
					}
				}
			},
			next_child = function (event) {
				var type = typeof (event),
					prefix = _this.data.ltPropIdPrefix,
					key = (type == "string" && event) || (type == "object" && _lyteUiUtils.getCurrentTarget( event ).id.replace(prefix, '')),
					childs = obj_form[key].from;
				if (type == "object") {
					var cur_elem = _this.get_element(key);
					cur_elem.removeEventListener("transitionend", next_child);
					anim_occur = true;
				}
				if (--obj_keys_len <= 0) {
					if (anim_occur) {
						_this.setup_boundary();
						(_this.__wrapper).addEventListener("transitionend", wrapper_evt);
					} else {
						_this.$node.classList.remove("lyteConnectShapeOnAnimation");
					}
				} else {
					childs.forEach(function (item) {
						delay_animate(item);
					});
				}
			},
			delay_animate = function (key) {
				var cur = obj[key];
				if (frm_didConnect) {
					if (_this.is_exist(frm_didConnect, key)) {
						extra.push(key);
					} else {
						obj.modified = true;
						_this.split_ranges(ranges, cur);
						!is_render_arrange && setTimeout(_this.update_position.bind(_this, _this.get_element(key), true), 0);
					}
				} else {
					if (cur.modified) {
						return;
					}
					_this.set_individual_position(obj, _dim, ranges, key, void 0, is_render_arrange);
					if (sibling_tree) {
						var event_fn = (siblingtree_type == "linear") ? next_element : next_child,
							cur_pos = cur.position,
							old_pos = cur.old_position,
							allow = (Math.abs(cur_pos.left - old_pos.left) < 1 || Math.abs(cur_pos.top - old_pos.top) < 1) ? false : true;
						if (allow) {
							_this.get_element(key).addEventListener("transitionend", event_fn);
						} else {
							event_fn(key);
						}
					}
				}
			};

		if (sibling_tree && !frm_didConnect) {
			if (siblingtree_type == "linear") {
				obj_keys = Object.keys(obj);
				if (obj_keys.length > 0) {
					this.$node.classList.add("lyteConnectShapeOnAnimation");
					delay_animate(obj_keys[obj_ind]);
				}
			} else if (siblingtree_type == "non_linear") {
				obj_keys_len = Object.keys(obj_form).length
				for (var start in obj_form) {
					var cur_level = obj_form[start].level;
					if (cur_level == 0) {
						this.$node.classList.add("lyteConnectShapeOnAnimation");
						delay_animate(start);
					}
				}
			} else {
				for (var key in obj) {
					delay_animate(key);
				}
			}
		} else {
			if(_this.data.ltPropSwimLanes){
				var data = _this.data,
				$node = _this.$node,
				left = data.ltPropScrollLeft,
				top = data.ltPropScrollTop,
				width = $node.offsetWidth;
				ranges[0] = { _left: [], _right: [], left: left, right: left+width, top: top, bottom: inf, width: width, height: inf }
			}
			for (var key in obj) {
				delay_animate(key);
			}
		}
		extra.forEach(function (item) {
			this.set_individual_position(obj, _dim, ranges, item, void 0, is_render_arrange);
		}.bind(this));

		if (this.data.ltPropCheckLineBreak) {
			this._ranges = ranges;
		}
	},

	/* Finds perfect position for a shape, sets and split ranges based on that*/

	set_individual_position : function( obj, _dim, ranges, key, ignore, is_render_arrange ){
		var cur = obj[ key ],
		from_sibling_pos = cur.old_position;

		if( !cur.modified ){
			var new_position = from_sibling_pos ? cur.position : this.find_position( ranges, this.get_origin( _dim, obj, cur ), cur.dimension ),
			elem = this.get_element( key ),
			$elem = $L( elem ),
			index = parseInt( $elem.attr( 'data-index' ) ),
			old_position = from_sibling_pos || cur.position,
			is_same;

			cur.position = new_position;

			is_same = old_position.left == new_position.left && old_position.top == new_position.top;

			if( !is_same || this.__allow_same ){
				var comp_data = this.data,
				__data = comp_data.ltPropData[ index ],
				__dur = comp_data.ltPropAnimationDuration,
				__old_position = __data.position;

				if( !is_same ){
					this.pushToQueue({
						type : "positionUpdate",
						id : key,
						oldValue : this.stringify( __old_position ),
						newValue : this.stringify( new_position )
					});
					Lyte.objectUtils( __data, 'add', 'position', new_position );
				}

				if( !is_render_arrange ){
					if( __dur ){
						$elem.css( 'opacity', 0 );
					}

					setTimeout( function(){
						this.update_position( elem, !from_sibling_pos );
						if( __dur ){
							this.shape_animate( $elem, new_position, __old_position || new_position, __dur );
						}
					}.bind( this ), 0 );
				}
			}

			cur.modified = true;
			this.split_ranges( ranges, cur );
		}

		!ignore && ( cur.to || [] ).forEach( function( item ){
			if( !obj[ item ].modified ){
				this.set_individual_position( obj, _dim, ranges, item, true );
			}
		}.bind( this ));
	},

						/* Range splitting code - for finding best available place */

	/* Splitting entire ranges based on single shape details*/

	split_ranges : function( ranges, cur ){
		var len = ranges.length,
		pos = cur.position,
		dim = cur.dimension,
		_left = pos.left,
		_right = pos.right || ( _left + dim.width ),
		_top = pos.top,
		_bottom = pos.bottom || ( _top + dim.height ),
		fn = function( cur, left, right, _left, _right ){
			var left_check = cur[ left ] < _left,
			right_check = cur[ right ] > _right,
			out_right = cur[ right ] <= _left,
			out_left = cur[ left ] >= _right,
			to_return = "4";

			if( out_left|| out_right ){
				to_return = '0';
			} else if( left_check && right_check ){
				to_return = '3';
			} else if( left_check ){
				to_return =  '2';
			} else if( right_check ){
				to_return = '1';
			} 
			return to_return;
		},
		replace_fn = function( arr, value, name, insert ){
			arr.forEach( function( item ){
				var __arr = item[ name ],
				index = __arr.indexOf( value );

				index != -1 && __arr.splice( index, 1 );

				if( insert ){
					__arr.push( insert );
				}
			});
		},
		is_falls = function( src, target, _left, _right ){
			var src_left = src[ _left ],
			src_right = src[ _right ],
			target_left = target[ _left ],
			target_right = target[ _right ];

			return ( target_left <= src_left && src_left <= target_right ) ||
			( target_left <= src_right && src_right <= target_right ) ||
			( src_left <= target_left && target_left <= src_right ) ||
			( src_left <= target_right && target_right <= src_right );
		},
		top_bottom_fn = function( remove_range, bottom_val, left_val, cur, _left, _right ){
			if( remove_range != void 0 ){
				ranges.splice( i + remove_range, 0, bottom_val );
			}
			if( left_val ){
				bottom_val[ _left ].push( left_val );
				left_val[ _right ].push( bottom_val );
			} else{
				bottom_val[ _left ] = cur[ _left ].filter( function( item ){
					return is_falls( bottom_val, item, 'top', 'bottom' );
				});
				replace_fn( bottom_val[ _left ], cur, _right, bottom_val );
			}
		},
		is_modified = false;

		for( var i = 0; i < len; i++ ){
			var cur = ranges[ i ],
			hori = fn( cur, 'left', 'right', _left, _right ),
			vert = fn( cur, 'top', 'bottom', _top, _bottom );

			if( hori == '4' && vert == '4' ){
				ranges.splice( i--, 1 );
				len--;
				continue;
			}

			var new_ranges = this.split( cur, _left, _right, _top, _bottom, hori, vert ),
			left_val = new_ranges.left,
			top_val = new_ranges.top,
			bottom_val = new_ranges.bottom,
			right_val = new_ranges.right,
			remove_range = 0;

			if( !left_val && !right_val && !top_val && !bottom_val ){
				continue;
			}

			if( left_val ){
				remove_range++;
				ranges.splice( i + remove_range, 0, left_val );
				left_val._left = cur._left.slice();
			}
			replace_fn( cur._left, cur, '_right', left_val );

			if( top_val ){
				remove_range++;
				top_bottom_fn( remove_range, top_val, left_val, cur, '_left', '_right' );
			}
			
			if( bottom_val ){
				remove_range++;
				top_bottom_fn( remove_range, bottom_val, left_val, cur, '_left', '_right' );
			}

			if( right_val ){
				remove_range++;
				ranges.splice( i + remove_range, 0, right_val );
				right_val._right = cur._right;
				replace_fn( cur._right, cur, '_left', right_val );
				if( top_val ){
					right_val._left.push( top_val );
					top_val._right.push( right_val );
				}
				if( bottom_val ){
					right_val._left.push( bottom_val );
					bottom_val._right.push( right_val );
				}
			} else {
				if( top_val ){
					top_bottom_fn( void 0, top_val, right_val, cur, '_right', '_left' );
				}
				if( bottom_val ){
					top_bottom_fn( void 0, bottom_val, right_val, cur, '_right', '_left' );
				}
			}

			ranges.splice( i--, 1 );
			i += remove_range;
			len = ranges.length;

			is_modified = is_modified || !!remove_range;
		}

		return is_modified;
	},

	/* Splitting a single range based on shape details */

	split : function( cur, _left, _right, _top, _bottom, hori, vert ){
		var split = {},
		fn = function( _left, _right, _top, _bottom ){
			return{
				left : _left,
				right : _right,
				top : _top,
				bottom : _bottom,
				width : _right - _left,
				height : _bottom - _top,
				mid_x : cur.mid_x,
				mid_y : cur.mid_y,
				is_hori : cur.is_hori,
				_left : [],
				_right : []
			};
		},
		left_max = Math.max( _left, cur.left ),
		right_min = Math.min( _right, cur.right ),
		to_left,
		to_right,
		to_top,
		to_bottom;

		switch( hori ){
			case '3' : {
				if( vert != '0' ){
					to_left = to_right = true;
				}
				switch( vert ){
					case '3' : {
						to_top = to_bottom = true;
					}
					break;
					case "2" : {
						to_top = true;
					}
					break;
					case "1" : {
						to_bottom = true;
					}
					break;
				}
			}
			break;
			case "2" : {
				if( vert != '0' ){
					to_left = true
				}
				switch( vert ){
					case '3' : {
						to_top = to_bottom = true;
					}
					break;
					case "2" : {
						to_top = true;
					}
					break;
					case "1" : {
						to_bottom = true;
					}
					break;
				}
			}
			break;
			case "1" : {
				if( vert != '0' ){
					to_right = true;
				}
				switch( vert ){
					case '3' : {
						to_top = to_bottom = true;
					}
					break;
					case "2" : {
						to_top = true;
					}
					break;
					case "1" : {
						to_bottom = true;
					}
					break;
				}
			}
			break;
			case '4' : {
				switch( vert ){
					case '3' : {
						to_top = to_bottom = true;
					}
					break;
					case "2" : {
						to_top = true;
					}
					break;
					case "1" : {
						to_bottom = true;
					}
					break;
				}
			}
		}

		if( to_left ){
			split.left = fn( cur.left, _left, cur.top, cur.bottom );
		}
		if( to_top ){
			split.top = fn( left_max, right_min, cur.top, _top );
		}
		if( to_bottom ){
			split.bottom = fn( left_max, right_min, _bottom, cur.bottom );
		}
		if( to_right ){
			split.right = fn( _right, cur.right, cur.top, cur.bottom );
		}

		return split;
	},

							/* Range splitting code */
	/* Arrange ordering */
	formatting : function( item, obj, __level ){
		var prefix = this.data.ltPropIdPrefix,
		id = item.id.replace( prefix, '' );

		if( obj[ id ] ){
			return;
		}

		var style = item.style,
		$item = $L( item ),
		src_class = 'lyteConnectionSrcElement',
		target_class = 'lyteConnectionTargetElement',
		src_elems = $item.find( '.' + src_class ),
		target_elems = $item.find( '.' + target_class ),
		from = [],
		to = [],
		from_position = [],
		to_position = [],
		common = [],
		_this = this,
		$node = $L( _this.$node ),
		__obj = { id : id },
		fn = function( arr, push, position_arr, name, other, to_level ){
			$L.each( arr, function( index, __item ){
				var connection = $node.connection( 'getConnections', __item );
				connection[ name ].forEach( function( in_item ){

					if( in_item.hasClass( 'lyteConnectHiddenElem' ) || in_item.data('options').avoidArrange){
						return;
					}

					if( _this.data.ltPropSwimLanes ){
						var src=in_item.data().active_src.offsetParent.id,
							target=in_item.data().active_target.offsetParent.id,
							details=Object.keys(_this.data.details);
						if(details.indexOf( src )==-1 || details.indexOf( target )==-1){
							return;
						}
					}

					var __other = in_item.data( other ).closest( 'lyte-connect-item:not(.lyteConnectInnerItem)' ).get( 0 );

					if( !__other ){
						return;
					}

					var __id = __other.id.replace( prefix, '' );

					if( !obj[ __id ] ){
						_this.formatting( __other, obj, to_level );
					}

					_this.pushIfNot( push, __id, position_arr, in_item.data( name + '_position' ) );
				});
			});
		};

		obj[ id ] = __obj;

		if( $item.hasClass( src_class ) ){
			src_elems = $item.add( src_elems );
		}

		if( $item.hasClass( target_class ) ){
			target_elems = $item.add( target_elems );
		}

		fn( src_elems, from, from_position, 'src', 'target', __level + 1 );
		fn( target_elems, to, to_position, 'target', 'src', __level - 1 );

		__obj.position = {
			left : parseInt( style.left ),
			top : parseInt( style.top )
		};
		__obj.dimension = {
			width : item.offsetWidth,
			height : item.offsetHeight
		};

		__obj.from = from;
		__obj.to = to;
		__obj.from_position = from_position;
		__obj.to_position = to_position;
		__obj.left_sibling = [];
		__obj.right_sibling = [];
		__obj.left_children = [];
		__obj.right_children = [];
		__obj.direct_children = [];
		__obj.parent = [];
		__obj.children = [];
		__obj.sibling = [];
		__obj.level = __level;

		__obj.common = common;
	},


										/* selection */

	/* returns shapes fall within given start end points. If 50% of area falls within selected area that shape will be considered as selected shape */										
	get_shapes : function( x1, y1, x2, y2 ){
		var details = this.data.details,
		fn = function( cur ){
			var _left = cur.left,
			_top = cur.top,
			_width = cur.width,
			_height = cur.height,
			_right = _left + _width,
			_bottom = _top + _height,
			area = _width * _height,
			new_width = Math.min( Math.max( _right, x1 ), x2 ) - Math.max( Math.min( _left, x2 ), x1 ),
			new_height = Math.min( Math.max( _bottom, y1 ), y2 ) - Math.max( Math.min( _top, y2 ), y1 ),
			new_area = new_width * new_height;

			return new_area && new_area / area >= 0.5;
		},
		arr = [];

		for( var key in details ){
			var __detail = details[ key ],
			cur = __detail.position;

			if( /lyteConnectHiddenElem/i.test( __detail.data.class ) ){
				continue;
			}

			if( fn( cur ) ){
				arr.push( __detail );
			}
		}

		return arr;
	},

	/* Select mousemove. It will simply creates one rect box. */

	selectmove : function( evt ){

		if( ( evt.touches || [] ).length > 1 ){
			return;
		}

		var ori_evt = evt;
		evt = ( evt.touches || [ evt ] )[ 0 ];

		var elem = this.__select_elem,
		bcr = this.$node.getBoundingClientRect(),
		_left = bcr.left,
		_top = bcr.top,
		_clientX = this._clientX,
		_clientY = this._clientY,
		clientX = evt.clientX,
		clientY = evt.clientY,
		allow,
		sL = "ltPropScrollLeft",
		sT = "ltPropScrollTop",
		data = this.data,
		boundary = data.ltPropBoundary,
		current_sL = data[ sL ],
		current_sT = data[ sT ],
		min = Math.min;

		if( !elem ){
			elem = this.__select_elem = $L( '<div></div>' ).addClass( 'lyteConnectSelectionElement' );
			this.$node.appendChild( elem.get( 0 ) );
		}

		elem.css({
			left : min( _clientX, clientX ) - _left,
			top : min( _clientY, clientY ) - _top,
			width : Math.abs( clientX - _clientX ),
			height : Math.abs( clientY - _clientY )
		});


		var fn = function( top_val, bottom_val, client_val, min_y, max_y, current, name, _name ){
			var _new = current,
			diff;

			if( top_val + 5 > client_val ){
				_new = min( Math.max( current + 5, min_y ), max_y );
			} else if( bottom_val - 5 < client_val ){
				_new = min( Math.max( current - 5, min_y ), max_y );
			}

			diff = _new - current;
			this.setData( name, _new );

			this[ _name ] += diff;

			return diff;

		}.bind( this );

		allow = fn( _top, bcr.bottom, clientY, boundary.min_y, boundary.max_y, current_sT, sT, '_clientY' );
		allow = allow || fn( _left, bcr.right, clientX, boundary.min_x, boundary.max_x, current_sL, sL, '_clientX' );

		window.cancelAnimationFrame( this._frame );

		if( allow ){
			this._frame = window.requestAnimationFrame( function(){
				this.selectmove( ori_evt );
			}.bind( this ));
		}
	},

	/* Mouseup for click and drag select. Here actual elements are marked as selected*/

	selectup : function( evt ){

		var cb = 'onClickSelectEnd',
		_this = this,
		scale = _this.data.ltPropContextualWheel ? 1 : _this.data.ltPropScale,
		bcr = _this.__wrapper.getBoundingClientRect(),
		fn = function( value, __top ){
			return ( value - bcr[ __top ] ) / scale;
		},
		fake_evt = ( evt.changedTouches || [ evt ] ) [ 0 ],
		shapes = _this.get_shapes( fn( Math.min( _this._clientX, fake_evt.clientX ), 'left' ), fn( Math.min( _this._clientY, fake_evt.clientY ), 'top' ), fn( Math.max( _this._clientX, fake_evt.clientX ), 'left' ), fn( Math.max( _this._clientY, fake_evt.clientY ), 'top' ) ),
		class_name = 'lyteConnectionSelected',
		elem = _this.__select_elem;

		if( elem && !( _this.getMethods( cb ) && _this.executeMethod( cb, evt, shapes, _this.$node ) == false ) ){

			if( !evt.shiftKey ){
				_this.resetSelected( evt );
			}

			var data = _this._data,
			item = _this._item,
			prefix = _this.data.ltPropIdPrefix;

			shapes.forEach( function( _item ){
				var __data = _item.data,
				index = data.indexOf( __data );

				if( index == -1 ){
					data.push( __data );
					item.push( $L( '#' + prefix + __data.id, _this.$node ).addClass( class_name ).data( 'position', $L.extend( true, {}, __data.position ) ) );
				}
			});
		}

		_this.bind_evt( 'removeEventListener', evt );
		window.cancelAnimationFrame( _this._frame );

		if( elem ){
			elem.get( 0 ).remove();
		}

		[ '_move', '_moved', '_up', '_clientX', '_clientY', '_frame', '__select_elem' ].forEach( function( item ){
			delete _this[ item ];
		});

		_this.__ignoreclick = true;
	},
										/* selection end*/

										/* contextual zoom */
	/* Main contextual zoom observer function*/
	cont_obs : function( arg ){

		if( !this.data.ltPropContextualZoom || this.isUndo() ){
			return;
		}

		// var origin = this._origin;

		// if( !origin ){
		// 	this.data.ltPropScale = arg.newValue / 100;
		// }

		this.cont_zoom_fn( arg/*, origin*/ );

	}.observes( 'ltPropContextualZoomLevel' ),

	contextual_zoom_wheel : function( __scale, origin ){
		var data = this.data,
		zoom_str = 'ltPropContextualZoomLevel',
		scale_str = 'ltPropScale',
		cont_level = data[ zoom_str ],
		hundred = 100,
		min_scale = data.ltPropMinScale,
		max_scale = data.ltPropMaxScale,
		zoom_data = this.data.ltPropContextualZoomData;

		__scale = Math.max( Math.min( __scale, max_scale ), min_scale );

		var scale_value = parseInt( __scale * hundred ),
		old_scale = data[ scale_str ],
		is_increase = __scale > old_scale,
		keys = Object.keys( zoom_data ).map( Number ),
		index = keys.indexOf( hundred ),
		nearest_level;

		if( index == -1 ){
			keys.push( hundred );
		}

		nearest_level = this.get_nearest( keys, scale_value, is_increase );

		if( old_scale == __scale ){
			return;
		}

		data[ scale_str ] = __scale;

		// this._origin = origin;
		this.setData( zoom_str, nearest_level );
		// delete this._origin;
	},

	get_nearest : function( keys, current, is_increase ){

		keys.sort( function( a, b ){ 
			return ( a - b ) * ( is_increase ? -1 : 1 );
		});

		var nearest_level;

		keys.every( function( item ){
			if( is_increase ){
				if( item < current ){
					return false;
				}
				nearest_level = item;
			} else{
				if( item >= current ){
					nearest_level = item;
					return false;
				}
			}
			return true;
		});

		return nearest_level;
	},

	cont_zoom_fn : function( arg, origin ){
		var __old = arg.oldValue,
		__new = arg.newValue,
		ns = 'lyteConnectContextualLevel',
		anim = "lyteContextualAnimation",
		addClass = 'addClass',
		removeClass = 'removeClass',
		cb = 'onAfterContextual',
		not_origin = !origin,

		fn = function( evt ){
			var $cur_target = $L( _lyteUiUtils.getCurrentTarget( evt ) )[ removeClass ]( anim ).off({
						transitionend : fn,
						animationend : fn
					});
			window.requestAnimationFrame( function(){
				$cur_target.removeData( 'transition' );
				_this.update_ignore( false );
				_this._boundary( true );

				_this.getMethods( cb ) && _this.executeMethod( cb, _this.$node );
				if( _this.data.ltPropCheckLineBreak ){
					_this.$node.refreshConnectors( void 0, true );
				}
			});
		},
		_this = this,
		$node = $L( _this.$node ),
		keys = _this.data.ltPropContextualBreakPoints,
		bcr = not_origin ? _this.$node.getBoundingClientRect() : $L.extend( origin, { width : 0, height : 0, left : 0, top : 0 } ),
		old_class = _this.$node.className.split( ' ' ).filter( function( item ){
    		return item.indexOf( ns ) == 0;
		})[ 0 ],
		is_increase = __new > __old,
		new_class = ns + _this.get_nearest( keys.slice(), __new, is_increase );

		$node[ removeClass ]( old_class)[ addClass ]( new_class );

		_this.$node.style.setProperty( '--contextualLevel', __new );
		$node.data( 'transition', true );
		$L.fastdom.measure( function(){
			_this.update_dimensions();
			
			$node[ addClass ]( old_class )[ removeClass ]( new_class );
			_this.$node.style.setProperty( '--contextualLevel', __old );
				
			window.requestAnimationFrame( function(){
				$node.removeClass( old_class ).addClass( new_class + ' ' + anim ).on({
					transitionend : fn,
					animationend : fn
				})/*.data( 'transition', true )*/;
				_this.update_ignore( true );
				_this.$node.style.setProperty( '--contextualLevel', __new );

				if (_this.contextual_zoom(__new, __old, bcr)) {
					fn({ currentTarget: _this.$node });
				}
			});
		});

		this.pushToQueue({
			type : "contextualZoom",
			data : this.stringify( arg )
		});
	},

	/* reading target contextual zoom levels dimension */

	update_dimensions : function( _key ){
		var details = this.data.details,
		fn = function( cur, key, parent_id ){
			var pos = cur.position,
			elem = this.get_element( key, parent_id )/*,
			bcr = elem.getBoundingClientRect()*/;

			pos.width = /*bcr.width*/ elem.offsetWidth;
			pos.height = /*bcr.height*/ elem.offsetHeight;


			if( this.data.ltPropPreviewImage ){
				this.set_detail( details, parent_id || key, details[ parent_id || key ] );
			}
		}.bind( this );

		if( _key ){
			return fn( details[ _key ], _key );
		}
		for( var key in details ){
			var cur = details[ key ],
			children = cur.children || {};

			if( cur.data.children ){
				for( var __key in children ){
					fn( children[ __key ], __key, key );
				}
			} else {
				fn( cur, key );
			}
		}
	},

	/* Return element dom from its id without queryselector*/

	get_element : function( key, parent ){
		var details = this.data.details[ parent || key ],
		data = this.data.ltPropData,
		index = data.indexOf( details.data ),
		elem = this.__wrapper.children[ index ];

		if( parent ){
			var child = this.get_child_data( details.data.children, key ),
			index = details.data.children.indexOf( child );

			elem = $L(elem).children('lyte-connect-item')[ index ];
		}

		return elem;
	},

	sort_origin : function( details, cx, cy ){
		var obj = [],
		distance = function( item ){
			var pos = item.position;
			return Math.sqrt( Math.pow( cx - pos.left, 2 ) + Math.pow( cy - pos.top, 2 ) );
		};

		for( var key in details ){
			obj.push({
				key : key,
				position : details[ key ].position
			});
		};

		return obj.sort( function( a, b ){
			return distance( a ) - distance( b );
		});
	},

	/* Changing positions of the shape based on new contextual zoom level */

	contextual_zoom : function( _new, _old, bcr ){
		var comp_data = this.data,
		details = comp_data.details,
		zoom_data = comp_data.ltPropContextualZoomData,
		keys = Object.keys( zoom_data ).map( Number ).sort( function( a, b ){ 
			return a - b 
		} ),
		data = zoom_data[ _new ],
		fn = function( item ){
			if( !data ){
				return 1;
			}
			return ( data[ item ] || 100 ) / 100;
		},
		left_fact = fn( 'left' ),
		top_fact = fn( 'top' ),
		infinity = Infinity,
		ranges = [ { _left : [], _right : [], left : -infinity, right : infinity, top : -infinity, bottom : infinity, width : infinity, height : infinity } ],
		is_backward =  _new > _old,
		common_data = {
			left : 100,
			top : 100
		},
		is_avail = function( index ){
			return index != -1;
		};

		if( !is_backward ){
			keys.reverse();
		}

		keys.every( function( item ){

			if( is_backward ){
				if( item < _old ){
					return true;
				} else if( item > _new ){
					return false;
				}
			} else{
				if( item > _old ){
					return true;
				} else if( item < _new ){
					return false;
				}
			}

			var cur_data = zoom_data[ item ],
			merge = function( name ){
				var __value = cur_data[ name ];
				if( __value ){
					if( is_backward ){
						common_data[ name ] /= ( __value / 100 );
					} else{
						common_data[ name ] *= ( __value / 100 );
					}
				}
			};

			merge( 'left' );
			merge( 'top' );

			return true;
		});

		var left_fact = common_data.left / 100,
		top_fact = common_data.top / 100,
		sL = comp_data.ltPropScrollLeft,
		sT = comp_data.ltPropScrollTop,
		cx = bcr.left + bcr.width * 0.5 - sL,
		cy = bcr.top + bcr.height * 0.5 - sT,
		LC = Lyte.objectUtils,
		overlap = comp_data.ltPropOverlapCheck,
		ignore_overlap = comp_data.ltPropIgnoreOverlapOnContextual && !comp_data.ltPropCheckLineBreak,

		individual_move = function( cur, cx, cy, sL, sT, ranges, key_handle, is_child ){
			var pos = cur.position,
			_left = pos.left,
			_top = pos.top,
			_width = pos.width,
			_height = pos.height,
			dist_x = cx - _left /*- _width / 2*/,
			dist_y = cy - _top /*- _height / 2*/,
			new_left = _left + dist_x * ( 1 - left_fact ),
         	new_top = _top + dist_y * ( 1 - top_fact ),
         	obj = {
         		left : new_left,
         		top : new_top
         	};

         	pos.left = new_left;
         	pos.top = new_top;
         	pos.width = _width;
         	pos.height = _height;

         	/*if( ignore ){
         		ignore[ key ] = obj;
         	} else {*/

	         	if( overlap || is_child ){
					this.check_overlap( obj, key_handle, ranges, pos );
				}

				LC( cur, 'add', 'position', {
	         		left : obj.left,
	         		top : obj.top,
	         		width : _width,
	         		height : _height
	         	});

	         	if( !cur.data.children ){
	         		LC( cur.data, 'add', 'position', obj );
	         	}

	         	if( overlap || is_child ){
					this._split_indiv( key_handle, ranges, void 0, $L.extend( pos, obj ) );
				}
				if( !is_child ){
					this.raf_update( this.get_element( key_handle ), {} );
				}
			/*}*/
		}.bind( this );

		if( ignore_overlap /*&& _new != 100*/ ){
			overlap = false;
		}

		var allHidden = true;

		// for( var key in details ){
		this.sort_origin( details, cx, cy ).forEach( function( item ){
			var key = item.key,
			cur = details[ key ],
			old_position_out = this.stringify( cur.data.position );

			if( /lyteConnectHiddenElem/i.test( cur.data.class || '' ) ){
				return;
			}

			allHidden = false;
// 			if( /lyteConnectHiddenElem/i.test( cur.class || '' ) ){
// 				return;
// 			}

			if( cur.data.children ){
				var inn = cur.children,
				fake_ranges = [ { _left : [], _right : [], left : -infinity, right : infinity, top : -infinity, bottom : infinity, width : infinity, height : infinity } ],
				child_left = infinity,
				child_top = infinity,
				child_right = -infinity,
				child_bottom = -infinity,
				cur_position = cur.position,
				off = this.data.ltPropMinDiff * this.offset_fact();

				for( var __key in inn ){
					var __cur = inn[ __key ];
					individual_move( __cur, ( cur_position.width * 0.5 ), ( cur_position.height * 0.5 ), 0, 0, fake_ranges, __key, true );

					var child_position = __cur.position;

					child_left = Math.min( child_left, child_position.left );
					child_top = Math.min( child_top, child_position.top );
					child_right = Math.max( child_right, child_position.left + child_position.width );
					child_bottom = Math.max( child_bottom, child_position.top + child_position.height );
				}

				var deduct_left = child_left - off,
				deduct_top = child_top - off;

				for( var __key in inn ){
					var __cur = inn[ __key ],
					position = __cur.position,
					shape_data = __cur.data,
					old_position = this.stringify( shape_data.position );

					LC( __cur, 'add', 'position', position = {
						left : position.left - deduct_left,
						top : position.top - deduct_top,
						width : position.width,
						height : position.height
					});

					LC( shape_data, 'add', 'position', {
						left : position.left,
						top : position.top
					});

					this.pushToQueue({
						type : "positionUpdate",
						id : __key,
						oldValue : old_position,
						newValue : this.stringify( shape_data.position ),
						group_id : key
					});
				}

				individual_move( cur, cx, cy, sL, sT, ranges, key );

				LC( cur.data, 'add', 'position', {
					left : cur_position.left,
					top : cur_position.top,
					width : child_right - child_left + 2 * off,
					height : child_bottom - child_top + 2 * off
				});
			} else {
				individual_move( cur, cx, cy, sL, sT, ranges, key );
			}
			this.pushToQueue({
				type : "positionUpdate",
				id : key,
				oldValue : old_position_out,
				newValue : this.stringify( cur.data.position )
			});
		}.bind( this ) );

		this._ranges = ranges;

		// return ignore;
		return allHidden;
	},

	/* Updating connectors with raf along with contextual zoom animation. Cant perform single animation for connectors because of shape animations */

	raf_update : function( elem, obj ){
		var _this = this,
		id = elem.id.replace( this.data.ltPropIdPrefix, '' ),
		cur = obj[ id ],
		allow,
		raf = "requestAnimationFrame";

		if( $L( elem ).hasClass( 'lyteConnectHiddenElem' ) ){
			return;
		}

		if( cur == void 0 ){
			cur = obj[ id ] = elem.getElementsByClassName( 'lyteConnectionSrcElement' );
		}

		if( cur.length && $L( _this.$node ).data( 'transition' ) ){
			window[ raf ]( function(){
				_this.update_position( elem, true, cur );
				window[ raf ]( function(){
					// window[ raf ]( function(){
						_this.raf_update( elem, obj );
					// });
				});
			});
		}
	},
							/* contextual zoom end*/
	offset_fact : function(){

		var data = this.data;

		return ( data.ltPropContextualZoom ? ( data.ltPropContextualZoomLevel / 100 ) : 1 );
	},
							/* Scrolls the document to center of the shapes */
	moveToCenter : function(){
		var __data = this.data,
		boundary = __data.ltPropBoundary,
		center = __data.ltPropCenter || {},
		min_x = boundary.min_x,
		max_x = boundary.max_x,
		min_y = boundary.min_y,
		max_y = boundary.max_y,
		x_val,
		y_val,
		fact_x = center.hori,
		fact_y = center.vert,
		offset = __data.ltPropOffset;

		if( fact_x != void 0 ){
			x_val = offset - ( boundary.left + ( boundary.right - boundary.left ) * fact_x );
		} else {
			x_val = ( min_x + max_x ) * 0.5;
		}

		if( fact_y != void 0 ){
			y_val = offset - ( boundary.top + ( boundary.bottom - boundary.top ) * fact_y );
		} else {
			y_val = ( min_y + max_y ) * 0.5;
		}

		this.$node.ltProp({
			scrollLeft : x_val,
			scrollTop : y_val	
		});
	},
						    /* Scrolls the document's center to particular shape's center */
	moveToShape : function( elem, check_min_max, hori, vert ){
		var data = this.data,
		fn = function( __id ){
			return __id.replace( data.ltPropIdPrefix, "" );
		},
		id = fn( typeof elem == "string" ? elem : elem.id ),
		details = data.details,
		current = details[ id ],
		act_mid_x = this.$node.offsetWidth * ( hori == void 0 ? 0.5 : hori ),
		act_mid_y = this.$node.offsetHeight * ( vert == void 0 ? 0.5 : vert ),
		_left = "ltPropScrollLeft",
		_top = "ltPropScrollTop",
		sL = data[ _left ],
		sT = data[ _top ];

		if( !current ){
			current = details[ fn( elem.parentNode.id ) ].children[ id ];
		}

		var _position = current.position,
		cent_x = _position.left + _position.width * 0.5,
		cent_y = _position.top + _position.height * 0.5,
		left_to_be = act_mid_x - cent_x,
		top_to_be = act_mid_y - cent_y;

		if( check_min_max ){
			var boundary = data.ltPropBoundary;

			left_to_be = Math.min( Math.max( boundary.min_x, left_to_be ), boundary.max_x );
			top_to_be = Math.min( Math.max( boundary.min_y, top_to_be ), boundary.max_y );
		}

		this.setData( _left, left_to_be );
		this.setData( _top, top_to_be );
	},
							/* Keydown handling */
	keydown : function( evt ){

		if( !/^(lyte-connect|lyte-connect-item)$/i.test( evt.target.tagName ) ){
			return;
		}

		var code = evt.which || evt.keyCode,
		prevent,
		shift = evt.shiftKey,
		ctrl = evt.metaKey || evt.ctrlKey,
		cb = "onKeydown",
		move_fact_left = 0,
		move_fact_top = 0;

		if( this.getMethods( cb ) && this.executeMethod( cb, evt, this.$node ) == false ){
			return;
		}

		switch( code ){
			case 37 : {
				move_fact_left = -1;
			}
			break;
			case 38 : {
				move_fact_top = -1;
			}
			break;
			case 39 : {
				move_fact_left = 1;
			}
			break;
			case 40 : {
				move_fact_top = 1;
			}
			break;
 			case 90 : {
				if( ctrl && this.data.ltPropUndo ){
					var undo = 'undoQueue',
					redo = 'redoQueue';

					if( shift ){
					 	prevent = this.undo( redo, undo );
					} else {
						prevent = this.undo( undo, redo, true );
					}
				}
			}
			break;
			case 65 : {
				if( ctrl ){
					prevent = this.selectAll();
				}
			}
			break;
			case 8 : {
				var cb,
				__selected_con = this.__selected_con,
				$node = this.$node;

				if( __selected_con ){
					$node.disConnect( __selected_con, true );
					delete this.__selected_con;
					this.data.ltPropReconnectHandling && this.hide_reconnect();
					this.data.ltPropAdjustLines && this.hide_adjust_pts();
				} else {
					if( this.getMethods( cb = 'onBeforeDelete' ) && this.executeMethod( cb, this._data || [], evt, $node ) == false ){;
						return;
					}

					Array.from( this._data || [] ).forEach( function( item ){
						this.delete( item.id );
					}.bind( this ) );
				}

				prevent = true;
			}
		}

		if( move_fact_left || move_fact_top ){
			prevent = true;
			this.move( 5 * move_fact_left, 5 * move_fact_top );
		}

		if( prevent ){
			this.stopevt( evt );
		}
	},

	move : function( x_inc, y_inc ){

		var __width = window.innerWidth / 2,
		__height = window.innerHeight / 2;

		this._clientX = __width;
		this._clientY = __height;

		var evt = {
			clientX : __width + x_inc,
			clientY : __height + y_inc
		};

		this.mousemove( evt );
		this.mouseup( evt );
	},
						/* Select all*/
	selectAll : function(){
		var data = this.data;

		if( data.ltPropSelectMode ){
			this._data = data.ltPropData.slice();

			var children = $L( this.__wrapper ).children( 'lyte-connect-item' ),
			len = children.length;

			for( var i = 0; i < len; i++ ){
				this.select( {}, children[ i ] );
			}
			return true;
		}
	},


	undo : function(){
		return;
	},

	resetQueue : function(){
		return;
	},

	pushToQueue : function(){
		return;
	},
						 /* Undo handling */

	isUndo : function(){
		return !!this._isundo;
	},


	getRanges : function( ignoreParent ){
		var ranges = this._ranges;
		if( !ranges || ignoreParent){
			ranges = this.overall_split( [], ignoreParent );
		}

		return Lyte.deepCopyObject( ranges );
	},

	update_ignore : function( value ){
		$L( this.$node ).data( 'connection_data' ).ignore_break = value;
	},

	perform_pinch : function( evt ){
		var old_radius = this._cache,
		touches = evt.touches,
		len = touches.length,
		new_pos = {},
		radius = 0,
		origin = { 
			left : 0, 
			top : 0 
		},
		ref_x,
		ref_y;
		
		for( var i = 0; i < 2; i++ ){
			var cur = touches[ i ],
			identifier = cur.identifier;

			origin.left += ( ref_x = cur.clientX ) / 2;
			origin.top += ( ref_y = cur.clientY ) / 2;
		}

		radius = Math.sqrt( Math.pow( Math.abs( ref_x - origin.left ), 2 ) + Math.pow( Math.abs( ref_y - origin.top ), 2 ) );

		if( old_radius == void 0 ){
			old_radius = radius;
		}

		var radius_diff = radius - old_radius,
		scale = this.data.ltPropScale;

		if( radius_diff ){
			this.zoom_to( scale * ( 1 + radius_diff / 500 ), origin );
		}

		this._cache = radius;
	},

	get_textdiv : function( textdiv ){
		if( typeof textdiv == 'string' ){
			textdiv = $L( '#' + textdiv, this.$node ).data( 'text_box' );
		}

		return textdiv;
	},

	ref_connector_frm_text : function( $text, maintainAdjust ){
		var $node = this.$node,
			connection = $text.data( 'connector' );
		maintainAdjust && $node.updateConnectionPoint(connection, $node.getConnectionDetails(connection).points);
		$L( $node ).connection( 'updateConnection', connection );
	},

	addText : function( textdiv, text, index, maintainAdjust ){
		
		textdiv = this.get_textdiv( textdiv );

		var $text = $L( textdiv ),
		__data = this.data,
		elem_index = Number( $text.attr( 'index' ) ),
		data = __data.textBoxArray[ elem_index ].text;

		if( index == void 0 ){
			index = data.length;
		}
		
		if( typeof text == 'string' ){
			text  = { text : text };
		}

		Lyte.arrayUtils( data, 'insertAt', index, text );

		if( !this.isUndo() ){
			this.pushToQueue({
				type : "addText",
				data : this.stringify({
					text : text,
					index : index,
					elem_index : elem_index
				})
			});
		}

		this.ref_connector_frm_text( $text, maintainAdjust );
	},

	removeText : function( textdiv, index, maintainAdjust ){
		textdiv = this.get_textdiv( textdiv );
		
		var $text = $L( textdiv ),
		__data = this.data,
		elem_index = Number( $text.attr( 'index' ) ),
		data = __data.textBoxArray[ elem_index ].text;

		if( !this.isUndo() ){
			this.pushToQueue({
				type : "removeText",
				data : this.stringify({
					text : data[ index ],
					index : index,
					elem_index : elem_index
				})
			});
		}

		Lyte.arrayUtils( data, 'removeAt', index );

		this.ref_connector_frm_text( $text, maintainAdjust );
	},

	updateText : function( textdiv, new_text, index, maintainAdjust ){
		textdiv = this.get_textdiv( textdiv );
		
		var $text = $L( textdiv ),
		__data = this.data,
		elem_index = Number( $text.attr( 'index' ) ),
		data = __data.textBoxArray[ elem_index ].text,
		span = data[ index ];

		if( !this.isUndo() ){
			this.pushToQueue({
				type : "updateText",
				data : this.stringify({
					oldValue : span.text,
					newValue : new_text,
					index : index,
					elem_index : elem_index
				})
			});
		}

		Lyte.objectUtils( span, 'add', 'text', new_text );

		this.ref_connector_frm_text( $text, maintainAdjust );
	},

	getConnectorFromTextbody : function( dom ){
        return $L( dom ).data('connector').get( 0 );
    },

    updateConnectorId : function( elem, new_id ){
   		var __this = this,
   		$elem = $L( elem ),
   		data = $elem.data(),
   		src = data.src,
   		target = data.target,
   		old_id = elem.id,
   		fn = function( jobj, ns ){
   			var connections = jobj.data( 'connection_elements' ),
   			old_ns = ns + old_id;

   			connections[ ns + new_id ] = connections[ old_ns ];
   			delete connections[ old_ns ];
   		};

   		fn( src, 'src_' );
   		fn( target, 'target_' );

   		elem.id = new_id;

   		$L( data.text_box ).attr( 'connector-id', new_id );

   		if( !__this.isUndo() ){
   			__this.pushToQueue({
				type : "id_change",
				old_value : old_id,
				new_value : new_id
			});
   		}

   },

   getConnectorTextbody : function( __id ){
   	  return $L( '#' + __id, this.$node ).data( 'text_box' );
   },

   onConnectionCreate : function( connector, src, target ){
   		var cb = 'onConnectionCreate',
   		__data = this.data;

   		if( __data.ltPropPreview && __data.ltPropRenderConnectorsInPreview ){
   			this.create_connector_preview( connector );
   		}

   		if( __data.ltPropAnimationDuration ){
   			this.create_animation_tags( connector );
   		}

   		this.getMethods( cb ) && this.executeMethod( cb, connector, src, target );
   },

   create_connector_preview : function( elem ){
   	  var clone = elem.cloneNode( true ),
   	  preview_svg = this.__psvg || ( this.__psvg = this.__preview_grp.querySelector( 'svg' ) );

   	  $L( elem ).data( 'clone', clone );
   	  $L( clone ).attr({
   	  	id : "preview_" + clone.id,
   	  	class : clone.getAttribute( 'class' ).replace( 'lyteConnectionContainer', 'lyteConnectionPreviewContainer' )
   	  }).data( 'original', elem ).children();

   	  if( this.data.ltPropLineMarker ){
   	  	 clone.children[ 2 ].remove();
   	  }

   	  preview_svg.appendChild( clone );
   },

   delete_connector_preview : function( elem ){
   		var clone = elem.data( 'clone' );

   		elem.removeData( 'clone' );
   		clone.remove();
   		$L( clone ).removeData( 'original' );
   },

   onBeforeConnectionUpdate : function( svg, name, value ){
   		var __dur = this.data.ltPropAnimationDuration;

   		if( __dur ){
   			this.common_anime( svg, name, value, __dur );
   		}

   		svg.setAttribute( name, value );

		this.getMethods( "onBeforeConnectionUpdate" ) && this.executeMethod( "onBeforeConnectionUpdate", svg, name, value, this.$node );

   },

   onConnectionUpdate : function( svg ){
   	  var __data = this.data,
   	  $svg = $L( svg );

   	  if( __data.ltPropPreview && __data.ltPropRenderConnectorsInPreview ){
		if( __data.ltPropTextBox ){
	   	  	 var text = $svg.data( 'text_box' );

	   	  	 if( text ){
	   	  	 	var __index = Number( text.getAttribute( 'index' ) ),
	   	  	 	cur = __data.textBoxArray[ __index ];

	   	  	 	Lyte.objectUtils( cur, 'add', 'style', text.getAttribute( 'style' ) );
	   	  	 }
	   	}

	   	var clone = $L( $svg.data( 'clone' ) ),
	   	__children =  clone.attr({
	   		transform : $svg.attr( 'transform' )
	   	}).children();

	   	__children.splice( 2 );

	   	__children.attr( 'd', $svg.children().eq( 0 ).attr( 'd' ) )
	  }

	  this.getMethods( "onConnectionUpdate" ) && this.executeMethod( "onConnectionUpdate", svg, this.$node );

   },

   show_reconnect : function( elem ){
   		this.setData( 'renderReconnect', true );

   		var pts = elem.data( 'absolute_points' ) || elem.data( "ref_pts" );

   		if( !pts ){
   			return;
   		}

   		var first = pts[ 0 ],
   		last = $L( pts ).get( -1 );

   		this.setData({
   			reconnectStart : "--left:" + ( this.__src_x = first.x ) + "px;--top:" + ( this.__src_y = first.y ) + "px;",
   			reconnectEnd : "--left:" + ( this.__target_x = last.x ) + "px;--top:" + ( this.__target_y = last.y ) + "px;"
   		});
		
	   $L(elem).addClass('lyteConnectionReconnectIconAdded');
   },

   hide_reconnect : function(){
   		var style = "display:none;";

   		this.setData({
   			reconnectStart : style,
   			reconnectEnd : style
   		});
		
	   $L('.lyteConnectionReconnectIconAdded', this.$node).removeClass('lyteConnectionReconnectIconAdded');

   		[ '__src_x', '__src_y', '__target_y', '__target_x' ].forEach( function( item ){
   			delete this[ item ];
   		}.bind( this ) );
   },

   show_adjust_pts : function( elem, __pts ){
   	  var pts = __pts || elem.data( 'absolute_points' );
   	  if( !pts || pts.length <= 3 ){
   	  	return;
   	  }

   	  var count = pts.length - 3,
   	  arr = [],
	  id = elem.attr( 'id' ),
	  textBoxAvail = this.data.ltPropTextBox,
	  text_box = $L( elem.data( 'text_box' ) ),
	  position = text_box.data( "position" ),
	  __width = text_box.prop( "offsetWidth" ),
	  __height = text_box.prop( "offsetHeight" ),
	  lineIndex = ( position || {} ).lineIndex,
	  diffBuff = this.data.ltPropAdjustLinesMinDiff,
	  find_opt_pos = function( first, second, is_hori ){
			var width = Math.abs( first.x - second.x ),
			height = Math.abs( first.y - second.y ),
			__left = Math.min( first.x, second.x ),
			__top = Math.min( first.y, second.y ),
			ranges = [ {
				left : __left,
				top : __top,
				right : __left + width,
				bottom : __top + height,
				width : width,
				height : height,
				_left : [],
				_right : []
			} ];
			// ,
			// obj = {
			// 	position : {
			// 		left : position.x - __width / 2,
			// 		top : position.y - __height / 2
			// 	},
			// 	dimension : {
			// 		width : __width,
			// 		height : __height
			// 	}
			// };

			// this.split_ranges( ranges, obj );

			for( var key in this.data.details ){//to avoid icon overlap with other items
				this._split_indiv( key, ranges );
			}

			textBoxAvail && this.$node.getAllConnections().forEach( function( item ){
				var text_box = $L( item.textBox ),
				position = text_box.data( "position" ),
				__width = text_box.prop( "offsetWidth" ),
				__height = text_box.prop( "offsetHeight" );
				text_box && this.split_ranges( ranges, {
					position : {
						left : position.x - __width / 2,
						top : position.y - __height / 2
					},
					dimension : {
						width : __width,
						height : __height
					}
				} );
			}.bind( this ) );

			var dist = -Infinity,
			sel,
			left = is_hori ? 'left' : 'top',
			right = is_hori ? 'right' : 'bottom';

			ranges.forEach( function( item ){
				var cur_width = Math.abs( item[ left ] - item[ right ] );

				if( cur_width > dist ){
					dist = cur_width;
					sel = item;
				}
			});

			return sel;
	  };

   	  for( var i = 0; i < count; i++ ){
   	  		var first = pts[ i + 1 ],
   	  		second = pts[ i + 2 ],
			is_hori = first.x != second.x,
			has_text = i + 1 == lineIndex,
			adjPos = /*has_text ? */find_opt_pos.call( this, first, second, is_hori )/* : { left : first.x, right : second.x, top : first.y, bottom : second.y }*/,
			_style;

		if (!adjPos || (Math.abs(adjPos.left - adjPos.right) < diffBuff && Math.abs(adjPos.top - adjPos.bottom) < diffBuff)) {
			_style = "display:none;"
		} else {
			_style = "--left:" + (adjPos.left + adjPos.right) / 2 + "px;--top:" + (adjPos.top + adjPos.bottom) / 2 + "px;"
		}

		arr.push({
			style : _style,
			index : i,
			class : is_hori  ? "lyteConnectHorizontalLine" : "lyteConnectVerticalLine",
			connector : id,
			is_hori : is_hori,
			has_text : has_text
		});
   	  }

	  if( __pts ){
		 return arr;
	  }

   	  this.setData( 'adjustPositions', arr );
   },

   hide_adjust_pts : function(){
   	  this.setData( "adjustPositions", [] );
   },

   onBeforeReconnectSelect : function( evt, elem, $node ){
   		var cb = 'onBeforeReconnectSelect';

   		if( this.data.ltPropReconnectHandling ){
   			return false;
   		}

   		return this.getMethods( cb ) && this.executeMethod( cb, evt, elem, $node );
   },

   common_fn : function( connector, elem, __evt, ori_evt, cb, prop, fn_name, class_name ){

   		if( this.getMethods( cb ) && this.executeMethod( cb, ori_evt, connector, this.$node ) == false ){
   			return false;
   		}

   		prop && this[ fn_name ]();

   		this.__elem = elem;

   		$L( this.$node ).addClass( 'lyteConnector' + class_name );

   		var $elem = $L( elem ).addClass( 'lyte' + class_name + 'Selected' );

		class_name == "Reconnect" && $L(connector).addClass( 'lyteConnectionReconnect' );

   		this._clientX = __evt.clientX;
		this._clientY = __evt.clientY;

		this.bind_evt( 'addEventListener', __evt );

		this.stopevt( ori_evt );
		
		this.update_ignore( true );
   },

   points_to_modifier : function( pts ){
   		var len = pts.length - 1,
   		first = pts[ 0 ],
   		last = pts[ len ],
   		width = Math.abs( first.x - last.x ),
   		height = Math.abs( first.y - last.y ),
   		modifiers = [];

   		for( var i = 1; i < len - 1; i++ ){
   			var __first = pts[ i ],
   			__next = pts[ i + 1 ],
   			is_hori = __first.y == __next.y,
   			x = is_hori ? 'y' : 'x',
   			value = __first[ x ],
   			__width = is_hori ? height : width;

   			modifiers.push( ( value - first[ x ] ) / ( __width || 1 ) );
   		}

   		return modifiers;
   },

   adjust_action : function( elem, __evt, ori_evt ){
   		this._move = this.adjust_drag.bind( this );
		this._up = this.adjust_up.bind( this );

		var $elem = $L( this.data.ltPropAdjustLines == "hover" ? $L( "#" + elem.getAttribute( "connector" ), this.$node ) : this.__selected_con ),
		options = $elem.data( "options" );

		options.points = $L.extend( true, [], $elem.data( "absolute_points" ) );

		// if( this.data.ltPropUndo ){
			options.originalPoints = $L.extend( true, [], options.points );
		// }

   		this.common_fn( $elem.get( 0 ), elem, __evt, ori_evt, 'onBeforeAdjustLine', this.data.ltPropReconnectHandling, 'hide_reconnect', 'AdjustLine' );
   		
		// this.hide_adjust_pts();
   },

   reconnect_action : function( elem, __evt, ori_evt ){

		var data = this.data,
			connection = data.ltPropReconnectHandlingType == "hover" ? this.__hover_con : this.__selected_con[ 0 ];

   		this._move = this.reconnect_drag.bind( this );
		this._up = this.reconnect_up.bind( this );

   		this.common_fn( connection, elem, __evt, ori_evt, 'onBeforeReconnectSelect', data.ltPropAdjustLines, 'hide_adjust_pts', 'Reconnect' );
   },

   update_pts : function( $connector, pts, keep ){
		var count = pts.length - 3,
		arr = this.data.adjustPositions,
		target_pts = this.show_adjust_pts( $connector, pts );

		for( var i = 0; i < count; i++ ){
			var cur = arr[ i ],
			target = target_pts[ i ];

			if( cur && target ){

				var new_style = target.style;

				if( keep && target.has_text && parseInt( $L( this.__elem ).attr( 'data-index' ) ) == target.index ){
					var is_hori = target.is_hori,
					old_style = cur.style.split( ";" ),
					new_split = new_style.split( ";" ),
					index = is_hori ? 1 : 0;
					
					old_style.splice( index , 1, new_split[ index ] );
					new_style = old_style.join( ";" );
				}

				Lyte.objectUtils( cur, 'add', 'style', new_style );
			} else {
				break;
			}
		}
   },

   adjust_drag : function( evt ){

   		this.__moved = true;

   		var __evt = ( evt.touches || [ evt ] )[ 0 ],
		scale = this.data.ltPropScale,
   		x_inc = (this._clientX - ( this._clientX = __evt.clientX )) / scale,
   		y_inc = (this._clientY - ( this._clientY = __evt.clientY )) / scale,
   		elem = this.__elem,
   		$elem = $L( elem ),
   		__connector = $L( this.data.ltPropAdjustLines == "hover" ? $L( "#" + $elem.attr( "connector" ), this.$node ) : this.__selected_con )[ 0 ],
   		$connector = $L( __connector ),
   		index = parseInt( $elem.attr( 'data-index' ) ),
   		pts = $connector.data( 'options' ).points;

   		if( !pts || !pts.length ){
   			return;
   		}

   		var first = pts[ index + 1 ],
   		second = pts[ index + 2 ],
   		buff = 5,
   		is_hori = first.y == second.y,
   		x = is_hori ? 'x' : 'y',
   		y = is_hori ? 'y' : 'x';

   		if( ( is_hori && !y_inc ) || ( !is_hori && !x_inc ) ){
   			return;
   		}

   		var cur_y = first[ y ];

   		cur_y -= ( is_hori ? y_inc : x_inc );

   		first[ y ] = second[ y ] = cur_y;

		this.update_pts( $connector, pts, true );
   		$L( this.$node ).connection( 'updateConnection', $connector );
   },

   adjust_up : function( evt ){

   		var elem = this.__elem,
	  	$elem = $L( elem ),
	  	selected_connector = $L( this.data.ltPropAdjustLines == "hover" ? $L( "#" + $elem.attr( "connector" ), this.$node ) : this.__selected_con ),
	  	sub_cls = "lyteConnectorElementSelected",
	  	$connector = $L( selected_connector ),
	  	data = $L( this.$node ).data( 'connection_data' ),
	  	options = $connector.data( "options" ),
	  	originalPoints = options.originalPoints,
	  	new_pts = $connector.data( "absolute_points" ),
		last_evt = this.__last_event;

   		delete options.points;
   		delete options.originalPoints;

		this.bind_evt( 'removeEventListener', evt );

		if( last_evt && last_evt.evt.type == "mouseleave" ){
			this.adjustEnter( last_evt.evt, last_evt.__this, true );
		}

		[ '_clientX', '_clientY', '__elem', '_move', '_up', '__moved', '__last_event' ].forEach( function( item ){
		  	delete this[ item ];
		}.bind( this ) );

		$L.fastdom.clear( selected_connector.get(0)._measure_fdom );
		$L.fastdom.clear( selected_connector.get(0)._mutate_fdom );

	    this.update_ignore( false );

	    if( this.data.ltPropElbowArc ){
	    	$L.elbow.arc( selected_connector[ 0 ], data );
	    }

	    this.update_textbox_position( $connector, data );

	    if( this.data.ltPropUndo ){
	    	this.pushToQueue({
	    		type : "modifierChange",
	    		data : this.stringify({
	    			old : $connector.data('adjustPoints') ? originalPoints : undefined,
	    			new : new_pts,
	    			id : $connector.prop( "id" )
	    		})
	    	});
	    }
		
	   $connector.data('adjustPoints', new_pts);

	    ( this.data.ltPropAdjustLines == "click" ) && $L.fastdom.mutate( this.show_adjust_pts.bind( this, selected_connector ) );

	    this.line_adjust_callback( originalPoints, new_pts, selected_connector[ 0 ], false );
   },

   line_adjust_callback : function( old, __new, connector, frm_undo ){
   		var cb = "onLineAdjust";
   		this.getMethods( cb ) && this.executeMethod( cb, connector, this.points_to_modifier( old ), this.points_to_modifier( __new ), frm_undo, this.$node );
   },

   update_textbox_position : function( $connector, data ){
   		if( this.data.ltPropTextBoxAvoidance ){
	    	var options = ( $connector.data( "options" ) || {} ),
	    	type = options.connection_type || this.data.ltPropConnectionType;

	    	if( type == "elbow" ){
	    		var textbox = $connector.data( 'text_box' );

	    		if( textbox ){
	    			var pos = $L.elbow.textbox( $connector.data( "absolute_points" ), data, textbox, type );

		    		$L( textbox ).css({
						left : pos.x,
						top : pos.y
					}).data( 'position', pos );
		    	}
	    	}
	    }
   },

   reconnect_drag : function( evt ){

   		var __evt = ( evt.touches || [ evt ] )[ 0 ],
		scale = this.data.ltPropScale,
   		x_inc = (this._clientX - ( this._clientX = __evt.clientX )) / scale,
   		y_inc = (this._clientY - ( this._clientY = __evt.clientY )) / scale,
   		elem = this.__elem,
   		$elem = $L( elem ),
   		__connector = this.data.ltPropReconnectHandlingType == "hover" ? this.__hover_con : this.__selected_con[ 0 ],
   		$connector = $L( __connector ),
   		is_start = $elem.hasClass( 'lyteConnectStart' ),
   		ns = is_start ? 'src' : 'target';

   		if( !this.__moved ){
   			var cur_src = $connector.data( ns );

   			$connector.data( ns, $elem );
			// $connector.data( "hanging", false );

   			this.__moved = true;
   			this.__original_src =  cur_src;
   		}

   		this.setData( 'reconnect' + ( { src : "Start", target : "End" } )[ ns ], "--left:" + ( this[ '__' + ns + '_x' ] -= x_inc ) + "px;--top:" + ( this[ '__' + ns + '_y' ] -= y_inc ) + "px;" );

   		$L( this.$node ).connection( 'updateConnection', $connector );
   },

   reconnect_up : function( evt ){

   	  var elem = this.__elem,
	  $elem = $L( elem ),
	  $node = $L( this.$node ),
	  hover = this.data.ltPropReconnectHandlingType == "hover",
	  __connector = hover ? this.__hover_con : this.__selected_con[ 0 ],
	  $connector = $L( __connector );

	if( this.__moved ){
		var __target = $L( evt.target ),
		is_start = $elem.hasClass( 'lyteConnectStart' ),
		ns = is_start ? 'src' : 'target',
		new_src = this.__original_src,
		hangingConnect = true,
		hangingItem = new_src.hasClass('lyteConnectFakeHangingItem'),
		itemOverlap = __target.closest("lyte-connect-item");

      	if( __target.hasClass( 'lyteConnectAnchorPoint' ) || itemOverlap.length ){
      	 	var new_pos = {
      	 		x : Number( __target.attr( 'left' ) ),
      	 		y : Number( __target.attr( 'top' ) )
      	 	},
      	 	args = [],
      	 	__new = itemOverlap || __target.parent(),
			item = __new.get( 0 );
			
			if( is_start ){
				args.push( new_src[ 0 ], item, $connector.data( 'target' ).get( 0 ) );
			} else {
				args.push( $connector.data( 'src' ).get( 0 ), new_src[ 0 ], item );
			}

			$connector.data( ns, new_src );
			$connector.data( 'active_' + ns, new_src.get( 0 ) );

			hangingConnect = hangingItem ? !this.isHangingConnect($connector, __new.get(0).id, true) : true

			if( !hangingItem ){

				args.push( $node.get( 0 ), evt, __connector, new_pos, $connector.data( ns + '_position' ), ns );
	
				if( this.onReconnect.apply( this, args ) != false ){
					var __ns = 'connection_elements',
					key = ns + '_' + __connector.id;
	
					delete ( new_src.data( __ns ) || {} )[ key ];

					var oldDataKeys = Object.keys( new_src.data( __ns ) ).join( '' );

					!/src_/.test( oldDataKeys ) && new_src.removeClass( "lyteConnectionSrcElement" );
	
					!/target_/.test( oldDataKeys ) && new_src.removeClass( "lyteConnectionTargetElement" );

					new_src.removeClass( "lyteConnectionHover lyteConnectionHoverTarget lyteConnectionHoverSrc" );
	
					new_src = __new;
	
					var data = new_src.data( __ns );
					data ? void 0 : new_src.data( __ns, data = {} );
					data[ key ] = {
						connector : $connector
					};

					/src_/.test( key ) && new_src.addClass( "lyteConnectionSrcElement" );
	
					/target_/.test( key ) && new_src.addClass( "lyteConnectionTargetElement" );
	
					$connector.data( 'options' )[ ns + '_position' ] = new_pos;
				}
			}
      	}

		if(hangingConnect){

			$connector.data( ns, new_src );

			var conOpt = $L.extend({},$connector.data('options'));

			if (conOpt.hanging && hangingItem) {//change hangItem Pos
				var target = evt.target.closest("lyte-connect-item");
				if (target) {
					hangingConnect = !this.isHangingConnect($connector, target.id, true)
				} else {
					this.data.ltPropData.every(function (item) {
						if (item.id == new_src.get(0).id) {
							var cpyPos = $L.extend({}, item.position),
								trgPos = conOpt.trgPos,
								pos = this.setHanging(undefined, $connector, undefined, true),
								_left = pos.left,
								_top = pos.top;
							cpyPos.left = trgPos.left = _left;
							cpyPos.top = trgPos.top = _top;
							Lyte.objectUtils(item, 'add', 'position', cpyPos);
							$connector.data('options', conOpt);
							return
						}
						return true
					}.bind(this))
				}
			}
			
			hangingConnect && $node.connection( 'updateConnection', $connector );

		}

		this.hide_reconnect();
		this.data.ltPropAdjustLines && this.hide_adjust_pts();
		if( hover ){
			delete this.__hover_con;
			this.reconnect_event();
		}
	  }

	  $node.removeClass( 'lyteConnectorReconnect' );
   	  $elem.removeClass( 'lyteReconnectSelected' );
	  $connector.removeClass( 'lyteConnectionReconnect' );

   	  this.bind_evt( 'removeEventListener', evt );

   	  [ '_clientX', '_clientY', '__elem', '_move', '__original_src', '_up', '__moved' ].forEach( function( item ){
   	  	 delete this[ item ];
   	  }.bind( this ) );

	  this.update_ignore( false );
   },

	recLeave: function (evt) {
		var current = _lyteUiUtils.getCurrentTarget( evt );
		this.toggle_hover(evt, current);
	},

	reconnect_event: function (type){
		var recElem = $L('.lyteConnectReconnectElement', this.$node),
		fn = this._reconnect || this.recLeave.bind(this),
		elType;
		if (type == "add") {
			elType = "addEventListener";
			this._reconnect = fn;
		} else {
			elType = "removeEventListener";
			delete this._reconnect
		}
		[0, 1].forEach(function (num) {
			var el = recElem.get(num);
			el && el[elType]('mouseleave', fn);
		})
	},

   toggle_hover : function( evt, connection ){
	
		var $related = $L( evt.relatedTarget ),
			data = this.data,
			is_enter = evt.type == "mouseenter",
			cb = "onConnection" + ( is_enter ? 'Hover' : 'Leave' );
		//this._up is to detect mousedown
		if (!this._up && data.ltPropReconnectHandling && data.ltPropReconnectHandlingType == "hover" && !$related.hasClass('lyteConnectReconnectElement') && !$L(this.$node).hasClass('lyteConnectorReconnect')/* && (!$related.closest('.lyteConnectionContainer').length || this._up)*/) {
			if (is_enter) {
				this.show_reconnect($L( _lyteUiUtils.getCurrentTarget( evt ) ).closest(".lyteConnectionContainer"));
				this.reconnect_event("add");
				this.__hover_con = connection;
			} else {
				this.reconnect_event();
				this.hide_reconnect();
				delete this.__hover_con;
			}
		}

		if( $related.hasClass( "lyteConnectLineAdjustElement" ) ){
			return;
		} 

		if( data.ltPropAdjustLines == "hover" && !data.ltPropReadonly && (this._up && is_enter ?  false : true)){ 

			clearTimeout( this.__adjust_hover );

			this.__adjust_hover = setTimeout( this[ is_enter ? 'show_adjust_pts' : 'hide_adjust_pts' ].bind( this, $L( connection ) ), 200 );
		}

		this.getMethods( cb ) && this.executeMethod( cb, evt, connection, this.$node );
   }

}, { mixins : [ 'lyte-connect-positioning', 'lyte-connect-magnetiser', 'lyte-smartguide-utils', 'lyte-connect-animation', 'lyte-connect-undo', 'lyte-shape-positioning', 'lyte-connect-suggestion', "lyte-connect-group-sort", "lyte-connect-circle-positioning", "lyte-connect-level-arrange" ] });

Lyte.Component.registerHelper( 'construct_style', function( obj ){
	var str = '';

	obj = obj || {};

	for( var key in obj ){
		str += ( key + ':' + obj[ key ] + 'px;' );
	}

	return str;
});

Lyte.Component.registerHelper( 'lyteTextBox', function( item, __class, hoverClass, __length, bool ){
	var str = 'lyteConnect' + ( bool ? 'Preview' : "" ) + 'Textbox';

	if( __class ){
		str += ( ' ' + __class );
	}

	if( hoverClass ){
		str += ( ' ' + hoverClass );
	}

	if( !__length ){
		str += ( ' ' + "lyteConnectEmpty" );
	}

	return str;
});


/**
 * @syntax yielded
 * <lyte-connect>
 * <template is = "registerYield" yield-name = "connection">
 *		<lyte-connection-header>{{connection.name}}</lyte-connection-header>
 *	 	<lyte-connection-content>
 *          <template lyte-for="{{connection.renderData}} as row"  lyte-options='{"unbound" : "true"}'>
 *				<lyte-connection-module id = {{row.id}}>
 *					<template lyte-for="{{connection.header}} as cell">
 *						{{row[ cell.key ]}}
 *			   		</template>
 *				</lyte-connection-module>
 *          </template>
 *		</lyte-connection-content>
 *		<lyte-connection-footer id = "footer_{{connection.id}}">Some footer</lyte-connection-footer>
 * </template>
 * </lyte-connect>
 */

 /**
 * @syntax preview
 * @attribute  ltPropPreview
 * <lyte-connect>
 * <template is = "registerYield" yield-name = "connection">
 *		<lyte-connection-header>{{connection.name}}</lyte-connection-header>
 *	 	<lyte-connection-content>
 *			<template lyte-for="{{connection.renderData}} as row"  lyte-options='{"unbound" : "true"}'>
 *				<lyte-connection-module id = {{row.id}}>
 *					<template lyte-for="{{connection.header}} as cell">
 *						{{row[ cell.key ]}}
 *			   		</template>
 *				</lyte-connection-module>
 *			</template>
 *		</lyte-connection-content>
 *		<lyte-connection-footer id = "footer_{{connection.id}}">Some footer</lyte-connection-footer>
 * </template>
 *	 <template is = "registerYield" yield-name = "preview">
 *		<span>{{module_id}}</span>
 *	</template>
 * </lyte-connect>
 */

 /**
 * @syntax Textbox
 * @attribute ltPropTextBox = true
 * <lyte-connect>
 * <template is = "registerYield" yield-name = "connection">
 *		<lyte-connection-header>{{connection.name}}</lyte-connection-header>
 *	 	<lyte-connection-content>
 *			<template lyte-for="{{connection.renderData}} as row"  lyte-options='{"unbound" : "true"}'>
 *				<lyte-connection-module id = {{row.id}}>
 *					<template lyte-for="{{connection.header}} as cell">
 *						{{row[ cell.key ]}}
 *			   		</template>
 *				</lyte-connection-module>
 *			</template>
 *		</lyte-connection-content>
 *		<lyte-connection-footer id = "footer_{{connection.id}}">Some footer</lyte-connection-footer>
 * </template>
 *		 <template is = "registerYield" yield-name = "textbox">
 *			<template lyte-for="{{ltPropItem.text}} as item">
 *				<span class="lyteConnectInnerSpan {{item.class}}" id = {{item.id}}>
 *					<span class = 'lyteInnerText'>{{item.text}}</span>
 *				</span>
 *			</template>
 *		</template>
 * </lyte-connect>
 */