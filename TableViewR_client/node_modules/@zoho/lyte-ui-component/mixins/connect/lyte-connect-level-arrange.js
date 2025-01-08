Lyte.Mixin.register("lyte-connect-level-arrange", {

    setLevels: function (obj_format) {
        var $node = this.$node,
            nonPositionedShapes = {},
            levelData = {},
            availableLevels = [],
            seperate_shapes = [],
            connected_shapes = [],
            connSpace = 20,
            dataCopy = $L.extend(true, {}, obj_format),
            chngLevelData = function (levelArr, level, val) {
                levelArr[level] || (levelArr[level] = []);
                levelArr[level].includes(val) || levelArr[level].push(val);
            },
            findRelative = function (id, level, visited, found) {
                var data = dataCopy[id];
                if (!visited.includes(id)) {
                    visited.push(id);
                    if (data.level == level) {
                        found.push(id);
                    }
                    var cmbData = data.from.concat(data.to);
                    cmbData.filter(function (item, index) { return (cmbData.indexOf(item) == index) }).forEach(function (item) {
                        findRelative(item, level, visited, found);
                    });
                }
            };

        for (var key in obj_format) {
            var cur = obj_format[key],
                to = $L.extend([], cur.to),
                level = parseInt(cur.level),
                id = cur.id,
                validLevel = level != undefined && !isNaN(level),
                prevLevel;// nextAvailLevel( level );

            if (validLevel) {
                availableLevels.indexOf(level) == -1 && availableLevels.push(level);
                connected_shapes.push(id);
            } else {
                seperate_shapes.push(id);
            }

            prevLevel = availableLevels[availableLevels.indexOf(level) - 1];

            to.forEach(function (parent) {//to allow only prevLevel Parent
                var parentData = obj_format[parent];
                if (parentData.level != prevLevel) {
                    var parentInd = cur.to.indexOf(parent),
                        childInd = parentData.from.indexOf(key);

                    cur.to.splice(parentInd, 1);
                    cur.to_position.splice(parentInd, 1);
                    parentData.from.splice(childInd, 1);
                    parentData.from_position.splice(childInd, 1);

                    if (parentData.from.length == 0) {
                        parentData.level != undefined && chngLevelData(nonPositionedShapes, parentData.level, parentData.id);
                        if (parentData.to.length == 0) {
                            var curDataLevel = levelData[parentData.level],
                                index = curDataLevel ? curDataLevel.indexOf(parentData.id) : -1;
                            index != -1 && levelData[parentData.level].splice(index, 1);
                        }
                    }
                }
            });

            if (validLevel) {
                if (cur.to.length) {
                    chngLevelData(levelData, level, key);
                } else {
                    chngLevelData(nonPositionedShapes, level, id);
                }
            }
        }
        for (var level in nonPositionedShapes) {
            var prevLevel = availableLevels[availableLevels.indexOf(parseInt(level)) - 1];
            if (prevLevel != undefined) {
                var defParArr = [];
                levelData[prevLevel].forEach(function (item) {//should be arranged in dom order
                    defParArr.push(item);
                })
                nonPositionedShapes[level].forEach(function (item) {
                    var parentArr = [],
                        minCh,
                        bestPar;
                    findRelative(item, prevLevel, [], parentArr);
                    if (!parentArr.length) {
                        parentArr = defParArr;
                    }
                    parentArr.forEach(function (par) {
                        var comb = dataCopy[par].from.concat(obj_format[par].from),
                            cur = comb.filter(function (item, index) {
                                return (comb.indexOf(item) == index)
                            }),
                            len = cur.length;
                        if (minCh == undefined || minCh > len) {
                            minCh = len;
                            bestPar = obj_format[par];
                        }
                    });
                    if (bestPar) {

                        bestPar.from.push(item);
                        bestPar.from_position.push({ x: 0.5, y: 1 });

                        var cur = obj_format[item];
                        cur.to.push(bestPar.id);
                        cur.to_position.push({ x: 0.5, y: 0 });

                        chngLevelData(levelData, level, item);
                    }
                });
            } else {
                nonPositionedShapes[level].forEach(function (item) {
                    chngLevelData(levelData, level, item);
                })
            }
            prevLevel = level;
        }
        levelData.seperate_shapes = seperate_shapes;

        var connData = {},
            getSide = function (conn, levelArr, src, sideObj) {
                conn.forEach(function (item) {
                    var source = src ? item.src.id : item.target.id,
                        target = src ? item.target.id : item.src.id,
                        trgInd = levelArr.indexOf(target),
                        itemInd = levelArr.indexOf(source),
                        sep = level == 'seperate_shapes',
                        srcLevel = obj_format[source].level,
                        targetLevel = obj_format[target].level,
                        side = 'right';// target is same level and target is in same order as item
                    if (srcLevel > targetLevel) {// target is higher level
                        side = "top";
                    } else if (srcLevel < targetLevel) {// target is lower level
                        side = "bottom";
                    } else if (trgInd == -1) {//conn to sep shape
                        side = sep ? "right" : "left";
                    } else if (trgInd > itemInd) {// target is same level and target is higher in dom order
                        side = sep ? "bottom" : "right";
                    } else if (trgInd < itemInd) {// target is same level and target is lower in dom order
                        side = sep ? "top" : "left";
                    }
                    sideObj[side].push(item);
                })
            },
            setSpace = function (id, side, conn) {
                var count = conn.length,
                    xDir = (side == 'left' || side == 'right'),
                    dim = obj_format[id].dimension[xDir ? 'height' : 'width'],
                    dist = dim / (count + 1),
                    start = dist;
                if (dist < connSpace) {
                    var parts = parseInt(dim / connSpace),
                        lastSpace = dim - (parts * connSpace);
                    start = ((connSpace - lastSpace) / 2) + lastSpace;
                    dist = connSpace;
                }
                for (var i = start; i < dim; i += dist) {
                    connData[id][side][parseFloat((i / dim).toFixed(2))] = 0;
                }
            };
        for (var level in levelData) {
            var levelArr = levelData[level];
            levelArr.forEach(function (item) {
                var connections = $node.getConnections('#' + item),
                    sideObj = { top: [], bottom: [], right: [], left: [] };
                getSide(connections.src, levelArr, true, sideObj);
                getSide(connections.target, levelArr, false, sideObj);
                connData[item] = {
                    top: {},
                    bottom: {},
                    right: {},
                    left: {},
                    levelObj: sideObj
                };
                for (var side in sideObj) {
                    if (sideObj[side].length) {
                        setSpace(item, side, sideObj[side]);
                    }
                }
            });
        }
        return { connected: connected_shapes, seperate: seperate_shapes, connData: connData, levelData: levelData };
    },

    setConnections: function (levelData, to_move) {
        var data = levelData.levelData,
            connData = levelData.connData,
            keys = Object.keys(data).reverse(),
            oppSide = { top: 'bottom', bottom: 'top', right: 'left', left: 'right' },
            _this = this,
            getAvailPos = function (obj, opp) {
                var keys = opp ? Object.keys(obj).reverse() : Object.keys(obj),
                    posCount, retPos;

                keys.forEach(function (level) {
                    if (posCount == undefined || obj[level] < posCount) {
                        posCount = obj[level];
                        retPos = level;
                    }
                });
                obj[retPos]++;
                return parseFloat(retPos);
            };

        keys.shift();//to handle seperate shapes at last
        keys.push('seperate_shapes');

        keys.forEach(function (level) {
            data[level].forEach(function (item) {
                var curData = connData[item],
                    srcPos = to_move[item].position,
                    levelObj = curData.levelObj;
                for (var side in levelObj) {
                    levelObj[side].forEach(function (conn) {
                        if (conn.src.id == item) {
                            var connElem = conn.connection_elem,
                                $connElem = $L(connElem),
                                options = $connElem.data('options'),
                                trgId = conn.target.id,
                                trgPos = to_move[trgId].position,
                                yDir = (side == 'top' || side == 'bottom'),
                                startDir = (yDir && trgPos.left > srcPos.left),
                                connSrcPos = getAvailPos(curData[side], startDir),
                                connTrgPos = getAvailPos(connData[trgId][oppSide[side]], (trgPos.left == srcPos.left || trgPos.top == srcPos.top) ? startDir : !startDir),
                                srcDef = (side == 'top' || side == 'left') ? 0 : 1;
                            trgDef = (side == 'top' || side == 'left') ? 1 : 0;

                            options.src_position = { x: yDir ? connSrcPos : srcDef, y: yDir ? srcDef : connSrcPos };
                            options.target_position = { x: yDir ? connTrgPos : trgDef, y: yDir ? trgDef : connTrgPos };
                            $L(_this.$node).connection('updateConnection', $connElem);
                        }
                    })
                }
            })
        })
    }

});