/**
 * Refered
 * https://help.accusoft.com/BarcodeXpress/v13.2/BxNodeJs/aztec.html
 */

/**
 * This is for creating Aztec barcode in web 
 * contact @lyte-team@zohocorp.com
 */

/**
 * TODO
 * Now worked only in byte mode alone. Need to add other encoding modes too
 * 
 * Last updated
 * Feb 1, 2024 
 * Rune is not supported as of now
 */

;( function(){

   var default_options = {
      width : 300, 
      height : 300, 
      fill_color : "black", 
      non_fill_color : "white", 
      quiet_zone : 0, 
      background : "white", 
      scale : window.devicePixelRatio,
      compact : void 0,
      min_unit_size : 0,
      unit_size : 5,
      rune : void 0, // rune currently not supported in this
      error : 10 // percent - maximum 90%
    },
    irreducible_polynominal = {
      // codeword_size : irreducible polynominal for galois field
      6 : 67, //GF( 2 ^ 6 )
      8 : 301, //GF( 2 ^ 8 )
      10 : 1033, //GF( 2 ^ 10 )
      12 : 4201 //GF( 2 ^ 12 )
    },
    limits = [
      { layer:1, rune:true, size:4, limit:28 },
      { layer:1, compact:true, size:6, limit:102 },
      { layer:1, size:6, limit:126 },
      { layer:2, compact:true, size:6, limit:240 }, 
      { layer:2, size:6, limit:288 },
      { layer:3, compact:true, size:8, limit:408 },
      { layer:3, size:8, limit:480 },
      { layer:4, compact:true, size:8, limit:608 },
      { layer:4, size:8, limit:704 },
      { layer:5, size:8, limit:960 },
      { layer:6, size:8, limit:1248 },
      { layer:7, size:8, limit:1568 },
      { layer:8, size:8, limit:1920 },
      { layer:9, size:10, limit:2300 },
      { layer:10, size:10, limit:2720 },
      { layer:11, size:10, limit:3160 },
      { layer:12, size:10, limit:3640 },
      { layer:13, size:10, limit:4160 },
      { layer:14, size:10, limit:4700 },
      { layer:15, size:10, limit:5280 },
      { layer:16, size:10, limit:5880 },
      { layer:17, size:10, limit:6520 },
      { layer:18, size:10, limit:7200 },
      { layer:19, size:10, limit:7900 },
      { layer:20, size:10, limit:8640 },
      { layer:21, size:10, limit:9400 },
      { layer:22, size:10, limit:10200 },
      { layer:23, size:12, limit:11040 },
      { layer:24, size:12, limit:11904 },
      { layer:25, size:12, limit:12792 },
      { layer:26, size:12, limit:13728 },
      { layer:27, size:12, limit:14688 },
      { layer:28, size:12, limit:15672 },
      { layer:29, size:12, limit:16704 },
      { layer:30, size:12, limit:17760 },
      { layer:31, size:12, limit:18840 },
      { layer:32, size:12, limit:19968 }
   ],
   log_arr = [], 
   anti_log_arr = [];

   // Object clone

    function qr_extend( options, ret ){
      for( var key in options ){
         ret[ key ] = options[ key ];
      }
      return ret;
   }

   // Galois field generation. Here multiple polynominal can be possible

   function log_generate( limit, poly ){
      var value = 1,
      max = limit - value;

      for( var exp = 1; exp < limit; exp++ ){
         value = value << 1;

         if( value > max ){
            value = value ^ poly;
         }

         log_arr[ value ] = exp % max;
         anti_log_arr[ exp % max ] = value;
      }
   }

   // Galois multiplication

   function log_multiply( val1, val2, galois_size ){

      if( val1 && val2 ){
         var first = log_arr[ val1 ] || 0,
         second = log_arr[ val2 ] || 0,
         sum = first + second;

         return anti_log_arr[ sum % galois_size ];
      } else {
         return 0;
      }
   }

   // Galois division

   function log_div( val1, val2, galois_size ){
      if( val1 && val2 ){
         var first = log_arr[ val1 ],
         second = log_arr[ val2 ],
         sum = first + second * ( galois_size - 1 );

         return anti_log_arr[ sum % galois_size ];
      } else {
         return 1;
      }
   }

   // Equation multiplication based on galois field

   function equation_multiplier( eqn1, eqn2, galois_size ){
      var new_eqn_len = eqn1.length + eqn2.length - 1,
      new_eq_arr = new Array( new_eqn_len );

      for( var i = 0; i < new_eqn_len; i++ ){
         var value = 0;
         for( var j = 0; j <= i; j++ ){
            var other_min_coeff = i - j;

            value = value ^ log_multiply( eqn1[ j ], eqn2[ other_min_coeff ], galois_size );
         }
         new_eq_arr[ i ] = value;
      }

      return new_eq_arr;
   }

   // Equation division based on galois field

   function equation_devision( eqn1, eqn2, galois_size ){
      var result_len = eqn1.length - eqn2.length + 1,
      ret = eqn1.slice();

      for( var i = 0; i < result_len; i++ ){
         var item = ret[ 0 ];

         if( item ){
            var sub_arr = equation_multiplier( eqn2, [ log_div( item, eqn2[ 0 ], galois_size ) ], galois_size );

            ret = ret.map( ( value, index ) => {
               return value ^ ( sub_arr[ index ] || 0 );
            });
         }

         ret.shift();
      }

      return ret;
   }

   function right_shift( value, to_shift, limit, poly ){
      for( var k = 0; k < to_shift; k++ ){
         value = value << 1;

         if( value > limit ){
            value = value ^ poly
         }
      }

      return value;
  }

  /**
   * Error correction calculation based on the error length
   */

  function error_coeff( len, limit, poly ){
      var arr = [];

      for( var i = 0; i < len; i++ ){
         for( var j = 0; j <= i; j++ ){
            var cur_index = i - j;

            arr[ cur_index ] = ( right_shift( arr[ cur_index ] || 1, i + 1, limit, poly ) ) ^ ( arr[ cur_index - 1 ] || 0 );
         }
      }

      arr.push( 1 );

      return arr.reverse();
  }

  /**
   * Aztec creation class
   */

    class LyteBarcode_Aztec{
        constructor( options ){
          options = ( this.options = qr_extend( options || {}, qr_extend( default_options, {} ) ) );

          var text = options.text,
          error = options.error,
          modes_seq = this.form_modes( text ),
          encoded,
          available_sizes = [ 6, 8, 10, 12 ], // layer sizes
          size,
          compact = options.compact,
          rune = options.rune || ( false && typeof text == "number" && text < 256 );

          if( rune ){
            size = limits[ 0 ];
            encoded = this.encode_sequence( modes_seq, 6 );
          } else {
            var size_find_fn = __error =>{
               available_sizes.every( item  => {
                  encoded = this.encode_sequence( modes_seq, item );
                  var cur_size = Math.floor( encoded.length * ( 100 + __error ) / 100 ),
                  matched_size;
   
                  if( matched_size = this.check_limits( cur_size, compact, item ) ){
                     size = matched_size;
                  }        
                  return !size;
               });

               return size;
            };

            // When there is no match finding the same without extra error correction
            size_find_fn( error ) || size_find_fn( 0 );
         }

          if( size == void 0 ){
            // Can't convert it to aztec. Size limit
            var error_cb = options.onError;
            error_cb && error_cb( this );
            return false;
          }

          var bit_size = size.size,
          limit = size.limit,
          is_compact = size.compact,
          is_rune = size.rune,
          layer = is_rune ? 0 : size.layer,
          rune_compact = is_rune || is_compact,
          has_reference = Math.max( 0, Math.ceil( layer / 4 ) - 1 ),
          square_size = layer * 2 * 2 /* One layer in two sides having two unit length */ + 2 /* Mode message size */ + ( rune_compact ? 9 : 13 ),
          total_char = limit / bit_size,
          encoded_len = encoded.length,
          error_required = total_char - encoded_len,
          canvas = options.canvas || document.createElement( "canvas" );

          this.init( square_size );

          this.fill_finder_pattern( square_size, rune_compact );

          if( !rune_compact ){
            this.fill_reference_grid( true );
          }

          if( !is_rune ){
            this.find_error_correction( encoded, error_required, bit_size );
            this.fill_data( encoded, size, rune_compact, has_reference );
          }

          this.fill_mode_message( size, is_compact, is_rune, encoded_len, encoded );

          if( !rune_compact ){
            this.fill_reference_grid();
            this.fill_reference_grid( true, true );
          }

          this.draw_in_canvas( canvas, options );
          this.canvas = canvas;
        }

        /**
         * Filling reference grid. Initially mid reference alone will be created for encoding. 
         * After filling all the data other reference grids will be created.
         */

        fill_reference_grid( ignore_other, force_fill ){
            var pts = this.points,
            len = pts.length,
            count = ignore_other ? 0 : 1,
            mid = parseInt( len / 2 ),
            fn = ( x, y, x_fact, y_fact, len ) => {
               for( var i = 0; i <= len; i++ ){
                  var cur = pts[ x + i * x_fact ][ y + i* y_fact ],
                  next = pts[ y + i* y_fact ][ x + i * x_fact ];

                  if( !cur.is_filled || force_fill ){
                     cur.is_filled = true;
                     cur.type = "reference_grid";
                     cur.fill = i % 2 == 0;
                  }

                  if( !next.is_filled || force_fill ){
                     next.is_filled = true;
                     next.type = "reference_grid";
                     next.fill = i % 2 == 0;
                  }
               }
            };

            while( true ){
               var new_left = mid - 16 * count,
               new_right = mid + 16 * count++;

               if( new_left < 0 ){
                  break;
               }

               if( !ignore_other ){ 
                  new_left++;
                  new_right++;
                  this.insert_row_at( new_left, new_right );
                  this.insert_col_at( new_left , new_right );
                  mid++;
               }

               fn( new_left, mid, 0, -1, mid );
               fn( new_left, mid, 0, 1, mid );

               if( new_left != new_right ){
                  fn( new_right, mid, 0, -1, mid );
                  fn( new_right, mid, 0, 1, mid );
               } else if( ignore_other ){
                  break;
               }
            }
        }

        // Inserting a new column at the mentioned index

        insert_col_at( index1, index2 ){
          var pts = this.points,
          len = pts.length;
         
          for( var i = 0; i < len; i++ ){
             var row = pts[ i ],
             obj = {
                is_filled : false,
                fill : false,
                type : ""
             };

             row.splice( index1, 0, obj );
             row.splice( index2, 0, qr_extend( obj, {} ) );
          }
        }

        // Inserting a new row at the mentioned index

        insert_row_at( index1, index2 ){
            var pts = this.points,
            len = pts.length,
            arr = [];

            for( var i = 0; i < len; i++ ){
               arr.push({
                  is_filled : false,
                  fill : false,
                  type : ""
               });
            }

            pts.splice( index1, 0, arr );
            pts.splice( index2, 0, JSON.parse( JSON.stringify( arr ) ) );
        }

        // Final drawing of encoded data

        draw_in_canvas( canvas, options ){
            var pts = this.points,
            scale = options.scale,
            width = options.width * scale,
            height = options.height * scale,
            len = pts.length,
            fill_color = options.fill_color, 
            non_fill_color = options.non_fill_color, 
            quiet_zone = options.quiet_zone, 
            background = options.background, 
            before_draw = options.onBeforeDraw,
            unit_x = width / ( len + 2 * quiet_zone ),
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
               var row = pts[ row_index ];

               for( var col_index = 0; col_index < rows; col_index++ ){
                  var col = row[ col_index ];
                  ctx.fillStyle = col.fill ? fill_color : non_fill_color;
                  ctx.rect( ( quiet_zone +  col_index ) * unit_x, ( quiet_zone + row_index ) * unit_y, unit_x, unit_y );
                  ctx.fill();
                  ctx.beginPath();
               }
            }
         }

        // Filling all the data first reference point creation

        fill_data( arr, size, is_compact ){
           var pts = this.points,
           square_size = pts.length,
           unit_size = size.size,
           mid = parseInt( square_size / 2 ),
           ref_y = mid - 5 - ( is_compact ? 0 : 2 ),
           ref_x = ref_y - 2;
           
           this.fill_individual_data( arr, size.layer, unit_size, square_size, ref_x, ref_y )
        }

        //Filling all the data in spiral pattern around center finder pattern

        fill_individual_data( arr, layer, unit_size, square_size, ref_x, ref_y ){
            var __layer = 1,
            data = [],
            fact = [ [ 0, 1, 1, 0 ], [ 1, 0, 0, -1 ], [ 0, -1, -1, 0 ], [ -1, 0, 0, 1 ] ],
            layer_len = square_size - ( layer - __layer ) * 2 - ( layer + 1 - __layer ) * 2,
            mode = 0,
            count = 0,
            cur_ref_x = ref_x,
            cur_ref_y = ref_y,
            pts = this.points;

            arr.forEach( item => {
               data.unshift.apply( data, item.toString( 2 ).padStart( unit_size, 0 ).match( /.{2}/g ).reverse() );
            });

           while( data.length ){
               var cur = data.shift();

               if( count == layer_len ){
                  var prev_mode = fact[ mode ];
                  mode = ( mode + 1 ) % 4;

                  if( mode ){
                     cur_ref_x = prev_mode[ 0 ] ? ( cur_ref_x + ( layer_len - 1 ) * prev_mode[ 0 ] ) : ( cur_ref_x + 2 * prev_mode[ 2 ] );
                     cur_ref_y = prev_mode[ 1 ] ? ( cur_ref_y + ( layer_len - 1 ) * prev_mode[ 1 ] ) : ( cur_ref_y + 2 * prev_mode[ 3 ] );
                  } else {
                     ref_y = cur_ref_y = ref_y - 2;
                     ref_x = cur_ref_x = ref_x - 2;
                     layer_len += 4;
                  }

                  count = 0;
               }

               var cur_mode = fact[ mode ],
               x_fact = cur_mode[ 0 ],
               y_fact = cur_mode[ 1 ],
               minor_fact_x = cur_mode[ 2 ],
               minor_fact_y = cur_mode[ 3 ],
               pos_x = cur_ref_x +  x_fact * count,
               pos_y = cur_ref_y + y_fact * count,
               cur_pt = pts[ pos_x ][ pos_y ],
               next_pt = pts[ pos_x + minor_fact_x * 1 ][ pos_y + minor_fact_y * 1 ];

               if( cur_pt.is_filled ){
                  data.unshift( cur );
               } else {
                  cur_pt.is_filled = next_pt.is_filled = true;
                  cur_pt.type = next_pt.type = "data";
                  cur_pt.fill = cur[ 0 ] == "1";
                  next_pt.fill = cur[ 1 ] == "1";
               }

               count++;
           }
        }

        // Error Correction based on the layer size

        find_error_correction( encoded, len, size ){
           var polynominal = irreducible_polynominal[ size ],
           galois_size = Math.pow( 2, size ),
           error_correction_coeff = error_coeff( len, galois_size - 1, polynominal );

           log_generate( galois_size, polynominal );
           
           encoded.push.apply( encoded, equation_devision( encoded.concat( new Array( len ).fill( 0 ) ), error_correction_coeff, galois_size - 1 ) );
        }

        // Mode message filling around the finder pattern. Rune yet to handle

        fill_mode_message( size, is_compact, is_rune, encoded_len, encoded ){
            var galois_size = 16 - 1,
            layers = size.layer,
            rune_compact = ( is_rune || is_compact ),
            aztec_size = rune_compact ? 5 : 7,
            modules_value = is_rune ? 1 : ( ( layers - 1) * ( aztec_size * 992 - 4896 ) + encoded_len- 1 ),
            error_len = rune_compact ? 5 : 6,
            error_correction_coeff = error_coeff( error_len, galois_size, 19 ),
            arr = is_rune ? encoded : [],
            bits_per_side = rune_compact ? 7 : 10,
            pts = this.points,
            fn = ( value, x, y, x_fact, y_fact ) => {
               var count = 0;

               for( var i = 0; i < bits_per_side; i++ ){
                  var cur = pts[ x + ( i + count ) * x_fact ][ y + ( i + count ) * y_fact ];
                  if( cur.is_filled ){
                     count++;
                     i--;
                     continue;
                  }
                  cur.is_filled = true;
                  cur.type = "mode_message";
                  cur.fill = value[ i ] == '1';
               }
            },
            final_str,
            mid = ( pts.length - 1 ) / 2,
            hori_off = rune_compact ? 3 : 5,
            vert_off = rune_compact ? 5 : 7,
            fact = [ [ mid - vert_off, mid - hori_off, 0, 1 ], [ mid - hori_off, mid + vert_off, 1, 0 ], [ mid + vert_off, mid + hori_off, 0, -1 ], [ mid + hori_off, mid - vert_off, -1, 0 ] ],
            loop_limit = aztec_size - 2;

            for( var i = 1; i < loop_limit; i++ ){
               if( is_rune ){
                  arr[ loop_limit - 1 - i ] = modules_value & 15;
               } else {
                  arr.unshift( modules_value & 15 );
               }
               modules_value >>= 4; 
            }

            log_generate( galois_size + 1, 19 );
            arr.push.apply( arr, equation_devision( arr.concat( new Array( error_len ).fill( 0 ) ), error_correction_coeff, galois_size ) );

            if( is_rune ){
               var new_arr = [];
               for( var i = 0; i < bits_per_side; i++ ){
                  new_arr.push( { value : 10 ^ arr[ i ], len : 4 } );
               }

               arr.push.apply( arr, this.combine_bits( new_arr, 7 ) );
               arr.splice( 0, 7 );
            }

            final_str = arr.map( item => item.toString( 2 ).padStart( is_rune ? 7 : 4, 0 ) ).join( "" );

            fact.forEach( ( item, index ) => {
               item.unshift( final_str.slice( index * bits_per_side, ++index * bits_per_side ) );
               fn.apply( this, item );
            });
        }

        // Filling main finder pattern at the center

        fill_finder_pattern( size, compact ){
            var mid = parseInt( size / 2 ),
            points = this.points,
            orientation = [ [ 1, 1, 1 ], [ 0, 1, 1 ], [ 0, 0, 0 ], [ 1, 0, 0 ] ],
            fn = ( x, y, x_fact, y_fact, __len, unit ) => {
               for( var j = 0; j < __len; j++ ){
                  var cur = points[ x + j * x_fact ][ y + j * y_fact ];
                  cur.is_filled = true;
                  cur.type = "finder_pattern";
                  cur.fill = unit % 2 == 0;
               }
            },
            len = compact ? 9 : 13,
            limit = 4 + ( compact ? 0 : 2 ),
            fn2 = ( ref_x, ref_y, index ) => {
               var pt = orientation[ index ],
               count = 0;

               for( var j = 0; j < 4; j++ ){
                  var row = parseInt( j / 2 ),
                  col = j % 2,
                  cur = points[ ref_x + row ][ ref_y + col ];

                  if( cur.is_filled ){
                     count++;
                  } else {
                     cur.is_filled = true;
                     cur.type = "orientation_pattern";
                     cur.fill = pt[ j - count ] == 1;
                  }
               }
            },
            overall_ref_x = mid - limit,
            overall_ref_other = mid + limit;
            

            for( var i = 0; i <= limit; i++ ){
               var ref = overall_ref_x + i,
               other_ref = overall_ref_other - i;

               fn( ref, ref, 1, 0, len, i );
               fn( ref, ref, 0, 1, len, i );
               fn( other_ref, ref, 0, 1, len, i );
               fn( ref, other_ref, 1, 0, len, i );
               len -= 2;
            }

            fn2( overall_ref_x - 1, overall_ref_x -1, 0 );
            fn2( overall_ref_x - 1, overall_ref_other, 1 );
            fn2( overall_ref_other, overall_ref_other, 3 );
            fn2( overall_ref_other, overall_ref_x - 1, 2 );
        }

        // Points intialization

        init( size ){
            var arr = [];

            for( var i = 0; i < size; i++ ){
               var row = [];
               for( var j = 0; j < size; j++ ){
                  var col = {
                     fill : !1,
                     is_filled : !1,
                     type : void 0
                  };
                  row.push( col );
               }
               arr.push( row );
            }

            this.points = arr;
        }

        // Finding the current layer size based on the encoded data

        check_limits( size, compact, bit_length ){
            var ret;

            limits.every(  item => {
               if( ( item.limit / item.size ) >= size && item.size == bit_length ){
                  if( compact != void 0 && ( !!item.compact ) != compact ){
                     return true;
                  }
                  ret = item;
               }
               return !ret;
            });
            return ret;
        }

        // Splitting the text based on the encoding modes. Not handled Numeric & alpha numeric

        form_modes( text ){
            // check other formattings
            return [
               {
                  mode : "byte",
                  text : text
               }
            ];
        }

        // Actual encoding based on the modes

        encode_sequence( seq, bit_size ){
            var final = [],
            len = seq.length,
            byte_encoder;

            for( var i = 0; i < len; i++ ){
               var cur = seq[ i ];

               switch( cur.mode ){
                  case "byte" : {
                     byte_encoder = byte_encoder || new TextEncoder();
                     var cur_encode = Array.from( byte_encoder.encode( cur.text ) ).map( item => { 
                        return { 
                           value : item, 
                           len : 8 
                        }; 
                     }),
                     __len =  cur_encode.length;

                     if( __len > 31 ){
                        cur_encode.unshift( { value : 31, len : 5 }, { value : 0, len : 5 }, { value : __len - 31, len : 11 } )
                     } else {
                        cur_encode.unshift( { value : 31, len : 5 }, { value : __len, len : 5 } );
                     }
                  }
                  break;
               }

               final.push.apply( final, cur_encode );
            }

            return this.combine_bits( final, bit_size );
        }

        // Modifying values based on the unit size

        combine_bits( arr, size ){

         var len = arr.length,
         final = [],
         bit_length = 0,
         max_irreducible = 1 << size;

         for( var i = 0; i <= len; i++ ){
            var cur = arr[ i ];

            if( cur == void 0 ){
               if( bit_length ){
                  var remain = size - bit_length;
                  cur = {
                     value : ( 1 << remain ) - 1,
                     len : remain
                  };
               } else {
                  break;
               }
            }

            var __value = cur.value,
            modified_value = __value << size,
            final_len = final.length - 1,
            last_value = final[ final_len ];

            bit_length += cur.len;
            
            var cur_shift = modified_value >> bit_length;

            if( final_len == -1 ){
               final.push( last_value | cur_shift );
               final_len++
            } else {
               final[ final_len ] = last_value | cur_shift;
            }


            while( bit_length >= size ){
               var right_shift = final[ final_len ] >> 1;

               if( !right_shift || 2 * ( right_shift + 1 ) == max_irreducible ){
                  final[ final_len ] = 2 * right_shift + ( 1 & right_shift ^ 1 );
                  bit_length += 1;
               }

               bit_length -= size;

               final.push( ( modified_value >> bit_length ) & ( max_irreducible - 1 ) );
               final_len++;
            }

         }
         final.pop();
         return final;
        }
    }


    if( typeof $L != "undefined" ){
        $L.aztec = ops => {
           return new LyteBarcode_Aztec( ops );
        };
        $L.aztec.class_instance = LyteBarcode_Aztec;
     } else {
        window.LyteBarcode_Aztec = LyteBarcode_Aztec;
     }

})();
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

