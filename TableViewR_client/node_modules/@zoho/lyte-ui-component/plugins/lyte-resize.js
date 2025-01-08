;( function(){
    var isRtl,
    selection_class = 'lyteResizeSelected';

    function rtlfunc( lft, bcr, ww ) {
              if( isRtl ) {
                if( bcr ) {
                    if( lft == 'right' ) {
                        return ww - bcr.left;
                    } else if( lft == 'clientX' ) {
                        return ww - bcr.clientX
                    }
                    return ww - bcr.right;
                } else if( lft == 'left' ) {
                    return 'right';
                } else if( lft == "right" ){
                    return "left"
                }
              }
              return bcr ? bcr[ lft ] : lft;
        }

    function destroy(){
        var remove_global_events = function( win_elem, elem ){
            if( win_elem && elem.contains( win_elem ) ){
                document.removeEventListener( 'mousemove', mousemove, true );
                document.removeEventListener( 'mouseup', mouseup, true );
                document.removeEventListener( 'touchmove', mousemove, true );
                document.removeEventListener( 'touchend', mouseup, true );
                mouseup( {}, true );
            }
        };
        this.each( function( index, item ){
            var current = $L( item ),
            activeElems = current.data( 'activeElems' ) || {},
            elem = current.get( 0 ),
            resizeData = elem._resizeData,
            win_elem = window._resizeelem;

            if( !resizeData ){
                return;
            }

            remove_global_events( win_elem, elem );

            if( resizeData.hasOwnProperty( "tabIndex" ) ){
                elem.removeEventListener( "keydown", keydown, true );
            }

            for( var key in activeElems ){  
                activeElems[ key ].remove();
            }
            if( resizeData.component == 'table' ){
                removeActive.call( elem );
                elem.removeEventListener( 'mousemove', tableMove, true );
                elem.removeEventListener( 'mousedown', tableDown, true );
                elem.removeEventListener( 'mouseout', removeActive, true );
                elem.removeEventListener( 'touchmove', tableMove, true );
                elem.removeEventListener( 'touchstart', tableDown, true );
            }
            if( elem._clone ){
                elem._clone.remove();
                delete elem._clone._elem;
                delete elem._clone;
            }
        })
        return this;
    }

    function getBcr( elem ){
        var bcr = elem.getBoundingClientRect();
        return {
            left : bcr.left,
            right : bcr.right,
            top : bcr.top,
            bottom : bcr.bottom,
            width : elem.offsetWidth,
            height : elem.offsetHeight
        };
    }

    function getStyle( elem ){
        return getComputedStyle( elem );
    }

    function bind( obj ){
        this.each( function( index, item ){
            if( item._resizeData ){
                $L( item ).enableResize( 'destroy' );
            }
            bindEvents( item, $L.extend( true, {}, obj ) );
        }) 
    }

    function bindEvents( item, obj ){
        item._resizeData = obj;

        if( obj.component == "table" ){
            item.addEventListener( 'mousedown', tableDown, true );
            item.addEventListener( 'touchdown', tableDown, true );
            item.addEventListener( 'mousemove', tableMove, true );
            item.addEventListener( 'mouseout', removeActive, true );
        }

        if( obj.hasOwnProperty( "tabIndex" ) ){
            item.addEventListener( "keydown", keydown, true );
            item.tabIndex = obj.tabIndex;
        }

        createResize( item );
    }

    function changeCursor(){
        var elem = this,
        $elem = $L( elem ),
        parent = elem.parentNode,
        angle = find_angle( getComputedStyle( parent ), true ) / Math.PI * 180,
        value = $elem.data( 'value' ),
        modified_value = $elem.data( "modified_value" ) || value,
        count = Math.round( angle / 45 ),
        keys = isRtl ? [ "NW", "W","SW", "S", "SE", "E", "NE" , "N" ] : [ "N", "NE", "E", "SE", "S", "SW", "W", "NW" ],
        new_value = keys[ ( keys.indexOf( value ) + count ) % keys.length ];

        if( modified_value != new_value ){
            var ns = "lyteResizeCursor";
            $elem.removeClass( ns + modified_value ).addClass( ns + new_value ).data( "modified_value", new_value );
        }
    }

    function createResize( elem ){
            var obj = elem._resizeData,
            directions = obj.directions,
            rotation = obj.rotationHandling,
            activeElems = {},
            dirs = { N : { height : true, top : true }, NE : { top : true, height : true, width : true }, E : { width : true }, SE : { height : true, width : true }, S : { height : true }, SW : { height : true, left : true, width : true }, W : { left : true, width : true }, NW : { top : true, height : true, left : true, width : true } },
            diretion_exp = {
                N : "Top",
                S : "Bottom",
                W : "Left",
                E : "Right",
                NE : "Top right",
                NW : "Top left",
                SE : "Bottom right",
                SW : "Bottom left"
            },
            clone;
            $L( elem ).data( 'activeElems', activeElems ).addClass( 'lyteResizeElement' );
            if( obj.clonedShape ){
                clone = $L( document.createElement( 'div' ) ).addClass( 'lyteResizeClone' ).get( 0 );
            }
            for( var i = 0; i < directions.length; i++ ){
                var curDir = directions[ i ],
                newelem = $L( document.createElement( 'div' ) )
                    .addClass( 'lyteResizeHandle', 'lyteResize' + curDir, 'lyteResizeCursor' + curDir )
                    .data( { directions : dirs[ curDir ], element : elem, value : curDir } )
                    .attr( {
                       "aria-role" : "button",
                       "aria-label" : "Resize handle " + diretion_exp[ curDir ] 
                    } )
                    .get( 0 );
                activeElems[ curDir ] = newelem;
                newelem.tabIndex = obj.tabIndex || -1;
                ( clone || elem ).appendChild( newelem );
                newelem.addEventListener( 'mousedown', mousedown, true );
                newelem.addEventListener( 'touchstart', mousedown, true );

                if( rotation ){
                    newelem.addEventListener( "mouseenter", changeCursor, true );
                }
            }
            if( clone ){
                elem.appendChild( clone );
                clone._elem = elem;
                elem._clone = clone;
            }
        }


    function getCell( element, direction ){
        var data = this._resizeData,
        tags = data.tags,
        __matches = function( query, __element ){
            if( __element.matches ){
                return __element.matches( query );
            }
            return getIndex( toArray( this.querySelectorAll( query ) ), __element ) != -1;
        }.bind( this );

        if( __matches( tags.th, element ) ){
            return element;
        }
        var row = element.parentNode,
        cells = toArray( row.children ),
        tbody = row.parentNode,
        rows = toArray( tbody.children ),
        cellIndex = getIndex( cells, element ),
        rowIndex = getIndex( rows, row );

        if( direction ){
            var rowSpan = element.rowSpan || 1;
            if( rowSpan == 1 ){
                return element;
            }
            var newrow = rows[ rowIndex + rowSpan - 1 ],
            newcells = newrow.children,
            new_length = newcells.length;

            for( var i = 0; i < new_length; i++ ){
                var cur = newcells[ i ];
                if( cur.style.display == "none" || ( cur.rowSpan || 1 ) != 1 ){
                    continue;
                }
                return cur;
            }

            new_length = cells.length;

            for( var i = 0; i < new_length; i++ ){
                var cur = cells[ i ];
                if( cur.style.display == "none" || ( cur.rowSpan || 1 ) != 1 ){
                    continue;
                }
                return cur;
            }
            return element;
        } else {
            return tbody.previousElementSibling.children[ 0 ].children[ cellIndex + ( element.colSpan || 1 ) - 1 ];
        }
    }

    function border( style, direction ){
        return ( direction ? 
                    parseFloat( style.borderTopWidth ) + parseFloat( style.borderBottomWidth ) : 
                    parseFloat( style.borderLeftWidth ) + parseFloat( style.borderRightWidth ) );
    }

    function padding( style, direction ){
        var width = 0;
        if( style.boxSizing == "content-box" ){
            width = direction ? 
                    parseFloat( style.paddingTop ) + parseFloat( style.paddingBottom ) : 
                    parseFloat( style.paddingLeft ) + parseFloat( style.paddingRight );

            width += border( style, direction );
        }   
        return width
    }

    function keydown( evt ){
        var active_element = document.activeElement,
        key = evt.key,
        to_prevent,
        $active = $L( active_element ),
        resize_handler_cls = 'lyteResizeHandle',
        __data = this._resizeData,
        tags = __data.tags || {},
        dummy_fn = function(){
            return;
        };

        if( active_element == this ){
            var is_selected = $active.hasClass( selection_class ),
            to_select;

            switch( key ){
                case "Enter" : 
                case " " : {
                    to_select = is_selected ? "remove" : "add";
                }
                break;
                case "Escape" : {
                    to_select = is_selected ? "remove" : "";
                }
                break;
                case "Tab" : {
                    if( is_selected ){
                        var handler = $active.children( '.' + resize_handler_cls ).eq( 0 );
                        if( handler.length ){
                            handler.focus();
                            to_prevent = true;
                        }
                    }
                }
                break;
            }

            if( to_select ){
                $active[ to_select + "Class" ]( selection_class );
                to_prevent = to_select;
            }
            
        } else if( $active.hasClass( resize_handler_cls ) ) {
            var x_fact = 0,
            y_fact = 0;

            switch( key ){
                case "ArrowLeft" : {
                    x_fact = -1;
                }
                break;
                case "ArrowRight" : {
                    x_fact = 1;
                }
                break;
                case "ArrowUp" : {
                    y_fact = -1;
                }
                break;
                case "ArrowDown" : {
                    y_fact = 1;
                }
                break;
                case "Tab" : {
                    var $parent = $active.parent();

                    if( $parent.hasClass( selection_class ) ){
                        var handler = $parent.children( '.' + resize_handler_cls );

                        if( evt.shiftKey ){
                            if( to_prevent = ( active_element == handler.get( 0 ) ) ){
                                handler.eq( -1 ).focus();
                            }
                        } else if( to_prevent = ( active_element == handler.get( -1 ) ) ) {
                            handler.eq( 0 ).focus();
                        }
                    }
                }
                break;
                case "Escape" : {
                    $active.parent().removeClass( selection_class ).focus();
                    to_prevent = true;
                }
                break;
            }

            if( x_fact || y_fact ){
                var bcr = active_element.getBoundingClientRect(),
                __obj = { preventDefault : dummy_fn, stopPropagation : dummy_fn, stopImmediatePropagation : dummy_fn, clientX : bcr.left + bcr.width / 2, clientY : bcr.top + bcr.height / 2 },
                parent_element = active_element.parentNode;

                mousedown.call( active_element, __obj );
                $L.fastdom.measure( function(){
                    $L.fastdom.mutate( function(){
                        __obj.clientX += x_fact * 10;
                        __obj.clientY += y_fact * 10;
                        mousemove.call( parent_element, __obj );
                        mouseup.call( parent_element, {} );
                    });
                });
            }

            to_prevent = ( to_prevent || x_fact || y_fact );
        } else if( [ tags.th, tags.td ].indexOf( active_element.tagName.toLowerCase() ) + 1 ){
            var x_fact = 0,
            y_fact = 0;

            switch( key ){
                case "ArrowLeft" : {
                    x_fact = -1;
                }
                break;
                case "ArrowRight" : {
                    x_fact = 1;
                }
                break;
                case "ArrowUp" : {
                    y_fact = -1;
                }
                break;
                case "ArrowDown" : {
                    y_fact = 1;
                }
                break;
            }

            if( to_prevent = x_fact || y_fact ){
                var bcr = active_element.getBoundingClientRect(),
                __offset = __data.offset / 2,
                clientX = x_fact ? ( bcr[ rtlfunc( "right" ) ] + __offset * ( isRtl ? 1 : -1 ) ) : ( bcr.left + bcr.width / 2 ),
                clientY = y_fact ? ( bcr.bottom - __offset ) : ( bcr.top + bcr.height / 2 ),
                __obj = { 
                    target : active_element,
                    clientX : clientX,
                    clientY : clientY,
                    preventDefault : dummy_fn, 
                    stopPropagation : dummy_fn, 
                    stopImmediatePropagation : dummy_fn
                };

                tableDown.call( this, __obj );
                
                $L.fastdom.measure( function(){
                    $L.fastdom.mutate( function(){
                        __obj.clientX += x_fact * 10;
                        __obj.clientY += y_fact * 10;
                        mousemove( __obj );
                        mouseup( {} );
                    });
                });
            }
        }

        to_prevent && evt.preventDefault();
    }

    function mousedown( ev ){
        var evt = ev,
        isTch = /touch/i.test( ev.type );
        if( isTch ){
            if( ev.touches.length > 1 ){
                return;
            }
            evt = ev.touches[ 0 ];
        }
        var elem = this,
        targetElem = $L( this ).data( 'element' ),
        data = targetElem._resizeData,
        directions = $L( elem ).data( 'directions' );
        if( data.onBeforeSelect && data.onBeforeSelect( elem, targetElem, ev, elem._clone ) == false ){
            return;
        }
        window._resizeelem = this;

        var width = targetElem.offsetWidth,
        height = targetElem.offsetHeight,
        bcr = getBcr( elem ),
        iw = window.innerWidth,
        style = getStyle( targetElem ),
        originalValue = {},
        clone = targetElem._clone;
        width -= padding( style );
        height -= padding( style, true ),
        rotation_handling = data.rotationHandling,
        handle_box_sizing = data.boxSizeHandling;

        originalValue.height = directions.height || rotation_handling ? targetElem.style.height = height + 'px' : void 0;
        originalValue.width = directions.width || rotation_handling ? targetElem.style.width = width + 'px' : void 0;
        originalValue[ rtlfunc( 'left' ) ] = directions.left || rotation_handling ? targetElem.style[ rtlfunc( 'left' ) ] = style[ rtlfunc( 'left' ) ] : void 0;
        originalValue.top = directions.top || rotation_handling ? targetElem.style.top = style.top : void 0;

        this.__leftborder = handle_box_sizing ? parseFloat( style.borderBlockStartWidth ) : 0;
        this.__rightborder = handle_box_sizing ? parseFloat( style.borderBlockEndWidth ) : 0;
        this.__topborder = handle_box_sizing ? parseFloat( style.borderTopWidth ) : 0;
        this.__bottomborder = handle_box_sizing ? parseFloat( style.borderBottomWidth ) : 0;

        if( handle_box_sizing && style.boxSizing == "content-box" ){
            this.__horiborder = this.__leftborder + this.__rightborder;
            this.__vertborder = this.__topborder + this.__bottomborder;
        } else {
            this.__vertborder = this.__horiborder = 0;
        }

        if( data.preserveAspectRatio ){
            this._clientX = rtlfunc( 'clientX', evt, iw );
            this._clientY = evt.clientY;
        } else {
            this._clientX = rtlfunc( 'clientX', evt, iw ) - rtlfunc( 'right', bcr, iw );
            this._clientY = evt.clientY - bcr.bottom + this.__bottomborder;
        }

        this._original = originalValue;

        if( data.component == "table" ){
            var cells = $L( targetElem ).children().children().children( data.tags.td + ',' + data.tags.th );
            
            $L.each( cells, function( index, item ){
                directions.width ? item.style.width = '' : void 0;
                directions.height ? item.style.height = '' : void 0;
            });
        }

         targetElem._owidth =  targetElem.style.width;
         targetElem._oheight = targetElem.style.height;
         targetElem._mwidth = targetElem.style.maxWidth;
         targetElem.style.width = 0;
         targetElem.style.height = 0;
         targetElem.style.maxWidth = 0;
         $L.fastdom.measure( function(){
            targetElem._minWidth = targetElem.offsetWidth;
            targetElem._minHeight = targetElem.offsetHeight;
            if( clone ){
                clone._minHeight = targetElem._minHeight;
                clone._minWidth = targetElem._minWidth;
            }

            if( rotation_handling ){
                this.__resize_rotate = find_angle( style );
            }
         }.bind( this ) )
         $L.fastdom.mutate( function(){
            targetElem._tableDown = true;
            targetElem.style.width = targetElem._owidth;
            targetElem.style.height = targetElem._oheight;
            targetElem.style.maxWidth = targetElem._mwidth;
            if( clone ){
                clone.style.width = width + 'px';
                clone.style.height = height + 'px';
                clone.style[ rtlfunc( 'left' ) ] = 0;
                clone.style.top = 0;
            }
            delete targetElem._oheight; delete targetElem._owidth; delete targetElem._mwidth;

            if( evt.type ){
                document.addEventListener( isTch ? 'touchmove' : 'mousemove', mousemove, true );
                document.addEventListener( isTch ? 'touchend' : 'mouseup', mouseup, true );
            }

            data.onSelect && data.onSelect( elem, targetElem, ev, elem._clone );
         } )
    }

    function find_angle( style, for_cursor ){
        var transform = style.transform,
        match = transform.match( /matrix\((.+)\)/ ),
        ret = 0;

        if( match ){
            var split = match[ 1 ].split( "," ),
            hori = parseFloat( split[ 0 ] ),
            vert = parseFloat( split[ 1 ] ),
            angle = ( Math.atan2( vert, hori ) / Math.PI * 180 + 360 ) % 360;

            ret = angle;
        }
        
        if( isRtl && !for_cursor ){
            ret = ( ( 360 - ret ) + 360 ) % 360;
        }

        return ret * Math.PI / 180;
    }

    function tableDown( ev ){
        var data = this._resizeData,
        isTch = /touch/i.test( ev.type ),
        evt = ev;

        if( isTch ){
            if( evt.touches.length > 1 ){
                return;
            } 
            evt = evt.touches[ 0 ];
        }

        ( isTch || !ev.type ) && tableMove.call( this, evt );

        var active = data.active;
        if( !active || ev.buttons == 2 ){
            return;
        }
        if( data.onBeforeSelect && data.onBeforeSelect( this, active.element, ev ) == false ){
            return;
        }
        var preventTable = data.preventTable,
        direction = active.direction == "vertical",
        element = getCell.call( this, active.element, direction ),
        winwidth = window.innerWidth,
        style = getStyle( element ),
        bcr = getBcr( element ),
        row = element.parentNode,
        table = row.parentNode.parentNode,
        tableStyle = getStyle( table ),
        tableBcr = getBcr( table ),
        next = !direction && preventTable ? element.nextElementSibling : void 0,
        nextstyle,
        cells = toArray( row.children ),
        final = [],
        allCells = toArray( $L( table ).children().children().children( data.tags.td + ',' + data.tags.th ) ),
        is_fixed = tableStyle.tableLayout == "fixed",
        original_layout = table.style.tableLayout;

        element._next = next;

        if( !preventTable ){
            table._original = { width : table.style.width, height : table.style.height };
        }

        if( direction ){
            cells.forEach( function( item ){
                if( item.style.display == "none" ){
                    return;
                }
                var obj = {
                    node  : item,
                    style : getStyle( item ),
                    bcr : getBcr( item )
                }
                final.push( obj );
            } )
            table.style.height = ( tableBcr.height - padding( tableStyle, true ) ) + 'px';

            final.forEach( function( item ){
                item.node._original = { height : item.node.height, width : item.node.height };
                item.node.style.height = ( item.bcr.height - padding( item.style, true ) ) + 'px';
            } )

            allCells.forEach( function( item ){
                item._hgt = item.style.height;
                item.style.height = 0;
            } )
            table._hgt = table.style.height;
            table.style.height = 0;
        } else {
            element._original = { width : element.style.width, height : element.style.height };

            element.style.width = ( bcr.width -  padding( style ) ) + 'px';
            if( !preventTable ){
                table.style.width = ( tableBcr.width - padding( tableStyle ) ) + 'px';
            }
            if( next ){
                next._original = { width : next.style.width, height : next.style.height };
                var nextbcr = getBcr( next );
                nextstyle = getStyle( next );
                next.style.width = ( nextbcr.width - padding( nextstyle ) ) + 'px';
            }
            if( is_fixed ){
                table.style.tableLayout = "";
            }
            table.style.maxWidth = 0;
        }

        $L.fastdom.measure( function(){
                if( direction ){
                    final.forEach( function( item ){
                        var exp_min = 0,
                        measured_min = parseFloat( item.style.minHeight ),
                        measured_max = parseFloat( item.style.maxHeight );

                        item.node._minHeight = getBcr( item.node ).height - padding( item.style, true );

                        if( !isNaN( measured_min ) ){
                            item.node._minHeight = measured_min
                        }

                        if( !isNaN( measured_max ) ){
                            item.node._maxHeight = measured_max;
                        }
                    });
                    if( !preventTable ){
                       table._minHeigth = getBcr( table ).height - padding( tableStyle, true );
                    }
                } else {
                    element._minWidth = getBcr( element ).width - padding( style );

                    if( is_fixed ){
                        var min_width_read = parseFloat( style.minWidth );

                        if( !isNaN( min_width_read ) ){
                            element._minWidth = min_width_read;
                        }
                    }

                    if( isNaN( element._maxWidth = parseFloat( style.maxWidth ) ) ){
                        delete element._maxWidth;
                    }

                    if( next ){
                        next._minWidth = getBcr( next ).width - padding( nextstyle );
                        if( isNaN( next._maxWidth = parseFloat( next.maxWidth ) ) ){
                            delete next._maxWidth;
                        }
                    }
                    if( !preventTable ){
                        table._minWidth = getBcr( table ).width - padding( tableStyle );

                        if( is_fixed ){
                            var min_width_read = parseFloat( tableStyle.minWidth );
                            if( !isNaN( min_width_read ) ){
                                table._minWidth = min_width_read;
                            }
                        }
                    }
                 }
            }.bind( this ) )

            $L.fastdom.mutate( function(){
                if( direction ){
                    allCells.forEach( function( item ){
                        if( item.parentNode == element.parentNode && element != item ){
                            item.style.height = "";
                        } else {
                            item.style.height = item._hgt;
                        }
                        delete item._hgt;
                    } )
                    table.style.height = table._hgt;
                    delete table._hgt;
                } else {
                   if( is_fixed ){
                        table.style.tableLayout = original_layout;
                   }
                   table.style.maxWidth = "";
                }
                element._clientX = rtlfunc( 'clientX', evt, winwidth ) - rtlfunc( 'right', bcr, winwidth );
                element._clientY = evt.clientY - bcr.bottom;
                window._resizeelem = element;
                $L( element ).data( 'element', this );
                $L( element ).data( 'directions', { width : !direction, height : direction } );

                document.addEventListener( isTch ? 'touchmove' : 'mousemove', mousemove, true );
                document.addEventListener( isTch ? 'touchend' : 'mouseup', mouseup, true );
                data.onSelect && data.onSelect( this, element, ev );
                // evt.stopPropagation();
                this._tableDown = true;
            }.bind( this ) )
    }

    function get_rotated_bcr( boundary_elem, is_left, is_top, elem, angle, new_width, new_height, diff1, diff2, left_border, top_border ){

        var off_parent = elem.offsetParent,
        calculate_left = function(){
            return off_parent.offsetWidth - elem.offsetWidth - parseFloat( elem.style.right );
        },
        recursive = function( __elem, ns ){
            var off_parent = __elem.offsetParent;
            if( off_parent == boundary_elem ){
                return __elem[ ns ];
            }
            return __elem[ ns ] + recursive( off_parent, ns );
        },
        x_fact = is_left ? -1 : 1,
        y_fact = is_top ? -1 : 1,
        // if boundary is not offset parent rtl handling wont work
        __left = isRtl ? calculate_left() : parseFloat( elem.style.left ),
        __top = parseFloat( elem.style.top ),
        new_left = __left + ( x_fact * diff1.x_diff - y_fact * diff2.x_diff ) * ( isRtl ? -1 : 1 ),
        new_top = __top + x_fact * diff1.y_diff + y_fact * diff2.y_diff,
        rotated_width = Math.abs( new_width * Math.cos( angle ) ) + Math.abs( new_height * Math.sin( angle ) ),
        rotated_height = Math.abs( new_width * Math.sin( angle ) ) + Math.abs( new_height * Math.cos( angle ) ),
        excess_width = ( rotated_width - new_width ) / 2,
        excess_height = ( rotated_height - new_height ) / 2,
        left_buff = recursive( elem, 'offsetLeft' ) - __left + left_border,
        top_buff = recursive( elem, 'offsetTop' ) - __top + top_border;

        return {
            left : new_left - excess_width + left_buff,
            top : new_top - excess_height + top_buff,
            right : new_left + rotated_width - excess_width + left_buff,
            bottom : new_top + rotated_height - excess_height + top_buff,
            width : rotated_width,
            height : rotated_height
        };
    }

    function mousemove( ev ){
        var evt = ev,
        isTch = /touch/i.test( ev.type );
        if( isTch ){
            if( evt.touches.length > 1 ){
                return;
            }
            evt = evt.touches[ 0 ];
        }
        var elem = window._resizeelem,
        targetElem = $L( elem ).data( 'element' ) || elem,
        directions = $L( elem ).data( 'directions' ),
        data = targetElem._resizeData,
        winwidth = window.innerWidth,
        newX = rtlfunc( 'clientX', evt, winwidth ),
        newY = evt.clientY,
        newLeft,
        newTop,
        preventTable = data.preventTable,
        bcr = getBcr( elem ),
        isTable = targetElem._resizeData.component == 'table',
        next = elem._next,
        is_preserve_aspect = data.preserveAspectRatio,
        xIncr =  newX - ( is_preserve_aspect ? 0 : rtlfunc( 'right', bcr, winwidth ) ) - elem._clientX,
        yIncr = newY - ( is_preserve_aspect ? 0 : bcr.bottom ) - elem._clientY,
        clone = targetElem._clone,
        x = ( window.pageXOffset || document.documentElement.scrollLeft ) * ( isRtl ? -1 : 1 ),
        y = window.pageYOffset || document.documentElement.scrollTop,
        angle = elem.__resize_rotate,
        is_left = directions.left,
        is_top = directions.top,
        is_width = directions.width,
        is_height = directions.height,
        xFact = is_left ? -1 : 1,
        yFact = is_top ? -1 : 1,
        ratio = is_preserve_aspect ? parseFloat( targetElem.style.width ) / parseFloat( targetElem.style.height ) : void 0,
        rtl_left = rtlfunc( "left" ),
        rtl_right = rtlfunc( "right" ),
        scaledElem = data.scaledParent || targetElem,
        style = window.getComputedStyle(scaledElem),
        transform = style.transform || style.webkitTransform || style.mozTransform,
        scaleX = 1,
        scaleY = 1,
        origin;

        if (transform && transform !== 'none') {
            var matrixValues = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
            scaleX = parseFloat(matrixValues[0]);
            scaleY = parseFloat(matrixValues[3]);
            origin = style.transformOrigin.split(' ');
            origin = {
                x: parseFloat(origin[0]) / scaledElem.offsetWidth,
                y: parseFloat(origin[1]) / scaledElem.offsetHeight
            };
            xIncr /= scaleX;
            yIncr /= scaleY;
        };

        if( angle ){
            var flip = function(){
                yIncr *= -1;
                xIncr *= -1
            },
            interchange = function(){
                var temp = xIncr;
                xIncr = yIncr;
                yIncr = temp * -1;
            },
            to_degree = 180 / Math.PI * angle;

            // if( isRtl && ( !$L( elem ).hasClass( 'lyteResizeCursorN' ) || !$L( elem ).hasClass( 'lyteResizeCursorS' ) ) ){
            //     flip();
            // }

            if( to_degree >= 45 && to_degree <= 135 ){
               interchange();
            } else if( to_degree > 135 && to_degree <= 225 ){
               flip();
            } else if( to_degree > 225 && to_degree <= 315 ){
                interchange();
                flip();
            }
        }
        
        targetElem = clone || targetElem;

        if( data.showInfo ){
            if( !elem._moved ){
                var infoDiv =  document.createElement( 'div' );
                infoDiv.classList.add( 'lyteResizeInfoDiv', data.infoClass );
                document.body.appendChild( infoDiv );
                elem._infoDiv = infoDiv;
            } 
        } 
        elem._moved = true;

        if( is_preserve_aspect || angle ){

            xIncr = ( is_left || is_width ) ? xIncr : 0;
            yIncr = ( is_top || is_height ) ? yIncr : 0;

            if( Math.abs( xIncr ) > Math.abs( yIncr ) ){
                is_preserve_aspect ? ( yIncr = xIncr / ratio * xFact * yFact ) : void 0;
                if( !( is_top || is_height ) ){
                    yFact = 1;
                    is_height = is_width;
                }

            } else {
                is_preserve_aspect ? ( xIncr = ratio * yIncr * yFact * xFact ) : void 0;
                
                if( !( is_left || is_width ) ){
                    xFact = 1;
                    is_width = is_height;
                }
            }
        }

        if( data.boundary && !next ){
            var bbcr,
            boundary_elem;

            if( data.boundary.constructor == String ){
               var bcr1 = getBcr( boundary_elem = $L( targetElem ).closest( data.boundary ).get( 0 ) );
               bbcr = {
                  left : bcr1[ rtl_left ],
                  right : bcr1[ rtl_right ],
                  top : bcr1.top,
                  bottom :bcr1.bottom
               }
            } else {
                bbcr = data.boundary;
            }

            if( is_preserve_aspect || angle ){
                var old_width = parseFloat( targetElem.style.width ) + elem.__horiborder || 0,
                old_height = parseFloat( targetElem.style.height ) + elem.__vertborder || 0,
                exp_width = old_width + xIncr * xFact,
                exp_height = old_height + yIncr * yFact,
                rotated_width = Math.abs( old_width * Math.cos( angle ) ) + Math.abs( old_height * Math.sin( angle ) ),
                rotated_height = Math.abs( old_width * Math.sin( angle ) ) + Math.abs( old_height * Math.cos( angle ) ),
                target_bcr = get_rotated_bcr( boundary_elem, is_left, is_top, targetElem, angle, exp_width, exp_height, check_rotational_modification( angle, old_width, old_height, exp_width, old_height, xFact, yFact ), check_rotational_modification( angle, old_width, old_height, old_width, exp_height, xFact, yFact ), elem.__leftborder || 0, elem.__topborder || 0 );

                bbcr = {
                    left : 0,
                    right : Math.abs( bbcr.right - bbcr.left ),
                    top : 0,
                    bottom : bbcr.bottom - bbcr.top
                };
                
                if( ( rotated_width <= target_bcr.width && ( target_bcr.right > bbcr.right || target_bcr.left < bbcr.left ) ) || ( rotated_height <= target_bcr.height && ( target_bcr.bottom > bbcr.bottom || target_bcr.top < bbcr.top ) ) ){
                    xIncr = yIncr = 0;
                }
            } else {
                if( newX > bbcr[ rtl_right ] ){
                    var __diff = newX - bbcr[ rtl_right ];
                    xIncr -= __diff / scaleX;
                }

                if( newX < bbcr[ rtl_left ] ){
                    xIncr += ( bbcr[ rtl_left ] - newX ) / scaleX;
                }

                if( newY > bbcr.bottom ){
                    yIncr -= ( newY - bbcr.bottom ) / scaleY;
                }

                if( newY < bbcr.top ){
                    yIncr += ( bbcr.top - newY ) / scaleY;
                }
            }
        }

        if( is_width ){
            if( !preventTable ){
                var min = data.minWidth || targetElem._minWidth || 0,
                max = data.maxWidth || Infinity,
                originalWidth = parseFloat( targetElem.style.width ),
                modifiedWidth = originalWidth + xIncr * xFact,
                final = Math.min( max, Math.max( min, modifiedWidth ) );
                xIncr  = ( final - originalWidth ) * xFact;
            }

            if( isTable ){
                var originalWidth = parseFloat( elem.style.width ),
                modifiedWidth = originalWidth + xIncr,
                final = Math.min( elem._maxWidth || Infinity, Math.max( elem._minWidth, modifiedWidth ) );
                xIncr = final - originalWidth;
                if( next ){
                    originalWidth = parseFloat( next.style.width );
                    modifiedWidth = originalWidth - xIncr;
                    final = Math.min( Math.max( next._minWidth, modifiedWidth ), next._maxWidth || Infinity );
                    xIncr = originalWidth - final;
                }
            }
        }

        if( is_height ){
            var min = data.minHeight || targetElem._minHeight || 0,
            max = data.maxHeight || Infinity,
            originalHeight = parseFloat( targetElem.style.height ),
            modifiedHeight = originalHeight + yIncr * yFact,
            final = Math.min( max, Math.max( min, modifiedHeight ) );
            yIncr  = ( final - originalHeight ) * yFact;
            
            if( isTable ){
                originalHeight = parseFloat( elem.style.height );
                modifiedHeight = originalHeight + yIncr;
                final = Math.min( Math.max( elem._minHeight, modifiedHeight ), elem._maxHeight || Infinity );
                yIncr = final - originalHeight;
            }
        }

        if( is_left ){
            var left = parseFloat( targetElem.style[ rtl_left ] ),
            newLeft = left + xIncr,
            minLeft = data.minLeft || -Infinity,
            maxLeft = data.maxLeft || Infinity,
            finalLeft = Math.max( Math.min( maxLeft, newLeft ), minLeft );

            xIncr = finalLeft - left;
        }

        if( is_top ){
            var tp = parseFloat( targetElem.style.top ),
            newTop = tp + yIncr,
            minTop = data.minTop || -Infinity,
            maxTop = data.maxTop || Infinity,
            finalTop = Math.max( Math.min( maxTop, newTop ), minTop );

            yIncr = finalTop - tp;
        }

        var prev_width = parseFloat( targetElem.style.width ),
        prev_height = parseFloat( targetElem.style.height ),
        new_width = prev_width,
        new_height = prev_height;

        if( is_width ){
            if( !preventTable ){
                targetElem.style.width = ( new_width = prev_width + xIncr * xFact ) + 'px';
            }
            if( isTable ){
                elem.style.width = ( parseFloat( elem.style.width ) + xIncr ) + 'px';
                if( next ){
                    next.style.width = ( parseFloat( next.style.width ) - xIncr ) + 'px';
                }
            }
        }

        if( is_height ){
            targetElem.style.height = ( new_height = prev_height + yIncr * yFact ) + 'px';
            // var cells = toArray( elem.parentNode.children );
            elem.style.height = ( parseFloat( elem.style.height ) + yIncr ) + 'px'
        }

        if( angle ){

            var __fn = function( old_w, old_h, new_w, new_h ){
                var is_width_change = new_w - old_w,
                is_height_change = new_h - old_h,
                ret  = check_rotational_modification( angle, old_w, old_h, new_w, new_h, xFact, yFact ),
                original_left = parseFloat( targetElem.style[ rtl_left ] ),
                original_top = parseFloat( targetElem.style.top ),
                x_fact = is_left ? -1 : 1,
                y_fact = is_top ? -1 : 1,
                rtl_fact = isRtl ? 1 : 1;

                if( is_width_change ){
                    targetElem.style[ rtl_left ] = ( original_left + ret.x_diff * x_fact * rtl_fact ) + "px";
                    targetElem.style.top = ( original_top + ret.y_diff * x_fact ) + "px";
                } else if( is_height_change ){
                    targetElem.style[ rtl_left ] = ( original_left - ret.x_diff * y_fact * rtl_fact ) + "px";
                    targetElem.style.top = ( original_top + ret.y_diff * y_fact ) + "px";
                }
            };

            __fn( prev_width, prev_height, new_width, prev_height );
            __fn( new_width, prev_height, new_width, new_height );
        } else {
            if( is_left ) {
                targetElem.style[ rtl_left ] = ( parseFloat( targetElem.style[ rtl_left ] ) + xIncr ) + 'px';
            }
    
            if( is_top ) {
                targetElem.style.top = ( parseFloat( targetElem.style.top ) + yIncr ) + 'px';
            }
        }

        if( data.showInfo ){
            var __info_elem = elem._infoDiv;

            __info_elem.innerHTML = data.getText ? data.getText( elem, Math.round( parseFloat( targetElem.style.width ) ), Math.round( parseFloat( targetElem.style.height ) ) ) : ( Math.round( parseFloat( targetElem.style.width ) ) + ' x ' + Math.round( parseFloat( targetElem.style.height ) ) );
            __info_elem.style[ rtl_left ] = ( newX + x + 15 ) + 'px';
            __info_elem.style.top = ( newY + y + 15 ) + 'px';
        }
        data.onMove && data.onMove( elem, $L( elem ).data( 'element' ), ev, elem._infoDiv );
        ev.type && ev.preventDefault();

        if( is_preserve_aspect ){
            elem._clientX = newX;
            elem._clientY = newY;
        }
    }

    function check_rotational_modification( angle, prev_width, prev_height, new_width, new_height, x_fact, y_fact ){
       var fn = function( __width, __height ){
            var obj = {
                width : Math.cos( angle ) * __width + Math.sin( angle ) * __height,
                height : Math.sin( angle ) * __width + Math.cos( angle ) * __height
            };

            obj.mid_x = obj.width / 2;
            obj.mid_y = obj.height / 2;

            return obj;
       },
       prev_rot = fn( prev_width, prev_height ),
       cur_rot = fn( new_width, new_height );

       return {
          x_diff : cur_rot.mid_x - prev_rot.mid_x - ( new_width - prev_width ) / 2 * x_fact,
          y_diff : cur_rot.mid_y - prev_rot.mid_y - ( new_height - prev_height ) / 2 * y_fact
       };
    }

    function mouseup( evt, frm_remove ){
        var isTch = /touch/i.test( evt.type );
        document.removeEventListener( isTch ? 'touchmove' : 'mousemove', mousemove, true );
        document.removeEventListener( isTch ? 'touchend' : 'mouseup', mouseup, true );
        var elem = window._resizeelem,
        targetElem = $L( elem ).data( 'element' ),
        data = targetElem._resizeData,
        next = elem._next,
        isTable = data.component == "table",
        directions = $L( elem ).data( 'directions' );

        if( elem._moved ){

            var __fn = function( __element ){
                var __style = __element.style,
                to_check = [ "left", "right", "top", "width", "height" ],
                str = "";

                to_check.forEach( function( item ){
                    var __value = __style[ item ];
                    if( __value && /px$/i.test( __value ) ){
                        str += `${ item } : ${ parseFloat( __value ) };`
                    }
                });

                $L( __element ).attr( "aria-label", str );
            };

            if( elem._infoDiv ){
                elem._infoDiv.remove();
                delete elem._infoDiv;
            }
            if( !frm_remove && data.onBeforeDrop && data.onBeforeDrop( elem, targetElem, evt, targetElem._clone ) == false ){
                $L( targetElem._clone || targetElem ).css( elem._original );
                if( isTable ){
                    if( directions.width ){
                        $L( elem ).css( elem._original );
                        delete elem._original;
                        if( next ){
                            $L( next ).css( next._original );
                            delete next._original;
                        }
                    } else {
                        toArray( elem.parentNode.children ).forEach( function( item ){
                            $L( item ).css( item._original );
                            delete item._original;
                        } )
                    }
                }

                if( data.hasOwnProperty( "tabIndex" ) ){
                    __fn( targetElem );
                    if( isTable ){
                        __fn( elem );
                    }
                }

                delete elem._original;
            } else {
                if( targetElem._clone ){
                    var lft = rtlfunc( 'left' );
                    targetElem.style[ lft ] = ( parseFloat( targetElem.style[ lft ] ) + parseFloat( targetElem._clone.style[ lft ] ) ) + 'px';
                    targetElem.style.top = ( parseFloat( targetElem.style.top )  + parseFloat( targetElem._clone.style.top ) ) + 'px';
                    targetElem.style.width = targetElem._clone.style.width;
                    targetElem.style.height = targetElem._clone.style.height;
                    targetElem._clone.style[ rtlfunc( 'left' ) ] = 0;
                    targetElem._clone.style.top = 0;
                }

                if( !frm_remove ){
                    if( data.hasOwnProperty( "tabIndex" ) ){
                        __fn( targetElem );
                        if( isTable ){
                            __fn( elem );
                        }
                    }
                    data.onDrop && data.onDrop( elem, targetElem, evt, elem._original, targetElem._clone );
                }
            }
        } else {
            !frm_remove && data.onRelease && data.onRelease( elem, targetElem, evt, targetElem._clone );
        }
        delete window._resizeelem; delete elem._moved;

        delete elem._clientX;
        delete elem._clientY;
        delete elem.__resize_rotate;
        delete elem._original;
        delete elem.__leftborder;
        delete elem.__rightborder;
        delete elem.__topborder;
        delete elem.__bottomborder;
        delete elem.__horiborder;
        delete elem.__vertborder;

         if( targetElem._resizeData.component == 'table' ){
            if( elem._next ){
                delete elem._next._originalValue;
                delete elem._next;
            }
            if( !elem.classList.contains( 'lyteResizeHandle' ) ){
                $L( elem ).removeData( 'element' );
                $L( elem ).removeData( 'directions');
            }
            if( evt.type && targetElem.contains( evt.target ) ){
                window._preventresizeClick = true;
                setTimeout( function(){
                    delete this._preventresizeClick;
                }, 0 );
            }
        }
       
        if( data.hasOwnProperty( "tabIndex" ) ){
            var __str = "",
            check_list = [ "left", "right", "top", "width", "height" ],
            __fn = function( ns ){
                var value = targetElem.style[ ns ];
                __str += ( value ? `${ ns } : ${ parseFloat( value ) }; ` : "" );
            };

            check_list.forEach(__fn);

            $L( targetElem ).attr( "aria-label" , __str.trim() );
        }
    }

    function tableMove( evt ){
        if( window._resizeelem || evt.type == "mousemove" && evt.buttons ){
            return;
        }

        if( !document.contains( evt.target ) ){
            return;
        }

        var data = this._resizeData,
        offset = data.offset,
        elementQuery = data.tags.td + ',' + data.tags.th,
        closest = $L( evt.target ).closest( elementQuery, this ).get( 0 ),
        winwidth = window.innerWidth,
        cx = rtlfunc( 'clientX', evt, winwidth ),
        cy = evt.clientY;
        if( !closest ){
            return;
        }

        var cells = closest.parentNode.children,
        index = getIndex( toArray( cells ), closest ),
        bcr = getBcr( closest ),
        isHori = ( cx > rtlfunc( 'right', bcr, winwidth ) - offset && cx < rtlfunc( 'right', bcr, winwidth ) ) && !data.preventHorizontal,
        isVert = ( cy > bcr.bottom - offset && cy < bcr.bottom ) && !data.preventVertical,
        active = data.active,
        cursor,
        direction;

        if( data.preventTable && isHori ){
            if( index + ( closest.colSpan || 1 ) - 1 == cells.length - 1 ){
                return;
            }
        }

        if( isHori || isVert ){
                active && active.element != closest && removeActive.call( this );
                cursor = closest._cursor == undefined ? closest.style.cursor : closest._cursor;
                if( isVert ){
                    direction = 'vertical';
                    closest.style.cursor = data.rowResize;
                } else if( isHori ){
                    direction = 'horizontal';
                    closest.style.cursor = data.colResize;

                }   
                closest._cursor = cursor;
                data.active = { cursor : cursor, element : closest, direction : direction };
            } else {
                active && removeActive.call( this );       
            }
    }

    function removeActive(){
        var active = this._resizeData.active;
        if( active ){
            active.element.style.cursor = active.element._cursor;
            delete active.element._cursor;
            delete this._resizeData.active;
        }
    }

    function getIndex( array, elem ){
        return array.indexOf( elem );
    }

    function toArray( arr ){
        if( Array.from ){
            return Array.from( arr );
        }
        return Array.apply( Array, arr );
    }

    $L.prototype.enableResize = function( obj ){
        if( obj == 'destroy' ){
            return destroy.call( this );
        }

        if( isRtl == void 0 ){
            isRtl = getComputedStyle( document.body ).direction == "rtl";
        }

        obj = obj || {};
        obj.directions = obj.directions || [ 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W','NW' ];
        obj.rotation = obj.rotation == undefined ? true : obj.rotation;
        obj.tags = obj.tags || { td : "td", th : "th", tr : "tr", table : "table", thead : "thead", tbody : "tbody" };
        obj.rowResize = obj.rowResize || "row-resize";
        obj.colResize = obj.colResize || "col-resize";
        obj.offset = obj.offset || 10;
        bind.call( this, obj );
        return this;
    }

    document.addEventListener( 'click', function( evt ){
        var active = document.getElementsByClassName( selection_class ),
        _length = active.length;

        for( var i = 0; i < _length; i++ ){
            active[ i ].classList.remove( selection_class );
        }
        !window._preventresizeClick && $L( evt.target ).closest( '.lyteResizeElement' ).addClass( selection_class ).children( '.lyteResizeClone' ).attr( 'style', '' );
    }, true )

})(window);
