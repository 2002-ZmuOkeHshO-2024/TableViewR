Lyte.Component.register("lyte-gradient-slider", {
_template:"<template tag-name=\"lyte-gradient-slider\"> <template is=\"if\" value=\"{{ltPropControls}}\"><template case=\"true\"><div class=\"lyteGradientControls\"> <span class=\"lyteGradientInsert\" onclick=\"{{action('insert',event)}}\"></span> <span class=\"lyteGradientRemove\" onclick=\"{{action('remove',event)}}\"></span> </div></template></template> <div class=\"lyteGradientFillContainer\" style=\"background-image: {{ltPropBackgroundImage}};\"> <template items=\"{{ltPropStop}}\" item=\"item\" index=\"index\" is=\"for\"><span onfocus=\"{{action('focus',this)}}\" class=\"lyteGradientHandler\" tabindex=\"{{ltPropTabIndex}}\" data-index=\"{{index}}\" onmousedown=\"{{action('mousedown',event,item)}}\" ontouchstart=\"{{action('mousedown',event,item)}}\" onkeydown=\"{{action('keydown',event,item)}}\" aria-valuemin=\"0\" aria-valuemax=\"1\" aria-valuenow=\"{{item.offset}}\" aria-orientation=\"horizontal\" aria-valuetext=\"{{item.color}} {{item.offset}}\" style=\"{{lyteGradientSliderHandlerPosition(item.color,item.offset)}}\"></span></template> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"attr","position":[0,3]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'background-image: '","ltPropBackgroundImage","';'"]}}}},{"type":"attr","position":[3,1]},{"type":"for","position":[3,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteGradientSliderHandlerPosition","args":["item.color","item.offset"]}}}}]}],
_observedAttributes :["ltPropControls","ltPropMinCount","ltPropMaxCount","ltPropIncrement","ltPropReadonly","ltPropTabIndex","ltPropBackgroundImage","ltPropStop","ltPropFocus"],


	init : function(){
		this.setData( 'ltPropStop', this.sort_stops( this.data.ltPropStop ) );

		this.$node.insertHandler = function( index, obj ){
			if( this.data.ltPropReadonly ){
				return;
			}

			var stops = this.data.ltPropStop;

			if( index == void 0 ){
				index = stops.length;
			}

			if( stops.length == this.data.ltPropMaxCount ){
				return;
			}

			if( !obj ){
				var __prev = stops[ index - 1 ] || stops[ index + 1 ];
				obj = {
					offset : Math.max( 0, Math.min( 1, __prev.offset + this.data.ltPropIncrement ) ),
					color : __prev.color
				}
			}

			Lyte.arrayUtils( stops, "insertAt", index, obj );
			this.update_bg();

		}.bind( this );

		this.$node.removeHandler = function( index, __evt ){
			if( this.data.ltPropReadonly ){
				return;
			}
			if( index == void 0 ){
				this.__remove( __evt || {} );
			} else {	
				this.delete_handler( this.get_elem( index ), __evt || {} );
			}
		}.bind( this );

		this.$node.focus = function( index ){
			var cur = this.get_elem( index );
			cur && cur.focus();
		}.bind( this );

		this.$node.updateHandler = function( key, value, index ){
			var elem,
			__index;

			if( index == void 0 ){
				elem = this.get_active();
			} else {
				elem = this.get_elem( index );
			}
			__index = elem.getAttribute( "data-index" );

			var obj =  this.data.ltPropStop[ __index ];

			if( obj[ key ] == value ){
				return;
			}

			Lyte.objectUtils( obj, "add", key, value );
			this.update_value( parseFloat( elem.style.getPropertyValue('--gradientsliderposition' ) ), parseInt( __index ) );
		}.bind( this );

		this.$node.getHandler = function( index ){
			var elem,
			__index;

			if( index == void 0 ){
				elem = this.get_active();
			} else {
				elem = this.get_elem( index );
			}
			__index = elem.getAttribute( "data-index" );

			return{
				elem : elem,
				data : this.data.ltPropStop[ __index ]
			}
		}.bind( this );
	},

	get_elem : function( index ){
		var elems = this.$node.getElementsByClassName( 'lyteGradientHandler' ),
		cur = elems[ index || 0 ];

		return cur;
	},
	
	data : function(){
		return {

			ltPropControls : Lyte.attr( 'boolean', { default : true } ),
			ltPropMinCount : Lyte.attr( 'number', { default : 2 } ),
			ltPropMaxCount : Lyte.attr( 'number', { default : 10 } ),
			ltPropIncrement : Lyte.attr( 'number', { default : 0.05 } ),
			ltPropReadonly : Lyte.attr( "boolean", { default : false } ),
			ltPropTabIndex : Lyte.attr( 'string', { default : "0" } ),
			ltPropBackgroundImage : Lyte.attr( 'string' ),
			ltPropStop : Lyte.attr( "array", { default : [
				{
					"color": "rgb(46,213,221)",
					"offset": "0" 
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.3524229074889868"
				},
				{
					"color": "rgb(142,224,230)",
					"offset": "0.5"
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.5330396"
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.5770925"
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.62114537"
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.66519827"
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.7092511"
				},
				{
					"color": "rgb(66,195,201)",
					"offset": "0.8590308370044053"
				},
				{
					"color": "rgb(242,72,0)",
					"offset": "1"
				}
			] } ),

			ltPropFocus : Lyte.attr( 'boolean', { default : false } )
		}		
	},

	focus_obs : function(){
		if( this.data.ltPropFocus ){
			this.setData( 'ltPropFocus', false );
			this.$node.focus();
		}
	}.observes( 'ltPropFocus' ).on( 'didConnect' ),

	didConnect : function(){
		this.update_bg();
	},

	update_bg : function(){
		var stop = this.data.ltPropStop,
		style = "linear-gradient( to " + ( this.get_rtl() ? "left" : "right" );

		stop.forEach( ( item, index ) =>{
			var prev = stop[ index ] || { offset : 0 };
			style += `,${ item.color } ${ parseFloat( prev.offset ) * 100 }%`;
		} );

		this.setData( "ltPropBackgroundImage", style + ")" );
	},

	sort_stops : function( arr ){
		return arr.slice().sort( ( a, b ) => {
			return parseFloat( a.offset ) - parseFloat( b.offset );
		} );
	},

	listener : function( ns, is_tch ){
		document[ ns + "EventListener" ]( is_tch ? "touchmove" : "mousemove", this.__move, true );
		document[ ns + "EventListener" ]( is_tch ? "touchend" : "mouseup", this.__up, true );
	},

	mousemove : function( evt ){
		var clientX = evt.clientX,
		fact = this.get_rtl() ? -1 : 1
		diff = ( clientX - this.__clientX ) * fact,
		elem = this.__elem,
		position = parseFloat( elem.style.getPropertyValue('--gradientsliderposition') || 0 ),
		width = this.$node.getBoundingClientRect().width,
		new_width = ( position + diff / width * 100 );

		if( new_width > 100 ){
			diff = ( 100 - position ) * width / 100;
			new_width = 100;
			clientX = diff + this.__clientX;
		} else if( new_width < 0 ){
			diff = ( 0 - position ) * width / 100;
			new_width = 0;
			clientX = diff + this.__clientX;
		}

		elem.style.setProperty( '--gradientsliderposition', new_width + "%" ),
		cb = "onDrag";

		this.__clientX = clientX;
		
		evt.preventDefault();

		this.getMethods( cb ) && this.executeMethod( cb, evt, elem, this.$node );
	},

	mouseup : function( evt ){

		this.listener( "remove", evt.type == "touchend" );
		this.$node.classList.remove( "lyteGradientSliderHandlerDown" );

		var elem = this.__elem,
		parentNode = elem.parentNode,
		index = this.update_value( parseFloat( elem.style.getPropertyValue('--gradientsliderposition' ) ), parseInt( elem.getAttribute( "data-index" ) ) );

		elem = parentNode.children[ index ];
		elem.focus();
		elem.classList.remove( 'lyteGradientHandelerSelected' );

		delete this.__clientX;
		delete this.__move;
		delete this.__up;
		delete this.__elem;
	},

	update_value : function( offset, index ){
		var stop = this.data.ltPropStop,
		cur = stop[ index ],
		cb = "onChange",
		old_value = cur.offset;

		Lyte.objectUtils( cur, "add", "offset", offset / 100 );
		
		var ret = this.update_order( cur );

		this.getMethods( cb ) && this.executeMethod( cb, cur, old_value, cur.offset, this.$node );

		return ret;
	},

	update_order : function( cur ){
		var arr =  this.data.ltPropStop,
		modified = this.sort_stops( arr ),
		old_index = arr.indexOf( cur ),
		new_index = modified.indexOf( cur );

		if( old_index != new_index ){
			Lyte.arrayUtils( arr, 'removeAt', old_index );
			Lyte.arrayUtils( arr, 'insertAt', new_index, cur );
		}
		this.update_bg();
		
		return new_index;
	},

	get_rtl : function(){
		return _lyteUiUtils.getRTL() == true;
	},

	delete_handler : function( elem, evt ){
		var cb = "onBeforeDelete";

		if( this.getMethods( cb ) && this.executeMethod( cb, evt, elem, this.$node ) == false ){
			return;
		}

		var index = parseInt( elem.getAttribute( 'data-index' ) ),
		stop = this.data.ltPropStop,
		min = this.data.ltPropMinCount,
		parentNode = elem.parentNode;

		if( stop.length <= min ){
			return;
		}

		if( evt.type == "keydown" ){
			evt.preventDefault();
		}

		Lyte.arrayUtils( stop, "removeAt", index );
		this.update_bg();

		var __cur = parentNode.children[ index - 1 ] || parentNode.children[ index ];

		if( __cur ){
			__cur.focus();
		}

		this.getMethods( cb = "onDelete" ) && this.executeMethod( cb, evt, index, this.$node );
	},

	__remove : function( evt ){

		var active = this.get_active();

		if( this.$node.contains( active ) ){
			this.delete_handler( active, evt );
		} else {
			this.delete_handler( $L( this.$node.getElementsByClassName( 'lyteGradientHandler' ) ).get( -1 ), evt );
		}
	},

	get_active : function(){
		return this.$node.getElementsByClassName( 'lyteGradientSliderActive' )[ 0 ] || this.update_active( $L( this.$node.getElementsByClassName( 'lyteGradientHandler' ) ).get( -1 ) );
	},

	update_active : function( __this ){
		var  cls = "lyteGradientSliderActive",
		cb = "onHandlerChange",
		index = parseInt( __this.getAttribute( 'data-index' ) );

		$L( this.$node.getElementsByClassName( cls ) ).removeClass( cls );
		$L( __this ).addClass( cls );

		this.getMethods( cb ) && this.executeMethod( cb, __this, this.data.ltPropStop[ index ], this.$node );

		return __this;
	},

	actions : {

		focus : function( __this ){
			this.update_active( __this );
		},

		insert : function( evt ){
			this.$node.insertHandler();
		},

		remove : function( evt ){
			this.$node.removeHandler( void 0, evt );
		},

		mousedown : function( evt, item ){

			if( this.data.ltPropReadonly ){
				return;
			}

			var target = evt.target,
			is_tch = evt.type == "touchstart",
			ev = evt;

			if( is_tch ){
				if(  evt.touches.length > 1 ){
					return;
				}
				evt = evt.touches[ 0 ];
			}

			var cb = "onBeforeSelect";

			if( this.getMethods( cb ) && this.executeMethod( cb, ev, item, this.$node ) == false ){
				return;
			}

			ev.preventDefault();

			this.__clientX = evt.clientX;
			this.__move = this.mousemove.bind( this );
			this.__up = this.mouseup.bind( this );
			this.__elem = target;

			this.listener( "add", is_tch );

			cb = "onSelect";

			this.$node.classList.add( "lyteGradientSliderHandlerDown" );
			target.classList.add( 'lyteGradientHandelerSelected' );

			this.getMethods( cb ) && this.executeMethod( cb, ev, item, this.$node );
		},

		keydown : function( evt ){
			if( this.data.ltPropReadonly ){
				return;
			}

			var active = this.get_active();

			if( this.$node.contains( active ) ){
				var fact = 0,
				increment = this.data.ltPropIncrement,
				rtl_fact = this.get_rtl() ? -1 : 1;
				
				switch( evt.key ){
					case "ArrowLeft" : {
						fact = -1 * increment * rtl_fact;
					}
					break;
					case "ArrowRight" : {
						fact = increment * rtl_fact;
					}
					break;
					case "Home" : {
						fact = -1;
					}
					break;
					case "End" : {
						fact = 1;
					}
					break;
					case "Backspace" : {
						return this.delete_handler( active, evt );
					}	
					break;
				}
				
				if( fact ){

					var cb = "onBeforeNavigation";

					if( this.getMethods( cb ) && this.executeMethod( cb, evt, active, this.$node ) == false ){
						return;
					}

					evt.preventDefault();
					var index = parseInt( active.getAttribute( 'data-index' ) ),
					cur = this.data.ltPropStop[ index ],
					new_value = Math.min( 1, Math.max( 0, parseFloat( cur.offset ) + fact ) ),
					parentNode = active.parentNode;

					index = this.update_value( parseFloat( new_value * 100 ), index );

					active = parentNode.children[ index ];
					active.focus();					
				}
			}
		}
	}
});

Lyte.Component.registerHelper( "lyteGradientSliderHandlerPosition", function( color, offset ){
	return `--gradientsliderposition:${ parseFloat( offset ) * 100 }%;--gradientsliderbackground:${ color }`;
} );