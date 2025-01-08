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