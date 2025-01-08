Lyte.Component.register("lyte-image-player", {
_template:"<template tag-name=\"lyte-image-player\"> <template is=\"if\" value=\"{{ltPropHeaderYield}}\"><template case=\"true\"><lyte-yield class=\"lyteImagePlayerHeaderYield\" yield-name=\"image-header\" lt-prop-current-item=\"{{ltPropCurrentItem}}\"></lyte-yield></template></template> <template is=\"if\" value=\"{{ltPropCurrentItem}}\"><template case=\"true\"><lyte-image-item aria-selected=\"{{ltPropCurrentItem.active}}\" id=\"{{item.id}}\" class=\"{{ltPropCurrentItem.class}}\" data-index=\"{{ltPropActive}}\" data-duration=\"{{ltPropCurrentItem.duration}}\" onclick=\"{{action('focus')}}\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"><lyte-yield yield-name=\"imageplayer\" lt-prop-current-item=\"{{ltPropCurrentItem}}\"></lyte-yield></template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropPrefetch,'!')}}\"><template case=\"true\"><img onload=\"{{action('load',event,this,ltPropCurrentItem)}}\" onerror=\"{{action('error',event,this,ltPropCurrentItem)}}\" src=\"{{ltPropCurrentItem.src}}\" alt=\"{{ltPropCurrentItem.alt}}\"></template></template></template></template> </lyte-image-item></template></template> <template is=\"if\" value=\"{{ltPropControls}}\"><template case=\"true\"><div class=\"lyteImagePlayerControl\"> <template is=\"if\" value=\"{{ltPropIcons.pauseplay}}\"><template case=\"true\"><button aria-label=\"{{ltPropIcons.pauseplay.label}}\" class=\"lyteImagePlayerPlayIcon\" onclick=\"{{action('togglePlay')}}\" tabindex=\"{{ltPropTabindex}}\" data-tabindex=\"{{ltPropDataTabindex}}\"></button></template></template> <div class=\"lyteImagePlayerDuration\">{{formattedDuration}}</div> <div class=\"lyteImagePlayerSlider\" onkeydown=\"{{action('keydown',event,this)}}\" onclick=\"{{action('move',event,this)}}\"> <div class=\"lyteImagePlayerFill\" style=\"{{fillWidth}}\"></div> <span tabindex=\"{{ltPropTabindex}}\" data-tabindex=\"{{ltPropDataTabindex}}\" role=\"slider\" aria-errormessage=\"{{ltPropCurrentItem.errorMessage}}\" aria-label=\"{{formattedDuration}}\" lt-prop-title=\"{{formattedDuration}}\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\" lt-prop-tooltip-style=\"{{ltPropTooltipStyle}}\" lt-prop-tooltip-class=\"{{ltPropTooltipClass}}\" aria-orientation=\"horizontal\" aria-valuemin=\"0\" aria-valuemax=\"{{totalDuration}}\" aria-valuenow=\"{{formattedDuration}}\" class=\"lyteImagePlayerSliderHandler\" style=\"{{handlerPosition}}\" onmousedown=\"{{action('mousedown',event,this)}}\" ontouchstart=\"{{action('mousedown',event,this)}}\"></span> <template items=\"{{highlightPoints}}\" item=\"item\" index=\"index\" is=\"for\"> <span class=\"lyteImagePlayerHighlight\" style=\"{{item}}\" data-index=\"{{index}}\"></span> </template> </div> <div class=\"lyteImagePlayerTotalDuration\">{{totalDuration}}</div> <template is=\"if\" value=\"{{ltPropIcons.fullscreen}}\"><template case=\"true\"><button aria-label=\"{{ltPropIcons.fullscreen.label}}\" class=\"lyteImagePlayerFullscreen\" lt-prop-title=\"{{ltPropIcons.fullscreen.title}}\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\" tabindex=\"{{ltPropTabindex}}\" data-tabindex=\"{{ltPropDataTabindex}}\" onclick=\"{{action('toggleFullScreen')}}\"></button></template></template> </div></template></template> <lyte-loader lt-prop-on-timeout=\"{&quot;errorMsg&quot;:&quot;Waiting for image to load&quot;,&quot;delayTime&quot;:10000}\" lt-prop-progress-bar=\"{&quot;mode&quot;: &quot;indefinite&quot;,&quot;show&quot;:false}\" lt-prop-in-line=\"true\" lt-prop-close-icon=\"false\" lt-prop-show=\"{{loaderShow}}\"></lyte-loader> <template is=\"if\" value=\"{{ltPropFooterYield}}\"><template case=\"true\"><lyte-yield class=\"lyteImagePlayerFooterYield\" yield-name=\"image-footer\" lt-prop-current-item=\"{{ltPropCurrentItem}}\"></lyte-yield></template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"text","position":[0,3,0]},{"type":"attr","position":[0,5]},{"type":"attr","position":[0,5,1],"attr":{"style":{"name":"style","dynamicValue":"fillWidth"}}},{"type":"attr","position":[0,5,3],"attr":{"style":{"name":"style","dynamicValue":"handlerPosition"}}},{"type":"attr","position":[0,5,5]},{"type":"for","position":[0,5,5],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"item"}}}]},{"type":"text","position":[0,7,0]},{"type":"attr","position":[0,9]},{"type":"if","position":[0,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[7]},{"type":"componentDynamic","position":[7]},{"type":"attr","position":[9]},{"type":"if","position":[9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0]}]}},"default":{}}],
_observedAttributes :["ltPropContent","ltPropPause","ltPropPlayBackRate","ltPropAutoplay","ltPropYield","ltPropCurrentItem","ltPropActive","ltPropDuration","ltPropControls","ltPropTabindex","ltPropDataTabindex","ltPropIncrement","ltPropTooltipStyle","ltPropTooltipConfig","ltPropTooltip","ltPropTooltipClass","ltPropHeaderYield","ltPropFooterYield","ltPropPrefetch","ltPropIcons","ltPropFullscreen","statusClass","duration","formattedDuration","totalDuration","fillWidth","handlerPosition","highlightPoints","prefetchImages","loaderShow"],

	data : function(){
		return {
			ltPropContent : Lyte.attr( "array", { default : [] } ),
			ltPropPause : Lyte.attr( 'boolean', { default : false } ),
			ltPropPlayBackRate : Lyte.attr( 'number', { default : 1 } ),
			ltPropAutoplay : Lyte.attr( 'boolean', { default : false } ),
			ltPropYield : Lyte.attr( 'boolean', { default : false } ),

			ltPropCurrentItem : Lyte.attr( 'object' ),

			ltPropActive : Lyte.attr( "number", { default : 0 } ),

			ltPropDuration : Lyte.attr( 'number', { default : 1000 } ),
			ltPropControls : Lyte.attr( 'boolean', { default : true } ),

			ltPropTabindex : Lyte.attr( 'number', { default : 0 } ),
			ltPropDataTabindex : Lyte.attr( 'number', { default : 0 } ),

			ltPropIncrement : Lyte.attr( 'number', { default : 500 } ),

			ltPropTooltipStyle : Lyte.attr( 'string', { default : '' } ),
            ltPropTooltipConfig : Lyte.attr( 'object', { default : { margin : 5, position : "top" } } ),
            ltPropTooltip : Lyte.attr( 'boolean', { default : true } ),
			ltPropTooltipClass : Lyte.attr( 'string', { default : "" } ),

			ltPropHeaderYield : Lyte.attr( 'boolean', { default : false } ),
			ltPropFooterYield : Lyte.attr( 'boolean', { default : false } ),

			ltPropPrefetch : Lyte.attr( 'boolean', { default : false } ),

			ltPropIcons : Lyte.attr( "object", { default : {
				pauseplay : {
					label : "Toggle play button"
				},
				fullscreen : {
					title : "Full screen",
					label : "Full screen"
				},
				playbackrate : {
					label : "Playback rate "
				}
			} } ),
			ltPropFullscreen : Lyte.attr( "boolean", { default : false } ),

			statusClass : Lyte.attr( 'string', { default : "", hideAttr : true } ),
			duration : Lyte.attr( 'number' ),
			formattedDuration : Lyte.attr( 'string', { default : "0.00", hideAttr : true } ),
			totalDuration : Lyte.attr( 'string', { default : "0.00", hideAttr : true } ),
			fillWidth : Lyte.attr( 'string' ),
			handlerPosition : Lyte.attr( 'string' ),

			highlightPoints : Lyte.attr( 'array' ),
			prefetchImages : Lyte.attr( "array" ),
			loaderShow : Lyte.attr( 'boolean', { default : false } )
		}		
	},

	update_active : function( value ){
		this.__manual = true;
		this.setData( 'ltPropActive', value );
		delete this.__manual;
	},

	move_fn : function( evt, __this, is_delay ){
		var is_rtl = _lyteUiUtils.getRTL(),
		bcr = __this.getBoundingClientRect(),
		__width = bcr.width,
		cur_pos = Math.abs( Math.round( bcr[ is_rtl ? 'right' : 'left' ] ) - Math.round( Math.max( bcr.left, Math.min( evt.clientX, bcr.right ) ) ) ),
		exp_time = Math.min( Math.max( 0, cur_pos ), __width ) / __width * this.get_total_duration(),
		limit = this.get_total_duration( exp_time ),
		remaining_dur = exp_time - limit.prev_duration,
		zero_trans = `transition-duration:0ms;`,
		is_end = exp_time == limit.total,
		perc = Math.min( 100, Math.max( 0, cur_pos/__width * 100 ) );

		this.setData({
			handlerPosition : `${zero_trans}--lyte-image-player-slider-handler-position:${perc}%;`,
			fillWidth :  `${zero_trans}--lyte-image-player-fill-width:${perc}%;`
		});

		window.requestAnimationFrame( () =>{
			window.requestAnimationFrame( () =>{

				this.__remaining_dur = is_end ? 0 : remaining_dur;

				var __fn = () =>{
					var ns = "ltPropActive",
					to_be = limit.index,
					__data = this.data;

					clearTimeout( this.__timeout );
					if( to_be == __data[ ns ] ){
						this.setData( 'duration', is_end ? exp_time : limit.prev_duration );

						this.original_duration( __data.duration )
						if( !__data.ltPropPause ){
							this.initiate_play();
						}
					} else {
						this.update_active( to_be );
					}
				};

				if( is_delay ){
					setTimeout( __fn, 200 );
				} else {
					__fn();
				}
			});
		});
	},

	togglePlay : function( __ns ){
		var ns = "ltProp" + ( __ns || "Pause" );
		if( !__ns && $L( this.$node ).hasClass( 'lyteImagePlayerFinished' ) ){
			this.$node.replay();
		} else {
			this.setData( ns, !this.data[ ns ] );
		}
	},

	mousemove : function( evt ){
		this.move_fn( evt, this.__elem );
	},

	mouseup : function( evt ){

		var doc = document,
		is_touch = evt.type == "touchend";

		doc.removeEventListener( evt.type, this.__mu, true );
		doc.removeEventListener( `${ is_touch ? 'touch' : 'mouse'}move`, this.__mm, true );

		this.setData( 'ltPropPause', this.__is_pause );

		this.$node.focus();

		delete this.__is_pause;
		delete this.__elem;
		delete this.__mm;
		delete this.__mu;
	},

	keydown : function( evt, __this ){
		var is_rtl = _lyteUiUtils.getRTL(),
		elem = __this.getElementsByClassName( 'lyteImagePlayerSliderHandler' )[ 0 ],
		bcr = elem.getBoundingClientRect(),
		outer_bcr = __this.getBoundingClientRect(),
		outer_width = outer_bcr.width,
		__fn = fact => {
			var totalDuration = this.get_total_duration(),
			__data = this.data,
			cur_dur = __data.ltPropIncrement || ( __data.ltPropContent[ __data.ltPropActive ] || {} ).duration || __data.ltPropDuration,
			positional_increase = cur_dur / totalDuration * outer_width,
			__clientX = bcr.left + bcr.width / 2 + fact * positional_increase;

			this.move_fn( { clientX : __clientX }, __this, true );
			__prevent = true;
		},
		__prevent;
		
		switch( evt.key ){
			case "ArrowRight" : {
				__fn( 1 );
			}
			break;
			case "ArrowLeft" : {
				__fn( -1 );
			}
			break;
			case "Home" : {
				this.move_fn( { clientX : outer_bcr[ is_rtl ? 'right' : 'left' ] }, __this, !!evt.type );
				__prevent = true;
			}
			break;
			case "End" : {
				this.move_fn( { clientX : outer_bcr[ is_rtl ? 'left' : 'right' ] }, __this, true );
				__prevent = true;
			}
			break;
			case "Enter" : 
			case " " : {
				__prevent = true;
				this.togglePlay();
			}	
			break;
		}			

		__prevent && evt.type && evt.preventDefault();
	},

	actions : {
		mousedown : function( evt, __this ){
			var cb = "onBeforeSelect";

			if( this.getMethods( cb ) && this.executeMethods( cb, evt, __this, this.$node ) == false ){
				return;
			}

			var is_touch,
			__evt = ( ( is_touch = evt.touches ) || [ evt ] )[ 0 ],
			doc = document;

			this.__is_pause = this.data.ltPropPause;
			this.__elem = __this.parentNode;

			this.setData( 'ltPropPause', true );

			doc.addEventListener( `${ is_touch ? 'touch' : 'mouse'}move`, this.__mm = this.mousemove.bind( this ), true );
			doc.addEventListener( is_touch ? 'touchend' : "mouseup", this.__mu = this.mouseup.bind( this ), true );

			evt.preventDefault();
		},

		focus : function(){
			this.togglePlay();
			this.$node.focus();
		},

		togglePlay : function(){
			this.togglePlay();
		},

		toggleFullScreen : function(){
			this.togglePlay( "Fullscreen" );
		},

		keydown : function( evt, __this ){
			this.keydown( evt, __this );
		},

		move : function( evt, __this ){

			if( this.__prevent_click ){
				return;
			}

			this.move_fn( evt, __this );

			window.requestAnimationFrame( () =>{
				this.$node.focus();
			});
		},
		load : function( evt, __this, obj ){
			this.image_load( evt, __this, obj );
		},

		error : function( evt, __this, obj ){	
			this.image_error( evt, __this, obj );
		}
	},

	image_load : function( evt, __this, obj ){
		Lyte.objectUtils( obj, 'add', 'isLoaded', true );
		this.setData( 'statusClass', `lytePlayerImageLoaded ${ obj.highlight ? "lyteImagePlayerHasHighlight" : ""}` );

		if( !this.data.ltPropPause ){
			this.initiate_play();
		}

		var cb = "onImageLoad";
		this.getMethods( cb ) && this.executeMethods( cb, evt, __this, obj, this.$node );
	},

	image_error : function( evt, __this, obj ){
		Lyte.objectUtils( obj, 'add', 'isError', true );
		this.setData( 'statusClass', "lytePlayerImageError" );
		
		!this.data.ltPropPause && this.move_next_image();

		var cb = "onImageError";
		this.getMethods( cb ) && this.executeMethods( cb, evt, __this, obj, this.$node );
	},

	move_next_image : function(){
		var __data = this.data,
		__content = __data.ltPropContent,
		__active = __data.ltPropActive;

		if( __active + 1 < __content.length ){
			this.update_active( __active + 1 );
		} else {
			this.calculate_duration( __active + 1 );
			this.setData({
				// ltPropPause : true,
				statusClass : "lyteImagePlayerFinished"
			});

			var cb = "onFinish";
			this.getMethods( cb ) && this.executeMethods( cb, this.$node );
		}
	},

	initial_active : function( active ){
		var __dur = this.calculate_duration( active, true );

		this.original_duration( __dur, true, true );
	},

	didConnect : function(){
		var __data = this.data,
		$node = this.$node;

		if( __data.ltPropPause ){
			$L( this.$node ).addClass( 'lyteImagePlayerPaused' );
		}


		this.initial_active( __data.ltPropActive );

		this.setData( 'ltPropPause', !__data.ltPropAutoplay );
		
		this.create_highlights();
		
		this.setData( 'loaderShow', true );

		if( __data.ltPropPrefetch ){
			this.do_prefetch();
		} else {
			window.requestAnimationFrame( () =>{
				window.requestAnimationFrame( () =>{
					this.setup_active( __data.ltPropActive );
					var cb = "afterRender";
					this.getMethods( cb ) && this.executeMethods( cb, this.$node );
				});
			});
		}

		[ "go_to", "refresh", "replay", "focus" ].forEach( item => $node[ item ] = this[ item ].bind( this ) );
	},

	do_prefetch : function(){
		var content = this.data.ltPropContent,
		arr = [],
		len = content.length,
		loaded = 0,
		fn = ( item, name ) =>{
			item && Lyte.objectUtils( item, 'add', name, true );
			loaded++;

			if( loaded == len ){
				this.setup_active( this.data.ltPropActive );
				var cb = "afterRender";
				this.getMethods( cb ) && this.executeMethods( cb, this.$node );
			}
		};

		content.forEach( ( item, index ) =>{
			var img = new Image();
				
			img.onload = fn.bind( this, item, 'isLoaded' );
			img.onerror = fn.bind( this, item, 'isError' );

			arr.push( img );

			img.alt = item.alt || "";
			img.setAttribute( "data-index", index );
			img.src = item.src || "";

		} );

		this.setData( {
			prefetchImages : arr,
			statusClass : "lytePlayerImageLoading"
		} );
	},

	create_highlights : function(){
		var content = this.data.ltPropContent,
		arr = [],
		len = content.length,
		indiv_width = `;--lyte-image-player-fill-width:${ 100 / len }%;`

		content.forEach( ( item, index ) =>{
			if( item.highlight ){
				arr.push( `--lyte-image-player-highlight-position:${ index / len * 100 }%${indiv_width}` )
			}
		});

		this.setData( "highlightPoints", arr );
	},

	didDestroy : function(){
		clearTimeout( this.__timeout );
		this.data.prefetchImages = [];
	},

	go_to : function( index ){
		this.setData( 'ltPropActive', index );
	},

	refresh : function(){
		this.didConnect();
	},

	focus : function(){
		window.requestAnimationFrame( () =>{
			$L( '.lyteImagePlayerSliderHandler', this.$node ).get( 0 ).focus({
				preventScroll : true
			});
		});
	},

	replay : function(){
		// clearTimeout( this.__timeout );
		window.requestAnimationFrame( () =>{
			window.requestAnimationFrame( () =>{
				this.setData({
					ltPropActive : 0,
					ltPropPause : false
				});
			});
		});
	},

	get_current_duration : function( index ){
		var __data = this.data,
		content = __data.ltPropContent;

		if( index == void 0 ){
			index = __data.ltPropActive;
		}

		return content[ index ].duration || __data.ltPropDuration;
	},

	duration_obs : function( arg ){
		this.original_duration( arg.newValue );
	}.observes( 'duration' ),

	original_duration : function( value, frm_initial, force ){
		var __data = this.data,
		is_pause = __data.ltPropPause,	
		total = this.get_total_duration();

		this.setData({
			formattedDuration : this.format_time( value ),
			totalDuration : this.format_time( total )
		});		

		if( !is_pause || force ){
			var __width = this.update_width( this.calculate_duration( this.data.ltPropActive + ( frm_initial ? 0 : 1 ), true ), total, force ? 0 : ( this.get_current_duration() - ( this.__remaining_dur || 0 ) ) );
			this.setData({
				handlerPosition : __width.replace( "fill-width", 'slider-handler-position' ),
				fillWidth : __width
			});
		}
	},

	get_total_duration : function( ret ){ 
		var __data = this.data,
		content = __data.ltPropContent,
		__dur = __data.ltPropDuration,
		sum = 0,
		len = content.length,
		is_valid = ret != void 0;

		for( var i = 0; i < len; i++ ){
			var cur = content[ i ],
			cur_dur = cur.duration || __dur;

			sum += cur_dur;

			if( is_valid && ret <= sum ){
				return {
					index : i,
					prev_duration : sum - cur_dur,
					total : sum
				};
			}
		}

		return sum;
	},

	update_width : function( current, total, dur ){
		return `--lyte-image-player-fill-width:${ current / total * 100 }%;transition-duration:${dur}ms`;
	},

	format_time : function( value ){
		var abs = Math.round( value / 1000 ),
		secs = abs % 60,
		mins_check = parseInt( abs / 60 ),
		mins = mins_check % 60,
		hrs = parseInt( mins_check / 60 );
		
		return `${ hrs ? ( hrs + ":" ) : "" }${ mins }:${ secs.toString().padStart( 2, 0 ) }`;
	},

	active_obs : function( arg ){

		if( this.__manual ){
			this.setup_active( arg.newValue );
		} else {	
			this.initial_active( arg.newValue );

			window.requestAnimationFrame( function(){
				this.setup_active( arg.newValue );
			}.bind( this ) );
		}
	}.observes( 'ltPropActive' ),

	pause_obs : function( arg ){
		var cb,
		fn = "remove",
		ns = "lyteImagePlayer";

		clearTimeout( this.__timeout );

		if( arg.newValue ){
			cb = "onPause";
			fn = "add";

			var slider = this.$node.getElementsByClassName( `${ns}Slider` )[ 0 ],
			handler = slider.getElementsByClassName( `${ns}SliderHandler` )[ 0 ],
			bcr = handler.getBoundingClientRect();

			this.move_fn( { clientX : bcr.left + bcr.width / 2 }, slider );
		} else {
			cb = "onPlay";
			this.original_duration( this.data.duration );
			this.initiate_play();
		}

		$L( this.$node )[ `${ fn }Class` ]( `${ns}Paused` );

		this.getMethods( cb ) && this.executeMethods( cb, this.$node );
	}.observes( 'ltPropPause' ),

	fullscreen_obs : function( arg ){
		var item = arg.item,
		$node = $L( this.$node );

		if( arg.newValue ){
			var fn = cb =>{
				this.getMethods( cb ) && this.executeMethod( cb, this.$node );
			};

			$node.fullscreen({
				onEnter : () =>{
					fn( 'onFullscreenEnter' );
				},
				onExit : () =>{
					this.setData( item, false );
					fn( 'onFullscreenExit' );
				}
			});
		} else {
			$node.fullscreen( "exit" );
		}
	}.observes( 'ltPropFullscreen' ),

	cls_obs : function( arg ){
		$L( this.$node ).removeClass( arg.oldValue ).addClass( arg.newValue );
	}.observes( 'statusClass' ),

	initiate_play : function(){

		var __data = this.data,
		elem = __data.ltPropCurrentItem,
		dur = elem.duration || __data.ltPropDuration;

		if( elem ){
			this.__timeout = setTimeout( () =>{
				delete this.__remaining_dur;
				this.move_next_image();
			}, dur - ( this.__remaining_dur || 0 ) );
		}
	},

	calculate_duration : function( index, ret ){
		var __data = this.data,
		__dur = __data.ltPropDuration,
		__total = 0,
		__content = __data.ltPropContent,
		__len = __content.length;

		for( var i = 0; i < index; i++ ){
			if( i >= __len ){
				continue;
			}
			__total += ( __content[ i ].duration || __dur );
		}

		if( ret ){
			return __total;
		}

		this.setData( 'duration', __total );
	},

	setup_active : function( index ){

		var __data = this.data,
		elems = __data.ltPropContent,
		to_active = elems[ index ],
		__Lc = Lyte.objectUtils;

		if( !to_active || to_active == __data.ltPropCurrentItem ){
			return;
		}

		if( __data.ltPropPrefetch ){
			this.setData( 'ltPropCurrentItem', to_active );
			var imageItem = this.$node.getElementsByTagName( 'lyte-image-item' )[ 0 ],
			children = imageItem.children,
			img = __data.prefetchImages[ index ];

			if( children.length ){
				children[ 0 ].remove();
			}

			imageItem.appendChild( img );

			this[ `image_${ to_active.isLoaded ? "load" : "error" }` ]( {}, img, to_active );
		} else {
			__Lc( to_active, 'add', 'isLoaded', false );
			__Lc( to_active, 'add', 'isError', false );

			this.setData({
				statusClass : "lytePlayerImageLoading",
				ltPropCurrentItem : to_active
			});
		}

		this.calculate_duration( index );

		var cb = "onProgress";
		this.getMethods( cb ) && this.executeMethods( cb, to_active, this.$node );
	}
});