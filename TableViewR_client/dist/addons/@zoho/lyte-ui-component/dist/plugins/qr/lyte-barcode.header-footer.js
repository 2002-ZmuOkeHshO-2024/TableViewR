/**
 * This will add header and footers to the barcode and Qr codes.
 * This uses screengrab for processing the dom to image
 * It will produce a new canvas. It wont modify existing one
 * 
 * Always use this only for downloading as image. Please use normal dom elements for rendering as html
 */


;( function(){

    var __def = {
        font : "20px Arial",
        padding: '5px',
        color: 'black',
        background : "white",
        display : "inline-block",
        textAlign : "center",
        lineHeight : '22px',
        boxSizing : "border-box"
    },
    default_options = {
       header : __def,
       footer : __def,
       scale : window.devicePixelRatio
    },
    extend = function ( options, ret ){
        for( var key in options ){
           var cur = options[ key ];

           if( /^(header|footer)$/i.test( key ) ){
                ret[ key ] = extend( cur || {}, ret[ key ] || {} );
           } else {
                ret[ key ] = options[ key ];
           }
        }
        return ret;
    },
    create_dom = function( obj, width ){
        var text = obj.text;

        if( text ){
            var div = document.createElement( 'div' );

            div.textContent = text;

            for( var key in obj ){
                div.style[ key ] = obj[ key ];
            }

            $L( div ).css({
                position : "absolute",
                left : "-10000px",
                top : "-10000px",
                width : width + 'px'
            });

            return div;
        }
    };

    $L.barcode_header_footer = function( options ){
        return new Promise( ( res, rej ) =>{
            options = extend( options || {}, extend( default_options, {} ) );
        
            var canvas = options.canvas,
            width = canvas.width,
            height = canvas.height,
            canvas_options = { willReadFrequently : true },
            ctx = canvas.getContext( '2d', canvas_options ),
            scale = options.scale,
            div1 = create_dom( options.header, width / scale ),
            div2 = create_dom( options.footer, width / scale ),
            body = document.body,
            promise_arr = [],
            arr = [],
            height_acc = 0,
            screenGrab_options = options.screen_grab,
            target_canvas = document.createElement( 'canvas' ),
            target_ctx = target_canvas.getContext( '2d', canvas_options )
    
            div1 && arr.push( body.appendChild( div1 ) );
            div2 && arr.push( body.appendChild( div2 ) );

            if( arr.length == 0 ){
                return rej( "No header and footer found" );
            }

            arr.forEach( item =>{
                promise_arr.push( $L.screenGrab(extend( {
                    dom : item,
                    styles : [ "position", "left", "top" ],
                    styles_replace : [ "", "", "" ]
                }, screenGrab_options || {} )).then( ret =>{
                    item.remove();

                    var canvas = ret.canvas;
                    height_acc += canvas.height;
                    
                    return canvas;
                }, () =>{
                    item.remove();
                    rej();
                }));
            });

            Promise.all( promise_arr ).then( items =>{
                var image_data = ctx.getImageData( 0, 0, width, height ),
                fn = ( cur_image_data ) =>{
                    target_ctx.putImageData( cur_image_data, 0, height_acc );
                },
                first = items[ 0 ];
                last = items[ div1 ? 1 : 0 ];

                target_canvas.height = height_acc + canvas.height;
                target_canvas.width = width;
                height_acc = 0;

                if( div1 ){
                     fn( first.getContext( '2d', canvas_options ).getImageData( 0, 0, first.width, first.height ) );
                     height_acc += first.height;
                }
                
                fn( image_data );
                height_acc += height;

                if( div2 ){
                    fn( last.getContext( '2d', canvas_options ).getImageData( 0, 0, last.width, last.height ) );
                }

                res( target_canvas );
            }, rej);
        });
    }
} )();
