/**
 * Renders a multi-dropdown
 * @component lyte-multi-dropdown
 * @version 3.0.0
 * @methods onShow,onBeforeShow,onScroll,onPositionChanged,onChange,beforeSelect,onHide,onBeforeHide,onAdd,onBeforeAdd,onRemove,onBeforeRemove,onOptionSelected
 * @dependencies lyte-dropdown,lyte-checkbox,lyte-text,lyte-hovercard
 */

Lyte.Component.register("lyte-multi-dropdown", {
_template:"<template tag-name=\"lyte-multi-dropdown\"> <template is=\"if\" value=\"{{ltPropSearch}}\"><template case=\"true\"> <lyte-search lt-prop-component=\"dropdown\" lt-prop-query-selector=\"{&quot;scope&quot;:&quot;#dropBody{{multiDropId}}&quot;, &quot;search&quot;:&quot;lyte-drop-item&quot;}\"></lyte-search> </template></template> <template is=\"if\" value=\"{{expHandlers(ltPropType,'==','checkbox')}}\"><template case=\"true\"> <lyte-dropdown lt-prop-options=\"{{ltPropData}}\" lt-prop-disabled-list=\"{{ltPropDisabledList}}\" lt-prop-disabled=\"{{ltPropDisabled}}\" lt-prop-user-value=\"{{ltPropUserValue}}\" lt-prop-system-value=\"{{ltPropSystemValue}}\" lt-prop-selected-list=\"{{ltPropSelected}}\" lt-prop-position=\"{{ltPropPosition}}\" lt-prop-type=\"multiple\" lt-prop-no-result=\"\" lt-prop-prevent-parent-scroll=\"{{ltPropPreventParentScroll}}\" lt-prop-label=\"{{ltPropLabel}}\" lt-prop-label-class=\"{{ltPropLabelClass}}\" lt-prop-direction=\"{{ltPropDirection}}\" on-remove=\"{{method('closeButtonClicked')}}\" on-before-add=\"{{method('defaultBeforeAdd')}}\" on-add=\"{{method('defaultAdd')}}\" on-option-selected=\"{{method('onOptionSelected')}}\" on-show=\"{{method('onShow')}}\" on-before-show=\"{{method('onBeforeShow')}}\" on-hide=\"{{method('onHide')}}\" on-before-hide=\"{{method('onBeforeHide')}}\" on-position-changed=\"{{method('onPositionChanged')}}\" before-select=\"{{method('beforeSelect')}}\" on-change=\"{{method('onChange')}}\" on-after-render=\"{{method('onAfterRender')}}\" on-scroll=\"{{method('onScroll')}}\" on-search=\"{{method('onSearch')}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"><lyte-yield yield-name=\"yield\"></lyte-yield></template><template case=\"false\"><lyte-drop-button id=\"{{multiDropId}}\"> <template is=\"if\" value=\"{{showPlace}}\"><template case=\"true\"><span class=\"lyteDropPlaceholderMultiple\">{{ltPropPlaceholder}}</span></template><template case=\"false\"><div class=\"lyteMultiDropSelectedText\"> <template is=\"if\" value=\"{{ltPropTag}}\"><template case=\"true\"> <ul class=\"lyteMultipleSelect\"> <template items=\"{{dropButtonArray}}\" item=\"item\" index=\"index\" is=\"for\"> <li data-value=\"{{item[ltPropSystemValue]}}\"> <span class=\"lyteDropdownVisible\" lt-prop-title=\"\" lt-prop-tooltip-config=\"{&quot;position&quot;:&quot;bottom&quot;,&quot;appearance&quot;:&quot;box&quot;,&quot;margin&quot;:5,&quot;keeptooltip&quot;:true}\" lt-prop-tooltip-class=\"\" mouseenter=\"lyte-dropdown => toolTipConfig\"> <lyte-text lt-prop-value=\"{{item[ltPropUserValue]}}\" lt-prop-tooltip-config=\"{ &quot;position&quot; : &quot;bottom&quot; }\"> </lyte-text> </span> <lyte-drop-remove tabindex=\"0\" data-value=\"{{item[ltPropSystemValue]}}\" class=\"lyteCloseIcon\"></lyte-drop-remove> </li> </template> <template is=\"if\" value=\"{{hoverList.length}}\"><template case=\"true\"> <li class=\"lyteMultiDropdownNmoreElem\" id=\"{{lyteUiGetMultiDropNMoreId()}}\" tabindex=\"0\" onfocus=\"{{action('moreTagFocused',event)}}\" lyte-hovercard=\"true\"> + {{hoverList.length}} More </li> </template></template> </ul> </template><template case=\"false\"> <template is=\"if\" value=\"{{ltPropShowCount}}\"><template case=\"true\"><lyte-text lt-prop-array=\"{{multiTextArray}}\" lt-prop-hovercard=\"{&quot;placement&quot;:&quot;right&quot;,&quot;class&quot;: &quot;{{ltPropHovercardClass}}&quot;}\" lt-prop-suffix=\" and <span class ='prefixClass'>{0} others</span>\" lt-prop-min-count=\"1\"></lyte-text></template><template case=\"false\"> {{multiText}} </template></template> </template></template> </div></template></template> </lyte-drop-button></template></template> <template is=\"if\" value=\"{{ltPropDataYield}}\"><template case=\"true\"><lyte-drop-box onclick=\"{{action('multiRemoveItem')}}\" class=\"lyteMultiDropdownCheckBoxTypeDropbox\"> <lyte-yield yield-name=\"lytedropheaderyield\"></lyte-yield> <lyte-drop-body id=\"dropBody{{multiDropId}}\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(item)}}\"><template case=\"true\"> <lyte-drop-group> <lyte-drop-label>{{lyteUiReturnOnlyKey(item)}}</lyte-drop-label> <template is=\"for\" items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subItem\" index=\"indexval\"> <lyte-drop-item data-value=\"{{subItem[ltPropSystemValue]}}\"> <lyte-checkbox lt-prop-tabindex=\"-1\" lt-prop-label=\"{{subItem[ltPropUserValue]}}\"></lyte-checkbox> </lyte-drop-item> </template> </lyte-drop-group> </template><template case=\"false\"> <lyte-drop-item data-value=\"{{item[ltPropSystemValue]}}\"> <lyte-checkbox lt-prop-tabindex=\"-1\" lt-prop-label=\"{{item[ltPropUserValue]}}\" lt-prop-yield=\"true\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-yield yield-name=\"lytedropboxyield\" drop-item=\"{{item}}\"></lyte-yield> </template> </lyte-checkbox> </lyte-drop-item> </template></template></template> </lyte-drop-body> </lyte-drop-box></template><template case=\"false\"><lyte-drop-box onclick=\"{{action('multiRemoveItem')}}\" class=\"lyteMultiDropdownCheckBoxTypeDropbox\"> <lyte-yield yield-name=\"lytedropheaderyield\"></lyte-yield> <lyte-drop-body id=\"dropBody{{multiDropId}}\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(item)}}\"><template case=\"true\"> <lyte-drop-group> <lyte-drop-label>{{lyteUiReturnOnlyKey(item)}}</lyte-drop-label> <template is=\"for\" items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subItem\" index=\"indexval\"> <lyte-drop-item data-value=\"{{subItem[ltPropSystemValue]}}\"> <lyte-checkbox lt-prop-tabindex=\"-1\" lt-prop-label=\"{{subItem[ltPropUserValue]}}\"></lyte-checkbox> </lyte-drop-item> </template> </lyte-drop-group> </template><template case=\"false\"> <lyte-drop-item data-value=\"{{item[ltPropSystemValue]}}\"> <lyte-checkbox lt-prop-tabindex=\"-1\" lt-prop-label=\"{{item[ltPropUserValue]}}\"></lyte-checkbox> </lyte-drop-item> </template></template></template> </lyte-drop-body> </lyte-drop-box></template></template> </template> </lyte-dropdown> <template is=\"if\" value=\"{{expHandlers(expHandlers(ltPropYield,'!'),'&amp;&amp;',nMoreTagShown)}}\"><template case=\"true\"><lyte-hovercard lt-prop-popover-wrapper-class=\"lyteMultiDropdownTagHovercard\" lt-prop-origin-elem=\"#{{lyteUiGetMultiDropNMoreId()}}\" lt-prop-max-width=\"250px\" lt-prop-auto-show=\"true\" lt-prop-placement=\"bottom top\" lt-prop-id=\"lyteHoverCardFor{{multiDropId}}\" on-before-hovercard-show=\"{{method('onBeforeNtagShow')}}\" on-hovercard-before-hide=\"{{method('onNtagHoverHidden')}}\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content class=\"lyteMultiDropdownHovercardContent\"> <template is=\"if\" value=\"{{ltPropMoreOptionsTagView}}\"><template case=\"true\"> <ul class=\"lyteMultipleSelect\"> <template items=\"{{hoverList}}\" item=\"item\" index=\"index\" is=\"for\"> <li data-value=\"{{item[ltPropSystemValue]}}\"> <span class=\"lyteDropdownVisible\" lt-prop-title=\"\" lt-prop-tooltip-config=\"{&quot;position&quot;:&quot;bottom&quot;,&quot;appearance&quot;:&quot;box&quot;,&quot;margin&quot;:5,&quot;keeptooltip&quot;:true}\" lt-prop-tooltip-class=\"\" mouseenter=\"lyte-dropdown => toolTipConfig\"> <lyte-text lt-prop-value=\"{{item[ltPropUserValue]}}\" lt-prop-tooltip-config=\"{ &quot;position&quot; : &quot;bottom&quot; }\"> </lyte-text> </span> <lyte-multi-drop-remove tabindex=\"0\" data-value=\"{{item[ltPropSystemValue]}}\" lt-prop-origin-elem=\"#{{multiDropId}}\" class=\"lyteCloseIcon\"></lyte-multi-drop-remove> </li> </template> </ul> </template><template case=\"false\"> <template items=\"{{hoverList}}\" item=\"item\" index=\"index\" is=\"for\"> <lyte-text lt-prop-value=\"{{item[ltPropUserValue]}}\" lt-prop-tooltip-config=\"{ &quot;position&quot; : &quot;bottom&quot; }\"> </lyte-text> <br> </template> </template></template> </lyte-hovercard-content> </template> </lyte-hovercard></template></template> <template is=\"if\" value=\"{{expHandlers(expHandlers(expHandlers(expHandlers(ltPropYield,'!'),'&amp;&amp;',expHandlers(ltPropTag,'!')),'&amp;&amp;',expHandlers(ltPropShowCount,'!')),'&amp;&amp;',expHandlers(ltPropHideHovercard,'!'))}}\"><template case=\"true\"><lyte-hovercard lt-prop-class=\"{{ltPropHovercardClass}}\" lt-prop-origin-elem=\" #{{multiDropId}}\" lt-prop-max-width=\"250px\" lt-prop-auto-show=\"true\" lt-prop-placement=\"right\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content class=\"lyteMultiDropdownHovercardContent\"> {{unescape(multiTextForHovercard)}} </lyte-hovercard-content> </template> </lyte-hovercard></template></template> </template><template case=\"false\"> <lyte-dropdown lt-prop-type=\"multiple\" lt-prop-options=\"{{ltPropData}}\" lt-prop-disabled=\"{{ltPropDisabled}}\" lt-prop-disabled-list=\"{{ltPropDisabledList}}\" lt-prop-user-value=\"{{ltPropUserValue}}\" lt-prop-system-value=\"{{ltPropSystemValue}}\" lt-prop-selected-list=\"{{ltPropSelected}}\" lt-prop-position=\"{{ltPropPosition}}\" lt-prop-no-result=\"\" lt-prop-tabindex=\"-1\" lt-prop-prevent-parent-scroll=\"{{ltPropPreventParentScroll}}\" lt-prop-label=\"{{ltPropLabel}}\" lt-prop-label-class=\"{{ltPropLabelClass}}\" lt-prop-direction=\"{{ltPropDirection}}\" on-before-add=\"{{method('multiBeforeAdd')}}\" on-add=\"{{method('multiAdd')}}\" on-remove=\"{{method('closeButtonClicked')}}\" on-option-selected=\"{{method('onOptionSelected')}}\" on-show=\"{{method('onShow')}}\" on-before-show=\"{{method('onBeforeShow')}}\" on-hide=\"{{method('onHide')}}\" on-before-hide=\"{{method('onBeforeHide')}}\" on-position-changed=\"{{method('onPositionChanged')}}\" before-select=\"{{method('beforeSelect')}}\" on-change=\"{{method('onChange')}}\" on-after-render=\"{{method('onAfterRender')}}\" on-scroll=\"{{method('onScroll')}}\" on-search=\"{{method('onSearch')}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"><lyte-yield yield-name=\"yield\"></lyte-yield></template><template case=\"false\"><lyte-drop-button id=\"{{multiDropId}}\"> <template is=\"if\" value=\"{{showPlace}}\"><template case=\"true\"><span class=\"lyteDropPlaceholderMultiple\">{{ltPropPlaceholder}}</span></template><template case=\"false\"><div class=\"lyteMultiDropSelectedText\"> <template is=\"if\" value=\"{{ltPropTag}}\"><template case=\"true\"> <ul class=\"lyteMultipleSelect\"> <template items=\"{{dropButtonArray}}\" item=\"item\" index=\"index\" is=\"for\"> <li data-value=\"{{item[ltPropSystemValue]}}\"> <span class=\"lyteDropdownVisible\" lt-prop-title=\"\" lt-prop-tooltip-config=\"{&quot;position&quot;:&quot;bottom&quot;,&quot;appearance&quot;:&quot;box&quot;,&quot;margin&quot;:5,&quot;keeptooltip&quot;:true}\" lt-prop-tooltip-class=\"\" mouseenter=\"lyte-dropdown => toolTipConfig\"> <lyte-text lt-prop-value=\"{{item[ltPropUserValue]}}\" lt-prop-tooltip-config=\"{ &quot;position&quot; : &quot;bottom&quot; }\"> </lyte-text> </span> <lyte-drop-remove tabindex=\"0\" data-value=\"{{item[ltPropSystemValue]}}\" class=\"lyteCloseIcon\"></lyte-drop-remove> </li> </template> <template is=\"if\" value=\"{{hoverList.length}}\"><template case=\"true\"> <li class=\"lyteMultiDropdownNmoreElem\" id=\"{{lyteUiGetMultiDropNMoreId()}}\" tabindex=\"0\" onfocus=\"{{action('moreTagFocused',event)}}\" lyte-hovercard=\"true\"> + {{hoverList.length}} More </li> </template></template> </ul> </template><template case=\"false\"> <template is=\"if\" value=\"{{ltPropShowCount}}\"><template case=\"true\"><lyte-text lt-prop-array=\"{{multiTextArray}}\" lt-prop-hovercard=\"{&quot;placement&quot;:&quot;right&quot;,&quot;class&quot;: &quot;{{ltPropHovercardClass}}&quot;}\" lt-prop-suffix=\" and <span class ='prefixClass'>{0} others</span>\" lt-prop-min-count=\"1\"> </lyte-text></template><template case=\"false\"> {{multiText}} </template></template> </template></template> </div></template></template> </lyte-drop-button></template></template> <template is=\"if\" value=\"{{ltPropDataYield}}\"><template case=\"true\"><lyte-drop-box onclick=\"{{action('multiRemoveItem')}}\" class=\"lyteMultiDropdownDropbox\"> <lyte-yield yield-name=\"lytedropheaderyield\"></lyte-yield> <lyte-drop-body id=\"dropBody{{multiDropId}}\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(item)}}\"><template case=\"true\"> <lyte-drop-group> <lyte-drop-label>{{lyteUiReturnOnlyKey(item)}}</lyte-drop-label> <template is=\"for\" items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subItem\" index=\"indexval\"> <lyte-drop-item data-value=\"{{subItem[ltPropSystemValue]}}\">{{subItem[ltPropUserValue]}}</lyte-drop-item> </template> </lyte-drop-group> </template><template case=\"false\"> <lyte-drop-item data-value=\"{{item[ltPropSystemValue]}}\"> <lyte-yield yield-name=\"lytedropboxyield\" drop-item=\"{{item}}\"></lyte-yield> </lyte-drop-item> </template></template></template> </lyte-drop-body> </lyte-drop-box></template><template case=\"false\"><lyte-drop-box onclick=\"{{action('multiRemoveItem')}}\" class=\"lyteMultiDropdownDropbox\"> <lyte-yield yield-name=\"lytedropheaderyield\"></lyte-yield> <lyte-drop-body id=\"dropBody{{multiDropId}}\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(item)}}\"><template case=\"true\"> <lyte-drop-group> <lyte-drop-label>{{lyteUiReturnOnlyKey(item)}}</lyte-drop-label> <template is=\"for\" items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subItem\" index=\"indexval\"> <lyte-drop-item data-value=\"{{subItem[ltPropSystemValue]}}\">{{subItem[ltPropUserValue]}}</lyte-drop-item> </template> </lyte-drop-group> </template><template case=\"false\"> <lyte-drop-item data-value=\"{{item[ltPropSystemValue]}}\"> {{item[ltPropUserValue]}} </lyte-drop-item> </template></template></template> </lyte-drop-body> </lyte-drop-box></template></template> </template> </lyte-dropdown> <template is=\"if\" value=\"{{expHandlers(expHandlers(ltPropYield,'!'),'&amp;&amp;',nMoreTagShown)}}\"><template case=\"true\"><lyte-hovercard lt-prop-popover-wrapper-class=\"lyteMultiDropdownTagHovercard\" lt-prop-origin-elem=\"#{{lyteUiGetMultiDropNMoreId()}}\" lt-prop-auto-show=\"true\" lt-prop-placement=\"bottom top\" lt-prop-max-width=\"250px\" lt-prop-id=\"lyteHoverCardFor{{multiDropId}}\" on-before-hovercard-show=\"{{method('onBeforeNtagShow')}}\" on-hovercard-before-hide=\"{{method('onNtagHoverHidden')}}\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content class=\"lyteMultiDropdownHovercardContent\"> <template is=\"if\" value=\"{{ltPropMoreOptionsTagView}}\"><template case=\"true\"> <ul class=\"lyteMultipleSelect\"> <template items=\"{{hoverList}}\" item=\"item\" index=\"index\" is=\"for\"> <li data-value=\"{{item[ltPropSystemValue]}}\"> <span class=\"lyteDropdownVisible\" lt-prop-title=\"\" lt-prop-tooltip-config=\"{&quot;position&quot;:&quot;bottom&quot;,&quot;appearance&quot;:&quot;box&quot;,&quot;margin&quot;:5,&quot;keeptooltip&quot;:true}\" lt-prop-tooltip-class=\"\" mouseenter=\"lyte-dropdown => toolTipConfig\"> <lyte-text lt-prop-value=\"{{item[ltPropUserValue]}}\" lt-prop-tooltip-config=\"{ &quot;position&quot; : &quot;bottom&quot; }\"> </lyte-text> </span> <lyte-multi-drop-remove tabindex=\"0\" data-value=\"{{item[ltPropSystemValue]}}\" lt-prop-origin-elem=\"#{{multiDropId}}\" class=\"lyteCloseIcon\"></lyte-multi-drop-remove> </li> </template> </ul> </template><template case=\"false\"> <template items=\"{{hoverList}}\" item=\"item\" index=\"index\" is=\"for\"> <lyte-text lt-prop-value=\"{{item[ltPropUserValue]}}\" lt-prop-tooltip-config=\"{ &quot;position&quot; : &quot;bottom&quot; }\"> </lyte-text> <br> </template> </template></template> </lyte-hovercard-content> </template> </lyte-hovercard></template></template> <template is=\"if\" value=\"{{expHandlers(expHandlers(expHandlers(expHandlers(ltPropYield,'!'),'&amp;&amp;',expHandlers(ltPropTag,'!')),'&amp;&amp;',expHandlers(ltPropShowCount,'!')),'&amp;&amp;',expHandlers(ltPropHideHovercard,'!'))}}\"><template case=\"true\"><lyte-hovercard lt-prop-class=\"{{ltPropHovercardClass}}\" lt-prop-origin-elem=\"#{{multiDropId}}\" lt-prop-max-width=\"250px\" lt-prop-auto-show=\"true\" lt-prop-placement=\"right\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content class=\"lyteMultiDropdownHovercardContent\"> {{unescape(multiTextForHovercard)}} </lyte-hovercard-content> </template> </lyte-hovercard></template></template> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]}]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"componentDynamic","position":[0]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"attr","position":[0,3,1]},{"type":"for","position":[0,3,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"registerYield","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[0,3]},{"type":"componentDynamic","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"attr","position":[0,3,1]},{"type":"for","position":[0,3,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[0,3]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]}]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"componentDynamic","position":[0]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"attr","position":[0,3,1]},{"type":"for","position":[0,3,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[0,3]},{"type":"componentDynamic","position":[0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"attr","position":[0,3,1]},{"type":"for","position":[0,3,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[0,3]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]}},"default":{}}],
_observedAttributes :["ltPropData","ltPropMaxCount","ltPropSelected","ltPropDisabledList","ltPropDisabled","ltPropYield","ltPropType","ltPropTag","multiTextArray","dropButtonArray","hoverList","multiText","multiTextForHovercard","ltPropSearch","numInText","ltPropUserValue","ltPropSystemValue","ltPropShowCount","showPlace","ltPropDataYield","ltPropPlaceholder","ltPropPreventParentScroll","ltPropHideHovercard","ltPropMoreOptionsTagView","ltPropBoxClass","ltPropPosition","ltPropHovercardClass","multiDropId","nMoreTagShown","ltPropLabel","ltPropLabelClass","ltPropDirection"],

	init: function () {
		this.calculate = this.calculate.bind(this);
		window.addEventListener('resize', this.calculate, true);
	},
	data: function () {
		return {

			/**
			 * @componentProperty {array} ltPropData
			 * @default []
			 * @version 3.0.0
			 */

			'ltPropData': Lyte.attr('array', { 'default': [] }),

			/**
			 * @componentProperty {number} ltPropMaxCount
			 * @default undefined
			 * @version 3.0.0
			 */

			'ltPropMaxCount': Lyte.attr('number', { 'default': undefined }),

			/**
			 * @componentProperty {array} ltPropSelected
			 * @default []
			 * @version 3.0.0
			 */

			'ltPropSelected': Lyte.attr('array', { 'default': [] }),

			/**
			 * @componentProperty {array} ltPropDisabledList
			 * @default []
			 * @version 3.0.0
			 */

			'ltPropDisabledList': Lyte.attr('array', { 'default': [] }),

			/**
			 * @componentProperty {boolean} ltPropDisbled
			 * @default false
			 * @version 3.0.0
			 */

			'ltPropDisabled': Lyte.attr('boolean', { 'default': false }),

			/**
			 * @componentProperty {boolean} ltPropYield
			 * @default false
			 * @version 3.0.0
			 */

			'ltPropYield': Lyte.attr('boolean', { 'default': false }),

			/**
			 * @componentProperty {string} ltPropType
			 * @default 'default'
			 * @version 3.0.0
			*/

			'ltPropType': Lyte.attr('string', { "default": 'default' }),
			'ltPropTag': Lyte.attr('boolean', { 'default': false }),

			'multiTextArray': Lyte.attr('array', { 'default': [] }),
			'dropButtonArray': Lyte.attr('array', { 'default': [] }),
			'hoverList': Lyte.attr('array', { 'default': [] }),

			'multiText': Lyte.attr('string', { 'default': "" }),

			// 'ltPropClear': Lyte.attr('boolean',{'default':true}),

			'multiTextForHovercard': Lyte.attr('string', { 'default': "" }),
			'ltPropSearch': Lyte.attr('boolean', { 'default': false }),

			'numInText': Lyte.attr('number', { 'default': 0 }),

			/**
			 * @componentProperty {string} ltPropUserValue
			 * @default ''
			 * @version 3.0.0
			 */

			'ltPropUserValue': Lyte.attr('string', { 'default': '' }),

			/**
			 * @componentProperty {string} ltPropSystemValue
			 * @default ''
			 * @version 3.0.0
			 */

			'ltPropSystemValue': Lyte.attr('string', { 'default': '' }),

			/**
			 * @componentProperty {boolean} ltPropShowCount
			 * @default false
			 * @version 3.0.0
			 */

			'ltPropShowCount': Lyte.attr('boolean', { 'default': false }),

			'showPlace': Lyte.attr('boolean', { 'default': true }),

			/**
			 * @componentProperty {boolean} ltPropDataYield
			 * @default false
			 * @version 3.0.0
			 */

			'ltPropDataYield': Lyte.attr('boolean', { 'default': false }),

			/**
			 * @componentProperty {string} ltPropPlaceholder
			 * @default 'Select Value'
			 * @version 3.0.0
			 */

			'ltPropPlaceholder': Lyte.attr('string', { 'default': 'Select Value' }),

			/**
			 * @componentProperty {boolean} ltPropPreventParentScroll
			 * @default false
			 * @version 3.0.0
			 */

			'ltPropPreventParentScroll': Lyte.attr('boolean', { 'default': false }),

			/**
			 * @componentProperty {boolean} ltPropHideHovercard
			 * @default false
			 * @version 3.0.0
			 */

			'ltPropHideHovercard': Lyte.attr('boolean', { 'default': false }),

			'ltPropMoreOptionsTagView': Lyte.attr('boolean', { 'default': false }),

			'ltPropBoxClass': Lyte.attr('string', { default: '' }),

			'ltPropPosition': Lyte.attr('string', { default: 'down'} ),

			'ltPropHovercardClass': Lyte.attr('string', {default: ''}),

			'multiDropId': Lyte.attr('string', {default: 'lyteMultiDropButton0'}),
			
			'nMoreTagShown': Lyte.attr('boolean', {default: false}),

			'ltPropLabel': Lyte.attr('string', { 'default': '' }),

			'ltPropLabelClass': Lyte.attr('string', { 'default': '' }),

			'ltPropDirection': Lyte.attr('string', { default: 'vertical' })
		}
	},
	actions: {
		multiRemoveItem: function(){
			if ((event.target.tagName == "LYTE-DROP-ITEM" &&
				event.target.classList.contains('lyteDropdownActive')) ||
				($L(event.target).closest('lyte-drop-item')[0]
					  && $L(event.target).closest('lyte-drop-item')[0].classList.contains('lyteDropdownActive'))){

				if(event && event.stopPropagation ){
					event.stopPropagation();
				}

				var cont=event.target;
				if(event.target.tagName!="LYTE-DROP-ITEM"){
					cont=$L(cont).closest('lyte-drop-item')[0];
				}

				var selList=$L(this.$node).find('lyte-dropdown')[0].getData('ltPropSelectedList');
				var currValue=(cont.getAttribute('data-value'));
				var disabledList = this.getData('ltPropDisabledList');
				var sys = this.getData('ltPropSystemValue');

				if (disabledList.includes(currValue)) {	//when a item is already in selected list and already disabled, this prevents to unselect that item
					return;
				}

				var itemToBeRemoved;
				selList.forEach(function (listItem, index) {
					if (listItem[sys] === currValue) {
						itemToBeRemoved = listItem;
					};
				});
				var multicalbck = $L(this.$node).find('lyte-dropdown')[0].component.childComp.querySelectorAll("lyte-drop-item[data-value='" + currValue + "']")[0];
				var dropCtxt = $L(this.$node).find('lyte-dropdown')[0].component;

				if (this.getMethods('onBeforeRemove')) {
					var ret = this.executeMethod('onBeforeRemove', event, currValue, dropCtxt.getData('ltPropSelected'), this, 'click', multicalbck);

					if (ret === false) {
						if(this.getData('ltPropType')==='checkbox'){
							$L(cont).find('lyte-checkbox')[0].setData('ltPropChecked',true);
						}
						return false;
					}
				}
				if(itemToBeRemoved){
					Lyte.arrayUtils($L(this.$node).find('lyte-dropdown')[0].getData('ltPropSelectedList'),'removeObjects',itemToBeRemoved);
				}

				if(this.getMethods('onRemove')){
					this.executeMethod('onRemove',event,currValue,dropCtxt.getData('ltPropSelected'),this,'click',multicalbck);
				}
			}
		},
		clearAll: function(){
			while($L(this.$node).find('lyte-dropdown')[0].getData('ltPropSelectedList').length>0){
				Lyte.arrayUtils($L(this.$node).find('lyte-dropdown')[0].getData('ltPropSelectedList'),'pop');
				Lyte.arrayUtils(this.getData('multiTextArray'),'pop');
			};
			this.setData('multiText', '');
		},
		moreTagFocused: function (event) {
			var hovercard = $L(this.$node).find('lyte-dropdown')[0].querySelector("lyte-hovercard");
			hovercard.component.setData('ltPropShow', true);
		}
	},

	methods: {
		closeButtonClicked: function (event, removedItem, dropSelectedArray, dropdown, eventType, dropItem) {
			if (this.getData('ltPropType') === 'checkbox') {
				// User value is being pushed to multi text array
				var dropItem = $L(this.$node).find('lyte-dropdown')[0].querySelectorAll("lyte-drop-item[data-value='" + removedItem + "']")[0];
				if (dropItem) {
					var checkbox = dropItem.querySelector('lyte-checkbox');
					if (checkbox) {
						checkbox.setAttribute('lt-prop-checked', false);
					}
				}
			}
			if (this.getMethods('onRemove')) {
				this.executeMethod('onRemove', event, removedItem, dropSelectedArray, dropdown, this, 'click', dropItem);
			}
		},

		defaultBeforeAdd: function (event, selected, ltSelected, cthis, item) {

			if(event.target.tagName==="LYTE-DROP-ITEM"){
				if($L(event.target).find('lyte-checkbox')[0].getData('ltPropChecked')){
					_lyteUiUtils.multiDropEvent = event;
					$L(event.target).find('lyte-checkbox')[0].setData('ltPropChecked','false');
					return false;
				}
				else
				{
					$L(item).find('lyte-checkbox')[0].setData('ltPropChecked','true') ;
				}
			}

			var selList=cthis.$node.getData('ltPropSelectedList');
			var count=(selList.length);

			if(count>=parseInt(this.getData('ltPropMaxCount'))){
				$L(item).find('lyte-checkbox')[0].setData('ltPropChecked','false') ;
				return false;
			}
			if(this.getMethods('onBeforeAdd')){
				var ret = this.executeMethod('onBeforeAdd',event,selected,ltSelected,cthis,item);

				if( ret === false ){
					$L(item).find('lyte-checkbox')[0].setData('ltPropChecked',false) ;
					return false;
				}
			}
		},
		defaultAdd: function(event,selected,ltSelected,cthis,item){

			this.setData('showPlace', 'false');
			this.RemoveAndAddSelection(item);

			if (this.getMethods('onAdd')) {
				this.executeMethod('onAdd',event,selected,ltSelected,this,item);
			}
		},

		multiBeforeAdd: function(event,selected,ltSelected,cthis,item){
			var selList=cthis.$node.getData('ltPropSelectedList');
			var count=(selList.length);

			if(count>=parseInt(this.getData('ltPropMaxCount'))){
				return false;
			}

			if(this.getMethods('onBeforeAdd')){
				var ret = this.executeMethod('onBeforeAdd',event,selected,ltSelected,cthis,item);

				if( ret === false ){
					return false;
				}
			}

		},

		multiAdd: function(event,selected,ltSelected,cthis,item){
			this.setData('showPlace','false');
			this.RemoveAndAddSelection(item);

			if (this.getMethods('onAdd')) {
				this.executeMethod('onAdd',event,selected,ltSelected,this,item);
			}

		},

		onBeforeNtagShow: function () {
			var dropDown = $L(this.$node).find('LYTE-DROPDOWN')[0];
			var isOpen = dropDown.ltProp('isOpen');
			if (isOpen) {
				dropDown.close();
			}
			return true;
		},
		onNtagHoverHidden: function (hovercard, event) {
			if (document.activeElement.tagName !== 'BODY') {
				var tabIndex = this.$node.getAttribute('tabindex');
				if (!tabIndex) {
					this.$node.setAttribute('tabindex', '0');
				}
				this.$node.focus()
			}
			return true;
		},
		onOptionSelected: function () {},
		onShow: function () {},
		onBeforeShow: function () {},
		onHide: function () {},
		onBeforeHide: function () {},
		onPositionChanged: function () {},
		beforeSelect: function () {},
		onChange: function () {},
		onScroll: function () {},
		onSearch: function () {},
		onAfterRender: function () {}
	},

	updateBoxClass: function (change) {
		var oldValue = change ? (change.oldValue ? change.oldValue : false) : false;
		var cls = this.getData('ltPropBoxClass');
		var box = this.$node.querySelector('lyte-dropdown').component.childComp || this.$node.querySelector('lyte-drop-box');
	
		if (oldValue) {
			$L(box).removeClass(oldValue);
		}
	
		if (cls) {
			$L(box).addClass(cls);
		}
	
	}.observes('ltPropBoxClass').on('didConnect'),

	checkboxCheck: function( val, bool ){

			//checking the checkbox if ltPropSelected is changed through js
			var drop = $L(this.$node).find('lyte-dropdown')[0].component;
			var par;

			if( drop && drop.childComp ){
				par = drop.childComp;
			}
			else{
				par = drop.$node.querySelector('lyte-drop-body');
			}
			if( !drop || !par ){ return; }
			var item = par.querySelector("lyte-drop-item[data-value='" + val +"']");
			if( item ){
				var chkbox = item.querySelector('lyte-checkbox');
			}
			if( chkbox && chkbox.getData('ltPropChecked') !== bool ){
				chkbox.setData('ltPropChecked',bool);
			}
	},

	RemoveAndAddSelection( item ){
		var nextElement=item.nextElementSibling,nextParent,prevElem=item.previousElementSibling;
		var parent = item.parentElement;
		if( parent ){
			nextParent = parent.nextElementSibling;
		}

		if(parent.tagName === 'LYTE-DROP-GROUP' && !item.nextElementSibling && nextParent &&
			nextParent.tagName === 'LYTE-DROP-GROUP' && nextParent.children && nextParent.children[1] &&
				nextParent.children[1].classList && nextParent.children[1].classList.contains('lyteDropdownSelection')){
					nextParent.children[1].classList.remove('lyteDropdownSelection');
					item.classList.add('lyteDropdownSelection');
		}
		else if(nextElement && nextElement.classList && nextElement.classList.contains('lyteDropdownSelection')){
			nextElement.classList.remove('lyteDropdownSelection');
			item.classList.add('lyteDropdownSelection');
		}
		else if(prevElem && prevElem.classList && prevElem.classList.contains('lyteDropdownSelection')){
			prevElem.classList.remove('lyteDropdownSelection');
			item.classList.add('lyteDropdownSelection');
		}
	},

	getMaxWidth: function (node, parentElement) {
		var maxWidthValue = window.getComputedStyle($L(node).find('lyte-drop-button')[0]).maxWidth;
		if (maxWidthValue === "none") {
			var maxWidthValue = node.style.maxWidth ? node.style.maxWidth : 300;
		}
		if ( maxWidthValue && maxWidthValue.includes && maxWidthValue.includes('%')) {
			// Get the percentage value
			var percentage = parseFloat(maxWidthValue);
			// Get the width of the parent element
			var parentWidth = parentElement.offsetWidth;
			// Calculate the maxWidth based on the percentage of the parent width
			return (percentage / 100) * parentWidth;
		} else {
			// If not a percentage, parse as float (assuming px or similar unit)
			return parseFloat(maxWidthValue);
		}
	},

	updateButton: function( change ){
		if( !this.getData('ltPropSelected') ){	//if selected is undefined, setting it to empty arr
			this.setData('ltPropSelected',[]);
		}
			var changedItem = change.insertedItems ? change.insertedItems : change.removedItems;
			if( !changedItem ){
				changedItem = change.newValue;
			}
			if( !changedItem ){
				return;
			}
			if( change.newValue || change.oldValue ){
				while( this.getData('multiTextArray').length > 0 ){
					Lyte.arrayUtils(this.getData('multiTextArray'),'pop');
				}
			}
			changedItem.forEach(function( item ){
				var usr=this.getData('ltPropUserValue');
				var sys=this.getData('ltPropSystemValue');

				var updateValue = item[usr];
				if(this.getData('ltPropDataYield') ){
					var data=this.getData('ltPropData');

					for( var i=0;i<data.length;i++ ){
						if( data[i][sys]==item[sys] ){
							updateValue = data[i][usr] ;
							break;
						}
					}
				}
				if( change.insertedItems && updateValue && this.getData( 'multiTextArray' ).indexOf( updateValue ) === -1  ){
					Lyte.arrayUtils( this.getData( 'multiTextArray' ), 'push', updateValue );
				}
				else if( change.removedItems  ){
					for( var i = 0; i < this.getData( 'multiTextArray' ).length; i++ ) {
						if( this.getData( 'multiTextArray' )[ i ] == updateValue ) {
							Lyte.arrayUtils( this.getData( 'multiTextArray' ), 'removeAt', i, 1 );
							break;
						}
					}
				}
				else if( (change.newValue || change.oldValue)  ){
					Lyte.arrayUtils( this.getData( 'multiTextArray' ), 'push', updateValue );
				}

			}.bind(this));

			if( this.getData('ltPropType')=='checkbox'){
				this.getData('ltPropData').forEach( function( element ){
					var usr = this.getData('ltPropUserValue');
					var sys = this.getData('ltPropSystemValue');
					// if( !this.getData('ltPropDisabledList').includes(element[sys])){
						this.checkboxCheck( element[this.getData('ltPropSystemValue')], this.getData('multiTextArray').includes(element[usr]) );
					// }
				}.bind(this));
			}

			if(this.getData('ltPropSelected').length > 0 && this.getData('showPlace')){
				this.setData('showPlace',false);
			}
			else if( this.getData('ltPropSelected').length == 0 && !this.getData('showPlace')){
				this.setData('showPlace',true);
			}
			var text=this.getData('multiTextArray').join(", ");
			this.setData('multiText',text);
			text=this.getData('multiTextArray').join('<br>');
		this.setData('multiTextForHovercard', text);

		if (!this.getData('ltPropShowCount') && !this.getData('ltPropHideHovercard')) {
			var buttonWidth = $L(this.$node).find('lyte-drop-button')[0].offsetWidth;
			var maxWidth = this.getMaxWidth(this.$node, this.$node.parentElement);
			if (parseInt(buttonWidth) >= maxWidth) {
				$L(this.$node).find('lyte-drop-button')[0].setAttribute('lyte-hovercard', 'true');
				// this.checkForCount();
			}
			else {
				$L(this.$node).find('lyte-drop-button')[0].setAttribute('lyte-hovercard', '');
			}
		}
		if (this.getData('ltPropSelected').length === 0) {
			$L(this.$node).find('lyte-drop-button')[0].setAttribute('lyte-hovercard', '');
		}

	}.observes('ltPropSelected.[]'),

	construct: function () {
		this.calculate();
	}.observes('multiTextArray.[]', 'ltPropTag'),

	calculate() {
		var selectedArray = this.getData('ltPropSelected');
		if ( selectedArray && selectedArray.length) {
			var dropButtonArray = [];
			for (var i = 0; i < selectedArray.length; i++) {
				var item = selectedArray[i];
				Lyte.arrayUtils(dropButtonArray, 'push', item);
			}
			this.setData('dropButtonArray', dropButtonArray)
		}

		if (this.getData('ltPropTag')) {
			var sys = this.getData('ltPropSystemValue');
			if (dropButtonArray) {
				var sysArray = dropButtonArray.map(item => item[sys]);
				var button = this.$node.querySelector('lyte-drop-button');
				var div = button.querySelector('.lyteMultiDropSelectedText');
				if (div) {
					var btWidth = $L(div).width();
					var dropItems = div.querySelectorAll('li');
					var user = this.getData('ltPropUserData');
					dropItems = Array.from(dropItems);
					var totalWidth = 0;
					var i;
					for (i = 0; i < dropItems.length; i++) {
						var element = dropItems[i];
						var dv = element.getAttribute('data-value');
						var oldWidth = totalWidth;
						if (sysArray.includes(dv)) {
							totalWidth = totalWidth + $L(element).outerWidth(true);
							if (totalWidth > btWidth) {
								// the length of +n more span has to be accounted
								if (totalWidth - oldWidth <= 92) {
									i--;
								}
								else if (oldWidth + 92 > btWidth) {
									i--;
								}
								break;
							}
						}
					}
					if (i !== dropItems.length) {
						if (i === -1) {
							i = 0;
						}
						var dropButtonArray = this.getData('dropButtonArray');

						var newDropButtonArray = dropButtonArray.slice(0, i);
						var hoverList = dropButtonArray.slice(i, dropItems.length);

						this.setData('dropButtonArray', newDropButtonArray);
						if (hoverList) {
							this.setData('hoverList', hoverList);
							this.setData('nMoreTagShown',true);
							var values = hoverList.map(function (state) {
								return hoverList[user];
							});

							// Join the names into a single string
							var text = values.join('<br/>');
							// var text = this.getData('hoverList').join('<br>');
							this.setData('multiTextForHovercard', text);
						}
						else {
							this.setData('hoverList', []);
							this.setData('nMoreTagShown',false);
						}
					}
					else {
						this.setData('hoverList', []);
						this.setData('nMoreTagShown',false);
					}
				}
			}
		}
	},

	disableCheckbox: function(){
		if( !this.getData('ltPropType') === 'checkbox'){
			return;
		}
		var drop = $L(this.$node).find('lyte-dropdown')[0].component;
		var par;
		if( drop && drop.childComp ){
			par = drop.childComp;
		}
		else{
			par = drop.$node.querySelector('lyte-drop-body');
		}
		if( !drop || !par ){ return; }

		var options = par.querySelectorAll('lyte-drop-item');
		for( var ind=0;ind<options.length;ind++ ){
			var val = options[ind].getAttribute('data-value');
			var bool = this.getData('ltPropDisabledList').includes(val);
			var box = options[ind].querySelector('lyte-checkbox');
			if( box ){
				box.setData('ltPropDisabled',bool);
			}
		}
	}.observes('ltPropDisabledList.[]','ltPropDisabledList').on('didConnect'),

	hoverCardInit: function(){
		if(!_lyteUiUtils.multiDropGlobe){
			_lyteUiUtils.multiDropGlobe={'ind':0};
		}
		else{
			_lyteUiUtils.multiDropGlobe.ind+=1;
		}

		this.setData('multiDropId','lyteMultiDropButton'+_lyteUiUtils.multiDropGlobe.ind);
	}.observes('ltPropType').on('init'),

	hovercardUtil: function(){
		var cthis=this;
		if( !this.getData('ltPropSelected') ){
			this.setData('ltPropSelected',[]);
		}
			if(this.getData('ltPropSelected').length>0){

				var arr=Array.from($L(this.$node).find('lyte-dropdown')[0].querySelectorAll('lyte-drop-item'));
				var arrOfKeys=[];
				this.setData('showPlace','false');
				cthis.getData('ltPropSelected').forEach(function(item){
					arrOfKeys.push(item[cthis.getData('ltPropSystemValue')]);
				});
				if(this.getData('ltPropType')=='checkbox'){
					arr.forEach(function(item){
						var checkbox=$L(item).find('lyte-checkbox')[0];
						var namevalueToAdd=checkbox.getAttribute('lt-prop-label');
						var datavalueToAdd=item.getAttribute('data-value');
						if(arrOfKeys.includes(datavalueToAdd) && cthis.getData( 'multiTextArray' ).indexOf( namevalueToAdd ) === -1){
									checkbox.setData('ltPropChecked','true');
									Lyte.arrayUtils( cthis.getData( 'multiTextArray' ), 'push', namevalueToAdd );

						}
					});
				}
				else{
					arr.forEach(function(item){
						var namevalueToAdd=item.innerText.trim();
						var datavalueToAdd=item.getAttribute('data-value');
						if(arrOfKeys.includes(datavalueToAdd) && cthis.getData( 'multiTextArray' ).indexOf( namevalueToAdd ) === -1){
									Lyte.arrayUtils( cthis.getData( 'multiTextArray' ), 'push', namevalueToAdd );

						}
					});
				}
				var text=this.getData('multiTextArray').join(', ');
				this.setData('multiText',text);
				text=this.getData('multiTextArray').join('<br>');
				this.setData('multiTextForHovercard',text);
			}
	}.observes('ltPropType').on('didConnect')
	//to manually show hovercard
	// checkForCount: function(){
	// 	if(this.getData('ltPropShowCount')){
	// 		var dupMultiTextArray=Array.from(this.getData('multiTextArray'));
	// 		while($L(this.$node).find('lyte-drop-button')[0].offsetWidth>=330){
	// 			dupMultiTextArray.pop();
	// 			this.setData('multiText',dupMultiTextArray.join(",")+'dummy text.....');
	// 		}
	// 		var dupText=dupMultiTextArray.join(', ');
	// 		this.setData('numInText',($L(this.$node).find('lyte-dropdown')[0].getData('ltPropSelectedList').length)-(dupMultiTextArray.length));
	// 		this.setData('multiText',dupText+`  &${this.getData('numInText')} more...`);
	// 	}
	// }


});

