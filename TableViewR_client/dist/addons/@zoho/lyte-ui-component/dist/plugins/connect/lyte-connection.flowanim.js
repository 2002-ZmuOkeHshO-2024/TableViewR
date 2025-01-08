;( function(){
	function animatePath( arg ){
		return new Promise( function( res, rej ){
			try{
				var connector = arg.connector,
				duration = arg.duration || 2000, 
				style = arg.style || { 
					fill : "none",
					stroke : "black",
					"stroke-width" : 3 
				},
				pts = $L( connector ).data( 'absolute_points' ),
				first = pts[ 0 ],
				last = pts[ pts.length - 1 ],
				neg_x = Math.min( 0, last.x - first.x ),
				neg_y = Math.min( 0, last.y - first.y ),
				x_off = ( arg.x_off || 12 ) - neg_x,
				y_off = ( arg.y_off || 12 ) - neg_y,
				timing_fun = arg.timing_function || "ease",
				relative_pts = pts.map( item =>{
					return [ item.x - first.x + x_off, item.y - first.y + y_off ]
				}),
				ns = "ht" + "tp://www.w3.org/2000/svg",
				elem = document.createElementNS( ns, "polyline" ),
				anime_elem = document.createElementNS( ns, "animate" ),
				indiv_dur = Math.max( 1, duration / ( pts.length - 1 ) ),
				happened = 0,
				line_len = 0,
				raf_delay = false;

				if( timing_fun == "linear" ){
					for( var i = 0; i < pts.length - 1; i++ ){
						var cur = pts[ i ],
						next = pts[ i + 1 ];

						line_len += ( Math.abs( cur.x - next.x ) + Math.abs( cur.y - next.y ) );
					}
				}

				var construct_arg = function( len, extra ){
					var str = "",
					cur;

					for( var i = 0; i <= len; i++ ){
						cur = relative_pts[ i ];
						str += ( cur[ 0 ] + "," + cur[ 1 ] ) + " ";
					}

					if( extra ){
						str += ( cur[ 0 ] + "," + cur[ 1 ] );
					}

					return str.trim();
				},

				do_anime = function(){
					var __first = relative_pts[ happened ],
					__second = relative_pts[ happened + 1 ];

					if( __second ){
						var __from = construct_arg( happened, true ),
						__to = construct_arg( happened + 1 );

						anime_elem.setAttribute( "from", __from );
						anime_elem.setAttribute( "to", __to );

						if( timing_fun == "linear" ){
							var cur_len = Math.abs( __first[ 0 ] - __second[ 0 ] ) + Math.abs( __first[ 1 ] - __second[ 1 ] );
							anime_elem.setAttribute( "dur", ( indiv_dur = Math.max( 1, Math.round( duration / line_len * cur_len ) ) ) + "ms" );
						}

						if( __from == __to ){
							endEvt();
						} else {
							anime_elem.beginElement();

							if( indiv_dur > 16 ){
								raf_delay = true;
								window.requestAnimationFrame( function(){
									raf_delay = false;
								});
							}
						}
					} else {
					  window.requestAnimationFrame( function(){
						elem.remove();
						res(); 
					  });
					}
				},
				endEvt = function(){
					if( raf_delay ){
						return;
					}
					if( anime_elem.getAttribute( "from" ) ){
						raf_delay = false;
						happened++;
						do_anime();
					}
				};

				$L( elem ).css( style );

				anime_elem.setAttribute( "attributeName", "points" );
				anime_elem.setAttribute( "begin", "0s" );
				anime_elem.setAttribute( 'calcMode', 'linear' );
				anime_elem.setAttribute( 'stroke', style.stroke );
				
				if( timing_fun == "ease" ){
					anime_elem.setAttribute( "dur", indiv_dur + "ms" );
				}

				anime_elem.setAttribute( "attributeType", "XML" );
				anime_elem.addEventListener( "endEvent", endEvt );

				elem.classList.add( "lyteConnectFlowAnimation" );
				elem.appendChild( anime_elem );

				connector.appendChild( elem );

				window.requestAnimationFrame( function(){
					window.requestAnimationFrame( do_anime );
				});
			} catch( e ){
				rej( e, arg );
			}
		});
	}


	$L.flowanimation = function( options ){
		return animatePath( options );
	}
} )();