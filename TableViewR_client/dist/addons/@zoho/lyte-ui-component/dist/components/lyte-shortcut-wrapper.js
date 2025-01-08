/**
 * Displays hovercard with shortcut for originElement
 * @component lyte-shortcut-wrapper
 * @version 3.104.0
 * @methods (from @3.106.0) :  beforeRender, afterRender, onHovercardShow, onHovercardHide, onHovercardBeforeHide, onBeforeHovercardShow
 * @dependencies lyte-shortcut, lyte-hovercard (lyte-popover, lyte-wormhole)
 */

Lyte.Component.register("lyte-shortcut-wrapper", {
_template:"<template tag-name=\"lyte-shortcut-wrapper\"> <lyte-hovercard lt-prop-auto-show=\"true\" lt-prop-origin-elem=\"{{ltPropOriginElem}}\" lt-prop-popover-wrapper-class=\"{{ltPropPopoverWrapperClass}}\" lt-prop-placement=\"{{ltPropPlacement}}\" lt-prop-class=\"{{ltPropClass}}\" lt-prop-show-delay=\"{{ltPropShowDelay}}\" lt-prop-hide-delay=\"{{ltPropHideDelay}}\" lt-prop-max-display-time=\"{{ltPropMaxDisplayTime}}\" before-render=\"{{method('onBeforeRender')}}\" after-render=\"{{method('onAfterRender')}}\" on-hovercard-show=\"{{method('hovercardShow')}}\" on-hovercard-hide=\"{{method('hovercardHide')}}\" on-before-hovercard-show=\"{{method('beforeHovercardShow')}}\" on-hovercard-before-hide=\"{{method('hovercardBeforeHide')}}\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"hovercard\" key=\"{{shortcutKeys}}\" title=\"{{titleToDisplay}}\" properties=\"{{properties}}\"></lyte-yield> </template><template case=\"false\"> <div class=\"\"> {{titleToDisplay}} </div> <div class=\"lyteWrapperContent\"> {{shortcutKeysToDisplay}} </div> </template></template> </lyte-hovercard-content> </template> </lyte-hovercard> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"text","position":[3,1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropYield","ltPropClass","ltPropShowDelay","ltPropHideDelay","ltPropMaxDisplayTime","ltPropOriginElem","ltPropPlacement","ltPropPopoverWrapperClass","shortcutKeys","shortcutKeysToDisplay","titleToDisplay","properties"],

    data: function () {
        return {
            /**
             * @componentProperty {boolean} ltPropDisplayKeysInHovercard=true
            * @version 3.106.0
             */
            'ltPropYield': Lyte.attr('boolean', {
                'default': false
            }),
            /** 
             * @componentProperty {number} ltPropClass=''
             * @version 3.107.0
             */
            'ltPropClass': Lyte.attr('string', { 'default': _lyteUiUtils.resolveDefaultValue('lyte-hovercard', 'class', '') }),
            /** 
             * @componentProperty {number} ltPropShowDelay=0
             * @version 3.107.0
             */
            'ltPropShowDelay': Lyte.attr('number', { 'default': 0 }),
            /** 
             * @componentProperty {number} ltPropHideDelay=0
             * @version 3.107.0
             */
            'ltPropHideDelay': Lyte.attr('number', { 'default': 0 }),
            /** 
             * @componentProperty {number} ltPropMaxDisplayTime=5000
             * @version 3.107.0
             */
            'ltPropMaxDisplayTime': Lyte.attr('number', { 'default': 5000 }),
            /**
             * @componentProperty {string} ltPropOriginElem
             * OriginElement Query for hovercard
             * @version 3.104.0
            */
            'ltPropOriginElem': Lyte.attr('string', { 'default': '' }),
            /** 
             * @componentProperty {string} ltPropPlacement=''
             * @version 3.106.0
            */
            'ltPropPlacement': Lyte.attr('string', { 'default': '' }),
            /**
             * @componentProperty {string} ltPropPopoverWrapperClass
             * @version 3.106.0
             */
            'ltPropPopoverWrapperClass': Lyte.attr('string', { 'default': _lyteUiUtils.resolveDefaultValue('lyte-hovercard', 'popoverWrapperClass', '') }),

            /**
             * The keys for which the shortcut has been registered
             * @version 3.104.0
             */
            'shortcutKeys': Lyte.attr('string', {
                'default': ''
            }),
            /**
             * The formatted keys to display in hovercard
             * @version 3.104.0
             */
            'shortcutKeysToDisplay': Lyte.attr('string', {
                'default': ''
            }),
            /**
             * The title for the hovercard
             * @version 3.104.0
             */
            'titleToDisplay': Lyte.attr('string', {
                'default': ''
            }),
            /** 
             * The user-given hovercard entry
             * @version 3.106.0
            */
            'properties': Lyte.attr('object', { 'default': {} })
        }
    },
    actions: {
        // Functions for event handling
    },
    methods: {
        // Functions which can be used as callback in the component.
        onBeforeRender: function (hovercard) {
            var res = this.callMethod('beforeRender', hovercard);
            if (!res) {
                return false
            }
            return true
        },
        onAfterRender: function (hovercard) {
            var res = this.callMethod('afterRender', hovercard);
            if (!res) {
                return false
            }
            return true
        },
        hovercardShow: function (hovercard) {
            var res = this.callMethod('onHovercardShow', hovercard);
            if (!res) {
                return false
            }
            return true
        },
        hovercardHide: function (hovercard) {
            var res = this.callMethod('onHovercardHide', hovercard);
            if (!res) {
                return false
            }
            return true
        },
        beforeHovercardShow: function (hovercard) {
            var res = this.callMethod('onBeforeHovercardShow', hovercard);
            if (!res) {
                return false
            }
            return true
        },
        hovercardBeforeHide: function (hovercard) {
            var res = this.callMethod('onHovercardBeforeHide', hovercard);
            if (!res) {
                return false
            }
            return true
        }
    },
    callMethod: function (callbackName, hovercard) {
        if (this.getMethods(callbackName)) {
            var res = this.executeMethod(callbackName, this.$node, hovercard);
            if (!res) {
                return false
            }
        }
        return true
    }
});