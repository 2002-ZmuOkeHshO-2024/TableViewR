/**
 * Step indicates the stage or phase of a work within a navigational hierarchy and automatically adds separators between them
 * @component lyte-step
 * @version 1.0.0
 * @methods onClick
 * @utility next,previous,goto
 */

/**
 * @customElement lyte-step-item
 */
/**
 * @customElement lyte-step-head
 */
/**
 * @customElement lyte-step-body
 */

Lyte.Component.register('lyte-step', {
_template:"<template tag-name=\"lyte-step\"> <div onclick=\"{{action('divClick',event,this)}}\"> <template is=\"if\" value=\"{{expHandlers(ltPropType,'!=',&quot;advanced&quot;)}}\"><template case=\"true\"><template is=\"if\" value=\"{{expHandlers(ltPropYield,'==',false)}}\"><template case=\"true\"> <lyte-step-structure class=\"{{ltPropClass}}\" onclick=\"{{action('divClick',event,this)}}\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"array\" index=\"indexVal\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsObject(array),'==',false)}}\"><template case=\"true\"><template is=\"if\" value=\"{{expHandlers(ltPropClass,'==','lyteStepBullet')}}\"><template case=\"true\"> <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick',event,this,array)}}\"> <lyte-step-body> {{array}} </lyte-step-body> <lyte-step-head>{{indexVal}}</lyte-step-head> </lyte-step-item> </template><template case=\"false\"> <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick',event,this,array)}}\"> <lyte-step-body> {{array}} </lyte-step-body> </lyte-step-item> </template></template></template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropClass,'==','lyteStepBullet')}}\"><template case=\"true\"> <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick',event,this,array)}}\"> <lyte-step-body> {{array[ltPropLabel]}} </lyte-step-body> <lyte-step-head>{{array[ltPropOption]}}</lyte-step-head> </lyte-step-item> </template><template case=\"false\"> <lyte-step-item sporder=\"{{indexVal}}\" onclick=\"{{action('onclick',event,this,array)}}\"> <lyte-step-body> {{array[ltPropLabel]}} </lyte-step-body> </lyte-step-item> </template></template></template></template></template> </lyte-step-structure> </template><template case=\"false\"> <lyte-yield yield-name=\"yield\"></lyte-yield> </template></template></template><template case=\"false\"> <lyte-yield class=\"lyteStepAdvanced\" yield-name=\"yield\" lt-prop-content=\"{{dummyContent}}\"></lyte-yield> </template></template> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"text","position":[1,3,0]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"text","position":[1,3,0]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropClass","ltPropData","ltPropSelected","ltPropSkip","ltPropActiveClass","ltPropCompletedClass","ltPropWarningClass","ltPropKeepMarked","ltPropYield","ltPropLabel","ltPropOption","ltPropType","ltPropOffset","ltPropIndex","ltPropDataType","ltPropAria","ltPropAriaValue","dummyContent","widthArr","divWidth","forwardWidth","backwardWidth"],

    init: function () {
        /**
         * @method beforeRender
         * @version 1.0.1
         */
        this.getMethods('beforeRender') && this.executeMethod('beforeRender', this.$node)
    },

    didDestroy: function () {
        delete this.$node.next; delete this.$node.previous; delete this.$node.goto;
        delete this._finalCallback; delete this._transEnd;
        clearTimeout(this._animetime);
    },

    didConnect: function () {
        var type = this.getData('ltPropType') == "advanced";
        this.$node.next = function (state) {
            this.$node.goto(this.data.ltPropSelected + 1, state, true)
        }.bind(this);
        this.$node.previous = function (state) {
            this.$node.goto(this.data.ltPropSelected - 1, state, true)
        }.bind(this);

        if (!type) {
            this.$node.goto = function (number, state, flag) {
                if (this.component.getData('ltPropSkip') || flag) {
                    var elements = this.querySelectorAll('lyte-step-item'), ltPropSelected = this.component.getData('ltPropSelected'), ltPropWarningClass = this.component.getData('ltPropWarningClass');
                    var selectedElement = elements[ltPropSelected], ltPropCompletedClass = this.component.getData('ltPropCompletedClass'), ltPropActiveClass = this.component.getData('ltPropActiveClass')
                    if (number >= -1 && elements.length) {
                        if (state == 'incomplete') {
                            selectedElement.classList.add(ltPropWarningClass)
                        }
                        else {
                            selectedElement.classList.add(ltPropCompletedClass)
                        }
                        selectedElement.classList.remove(ltPropActiveClass)
                        if (number == elements.length) {
                            number--;
                        }
                        else if (number == -1) {
                            number++;
                        }
                        elements[number].classList.add(ltPropActiveClass);
                        if (number == ltPropSelected) {
                            selectedElement.classList.remove(ltPropWarningClass);
                            selectedElement.classList.remove(ltPropCompletedClass);
                        }
                        else {
                            this.component.setData('ltPropSelected', number);
                        }
                    }
                }
            }
        } else {
            this.$node.goto = function (number, state, flag) {
                if (this.getData('ltPropSkip') || flag) {
                    this.moveTo(number, state, this.getData('ltPropSelected'));
                }
            }.bind(this);

            this.$node.refreshStep = this._measureWidth.bind(this, this.constructForward);
        }
        $L.fastdom.measure(function () {
            var fg = _lyteUiUtils.getRTL();
            $L.fastdom.mutate(function () {
                if (fg) {
                    this.$node.classList.add('lyteRTL')
                }
                this.breadcrumbClass.call(this);
            }.bind(this))
        }.bind(this))
        if (type) {
            if (this.getMethods('afterRender')) {
                this._finalCallback = this.executeMethod.bind(this, this.$node);
            }
        } else {
            /**
             * @method afterRender
             * @version 1.0.1
             */
            this.getMethods('afterRender') && this.executeMethod('afterRender', this.$node);
        }

        this._transEnd = this.transfade.bind(this);
    },

    selectedElementFindObs: function (arg) {
        if (this.getData('ltPropType') != "advanced") {
            $L.fastdom.mutate(this.selectedElementFind.bind(this));
        } else if (arg && !this._preventselect) {
            this.$node.goto(arg.newValue, '', true);
            var index = this.getData('ltPropIndex');

            if (arg.newValue < index || arg.newValue > index + this.getData('dummyContent').length) {
                this._enableAnimate = true;
                this.setData('ltPropIndex', arg.newValue);
            }

        }
    }.observes('ltPropSelected').on('didConnect'),

    selectedElementFind : function(){
        var data = this.data,
        selected = data.ltPropSelected,
        active = data.ltPropActiveClass,
        completed = data.ltPropCompletedClass,
        warning = data.ltPropWarningClass,
        items = $L( 'lyte-step-item', this.$node ),
        aria = data.ltPropAria,
        length = data.ltPropKeepMarked ? selected : items.length - 1;

        items.removeClass( active );

        if( aria ){
            items.find( 'a' ).removeAttr( 'aria-current' );
        }

        items.eq( selected ).addClass( active ).removeClass( warning, completed );

        if( aria ){
            items.eq( selected ).find( 'a' ).attr( 'aria-current', data.ltPropAriaValue );
        }

        for( var i = 0; i <= length; i++ ){

            var cur = items.eq( i );

            if( cur.hasClass( warning ) ){
                continue;
            }

            if( i < selected ){
                cur.addClass( completed );
            } else if( i > selected ){
                cur.removeClass( completed, warning );
            }
        }
    },

    ArrayContentChangeObs: function () {
        this.ArrayContentChange.call(this);
    }.observes('ltPropData.[]', 'ltPropData'),

    ArrayContentChange: function () {
        if (this.getData('ltPropSelected') == undefined) {
            this.setData('ltPropSelected', 0)
        }
        else {
            this.selectedElementFind.call(this);
        }
    },

    breadcrumbClassObs: function () {
        this.breadcrumbClass.call(this);
    }.observes('ltPropClass'),

    breadcrumbClass: function () {
        if (this.getData('ltPropType') != "advanced") {
            if (this.data.ltPropYield && this.data.ltPropClass) {
                this.$node.querySelector('lyte-step-structure').classList.add(this.data.ltPropClass)
            }
        }
    },
    data: function () {
        var default_values = _lyteUiUtils.getDefault( 'lyte-step' );

        return {
            //  user data
            /**
             * @componentProperty {lyteStepSlash | lyteStepArrow | lyteStepBullet | lyteStepFlat | lyteStepPlain} ltPropClass=lyteStepSlash
             * @version 1.0.0
             */
            ltPropClass: Lyte.attr("string", { "default": default_values.class || 'lyteStepSlash' }),
            /**
             * @componentProperty {string[] | object[]} ltPropData
             * @default []
             * @version 1.0.0
             */
            ltPropData: Lyte.attr("array", { "default": [] }),
            /**
             * @componentProperty {number} ltPropSelected=0
             * @version 1.0.0
             */
            ltPropSelected: Lyte.attr("number", { "default": default_values.selected || 0 }),
            /**
             * @componentProperty {boolean} ltPropSkip=true
             * @version 1.0.0
             */
            ltPropSkip: Lyte.attr("boolean", { "default": default_values.skip == false ? false : true }),
            /**
             * @componentProperty {string} ltPropActiveClass=lyteActive
             * @version 1.0.0
             */
            ltPropActiveClass: Lyte.attr("string", { "default": default_values.activeClass || 'lyteActive' }),
            /**
             * @componentProperty {string} ltPropCompletedClass=lyteCompleted
             * @version 1.0.0
             */
            ltPropCompletedClass: Lyte.attr("string", { "default": default_values.completedClass || 'lyteCompleted' }),
            /**
             * @componentProperty {string} ltPropWarningClass=lyteWarning
             * @version 1.0.0
             */
            ltPropWarningClass: Lyte.attr("string", { "default": default_values.warningClass || 'lyteWarning' }),
            /**
             * @componentProperty {boolean} ltPropKeepMarked=false
             * @version 1.0.0
             */
            ltPropKeepMarked: Lyte.attr("boolean", { "default": default_values.keepMarked || false }),
            /**
             * @componentProperty {boolean} ltPropYield=false
             * @version 1.0.0
             */
            ltPropYield: Lyte.attr("boolean", { "default": default_values.yield || false }),
            /**
             * @componentProperty {string} ltPropLabel=''
             * @version 1.0.0
             */
            ltPropLabel: Lyte.attr('string', { 'default': default_values.label || '' }),
            /**
             * @componentProperty {string} ltPropOption=''
             * @version 1.0.0
             */
            ltPropOption: Lyte.attr('string', { 'default': default_values.option || '' }),

            /**
             * @componentProperty {default | advanced} ltPropType
             * @version 2.2.6
             */
            ltPropType: Lyte.attr('string', { default: default_values.type }),
            /**
             * @componentProperty {number} ltPropOffset=0
             * @version 2.2.6
             */
            ltPropOffset: Lyte.attr('number', { default: default_values.offset || 0 }),
            /**
             * @componentProperty {number} ltPropIndex=0
             * @version 2.2.6
             */
            ltPropIndex: Lyte.attr('number', { default: default_values.index || 0 }),
            /**
             * @experimental ltPropDataType
             */
            ltPropDataType: Lyte.attr('array', { default: [] }),

            // aria
            /**
             * @componentProperty {boolean} ltPropAria=false
             * @version 3.1.0
             */
            ltPropAria: Lyte.attr('boolean', { default: default_values.aria || false }),
            /**
             * @componentProperty {string} ltPropAriaValue=step
             * @version 3.1.0
             */
            ltPropAriaValue: Lyte.attr('string', { default: default_values.ariaValue || 'step' }),

            // system data

            dummyContent: Lyte.attr('array', { default: [] }),
            widthArr: Lyte.attr('array', { default: [] }),
            divWidth: Lyte.attr('number', { default: 0 }),
            forwardWidth: Lyte.attr('number', { default: 0 }),
            backwardWidth: Lyte.attr('number', { default: 0 })
        }
    },
    actions: {
        'onclick': function (event, Component, data) {
            if ((event.ctrlKey == true || event.metaKey == true || event.which == 2) && event.target.href != undefined && event.target.href.indexOf('javascript:') != -1 && event.target.target == '_blank') { return false; }
            if (this.getMethods('onClick')) {
                this.executeMethod('onClick', Component, this.$node, event, data);
                event.stopPropagation();
            }
        },
        divClick: function (event, div) {
            if (this.getData('ltPropType') != 'advanced') {
                if ((event.ctrlKey == true || event.metaKey == true || event.which == 2) && event.target.href != undefined && event.target.href.indexOf('javascript:') != -1 && event.target.target == '_blank') { return false; }
                if (this.getMethods('onClick') && this.getData('ltPropYield')) {
                    var node = event.target.correspondingElement || event.target;
                    while (node && node != div) {
                        if (node.tagName == 'LYTE-STEP-ITEM') {
                            this.executeMethod('onClick', node, this.$node, event, node.getAttribute('data-value'))
                            break;
                        } else {
                            node = node.parentNode;
                        }
                    }
                }
            } else {
                if (this._transstart) {
                    return;
                }
                var close = $L(event.target).closest('lyte-step-forward');
                if (close.length) {
                    /**
                     * @method onBeforeNavigate
                     * @condition ltPropType advanced
                     * @version 2.2.6
                     */
                    if (this.getMethods('onBeforeNavigate') && this.executeMethod('onBeforeNavigate', 'forward', this.getData('ltPropIndex'), this.$node) == false) {
                        return;
                    }
                    this._enableAnimate = true;
                    this.setData('ltPropIndex', Math.max(0, this.getData('ltPropIndex') + this.getData('dummyContent').length));

                    if (this.getMethods('onNavigate')) {
                        /**
                         * @method onNavigate
                         * @condition ltPropType advanced
                         * @version 2.2.6
                         */
                        this._finalCallback = this.executeMethod.bind(this, 'onNavigate', 'forward', this.getData('ltPropIndex'), this.$node);
                    }
                } else {
                    close = $L(event.target).closest('lyte-step-backward');
                    if (close.length) {
                        if (this.getMethods('onBeforeNavigate') && this.executeMethod('onBeforeNavigate', 'backward', this.getData('ltPropIndex'), this.$node) == false) {
                            return;
                        }
                        this._transstart = true;
                        this._transendback = this.constructBackward;
                        $L('lyte-step-structure', this.$node).on('transitionend', this._transEnd).addClass('lyteStepFade');
                        this.timeout();
                        if (this.getMethods('onNavigate')) {
                            this._finalCallback = this.executeMethod.bind(this, 'onNavigate', 'backward', this.getData('ltPropIndex'), this.$node);
                        }
                    } else {
                        if ((event.ctrlKey == true || event.metaKey == true || event.which == 2) && event.target.href != undefined && event.target.href.indexOf('javascript:') != -1 && event.target.target == '_blank') {
                            return false;
                        }
                        close = $L(event.target).closest('lyte-step-item');
                        if (close.length) {
                            this.getMethods('onClick') && this.executeMethod('onClick', close.get(0), this.$node, event, close.attr('data-value'));
                        }
                    }
                }
            }
        }
    },

    forwardAdd: function (min, width, divWidth, consWid, newArr, data) {
        for (var i = min; i < width.length; i++) {

            if (consWid + width[i] > divWidth) {
                i--;
                break;
            }
            consWid += width[i];
            newArr.push(data[i]);
        }
        return { consWid: consWid, i: i };
    },

    backwardAdd: function (min, width, divWidth, consWid, newArr, data) {
        for (var i = min - 1; i >= 0; i--) {
            if (consWid + width[i] > divWidth) {
                break;
            }
            consWid += width[i];
            newArr.unshift(data[i]);
            min = i;
        }
        return { consWid: consWid, min: min };
    },

    constructBackward: function (forward, backward) {
        forward = forward || $L('lyte-step-forward').get(0);
        backward = backward || $L('lyte-step-backward').get(0);

        var data = this.getData('ltPropData'),
            min = Math.min(data.length, this.getData('ltPropIndex') + this.getData('ltPropOffset')),
            consWid = 0,
            newArr = [],
            width = this.getData('widthArr'),
            forwardWidth = this.getData('forwardWidth'),
            backwardWidth = this.getData('backwardWidth'),
            divWidth = this.getData('divWidth');

        consWid += backwardWidth;

        var ret = this.backwardAdd(min, width, divWidth, consWid, newArr, data);
        consWid = ret.consWid;
        min = ret.min;
        if (min == 0) {
            consWid -= backwardWidth;
            if (backward) {
                backward.classList.add('lyteStepHidden');
            }
        }

        if (consWid < divWidth) {
            var ret = this.forwardAdd((min + newArr.length), width, divWidth, consWid, newArr, data);
            consWid = ret.consWid;
        }
        if (min + newArr.length < data.length) {
            if (forward) {
                forward.classList.remove('lyteStepHidden');
            }
            consWid += forwardWidth;
            // var i = min;
            while (consWid > divWidth && newArr.length) {
                consWid -= width[min + newArr.length];
                // min++;
                newArr.pop();
                // newArr.shift();
            }
        }
        this._prevent = true;
        this.setData('ltPropIndex', min);
        delete this._prevent;
        this._arr = newArr;
        this.transend();
    },

    transend: function () {
        this.setData('dummyContent', this._arr);
        delete this._arr;
        if (this._finalCallback) {
            this._finalCallback();
            delete this._finalCallback;
        }
        this.moveTo(this.getData('ltPropSelected'), '', this.getData('ltPropSelected'), this.getData('ltPropIndex') + this.getData('dummyContent').length == this.getData('ltPropData').length);
        $L('.lyteStepFade', this.$node).removeClass('lyteStepFade')
    },

    constructForward: function (forward, backward) {
        forward = forward || $L('lyte-step-forward').get(0);
        backward = backward || $L('lyte-step-backward').get(0);
        var min = Math.max(0, this.getData('ltPropIndex') - this.getData('ltPropOffset')),
            consWid = 0,
            newArr = [],
            width = this.getData('widthArr'),
            forwardWidth = this.getData('forwardWidth'),
            backwardWidth = this.getData('backwardWidth'),
            divWidth = this.getData('divWidth'),
            data = this.getData('ltPropData');

        if (min != 0) {
            consWid += backwardWidth;
            if (backward) {
                backward.classList.remove('lyteStepHidden');
            }
        } else {
            if (backward) {
                backward.classList.add('lyteStepHidden');
            }
        }

        var ret = this.forwardAdd(min, width, divWidth, consWid, newArr, data),
            i = ret.i;

        consWid = ret.consWid;
        if (i < width.length) {
            while (consWid + forwardWidth > divWidth && i) {
                consWid -= width[i];
                i--;
                newArr.pop();
            }
            if (forward) {
                forward.classList.remove('lyteStepHidden');
            }
        } else {
            if (forward) {
                forward.classList.add('lyteStepHidden')
            }
            if (consWid < divWidth) {
                ret = this.backwardAdd(min, width, divWidth, consWid, newArr, data);
                consWid = ret.consWid;
                min = ret.min;
            }
            if (min == 0 && this.getData('ltPropIndex')) {
                consWid -= backwardWidth;
                consWid = this.forwardAdd(min + newArr.length, width, divWidth, consWid, newArr, data);
            }
        }
        this._prevent = true;
        this.setData('ltPropIndex', min);
        delete this._prevent;

        this._arr = newArr;
        this.transend();
    },

    measureWidth: function () {
        if (this.getData('ltPropType') == "advanced") {
            this._measureWidth(this.constructForward);
        }
    }.on('didConnect'),

    indexObs: function (arg) {
        if (this._prevent) {
            return;
        }
        if (this._enableAnimate) {
            this._transstart = true;
            delete this._enableAnimate;
            this.timeout();
            $L('lyte-step-structure', this.$node).on('transitionend', this._transEnd).addClass('lyteStepFade');
        } else {
            this._measureWidth(this.constructForward);
        }
    }.observes('ltPropIndex', 'ltPropData', 'ltPropData.[]'),

    _measureWidth: function (callback) {
        if (this.getData('ltPropType') == "advanced") {
            var width = [], data = this.getData('ltPropData');
            this.setData('dummyContent', data);

            var forward = $L('lyte-step-forward').get(0),
                backward = $L('lyte-step-backward').get(0);

            if (forward) {
                forward.classList.remove('lyteStepHidden');
            }

            if (backward) {
                backward.classList.remove('lyteStepHidden');
            }

            $L.fastdom.measure(function () {
                var items = $L('lyte-step-item', this.$node);

                for (var i = 0; i < items.length; i++) {
                    var style = getComputedStyle(items.get(i));
                    width[i] = items.get(i).getBoundingClientRect().width + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
                }
                var divWidth = this.$node.querySelector('lyte-step-structure').getBoundingClientRect().width,
                    forwardWidth = 0,
                    backwardWidth = 0;

                if (forward) {
                    forwardWidth = forward.getBoundingClientRect().width;
                    var compsty = getComputedStyle(forward);
                    forwardWidth += (parseFloat(compsty.marginRight) + parseFloat(compsty.marginLeft));
                }

                if (backward) {
                    backwardWidth = backward.getBoundingClientRect().width;
                    var compsty = getComputedStyle(backward);
                    backwardWidth += (parseFloat(compsty.marginRight) + parseFloat(compsty.marginLeft));
                }

                this.setData({
                    divWidth: divWidth,
                    widthArr: width,
                    forwardWidth: forwardWidth,
                    backwardWidth: backwardWidth
                })
                $L.fastdom.mutate(callback.bind(this, forward, backward));
            }.bind(this))
        }
    },

    moveTo: function (number, state, selected, addClass) {
        this._preventselect = true;
        var data = this.getData('ltPropData'),
            dummyContent = this.getData('dummyContent'),
            index = this.getData('ltPropIndex'),
            array = this.getData('ltPropDataType'),
            items = $L('lyte-step-item', this.$node),
            active = this.getData('ltPropActiveClass'),
            completed = this.getData('ltPropCompletedClass'),
            incomplete = this.getData('ltPropWarningClass'),
            keep = this.getData('ltPropKeepMarked');

        addClass && items.eq(-1).addClass('lyteStepLast');

        number = Math.min(Math.max(0, number || 0), data.length - 1);

        if (selected == undefined) {
            for (var i = 0; i < data.length; i++) {
                if (array[i] == 'active') {
                    selected = i;
                }
            }
            if (selected == undefined) {
                this.setData('ltPropSelected', 0);
                selected = 0;
            }
        }

        for (var i = 0; i < data.length; i++) {
            var arrOp = array[i] == undefined ? 'insertAt' : 'replaceAt',
                state2Push;

            if (number != selected && number > selected && i >= selected && i < number) {
                state2Push = state == "incomplete" ? 'incomplete' : 'completed';
            } else {
                if (i == number) {
                    state2Push = "active";
                } else if (i > number) {
                    state2Push = keep ? array[i] || '' : "";
                } else {
                    if (i > selected) {
                        state2Push = state == "incomplete" ? 'incomplete' : 'completed';
                    } else {
                        state2Push = (array[i] == "active" ? "completed" : array[i]) || 'completed';
                    }
                }
            }

            Lyte.arrayUtils(array, arrOp, i, state2Push);
            if (i >= index) {
                if (array[i] == 'active') {
                    items.eq(i - index).removeClass(completed, incomplete).addClass(active);
                } else if (array[i] == "incomplete") {
                    items.eq(i - index).removeClass(completed, active).addClass(incomplete);
                } else if (array[i] == "completed") {
                    items.eq(i - index).removeClass(active, incomplete).addClass(completed);
                } else {
                    items.eq(i - index).removeClass(completed, active, incomplete);
                }
                if (this.data.ltPropAria) {
                    array[i] == 'active' ? items.eq(i - index).find('a').attr('aria-current', this.data.ltPropAriaValue) : items.eq(i - index).find('a').removeAttr('aria-current')
                }
            }
        }
        this.setData('ltPropSelected', number);
        delete this._preventselect;
    },

    aria_obs : function(){
        var data = this.data;

        $L( 'lyte-step-item.' + data.ltPropActiveClass, this.$node ).find( "a" ).attr( "aria-current", data.ltPropAriaValue );
    }.observes( 'ltPropAriaValue' ),

    transfade: function () {
        clearTimeout(this._animetime);
        delete this._animetime;
        delete this._transstart;
        this._measureWidth(this._transendback || this.constructForward);
        delete this._transendback;
        $L('.lyteStepFade', this.$node).off('transitionend');
    },

    returntran: function (prop) {
        var ret = 0;
        if (/(.+)(s|ms)$/.test(prop)) {
            var match = prop.match(/(.+)(s|ms)$/);
            ret = parseFloat(match[1]) * (match[2] == "s" ? 1000 : 1);
        }
        return ret;
    },

    timeout: function () {
        var elem = $L('lyte-step-structure', this.$node).get(0),
            style = getComputedStyle(elem);
        this._animetime = setTimeout(this._transEnd, 10 + this.returntran(style.transitionDuration) + this.returntran(style.transitionDelay));
    }
});

