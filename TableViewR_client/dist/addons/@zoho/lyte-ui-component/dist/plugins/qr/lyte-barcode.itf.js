/**
 * This is used to create interleaved 2 of 5 ( ITF ) and ITF 14 type barcodes in web. Default value is ITF
 * contact @lyte-team@zohocorp.com
 */

;( function(){
    var default_options = {
        fill_color : "black",
        non_fill_color : "white",
        quiet_zone : 10,
        width : void 0,
        height : void 0,
        unit_width : 5,
        show_checksum : true,
        show_label : true,
        background : "white",
        scale : window.devicePixelRatio,
        type : "",
        label_options : {
            font : "20px Arial",
            padding: '5px',
            color: 'black',
            background : "white"
        },
        bearer_bars : {
            hori : false,
            vert : false
        },
        bearer_dimension : 3.7795275591 * 4.8
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

    class LyteBarcode_Itf{
        constructor( options ){
            extend( options, default_options );

            var text = options.text || '',
            type = options.type,
            ret;

            switch( type ){
                case "14" : {
                    ret = this.const_14( text );
                } 
                break;
                default : {
                    ret = this.const_default( text );
                }
            }
            

            if( !ret ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
            }

            text = this.__text || text;

            this.encode( text, type );

            this.draw_in_canvas( options.canvas || document.createElement( "canvas" ), options, text );
        }

        const_14( text ){
            var len = text.length,
            ret = false;

            if( !/^[0-9]+$/.test( text ) ){
                return 0;
            }

            switch( len ){
                case 13 : {
                    ret = true;
                    text += this.get_checksum_value( text, 13 );
                    this.__text = text;
                }
                break;
                case 14 : {
                    ret = text[ 13 ] == this.get_checksum_value( text, 13 );
                }
                break;
            }

            return ret;
        }

        const_default( text ){
            var len = text.length;

            if( len % 2 != 0 ){
                text += this.get_checksum_value( text, text.length );
                this.__text = text;
            }

            return /^[0-9]+$/.test( text );
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

        encode( text, type ){
            this.points = [];

            var str = this.to_points( "1010", 'start_pattern' ),
            arr = [ "110", "10001", "1001", "11000", "101", "10100", "1100", "11", "10010", "1010" ];

            text.match( /.{2}/g ).forEach( item =>{
                var second = arr[ item[ 1 ] ].padStart( 5, 0 ),
                first = arr[ item[ 0 ] ].padStart( 5, 0 );

                for( var i = 0; i < 5; i++ ){
                    var cur = first[ i ];

                    str += this.to_points( cur == '1' ? '111' : '1' );
                    str += this.to_points( second[ i ] == '1' ? '000' : '0' );
                }
            } );    

            str += this.to_points( "11101", 'stop_patten' );

        }

        to_points( str, type ){
            var arr = this.points,
            len = str.length;

            for( var i = 0; i < len; i++ ){
                arr.push({
                    is_filled : true,
                    type : type || "data",
                    fill : str[ i ] == "1"
                });
            }

            return str;
        }

        draw_in_canvas( canvas, options, final_text ){
            var pts = this.points,
            fill_color = options.fill_color, 
            non_fill_color = options.non_fill_color, 
            quiet_zone = options.quiet_zone, 
            background = options.background, 
            before_draw = options.before_draw,
            len = pts.length,
            scale = options.scale,
            width = options.width * scale,
            height = options.height * scale,
            unit_width = width / ( len + 2 * quiet_zone ),
            ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
            unit_height = height;

            this.canvas = canvas;

           if( isNaN( unit_width ) ){
               unit_width = options.unit_width * scale;
               width = unit_width * ( len + 2 * quiet_zone ) * scale;
           }

           if( isNaN( unit_height ) ){
               height = unit_height = Math.max(  5 * 3.7795275591, width * .15 );
           }

            canvas.width = width;
            canvas.height = height; 

            if( options.show_label ){
                this.show_label( scale, options.label_options, background, ctx, canvas, width, height, options.show_checksum ? final_text : options.text );
            } else if( background ){
                ctx.fillStyle = background;
                ctx.fillRect( 0, 0, width, height );
            }  
   
            before_draw && before_draw( canvas, this );

            var bearer_bars = options.bearer_bars,
            bearer_dimension = options.bearer_dimension,
            __hori = bearer_bars.hori,
            __vert = bearer_bars.vert,
            off_top = 0,
            off_left = 0;

            if( __vert ){
                unit_height -= 2 * bearer_dimension;
                ctx.fillStyle = fill_color;

                ctx.fillRect( 0, 0, width, bearer_dimension );

                ctx.fillRect( 0, bearer_dimension + unit_height, width, bearer_dimension );
                ctx.beginPath();
                off_top = bearer_dimension;
            }

            if( __hori ){
                unit_width = ( width - 2 * bearer_dimension ) / ( len + 2 * quiet_zone );

                ctx.fillRect( 0, bearer_dimension, bearer_dimension, unit_height );

                ctx.fillRect( width - bearer_dimension, bearer_dimension, bearer_dimension, unit_height );
                ctx.beginPath();
                off_left = bearer_dimension;
            }

            for( var i = 0; i < len; i++ ){
                var cur = pts[ i ];

                ctx.fillStyle = cur.fill ? fill_color : non_fill_color;
                ctx.rect( off_left + ( quiet_zone +  i ) * unit_width, off_top, unit_width, unit_height );
                ctx.fill();
                ctx.beginPath();
            }
         }

         show_label( scale, label_options, background, ctx, canvas, width, height, text ){
            ctx.font = label_options.font;

            var span = document.createElement( "span" ),
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
            
            var new_height = height + span_height,
            vert_padding = parseInt( label_options.padding ) * scale;

            canvas.height = new_height;

            if( background ){
                ctx.fillStyle = background;
                ctx.fillRect( 0, 0, width, new_height );
            }

            ctx.font = label_options.font;
            ctx.fillStyle = label_options.color;
            ctx.textAlign = "center";
            ctx.fillText( text, width / 2, span_height - 2 * vert_padding + height, width )

            this.textArray = [{
                text : text,
                left : width / 2,
                top : span_height - 2 * vert_padding + height,
                maxWidth : width
            }];

            return new_height;
         }
    };

    if( typeof $L != "undefined" ){
        $L.itf = function( ops ){
            return new LyteBarcode_Itf( ops );
        };

        $L.itf.class_instance = LyteBarcode_Itf;
    } else {
        window.LyteBarcode_Itf = LyteBarcode_Itf;
    }

} )();
