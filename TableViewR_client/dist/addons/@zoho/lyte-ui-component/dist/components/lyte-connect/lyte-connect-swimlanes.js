Lyte.Component.register("lyte-connect-swimlanes", {
_template:"<template tag-name=\"lyte-connect-swimlanes\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"> <lyte-connect class=\"lyteConnectSwimlaneConnect {{item.class}}\" id=\"{{item.id}}\" lt-prop-data=\"{{item.fields}}\" lt-prop-swim-lanes=\"true\" lt-prop-swim-nodes=\"{{ltPropSwimNodes}}\" lt-prop-text-box=\"{{ltPropTextBox}}\" lt-prop-check-line-break=\"{{ltPropCheckLineBreak}}\" lt-prop-preview=\"false\" lt-prop-connection-type=\"{{ltPropConnectionType}}\" lt-prop-center=\"{{ltPropCenter}}\" restrict-limits=\"{{method('restrictLimits')}}\" swim-nodes=\"{{method('swimNodes')}}\" on-drop=\"{{method('onDrop')}}\" set-details=\"{{method('setDetails')}}\"> <template is=\"registerYield\" yield-name=\"connection\" from-parent=\"\"></template> </lyte-connect> </template> <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"lyteConnectionSwimlanesMarker\" width=\"{{ltPropWidth}}\" height=\"{{ltPropHeight}}\" viewBox=\"{{viewBox}}\" style=\"{{styleValue}}\"> <defs> <marker id=\"lyteConnectionHeadMarker\" markerUnits=\"strokeWidth\" markerWidth=\"12\" markerHeight=\"12\" refX=\"6\" refY=\"6\" orient=\"auto\"> <ellipse cx=\"6\" cy=\"6\" rx=\"2\" ry=\"2\"></ellipse> </marker> <marker id=\"lyteConnectionTailMarker\" markerUnits=\"strokeWidth\" markerWidth=\"12\" markerHeight=\"12\" refX=\"6\" refY=\"3\" orient=\"auto\"> <path d=\"M 6 3 L 0 6 0 0 z\"></path> </marker> </defs> </svg> <template is=\"if\" value=\"{{ltPropTextBox}}\"><template case=\"true\"><template is=\"for\" items=\"{{textBoxArray}}\" item=\"item\" index=\"index\"> <lyte-textbox index=\"{{index}}\" onclick=\"{{action('textclick',event,this,index)}}\" id=\"{{item.id}}\" class=\"{{lyteTextBox(item,item.class,item.hoverClass,item.text.length)}}\" style=\"{{item.style}}\"> <lyte-yield yield-name=\"textbox\" lt-prop-item=\"{{item}}\"></lyte-yield> </lyte-textbox> </template></template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"styleValue"}}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"item.style"}}},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}}],
_observedAttributes :["ltPropData","ltPropSwimNodes","ltPropScrollLeft","ltPropScrollTop","ltPropSelectors","ltPropConnectionType","ltPropConnectorRadius","ltPropAvoidWithModule","ltPropCheckLineBreak","ltPropElbowArc","ltPropCurveOffset","ltPropAvoidLine","ltPropLineMarker","ltPropBoundary","ltPropContextualWheel","ltPropScale","ltPropCenter","ltPropSwimlaneOnDrop","ltPropTextBox","ltPropTextBoxAvoidance","ltPropWidth","ltPropHeight","viewBox","textBoxArray","styleValue","cornerConnect","details","atLimit","out_range","onDrop"],

	data: function () {
		return {

			/* Basic data */
			ltPropData: Lyte.attr('array', { default: [] }),

			/* Swim Lanes Properties */

			ltPropSwimNodes: Lyte.attr('boolean', { default: false }),

			/* Scroll properties - here scroll means transform */

			ltPropScrollLeft: Lyte.attr('number', { default: 0 }),
			ltPropScrollTop: Lyte.attr('number', { default: 0 }),

			/* To adjust inner children position of a group shape*/

			ltPropSelectors: Lyte.attr('object', {
				default: {
					selector: "lyte-connection-footer,.lyteConnectAnchorPoint",
					markerEnd: "url(#lyteConnectionTailMarker)",
					markerStart: ""
				}
			}),

			/* Elbow connector properties */

			ltPropConnectionType: Lyte.attr("string", { default: "curve" }),
			ltPropConnectorRadius: Lyte.attr('number', { default: 5 }),
			ltPropAvoidWithModule: Lyte.attr('boolean', { default: false }),
			ltPropCheckLineBreak: Lyte.attr("boolean", { default: false }),
			ltPropElbowArc: Lyte.attr("boolean", { default: false }),
			ltPropCurveOffset: Lyte.attr('number', { default: 0 }),
			ltPropAvoidLine: Lyte.attr('boolean', { default: false }),


			ltPropLineMarker: Lyte.attr('array'),

			ltPropBoundary: Lyte.attr('object', { default: {} }),

			ltPropContextualWheel: Lyte.attr('boolean', { default: false }),

			ltPropScale: Lyte.attr('number', { default: 1 }),

			ltPropCenter: Lyte.attr('object', { default: { vert: 0 } }),

			ltPropSwimlaneOnDrop: Lyte.attr('boolean', { default: false }),

			ltPropTextBox: Lyte.attr('boolean', { default: false }),
			ltPropCheckLineBreak: Lyte.attr('boolean', { default: false }),
			ltPropTextBoxAvoidance: Lyte.attr('boolean', { default: false }),

			/*  SVG dimension. Change if number of connectors occupies more area*/

			ltPropWidth: Lyte.attr('number', { default: 200000 }),
			ltPropHeight: Lyte.attr('number', { default: 200000 }),

			/* System data */

			viewBox: Lyte.attr('string', { default: '' }),
			textBoxArray: Lyte.attr('array', { default: [] }),
			styleValue: Lyte.attr('string', { default: '' }),
			cornerConnect: Lyte.attr('object', { default: {} }),
			details: Lyte.attr('object', { default: {} }),
			atLimit: Lyte.attr('object', { default: {} }),
			out_range: Lyte.attr('object', { default: {} }),
			onDrop: Lyte.attr('boolean', { default: true })

		}
	},

	didConnect: function () {
		var data = this.data,
			node=this.$node,
			$node = $L(node),
			default_obj = data.ltPropSelectors,
			connect_func = $L(this.$node.children[0]).data(),
			obj = $L.extend({
				swimlanes: true,
				connection_type: data.ltPropConnectionType,
				connector_radius: data.ltPropConnectorRadius,
				avoid_with_module: data.ltPropAvoidWithModule,
				check_break: false,
				elbow_arc: data.ltPropElbowArc,
				avoid_line: data.ltPropAvoidLine,
				textbox_avoidance: data.ltPropTextBoxAvoidance,
				line_marker: data.ltPropLineMarker,
				module: "lyte-connect-item",
				default_top: "lyte-connection-header",
				default_bottom: "lyte-connection-footer",
				scroll_parent: "lyte-connection-content",
				wrapperElement: $node.find('.lyteConnectionSwimlanesMarker').get(0),
				offset: {
					left: 12,
					top: 12,
					right: 12,
					bottom: 12
				},
				curve_offset: data.ltPropCurveOffset,

				setScroll: function (_left, value) {
					this.setData('ltPropScroll' + _left, value);
				}.bind(this),

				getScroll: function () {
					var data = this.data;
					// return{
					// 	left : 0,
					// 	top : 0
					// };
					return {
						left: data.ltPropScrollLeft,
						top: data.ltPropScrollTop
					}
				}.bind(this),

				getBoundary: function () {
					return data.ltPropBoundary;
				}.bind(this),


				getScale: function () {
					return data.ltPropContextualWheel ? 1 : data.ltPropScale;
				}.bind(this),

				splitIndiv : connect_func.connection_data.splitRanges.bind(this),

				join_ranges : connect_func.connection_data.join_ranges.bind(this)

			}, default_obj);

		this.__wrapper = node;

		$node.connection(obj);

		node.connect = function (src, target, options, ignore) {
			var __data = this.data;
			if (__data.ltPropTextBox) {
				var textBox = (options || (options = {})).textBox,
					__arr = __data.textBoxArray,
					__index = __arr.length,
					__id;

				if (!textBox) {
					options.textBox = textBox = { text: [] };
				}

				__id = textBox.id = textBox.id || ("text_box" + Date.now() + parseInt(Math.random() * 1000));

				Lyte.arrayUtils(__data.textBoxArray, 'push', textBox);
				options.text_box = document.getElementById(__id);
			}
			$node.connection('create', src, target, options);

			delete options.text_box;
		}.bind(this);

		node.arrange = function(arr){
			var conn_data = $L('lyte-connect'),
				is_array = Array.isArray(arr);
			Array.from(conn_data).forEach(item=>{
				var valid=is_array?(arr.indexOf(item.id)==-1)?false:true:true;
				valid && item.arrange();
			});
		}

	},
	actions: {
		textclick : function( evt, __this, index ){

			if( this.data.ltPropReadonly ){
				return;
			}

			var $this = $L( __this ),
			connection = $this.data( 'connector' ),
			cb = "onTextbodyClick",
			arr = this.data.textBoxArray;

			this.getMethods( cb ) && this.executeMethod( cb, __this, $this.attr( 'connector-id' ), arr[ index ].text, connection.data( 'options' ), evt, this.$node );
		}
	},
	methods: {
		setDetails: function (_this, elem, position) {
			var position = $L.extend({}, position),
				details = this.data.details,
				cur_id = elem.id,
				scr_left = _this.data.ltPropScrollLeft,
				scr_top = _this.data.ltPropScrollTop,
				off_left = _this.$node.offsetLeft,
				off_top = _this.$node.offsetTop;
			if (details[cur_id]) {//set position
				position.left = off_left + scr_left + position.left;
				position.top = off_top + scr_top + position.top;
				Lyte.objectUtils(details[cur_id], 'add', 'position', position);
			} else {
				var cur_pos = position.position;
				cur_pos.left = off_left + scr_left - cur_pos.left;
				cur_pos.top = off_top + scr_top - cur_pos.top;
				position.parent = _this.$node;
				Lyte.objectUtils(details, 'add', cur_id, position);
			}
		},
		restrictLimits: function (moving, xInc, yInc, _this_node) {
			var mov_item = moving[0].get(0),
				item_pos = mov_item.getBoundingClientRect(),
				tot_item = this.data.ltPropSwimNodes ? mov_item.closest("lyte-connect-swimlanes") : mov_item.closest("lyte-connect"),
				tot_pos = tot_item.getBoundingClientRect(),
				on_range = this.data.out_range,
				limit = this.data.atLimit,
				ret = { xInc: xInc, yInc: yInc },
				restrictMovement = function (side, inc) {
					var moving_in = ret[inc] <= 0,
						beyond_lim = parseInt(item_pos[side]) < parseInt(tot_pos[side]);
					if (side == 'right' || side == 'bottom') {
						moving_in = ret[inc] >= 0;
						beyond_lim = parseInt(item_pos[side]) > parseInt(tot_pos[side]);
					}
					if (moving_in && (limit[side] || on_range[side])) {//reached limit||item at line 
						ret[inc] = 0;//left movement is avoided
					} else if (beyond_lim && !on_range[side]) {
						Lyte.objectUtils(limit, "add", side, true);//reched limit
						ret[inc] = parseInt(tot_pos[side]) - parseInt(item_pos[side]);//remove extra
					} else {
						if (!beyond_lim && on_range[side]) {
							Lyte.objectUtils(on_range, "add", side, false);//not on line came in 
						}
						if (!moving_in) {//moved from limit to right
							Lyte.objectUtils(limit, "add", side, false);
						}
					}
				};

			restrictMovement("left", "xInc");
			restrictMovement("right", "xInc");
			restrictMovement("top", "yInc");
			restrictMovement("bottom", "yInc");

			return ret;
		},
		swimNodes: function (evt, _this, cur_item) {
			var new_conn = evt.target.closest("lyte-connect"),
				old_conn = _this.$node;
			if (new_conn) {
				if (new_conn != old_conn) {
					var data = _this.data,
						new_conn_data = new_conn.component.data,
						cur_item_val = _this.delete(cur_item.id),
						cur_item_data = cur_item_val.data,
						cur_item_pos = cur_item_data.position,
						old_conn_right = old_conn.offsetWidth - data.ltPropScrollLeft,
						cur_item_left = parseInt(cur_item.style.left);
					if (old_conn_right <= cur_item_left) {
						cur_item_pos.left = Math.abs(cur_item_left - (old_conn_right + (new_conn.offsetLeft - (old_conn.offsetLeft + old_conn.offsetWidth)))) - new_conn_data.ltPropScrollLeft;
					} else {
						cur_item_pos.left = (new_conn.offsetWidth - new_conn_data.ltPropScrollLeft) - Math.abs(cur_item_left - (-data.ltPropScrollLeft - (old_conn.offsetLeft - (new_conn.offsetLeft + new_conn.offsetWidth))))
					}
					cur_item_pos.top = Math.abs(parseInt(cur_item.style.top) + data.ltPropScrollTop) - new_conn_data.ltPropScrollTop;
					new_conn.insertShape(cur_item_data);
					cur_item_val.connections.forEach(item => {
						var data = this.data;
						data.textBoxArray.forEach((textbox, index) => {
							if (textbox.id == item.options.textBox.id) {
								Lyte.arrayUtils(data.textBoxArray, 'removeAt', index);
							}
						});
						old_conn.offsetParent.connect(item.src, item.target, item.options)
					});
				}
			} else if (this.data.ltPropSwimlaneOnDrop) {
				this.setData("onDrop", false);//go back to mousedown position
			}
		},
		onDrop: function ( elem, old_position, new_position, node, evt ) {
			var ret = this.data.onDrop;
			node.unSelectShape( elem, evt );
			this.setData( "onDrop", true );
			return ret;
		}
	}
});
