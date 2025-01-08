;( function(){

	var checking,
	textbox_check = {};

	function getAllTextbody(textBody) {
		var ___this = this.get(0).component,
			itemDetails = ___this.data.details,
			textBoxDetails = ___this.data.textBoxArray,
			itemKeys = Object.keys(itemDetails),
			__wrapper = ___this.__wrapper,
			ret_details = [];
		if (itemKeys.length) {
			itemKeys.forEach(item => {
				var cur = itemDetails[item].position;
				ret_details.push({
					type: "SHAPE",
					shape: {
						pos: { left: cur.left, top: cur.top },
						dim: { width: cur.width, height: cur.height }
					}
				});
			});
			textBoxDetails.forEach(item => {
				if (item.id == textBody.id) {
					return;
				}
				var cur = __wrapper.querySelector("#" + item.id),
					left = parseFloat(cur.style.left),
					top = parseFloat(cur.style.top),
					dim = cur.getBoundingClientRect(),
					width = dim.width,
					height = dim.height;
				ret_details.push({
					type: "textbody",
					textbody: {
						pos: { left: left, top: top },
						dim: { width: width, height: height }
					}
				});
			});
			return ret_details;
		}
	}

	function _isDef(arg) {
		return arg != undefined;
	}

	function checkMeetPoint(obj, constt, pos, dim) {
		var mp1 = obj.x * pos.left - obj[constt],
			mp2 = obj.x * (pos.left + dim.width) - obj[constt],
			mp3 = (pos.top + obj[constt]) / obj.x,
			mp4 = (pos.top + dim.height + obj[constt]) / obj.x;

		return { mp1: mp1, mp2: mp2, mp3: mp3, mp4: mp4 };
	}

	function withinRange(value, val1, val2) {
		return value > Math.min(val1, val2) && value < Math.max(val1, val2);
	}

	function text_box_avoidanceLine(points, textBody, originalPos) {
		var bcr = textBody.getBoundingClientRect(),
			innShapes = getAllTextbody.call(this, textBody),
			initialRange,
			range = [], direction,
			slope, angle,
			diagonal = Math.sqrt(Math.pow(bcr.width * 0.5, 2) + Math.pow(bcr.height * 0.5, 2)),
			distance,
			dummy,
			obj,
			scale = this.get(0).component.data.ltPropScale;
		if (!innShapes) {
			return;
		}
		if (points[0].y < points[1].y) {
			initialRange = { x1: points[0].x, x2: points[1].x, y1: points[0].y, y2: points[1].y };
			range.push(initialRange)
		} else {
			initialRange = { x2: points[0].x, x1: points[1].x, y2: points[0].y, y1: points[1].y };
			range.push(initialRange)
		}

		direction = initialRange.x1 < initialRange.x2;

		slope = (initialRange.y1 - initialRange.y2) / (initialRange.x1 - initialRange.x2);

		angle = Math.abs(Math.atan(slope) * 180 / Math.PI);

		distance = Math.cos(Math.abs(angle - 45) * Math.PI / 180) * diagonal;

		obj = { x: slope, y: -1, c: (range[0].x1 * slope) - range[0].y1 };

		if (direction) {
			obj.c1 = slope * (originalPos.x - bcr.width * 0.5 / scale) - (originalPos.y + bcr.height / scale * 0.5);
			obj.c2 = slope * (originalPos.x + bcr.width * 0.5 / scale) - (originalPos.y - bcr.height / scale * 0.5);
		} else {
			obj.c1 = slope * (originalPos.x - bcr.width / scale * 0.5) - (originalPos.y - bcr.height / scale * 0.5);
			obj.c2 = slope * (originalPos.x + bcr.width / scale * 0.5) - (originalPos.y + bcr.height / scale * 0.5);
		}
		for (var i = 0; i < innShapes.length; i++) {
			var type = innShapes[i].type, originalData = innShapes[i][type.toLowerCase()],
				pos = originalData.pos || originalData.props.transform.pos,
				dim = originalData.dim || originalData.props.transform.dim;
			if (_isDef(textBody.__index) && textBody.__index == i) {
				continue;
			}
			for (var j = 0; j < range.length; j++) {
				var curRange = range[j],
					line1 = checkMeetPoint.call(this, obj, 'c1', pos, dim),
					line2 = checkMeetPoint.call(this, obj, 'c2', pos, dim),
					line3 = checkMeetPoint.call(this, obj, 'c', pos, dim),
					range1 = { x1: curRange.x1, y1: curRange.y1 },
					range2 = { x2: curRange.x2, y2: curRange.y2 };

				if (!((withinRange(pos.left, curRange.x1, curRange.x2) || withinRange(pos.left + dim.width, curRange.x1, curRange.x2) || withinRange(curRange.x1, pos.left, pos.left + dim.width) || withinRange(curRange.x2, pos.left, pos.left + dim.width)) && (withinRange(pos.top, curRange.y1, curRange.y2) || withinRange(pos.top + dim.height, curRange.y1, curRange.y2) || withinRange(curRange.y1, pos.top, pos.top + dim.height) || withinRange(curRange.y2, pos.top, pos.top + dim.height)))) {
					continue;
				}

				line1.withinmp1 = withinRange(line1.mp1, pos.top, pos.top + dim.height);
				line2.withinmp1 = withinRange(line2.mp1, pos.top, pos.top + dim.height);

				line1.withinmp2 = withinRange(line1.mp2, pos.top, pos.top + dim.height);
				line2.withinmp2 = withinRange(line2.mp2, pos.top, pos.top + dim.height);

				line1.withinmp3 = withinRange(line1.mp3, pos.left, pos.left + dim.width);
				line2.withinmp3 = withinRange(line2.mp3, pos.left, pos.left + dim.width);

				line1.withinmp4 = withinRange(line1.mp4, pos.left, pos.left + dim.width);
				line2.withinmp4 = withinRange(line2.mp4, pos.left, pos.left + dim.width);

				if (line1.withinmp1 || line1.withinmp2 || line1.withinmp3 || line1.withinmp4 || line2.withinmp1 || line2.withinmp2 || line2.withinmp3 || line2.withinmp4) {
					if ((line2.withinmp1 && line2.withinmp2) || (line1.withinmp1 && line1.withinmp2)) {
						range1.x2 = pos.left;
						range1.y2 = line3.mp1;
						if (direction) {
							if (range1.x1 >= range1.x2 || range1.y1 >= range1.y2) {
								range1 = {}
							}
						} else {
							if (range1.x1 <= range1.x2 || range1.y1 >= range1.y2) {
								range1 = {}
							}
						}
						range2.x1 = pos.left + dim.width;
						range2.y1 = line3.mp2;
						if (direction) {
							if (range2.x1 >= range2.x2 || range2.y1 >= range2.y2) {
								range2 = {}
							}
						} else {
							if (range2.x1 <= range2.x2 || range2.y1 >= range2.y2) {
								range2 = {}
							}
						}

					}
					else if ((line1.withinmp3 && line1.withinmp4) || (line2.withinmp3 && line2.withinmp4)) {
						range1.y2 = pos.top;
						range1.x2 = line3.mp3;
						if (range1.y2 <= range1.y1) {
							range1 = {};
						}
						range2.y1 = pos.top + dim.height;
						range2.x1 = line3.mp4;
						if (range2.y2 <= range2.y1) {
							range2 = {};
						}
					} else if (line1.withinmp3 && line1.withinmp2) {
						range1.x2 = line3.mp3;
						range1.y2 = pos.top;
						if (range1.y1 >= range1.y2 || range1.x1 >= range1.x2) {
							range1 = {};
						}
						range2.x1 = pos.left + dim.width;
						range2.y1 = line3.mp2;
						if (range2.y1 >= range2.y2 || range2.x1 >= range2.x2) {
							range2 = {};
						}
					} else if (line2.withinmp1 && line2.withinmp4) {
						range1.x2 = pos.left;
						range1.y2 = line3.mp1;
						if (range1.y1 >= range1.y2 || range1.x1 >= range1.x2) {
							range1 = {};
						}
						range2.x1 = line3.mp4;
						range2.y1 = pos.top + dim.height;
						if (range2.y1 >= range2.y2 || range2.x1 >= range2.x2) {
							range2 = {};
						}
					} else if ((line1.withinmp1 && line1.withinmp4) || (line2.withinmp2 && line2.withinmp3)) {
						range1.x2 = pos.left;
						range1.y2 = line3.mp1;
						if (range1.y1 >= range1.y2 || range1.x1 >= range1.x2) {
							range1 = {};
						}
						range2.x1 = pos.left + dim.width;
						range2.y1 = line3.mp2;
						if (range2.y1 >= range2.y2 || range2.x1 >= range2.x2) {
							range2 = {};
						}
					} else if (line1.withinmp2 && line1.withinmp4) {
						range1.x2 = pos.left + dim.width;
						range1.y2 = line3.mp2;
						if (range1.y1 >= range1.y2 || range1.x1 <= range1.x2) {
							range1 = {};
						}
						range2.x1 = line3.mp4;
						range2.y1 = pos.top + dim.height;
						if (range2.y1 >= range2.y2 || range2.x1 <= range2.x2) {
							range2 = {};
						}
					} else if (line2.withinmp1 && line2.withinmp3) {
						range1.y2 = pos.top;
						range1.x2 = line3.mp3;
						if (range1.y1 >= range1.y2 || range1.x1 <= range1.x2) {
							range1 = {};
						}
						range2.x1 = pos.left;
						range2.y1 = line3.mp1;
						if (range2.y1 >= range2.y2 || range2.x1 <= range2.x2) {
							range2 = {};
						}
					}
					else if ((line1.withinmp1 && line1.withinmp3) || (line2.withinmp2 && line2.withinmp4)) {
						range1.y2 = pos.top;
						range1.x2 = line3.mp3;
						if (range1.y1 >= range1.y2 || range1.x1 <= range1.x2) {
							range1 = {};
						}
						range2.y1 = pos.top + dim.height;
						range2.x1 = line3.mp4;
						if (range2.y1 >= range2.y2 || range2.x1 <= range2.x2) {
							range2 = {};
						}
					}
				} else if (Math.abs(line1.mp3 - line2.mp3) == distance * 2 || Math.abs(line1.mp4 - line2.mp4) == distance * 2) {
					range1 = { x1: curRange.x1, y1: curRange.y1, x2: line3.mp3, y2: pos.top };
					range2 = { x2: curRange.x2, y2: curRange.y2, x1: line3.mp4, y1: pos.top + dim.height };
					j++;
				}

				_isDef(range1.x2) && range.splice(j + 1, 0, range1);
				_isDef(range2.x1) && range.splice(j + 1, 0, range2);
				if (_isDef(range1.x2) || _isDef(range2.x1)) {
					range.splice(j, 1);
				}
				if (_isDef(range1.x2) && _isDef(range2.x1)) {
					j++;
				}

			}
		}
		for (var i = 0; i < range.length; i++) {
			var passed = Math.abs(range[i].x1 - range[i].x2) > bcr.width / scale;
			if (!dummy) {
				dummy = {
					x1: range[i].x1,
					x2: range[i].x2,
					y1: range[i].y1,
					y2: range[i].y2,
					passed: passed
				}
				continue
			}
			if (!dummy.passed && passed) {
				dummy = {
					x1: range[i].x1,
					x2: range[i].x2,
					y1: range[i].y1,
					y2: range[i].y2,
					passed: true
				}
			} else if (dummy.passed && passed) {
				if (Math.sqrt(Math.pow((range[i].x1 + range[i].x2) * 0.5 - originalPos.x, 2) + Math.pow((range[i].y1 + range[i].y2) * 0.5 - originalPos.y, 2)) < Math.sqrt(Math.pow((dummy.x1 + dummy.x2) * 0.5 - originalPos.x, 2) + Math.pow((dummy.y1 + dummy.y2) * 0.5 - originalPos.y, 2))) {
					dummy = {
						x1: range[i].x1,
						x2: range[i].x2,
						y1: range[i].y1,
						y2: range[i].y2,
						passed: true
					}
				}
			}
		}
		if (dummy) {
			originalPos.x = (dummy.x1 + dummy.x2) * 0.5;
			originalPos.y = (dummy.y1 + dummy.y2) * 0.5;
		}
	}

	function find_position( points ){
		var index = Math.floor( points.length / 2 ),
		pos = {},
		pt1 = points[ index ], 
        pt2 = points[ index - 1 ];

		if( points.length % 2 == 0 ){
           pos.x = ( pt1.x + pt2.x ) / 2;
           pos.y = ( pt1.y + pt2.y ) / 2;

		   pos.lineIndex = index - 1;

        } else {
           var pt3 = points[ index + 1 ],
           fn = function( x, y ){
           		if( Math.abs( pt1[ y ] - pt2[ y ] ) > Math.abs( pt1[ x ] - pt3[ x ] ) ){
                     pos[ x ] = pt1[ x ];
                     pos[ y ] = ( pt1[ y ] + pt2[ y ] ) / 2;
					 pos.lineIndex = index - 1;
                } else {
                     pos[ y ] = pt1[ y ];
                     pos[ x ] = ( pt3[ x ] + pt1[ x ] ) / 2;
					 pos.lineIndex = index;
                }
           };

           if( pt1.x == pt2.x ){
             fn( 'x', 'y' );
           } else {
              fn( 'y', 'x' );
           }
        }
        return pos;
	}

	function create_range_frm_pt( bcr, points ){
		var __len = points.length - 1,
		__arr = [],
		__width = bcr.width + 20,
		__height = bcr.height + 20,
		max = Math.max( __width, __height ),
		buff = max / 2;

		for( var i = 0; i < __len; i++ ){
			var pt1 = points[ i ],
			pt2 = points[ i + 1 ],
			is_hori = pt1.y == pt2.y,
			hori_buff = is_hori ? 0 : buff,
			vert_buff = is_hori ? buff : 0,
			obj = {
				left : Math.min( pt1.x, pt2.x ) - hori_buff,
				top : Math.min( pt1.y, pt2.y ) - vert_buff,
				right : Math.max( pt1.x, pt2.x ) + hori_buff,
				bottom : Math.max( pt1.y, pt2.y ) + vert_buff,
				_left : [],
				_right : []
			},
			cur_width,
			cur_height;

			if( ( cur_width = obj.width = obj.right - obj.left ) < __width ){
				obj.width = __width;
				obj.left -= ( __width - cur_width ) / 2;
				obj.right += ( __width - cur_width ) / 2;
			}

			if( ( cur_height = obj.height = obj.bottom - obj.top ) < __height ){
				obj.height = __height;
				obj.top -= ( __height - cur_height ) / 2;
				obj.bottom += ( __height - cur_height ) / 2;
			}

			obj.mid_x = ( obj.left + obj.right ) / 2;
			obj.mid_y = ( obj.top + obj.bottom ) / 2;
			obj.is_hori = is_hori;

			__arr.push( obj );
		}

		return __arr;
	}

	function getAll_dim( data, frm_self ){
		var arr = [],
		elem = data.swimlanes ? data.wrapperElement.closest('lyte-connect-swimlanes') : data.wrapperElement.closest('lyte-connect'),
		details = elem.getData( 'details' ),
		textbox = Array.from( elem.querySelectorAll( 'lyte-textbox.lyteConnectTextbox' ) ),
		scale = data.getScale();

		if( frm_self ){
			var connections_without_textbox = [];

			Array.from( elem.getElementsByClassName( 'lyteConnectionContainer' ) ).forEach( function( item ){
				var $connection = $L( item ),
				text__box = $connection.data( 'text_box' ),
				pts = $connection.data( "absolute_points" );
	
				!text__box && pts && connections_without_textbox.push( { pts : pts } );
			} );

			arr.__lines = connections_without_textbox;
		}

		for( var key in details ){
			var cur = details[ key ].position;
			arr.push({
				position : {
					left : cur.left,
					top : cur.top
				},
				dimension : {
					width : cur.width,
					height : cur.height
				}
			});
		}

		textbox.forEach( function( item ){
			var bcr = item.getBoundingClientRect(),
			pos = $L( item ).data( 'position' ) || {},
			__width = bcr.width,
			__height = bcr.height;

			arr.push( item.__bcr = {
				position : {
					left : pos.x - __width * 0.5,
					top : pos.y - __height * 0.5
				},
				dimension : {
					width : __width / scale,
					height : __height / scale
				},
				bcr : bcr,
				item : item
			});

			if( frm_self /*&& frm_self != item */){
				var __pts = $L( item ).data( 'connector' ).data( "absolute_points" );

				__pts && arr.__lines.push( { pts : __pts, item : item } );
			}
		});

		return arr;
	}

	function find_nearest( ranges, pos, bcr ){
		var __width = bcr.width + 10,
		__height = bcr.height + 10,
		__dist = Infinity,
		selected;		

		ranges.forEach( function( item ){
			var item_width = item.width,
			item_height = item.height,
			is_hori = item.is_hori,
			mid_x = is_hori ? item.left + item_width * 0.5 : item.mid_x,
			mid_y = is_hori ? item.mid_y : item.top + item_height * 0.5,
			dist = Math.sqrt( Math.pow( mid_x - pos.x, 2 ) + Math.pow( mid_y - pos.y, 2 ) );

			if( __width > Math.min( mid_x - item.left, item.right - mid_x ) * 2 || __height > Math.min( mid_y - item.top, item.bottom - mid_y ) * 2 ){
				return;
			}

			if( dist < __dist ){
				__dist = dist;
				selected = item;
			}
		});

		if( selected ){
			var is_hori = selected.is_hori;

			pos.x = is_hori ? selected.left + selected.width * 0.5 : selected.mid_x;
			pos.y = is_hori ? selected.mid_y : selected.top + selected.height * 0.5;
		} else {
			return false;
		}
	}

	function check_avoid( exp_pos, points, data, textbox, frm_self ){ 

		if( checking == void 0) {

			checking = getAll_dim( data, frm_self ? textbox : void 0 );

			setTimeout( function(){
				checking = void 0;
			});
		}

		var bcr_obj = textbox.__bcr,
		bcr = bcr_obj.bcr,
		dimension = bcr_obj.dimension,
		ranges = create_range_frm_pt( dimension, points ),
		__width = dimension.width,
		__height = dimension.height,
		min_dim = Math.min( __width, __height ) + 10,
		position = bcr_obj.position,
		ret, cpyRanges;

		checking.forEach( function( item ){

			if( bcr == item.bcr || isNaN(item.position.left) || isNaN(item.position.top) ){
				return;
			}

			data.splitIndiv( ranges, item );
		});

		if( frm_self ){
			cpyRanges = Lyte.deepCopyObject(ranges);
			var __lines = checking.__lines;
			__lines.forEach( split_range_with_pts.bind( this, ranges, data, textbox ) );
		}

		ret = find_nearest( data.join_ranges( ranges ), exp_pos, dimension );

		if( frm_self && !ret ){
			ret = find_nearest( data.join_ranges( cpyRanges ), exp_pos, dimension );
		}

		position.left = exp_pos.x - __width / 2;
		position.top = exp_pos.y - __height / 2;

		return ret;//returns false if space is not avail for txtBox
	}

	function split_range_with_pts( ranges, data, ignore_pt, pts, break_loop ){
		var __item = pts.item;

		pts = pts.pts || pts;

		if( __item && ignore_pt == __item ){
			return;
		}

		var len = pts.length - 1;

		for( var i = 0; i < len; i++ ){
			var __first = pts[ i ],
			__second = pts[ i + 1 ],
			line__left = Math.min( __first.x, __second.x ),
			line_top = Math.min( __first.y, __second.y ),
			line_width = Math.max( 2, Math.abs( __first.x - __second.x ) ),
			line_height = Math.max( 2, Math.abs( __first.y - __second.y ) );

			if( data.splitIndiv( ranges, {
				position : {
					left : line__left,
					top : line_top
				},
				dimension : {
					width : line_width,
					height : line_height
				}
			} ) && break_loop === true ){
				return true;
			}
		}
	}

	function reset_pts( points ){
		var len = points.length - 2;

		for( var i = 0; i < len; i++ ){
			var cur = points[ i ],
			next = points[ i + 1 ],
			next_after = points[ i + 2 ],
			is_vert = cur.x == next.x,
			is_next_vert = next.x == next_after.x;

			if( is_vert == is_next_vert ){
				points.splice( i-- + 1, 1 );
				len--;
			}
		}

		return points;
	}

	function setDirectionClass( pos, absPoints, textBox ){// assume default is hori
		var absLen = absPoints.length,
			_class = "lyteConnectVerticalTextbox",
			$text = $L(textBox),
			vertAvail = $text.hasClass(_class),
			curLineLen,
			vert;
		for (var i = 0; i < absLen - 1; i++) {
			var pos1 = absPoints[i],
				pos2 = absPoints[i + 1],
				xDist = Math.abs(pos1.x - pos2.x),
				yDist = Math.abs(pos1.y - pos2.y);
			if (pos1.x == pos2.x && pos2.x == pos.x) {
				miny = Math.min(pos1.y, pos2.y)
				maxy = Math.max(pos1.y, pos2.y)
				if (miny < pos.y && pos.y < maxy) {
					vert = true
				}
			}
			((xDist && pos1.x < pos.x && pos.x < pos2.x) || (yDist && pos1.y < pos.y && pos.y < pos2.y)) && (curLineLen = xDist || yDist);
		}
		if (vert) {
			vertAvail || $text.addClass(_class);
		} else {
			vertAvail && $text.removeClass(_class);
		}
		curLineLen && textBox.style.setProperty('--elbow_dimension', curLineLen);
	}

	function checking_other_textbox( data, points, textbox ){
		var connect_wrapper = data.wrapperElement.parentNode,
		textbox_arr = Array.from( connect_wrapper.getElementsByTagName( "lyte-textbox" ) );

		return textbox_arr.filter( function( item ){

			var connElem = $L(item).data('connection_elements');

			for (var i in connElem) {//to avoid current textbox if its the src/trg of the connection
				if (notSrcTrg = connElem[i].connector.data('absolute_points') == points) {
					return;
				}
			}

			if( item != textbox ){
				var bcr = item.__bcr;

				if( bcr ){
					var pos = bcr.position,
					dim = bcr.dimension,
					__left = pos.left,
					__top = pos.top,
					__width = dim.width,
					__height = dim.height,
					__range = [
						{
							left : __left,
							top : __top,
							width : __width,
							height : __height,
							right : __left + __width,
							bottom : __top + __height,
							_left : [],
							_right : []
						}
					];

					if( split_range_with_pts( __range, data, void 0, points, true ) ){
						return true
					}
				}
			}
		} );
	}

	$L.elbow.textbox = function( points, data, textbox, type, frm_self ){
		if( type == "curvyLine"){
			text_box_avoidanceLine.call(this, points, textbox, data );
		} else {

			if( textbox ){
				var pos = find_position( points ),
				textOverlap = false,
				_class = 'lyteConnectTextboxOverlap';
				
				if( data.textbox_avoidance && !data.ignore_break ){
					textOverlap = check_avoid( pos, reset_pts( Array.from( points ) ), data, textbox, data.textbox_avoidance_with_line ) == false;
				}
				setDirectionClass( pos, points, textbox );
				textOverlap ? $L(textbox).addClass(_class) : $L(textbox).removeClass(_class);
			}

			if( frm_self ){
				$L( textbox ).css({
					left : pos.x,
					top : pos.y
				}).data( 'position', pos );

				var __bcr = textbox.__bcr,
				__pos = __bcr.position,
				__dim = __bcr.dimension;

				__bcr.position = {
					left : pos.x - __dim.width / 2,
					top : pos.y - __dim.height / 2
				};
			} else if( data.textbox_avoidance && data.textbox_avoidance_with_line && !data.ignore_break ){
				clearTimeout( ( textbox || {} ).__avoid_time );

				// here need to check for other textboxs and based on that need to call respective connector's refresh

				( textbox || {} ).__avoid_time = setTimeout( function(){
					delete ( textbox || {} ).__avoid_time;
					var ret = checking_other_textbox( data, points, textbox );
					ret.forEach( function( item ){
						var connector = $L( item ).data( 'connector' );
						$L.elbow.textbox( connector.data( "absolute_points" ), data, item, type, true );
					} );
				}, 16 );
			}

			return pos;
		}
	}

})();