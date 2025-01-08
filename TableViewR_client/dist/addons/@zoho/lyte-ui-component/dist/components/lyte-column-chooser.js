/**
 * This component is used to select user desired items from the list of available items
 * @component  lyte-column-chooser
 * @version 3.64.0
 * @dependency lyte-checkbox
 *  /components/lyte-checkbox
 *  /theme/compiledCSS/default/ltr/lyte-ui-checkbox.css 
 */

Lyte.Component.register("lyte-column-chooser", {
_template:"<template tag-name=\"lyte-column-chooser\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"columnChooser\" class=\"lyteColumnChooser\" lt-prop-header=\"{{ltPropHeader}}\"></lyte-yield> </template><template case=\"false\"> <div class=\"lyteColumnChooser\"> <template is=\"for\" items=\"{{ltPropHeader}}\" item=\"item\" index=\"index\"><template is=\"if\" value=\"{{item.columnChooser}}\"><template case=\"true\"> <lyte-checkbox lt-prop-checked=\"{{lbind(item.columnChooser.selected)}}\" lt-prop-label=\"{{expHandlers(item.name,'||',item.children[0].name)}}\" lt-prop-disabled=\"{{item.columnChooser.disabled}}\" on-checked=\"{{method('checked',item,index)}}\" on-unchecked=\"{{method('unchecked',item,index)}}\" parent_index=\"index_{{index}}\"></lyte-checkbox> </template></template></template> </div> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}]}},"default":{}}],
_observedAttributes :["ltPropHeader","ltPropSortable","ltPropYield"],

	data : function(){
		return {
			/**
			 * @componentProperty {array} ltPropHeader
			 * @default []
			 */
			ltPropHeader : Lyte.attr( 'array', { default : [] } ),
			ltPropSortable : Lyte.attr( 'boolean', { default : false } ),
			ltPropYield : Lyte.attr( 'boolean', { default : false } )
		}		
	},

	add2Sort : function( __src, __target, __grp ){
		var __newelem = __grp.children[ __target ];
		__grp.addToSortable( __newelem );
	},

	sort_obs : function( arg ){

		var __this = this,
		__data = __this.data;

		if( !__data.ltPropYield ){
			var __elem = $L( '.lyteColumnChooser', __this.$node );
			if( __data.ltPropSortable ){
				__elem.sortable({
					onSelect : function(){
						return __this.execute( "onBeforeSelect", arguments );
					},
					onBeforeDrop : function( __checkbox, __grp, __place, __src, __target ){
						if( __src != __target ){

							if( !__grp.classList.contains( 'lyteColumnChooser' ) ){
								__grp = __grp.parentNode;
							}

							window.requestAnimationFrame( __this.add2Sort.bind( __this, __src, __target, __grp ) );

							return __this.execute( "onBeforeDrop", arguments );
						}
					},
					onDrop : function(){
						__this.execute( "onDrop", arguments );
					}
				})
			} else if( arg ) {
				__elem.sortable( "destroy" );
			}
		} else if( !arg ) {

			var $node = this.$node;

			$node.switchPositions = this.switch.bind( this );
			$node.checked = this.checked.bind( this );
			$node.unchecked = this.unchecked.bind( this );

			var cb = "onRender";
			this.getMethods( cb ) && this.executeMethod( cb, this.$node );
		}
	}.observes( 'ltPropSortable' ).on( 'didConnect' ),

	execute : function( cb, args ){
		if( this.getMethods( cb ) ){
			args = Array.from( args );
			args.unshift( cb );
			return this.executeMethod.apply( this, args );
		}
	},

	switch : function( __old, __new ){
		var __elem = this.$node.getElementsByClassName( 'lyteSortableParent' )[ 0 ];

		if( __elem ){
			var place_index,
			__children = Array.from( __elem.children ).filter( function( item, index ){
				if( item.classList.contains( 'lyteSortablePlaceholder' ) ){
					place_index = index;
					return false;
				}
				return true;
			}),
			__src = __children[ __old ],
			__target = __children[ __new ],
			__header = this.data.ltPropHeader,
			__len = __header.length,
			__max = Math.max( __old, __new ),
			__count = 0,
			__over = 0;

			for( var i = 0; i < __len; i++ ){
				var __cur = __header[ i ];
				if( __cur.columnChooser ){
					if( __count == __old ){
						__src.setAttribute( "parent_index", i );
						__over++;
					} else if( __count == __new ){
						__target.setAttribute( "parent_index", i );
						__over++;
					}

					__count++;

					if( __over == 2 ){
						break;
					}
				}
			}

			if( this.getMethods( 'onBeforeDrop' ) ){
				this.executeMethod( 'onBeforeDrop', __src, __target, __elem, __old, __new );
			}

			window.requestAnimationFrame( this.add2Sort.bind( this, __old, __new > place_index ? __new + 1 : __new, __elem ) );

			return false;
		}
	},

	checked : function(){
		this.execute( 'onChecked', arguments );
	},	

	unchecked : function(){
		this.execute( 'onUnchecked', arguments );
	},

	methods : {
		checked : function(){
			/**
			  * @method onChecked
			  * @version 3.64.0
			  */
			this.execute( "onChecked", arguments );
		},

		unchecked : function(){
			/**
			  * @method onChecked
			  * @version 3.64.0
			  */
			this.execute( "onUnchecked", arguments );
		}
	}
});


/**
 * @syntax Non Yielded
 * <lyte-column-chooser></lyte-column-chooser>
 */