document.addEventListener('click', function (event) {
	var tag = event.target.tagName;
	if (tag === 'LYTE-MULTI-DROP-REMOVE') {
		var element = event.target;
		while (element && element.tagName !== 'LYTE-HOVERCARD-CONTENT') {
			element = element.parentElement;
		}
		var div = element.parentElement.parentElement;
		if (div.tagName === 'DIV') {
			var id = div.getAttribute('id');
			var originQuery = id.replace('lyteHoverCardFor', '')
			originQuery = '#' + originQuery;
		}
		if (originQuery) {
			var originElement = $L(originQuery)[0];
			var dropDown = originElement.closest('LYTE-DROPDOWN');

			var isOpen = dropDown.ltProp('isOpen');
			if (!isOpen) {
				dropDown.open();
			}
			var dropBox = dropDown.getDropBox();
			var dv = event.target.getAttribute('data-value');
			// Get all the drop items
			var dropItems = dropBox.querySelectorAll('lyte-drop-item');
			dropItems = Array.from(dropItems);
			var matchingDropItem = dropItems.find(function (item) {
				return item.getAttribute('data-value') === dv;
			});
			matchingDropItem.click();
			if (!isOpen) {
				dropDown.close();
			}
		}
	}
	else if (tag === 'LI') {
		var id = event.target.getAttribute('id');
		if (id && id.startsWith('lyteNMoreTagFor')) {
			var element = event.target;
			while (element && element.tagName !== 'LYTE-DROPDOWN') {
				element = element.parentElement;
			}
			var dropDown = element;

			var isOpen = dropDown.ltProp('isOpen');
			if (isOpen) {
				dropDown.close();
			}
		}
	}


})

