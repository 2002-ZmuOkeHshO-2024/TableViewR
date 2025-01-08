;(function(){
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
        type : "14",
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


    class LyteBarcode_Rss{
        constructor( options ){

            this.finderWidths = [1, 8, 4, 1, 1, 1, 1, 4, 8, 1, 3, 6, 4, 1, 1, 1, 1, 4, 6, 3, 3, 4, 6, 1, 1, 1, 1, 6, 4, 3, 3, 2, 8, 1, 1, 1, 1, 8, 2, 3, 2, 6, 5, 1, 1, 1, 1, 5, 6, 2, 2, 2, 9, 1, 1, 1, 1, 9, 2, 2];
            this.finderseq = [[0,1],[0,3,2],[0,5,2,7],[0,9,2,7,4],[0,9,2,7,6,11],[0,9,2,7,8,11,10],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,9,8],[0,1,2,3,4,5,6,9,10,11],[0,1,2,3,4,7,6,9,8,11,10]];
            this.chekweights = [-1, -1, -1, -1, -1, -1, -1, -1, 77, 96, 32, 81, 27, 9, 3, 1, 20, 60, 180, 118, 143, 7, 21, 63, 205, 209, 140, 117, 39, 13, 145, 189, 193, 157, 49, 147, 19, 57, 171, 91, 132, 44, 85, 169, 197, 136, 186, 62, 185, 133, 188, 142, 4, 12, 36, 108, 50, 87, 29, 80, 97, 173, 128, 113, 150, 28, 84, 41, 123, 158, 52, 156, 166, 196, 206, 139, 187, 203, 138, 46, 76, 17, 51, 153, 37, 111, 122, 155, 146, 119, 110, 107, 106, 176, 129, 43, 16, 48, 144, 10, 30, 90, 59, 177, 164, 125, 112, 178, 200, 137, 116, 109, 70, 210, 208, 202, 184, 130, 179, 115, 190, 204, 68, 93, 31, 151, 191, 134, 148, 22, 66, 198, 172, 94, 71, 2, 40, 154, 192, 64, 162, 54, 18, 6, 120, 149, 25, 75, 14, 42, 126, 167, 175, 199, 207, 69, 23, 78, 26, 79, 103, 98, 83, 38, 114, 131, 182, 124, 159, 53, 88, 170, 127, 183, 61, 161, 55, 165, 73, 8, 24, 72, 5, 15, 89, 100, 174, 58, 160, 194, 135, 45];
            this._checkweights = [1, 3, 9, 27, 2, 6, 18, 54, 58, 72, 24, 8, 29, 36, 12, 4, 74, 51, 17, 32, 37, 65, 48, 16, 64, 34, 23, 69, 49, 68, 46, 59];
            this.checkwidths = [3, 8, 2, 1, 1, 3, 5, 5, 1, 1, 3, 3, 7, 1, 1, 3, 1, 9, 1, 1, 2, 7, 4, 1, 1, 2, 5, 6, 1, 1, 2, 3, 8, 1, 1, 1, 5, 7, 1, 1, 1, 3, 9, 1, 1];
            this.expandedLookUp = [ 347,0,12,5,7,2,87,4,1387,348,10,7,5,4,52,20,2947,1388,8,9,4,5,30,52,3987,2948,6,11,3,6,10,104,4191,3988,4,13,1,8,1,204 ];
            this.LEncTab = [160, 0, 12, 4, 8, 1, 161, 1, 960, 161, 10, 6, 6, 3, 80, 10, 2014, 961, 8, 8, 4, 5, 31, 34, 2714, 2015, 6, 10, 3, 6, 10, 70, 2840, 2715, 4, 12, 1, 8, 1, 126];
            this.REncTab = [335, 0, 5, 10, 2, 7, 4, 84, 1035, 336, 7, 8, 4, 5, 20, 35, 1515, 1036, 9, 6, 6, 3, 48, 10, 1596, 1516, 11, 4, 8, 1, 81, 1];
            this.checkSum = 0; 
            this.points = [];

            extend( options, default_options );


            switch( options.type ){
                case "expanded":
                    this.dataBarExpanded( options );
                    break;
                case "14":
                    this.databar( options );
                    break;
            }
        }

        dataBarExpanded( options ){
            var split = this.splitString( options.text );
            var ais = [ ];
            var values = [];

            for( let i = 0; i < (split.length); i++ ){
                ais.push(this.convertToBinary(split[i++]));
                values.push(this.convertToBinary(split[i]));
            }

            var _ais = ais.map(this.convertToNum);
            var _values = values.map(this.convertToNum);

            var method = _ais[0] == "01" ? "1" : "00";
            var gpfAllow = false;
            var fnc1 = -1;
            var map = this.mapValues(fnc1);

            var cdf ; // composite data field
            var vlf = []; // Variable length field
            var gpf ; // General Purpose Field
            var gpfEnc = []; // GPF encoded

            var index = 0;
            var mode = 'numeric';
            var sequence;
            var finderWidthPattern;
            var checksum = 0;
            var rows;
            var segments = 22;
            var wrongAi;

            for(;;){
                if( ais.length == 2 ){
                    if( _ais[0] == "01" && _ais[1] == "3103" ){
                        if( _values[0][1] == 9 && this.toInt(values[1]) <= 32767 ){
                            method = "0100";
                            break;
                        }
                    }
                }
                if( ais.length == 2 ){
                    if( _ais[0] == "01" && _ais[1] == "3202" ){
                        if( _values[0][1] == "9" && this.toInt(values[1]) <= 9999 ){
                            method = "0101";
                            break;
                        }
                    }
                }
                if( ais.length == 2 ){
                    if( _ais[0] == "01" && _ais[1] == "3203" ){
                        if( _values[0][1] == "9" && this.toInt(values[1]) <= 22767 ){
                            method = "0101";
                            break;
                        }
                    }
                }
                if( ais.length == 2 || ais.length == 3 ){
                    var ai310 = _ais[1] >= 3100 && _ais[1] <= 3109;
                    var ai320 = _ais[1] >= 3200 && _ais[1] <= 3209;
    
                    if( ais.length == 3 ){
                        wrongAi = [ "11", "13", "15", "17" ].indexOf( _ais[2] ) != -1 ? false : true;
                    }else{
                        wrongAi = false;
                    }
                    if( _ais[0] == "01" && ( ai310 || ai320 ) && ( !wrongAi ) ){
                        let a = _values[2].slice(2,4), b = _values[2].slice(4,6)
                        if( ais.length == 3 ){
                            if( _values[0][0] == "9"  && ( this.toInt( values[1] ) <= 99999 ) && ( a >= 1 ) && ( a <= 12 ) && ( b >= 0 && b <= 31 ) ){
                                if( ai310 && _ais[2] == "11" ){
                                    method = "0111000";
                                    break;
                                }
                                if( ai320 && _ais[2] == "11" ){
                                    method = "0111001";
                                    break;
                                }
                                if( ai310 && _ais[2] == "13" ){
                                    method = "0111010";
                                    break;
                                }
                                if( ai320 && _ais[2] == "13" ){
                                    method = "0111011";
                                    break;
                                }
                                if( ai310 && _ais[2] == "15" ){
                                    method = "0111100";
                                    break;
                                }
                                if( ai320 && _ais[2] == "15" ){
                                    method = "0111101";
                                    break;
                                }
                                if( ai310 && _ais[2] == "17" ){
                                    method = "0111110";
                                    break;
                                }
                                if( ai320 && _ais[2] == "17" ){
                                    method = "0111111";
                                    break;
                                }
                            }
                            
                        }else{
                            if( values[0][0] == "9" && this.toInt( values[1] ) <= 99999 ){
                                if( ai310 ){
                                    method = "0111000"
                                    break;
                                }
                                if( ai320 ){
                                    method = "0111001"
                                    break;
                                }
                            }
                        }
                    }
                }
                if( ais.length >= 2 ){
                    var ai392 = _ais[1] >= 3920 && _ais[1] <= 3923;
                    
                    if( _ais[0] == "01" && ai392 ){
                        if( _values[0][0] == "9" ){
                            method = "01100";
                            break;
                        }
                    }
                }
                if( ais.length >= 2 ){
                    var ai393 = _ais[1] >= 3930 && _ais[1] <= 3933;
                    
                    if( _ais[0] == "01" && ai393 ){
                        if( _values[0][0] == "9" ){
                            method = "01101";
                            break;
                        }
                    }
                }
                method = "00";
                break;
            }
        
            switch( method ){
                case "00":
                    cdf = [];
                    gpf = [];
                    break;
                case "1":
                    cdf = this.conv13to44( values[0].slice(0,13) ).map(function( item ){
                        return item - 48;
                    })
                    break;
                case "0100":
                    cdf = this.conv12to40( values[0].slice( 1, 13 ) );
                    this._push( cdf , this.tobin( this.toInt( values[1] ) , 15 ) );
                    cdf = cdf.map( function( item ){
                        return item - 48;
                    } )
                    break;
                case "0101":
                    cdf = this.conv12to40( values[0].slice( 1, 13 ) );
                    if( _ais[1] == "3202" ){
                        this._push( cdf , this.tobin( this.toInt( values[1] ), 15 ) )
                    }else{
                        this._push( cdf , this.tobin( this.toInt( values[1] ) + 10000, 15 ) )
                    }
                    cdf = cdf.map( function( item ){
                        return item - 48;
                    } )
                    break;
            }
            if( method.length == 7 ){
                cdf = this.conv12to40( values[0].slice(1,13) );
                let arr = [];
                this._push(arr , ais[1].slice(3,4) );
                this._push( arr , values[1].slice(1,6) );
                this._push( cdf ,this.tobin( this.toInt( arr ), 20 ) );

                let val;
                if( ais.length == 3 ){
                    val = ( (this.toInt( values[2].slice(0,2) ) * 384 ) + ( (this.toInt( values[2].slice(2,4) ) - 1) * 32 ) + this.toInt( values[2].slice(4,6) ));
                }else{
                    val = 38400;
                }
                this._push( cdf , this.tobin( val, 16 ) );

                cdf = cdf.map( function( item ){
                    return item - 48;
                } );

                gpf = [];
                ais = [];
                values = [];

            }
            if( method == "01100" ){
                cdf = this.conv12to40( values[0].slice( 1, 13 ) );
                this._push( cdf, this.tobin( this.toInt( ais[1].slice( 3, 4 ) ), 2 ) );
                cdf = cdf.map( function( item ){
                    return item - 48;
                } );

                this._push( gpf, values[1] );
                if( ais.length > 2 ){
                    gpf.push( fnc1 );
                }
            }
            if( method == "01101" ){
                cdf = this.conv12to40( values[0].slice( 1, 13 ) );
                this._push( cdf, this.tobin( this.toInt( ais[1].slice( 3,4 ) ), 2 ) );
                this._push( cdf, this.tobin( this.toInt( values[1].slice( 0,3 ) ), 10) );

                cdf = cdf.map( function( item ){
                    return item - 48;
                } );

                this._push( gpf, values[1].slice( 3, values[1].length - 3 ) );

                if( ais.length > 2 ){
                    gpf.push( fnc1 );
                }
            }

            vlf = gpfAllow ? new Array(2) : [];

            for( let i = 1, len = ais.length-1; i <= len; i++ ){
                let ai = ais[i];
                let val = values[i];
                let arr = new Array( ai.length + val.length );
        
                this.mergeArray( arr, [ 0, ai.length + val.length ], 0, ai );
                this.mergeArray( arr, [ 0, ai.length + val.length ], ai.length, val );
        
                gpf = arr;
            }
            
            var numericruns = new Array(gpf.length + 1).fill(0); numericruns.push(-1);
            var alphanumericruns = new Array(gpf.length + 1).fill(0);
            var nextiso646only = new Array(gpf.length).fill(0); nextiso646only.push(9999);
            
            for( let i = gpf.length-1; i >= 0; i-- ){
                let arr = new Array(2).fill(48);
                let cur = gpf[i];
                this.mergeArray( arr, [0,2], 0 , [cur] );
        
                if(i < gpf.length-1){
                    // if( gpf[i+1] == fnc1 ){
                    //     // update
                    // }
                    arr[1] = gpf[i+1];
                }
        
                if( map.numeric.get( this.convertToNum(arr).toString() ) ){
                    this.mergeArray( numericruns, [0,12], i, [numericruns[ i+2 ] + 2] );
                }else{
                    this.mergeArray( numericruns, [0,12], i, [0] );
                }
        
                if( map.alphanumeric.get(cur) ){
                    this.mergeArray( alphanumericruns, [0,12], i, [alphanumericruns[ i+1 ] + 1] );
                }else{
                    this.mergeArray( alphanumericruns, [0,12], i, [0]);
                }
        
                if( map.iso646.get(cur) && !map.alphanumeric.get(cur) ){
                    this.mergeArray( nextiso646only, [0,12], i, [0]);
                }else{
                    this.mergeArray( nextiso646only, [0,12], i, [nextiso646only[ i+1 ] + 1] );
                }
            }

            index = 0;

            for( let i = 0; i < gpf.length; i++){
                if( mode === "numeric" ){
                    if( i <= (gpf.length - 2) ){
                        let arr = new Array(2).fill(0);
                        let cur = gpf[ i ];
                        let next = gpf[ i + 1 ];
                        // if( cur == fnc1 ){
                        //     // update
                        // }
                        arr[0] = cur;
                        // if( next == fnc1 ){

                        // }
                        arr[1] = next;
                        if( map.numeric.get(this.convertToNum(arr).toString()) ){
                            index = this.encode( map.numeric, this.convertToNum(arr).toString(), gpfEnc , index);
                            i++;
                            continue;
                        }
                        index = this.encode( map.numeric, '-3', gpfEnc , index );
                        mode = "alphanumeric";
                        i--;
                    // }else{
                    //     // update
                    }
                }else if( mode === "alphanumeric" ){
                    if( gpf[ i ] == fnc1 ){
                        index = this.encode( map.alphanumeric , fnc1, gpfEnc, index);
                        continue
                    } 

                    let cur =  gpf[i];
                    let isAlphanumeric = map.alphanumeric.get('cur') != undefined;
                    let isIso646 = map.iso646.get('cur') != undefined;

                    if( isIso646 && !(isAlphanumeric) ){
                        index = this.encode( map.alphanumeric , -4, gpfEnc, index);
                        mode = "iso646";
                        i--;
                        continue;
                    }
                    if( numericruns[i] >= 6 ){
                        index = this.encode( map.alphanumeric , -2, gpfEnc, index);
                        mode = "numeric";
                        i--;
                        continue;
                    }
                    if( (numericruns[i]>=4) && ( (numericruns[i] + i) == gpf.length ) ){
                        index = this.encode( map.alphanumeric , -2, gpfEnc, index);
                        mode = "numeric";
                        i--;
                        continue;
                    }
                    index = this.encode( map.alphanumeric, cur, gpfEnc, index );
                    continue;
                    
                }
                if( mode == "iso646" ){
                    
                    // if( gpf[i] = fnc1 ){

                    // }
                    if( (numericruns[i] >= 4) && (nextiso646only[i]>=10) ){
                        index = this.encode( map.iso646, -2, gpfEnc, index );
                        continue;
                    }
                    if( (alphanumericruns[i] >= 5) && (nextiso646only[i] >= 10) ){
                        index = this.encode( map.iso646, -3, gpfEnc, index );
                        continue;
                    }
                    let cur = gpf[i]
                    index = this.encode( map.iso646, cur, gpfEnc, index );
                }
            }

            gpf = gpfEnc.slice( 0, index );

            var totalLength = 13 + method.length + vlf.length + cdf.length + gpf.length;
            var remainingBits = this.calculateRemainingBits( totalLength, segments );
            var pad = new Array( remainingBits );

            if( vlf.length != 0 ){
                let balanced = ~~( (totalLength + remainingBits)/12 );
                vlf[0] = balanced % 2;
                vlf[1] = balanced <= 14 ? 0 : 1;
             }

             if( pad.length > 0 ){
                for( let i = 0; i < pad.length; i+=5 ){
                    let padLen = pad.length;
                    let arr = [ 0,0,1,0,0 ];
                    let _len = padLen - i;

                    if( _len > 5 ){
                        _len = 5;
                    }

                    this.mergeArray(pad, [ 0,padLen ], i, arr.slice( 0, _len ));
                }

                if( mode === "numeric" ){
                    let temp = pad;

                    pad = [0, 0];
                    this._push( pad, [ 0, 0, 0, 0 ] );
                }
             }

             var binval = [0];
             var evenDataWidth ;
             var oddDataWidth ;

             Array.from( method ).forEach( function( item ){
                binval.push( item*1 );
             } );

             this._push( binval, vlf );
             this._push( binval, cdf );
             this._push( binval, gpf );
             this._push( binval, pad );

             var dataLen = ~~(( binval.length ) / 12);
             var dataMatrixWidths = new Array( dataLen );
             var dataWidths;

             for( let i = 0; i < dataLen; i++ ){
                let curVal = binval.slice( i*12 , (i*12) + 12 );
                let prev = 0;
                let __arr = []; // [  Data Module Thickness ( odd ) ,  Data Module Thickness ( even ) , Data Module Width ( even ) , Data Module Width (odd) , Data Element Length ( even ) , Data Element Length ( odd ) , Data Gross Spacing ]

                for( let j = 0; j <= 11; j++ ){
                    prev = prev + ( (~~Math.pow( 2, 11 - j ) ) * curVal[j] );
                }

                let j = 0;

                for( ;; ){
                    if( prev < this.expandedLookUp[j] ){
                        for( let i = 0; i < 7; i ++ ){
                            __arr.push( this.expandedLookUp[ j+ i + 1 ] );
                        }
                        break
                    }
                    j+=8;
                }

                oddDataWidth = this.getWidths( [ ~~( (prev - __arr[0]) / __arr[6] ), __arr[1], __arr[3], 4, true ] );
                evenDataWidth = this.getWidths( [ ~~( (prev - __arr[0]) % __arr[6] ), __arr[2], __arr[4], 4, false ] );

                dataWidths = new Array(8);
                
                if( i % 2 == 0 ){
                    for( let k = 0; k <= 3; k++ ){
                        dataWidths[ 7 - ( k * 2 ) ] = oddDataWidth[ k ];
                        dataWidths[ 6 - ( k * 2 ) ] = evenDataWidth[ k ];
                    }
                }else{
                    for( let k = 0; k <= 3; k++ ){
                        dataWidths[ k * 2 ] = oddDataWidth[ k ];
                        dataWidths[ ( k * 2 ) + 1 ] = evenDataWidth[ k ];
                    }
                }

                dataMatrixWidths[i] = dataWidths;
             }
            
             // checksum calc
             var sequence = this.finderseq[ ~~(( dataLen - 2 ) / 2) ];
             var finderWidthPattern = new Array( sequence.length );
             var checkWeightSeq;
             var er = [];
             var widths = [];
 
             for( let i = 0; i <= sequence.length - 1; i++ ){
                 finderWidthPattern[ i ] = this.finderWidths.slice( sequence[i] * 5, ( sequence[i] * 5 ) + 5 );
             }
 
             sequence.forEach( function( item ){
                this._push( er ,  this.chekweights.slice( item*16, ( item*16 ) + 16 ));
             }.bind(this) );
 
             checkWeightSeq = er.slice( 8 , er.length - 8 );

             for( let i = 0; i < dataMatrixWidths.length; i++ ){
                this._push( widths, dataMatrixWidths[i] );
             }

             for( let i = 0; i <= widths.length-1; i++ ){
                checksum += ( widths[i] * er[ i + 8 ] );
             }
             checksum = ( checksum % 211 ) + ( ( dataLen - 3 ) * 211 );

             index = 0;
             let __arr = [];

             while( true ){
                if( checksum <= this.expandedLookUp[index] ){
                    __arr = this.expandedLookUp.slice( index + 1, index + 1 + 7 );
                    break;
                }
                index += 8;
             }

             var oddCheckSumWidths = this.getWidths( [ ~~( (checksum - __arr[0])/__arr[6] ), __arr[1], __arr[3], 4, true ] );
             var evenCheckSumWidths = this.getWidths( [( (checksum - __arr[0]) % __arr[6]), __arr[2], __arr[4], 4, false] );
             var checkSumWidths = new Array( 8 );

             for( let j = 0; j <= 3; j ++ ){
                checkSumWidths[ j * 2 ] = oddCheckSumWidths[j];
                checkSumWidths[ (j * 2) + 1 ] = evenCheckSumWidths[j];
             }

             var fs = [checkSumWidths]; // field seperator
             var pos;

             dataMatrixWidths.forEach( function( item ){
                fs.push(item);
             } )

             dataMatrixWidths = fs.slice( 0, dataLen + 1 );
             dataLen = dataMatrixWidths.length;
             rows = new Array( ~~Math.ceil( dataLen / segments ) ).fill([]);

             for( let j = 0; j <= rows.length-1; j++ ){
                if( ((segments % 4) != 0) && ( (j % 2) == 1 ) ){
                    rows[j].push( 0 );
                }

                this._push( rows[j], [1,1] );

                for( let k = 0; k <= segments - 1; k++ ){
                    pos = k + ( j * segments );
                    if( pos < dataLen ){
                        this._push( rows[j], dataMatrixWidths[pos] );
                        if( (pos % 2) == 0 ){
                            this._push( rows[j], finderWidthPattern[~~pos/2] );
                        }
                    }
                }

                this._push( rows[j], [1,1] );


             }

             let sbs = [1]

             for( let j = 0; j <= dataLen - 1; j++ ){
                 this._push( sbs, dataMatrixWidths[j] );
                 if( (j%2) == 0 ){
                     this._push( sbs, finderWidthPattern[~~( j/2 )] );
                 }
             }
             
             this._push( sbs, [1,1] );

            
         
             sbs.forEach( function(num,index){
                 for( let i = 0; i < num; i++ ){
                     let obj = { is_filled : true, type : 'data', fill : index % 2 == 0 ? true : false };
                     this.points.push(obj);
                 }
             }.bind( this ) );
 
             this.draw_in_canvas( options.canvas || document.createElement('canvas') , options, options.text || "" ); 

        }

        databar( options ){
            var split = this.splitString( options.text );
            var ai = this.convertToBinary(split[0]);
            var val = this.convertToBinary(split[1]);
            var right, left = 0 ;
            var d1,d2,d3,d4;
            var index = 0;

            var binval = [ 0 ];
            var flag = true ;
            var widths = [];
            var checksum = 0;
            var sbs = [];

            var checklft , checkrt , checkrtrev;

            for( let i = 0; i < val.length-1; i++ ){
                binval.push( val[i] - 48 );
            }

            for( let i = 0; i <= 12; i++ ){
                binval[i+1] = binval[i+1] + ( (binval[i] % 4537077) * 10 );
                binval[i] = ~~(binval[i] / 4537077);
            }

            right = binval[13] % 4537077;
            binval[13] = ~~(binval[13] / 4537077);

            for( let i = 0; i <= 13; i++ ){
                if( !(binval[i] == 0 && flag) ){
                    flag = false;
                    left = left + ( binval[i] * ( ~~Math.pow( 10, 13 - i ) ) );
                }
            }

            d1 = ~~( left / 1597 );
            d2 = ( left % 1597 );
            d3 = ~~( right / 1597 );
            d4 = ( right % 1597 );

            var calc = function( d, tab ){
                index = 0;
                let arr = [];
                while( true ){
                    if( d <= tab[index] ){
                        let cur = tab.slice(index + 1 , index + 1 + 7);
                        this._push( arr, cur );
                        break;
                    }
                    index = index + 8;
                }
                return arr;
            }.bind( this );

            var merge = function( a, b , flag ){
                let arr = [];
                for( let i = 0; i <= 3; i++ ){
                    arr[flag ? 7 - (i * 2) : i * 2] = a[i];
                    arr[flag ? 6 - (i * 2) : i * 2 + 1] = b[i];
                }
                return arr;
            }

            var _d1 = calc( d1, this.LEncTab );
            var _d2 = calc( d2, this.REncTab );
            var _d3 = calc( d3, this.LEncTab );
            var _d4 = calc( d4, this.REncTab );

            var d1wo = this.getWidths( [~~(( d1 - _d1[0] )/ _d1[6] ), _d1[1], _d1[3], 4, false ] );
            var d1we = this.getWidths( [~~(( d1 - _d1[0] )% _d1[6] ), _d1[2], _d1[4], 4, true  ] );

            var d2wo = this.getWidths( [~~(( d2 - _d2[0] )% _d2[5] ), _d2[1], _d2[3], 4, true  ] );
            var d2we = this.getWidths( [~~(( d2 - _d2[0] )/ _d2[5] ), _d2[2], _d2[4], 4, false ] );

            var d3wo = this.getWidths( [~~(( d3 - _d3[0] )/ _d3[6] ), _d3[1], _d3[3], 4, false ] );
            var d3we = this.getWidths( [~~(( d3 - _d3[0] )% _d3[6] ), _d3[2], _d3[4], 4, true  ] );

            var d4wo = this.getWidths( [~~(( d4 - _d4[0] )% _d4[5] ), _d4[1], _d4[3], 4, true  ] );
            var d4we = this.getWidths( [~~(( d4 - _d4[0] )/ _d4[5] ), _d4[2], _d4[4], 4, false ] );

            var d1width = merge(d1wo, d1we);
            var d2width = merge(d2wo, d2we, true);
            var d3width = merge(d3wo, d3we, true);
            var d4width = merge(d4wo, d4we);

            this._push( widths, d1width );
            this._push( widths, d2width );
            this._push( widths, d3width );
            this._push( widths, d4width );

            for( let i = 0; i <= 31; i++ ){
                checksum =  checksum + ( widths[i] * this._checkweights[i] );
            }
            checksum %= 79;
            checksum >= 8 && checksum ++;
            checksum >= 72 && checksum ++;

            checklft = this.checkwidths.slice( ~~(checksum/9) * 5 ,~~(checksum/9) * 5 + 5  );
            checkrtrev = this.checkwidths.slice( (checksum%9) * 5 , ~~( (checksum%9) * 5 ) + 5 );
            checkrt = new Array(5);

            for( let i = 0; i <= 4; i++ ){
                checkrt[i] = checkrtrev[ 4 - i ];
            }

            if( options.type == "14" || options.type == "truncated" ){
                sbs.push( 1 );
                this._push( sbs, d1width );
                this._push( sbs, checklft );
                this._push( sbs, d2width );
                this._push( sbs, d4width );
                this._push( sbs, checkrt );
                this._push( sbs, d3width );
                this._push( sbs, [1,1] );
            }


            sbs.forEach( function(num,index){
                for( let i = 0; i < num; i++ ){
                    let obj = { is_filled : true, type : 'data', fill : index % 2 == 0 ? true : false };
                    this.points.push(obj);
                }
            }.bind( this ) );

            this.draw_in_canvas( options.canvas || document.createElement('canvas') , options, options.text || "" ); 
        }

        toInt(arr){
            return String.fromCharCode.apply( null, arr ).replace(/\0+$/, '') | 0;
        }

        draw_in_canvas( canvas, options, final_text, _pts ){
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
                ctx.textAlign = item.textAlign || 'center';
                ctx.fillText( item.text, item.left, item.top, item.maxWidth );
            });

            return new_height;
        }

        checkSum(dataLen){
            var sequence = this.finderseq[ ~~( dataLen - 2 ) / 2 ];
            var finderWidthPattern = new Array( sequence.length );
            var checkWeightSeq;
            var er;
            var widths = [];

            for( let i = 0; i <= sequence.length - 1; i++ ){
                finderWidthPattern[ i ] = this.finderWidths.slice( sequence[i] * 5, ( sequence[j] * 5 ) + 5 );
            }

            sequence.forEach( function( item ){
                this.chekweights.slice( item*16, ( item*16 ) + 16 );
            } );

            checkWeightSeq = er.slice( 8 , er.length - 8 );
            
            


        }

        getWidths(input){
            var mask = 0;
            var outerEven = input[4];
            var elementLength = input[3];
            var maxWordLength = input[2];
            var numModules = input[1];
            var value = input[0];
            var out = new Array(4);
            var sval , lval;
            var largeValue;
    
            var extraWidth = 1;
    
    
            for( var i = 0; i <= ( elementLength - 2 ); i++ ){
                mask = mask | ( i < 0 ? 1 >>> -i : 1 << i ); // bar is i;
                extraWidth = 1;
    
                for( ;; ){
                    sval = this.ncr( elementLength - i - 2, numModules - extraWidth - 1 );
    
                    if( outerEven && ( mask == 0 ) && (  ( (numModules - extraWidth)  - ( elementLength * 2 ) ) + ( i * 2 )  >= -2 ) ){
                        sval = sval - this.ncr( elementLength - i - 2 , numModules - extraWidth - elementLength + i );
                     } 
    
                    if( (elementLength - i) > 2 ){
                        lval = 0;
                        for( var j = ( numModules - extraWidth - elementLength + i + 2 ); j >= ( maxWordLength + 1 ); j-- ){
                            var combination = this.ncr( elementLength - i - 3, numModules - j - extraWidth - 1 );
                            lval += combination;
                        }
                        sval = sval - (lval * ( elementLength - i - 1 ) );
                    }else{
                        if( ( numModules - extraWidth ) > maxWordLength ){
                            sval = sval - 1;
                        }
                    }
                    
                    value = ( value - sval ); 
                    if( value < 0 ){
                        break;
                    }
    
                    extraWidth = extraWidth + 1;
                    mask = mask & ( ~((i < 0 ? 1 >>> - i : 1 << i)) )
                }
                value = value + sval;
                numModules = numModules - extraWidth;
                out[i] = extraWidth;
            }
            out[elementLength-1] = numModules;
            return out;
        }

        ncr(a,b){
            var diff = b-a;

            if( a < diff ){
                let temp = diff;
                diff = a;
                a = temp;
            }

            var numerator = 1;
            var denominator = 1;
            var denominatorIncrement = diff;

            for( let i = b; i >= a + 1; i-- ){
                if( denominator <= denominatorIncrement ){
                    let numeratorTimesI = numerator * i;

                    let currentDenominator = denominator;
                    denominator = denominator + 1;
                    numerator = ~~( numeratorTimesI / currentDenominator );
                }
            }

            for( ;; ){
                if( denominator > denominatorIncrement ){
                    break;
                }
                denominator = denominator + 1;
                numerator = ~~( numerator / denominator );
            }

            return numerator;
        }

        calculateRemainingBits( totalLength, segments ){
            let remainingBits = ( ~~Math.ceil( totalLength/12 ) ) * 12;
            remainingBits = remainingBits < 48 ? 48 : remainingBits;

            let sections = ~~( remainingBits / 12 );

            totalLength
            remainingBits

            if( sections % segments == 1 ){
                remainingBits = ( sections + 1 ) * 12;
            }

            return remainingBits - totalLength;
            
        }

        mapValues(fnc1){
            let obj = {};
            let map = new Map();

            for( var i = 0; i <= 119; i++ ){

                var key = [48, 48];
                var curRadix = this.convertToRadix( [0,0] , i , 11 );
                this.mergeArray(key , [0,2] , 2-curRadix.length, curRadix);
        
                key[0] = key[0] == 65 ? 94 : key [0];
                key[1] = key[1] == 65 ? 94 : key [1];
        
                let cur = this.convertToRadix( new Array(7).fill(0), (i + 8), 2 );
                let val = this.strcpy( new Array(7).fill(0) ,  "0000000" );

                this.mergeArray( val, [0,7] , 7 - cur.length, cur);
                map.set( this.convertToNum(key), val );

            }
            map.set( '-3' , this.convertToBinary("0000") );

            obj.numeric = map;
            map = new Map();

            for( var i = 48; i <= 57; i++ ){
                let val = this.tobin( i - 43 , 5 );
                map.set( i, val );
            }
        
            for( var i = 65; i <= 90; i++ ){
                let val = this.tobin( i - 33 , 6 );
                map.set( i , val );
            }
            //check 12488
            for( var i = 44; i <= 47; i++ ){
                let val = this.tobin( i + 15, 6 );
                map.set( i , val );
            }

            map.set( fnc1, this.convertToBinary("01111") );
            map.set( 42, this.convertToBinary("111010") );
            map.set( -2, this.convertToBinary("000") );
            map.set( -4, this.convertToBinary("00100") );
        
            obj.alphanumeric = map;
            map = new Map();

            for( var i = 48; i<= 57; i++ ){
                let val = this.tobin( i - 43 , 5 );
                map .set( i , val );
            }
        
            for( var i = 65; i <= 90; i++ ){
                let val = this.tobin( i - 1, 7 );
                map.set( i , val );
            }
        
            for( var i = 97; i <= 122; i++ ){
                let val = this.tobin( i - 7, 7 );
                map.set( i , val );
            }
        
            for( var i = 37; i <= 47; i++ ){
                let val = this.tobin( i + 197 , 8 );
                map.set( i, val );
            }
        
            for( var i = 58; i <= 63; i++ ){
                let val = this.tobin( i + 187 , 8);
                map.set( i , val );
            }
        
            map.set(fnc1, this.convertToBinary("01111") );
            map.set(42, this.convertToBinary("111010") );
            map.set(-2, this.convertToBinary("000") );
            map.set(-4, this.convertToBinary("00100") );
            map.set(33, this.convertToBinary("11101000") );
            map.set(34, this.convertToBinary("11101001") );

            obj.iso646 = map;

            return obj;

        }

        _push( src , inp ){
            inp.forEach( function( item ) {
                src.push( item );
            });
        }

        splitString(input) {
            let regex = /\((\d+)\)([^\(\)]+)/g;
            let matches = [];
            let match;
        
            while (match = regex.exec(input)) {
                matches.push(match[1], match[2]);
            }
        
            return matches;
        }

        conv13to44( vals ){
            let arr = new Array(44).fill(48);
    
            let firstVal = this.convertToRadix( new Array(4) , this.convertToNum([vals[0]]) , 2 )
            this.mergeArray(arr , [0,4] , 4 - firstVal.length, firstVal); // vals[0]
            
            let child =  this.conv12to40( vals.slice( 1 , 13 ) , arr );
            this.mergeArray( arr , [0,44] , 4 , child );
            
            return arr;
        }

        conv12to40( vals, parentArr ){
            let arr = new Array(40).fill(48);
    
            let a = this.convertToRadix( new Array(10).fill(0), this.convertToNum(vals.slice(0,3)) , 2  );
            this.mergeArray( arr , [0,10] , 10 - a.length , a );

            let b = this.convertToRadix( new Array(10).fill(0), this.convertToNum(vals.slice(3,6)) , 2  );
            this.mergeArray( arr , [10,20] , 10 - b.length , b );

            let c = this.convertToRadix( new Array(10).fill(0), this.convertToNum(vals.slice(6,9)) , 2  );
            this.mergeArray( arr , [20,30] , 10 - c.length , c );
            
            let d = this.convertToRadix( new Array(10).fill(0), this.convertToNum(vals.slice(9,12)) , 2  );
            this.mergeArray( arr , [30,40] , 10 - d.length , d );

            return arr;
        }

        convertToBinary(input){
            return [ ...String(input) ].map( (digit) => digit.charCodeAt(0) );
        }

        convertToNum(input){
            return String.fromCharCode(...input);
        }

        mergeArray(dest, destLength, offset , src ){
            for( let i = src.length-1 ; i >= 0 ; i-- ){
                dest[destLength[0] + offset+i] = src[i];
            }
        }

        convertToRadix( arr , number , radix ){
            return arr ? this.strcpy( arr , (~~number).toString(radix).toUpperCase() ) :  (~~number).toString(radix).toUpperCase() ;
        }

        encode(catagory, value , gpfEnc, index){
            let arr = catagory.get(value);
    
            for( var i = 0; i < arr.length; i++ ){
                arr[i] -= 48;
            }
    
            for( var i = 0; i < arr.length; i++ ){
                gpfEnc[ i + index ] = arr[i];
            }
    
            return index + arr.length; 
        }

        strcpy(dst, src){
            if( typeof dst === "string" ){
                dst = this.toString(dst);
            }

            for( var i = 0; i < src.length; i++ ){
                dst[i] = src.charCodeAt(i);
            }

            return src.length < dst.length ? dst.slice( 0, src.length ) : dst;

        }

        toString(value){

            let type = typeof value;

            if( type === "number" ){
                return new Array(value);
            }

            if( type !== 'string' ){
                value = '' + value;
            }

            var arr = new Array(value.length);

            for( let i = 0; i < value.length; i++ ){
                arr[i] = v.charCodeAt( i );
            }

            return arr;

        }

        tobin( value, length ){
            let arr = new Array( length ).fill(48);
            let radix = this.convertToRadix( new Array( arr.length ), value, 2 );
            this.mergeArray( arr, [ 0, arr.length ], arr.length - radix.length, radix );
            return arr;
        }

    }

    if( typeof $L != "undefined" ){
        $L.rss = function( ops ){
            return new LyteBarcode_Rss( ops );
        }
        $L.rss.class_instance = LyteBarcode_Rss;
    } else {
        window.LyteBarcode_Rss = LyteBarcode_Rss;
    }

})();
