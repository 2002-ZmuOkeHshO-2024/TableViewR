var Float32BitSampleArray = [],
    chunckArr = [],
    ARRAY_LENGTH_UPPER_LIMIT_BEFORE_SPLITTING_TO_2D_ARRAY = 1000000,
	chunk;

onmessage = function( event ) {
	var data = event.data,
        type = data.type;

    chunk = data.chunk;

	if( type === 'data' ) {
		for( var i = 0 ; i < data.data.length; i++ ) {
        	Float32BitSampleArray.push( data.data[ i ] );
            if (chunk && (Float32BitSampleArray.length >= ARRAY_LENGTH_UPPER_LIMIT_BEFORE_SPLITTING_TO_2D_ARRAY) ) {
                chunckArr.push(Float32BitSampleArray);
                Float32BitSampleArray = [];
            }
    	}
	}
	else if( type === 'process' ) {
		postMessage( buildWav() );
	}
}

function buildWav() {
    return buildWavSpecification();
}

function appendData( index, view ) {
    var inc = 0,
		preInc = inc,
		_fn = function(arr){
			for( var i = 0; i < arr.length; i++ ) {
				var s = Math.max( -1, Math.min( 1, arr[ i ] ) );
				s = s < 0 ? s * 0x8000 : s * 0x7FFF;
	
				view.setUint16( index + 2 * (i + preInc), s, true );
				inc++;
			}
		};

	if( chunk ){
		for(var j = 0; j < chunckArr.length; j++) {
			preInc = inc;
			_fn(chunckArr[j]);
		}
	} else {
		_fn(Float32BitSampleArray);
	}
    
}

function buildWavSpecification() {
    var dataTypeSize = 16,
    totalDataSize = ( dataTypeSize / 8 ) * (chunckArr.length * ARRAY_LENGTH_UPPER_LIMIT_BEFORE_SPLITTING_TO_2D_ARRAY + Float32BitSampleArray.length),
    sizeOfFileDescriptor = totalDataSize + 36,
    numberOfChannels = 1,
    sampleRate = 44100,
    bytesPerSample = numberOfChannels * dataTypeSize / 8,
    blockAlign = numberOfChannels * bytesPerSample,
    bitsPerSample = bytesPerSample * 8,
    byteRate = sampleRate * bytesPerSample,
    buffer = new ArrayBuffer( 44 + totalDataSize ),
    view = new DataView( buffer ),
    format = 1;

    function writeStringIntoBuffer( index, str ) {
        for( var i = 0; i < str.length; i++ ) {
            view.setUint8( index + i, str.charCodeAt( i ) );
        }
    }

    function write32BitInt( index, val ) {
        view.setUint32( index, val, true );
    }

    function write16BitInt( index, val ) {
        view.setUint16( index, val, true );
    }



    writeStringIntoBuffer( 0, 'RIFF' );
    write32BitInt( 4, sizeOfFileDescriptor );
    writeStringIntoBuffer( 8, 'WAVE' );
    writeStringIntoBuffer( 12, 'fmt ' );
    write32BitInt( 16, 16 );
    write16BitInt( 20, format );
    write16BitInt( 22, numberOfChannels );
    write32BitInt( 24, sampleRate );
    write32BitInt( 28, byteRate );
    write16BitInt( 32, blockAlign );
    write16BitInt( 34, bitsPerSample );
    writeStringIntoBuffer( 36, 'data' );
    write32BitInt( 40, totalDataSize );

    chunk && chunckArr.push(Float32BitSampleArray);

    appendData( 44, view );

    var tempArrayStoreToSendToCallback = chunk ? chunckArr : Float32BitSampleArray;

    Float32BitSampleArray = [];
    chunckArr = [];

    return [ new Blob([ view ], { type: 'audio/wav' }), tempArrayStoreToSendToCallback ];
}