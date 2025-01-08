( function() {
    var audioContext, intervalId, config, microphone, inputNode, wavProcessingNode, worker, stopped, silenceTimeout;

    /* sometimes somedevices do not give you a 44100 sampling rate so we are hard coding this */
    // var SAMPLING_RATE = 44100;

    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        chunk = undefined;

    $L.media = {};

    var sendBlobToUser = function( event ) {
        var blob = event.data[ 0 ],
        samples = event.data[ 1 ];

        if( stopped && config.onStop ) {
            config.onStop( blob, samples );
        }

        if( config.onEnd ) {
            config.onEnd( blob, samples );
        }

        // var a = document.createElement( 'a' );
        // a.setAttribute( 'download', 'testing' );
        // var url = window.URL.createObjectURL( blob );
        // a.setAttribute( 'href', url );
        // document.body.appendChild( a );
        // a.click();
        // a.remove();
    }

    

    $L.media.record = async function( options ) {
        config = options || {};

        var audioContextConstructor =  window.AudioContext || window.webkitAudioContext,
        basePath = config.workletBasePath || '';

        audioContext = new audioContextConstructor( /* { sampleRate: SAMPLING_RATE } */ );

        chunk = options.chunk;
        stopOnSilence = options.stopOnSilence;
        silenceThreshold = options.silenceThreshold || 0.1;
        silenceDuration = options.silenceDuration || 3000;
        stopped = false;

        microphone = await navigator.mediaDevices.getUserMedia( {
            audio: true
        } );

        registerWorker();

        inputNode = audioContext.createMediaStreamSource( microphone );

        if( isSafari ) {
            useScriptProcessorNode( inputNode.context, inputNode );
        }
        else {
            useAudioWorklet( audioContext, basePath, inputNode );
        }
        
    }

    function useScriptProcessorNode( context, inputNode ) {
        var bufferSize = 4096,
        inputChannel = 1,
        outputChannel = 1, 
        node = ( context.createScriptProcessor || context.createJavascriptProcessor ).call( context, bufferSize, inputChannel, outputChannel );

        inputNode.connect( node );
        node.connect( context.destination );

        node.onaudioprocess = ( audioProcessingEvent ) => {
            for( var i = 0; i < inputChannel; i++ ) {
                var channelData = audioProcessingEvent.inputBuffer.getChannelData( i );

                if( config.onProgress ) {
                    config.onProgress( channelData );
                }

                worker.postMessage( { type: 'data', data: channelData, chunk: chunk } );
            }
        };
    }

    async function useAudioWorklet( audioContext, basePath, inputNode ) {
        await audioContext.audioWorklet.addModule( basePath + 'audioSampleSender.js' );

        wavProcessingNode = new AudioWorkletNode( audioContext, 'audio-sample-processor' );

        inputNode.connect( wavProcessingNode );

        wavProcessingNode.connect( audioContext.destination );

        silenceTimeout = null;

        wavProcessingNode.port.onmessage = function ( e ) {
            if( config.onProgress ) {
                config.onProgress( e.data );
            }

            if (stopOnSilence) {
                let rms = Math.sqrt(e.data.reduce((sum, value) => sum + value * value, 0) / e.data.length);
                if (rms < silenceThreshold) {
                    if (!silenceTimeout && audioContext.state == 'running') {
                        silenceTimeout = setTimeout(() => {
                            $L.media.stop();
                        }, silenceDuration);
                    }
                } else {
                    clearSilenceTimeout();
                }
            }

            worker.postMessage( { type: 'data', data: e.data, chunk: chunk } );
        }

        enableChunking();
    }

    function registerWorker() {
        var basePath = config.workerBasePath || '';

        worker = new Worker( basePath + 'wavProcessor.js' );

        worker.onmessage = sendBlobToUser;
    }

    function enableChunking() {
        var timeslice = config.timeslice;

        if( !isNaN( timeslice ) ) {
            intervalId = setInterval( function() {
                worker.postMessage( { type: 'process' } );
            }, timeslice );
        }
    }

    $L.media.pause = function() {
        clearSilenceTimeout();
        audioContext.suspend();
        window.clearTimeout( intervalId );
    }

    $L.media.resume = function() {
        /* pause, resume only works with this line. 
           Sometimes resuming(resuming after pausing it for a while) is not sending any data to audioWorkletProcessor(input is empty array)
        */ 
        inputNode.connect( wavProcessingNode );
        enableChunking();
        audioContext.resume();        
    }

    $L.media.stop = function() {
        stopped = true;
        clearSilenceTimeout();
        stopMediaStream();
        
        window.clearTimeout( intervalId );

        worker.postMessage( { type: 'process', chunk: chunk } );
    }

    function stopMediaStream() {
        var tracks = microphone.getAudioTracks();

        for( var i = 0; i < tracks.length; i++ ) {
            tracks[ i ].stop();
        }

        audioContext.close();
    }

    function clearSilenceTimeout(){
        if (silenceTimeout) {
            clearTimeout(silenceTimeout);
            silenceTimeout = null;
        }
    }

} )();

