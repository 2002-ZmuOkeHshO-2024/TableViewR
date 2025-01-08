;( function(){
	var lytedom = $L,
	http_string = "ht" + "tp://",
	fakeContainerClass = "lyteConnectionFakeContainer",
	containerClass = "lyteConnectionContainer",
	targetElemClass = "lyteConnectionTargetElement",
	srcElemClass = "lyteConnectionSrcElement",
	connection_elements = 'connection_elements',
	connection_data_str = 'connection_data',
	lyteConnectionElement_str = 'lyteConnectionElement',
	evt_str = 'mousedown touchstart';

	if( lytedom ){

		function tbox_hover( evt ){
			hover_fn.call( this, evt, $L( _lyteUiUtils.getCurrentTarget( evt ) ).data( 'connector' ).get( 0 ), ' lyteTextboxHover' );
		}

		function hover_fn( evt, __elem, extra_class ){
			
			// if( evt.buttons ){
			// 	return;
			// }

			var elem = __elem || evt.target.closest( '.' + containerClass + ',.' + fakeContainerClass ),
			cls_name = 'lyteConnectionHover' + ( extra_class || '' ),
			is_enter = evt.type == 'mouseenter',
			name = ( is_enter ? 'add' : 'remove' ) + "Class",
			item = "lyte-connect-item",
			fn = function( $node ){
				return $node[ name ]( cls_name );
			},
			data = fn( $L( elem ) ).data(),
			connection_data = this.data( connection_data_str ),
			callback = connection_data[ "onConnection" + ( is_enter ? "Hover" : "Leave" ) ];

			fn( fn( data.src )[ name ]( cls_name + 'Src' ).closest( item ) );
			fn( fn( data.target )[ name ]( cls_name + 'Target' ).closest( item ) );

			fn( $L( data.text_box ) );

			if( callback ){
				callback( evt.originalEvent, elem );
			}

			if( is_enter && connection_data.render_first ){
				elem.parentNode.appendChild( elem );
			}
		}

		function createElement( id, _class, data, options ){

			var ns = http_string + "www.w3.org/2000/svg",
			g = document.createElementNS( ns, "g" ),
			path1 = document.createElementNS( ns, 'path' ),
			path2 = document.createElementNS( ns, 'path' ),
			fn = function( elem, name, value ){
				elem.setAttribute( name, value );
			},
			bind_fn = hover_fn.bind( this ),
			line_marker = data.line_marker;

			options = options || {};

			g.id = id;

			fn( g, 'class', ( _class || fakeContainerClass ).trim() );

			fn( path1, 'class', 'lyteConnectionPath' );
			fn( path1, 'marker-end', options.markerEnd || data.markerEnd || '' );
			fn( path1, 'marker-start', options.markerStart || data.markerStart || '' );

			fn( path2, 'class', 'lyteConnectionFakePath' );

			g.appendChild( path1 );
			g.appendChild( path2 );

			if( line_marker ){
				var line = document.createElementNS( ns, 'path' );
				fn( line, 'class', 'lyteConnectionLineMarker' );
				g.appendChild( line );
			}

			$L( path2 ).on({
				mouseenter : bind_fn,
				mouseleave : bind_fn
			});

			return g;
		}

		function mouseup( evt ){
			var data = this.data(),
			connection_data = data[ connection_data_str ],
			tempElement = data.tempElement,
			$temp = $L( tempElement ),
			anchorClick = data.anchorClick;

			if( data.moved || anchorClick ){
				var module_name = connection_data.module || connection_data.parent,
				__target = evt.target,
				elem = __target.closest( module_name ),
				this_elem = this.get( 0 ),
				target = $temp.data( 'target' );

				if( target && !document.contains( target ) ){
					target = window.document.documentElement;
				}

				data.anchorClick = false;

				if( elem ){
					var callback;
					if( target ){

						callback = connection_data.onReconnect;

						if( callback ){
						  var exst_target = target.get( 0 ),
						  new_position,
						  $_tar = $L( __target ),
						  options = $temp.data( 'options' ),
						  old_position = options.target_position;

						   if( $_tar.hasClass( 'lyteConnectAnchorPoint' ) ){
						  	 new_position = {
						  	 	x : Number( $_tar.attr( 'left' ) ),
						  	 	y : Number( $_tar.attr( 'top' ) )
						  	 };
						  }

						  var new_target = $L( callback( data.element, exst_target, elem, this_elem, evt.originalEvent, tempElement, new_position, old_position ) || exst_target ),
						  __id = 'target_' + tempElement.id,
						  obj = target.data( connection_elements ),
						  target_class = targetElemClass,
						  is_not_same = function(){
						  	if( new_target.get( 0 ) != exst_target ){
						  		return true;
						  	}

						  	if( new_position && ( new_position.x != old_position.x || new_position.y != old_position.y ) ){
						  		return true;
						  	}

						  	return false;
						  };

						  if( new_position && is_not_same() ){
						  	 $temp.data( 'target_position', options.target_position = new_position );
						  }

						  delete obj[ __id ];
						  $temp.data( 'target', new_target );

						  if( !Object.keys( obj ).length ){
						  	 target.removeClass( target_class );
						  }

						  var new_connection = new_target.data( connection_elements );
						  if( !new_connection ){
						  	 new_target.data( connection_elements, new_connection = {} );
						  }
						  new_connection[ __id ] = { connector : $temp };
						  new_target.addClass( target_class );
						}
					} else {
						if( callback = connection_data.onConnect ){
							callback( data.element, elem, this_elem, evt.originalEvent, data.pos, tempElement );
						}
					}
				}

				window.cancelAnimationFrame( this_elem._frame );
				delete this_elem._frame;

				if( target ){
					$temp.addClass( containerClass ).removeClass( fakeContainerClass );
					update_individual_connector.call( this, $temp );
				} else if ( tempElement ) {
					var callback = connection_data.onBeforeHanging;

					tempElement.remove();

					if (connection_data.hanging && !elem) {
						var setHanging = connection_data.setHanging;
						setHanging && setHanging(data, tempElement, evt.originalEvent);
					}
				}
			} else {
				$temp.addClass( containerClass ).removeClass( fakeContainerClass );
				if (anchorClick != true && evt.target.closest(".lyteConnectAnchorPoint")) {
					data.anchorClick = true;
				}
			}

			if (!data.anchorClick) {
				this.removeClass('lyteConnectionCreateMousedown')
			}
			
			if(!data.anchorClick){//happ only once
				$L( document ).off({
					mousemove : data.mousemove,
					mouseup : data.mouseup,
					touchmove : data.mousemove,
					touchend : data.mouseup
				});
				delete connection_data.ignore_break;
				[ 'mousemove', 'mouseup', 'moved', 'clientY', 'clientX', 'tempElement', 'con_x', 'con_y', 'element', 'pos', 'anchorClick' ].forEach( function( item ){
					delete data[ item ];
				});
			}
		}

		function find_side(obj) {
			var curr_pos = {
				down_dist: (obj.height - obj.pos_y),
				right_dist: (obj.width - obj.pos_x),
				top_dist: obj.pos_y,
				left_dist: obj.pos_x
			},
				position = 'down_dist';
			if (curr_pos[position] == 0 && curr_pos.left_dist == 0) {
				position = 'left_dist';
			} else {
				for (var i in curr_pos) {
					if (curr_pos[position] == 0) {
						break;
					} else if (curr_pos[i] < curr_pos[position]) {
						position = i;
						if (curr_pos[position] == 0) {
							break;
						}
					}
				}
			}
			return position;
		}
		
		function advanced_curve(path, _start_x, _start_y, _end_x, _end_y, start, end, curve_offset, xtra, width, height) {
			var ext = curve_offset + xtra,
				to_right = (start.width - start.pos_x),
				overlap = (start.left < (end.left + end.width + 10)) && ((start.left + start.width) > (end.left - 10)),
				start_position = find_side(start),
				end_position = find_side(end),
				top_down = function (flip_side) {
					var _curve_offset = flip_side ? curve_offset : -curve_offset,
						_ext = flip_side ? ext : -ext;
					path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + _start_x + ' ' + (_start_y + _curve_offset)) : "") + ' C ';
					switch (end_position) {
						case flip_side ? 'top_dist' : 'down_dist':
							var cond = flip_side ? ((_start_y + curve_offset < _end_y - curve_offset) && (overlap)) : ((_start_y - curve_offset > _end_y + curve_offset) && (overlap));
							path += (_start_x) + ' ';
							if ((flip_side ? ((start.y + ext) < (end.y - ext)) : ((_start_y - ext) > (_end_y + ext))) || cond) {//down curve
								path += _end_y + ' ' + _end_x + ' ' + _start_y + ' ';
							} else {//norm
								var midy = ((_start_y + _ext) + (_end_y - _ext)) / 2,
									midx = (_end_x + _start_x) / 2,
									limit = Math.min((_end_x - (xtra * 2)), (_start_x - (xtra * 2))),
									val_change = _end_x - _start_x,
									trigger = _start_x + to_right + xtra,
									chng1 = (val_change < trigger && !cond) ? (midx - (trigger - val_change) > limit) ? midx - (trigger - val_change) : limit : midx;
								path += (_start_y + _ext) + ' ' + chng1 + ' ' + (_start_y + _ext) + ' ' + chng1 + ' ' + midy + ' C ' + chng1 + ' ' + (_end_y - (_ext)) + ' ' + _end_x + ' ' + (_end_y - (_ext)) + ' ';
							}
							path += (curve_offset ? (_end_x + ' ' + (_end_y - _curve_offset) + ' L ') : "") + _end_x + ' ' + _end_y;
							break;
						case 'left_dist':
							var midx = ((_start_x + (_end_x - curve_offset)) / 2),
								cond = flip_side ? (_start_y + curve_offset) < _end_y : (_start_y - curve_offset) > _end_y;
							if ((flip_side ? _end_y > (_start_y + ext) : ((_start_y - ext) > _end_y)) || (cond && overlap)) {//curve
								path += _start_x + ' ' + ((_start_y + _curve_offset + _end_y) / 2) + ' ' + midx + ' ' + _end_y + ' ';
							} else {
								//from here on cont
								var limit = Math.min((_end_x - (xtra * 2) - curve_offset), (_start_x - (xtra * 2))),
									val_change = (_end_x - curve_offset) - _start_x,
									trigger = _start_x + to_right + xtra,
									chng1 = (val_change < trigger && !cond) ? (midx - (trigger - val_change) > limit) ? midx - (trigger - val_change) : limit : midx;
								midy = (((_start_y + _ext) + _end_y) / 2)
								path += (_start_x) + ' ' + (_start_y + _ext) + ' ' + chng1 + ' ' + (_start_y + _ext) + ' ' + chng1 + ' ' + midy + ' C ' + chng1 + ' ' + ((midy + _end_y) / 2) + ' ' + (((_end_x - curve_offset) + chng1) / 2) + ' ' + _end_y + ' ';
							}
							path += (curve_offset ? ((_end_x - curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
							break;
						case 'right_dist':
							var midx = (_start_x + _end_x + ext) / 2,
								midy = flip_side ? Math.max((_start_y + curve_offset + (xtra * 2)), (_end_y + (end.height - end.pos_y) + (xtra * 2))) : Math.min((_start_y - curve_offset - (xtra * 2)), (_end_y - end.pos_y - (xtra * 2))),
								temp = _start_x,//gh
								chng1 = 0, chng2 = 0;
							if (flip_side ? ((_start_y + curve_offset) > _end_y) : ((_start_y - curve_offset) < _end_y)) {
								var change_val = flip_side ? (_start_y + curve_offset) - _end_y : _end_y - (_start_y - curve_offset),
									need_val;
								// midx=(midx+_start_x)/2;
								need_val = (midx + _start_x) / 2
								midx = ((midx - (change_val / 4)) > need_val) ? (midx - (change_val / 4)) : (need_val);
								// temp=(_start_x+midx)/2;
								need_val = (_start_x + midx) / 2;
								temp = ((temp + (change_val / 4)) < need_val) ? (temp + (change_val / 4)) : (need_val);
								// midy-=xtra;
								midy = flip_side ? ((midy - (change_val / 4)) > ((midy - xtra))) ? (midy - (change_val / 4)) : (midy - xtra) : ((midy + (change_val / 4)) < ((midy + xtra))) ? (midy + (change_val / 4)) : (midy + xtra);
								var val_change = (_end_x - _start_x),
									trigger = _start_x + to_right + xtra * 2,
									limit = (curve_offset + xtra * 2);
								chng1 = (val_change < trigger) ? ((trigger - val_change) < limit) ? trigger - val_change : limit : 0;
							} else {
								var val_change = (_end_x - _start_x),
									trigger = _start_x + to_right + xtra * 2;
								chng2 = (val_change < trigger) ? ((trigger - val_change) < (xtra * 2)) ? trigger - val_change : (xtra * 2) : 0;
							}
							path += (_start_x - chng2) + ' ' + ((_start_y + _curve_offset + midy) / 2) + ' ' + (temp - chng2) + ' ' + (midy) + ' ' + (midx + (chng1 / 4) - (chng2 / 2)) + ' ' + (midy) + ' C ' + (_end_x + ext + chng1) + ' ' + (midy) + ' ' + (_end_x + ext + chng1) + ' ' + _end_y + ' ' + (curve_offset ? ((_end_x + curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
							break;
						default:
							var val_change = _end_x - _start_x,
								trigger = _start_x + to_right + xtra,
								chng = (val_change < trigger && Math.abs((_start_y + curve_offset) - (_end_y + curve_offset)) > xtra) ? (trigger - val_change) < (xtra * 2) ? (trigger - val_change) : (xtra * 2) : 0,
								chng1 = 0,
								chng2 = 0,
								level;
							if (flip_side ? _start_y < _end_y : _start_y > _end_y) {
								level = (_end_y + _ext);
								chng1 = chng;
							} else {
								level = (_start_y + _ext);
								chng2 = chng;
							}
							path += (_start_x - (chng1 * 2)) + ' ' + level + ' ' + (_end_x + (chng2 * 2)) + ' ' + level + ' ' + (curve_offset ? (_end_x + ' ' + (_end_y + _curve_offset) + ' L ') : "") + _end_x + ' ' + _end_y;
					}
				};
			try {
				switch (start_position) {
					case 'top_dist':
						top_down(false);
						break;
					case 'down_dist':
						top_down(true);
						break;
					case 'left_dist'://left
						var midx = ((_start_x - ext) + (_end_x + ext)) / 2,
							midy;
						path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + (_start_x - curve_offset) + ' ' + _start_y) : "") + ' C ' + (_start_x - ext) + ' ' + _start_y + ' ' + (_start_x - ext) + ' ';
						switch (end_position) {
							case 'right_dist'://left right
								var midx = ((_start_x - ext) + (_end_x + ext)) / 2,
									val_change = _end_x - _start_x,
									trigger = _start_x + to_right + xtra,
									act_val = trigger - val_change,
									val_tri = val_change < trigger,
									chng2 = (val_tri && _start_y > _end_y) ? (act_val < (curve_offset + (xtra * 2))) ? act_val : (curve_offset + (xtra * 2)) : 0;
								chng1 = ((val_tri && _start_y < _end_y) ? (act_val < (xtra)) ? act_val : (xtra) : 0) / 2;
								midy = Math.max((_start_y + (start.height - start.pos_y) + (xtra * 2)), (_end_y + (end.height - end.pos_y) + (xtra * 2)));
								path += (midy - chng1) + ' ' + midx + ' ' + (midy - chng1) + ' C ' + (_end_x + ext + chng2) + ' ' + (midy - chng1) + ' ' + (_end_x + ext + chng2) + ' ' + _end_y + ' ' + (curve_offset ? ((_end_x + curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
								break;
							case 'down_dist':
							case 'top_dist':
								var chng1 = 0, chng3 = 0, chng4 = 0;
								chng_var1 = _end_x, chng_var2 = undefined,
									collide = function (bool) {
										var val_change = (_end_x - _start_x),
											trigger = _start_x + to_right + (xtra),
											act_val = (trigger - val_change);
										if (val_change < trigger) {
											if (bool) {
												chng4 = chng1 = ((act_val / 4) < xtra) ? act_val / 4 : xtra;
											} else {
												chng3 = ((act_val) < xtra * 2) ? act_val : xtra * 2;
											}
										}
									};
								if (end_position == 'top_dist') {//up
									midy = Math.min((_start_y - start.pos_y - (xtra + (xtra / 2))), (_end_y - end.pos_y - curve_offset - (xtra + (xtra / 2)))) * 13 / 15;
									midx = (_end_x + (_start_x - ext)) / 2,
										chng_var2 = ((_end_y - curve_offset) + midy) / 2;
									if ((_end_y - curve_offset) < _start_y) {//up
										var change_val = _start_y - (_end_y - curve_offset);
										midx = (midx + (change_val) < (midx + _end_x) / 2) ? midx + (change_val) : (midx + _end_x) / 2;
									}
									if ((_end_y - curve_offset) < (_start_y + 150)) {
										collide(true, 'top');
										chng4 *= -1;
									} else {
										collide(false);
									}
								} else {
									midy = Math.max((_start_y + (start.height - start.pos_y) + (xtra)), (_end_y + ext)),
										midx = ((_start_x - ext) + _end_x) / 2;
									if ((_end_y + curve_offset) > _start_y) {
										var change_val = (_end_y + curve_offset) - _start_y,
											need_val = (midx + _end_x) / 2;
										((midx + (change_val / 4)) < need_val) ? (midx += (change_val / 4)) : (midx = need_val);
										((chng_var1 - (change_val / 4)) > (_end_x + midx) / 2) ? (chng_var1 -= (change_val / 4)) : (chng_var1 = (_end_x + midx) / 2);
									} else {
										midy += ((_start_y - (_end_y + curve_offset)) / 4) < xtra ? ((_start_y - (_end_y + curve_offset)) / 4) : xtra;
									}
									if ((_end_y + curve_offset) > (_start_y - 150)) {
										collide(true);//down
									} else {
										collide(false);
									}
									chng_var2 = ((_end_y + curve_offset + midy + (chng1 / 2)) / 2);
								}
								path = '';
								path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + (_start_x - curve_offset) + ' ' + _start_y) : "") + ' C ' + (_start_x - ext - chng1) + ' ' + _start_y + ' ' + (_start_x - ext - chng1) + ' ';
								path += (midy) + ' ' + (midx - (chng1 / 2) + ((chng3 / 2) < _end_x ? (chng3 / 2) : _end_x)) + ' ' + (midy + (chng4 / 2)) + ' C ' + (chng_var1 + chng3) + ' ' + (midy + (chng4 / 2)) + ' ' + (_end_x + chng3) + ' ' + chng_var2;
								path += ' ' + (curve_offset ? (_end_x + ' ' + (_end_y + ((end_position == 'down_dist') ? curve_offset : -curve_offset)) + ' L ') : "") + _end_x + ' ' + _end_y;
								break;
							default:
								var chng1 = 0, val_change = Math.max(start.height, end.height) + (xtra * 2);
								if (Math.abs(_start_y - _end_y) <= val_change) {
									var val = val_change - Math.abs(_start_y - _end_y);
									if (_start_y <= _end_y) {
										chng1 = val
									} else {
										chng1 = -val;
									}
								}
								path += (_end_y + chng1) + ' ' + (curve_offset ? ((_end_x - curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
						}
						break;
					case 'right_dist'://right
						if (end_position != 'left_dist') {
							path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + (_start_x + curve_offset) + ' ' + _start_y) : "") + ' C ';
							if (end_position == 'down_dist' || end_position == 'top_dist') {
								var midx = (_start_x + curve_offset + _end_x) / 2,
									midy,
									first,
									ext_val = ext,
									cond,
									chng1;
								if (end_position == 'down_dist') {
									cond = (_end_y + curve_offset) < _start_y;
									midy = (_start_y + (_end_y + ext)) / 2;
									first = ((_end_y + ext) < _start_y || cond && overlap) ? false : true;
								} else {
									cond = (_end_y - curve_offset) > _start_y;
									midy = (_start_y + (_end_y - ext)) / 2;
									first = ((_end_y - ext) > _start_y || cond && overlap) ? false : true;
									ext_val = -ext;
								}
								if (first) {
									limit = Math.max((_end_x + (xtra * 2)), (_start_x + curve_offset + (xtra * 2))),
										val_change = _end_x - (_start_x + curve_offset),
										trigger = _start_x + to_right + ext,
										act_val = trigger - val_change,
										chng1 = (val_change < trigger && !cond) ? (midx + (act_val * 2) < limit) ? midx + (act_val * 2) : limit : midx;
									path += (_start_x + curve_offset + chng1) / 2 + ' ' + _start_y + ' ' + chng1 + ' ' + (_start_y + midy) / 2 + ' ' + chng1 + ' ' + midy + ' C ' + chng1 + ' ' + (_end_y + ext_val) + ' ' + _end_x + ' ' + (_end_y + ext_val) + ' ';
								} else {
									path += midx + ' ' + (_start_y) + ' ' + _end_x + ' ' + midy + ' ';
								}
								path += (curve_offset ? (_end_x + ' ' + (_end_y + ((end_position == 'down_dist') ? curve_offset : -curve_offset)) + ' L ') : "") + _end_x + ' ' + _end_y;
							} else {
								var chng1 = 0, val_change = Math.max(start.height, end.height) + (xtra * 2);
								if (Math.abs(_start_y - _end_y) <= val_change) {
									var val = val_change - Math.abs(_start_y - _end_y);
									if (_start_y <= _end_y) {
										chng1 = -val
									} else {
										chng1 = val;
									}
								}
								path += (_end_x + ext) + ' ' + (_start_y + chng1) + ' ' + (_end_x + ext) + ' ' + _end_y + ' ' + (curve_offset ? ((_end_x + curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
							}
							break;
						}
					default:
						path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + (_start_x + curve_offset) + ' ' + _start_y) : "") + ' C ' + (_start_x + curve_offset + width * 13 / 15) + ' ' + _start_y + ' ' + (_end_x - curve_offset - width * 13 / 15) + ' ' + _end_y + ' ' + (curve_offset ? ((_end_x - curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
				}
			} catch (e) {
				path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + (_start_x + curve_offset) + ' ' + _start_y) : "") + ' C ' + (_start_x + curve_offset + width * 13 / 15) + ' ' + _start_y + ' ' + (_end_x - curve_offset - width * 13 / 15) + ' ' + _end_y + ' ' + (curve_offset ? ((_end_x - curve_offset) + ' ' + _end_y + ' L ') : "") + _end_x + ' ' + _end_y;
			}
			return path;
		}

		function draw_curve( svg, start, end, data, _this ){
			var width = Math.abs( start.x - end.x ),
			height = Math.abs( start.y - end.y ),
			offset = data.offset,
			off_x1 = offset.left,
			off_y1 = offset.top,
			off_x2 = offset.right,
			off_y2 = offset.bottom,
			start_x = Math.min( start.x, end.x ),
			start_y = Math.min( start.y, end.y ),
			end_x = Math.max( start.x, end.x ),
			end_y = Math.max( start.y, end.y ),
			ref_x = start_x - off_x1,
			ref_y = start_y - off_y1,
			flipx = start.x > end.x,
			flipy = start.y > end.y,
			trans = '',
			path = '',
			$svg = $L( svg ),
			$data = $svg.data() || {}, 
			type = ( $data.options || {} ).connection_type || data.connection_type,
			scroll = /*data.getScroll()*/ { left : 0, top : 0 },
			curve_offset = /*Math.min( */data.curve_offset/*, width / 3 )*/,
			_module = data.module,
			text_box = $data.text_box,
			cb = data.onConnectionUpdate,
			cb1 = data.attr_fn,
			line_marker = data.line_marker,
			ignore_break = !data.ignore_break,
			xtra = 80,
			lineBend = data.lineBend || {},
			lineBendValue = {};

			switch( type ){
				case "line": {
					var bendStartX = (start.x - ref_x),
						bendStartY = (start.y - ref_y),
						bendEndX = (end.x - ref_x),
						bendEndY = (end.y - ref_y),
						side = { start: find_side(start), end: find_side(end) };

					lineBendValue.start = lineBend.start && { inc: (side.start == 'right_dist' || side.start == 'down_dist') ? 1 : -1, hori: side.start == 'left_dist' || side.start == 'right_dist' };
					lineBendValue.end = lineBend.end && { inc: (side.end == 'right_dist' || side.end == 'down_dist') ? 1 : -1, hori: side.end == 'left_dist' || side.end == 'right_dist' };

					path += "M " + bendStartX + ' ' + bendStartY + (lineBend.start ? ' L ' + (bendStartX + lineBendValue.start.inc * (lineBendValue.start.hori ? lineBend.start : 0)) + ' ' +
						(bendStartY + lineBendValue.start.inc * (lineBendValue.start.hori ? 0 : lineBend.start)) : '') + (lineBend.end ? ' L ' + (bendEndX + lineBendValue.end.inc * (lineBendValue.end.hori ? lineBend.end : 0))
							+ ' ' + (bendEndY + lineBendValue.end.inc * (lineBendValue.end.hori ? 0 : lineBend.end)) : '') + ' L ' + bendEndX + ' ' + bendEndY;	
				}
				break;
				case "curve" : 
				case "advanced_curve" : 
				case "curvyLine" : {
					function fn( start, end ,data){
						var is_hgt = height <= curve_offset,
						is_wdt = width <= curve_offset * 3,
						_start_x = start.x - ref_x,
						_start_y = start.y - ref_y,
						_end_x = end.x - ref_x,
						_end_y = end.y - ref_y;

						switch( type ){
							case "curve" : {
								if( is_hgt && !is_wdt && curve_offset ){
									path += "M " + _start_x + ' ' + _start_y + ' C ' + ( _start_x + width / 4 ) + ' ' + ( _start_y + curve_offset ) + ' ' + ( _start_x + width * 3 / 4 ) + ' ' + ( _end_y + curve_offset ) + ' ' + _end_x + ' ' + _end_y;
									curve_offset = 0;
								} else {
									if( is_wdt && !is_hgt && curve_offset ){
										var is_start_left = start.x == start.left,
										is_end_left = end.x == end.left;
										if( is_start_left == is_end_left ){
											if( !is_end_left ){
												path += "M " + _start_x + ' ' + _start_y + ' L ' +  ( _start_x + curve_offset ) + ' ' + _start_y + ' C ' + ( _end_x + curve_offset * 3 ) + " " + _start_y + " " + ( _end_x + curve_offset * 3 ) + " " + ( _end_y ) + " " + ( _end_x + curve_offset ) + ' ' + _end_y + " L " + _end_x + " " + _end_y;
											} else {
												path += "M " + _start_x + ' ' + _start_y + ' L ' +  ( _start_x - curve_offset ) + ' ' + _start_y + ' C ' + ( _start_x - curve_offset * 3 ) + " " + _start_y + " " + ( _start_x - curve_offset * 3 ) + " " + ( _end_y ) + " " + ( _end_x - curve_offset ) + ' ' + _end_y + " L " + _end_x + " " + _end_y;
											}
										} else {
											path += "M " + _start_x + ' ' + _start_y + ( curve_offset ? ( ' L ' + ( _start_x + curve_offset ) + ' ' + _start_y  ) : "" ) + ' C ' + ( _start_x + curve_offset * 3 + width * 13 / 15 ) + ' ' + _start_y + ' ' + ( _end_x - curve_offset * 3 - width * 13 / 15 ) + ' ' + _end_y + ' ' + ( curve_offset ? ( ( _end_x - curve_offset ) + ' ' + _end_y + ' L '  ) : "" ) + _end_x + ' ' + _end_y;
										}
									} else {
										path += "M " + _start_x + ' ' + _start_y + ( curve_offset ? ( ' L ' + ( _start_x + curve_offset ) + ' ' + _start_y  ) : "" ) + ' C ' + ( _start_x + curve_offset + width * 13 / 15 ) + ' ' + _start_y + ' ' + ( _end_x - curve_offset - width * 13 / 15 ) + ' ' + _end_y + ' ' + ( curve_offset ? ( ( _end_x - curve_offset ) + ' ' + _end_y + ' L '  ) : "" ) + _end_x + ' ' + _end_y;
									}
								}
							}
							break;
							case "advanced_curve" : {
								path = advanced_curve(path, _start_x, _start_y, _end_x, _end_y, start, end, curve_offset, xtra, width, height);
							}
							break;
							case "curvyLine" : {
								var sx_curve_offset = 0,
								sy_curve_offset = 0,
								ex_curve_offset = 0,
								ey_curve_offset = 0,
								set_curve_offset = function (position, flip) {
									var val = curve_offset;
									switch (position) {
										case 'right_dist':
											flip ? sx_curve_offset = val : ex_curve_offset = val;
											break;
										case 'left_dist':
											flip ? sx_curve_offset = -val : ex_curve_offset = -val;
											break;
										case 'top_dist':
											flip ? sy_curve_offset = -val : ey_curve_offset = -val;
											break;
										case 'down_dist':
											flip ? sy_curve_offset = val : ey_curve_offset = val;
											break;
									}
								};
								set_curve_offset(find_side(start), true);
								set_curve_offset(find_side(end), false);
								
								var midx = ((_start_x + sx_curve_offset) + (_end_x + ex_curve_offset)) / 2,
									midy = ((_start_y + sy_curve_offset) + (_end_y + ey_curve_offset)) / 2,
									dec_dx = midx - 10,
									dec_dy = midy - 10,
									inc_dx = midx + 10,
									chng_dx = (_start_y > _end_y) ? dec_dx : inc_dx;
									path += "M " + _start_x + ' ' + _start_y + (curve_offset ? (' L ' + (_start_x + sx_curve_offset) + ' ' + (_start_y + sy_curve_offset)) : "") + ' C ' + chng_dx + ' ' + dec_dy + ' ' + chng_dx + ' ' + dec_dy + ' ' + (curve_offset ? ((_end_x + ex_curve_offset) + ' ' + (_end_y + ey_curve_offset) + ' L ') : "") + _end_x + ' ' + _end_y;
							}
							break;
						}

						$svg[ ( flipx ? 'add' : 'remove' ) + 'Class' ]( 'lyteFlipX' );
						$svg[ ( flipy ? 'add' : 'remove' ) + 'Class' ]( 'lyteFlipY' );
						var callback = data.onBeforePathChange;
						if (callback) {
							var ret_val = callback(svg, path, start, end);
							path = ret_val ? ret_val : path;
						}
					}
					if( flipx ){
						fn( end, start ,data)
	
						// for fliped case need to switch start and end points. Because marker end and start will only apply for respective points
						
						var new_path = path.replace( /(M|C|L)\s/g, '' ),
						_split = new_path.split( ' ' ).reverse(),
						_len = _split.length,
							set_path = function (current) {
								while (true) {
									if (current + 6 <= _split.length) {
										_split.splice(current, 0, 'C');
										current += 7;
									} else {
									break;
								}
							}
							return current;
						};
						for( var i = 0; i < _len; i += 2 ){
							var _temp = _split[ i ];
							_split[ i ] = _split[ i + 1 ];
							_split[ i + 1 ] = _temp;
						}
	
						_split.splice( 0, 0, 'M' );
						if( curve_offset ){
							_split.splice( 3, 0, 'L' );
							var current=set_path(6);
							// _split.splice( 6, 0, 'C' );
							_split.splice( current, 0, 'L' );
							//
						} else {
							set_path(3);
	
							// _split.splice( 3, 0, 'C' );
						}
	
						path = _split.join( ' ' );
					} else {
						fn( start, end ,data);
					}
				}
				break;
				case "linear_curve" :{
					$L.elbow( svg, start, end, data, false );
					
					var __pts = $svg.data( "absolute_points" ),
					__len = __pts.length,
					last = __pts[ __len - 1 ],
					first = __pts[ 0 ],
					__last = {
						x : last.x - ref_x,
						y : last.y - ref_y
					},
					__first = {
						x : first.x - ref_x,
						y : first.y - ref_y
					},
					is_x_first = last.x > first.x,
					is_y_first = last.y > first.y,
					second = __pts[ 1 ],
					before_last = __pts[ __len - 2 ],
					is_first_vert = first.x == second.x,
					is_last_vert = before_last.x == last.x,
					first_var = is_first_vert ? 'y' : 'x',
					last_var = is_last_vert ? 'y' : 'x',
					first_vert_fact = second[ first_var ] > first[ first_var ] ? 1 : -1,
					last_vert_fact = before_last[ last_var ] < last[ last_var ] ? 1 : -1,
					linear_arr = [];

					path += `M ${__first.x },${__first.y } `;

					if( curve_offset ){
						path += `L ${ __first.x + ( is_first_vert ? 0 : 1 ) * first_vert_fact * curve_offset } ${ __first.y + ( is_first_vert ? 1 : 0 ) * first_vert_fact * curve_offset }`;
					}

					path += 'C ';

					if( is_first_vert ){
						path += `${__first.x },${ __first.y + 40 * first_vert_fact } `;
						linear_arr.push({
							x : __first.x,
							y : __first.y + 40 * first_vert_fact * 0.5
						});
					} else {
						path += `${ __first.x + 40 * first_vert_fact },${ __first.y } `;
						linear_arr.push({
							x : __first.x + 40 * first_vert_fact * 0.5,
							y : __first.y
						});
					}

					if( is_last_vert ){
						path += `${ __last.x },${ __last.y - 40 * last_vert_fact }`;
						linear_arr.push({
							x : __last.x,
							y : __last.y - 40 * last_vert_fact * 0.5
						});
					} else {
						path += `${ __last.x - 40 * last_vert_fact },${__last.y }`;
						linear_arr.push({
							x : __last.x - 40 * last_vert_fact * 0.5,
							y : __last.y
						});
					}

					if( curve_offset ){
						path += ` ${ __last.x - ( is_last_vert ? 0 : 1 ) * last_vert_fact * curve_offset } ${ __last.y - ( is_last_vert ? 1 : 0 ) * last_vert_fact * curve_offset } L`;
					}

					path += ` ${ __last.x + curve_offset * ( is_last_vert ? 0 : 1 ) * last_vert_fact },${ __last.y + curve_offset * ( is_last_vert ? 1 : 0 ) * last_vert_fact  }`;

					$svg.data( 'linear_points', linear_arr );
					if( is_first_vert != is_last_vert ){
						svg.__alternate = {
							is_last_vert : is_last_vert,
							is_first_vert : is_first_vert,
							first_vert_fact : first_vert_fact,
							last_vert_fact : last_vert_fact
						};
					} else {
						delete svg.__alternate;
					}
				}
				break;
				case "elbow" : {
					var avoid_line = data.avoid_line && ignore_break,
					arc = data.elbow_arc && ignore_break,
					adjustPoints = ignore_break && $data.adjustPoints;

					path = $L.elbow( svg, start, end, data, avoid_line && arc );

					if( avoid_line ){
						path = $L.elbow.avoidLine( svg, data, arc, ref_x, ref_y ) || path;
					}

					if( data.elbow_arc && arc ){
						$L.elbow.arc( svg, data, void 0, cb1 );
						path = void 0;
					}

					if(adjustPoints){
						var __this = _this.get(0);
						!adjustPoints.__undo && __this.pushToQueue({
							type : "modifierChange",
							data : JSON.stringify({
								old : adjustPoints,
								id : $data.options.id
							})
						});
						delete adjustPoints.__undo;
					}
				}
				break;
			}

			var fn = function( elem, name, value ){
				elem.setAttribute( name, value );
			},
			fn2 = cb1 || fn,
			new_transform = 'translate(' + ( ref_x - scroll.left ) + ' ' + ( ref_y - scroll.top ) + ')',
			has_container = $svg.hasClass( containerClass );
			
			if( path ){
				var paths = svg.children;

				fn2( paths[ 0 ], 'd', path );
				fn( paths[ 1 ], 'd', path );
			}
			fn2( svg, 'transform', new_transform );

			check_element_type( svg );

			if( text_box ){
				var $text = $L( text_box );

				if (type == "curvyLine" || type == "linear_curve") {
					var def_x = (ref_x - scroll.left),
						def_y = (ref_y - scroll.top),
						elem = paths[0],
						tot_len = elem.getTotalLength(),
						start_co_ord = elem.getPointAtLength(0),
						start_left = def_x + start_co_ord.x,
						start_top = def_y + start_co_ord.y,
						end_co_ord = elem.getPointAtLength(tot_len),
						end_left = def_x + end_co_ord.x,
						end_top = def_y + end_co_ord.y,
						mid_co_ord = elem.getPointAtLength(tot_len / 2),
						mid_left = def_x + mid_co_ord.x,
						mid_top = def_y + mid_co_ord.y,
						points = [{ x: start_left, y: start_top }, { x: end_left, y: end_top }],
						originalPos = { x: (mid_left), y: (mid_top) },
						finalPos = {};
					if (ignore_break) {
						$L.elbow.textbox.call(_this, points, originalPos, text_box, type);
						// text_box_avoidanceLine( points, undefined, textBody, originalPos, undefined );
						var originalDiagonal = Math.sqrt(Math.pow(Math.abs(originalPos.x - start_left), 2) + Math.pow(Math.abs(originalPos.y - start_top), 2));
						finalPos = elem.getPointAtLength(originalDiagonal);
						originalPos.x = def_x + finalPos.x;
						originalPos.y = def_y + finalPos.y;
					}
					$text.css({
						left: originalPos.x,
						top: originalPos.y
					});
				} else if( /line|curve/i.test( type ) ){
					var lineBendValStart = lineBendValue.start || { inc: 0, hori: 0 },
						lineBendValEnd = lineBendValue.end || { inc: 0, hori: 0 },
						startBendInc = lineBendValStart.inc * lineBend.start,
						endBendInc = lineBendValEnd.inc * lineBend.end,
						startBendX = (lineBend.start && lineBendValStart.hori) ? startBendInc : 0,
						startBendY = (lineBend.start && !lineBendValStart.hori) ? startBendInc : 0;
					$text.css({
						left: (ref_x + off_x1 + startBendX - scroll.left) + (width - startBendX + ((lineBend.end && lineBendValEnd.hori) ? endBendInc : 0)) / 2,
						top: (ref_y + off_y1 + startBendY - scroll.top) + (height - startBendY + ((lineBend.end && !lineBendValEnd.hori) ? endBendInc : 0)) / 2
					});
				} else {
					var pos =  $L.elbow.textbox( $data.absolute_points, data, text_box );
					$text.css({
						left : pos.x,
						top : pos.y
					}).data( 'position', pos );
				}

				if( $L( text_box ).hasClass( targetElemClass ) ){
					update.call( _this, text_box );
				}
			} else if( type == "elbow" ){
				$L.elbow.textbox && $L.elbow.textbox( $data.absolute_points, data, void 0 );
			}

			if( line_marker ){
				if( type == "elbow" ){
					$L.elbow.marker( svg, line_marker, ref_x, ref_y, data, ignore_break );
				} else {
					$L.elbow.marker( svg, line_marker, ref_x, ref_y, data, 1, 1 );
				}
			}

			if( type != "elbow" ){
				$data.ref_pts = [ { x : start.x, y : start.y }, { x : end.x, y : end.y } ];
			}

			cb && has_container && cb( svg );
		}

		function check_element_type( svg ){
			var $svg = $L( svg ),
			data = $svg.data(),
			src_class = data.src_class,
			target_class = data.target_class,
			active_src = data.active_src,
			active_target = data.active_target,
			fn = function( elem ){
				return ( elem ? elem.tagName.toLowerCase() : "" ).replace(/\-(.)/g, function(){
				    return arguments[ 1 ].toUpperCase();
				});
			},
			src_tag = 'lyteConnectSrc_' + fn( active_src ),
			target_tag = 'lyteConnectTarget_' + fn( active_target );

			$svg.removeClass( ( src_class || "" ) + " " + ( target_class || "" ) );

			$svg.addClass( src_tag + ' ' + target_tag ).data({
				src_class : src_tag,
				target_class : target_tag	
			});
		}

		function getOriginalClient( data, elem, scale ){
			var clientX = data.clientX,
			clientY = data.clientY,
			wrap_elem = elem.querySelector( '.lyteConnectWrapper' );

			if( !wrap_elem ){
				wrap_elem = elem;
			}

			var wrap_bcr = wrap_elem.getBoundingClientRect(),
			left_diff = ( clientX - wrap_bcr.left ) / scale,
			top_diff = ( clientY - wrap_bcr.top ) / scale;

			return {
				clientX : left_diff,
				clientY : top_diff
			};
		}

		function mousemove( evt ){
			var data = this.data(),
			connection_data = /*swimlanes.length ? swimlanes.data().connection_data :*/ data.connection_data;

			if( connection_data.swimlanes ){
				connection_data = this.closest( "lyte-connect-swimlanes" ).data( "connection_data" );
			}

			var scale = connection_data.getScale(),
			ori_evt = evt,
			touches = evt.touches || [ evt ];

			if( touches.length > 1 ){
				return;
			}

			evt = touches[ 0 ];

			var swimlanes = connection_data.swimlanes,
			clientX = evt.clientX,
			clientY = evt.clientY,
			_clientX = data.clientX,
			_clientY = data.clientY,
			tempElement = data.tempElement,
			elem = this.get( 0 ),
			boundary = connection_data.getBoundary(),
			scrollLeft = swimlanes ? elem.component.data.ltPropScrollLeft : /*connection_data.getScroll().left*/0,
			scrollTop = swimlanes ? elem.component.data.ltPropScrollTop : /*connection_data.getScroll().top*/ 0,
			bcr = elem.getBoundingClientRect(),
			original_client = getOriginalClient( data, elem, scale ),
			xInc = ( clientX - _clientX ) / scale + scrollLeft,
			yInc = ( clientY - _clientY ) / scale + scrollTop,
			cb = connection_data.onManualConnectionCreate;

			window.cancelAnimationFrame( elem._frame );
			delete elem._frame;
			
			if( !data.moved ){
				if (Math.abs(clientX - _clientX) <= 1 && Math.abs(clientY - _clientY) <= 1) {
					return
				}
				data.moved = true;
				if( !tempElement ){
					data.tempElement = tempElement = createElement.call( this, 'lyteNewConnection' + Date.now(), void 0, connection_data );
					connection_data.wrapperElement.appendChild( tempElement );
					cb && cb( data.element, data.tempElement, evt, elem );
				}
			}

			var _left = 0, _top = 0;

			if (swimlanes) {
				_left = elem.offsetLeft;
				_top = elem.offsetTop;
			}

			draw_curve(tempElement, { x: data.con_x + _left, y: data.con_y + _top, initial_angle: data.initial_angle }, { x: original_client.clientX + xInc + _left, y: original_client.clientY + yInc + _top }, connection_data);

			function fn( _left, _right, client, other_window ){
				if( client < Math.max( 0, bcr[ _left ] ) + 5 ){
					return 1;
				} else if( client > Math.min( bcr[ _right ], other_window ) - 5 ){
					return -1;
				}
				return 0
			}

			var wwidth = Math.min( window.innerWidth, bcr.width ),
			wheight = Math.min( window.innerHeight, bcr.height ),
			x_fact = boundary ? fn( 'left', 'right', clientX, wwidth ) : 0,
			y_fact = boundary ? fn( 'top', 'bottom', clientY, wheight ) : 0,
			bool = x_fact || y_fact;

			if( x_fact && !swimlanes ){
				connection_data.setScroll( 'Left', scrollLeft + 5 * x_fact, wwidth );
				clientX -= 5 * x_fact;
			}

			if( y_fact && !swimlanes ){
				connection_data.setScroll( 'Top', scrollTop + 5 * y_fact, wheight );
				clientY -= 5 * y_fact;
			} 

			if( bool ){
				elem._frame = window.requestAnimationFrame( mousemove.bind( this, ori_evt ) );
			}

			data.clientX = clientX;
			data.clientY = clientY;
		}

		function get_group_off( _module, __scale, data ){

			var off_parent = data.swimlanes ? _module.closest("lyte-connect") : _module.offsetParent;

			if( $L( off_parent ).hasClass( 'lyteConnectGroupShape' ) || $L( off_parent ).hasClass( 'lyteConnectSwimlaneConnect' ) ){
				return {
					left : calc_offset( off_parent, 'left', __scale ),
					top : calc_offset( off_parent, 'top', __scale )
				};
			}
			return {
				left : 0,
				top : 0
			};
		}

		function acc_off( elem, outer, acc, ns ){
			var off = elem.offsetParent;
			if( !off || off == outer ){
				return acc;
			}
			return acc_off( off, outer, acc + off[ ns ], ns );
		}

		function scroll_deduct( elem, outer, ns, acc ){

			var parent = elem.parentNode;

			acc += parent[ 'scroll' + ns ];

			if( elem == outer ){
				return acc;
			}

			return scroll_deduct( parent, outer, ns, acc );
		}

		function calc_offset( elem, ns, scale ){
			var off_parent = elem.offsetParent;

			if( off_parent ){
				var __data = $L( elem ).data() || {};
				return (( elem.getBoundingClientRect()[ ns ] - off_parent.getBoundingClientRect()[ ns ] ) / scale )  + ( __data[ ns + '_diff' ] || 0 ) ;
			}
			return 0;
		}

		function mousedown( evt ){
			evt.stopPropagation();
			var data = this.data( connection_data_str ),
			module_name = data.selector,
			elem = evt.target.closest( module_name ),
			tempElement,
			callback = data.onBeforeConnectionCreation,
			ori_evt = evt,
			touches = evt.touches || [ evt ],
			is_reselect,
			__outer = this.get( 0 ),
			__scale = data.getScale();

			if( data.readonly || touches.length > 1 || evt.buttons == 2 ){
				return;
			}

			evt = touches[ 0 ];

			if( !elem ){
				var class_name = containerClass,
				connector = evt.target.closest( '.' + class_name );
				if( connector ){
					elem = $L( connector ).removeClass( class_name ).addClass( fakeContainerClass ).data( 'active_src' );
					is_reselect = true;
				}
				tempElement = connector;
				callback = data.onBeforeReconnectSelect;
			}

			if( !elem || evt.buttons == 2 ){
				return;
			} 

			if( callback && callback( ori_evt.originalEvent, tempElement, __outer ) == false ){
				$L( tempElement ).addClass( class_name ).removeClass( fakeContainerClass );
				return;
			}

			var bcr = elem.getBoundingClientRect(),
			near = evt.clientX,
			move = mousemove.bind( this ),
			up = mouseup.bind( this ),
			obj = {
				mousemove : move,
				mouseup : up,
				touchmove : move,
				touchend : up
			},
			close_module = elem.closest( data.module ),
			close_com = close_module.component,
			nearestConnect = data.swimlanes ? close_module.closest('lyte-connect').component.data : undefined;

			if( close_module == elem ){
				close_module = {
					offsetLeft : 0,
					offsetTop : 0,
					offsetWidth : elem.offsetWidth,
					offsetHeight : elem.offsetHeight
				};
			}

			var scroll = /*data.getScroll()*/ nearestConnect ? { left: nearestConnect.ltPropScrollLeft, top: nearestConnect.ltPropScrollTop } : { left: 0, top: 0 },
			group_off = get_group_off( close_module, __scale, data ),
			off_left = acc_off( close_module, __outer, calc_offset( close_module, 'left', __scale ), 'offsetLeft' ) + group_off.left + calc_offset( elem, 'left', __scale ) + scroll.left - scroll_deduct( elem, __outer, 'Left', 0 ),
			off_top = acc_off( close_module, __outer, calc_offset( close_module, 'top', __scale ), 'offsetTop' ) + group_off.top + calc_offset( elem, 'top', __scale ) + scroll.top - scroll_deduct( elem, __outer, 'Top', 0 ),
			initial_angle,
			__pos = close_com ? {} : {
				x : calc_offset( elem, 'left', __scale ) / close_module.offsetWidth,
				y : calc_offset( elem, 'top', __scale ) / close_module.offsetHeight
			},
			_height = off_top + elem.offsetHeight * 0.5;

			if( close_com ){
				if( !is_reselect ){
					close_com.update_from_evt( __pos, evt );
				}
			}

			if( close_com && is_reselect ){
				var src_position = $L( tempElement ).data( 'src_position' ),
				x_value = src_position.x || 1;

				near = off_left + scroll.left + elem.offsetWidth * x_value;
				_height = off_top + scroll.top + elem.offsetHeight * src_position.y;

				if( $L( elem ).hasClass( 'lyteConnectInnerItem' ) ){
					near += calc_offset( elem.parentNode, 'left', __scale );
					_height += calc_offset( elem.parentNode, 'top', __scale );
				}

				if( x_value >= 0.5 ){
					initial_angle = 0;
				} else {
					initial_angle = 180;
				}
			} else{
				var $elem = $L( elem ),
				is_anchor = $elem.hasClass( 'lyteConnectAnchorPoint' );

				if( Math.abs( near - bcr.left ) > Math.abs( near - bcr.right ) ){
					near = off_left + elem.offsetWidth;
					initial_angle = 0;
				} else {
					near = off_left;
					initial_angle = 180;
				}

				if( is_anchor ){
					var __x = __pos.x = Number( $elem.attr( 'left' ) ),
					__y = __pos.y = Number( $elem.attr( 'top' ) ),
					__parent = elem.parentNode,
					par_bcr = __parent.getBoundingClientRect(),
					is_not_left = __x != 0 && __x != 1;

					near = calc_offset( __parent, 'left', __scale ) + scroll.left + __x * (par_bcr.width / __scale);
					_height = calc_offset( __parent, 'top', __scale ) + scroll.top + __y * (par_bcr.height / __scale);

					if( $L( __parent ).hasClass( 'lyteConnectInnerItem' ) ){
						near += calc_offset( __parent.parentNode, 'left', __scale );
						_height += calc_offset( __parent.parentNode, 'top', __scale );
					}

					if( is_not_left ){
						if( __y == 0 ){
							initial_angle = 270;
						} else if( __y == 1 ){
							initial_angle = 90;
						}
					}
				}
			}
			
			if(!this.data().anchorClick){
				$L( document ).on( obj );
				this.addClass( 'lyteConnectionCreateMousedown' ).data( obj ).data({
					clientX : evt.clientX,
					clientY : evt.clientY,
					con_x : near,
					con_y : _height,
					element : elem,
					tempElement : connector,
					initial_angle : initial_angle,
					pos : __pos
				});
			}

			data.ignore_break = true;

			ori_evt.preventDefault();
		}

		function destroy(){
			var len = this.length;

			for( var i = 0; i < len; i++ ){
				var cur = this.eq( i ),
				data = cur.data( connection_data_str );

				if( data ){
					var elements = cur.find( '.' + srcElemClass ),
					_len = elements.length;

					for( var j = 0; j < _len; j++ ){
						delete_connection.call( this, elements.eq( j ) );
					}

					cur.removeData( connection_data_str );
				}
				cur.removeClass( lyteConnectionElement_str ).off( evt_str );
			}
		}

		function apply_connection( obj ){
			var len = this.length,
			fn1 = function(){
				return{
					left : 0,
					top : 0
				};
			},
			fn2 = function(){
				return 1;
			},
			fn3 = function(){
				return;
			};

			for( var i = 0; i < len; i++ ){
				var cur = this.eq( i );

				var new_obj = $L.extend( true, { 
					connection_type : "curve", 
					connector_radius : 5,
					connectShortest : true, 
					line_marker : void 0,
					readonly : false,
					offset : { 
						left : 2, 
						right : 2, 
						top : 2, 
						bottom : 2 
					},
					getScroll : fn1,
					getScale : fn2,
					getBoundary : fn3,
					curve_offset : 0,
					render_first : false,
					min_width : 100,
					min_height : 100,
					max_width : 1400,
					max_height : 1400
				}, obj );

				if( cur.data( connection_data_str ) ){
					destroy.call( cur );
				}

				if( !new_obj.wrapperElement ){
					var svg = document.createElementNS( http_string + "www.w3.org/2000/svg", 'svg' );
					svg.setAttribute( 'width', '100%' );
					svg.setAttribute( 'height', '100%' );

					new_obj.wrapperElement = svg;
					cur.get( 0 ).appendChild( svg );
				}

				cur.data( connection_data_str, new_obj ).addClass( lyteConnectionElement_str )

				if( obj.module ){
					cur.on( evt_str, mousedown.bind( cur ) );
				}
			}
		}

		function delete_connection( element, id ){
			var $elem = $L( element ),
			exst = $elem.data( connection_elements ) || {},
			data = this.data( connection_data_str ),
			callback = data.onConnectionDisconnect;

			if( $elem.hasClass( 'lyteConnectionContainer' ) ){
				return delete_connection.call( this, $elem.data( 'src' ), $elem.attr( 'id' ) );
			}

			for( var key in exst ){
				var act_key = key.replace( 'src_', '' ).replace( 'target_', '' );

				if( id && id != act_key ){
					continue;
				} 

				var cur = exst[ key ],
				dom = cur.connector,
				src_dom = dom.data( 'src' ),
				target_dom = dom.data( 'target' ),
				src = src_dom.data( connection_elements ),
				target = target_dom.data( connection_elements ),
				con_elem = dom.get( 0 ),
				fastdom = $L.fastdom,
				text_box = dom.data( 'text_box' ),
				ml = "mouseleave",
				evt_name = "mouseenter " + ml;

				if( data.connection_type == "elbow" && data.check_break && data.elbow_arc ){
					$L.elbow.arc && $L.elbow.arc( con_elem, data, true );
				}

				dom.children().trigger( ml ).off( evt_name );
				$L( text_box ).trigger( ml ).removeAttr( "connector-id" ).off( evt_name ).removeData( "connector" )

				delete src[ 'src_' + act_key ];
				delete target[ 'target_' + act_key ];

				if( !/src_/.test( Object.keys( src ).join( '' ) ) ){
					src_dom.removeClass( srcElemClass );
				}

				if( !/target_/.test( Object.keys( target ).join( '' ) ) ){
					target_dom.removeClass( targetElemClass );
				}

				[ 'src', 'target', 'active_src', 'active_target', 'text_box' ].forEach( function( item ){
					dom.removeData( item );
				});

				fastdom.clear( con_elem._measure_fdom );
				fastdom.clear( con_elem._mutate_fdom );

				con_elem.remove(); 

				if( callback ){
					callback.call( this, dom.data() );
				}

				dom.removeData();
			} 

			// var keys = Object.keys( exst ).join( '' );
			// if( !/src_/.test( keys ) ){
			// 	$elem.removeClass( srcElemClass );
			// }

			// if( !/target_/.test( keys ) ){
			// 	$elem.removeClass( targetElemClass );
			// }
		}

		function adjust_bcr( _module, elem, bcr, scroll, scroll_elem, form_module, __scale, data ){

			if( _module == elem){
				elem = {
					offsetLeft : 0,
					offsetTop : 0,
					offsetWidth : elem.offsetWidth,
					offsetHeight : elem.offsetHeight
				};
			}

			var group_off = get_group_off( _module, __scale, data ),
			__fn = function( ns, __elem ){
				if( !__elem || __elem == _module ){
					return 0;
				}
				return __fn( ns, __elem.offsetParent ) + __elem[ 'offset' + ns ];
			},
			obj = {
				width : elem.offsetWidth,
				height : elem.offsetHeight,
				left : calc_offset( _module, 'left', __scale ) + group_off.left + __fn( 'Left', elem ) + scroll.left - ( scroll_elem ? scroll_elem.scrollLeft : 0 ),
				top : calc_offset( _module, 'top', __scale ) + group_off.top + __fn( 'Top', elem ) + scroll.top - ( scroll_elem ? scroll_elem.scrollTop : 0 ),
				scroll : scroll
			};

			if( form_module ){
				$L.extend( true, obj, {
					_width : _module.offsetWidth,
					_height : _module.offsetHeight,
					_left : calc_offset( _module, 'left', __scale ) + group_off.left + scroll.left,
					_top : calc_offset( _module, 'top', __scale ) + group_off.top + scroll.top
				});
				// obj._right = obj._left + obj._width;
				// obj._bottom = obj._top + obj._height;
			}

			// obj.right = obj.left + obj.width;
			// obj.bottom = obj.top + obj.height;

			return obj;
		}

		function adjust_without_module( bcr, __elem ){
			var other_bcr = __elem.getBoundingClientRect(),
			__left = other_bcr.left,
			__top = other_bcr.top;

			return {
				x : bcr.x - __left,
				y : bcr.y - __top,
				width : bcr.width,
				height : bcr.height,
				left : bcr.left - __left,
				top : bcr.top - __top,
				right : bcr.right - __left,
				bottom : bcr.bottom - __top
			};
		}

		function adjust_position( obj, bcr, element, data, __elem, other_elem ){

			var scroll_query = data.scroll_parent,
			elem = scroll_query ? element.closest( scroll_query ) : void 0,
			__module = data.module,
			_module = element.closest( __module + ",lyte-textbox" ),
			x = obj.x,
			y = obj.y,
			avoid_module = data.avoid_with_module,
			nearestConnect = data.swimlanes ? _module.closest('lyte-connect').component.data : undefined,
			__scale = data.getScale(),
			ret_obj = {
				left_diff : 0,
				right_diff : 0,
				top_diff : 0,
				bottom_diff : 0
			},
			inner_cls = 'lyteConnectInnerItem',
			__a = $L( element ).hasClass( inner_cls ),
			__b = $L( other_elem ).hasClass( inner_cls );

			// if( __a && !__b ){
			// 	var par_elem = element.parentNode,
			// 	par_bcr = par_elem.getBoundingClientRect();

			// 	ret_obj.left_diff = bcr.left - par_bcr.left;
			// 	ret_obj.right_diff = par_bcr.right - bcr.right;
			// 	ret_obj.top_diff = bcr.top - par_bcr.top;
			// 	ret_obj.bottom_diff = par_bcr.bottom - bcr.bottom;
			// }

			if( elem ){
				var _bcr = elem.getBoundingClientRect(),
				top_hid = bcr.bottom < _bcr.top,
				bottom_hid = bcr.top > _bcr.bottom,
				query = top_hid ? data.default_top : data.default_bottom;
				
				if( top_hid || bottom_hid ){
					if( query ? ( elem = _module.querySelector( query ) ) : void 0 ){
						bcr = elem.getBoundingClientRect();
						element = elem;
					}
				}
			}

			if( !_module && $L( element ).hasClass( 'lyteConnectReconnectElement' ) ){
				_module = element;
			}

			bcr = _module && __module == "lyte-connect-item" ? adjust_bcr( _module, element, bcr, /*data.getScroll()*/ nearestConnect ? { left: nearestConnect.ltPropScrollLeft, top: nearestConnect.ltPropScrollTop } : { left: 0, top: 0 }, elem, avoid_module, __scale, data ) : adjust_without_module( bcr, __elem );

			var width = bcr.width,
			height = bcr.height,
			_left = bcr.left,
			_top = bcr.top,
			fn = function( name ){
				if( avoid_module ){
					var ret = bcr[ '_' + name ];
					if( ret != void 0 ){
						return ret;
					}
				}
				return bcr[ name ];
			};

			ret_obj.x = x * width + _left;
			ret_obj.y = y * height +_top;
			ret_obj.pos_x = x * width + ( avoid_module ? ( _left - fn( 'left' ) ) : 0 );
			ret_obj.pos_y = y * height + ( avoid_module ? ( _top - fn( 'top' ) ) : 0 );
			ret_obj.width = fn( "width" );
			ret_obj.height = fn( "height" );
			ret_obj.left = fn( "left" );
			ret_obj.top = fn( "top" );
			ret_obj.elem = element;

			return ret_obj;
		}

		function find_position( bcr1, bcr2, options, target_elem ){
			var fn = function( _bcr1, _bcr2, _left, _right, _x, obj ){
				var __value = obj[ _x ];
				if( __value != void 0 ){
					return __value;
				}

				var _left1 = _bcr1[ _left ],
				_right1 = _bcr1[ _right ],
				_left2 = _bcr2[ _left ],
				_right2 = _bcr2[ _right ];

				if( _left1 < _left2 || _left1 < _right2 ){
					return 1;
				} else {
					return 0;
				} 

			},
			src_position = options.src_position || {},
			target_position = options.target_position || {},
			src_x = fn( bcr1, bcr2, 'left', 'right', 'x', src_position ),
			src_y = fn( bcr1, bcr2, 'top', 'bottom', 'y', src_position ),
			target_x = fn( bcr2, bcr1, 'left', 'right', 'x', target_position ),
			target_y = fn( bcr2, bcr1, 'top', 'bottom', 'y', target_position );

			if( target_elem && /lyte-textbox/i.test( target_elem.tagName ) && !Object.keys( target_position ).length ){
				if( target_x ){
					if( target_y ){
						target_y = 0.5;
					} else {
						target_x = 0.5;	
					}
				} else {
					if( target_y ){
						target_x = 0.5
					} else {
						target_y = 0.5
					}
				}
			}

			return {
				src_position : {
					x : src_x,
					y : src_y
				},
				target_position : {
					x : target_x,
					y : target_y
				}
			};
		} 

		function get_elem_id( query ){
			var split = query.split( ',' ),
			ret;

			split.every( function( item ){
				ret = document.getElementById( item.replace( '#', '' ) );
				return !ret;
			});

			return ret;
		}

		function create( src, target, options ){
			options = options || {};

			var text_box = options.text_box;

			// $L.fastdom.measure( function(){
				var elem = this.get( 0 ),
				src_elem = options.is_src_id ? get_elem_id( src ) : $L( src, elem ).get( 0 ),
				target_elem = options.is_target_id ? get_elem_id( target ) : $L( target, elem ).get( 0 ),
				// bcr1 = src_elem.getBoundingClientRect(),
				// bcr2 = target_elem.getBoundingClientRect(),
				// ret = find_position( bcr1, bcr2, options ),
				// src_position = ret.src_position || {},
				// target_position = ret.target_position || {},
				data = this.data( connection_data_str ),
				// src_obj = adjust_position( src_position, bcr1, src_elem, data, elem ),
				// target_obj = adjust_position( target_position, bcr2, target_elem, data, elem ),
				connectShortest = data.connectShortest;
				
				// $L.fastdom.mutate( function(){
					var __id = options.id || ( options.id = ( 'connection_' + Date.now() + parseInt( Math.random() * 1e3 ) ) ),
					element = createElement.call( this, __id || '', containerClass + " " + ( options.class || '' ), data, options ),
					$elem = $L( element ),
					$src = $L( src_elem ),
					$target = $L( target_elem ),
					text_box_hover = tbox_hover.bind( this );

					data.wrapperElement.appendChild( element );

					$elem.data({
						src : $src.addClass( srcElemClass ),
						target : $target.addClass( targetElemClass ),
						src_position : options.src_position,
						target_position : options.target_position,
						//src_position : ( /*connectShortest ? options.src_position :*/ src_position ) || {},
						//target_position : ( /*connectShortest ? options.target_position :*/ target_position ) || {},
						options : options,
						src_query : src,
						target_query : target,
						// active_src : src_obj.elem,
						// active_target : target_obj.elem,
						arcs : {},
						vert_arcs : {},
						text_box : text_box
					});

					$L( text_box ).attr( "connector-id", __id ).data( 'connector', $elem ).on({
						mouseenter : text_box_hover,
						mouseleave : text_box_hover
					});

					// draw_curve( element, src_obj, target_obj, data );

					var data_fn = function( $_elem ){
						var __data = $_elem.data( connection_elements );
						if( !__data ){
							__data = {};
							$_elem.data( connection_elements, __data );	
						}

						return __data;
					},
					src_data = data_fn( $src ),
					target_data = data_fn( $target ),
					callback = data.onConnectionCreate,
					fastdom = $L.fastdom;

					src_data[ 'src_' + __id ] = { connector : $elem };
					target_data[ 'target_' + __id ] = { connector : $elem };
					// draw curve
					!elem.__ignore_update && update_individual_connector.call( this, $elem );

					if( callback ){
						fastdom.measure( function(){
							fastdom.mutate( function(){
								callback.call( this, element, src_elem, target_elem );
							}, this );
						}, this );
					}

			// 	}, this );
			// }, this );
		}

		function update( element ){
			var connection = get_connections( element );

			connection.src.concat( connection.target ).forEach( function( item ){
				update_individual_connector.call( this, item );
			}.bind( this ) );
		}

		function update_individual_connector( item ){
			if( item.hasClass( 'lyteConnectHiddenElem' ) ){
				return;
			}

			var item_elem = item.get( 0 ),
			fastdom = $L.fastdom;

			fastdom.clear( item_elem._measure_fdom );

			item_elem._measure_fdom = fastdom.measure( function(){
				delete item_elem._measure_fdom;
				var this_elem = this.get( 0 ),
				data = item.data(),
				src_elem = data.src.get( 0 ),
				bcr1 = src_elem.getBoundingClientRect(),
				target_elem = data.target.get( 0 ),
				bcr2 = target_elem.getBoundingClientRect(),
				ret = find_position( bcr1, bcr2, data.options, target_elem ),
				src_position = ret.src_position,
				target_position = ret.target_position,
				_data = this.data( connection_data_str ),
				src_obj = adjust_position( src_position, bcr1, src_elem, _data, this_elem, target_elem ),
				target_obj = adjust_position( target_position, bcr2, target_elem, _data, this_elem, src_elem );
				
				$L($L(item_elem).data('text_box')).removeClass('lyteConnectTextboxOverlap');
				
				data.active_src = src_obj.elem;
				data.active_target = target_obj.elem;

				data.src_position = src_position;
				data.target_position = target_position;

				fastdom.clear( item_elem._mutate_fdom );

				item_elem._mutate_fdom = fastdom.mutate( function(){
					delete item_elem._mutate_fdom;
					draw_curve( item_elem, src_obj, target_obj, _data, this );
				}, this );

			}, this );
		}

		/*
		 * Single element may have multiple parents. So cannot create previous parent in single dimentional array. it may go like binary tree. 
		 */

		function get_corres_item( __elem, type, deep_arr, deep_copy ){

			deep_arr = deep_arr || [];
			deep_copy = deep_copy || [];

			var arr = [],
			$node = $L( __elem, this ),
			__data = $node.data( connection_elements ) || {},
			dom_elem = $node.get( 0 ),
			towards = type.towards,
			__obj = {
				elem : dom_elem
			};

			__obj[towards] = arr;

			deep_arr.push( dom_elem );
			deep_copy.push( __obj );

			for( var key in __data ){
				if( towards == "parent" ? /^target/i.test( key ) : /^src/i.test( key ) ){
					var __value = __data[ key ],
					__connection = __value.connector,
					corres_node = __connection.data( type.find ),
					corres_dom = corres_node.get( 0 ),
					index = deep_arr.indexOf( corres_dom ),
					sub_obj = {
						connector : __connection.get( 0 )
					},
					ret,
					recursive = false;

					sub_obj[towards] = corres_dom;

					if( index + 1 ){
						ret = deep_copy[ index ];
						recursive = true;
					} else {
					    ret = get_corres_item.call( this, corres_node, type, deep_arr, deep_copy );
					}

					if( ret[towards].length ){
						towards == "parent" ? sub_obj.previous_parent = ret : sub_obj.next_child = ret;
					}

					sub_obj.recursive = recursive;
					arr.push( sub_obj );
				}
			}

			return __obj;
		}

		function getAll(){
			return Array.from( this.find( '.lyteConnectionContainer' ) ).map( function( item ){
				return {
					connector : item,
					src : getSrc( item ).get( 0 ),
					target : getSrc( item, 'target' ).get( 0 )
				};
			});
		}

		function get_connections( element ){
			var data = $L( element ).data( connection_elements ) || {},
			src = [],
			target = [];

			for( var key in data ){
				( /src_/.test( key ) ? src : target ).push( data[ key ].connector );
			}

			return {
				src : src,
				target : target
			};
		}

		function is_connected( src, target ){
			var data = $L( src ).data( connection_elements ) || {};

			target = $L( target ).get( 0 );

			for( var key in data ){
				if( /src_/.test( key ) ){
					var value = data[ key ].connector,
					_target = value.data( 'target' ).get( 0 );

					if( _target == target ){
						return true;
					}
				}
			}
			return false;
		}

		function getSrc( elem, type ){
			return $L( elem ).data( type || 'src' );
		}

		function updateConnectionElement(elem, connectionElem) {
			var getElem = function (param) {
					if (param) {
						if (typeof param == 'string') {
							return $L('#' + (param.replace('#', '')), this.get(0)).get(0)
						} else if (param instanceof $L) {
							return param.get(0)
						} else {
							return param
						}
					}
				}.bind(this),
				srcElem = getElem(elem.src),
				trgElem = getElem(elem.target),
				connElem = getElem(connectionElem),
				$conn = $L(connElem),
				conData = $conn.data(),
				retObj = {},
				updated = false,
				fn = function (elem) {
					return (elem ? elem.tagName.toLowerCase() : "").replace(/\-(.)/g, function () {
						return arguments[1].toUpperCase();
					});
				},
				data_fn = function ($_elem) {
					var __data = $_elem.data(connection_elements);
					if (!__data) {
						__data = {};
						$_elem.data(connection_elements, __data);
					}

					return __data;
				},
				setVal = function (elem, elemType, _class, itemClass) {
					if (elem && connElem) {
						var prevElem = conData[elemType];
						conData['active_' + elemType] = elem;
						conData[elemType + '_query'] = "#" + elem.id;
						conData[elemType] = $L(elem).addClass(_class);
						conData[elemType + '_class'] = itemClass + fn(elem);
						delete data_fn(prevElem)[elemType + '_' + connElem.id];
						data_fn($L(elem))[elemType + '_' + connElem.id] = { connector: $conn };
						get_connections('#' + prevElem.get(0).id)[elemType].length || prevElem.removeClass(_class);
						retObj[elemType] = {old : prevElem[0], new : elem};
						updated = true;
					}
				};

			setVal(srcElem, 'src', 'lyteConnectionSrcElement', 'lyteConnectSrc_');
			setVal(trgElem, 'target', 'lyteConnectionTargetElement', 'lyteConnectTarget_');

			if(updated){
				update_individual_connector.call(this, $conn);
				retObj.connector = connElem;
				retObj.data = conData;
				return retObj;
			}

		}

		lytedom.prototype.connection = function( arg1, arg2, arg3, arg4 ){
			if( !this.length ){
				return this;
			}
			switch( arg1 ){
				case 'update' : {
					update.call( this, arg2 );
				}
				break;
				case 'updateConnection' : {
					update_individual_connector.call( this, arg2 );
				}
				break;
				case 'delete' : {
					delete_connection.call( this, arg2, arg3 );
				}
				break;
				case 'destroy' : {
					destroy.call( this );
				}
				break;
				case 'create' : {
					create.call( this, arg2, arg3, arg4 );
				}	
				break;
				case 'getConnections' : {
					return get_connections( arg2 );
				}
				break;
				case 'hasConnected' : {
					return is_connected( arg2, arg3 );
				}
				break;
				case 'getSrc' : {
					return getSrc( arg2 );
				}
				break;
				case 'getTarget' : {
					return getSrc( arg2, 'target' );
				}
				break;
				case 'getAll' : {
					return getAll.call( this );
				}
				break;
				case 'getPrevious' : {
					return get_corres_item.call(this, arg2, {towards : "parent", find : "src" });
				}
				break;
				case 'getNext' : {
					return get_corres_item.call(this, arg2, {towards : "child", find : "target"})
				}	
				break;
				case 'updateConnectionElement' : {
					return updateConnectionElement.call(this, arg2, arg3);
				}
				break;
				default : {
					apply_connection.call( this, arg1 );
				}
			}
			return this;
		}
	}
})();
;(function(){
	if( typeof $L != "undefined" ){

		/*
			Shape is considered as a rectangle and each face is considered as a quater part of 360 for convenient purpose
			* right face = 0 deg ( +ve )
			* left face = 180 deg ( -ve )
			* top face = 270 deg ( -ve )
			* bottom face = 90 deg ( +ve )
		*/

		function find_angle( _module ){
			var initial_angle = _module.initial_angle;

			if( initial_angle != void 0 ){
				return initial_angle;
			}

			if( _module.elem == void 0 ){
				return "_";
			}

			var width = _module.width,
			height = _module.height,
			pos_x = _module.pos_x,
			pos_y = _module.pos_y,
			fn = function( _x1, _x2, value, ignore ){
				if( _x1 == value ){
					return "1";
				} else if( _x2 == value ){
					return "2";
				} 

				if( ignore ){
					var mid = ( _x1 + _x2 ) * 0.5;

					if( value < mid ){
						return "1";
					}
					return "2";
				}

				return "0";
			},
			x_face = fn( 0, width, pos_x ),
			y_face = fn( 0, height, pos_y ),
			angle;

			if( x_face == "0" && y_face == "0" ){
				x_face = fn( 0, width, pos_x, true );
				y_face = fn( 0, height, pos_y, true );
			}

			switch( x_face ){
				case "1" : {
					angle = 180;
					if( y_face == '2' ){
						angle = 90;
					}
				}
				break;
				case "2" : {
					angle = 0;
					if( y_face == '1' ){
						angle = 270;
					}
				}
				break;
				case "0" : {
					switch( y_face ){
						case "1" : {
							angle = 270;
						}
						break;
						case "2" : {
							angle = 90;
						}
					}
				}
			}
			return angle;
		}

		/*
			Based on the start and end points type of elbow connection will be choosen.
			* angle diff 0, 180 => odd number elbows( three or five way )
			* angle diff 90, 270 => even number elbows( two or four way )
		*/

		function find_elbow_type( start_angle, end_angle, start, end ){
			if( end.elem == void 0 ){
				return "3";
			}

			var diff = Math.abs( start_angle - end_angle ),
			co = 0,
			__left1 = start.left,
			__right1 = __left1 + start.width,
			__left2 = end.left,
			__right2 = __left2 + end.width,
			__top1 = start.top,
			__bottom1 = __top1 + start.height,
			__top2 = end.top,
			__bottom2 = __top2 + end.height,
			start_x = start.x,
			end_x = end.x,
			start_y = start.y,
			end_y = end.y;

			if( /^(0|180)$/.test( diff ) ){
				switch( start_angle ){
					case 0 : {
						if( diff == 180 ){
							if( start_x + co < end_x ){
								return "3";
							}
						} else{
							if( start_y - co > __bottom2 || start_y + co < __top2 ){
								return "3";
							}
						}
						return "5";
					}
					break;
					case 90 : {
						if( diff == 180 ){
							if( start_y + co < end_y ){
								return "3";
							}
						} else {
							if( start_x - co > __right2 || start_x + co < __left2 ){
								return "3";
							}
						}
						return "5";
					}
					break;
					case 180 : {
						if( diff == 180 ){
							if( start_x - co > end_x ){
								return "3";
							}
						} else {
							if( start_y - co > __bottom2 || start_y + co < __top2 ){
								return "3";
							}
						}
						return "5";
					}	
					break;
					case 270 : {
						if( diff == 180 ){
							if( start_y - co > end_y ){
								return "3";
							}
						} else {
							if( start_x - co > __right2 || start_x + co < __left2 ){
								return "3";
							}
						}
						return "5";
					}
					break;
				}
			} else {
				switch( start_angle ){
					case 0 : {
						if( diff == 90 ){
							if( start_x < end_x && start_y > end_y ){
								return "2";
							}
						} else {
							if( start_x < end_x && start_y < end_y ){
								return "2";
							}
						}
						return "4";
					}
					break;
					case 180 : {
						if( diff == 90 && end_angle == 90 ){
							if( start_x > end_x && start_y > end_y ){
								return "2";
							}
						} else {
							if( start_x > end_x && start_y < end_y ){
								return "2";
							}
						}
						return "4";
					}
					break;
					case 90 : {
						if( diff == 90 && !end_angle ){
							if( start_y < end_y && start_x > end_x ){
								return "2";
							}
						} else {
							if( start_y < end_y && start_x < end_x ){
								return "2";
							}
						}
						return "4";
					}
					break;
					case 270 : {
						if( diff == 90 ){
							if( start_y > end_y && start_x > end_x ){
								return "2";
							}
						} else {
							if( start_y > end_y && start_x < end_x ){
								return "2";
							}
						}
						return "4";
					}
					break;
				}
			}
		}

		/* calls corresponding function */

		function find_common_modifier( start_angle, end_angle, start, end, type, ck ){
			var obj = {
				"2" : two_way_modifier,
				"3" : three_way_modifier,
				"4" : four_way_modifier,
				"5" : five_way_modifier
			};

			return obj[ type ]( start, end, ck, start_angle, end_angle );
		}

		/*
			returns path co-ordinate for a two way elbow connector
		*/

		function two_way_modifier( start, end, ck, start_angle ){
			var is_hori = /^(0|180)$/.test( start_angle );

			return [
				{
					x : start.x,
					y : start.y,
					name : "M"
				},
				{
					x : is_hori ? end.x : start.x,
					y : is_hori ? start.y : end.y
				},
				{
					x : end.x,
					y : end.y
				}
			]
		}

		/*
			returns path co-ordinate for a three way elbow connector
		*/

		function three_way_modifier( start, end, ck, start_angle, end_angle, _mid ){
			var is_hori = /^(0|180)$/.test( start_angle ),
			start = { x : start.x, y : start.y, name : "M" },
			end = { x : end.x, y : end.y },
			points = [ start ],
			x = is_hori ? 'x' : "y",
			y = is_hori ? "y" : "x",
			obj1 = {},
			obj2 = {};

			if( start_angle == end_angle ){
				var is_neg = /^(0|90)$/.test( start_angle ), 
				mid = _mid != void 0 ? _mid : Math[ is_neg ? 'max' : 'min' ]( start[ x ], end[ x ] ) + ck * ( is_neg ? 1 : -1 );

				obj2[ x ] = obj1[ x ] = mid;
				obj1[ y ] = start[ y ];
				obj2[ y ] = end[ y ];

			} else{
				var mid = ( start[ x ] + end[ x ] ) * 0.5;

				obj2[ x ] = obj1[ x ] = mid;
				obj1[ y ] = start[ y ];
				obj2[ y ] = end[ y ];
			}

			points.push( obj1, obj2, end );

			return points;
		}

		/*
			returns path co-ordinate for a four way elbow connector
		*/

		function four_way_modifier( start, end, ck, start_angle, end_angle ){
			var is_hori = /^(0|180)$/.test( start_angle ),
			_start = { x : start.x, y : start.y, name : "M" },
			_end = { x : end.x, y : end.y },
			points = [ _start ],
			x = is_hori ? 'x' : "y",
			y = is_hori ? "y" : "x",
			obj1 = {},
			obj2 = {},
			obj3 = {},
			is_neg = /^(0|90)$/.test( start_angle ),
			ie_end_neg = /^(0|90)$/.test( end_angle );

			obj1[ y ] = start[ y ];
			obj3[ x ] = end[ x ];

			obj1[ x ] = obj2[ x ] = _start[ x ] + ( is_neg ? 1 : -1 ) * ck;

			obj3[ y ] = obj2[ y ] = _end[ y ] + ( ie_end_neg ? 1 : -1 ) * ck;

			points.push( obj1, obj2, obj3, _end );

			return points;
		}

		/*
			returns path co-ordinate for a five way elbow connector
		*/

		function five_way_modifier( start, end, ck, start_angle, end_angle ){
			var is_hori = /^(0|180)$/.test( start_angle ),
			_start = { x : start.x, y : start.y, name : "M" },
			_end = { x : end.x, y : end.y },
			points = [ _start ],
			x = is_hori ? 'x' : "y",
			y = is_hori ? "y" : "x",
			_top = is_hori ? 'top' : "left",
			height = is_hori ? 'height' : "width",
			obj1 = {},
			obj2 = {},
			obj3 = {},
			obj4 = {},
			height_diff = get_diff( height, y, _top, start, end, start_angle == end_angle ),
			is_neg = /^(0|90)$/.test( start_angle ),
			end_is_neg = /^(0|90)$/.test( end_angle ),
			new_y;

			obj1[ y ] = start[ y ];
			obj2[ x ] = obj1[ x ] = _start[ x ] + ( is_neg ? 1 : -1 ) * ck;
			obj4[ y ] = end[ y ];
			obj3[ x ] = obj4[ x ] = _end[ x ] + ( end_is_neg ? 1 : -1 ) * ck;

			if( height_diff ){
				new_y = height_diff;
			} else{

				var avg = ( start[ y ] + end[ y ] ) * 0.5,
				min_top = Math.min( start[ _top ], end[ _top ] ),
				max_bottom = Math.max( start[ _top ] + start[ height ], end[ _top ] + end[ height ] );

				if( avg - min_top < max_bottom - avg ){
					new_y = min_top - ck;
				} else{
					new_y = max_bottom + ck;
				}
			}

			obj2[ y ] = obj3[ y ] = new_y;

			points.push( obj1, obj2, obj3, obj4, _end );

			return points;
		}

		/*
			returns difference between two shapes
		*/

		function get_diff( height, y, _top, start, end, is_same_angle ){
			var start_y = start[ _top ],
			end_y = end[ _top ],
			start_bottom = start_y + start[ height ],
			end_bottom = end_y + end[ height ],
			value,
			final_pos,
			start_value = start[ y ];

			if( is_same_angle ){
				if( start_value < end_y || start_value > end_bottom ){
					return true;
				}
				return 0;
			} else{
				if( start_y < end_y ){
					value =  end_y - start_bottom;
					final_pos = start_bottom + value * 0.5;
				} else{
					value = start_y - end_bottom;
					final_pos = start_y - value * 0.5;
				}
			}

			if( value < 0 ){
				return 0;
			}

			return final_pos;
		}

		/*
			This function adds corner radius to each way of a elbow connectors
		*/

		function add_radius( modifier, radius ){

			if( !radius ){
				return modifier;
			}

			var len = modifier.length - 1,
			radius_arr = [],
			fn = function( first, second, x, _radius ){
				var is_increase = second[ x ] > first[ x ];

				if( is_increase ){
					second[ x ] -= _radius;
				} else{
					second[ x ] += _radius;
				}
			};

			for( var i = 1; i < len; i++ ){
				var cur = modifier[ i ],
				next = modifier[ i + 1 ],
				prev = modifier[ i - 1 ],
				is_hori = cur.y == prev.y,
				x = is_hori ? 'x' : "y",
				y = is_hori ? 'y' : 'x',
				exp_radius = Math.min( radius, Math.abs( cur[ x ] - prev[ x ] /* + ( prev.radius || 0 ) * ( prev.neg == '1' ? -1 : 1 )*/ ) /*/ 2*/, Math.abs( cur[ y ] - next[ y ] ) / 2 ) || prev.radius || 0,
				new_first = $L.extend( {}, cur ),
				new_second = $L.extend( {}, cur );

				new_second.radius = exp_radius;
				new_second.name = "A";

				fn( prev, new_first, x, exp_radius );
				fn( next, new_second, y, exp_radius );

				new_second.neg = find_arc_neg( prev, cur, next, x, y );

				modifier.splice( i++, 1, new_first, new_second );
				len++;
			}

			return modifier;
		}

		/*
			Finds arc direction => clockwise or anticlockwise
		*/

		function find_arc_neg( prev, cur, next, x, y ){
			var inc1 = cur[ x ] > prev[ x ],
			inc2 = next[ y ] > cur[ y ];

			if( x == 'x' ){
				if( inc1 == inc2 ){
					return "1";
				} 
				return "0";
			} else {
				if( inc1 == inc2 ){
					return "0";
				}
				return "1";
			}
		}

		function setOffset(cur, next, offset) {
			if (cur.x == next.x) {
				cur.y += (Math.min(offset, Math.abs(cur.y - next.y) - 1) * (cur.y > next.y ? -1 : 1));
			} else {
				cur.x += (Math.min(offset, Math.abs(cur.x - next.x) - 1) * (cur.x > next.x ? -1 : 1));
			}
		}

		/*
			Creates svg line from elbow line points
		*/

		function draw_line( modifier, radius, ref_x, ref_y, ignore, data ){
			var str = "",
				lineOffset = data && data.lineOffset;

			if( !ignore ){
				modifier = add_radius( modifier, radius );
			}

			if (lineOffset) {//not handled for avoidance
				var modLen = modifier.length - 1;
				lineOffset.start && setOffset(modifier[0], modifier[1], lineOffset.start);
				lineOffset.end && setOffset(modifier[modLen], modifier[modLen - 1], lineOffset.end);
			}

			modifier.forEach( function( item ){
				var pre = item.name || "L";

				if( pre == "A" ){
					str += ( "A " + item.radius + ' ' + item.radius + ' 0 0 ' + item.neg + ' ' + ( item.x - ref_x ) + " " + ( item.y - ref_y ) + ' ' );
				} else {
					str += ( pre + " " + ( item.x - ref_x ) + " " + ( item.y - ref_y ) + " " );
				}
			});	

			return str;
		}

		/*
			Position of start / end point in available range ==> for finding break path
		*/

		function find_exact_range( ranges, value, angle, ignore_buff ){
			var x = value.x,
			y = value.y,
			ret,
			buff = ignore_buff ? 0 : ( _lyteUiUtils.getScrollBarWidth() + 5 ),
			is_hori = /^(0|180)$/.test( angle ),
			hori_buff = is_hori ? buff : 0,
			vert_buff = is_hori ? 0 : buff;

			switch( angle ){
				case 0 : {
					x += value.right_diff;
				}
				break;
				case 180 : {
				   x -= value.left_diff;
				}
				break;
				case 270 : {
					y -= value.top_diff;
				}
				break;
				case 90 : {
					y += value.bottom_diff;
				}
				break;
			}

			ranges.every( function( item ){
				var _left =  item.left - hori_buff,
				_right = item.right + hori_buff,
				_top = item.top - vert_buff,
				_bottom = item.bottom + vert_buff;

				if ((_left <= x || Math.abs(_left - x) < 0.01) && (x <= _right || Math.abs(_right - x) < 0.01) && (_top <= y || Math.abs(_top - y) < 0.01) && (y <= _bottom || Math.abs(_bottom - y) < 0.01)) {
					ret = item;
					return false;
				}

				return true;
			});

			return ret;
		}

		/*
			We can't find perfect accurate path with minimum ways due to long script running. 
			So unwanted paths are removed in each stage
		*/

		function eliminate_paths( paths, _start, _end, _prev ){
			var len = [],
			limit = 3;

			if( paths.length < limit ){
				return paths;
			}

			paths.forEach( function( item ){

				var _length = item.length - 1,
				sum = 0,
				prev,
				ref_y = ( _start.y + _end.y ) / 2,
				fn = function( value, __item ){
					if( !shares_common( __item, { top : value.y - 1, bottom : value.y + 1 } ) ){
						var val1 = Math.abs( __item.top - value.y ),
						val2 = Math.abs( __item.bottom - value.y );

						if( val1 == val2 && val1 == Infinity ){
							return;
						}

						ref_y = val1 > val2 ? __item.bottom : __item.top;

						sum += Math.min( val1, val2 );
					}
				}

				for( var i = _length; i >= 0; i-- ){
					var cur = item[ i ],
					_width = cur.width;

					if( _width == Infinity ){
						_width = 40;
					}

					sum += _width;

					if( prev ){
						if( i == _length - 1 ){
							fn( _end, cur );
						} else if( i == 0 && !_prev.length ){
							fn( _start, prev );
						} else{
							fn( { y : ref_y }, cur );
						}
					} 
					prev = cur;
				}

				len.push( sum );
			});

			var min = Math.min.apply( Math, len ),
			_length = len.length;

			paths = paths.slice().sort( function( a, b ){
				return len[ paths.indexOf( a ) ] - len[ paths.indexOf( b ) ];
			});

			len.sort( function( a, b ){
				return a - b;
			});

			for( var i = _length - 1; i >= 0 ; i-- ){
				var cur = len[ i ];
				if( cur != min ){
					paths.splice( i, 1 );
					
					len.splice( i, 1 )
					_length--;

					if( _length < limit ){
						break;
					}
				}
			}

			return paths;
		}

		/*
			It will return array of possible paths between start and end ranges
		*/

		function find_range_paths( start_range, end_range, _start, _end, prev, ck, from ){
			if( start_range == end_range ){
				return [ [ start_range ] ];
			}

			var left_possible_paths = [],
			right_possible_paths = [],
			index = function( item ){
				return prev.indexOf( item ) == -1;
			},
			is_left_failed = from == "left",
			is_right_failed = from == "right",
			__left = start_range._left,
			__right = start_range._right,
			__flush = function( ret, __arr, __cur ){
				ret.forEach( function( _item ){
					var new_arr = _item.slice();
					new_arr.unshift( __cur || start_range );
					__arr.push( new_arr );
				});
			},
			__merger = function( arr, possible ){

				for (var i = 0; i < arr.length; i++) {
					var item = arr[i],
                    __status = item._is_right_failed;
					if( __status != void 0 && prev.indexOf( item ) != prev.length - 2 ){
						var __poss = item._possible_paths || ( item._possible_paths = [] ),
						changed,
						__new_possible = [];

						for (var j = 0; j < possible.length; j++) {
                            var ind_pos = possible[j];
							if( ind_pos.indexOf( item ) == -1 ){
								changed = true;
								var __arr = ind_pos.slice();
								__arr.unshift( item );
								__poss.push( __arr );
								__new_possible.push( __arr );
							}
                        }

						if( changed ){
							item._is_right_failed = false;
							__merger( item._left, __new_possible );
						}
					}
                }
			};

			if( !start_range._is_left_failed ){
				for (var i = 0; i < __left.length; i++) {
                    var item = __left[i];
					if( index( item ) ){
						var possible_left = prev.slice();
						possible_left.push( item );
						
						var item_possible = item._possible_paths,
						ret = item_possible || find_range_paths( item, end_range, _start, _end, possible_left, ck, "left" );

						if( ( ret || [] ).length ){	
							is_left_failed = false;					
							__flush( ret, left_possible_paths );
						}
					}
                }
				start_range._is_left_failed = is_left_failed;
			}

			if( !start_range._is_right_failed ){
				for (var i = 0; i < __right.length; i++) {
                    var item = __right[i];
					if( index( item ) ){
						var possible_right = prev.slice();
						possible_right.push( item );
						
						var item_possible = item._possible_paths,
						ret = item_possible || find_range_paths( item, end_range, _start, _end, possible_right, ck, "right" );

						if( ( ret || [] ).length ){	
							is_right_failed = false;						
							__flush( ret, right_possible_paths );
						}
					}
                }
				start_range._is_right_failed = is_right_failed;
			}

			if( __left.length && right_possible_paths.length ){
				__merger( __left, right_possible_paths );
			}

			left_possible_paths.push.apply( left_possible_paths, right_possible_paths );

			var final = eliminate_paths( left_possible_paths, _start, _end, prev, ck );

			if( final.length == 0 && !index( start_range ) ){
				final = void 0;
			}

			if( is_left_failed && is_right_failed ){
				final = [];
			}

			return start_range._possible_paths = final;
		}

		/* 
			Returns common vertical positions between two points / ranges
		*/

		function common_pt( pt1, pt2 ){
			return {
				top : Math.max( pt1.top, pt2.top ),
				bottom : Math.min( pt1.bottom, pt2.bottom )
			};
		}

		/*
			To check if two points shares common area
		*/

		function shares_common( pt1, pt2 ){
			return !( pt1.top > pt2.bottom || pt1.bottom < pt2.top );
		}

		/*
			It will change range dimension for obtaining straight lines( avoiding multiple ways )
		*/

		function alter_path( path, start_angle, end_angle, start, end, ck ){
			var len = path.length - 1,
			is_start_hori = /^(0|180)$/.test( start_angle ),
			is_end_hori = /^(0|180)$/.test( end_angle ),
			arr = [],
			flush = function(){
				var __len = arr.length - 1,
				prev,
				count = 0,
				sub_flush = function( i ){
					for( var j = count; j <= i; j++ ){
						var elem = arr[ j ].cur,
						__width = elem.width,
						elem_copy = {
							left : elem.left,
							right : elem.right,
							top : prev.top,
							bottom : prev.bottom,
							width : __width,
							height : prev.bottom - prev.top
						};	

						path.splice( j, 1, elem_copy );
					}

					count = j;
					prev = void 0;
				};

				for( var i = 0; i < __len; i++ ){
					var __cur = arr[ i ],
					__next = arr[ i + 1 ],
					cur_common = prev || __cur.common,
					next_common = __next.common;

					if( shares_common( cur_common, next_common ) ){
						var __common = common_pt( cur_common, __next.common );
						prev = __common;
					} else {
						prev = prev || cur_common;
						sub_flush( i );
						prev = next_common;
					}
				}

				prev && sub_flush( i );

				if( prev == void 0 && !i && arr.length ){
					prev = arr[ 0 ].common;
					sub_flush( 0 );
				}

				arr = [];
			};

			if( path.length == 2 ){
				var __first = path[ 0 ],
				__second = path[ 1 ],
				two_way_fn = function( __bottom, __top, __y, __height, __angle ){
					var first_bottom = __first[ __bottom ],
					first_top = __first[ __top ],
					second_bottom = __second[ __bottom ],
					second_top = __second[ __top ],
					end_value = end[ __y ];

					if( !( first_top > end_value || end_value > first_bottom ) ){
						if( start_angle == __angle ){
							var hgt = 2 * ( end_value - first_top );
							__first[ __height ] = hgt;
							__first[ __bottom ] = first_top + hgt;
						} else {
							var hgt = 2 * ( first_bottom - end_value );
							__first[ __height ] = hgt;
							__first[ __top ] = first_bottom - hgt;
						}
					}
				};

				if( is_end_hori && !is_start_hori ){
					two_way_fn( 'bottom', 'top', 'y', 'height', 90 );
				} else if( is_start_hori && !is_end_hori ){
					two_way_fn( 'right', 'left', 'y', 'width', 0 );
				}
			}


			for( var i = 0; i < len; i++ ){
				var cur = path[ i ],
				next = path[ i + 1 ];

				if( is_end_hori && ( i + 1 ) == len ){
					var end_y = end.y,
					upper_hgt = end_y - next.top,
					lower_hgt = next.bottom - end_y,
					new_hgt = Math.min( 2 * ck, upper_hgt + ck, lower_hgt + ck );

					next = $L.extend( {}, next );

					next.top = Math.max(end_y - new_hgt, next.top);
					next.bottom = Math.min(end_y + new_hgt, next.bottom);
				}

				if( shares_common( cur, next ) ){
					var common = common_pt( cur, next );
					arr.push({
						common : common,
						cur : cur
					});
				} else {
					flush();
				}
			}

			flush();
		}

		/*
			It will convert range paths to line points
		*/

		function convert_path_to_line( path, start, end, start_angle, end_angle, ck, type ){

			alter_path( path, start_angle, end_angle, start, end, ck );

			var len = path.length,
			start_pt = { x : start.x, y : start.y, name : "M" },
			end_pt = { x : end.x, y : end.y },
			paths = [],
			ref = start_pt,
			ref_angle = start_angle,
			angle_diff = Math.abs( start_angle - end_angle ),
			inf = Infinity,
			fn = function( pt ){
				return pt.top == -inf && pt.bottom == inf;
			},
			get_mid = function( cur, __value ){
				var cur_mid;
				if( cur.top == -inf ){
					cur_mid = cur.bottom - ( __value || __ck );
				} else if( cur.bottom == inf ){
					cur_mid = cur.top + ( __value || __ck );
				} else {
					cur_mid = ( cur.top + cur.bottom ) / 2;
				}
				return cur_mid;
			};

			if( len == 1 ){
				return find_common_modifier( start_angle, end_angle, start, end, type, ck );
			} else if( len == 2 ){
				if( angle_diff == 0 ){
					return find_common_modifier( start_angle, end_angle, start, end, type, ck );
				}
			}

			for( var i = 0; i < len; i++ ){
				var end_angle,
				next = path[ i + 1 ],
				cur = path[ i ],
				next_after = path[ i + 2 ],
				_end_angle,
				new_pt = {},
				_points,
				new_pt,
				__ck = Math.min( ck, cur.width / 2 );

				if( next ){
					var is_right = cur.right == next.left,
					is_shares_common = shares_common( cur, { top : ref.y - 1, bottom : ref.y + 1 } );

					if( !/(90|270)/.test( ref_angle ) && is_shares_common ){
						new_pt.y = ref.y;
					} else {

						var is_next_inf = fn( next ),
						next_top = next.top,
						next_bottom = next.bottom;

						if( is_next_inf || !shares_common( cur, next ) ){
							new_pt.y = get_mid( cur, ck );
						} else {
							var common = common_pt( cur, next );
							new_pt.y = get_mid( common, ck );
						}
					}
					if( !next_after && /^(0|180)$/.test( end_angle ) && Math.abs( start_angle - end_angle ) == 180 && !shares_common( next, { top : ref.y - 1, bottom : ref.y + 1 } ) ){
						new_pt.y = end.y;
					}
					 	
					new_pt.x = is_right ? cur.right : cur.left;
					_end_angle = is_right ? 180 : 0;
				} else{
					new_pt = end_pt;
					_end_angle = end_angle;
				}

				angle_diff = Math.abs( ref_angle - _end_angle );

				if( /^(0|180)$/.test( angle_diff ) ){
					_points = three_way_modifier( ref, new_pt, ck, ref_angle, _end_angle, ref.x + ( /^(0|90)$/.test( ref_angle ) ? __ck : -__ck ) );
				} else{
					_points = two_way_modifier( ref, new_pt, __ck, ref_angle );
				}

				if( i != 0 ){
					delete _points[ 0 ].name;
				}

				paths.push.apply( paths, _points );

				ref = new_pt;
				ref_angle = is_right ? 0 : 180;				
			}

			return remove_duplicate( paths );
		}

		/* 
			It will reduce path string length
		 */

		function remove_duplicate( paths ){
			var len = paths.length - 2,
			__length = 0;

			for( var i = 0; i < len; i++ ){
				var cur = paths[ i ],
				next = paths[ i + 1 ],
				next_after = paths[ i + 2 ],
				is_hori = cur.y == next.y,
				is_hori_next = next.y == next_after.y,
				x = is_hori ? "x" : "y";

				if( is_hori == is_hori_next ){
					next[ x ] = next_after[ x ];
					len--;
					paths.splice( i-- + 2, 1 );
				} else{
					__length += Math.abs( cur[ x ] - next[ x ] );
				}
			}

			var $arr = $L( paths ),
			last = $arr.get( -1 ),
			last_before = $arr.get( -2 );

			__length += Math.abs( last.x - last_before.x + last.y - last_before.y );

			paths.__length = __length;

			return paths;
		}

		/*
			It will return best path points from possible paths
		*/

		function break_line( start_angle, end_angle, start, end, type, ck, ranges ){

			var fn = function(){
				return find_common_modifier( start_angle, end_angle, start, end, type, ck );
			};

			if( ranges.length == 1 ){
				return fn();
			}

			var start_range = find_exact_range( ranges, start, start_angle, true ),
			end_range = find_exact_range( ranges, end, end_angle, true );

			if( !start_range || !end_range ){
				console.warn( "ranges not present start_range - " + start_range + " end_range - " + end_range );
				return fn();
			}

			var  paths = find_range_paths( start_range, end_range, start, end, [ start_range ], ck );

			if( ( paths || [] ).length ){
				var arr = [],
				min_len = Infinity,
				best_len = Infinity,
				bestArr = [];

				paths.forEach( function( item ){
					var oldItem = $L.extend([],item),
					converted = convert_path_to_line( item, start, end, start_angle, end_angle, ck, type );
					
					arr.push( converted );
					min_len = Math.min( converted.length, min_len );

					best_len = Math.min( getBetterPath(oldItem, converted, ck, bestArr ), best_len );
					
				});

				if (bestArr.length) {
					// if (bestArr.length > 1) {
					// 	var ind = 0, maxVal = 0, maxInd, validBool, notValid = [],
					// 		checkVal = function (first, sec) {
					// 			if ((first >= ck / 2) && (sec >= ck / 2)) {
					// 				validBool = true;
					// 			} else {
					// 				var val = first + sec;
					// 				notValid.push({ ind: ind, val: val });
					// 				if (val > maxVal) {
					// 					maxVal = val;
					// 					maxInd = ind;
					// 				}
					// 			}
					// 		}
					// 	while (ind < bestArr.length) {
					// 		var item = bestArr[ind],
					// 			length = 0,
					// 			curLen = undefined,
					// 			firstLen = undefined;
					// 		for (var j = 0; j < item.length - 1; j++) {
					// 			var cur = item[j],
					// 				next = item[j + 1],
					// 				dir = cur.x == next.x ? 'y' : 'x';
					// 			curLen = Math.abs(cur[dir] - next[dir]);
					// 			!firstLen && (firstLen = curLen);
					// 			length += curLen;
					// 		}
					// 		checkVal(firstLen, curLen);
					// 		bestArr[ind].__length = length;
					// 		ind++;
					// 	}

					// 	if (maxInd != void 0) {
					// 		for (var i = 0; i < notValid.length; i++) {
					// 			var curInd = notValid[i].ind;
					// 			(validBool || maxInd != curInd) && bestArr.length > 1 && bestArr.splice(curInd, 1);
					// 		}
					// 		best_len = Infinity;
					// 		for (var i = 0; i < bestArr.length; i++) {
					// 			best_len = Math.min(best_len, bestArr[i].length);
					// 		}

					// 	}
					// }
					min_len = best_len;
					arr = bestArr;
				}

				return arr.filter( function( item ){
					return item.length == min_len;
				}).sort( function( a, b ){
					return a.__length - b.__length;
				})[ 0 ];

			} else{
				return fn();
			}
		}

		function getBetterPath(ranges, path, minDist, arr) {

			var totLen = Infinity, setVal, length = path.length, points, firstPoint = path[0],
				secondPoint = path[length - 1], space, minSpace, lastRange, adjusted, side,
				xDir, lastAvailRange, success, newPoint, maxRight, last, bestRanges = [],
				checkSpace = function (curRange) {

					var dir = xDir ? { rng: ['top', 'bottom'], side: ['x', 'y'] } : { rng: ['left', 'right'], side: ['y', 'x'] };

					if (curRange[dir.rng[0]] < firstPoint[dir.side[1]] && curRange[dir.rng[1]] > firstPoint[dir.side[1]]) {

						var mes = xDir ? curRange.width : curRange.height,
							availSpace = space + mes,
							chng = (side == '_left' || side == '_top') ? -1 : 1,
							subDir = secondPoint[dir.side[1]] < path[points[2]][dir.side[1]] ? xDir ? '_down' : '_right' : xDir ? '_top' : '_left',
							curMinSpace = Math.abs(((subDir == '_down' || subDir == '_right') ? curRange[dir.rng[1]] : curRange[dir.rng[0]]) - secondPoint[dir.side[1]]) * 0.5;//half dist between end of range to 2nd point

						minSpace = Math.min(minSpace, curMinSpace);

						bestRanges.push(curRange);

						if (availSpace * .75 >= minDist || last) {

							var subDist = Math.abs(path[points[2]][dir.side[1]] - secondPoint[dir.side[1]]),//dist between 2nd point and 3rd point
								newSubHeight = Math.min(subDist * 0.5, minSpace),
								oldSubX = secondPoint[dir.side[0]];

							last && (minDist = Math.min(minDist, space * .75));

							newPoint = firstPoint[dir.side[0]] + (minDist * chng);

							path[points[1]][dir.side[0]] = newPoint;

							if (!(curRange.left <= newPoint && curRange.right >= newPoint)) {
								var dirLimit = xDir ? ['left', 'right'] : ['top', 'bottom'];
								for (var i = bestRanges.length - 1; i >= 0; i--) {
									if (bestRanges[i][dirLimit[0]] <= newPoint && newPoint <= bestRanges[i][dirLimit[1]]) {
										curMinSpace = Math.abs(((subDir == '_down' || subDir == '_right') ? bestRanges[i][dir.rng[1]] : bestRanges[i][dir.rng[0]]) - path[points[1]][dir.side[1]]) * 0.5;
										break;
									}
								}
							}

							if (length > 3 && ((subDist * 0.5 <= curMinSpace)/* to check that range is free to move the next point */ || (xDir ? false : checkAdj(curRange, subDir))) /*&& (dirInd == 1 ? Math.abs(path[points[3]][xDir ? 'x' : 'y'] - newPoint) >= minDist : true)*/) {
								if (dirInd == 1 && Math.abs(path[points[3]][dir.side[0]] - newPoint) < minDist) {
									newPoint = path[points[0]][dir.side[0]] + (Math.abs(path[points[0]][dir.side[0]] - path[points[3]][dir.side[0]]) / 2 * chng);
									path[points[1]][dir.side[0]] = newPoint;
								}
								path[points[2]][dir.side[0]] = newPoint;
							} else {
								if ((maxRight || newSubHeight) < minDist / 2) {
									path[points[1]][dir.side[0]] = oldSubX;
									return;
								}
								var newSubHeightPos = path[points[1]][dir.side[1]] + ((maxRight || newSubHeight) * ((subDir == '_down' || subDir == '_right') ? 1 : -1));

								if (dirInd == 1) {
									path.splice(points[1] + 1, 0,
										{ [dir.side[0]]: path[points[1]][dir.side[0]], [dir.side[1]]: newSubHeightPos },
										{ [dir.side[0]]: oldSubX, [dir.side[1]]: newSubHeightPos }
									);
								} else {
									path.splice(points[1], 0,
										{ [dir.side[0]]: oldSubX, [dir.side[1]]: newSubHeightPos },
										{ [dir.side[0]]: path[points[1]][dir.side[0]], [dir.side[1]]: newSubHeightPos }
									);
								}

							}
							setVal = true;

							success = true;

						} else {
							space += mes;
							lastAvailRange = curRange;
							return true;
						}
					}
				},
				checkAdj = function (curRange, curSide) {
					var arr = curRange[curSide || side],
						point3 = path[points[2]];
					for (var i = 0; i < arr.length; i++) {
						if (curSide) {
							var pointAvail = (curSide == '_right') ? (arr[i].left <= point3.x || arr[i].right <= point3.x) : (arr[i].left >= point3.x || arr[i].right >= point3.x),
								yDist = Math.abs(arr[i][side.replace('_', '')] - firstPoint.y) * 0.75,
								topSide = side == '_top',
								subMax = firstPoint.y + (yDist * (topSide ? -1 : 1));

							if (arr[i].top <= newPoint && arr[i].bottom >= newPoint && /*last ? true : */(yDist >= minDist && (topSide ? subMax <= newPoint : subMax >= newPoint)) && pointAvail) {
								if (arr[i].left <= point3.x && arr[i].right >= point3.x) {
									if (arr[i].top <= point3.y && arr[i].bottom >= point3.y) {
										return true;
									}
								} else {
									maxRight = Math.abs(firstPoint.x - arr[i][curSide.replace('_', '')]) * 0.5;
									return checkAdj(arr[i], curSide);
								}
							}
						} else {
							if (checkSpace(arr[i])) {
								checkAdj(arr[i]);
								break;
							}
						}
					}
				},
				checkLine = function (arr, trgX, trgY) {
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].top <= trgY && arr[i].bottom >= trgY && ((side == '_right') ? (arr[i].left <= trgX || arr[i].right <= trgX) : (arr[i].left >= trgX || arr[i].right >= trgX))) {
							if (arr[i].left <= trgX && arr[i].right >= trgX) {
								if (arr[i].top <= path[points[3]].y && arr[i].bottom >= path[points[3]].y) {
									dirInd == 1 ? path.splice(1, 3, { x: trgX, y: trgY }) : path.splice(points[3], 3, { x: trgX, y: trgY });
									length = path.length;
									points = dirInd == 1 ? [0, 1, 2, 3] : [length - 1, length - 2, length - 3, length - 4];
									firstPoint = path[points[0]];
									secondPoint = path[points[1]];
									return;
								}
							} else {
								checkLine(arr[i][side], trgX, trgY);
							}
							return;
						}
					}
				};

			for (var dirInd = 0; dirInd < 2; dirInd++) {

				var oldMinDist = minDist;
				length = path.length;
				points = dirInd == 1 ? [0, 1, 2, 3] : [length - 1, length - 2, length - 3, length - 4];
				firstPoint = path[points[0]];//end
				secondPoint = path[points[1]];//before end
				space = 0; minSpace = Infinity;
				lastRange = dirInd == 1 ? ranges[0] : ranges[ranges.length - 1];
				side = undefined; xDir = undefined; lastAvailRange = undefined; success = undefined; newPoint = undefined; maxRight = undefined; last = undefined; bestRanges = [];

				if (secondPoint.x == firstPoint.x) {
					if ((Math.abs(Math.round(secondPoint.y - firstPoint.y)) >= minDist)) { //already perfect
						setVal = true;
					} else {
						side = secondPoint.y < firstPoint.y ? '_top' : '_bottom';
						checkSpace(lastRange);
					}
				} else {

					side = secondPoint.x < firstPoint.x ? '_left' : '_right';
					xDir = true;

					if (length > 4) {
						checkLine([lastRange], path[points[3]].x, firstPoint.y);//trying to reduce path
					}

					if (Math.abs(Math.round(secondPoint.x - firstPoint.x)) >= minDist) { //already perfect
						setVal = true;
					} else {

						// if (length >= 4 && (side == '_left' ? path[length - 3].x > path[length - 4].x : path[length - 3].x < path[length - 4].x)) {//to avoid small circle formation
						// 	minDist = Math.min(Math.abs(firstPoint.x - path[length - 4].x) * .75, minDist);
						// }

						if (checkSpace(lastRange)) {
							checkAdj(lastRange);
						}

					}
				}

				if (!success && lastAvailRange && xDir) {
					last = true;
					checkSpace(lastAvailRange);
				}

				minDist = oldMinDist;

			}

			if (setVal) {
				arr.push(path);
				totLen = path.length;
			}
			return totLen;
		}

		function adjust_edge( obj ){
			var x = obj.x,
			y = obj.y,
			_left = obj.left;

			if( _left == void 0 ){
				return{
					x : 0,
					y : 0
				};
			}

			var _top = obj.top,
			_right = _left + obj.width,
			_bottom = _top + obj.height,
			mid_x = _left + obj.width / 2,
			mid_y = _top + obj.height / 2,
			ret = {
				x : 0,
				y : 0
			},
			hori_diff = Math.min( Math.abs( _left - x ), Math.abs( _right - x ) ),
			vert_diff = Math.min( Math.abs( _top - y ), Math.abs( _bottom - y ) );

			if( vert_diff > hori_diff ){
				if( x > mid_x ){
					ret.x = x - ( obj.x = _right );
				} else {
					ret.x = x - ( obj.x = _left );
				}
				obj.pos_x -= ret.x;
			} else {
				if( y > mid_y ){
					ret.y = y - ( obj.y = _bottom );
				} else {
					ret.y = y - ( obj.y = _top );
				}
				obj.pos_y -= ret.y;
			}

			return ret;
		}

		function merge_modifiers( original, copy ){

			var first = original[ 0 ];

			copy.forEach( function( item, index ){
				var start = index + 1,
				prop = index % 2 == 0 ? 'x' : 'y';

				original[ start ][ prop ] = original[ start + 1 ][ prop ] = first[ prop ] + item;
			});
		}

		function remove_copy_pts( pts ){
			var len = pts.length;

			for( var i = 0; i < len - 1; i++ ){
				var cur = pts[ i ],
				next = pts[ i + 1 ];

				if( next.x == cur.x && next.y == cur.y ){
					pts.splice( 1 + i--, 1 );
					len--;
				}

				if( len == 2 ){
					break;
				}
			}

			remove_duplicate( pts );
		}

		function modifier_to_pts( modifiers, start, end, start_angle ){
			var start_x = start.x,
			start_y = start.y,
			end_y = end.y,
			end_x = end.x,
			width = Math.abs( start_x - end_x ) || 1,
			height = Math.abs( start_y - end_y ) || 1,
			pts = [ { name : "M", x : start_x, y : start_y } ],
			is_hori = /^(180|0)$/.test( start_angle ),
			prev = start;

			modifiers.forEach( function( item, index ){
				var x = is_hori ? 'x' : 'y',
				y = is_hori ? 'y' : 'x',
				new_obj = {};

				new_obj[ x ] = start[ x ] + item * ( is_hori ? width : height );
				new_obj[ y ] = prev[ y ];

				pts.push( prev = new_obj );
				is_hori = !is_hori;

				if( index == modifiers.length - 1 ){
					new_obj = {};

					new_obj[ x ] = prev[ x ];
					new_obj[ y ] = end[ y ];

					pts.push( new_obj );
				}
			});

			pts.push( { x : end_x, y : end_y } );

			return pts;
		}

		function modifyRanges(ranges, start, end) {
			var left, right, top, bottom,
				removeRanges = function (cur) {
					var side = ['_left', '_right'];
					for (var i = 0; i < 2; i++) {
						for (var j = cur[side[i + 0]].length - 1; j >= 0; j--) {
							var sub = ranges[ranges.indexOf(cur[side[i + 0]][j])][side[1 - i]];
							sub.splice(sub.indexOf(cur), 1);
						}
					}
				};
			start.x < end.x ? (left = start.x, right = end.x) : (left = end.x, right = start.x);
			start.y < end.y ? (top = start.y, bottom = end.y) : (top = end.y, bottom = start.y);
			left -= 200;
			right += 200;
			top -= 200;
			bottom += 200;

			for (var i = ranges.length - 1; i >= 0; i--) {
				var cur = ranges[i];
				if (!(left < cur.right && cur.left < right && top < cur.bottom && bottom > cur.top)) {
					removeRanges(cur);
					ranges.splice(i, 1);
				}
			}
		}

		function checkValidModifier(modifier, start, end, data, minDist) {
			var items = data.getData(),
				overlapCheck = function (_start, _end, first, second, __start, __end, axis) {
					if (((_start <= first && first <= _end) || (_start <= second && second <= _end)) && (__start <= axis && axis <= __end)) {
						return true;
					}
				},
				setMax = function (axis) {
					var a1 = pos1[axis], a2 = pos2[axis]
					if (a1 < a2) {
						_start = a1;
						_end = a2;
					} else {
						_start = a2;
						_end = a1;
					}
				},
				mdInd = 0,
				mdLen = modifier.length - 1,
				pos1, pos2, _start, _end, line, retVal,
				checkMinSpace = function (point1, point2) {
					if (point1.x == point2.x) {
						if (Math.abs(point1.y - point2.y) < minDist) {
							retVal = true;
						}
					} else {
						if (Math.abs(point1.x - point2.x) < minDist) {
							retVal = true;
						}
					}
				};
			checkMinSpace(modifier[0], modifier[1]);
			checkMinSpace(modifier[mdLen], modifier[mdLen - 1]);

			if (retVal) {
				return true;
			} else {
				for (var mdInd = 0; mdInd < mdLen; mdInd++) {
					pos1 = modifier[mdInd];
					pos2 = modifier[mdInd + 1];
					if (pos1.y == pos2.y) {
						setMax('x');
						line = "hori";
					} else {
						setMax('y');
						line = "vert";
					}
					for (var ind in items) {
						var item = items[ind],
							id = item.data.id;
						// if (id != start.elem.id && id != end.elem.id) {
						var itemPos = item.position,
							_left = itemPos.left,
							_right = _left + itemPos.width,
							_top = itemPos.top,
							_bottom = _top + itemPos.height,
							_y = pos1.y,
							_x = pos1.x;
						if ((line == "hori") ? overlapCheck(_start, _end, _left, _right, _top, _bottom, _y) : overlapCheck(_start, _end, _top, _bottom, _left, _right, _x)) {
							if (mdInd == 0 && id == start.elem.id || mdInd == mdLen - 1 && id == end.elem.id) {
								continue;
							}
							return true;
						}
						// }
					}
				}
			}
		}

		$L.elbow = function( svg, start, end, data, ignore ){
			var $svg = $L( svg ),
			start_adjust = adjust_edge( start ),
			end_adjust = adjust_edge( end ),
			start_adj_x = start_adjust.x,
			start_adj_y = start_adjust.y,
			end_adj_x = end_adjust.x,
			end_adj_y = end_adjust.y,
			offset = data.offset,
			off_x1 = offset.left,
			off_y1 = offset.top,
			off_x2 = offset.right,
			off_y2 = offset.bottom,
			start_x = Math.min( start.x + start_adj_x, end.x + end_adj_x ),
			start_y = Math.min( start.y + start_adj_y, end.y + end_adj_y ),
			end_x = Math.max( start.x + start_adj_x, end.x + end_adj_x ),
			end_y = Math.max( start.y + start_adj_y, end.y + end_adj_y ),
			ref_x = start_x - off_x1,
			ref_y = start_y - off_y1,
			modifier,
			type,
			ck = 40,
			start_angle = find_angle( start ),
			end_angle = find_angle( end ),
			radius = data.connector_radius,
			allow_break = data.check_break && !data.ignore_break,
			options = $svg.data( "options" ) || {},
			existing_point = options.points,
			end_elem = end.elem,
			ignoreParent = [];

			if( existing_point && existing_point.length ){
				var __first_pt = existing_point[ 0 ];
				if( typeof __first_pt == "object" ){ 
					modifier = $L.extend( true, [], existing_point );
				} else {
					modifier = modifier_to_pts( existing_point, start, end, start_angle );
				}

				var __ns = "deleteAfterUpdate";

				if( options[ __ns ]  ){
					delete options[ __ns ];
					delete options.points;
				}
			} else {

				type = find_elbow_type( start_angle, end_angle, start, end );

				if( allow_break ){

					$L(start.elem).hasClass('lyteConnectInnerItem') && ignoreParent.push(start.elem.parentNode.id);
					$L(end.elem).hasClass('lyteConnectInnerItem') && ignoreParent.push(end.elem.parentNode.id);
					
					var ranges = Lyte.deepCopyObject( data.getRanges(ignoreParent) ),
						svgOpt = $svg.data('options');

                    modifyRanges( ranges, start, end );

					if(/lyte-textbox/i.test( end_elem ? end_elem.tagName : "" )){
						data.splitIndiv(ranges, {
							dimension: { width: end.width, height: end.height },
							position: { left: end.left, top: end.top }
						})
					} else if (svgOpt.hanging) {
						var pos = svgOpt.trgPos;
						data.splitIndiv(ranges, {
							dimension: { width: pos.width, height: pos.height },
							position: { left: pos.left, top: pos.top }
						})
					}
					delete $svg.data().adjustPoints;
					modifier = find_common_modifier( start_angle, end_angle, start, end, type, ck )
					if(!data.elbowAvoidance || checkValidModifier( modifier, start, end, data, ck )){
						modifier = break_line( start_angle, end_angle, start, end, type, ck, ranges );
					}
				} else{
					modifier = find_common_modifier( start_angle, end_angle, start, end, type, ck );
				}

				remove_copy_pts( modifier );

				var first = modifier[ 0 ],
				last = $L( modifier ).get( - 1 ),
				exst_modifiers = options.modifiers;

				exst_modifiers && merge_modifiers( modifier, exst_modifiers );

				first.x += start_adj_x;
				first.y += start_adj_y;

				last.x += end_adj_x;
				last.y += end_adj_y;
			}

			if( false && allow_break && /lyte-textbox/i.test( end_elem ? end_elem.tagName : "" ) ){
					
				var $arr = $L( modifier ),
				__last = $arr.get( -1 ),
				__last_before = $arr.get( -2 ),
				__last_two_before = $arr.get( -3 ),
				is_hori = __last.y == __last_before.y,
				__x = is_hori ? 'x' : 'y',
				is_incre = __last_before[ __x ] < __last[ __x ],
				__width = is_hori ? end.width : end.height;

				switch( end_angle ){
					case 0 : {
						if( is_incre ){
							__last[ __x ] -= __width;
						}
					}
					break;
					case 180 : {
						if( !is_incre ){
							__last[ __x ] += __width;
						}
					}
					break;
					case 270 : {
						if( !is_incre ){
							__last_two_before[ __x ] = ( __last_before[ __x ] -= __width );
						}
					}
					break;
					case 90 : {
						if( is_incre ){
							__last_two_before[ __x ] = ( __last_before[ __x ] += __width );
						}
					}
					break;
				}
			}

			$svg.data({
				absolute_points : /*allow_break ? */$L.extend( true, [], modifier )/* : void 0*/,
				ref_x : ref_x,
				ref_y : ref_y,
				radius : radius
			});

			if( ignore ){
				return;
			}
			
			return draw_line( modifier, radius, ref_x, ref_y, undefined, data ).trim();
		};

		$L.elbow.draw_line = draw_line;
		$L.elbow.add_radius = add_radius;
		$L.elbow.find_exact_range = find_exact_range;
	}
})();
;( function(){
	if( typeof $L != "undefined" ){

		// function draw_line( item ){

		// }

 		function modify_range( obj, details, ignoreParent, data ){
			var getRange = function(__details){
				var __cur = __details.position,
				__left = __cur.left + ( __details.x_diff || 0 ),
				__top = __cur.top + ( __details.y_diff || 0 ),
				__right = __left + __cur.width,
				__bottom = __top + __cur.height,
				is_hori = obj.is_hori,
				obj_right = obj.right,
				obj_left = obj.left,
				obj_top = obj.top,
				obj_bottom = obj.bottom,
				__mid = obj.mid;

				if( is_hori ){
					if( __left >= obj_right || __right <= obj_left ){
						return;
					}

					if( __top < obj_top && __bottom > obj_bottom ){
						obj.top = obj.bottom = obj.mid;
					}

					if( __bottom <= __mid ){
						obj.top = Math.max( obj_top, __bottom );
					}
					if( __top >= __mid ){
						obj.bottom = Math.min( obj_bottom, __top );
					}

				} else {
					if( __top >= obj.bottom || __bottom <= obj.top ){
						return;
					}

					if( __left < obj_left && __right > obj_right ){
						obj.left = obj.right = obj.mid;
					}

					if( __right <= __mid ){
						obj.left = Math.max( obj_left, __right );
					}
					if( __left >= __mid ){
						obj.right = Math.min( obj_right, __left );
					}
				}
			}
			for (var key in details) {
				var value = details[key];
				if (ignoreParent.includes(key)) {
					var parentPos = value.position;
					value.data.children.forEach(function (curChild) {
						var childElem = data.get_element(curChild.id, key);
						getRange($L.extend(true, { position: { left: parentPos.left + childElem.offsetLeft, top: parentPos.top + childElem.offsetTop, width: childElem.offsetWidth, height: childElem.offsetHeight } }, curChild));
					});
				} else {
					getRange(value);
				}
			}
		}

		function check_boundary_with_shape( pt1, pt2, details, ignoreParent, data ){
			var x1 = pt1.x,
			x2 = pt2.x,
			y1 = pt1.y,
			y2 = pt2.y,
			is_hori = y1 == y2,
			obj = {
				is_hori : is_hori
			},
			inf = Infinity,
			x = 'x',
			y = 'y',
			__left = 'left',
			__right = 'right',
			__top = 'top',
			__bottom = 'bottom';

			if( !is_hori ){
				y = 'x';
				x = 'y';
				__left = 'top';
				__right = 'bottom';
				__top = 'left';
				__bottom = 'right';
				var temp1 = x1,
				temp2 = x2;

				x1 = y1;
				x2 = y2;

				y1 = temp1;
				y2 = temp2;
			}

			obj.mid = pt1[ y ];
			obj[ __left ] = Math.min( x1, x2 );
			obj[ __right ] = Math.max( x1, x2 );
			obj[ __top ] = -inf;
			obj[ __bottom ] = inf;

			modify_range( obj, details, ignoreParent, data );

			return obj;
		}

		function check_with_other_line( boundary, is_hori, connections, redraw ){

			var ranges = [ boundary ],
			__mid = boundary.mid;

			connections.forEach( function( __item ){
				var pts = __item.points,
				stroke = __item.stroke / 2;

				pts.forEach( function( item, index ){
					if( !index ){
						return;
					}
					var pt1 = pts[ index - 1 ],
					pt2 = item,
					__is_hori = pt1.y == pt2.y,
					y = is_hori ? 'y' : 'x',
					x = is_hori ? 'x' : 'y',
					__top = is_hori ? 'top' : 'left',
					__bottom = is_hori ? 'bottom' : 'right',
					__left = is_hori ? 'left' : 'top',
					__right = is_hori ? 'right' : 'bottom';

					if( is_hori != __is_hori ){
						return;
					}

					var max_x = Math.max( pt1[ x ], pt2[ x ] ),
					min_x = Math.min( pt1[ x ], pt2[ x ] ),
					__len = ranges.length;

					for( var i = 0; i < __len; i++ ){
						var __cur = ranges[ i ],
						top_val = __cur[ __top ],
						bottom_val = __cur[ __bottom ],
						left_val = __cur[ __left ],
						right_val = __cur[ __right ],
						hit_pt = pt1[ y ];

						if( hit_pt < top_val || hit_pt > bottom_val || left_val >= max_x || right_val <= min_x ){
							continue;
						}

						var obj1 = {
							mid :  __mid
						},
						obj2 = {
							mid : __mid
						},
						fn = function( obj ){
							obj[ __left ] = __cur[ __left ];
							obj[ __right ] = __cur[ __right ];

							if( obj[ __top ] != obj[ __bottom ] ){
								ranges.splice( ++i, 0, obj );
								__len++;
							}
						};

						obj1[ __bottom ] = Math.max( obj1[ __top ] = __cur[ __top ], hit_pt - stroke );
						obj2[ __top ] = Math.min( obj2[ __bottom ] = __cur[ __bottom ], hit_pt + stroke );

						ranges.splice( i--, 1 );
						__len--;

						fn( obj1 );
						fn( obj2 );

						push_if_not( redraw, __item.elem );
					}
				});	
			});

			return ranges;
		}

		function push_if_not( arr, value ){
			if( arr.indexOf( value ) == -1 ){
				arr.push( value );
			}
		}

		function find_nearest( ranges, is_hori ){
			var distance = Infinity,
			selected,
			__left = is_hori ? 'top' : 'left',
			__right = is_hori ? 'bottom' : 'right';

			ranges.forEach( function( item ){
				var mid = item.mid,
				__dist;

				if( item[ __left ] <= mid && item[ __right ] >= mid ){
					__dist = 0;
				} else {
					__dist = Math.min( Math.abs( item[ __left ] - mid ), Math.abs( item[ __right ] - mid ) );
				}

				if( __dist < distance ){
					distance = __dist;
					selected = item;
				}
			});

			return {
				selected : selected,
				distance : distance
			}
		}

		function check_avoidance( points, details, connections, svg, i, redraw, offset, stroke, ignoreParent, data ){
			if( connections.length == 0 ){
				return;
			}

			var check_other =  i == 0 || i == points.length - 2,
			pt1 = points[ i ],
			pt2 = points[ i + 1 ], 
			is_hori = pt1.y == pt2.y;

			if( is_hori && pt1.x == pt2.x ){
				return;
			}

			var boundary = check_boundary_with_shape( pt1, pt2, details, ignoreParent, data ),
			__redraw = [],
			ranges = check_with_other_line( boundary, is_hori, connections, __redraw );

			if( ranges.length > 1 ){
				var near = find_nearest( ranges, is_hori ),
				__near = near.selected,
				x = is_hori ? 'x' : 'y',
				y = is_hori ? 'y' : 'x',
				__left = is_hori ? 'left' : 'top',
				__top = is_hori ? 'top' : 'left',
				__right = is_hori ? 'right' : 'bottom',
				__bottom = is_hori ? 'bottom' : 'right';

				if( !near.distance ){
					var diff = Math.min( Math.abs( __near[ __top ] - __near.mid ), Math.abs( __near[ __bottom ] - __near.mid ) );
					if( diff >= offset ){
						return;
					}
				}

				if( check_other ){
					__redraw.forEach( push_if_not.bind( this,redraw ) );
				} else {
					var cur_height = __near[ __bottom ] - __near[ __top ],
					inf = Infinity,
					fn = function(){
						var to_top = __near[ __top ],
						to_bottom = __near[ __bottom ],
						__diff = to_bottom - to_top,
						__value_to_be,
						to_mid = __near.mid;

						if( to_top == -inf ){
							__value_to_be = to_bottom - offset;
						} else {
							if( cur_height == inf ){
								__value_to_be = to_top + offset;
							} else {
								if( __diff > 2 * offset ){
									if( Math.abs( to_top - to_mid ) > Math.abs( to_bottom - to_mid ) ){
										__value_to_be = to_bottom - offset;
									} else {
										__value_to_be = to_top + offset;
									}
								} else {
									__value_to_be = to_top + cur_height * 0.5;
								}
							}
						}

						pt1[ y ] = pt2[ y ] = __value_to_be;
					};

					if( cur_height >= offset ){
						fn();
					} else {
						ranges.sort( function( a, b ){
						    return ( b[ __bottom ] - b[ __top ] ) - ( a[ __bottom ] - a[ __top ] );
						}); 

						__near = ranges[ 0 ];
						cur_height = __near[ __bottom ] - __near[ __top ];
						fn();
					}

					svg.__modified = true;
				}
			}


		}

		$L.elbow.avoidLine = function( svg, data, ignore, ref_x, ref_y ){
			var points,
			connections = [],
			__ns = 'lyteConnect';

			Array.from( svg.parentNode.getElementsByClassName( __ns + 'ionContainer' ) ).forEach( function( item ){
				var $elem = $L( item ),
				__data = $elem.data(),
				__points = __data.absolute_points;

				if( !__points || $elem.hasClass( __ns + 'HiddenElem' ) ){
					return;
				}

				if( item == svg ){
					points = __points;
					return;
				}

				connections.push({
					elem : item,
					points : __points,
					data : __data,
					stroke : 2,
					dom : $elem
				});
			});

			var _len = points.length - 1,
			redraw = [],
			offset = 20,
			stroke = 2,
			connect = svg.closest( 'lyte-connect' ),
			details = connect ? connect.getData( 'details' ) : void 0,
			__path,
			svgData = $L(svg).data(),
			ignoreParent = [];

			svgData.src.hasClass('lyteConnectInnerItem') && ignoreParent.push(svgData.src[0].parentNode.id);
			svgData.target.hasClass('lyteConnectInnerItem') && ignoreParent.push(svgData.target[0].parentNode.id);

			if( !connect ){
				return;
			};

			for( var i = 0; i < _len; i++ ){
				check_avoidance( points, details, connections, svg, i, redraw, offset, stroke, ignoreParent, data );
			}

			if( svg.__modified ){
				$L( svg ).data( 'absolute_points', $L.extend( true, [], points ) );
				!ignore && ( __path = $L.elbow.draw_line( points, data.connector_radius, ref_x, ref_y ) );
				delete svg.__modified;
			}

			if( ignore ){
				return;
			}

			// redraw.forEach( function( item ){
			// 	draw_line( item );
			// });

			return __path;
		}
	}
})();
;(function(){
	if( typeof $L != "undefined" ){

		/*
			returns two vertical lines meeting point if any
		*/

		function meet_point( start, end, _start, _end, y, _y, radius ){
			var other_y1 = Math.min( _end[ y ], _start[ y ] ),
			other_y2 = Math.max( _end[ y ], _start[ y ] ),
			vert_radius = Math.min( radius * 2, ( other_y2 - other_y1 ) / 2 );

			if( start[ y ] >= ( other_y2 - vert_radius ) || start[ y ] <= ( other_y1 + vert_radius ) ){
				return;
			}

			var x1 = Math.min( end[ _y ], start[ _y ] ),
			x2 = Math.max( end[ _y ], start[ _y ] ),
			hori_radius = Math.min( radius * 2, ( x2 - x1 ) / 2 );

			if( _start[ _y ] >= ( x2 - hori_radius ) || _start[ _y ] <= ( x1 + hori_radius ) ){
				return;
			}

			var obj = {};

			obj[ _y ] = _end[ _y ];
			obj[ y ] = end[ y ];

			return obj;
		}

		/*
			It will add arcs on intersection
		*/

		function add_arcs( start, end, connections, svg, line_index, redraw, radius ){
			var is_hori = start.y == end.y,
			x = is_hori ? 'x' : 'y',
			y = is_hori ? 'y' : 'x',
			is_incre = end[ x ] > start[ x ],
			$act_elem = $L( svg ),
			act_arc = $act_elem.data( 'arcs' ),
			act_vert = $act_elem.data( 'vert_arcs' );

			connections.forEach( function( item ){
				var points = item.points,
				_len = points.length - 1;

				for( var i = 0; i < _len; i++ ){
					var _start = points[ i ],
					_end = points[ i + 1 ],
					is_other_hori = _start.y == _end.y;

					if( is_hori == is_other_hori ){
						continue;
					}

					var _x = is_other_hori ? 'x' : 'y',
					_y = is_other_hori ? 'y' : 'x',
					is_other_incre = _end[ _x ] > _start[ _y ],
					meet = meet_point( start, end, _start, _end, y, _y, radius ),
					arc,
					index,
					act_elem,
					elem_id,
					other_id,
					other_index,
					other_arc,
					inc,
					other_inc;

					if( meet ){
						if( is_hori ){
							arc = act_arc;
							act_elem = svg;
							index = line_index;
							elem_id = svg.id;
							other_id = item.elem.id;
							other_index = i;
							other_arc = item.data.vert_arcs;
							inc = is_incre;
							other_inc = is_other_incre;
						} else{
							act_elem = item.elem;
							var $elem = item.dom,
							arc = item.data.arcs;
							index = i;
							elem_id = act_elem.id;
							other_id = svg.id;
							other_index = line_index;
							other_arc = act_vert;
							inc = is_other_incre;
							other_inc = is_incre;
						}

						var __index = redraw.indexOf( act_elem ),
						line_arc = arc[ index ],
						other_line_arc = other_arc[ other_index ],
						to_push = {
							point : meet,
							index : index,
							other_index : other_index,
							id : elem_id,
							other_id : other_id,
							inc : inc,
							other_inc : other_inc
						};

						if( line_arc == void 0 ){
							line_arc = arc[ index ] = [];
						}

						if( other_line_arc == void 0 ){
							other_line_arc = other_arc[ other_index ] = [];
						}

						line_arc.push( to_push );
						other_line_arc.push( to_push );

						if( __index == -1 ){
							redraw.push( act_elem );
						}
					}
				}

			});
		}

		/*
			It will remove one connector's arc from other vertical connectors.
			Arcs will be placed only on horizontal lines
		*/

		function remove_arcs( svg, obj_form, marker_draw ){
			var arc = $L( svg ).data( 'arcs' ) || {};

			for( var key in arc ){
				var lines = arc[ key ],
				len = lines.length;

				for( var i = 0; i < len; i++ ){
					var item = lines[ i ],
					other_elem = $L( '#' + item.other_id, svg.parentNode );

					lines.splice( i--, 1 );
					len--;

					remove_single_arc( other_elem, item.other_index, item, 'vert_arcs' );

					marker_draw && push_if_not( marker_draw, other_elem.get( 0 ) );
				}
			}
		}

		/*
			It will remove one connector's arc from other horizontal connectors
		*/

		function remove_other_arcs( svg, redraw, obj_form, marker_draw ){
			var arc = $L( svg ).data( 'vert_arcs' ) || {};

			marker_draw && push_if_not( marker_draw, svg );

			for( var key in arc ){
				var lines = arc[ key ],
				len = lines.length;

				for( var i = 0; i < len; i++ ){
					var item = lines[ i ],
					other_elem = $L( '#' + item.id, svg.parentNode );

					lines.splice( i--, 1 );
					len--;

					if( remove_single_arc( other_elem, item.index, item, 'arcs' ) ){
						var other_elem_dom = other_elem.get( 0 );
						__index = redraw.indexOf( other_elem_dom );

						if( __index == -1 ){
							redraw.push( other_elem_dom );
						}
					}
				}
			}
		}

		/*
			removes single arc
		*/

		function remove_single_arc( elem, index, item, ns ){
			var arcs = ( elem.data( ns ) || {} )[ index ] || [],
			idx = arcs.indexOf( item );

			if( idx + 1 ){
				arcs.splice( idx, 1 );
				return true;
			}
		}

		/*
			It will merge multiple nearby arcs into a single arc 
		*/

		function merge_arcs( arr, radius ){
			var len = arr.length - 1;

			for( var i = 0; i < len; i++ ){
				var cur = arr[ i ],
				next = arr[ i + 1 ],
				cur_point = cur.point,
				next_point = next.point,
				sum_radius = ( cur.radius || radius ) + ( next.radius || radius ),
				diff = Math.abs( cur_point.x + cur_point.y - next_point.x - next_point.y );

				if( diff > 2 * radius ){
					continue;
				}

				arr.splice( i--, 1 );
				len--;

				next_point.x = ( cur_point.x + next_point.x ) / 2;
				next_point.y = ( cur_point.y + next_point.y ) / 2;

				next.radius = ( sum_radius + diff ) / 2;
			}

			return arr;
		}

		/*
			Sorts arcs in the same line for placing it in order
		*/

		function sort_arcs( item, radius, __fn, data ){
			var $item = $L( item ),
			jdata = $item.data(),
			svgData = data,
			data = jdata.arcs,
			points = $L.elbow.add_radius( $L.extend( true, [], $item.data( 'absolute_points' ) ), radius ),
			obj = {},
			keys = Object.keys( data ).map( Number ).sort( function( a, b ){
				return b - a;
			}),
			len = keys.length,
			fn = function( a, b ){
				var point_1 = a.point,
				point_2 = b.point;

				return ( point_1.x + point_1.y ) - ( point_2.x + point_2.y );
			};

			if( points.length == 0 ){
				return;
			}

			for( var i = 0; i < len; i++ ){
				var index = keys[ i ],
				arr = data[ index ],
				new_arr;

				arr.sort( fn );

				if( arr.length ){
					new_arr = insert_arcs( points, index, merge_arcs( $L.extend( true, [], arr ), radius ), radius );

					if( new_arr.length ){
						new_arr.unshift( 2 * index + 1, 0 );
						points.splice.apply( points, new_arr );
					}
				}
			}

			var __new_value = $L.elbow.draw_line( points, radius, jdata.ref_x, jdata.ref_y, true, svgData ).trim();

			if( __fn ){
				return Array.from( $item.children() ).every( function( item, index ){
					__fn( item, 'd', __new_value );
					return index == 0;
				});
			}

			$item.children().attr( 'd', __new_value );
		}

		// adds arcs to line points

		function insert_arcs( points, key, arr, radius ){
			var index = key * 2,
			pt1 = points[ index ],
			pt2 = points[ index + 1 ];

			if( !pt1 || !pt2 ){
				return [];
			}

			var is_inc = ( pt1.x + pt1.y ) < ( pt2.x + pt2.y ),
			arcs = [],
			fact1 = is_inc ? 1 : -1,
			fact2 = is_inc ? -1 : 1,
			is_hori = pt1.y == pt2.y,
			hori_fact = is_hori ? 1 : 0,
			vert_fact = is_hori ? 0 : 1;

			if( !is_inc ){
				arr.reverse();
			}

			arr.forEach( function( item ){

				var point = item.point,
				__radius = item.radius || radius,
				arc = {
					x : point.x + __radius * fact1 * hori_fact,
					y : point.y + __radius * fact1 * vert_fact,
					name : "A",
					radius : radius,
					neg : is_inc ? 1 : 0
				},
				new_pt = {
					x : point.x + __radius * fact2 * hori_fact,
					y : point.y + __radius * fact2 * vert_fact
				};
				arcs.push( new_pt, arc );
			});

			return arcs;
		}

		function push_if_not( arr, elem ){
			if( elem && arr.indexOf( elem ) == -1 ){
					arr.push( elem );
			}
		}

		$L.elbow.arc = function( svg, data, frm_delete, __fn ){
			var points,
			obj_form = {},
			connections = Array.from( svg.parentNode.getElementsByClassName( 'lyteConnectionContainer' ) ).map( function( item ){
				var $elem = $L( item ),
				data = $elem.data();

				if( $elem.hasClass( 'lyteConnectHiddenElem' ) ){
					return {};
				}

				obj_form[ item.id ] = item;

				return{
					elem : item,
					points : data.absolute_points,
					data : data,
					dom : $elem
				}
			}).filter( function( item ){
				return item.points && ( item.elem == svg ? ( ( points = item.points ) && false ) : true );
			}),
			radius = data.connector_radius,
			_len = ( points || [] ).length - 1,
			redraw = [],
			line_marker = data.line_marker,
			offset = data.offset,
			marker_draw = line_marker ? [] : void 0;

			remove_arcs( svg, obj_form, marker_draw );
			remove_other_arcs( svg, redraw, obj_form, marker_draw );

			if( !frm_delete ){
				for( var i = 0; i < _len; i++ ){
					add_arcs( points[ i ], points[ i + 1 ], connections, svg, i, redraw, radius );
				}
			}

			push_if_not( redraw, svg );

			redraw.forEach( function( item ){
				sort_arcs( item, radius, __fn, data );
				marker_draw && push_if_not( marker_draw, item );
			});

			( marker_draw || [] ).forEach( function( item ){
				if( item == svg ){
					return;
				}
				var pts = $L( item ).data( 'absolute_points' ),
				first = pts[ 0 ],
				last = pts[ pts.length - 1 ],
				ref_x = Math.min( first.x, last.x ) - offset.left,
				ref_y = Math.min( first.y, last.y ) - offset.top;

				$L.elbow.marker( item, line_marker, ref_x, ref_y, data, true );
			});
		}
	}
})();
;( function(){
	if( typeof $L != "undefined" ){

		function relative_pts( arr, ref_x, ref_y ){
			var ref = arr[ 0 ];

			arr.forEach( function( item ){
				item.x -= ref_x;
				item.y -= ref_y;
			});

			return arr;
		}

		function check_max_length( arr, data ){

			var max_width = data.max_width,
			max_height = data.max_height,
			__length = arr.length - 1;

			for( var i = 0; i < __length; i++ ){
				var pt1 = arr[ i ],
				pt2 = arr[ i + 1 ],
				__line_width = Math.abs( pt2.x - pt1.x ),
				__line_height = Math.abs( pt2.y - pt1.y ),
				to_split = 0,
				incre,
				is_hori = pt1.y == pt2.y,
				__y = is_hori ? 'y' : 'x',
				__x = is_hori ? 'x' : 'y';

				if( __line_height > max_height ){
					to_split = parseInt( __line_height / max_height );
					incre = __line_height / ( to_split + 1 );
				} else if( __line_width > max_width ){
					to_split = parseInt( __line_width / max_width );
					incre = __line_width / ( to_split + 1 );
				}

				if( to_split ){
					var is_neg = pt1[ __x ] > pt2[ __x ];

					for( var j = 0; j < to_split; j++ ){
						var new_obj = {};
						new_obj[ __x ] = pt1[ __x ] + ( incre * ( j + 1 ) ) * ( is_neg ? -1 : 1 );
						new_obj[ __y ] = pt1[ __y ];
						arr.splice( ++i, 0, new_obj );
					}
				}
			}	

			return arr;
		}

		function split_pts( arr, arcs, vert_arcs, data ){
			var keys = Object.keys( arcs ).concat( Object.keys( vert_arcs ) ).sort( function( a, b ){
				return b - a;
			});

			keys.forEach( function( item ){
				var line_index = parseInt( item ),
				__arcs = arcs[ line_index ] || vert_arcs[ line_index ],
				pt1 = arr[ line_index ] || {},
				pt2 = arr[ line_index + 1 ] || {},
				is_hori = pt1.y == pt2.y,
				__x = is_hori ? 'x' : 'y',
				is_neg = pt1[ __x ] > pt2[ __x ];

				if( __arcs.length ){

					__arcs = Array.from( __arcs ).sort( function( a, b ){
					    return ( b.point[ __x ] - a.point[ __x ] ) * ( is_neg ? -1 : 1 );
					});

					__arcs.forEach( function( __cur ){
						var pt = __cur.point;
						arr.splice( line_index + 1, 0, { x : pt.x, y : pt.y, arc : true } );
					});
				}
			});

			return check_max_length( arr, data );
		}

		function draw_marker( marker, __width, __height, line_marker, pts, data, frm_linear_curve ){
			var __len = pts.length - 1,
			str = "",
			min_width = Math.max( data.min_width, 2 * __width ),
			min_height = Math.max( data.min_height, 2 * __height ),
			__fn = function( is_hori, is_neg, item, index ){
				if( index ){
					if( is_hori ){
						str += ( ( item[ 0 ] * ( is_neg ? -1 : 1 ) + mid_x ) + " " + ( item[ 1 ] + mid_y ) + " " );
					} else {
						str += ( ( item[ 1 ] + mid_x ) + " " + ( item[ 0 ] * ( is_neg ? -1 : 1 ) + mid_y ) + " " );
					}
				}
			};

			for( var i = 0; i < __len; i++ ){
				var first = pts[ i ],
				next = pts[ i + 1 ],
				is_hori = frm_linear_curve || ( first.y == next.y ),
				line_width = Math.abs( first.x - next.x ),
				line_height = Math.abs( first.y - next.y );

				if( !frm_linear_curve && ( ( is_hori && line_width < min_width ) || ( !is_hori && line_height < min_height ) ) ){
					continue;
				}

				var is_neg,
				is_arc = first.arc || next.arc;

				if( is_arc ){
					if( ( is_hori && line_width < 100 ) || ( !is_hori && line_height < 100 ) ){
						continue;
					}
				}

				if( is_hori ){
					is_neg = first.x > next.x;
				} else {
					is_neg = first.y > next.y;
				}

				var mid_x,
				mid_y,
				first_pt = line_marker[ 0 ],
				linear = marker.parentNode.__alternate;

				if( linear ){
					var prev_path = marker.previousElementSibling,
					mid = prev_path.getPointAtLength( prev_path.getTotalLength()/ 2 );

					mid_x = mid.x;
					mid_y = mid.y;

					if( linear.is_first_vert ){
						var first_vert_fact = linear.first_vert_fact;

						if( ( first_vert_fact == -1 && next.x < first.x ) || ( first_vert_fact == 1 && next.x > first.x ) ){
							first_vert_fact *= -1;
						}

						mid_x += __width / 2 * first_vert_fact;
					} else {
						var first_vert_fact = linear.first_vert_fact;

						if( ( first_vert_fact == 1 && next.x < first.x ) || ( first_vert_fact == -1 && next.x > first.x ) ){
							first_vert_fact *= -1;
						}

						mid_x -= __width / 2 * first_vert_fact;
					}
				} else {
					mid_x = ( first.x + next.x ) / 2 + ( is_hori ? __width / 2 * ( is_neg ? 1 : -1 ) : 0 );
					mid_y = ( first.y + next.y ) / 2 + ( is_hori ? 0 : __width / 2 * ( is_neg ? 1 : -1 ) );
				}

				if( is_hori ){
					str += ( "M " + ( first_pt[ 0 ] + mid_x ) + " " + ( first_pt[ 1 ] + mid_y ) + " L " );
				} else {
					str += ( "M " + ( first_pt[ 1 ] + mid_x ) + " " + ( first_pt[ 0 ] + mid_y ) + " L " );
				}

				line_marker.forEach( __fn.bind( this, is_hori, is_neg ) );

				if( frm_linear_curve ){
					marker.style.transform = "rotate(" + ( Math.atan( ( next.y - first.y ) / ( next.x - first.x ) ) * 180 / Math.PI ) + "deg)";
				}
			}

			marker.setAttribute( 'd', str.trim() );
		}

		$L.elbow.marker = function( svg, line_marker, ref_x, ref_y, data, allow, frm_linear_curve ){
			var marker = svg.children[ 2 ];

			if( !allow ){
				return marker.setAttribute( 'd', "" );
			}

			var min_x = Infinity,
			max_x = -min_x,
			min_y = min_x,
			max_y = -min_x,
			__width,
			__height,
			$svg = $L( svg ), 
			abs_pts = $svg.data( frm_linear_curve ? "linear_points" : 'absolute_points' ),
			pts = frm_linear_curve ? abs_pts : relative_pts( split_pts( $L.extend( true, [], abs_pts ), $svg.data( 'arcs' ) || {}, $svg.data( 'vert_arcs' ) || {}, data ), ref_x, ref_y );

			line_marker.forEach( function( item ){
				var __x = item[ 0 ],
				__y = item[ 1 ];

				min_x = Math.min( min_x, __x );
				max_x = Math.max( max_x, __x );
				min_y = Math.min( min_y, __y );
				max_y = Math.max( max_y, __y );
			});

			__width = max_x - min_x;
			__height = max_y - min_y;

			draw_marker( marker, __width, __height, line_marker, pts, data, frm_linear_curve );
		}
	}
})();
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