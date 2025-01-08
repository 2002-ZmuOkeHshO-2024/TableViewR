/*
 * This plugin is used for creating Data matrix barcodes in web.
 * contact @lyte-team@zohocorp.com
 */


/**
 * To do
 * Other encoding modes support
 * Dec 19, 2023
 */

;( function(){
    var default_options = {
        width : 500, 
        height : 500, 
        fill_color : "black", 
        non_fill_color : "white", 
        quiet_zone : 1, 
        background : "white", 
        scale : window.devicePixelRatio,
        is_rect : false,
        unit_size : 5,
        min_unit_size : 0
      }, 
     log_arr = [], 
     anti_log_arr = [], 
     matrix_data = [ //  Data and error blocks for different level of data matrix
        { row:10, col:10, region:1, data:3, error:5, blocks : 1 }, 
        { row:12, col:12, region:1, data:5, error:7, blocks : 1 }, 
        { row:14, col:14, region:1, data:8, error:10, blocks : 1 }, 
        { row:16, col:16, region:1, data:12, error:12, blocks : 1 }, 
        { row:18, col:18, region:1, data:18, error:14, blocks : 1 }, 
        { row:20, col:20, region:1, data:22, error:18, blocks : 1 }, 
        { row:22, col:22, region:1, data:30, error:20, blocks : 1 }, 
        { row:24, col:24, region:1, data:36, error:24, blocks : 1 }, 
        { row:26, col:26, region:1, data:44, error:28, blocks : 1 }, 
        { row:32, col:32, region:4, data:62, error:36, blocks : 1 }, 
        { row:36, col:36, region:4, data:86, error:42, blocks : 1 }, 
        { row:40, col:40, region:4, data:114, error:48, blocks : 1 }, 
        { row:44, col:44, region:4, data:144, error:56, blocks : 1 }, 
        { row:48, col:48, region:4, data:174, error:68, blocks : 1 }, 
        { row:52, col:52, region:4, data:204, error:84, blocks : 2 }, 
        { row:64, col:64, region:16, data:280, error:112, blocks : 2 }, 
        { row:72, col:72, region:16, data:368, error:144, blocks : 4 }, 
        { row:80, col:80, region:16, data:456, error:192, blocks : 4 }, 
        { row:88, col:88, region:16, data:576, error:224, blocks : 4 }, 
        { row:96, col:96, region:16, data:696, error:272, blocks : 4 }, 
        { row:104, col:104, region:16, data:816, error:336, blocks : 6 }, 
        { row:120, col:120, region:36, data:1050, error:408, blocks : 6 }, 
        { row:132, col:132, region:36, data:1304, error:496, blocks : 8 }, 
        { row:144, col:144, region:36, data:1558, error:620, blocks : 8},
        { row:8, col:18, region:1, data:5, error:7, blocks : 1, is_rect : true },
        { row:8, col:32, region:2, data:10, error:11, blocks : 1, is_rect : true },
        { row:12, col:26, region:1, data:16, error:14, blocks : 1, is_rect : true },
        { row:12, col:36, region:2, data:22, error:18, blocks : 1, is_rect : true },
        { row:16, col:36, region:2, data:32, error:24, blocks : 1, is_rect : true },
        { row:16, col:48, region:2, data:49, error:28, blocks : 1, is_rect : true }
    ];

     ( function(){
        var value = 1;
  
        for( var exp = 1; exp < 256; exp++ ){
           value = value << 1;
  
           if( value > 255 ){
              value = value ^ 301;
           }
  
           log_arr[ value ] = exp % 255;
           anti_log_arr[ exp % 255 ] = value;
        }
  
     })();
  
     function log_multiply( val1,  val2 ){
  
        if( val1 && val2 ){
           var first = log_arr[ val1 ] || 0, 
           second = log_arr[ val2 ] || 0, 
           sum = first + second;
  
           return anti_log_arr[ sum % 255 ];
        } else {
           return 0;
        }
     }
  
  
     function log_div( val1,  val2 ){
        if( val1 && val2 ){
           var first = log_arr[ val1 ], 
           second = log_arr[ val2 ], 
           sum = first + second * 254;
  
           return anti_log_arr[ sum % 255 ];
        } else {
           return 1;
        }
     }

     function equation_multiplier( eqn1, eqn2 ){
        var new_eqn_len = eqn1.length + eqn2.length - 1,
        new_eq_arr = new Array( new_eqn_len );
  
        for( var i = 0; i < new_eqn_len; i++ ){
           var value = 0;
           for( var j = 0; j <= i; j++ ){
              var other_min_coeff = i - j;
  
              value = value ^ log_multiply( eqn1[ j ], eqn2[ other_min_coeff ] );
           }
           new_eq_arr[ i ] = value;
        }
  
        return new_eq_arr;
     }

     function equation_devision( eqn1, eqn2 ){
         var result_len = eqn1.length - eqn2.length + 1,
         ret = eqn1.slice();

         for( var i = 0; i < result_len; i++ ){
            var item = ret[ 0 ];

            if( item ){
               var sub_arr = equation_multiplier( eqn2, [ log_div( item, eqn2[ 0 ] ) ] );

               ret = ret.map( ( value, index ) => {
                  return value ^ ( sub_arr[ index ] || 0 );
               });
            }

            ret.shift();
         }

      return ret;
   }

        // object copy

   function qr_extend( options, ret ){
      for( var key in options ){
         ret[ key ] = options[ key ];
      }
      return ret;
   }

    class LyteBarcode_DataMatrix{
        constructor( options ){

            options = ( this.options = qr_extend( options || {}, qr_extend( default_options, {} ) ) );

            var text = options.text,
            is_rect = options.is_rect,
            canvas = options.canvas || document.createElement( "canvas" ),
            encoded_text = this.encode( text ),
            level = this.get_level( encoded_text.length, is_rect );

            if( level == void 0 ){
                var error_cb = options.onError;
                error_cb && error_cb( this );
                return false;
             }

             var error_len = level.error,
             region = level.region,
             region_row,
             region_col,
             row,
             column,
             blocks = level.blocks,
             per_block_error = error_len / blocks;

             if( is_rect ){
               region_row = 1;
               region_col = region;
             } else {
               region_col = region_row = Math.sqrt( region, 2 );
             }

             row = level.row - ( region_row - 1 ) * 2;
             column = level.col - ( region_col - 1 ) * 2;

             this.init( row, column );

             this.addPaddingLetters( encoded_text, level.data, error_len );
             var co_eff = this.error_coeff( per_block_error ),
             correction_arr = [];

             for( var i = 0; i < blocks; i++ ){
                 var cur_segment = encoded_text.filter( ( item, index )=>{
                     return index % blocks == i;
                 }),
                 error_correction = equation_devision( cur_segment, co_eff );

                 correction_arr.push( error_correction );
             }

             encoded_text.splice( encoded_text.length - error_len, error_len );

             this.shuffle( encoded_text, correction_arr, per_block_error );

             this.fill_final_symbol( row, column );

             this.add_finder_pattern( row, column );
             this.add_timing_pattern( row, column );

             this.fill_individual( encoded_text, 0, row, column, 1, 5, true );

             this.shift_data_for_region( row, column, region_row, region_col );

             this.draw_in_canvas( canvas, options, level.col );
             this.canvas = canvas;
        }

        /*
         * Multiple error blocks are arranged alternatively and added to the end of encoded data
         */
        
        shuffle( data, correction, per_block_error ){
           var len = correction.length;

           for( var i = 0; i < per_block_error; i++ ){
               for( var j = 0; j < len; j++ ){
                  data.push( correction[ j ][ i ] );
               }
           }
        }

        /**
         * Adding intermediate timing and finder patterns vertically and horizontally for multiple rows and colums
         */

        shift_data_for_region( row, col, region_row, region_col ){
            var row_layers = region_row - 1,
            col_layers = region_col - 1,
            row_data_length = ( row - 2 ) / region_row,
            col_data_length = ( col - 2 ) / region_col;

            for( var i = 0; i < row_layers; i++ ){
               this.insert_finder_pattern( 1 + i * 2 + ( i + 1 ) * row_data_length, 0, 0, 1, col );
               this.insert_timing_pattern( 1 + 1 + i * 2 + ( i + 1 ) * row_data_length, 0, 0, 1, col );
            }

            for( var i = 0; i < col_layers; i++ ){
               this.insert_timing_pattern( 0, 1 + i * 2 + ( i + 1 ) * col_data_length, 1, 0, row + ( region_row - 1 ) * 2, void 0, 1 );
               this.insert_finder_pattern( 0, 1 + 1 + i * 2 + ( i + 1 ) * col_data_length, 1, 0, row + ( region_row - 1 ) * 2 );
            }
        }

        /**
         * This will insert an intermediate timing pattern for a particular region
         * Same code is reused for inserting finder pattern too
         */

        insert_timing_pattern( x, y, x_fact, y_fact, len, frm_finder, check_value ){
            var pts = this.points;

            if( y_fact ){
               pts.splice( x, 0, [] );
            }

            for( var i = 0; i < len; i++ ){
               var obj = {
                  is_filled : true,
                  fill : !!frm_finder || i % 2 == ( check_value || 0 ),
                  type : frm_finder || "timing_pattern"
               };

               var row = pts[ x + i * x_fact ];
               row.splice( y + i * y_fact, 0, obj );
            }
        }

        /**
         * This will insert an intermediate finder pattern for a particular region
         */

        insert_finder_pattern( x, y, x_fact, y_fact, len ){
            this.insert_timing_pattern( x, y, x_fact, y_fact, len, "finder_pattern" );
        }

        /**
         * This will fill the main timing pattern
         */

        add_timing_pattern( row, col ){
            var points = this.points,
            fn = ( x, y, x_fact, y_fact, limit ) =>{
               for( var i = 0; i < limit; i++ ){
                  var cur = points[ x + i * x_fact ][ y + i * y_fact ];
                  if( cur.is_filled ){
                     continue;
                  }
                  cur.is_filled = true;
                  cur.fill = i % 2 == 0;
                  cur.type = "timing_pattern";
               }
            };

            fn( 1, col - 1, 1, 0, row - 1 );
            fn( 0, 0, 0, 1, col ); 
        }

        /**
         * This will fill the main finder pattern
         */

        add_finder_pattern( row, col ){
          var points = this.points,
          fn = ( x, y, x_fact, y_fact, limit ) => {
             for( var i = 0; i < limit; i++ ){
               var cur = points[ x + i * x_fact ][ y + i * y_fact ];
               cur.is_filled = cur.fill = true;
               cur.type = "finder_pattern";
             }
          };

          fn( 0, 0, 1, 0, row );
          fn( row - 1, 0, 0, 1, col );
        }

        /**
         * This will insert 4 default final symbols
         */

        fill_final_symbol( row, col ){
           var points = this.points,
           total_data_modules = ( row - 2 ) * ( col - 2 ),
           bit_len = 8;

           if( total_data_modules % bit_len == 4 ){
               var __fn = ( cur, value ) =>{
                  cur.type = "final_symbol";
                  cur.is_filled = true;
                  cur.fill = value;
               }

               __fn( points[ row - 3 ][ col - 3 ], true );
               __fn( points[ row - 2 ][ col - 2 ], true );
               __fn( points[ row - 3 ][ col - 2 ], false );
               __fn( points[ row - 2 ][ col - 3 ], false );
           }
        }

        /**
         * For rotational arrangement. When the expected position is lesser than starting point expected position
         */

        get_correct_position( x, y, row, col ){

            if( x < 1 ){
               x += ( row - 2 );
               y += 4 - ( ( row + 2 ) % 8 );
            }

            if( y < 1 ){
               y += ( col - 2 );
               x += 4 - ( ( col + 2 ) % 8 );
            }

            return {
               x : x,
               y : y
            };
        }

        /**
         * Special Corner arrangements for filling individual data
         */

        fill_particulier( encoded_text, index, cas_particulier, row, col ){
            var pts,
            bindary = encoded_text[ index ].toString( 2 ).padStart( 8, '0' ).split( "" );

            switch( cas_particulier ){
               case '1' : {
                  pts = [ [ row - 2, 1 ], [ row - 2, 2 ], [ row - 2, 3 ], [ 1, col - 3 ], [ 1, col - 2 ], [ 2, col - 2 ], [ 3, col - 2 ], [ 4, col - 2 ] ];
               }
               break;
               case '2' : {
                  pts = [ [ row - 4, 1 ], [ row - 3, 1 ], [ row - 2, 1 ], [ 1, col - 5 ], [ 1, col - 4 ], [ 1, col - 3 ], [ 1, col - 2 ], [ 2, col - 2 ] ];
               }
               break;
               case '3' : {
                  pts = [ [ row - 2, 1 ], [ row - 2, col - 2 ], [ 1, col - 4 ], [ 1, col - 3 ], [ 1, col - 2 ], [ 2, col - 4 ], [ 2, col - 3 ], [ 2, col - 2 ] ];
               }
               break;
               case "4" : {
                  pts = [ [ row - 4, 1 ], [ row - 3, 1 ], [ row - 2, 1 ], [ 1, col - 3 ], [ 1, col - 2 ], [ 2, col - 2 ], [ 3, col - 2 ], [ 4, col - 2 ] ];
               }
               break;
            }

            pts.forEach( ( item, index ) => {
               this.fill_indiv_data( bindary[ index ], item[ 0 ], item[ 1 ] );
            });

        }

        /**
         * Filling individual data module
         */

        fill_indiv_data( value, x, y ){
            var cur = this.points[ x ][ y ];

            if( !cur.is_filled ){
               cur.is_filled = true;
               cur.fill = value == "1";
               cur.type = "data";
            }
        }

        /**
         * This will fill individual character's encoded values based on the reference position. It will call next character fill if data is available
         */

        fill_individual( encoded_text, index, row, col, ref_y, ref_x, upwards, frm_particulier ){
            var cur = encoded_text[ index ];

            if( cur != void 0 ){ 
               var condition,
               points = this.points,
               ref_pt = ( points[ ref_x ] || {} )[ ref_y ],
               other,
               cas_particulier,
               next_x = ref_x,
               next_y = ref_y;

               if( !frm_particulier ){
                  if( ref_x == row - 1 && ref_y == 1 ){
                     cas_particulier = "1";
                  } else if( ( ref_x == row - 3 ) && ref_y == 1 && ( col - 2 ) % 4 ){
                     cas_particulier = "2";
                  } else if( ( ref_x == row - 3 ) && ref_y == 1 && ( col - 2 ) % 8 == 4 ){
                     cas_particulier = "4";
                  } else if( ( ref_x == row + 3 ) && ref_y == 3 && !( ( col - 2 ) % 8 ) ){
                     cas_particulier = "3";
                  }
               }

               if( cas_particulier ){
                  this.fill_particulier( encoded_text, index, cas_particulier, row, col );
               } else {
                  if( upwards ){
                     condition = ref_y > 0 && ref_x < row;
                  } else {
                     condition = ref_x > 0 && ref_y < col;
                  }

                  if( condition && ref_pt && !ref_pt.is_filled ){
                     var bindary = cur.toString( 2 ).padStart( 8, '0' ).split( "" ),
                     x = ref_x - 2,
                     y = ref_y - 2;

                     for( var i = 0; i < 8; i++ ){
                        var value = bindary[ i ],
                        position_indicator = i + ( i > 1 ? 1 : 0 ),
                        pos = this.get_correct_position( x + parseInt( position_indicator / 3 ), y + parseInt( position_indicator % 3 ), row, col );

                        this.fill_indiv_data( value, pos.x, pos.y );
                     }
                  } else {
                     index--;
                  }

                  var fact = upwards ? 1 : -1;
                  next_x = ref_x - 2 * fact;
                  next_y = ref_y + 2 * fact;

                  if( upwards ){
                     other = next_x <= 0 || next_y >= col - 1;
                  } else {
                     other = next_y <= 0 || next_x >= row - 1;
                  }

                  if( upwards && ( next_x < 1 || other ) ){
                     next_x += 1;
                     next_y += 3;
                     upwards = false;
                  } else if( !upwards && ( next_x > row - 1 || other ) ){
                     next_x += 3;
                     next_y += 1;
                     upwards = true;
                  }
               }

               this.fill_individual( encoded_text, index + 1, row, col, next_y, next_x, upwards, !!cas_particulier ); 
            }
        }

        /**
         * It will return the 'N' shifted value based on the irreducible polynominal
         */

        right_shift( value, to_shift ){
            for( var k = 0; k < to_shift; k++ ){
               value = value << 1;

               if( value > 255 ){
                  // irreducible polynominal is taken as 301 here
                  value = value ^ 301
               }
            }

            return value;
        }

        /**
         * Error correction calculation based on the error length
         */

        error_coeff( len ){
            var arr = [];

            for( var i = 0; i < len; i++ ){
               for( var j = 0; j <= i; j++ ){
                  var cur_index = i - j;

                  arr[ cur_index ] = ( this.right_shift( arr[ cur_index ] || 1, i + 1 ) ) ^ ( arr[ cur_index - 1 ] || 0 );
               }
            }

            arr.push( 1 );

            return arr.reverse();
        }

        /**
         * To fill the empty places in the provided text
         */

        addPaddingLetters( arr, exp_len, error_len ){
            var len = arr.length;

            if( len != exp_len ){
                arr.push( 129 );

                for( var i = len + 1; i < exp_len; i++ ){
                    arr.push( ( 130 + ( 149 * ( 1 + i ) ) % 253 ) % 254 );
                }
            }

            for( var i = 0; i < error_len; i++ ){
               arr.push( 0 );
            }
        }

        /**
         * Initializing the empty data
         */

        init( row, col ){

            var arr = [];
   
            for( var i = 0; i < row; i++ ){
               var row_arr = [];
               for( var j = 0; j < col; j++ ){
                  row_arr[ j ] = {
                     fill : false,
                     type : null,
                     is_filled : false
                  }
               }
               arr.push( row_arr );
            }
   
            this.points = arr;
         }

       /**
        * Finding the level needed based on the byte length
        */

        get_level( len, is_rect ){

           var limit = matrix_data.length;

           for( var i = is_rect ? 24 : 0; i < limit; i++ ){
                var cur = matrix_data[ i ];

                if( cur.data >= len ){
                    return cur;
                }
           }
        }

        /**
         * Here data will be encoded. I have used byte mode encoding here
         * Need to work on other encoding modes too => could not find any proper docs / examples
         */

        encode( text ){
            var byte_encoded = new TextEncoder().encode( text ),
            len = byte_encoded.length,
            encoded = [],
            dummy_code = 235,
            is_number = code => {
                return code >= 48 && code <= 57;
            };

            for( var i = 0; i < len; i++ ){
                var code = byte_encoded[ i ],
                next_code = byte_encoded[ i + 1 ];

                if( code > 127 ){
                    encoded.push( dummy_code );
                    code -= 127;
                } else if( is_number( code ) && is_number( next_code ) ){
                    code = ( code - 48 ) * 10 + next_code + 82/* 130 - 48 */;
                    i++;
                } else {
                    code++;
                }

                encoded.push( code );
            }

            return encoded;
        }

        /**
         * final canvas drawing
         */

        draw_in_canvas( canvas, options, col ){
         var pts = this.points,
         len = pts.length,
         fill_color = options.fill_color, 
         non_fill_color = options.non_fill_color, 
         quiet_zone = options.quiet_zone, 
         background = options.background, 
         before_draw = options.onBeforeDraw,
         scale = options.scale,
         width = options.width * scale,
         height = options.height * scale,
         unit_x = width / ( col + 2 * quiet_zone ),
         unit_y = height / ( len + 2 * quiet_zone ),
         ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
         rows = pts.length,
         min_unit_size = options.min_unit_size,
         unit_size = options.unit_size;

         if( isNaN( width ) ){
            width = ( ( unit_x = unit_size ) + 2 * quiet_zone ) * len;
         }

         if( isNaN( height ) ){
            height = ( ( unit_y = unit_size ) + 2 * quiet_zone ) * len;
         }

         if( unit_x < min_unit_size ){
            unit_x = min_unit_size;
            width = unit_x * ( len + 2 * quiet_zone );
         }

         if( unit_y < min_unit_size ){
            unit_y = min_unit_size;
            height = unit_y * ( len + 2 * quiet_zone );
         }

         canvas.width = width;
         canvas.height = height;

         if( background ){
            ctx.fillStyle = background;
            ctx.fillRect( 0, 0, width, height );
         }

         before_draw && before_draw( canvas, this );

         for( var row_index = 0; row_index < rows; row_index++ ){
            var row = pts[ row_index ],
            cols = row.length;

            for( var col_index = 0; col_index < cols; col_index++ ){
               var col = row[ col_index ];

                ctx.fillStyle = col.fill ? fill_color : non_fill_color;
                ctx.rect( ( quiet_zone +  col_index ) * unit_x, ( quiet_zone + row_index ) * unit_y, unit_x, unit_y );
                ctx.fill();
                ctx.beginPath();
            }
         }
      }
    };

    if( typeof $L != "undefined" ){
        $L.datamatrix = ops => {
           return new LyteBarcode_DataMatrix( ops );
        };
        $L.datamatrix.class_instance = LyteBarcode_DataMatrix;
     } else {
        window.LyteBarcode_DataMatrix = LyteBarcode_DataMatrix;
     }
})();