/**
 * This is used to create Code 93 and extended 93 barcodes in web
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
        show_checksum : true,
        background : "white",
        scale : window.devicePixelRatio,
        extended : false,
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
    },
    supported_chars = [ "0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","-","."," ","$","/","+","%","($)","(%)","(/)","(+)" ],
    encoding_values = ["131112","111213","111312","111411","121113","121212","121311","111114","131211","141111","211113","211212","211311","221112","221211","231111","112113","112212","112311","122112","132111","111123","111222","111321","121122","131121","212112","212211","211122","211221","221121","222111","112122","112221","122121","123111","121131","311112","311211","321111","112131","113121","211131","121221","312111","311121","122211", "111141", "1"],
    extended = { "@":"(%)V","'":"(/)G","!":"(/)A","\"":"(/)B","#":"(/)C","&":"(/)F","(":"(/)H",")":"(/)I","*":"(/)J",",":"(/)L",":":"(/)Z",";":"(%)F","[":"(%)K","{":"(%)P","<":"(%)G","\\":"(%)L","":"(%)Q","=":"(%)H","]":"(%)M","}":"(%)R",">":"(%)I","^":"(%)N","~":"(%)S","?":"(%)J","_":"(%)O"}; 

    class LyteBarcode_Code93{
        constructor( options ){
            extend( options, default_options );

            var text = options.text || "",
            ret = this.encode( text, options.extended );

            if( !ret ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
            }

            this.find_checksum( ret );
            this.convert_to_binary( ret );

            this.draw_in_canvas( options.canvas || document.createElement( "canvas" ), options, text );
        }

        convert_to_binary( arr ){
            var pts = [];

            arr.forEach( item =>{
                var value = encoding_values[ item ],
                len = value.length;

                for( var i = 0; i < len; i++ ){
                    var __value = parseInt( value[ i ] ),
                    fill = i % 2 ? '0' : '1';

                    for( var j = 0; j < __value; j++ ){
                        pts.push({
                            is_filled : true,
                            type : "data",
                            fill : fill == "1"
                        });
                    }
                }   

            });

            this.points = pts;
        }

        find_checksum( arr ){
            var __first = 0,
            __second = 0,
            len = arr.length;

            arr.forEach( ( item, index ) =>{
                __first += item * ( len - index );
                __second += item * ( len + 1 - index );
            });

            arr.push( __first % 47, ( __second + __first ) % 47, 47, 48 );
            arr.unshift( 47 );
        }

        encode( text, allow_extend ){
            var len = text.length,
            arr = [],
            fn = function( char ){
                return supported_chars.indexOf( char );
            };

            for( var i = 0; i < len; i++ ){
                var cur = text[ i ],
                is_basic = fn( cur );

                if( is_basic == -1 ){
                    var is_extended;

                    if( allow_extend ){
                        if( /[a-z]/.test( cur ) ){
                            is_extended = "(+)" + cur.toUpperCase();
                        } else {
                            is_extended = extended[ cur ];
                        }
                    }

                    if( is_extended ){
                        var match = is_extended.match( /(.{3})([A-Z])/ );
                        match.shift();
                        match.forEach( item =>{
                            arr.push( fn( item ) );
                        });
                    } else {
                        return;
                    }
                } else {
                    arr.push( is_basic );
                }
            }

            return arr;
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

            if( background ){
                ctx.fillStyle = background;
                ctx.fillRect( 0, 0, width, new_height );
            }

            var textArray = [ { text : text, left : width / 2, top : span_height - 2 * vert_padding + height, maxWidth : width } ];
            this.textArray = textArray;

            ctx.font = label_options.font;
            ctx.fillStyle = label_options.color;

            textArray.forEach( item =>{
                ctx.textAlign = item.textAlign;
                ctx.fillText( item.text, item.left, item.top, item.maxWidth );
            });

            return new_height;
         }
    };

    if( typeof $L != "undefined" ){
        $L.code93 = function( ops ){
            return new LyteBarcode_Code93( ops );
        };

        $L.code93.class_instance = LyteBarcode_Code93;
    } else {
        window.LyteBarcode_Code93 = LyteBarcode_Code93;
    }
} )();
