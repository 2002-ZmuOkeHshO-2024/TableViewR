/**
 * This is for rotating the canvas contents.
 * It only supports 90,180,270 rotation
 */


;( function(){

    function rotate( ops ){
        var canvas = ops.canvas,
        ctx = canvas.getContext( '2d', { willReadFrequently: true } ),
        width = canvas.width,
        height = canvas.height,
        image_data = ctx.getImageData( 0, 0, width, height ),
        old_data = image_data.data,
        new_data =  new Uint8ClampedArray( width * height * 4 );
        angle = ops.angle,
        limit = parseInt( angle / 90 );

        for( var __i = 0; __i < limit; __i++ ){
            for( var i = 0; i < width; i++ ){
                for( var j = 0; j < height; j++ ){
                    var pos = ( j * width + i ) * 4,
                    r = old_data[ pos ],
                    g = old_data[ pos + 1 ],
                    b = old_data[ pos + 2 ],
                    a = old_data[ pos + 3 ],
                    new_position = ( i * height + height - j - 1 ) * 4;

                    new_data[ new_position ] = r;
                    new_data[ new_position + 1 ] = g;
                    new_data[ new_position + 2 ] = b;
                    new_data[ new_position + 3 ] = a;
                }
            }

            var temp = width;
            width = height;
            height = temp;
            old_data = new_data;
            new_data =  new Uint8ClampedArray( width * height * 4 );
        }

        canvas.width = width;
        canvas.height = height;

        ctx.putImageData( new ImageData( old_data, width, height ), 0, 0 );
    }
    
    if( typeof $L != "undefined" ){
        $L.rotate_canvas = rotate;
    } else {
        window.lyte_rotate_canvas = rotate;
    }
} )();
