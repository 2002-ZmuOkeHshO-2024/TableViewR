;( function(){
	if(typeof $L != "undefined" ){

		var event_name,
		element_name,
		exit_name,
		__doc = document,
		check_name,
		function_name,
		is_in_widget = window.document != __doc;

		if( __doc.fullscreenEnabled ){
			exit_name = "exit";
			element_name = "f";
			event_name = "";
			check_name = "fullscreen";
			function_name = "requestFullscreen";
		} else if( __doc.mozFullScreenEnabled ){
			event_name = 'moz';
			exit_name = "mozCancel";
			element_name = "mozF";
			check_name = 'mozFullScreen';
			function_name = "mozRequestFullScreen";
		} else if( __doc.webkitFullscreenEnabled ){
			event_name = 'webkit';
			exit_name = "webkitExit";
			element_name = "webkitF";
			check_name = "webkitIsFullScreen";
			function_name = "webkitRequestFullscreen";
		} else if( __doc.msFullscreenEnabled ){
			event_name = 'ms';
			exit_name = "msExit";
			element_name = "msF";
			check_name = "msFullscreenElement";
			function_name = "msRequestFullscreen";
		}

		element_name += "ullscreenElement";
		exit_name += "Fullscreen";
		event_name += "fullscreenchange";

		function exit_fullscreen( __elem ){
			fire_exit( __elem );
			__doc[ exit_name ]();
		}

		function fire_exit( __elem, cb_name, __add ){
			var __className = "lyteFullScreenTraverse",
			__node = __elem.get( 0 ),
			__parent = __node.parentNode,
			__ns = 'lyte_fullscreen',
			__data = __elem.data( __ns ),
			cb = __data[ cb_name || "onExit" ],
			__fn = __add || "remove",
			root_node = is_in_widget ? get_widget_body( __node ) : __doc.body;

			__elem[ __fn + "Class" ]( 'lyteFullScreenElement' );

			while( __parent != root_node ){
				__parent.classList[ __fn ]( __className );
				__parent = __parent.parentNode;
			}

			if( !__add ){
				__elem.removeData( __ns );
			}

			if( typeof cb == "function" ){
				cb(  __node );
			}
		}

		function fire_enter( __elem, res ){
			fire_exit( __elem, 'onEnter', "add" );
			res && res();
		}

		function check_previous(){
			var __active = __doc.getElementsByClassName( "lyteFullScreenElement" )[ 0 ];
			if( __active ){
				fire_exit( $L( __active ) );
			} else {
				var traverse_cls = 'lyteFullScreenTraverse';
				$L( __doc.getElementsByClassName( traverse_cls ) ).removeClass( traverse_cls );
			}
		}	

		function get_widget_body( elem ){

			var __parent = elem;

			while( __parent ){
				if( __parent instanceof ShadowRoot ){
					break;
				}	
				elem = __parent;
				__parent = elem.parentNode;
			}
			return elem;
		}

		function enter_fullscreen( __elem, res, rej ){
			var __body = is_in_widget ? get_widget_body( __elem.get( 0 ) ) : __doc.body,
			exst_elem = __doc[ element_name ],
			__$body = $L( __body ),
			__active_class = 'lyteFullScreenActive';

			if( exst_elem == __body ){				
				if( __$body.hasClass( __active_class ) ){
					check_previous();
					fire_enter( __elem, res );
				} else {
					__doc[ exit_name ]();
					return window.requestAnimationFrame( enter_fullscreen.bind( this, __elem , res, rej ) );
				}
			} else {

				__body.addEventListener( event_name, __event, true );

				var __ret = __body[ function_name ]();

				if( __ret && __ret.then ){
					__ret.then( function(){
						__$body.addClass( __active_class );
						fire_enter( __elem, res );
					}).catch( function( err ){
						var __data = __elem.data( 'lyte_fullscreen' ),
						cb = __data.onError;

						if( typeof cb == "function" ){
							cb( __elem.get( 0 ), err );
						}
						rej();
					});
				} else {
					__body.__fs_prom = res;
					__body.__fs_elem = __elem;
				}
			}
		}

		function __event( evt ){
			var __body = is_in_widget ? evt.currentTarget : document.body,
			__class = "lyteFullScreenActive",
			__prom = __body.__fs_prom;

			if( !__doc[ check_name ] ){
				check_previous();
				__body.classList.remove( __class );
				__body.removeEventListener( event_name, __event, true );
			} else if( __prom ){
				__body.classList.add( __class );
				fire_enter( __body.__fs_elem, __prom );
				delete __body.__fs_elem;
				delete __body.__fs_prom;
			}	
		}


		$L.prototype.fullscreen = function( obj ){
			var __cur = this.eq( 0 ),
			__ns = 'lyte_fullscreen';

			if( obj == "exit" ){
				var __body = is_in_widget ? get_widget_body( __cur.get( 0 ) ) : __doc.body;
				__body.classList.contains( 'lyteFullScreenActive' ) && document[ element_name ] && document[ exit_name ]();

				return this;
			} else if( obj == "element" ){
				return __doc.getElementsByClassName( 'lyteFullScreenElement' )[ 0 ];
			} else {
				obj = $L.extend( true, obj || {}, {
					properties : {}
				});

				var __cur = this.eq( 0 );

				return new Promise( function( res, rej ){
					if( __cur.data( __ns ) ){
						return fire_enter( __cur, res );
					} 

					__cur.data( __ns, obj );
					enter_fullscreen( __cur, res, rej );
				});
			}
		}
	}
})();