/*
 * This plugin is used for creating Pdf 417 barcodes in web.
 * contact @lyte-team@zohocorp.com
 */


/**
 * To do
 * Micro Pdf 417
 * Feb 1, 2024
 */

;( function(){

   var default_options = {
      width : void 0, 
      height : void 0, 
      fill_color : "black", 
      non_fill_color : "white", 
      quiet_zone : 1, 
      background : "white", 
      scale : window.devicePixelRatio,
      aspect_ratio : 2,
      row_height : 4
    },
    text_sub_mode = {
         /**
          * Sub modes of Text compact mode.
          * Each sub modes uses different combination of texts
          */
         a : fill_letters( 65, 90 ).concat( [ 32 ] ), // Alpha
         l : fill_letters( 97, 122 ).concat( [ 32 ] ), // Lower
         m : fill_letters( 48, 57 ).concat( [ 38, 13, 9, 44, 58, 35, 45, 46, 36, 47, 43, 37, 42, 61, 94, void 0, 32 ] ), // Mixed
         p : [ 59, 60, 62, 64, 91, 92, 93, 95, 96, 126, 33, 13, 9, 44, 58, 10, 45, 46, 36, 47, 34, 124, 42, 40, 41, 63, 123, 125, 39 ] //Punctuation
    },
    text_mode_shift = {
         /**
          * Character indicating to shifting between different text sub modes
          */
         a_l : [ 27 ],
         a_m : [ 28 ],
         a_p : [ 28, 25 ],
         l_a : [ 28, 28 ],
         l_m : [ 28 ],
         l_p : [ 28, 25 ],
         m_a : [ 28 ],
         m_l : [ 27 ],
         m_p : [ 25 ],
         p_a : [ 29 ],
         p_l : [ 29, 27 ],
         p_m : [ 29, 28 ]
    },
    cluster = [
      /**
       * Different Cluster values for encoding Each values( upto 900 characters )
       * Each Cluster values are unique.
       * Could not create these by formulae. So hardcoded these values
       * Here values are in base 36. Convert it to respective base before using these
       */
      ["2ksg","2oz4","2r24","2km8","2ovs","2r0e","2bwg","2kj4","2bts","1uf4","2bsg","1ue8","2cw0","2l0w","2p30","2cps","2kxk","2p1a","1w3k","2cmo","1w0w","1x34","2d4g","2l4s","1www","2d14","2l32","1wts","2czg","1xbk","2d8c","1x88","2d6m","1xfg","2r5m","2k80","2ooo","2qwu","2b40","2k4w","2on0","2b1c","2k3c","1su8","2b00","2k2k","1stc","2azc","1ssw","2bj4","2kc8","2oqm","1tq8","2bg0","2kak","1tnk","2beg","2k9q","1tm8","2bdo","1u5c","2bnc","2ke6","1u28","2blo","1u0o","2bku","1u9k","2bpa","1u7w","1u72","2aps","2jxs","2ojg","2an4","2jw8","2oim","1s1s","2als","2jvg","1s0w","2al4","1s0g","1s08","1sjk","2auo","2jzw","1sgw","2at4","2jz2","1sfk","2asc","1sew","1sek","1sog","2aws","1smw","2avy","1sm4","1sqk","2ag0","2jso","2ogu","1rnk","2aeo","2jrw","1rmo","2ae0","2jri","1rm8","2ado","1rm0","2adi","1rvk","2aig","2jtq","1ru8","2aho","1rtk","2aha","1rt8","1rt2","2aji","1rwu","1rgg","2ab4","2jq4","1rfk","2aag","2jpq","1rf4","2aa4","1rew","2a9y","1res","1rjk","1riw","1rik","1rc0","2jou","2a8c","2a86","1rb6","2in4","2nw8","2qim","27y8","2ik0","2nuk","27vk","2iig","2ntq","1mio","27u8","1mhs","28dc","2irc","2ny6","1neo","28a8","2ipo","1nc0","288o","1nao","1na0","1nts","28hk","2ita","1nqo","28fw","1np4","1noc","1ny0","28ji","1nwc","1nzy","2ls0","2pgw","2rb0","2lpc","2pfc","2ra6","2e68","2lo0","2pek","2e5c","2lnc","2pe6","2e4w","2ln0","27k0","2icw","2nr0","2eo0","27hc","2ibc","2nq6","2elc","2lvc","2pi6","1zy8","1lpc","27fc","2ia6","1zxc","2ejc","1zww","1m80","27ow","2if0","20g0","1m5c","27nc","2ie6","20dc","2erc","2ly6","20c0","1m3c","20bc","1mcw","27r0","20kw","1mbc","27q6","20jc","2eu6","20ik","1mf0","20n0","1me6","20m6","2li8","2pbs","2r8e","2ds0","2lgw","2pb0","2dr4","2lg8","2pam","2dqo","2lfw","2dqg","2dqc","27a8","2i7s","2noe","2e00","278w","2i70","1yrk","1lb4","2ljw","2i6m","1yqo","1lao","277w","1yq8","2dxo","277q","1lac","1lk0","27co","2i8u","1yzk","1lio","27bw","1yy8","2e1o","27bi","1yxk","1lho","1lhi","1lmg","27dq","1z20","1llo","1z18","1lla","1z0u","1z32","2dkw","2ldc","2p98","2dk0","2lco","2p8u","2djk","2lcc","2djc","2lc6","2dj8","2dj6","1l4w","275c","2i58","1y68","1l40","274o","2i4u","1y5c","2dnc","2le6","1y4w","1l3c","2746","1y4o","2dmu","1y4k","1l80","276k","1y9c","1l7c","2766","1y8o","2dou","1y8c","1l6u","1y86","1yak","1ya6","2dgg","2law","2p7y","2dg0","2lak","2dfs","2lae","2dfo","2dfm","1l0g","272w","2i3y","1xuo","1l00","272k","1xu8","2dho","272e","1xu0","1kzo","1xtw","1kzm","1l20","1xw8","1xvw","1xvq","2l9o","2l9i","2ddu","271o","1ky0","1xoo","1xok","1xoi","25z4","2hkg","2ncs","25wg","2hiw","1ikg","25v4","2hi4","1ijk","25ug","1ij4","1iiw","1j28","2640","2hmk","1izk","262g","2hlq","1iy8","261o","1ixk","1ix8","1j74","2664","1j5k","265a","1j4s","1j98","1j8e","2j4w","2o54","2qn2","291c","2j3k","2o4c","290g","2j2w","2o3y","2900","2j2k","28zs","2j2e","25pc","2hfc","2na6","299c","25o0","2hek","1pa8","1i5c","2j6k","2he6","1p9c","297c","25n0","1p8w","1i4o","1p8o","1ie8","25rs","2hge","1pi8","1icw","2j8e","1pgw","29b0","25qm","1pg8","1ibw","1pfw","1igo","25su","1pko","1ifw","1pjw","1ifi","1ihq","1plq","2m9s","2pps","2rfg","2m8w","2pp4","2rf2","2m8g","2pos","2m88","2pom","2m84","28u8","2j00","2o2k","2fk0","28tc","2pr0","2o26","2fj4","2mc8","2pqm","2fio","28so","2iyu","2fig","2mbq","28si","1hz4","25kg","2hcs","1oow","1hy8","25js","2hce","224g","1oo0","28wo","2j0u","223k","2fmg","2mdq","25ja","2234","1onc","28w6","222w","1hxe","1i28","25lo","1os0","1i1k","25la","227k","1orc","28y6","226w","2fny","1i12","1oqu","1i3g","1ot8","1i32","228s","1osu","2m5c","2pnc","2re6","2m4w","2pn0","2m4o","2pmu","2m4k","2m4i","28ps","2ixk","2o1a","2f8g","28pc","2pny","2f80","2m6k","2ix2","2f7s","28p0","2f7o","28oy","2f7m","1huo","25i0","2hbi","1odc","1hu8","25ho","21eo","1ocw","28r0","25hi","21e8","2f9o","1htw","21e0","1ock","1htu","1oci","1hw8","25im","1oew","1hvw","21g8","1oek","1hvq","21fw","1oee","1hwu","21gu","2m34","2pm4","2m2w","2ply","2m2s","2m2q","28nk","2iwc","2f2o","28nc","2iw6","2f2g","2m3q","2f2c","28n6","2f2a","1hsg","25gs","1o7k","1hs8","25gm","211s","1o7c","28o6","211k","2f3a","1hs2","211g","1o76","211e","1o8c","212k","212e","2pli","2m1u","2ivq","28mc","28ma","1hrc","1o4o","20vc","1hr6","1o4i","24ww","1glc","24vk","1gkg","24uw","2gzy","1gk0","24uk","1gjs","24ue","1gtc","24zc","2h26","1gs0","24yk","1grc","24y6","1gr0","1gqu","1gvs","250e","1gv0","1gum","1gwu","26gw","2htc","2nh8","26g0","2hso","26fk","2hsc","26fc","2hs6","26f8","1ge8","24s0","2gyk","1jy8","1gdc","2huk","2gy6","1jxc","26jc","2hu6","1jww","1gco","24qu","1jwo","26iu","1gci","1ghc","24t8","1k1c","1ggo","24su","1k0o","26ku","1k0c","1gg6","1gik","1k2k","1gi6","1k26","2jds","2o9k","2qpa","2jdc","2o98","2jd4","2o92","2jd0","2jcy","26cg","2hqw","29pc","26c0","2hqk","29ow","2jf0","2hqe","29oo","26bo","29ok","26bm","29oi","1g9s","24pk","1jmo","1g9c","2hri","1qcg","1jm8","26do","24p2","1qc0","29qk","1g90","1qbs","1jlw","1g8y","1jlu","1gbc","24q6","1jo8","1gb0","1qe0","1jnw","1gau","1qdo","1jnq","1gby","1jou","1qem","2pu8","2rho","2pu0","2rhi","2ptw","2ptu","2jbk","2o8c","2mkw","2pv0","2o86","2mko","2puu","2mkk","2jb6","2mki","26a8","2hpo","29jk","26a0","2hpi","2g28","29jc","2jc6","2g20","2mli","269u","2g1w","29j6","2g1u","1g7k","24oc","1jgw","1g7c","24o6","1pzk","1jgo","26au","230w","1pzc","29k6","1g76","230o","2g2u","1jgi","230k","1g8c","1jho","1g86","1q0c","1jhi","231o","1q06","231i","2pt4","2rh2","2pt0","2psy","2jag","2o7q","2mi0","2pti","2mhw","2jaa","2mhu","2694","2hp2","29go","2690","2fvs","29gk","268y","2fvo","29gi","2fvm","1g6g","24nq","1je0","269i","1pt4","1jdw","1g6a","22nc","1pt0","1jdu","22n8","1psy","22n6","1jee","22nq","2psi","2mgk","2mgi","29f8","2fsk","2fsi","1jck","1ppw","22gk","22gi","1fls","1fkw","24d4","1fkg","1fk8","1fk4","1fow","1fo8","1fnw","1fnq","1fq4","1fpq","255s","255c","2h58","2554","2h52","2550","254y","1fhc","24bc","1h9c","257c","24b0","1h8w","2570","1h8o","256u","1h8k","1fgi","1h8i","1fiw","24by","1haw","257y","1hak","1fie","1hae","1fji","1hbi","2hxs","2hxk","2hxg","2hxe","253k","26s0","2hyk","2h46","26rs","2hye","26ro","2536","26rm","1ff4","1h3k","1few","249y","1kgg","1h3c","1fes","1kg8","1h38","1feq","1kg4","1h36","1ffw","1h4c","1ffq","1kh8","1h46","1kh2","2obs","2obo","2obm","2hwo","2jjc","2oc6","2jj8","2hwi","2jj6","252g","2h3q","26p4","2hx2","29yg","26p0","252a","29yc","26oy","29ya","1fe0","249i","1h0o","252u","1ka0","1h0k","1fdu","1qso","1k9w","1h0i","1qsk","1k9u","1fee","1h12","1kae","1qt2","2ris","2riq","2ob8","2px0","2ob6","2pwy","2hw4","2jhw","2hw2","2mpg","2jhu","2mpe","251w","26no","251u","29v8","26nm","2gac"],
      ["2r1c","2s3c","2ou8","2r00","2s2k","2otc","2qzc","2s26","2osw","2qz0","2oso","2qyu","2osk","2p28","2r3s","2s4e","2kw0","2p0w","2r30","2kv4","2p08","2r2m","2kuo","2ozw","2kug","2ozq","2kuc","2l40","2p4o","2r4u","2czk","2l2o","2p3w","2cyo","2l20","2p3i","2cy8","2l1o","2cy0","2l1i","2cxw","2d7k","2l6g","2p5q","1x6o","2d68","2l5o","1x5s","2d5k","2l5a","1x5c","2d58","1x54","2d52","1xeo","2da0","2l7i","1xdc","2d98","1xco","2d8u","1xcc","1xh4","2db2","1xgc","1xfy","2on4","2qwg","2s0s","2om8","2qvs","2s0e","2ols","2qvg","2olk","2qva","2olg","2ole","2kao","2oq8","2qxo","2k9s","2opk","2qxa","2k9c","2op8","2k94","2op2","2k90","2k8y","2bls","2kds","2org","2bkw","2kd4","2or2","2bkg","2kcs","2bk8","2kcm","2bk4","2bk2","1u80","2bow","2kf0","1u74","2bo8","2kem","1u6o","2bnw","1u6g","2bnq","1u6c","1ub4","2bq4","1uag","2bpq","1ua4","1u9y","1ucc","1uby","2oio","2qu0","2rzi","2oi8","2qto","2oi0","2qti","2ohw","2ohu","2jz4","2ok8","2qum","2jyo","2ojw","2jyg","2ojq","2jyc","2jya","2aw0","2k0o","2oku","2avk","2k0c","2avc","2k06","2av8","2av6","1sps","2axk","2k1a","1spc","2ax8","1sp4","2ax2","1sp0","1soy","1src","2ay6","1sr0","1squ","1sry","2ogg","2qss","2og8","2qsm","2og4","2og2","2jtc","2oh8","2jt4","2oh2","2jt0","2jsy","2aj4","2ju4","2aiw","2jty","2ais","2aiq","1ryo","2ajw","1ryg","2ajq","1ryc","1rya","1rzg","1rza","2ofc","2qs6","2of8","2of6","2jqg","2ofq","2jqc","2jqa","2aco","2jqu","2ack","2aci","1rl4","2ad2","1rl0","1rky","2oes","2oeq","2jp0","2joy","2a9g","2a9e","2nuo","2qi8","2rto","2nts","2qhk","2rta","2ntc","2qh8","2nt4","2qh2","2nt0","2nsy","2ips","2nxs","2qjg","2iow","2nx4","2qj2","2iog","2nws","2io8","2nwm","2io4","2io2","28g0","2isw","2nz0","28f4","2is8","2nym","28eo","2irw","28eg","2irq","28ec","28ea","1nwg","28j4","2iu4","1nvk","28ig","2itq","1nv4","28i4","1nuw","28hy","1nus","1nzk","28kc","1nyw","28jy","1nyk","1nye","1o0s","1o0e","2ra8","2s7s","1zw0","2r9s","2s7g","1zi0","2r9k","2s7a","1zb0","2r9g","2r9e","2nq8","2qfs","2rse","2pi8","2nps","2s8e","2phs","2rbg","2qfa","2phk","2npg","2phg","2npe","2phe","2ie8","2nrs","2qge","2ly8","2ids","2nrg","2lxs","2pjg","2nra","2lxk","2idg","2lxg","2ide","2lxe","27q8","2ifs","2nse","2eu8","27ps","2ifg","2ets","2lzg","2ifa","2etk","27pg","2etg","27pe","2ete","1me8","27rs","2ige","20m8","1mds","27rg","20ls","2evg","27ra","20lk","1mdg","20lg","1mde","1mfs","27se","20ns","1mfg","20ng","1mfa","20na","1mge","2r80","2s6k","1ypk","2r7s","2s6e","1yik","2r7o","1yf2","2r7m","2no0","2qek","2pcg","2nns","2qee","2pc8","2r8m","2pc4","2nnm","2pc2","2i8g","2nos","2llc","2i88","2nom","2ll4","2pd2","2ll0","2i82","2lky","27dc","2i98","2e34","27d4","2i92","2e2w","2lly","2e2s","27cy","2e2q","1ln4","27e4","1z2o","1lmw","27dy","1z2g","2e3q","1z2c","1lmq","1z2a","1lnw","1z3g","1lnq","1z3a","2r6w","2s5y","1y4c","2r6s","1y0u","2r6q","2nmw","2qdy","2p9k","2r7a","2p9g","2nmq","2p9e","2i5k","2nna","2lew","2i5g","2les","2i5e","2leq","276w","2i5y","2dpk","2lfa","2dpg","276q","2dpe","1l9k","277a","1yaw","1l9g","1yas","1l9e","1yaq","1l9y","1yba","2r6c","1xtq","2r6a","2nmc","2p84","2nma","2p82","2i44","2lbo","2i42","2lbm","273o","2dis","273m","2diq","1l2s","1xx0","1l2q","1xwy","2r62","2nm2","2p7e","2i3e","2la2","2722","2dfe","2nc0","2q8o","2rou","2nbk","2q8c","2nbc","2q86","2nb8","2nb6","2hls","2ndk","2q9a","2hlc","2nd8","2hl4","2nd2","2hl0","2hky","265c","2hnc","2ne6","264w","2hn0","264o","2hmu","264k","264i","1j8g","266w","2hny","1j80","266k","1j7s","266e","1j7o","1j7m","1ja0","267i","1j9o","1j9i","1jam","2qmo","2rvw","1p88","2qmg","2rvq","1p18","2qmc","1oxq","2qma","2n9s","2q7g","2o5s","2n9k","2q7a","2o5k","2qna","2o5g","2n9e","2o5e","2hg0","2nak","2j80","2hfs","2nae","2j7s","2o6e","2j7o","2hfm","2j7m","25sg","2hgs","29cg","25s8","2hgm","29c8","2j8m","29c4","25s2","29c2","1ihc","25t8","1plc","1ih4","25t2","1pl4","29d2","1pl0","1igy","1pky","1ii4","1pm4","1ihy","1ply","2sa0","21v4","2fi4","2s9w","21o8","2fem","2s9u","21ks","21j2","2qlk","2rva","1on0","2rfs","2sae","222k","1oji","2rfo","2qle","21z2","2rfm","2n8o","2q6u","2o2w","2n8k","2prc","2rg6","2n8i","2pr8","2o2q","2pr6","2hd4","2n92","2j1k","2hd0","2meg","2j1g","2hcy","2mec","2j1e","2mea","25m0","2hdi","28yw","25lw","2foo","28ys","25lu","2fok","28yq","2foi","1i3s","25me","1otk","1i3o","2294","1otg","1i3m","2290","1ote","228y","1i46","1oty","2s9g","21a0","2f7i","2s9e","216k","214u","2ql0","1oce","2rec","2qky","21dq","2rea","2n84","2o1g","2n82","2po4","2o1e","2po2","2hbo","2iyc","2hbm","2m7o","2iya","2m7m","25is","28s4","25iq","2fas","28s2","2faq","1hx0","1ofo","1hwy","21h0","1ofm","21gy","2s96","20zg","20xq","2qkq","2rdm","2n7u","2o0q","2pmi","2hay","2iwq","2m4a","25h6","28oq","2f3u","1htm","1o8q","212y","20u6","2n2o","2q3w","2n2g","2q3q","2n2c","2n2a","2h1s","2n3g","2h1k","2n3a","2h1g","2h1e","2500","2h2k","24zs","2h2e","24zo","24zm","1gwg","250s","1gw8","250m","1gw4","1gw2","1gx8","1gx2","2qaw","2rpy","1jwc","2qas","1jsu","2qaq","2n1k","2q3a","2nhk","2n1g","2nhg","2n1e","2nhe","2gyw","2n1y","2huw","2gys","2hus","2gyq","2huq","24tk","2gza","26lk","24tg","26lg","24te","26le","1giw","24ty","1k2w","1gis","1k2s","1giq","1k2q","1gja","1k3a","2rx0","1q7s","29oe","2rwy","1q4c","1q2m","2qac","1jlq","2qpg","2qaa","1qbi","2qpe","2n10","2ng4","2n0y","2oac","2ng2","2oaa","2gxg","2hro","2gxe","2jg4","2hrm","2jg2","24qc","26es","24qa","29ro","26eq","29rm","1gc4","1jp0","1gc2","1qes","1joy","1qeq","22uo","2fzw","22rc","2fy6","22po","22ou","2rwq","1px8","2sbe","22yk","1pvi","22wu","2qa2","2qoq","2ri2","2n0q","2nfe","2o8q","2pve","2gwq","2hq2","2jcq","2mm2","24oq","26be","29kq","2g3e","1g8q","1ji2","1q0q","22k8","2fum","22ik","22hq","1pry","22m6","22f0","22e6","22ce","2my0","2mxw","2mxu","2grs","2mye","2gro","2grm","24fc","2gs6","24f8","24f6","1fqg","24fq","1fqc","1fqa","1fqu","2q50","1h8e","2q4y","2mxg","2n5g","2mxe","2n5e","2gqc","2h6c","2gqa","2h6a","24c4","2584","24c2","2582","1fjo","1hbo","1fjm","1hbm","2rqi","1ke4","1kce","2q4q","2qca","2mx6","2n4q","2nju","2gpm","2h4q","2hyy","24ai","254q","26t6","1fga","1h4q","1khm","1qpk","29xa","1qnw","1qn2","1k8u","1qri","23cg","2g8s","23aw","2g7y","23a4","239q","1qkc","23ek","1qji","23dq","237c","2g66","236k","2366","1qhq","238e","234s","234e","233i","2gms","2gmq","2450","244y","1f5g","1f5e","2mze","2gm2","2gu2","243e","24je","1f22","1fy2","1hha","1kn0","1km6","1qyg","2a1q","1qxo","1qxa","1kke","1qzi","23lc","2gd8","23ko","2gcu","23kc","23k6","1qvw","23mk","1qvi","23m6","23iw","2gby","23ik","23ie","1qum","23ji","23ho","23hi","1hlq","1krg","1kr2","1r2w","2a3y","1r2k","1r2e","1kq6","1r3i","1r1o","1r1i"],
      ["2cio","2ku0","1v40","2c4w","2kn0","1uqo","2by0","2kji","1uk0","2buk","1ugo","2s40","1wps","2cxk","2s3s","1wc0","2cqk","2s3o","1w54","2cn2","2s3m","1w1o","2r4g","2s4s","1x4o","2r48","2s4m","1wxo","2r44","1wu6","2r42","2p5c","2r58","2p54","2r52","2p50","2p4y","2l74","2p64","2l6w","2p5y","2l6s","2l6q","2dao","2l7w","2dag","2l7q","2dac","1tj4","2bcg","2k8s","1t5s","2b5k","2k5a","1sz4","2b24","1svs","2b0e","1su4","2s14","1tyo","2bjw","2s10","1trs","2bge","2s0y","1toc","1tmm","2qy0","2s1i","1u64","2qxw","1u2m","2qxu","2ors","2qye","2oro","2orm","2kfc","2os6","2kf8","2kf6","2bqg","2kfq","2bqc","2bqa","1sdc","2arc","2jy6","1s6o","2anw","1s3c","2am6","1s1o","1s0u","2rzo","1sl4","2av2","2rzm","1sho","1sfy","2qus","1sou","2quq","2ol0","2oky","2k1g","2k1e","2ayc","2aya","1rsg","2ags","1rp4","2af2","1rng","1rmm","2ryy","1rwc","1rum","2qt6","2ohm","2jui","1ri0","2abi","1rgc","1rfi","1rjy","1rcs","1rby","1n7k","286o","2inw","1mu8","27zs","2ike","1mnk","27wc","1mk8","27um","1mik","2ru0","1nn4","28e4","2rtw","1ng8","28am","2rtu","1ncs","1nb2","2qjs","2rue","1nuk","2qjo","1nr2","2qjm","2nzc","2qk6","2nz8","2nz6","2iug","2nzq","2iuc","2iua","28ko","2iuu","28kk","28ki","2ehs","2ltk","2pha","1zgg","2eb4","2lq4","1za8","2e7s","2loe","1z74","2e64","1z5k","2e5a","1z4s","1m1s","27lk","2ida","209s","1lv4","27i4","2034","2em4","27ge","1zzs","1lq4","1zy4","1lpa","1zxa","2rsk","1m9k","27pa","2s8k","2rsi","20hk","1m64","2s8i","20e4","1m4e","20ce","2qgk","1mda","2rck","2qgi","20la","2rci","2nsk","2pkk","2nsi","2pki","2igk","2m0k","2igi","2m0i","27sk","27si","1yo0","2dww","2lj0","1yhs","2dtk","2lha","1yeo","2drw","1yd4","2dr2","1ycc","1yby","1lgw","27b0","1ywg","1ldk","279a","1yt4","2dz2","1yrg","1lb2","1yqm","2rru","1lks","2s6y","1z0c","1lj2","1yym","2qey","2r96","2np6","2pdm","2i9m","2lmi","27ei","1y3k","2dmg","2ldq","1y0g","2dks","1xyw","2djy","1xy4","1xxq","1l6g","275q","1y7s","1l4s","1y64","1l3y","1y5a","1l8e","1y9q","1xtc","2dh8","1xrs","2dge","1xr0","1xqm","1l18","1xvg","1l0e","1xum","1xo8","2dem","1xng","1xn2","1kym","1xpa","1xlo","1xla","1iw0","260o","2hku","1ipc","25x8","1im0","25vi","1ikc","1iji","2rp0","1j3s","264e","2roy","1j0c","1iym","2q9g","1j7i","2q9e","2nec","2nea","2ho4","2ho2","267o","267m","1p6o","2968","2j5o","1p0g","292w","2j3y","1oxc","2918","1ovs","290e","1ov0","1oum","1ib4","25q4","1pf4","1i7s","25oe","1pbs","298e","1pa4","1i5a","1p9a","2roa","1if0","2rwa","1pj0","1ida","1pha","2q7u","2qnu","2nay","2o6y","2hh6","2j96","25tm","2fhc","2mbc","2pq6","21mo","2fe8","2m9o","21k0","2fco","2m8u","21io","2fbw","21i0","2fbi","21ho","1om8","28vs","2j0e","221s","1oj4","28u4","21yo","2fjw","28ta","21x4","1ogs","21wc","1oge","21vy","1i0o","25ku","1oqg","1hz0","2260","1oos","1hy6","224c","1ony","223i","1i2m","1ose","227y","218g","2f74","2m64","215s","2f5k","2m5a","214g","2f4s","213s","2f4e","213g","213a","1oc0","28qk","21dc","1oag","28pq","21bs","2f8e","21b0","1o9a","21am","1hvg","1oe4","1hum","21fg","1oda","21em","20yo","2f20","2m3i","20xc","2f18","20wo","2f0u","20wc","20w6","1o6w","28ny","2114","1o64","210c","1o5q","20zy","1hsu","1o7y","2126","20ts","2ezg","20t4","2ez2","20ss","20sm","1o4c","20v0","1o3y","20um","20rc","2ey6","20r0","20qu","1o32","20ry","20q4","20py","1gq8","24xo","1gmw","24vy","1gl8","1gke","1gu4","1gse","2q4a","2n3u","2h2y","2516","1jvk","26ig","2htq","1jsg","26gs","1jqw","26fy","1jq4","1jpq","1gfs","24se","1jzs","1ge4","1jy4","1gda","1jxa","1ghq","1k1q","1q68","29o0","2jek","1q3k","29mg","2jdq","1q28","29lo","1q1k","29la","1q18","1q12","1jlc","26d8","1qb4","1jjs","26ce","1q9k","1jj0","1q8s","1jim","1q8e","1gak","1jng","1g9q","1qd8","1jmm","1qce","2fz4","2mk8","2pum","22ps","2fxs","2mjg","22ow","2fx4","2mj2","22og","2fws","22o8","2fwm","22o4","1pwg","29iw","2jby","22xs","1pv4","29i4","22wg","2g0s","29hq","22vs","1pu4","22vg","1pty","22va","1jg8","26am","1pyw","1jfg","2308","1py4","1jf2","22zg","1pxq","22z2","1g7y","1jha","1pzy","231a","22io","2fu8","2mho","22hs","2ftk","2mha","22hc","2ft8","22h4","2ft2","22h0","22gy","1prk","29gc","22ls","1pqw","29fy","22l4","2fv2","22ks","1pqe","22km","1jdo","1pss","1jda","22n0","1pse","22mm","22e8","2frs","2mge","22ds","2frg","22dk","2fra","22dg","22de","1pp4","29f2","22fs","1pos","22fg","1pom","22fa","1jce","1ppq","22ge","22c0","2fqk","22bs","2fqe","22bo","22bm","1pnw","22cs","1pnq","22cm","22aw","2fpy","22as","22aq","1pna","22ba","1fnc","24e6","1flo","1fku","1fpa","1h80","256k","1h6g","255q","1h5o","1h5a","1fi4","1ha4","1fha","1h9a","1kdc","26rc","2hy6","1kc0","26qk","1kbc","26q6","1kb0","1kau","1h2w","253y","1kfs","1h24","1kf0","1h1q","1kem","1ffi","1h3y","1kgu","1qo0","29ww","2jj0","1qn4","29w8","2jim","1qmo","29vw","1qmg","29vq","1qmc","1qma","1k8g","26os","1qr4","1k7s","26oe","1qqg","29xq","1qq4","1k7a","1qpy","1h0c","1k9o","1gzy","1qsc","1k9a","1qry","2g80","2moo","2pwu","2g7k","2moc","2g7c","2mo6","2g78","2g76","1qjk","29ug","2jhq","23ds","1qj4","29u4","23dc","2g98","29ty","23d4","1qis","23d0","1qiq","23cy","1k60","26ni","1ql4","1k5o","23fc","1qks","1k5i","23f0","1qkm","23eu","1gz2","1k6m","1qlq","23fy","2g5s","2mng","2g5k","2mna","2g5g","2g5e","1qhc","29t8","2380","1qh4","29t2","237s","2g6e","237o","1qgy","237m","1k4s","1qi4","1k4m","238s","1qhy","238m","2g4o","2mmu","2g4k","2g4i","1qg8","29sm","2354","1qg4","2350","1qg2","234y","1k46","1qgm","235i","2g44","2g42","1qfo","233o","1qfm","233m","1f3w","1f32","1fw8","24im","1fvg","1fv2","1f1a","1fxa","1hgw","25b0","1hg8","25am","1hfw","1hfq","1fto","1hi4","1fta","1hhq","1km8","26vs","2i0e","1kls","26vg","1klk","26va","1klg","1kle","1heg","259q","1kns","26we","1kng","1hdy","1kna","1fse","1hf2","1koe","2a1c","2jl8","2a14","2jl2","2a10","2a0y","1kk0","26uk","1qz4","2a24","26ue","1qyw","1kjo","1qys","1kjm","1qyq","1hd8","1kks","1hd2","1qzw","1kkm","1qzq","2mqw","2pxy","2mqs","2mqq","2a08","2jkm","2gdk","2a04","2gdg","2a02","2gde","1kiw","26ty","1qw8","1kis","23mw","1qw4","1kiq","23ms","1qw2","23mq","1hcm","1kja","1qwm","23na","2mqc","2mqa","29zo","2gc4","29zm","2gc2","1kic","1qus","1kia","23jo","1quq","23jm","2mq2","29ze","2gbe","1ki2","1qu2","23i2","1f8c","1f7y","1g0o","24ku","1g0c","1g06","1f72","1g1a","1hlc","25d8","1hl4","25d2","1hl0","1hky","1fzg","1hm4","1fza","1hly","26y0","2i1i","26xw","26xu","1hk8","25cm","1krs","26ye","1kro","1hk2","1krm","1fyu","1hkm","1ks6","2jmc","2jma","26xg","2a44","26xe","2a42","1hjo","1kqc","1hjm","1r3o","1kqa","1r3m","2jm2","26x6","2a3e","1hje","1kpm","1r22","1fak","1fae","1g2w","24ly","1g2s","1g2q","1f9y","1g3a","25ec","25ea","1g2c","1ho4","1g2a","1ho2","2i22"]
    ];

    function fill_letters( frm, to ){
         var arr = [];

         for( var i = frm; i <= to; i++ ){
            arr.push( i );
         }

         return arr;
    }

    /**
     * Galois field for 929.
     */

   function equation_multiplier( eqn1, eqn2 ){
      var len = eqn1.length + eqn2.length - 1,
      ret = [];

      for( var i = 0; i < len; i++ ){
         var value = 0;
         for( var j = 0; j <= i; j++ ){
            value += ( eqn1[ j ] || 0 ) * ( eqn2[ i - j ] || 0 );
         }

         ret[ i ] = ( value % 929 + 929 ) % 929;
      }

      return ret;
   }

   function equation_generator( level ){
      var degree = 3,
      first = [ 1, -degree ];

      for( var i = 1; i < level; i++ ){
         degree = ( degree* 3 ) % 929;
         first = equation_multiplier( first, [ 1, -degree ] );
      }

      return first;
   }

   function error_correction( level ){
      var ret = equation_generator( level );
      ret.shift();
      return ret.map( item =>{
         return ( item % 929 + 929 ) % 929
      } ).reverse();
   }

   /**
    * For copying object
    */

   function qr_extend( options, ret ){
      for( var key in options ){
         ret[ key ] = options[ key ];
      }
      return ret;
   }

   /**
    * Main class instance.
    */

   class LyteBarcode_Pdf417{
      constructor( options ){
         options = ( this.options = qr_extend( options || {}, qr_extend( default_options, {} ) ) );

         var text = options.text,
         mode_seqs = this.form_modes( text ),
         encoded = this.encode_sequence( mode_seqs );

         if( encoded[ 0 ] == 900 ){
            encoded.shift();
         }

         var text_length = encoded.length;

         if( 925 < text_length /** 929 - 1 ( symbol Length descriptor) - 4 ( minimum error correction ) */ ){
            var error_cb = options.onError;
            error_cb && error_cb( this );
            return false;
         }

         encoded.unshift( text_length + 1 );

         var level = this.error_correction_level( text_length ),
         error_length = Math.pow( 2, level + 1 ),
         total_code_words = text_length + error_length + 1,
         aspect_ratio = options.aspect_ratio,
         row_height = options.row_height,
         // based on the aspect ratio and row height i am finding row and column length
         // cols = Math.max( 1, Math.min( 30, Math.round( ( Math.sqrt( ( ( 69 * row_height / 3 ) + 17 * row_height / 3 ) * ( total_code_words * row_height ) / aspect_ratio ) * aspect_ratio - 69 * row_height / 3 ) * 3 / row_height / 17 ) ) ),
         // With existing column calculation some scanners could not read big images. taken from pdf417 creation plugin
         cols = Math.max( 1, Math.min( 30, Math.round( ( Math.sqrt( 4761 + ( 68 * aspect_ratio * row_height * total_code_words ) ) - 69 ) / 34 ) ) ),
         rows = Math.max( 3, Math.min( 90, Math.ceil( total_code_words / cols ) ) ),
         present_data = cols * rows,
         canvas = options.canvas || document.createElement( "canvas" );

         if( present_data > 928 ){
            var error_cb = options.onError;
            error_cb && error_cb( this );
            return false; // need to do some alternative here
         }

         this.fill_padd( encoded, present_data - total_code_words );
         
         this.apply_corrections( encoded, error_length );

         this.init( rows, cols );

         this.fill_data( encoded, level, rows, cols );

         this.draw_in_canvas( canvas, options, cols );
         this.canvas = canvas;
      }

      /**
       * Final drawing in canvas.
       */

      draw_in_canvas( canvas, options, columns ){
         var pts = this.points,
         len = pts.length,
         fill_color = options.fill_color, 
         non_fill_color = options.non_fill_color, 
         quiet_zone = options.quiet_zone, 
         background = options.background, 
         before_draw = options.onBeforeDraw,
         scale = options.scale,
         aspect_ratio = options.aspect_ratio,
         row_height = options.row_height * scale,
         width = options.width,
         height = options.height,
         ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
         unit_x,
         unit_y,
         column_len = 69 + columns * 17;

         if( width == void 0 ){
            if( height != void 0 ){
               width = aspect_ratio * height * scale;
            } else {
               width = column_len * row_height / aspect_ratio;
            }
         } else {
            width *= scale;
         }

         if( height == void 0 ){
            height = width / aspect_ratio;
         } else {
            height *= scale;
         }

         unit_x = width / column_len;
         unit_y = height / len;

         width += quiet_zone * 2 * unit_x;
         height += quiet_zone * 2 * unit_x;

         canvas.width = width;
         canvas.height = height;

         if( background ){
            ctx.fillStyle = background;
            ctx.fillRect( 0, 0, width, height );
         }

         before_draw && before_draw( canvas, this );

         for( var row_index = 0; row_index < len; row_index++ ){
            var row = pts[ row_index ],
            cols = row.length;

            for( var col_index = 0; col_index < cols; col_index++ ){
               var col = row[ col_index ];

                ctx.fillStyle = col.fill ? fill_color : non_fill_color;
                ctx.rect( ( quiet_zone +  col_index ) * unit_x, ( quiet_zone * unit_x + row_index * unit_y ), unit_x, unit_y );
                ctx.fill();
                ctx.beginPath();
            }
         }
      }

      /**
       * Filling All the encoded data, error corrections, row indicators
       */

      fill_data( encoded, level, rows, cols ){

         var count = 0;

         for( var i = 0; i < rows; i++ ){
            var cluster_id = i % 3,
            left_row_indicator = this.find_left_row( cluster_id, level, rows, cols, i ),
            right_row_indictor = this.find_right_row( cluster_id, level, rows, cols, i );
            this.fill_individual_data( left_row_indicator, i, 17, "start_row_indicator" );
            this.fill_individual_data( right_row_indictor, i, this.__end_limit - 16, "end_row_indicator" );
            
            for( var j = 0; j < cols; j++ ){
               this.fill_individual_data( parseInt( cluster[ cluster_id ][ encoded[ count ] ], 36 ), i, ( j + 2 ) * 17, "data" );
               count++;
            }
         }
      }

      /**
       * Filling individual columns.
       * Data to be filled, left and top position, type to be filled
       */

      fill_individual_data( data, x, y, type ){
          var split = data.toString( 2 ).padStart( 17, "0" ).split( "" ),
          len = split.length,
          pts = this.points,
          row = pts[ x ];

          for( var i = 0; i < len; i++ ){
             var cur_pt = row[ y + i ];
             
             cur_pt.is_filled = true;
             cur_pt.type = type;

             cur_pt.fill = split[ i ] == "1";
          }
      }

      /**
       * Finding cluster value for right row indicators
       */

      find_right_row( cluster_id, level, rows, cols, row ){
         var row_index;

         switch( cluster_id ){
            case 0 : {
               row_index = 30 * parseInt( row / 3 ) + cols - 1;
            }
            break;
            case 1 : {
               row_index = 30 * parseInt( row / 3 ) + parseInt( ( rows - 1 ) / 3 );
            }
            break;
            case 2 : {
               row_index = 30 * parseInt( row / 3 ) + level * 3 + ( rows - 1 ) % 3;
            }
            break;
         }

         return parseInt( cluster[ cluster_id ][ row_index ], 36 );
      }

      /**
       * Finding cluster value for left row indicators
       */

      find_left_row( cluster_id, level, rows, cols, row ){
         var row_index;

         switch( cluster_id ){
            case 0 : {
               row_index = 30 * parseInt( row / 3 ) + parseInt( ( rows - 1 ) / 3 );
            }
            break;
            case 1 : {
               row_index = 30 * parseInt( row / 3 ) + level * 3 + ( rows - 1 ) % 3;
            }
            break;
            case 2 : {
               row_index = 30 * parseInt( row / 3 ) + cols - 1;
            }
            break;
         }

         return parseInt( cluster[ cluster_id ][ row_index ], 36 );
      }

      /**
       * Finding error correction values based on the error correction level choosed
       */

      apply_corrections( encoded, level ){
         var error_codes = error_correction( level ),
         len = encoded.length,
         dummy_correction = [];

         for( var i = 0; i < len; i++ ){
            var elem1 = ( encoded[ i ] + ( dummy_correction[ level - 1 ] || 0 ) ) % 929,
            elem2,
            elem3;
            
            for( var j = level - 1; j > -1; j-- ){
               elem2 = ( elem1 * error_codes[ j ] ) % 929;
               elem3 = 929 - elem2;
               dummy_correction[ j ] = ( ( dummy_correction[ j - 1 ] || 0 ) + elem3 ) % 929;
            }

            elem2 = ( elem1 * error_codes[ 0 ] ) % 929;
            elem3 = 929 - elem2;
            dummy_correction[ 0 ] = elem3 % 929;
         }

         var encoded_len = encoded.length;

         for( var i = 0; i < level; i++ ){
            var cur = dummy_correction[ i ];
            if( cur ){
               cur = 929 - cur;
            }

            encoded[ encoded_len + level - i - 1 ] = cur;
         }
      }

      /**
       * Filling extra available space with dummy padding value
       */

      fill_padd( arr, size ){
         for( var i = 0; i < size; i++ ){
            arr.push( 900 );
         }
      }

      /**
       * Finding error correction level based on the character count
       */

      error_correction_level( len ){

         var limits = [
            40,
            40 << 2,
            40 << 3,
            863
         ];

         for( var i = 0; i < 4; i++ ){
            var cur = limits[ i ];

            if( len <= cur ){
               return i + 2; // default is two
            }
         }

         return 8;
      }

      /**
       * Finding different combination of encodes from parsed text input
       */
      encode_sequence( arr ){
         var ret = [],
         len = arr.length,
         byte_encoder;

         for( var i = 0; i < len; i++ ){
            var cur = arr[ i ],
            text = cur.text,
            mode = cur.mode,
            cur_encoded;

            switch( mode ){
               case "text" : {
                  cur_encoded = this.text_encoding( text );
               }
               break;
               case "numeric" : {
                  cur_encoded = this.numeric_encoding( text );
               }
               case "byte" : {
                  byte_encoder = byte_encoder || ( byte_encoder = new TextEncoder() );
                  cur_encoded = Array.from( byte_encoder.encode( text ) );
                  
                  cur_encoded.unshift( cur_encoded.length % 6 == 0 ? 924 : 901 );
               }
               break;
            }

            ret.push.apply( ret, cur_encoded );
         }

         return ret;
      }

      /**
       * Numeric encoding.
       * Numbers are splitted into 44 digit length chunks for processing
       */

      numeric_encoding( text ){ 
         var arr = [];

         while( text ){
            arr.push.apply( arr, this.long_overall_division( '1' + text.slice( 0, 44 ) ) );
            text = text.slice( 44 );
         } 

         return arr;

      }

      /**
       * Converting the long number text to base 900 values. 
       */      

      long_overall_division( text ){
         var ret,
         arr = [];

         while( ret = this.long_division( text ) ){
            if( ret.res ){
               arr.unshift( ret.res );
               text = ret.div.toString();
            } else {
               break;
            }
         }
         // Numeric mode indicator
         arr.unshift( 902 ); 
         return arr;
      }

      /**
       * Dividing 44 digit numbers with 900.
       * Javascript supports upto 16 digit numbers alone. 
       * So normal Division is not possible. Here i am splitting the strings into small chunks and applying the division process
       */

      long_division( text, prev_res ){
         var limit = 1,
         cur = text.slice( 0, limit ),
         next = text.slice( limit );

         if( prev_res ){
            cur = prev_res + cur;
         }

         var parsed = parseInt( cur ),
         __res = parsed % 900,
         __div = parseInt( parsed / 900 );

         if( next ){
             var ret = this.long_division( next, __res );
             return {
               res : ret.res,
               div : __div + ret.div
             }
         } else {
            return {
               res : __res,
               div : __div + ""
            };
         }
      }

      /**
       * Text mode encoding .
       * Applying different text sub modes
       */

      text_encoding( text ){
         var len = text.length,
         def_mod = "a",
         available_sub_modes = [ "a", "l", "m", "p" ],
         cur_index = 0,
         ret = [];

         for( var i = 0; i < len; i++ ){
            var cur_text = text[ i ],
            code = cur_text.charCodeAt( 0 );

            for( var j = 0; j < 4; j++ ){
               var mode_to_check = available_sub_modes[ ( j + cur_index ) %4 ],
               mod_data = text_sub_mode[ mode_to_check ],
               mod_index = mod_data.indexOf( code );

               if( mod_index != -1 ){
                  if( def_mod != mode_to_check ){
                     var next_text = text[ i + 1 ],
                     next_code = next_text ? next_text.charCodeAt( 0 ) : 0;

                     if( next_code && def_mod == "l" && mode_to_check == "a" && text_sub_mode[ def_mod ].indexOf( next_code ) != -1 ){
                        ret.push( 27 );
                     } else if( next_code && mode_to_check == "p" && mod_data.indexOf( next_code ) == -1 ){
                        ret.push( 29 );
                     } else {
                        ret.push.apply( ret, text_mode_shift[ def_mod + '_' + mode_to_check ] );
                        def_mod = mode_to_check;
                        cur_index = ( j + cur_index ) %4;
                     }
                  }

                  ret.push( mod_index );
                  break;
               }
            }
         }

         var ret_len = ret.length,
         final = [ 900 ];

         if( ret_len % 2 == 1 ){
            ret.push( 29 );
            ret_len++;
         }

         for( var i = 0; i < ret_len; i += 2 ){
            var cur = ret[ i ],
            next = ret[ i + 1 ];

            final.push( cur * 30 + next );
         }

         return final;
      }

      /**
       * Finding different type of encoding modes
       */

      form_modes( text ){
         var printable_ascii_regex = /[\x20-\x7e\x09\x0a\x0d]{5,}/,
         numeric_mode = /[0-9]{13,44}/,
         ret = [];

         while( text ){

            var numeric_match = numeric_mode.exec( text ),
            text_match = printable_ascii_regex.exec( text ),
            __mode = "byte",
            __limit = text.length,
            obj = {};

            if( numeric_match ){
                var num_index = numeric_match.index;
                if( num_index ){
                  __limit = Math.min( __limit, num_index );
                } else {
                  __mode = "numeric";
                  __limit = numeric_match[ 0 ].length;
                }
            } 

            if( text_match ){
               var text_index = text_match.index;
               if( text_index ){
                  __limit = Math.min( __limit, text_index );
               } else {
                  __mode = "text";
                  __limit = text_match[ 0 ].length;
               }
            }

            obj.mode = __mode;
            obj.text = text.slice( 0, __limit );
            text = text.slice( __limit );
            ret.push( obj );
         }

         return ret;
      }

      /**
       * Creating empty points
       * Pre filling start and stop pattern here
       */

      init( row, col ){
         var start_pattern = this.individual_bar( "81111113" ),
         end_pattern = this.individual_bar( "711311121" ),
         arr = [],
         col_limit = col * 17 + 2 * 17 /*Two row indicators*/ + 17/* Start pattern */ + 18 /* End pattern */,
         end_pattern_limit = col_limit - 1 - 18;

         this.__end_limit = end_pattern_limit;

         for( var i = 0; i < row; i++ ){
            var __row = [];

            for( var j = 0; j < col_limit; j++ ){
               var obj = {
                  is_filled : false,
                  fill : false,
                  type : void 0
               };

               if( j < 17 ){
                  obj.is_filled = true;
                  obj.fill = start_pattern[ j ] == "1";
                  obj.type = "start_pattern";
               } else if( end_pattern_limit < j ){
                  obj.is_filled = true;
                  obj.fill = end_pattern[ j - end_pattern_limit ] == "1";
                  obj.type = "stop_pattern";
               }

               __row.push( obj );
            }

            arr.push( __row );
         }


         this.points = arr;
      }

      /**
       * Converting value to 17 modules binary data
       */

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
   }

   if( typeof $L != "undefined" ){
      $L.pdf417 = ops => {
         return new LyteBarcode_Pdf417( ops );
      };
      $L.pdf417.class_instance = LyteBarcode_Pdf417;
   } else {
      window.LyteBarcode_Pdf417 = LyteBarcode_Pdf417;
   }

})();
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

