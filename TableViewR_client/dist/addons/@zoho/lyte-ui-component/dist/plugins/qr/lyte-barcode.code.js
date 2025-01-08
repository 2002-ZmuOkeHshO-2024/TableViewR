/**
 * This encodes Codabar, pharmacode and Code 128 type barcodes
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
        show_label : true,
        background : "white",
        scale : window.devicePixelRatio,
        type : "codabar",
        start_character : "A",
        stop_character : "A",
        show_start_stop_character : false,
        label_options : {
            font : "20px Arial",
            padding: '5px',
            color: 'black'
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

    class LyteBarcode_Code{
        constructor( options ){
            extend( options, default_options );

            var type = options.type,
            final_text;

            if( this[ "constructor_" + options.type ]( options ) ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
            }

            switch( type ){
                case "codabar" : {
                    this.encode( final_text = options.start_character + options.text + options.stop_character );
                }
                break;
                case '128' : {
                    this.form_modes( final_text = options.text );
                }
                break;
                case 'pharmacode' : {
                    this.pharama_encoding( parseInt( options.text ) );
                }
                break;
            }

            this.draw_in_canvas( this.canvas = options.canvas || document.createElement( "canvas" ), options, final_text );
        }

        pharama_encoding( value ){
            var str = "";

            while( value ){
                if( value % 2 ){
                    str = "100" + str;
                    value = ( value - 1 ) / 2;
                } else {
                    str = '11100' + str;
                    value = ( value - 2 ) / 2;
                }
            }

            this.points = str.replace( /0+$/, "" ).split( "" ).map( item =>{
                return{
                    type : "data",
                    is_filled : true,
                    fill : item == "1"
                };
            } );
        }

        constructor_pharmacode( options ){
            var value = parseInt( options.text );
            return value < 3 || value > 131070;
        }

        constructor_128( options ){
            var text = options.text;
            return !/^[\dA-z $%*+\-./:!#&'"\(\)\,;\<\=\>\?@\[\\\]\^_'\{\|\}\~]+$/.test( text );
        }

        individual_bar( str ){
            var len = str.length,
            ret = "";
   
            for( var i = 0; i < len; i++ ){
               var cur = str[ i ],
               cur_ret = "";
               ret += cur_ret.padEnd( parseInt( cur ), i % 2 == 0 ? 1 : 0 );
            }
   
            return ret;
         }

        form_modes( text ){
            var type_c_regex = /^\d{2}/,
            encode_data = ["212222","222122","222221","121223","121322","131222","122213","122312","132212","221213","221312","231212","112232","122132","122231","113222","123122","123221","223211","221132","221231","213212","223112","312131","311222","321122","321221","312212","322112","322211","212123","212321","232121","111323","131123","131321","112313","132113","132311","211313","231113","231311","112133","112331","132131","113123","113321","133121","313121","211331","231131","213113","213311","213131","311123","311321","331121","312113","312311","332111","314111","221411","431111","111224","111422","121124","121421","141122","141221","112214","112412","122114","122411","142112","142211","241211","221114","413111","241112","134111","111242","121142","121241","114212","124112","124211","411212","421112","421211","212141","214121","412121","111143","111341","131141","114113","114311","411113","411311","113141","114131","311141","411131","211412","211214","211232","233111", "2"],
            str = "",
            sum = 0,
            count = 0,
            prev_mode,
            arr = [],
            fn = ( value, type ) =>{
                var ret = this.individual_bar( encode_data[ value ] ),
                len = ret.length;

                for( var i = 0; i < len; i++ ){
                    arr.push({
                        is_filled : true,
                        type : type || "data",
                        fill : ret[ i ] == "1"
                    });
                }
                
                str += ret;
                sum += ( count++ || 1 ) * value;
            };

            while( text.length ){
                var match = text.match( type_c_regex ),
                cur_mode = "B",
                remove_len = 1;

                if( match ){
                    cur_mode = "C";
                    remove_len++;
                }

                if( prev_mode != cur_mode ){
                    var is_c = cur_mode == 'C'
                    if( prev_mode ){
                        // mode switch
                        fn( is_c ? 99 : 100, "mode_switch" );
                    } else {
                        // start
                        fn( is_c ? 105 : 104, "start" );
                    }   

                    prev_mode = cur_mode;
                }

                if( match ){
                    fn( parseInt( match ) );
                } else {
                    fn( text.slice( 0, 1 ).charCodeAt( 0 ) - 32 );
                }

                text = text.slice( remove_len );
            }

            // checksum
            fn( sum % 103, "check_sum" );
            // stop
            fn( 106, "stop" );

            fn( 107, "termination" );

            this.points = arr;
        }

        constructor_codabar( options ){
            var text = options.text,
            rgx = /^[0-9\-\$\:\.\+\/]+$/,
            start_character = options.start_character,
            stop_character = options.stop_character,
            char_rgx = /^[A-D]$/;

            return !rgx.test( text ) || !char_rgx.test( start_character ) || !char_rgx.test( stop_character );
        }

        encode( text ){
            var encode_binary = {
                "0": "101010011",
                "1": "101011001",
                "2": "101001011",
                "3": "110010101",
                "4": "101101001",
                "5": "110101001",
                "6": "100101011",
                "7": "100101101",
                "8": "100110101",
                "9": "110100101",
                "-": "101001101",
                "$": "101100101",
                ":": "1101011011",
                "/": "1101101011",
                ".": "1101101101",
                "+": "1011011011",
                "A": "1011001001",
                "B": "1001001011",
                "C": "1010010011",
                "D": "1010011001"
            },
            len = text.length,
            str = "",
            arr = [];

            for( var i = 0; i < len; i++ ){

                if( i ){
                    str += "0";
                    arr.push({
                        is_filled : true,
                        fill : false,
                        type : "inter_character"
                    });
                }

                var cur_value = encode_binary[ text[ i ] ],
                cur_len = cur_value.length;
                
                str += cur_value;

                for( var j = 0; j < cur_len; j++ ){
                    arr.push({
                        is_filled : true,
                        fill : cur_value[ j ] == "1",
                        type : "data"
                    });
                }
            }

            this.points = arr;

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
                this.show_label( scale, options.label_options, background, ctx, canvas, width, height, options.show_start_stop_character ? final_text : options.text );
            } else if( background ){
                ctx.fillStyle = background;
                ctx.fillRect( 0, 0, width, height );
            }
   
            before_draw && before_draw( canvas, this );

            for( var i = 0; i < len; i++ ){
                var cur = pts[ i ];

                ctx.fillStyle = cur.fill ? fill_color : non_fill_color;
                ctx.rect( ( quiet_zone +  i ) * unit_width, 0, unit_width, unit_height );
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

            ctx.fillStyle = background;
            ctx.fillRect( 0, 0, width, new_height );

            var textArray = [ { textAlign : "center", text : text, left : width / 2, top : span_height - 2 * vert_padding + height, maxWidth : width } ];
            this.textArray = textArray;

            ctx.font = label_options.font;
            ctx.fillStyle = label_options.color;

            textArray.forEach( item =>{
                ctx.textAlign = item.textAlign;
                ctx.fillText( item.text, item.left, item.top, item.maxWidth );
            });

            return new_height;
         }
    }

    if( typeof $L != "undefined" ){
        $L.code = function( ops ){
            return new LyteBarcode_Code( ops );
        }
        $L.code.class_instance = LyteBarcode_Code;
    } else {
        window.LyteBarcode_Code = LyteBarcode_Code;
    }
    
})();
