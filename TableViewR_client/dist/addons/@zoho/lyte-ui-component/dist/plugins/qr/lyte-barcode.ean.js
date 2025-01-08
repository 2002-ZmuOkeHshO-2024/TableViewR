/**
 * This can create EAN 8 and 13 type barcodes in web
 * contact @lyte-team@zohocorp.com
 */

/**
 * Feb 1, 2024
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
        type : "8",
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

    class LyteBarcode_Ean{
        constructor( options ){

            extend( options, default_options );

            var text = options.text,
            is_8 = options.type == "8",
            limit = is_8 ? 7 : 12,
            is_error = !/^[0-9]+$/.test( text ),
            has_checksum;

            if( !is_error ){
                var text_len = text.length;
                
                is_error = limit != text_len;

                if( is_error && limit == text_len - 1 ){
                    is_error = parseInt( text.slice( -1 ) ) != this.get_checksum_value( text.slice( 0,-1 ), limit );
                    has_checksum = true;
                }
            }

            if( is_error ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
            }

            var canvas = options.canvas || document.createElement( "canvas" ),
            scale = options.scale,
            width = options.width * scale,
            height = options.height * scale;

            canvas.width = width;
            canvas.height = height;

            this.init( limit + ( is_8 ? 1 : 0 ) );
            this.fill_tails();
            this.fill_intermediate( limit );

            var check_sum = has_checksum ? '' : this.get_checksum_value( text, limit );
            this.encode_data( text + check_sum, is_8 );

            this.draw_in_canvas( canvas, width, height, options, text + check_sum );

            this.canvas = canvas;
        }

        init( limit ){
            var len = 3 * 2 + 5 + 7 * limit,
            arr = [];

            for( var i = 0; i < len; i++ ){
                var obj = {
                    is_filled : false,
                    fill : true,
                    type : void 0
                };

                arr.push( obj );
            }

            this.points = arr;
        }

        fill_tails(){
            var tail_text = "101",
            len = tail_text.length,
            pts = this.points,
            total_len = pts.length;

            for( var i = 0; i< len; i++ ){
                var first = pts[ i ],
                last = pts[ total_len - 1 - i ];

                last.is_filled = first.is_filled = true;
                last.fill = first.fill = tail_text[ i ] == "1";
                last.type = "stop_tail";
                first.type = "start_tail";
            }
        }

        fill_intermediate( limit ){
            var intermediate_text = "01010",
            len = intermediate_text.length,
            mid = 3 + Math.round( limit / 2 ) * 7,
            pts = this.points;

            for( var i = 0; i < len; i++ ){
                var cur = pts[ mid + i ];
                cur.is_filled = true;
                cur.type = "intermediate";
                cur.fill = intermediate_text[ i ] == "1";
            }
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

        encode_data( text, is_8 ){
            var len = text.length,
            half = Math.ceil( len / 2 ),
            count = 3,
            pts = this.points,
            positive = '1',
            encoded_data = [ "1101", "11001","10011", "111101", "100011", "110001", "101111", "111011", "110111", "1011" ],
            cur_parity;

            if(  !is_8 && len ){
                var parity_encode = [ '', '1011', '1101', '1110', '10011', '11001', '11100', '10101', '10110', '11010' ];
                cur_parity = parity_encode[ parseInt( text[ 0 ] ) ].padStart( 6, "0" );
            }

            for( var i = is_8 ? 0 : 1; i < len; i++ ){
                var cur = parseInt( text[ i ] ),
                encoded_value = encoded_data[ cur ].padStart( 7, '0' ),
                is_odd = true;

                if( i == half ){
                    positive = "0";
                }

                if( !is_8 && positive == "1" && cur_parity[ i - 1 ] == positive ){
                    is_odd = false;
                    positive = "0";
                }

                for( var j = 0; j < 7; j++ ){     
                    var cur_value = encoded_value[ is_odd ? j : ( 6 - j ) ],
                    cur_pt;

                    while( ( cur_pt = pts[ count ] ).is_filled ){
                        count++;
                    }

                    cur_pt.is_filled = true;
                    cur_pt.fill = ( cur_value == positive );
                    cur_pt.type = "data";
                    count++;
                }

                if( !is_odd ){
                    positive = "1";
                }
            }

        }

        draw_in_canvas( canvas, width, height, options, text ){
            var pts = this.points,
            fill_color = options.fill_color, 
            non_fill_color = options.non_fill_color, 
            quiet_zone = options.quiet_zone, 
            background = options.background, 
            before_draw = options.before_draw,
            len = pts.length,
            unit_width = width / ( len + 2 * quiet_zone ),
            ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
            unit_height = Math.floor( height / 1.15 ),
            scale = options.scale;

            if( isNaN( unit_width ) ){
                unit_width = options.unit_width * scale;
                width = unit_width * ( len + 2 * quiet_zone ) * scale;
            }
 
            if( isNaN( unit_height ) ){
                height = unit_height = Math.max(  5 * 3.7795275591, width * .15 );
            }
            
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
            max_width = width - 11 * unit_width - 2 * quiet_zone * unit_width;

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
                    left : quiet_zone * 0.5 * unit_width + width * .25,
                    text : text.slice( 0, 4 ),
                    maxWidth : max_width
                },
                {
                    left : width * .75 - quiet_zone * 0.5 * unit_width,
                    text : text.slice( 4 ),
                    maxWidth : max_width
                }
            ];

            if( options.type == "13" ){
                arr.unshift({
                    textAlign : "left",
                    left : quiet_zone * unit_width / 2,
                    maxWidth : quiet_zone * unit_width,
                    text : text.slice( 0, 1 )
                });

                arr[ 1 ].text = text.slice( 1, 7 );
                arr[ 2 ].text = text.slice( 7 );
            }

            arr.forEach( item => {
                ctx.textAlign = item.textAlign || ( item.textAlign = "center" );
                ctx.fillText( item.text, item.left, item.top = ( span_height - 2 * vert_padding + height - height_loss ), item.maxWidth );
            });

            this.textArray = arr;

            return new_height;
         }
    };

    if( typeof $L != "undefined" ){
        $L.ean = function( ops ){
            return new LyteBarcode_Ean( ops );
        }
        $L.ean.class_instance = LyteBarcode_Ean;
    } else {
        window.LyteBarcode_Ean = LyteBarcode_Ean;
    }
} )(); 