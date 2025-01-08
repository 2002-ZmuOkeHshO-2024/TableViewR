; Lyte.Mixin.register('lyte-connect-suggestion', {
    create_conn: function (side, svg_details, check_overlap, undo_bool) {
        var trg_id = svg_details.target,
            options = svg_details.options,
            src_pos, trg_pos;
        switch (side) {
            case "left":
                src_pos = { "x": 0, "y": 0.5 };
                trg_pos = { "x": 1, "y": 0.5 };
                break;
            case "right":
                src_pos = { "x": 1, "y": 0.5 };
                trg_pos = { "x": 0, "y": 0.5 };
                break;
            case "top":
                src_pos = { "x": 0.5, "y": 0 };
                trg_pos = { "x": 0.5, "y": 1 };
                break;
            case "down":
                src_pos = { "x": 0.5, "y": 1 };
                trg_pos = { "x": 0.5, "y": 0 };
                break;
        }
        options.src_position = options.src_position || src_pos;
        options.target_position = options.target_position || trg_pos;
        this.$node.connect(svg_details.src, trg_id, options, undo_bool);
        if (check_overlap && this.getData("ltPropSuggestionMore") && this.getData("ltPropConnectionType") == "elbow") {
            var _this = this;
            $L.fastdom.measure(function () {
                var trg = trg_id.replace("#", "");
                $L.fastdom.mutate(function () {
                    _this.update_ignore(false);
                    _this._ranges = _this.overall_split([]);
                    _this.update_position(_this.get_element(trg));
                    _this.refresh_other_connectors([trg]);
                });
            });
        }
    },
    remove_data: function (position, avail_pos) {
        position.forEach(function (item) {
            index = avail_pos.indexOf(item);
            if (index == -1) {
                return;
            }
            avail_pos.splice(index, 1);
        });
    },
    avail_dec: function (__this, element, parentChild) {
        var data = __this.$node.getConnections(element),
            return_arr = [],
            return_func = function (param1, param2) {
                data[param1].forEach(function (item) {
                    if (parentChild) {
                        return_arr.push(item.src.id);
                        return_arr.push(item.target.id);
                    } else {
                        var x = item[param2].x,
                            y = item[param2].y,
                            ret;
                        if (x > 0 && x < 1 && y == 0) {
                            ret = "top";
                        } else if (x > 0 && x < 1 && y == 1) {
                            ret = "down";
                        } else if (x == 0 && y >= 0 && y <= 1) {
                            ret = "left";
                        } else if (x == 1 && y >= 0 && y <= 1) {
                            ret = "right";
                        }
                        return_arr.push(ret);
                    }
                });
            };
        if (parentChild) {
            return_func("src")
            return_func("target")
        } else {
            return_func("src", "src_position");
            return_func("target", "target_position");
        }
        return return_arr;
    },
    element_selections: function (_this, cur_id, cur_element, type) {
        var avail_pos = $L.extend([], _this.getData('ltPropSuggestionData')),
            elements = _this.getData('suggestionData'),
            conn_type = {},
            suggest_more = this.getData("ltPropSuggestionMore"),
            destroyCallBck,
            overlap_check = function (__this) {
                //remove directions from avail_pos when it returns true
                var all_positions = $L.extend({}, __this.get_details()),
                    distance = __this.getData("ltPropSuggestionDistance"),
                    min_diff = __this.getData("ltPropMinDiff") / 2,
                    dimensions = __this.getData("ltPropSuggestionDimensions"),
                    has_connection = function (nearest_id, item) {
                        var corr = { "right": "left", "left": "right", "top": "down", "down": "top" };
                        if (nearest_id) {
                            if (__this.avail_dec(__this, __this.get_element(nearest_id), true).includes(cur_id)) {
                                conn_type[item] = "create";
                            }
                            // else if (__this.avail_dec(__this, __this.get_element(nearest_id)).includes(corr[item])) {
                            //     return false;
                            // } 
                            else {
                                conn_type[item] = { "connect": nearest_id };
                            }
                        } else {
                            conn_type[item] = "create";
                        }
                        return true;
                    };

                avail_pos = avail_pos.filter(function (item) {
                    var cur_pos = all_positions[cur_id].position,
                        nearest_val = undefined,
                        nearest_id = undefined;
                    for (key in all_positions) {
                        var _class = all_positions[key].data.class;
                        if (key != cur_id && _class != "lyteConnectHiddenElem" && _class != "lyteConnectFakeHangingItem") {
                            var new_pos = all_positions[key].position,
                                new_left = new_pos.left,
                                new_top = new_pos.top,
                                new_right = new_left + new_pos.width,
                                new_down = new_top + new_pos.height,
                                max_down = (cur_pos.top + cur_pos.height) + min_diff,
                                max_top = cur_pos.top - min_diff,
                                max_right = cur_pos.left + cur_pos.width + min_diff,
                                max_left = cur_pos.left - min_diff,
                                sideObject = {
                                    left: function () {
                                        //only chnge width
                                        max_left = cur_pos.left - distance - (dimensions.width || cur_pos.width) - min_diff;
                                        // max_left = cur_pos.left - distance - cur_pos.width - min_diff,
                                        max_right = cur_pos.left;
                                        if ((new_right > max_left) && (new_left < max_right) && (new_top < max_down) && (new_down > max_top)) {
                                            nearest_val ? new_right > nearest_val ? (nearest_val = new_right, nearest_id = key) : false : (nearest_val = new_right, nearest_id = key);
                                        }
                                    },
                                    right: function () {
                                        //only chnge width
                                        max_left = cur_pos.left + cur_pos.width;
                                        max_right = max_left + distance + (dimensions.width || cur_pos.width) + min_diff;
                                        // max_right = max_left + distance + cur_pos.width + min_diff;
                                        if ((new_right > max_left) && (new_left < max_right) && (new_top < max_down) && (new_down > max_top)) {
                                            nearest_val ? new_left < nearest_val ? (nearest_val = new_left, nearest_id = key) : false : (nearest_val = new_left, nearest_id = key);
                                        }
                                    },
                                    top: function () {
                                        //only chnge height
                                        max_top = cur_pos.top - distance - (dimensions.height || cur_pos.height) - min_diff;
                                        // max_top = cur_pos.top - distance - cur_pos.height - min_diff,
                                        max_down = cur_pos.top;
                                        if ((new_left < max_right) && (new_right > max_left) && (new_top < max_down) && (new_down > max_top)) {
                                            nearest_val ? new_down > nearest_val ? (nearest_val = new_down, nearest_id = key) : false : (nearest_val = new_down, nearest_id = key);
                                        }
                                    },
                                    down: function () {
                                        //only chnge height
                                        max_top = cur_pos.top + cur_pos.height;
                                        max_down = max_top + distance + (dimensions.height || cur_pos.height) + min_diff;
                                        // max_down = max_top + distance + cur_pos.height + min_diff;
                                        if ((new_left < max_right) && (new_right > max_left) && (new_top < max_down) && (new_down > max_top)) {
                                            nearest_val ? new_top < nearest_val ? (nearest_val = new_top, nearest_id = key) : false : (nearest_val = new_top, nearest_id = key);
                                        }
                                    }
                                }
                            sideObject[item]();
                        }
                    };
                    return has_connection(nearest_id, item);
                });
            };
        if (type == "add") {
            this.remove_data(this.avail_dec(this, cur_element), avail_pos);
            overlap_check(this);
        }
        elements.forEach(function (item, index) {
            if (type == "add" && avail_pos.includes(item.direction)) {
                this.set_suggest_data(item, ["class", "type"], [(item.class + " lyteElementSuggestedDisplay"), conn_type[item.direction]]);
                this.remove_data([item.direction], avail_pos);
            } else if (type == "remove" && item.class.includes("lyteElementSuggestedDisplay")) {
                if (item.svg_id != "none") {
                    this.remove_connection(_this, index, _this);
                }
                this.set_suggest_data(item, ["class", "type", "svg_id"], [item.class.replace(/ lyteElementSuggestedDisplay/g, ""), "none", "none"]);
                destroyCallBck = true;
            } else if (type == "add" && suggest_more) {
                this.set_suggest_data(item, ["class", "type"], [(item.class + " lyteElementSuggestedDisplay"), "create_more"]);
            }
        }.bind(this));
        if (destroyCallBck) {
            this.getMethods('onSuggestionDestroy') && this.executeMethod('onSuggestionDestroy', _this.$node);
        }
    },
    get_suggest_details: function (_this, index, hover, event) {
        var suggest_data = _this.getData("suggestionData")[index],
            type = suggest_data.type,
            trg_id = type.connect,
            side = suggest_data.direction,
            src_el = _this.$node,
            src_id = src_el.id;
        if (hover && (this.getMethods('onBeforeSuggestionHover') && this.executeMethod('onBeforeSuggestionHover', _this.$node, trg_id && this.get_element(trg_id), event, this.$node) == false) || this._moved) {
            return;
        }
        this.set_suggest_data(suggest_data, ["svg_id", "class"], [("random_connect_id_" + src_id + "_" + side + "_" + Date.now() + parseInt(Math.random() * 1000)), (suggest_data.class + " lyteElementSuggestedHover")]);
        var svg_id = suggest_data.svg_id;
        if (type == "create" || type == "create_more") {
            trg_id = "random_connect_item_id_" + Date.now() + parseInt(Math.random() * 1000);
            var src_positions = $L.extend({}, this.get_details()[src_id].position),
                suggest_more = this.getData("ltPropSuggestionMore"),
                distance = this.getData("ltPropSuggestionDistance"),
                dimensions = this.getData("ltPropSuggestionDimensions"),
                //set width for left and height for top
                elem_width = (dimensions.width || src_positions.width),
                elem_height = (dimensions.height || src_positions.height),
                elem_padding_left = (dimensions.width && ((dimensions.left || 0) + (dimensions.right || 0))) || 0,
                elem_padding_top = (dimensions.top && ((dimensions.top || 0) + (dimensions.bottom || 0))) || 0,
                sideObject = {
                    left: function () {
                        src_positions.left -= (elem_width + distance + elem_padding_left);
                        src_positions.top += (((src_positions.height) / 2) - ((elem_height + elem_padding_top) / 2));
                    },
                    right: function () {
                        src_positions.left += (src_positions.width + distance);
                        src_positions.top += (((src_positions.height) / 2) - ((elem_height + elem_padding_top) / 2));
                    },
                    top: function () {
                        src_positions.top -= (elem_height + distance + elem_padding_top);
                        src_positions.left += (((src_positions.width) / 2) - ((elem_width + elem_padding_left) / 2));
                    },
                    down: function () {
                        src_positions.top += (src_positions.height + distance);
                        src_positions.left += (((src_positions.width) / 2) - ((elem_width + elem_padding_left) / 2));
                    }
                }
            sideObject[side] && sideObject[side]();
            src_positions.width = elem_width;
            src_positions.height = elem_height;
            var range = this.overall_split([]),
                samp = $L.extend({}, src_positions);
            samp.width += elem_padding_left;
            samp.height += elem_padding_top;
            this.check_overlap(samp, null, range, samp);
            src_positions.left = samp.left;
            src_positions.top = samp.top;
            Lyte.arrayUtils(this.getData('fakeData'), 'push', [{ "id": trg_id, "position": src_positions, "class": 'lyteConnectSuggestedItem' }]);
        }
        this.set_suggest_data(suggest_data, ["target"], [trg_id]);
        this.create_conn(side, { src: "#" + src_id, target: "#" + trg_id, options: { id: svg_id, textBox: false } }, false, true);
        this.$node.querySelector('svg>#' + svg_id).classList.add('lyteConnectSuggestedItem');
    },
    set_suggest_data: function (object, param, class_css) {
        for (var i = 0; i < param.length; i++) {
            Lyte.objectUtils(object, "add", param[i], class_css[i]);
        }
    },
    remove_connection: function (_this, index, conn_item) {
        var suggest_data = _this.getData("suggestionData")[index],
            svg_id = suggest_data.svg_id,
            svg_el = $L(this.$node.querySelector("svg>#" + svg_id));
        suggest_data && this.set_suggest_data(suggest_data, ["class"], [(suggest_data.class.replace(" lyteElementSuggestedHover", ""))]);
        if (svg_id == "none" || !conn_item.classList.contains("lyteConnectionSelected")) {
            return;
        }
        if (!suggest_data.type.connect && this.getData('fakeData').length > 0) {
            Lyte.arrayUtils(this.getData('fakeData'), 'pop');
        }
        svg_el.length && this.$node.disConnect(svg_el, false, true);
        this.set_suggest_data(suggest_data, ["svg_id", "target"], ["none", "none"]);
    },
    actions: {
        element_selection: function (_this, type) {
            var elemSelec = function (ret) {
                if (type == "add") {
                    if (ret == false || $L(_this.$node).hasClass('lyteConnectSuggestionItem')) {
                        return;
                    }
                    _this.$node.classList.add("lyteConnectSuggestionItem");
                }
                this.element_selections(_this, _this.$node.id, _this.$node, type);
            }.bind(this);
            if (type == "add") {
                var ret;
                if (this.getMethods('onBeforeSuggestionCreate')) {
                    ret = this.executeMethod('onBeforeSuggestionCreate', _this.$node);
                }
                if (ret != void 0 && ret.then) {
                    Promise.resolve(ret).then(function (arg) {
                        elemSelec(arg);
                    }.bind(this));
                } else {
                    elemSelec(ret);
                }
            } else {
                elemSelec();
            }
        },
        suggest_enter: function (_this, index, event) {
            if (event.buttons == 0) {
                clearTimeout(this.suggestEnter);
                this.suggestEnter = setTimeout(function () {
                    this.get_suggest_details(_this, index, true, event);
                }.bind(this), this.data.ltPropSuggestionDelay);
            }
        },
        suggest_leave: function (_this, index) {
            clearTimeout(this.suggestEnter)
            this.remove_connection(_this, index, _this.$node);
        },
        suggest_click: function (_this, index, event) {
            if (_this.getData("suggestionData")[index].svg_id == "none") {
                clearTimeout(this.suggestEnter);
                this.get_suggest_details(_this, index);
            }
            $L.fastdom.measure(function () {
                var suggest_data = _this.getData("suggestionData")[index],
                    src_el = _this.$node,
                    side = suggest_data.direction,
                    svg_details = {
                        src: "#" + src_el.id,
                        target: "#" + suggest_data.target,
                        options: {
                            id: suggest_data.svg_id
                        }
                    },
                    svg_el = $L(this.$node.querySelector("svg>#" + suggest_data.svg_id)),
                    connect = suggest_data.type.connect,
                    removeData = function () {
                        this.set_suggest_data(suggest_data, ["class", "svg_id", "target"], [(suggest_data.class.replace(" lyteElementSuggestedHover", "")), "none", "none"]);
                        this.setup_boundary(true);
                        this.unselect(null, src_el);
                    }.bind(this),
                    create = function (retVal) {
                        if (retVal != false) {
                            if (!connect) {
                                svg_details.target = "#" + trg_element.id;
                                this.insert(trg_element);
                            }
                            this.create_conn(side, svg_details, true, false);
                        }
                        removeData();
                    }.bind(this),
                    ret, trg_element;
                $L.fastdom.mutate(function () {
                    if (connect) {
                        this.remove_connection(_this, index, _this.$node);
                    } else {
                        svg_el.length && this.$node.disConnect(svg_el, false, true);
                        trg_element = Lyte.arrayUtils(this.getData('fakeData'), 'pop');
                        delete trg_element.class;
                    }
                    if (this.getMethods('onBeforeSuggestionClick')) {
                        ret = this.executeMethod('onBeforeSuggestionClick', trg_element || this.get_element(svg_details.target.replace("#", "")), svg_details, _this.$node, event, this.$node);
                    }
                    if (ret != void 0 && ret.then) {
                        Promise.resolve(ret).then(function (arg) {
                            create(arg);
                        }.bind(this));
                    } else {
                        create(ret);
                    }
                }.bind(this));
            }.bind(this));
        }
    }
});
