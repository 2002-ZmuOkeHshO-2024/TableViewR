Lyte.Mixin.register("lyte-connect-circle-positioning", {

    circle_arrange: function (obj_format, dimension, frm_didConnect) {
        var levelData = this.getMethods('onBeforeCircleArrange') && this.executeMethod('onBeforeCircleArrange', obj_format, this.$node),
            maxDim = this.data.ltPropMinDiff,
            to_move = {},
            prevStartX = 0,
            max,minDist;
        for (var id in obj_format) {
            var cur = obj_format[id],
                dim = cur.dimension;
            maxDim = Math.max(Math.sqrt(dim.width * dim.width + dim.height * dim.height), maxDim);//assuming all will have same dim
            to_move[id] = {
                id: id,
                position: {
                    left: 0,
                    top: 0
                },
                dimension: dim,
                old_position: cur.position
            }
        }

        minDist = levelData.distance || maxDim * 1.5;

        levelData.data.forEach(function (structure) {
            var prevRad = 0, prevStartAngle, curMin, prevMax = max, updX;

            max = void 0;
            structure.forEach(function (arr, index) {
                var len = arr.length, curMaxDim = 0;

                if (!(index == 0 && len == 1)) {
                    var radius = prevRad + minDist,
                        distance = (2 * Math.PI * radius) / len,
                        angle = 360 / len,
                        curStartAngle = prevStartAngle == void 0 ? 270 : prevStartAngle;

                    if (distance < minDist) {
                        radius += (len * (minDist - distance)) / (2 * Math.PI)//adding space in circumference and converting into radius
                    }

                    prevStartAngle = (curStartAngle + angle / 2) % 360;
                    prevRad = radius;

                    arr.forEach(function (item) {
                        var dim = to_move[item].dimension,
                            tempAng = curStartAngle * (Math.PI / 180),
                            x = parseFloat((radius * Math.cos(tempAng).toFixed(2)) - dim.width / 2),
                            y = parseFloat((radius * Math.sin(tempAng).toFixed(2)) - dim.height / 2);
                        
                        to_move[item].position = {
                            left: x,
                            top: y
                        }

                        max = Math.max(max, x) || x;
                        curMin = Math.min(curMin, x) || x;

                        curStartAngle = (curStartAngle + angle) % 360;

                        // curMaxDim = Math.max(Math.sqrt(dim.width * dim.width + dim.height * dim.height), curMaxDim);
                    });
                    // curMaxDim && (minDist = curMaxDim * 1.5);
                } else {
                    var item = to_move[arr[0]],
                        pos = item.position,
                        dim = item.dimension,
                        x = pos.left - dim.width / 2,
                        y = pos.top - dim.height / 2;
                    item.position = {
                        left: x,
                        top: y
                    }

                    max = Math.max(max, x) || x;
                    curMin = Math.min(curMin, x) || x;
                }
            });
            updX = prevStartX + (prevMax - curMin) + minDist;
            if (updX) {
                structure.forEach(function (arr) {
                    arr.forEach(function (item) {
                        to_move[item].position.left += updX;
                    })
                })
                prevStartX = updX;
            }
        });

        this.set_positions(to_move, dimension, frm_didConnect, frm_didConnect && this.data.ltPropRenderWithArrange, obj_format);

        this.getMethods("onArrange") && this.executeMethod("onArrange", to_move, !!frm_didConnect, this.$node);

    }

});