/*
 * This plugin is used for creating QR codes in web.
 * contact @lyte-team@zohocorp.com
 */

;( function(){

   var default_options = {
      error_correction : "M", // LMQH => four error corrections available. based on the error correction error correction data will increase. actual data size may reduce.
      width : 500,
      height : 500,
      fill_color : "black",
      non_fill_color : "white",
      quiet_zone : 4,
      background : "white",
      scale : window.devicePixelRatio,
      min_unit_size : 0,
      unit_size : 5
   },
   character_limit = { // based on the error correction & encoding mode each version of QR code can hold the following amount of data
      "L" : {
         "numeric" : [
            41,77,127,187,255,322,370,461,552,652,772,883,1022,1101,1250,1408,1548,1725,1903,2061,2232,2409,2620,2812,3057,3283,3517,3669,3909,4158,4417,4686,4965,5253,5529,5836,6153,6479,6743,7089
         ],
         "alpha_numeric" : [ 
            25,47,77,114,154,195,224,279,335,395,468,535,619,667,758,854,938,1046,1153,1249,1352,1460,1588,1704,1853,1990,2132,2223,2369,2520,2677,2840,3009,3183,3351,3537,3729,3927,4087,4296
         ],
         "byte" : [
            17,32,53,78,106,134,54,192,230,271,321,367,425,458,520,586,644,718,792,858,929,1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563,2699,2809,2953
         ],
         "kanji" : [ 
            10,20,32,48,65,82,95,118,141,167,198,226,262,282,320,361,397,442,488,528,572,618,672,721,784,842,902,940,1002,1066,1132,1201,1273,1347,1417,1496,1577,1661,1729,1817
         ]
      },
      "M" : { 
         "numeric" : [ 
            34,63,101,149,202,255,293,365,432,513,604,691,796,871,991,1082,1212,1346,1500,1600,1708,1872,2059,2188,2395,2544,2701,2857,3035,3289,3486,3693,3909,4134,4343,4588,4775,5039,5313,5596
         ],
         "alpha_numeric" : [ 
            20,38,61,90,122,154,178,221,262,311,366,419,483,528,600,656,734,816,909,970,1035,1134,1248,1326,1451,1542,1637,1732,1839,1994,2113,2238,2369,2506,2632,2780,2894,3054,3220,3391
         ],
         "byte" : [ 
            14,26,42,62,84,106,122,152,180,213,251,287,331,362,412,450,504,560,624,666,711,779,857,911,997,1059,1125,1190,1264,1370,1452,1538,1628,1722,1809,1911,1989,2099,2213,2331
         ],
         "kanji" : [ 
            8,16,26,38,52,65,75,93,111,131,155,177,204,223,254,277,310,345,384,410,438,480,528,561,614,652,692,732,778,843,894,947,1002,1060,1113,1176,1224,1292,1362,1435
         ]
      },
      "Q" : { 
         "numeric" : [
            27,48,77,111,144,178,207,259,312,364,427,489,580,621,703,775,876,948,1063,1159,1224,1358,1468,1588,1718,1804,1933,2085,2181,2358,2473,2670,2805,2949,3081,3244,3417,3599,3791,3993
         ],
         "alpha_numeric":[
            16,29,47,67,87,108,125,157,189,221,259,296,352,376,426,470,531,574,644,702,742,823,890,963,1041,1094,1172,1263,1322,1429,1499,1618,1700,1787,1867,1966,2071,2181,2298,2420
         ],
         "byte":[
            11,20,32,46,60,74,86,108,130,151,177,203,241,258,292,322,364,394,442,482,509,565,611,661,715,751,805,868,908,982,1030,1112,1168,1228,1283,1351,1423,1499,1579,1663
         ],
         "kanji":[
            7,12,20,28,37,45,53,66,80,93,109,125,149,159,180,198,224,243,272,297,314,348,376,407,440,462,496,534,559,604,634,684,719,756,790,832,876,923,972,1024
         ]
      },
      "H":{
         "numeric":[
            17,34,58,82,106,139,154,202,235,288,331,374,427,468,530,602,674,746,813,919,969,1056,1108,1228,1286,1425,1501,1581,1677,1782,1897,2022,2157,2301,2361,2524,2625,2735,2927,3057
         ],
         "alpha_numeric":[
            10,20,35,50,64,84,93,122,143,174,200,227,259,283,321,365,408,452,493,557,587,640,672,744,779,864,910,958,1016,1080,1150,1226,1307,1394,1431,1530,1591,1658,1774,1852
         ],
         "byte":[
            7,14,24,34,44,58,64,84,98,119,137,155,177,194,220,250,280,310,338,382,403,439,461,511,535,593,625,658,698,742,790,842,898,958,983,1051,1093,1139,1219,1273
         ],
         "kanji":[
            4,8,15,21,27,36,39,52,60,74,85,96,109,120,136,154,173,191,208,235,248,270,284,315,330,365,385,405,430,457,486,518,553,590,605,647,673,701,750,784
         ]
      }
   },
   blocks_data = {
      /*
       * Array order
       * Available codewords - error correction per block - number of blocks in group 1 - Number of code words in each blocks of group 1 - Number of blocks in group 2 - Number of code words in each blocks of group 2
       */
      "L" : [
         [19,7,1,19],[34,10,1,34],[55,15,1,55],[80,20,1,80],[108,26,1,108],[136,18,2,68],[156,20,2,78],[194,24,2,97],[232,30,2,116],[274,18,2,68,2,69],[324,20,4,81],[370,24,2,92,2,93],[428,26,4,107],[461,30,3,115,1,116],[523,22,5,87,1,88],[589,24,5,98,1,99],[647,28,1,107,5,108],[721,30,5,120,1,121],[795,28,3,113,4,114],[861,28,3,107,5,108],[932,28,4,116,4,117],[1006,28,2,111,7,112],[1094,30,4,121,5,122],[1174,30,6,117,4,118],[1276,26,8,106,4,107],[1370,28,10,114,2,115],[1468,30,8,122,4,123],[1531,30,3,117,10,118],[1631,30,7,116,7,117],[1735,30,5,115,10,116],[1843,30,13,115,3,116],[1955,30,17,115],[2071,30,17,115,1,116],[2191,30,13,115,6,116],[2306,30,12,121,7,122],[2434,30,6,121,14,122],[2566,30,17,122,4,123],[2702,30,4,122,18,123],[2812,30,20,117,4,118],[2956,30,19,118,6,119]
      ],
      "M" : [ 
         [16,10,1,16],[28,16,1,28],[44,26,1,44],[64,18,2,32],[86,24,2,43],[108,16,4,27],[124,18,4,31],[154,22,2,38,2,39],[182,22,3,36,2,37],[216,26,4,43,1,44],[254,30,1,50,4,51],[290,22,6,36,2,37],[334,22,8,37,1,38],[365,24,4,40,5,41],[415,24,5,41,5,42],[453,28,7,45,3,46],[507,28,10,46,1,47],[563,26,9,43,4,44],[627,26,3,44,11,45],[669,26,3,41,13,42],[714,26,17,42],[782,28,17,46],[860,28,4,47,14,48],[914,28,6,45,14,46],[1000,28,8,47,13,48],[1062,28,19,46,4,47],[1128,28,22,45,3,46],[1193,28,3,45,23,46],[1267,28,21,45,7,46],[1373,28,19,47,10,48],[1455,28,2,46,29,47],[1541,28,10,46,23,47],[1631,28,14,46,21,47],[1725,28,14,46,23,47],[1812,28,12,47,26,48],[1914,28,6,47,34,48],[1992,28,29,46,14,47],[2102,28,13,46,32,47],[2216,28,40,47,7,48],[2334,28,18,47,31,48]
      ],
      "Q" : [ 
         [13,13,1,13],[22,22,1,22],[34,18,2,17],[48,26,2,24],[62,18,2,15,2,16],[76,24,4,19],[88,18,2,14,4,15],[110,22,4,18,2,19],[132,20,4,16,4,17],[154,24,6,19,2,20],[180,28,4,22,4,23],[206,26,4,20,6,21],[244,24,8,20,4,21],[261,20,11,16,5,17],[295,30,5,24,7,25],[325,24,15,19,2,20],[367,28,1,22,15,23],[397,28,17,22,1,23],[445,26,17,21,4,22],[485,30,15,24,5,25],[512,28,17,22,6,23],[568,30,7,24,16,25],[614,30,11,24,14,25],[664,30,11,24,16,25],[718,30,7,24,22,25],[754,28,28,22,6,23],[808,30,8,23,26,24],[871,30,4,24,31,25],[911,30,1,23,37,24],[985,30,15,24,25,25],[1033,30,42,24,1,25],[1115,30,10,24,35,25],[1171,30,29,24,19,25],[1231,30,44,24,7,25],[1286,30,39,24,14,25],[1354,30,46,24,10,25],[1426,30,49,24,10,25],[1502,30,48,24,14,25],[1582,30,43,24,22,25],[1666,30,34,24,34,25]
      ],
      "H" : [
         [9,17,1,9],[16,28,1,16],[26,22,2,13],[36,16,4,9],[46,22,2,11,2,12],[60,28,4,15],[66,26,4,13,1,14],[86,26,4,14,2,15],[100,24,4,12,4,13],[122,28,6,15,2,16],[140,24,3,12,8,13],[158,28,7,14,4,15],[180,22,12,11,4,12],[197,24,11,12,5,13],[223,24,11,12,7,13],[253,30,3,15,13,16],[283,28,2,14,17,15],[313,28,2,14,19,15],[341,26,9,13,16,14],[385,28,15,15,10,16],[406,30,19,16,6,17],[442,24,34,13],[464,30,16,15,14,16],[514,30,30,16,2,17],[538,30,22,15,13,16],[596,30,33,16,4,17],[628,30,12,15,28,16],[661,30,11,15,31,16],[701,30,19,15,26,16],[745,30,23,15,25,16],[793,30,23,15,28,16],[845,30,19,15,35,16],[901,30,11,15,46,16],[961,30,59,16,1,17],[986,30,22,15,41,16],[1054,30,2,15,64,16],[1096,30,24,15,46,16],[1142,30,42,15,32,16],[1222,30,10,15,67,16],[1276,30,20,15,61,16]
      ]
   },
   log_arr = [],
   anti_log_arr = [],
   encoders = {
      numeric : 1 << 0,
      alpha_numeric : 1 << 1,
      byte : 1 << 2,
      kanji : 1 << 3,
      eci : 7
   };

   // galois field multiplication and division

   ( function(){
      var value = 1;

      for( var exp = 1; exp < 256; exp++ ){
         value = value << 1;

         if( value > 255 ){
            value = value ^ 285;
         }

         log_arr[ value ] = exp % 255;
         anti_log_arr[ exp % 255 ] = value;
      }

   })();


   function log_multiply( val1, val2 ){

      if( val1 && val2 ){
         var first = log_arr[ val1 ] || 0,
         second = log_arr[ val2 ] || 0,
         sum = first + second;

         return anti_log_arr[ sum % 255 ];
      } else {
         return 0;
      }
   }


   function log_div( val1, val2 ){
      if( val1 && val2 ){
         var first = log_arr[ val1 ],
         second = log_arr[ val2 ],
         sum = first + second * 254;

         return anti_log_arr[ sum % 255 ];
      } else {
         return 1;
      }
   }

   // Equation multiplication based on galois field

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

   // Equation division based on galois field

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
   // passing degree of the equation will return a common equation with that degree.

   function equation_generator( degree ){
      var eqn = [ 1 ]; // default eqn with one degree

      for( var i = 0; i < degree; i++ ){
         eqn = equation_multiplier( eqn, [ 1, anti_log_arr[ i ] ] );
      }

      return eqn;
   }

   // for deep array clone

   function clone_arr( arr ){
      var ret = [],
      len = arr.length;

      for( var i = 0; i < len; i++ ){
         var rows = arr[ i ],
         row = [],
         row_len = rows.length;

         for( var j = 0; j < row_len; j++ ){
            var item = rows[ j ];
            row.push({
               fill : item.fill,
               type : item.type,
               is_filled : item.is_filled
            });
         }

         ret.push( row );
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


   class LyteQr{
      constructor( options ){

         options = ( this.options = qr_extend( options || {}, qr_extend( default_options, {} ) ) );

         var text = options.text,
         canvas = options.canvas || document.createElement( "canvas" ),
         mode = options.encoder || this.detect_encoder( text || "" ),
         escaped_text = this.escape_text( text, mode ),
         // len  
         error_correction = options.error_correction,
         version = this.get_version( escaped_text, mode, error_correction ),
         need_reserve = version > 6;

         if( version == void 0 ){
            var error_cb = options.onError;
            error_cb && error_cb( this );
            return false;
         }


         var qr_size = this.get_size( version ),
         alignment_count = this.alignment_pattern_count( version ),
         alignment_position = this.alignment_position( version, alignment_count, qr_size );

         this.init( qr_size );

         this.fill_finder( qr_size );
         this.fill_separators( qr_size );
         this.fill_timings( qr_size );

         this.fill_alignments( qr_size, alignment_position );

         this.reserve_encoding_info( qr_size );

         if( need_reserve ){
            this.reserve_version_info( qr_size );
         }

         this.encode_data( escaped_text, mode, error_correction, version );

         if( need_reserve ){
            this.fill_version_info( qr_size, version );
         }

         this.apply_mask( error_correction );

         this.draw_in_canvas( canvas, options );

         this.canvas = canvas;
      }

      // Initializing data based on its size

      init( size ){

         var arr = [];

         for( var i = 0; i < size; i++ ){
            var row = [];
            for( var j = 0; j < size; j++ ){
               row[ j ] = {
                  fill : false,
                  type : null,
                  is_filled : false
               }
            }
            arr.push( row );
         }

         this.points = arr;
      }

      /*
       * Data population
       */


       // finder pattern pre filling

      fill_finder( size ){
         var pts = this.points,
         fn = function( x, y ){
            for( var i = 0; i < 7; i++ ){
               for( var j = 0; j < 7; j++ ){
                  var cur_pt = pts[ x + i ][ y + j ];
                  
                  cur_pt.is_filled = true;
                  cur_pt.fill = ( !i || !j || i == 6 || j == 6 ) || ( ( i > 1 && i < 5 ) && ( j > 1 && j < 5 ) )
                  cur_pt.type = "finder_pattern";
               }
            }
         };

         fn( 0, 0 );
         fn( 0, size - 7 );
         fn( size - 7, 0 );
      }

      // seperators pre filling

      fill_separators( size ){
         var pts = this.points,
         fn = ( x, y, x_fact, y_fact ) =>{
            for( var i = 0; i < 8; i++ ){
               var hori = pts[ x + i * x_fact ][ y ],
               vert = pts[ x ][ y + i * y_fact ];

               vert.fill = hori.fill = false;
               hori.type = vert.type = "separators";
               vert.is_filled = hori.is_filled = true;
            }
         };

         fn( 7, 7, -1, -1 );
         fn( 7, size - 1 - 7, -1, 1 );
         fn( size - 1 - 7, 7, 1, -1 );
      }

      // timing pattern prefilling

      fill_timings( size ){
         var pts = this.points,
         fn = ( x, y, x_fact, y_fact, len ) =>{
            for( var i = 0; i < len; i++ ){
               var cur = pts[ x + i * x_fact ][ y + i * y_fact ];
               cur.is_filled = true;
               cur.type = "timing_pattern";
               cur.fill = i % 2 == 0;
            }
         };


         fn( 6, 8, 0, 1, size - 8 * 2 );
         fn( 8, 6, 1, 0, size - 8 * 2 );

         // dark module fill

         var dark = pts[ size - 1 - 7 ][ 8 ];
         dark.fill = dark.is_filled = true;
         dark.type = "dark_module";
      }

      // alignment patters filling based on the alignment positions passed

      fill_alignments( size, arr ){
         var grp_pts = this.alignment_coordinates( arr ),
         pts = this.points;

         grp_pts.forEach( item =>{
            for( var i = 0; i < 5; i++ ){
               for( var j = 0; j < 5; j++ ){
                  var cur = pts[ item.x + i ][ item.y + j ];

                  cur.is_filled = true;
                  cur.type = "alignment_pattern";
                  cur.fill = ( i == 0 || j == 0 || i == 4 || j == 4 || ( i == 2 && j == 2 ) );
               }
            }
         });

      }

      // reserving places for encoding and masking information even before filling data

      reserve_encoding_info( size ){
         var pts = this.points,
         fn = ( x, y, x_fact, y_fact, len ) =>{
            for( var i = 0; i < len; i++ ){
               var cur_pt = pts[ x + i * x_fact ][ y + i * y_fact ];

               if( !cur_pt.is_filled ){
                  cur_pt.is_filled = true;
                  cur_pt.fill = false;
                  cur_pt.type = "encoding_pattern";
               }
            }
         };

         fn( 8, 0, 0, 1, 9 );
         fn( 0, 8, 1, 0, 9 );

         fn( size - 7, 8, 1, 0, 7 );
         fn( 8, size - 8, 0, 1, 8 );
      }

      // reserves area for version information. only for >= 7 versions

      reserve_version_info( size, str ){
         var pts = this.points,
         fn = ( x, y, len, hgt ) =>{

            for( var i = 0; i < 18; i++ ){
               var row = i % 3,
               col = parseInt( i / 3 ),
               cur_pt = x ? pts[ x + row ][ y + col ] : pts[ x + col ][ y + row ];

               if( str ){
                  cur_pt.fill = str[ i ] == "1";
               } else {
                  cur_pt.fill = false;
                  cur_pt.is_filled = true;
                  cur_pt.type = "version_pattern";
               }
            }
         };

         fn( size - 11, 0 );
         fn( 0, size - 11 );
      }

      // finds the 18 length version info. and fills them in the reserved version pattern

      fill_version_info( size, version ){
         var version_arr = version.toString( 2 ).padStart( 6, "0" ).padEnd( 18, "0" ).split( "" ).map( item => parseInt( item ) ),
         div_arr = [ 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1 ], //x12 + x11 + x10 + x9 + x8 + x5 + x2 + 1
         ret = equation_devision( version_arr, div_arr );

         version_arr.splice( 6 );

         var final =  version_arr.concat( ret ).reverse().join( "" );
         this.reserve_version_info( size, final );
      }

      // filling data in the available places. two column zig zag pattern.

      fill_data( str ){ 
         var pts = this.points,
         len = str.length,
         x = pts.length - 1,
         y = x,
         count = 0,
         moved_count = 0,
         size = pts.length,
         column_passed = 0,
         upwards = true;

         while( true ){
            var cur_pt = pts[ x ][ y ],
            value = str[ count ];

            if( !cur_pt.is_filled ){
               cur_pt.is_filled = true;
               cur_pt.type = "data";
               cur_pt.fill = value == "1";
               count++;
            }

            moved_count++;

            if( moved_count >= size * 2 ){
               column_passed += 2;
               moved_count = 0;
               upwards = !upwards;
            }

            if( column_passed == size ){
               break;
            }

            y = size - 1 - column_passed - moved_count % 2;

            if( upwards ){
               x = size - 1 - Math.floor( moved_count / 2 ); 
            } else {
               x = Math.floor( moved_count / 2 );
            }

            if( y == 6 ){ // this column is already filled for finder pattern and timing patterns. so skipping this column
               y = 5;
               column_passed++;
            }
         }

      }

      /*
       *  QR code utils
       */


      // finding the minimum required version based on the text provided and error correction method

      get_version( text, mode, error ){
         var limits = character_limit[ error ][ mode ],
         len = this.get_text_length( text, mode );

         for( var i = 0; i < limits.length; i++ ){
            var cur = limits[ i ];

            if( len <= cur ){
               return i + 1;
            }
         }
      }

      // escaping the text. need to check this for urls

      escape_text( text, mode ){
         return text;
      }

      get_text_length( text, mode ){
         if( mode == "byte" ){
            return this.byte_escape( text, true );
         }
         return text.length;
      }

      // converting the actual data to binary format
 
      encode_data( text, mode, error_correction, version ){

         var mode_indicator = this.modify_bits( encoders[ mode ].toString( 2 ), 4 ),
         count_indicator = this.modify_bits( this.get_text_length( text, mode ).toString( 2 ), this.data_bit_length( mode, version ) ),
         str = mode_indicator + count_indicator + this[ mode + "_escape" ]( text ),
         block = blocks_data[ error_correction ][ version - 1 ],
         total_codeblocks = block[ 0 ],
         bits = total_codeblocks * 8,
         len = str.length,
         diff = bits - len,
         terminator = Math.min( 4, diff ),
         fn = function( value ){
            str = str.padEnd( str.length + value, "0" );
         },
         extra;

         diff -= terminator;
         extra = diff % 8;

         fn( terminator );

         if( extra ){
            diff -= extra;
            fn( extra );
         }

         if( diff ){
            var pad_bytes = [ 236, 17 ].map( item => {
               return this.modify_bits( item.toString( 2 ), 8 );
            }),
            __count = 0;

            while( diff > 0 ){
               str += pad_bytes[ __count % 2 ];
               __count++;
               diff -= 8;
            }
         }

         this.apply_corrections( this.split_into_chunk( str ), mode, error_correction, version );
      }

      // splitting the data to 8 bit length chunks

      split_into_chunk( str ){
         var arr = [],
         len = str.length / 8;

         for( var i = 0; i < len; i++ ){
            arr.push( str.slice( i * 8, 8 * ( i + 1 ) ) );
         }

         return arr;
      }

      //adding corrections to the original data

      apply_corrections( chunk_arr, mode, error_correction, version ){ 
         var current_block = blocks_data[ error_correction ][ version - 1 ],
         arr = [],
         obj = {
            blocks : arr
         },
         error_correction = obj.error_correction = current_block[ 1 ],
         count = 0,
         ec_eqn = equation_generator( error_correction ),
         final_value = [],
         final_ec = [],
         overall_final = [],
         extra_zero = [],
         max_len = 0;

         for( var i = 0; i < error_correction; i++ ){
            extra_zero.push( 0 );
         }

         obj.codewords = current_block[ 0 ];

         arr.push({
            blocks : current_block[ 2 ],
            codewords : current_block[ 3 ]
         });

         if( current_block[ 4 ] ){
            arr.push({
               blocks : current_block[ 4 ],
               codewords : current_block[ 5 ]
            });
         }

         arr.forEach( group =>{
             var blocks = group.blocks,
             codewords = group.codewords;

             max_len = Math.max( max_len, codewords );

             for( var i = 0; i < blocks; i++ ){
                var chunk_split = chunk_arr.slice( count, count += codewords ),
                cur_eqn = this.bin_2_dec( chunk_split );

                final_value.push( chunk_split );
                final_ec.push( this.dec_2_bin( equation_devision( cur_eqn.concat( extra_zero ), ec_eqn ) ) );
             }
         });

         this.shuffle( overall_final, final_value, max_len );
         this.shuffle( overall_final, final_ec, error_correction );

         this.fill_data( overall_final.join( "" ) );
      }

      shuffle( original, arr, len ){
         for( var i = 0; i < len; i++ ){
            arr.forEach( item =>{
               var value = item[ i ];

               if( value != void 0 ){
                  original.push( value );
               }
            });
         }
      }

      bin_2_dec( arr ){
         return arr.map( item => parseInt( item, 2 ) );
      }

      dec_2_bin( arr ){
         return arr.map( item => this.modify_bits( item.toString( 2 ), 8 ) );
      }

      // adds required number of zeros at the begining

      modify_bits( base_2, count ){
         return base_2.padStart( count, "0" );
      }

      // encoding numbers alone

      numeric_escape( text ){
         var len = text.length,
         str = "";

         while( text ){
            var cut = text.slice( 0, 3 ),
            parsed = parseInt( cut ),
            base_2 = parsed.toString( 2 ),
            chunk_len = cut.length,
            bit_len = chunk_len == 3 ? 10 : ( chunk_len == 2 ? 7 : 4 );

            text = text.slice( 3 );

            str += this.modify_bits( base_2, bit_len );
         }

         return str;
      }

      // enoding alpha numeric alone

      alpha_numeric_escape( text ){
         var len = text.length,
         str = "",
         map = {
             "32": 36,
             "36": 37,
             "37": 38,
             "42": 39,
             "43": 40,
             "45": 41,
             "46": 42,
             "47": 43,
             "58": 44
         },
         fn = sub_text => {
            var len = sub_text.length,
            count = 0;

            for( var i = 0; i < len; i++ ){
               var frm_map = map[ sub_text.charCodeAt( i ) ];

               count += ( frm_map * ( i + 1 == len ? 1 : 45 ) );
            }

            return this.modify_bits( count.toString( 2 ), len == 2 ? 11 : 6 );
         };

         for( var i = 48; i <= 90; i++ ){
            if( 58 <= i && i <= 64 ){
               continue;
            }
            map[ i ] = i - 48 - ( i >= 65 && i <= 90 ? 7 : 0 );
         }

         while( text ){
            var cut = text.slice( 0, 2 );
            text = text.slice( 2 );
            str += fn( cut );
         }

         return str;
      }

      // normal encoding

      byte_escape( text, ret ){
         
         var str = "",
         encoded_text = this.__encoded || ( this.__encoded = new TextEncoder().encode( text ) );

         if( ret ){
            return encoded_text.length;
         }

         encoded_text.forEach( item =>{
            str += this.modify_bits( item.toString( 2 ), 8 );
         });

         return str;
      }

      // length of the length bit to be used based on the encoding mode & version

      data_bit_length( mode, version ){

         var index = version > 26 ? 2 : ( version > 9 ? 1 : 0 );

         return {
            numeric : [
               10,
               12,
               14
            ],
            alpha_numeric : [
               9,
               11,
               13
            ],
            byte : [
               8,
               16,
               16
            ],
            kanji : [
               8,
               10,
               12
            ]
         }[ mode ][ index ];
      }

      // size of the qr code based on the version

      get_size( version ){
         return 17 + version * 4;
      }

      // Deciding encoding mode based on the input

      detect_encoder( text ){
         if( /^\d*$/.test( text ) ){
            return "numeric";
         }

         if( /^[\dA-Z $%*+\-./:]*$/.test( text ) ){
            return "alpha_numeric";
         }

         if( /^[\x00-\xff]*$/.test( text ) ){
            return "byte"
         }

         if( this.kanji_escape && /^[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]*$/u.test( text ) ){
            return "kanji";
         }

         // return "eci";
         return "byte";
      }

      // number of alignment positions based on the version

      alignment_number( version ){
         return Math.floor( version / 7 ) + 2;
      }
 
      // version 1 doesnt have no alignment patterns in the QR
      alignment_pattern_count( version ){
         if( version == 1 ){
            return 0;
         }
         return Math.max( 0, Math.pow( this.alignment_number( version ), 2 ) - 3 );
      }

      // possible positions of the alignment patterns

      alignment_position( version, count, size ){
         if( version == 1 ){
            return [];
         }

         var interval = this.alignment_number( version ) - 1,
         edge = size - 1,
         arr = [],
         step = Math.ceil( ( edge - 2 * 6 ) / 2 / interval ) * 2;

         for( var i = 0; i < interval; i++ ){
            arr.unshift( edge - 6 - i * step );
         }

         arr.unshift( 6 );

         return arr;
      }

      // converting alignment positions to 2d coordinates

      alignment_coordinates( arr ){
         var ret = [],
         len = arr.length,
         pts = this.points;

         for( var i = 0; i < len; i++ ){
            for( var j = 0; j < len; j++ ){
               var __x = arr[ i ] - 2,
               __y = arr[ j ] - 2;

               if( this.is_fit( pts, __x, __y, 5, 5, "finder_pattern" ) ){
                  ret.push({
                     x : __x,
                     y : __y
                  });
               }
            }
         }

         return ret;
      }

      // checking empty / patterns in a fixed area

      is_fit( pts, x, y, len, hgt, type ){

         for( var i = x; i < x + len; i++ ){
            for( var j = y; j < y + hgt; j++ ){
               var cur_pt = pts[ i ][ j ];

               if( type ? cur_pt.type == type : cur_pt.is_filled ){
                  return false;
               }
            }
         }

         return true;
      }

      // final drawing of the QR

      draw_in_canvas( canvas, options ){
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
         unit = width / ( len + 2 * quiet_zone ),
         ctx = canvas.getContext( "2d", { willReadFrequently: true } ),
         rows = pts.length,
         min_unit_size = options.min_unit_size,
         unit_size = options.unit_size;

         if( isNaN( unit ) ){
            height = width = ( ( unit = unit_size ) + 2 * quiet_zone ) * len;
         }

         if( unit < min_unit_size ){
            unit = min_unit_size;
            height = width = unit * ( len + 2 * quiet_zone );
         }

         canvas.width = width;
         canvas.height = height;

         if( background ){
            ctx.fillStyle = background;
            ctx.fillRect( 0, 0, width, height );
         }

         before_draw && before_draw( canvas, this );

         for( var row_index = 0; row_index < rows; row_index++ ){
            var row = pts[ row_index ];

            for( var col_index = 0; col_index < rows; col_index++ ){
               var col = row[ col_index ];

                ctx.fillStyle = col.fill ? fill_color : non_fill_color;
                ctx.rect( ( quiet_zone +  col_index ) * unit, ( quiet_zone + row_index ) * unit, unit, unit );
                ctx.fill();
                ctx.beginPath();
            }
         }
      }

      /*
       * Applying mask values
       */

       // checking bestfit mask

       apply_mask( error_correction ){
         var pts = this.points,
         size = pts.length,
         pts_cpy,
         min = Infinity,
         rules = [
            ( row, col ) => ( row + col ) % 2 == 0,
            ( row, col ) => row % 2 == 0,
            ( row, col ) => col % 3 == 0,
            ( row, col ) => ( row + col ) % 3 == 0,
            ( row, col ) => ( Math.floor( row / 2 ) + Math.floor( col / 3 ) ) % 2 == 0,
            ( row, col ) => ( ( row * col ) % 2 + ( row * col ) % 3 ) == 0,
            ( row, col ) => ( ( ( row * col ) % 2 + ( row * col ) % 3 ) ) % 2 == 0,
            ( row, col ) => ( ( ( row + col ) % 2 + ( row * col ) % 3 ) ) % 2 == 0
         ];

         for( var i = 0; i < 8; i++ ){
            var ret = this.apply_mask_rule( clone_arr( pts ), rules[ i ], i, error_correction );

            if( ret.score < min ){
               min = ret.score;
               pts_cpy = ret.pts;
            } 
         }

         if( pts_cpy ){
            this.points = pts_cpy;
         }

       } 
 
       // score of the particular mask rule

       apply_mask_rule( pts, fn, rule_no, error_correction ){

         var rows = pts.length;

         for( var row_index = 0; row_index < rows; row_index++ ){
            var row = pts[ row_index ];

            for( var col_index = 0; col_index < rows; col_index++ ){
               var col = row[ col_index ];

               if( ( col.type == "data" ) && fn( row_index, col_index ) ){
                  col.fill = !col.fill;
               }
            }
         }

         var mask_value = this.apply_mask_info( rule_no, error_correction ),
         score = 0;

         this.fill_mask( mask_value, pts );

         for( var i = 1; i < 5; i++ ){
            score += this[ "mask_score" + i ]( pts );
         }

         return {
            pts : pts,
            score : score
         };
       }

       // mask information & error correction details to binary
       // if QR code is not generated properly check this function.

       apply_mask_info( rule_no, error_correction ){
         var error_bit = {
            L : 1,
            M : 0,
            Q : 3,
            H : 2
         },
         str = this.modify_bits( error_bit[ error_correction ].toString( 2 ), 2 ) + this.modify_bits( rule_no.toString( 2 ), 3 ),
         eqn1 = ( str.padEnd( 15, "0" ) ).split( "" ).map( item => parseInt( item ) ),
         eqn2 = [ 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1 ], //x10 + x8 + x5 + x4 + x2 + x + 1
         res  = equation_devision( eqn1, eqn2 ),
         mask_info = parseInt( eqn1.slice( 0, 5 ).concat( res ).join( "" ), 2 ),
         format_mask_value = 21522, //101010000010010
         final_value = ( mask_info ^ format_mask_value ).toString( 2 );

         return this.modify_bits( final_value, 15 );
         
       }

       // adding mask encoding info to the points

       fill_mask( str, pts ){
         var len = pts.length,
         fn = ( x, y, x_fact, y_fact ) =>{
            var count = 0,
            modified;
            for( var i = 0; i < len; i++ ){
               var cur_pt = pts[ x + i * x_fact ][ y + i * y_fact ];

               if( cur_pt.type == "encoding_pattern" ){
                  cur_pt.fill = str[ count++ ] == "1";
               }

               if( y_fact && count == 7 && !modified ){
                  count--;
                  modified = true;
               }
            }
         };

         fn( 8, 0, 0, 1 );
         fn( len - 1, 8, -1, 0 );
       }

       // 4 mask rules need to be checked

       // rule 1 ==> more than 5 continuous same color will yield n - 2 score of penalty

       mask_score1( pts ){
         var score = 0,
         len = pts.length,
         fn = bool => {
            for( var i = 0; i < len; i++ ){
               
               var last = ( bool ? pts[ 0 ][ i ] : pts[ i ][ 0 ] ).fill,
               count = 0;

               for( var j = 0; j < len; j++ ){
                  var cur = ( bool ? pts[ j ][ i ] : pts[ i ][ j ] ).fill,
                  allow = false;

                  if( cur == last ){
                     count++;

                     if( j + 1 == len ){
                        allow = true;
                     }
                  } else {
                     allow = true;
                  } 

                  if( allow ) {
                     if( count >= 5 ){
                        score += ( count - 2 );
                     }
                     count = 1;
                     last = cur;
                  }
               }
            }
         };

         fn();
         // vertical direction check
         fn( true );

         return score;
       }

       // rule 2 ==> 2 * 2 square will yield 3 score of penalty

       mask_score2( pts ){
         var score = 0,
         len = pts.length;

         for( var i = 0; i < len - 1; i++ ){
            var row = pts[ i ],
            next_row = pts[ i + 1 ];

            for( var j = 0; j < len - 1; j++ ){
               var col = row[ j ],
               next_col = row[ j + 1 ],
               bottom_col = next_row[ j ],
               bottom_next_col = next_row[ j + 1 ],
               fill = col.fill;

               if( fill == next_col.fill && bottom_col.fill == fill && bottom_next_col.fill == fill ){
                  score += 3;
               }
            }
         }

         return score;
       }

       // rule 3 ==> if any row or column matches the given pattern or its reverse add 40 penalty score

       mask_score3( pts ){
         var score = 0,
         len = pts.length,
         order = [ !0, !1, !0, !0, !0, !1, !0, !1, !1, !1, !1 ],
         reverse = order.slice().reverse(),
         fn = bool => {

            var match_fn = ( arr, row, col, x_fact, y_fact ) =>{
               for( var k = 0; k < 11; k++ ){
                  if( arr[ k ] != ( pts[ row + k * x_fact ][ col + k * y_fact ] ).fill ){
                     return;
                  }
               }

               score += 40;
            }

            for( var i = 0; i < len; i++ ){
               for( var j = 0; j < len - 11; j++ ){
                  var row,
                  col,
                  x_fact,
                  y_fact;

                  if( bool ){
                     row = j;
                     col = i;
                     x_fact = 1;
                     y_fact = 0;
                  } else {
                     row = i;
                     col = j;
                     x_fact = 0;
                     y_fact = 1;
                  }
                  
                  match_fn( order, row, col, x_fact, y_fact );
                  match_fn( reverse, row, col, x_fact, y_fact );

               }  
            }
         };

         fn();
         // vertical direction check
         fn( true );

         return score;
       }

       // rule 4 ==> find % of dark or light elements. if it exceeds 50% floor it to nearest value divisible by 5 or ceil it. Find the absolute diff to 50. double the value of the difference will be the penalty

       mask_score4( pts ){
         var dark_count = 0,
         percentage,
         len = pts.length;

         for( var i = 0; i < len; i++ ){
            var row = pts[ i ];
            for( var j = 0; j < len; j++ ){
               if( row[ j ].fill ){
                  dark_count++;
               }
            }
         }         

         percentage = dark_count * 100 / Math.pow( pts.length, 2 );

         return Math.abs( Math[ percentage > 50 ? "floor" : "ceil" ]( percentage / 5 ) * 5 - 50 ) * 2;
       }
   }

   if( window.$L ){
      $L.qr = function( ops ){
         return new LyteQr( ops );
      };
      $L.qr.class_instance = LyteQr;
   } else {
      window.LyteQr = LyteQr;
   }

})();
;( function(){
	var qr_class = window.LyteQr || $L.qr.class_instance,
	kanji_encoding_table = [
		"81 3f    　 、 。 ， ． ・ ： ； ？ ！ ゛ ゜ ´ ｀ ¨",
		"81 4f ＾ ￣ ＿ ヽ ヾ ゝ ゞ 〃 仝 々 〆 〇 ー ― ‐ ／",
		"81 5f ＼ ～ ∥ ｜ … ‥ ‘ ’ “ ” （ ） 〔 〕 ［ ］",
		"81 6f ｛ ｝ 〈 〉 《 》 「 」 『 』 【 】 ＋ － ± ×",
		"81 80 ÷ ＝ ≠ ＜ ＞ ≦ ≧ ∞ ∴ ♂ ♀ ° ′ ″ ℃ ￥",
		"81 90 ＄ ￠ ￡ ％ ＃ ＆ ＊ ＠ § ☆ ★ ○ ● ◎ ◇",
		"81 9e    ◆ □ ■ △ ▲ ▽ ▼ ※ 〒 → ← ↑ ↓ 〓",
		"81 ae                               ∈ ∋ ⊆ ⊇ ⊂ ⊃",
		"81 be ∪ ∩                         ∧ ∨ ￢ ⇒ ⇔ ∀",
		"81 ce ∃                                  ∠ ⊥ ⌒ ∂",
		"81 de ∇ ≡ ≒ ≪ ≫ √ ∽ ∝ ∵ ∫ ∬",
		"81 ee       Å ‰ ♯ ♭ ♪ † ‡ ¶             ◯",
		"82 3f",
		"82 4f ０ １ ２ ３ ４ ５ ６ ７ ８ ９",
		"82 5f    Ａ Ｂ Ｃ Ｄ Ｅ Ｆ Ｇ Ｈ Ｉ Ｊ Ｋ Ｌ Ｍ Ｎ Ｏ",
		"82 6f Ｐ Ｑ Ｒ Ｓ Ｔ Ｕ Ｖ Ｗ Ｘ Ｙ Ｚ",
		"82 80    ａ ｂ ｃ ｄ ｅ ｆ ｇ ｈ ｉ ｊ ｋ ｌ ｍ ｎ ｏ",
		"82 90 ｐ ｑ ｒ ｓ ｔ ｕ ｖ ｗ ｘ ｙ ｚ",
		"82 9e    ぁ あ ぃ い ぅ う ぇ え ぉ お か が き ぎ く",
		"82 ae ぐ け げ こ ご さ ざ し じ す ず せ ぜ そ ぞ た",
		"82 be だ ち ぢ っ つ づ て で と ど な に ぬ ね の は",
		"82 ce ば ぱ ひ び ぴ ふ ぶ ぷ へ べ ぺ ほ ぼ ぽ ま み",
		"82 de む め も ゃ や ゅ ゆ ょ よ ら り る れ ろ ゎ わ",
		"82 ee ゐ ゑ を ん",
		"83 3f    ァ ア ィ イ ゥ ウ ェ エ ォ オ カ ガ キ ギ ク",
		"83 4f グ ケ ゲ コ ゴ サ ザ シ ジ ス ズ セ ゼ ソ ゾ タ",
		"83 5f ダ チ ヂ ッ ツ ヅ テ デ ト ド ナ ニ ヌ ネ ノ ハ",
		"83 6f バ パ ヒ ビ ピ フ ブ プ ヘ ベ ペ ホ ボ ポ マ ミ",
		"83 80 ム メ モ ャ ヤ ュ ユ ョ ヨ ラ リ ル レ ロ ヮ ワ",
		"83 90 ヰ ヱ ヲ ン ヴ ヵ ヶ",
		"83 9e    Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο",
		"83 ae Π Ρ Σ Τ Υ Φ Χ Ψ Ω",
		"83 be    α β γ δ ε ζ η θ ι κ λ μ ν ξ ο",
		"83 ce π ρ σ τ υ φ χ ψ ω",
		"83 de",
		"83 ee",
		"84 3f    А Б В Г Д Е Ё Ж З И Й К Л М Н",
		"84 4f О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э",
		"84 5f Ю Я",
		"84 6f    а б в г д е ё ж з и й к л м н",
		"84 80 о п р с т у ф х ц ч ш щ ъ ы ь э",
		"84 90 ю я",
		"84 9e    ─ │ ┌ ┐ ┘ └ ├ ┬ ┤ ┴ ┼ ━ ┃ ┏ ┓",
		"84 ae ┛ ┗ ┣ ┳ ┫ ┻ ╋ ┠ ┯ ┨ ┷ ┿ ┝ ┰ ┥ ┸",
		"84 be ╂",
		"87 3f    ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮",
		"87 4f ⑯ ⑰ ⑱ ⑲ ⑳ Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ",
		"87 5f ㍉ ㌔ ㌢ ㍍ ㌘ ㌧ ㌃ ㌶ ㍑ ㍗ ㌍ ㌦ ㌣ ㌫ ㍊ ㌻",
		"87 6f ㎜ ㎝ ㎞ ㎎ ㎏ ㏄ ㎡                         ㍻",
		"87 80 〝 〟 № ㏍ ℡ ㊤ ㊥ ㊦ ㊧ ㊨ ㈱ ㈲ ㈹ ㍾ ㍽ ㍼",
		"87 90 ≒ ≡ ∫ ∮ ∑ √ ⊥ ∠ ∟ ⊿ ∵ ∩ ∪",
		"88 9e    亜 唖 娃 阿 哀 愛 挨 姶 逢 葵 茜 穐 悪 握 渥",
		"88 ae 旭 葦 芦 鯵 梓 圧 斡 扱 宛 姐 虻 飴 絢 綾 鮎 或",
		"88 be 粟 袷 安 庵 按 暗 案 闇 鞍 杏 以 伊 位 依 偉 囲",
		"88 ce 夷 委 威 尉 惟 意 慰 易 椅 為 畏 異 移 維 緯 胃",
		"88 de 萎 衣 謂 違 遺 医 井 亥 域 育 郁 磯 一 壱 溢 逸",
		"88 ee 稲 茨 芋 鰯 允 印 咽 員 因 姻 引 飲 淫 胤 蔭",
		"89 3f    院 陰 隠 韻 吋 右 宇 烏 羽 迂 雨 卯 鵜 窺 丑",
		"89 4f 碓 臼 渦 嘘 唄 欝 蔚 鰻 姥 厩 浦 瓜 閏 噂 云 運",
		"89 5f 雲 荏 餌 叡 営 嬰 影 映 曳 栄 永 泳 洩 瑛 盈 穎",
		"89 6f 頴 英 衛 詠 鋭 液 疫 益 駅 悦 謁 越 閲 榎 厭 円",
		"89 80 園 堰 奄 宴 延 怨 掩 援 沿 演 炎 焔 煙 燕 猿 縁",
		"89 90 艶 苑 薗 遠 鉛 鴛 塩 於 汚 甥 凹 央 奥 往 応",
		"89 9e    押 旺 横 欧 殴 王 翁 襖 鴬 鴎 黄 岡 沖 荻 億",
		"89 ae 屋 憶 臆 桶 牡 乙 俺 卸 恩 温 穏 音 下 化 仮 何",
		"89 be 伽 価 佳 加 可 嘉 夏 嫁 家 寡 科 暇 果 架 歌 河",
		"89 ce 火 珂 禍 禾 稼 箇 花 苛 茄 荷 華 菓 蝦 課 嘩 貨",
		"89 de 迦 過 霞 蚊 俄 峨 我 牙 画 臥 芽 蛾 賀 雅 餓 駕",
		"89 ee 介 会 解 回 塊 壊 廻 快 怪 悔 恢 懐 戒 拐 改",
		"8a 3f    魁 晦 械 海 灰 界 皆 絵 芥 蟹 開 階 貝 凱 劾",
		"8a 4f 外 咳 害 崖 慨 概 涯 碍 蓋 街 該 鎧 骸 浬 馨 蛙",
		"8a 5f 垣 柿 蛎 鈎 劃 嚇 各 廓 拡 撹 格 核 殻 獲 確 穫",
		"8a 6f 覚 角 赫 較 郭 閣 隔 革 学 岳 楽 額 顎 掛 笠 樫",
		"8a 80 橿 梶 鰍 潟 割 喝 恰 括 活 渇 滑 葛 褐 轄 且 鰹",
		"8a 90 叶 椛 樺 鞄 株 兜 竃 蒲 釜 鎌 噛 鴨 栢 茅 萱",
		"8a 9e    粥 刈 苅 瓦 乾 侃 冠 寒 刊 勘 勧 巻 喚 堪 姦",
		"8a ae 完 官 寛 干 幹 患 感 慣 憾 換 敢 柑 桓 棺 款 歓",
		"8a be 汗 漢 澗 潅 環 甘 監 看 竿 管 簡 緩 缶 翰 肝 艦",
		"8a ce 莞 観 諌 貫 還 鑑 間 閑 関 陥 韓 館 舘 丸 含 岸",
		"8a de 巌 玩 癌 眼 岩 翫 贋 雁 頑 顔 願 企 伎 危 喜 器",
		"8a ee 基 奇 嬉 寄 岐 希 幾 忌 揮 机 旗 既 期 棋 棄",
		"8b 3f    機 帰 毅 気 汽 畿 祈 季 稀 紀 徽 規 記 貴 起",
		"8b 4f 軌 輝 飢 騎 鬼 亀 偽 儀 妓 宜 戯 技 擬 欺 犠 疑",
		"8b 5f 祇 義 蟻 誼 議 掬 菊 鞠 吉 吃 喫 桔 橘 詰 砧 杵",
		"8b 6f 黍 却 客 脚 虐 逆 丘 久 仇 休 及 吸 宮 弓 急 救",
		"8b 80 朽 求 汲 泣 灸 球 究 窮 笈 級 糾 給 旧 牛 去 居",
		"8b 90 巨 拒 拠 挙 渠 虚 許 距 鋸 漁 禦 魚 亨 享 京",
		"8b 9e    供 侠 僑 兇 競 共 凶 協 匡 卿 叫 喬 境 峡 強",
		"8b ae 彊 怯 恐 恭 挟 教 橋 況 狂 狭 矯 胸 脅 興 蕎 郷",
		"8b be 鏡 響 饗 驚 仰 凝 尭 暁 業 局 曲 極 玉 桐 粁 僅",
		"8b ce 勤 均 巾 錦 斤 欣 欽 琴 禁 禽 筋 緊 芹 菌 衿 襟",
		"8b de 謹 近 金 吟 銀 九 倶 句 区 狗 玖 矩 苦 躯 駆 駈",
		"8b ee 駒 具 愚 虞 喰 空 偶 寓 遇 隅 串 櫛 釧 屑 屈",
		"8c 3f    掘 窟 沓 靴 轡 窪 熊 隈 粂 栗 繰 桑 鍬 勲 君",
		"8c 4f 薫 訓 群 軍 郡 卦 袈 祁 係 傾 刑 兄 啓 圭 珪 型",
		"8c 5f 契 形 径 恵 慶 慧 憩 掲 携 敬 景 桂 渓 畦 稽 系",
		"8c 6f 経 継 繋 罫 茎 荊 蛍 計 詣 警 軽 頚 鶏 芸 迎 鯨",
		"8c 80 劇 戟 撃 激 隙 桁 傑 欠 決 潔 穴 結 血 訣 月 件",
		"8c 90 倹 倦 健 兼 券 剣 喧 圏 堅 嫌 建 憲 懸 拳 捲",
		"8c 9e    検 権 牽 犬 献 研 硯 絹 県 肩 見 謙 賢 軒 遣",
		"8c ae 鍵 険 顕 験 鹸 元 原 厳 幻 弦 減 源 玄 現 絃 舷",
		"8c be 言 諺 限 乎 個 古 呼 固 姑 孤 己 庫 弧 戸 故 枯",
		"8c ce 湖 狐 糊 袴 股 胡 菰 虎 誇 跨 鈷 雇 顧 鼓 五 互",
		"8c de 伍 午 呉 吾 娯 後 御 悟 梧 檎 瑚 碁 語 誤 護 醐",
		"8c ee 乞 鯉 交 佼 侯 候 倖 光 公 功 効 勾 厚 口 向",
		"8d 3f    后 喉 坑 垢 好 孔 孝 宏 工 巧 巷 幸 広 庚 康",
		"8d 4f 弘 恒 慌 抗 拘 控 攻 昂 晃 更 杭 校 梗 構 江 洪",
		"8d 5f 浩 港 溝 甲 皇 硬 稿 糠 紅 紘 絞 綱 耕 考 肯 肱",
		"8d 6f 腔 膏 航 荒 行 衡 講 貢 購 郊 酵 鉱 砿 鋼 閤 降",
		"8d 80 項 香 高 鴻 剛 劫 号 合 壕 拷 濠 豪 轟 麹 克 刻",
		"8d 90 告 国 穀 酷 鵠 黒 獄 漉 腰 甑 忽 惚 骨 狛 込",
		"8d 9e    此 頃 今 困 坤 墾 婚 恨 懇 昏 昆 根 梱 混 痕",
		"8d ae 紺 艮 魂 些 佐 叉 唆 嵯 左 差 査 沙 瑳 砂 詐 鎖",
		"8d be 裟 坐 座 挫 債 催 再 最 哉 塞 妻 宰 彩 才 採 栽",
		"8d ce 歳 済 災 采 犀 砕 砦 祭 斎 細 菜 裁 載 際 剤 在",
		"8d de 材 罪 財 冴 坂 阪 堺 榊 肴 咲 崎 埼 碕 鷺 作 削",
		"8d ee 咋 搾 昨 朔 柵 窄 策 索 錯 桜 鮭 笹 匙 冊 刷",
		"8e 3f    察 拶 撮 擦 札 殺 薩 雑 皐 鯖 捌 錆 鮫 皿 晒",
		"8e 4f 三 傘 参 山 惨 撒 散 桟 燦 珊 産 算 纂 蚕 讃 賛",
		"8e 5f 酸 餐 斬 暫 残 仕 仔 伺 使 刺 司 史 嗣 四 士 始",
		"8e 6f 姉 姿 子 屍 市 師 志 思 指 支 孜 斯 施 旨 枝 止",
		"8e 80 死 氏 獅 祉 私 糸 紙 紫 肢 脂 至 視 詞 詩 試 誌",
		"8e 90 諮 資 賜 雌 飼 歯 事 似 侍 児 字 寺 慈 持 時",
		"8e 9e    次 滋 治 爾 璽 痔 磁 示 而 耳 自 蒔 辞 汐 鹿",
		"8e ae 式 識 鴫 竺 軸 宍 雫 七 叱 執 失 嫉 室 悉 湿 漆",
		"8e be 疾 質 実 蔀 篠 偲 柴 芝 屡 蕊 縞 舎 写 射 捨 赦",
		"8e ce 斜 煮 社 紗 者 謝 車 遮 蛇 邪 借 勺 尺 杓 灼 爵",
		"8e de 酌 釈 錫 若 寂 弱 惹 主 取 守 手 朱 殊 狩 珠 種",
		"8e ee 腫 趣 酒 首 儒 受 呪 寿 授 樹 綬 需 囚 収 周",
		"8f 3f    宗 就 州 修 愁 拾 洲 秀 秋 終 繍 習 臭 舟 蒐",
		"8f 4f 衆 襲 讐 蹴 輯 週 酋 酬 集 醜 什 住 充 十 従 戎",
		"8f 5f 柔 汁 渋 獣 縦 重 銃 叔 夙 宿 淑 祝 縮 粛 塾 熟",
		"8f 6f 出 術 述 俊 峻 春 瞬 竣 舜 駿 准 循 旬 楯 殉 淳",
		"8f 80 準 潤 盾 純 巡 遵 醇 順 処 初 所 暑 曙 渚 庶 緒",
		"8f 90 署 書 薯 藷 諸 助 叙 女 序 徐 恕 鋤 除 傷 償",
		"8f 9e    勝 匠 升 召 哨 商 唱 嘗 奨 妾 娼 宵 将 小 少",
		"8f ae 尚 庄 床 廠 彰 承 抄 招 掌 捷 昇 昌 昭 晶 松 梢",
		"8f be 樟 樵 沼 消 渉 湘 焼 焦 照 症 省 硝 礁 祥 称 章",
		"8f ce 笑 粧 紹 肖 菖 蒋 蕉 衝 裳 訟 証 詔 詳 象 賞 醤",
		"8f de 鉦 鍾 鐘 障 鞘 上 丈 丞 乗 冗 剰 城 場 壌 嬢 常",
		"8f ee 情 擾 条 杖 浄 状 畳 穣 蒸 譲 醸 錠 嘱 埴 飾",
		"90 3f    拭 植 殖 燭 織 職 色 触 食 蝕 辱 尻 伸 信 侵",
		"90 4f 唇 娠 寝 審 心 慎 振 新 晋 森 榛 浸 深 申 疹 真",
		"90 5f 神 秦 紳 臣 芯 薪 親 診 身 辛 進 針 震 人 仁 刃",
		"90 6f 塵 壬 尋 甚 尽 腎 訊 迅 陣 靭 笥 諏 須 酢 図 厨",
		"90 80 逗 吹 垂 帥 推 水 炊 睡 粋 翠 衰 遂 酔 錐 錘 随",
		"90 90 瑞 髄 崇 嵩 数 枢 趨 雛 据 杉 椙 菅 頗 雀 裾",
		"90 9e    澄 摺 寸 世 瀬 畝 是 凄 制 勢 姓 征 性 成 政",
		"90 ae 整 星 晴 棲 栖 正 清 牲 生 盛 精 聖 声 製 西 誠",
		"90 be 誓 請 逝 醒 青 静 斉 税 脆 隻 席 惜 戚 斥 昔 析",
		"90 ce 石 積 籍 績 脊 責 赤 跡 蹟 碩 切 拙 接 摂 折 設",
		"90 de 窃 節 説 雪 絶 舌 蝉 仙 先 千 占 宣 専 尖 川 戦",
		"90 ee 扇 撰 栓 栴 泉 浅 洗 染 潜 煎 煽 旋 穿 箭 線",
		"91 3f    繊 羨 腺 舛 船 薦 詮 賎 践 選 遷 銭 銑 閃 鮮",
		"91 4f 前 善 漸 然 全 禅 繕 膳 糎 噌 塑 岨 措 曾 曽 楚",
		"91 5f 狙 疏 疎 礎 祖 租 粗 素 組 蘇 訴 阻 遡 鼠 僧 創",
		"91 6f 双 叢 倉 喪 壮 奏 爽 宋 層 匝 惣 想 捜 掃 挿 掻",
		"91 80 操 早 曹 巣 槍 槽 漕 燥 争 痩 相 窓 糟 総 綜 聡",
		"91 90 草 荘 葬 蒼 藻 装 走 送 遭 鎗 霜 騒 像 増 憎",
		"91 9e    臓 蔵 贈 造 促 側 則 即 息 捉 束 測 足 速 俗",
		"91 ae 属 賊 族 続 卒 袖 其 揃 存 孫 尊 損 村 遜 他 多",
		"91 be 太 汰 詑 唾 堕 妥 惰 打 柁 舵 楕 陀 駄 騨 体 堆",
		"91 ce 対 耐 岱 帯 待 怠 態 戴 替 泰 滞 胎 腿 苔 袋 貸",
		"91 de 退 逮 隊 黛 鯛 代 台 大 第 醍 題 鷹 滝 瀧 卓 啄",
		"91 ee 宅 托 択 拓 沢 濯 琢 託 鐸 濁 諾 茸 凧 蛸 只",
		"92 3f    叩 但 達 辰 奪 脱 巽 竪 辿 棚 谷 狸 鱈 樽 誰",
		"92 4f 丹 単 嘆 坦 担 探 旦 歎 淡 湛 炭 短 端 箪 綻 耽",
		"92 5f 胆 蛋 誕 鍛 団 壇 弾 断 暖 檀 段 男 談 値 知 地",
		"92 6f 弛 恥 智 池 痴 稚 置 致 蜘 遅 馳 築 畜 竹 筑 蓄",
		"92 80 逐 秩 窒 茶 嫡 着 中 仲 宙 忠 抽 昼 柱 注 虫 衷",
		"92 90 註 酎 鋳 駐 樗 瀦 猪 苧 著 貯 丁 兆 凋 喋 寵",
		"92 9e    帖 帳 庁 弔 張 彫 徴 懲 挑 暢 朝 潮 牒 町 眺",
		"92 ae 聴 脹 腸 蝶 調 諜 超 跳 銚 長 頂 鳥 勅 捗 直 朕",
		"92 be 沈 珍 賃 鎮 陳 津 墜 椎 槌 追 鎚 痛 通 塚 栂 掴",
		"92 ce 槻 佃 漬 柘 辻 蔦 綴 鍔 椿 潰 坪 壷 嬬 紬 爪 吊",
		"92 de 釣 鶴 亭 低 停 偵 剃 貞 呈 堤 定 帝 底 庭 廷 弟",
		"92 ee 悌 抵 挺 提 梯 汀 碇 禎 程 締 艇 訂 諦 蹄 逓",
		"93 3f    邸 鄭 釘 鼎 泥 摘 擢 敵 滴 的 笛 適 鏑 溺 哲",
		"93 4f 徹 撤 轍 迭 鉄 典 填 天 展 店 添 纏 甜 貼 転 顛",
		"93 5f 点 伝 殿 澱 田 電 兎 吐 堵 塗 妬 屠 徒 斗 杜 渡",
		"93 6f 登 菟 賭 途 都 鍍 砥 砺 努 度 土 奴 怒 倒 党 冬",
		"93 80 凍 刀 唐 塔 塘 套 宕 島 嶋 悼 投 搭 東 桃 梼 棟",
		"93 90 盗 淘 湯 涛 灯 燈 当 痘 祷 等 答 筒 糖 統 到",
		"93 9e    董 蕩 藤 討 謄 豆 踏 逃 透 鐙 陶 頭 騰 闘 働",
		"93 ae 動 同 堂 導 憧 撞 洞 瞳 童 胴 萄 道 銅 峠 鴇 匿",
		"93 be 得 徳 涜 特 督 禿 篤 毒 独 読 栃 橡 凸 突 椴 届",
		"93 ce 鳶 苫 寅 酉 瀞 噸 屯 惇 敦 沌 豚 遁 頓 呑 曇 鈍",
		"93 de 奈 那 内 乍 凪 薙 謎 灘 捺 鍋 楢 馴 縄 畷 南 楠",
		"93 ee 軟 難 汝 二 尼 弐 迩 匂 賑 肉 虹 廿 日 乳 入",
		"94 3f    如 尿 韮 任 妊 忍 認 濡 禰 祢 寧 葱 猫 熱 年",
		"94 4f 念 捻 撚 燃 粘 乃 廼 之 埜 嚢 悩 濃 納 能 脳 膿",
		"94 5f 農 覗 蚤 巴 把 播 覇 杷 波 派 琶 破 婆 罵 芭 馬",
		"94 6f 俳 廃 拝 排 敗 杯 盃 牌 背 肺 輩 配 倍 培 媒 梅",
		"94 80 楳 煤 狽 買 売 賠 陪 這 蝿 秤 矧 萩 伯 剥 博 拍",
		"94 90 柏 泊 白 箔 粕 舶 薄 迫 曝 漠 爆 縛 莫 駁 麦",
		"94 9e    函 箱 硲 箸 肇 筈 櫨 幡 肌 畑 畠 八 鉢 溌 発",
		"94 ae 醗 髪 伐 罰 抜 筏 閥 鳩 噺 塙 蛤 隼 伴 判 半 反",
		"94 be 叛 帆 搬 斑 板 氾 汎 版 犯 班 畔 繁 般 藩 販 範",
		"94 ce 釆 煩 頒 飯 挽 晩 番 盤 磐 蕃 蛮 匪 卑 否 妃 庇",
		"94 de 彼 悲 扉 批 披 斐 比 泌 疲 皮 碑 秘 緋 罷 肥 被",
		"94 ee 誹 費 避 非 飛 樋 簸 備 尾 微 枇 毘 琵 眉 美",
		"95 3f    鼻 柊 稗 匹 疋 髭 彦 膝 菱 肘 弼 必 畢 筆 逼",
		"95 4f 桧 姫 媛 紐 百 謬 俵 彪 標 氷 漂 瓢 票 表 評 豹",
		"95 5f 廟 描 病 秒 苗 錨 鋲 蒜 蛭 鰭 品 彬 斌 浜 瀕 貧",
		"95 6f 賓 頻 敏 瓶 不 付 埠 夫 婦 富 冨 布 府 怖 扶 敷",
		"95 80 斧 普 浮 父 符 腐 膚 芙 譜 負 賦 赴 阜 附 侮 撫",
		"95 90 武 舞 葡 蕪 部 封 楓 風 葺 蕗 伏 副 復 幅 服",
		"95 9e    福 腹 複 覆 淵 弗 払 沸 仏 物 鮒 分 吻 噴 墳",
		"95 ae 憤 扮 焚 奮 粉 糞 紛 雰 文 聞 丙 併 兵 塀 幣 平",
		"95 be 弊 柄 並 蔽 閉 陛 米 頁 僻 壁 癖 碧 別 瞥 蔑 箆",
		"95 ce 偏 変 片 篇 編 辺 返 遍 便 勉 娩 弁 鞭 保 舗 鋪",
		"95 de 圃 捕 歩 甫 補 輔 穂 募 墓 慕 戊 暮 母 簿 菩 倣",
		"95 ee 俸 包 呆 報 奉 宝 峰 峯 崩 庖 抱 捧 放 方 朋",
		"96 3f    法 泡 烹 砲 縫 胞 芳 萌 蓬 蜂 褒 訪 豊 邦 鋒",
		"96 4f 飽 鳳 鵬 乏 亡 傍 剖 坊 妨 帽 忘 忙 房 暴 望 某",
		"96 5f 棒 冒 紡 肪 膨 謀 貌 貿 鉾 防 吠 頬 北 僕 卜 墨",
		"96 6f 撲 朴 牧 睦 穆 釦 勃 没 殆 堀 幌 奔 本 翻 凡 盆",
		"96 80 摩 磨 魔 麻 埋 妹 昧 枚 毎 哩 槙 幕 膜 枕 鮪 柾",
		"96 90 鱒 桝 亦 俣 又 抹 末 沫 迄 侭 繭 麿 万 慢 満",
		"96 9e    漫 蔓 味 未 魅 巳 箕 岬 密 蜜 湊 蓑 稔 脈 妙",
		"96 ae 粍 民 眠 務 夢 無 牟 矛 霧 鵡 椋 婿 娘 冥 名 命",
		"96 be 明 盟 迷 銘 鳴 姪 牝 滅 免 棉 綿 緬 面 麺 摸 模",
		"96 ce 茂 妄 孟 毛 猛 盲 網 耗 蒙 儲 木 黙 目 杢 勿 餅",
		"96 de 尤 戻 籾 貰 問 悶 紋 門 匁 也 冶 夜 爺 耶 野 弥",
		"96 ee 矢 厄 役 約 薬 訳 躍 靖 柳 薮 鑓 愉 愈 油 癒",
		"97 3f    諭 輸 唯 佑 優 勇 友 宥 幽 悠 憂 揖 有 柚 湧",
		"97 4f 涌 猶 猷 由 祐 裕 誘 遊 邑 郵 雄 融 夕 予 余 与",
		"97 5f 誉 輿 預 傭 幼 妖 容 庸 揚 揺 擁 曜 楊 様 洋 溶",
		"97 6f 熔 用 窯 羊 耀 葉 蓉 要 謡 踊 遥 陽 養 慾 抑 欲",
		"97 80 沃 浴 翌 翼 淀 羅 螺 裸 来 莱 頼 雷 洛 絡 落 酪",
		"97 90 乱 卵 嵐 欄 濫 藍 蘭 覧 利 吏 履 李 梨 理 璃",
		"97 9e    痢 裏 裡 里 離 陸 律 率 立 葎 掠 略 劉 流 溜",
		"97 ae 琉 留 硫 粒 隆 竜 龍 侶 慮 旅 虜 了 亮 僚 両 凌",
		"97 be 寮 料 梁 涼 猟 療 瞭 稜 糧 良 諒 遼 量 陵 領 力",
		"97 ce 緑 倫 厘 林 淋 燐 琳 臨 輪 隣 鱗 麟 瑠 塁 涙 累",
		"97 de 類 令 伶 例 冷 励 嶺 怜 玲 礼 苓 鈴 隷 零 霊 麗",
		"97 ee 齢 暦 歴 列 劣 烈 裂 廉 恋 憐 漣 煉 簾 練 聯",
		"98 3f    蓮 連 錬 呂 魯 櫓 炉 賂 路 露 労 婁 廊 弄 朗",
		"98 4f 楼 榔 浪 漏 牢 狼 篭 老 聾 蝋 郎 六 麓 禄 肋 録",
		"98 5f 論 倭 和 話 歪 賄 脇 惑 枠 鷲 亙 亘 鰐 詫 藁 蕨",
		"98 6f 椀 湾 碗 腕",
		"98 80",
		"98 90",
		"98 9e    弌 丐 丕 个 丱 丶 丼 丿 乂 乖 乘 亂 亅 豫 亊",
		"98 ae 舒 弍 于 亞 亟 亠 亢 亰 亳 亶 从 仍 仄 仆 仂 仗",
		"98 be 仞 仭 仟 价 伉 佚 估 佛 佝 佗 佇 佶 侈 侏 侘 佻",
		"98 ce 佩 佰 侑 佯 來 侖 儘 俔 俟 俎 俘 俛 俑 俚 俐 俤",
		"98 de 俥 倚 倨 倔 倪 倥 倅 伜 俶 倡 倩 倬 俾 俯 們 倆",
		"98 ee 偃 假 會 偕 偐 偈 做 偖 偬 偸 傀 傚 傅 傴 傲",
		"99 3f    僉 僊 傳 僂 僖 僞 僥 僭 僣 僮 價 僵 儉 儁 儂",
		"99 4f 儖 儕 儔 儚 儡 儺 儷 儼 儻 儿 兀 兒 兌 兔 兢 竸",
		"99 5f 兩 兪 兮 冀 冂 囘 册 冉 冏 冑 冓 冕 冖 冤 冦 冢",
		"99 6f 冩 冪 冫 决 冱 冲 冰 况 冽 凅 凉 凛 几 處 凩 凭",
		"99 80 凰 凵 凾 刄 刋 刔 刎 刧 刪 刮 刳 刹 剏 剄 剋 剌",
		"99 90 剞 剔 剪 剴 剩 剳 剿 剽 劍 劔 劒 剱 劈 劑 辨",
		"99 9e    辧 劬 劭 劼 劵 勁 勍 勗 勞 勣 勦 飭 勠 勳 勵",
		"99 ae 勸 勹 匆 匈 甸 匍 匐 匏 匕 匚 匣 匯 匱 匳 匸 區",
		"99 be 卆 卅 丗 卉 卍 凖 卞 卩 卮 夘 卻 卷 厂 厖 厠 厦",
		"99 ce 厥 厮 厰 厶 參 簒 雙 叟 曼 燮 叮 叨 叭 叺 吁 吽",
		"99 de 呀 听 吭 吼 吮 吶 吩 吝 呎 咏 呵 咎 呟 呱 呷 呰",
		"99 ee 咒 呻 咀 呶 咄 咐 咆 哇 咢 咸 咥 咬 哄 哈 咨",
		"9a 3f    咫 哂 咤 咾 咼 哘 哥 哦 唏 唔 哽 哮 哭 哺 哢",
		"9a 4f 唹 啀 啣 啌 售 啜 啅 啖 啗 唸 唳 啝 喙 喀 咯 喊",
		"9a 5f 喟 啻 啾 喘 喞 單 啼 喃 喩 喇 喨 嗚 嗅 嗟 嗄 嗜",
		"9a 6f 嗤 嗔 嘔 嗷 嘖 嗾 嗽 嘛 嗹 噎 噐 營 嘴 嘶 嘲 嘸",
		"9a 80 噫 噤 嘯 噬 噪 嚆 嚀 嚊 嚠 嚔 嚏 嚥 嚮 嚶 嚴 囂",
		"9a 90 嚼 囁 囃 囀 囈 囎 囑 囓 囗 囮 囹 圀 囿 圄 圉",
		"9a 9e    圈 國 圍 圓 團 圖 嗇 圜 圦 圷 圸 坎 圻 址 坏",
		"9a ae 坩 埀 垈 坡 坿 垉 垓 垠 垳 垤 垪 垰 埃 埆 埔 埒",
		"9a be 埓 堊 埖 埣 堋 堙 堝 塲 堡 塢 塋 塰 毀 塒 堽 塹",
		"9a ce 墅 墹 墟 墫 墺 壞 墻 墸 墮 壅 壓 壑 壗 壙 壘 壥",
		"9a de 壜 壤 壟 壯 壺 壹 壻 壼 壽 夂 夊 夐 夛 梦 夥 夬",
		"9a ee 夭 夲 夸 夾 竒 奕 奐 奎 奚 奘 奢 奠 奧 奬 奩",
		"9b 3f    奸 妁 妝 佞 侫 妣 妲 姆 姨 姜 妍 姙 姚 娥 娟",
		"9b 4f 娑 娜 娉 娚 婀 婬 婉 娵 娶 婢 婪 媚 媼 媾 嫋 嫂",
		"9b 5f 媽 嫣 嫗 嫦 嫩 嫖 嫺 嫻 嬌 嬋 嬖 嬲 嫐 嬪 嬶 嬾",
		"9b 6f 孃 孅 孀 孑 孕 孚 孛 孥 孩 孰 孳 孵 學 斈 孺 宀",
		"9b 80 它 宦 宸 寃 寇 寉 寔 寐 寤 實 寢 寞 寥 寫 寰 寶",
		"9b 90 寳 尅 將 專 對 尓 尠 尢 尨 尸 尹 屁 屆 屎 屓",
		"9b 9e    屐 屏 孱 屬 屮 乢 屶 屹 岌 岑 岔 妛 岫 岻 岶",
		"9b ae 岼 岷 峅 岾 峇 峙 峩 峽 峺 峭 嶌 峪 崋 崕 崗 嵜",
		"9b be 崟 崛 崑 崔 崢 崚 崙 崘 嵌 嵒 嵎 嵋 嵬 嵳 嵶 嶇",
		"9b ce 嶄 嶂 嶢 嶝 嶬 嶮 嶽 嶐 嶷 嶼 巉 巍 巓 巒 巖 巛",
		"9b de 巫 已 巵 帋 帚 帙 帑 帛 帶 帷 幄 幃 幀 幎 幗 幔",
		"9b ee 幟 幢 幤 幇 幵 并 幺 麼 广 庠 廁 廂 廈 廐 廏",
		"9c 3f    廖 廣 廝 廚 廛 廢 廡 廨 廩 廬 廱 廳 廰 廴 廸",
		"9c 4f 廾 弃 弉 彝 彜 弋 弑 弖 弩 弭 弸 彁 彈 彌 彎 弯",
		"9c 5f 彑 彖 彗 彙 彡 彭 彳 彷 徃 徂 彿 徊 很 徑 徇 從",
		"9c 6f 徙 徘 徠 徨 徭 徼 忖 忻 忤 忸 忱 忝 悳 忿 怡 恠",
		"9c 80 怙 怐 怩 怎 怱 怛 怕 怫 怦 怏 怺 恚 恁 恪 恷 恟",
		"9c 90 恊 恆 恍 恣 恃 恤 恂 恬 恫 恙 悁 悍 惧 悃 悚",
		"9c 9e    悄 悛 悖 悗 悒 悧 悋 惡 悸 惠 惓 悴 忰 悽 惆",
		"9c ae 悵 惘 慍 愕 愆 惶 惷 愀 惴 惺 愃 愡 惻 惱 愍 愎",
		"9c be 慇 愾 愨 愧 慊 愿 愼 愬 愴 愽 慂 慄 慳 慷 慘 慙",
		"9c ce 慚 慫 慴 慯 慥 慱 慟 慝 慓 慵 憙 憖 憇 憬 憔 憚",
		"9c de 憊 憑 憫 憮 懌 懊 應 懷 懈 懃 懆 憺 懋 罹 懍 懦",
		"9c ee 懣 懶 懺 懴 懿 懽 懼 懾 戀 戈 戉 戍 戌 戔 戛",
		"9d 3f    戞 戡 截 戮 戰 戲 戳 扁 扎 扞 扣 扛 扠 扨 扼",
		"9d 4f 抂 抉 找 抒 抓 抖 拔 抃 抔 拗 拑 抻 拏 拿 拆 擔",
		"9d 5f 拈 拜 拌 拊 拂 拇 抛 拉 挌 拮 拱 挧 挂 挈 拯 拵",
		"9d 6f 捐 挾 捍 搜 捏 掖 掎 掀 掫 捶 掣 掏 掉 掟 掵 捫",
		"9d 80 捩 掾 揩 揀 揆 揣 揉 插 揶 揄 搖 搴 搆 搓 搦 搶",
		"9d 90 攝 搗 搨 搏 摧 摯 摶 摎 攪 撕 撓 撥 撩 撈 撼",
		"9d 9e    據 擒 擅 擇 撻 擘 擂 擱 擧 舉 擠 擡 抬 擣 擯",
		"9d ae 攬 擶 擴 擲 擺 攀 擽 攘 攜 攅 攤 攣 攫 攴 攵 攷",
		"9d be 收 攸 畋 效 敖 敕 敍 敘 敞 敝 敲 數 斂 斃 變 斛",
		"9d ce 斟 斫 斷 旃 旆 旁 旄 旌 旒 旛 旙 无 旡 旱 杲 昊",
		"9d de 昃 旻 杳 昵 昶 昴 昜 晏 晄 晉 晁 晞 晝 晤 晧 晨",
		"9d ee 晟 晢 晰 暃 暈 暎 暉 暄 暘 暝 曁 暹 曉 暾 暼",
		"9e 3f    曄 暸 曖 曚 曠 昿 曦 曩 曰 曵 曷 朏 朖 朞 朦",
		"9e 4f 朧 霸 朮 朿 朶 杁 朸 朷 杆 杞 杠 杙 杣 杤 枉 杰",
		"9e 5f 枩 杼 杪 枌 枋 枦 枡 枅 枷 柯 枴 柬 枳 柩 枸 柤",
		"9e 6f 柞 柝 柢 柮 枹 柎 柆 柧 檜 栞 框 栩 桀 桍 栲 桎",
		"9e 80 梳 栫 桙 档 桷 桿 梟 梏 梭 梔 條 梛 梃 檮 梹 桴",
		"9e 90 梵 梠 梺 椏 梍 桾 椁 棊 椈 棘 椢 椦 棡 椌 棍",
		"9e 9e    棔 棧 棕 椶 椒 椄 棗 棣 椥 棹 棠 棯 椨 椪 椚",
		"9e ae 椣 椡 棆 楹 楷 楜 楸 楫 楔 楾 楮 椹 楴 椽 楙 椰",
		"9e be 楡 楞 楝 榁 楪 榲 榮 槐 榿 槁 槓 榾 槎 寨 槊 槝",
		"9e ce 榻 槃 榧 樮 榑 榠 榜 榕 榴 槞 槨 樂 樛 槿 權 槹",
		"9e de 槲 槧 樅 榱 樞 槭 樔 槫 樊 樒 櫁 樣 樓 橄 樌 橲",
		"9e ee 樶 橸 橇 橢 橙 橦 橈 樸 樢 檐 檍 檠 檄 檢 檣",
		"9f 3f    檗 蘗 檻 櫃 櫂 檸 檳 檬 櫞 櫑 櫟 檪 櫚 櫪 櫻",
		"9f 4f 欅 蘖 櫺 欒 欖 鬱 欟 欸 欷 盜 欹 飮 歇 歃 歉 歐",
		"9f 5f 歙 歔 歛 歟 歡 歸 歹 歿 殀 殄 殃 殍 殘 殕 殞 殤",
		"9f 6f 殪 殫 殯 殲 殱 殳 殷 殼 毆 毋 毓 毟 毬 毫 毳 毯",
		"9f 80 麾 氈 氓 气 氛 氤 氣 汞 汕 汢 汪 沂 沍 沚 沁 沛",
		"9f 90 汾 汨 汳 沒 沐 泄 泱 泓 沽 泗 泅 泝 沮 沱 沾",
		"9f 9e    沺 泛 泯 泙 泪 洟 衍 洶 洫 洽 洸 洙 洵 洳 洒",
		"9f ae 洌 浣 涓 浤 浚 浹 浙 涎 涕 濤 涅 淹 渕 渊 涵 淇",
		"9f be 淦 涸 淆 淬 淞 淌 淨 淒 淅 淺 淙 淤 淕 淪 淮 渭",
		"9f ce 湮 渮 渙 湲 湟 渾 渣 湫 渫 湶 湍 渟 湃 渺 湎 渤",
		"9f de 滿 渝 游 溂 溪 溘 滉 溷 滓 溽 溯 滄 溲 滔 滕 溏",
		"9f ee 溥 滂 溟 潁 漑 灌 滬 滸 滾 漿 滲 漱 滯 漲 滌",
		"e0 3f    漾 漓 滷 澆 潺 潸 澁 澀 潯 潛 濳 潭 澂 潼 潘",
		"e0 4f 澎 澑 濂 潦 澳 澣 澡 澤 澹 濆 澪 濟 濕 濬 濔 濘",
		"e0 5f 濱 濮 濛 瀉 瀋 濺 瀑 瀁 瀏 濾 瀛 瀚 潴 瀝 瀘 瀟",
		"e0 6f 瀰 瀾 瀲 灑 灣 炙 炒 炯 烱 炬 炸 炳 炮 烟 烋 烝",
		"e0 80 烙 焉 烽 焜 焙 煥 煕 熈 煦 煢 煌 煖 煬 熏 燻 熄",
		"e0 90 熕 熨 熬 燗 熹 熾 燒 燉 燔 燎 燠 燬 燧 燵 燼",
		"e0 9e    燹 燿 爍 爐 爛 爨 爭 爬 爰 爲 爻 爼 爿 牀 牆",
		"e0 ae 牋 牘 牴 牾 犂 犁 犇 犒 犖 犢 犧 犹 犲 狃 狆 狄",
		"e0 be 狎 狒 狢 狠 狡 狹 狷 倏 猗 猊 猜 猖 猝 猴 猯 猩",
		"e0 ce 猥 猾 獎 獏 默 獗 獪 獨 獰 獸 獵 獻 獺 珈 玳 珎",
		"e0 de 玻 珀 珥 珮 珞 璢 琅 瑯 琥 珸 琲 琺 瑕 琿 瑟 瑙",
		"e0 ee 瑁 瑜 瑩 瑰 瑣 瑪 瑶 瑾 璋 璞 璧 瓊 瓏 瓔 珱",
		"e1 3f    瓠 瓣 瓧 瓩 瓮 瓲 瓰 瓱 瓸 瓷 甄 甃 甅 甌 甎",
		"e1 4f 甍 甕 甓 甞 甦 甬 甼 畄 畍 畊 畉 畛 畆 畚 畩 畤",
		"e1 5f 畧 畫 畭 畸 當 疆 疇 畴 疊 疉 疂 疔 疚 疝 疥 疣",
		"e1 6f 痂 疳 痃 疵 疽 疸 疼 疱 痍 痊 痒 痙 痣 痞 痾 痿",
		"e1 80 痼 瘁 痰 痺 痲 痳 瘋 瘍 瘉 瘟 瘧 瘠 瘡 瘢 瘤 瘴",
		"e1 90 瘰 瘻 癇 癈 癆 癜 癘 癡 癢 癨 癩 癪 癧 癬 癰",
		"e1 9e    癲 癶 癸 發 皀 皃 皈 皋 皎 皖 皓 皙 皚 皰 皴",
		"e1 ae 皸 皹 皺 盂 盍 盖 盒 盞 盡 盥 盧 盪 蘯 盻 眈 眇",
		"e1 be 眄 眩 眤 眞 眥 眦 眛 眷 眸 睇 睚 睨 睫 睛 睥 睿",
		"e1 ce 睾 睹 瞎 瞋 瞑 瞠 瞞 瞰 瞶 瞹 瞿 瞼 瞽 瞻 矇 矍",
		"e1 de 矗 矚 矜 矣 矮 矼 砌 砒 礦 砠 礪 硅 碎 硴 碆 硼",
		"e1 ee 碚 碌 碣 碵 碪 碯 磑 磆 磋 磔 碾 碼 磅 磊 磬",
		"e2 3f    磧 磚 磽 磴 礇 礒 礑 礙 礬 礫 祀 祠 祗 祟 祚",
		"e2 4f 祕 祓 祺 祿 禊 禝 禧 齋 禪 禮 禳 禹 禺 秉 秕 秧",
		"e2 5f 秬 秡 秣 稈 稍 稘 稙 稠 稟 禀 稱 稻 稾 稷 穃 穗",
		"e2 6f 穉 穡 穢 穩 龝 穰 穹 穽 窈 窗 窕 窘 窖 窩 竈 窰",
		"e2 80 窶 竅 竄 窿 邃 竇 竊 竍 竏 竕 竓 站 竚 竝 竡 竢",
		"e2 90 竦 竭 竰 笂 笏 笊 笆 笳 笘 笙 笞 笵 笨 笶 筐",
		"e2 9e    筺 笄 筍 笋 筌 筅 筵 筥 筴 筧 筰 筱 筬 筮 箝",
		"e2 ae 箘 箟 箍 箜 箚 箋 箒 箏 筝 箙 篋 篁 篌 篏 箴 篆",
		"e2 be 篝 篩 簑 簔 篦 篥 籠 簀 簇 簓 篳 篷 簗 簍 篶 簣",
		"e2 ce 簧 簪 簟 簷 簫 簽 籌 籃 籔 籏 籀 籐 籘 籟 籤 籖",
		"e2 de 籥 籬 籵 粃 粐 粤 粭 粢 粫 粡 粨 粳 粲 粱 粮 粹",
		"e2 ee 粽 糀 糅 糂 糘 糒 糜 糢 鬻 糯 糲 糴 糶 糺 紆",
		"e3 3f    紂 紜 紕 紊 絅 絋 紮 紲 紿 紵 絆 絳 絖 絎 絲",
		"e3 4f 絨 絮 絏 絣 經 綉 絛 綏 絽 綛 綺 綮 綣 綵 緇 綽",
		"e3 5f 綫 總 綢 綯 緜 綸 綟 綰 緘 緝 緤 緞 緻 緲 緡 縅",
		"e3 6f 縊 縣 縡 縒 縱 縟 縉 縋 縢 繆 繦 縻 縵 縹 繃 縷",
		"e3 80 縲 縺 繧 繝 繖 繞 繙 繚 繹 繪 繩 繼 繻 纃 緕 繽",
		"e3 90 辮 繿 纈 纉 續 纒 纐 纓 纔 纖 纎 纛 纜 缸 缺",
		"e3 9e    罅 罌 罍 罎 罐 网 罕 罔 罘 罟 罠 罨 罩 罧 罸",
		"e3 ae 羂 羆 羃 羈 羇 羌 羔 羞 羝 羚 羣 羯 羲 羹 羮 羶",
		"e3 be 羸 譱 翅 翆 翊 翕 翔 翡 翦 翩 翳 翹 飜 耆 耄 耋",
		"e3 ce 耒 耘 耙 耜 耡 耨 耿 耻 聊 聆 聒 聘 聚 聟 聢 聨",
		"e3 de 聳 聲 聰 聶 聹 聽 聿 肄 肆 肅 肛 肓 肚 肭 冐 肬",
		"e3 ee 胛 胥 胙 胝 胄 胚 胖 脉 胯 胱 脛 脩 脣 脯 腋",
		"e4 3f    隋 腆 脾 腓 腑 胼 腱 腮 腥 腦 腴 膃 膈 膊 膀",
		"e4 4f 膂 膠 膕 膤 膣 腟 膓 膩 膰 膵 膾 膸 膽 臀 臂 膺",
		"e4 5f 臉 臍 臑 臙 臘 臈 臚 臟 臠 臧 臺 臻 臾 舁 舂 舅",
		"e4 6f 與 舊 舍 舐 舖 舩 舫 舸 舳 艀 艙 艘 艝 艚 艟 艤",
		"e4 80 艢 艨 艪 艫 舮 艱 艷 艸 艾 芍 芒 芫 芟 芻 芬 苡",
		"e4 90 苣 苟 苒 苴 苳 苺 莓 范 苻 苹 苞 茆 苜 茉 苙",
		"e4 9e    茵 茴 茖 茲 茱 荀 茹 荐 荅 茯 茫 茗 茘 莅 莚",
		"e4 ae 莪 莟 莢 莖 茣 莎 莇 莊 荼 莵 荳 荵 莠 莉 莨 菴",
		"e4 be 萓 菫 菎 菽 萃 菘 萋 菁 菷 萇 菠 菲 萍 萢 萠 莽",
		"e4 ce 萸 蔆 菻 葭 萪 萼 蕚 蒄 葷 葫 蒭 葮 蒂 葩 葆 萬",
		"e4 de 葯 葹 萵 蓊 葢 蒹 蒿 蒟 蓙 蓍 蒻 蓚 蓐 蓁 蓆 蓖",
		"e4 ee 蒡 蔡 蓿 蓴 蔗 蔘 蔬 蔟 蔕 蔔 蓼 蕀 蕣 蕘 蕈",
		"e5 3f    蕁 蘂 蕋 蕕 薀 薤 薈 薑 薊 薨 蕭 薔 薛 藪 薇",
		"e5 4f 薜 蕷 蕾 薐 藉 薺 藏 薹 藐 藕 藝 藥 藜 藹 蘊 蘓",
		"e5 5f 蘋 藾 藺 蘆 蘢 蘚 蘰 蘿 虍 乕 虔 號 虧 虱 蚓 蚣",
		"e5 6f 蚩 蚪 蚋 蚌 蚶 蚯 蛄 蛆 蚰 蛉 蠣 蚫 蛔 蛞 蛩 蛬",
		"e5 80 蛟 蛛 蛯 蜒 蜆 蜈 蜀 蜃 蛻 蜑 蜉 蜍 蛹 蜊 蜴 蜿",
		"e5 90 蜷 蜻 蜥 蜩 蜚 蝠 蝟 蝸 蝌 蝎 蝴 蝗 蝨 蝮 蝙",
		"e5 9e    蝓 蝣 蝪 蠅 螢 螟 螂 螯 蟋 螽 蟀 蟐 雖 螫 蟄",
		"e5 ae 螳 蟇 蟆 螻 蟯 蟲 蟠 蠏 蠍 蟾 蟶 蟷 蠎 蟒 蠑 蠖",
		"e5 be 蠕 蠢 蠡 蠱 蠶 蠹 蠧 蠻 衄 衂 衒 衙 衞 衢 衫 袁",
		"e5 ce 衾 袞 衵 衽 袵 衲 袂 袗 袒 袮 袙 袢 袍 袤 袰 袿",
		"e5 de 袱 裃 裄 裔 裘 裙 裝 裹 褂 裼 裴 裨 裲 褄 褌 褊",
		"e5 ee 褓 襃 褞 褥 褪 褫 襁 襄 褻 褶 褸 襌 褝 襠 襞",
		"e6 3f    襦 襤 襭 襪 襯 襴 襷 襾 覃 覈 覊 覓 覘 覡 覩",
		"e6 4f 覦 覬 覯 覲 覺 覽 覿 觀 觚 觜 觝 觧 觴 觸 訃 訖",
		"e6 5f 訐 訌 訛 訝 訥 訶 詁 詛 詒 詆 詈 詼 詭 詬 詢 誅",
		"e6 6f 誂 誄 誨 誡 誑 誥 誦 誚 誣 諄 諍 諂 諚 諫 諳 諧",
		"e6 80 諤 諱 謔 諠 諢 諷 諞 諛 謌 謇 謚 諡 謖 謐 謗 謠",
		"e6 90 謳 鞫 謦 謫 謾 謨 譁 譌 譏 譎 證 譖 譛 譚 譫",
		"e6 9e    譟 譬 譯 譴 譽 讀 讌 讎 讒 讓 讖 讙 讚 谺 豁",
		"e6 ae 谿 豈 豌 豎 豐 豕 豢 豬 豸 豺 貂 貉 貅 貊 貍 貎",
		"e6 be 貔 豼 貘 戝 貭 貪 貽 貲 貳 貮 貶 賈 賁 賤 賣 賚",
		"e6 ce 賽 賺 賻 贄 贅 贊 贇 贏 贍 贐 齎 贓 賍 贔 贖 赧",
		"e6 de 赭 赱 赳 趁 趙 跂 趾 趺 跏 跚 跖 跌 跛 跋 跪 跫",
		"e6 ee 跟 跣 跼 踈 踉 跿 踝 踞 踐 踟 蹂 踵 踰 踴 蹊",
		"e7 3f    蹇 蹉 蹌 蹐 蹈 蹙 蹤 蹠 踪 蹣 蹕 蹶 蹲 蹼 躁",
		"e7 4f 躇 躅 躄 躋 躊 躓 躑 躔 躙 躪 躡 躬 躰 軆 躱 躾",
		"e7 5f 軅 軈 軋 軛 軣 軼 軻 軫 軾 輊 輅 輕 輒 輙 輓 輜",
		"e7 6f 輟 輛 輌 輦 輳 輻 輹 轅 轂 輾 轌 轉 轆 轎 轗 轜",
		"e7 80 轢 轣 轤 辜 辟 辣 辭 辯 辷 迚 迥 迢 迪 迯 邇 迴",
		"e7 90 逅 迹 迺 逑 逕 逡 逍 逞 逖 逋 逧 逶 逵 逹 迸",
		"e7 9e    遏 遐 遑 遒 逎 遉 逾 遖 遘 遞 遨 遯 遶 隨 遲",
		"e7 ae 邂 遽 邁 邀 邊 邉 邏 邨 邯 邱 邵 郢 郤 扈 郛 鄂",
		"e7 be 鄒 鄙 鄲 鄰 酊 酖 酘 酣 酥 酩 酳 酲 醋 醉 醂 醢",
		"e7 ce 醫 醯 醪 醵 醴 醺 釀 釁 釉 釋 釐 釖 釟 釡 釛 釼",
		"e7 de 釵 釶 鈞 釿 鈔 鈬 鈕 鈑 鉞 鉗 鉅 鉉 鉤 鉈 銕 鈿",
		"e7 ee 鉋 鉐 銜 銖 銓 銛 鉚 鋏 銹 銷 鋩 錏 鋺 鍄 錮",
		"e8 3f    錙 錢 錚 錣 錺 錵 錻 鍜 鍠 鍼 鍮 鍖 鎰 鎬 鎭",
		"e8 4f 鎔 鎹 鏖 鏗 鏨 鏥 鏘 鏃 鏝 鏐 鏈 鏤 鐚 鐔 鐓 鐃",
		"e8 5f 鐇 鐐 鐶 鐫 鐵 鐡 鐺 鑁 鑒 鑄 鑛 鑠 鑢 鑞 鑪 鈩",
		"e8 6f 鑰 鑵 鑷 鑽 鑚 鑼 鑾 钁 鑿 閂 閇 閊 閔 閖 閘 閙",
		"e8 80 閠 閨 閧 閭 閼 閻 閹 閾 闊 濶 闃 闍 闌 闕 闔 闖",
		"e8 90 關 闡 闥 闢 阡 阨 阮 阯 陂 陌 陏 陋 陷 陜 陞",
		"e8 9e    陝 陟 陦 陲 陬 隍 隘 隕 隗 險 隧 隱 隲 隰 隴",
		"e8 ae 隶 隸 隹 雎 雋 雉 雍 襍 雜 霍 雕 雹 霄 霆 霈 霓",
		"e8 be 霎 霑 霏 霖 霙 霤 霪 霰 霹 霽 霾 靄 靆 靈 靂 靉",
		"e8 ce 靜 靠 靤 靦 靨 勒 靫 靱 靹 鞅 靼 鞁 靺 鞆 鞋 鞏",
		"e8 de 鞐 鞜 鞨 鞦 鞣 鞳 鞴 韃 韆 韈 韋 韜 韭 齏 韲 竟",
		"e8 ee 韶 韵 頏 頌 頸 頤 頡 頷 頽 顆 顏 顋 顫 顯 顰",
		"e9 3f    顱 顴 顳 颪 颯 颱 颶 飄 飃 飆 飩 飫 餃 餉 餒",
		"e9 4f 餔 餘 餡 餝 餞 餤 餠 餬 餮 餽 餾 饂 饉 饅 饐 饋",
		"e9 5f 饑 饒 饌 饕 馗 馘 馥 馭 馮 馼 駟 駛 駝 駘 駑 駭",
		"e9 6f 駮 駱 駲 駻 駸 騁 騏 騅 駢 騙 騫 騷 驅 驂 驀 驃",
		"e9 80 騾 驕 驍 驛 驗 驟 驢 驥 驤 驩 驫 驪 骭 骰 骼 髀",
		"e9 90 髏 髑 髓 體 髞 髟 髢 髣 髦 髯 髫 髮 髴 髱 髷",
		"e9 9e    髻 鬆 鬘 鬚 鬟 鬢 鬣 鬥 鬧 鬨 鬩 鬪 鬮 鬯 鬲",
		"e9 ae 魄 魃 魏 魍 魎 魑 魘 魴 鮓 鮃 鮑 鮖 鮗 鮟 鮠 鮨",
		"e9 be 鮴 鯀 鯊 鮹 鯆 鯏 鯑 鯒 鯣 鯢 鯤 鯔 鯡 鰺 鯲 鯱",
		"e9 ce 鯰 鰕 鰔 鰉 鰓 鰌 鰆 鰈 鰒 鰊 鰄 鰮 鰛 鰥 鰤 鰡",
		"e9 de 鰰 鱇 鰲 鱆 鰾 鱚 鱠 鱧 鱶 鱸 鳧 鳬 鳰 鴉 鴈 鳫",
		"e9 ee 鴃 鴆 鴪 鴦 鶯 鴣 鴟 鵄 鴕 鴒 鵁 鴿 鴾 鵆 鵈",
		"ea 3f    鵝 鵞 鵤 鵑 鵐 鵙 鵲 鶉 鶇 鶫 鵯 鵺 鶚 鶤 鶩",
		"ea 4f 鶲 鷄 鷁 鶻 鶸 鶺 鷆 鷏 鷂 鷙 鷓 鷸 鷦 鷭 鷯 鷽",
		"ea 5f 鸚 鸛 鸞 鹵 鹹 鹽 麁 麈 麋 麌 麒 麕 麑 麝 麥 麩",
		"ea 6f 麸 麪 麭 靡 黌 黎 黏 黐 黔 黜 點 黝 黠 黥 黨 黯",
		"ea 80 黴 黶 黷 黹 黻 黼 黽 鼇 鼈 皷 鼕 鼡 鼬 鼾 齊 齒",
		"ea 90 齔 齣 齟 齠 齡 齦 齧 齬 齪 齷 齲 齶 龕 龜 龠",
		"ea 9e    堯 槇 遙 瑤 凜 熙",
		"ed 40 纊 褜 鍈 銈 蓜 俉 炻 昱 棈 鋹 曻 彅 丨 仡 仼 伀",
		"ed 50 伃 伹 佖 侒 侊 侚 侔 俍 偀 倢 俿 倞 偆 偰 偂 傔",
		"ed 60 僴 僘 兊 兤 冝 冾 凬 刕 劜 劦 勀 勛 匀 匇 匤 卲",
		"ed 70 厓 厲 叝 﨎 咜 咊 咩 哿 喆 坙 坥 垬 埈 埇 﨏",
		"ed 80 塚 增 墲 夋 奓 奛 奝 奣 妤 妺 孖 寀 甯 寘 寬 尞",
		"ed 90 岦 岺 峵 崧 嵓 﨑 嵂 嵭 嶸 嶹 巐 弡 弴 彧 德 忞",
		"ed a0 恝 悅 悊 惞 惕 愠 惲 愑 愷 愰 憘 戓 抦 揵 摠 撝",
		"ed b0 擎 敎 昀 昕 昻 昉 昮 昞 昤 晥 晗 晙 晴 晳 暙 暠",
		"ed c0 暲 暿 曺 朎 朗 杦 枻 桒 柀 栁 桄 棏 﨓 楨 﨔 榘",
		"ed d0 槢 樰 橫 橆 橳 橾 櫢 櫤 毖 氿 汜 沆 汯 泚 洄 涇",
		"ed e0 浯 涖 涬 淏 淸 淲 淼 渹 湜 渧 渼 溿 澈 澵 濵 瀅",
		"ed f0 瀇 瀨 炅 炫 焏 焄 煜 煆 煇 凞 燁 燾 犱",
		"ee 40 犾 猤 猪 獷 玽 珉 珖 珣 珒 琇 珵 琦 琪 琩 琮 瑢",
		"ee 50 璉 璟 甁 畯 皂 皜 皞 皛 皦 益 睆 劯 砡 硎 硤 硺",
		"ee 60 礰 礼 神 祥 禔 福 禛 竑 竧 靖 竫 箞 精 絈 絜 綷",
		"ee 70 綠 緖 繒 罇 羡 羽 茁 荢 荿 菇 菶 葈 蒴 蕓 蕙",
		"ee 80 蕫 﨟 薰 蘒 﨡 蠇 裵 訒 訷 詹 誧 誾 諟 諸 諶 譓",
		"ee 90 譿 賰 賴 贒 赶 﨣 軏 﨤 逸 遧 郞 都 鄕 鄧 釚 釗",
		"ee a0 釞 釭 釮 釤 釥 鈆 鈐 鈊 鈺 鉀 鈼 鉎 鉙 鉑 鈹 鉧",
		"ee b0 銧 鉷 鉸 鋧 鋗 鋙 鋐 﨧 鋕 鋠 鋓 錥 錡 鋻 﨨 錞",
		"ee c0 鋿 錝 錂 鍰 鍗 鎤 鏆 鏞 鏸 鐱 鑅 鑈 閒 隆 﨩 隝",
		"ee d0 隯 霳 霻 靃 靍 靏 靑 靕 顗 顥 飯 飼 餧 館 馞 驎",
		"ee e0 髙 髜 魵 魲 鮏 鮱 鮻 鰀 鵰 鵫 鶴 鸙 黑 　 　 ⅰ",
		"ee f0 ⅱ ⅲ ⅳ ⅴ ⅵ ⅶ ⅷ ⅸ ⅹ ￢ ￤ ＇ ＂",
		"f0 3f                  ",
		"f0 4f                ",
		"f0 5f                ",
		"f0 6f                ",
		"f0 80                ",
		"f0 90               ",
		"f0 9e                  ",
		"f0 ae                ",
		"f0 be                ",
		"f0 ce                ",
		"f0 de                ",
		"f0 ee               ",
		"f1 3f                  ",
		"f1 4f                ",
		"f1 5f                ",
		"f1 6f                ",
		"f1 80                ",
		"f1 90               ",
		"f1 9e                  ",
		"f1 ae                ",
		"f1 be                ",
		"f1 ce                ",
		"f1 de                ",
		"f1 ee               ",
		"f2 3f                  ",
		"f2 4f                ",
		"f2 5f                ",
		"f2 6f                ",
		"f2 80                ",
		"f2 90               ",
		"f2 9e                  ",
		"f2 ae                ",
		"f2 be                ",
		"f2 ce                ",
		"f2 de                ",
		"f2 ee               ",
		"f3 3f                  ",
		"f3 4f                ",
		"f3 5f                ",
		"f3 6f                ",
		"f3 80                ",
		"f3 90               ",
		"f3 9e                  ",
		"f3 ae                ",
		"f3 be                ",
		"f3 ce                ",
		"f3 de                ",
		"f3 ee               ",
		"f4 3f                  ",
		"f4 4f                ",
		"f4 5f                ",
		"f4 6f                ",
		"f4 80                ",
		"f4 90               ",
		"f4 9e                  ",
		"f4 ae                ",
		"f4 be                ",
		"f4 ce                ",
		"f4 de                ",
		"f4 ee               ",
		"f5 3f                  ",
		"f5 4f                ",
		"f5 5f                ",
		"f5 6f                ",
		"f5 80                ",
		"f5 90               ",
		"f5 9e                  ",
		"f5 ae                ",
		"f5 be                ",
		"f5 ce                ",
		"f5 de                ",
		"f5 ee               ",
		"f6 3f                  ",
		"f6 4f                ",
		"f6 5f                ",
		"f6 6f                ",
		"f6 80                ",
		"f6 90               ",
		"f6 9e                  ",
		"f6 ae                ",
		"f6 be                ",
		"f6 ce                ",
		"f6 de                ",
		"f6 ee               ",
		"f7 3f                  ",
		"f7 4f                ",
		"f7 5f                ",
		"f7 6f                ",
		"f7 80                ",
		"f7 90               ",
		"f7 9e                  ",
		"f7 ae                ",
		"f7 be                ",
		"f7 ce                ",
		"f7 de                ",
		"f7 ee               ",
		"f8 3f                  ",
		"f8 4f                ",
		"f8 5f                ",
		"f8 6f                ",
		"f8 80                ",
		"f8 90               ",
		"f8 9e                  ",
		"f8 ae                ",
		"f8 be                ",
		"f8 ce                ",
		"f8 de                ",
		"f8 ee               ",
		"f9 3f    �@ �A �B �C �D �E �F �G �H �I �J �K �L �M �N",
		"f9 4f �O �P �Q �R �S �T �U �V �W �X �Y �Z �[ �\\\\ �] �^",
		"f9 5f �_ �` �a �b �c �d �e �f �g �h �i �j �k �l �m �n",
		"f9 6f �o �p �q �r �s �t �u �v �w �x �y �z �{ �| �} �~",
		"f9 80 � � � � � � � � � � � � � � � �",
		"f9 90 � � � � � � � � � � � � � � �",
		"f9 9e    � � � � � � � � � � � � � � �",
		"f9 ae � � � � � � � � � � � � � � � �",
		"f9 be � � � � � � � � � � � � � � � �",
		"f9 ce � � � � � � � � � � � � � � � �",
		"f9 de � � � � � � � � � � � � � � � �",
		"f9 ee � � � � � � � � � � � � � � �",
		"fa 40 ⅰ ⅱ ⅲ ⅳ ⅴ ⅵ ⅶ ⅷ ⅸ ⅹ Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ",
		"fa 50 Ⅶ Ⅷ Ⅸ Ⅹ ￢ ￤ ＇ ＂ ㈱ № ℡ ∵ 纊 褜 鍈 銈",
		"fa 60 蓜 俉 炻 昱 棈 鋹 曻 彅 丨 仡 仼 伀 伃 伹 佖 侒",
		"fa 70 侊 侚 侔 俍 偀 倢 俿 倞 偆 偰 偂 傔 僴 僘 兊",
		"fa 80 兤 冝 冾 凬 刕 劜 劦 勀 勛 匀 匇 匤 卲 厓 厲 叝",
		"fa 90 﨎 咜 咊 咩 哿 喆 坙 坥 垬 埈 埇 﨏 塚 增 墲 夋",
		"fa a0 奓 奛 奝 奣 妤 妺 孖 寀 甯 寘 寬 尞 岦 岺 峵 崧",
		"fa b0 嵓 﨑 嵂 嵭 嶸 嶹 巐 弡 弴 彧 德 忞 恝 悅 悊 惞",
		"fa c0 惕 愠 惲 愑 愷 愰 憘 戓 抦 揵 摠 撝 擎 敎 昀 昕",
		"fa d0 昻 昉 昮 昞 昤 晥 晗 晙 晴 晳 暙 暠 暲 暿 曺 朎",
		"fa e0 朗 杦 枻 桒 柀 栁 桄 棏 﨓 楨 﨔 榘 槢 樰 橫 橆",
		"fa f0 橳 橾 櫢 櫤 毖 氿 汜 沆 汯 泚 洄 涇 浯",
		"fb 40 涖 涬 淏 淸 淲 淼 渹 湜 渧 渼 溿 澈 澵 濵 瀅 瀇",
		"fb 50 瀨 炅 炫 焏 焄 煜 煆 煇 凞 燁 燾 犱 犾 猤 猪 獷",
		"fb 60 玽 珉 珖 珣 珒 琇 珵 琦 琪 琩 琮 瑢 璉 璟 甁 畯",
		"fb 70 皂 皜 皞 皛 皦 益 睆 劯 砡 硎 硤 硺 礰 礼 神",
		"fb 80 祥 禔 福 禛 竑 竧 靖 竫 箞 精 絈 絜 綷 綠 緖 繒",
		"fb 90 罇 羡 羽 茁 荢 荿 菇 菶 葈 蒴 蕓 蕙 蕫 﨟 薰 蘒",
		"fb a0 﨡 蠇 裵 訒 訷 詹 誧 誾 諟 諸 諶 譓 譿 賰 賴 贒",
		"fb b0 赶 﨣 軏 﨤 逸 遧 郞 都 鄕 鄧 釚 釗 釞 釭 釮 釤",
		"fb c0 釥 鈆 鈐 鈊 鈺 鉀 鈼 鉎 鉙 鉑 鈹 鉧 銧 鉷 鉸 鋧",
		"fb d0 鋗 鋙 鋐 﨧 鋕 鋠 鋓 錥 錡 鋻 﨨 錞 鋿 錝 錂 鍰",
		"fb e0 鍗 鎤 鏆 鏞 鏸 鐱 鑅 鑈 閒 隆 﨩 隝 隯 霳 霻 靃",
		"fb f0 靍 靏 靑 靕 顗 顥 飯 飼 餧 館 馞 驎 髙",
		"fc 40 髜 魵 魲 鮏 鮱 鮻 鰀 鵰 鵫 鶴 鸙 黑"
	];

	function find_block( str ){
		var len = kanji_encoding_table.length;

		for( var i = 0; i < len; i++ ){
			var cur = kanji_encoding_table[ i ],
			index = cur.indexOf( str );

			if( index + 1 ){
				return cur;
			}
		}
	}

	function individual_encode( str ){
		var ret = find_block( str );

		if( ret ){
			var split = ret.replace( /\s{2}/g, " " ).split( " " ),
			major = split[ 0 ],
			minor = split[ 1 ],
			index = split.indexOf( str ) - 2;
			return parseInt( "0x" + major + ( parseInt( minor, 16 ) + index ).toString( 16 ), 16 );
		}
	}

	function encode( code ){

		var diff;

		if( code >= 33088 && code <= 40956 ){
			diff = code - 33088;
		} else if( code >= 57408 && code <= 60351 ){
			diff = code - 49472;	
		}

		var base_16 = diff.toString( 16 ),
		len = base_16.length - 2,
		first = base_16.slice( 0, len ).padStart( 2, "0" ),
		second = base_16.slice( len ).padStart( 2, "0" ),
		final = parseInt( first, 16 ) * 192 + parseInt( second, 16 );

		return final.toString( 2 ).padStart( 13, "0" );
	}

	qr_class.prototype.kanji_escape = function( text ){
        var len = text.length,
        str = "";

        for( var i = 0; i < len; i++ ){
        	str += encode( individual_encode( text[ i ] ) );
        }

        return str;
	}
})();