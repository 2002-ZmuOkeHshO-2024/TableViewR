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
        mod43 : false,
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
    // here values are in base 36
    encoding_values = ['225', '2ln', '27f', '2ol', '223', '2lx', '27p', '21n', '2lp', '27h', '2mj', '28b', '2p1', '24r', '2n9', '291', '23f', '2ml', '28d', '24t', '2mr', '28j', '2p5', '24z', '2nd', '295', '243', '2mx', '28p', '255', '2i3', '1wr', '2j9', '1uz', '2id', '1x1', '1uj', '2i5', '1wt', '1t1', '1t5', '1u1', '215', '1v1'],
    supported_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*",
    extended = { "@":"%V","`":"%W","!":"/A","\"":"/B","#":"/C","$":"/D","%":"/E","&":"/F","'":"/G","(":"/H",")":"/I","*":"/J","+":"/K",",":"/L","/":"/O",":":"/Z",";":"%F","[":"%K","{":"%P","<":"%G","\\":"%L","|":"%Q","=":"%H","]":"%M","}":"%R",">":"%I","^":"%N","~":"%S","?":"%J","_":"%O" };

    class LyteBarcode_Code39{
        constructor( options ){
            extend( options, default_options );

            var text = options.text || "",
            ret = this.encode( text, options.extended );

            if( !ret ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
            }

            options.mod43 && ( text = this.find_checksum( ret, text ) );
            this.convert_to_binary( ret );

            this.draw_in_canvas( options.canvas || document.createElement( "canvas" ), options, text );
        }

        find_checksum( arr, text ){
            var check_sum = arr.reduce( ( acc, cur ) => acc + cur ) % 43;
            arr.push( check_sum );

            return text + supported_chars[ check_sum ];
        }

        convert_to_binary( arr ){
            arr.push( 43 );
            arr.unshift( 43 );
            var pts = [];

            arr.forEach( item =>{
                var value = parseInt( encoding_values[ item ], 36 ).toString( 2 ),
                len = value.length;

                for( var i = 0; i < len; i++ ){
                    pts.push({
                        is_filled : true,
                        type : "data",
                        fill : value[ i ] == "1"
                    });
                }

                pts.push({
                    is_filled : true,
                    type : "inter",
                    fill : !1
                });
            });

            this.points = pts;
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
                            is_extended = "+" + cur.toUpperCase();
                        } else {
                            is_extended = extended[ cur ];
                        }
                    }

                    if( is_extended ){
                        var match = is_extended.match( /(.{1})([A-Z])/ );
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

            arr.push();

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
            } );

            return new_height;
         }
    };

    if( typeof $L != "undefined" ){
        $L.code39 = function( ops ){
            return new LyteBarcode_Code39( ops );
        };

        $L.code39.class_instance = LyteBarcode_Code39;
    } else {
        window.LyteBarcode_Code39 = LyteBarcode_Code39;
    }
} )();
