/**
 * This creates UPC A and E type barcodes in web
 * contact @lyte-team@zohocorp.com
 */

;( function(){
    var default_options = {
        fill_color : "black",
        non_fill_color : "white",
        quiet_zone : 10,
        width : 500,
        height : 200,
        unit_width : 5,
        show_checksum : true,
        show_label : true,
        background : "white",
        scale : window.devicePixelRatio,
        type : "A",
        label_options : {
            font : "20px Arial",
            padding: '5px',
            color: 'black',
            background : "white"
        }
    },
    extend = ( src, target ) => {
        for( var key in target ){
            if( key == "label_options" ){
                src[ key ] = extend( src[ key ] || {}, target[ key ] );
            } else if( src[ key ] == void 0 ){
                src[ key ] = target[ key ];
            }
        }
        return src;
    };

    class LyteBarcode_Upc{
        constructor( options ){
            extend( options, default_options );

            var text = options.text,
            len = text.length,
            is_error,
            is_a = /^a$/i.test( options.type );

            if( is_a ){
                switch( len ){
                    case 11 : {
                        var check_digit = this.get_checksum_value( text, 11 );
                        text += check_digit;
                    }
                    break;
                    case 12 : {
                        var check_digit = this.get_checksum_value( text.slice( 0, 11 ), 11 );
                        is_error = check_digit != text[ 11 ];
                    }
                    break;
                    default : {
                        is_error = true;
                    }
                }
            } else {
                switch( len ){
                    case 6 : {
                        var upc_a_text = this.get_e_text( text );
                        text = upc_a_text[ 0 ] + text + upc_a_text[ upc_a_text.length - 1 ];
                    }
                    break;
                    case 7 : {
                        is_error = !/^(0|1)/.test( text ); 
                        var upc_a_text = this.get_e_text( text.replace( /^./, "" ), text[ 0 ] );
                        text = text + upc_a_text.slice( -1 );
                    }
                    break;
                    case 8 : {
                        var upc_a_text = this.get_e_text( text.replace( /^./, "" ).replace( /.$/, "" ), text[ 0 ] );
                        is_error = upc_a_text.slice( -1 ) != text[ 7 ];
                    }
                    break;
                    default : {
                        is_error = true;
                    }
                }
            }

            if( is_error ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
            }

            var text_len = text.length - ( is_a ? 0 : 2 ),
            canvas = options.canvas || document.createElement( "canvas" );

            this.init( text_len );
            this.fill_tails( is_a );
            this.fill_intermediate( text_len, is_a );
    
            if( is_a ){
                this.encode_a_data( text );
            } else {
                this.encode_e_data( text );
            }

            this.draw_in_canvas( canvas, options, text );
        }

        get_e_text( text, prefix ){
            var a_convert = [ '__00000___', '__10000___', '__20000___', '___00000__', '____00000_', '_____00005', '_____00006', '_____00007', '_____00008', '_____00009' ],
            len = text.length,
            last_number = parseInt( text[ len - 1 ] ),
            conversion_value = a_convert[ last_number ];

            for( var i = 0; i < len; i++ ){
                var index = conversion_value.indexOf( "_" );
                if( index + 1 ){
                    conversion_value = conversion_value.slice( 0, index ) + text[ i ] + conversion_value.slice( index + 1 );
                } else {
                    break;
                }
            }

            conversion_value = ( prefix || "0" ) + conversion_value;

            return conversion_value + this.get_checksum_value( conversion_value, 11 );
        }

        draw_in_canvas( canvas, options, text ){
            var pts = this.points,
            fill_color = options.fill_color, 
            non_fill_color = options.non_fill_color, 
            quiet_zone = options.quiet_zone, 
            background = options.background, 
            before_draw = options.before_draw,
            scale = options.scale,
            width = options.width * scale,
            height = options.height * scale,
            len = pts.length,
            unit_width = width / ( len + 2 * quiet_zone ),
            ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
            unit_height = Math.floor( height / 1.15 );

            if( isNaN( unit_width ) ){
                unit_width = options.unit_width * scale;
                width = unit_width * ( len + 2 * quiet_zone ) * scale;
            }
 
            if( isNaN( unit_height ) ){
                height = unit_height = Math.max(  5 * 3.7795275591, width * .15 );
            }

            canvas.width = width;
            canvas.height = height;

            this.canvas = canvas;
            
            if( options.show_label ){
                this.show_label( scale, options, background, ctx, canvas, width, height, height - unit_height, options.show_checksum ? text : options.text, unit_width )
            } else if( background ){
                ctx.fillStyle = background;
                ctx.fillRect( 0, 0, width, height );
            }

            before_draw && before_draw( canvas, this );

            for( var i = 0; i < len; i++ ){
                var cur = pts[ i ];

                ctx.fillStyle = cur.fill ? fill_color : non_fill_color;
                ctx.rect( ( quiet_zone +  i ) * unit_width, 0, unit_width, cur.type == "data" ? unit_height : height );
                ctx.fill();
                ctx.beginPath();
            }
        }

        show_label( scale, options, background, ctx, canvas, width, height, height_loss, text, unit_width ){
            var label_options = options.label_options,
            span = document.createElement( "span" ),
            other_options = {
                position : "absolute",
                zIndex : "-1",
                left : "-1000px",
                top : "-1000px",
                opacity : 0
            };

            for( var key in label_options ){
                span.style[ key ] = label_options[ key ];
            }

            for( var key in other_options ){
                span.style[ key ] = other_options[ key ];
            }

            span.textContent = text;

            document.body.appendChild( span );

            // Need force recalculation;
            var span_height = span.offsetHeight * scale;

            span.remove();
            
            var new_height = height + span_height - height_loss,
            vert_padding = parseInt( label_options.padding ) * scale,
            arr = [],
            quiet_zone = options.quiet_zone,
            quiet_zone_size = quiet_zone * unit_width,
            unit_len = 7,
            max_width,
            is_a = /^a$/i.test( options.type );

            canvas.height = new_height;

            ctx.font = label_options.font;

            if( background ){
                ctx.fillStyle = background;
                ctx.fillRect( 0, 0, width, new_height );
            }

            ctx.font = label_options.font;
            ctx.fillStyle = label_options.color;
            ctx.textAlign = "center";

            arr = [
                {
                    align : "left",
                    left : quiet_zone_size / 2,
                    max : quiet_zone_size,
                    text : text.slice( 0, 1 )
                }
            ];

            if( is_a ){
                max_width = width - 11 * unit_width - 2 * quiet_zone_size - 2 * unit_len * unit_width;
                arr.push( {
                    left : quiet_zone_size * 0.5 + width * .25 + unit_len * unit_width * 0.5,
                    text : text.slice( 1, 6 ),
                    maxWidth : max_width
                },
                {
                    left : width * .75 - quiet_zone_size * 0.5 - unit_len * unit_width * 0.5,
                    text : text.slice( 6, 11 ),
                    maxWidth : max_width
                },
                {
                    align : "right",
                    left : width - quiet_zone_size * 0.5,
                    maxWidth : quiet_zone_size,
                    text : text.slice( 11 )
                } );
            } else {
                max_width = width - 8 * unit_width - 2 * quiet_zone_size;
                arr.push({
                    left : quiet_zone_size + 3 * unit_width + max_width * 0.5,
                    text : text.slice( 1, 7 ),
                    maxWidth : max_width
                },
                {   
                    align : "right",
                    text : text.slice( 7 ),
                    maxWidth : quiet_zone_size,
                    left : width - quiet_zone_size * 0.5
                });
            }

            arr.forEach( item => {
                ctx.textAlign = item.align || ( item.align = "center" );
                ctx.fillText( item.text, item.left, item.top = ( span_height - 2 * vert_padding + height - height_loss ), item.maxWidth );
            });

            this.textArray = arr;

            return new_height;
        }

        encode_e_data( text ){
            var modes = ['+++---', '++-+--', '++--+-', '++---+', '+-++--', '+--++-', '+---++', '+-+-+-', '+-+--+', '+--+-+'],
            __check_sum = parseInt( text.slice( -1 ) ),
            __first = parseInt( text[ 0 ] ),
            cur = modes[ __check_sum ],
            odd_pattern = [ "1101", "11001", "10011", "111101", "100011", "110001", "101111", "111011", "110111", "1011" ],
            even_pattern = [ '100111', '110011', '11011', '100001', '11101', '111001', '101', '10001', '1001', '10111'],
            text_to_encode = text.slice( 1, 7 ),
            count = 3,
            pts = this.points,
            positive_value = __first ? "-" : "+";

            for( var i = 0; i < 6; i++ ){
                var __cur = cur[ i ],
                encoded_value = ( __cur == positive_value ? even_pattern : odd_pattern )[ parseInt( text_to_encode[ i ] ) ].padStart( 7, 0 ),
                arr = encoded_value.split( "" );

                for( var j = 0; j < 7; j++ ){
                    var cur_pt = pts[ count++ ];
                    
                    if( cur_pt.is_filled ){
                        j--;
                        continue;
                    }

                    cur_pt.is_filled = true;
                    cur_pt.fill = arr[ j ] == "1";
                }
            }
        }

        encode_a_data( text ){
            var pts = this.points,
            text_len = text.length,
            left_pattern = [ "1101", "11001", "10011", "111101", "100011", "110001", "101111", "111011", "110111", "1011" ],
            is_invert = false,
            count = 3,
            mid = text_len / 2;

            for( var i = 0; i < text_len; i++ ){

                is_invert = i >= mid;

                var cur = left_pattern[ text[ i ] ].padStart( 7, "0" ),
                fill_value = is_invert ? "0" : "1";

                for( var j = 0; j < 7; j++ ){
                    var cur_pt = pts[ count++ ];
                    
                    if( cur_pt.is_filled ){
                        j--;
                        continue;
                    }

                    cur_pt.fill = cur[ j ] == fill_value;

                    if( i == 0 || i == text_len - 1 ){
                        cur_pt.type = "guard";
                    }
                }
            }
        }

        fill_intermediate( limit, is_a ){
            var intermediate_text = "01010" + ( is_a ? "" : "1" ),
            len = intermediate_text.length,
            mid = 3 + Math.round( is_a ? limit / 2 : limit ) * 7,
            pts = this.points;

            for( var i = 0; i < len; i++ ){
                var cur = {
                    is_filled : true,
                    type : "intermediate",
                    fill : intermediate_text[ i ] == "1"
                };

                pts.splice( mid + i, 0, cur );
            }
        }

        fill_tails( is_a ){
            var tail_text = "101",
            len = tail_text.length,
            pts = this.points;

            for( var i = 0; i< len; i++ ){
                var first = {
                    type : "start_tail"
                },
                last = {
                    type : "stop_tail"
                };

                last.is_filled = first.is_filled = true;
                last.fill = first.fill = tail_text[ i ] == "1";
                is_a && pts.push( last );
                pts.splice( i, 0, first );
            }
        }

        init( len ){
            var limit = len * 7,
            arr = [];

            for( var i = 0; i < limit; i++ ){
                arr.push({
                  is_filled : false,
                  fill : false,
                  type : "data"  
                });
            }

            this.points = arr;
        }

        get_checksum_value( text, limit ){
            var ret = 0,
            is_odd = 0;

            for( var i = limit - 1; i >= 0; i-- ){
                var cur = text[ i ],
                numb = parseInt( cur );
                
                ret += numb * ( is_odd ? 1 : 3 ); 
                is_odd = !is_odd;
            }

            return ( 10 - ret % 10 ) % 10;
        }
    }

    if( typeof $L != "undefined" ){
        $L.upc = function( ops ){
            return new LyteBarcode_Upc( ops );
        };

        $L.upc.class_instance = LyteBarcode_Upc;
    } else {
        window.LyteBarcode_Upc = LyteBarcode_Upc;
    }
} )();