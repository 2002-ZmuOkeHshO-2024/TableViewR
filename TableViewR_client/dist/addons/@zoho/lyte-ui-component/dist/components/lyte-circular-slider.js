Lyte.Component.register("lyte-circular-slider", {
_template:"<template tag-name=\"lyte-circular-slider\" onclick=\"{{action('click',event)}}\" class=\"{{if(ltPropDisabled,'lyteCircularSliderDisabled ','')}}{{if(ltPropReadonly,'lyteCircularSliderReadOnly','')}}\"> <svg class=\"lyteCirSliderSvg\" viewBox=\"0 0 120 120\"> <g class=\"lyteCirSliderWrapper\"> <circle class=\"lyteCirSliderOuterCircle\" cx=\"60\" cy=\"60\" r=\"{{radius}}\" fill=\"none\" stroke=\"{{ltPropProgressBackgroundColor}}\" stroke-width=\"{{ltPropProgressWidth}}\"></circle> <circle class=\"lyteCirSliderStrokeCircle\" cx=\"60\" cy=\"60\" r=\"{{radius}}\" fill=\"none\" stroke=\"{{ltPropProgressColor}}\" stroke-width=\"{{ltPropProgressWidth}}\" stroke-dasharray=\"{{dashArray}}\" stroke-dashoffset=\"{{dashOffset}}\"></circle> </g> <template is=\"if\" lyte-if=\"true\" value=\"{{expHandlers(textValue,'!=',undefined)}}\"></template> </svg> <div class=\"lyteCirSliderHandlerWrapper\" style=\"{{handlerWrapperStyle}}\"> <span class=\"lyteCirSliderHandler\" style=\"{{handlerStyle}}\" lt-prop-title=\"{{if(ltPropTooltip,if(textValue,textValue,ltPropValue),'')}}\" lt-prop-tooltip-config=\"{{if(ltPropTooltip,ltPropTooltipConfig)}}\" lt-prop-tooltip-style=\"{{if(ltPropTooltip,ltPropTooltipStyle)}}\" lt-prop-tooltip-class=\"{{if(ltPropTooltip,ltPropTooltipClass)}}\" aria-valuemin=\"{{ltPropMin}}\" aria-valuemax=\"{{ltPropMax}}\" aria-valuenow=\"{{if(textValue,textValue,ltPropValue)}}\" aria-valuetext=\"{{expHandlers(ltPropAriaLabel,'+',if(textValue,textValue,ltPropValue))}}\" aria-label=\"{{if(textValue,textValue,ltPropValue)}}\" role=\"slider\" onmousedown=\"{{action('mousedown',event)}}\" onkeydown=\"{{action('keydown',event)}}\" tabindex=\"{{if(ltPropDisabled,expHandlers(1,'-'),0)}}\"> </span> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1,1,1]},{"type":"attr","position":[1,1,3]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,0]}]}},"default":{},"svg":true,"actualTemplate":"<template is=\"if\" value=\"{{textValue != undefined}}\"><template case=\"true\" depth=\"1\"><svg><text x=\"60\" y=\"60\" class=\"lyteCircularSliderValue\">{{textValue}}</text></svg></template></template>"},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"handlerWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"handlerStyle"}}}],
_templateAttributes :{"type":"attr","position":[]},
_observedAttributes :["ltPropValue","ltPropMin","ltPropMax","ltPropProgressWidth","ltPropProgressColor","ltPropProgressBackgroundColor","ltPropTextDisplay","ltPropDigits","ltPropStopAtEnd","ltPropStartDirection","ltPropAtend","ltPropDisabled","ltPropReadonly","ltPropTooltip","ltPropTooltipConfig","ltPropTooltipStyle","ltPropTooltipClass","ltPropStep","ltPropAriaLabel","ltPropAnimate","dashOffset","textValue","radius","dashArray","handlerStyle","handlerWrapperStyle"],


    data: function () {
        return {
            ltPropValue: Lyte.attr('number', { default: 0 }),
            ltPropMin: Lyte.attr('number', { default: 0 }),
            ltPropMax: Lyte.attr('number', { default: 100 }),
            ltPropProgressWidth: Lyte.attr('number', { default: 10 }),
            ltPropProgressColor: Lyte.attr('string', { default: "#42a2eb" }),
            ltPropProgressBackgroundColor: Lyte.attr('string', { default: "#DCE0E3" }),
            ltPropTextDisplay: Lyte.attr('string', { default: "value" }),
            ltPropDigits: Lyte.attr('number', { default: 0 }),
            ltPropStopAtEnd: Lyte.attr('boolean', { default: false }),
            ltPropStartDirection: Lyte.attr('string', { default: 'top' }),
            ltPropAtend: Lyte.attr('string', { default: 'default' }),
            ltPropDisabled: Lyte.attr('boolean', { default: false }),
            ltPropReadonly: Lyte.attr('boolean', { default: false }),
            ltPropTooltip: Lyte.attr('boolean', { default: true }),
            ltPropTooltipConfig: Lyte.attr('object', { default: { "position": "top" } }),
            ltPropTooltipStyle: Lyte.attr('string', { default: '' }),
            ltPropTooltipClass: Lyte.attr('string', { default: '' }),
            ltPropStep: Lyte.attr('number', { default: 1 }),
            ltPropAriaLabel: Lyte.attr('string', { default: '' }),
            ltPropAnimate: Lyte.attr('boolean', { default: true }),

            dashOffset: Lyte.attr('number', { default: 345.5749 }),
            textValue: Lyte.attr('string'),
            radius: Lyte.attr('number', { default: 55 }),
            dashArray: Lyte.attr('number', { default: 345.5749 }),
            handlerStyle: Lyte.attr('string', { default: '' }),
            handlerWrapperStyle: Lyte.attr('string', { default: '' })
        }
    },

    didConnect: function () {
        var $node = this.$node,
            rotateVal;
        switch (this.data.ltPropStartDirection) {
            case 'right': {
                rotateVal = 0;
                break;
            }
            case 'bottom': {
                rotateVal = 90;
                break;
            }
            case 'left': {
                rotateVal = 180;
                break;
            }
            default: {
                rotateVal = 270;
            }
        }
        $L('.lyteCirSliderWrapper', $node).get(0).setAttribute("transform", "rotate(" + rotateVal + ", 60, 60)");
        this.rotateVal = rotateVal;
        var halfWidth = this.data.ltPropProgressWidth / 2,
            radius = 60 - halfWidth;
        this.setData('radius', radius);
        this.setData('dashArray', 2 * Math.PI * radius);
        this.setData('handlerStyle', 'transform: translate(' + -(halfWidth + $L('.lyteCirSliderHandler', $node).get(0).offsetWidth / 2) + 'px, -50%)');
        this.changeValue(0, true, false, true);
    },

    didDestroy: function () {
        clearInterval(this.clickInterval);
        ['mainCircle', 'handlerWrapper', 'handler', 'transEnd', 'rotateVal', 'preventClick', 'up', 'move', 'prevAngle', 'actVal', 'avoid', 'prevHandlerPos', 'clickInterval'].forEach(function (item) {
            delete this[item];
        }, this);
    },

    actions: {
        click: function (event) {
            if (this.preventClick || event.target.tagName != 'circle') {
                delete this.preventClick;
                return;
            }
            if (this.getMethods('onBeforeClick') && this.executeMethod('onBeforeClick', event, $node) == false) {
                return;
            }
            this.angleFromPoint(event.x, event.y);
        },

        mousedown: function (event) {
            var $node = this.$node,
                data = this.data;
            if (this.getMethods('onBeforeDragStart') && this.executeMethod('onBeforeDragStart', event, $node) == false) {
                return;
            }
            this.up = this.mouseup.bind(this);
            this.move = this.mousemove.bind(this);
            this.mainCircle = $L('.lyteCirSliderOuterCircle', $node).get(0);
            !data.ltPropStopAtEnd && this.angleFromPoint(event.x, event.y);
            if (this.prevAngle == undefined) {
                var bcr = $L('.lyteCirSliderHandler', $node).get(0).getBoundingClientRect();
                if (data.ltPropValue == data.ltPropMin) {
                    this.prevAngle = 0;
                } else {
                    this.prevAngle = this.angleFromPoint(bcr.x + (bcr.width / 2), (bcr.y + (bcr.height / 2)), false, true).angle;
                }
            }
            $L($node).addClass('lyteCircularSliderDrag');
            this.getMethods('onDragStart') && this.executeMethod('onDragStart', event, $node);
            document.addEventListener('mousemove', this.move);
            document.addEventListener('mouseup', this.up);
        },

        keydown: function (event) {
            var data = this.data,
                value = data.ltPropValue,
                step = data.ltPropStep,
                updVal;
            if (this.getMethods('onBeforeKeydown') && this.executeMethod('onBeforeKeydown', event, this.$node) == false) {
                return;
            }
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowRight': {
                    var newVal = value + step;
                    updVal = this.checkVal(newVal);
                    break;
                }
                case 'ArrowDown':
                case 'ArrowLeft': {
                    var newVal = data.ltPropDigits ? value - step : Math.floor(this.actVal) - step;
                    updVal = this.checkVal(newVal);
                    break;
                }
                case 'Home': {//fn left
                    updVal = data.ltPropMin;
                    break;
                }
                case 'End': {
                    updVal = data.ltPropMax;
                    break;
                }
            }
            if (updVal != undefined) {
                this.changeValue(updVal, false, false, false, true);
                event.preventDefault();
            }
        }
    },

    valObs: function (args) {
        if (this.avoid) {
            delete this.avoid;
            return;
        }
        if (args) {
            this.changeValue(this.data.ltPropValue, true);
        } else {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.changeValue(this.data.ltPropValue, true);
                })
            }, 16)
        }
    }.observes('ltPropValue').on('didConnect'),

    changeValue: function (custVal, fromObs, setOnlyText, override, avoidAnimation) {//this performs the value change
        var data = this.data,
            min = data.ltPropMin,
            max = data.ltPropMax,
            $node = this.$node,
            newVal = this.checkVal(custVal),
            atend = data.ltPropAtend;
        if (!setOnlyText && !override && (newVal != custVal)) {
            this.setData('ltPropValue', newVal);
        } else {
            var textType = data.ltPropTextDisplay,
                digits = data.ltPropDigits,
                setVal = digits ? parseFloat(custVal).toFixed(digits) : parseInt(custVal),
                percent,
                valueChanged,
                textValue;
            if (!data.ltPropStopAtEnd && !fromObs && (setVal == max || setVal == min)) {
                atend == 'end' && (setVal = max);
                atend == 'start' && (setVal = min);
            }
            percent = (setVal - min) / (max - min);
            if (textType == "value") {
                textValue = setVal;
            } else if (textType == 'percent') {
                var prctVal = Math.round(percent * 100);
                textValue = prctVal + '%';
            }
            if (setOnlyText) {
                this.setData('textValue', textValue);
            } else {
                valueChanged = this.data.ltPropValue != setVal;
                if (!fromObs && valueChanged) {
                    this.avoid = true;
                    this.setData('ltPropValue', setVal);
                }
                this.actVal = custVal;
                $L.fastdom.measure(function () {
                    var handlerPos = this.rotateVal + (percent * 360),
                        allowAnimation = !avoidAnimation && this.prevHandlerPos && (Math.abs(this.prevHandlerPos - handlerPos) > 10),
                        animation;
                    $L.fastdom.mutate(function () {
                        if (allowAnimation) {
                            animation = this.animateSliderHandler();
                        }
                        if (!animation) {
                            this.setData('textValue', textValue);
                        }
                        this.prevHandlerPos = handlerPos;
                        this.setData('dashOffset', (1 - percent) * (data.dashArray));//dash offset
                        this.setData('handlerWrapperStyle', 'transform: rotate(' + handlerPos + 'deg)');//handler rotation
                        valueChanged && this.getMethods('onValueChange') && this.executeMethod('onValueChange', setVal, $node);
                    }.bind(this));
                }.bind(this));
            }
        }
    },

    angleFromPoint: function (x, y, drag, readonly) {
        var pos = (this.mainCircle && this.mainCircle.getBoundingClientRect()) || $L('.lyteCirSliderOuterCircle', this.$node).get(0).getBoundingClientRect(),
            angle = Math.atan2((y - (pos.y + (pos.height / 2))), (x - (pos.x + (pos.width / 2)))) * (180 / Math.PI),
            data = this.data,
            anglediff,
            value;
        angle < 0 && (angle += 360);
        angle += 360 - this.rotateVal;
        angle > 360 && (angle -= 360);
        anglediff = angle - (this.prevAngle == undefined ? 0 : this.prevAngle);
        data.ltPropStopAtEnd && drag && Math.abs(anglediff) > 30 && (angle = anglediff < 0 ? 360 : 0);
        if (!readonly && this.prevAngle == angle && this.transEnd) {
            this.transitionend();
        }
        value = data.ltPropMin + (Math.abs(data.ltPropMax - (data.ltPropMin)) * (angle / 360));
        if (readonly) {
            return { angle: angle, value: value };
        }
        this.prevAngle = angle;
        this.changeValue(value);
    },

    mousemove: function (event) {
        this.angleFromPoint(event.x, event.y, true);
    },

    mouseup: function (event) {
        document.removeEventListener('mousemove', this.move);
        document.removeEventListener('mouseup', this.up);
        delete this.move;
        delete this.up;
        delete this.mainCircle;
        this.preventClick = true;
        $L(this.$node).removeClass('lyteCircularSliderDrag');
        this.getMethods('onDragEnd') && this.executeMethod('onDragEnd', event, this.$node);
    },

    checkVal: function (value) {
        var data = this.data,
            atend = data.ltPropAtend,
            max = data.ltPropMax,
            min = data.ltPropMin;
        if (value == undefined || isNaN(value)) {
            return min;
        }
        if (value < max && value > min) {
            return value;
        }
        if (data.ltPropStopAtEnd) {
            if (value > max) {
                value = max;
            } else if (value < min) {
                value = min;
            }
        } else {
            if (value == max || value == min) {
                atend == 'end' && (value = max)
                atend == 'start' && (value = min)
            }
            if (value > max) {
                value = min + Math.abs(value - max);
            } else if (value < min) {
                value = max - Math.abs(min - value);
            }
        }
        return value;
    },

    transitionend: function (event) {
        setTimeout(() => {
            requestAnimationFrame(() => {
                $L(this.$node).removeClass('lyteCircularSliderAnimation');
                this.handlerWrapper.removeEventListener('transitionend', this.transEnd);
                delete this.transEnd;
                delete this.handlerWrapper;
                delete this.handler;
                clearInterval(this.clickInterval);
                $L('.lyteCirSliderHandler', this.$node).get(0).focus();
                this.getMethods('onAnimationEnd') && this.executeMethod('onAnimationEnd', event, this.$node);
                this.changeValue(this.data.ltPropValue, false, true);
            })
        })
    },

    animateSliderHandler: function () {
        if (this.data.ltPropAnimate) {
            var firstTime = true;
            if (this.transEnd) {
                firstTime = false;
                this.handlerWrapper.removeEventListener('transitionend', this.transEnd);
            }
            $L(this.$node).addClass('lyteCircularSliderAnimation');
            this.handlerWrapper = $L('.lyteCirSliderHandlerWrapper', this.$node).get(0);
            if (!parseFloat(getComputedStyle(this.handlerWrapper).transitionDuration)) {
                delete this.handlerWrapper;
                $L(this.$node).removeClass('lyteCircularSliderAnimation');
                return;
            }
            this.transEnd = this.transitionend.bind(this);
            this.handlerWrapper.addEventListener('transitionend', this.transEnd);
            this.handler = $L('.lyteCirSliderHandler', this.$node).get(0);
            firstTime && this.getMethods('onAnimationStart') && this.executeMethod('onAnimationStart', $node);
            clearInterval(this.clickInterval);
            this.clickInterval = setInterval(function () {
                var handlerPos = this.handler.getBoundingClientRect();
                this.changeValue(this.angleFromPoint(handlerPos.x + handlerPos.width / 2, handlerPos.y + handlerPos.height / 2, false, true).value, false, true);
            }.bind(this));
            return true;
        }
    }
})