var stepResize = function(evt) {
    clearTimeout(window._stepresize);
    window._stepresize = setTimeout(function () {
        delete window._stepresize;
        var steps = document.getElementsByTagName('lyte-step');
        for (var i = 0; i < steps.length; i++) {
            var comp = steps[i].component;
            comp.data.ltPropType == 'advanced' && comp._measureWidth(comp.constructForward);
        }
    }, 0)
}

window.addEventListener('resize', stepResize, true);
window.addEventListener('orientationchange', stepResize, true);

/**
 * @syntax nonYielded
 * @dollar 0 ["Home","Menu",{"name": "Leads"},{"name": "Contacts"},{"name": "Services"}]
 * <lyte-step lt-prop-data='{{$0}}' lt-prop-label="name"></lyte-step>
 */

/**
 * @syntax yielded
 * <lyte-step lt-prop-yield="true">
 *      <template is="registerYield" yield-name="yield">
 *          <lyte-step-structure>
 *              <lyte-step-item>
 *                  <lyte-step-body>
 *                      Home
 *                  </lyte-step-body>
 *              </lyte-step-item>
 *              <lyte-step-item>
 *                  <lyte-step-body>
 *                      Menu
 *                  </lyte-step-body>
 *              </lyte-step-item>
 *              <lyte-step-item>
 *                  <lyte-step-body>
 *                      Edit
 *                  </lyte-step-body>
 *              </lyte-step-item>
 *              <lyte-step-item>
 *                  <lyte-step-body>
 *                      Save
 *                  </lyte-step-body>
 *              </lyte-step-item>
 *          </lyte-step-structure>
 *      </template>
 *  </lyte-step>
 */

