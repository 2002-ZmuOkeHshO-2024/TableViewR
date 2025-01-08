; (function () {

    var recordStore = [], blockCount = 0;

    function fetchAudio(url, options, rej) {
        return fetch(url, options.fetchOptions).then(function (res) {
            return res.arrayBuffer()
        }).then(function (buff) {
            var context = new AudioContext();
            return context.decodeAudioData(buff)
        }).then(function (audio_buff) {
            return audio_buff.getChannelData(0);
        }).catch(function (err) {
            rej(err);
        });
    }

    function processArr(arr, expected_count) {
        var len = arr.length,
            count_ratio = expected_count / len,
            sum = 0,
            count = 0,
            overflow = 0,
            out = [];

        arr.forEach(function (item) {
            sum += item;
            count += 1;
            overflow += count_ratio;

            if (overflow > 1) {
                out.push(sum / count);
                count = sum = 0;
                overflow -= 1;
            }
        });

        if (count > 0) {
            out.push(sum / count);
        }

        return out;
    }

    function getLimit(canvas, ctx, options, max_hgt, length) {
        var width = options.width,
            height = options.height,
            area_hgt = height - 2 * options.margin,
            scale_hgt = Math.max(max_hgt, area_hgt * options.maxHeightRatio),
            scale = area_hgt / scale_hgt,
            limit = options.progressAnimation ? [Math.floor((options.currentTime * options.result) / options.duration), length] : [length];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = width;
        canvas.height = height;
        ctx.scale(1, scale);
        ctx.translate(0, (1 - scale) * 0.5 * height / scale);

        return limit;
    }

    function drawLineThumb(options, buffer) {

        var width = options.width,
            height = options.height,
            canvas = options.canvas,
            margin = options.margin,
            def_height = options.defaultHeight,
            bufferLength = buffer.length,
            recording = options.recording,
            time = options.time || 7,
            timeOut = options.timeOut || 0,
            ctx = canvas.getContext('2d'),
            processData = 345 * time,
            sliceBuffer = recording ? 1 : (bufferLength / processData),
            bufferData = [],
            max_hgt = 0,
            curRecordData = 0;

        for (let i = 0; i < bufferLength; i += sliceBuffer) {

            var curData = buffer[Math.floor(i)],
                curHeight;

            if (recording) {
                curRecordData = (curData + curRecordData) / 2;
            } else {
                curHeight = Math.max(def_height / 2, Math.abs(curData) * (height - 2 * margin))
                if (max_hgt <= curHeight) {
                    max_hgt = curHeight;
                }
                bufferData.push(curData);
            }
        }

        if (recording) {
            if (recordStore.length >= processData) {
                recordStore.shift();
            }
            recordStore.push(curRecordData);
            max_hgt = 0;
            bufferData = recordStore;
            timeOut = options.timeOut || 8;
        }

        if (window.__times) {
            return;
        }
        window.__times = setTimeout(function () {
            delete window.__times;
            options.result = bufferData.length;

            var limit = getLimit(canvas, ctx, options, max_hgt, bufferData.length),
                start = 0,
                x = 0,
                segmentSize = width / processData;//single segment size

            if (recording) {
                x = segmentSize * (processData - bufferData.length);
            }

            ctx.lineWidth = 1;

            limit.forEach((item, index) => {
                ctx.beginPath();
                for (var i = start; i < item; i++) {
                    var v = bufferData[i],
                        y = (v + 1) * height / 2;

                    if (i == 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += segmentSize;
                }
                ctx.strokeStyle = (options.progressAnimation && index == 0 && options.overlapFillStyle) ? options.overlapFillStyle : options.fillStyle;
                ctx.stroke();
                start = item;
            });
        }, timeOut)
    }

    function drawBarThumb(options, buffer) {

        var result = options.result,
            width = options.width,
            height = options.height,
            canvas = options.canvas,
            margin = options.margin,
            def_height = options.defaultHeight,
            recording = options.recording,
            sample = recording ? 1 : options.sample,
            time = options.time || 7,
            processData = 345 * time,
            blocks = Math.floor(buffer.length / sample),
            ctx = canvas.getContext("2d"),
            audio_array = [],
            getSamples = function (sample, blocks, buffer, arr) {
                for (var i = 0; i < sample; i++) {
                    var min = 0;

                    for (var j = i * blocks; j < (i + 1) * blocks; j++) {
                        min = Math.min(min, buffer[j]);
                    }

                    arr.push(min);
                }
            };

        getSamples(sample, blocks, buffer, audio_array);

        var max_hgt = 0,
            segmentNeed = parseInt(processData / result),
            arr = [],
            line_width;

        if (recording) {
            line_width = width / result;
            if (recordStore.length >= (processData + segmentNeed)) {
                recordStore.splice(0, segmentNeed);
                --blockCount;
            }
            recordStore.push(audio_array[0]);
            var formableBlock = parseInt((recordStore.length) / segmentNeed);
            min = 0;
            if (formableBlock > blockCount) {
                getSamples(formableBlock, segmentNeed, recordStore, arr);
                blockCount++;
            } else {
                return
            }
        } else {
            arr = processArr(audio_array, result);

            arr.forEach(function (item) {
                max_hgt = Math.max(max_hgt, Math.max(def_height / 2, Math.abs(item) * (height - 2 * margin)));
            });
            line_width = width / arr.length;
        }

        var limit = getLimit(canvas, ctx, options, max_hgt, arr.length),
            start = 0,
            x = line_width * (result - arr.length);

        ctx.beginPath();

        limit.forEach((item, index) => {
            for (var i = start; i < item; i++) {
                var cur_height = Math.max(def_height / 2, Math.abs(arr[i]) * (height - 2 * margin));

                if (!recording) {
                    x = line_width * i * 1.2;
                }

                ctx.fillStyle = (options.progressAnimation && index == 0 && options.overlapFillStyle) ? options.overlapFillStyle : options.fillStyle;
                ctx.fillRect(x, (height - cur_height) / 2, line_width, cur_height);

                x += line_width;
            }
            start = item;
        });

    }

    function drawThumb(options, res, buffer) {
        var type = options.type,
            canvas;

        if (type == "bar") {
            canvas = drawBarThumb(options, buffer);
        } else {
            canvas = drawLineThumb(options, buffer);
        }

        res({
            canvas: canvas,
            audio_buffer: buffer
        });
    }

    _lyteUiUtils.generateThumb = function (options) {
        var copied_options = $L.extend({
            sample: 256,
            result: 64,
            width: 100,
            height: 200,
            margin: 20,
            defaultHeight: 5,
            maxHeightRatio: 0.5,
            type: "bar",
            // fillStyle : "#333",
            fetchOptions: {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            }
        }, options);

        if (options.stop) {
            recordStore = [];
            blockCount = 0;
            return;
        }

        return new Promise(function (res, rej) {
            var src = copied_options.src;

            if (typeof src == "string" || options.recording) {
                if (options.buffer) {
                    drawThumb(copied_options, res, options.buffer);
                } else {
                    fetchAudio(src, copied_options, rej).then(drawThumb.bind(this, copied_options, res));
                }
            } else {
                drawThumb(copied_options, res, src);
            }
        });
    };

    _lyteUiUtils.generateProgress = function (options) {
        return this.generateThumb(options);
    }
})();