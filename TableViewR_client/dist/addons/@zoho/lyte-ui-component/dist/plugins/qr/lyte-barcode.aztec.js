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