/**
 * @syntax
 * @attribute ltPropYield=true
 * @attribute ltPropClass=lyteStepBullet
 * <lyte-step lt-prop-yield ="true" lt-prop-class = "lyteStepBullet">
 *   <template is="registerYield" yield-name="yield">
 *       <lyte-step-structure>
 *           <lyte-step-item>
 *               <lyte-step-body>Home</lyte-step-body>
 *               <lyte-step-head>1</lyte-step-head>
 *           </lyte-step-item>
 *           <lyte-step-item>
 *               <lyte-step-body>Menu</lyte-step-body>
 *               <lyte-step-head>2</lyte-step-head>
 *           </lyte-step-item>
 *           <lyte-step-item>
 *           <lyte-step-body>Edit</lyte-step-body>
 *               <lyte-step-head>3</lyte-step-head>
 *           </lyte-step-item>
 *           <lyte-step-item>
 *               <lyte-step-body>Save</lyte-step-body>
 *               <lyte-step-head>4</lyte-step-head>
 *           </lyte-step-item>
 *       </lyte-step-structure>
 *   </template>
 *  </lyte-step>
 */

/**
 * @syntax 
 * @attribute ltPropYield=true
 * @attribute ltPropType=advanced
 * <lyte-step lt-prop-class = "lyteStepFlat" lt-prop-type = "advanced">
 *  <template is="registerYield" yield-name="yield">
 *      <lyte-step-structure>
 *          <lyte-step-backward>  backward</lyte-step-backward>
 *               <lyte-step-item data-value = 1>
 *                   <lyte-step-body>
 *                       home
 *                   </lyte-step-body>
 *               </lyte-step-item>
 *              <lyte-step-item data-value = 2>
 *                   <lyte-step-body>
 *                       new
 *                   </lyte-step-body>
 *               </lyte-step-item>
 *              <lyte-step-forward >forward</lyte-step-forward>
 *          </lyte-step-structure>
 *      </template>
 *  </lyte-step>
 */