document.addEventListener('keydown', function (event) {
	var key = event.key;

	key = key.toLowerCase();
	if (key === 'enter') {

		var tagName = event.target.tagName;
		if (tagName === 'LYTE-DROP-REMOVE') {
			event.target.click();
		}
		else if (tagName === 'LYTE-MULTI-DROPDOWN') {

			var btn = event.target.querySelector('lyte-drop-button');
			btn.click();
		}
		else if (tagName === 'LYTE-DROP-BUTTON') {
			event.target.click();
		}
		else if (tagName === 'LYTE-MULTI-DROP-REMOVE') {
			event.target.click();
		}
	}
	if (key === 'escape') {
		var tagName = event.target.tagName;
		if (tagName === 'LYTE-MULTI-DROP-REMOVE') {
			var element = event.target;
			while (element && element.tagName !== 'LYTE-HOVERCARD-CONTENT') {
				element = element.parentElement;
			}
			var div = element.parentElement.parentElement;
			if (div.tagName === 'DIV') {
				var id = div.getAttribute('id');
				var originQuery = id.replace('lyteHoverCardFor', '')
				originQuery = '#' + originQuery;
			}
			if (originQuery) {
				var originElement = $L(originQuery)[0];
				var multiDropDown = originElement.closest('LYTE-MULTI-DROPDOWN');
				var tabIndex = multiDropDown.getAttribute('tabindex');
				if (!tabIndex) {
					multiDropDown.setAttribute('tabindex', '0');
				}
				multiDropDown.focus();
			}
		}
	}
})