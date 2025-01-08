/**
 * @component lyte-timeline-view
 */

Lyte.Component.register("lyte-timeline-view", {
_template:"<template tag-name=\"lyte-timeline-view\"> <div class=\"lyteTimelineViewTable {{if(enableGroup,'lyteTimelineViewWithGrouping')}}\"> <template is=\"if\" value=\"{{expHandlers(enableGroup,'!')}}\"><template case=\"true\"><div class=\"lyteTimelineViewContentElem {{lyteUiTimelineViewGetViewClass(ltPropView)}} {{lyteUiTimelineViewHasScroll(ltPropManipulatedEvent,ltPropMaxHeight)}}\" style=\"--lyte-timelineview-row-end: {{lyteUiTimelineViewRowCount(ltPropManipulatedEvent,ltPropMaxHeight)}}; --lyte-timelineview-column-size: {{expHandlers(ltPropDateWidth[ltPropView],'+','px')}}; --lyte-timelineview-column-gridline-temp: {{expHandlers(expHandlers(ltPropDateWidth[ltPropView],'+',1),'+','px')}};\"> <div class=\"lyteTimelineViewHeaderRowWrap\"> <div class=\"lyteTimelineViewHoverCardDiv lyteTimelineViewHoverCardHide\"> <div class=\"lyteTimelineViewHoverCard\"> <lyte-yield yield-name=\"hover-card\" timeline-event=\"{{item}}\" hover-data=\"{{ltPropHoverCardData}}\"> </lyte-yield> </div> </div> <div class=\"lyteTimelineViewHeaderRow\"> <template items=\"{{headerArray}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewPrimaryHeaderElem lyteTimelineViewHeaderMonthElem\" style=\"--lyte-timelineview-col-number: {{item.startColumn}}; grid-column-end: span {{item.endColumn}}; \" onmouseenter=\"{{action('onDateHover',event,this,item)}}\" onmouseleave=\"{{action('onDateMouseOut')}}\"> <span class=\"lyteTimelineViewPeriodLabel\"> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','week')}}\"><template case=\"true\"> {{item.week}} </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> <span class=\"lyteTimelineViewHeaderPrimaryLabel\">{{item.quarter}}</span> <span class=\"lyteTimelineViewYearLabel\">{{item.year}}</span> </template><template case=\"false\"> <span class=\"lyteTimelineViewHeaderPrimaryLabel lyteTimelineViewMonthLabel\">{{lyteUiTimelineViewGetMonth(item.month,months)}}</span> <span class=\"lyteTimelineViewYearLabel\">{{item.year}}</span> </template></template></template></template> </span> </div></template> </div> <div class=\"lyteTimelineViewHeaderRow\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewSecondaryHeaderElem lyteTimelineViewHeaderElem {{lyteUiTimelineViewFindWeekend(item,ltPropView,ltPropNonWorkingDays,ltPropHolidayObject)}} {{if(item.isendOfView,'lyteTimelineViewEndOfSection','')}}\" style=\"--lyte-timelineview-col-number: {{expHandlers(index,'+',1)}}; --lyte-timelineview-lineCount:{{lyteUiTimelineViewLineCount(item,null,this,ltPropView)}};\" data-date=\"{{lyteUiSchedulerGetDate(item)}}\" id=\"{{lyteUiSchedulerGetDate(item)}}\" onmouseenter=\"{{action('onDateHover',event,this)}}\" onmouseleave=\"{{action('onDateMouseOut')}}\"> <div> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> {{lyteUiTimelineViewGetMonth(item,months)}} </template><template case=\"false\"> {{lyteUiTimelineViewGetDay(item,ltPropView)}} </template></template> </div> </div></template> </div> </div> <template is=\"if\" value=\"{{ltPropManipulatedEvent.length}}\"><template case=\"true\"> <div class=\"lyteTimelineViewEventsContainer\"> <template object=\"{{populateObject}}\" value=\"item\" key=\"index\" is=\"forIn\"><div class=\"lyteTimelineViewEventDiv {{lyteUiTimelineViewCss(item,this,timeline,ltPropView)}} {{if(expHandlers(item.end,'!'),'lyteTimeLineViewNoEnd','')}}\" id=\"{{item.id}}\" onmouseover=\"{{action('onEventHover',event,item,this)}}\" onmouseleave=\"{{action('onEventOut',event,item,this)}}\" onfocusin=\"{{action('onEventHover',event,item,this)}}\"> <div class=\"lyteTimelineViewEvent {{lyteUiTimelineViewAddClass(item.class,this)}}\" style=\" {{lyteUiTimelineViewColorCode(item.color_code,this)}}\"> <template is=\"if\" value=\"{{expHandlers(item.leftResize,'&amp;&amp;',item.end)}}\"><template case=\"true\"><div class=\"lyteTimelineViewLeft lyteTimelineViewEventResizeHandler\" onmousedown=\"{{action('onmousedownEvent',event,'left',this,item)}}\"></div></template></template> <lyte-yield yield-name=\"timeline-event\" timeline-event=\"{{item}}\"> </lyte-yield> <template is=\"if\" value=\"{{expHandlers(item.end,'!')}}\"><template case=\"true\"><div class=\"lyteTimeLineViewNoEndElem\"></div></template></template> <template is=\"if\" value=\"{{item.dueDate}}\"><template case=\"true\"><div class=\"lyteTimelineViewDue\"> </div></template></template> <template is=\"if\" value=\"{{expHandlers(item.rightResize,'&amp;&amp;',item.end)}}\"><template case=\"true\"><div class=\"lyteTimelineViewRight lyteTimelineViewEventResizeHandler\" onmousedown=\"{{action('onmousedownEvent',event,'right',this,item)}}\"></div></template></template> </div> </div></template> </div> <div class=\"lyteTimelineViewOverlayDiv\"> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','day')}}\"><template case=\"true\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><template is=\"if\" value=\"{{lyteUiTimelineGridOverlay(item,ltPropView,ltPropNonWorkingDays,ltPropHolidayObject)}} \"><template case=\"true\"><div style=\"--lyte-timelineview-col-number : {{expHandlers(index,'+',1)}};\" class=\"lyteTimelineViewOverlay \"></div></template></template></template> </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','month')}}\"><template case=\"true\"> <template items=\"{{headerArray}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewOverlay {{if(lyteUiTimelineGridOverlay(item,ltPropView,index),'lyteTimelineViewEvenSection','lyteTimelineViewOddSection')}}\" style=\"--lyte-timelineview-col-number : {{item.startColumn}}; grid-column-end: span {{item.endColumn}};\"></div></template> </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><lyte-timeline-view-overlay class=\"lyteTimelineViewOverlay {{lyteUiTimelineViewMonthClass(item)}} \" style=\"--lyte-timelineview-col-number : {{expHandlers(index,'+',1)}}; --lyte-timelineview-lineCount:{{lyteUiTimelineViewLineCount(item,true,this,ltPropView)}}; --lyte-timelineview-lineCountMinus:{{expHandlers(expHandlers(lyteUiTimelineViewLineCount(item,null,this,ltPropView),'-',1),'+','px')}}\"></lyte-timeline-view-overlay></template> </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','week')}}\"><template case=\"true\"> <template items=\"{{headerArray}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewOverlay {{if(lyteUiTimelineGridOverlay(item,ltPropView),'lyteTimelineViewEvenSection','lyteTimelineViewOddSection')}}\" style=\"--lyte-timelineview-col-number : {{item.startColumn}}; grid-column-end: span {{item.endColumn}}; \"></div></template> </template></template></template></template></template></template></template></template> </div> <template is=\"if\" value=\"{{expHandlers(ltPropView,'===','day')}}\"><template case=\"true\"> <div class=\"lyteTimelineViewBg\" style=\"--lyte-timelineview-col-number: {{timeline.length}}\"></div> </template></template> <div class=\"lyteTimelineViewArrowContainer\" style=\"--lyte-timelineview-col-number: {{timeline.length}}\"> <template object=\"{{populateObject}}\" value=\"item\" key=\"index\" is=\"forIn\"><div class=\"lyteTimelineViewArrow lyteTimelineViewEventArrow\" style=\"grid-row: {{item.index}}\" data-id=\"{{item.id}}\"> <div class=\"lyteTimelineViewArrowBox lyteTimelineViewLeftArrow lyteTimelineViewHideArrow\" lt-prop-title=\"\" onclick=\"{{action('onarrowclick',event,item,'left')}}\" onmouseover=\"{{action('onArrowhover',event,item,this)}}\"></div> <div class=\"lyteTimelineViewArrowBox lyteTimelineViewRightArrow lyteTimelineViewHideArrow\" lt-prop-title=\"\" onclick=\"{{action('onarrowclick',event,item,'right')}}\" onmouseover=\"{{action('onArrowhover',event,item,this)}}\"></div> <div class=\"lyteTimelineViewArrowSeparator\"></div> <div class=\"lyteTimelineViewArrowText lyteTimelineViewArrowTextHide lyteTextEllipsisNode\" onclick=\"{{action('onTextclick',event,item)}}\"> <template is=\"if\" value=\"{{ltPropArrowkeyYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"timeline-arrow-key\" timeline-event=\"{{item}}\"> </lyte-yield> </template><template case=\"false\"> {{item[ltPropArrowKey]}} </template></template> </div> </div></template> <div class=\"lyteTimelineViewHideLoadmore lyteTimelineViewLoading\"> <template is=\"if\" value=\"{{expHandlers(ltPropLoaderYield,'!')}}\"><template case=\"true\"> <lyte-loader lt-prop-inline=\"true\" lt-prop-close-icon=\"false\" lt-prop-progress-bar=\"{&quot;mode&quot;: &quot;indefinite&quot; , &quot;show&quot;:false}\" lt-prop-on-timeout=\"{&quot;errorMsg&quot;:&quot; &quot;}\"> </lyte-loader> </template><template case=\"false\"> <lyte-yield yield-name=\"timeline-loader\" class=\"lyteTimelineViewLoadingYield\"> </lyte-yield> </template></template> </div> </div> </template><template case=\"false\"> <div class=\"lyteTimelineViewNoResultDiv\" style=\"grid-column-start: 1; grid-column-end: {{timeline.length}};\"> <div class=\"lyteTimelineViewNoResultLabel\">{{ltPropNoRecordFound}}</div> </div> </template></template> <div class=\"lyteTimelineViewToday\"> <div class=\"lyteTimelineViewTodayText\">Today</div> <div class=\"lyteTimelineViewTodayLineDiv\"> <div class=\"lyteTimelineViewTodayLine\"> </div> </div> </div> </div></template><template case=\"false\"><div class=\"lyteTimelineViewContentElem {{lyteUiTimelineViewGetViewClass(ltPropView)}} \" style=\"--lyte-timelineview-column-size: {{expHandlers(ltPropDateWidth[ltPropView],'+','px')}}; --lyte-timelineview-column-gridline-temp: {{expHandlers(expHandlers(ltPropDateWidth[ltPropView],'+',1),'+','px')}} ; --lyte-timelineview-groupby-panel-width:{{ltPropGroupbyPanelWidth}};\"> <div class=\"lyteTimelineViewHeaderRowWrap\"> <div class=\"lyteTimelineViewGroupbyElementHeaderWrap\" style=\"--lyte-timelineview-col-number: {{expHandlers(timeline.length,'+',1)}};\"> <div class=\"lyteTimelineViewGroupbyElementHeader\"> <div>Grouped By</div> <lyte-yield yield-name=\"timeline-groupBy\"> </lyte-yield> </div> <div class=\"lyteTimeLineViewGroupbyDummyPanel\"> </div> </div> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> <div class=\"lyteTimelineViewHeaderRow \"> <template items=\"{{subheader}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineYearHeaderElem quarterHeader\" style=\"--lyte-timelineview-col-number: {{item.startColumn}}; grid-column-end: span {{item.endColumn}};\"> <span> {{item.year}} </span> </div></template> </div> </template></template> <div class=\"lyteTimelineViewHoverCardDiv lyteTimelineViewHoverCardHide\"> <div class=\"lyteTimelineViewHoverCard\"> <lyte-yield yield-name=\"hover-card\" timeline-event=\"{{item}}\" hover-data=\"{{ltPropHoverCardData}}\"> </lyte-yield> </div> </div> <div class=\"lyteTimelineViewHeaderRow\"> <template items=\"{{headerArray}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewPrimaryHeaderElem lyteTimelineViewHeaderMonthElem\" style=\"--lyte-timelineview-col-number: {{item.startColumn}}; grid-column-end: span {{item.endColumn}}; \" onmouseenter=\"{{action('onDateHover',event,this,item)}}\" onmouseleave=\"{{action('onDateMouseOut')}}\"> <span class=\"lyteTimelineViewPeriodLabel\"> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','week')}}\"><template case=\"true\"> {{item.week}} </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> <span class=\"lyteTimelineViewHeaderPrimaryLabel\">{{item.quarter}}</span> <span class=\"lyteTimelineViewYearLabel\">{{item.year}}</span> </template><template case=\"false\"> <span class=\"lyteTimelineViewHeaderPrimaryLabel lyteTimelineViewMonthLabel\">{{lyteUiTimelineViewGetMonth(item.month,months)}}</span> <span class=\"lyteTimelineViewYearLabel\">{{item.year}}</span> </template></template></template></template> </span> </div></template> </div> <div class=\"lyteTimelineViewHeaderRow\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewSecondaryHeaderElem lyteTimelineViewHeaderElem {{lyteUiTimelineViewFindWeekend(item,ltPropView,ltPropNonWorkingDays,ltPropHolidayObject)}} {{if(item.isendOfView,'lyteTimelineViewEndOfSection','')}}\" style=\"--lyte-timelineview-col-number: {{expHandlers(index,'+',1)}};--lyte-timelineview-lineCount:{{lyteUiTimelineViewLineCount(item,null,this,ltPropView)}};\" data-date=\"{{lyteUiSchedulerGetDate(item)}}\" id=\"{{lyteUiSchedulerGetDate(item)}}\" onmouseenter=\"{{action('onDateHover',event,this,item)}}\" onmouseleave=\"{{action('onDateMouseOut')}}\"> <span> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> {{lyteUiTimelineViewGetMonth(item,months)}} </template><template case=\"false\"> {{lyteUiTimelineViewGetDay(item,ltPropView)}} </template></template> </span> </div></template> </div> </div> <div class=\"lyteTimelineViewGroupbyContainer\" style=\"--lyte-timelineview-col-number: {{expHandlers(timeline.length,'+',1)}}\"> <template is=\"if\" value=\"{{groupByData.length}}\"><template case=\"true\"> <template items=\"{{groupByData}}\" item=\"groupByDataArray\" index=\"index\" is=\"for\"> <lyte-timeline-view-accordion class=\"lyteTimelineViewGroupbyAccordion {{lyteUiTimelineViewAccordionClosed(groupByDataArray,this)}} {{if(groupByDataArray.loadmore,'lyteTimelineViewHasMoreEvent',)}} {{if(lyteUiIfEquals(index,expHandlers(groupByData.length,'-',1)),'lyteTimelineViewLastAccordion','')}}\" style=\"--lyte-timelineview-row-end: {{expHandlers(groupByDataArray.rowCount,'+',1)}}\" group=\"{{groupByDataArray.systemValue}}\" id=\"{{groupByDataArray.systemValue}}\"> <div class=\"lyteTimelineViewGroupbyElement\" onclick=\"{{action('toggleAccordion',event,this,groupByDataArray)}}\"> <div class=\"lyteTimelineViewGroupbyElementLabelWrap\"> <lyte-text class=\"lyteTimelineViewGroupbyElementLabel\" lt-prop-value=\"{{groupByDataArray.userValue}}\"></lyte-text> <lyte-badge class=\"lyteTimelineViewGroupbyCount\" lt-prop-data=\"{{groupByDataArray.eventCount}}\" lt-prop-max-length=\"{{ltPropMaxEventCountLength}}\" lt-prop-show-tooltip=\"true\"></lyte-badge> <span class=\"lyteTimelineViewGroupbyAccordionArrow\"></span> </div> <div class=\"lyteTimelineViewGroupbyElementFillBg\"></div> </div> <div class=\"lyteTimelineViewGroupbyAccordionBody {{if(groupByDataArray.norecordfound,'lyteTimelineViewNoRecordFound')}}\" style=\"--lyte-timelineview-row-end:{{groupByDataArray.rowCount}}\"> <template is=\"if\" value=\"{{groupByDataArray.children.length}}\"><template case=\"true\"> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewOverlay\" style=\"--lyte-timelineview-col-number : {{expHandlers(index,'+',1)}}; --lyte-timelineview-lineCount:{{lyteUiTimelineViewLineCount(item,null,this,ltPropView)}};\"></div></template> </template></template> <div class=\"lyteTimelineViewEventsContainer\"> <template items=\"{{groupByDataArray.children}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewEventDiv {{if(expHandlers(item.end,'!'),'lyteTimeLineViewNoEnd','')}} \" id=\"{{item.id}}\" style=\"--lyte-timelineview-row-number: {{expHandlers(index,'+',1)}};\" onmouseover=\"{{action('onEventHover',event,item,this)}}\" onmouseleave=\"{{action('onEventOut',event,item,this)}}\" onfocusin=\"{{action('onEventHover',event,item,this)}}\"> <div class=\"lyteTimelineViewEvent LyteTimelineViewGroupBy {{lyteUiTimelineViewAddClass(item.class,this)}}\" style=\" {{lyteUiTimelineViewColorCode(item.color_code,this)}}\"> <template is=\"if\" value=\"{{expHandlers(item.leftResize,'&amp;&amp;',item.end)}}\"><template case=\"true\"><div class=\"lyteTimelineViewLeft lyteTimelineViewEventResizeHandler\" onmousedown=\"{{action('onmousedownEvent',event,'left',this,item,groupByDataArray)}}\"></div></template></template> <lyte-yield yield-name=\"timeline-event\" timeline-event=\"{{item}}\"> </lyte-yield> <template is=\"if\" value=\"{{expHandlers(item.end,'!')}}\"><template case=\"true\"><div class=\"lyteTimeLineViewNoEndElem\"></div></template></template> <template is=\"if\" value=\"{{item.dueDate}}\"><template case=\"true\"><div class=\"lyteTimelineViewDue\"> </div></template></template> <template is=\"if\" value=\"{{expHandlers(item.rightResize,'&amp;&amp;',item.end)}}\"><template case=\"true\"><div class=\"lyteTimelineViewRight lyteTimelineViewEventResizeHandler\" onmousedown=\"{{action('onmousedownEvent',event,'right',this,item,groupByDataArray)}}\"></div></template></template> </div> </div></template> <template is=\"if\" value=\"{{groupByDataArray.loadmore}}\"><template case=\"true\"><div class=\"lyteTimelineViewLoadMore\" style=\"grid-column-start: 1; grid-column-end:{{expHandlers(timeline.length,'+',1)}}\" onclick=\"{{action('loadmore',event,groupByDataArray,this)}}\"> <div class=\"lyteTimelineViewLoadMoreLabel\"> View More</div> </div></template></template> <div class=\"lyteTimelineViewHideLoadmore lyteTimelineViewLoading\"> <template is=\"if\" value=\"{{expHandlers(ltPropLoaderYield,'!')}}\"><template case=\"true\"> <lyte-loader lt-prop-inline=\"true\" lt-prop-close-icon=\"false\" lt-prop-progress-bar=\"{&quot;mode&quot;: &quot;indefinite&quot; , &quot;show&quot;:false}\" lt-prop-on-timeout=\"{&quot;errorMsg&quot;:&quot; &quot;}\"> </lyte-loader> </template><template case=\"false\"> <lyte-yield yield-name=\"timeline-loader\" class=\"lyteTimelineViewLoadingYield\"> </lyte-yield> </template></template> </div> <div class=\"lyteTimelineViewArrowContainer\"> <template items=\"{{groupByDataArray.children}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewArrow lyteTimelineViewEventArrow\" style=\"grid-row: {{item.index}}\" data-id=\"{{item.id}}\"> <div class=\"lyteTimelineViewArrowBox lyteTimelineViewLeftArrow lyteTimelineViewHideArrow\" lt-prop-title=\"\" onclick=\"{{action('onarrowclick',event,item,'left',groupByDataArray.systemValue)}}\" onmouseover=\"{{action('onArrowhover',event,item,this)}}\"></div> <div class=\"lyteTimelineViewArrowBox lyteTimelineViewRightArrow lyteTimelineViewHideArrow\" lt-prop-title=\"\" onclick=\"{{action('onarrowclick',event,item,'right',groupByDataArray.systemValue)}}\" onmouseover=\"{{action('onArrowhover',event,item,this)}}\"></div> <div class=\"lyteTimelineViewArrowSeparator\"></div> <div class=\"lyteTimelineViewArrowText lyteTimelineViewArrowTextHide lyteTextEllipsisNode\" onclick=\"{{action('onTextclick',event,item)}}\"> <template is=\"if\" value=\"{{ltPropArrowkeyYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"timeline-arrow-key\" timeline-event=\"{{item}}\"> </lyte-yield> </template><template case=\"false\"> {{item[ltPropArrowKey]}} </template></template> </div> </div></template> </div> </div> </template><template case=\"false\"><template is=\"if\" value=\"{{groupByDataArray.norecordfound}}\"><template case=\"true\"> <div class=\"lyteTimelineViewNoResultDiv\" style=\"grid-column-start: 1; grid-column-end: {{timeline.length}};\"> <div class=\"lyteTimelineViewNoResultLabel\">{{ltPropNoRecordFound}}</div> </div> </template></template></template></template> </div> </lyte-timeline-view-accordion> </template> </template><template case=\"false\"> <div class=\"lyteTimelineViewNoResultDiv\" style=\"grid-column-start: 1; grid-column-end: {{timeline.length}}; --lyte-timelineview-row-end: {{lyteUiTimelineViewRowCount(ltPropManipulatedEvent,ltPropMaxHeight)}};\"> <div class=\"lyteTimelineViewNoResultLabel\">{{ltPropNoRecordFound}}</div> </div> </template></template> </div> <div class=\"lyteTimelineViewOverlayDiv\"> <template is=\"if\" value=\"{{expHandlers(ltPropView,'==','day')}}\"><template case=\"true\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><template is=\"if\" value=\"{{lyteUiTimelineGridOverlay(item,ltPropView,ltPropNonWorkingDays,ltPropHolidayObject)}} \"><template case=\"true\"><div style=\"--lyte-timelineview-col-number : {{expHandlers(index,'+',1)}};\" class=\"lyteTimelineViewOverlay \"></div></template></template></template> </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','month')}}\"><template case=\"true\"> <template items=\"{{headerArray}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewOverlay {{if(lyteUiTimelineGridOverlay(item,ltPropView,index),'lyteTimelineViewEvenSection','lyteTimelineViewOddSection')}}\" style=\"--lyte-timelineview-col-number : {{item.startColumn}}; grid-column-end: span {{item.endColumn}};\"></div></template> </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','quarter')}}\"><template case=\"true\"> <template items=\"{{timeline}}\" item=\"item\" index=\"index\" is=\"for\"><lyte-timeline-view-overlay class=\"lyteTimelineViewOverlay {{lyteUiTimelineViewMonthClass(item)}} \" style=\"--lyte-timelineview-col-number : {{expHandlers(index,'+',1)}}; --lyte-timelineview-lineCount:{{lyteUiTimelineViewLineCount(item,true,this,ltPropView)}}; --lyte-timelineview-lineCountMinus:{{expHandlers(expHandlers(lyteUiTimelineViewLineCount(item,null,this,ltPropView),'-',1),'+','px')}}\"></lyte-timeline-view-overlay></template> </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropView,'==','week')}}\"><template case=\"true\"> <template items=\"{{headerArray}}\" item=\"item\" index=\"index\" is=\"for\"><div class=\"lyteTimelineViewOverlay {{if(lyteUiTimelineGridOverlay(item,ltPropView),'lyteTimelineViewEvenSection','lyteTimelineViewOddSection')}}\" style=\"--lyte-timelineview-col-number : {{item.startColumn}}; grid-column-end: span {{item.endColumn}}; \"></div></template> </template></template></template></template></template></template></template></template> </div> <template is=\"if\" value=\"{{expHandlers(ltPropView,'===','day')}}\"><template case=\"true\"> <div class=\"lyteTimelineViewBg {{if(lyteUiIfEquals(index,expHandlers(groupByData.length,'-',1)),'lyteTimelineViewLastAccordion','')}}\" style=\" --lyte-timelineview-col-number: {{expHandlers(timeline.length,'+',1)}};\"></div> </template></template> <div class=\"lyteTimelineViewToday\"> <div class=\"lyteTimelineViewTodayText\">Today</div> <div class=\"lyteTimelineViewTodayLineDiv\"> <div class=\"lyteTimelineViewTodayLine\"> </div> </div> </div> </div></template></template> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-row-end: '",{"type":"helper","value":{"name":"lyteUiTimelineViewRowCount","args":["ltPropManipulatedEvent","ltPropMaxHeight"]}},"'; --lyte-timelineview-column-size: '",{"type":"helper","value":{"name":"expHandlers","args":["ltPropDateWidth[ltPropView]","'+'","'px'"]}},"'; --lyte-timelineview-column-gridline-temp: '",{"type":"helper","value":{"name":"expHandlers","args":[{"type":"helper","value":{"name":"expHandlers","args":["ltPropDateWidth[ltPropView]","'+'",1]}},"'+'","'px'"]}},"';'"]}}}},{"type":"attr","position":[0,1,1,1,1]},{"type":"insertYield","position":[0,1,1,1,1]},{"type":"attr","position":[0,1,3,1]},{"type":"for","position":[0,1,3,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '","item.startColumn","'; grid-column-end: span '","item.endColumn","'; '"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"text","position":[3,0]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"text","position":[3,0]}]}},"default":{}}]}},"default":{}}]},{"type":"attr","position":[0,1,5,1]},{"type":"for","position":[0,1,5,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"'; --lyte-timelineview-lineCount:'",{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",null,"this","ltPropView"]}},"';'"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]},{"type":"attr","position":[0,3]},{"type":"if","position":[0,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"forIn","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiTimelineViewColorCode","args":["item.color_code","this"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"attr","position":[0,1,3]},{"type":"insertYield","position":[0,1,3]},{"type":"attr","position":[0,1,5]},{"type":"if","position":[0,1,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,1,7]},{"type":"if","position":[0,1,7],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,1,9]},{"type":"if","position":[0,1,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}}]},{"type":"attr","position":[3,1]},{"type":"if","position":[3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"';'"]}}}}]}},"default":{}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '","item.startColumn","'; grid-column-end: span '","item.endColumn","';'"]}}}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"'; --lyte-timelineview-lineCount:'",{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",true,"this","ltPropView"]}},"'; --lyte-timelineview-lineCountMinus:'",{"type":"helper","value":{"name":"expHandlers","args":[{"type":"helper","value":{"name":"expHandlers","args":[{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",null,"this","ltPropView"]}},"'-'",1]}},"'+'","'px'"]}}]}}}},{"type":"componentDynamic","position":[0]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '","item.startColumn","'; grid-column-end: span '","item.endColumn","'; '"]}}}}]}]}},"default":{}}]}},"default":{}}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '","timeline.length"]}}}}]}},"default":{}},{"type":"attr","position":[7],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '","timeline.length"]}}}},{"type":"attr","position":[7,1]},{"type":"forIn","position":[7,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'grid-row: '","item.index"]}}}},{"type":"attr","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"attr","position":[0,7]},{"type":"attr","position":[0,7,1]},{"type":"if","position":[0,7,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]},{"type":"attr","position":[7,3,1]},{"type":"if","position":[7,3,1],"cases":{"true":{"dynamicNodes":[{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'grid-column-start: 1; grid-column-end: '","timeline.length","';'"]}}}},{"type":"text","position":[1,1,0]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-column-size: '",{"type":"helper","value":{"name":"expHandlers","args":["ltPropDateWidth[ltPropView]","'+'","'px'"]}},"'; --lyte-timelineview-column-gridline-temp: '",{"type":"helper","value":{"name":"expHandlers","args":[{"type":"helper","value":{"name":"expHandlers","args":["ltPropDateWidth[ltPropView]","'+'",1]}},"'+'","'px'"]}},"' ; --lyte-timelineview-groupby-panel-width:'","ltPropGroupbyPanelWidth","';'"]}}}},{"type":"attr","position":[0,1,1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '",{"type":"helper","value":{"name":"expHandlers","args":["timeline.length","'+'",1]}},"';'"]}}}},{"type":"insertYield","position":[0,1,1,1,3]},{"type":"attr","position":[0,1,3]},{"type":"if","position":[0,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '","item.startColumn","'; grid-column-end: span '","item.endColumn","';'"]}}}},{"type":"text","position":[0,1,1]}]}]}},"default":{}},{"type":"attr","position":[0,1,5,1,1]},{"type":"insertYield","position":[0,1,5,1,1]},{"type":"attr","position":[0,1,7,1]},{"type":"for","position":[0,1,7,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '","item.startColumn","'; grid-column-end: span '","item.endColumn","'; '"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"text","position":[3,0]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"text","position":[3,0]}]}},"default":{}}]}},"default":{}}]},{"type":"attr","position":[0,1,9,1]},{"type":"for","position":[0,1,9,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"';--lyte-timelineview-lineCount:'",{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",null,"this","ltPropView"]}},"';'"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]},{"type":"attr","position":[0,3],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number: '",{"type":"helper","value":{"name":"expHandlers","args":["timeline.length","'+'",1]}}]}}}},{"type":"attr","position":[0,3,1]},{"type":"if","position":[0,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-row-end: '",{"type":"helper","value":{"name":"expHandlers","args":["groupByDataArray.rowCount","'+'",1]}}]}}}},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1,1]},{"type":"componentDynamic","position":[1,1,1,1]},{"type":"attr","position":[1,1,1,3]},{"type":"componentDynamic","position":[1,1,1,3]},{"type":"attr","position":[1,3],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-row-end:'","groupByDataArray.rowCount"]}}}},{"type":"attr","position":[1,3,1]},{"type":"if","position":[1,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"'; --lyte-timelineview-lineCount:'",{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",null,"this","ltPropView"]}},"';'"]}}}}]}]}},"default":{}},{"type":"attr","position":[3,1]},{"type":"for","position":[3,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-row-number: '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"';'"]}}}},{"type":"attr","position":[0,1],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiTimelineViewColorCode","args":["item.color_code","this"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"attr","position":[0,1,3]},{"type":"insertYield","position":[0,1,3]},{"type":"attr","position":[0,1,5]},{"type":"if","position":[0,1,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,1,7]},{"type":"if","position":[0,1,7],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,1,9]},{"type":"if","position":[0,1,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}}]},{"type":"attr","position":[3,3]},{"type":"if","position":[3,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'grid-column-start: 1; grid-column-end:'",{"type":"helper","value":{"name":"expHandlers","args":["timeline.length","'+'",1]}}]}}}}]}},"default":{}},{"type":"attr","position":[3,5,1]},{"type":"if","position":[3,5,1],"cases":{"true":{"dynamicNodes":[{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}},{"type":"attr","position":[3,7,1]},{"type":"for","position":[3,7,1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'grid-row: '","item.index"]}}}},{"type":"attr","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"attr","position":[0,7]},{"type":"attr","position":[0,7,1]},{"type":"if","position":[0,7,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'grid-column-start: 1; grid-column-end: '","timeline.length","';'"]}}}},{"type":"text","position":[1,1,0]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'grid-column-start: 1; grid-column-end: '","timeline.length","'; --lyte-timelineview-row-end: '",{"type":"helper","value":{"name":"lyteUiTimelineViewRowCount","args":["ltPropManipulatedEvent","ltPropMaxHeight"]}},"';'"]}}}},{"type":"text","position":[1,1,0]}]}},"default":{}},{"type":"attr","position":[0,5,1]},{"type":"if","position":[0,5,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"';'"]}}}}]}},"default":{}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '","item.startColumn","'; grid-column-end: span '","item.endColumn","';'"]}}}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '",{"type":"helper","value":{"name":"expHandlers","args":["index","'+'",1]}},"'; --lyte-timelineview-lineCount:'",{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",true,"this","ltPropView"]}},"'; --lyte-timelineview-lineCountMinus:'",{"type":"helper","value":{"name":"expHandlers","args":[{"type":"helper","value":{"name":"expHandlers","args":[{"type":"helper","value":{"name":"lyteUiTimelineViewLineCount","args":["item",null,"this","ltPropView"]}},"'-'",1]}},"'+'","'px'"]}}]}}}},{"type":"componentDynamic","position":[0]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'--lyte-timelineview-col-number : '","item.startColumn","'; grid-column-end: span '","item.endColumn","'; '"]}}}}]}]}},"default":{}}]}},"default":{}}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[0,7]},{"type":"if","position":[0,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["' --lyte-timelineview-col-number: '",{"type":"helper","value":{"name":"expHandlers","args":["timeline.length","'+'",1]}},"';'"]}}}}]}},"default":{}}]}},"default":{}}],
_observedAttributes :["ltPropCurrentDate","ltPropView","ltPropArrowKey","ltPropWorkingDay","ltPropDateWidth","ltPropFormat","ltPropGroupby","ltPropGroup","ltPropMaxHeight","ltPropEvent","ltPropDraggable","ltPropHoverCardData","ltPropNoRecordFound","ltPropSortKey","ltPropGroupbyPanelWidth","ltPropNonWorkingDays","ltPropWeekStart","ltPropRestrict","ltPropLoaderYield","ltPropMaxEventCountLength","ltPropMinResizeWidth","ltPropArrowkeyYield","ltPropHolidaylist","ltPropHolidayObject","ltPropHolidayFormat","groupByData","ltPropManipulatedEvent","timeline","populateObject","EventIndex","populateIndex","rightIntersectionObserver","leftIntersectionObserver","headerArray","subheader","months","prevScroll","enableGroup"],

	data : function(){
		return {
			/**
             * @componentProperty {object} ltPropCurrentDate=newDate
             * @default new Date
             */
			ltPropCurrentDate : Lyte.attr('object',{default: new Date()}),
			/**
             * @componentProperty {month|week|quarter|day} ltPropView
			* @default month
             */
			ltPropView : Lyte.attr('string' ,{default : 'month'} ),
			/**
             * @componentProperty {string} ltPropArrowKey
             */
			ltPropArrowKey : Lyte.attr('string',{default : ''}),
			/**
             * @componentProperty {false|true} ltPropWorkingDay
			 * @default false
             */
			ltPropWorkingDay : Lyte.attr('boolean',{default : false}),
			/**
             * @componentProperty {object} ltPropDateWidth
             */
			ltPropDateWidth : Lyte.attr('object',{default : { 'day' :  220 , 'month' : 20 , 'week' : 40 , 'quarter' : 8 }}),
			/**
             * @componentProperty {string} ltPropFormat
			 * @default 'DD-MM-YYYY hh:mm A'
             */
			ltPropFormat : Lyte.attr('string',{default : 'DD-MM-YYYY hh:mm A'}),
			/**
             * @componentProperty {array} ltPropGroupby
             */
			ltPropGroupby : Lyte.attr('array',{default : []}),
			/**
             * @componentProperty {false|true} ltPropGroup
			 * @default false
             */
			ltPropGroup : Lyte.attr('boolean',{default : false}),
			/**
             * @componentProperty {number} ltPropMaxHeight
             */
			ltPropMaxHeight : Lyte.attr('number'),
			/**
             * @componentProperty {array} ltPropEvent
             */
			ltPropEvent : Lyte.attr('array',{default:[]}),
			/**
             * @componentProperty {false|true} ltPropDraggable
			 * @default false
             */
			ltPropDraggable : Lyte.attr('boolean',{default:false}),
			/**
             * @componentProperty {array} ltPropHoverCardData
             */
			ltPropHoverCardData : Lyte.attr('array',{default:[]}),
			/**
             * @componentProperty {string} ltPropNoRecordFound
             */
			ltPropNoRecordFound : Lyte.attr('string',{default:'No Record Found'}), 
			/**
             * @componentProperty {string} ltPropSortKey
             */
			ltPropSortKey: Lyte.attr('string',{default:'start'}),
			/**
             * @componentProperty {string} ltPropGroupbyPanelWidth
			 * @default 200px
             */
			ltPropGroupbyPanelWidth : Lyte.attr('string',{default: '200px'}),
			/**
             * @componentProperty {array} ltPropNonWorkingDays
			 * @default [0,6]
             */
			ltPropNonWorkingDays : Lyte.attr('array',{default : [0,6]}),
			/**
             * @componentProperty {number} ltPropWeekStart
			 * @default 0
             */
			ltPropWeekStart : Lyte.attr('number',{default: 0}),
			/**
             * @componentProperty {string} ltPropRestrict
             */
			ltPropRestrict : Lyte.attr('string',{default : ''}),
			/**
             * @componentProperty {boolean} ltPropLoaderYield
			 * @default false
             */
			ltPropLoaderYield : Lyte.attr('boolean',{default: false}),
			ltPropMaxEventCountLength : Lyte.attr('number',{default: 5}),
			ltPropMinResizeWidth : Lyte.attr('number',{default: 20}),
			ltPropArrowkeyYield : Lyte.attr('boolean',{default : false}),
			ltPropHolidaylist : Lyte.attr('array',{default : []}),
			ltPropHolidayObject: Lyte.attr('object',{default:{}}),
			ltPropHolidayFormat : Lyte.attr('string',{default: 'DD-MM-YYYY'}),
			groupByData : Lyte.attr('array',{default:[]}),
			ltPropManipulatedEvent : Lyte.attr('array',{default:[]}),
			timeline : Lyte.attr('array',{default : []}),
			populateObject : Lyte.attr('object',{default:{}}),
			EventIndex : Lyte.attr('number',{default:0}),
			populateIndex : Lyte.attr('number',{default:0}),
			rightIntersectionObserver : Lyte.attr('object',{default : {}}),
			leftIntersectionObserver : Lyte.attr('object',{default : {}}),
			headerArray : Lyte.attr('array',{default : []}),
			subheader : Lyte.attr('array',{default : []}),
			months :  Lyte.attr( 'array', { default : [ 'January', 'February', 'March', 'April', 'May','June' ,'July','August','September','October','November','December' ] } ),
			prevScroll: Lyte.attr('number',{default:0}),
			enableGroup: Lyte.attr('boolean',{default : false})
		}		
	},
	init: function(){
		var _this = this;
		this.$node.removeEvent = function( evtId ){
			var _this = this.component;
			var timelineDiv = _this.$node.querySelector('div.lyteTimelineViewContentElem');
			var events = _this.getData('ltPropEvent');
			var delIdx = events.findIndex(function( elem ){
				return elem.id === evtId ? true : false;
			});
			if( delIdx !== -1 ){
				Lyte.arrayUtils(events,'removeAt',delIdx,1);
			}
			_this.updatePopulateObj( timelineDiv.scrollTop );
			_this.setTodayPosition();
		}
		this.$node.updateEvent = function( evtId  , key , value){
			var timelineDiv = _this.$node.querySelector('div.lyteTimelineViewContentElem');
			var events = _this.getData('ltPropEvent');
			if(typeof evtId == 'string'){
				_this.updateValue(evtId,value,events,key,timelineDiv);
			}else{
				evtId.forEach(function(eventId,index){
					_this.updateValue(eventId,value[index],events,key,timelineDiv);
				})
			}
			_this.updatePopulateObj( timelineDiv.scrollTop );
			_this.dragDrop();
			_this.setTodayPosition();
			
		}
		this.$node.addEvent = function( evt , index){
			var _this = this.component;
			var events = _this.getData('ltPropManipulatedEvent');
			index = (index == undefined) ?  events.length : index;
			if(Array.isArray(evt)){
				events = events.concat(evt);
			}else{
				events.splice(index,0,evt);
			}	
			_this.setData('ltPropEvent',events);
			_this.setIndex(  _this.getData('ltPropManipulatedEvent') );			
			if(_this.getData('ltPropDraggable')){
				_this.dragDrop();
			}
			_this.setTodayPosition();
		}
		this.$node.addGroupEvent = function( groupHead , events , isloadmore ,insertIndex){
			var groupArr = _this.getData('groupByData');
			var index = _this.groupIndex( groupHead );
			var group = groupArr[index];
			if(insertIndex == undefined || !group.children){
				if(!group.children){
					Lyte.objectUtils(group,'add','children',[]);
				}
				insertIndex = group.children.length; 
			}
			Lyte.arrayUtils(group.children,'insertAt',insertIndex,events);
			_this.setIndex(group.children);
			var loadmore = isloadmore ? 1 : 0;
			Lyte.objectUtils(group,'add','rowCount', (group.children.length + isloadmore));
			Lyte.objectUtils(group,'add','loadmore',isloadmore);
			var accordion = $L('[group="'+groupHead+'"]',_this.$node)[0];
			if(accordion){
				var loadmore = isloadmore ? 1 : 0;
				$L('.lyteTimelineViewGroupbyAccordionBody',accordion)[0].style.height = (group.children.length + loadmore) * 30 + (group.children.length + loadmore - 1 ) * 10 + 'px';
			}
			$L.fastdom.mutate(function(){
				for(var index = 0;index < group.children.length; index++){
					_this.setEventPosition(group.children[index]);
					_this.setarrowPosition(group.children[index]);
				}
				setTimeout(function(){
					if(_this.getData('ltPropDraggable')){
						_this.dragDrop();
					}
					_this.isHasScroll();
				},10);
				$L('.lyteTimelineViewGroupbyAccordionBody',accordion).one('transitionend',function(){
					_this.setTodayPosition();
				})
				
			});
		}
		this.$node.deleteGroupEvent = function( groupHead , eventid , isloadmore){
			var groupArr = _this.getData('ltPropGroupby');
			var index = _this.groupIndex( groupHead );
			var group = groupArr[index];
			if(group.children){
				var event = $u.findWhere(group.children,{'id':eventid});
				Lyte.arrayUtils(group.children,'removeAt',event.index-1,1);
			}
			_this.setIndex(group.children);
			var loadmore = isloadmore ? 1 : 0;
			Lyte.objectUtils(group,'add','rowCount', group.children.length + loadmore);
			$L.fastdom.mutate(function(){
				var accordion = $L('[group="'+groupHead+'"]',_this.$node)[0];
				if(accordion){
					$L('.lyteTimelineViewGroupbyAccordionBody',accordion)[0].style.height =(group.rowCount) * 30 + (group.rowCount - 1 ) * 10  + 'px';
				}				
				setTimeout(function(){
					_this.setArrowAndEventPosition(true,true);
					_this.isHasScroll();
				},10)
				_this.setTodayPosition();
			});
		}
		this.$node.updateGroupEvent = function( groupHead , eventid , key , value){
			var groupArr = _this.getData('ltPropGroupby');
			var index = _this.groupIndex( groupHead );
			var group = groupArr[index];
			if(group && group.children){
				if(typeof eventid == 'string'){
					_this.updateValue(eventid,value,group.children,key);
				}else{
					eventid.forEach(function(eventId,index){
						_this.updateValue(eventId,value[index],group.children,key);
					})
				}
			}
			_this.dragDrop();
			_this.setTodayPosition();
		}
		this.$node.today = function(prevScorllAnimation){
			if(!_this.$node.scrolled){
				return;
			}
			_this.$node.scrolled = false;	
			var view = _this.getData('ltPropView');
			var scroll = $L('.lyteTimelineViewContentElem',_this.$node)[0];
			var maxNoOfDate = _this.findNoOfDate(scroll,_this.getData('ltPropDateWidth')[view]);
			var todayDiv = $L('.lyteTimelineViewToday',_this.$node)[0];
			var scrollOffset = scroll.getBoundingClientRect();
			var timeline = this.getData('timeline');
			var currentDiv;
			if(view == 'quarter'){
				currentDiv = $L("[data-date='"+$L.moment(_this.getData('ltPropCurrentDate')).startOf('month').format('DD-MM-YYYY')+"']",_this.$node)[0];
			}else{
				var tempDate = $L.moment(_this.getData('ltPropCurrentDate'));
				while(!_this.isWorkingDayOnly(tempDate.getDObj())){
					tempDate.add(1,'date');
				}
				currentDiv = $L("[data-date='"+$L.moment(_this.getData('ltPropCurrentDate')).format('DD-MM-YYYY')+"']",_this.$node)[0];
			}
			var groupWidth = parseInt( _this.getData('ltPropGroupbyPanelWidth'));
			var isRTL = _lyteUiUtils.getRTL();
			groupWidth = _this.getData('ltPropGroup') ? groupWidth : 0;
			if(todayDiv && currentDiv){
				if(!prevScorllAnimation){
					scroll.style.scrollBehavior = 'smooth';
				}
				var todayDivtext = $L('.lyteTimelineViewTodayText',todayDiv)[0];
				if(((parseInt(currentDiv.style.getPropertyValue("--lyte-timelineview-col-number")) - maxNoOfDate) > 0 ) || ((parseInt(currentDiv.style.getPropertyValue("--lyte-timelineview-col-number")) + maxNoOfDate) < (timeline.length - 1) )){
					if(isRTL){
						var scrollLeft = (todayDivtext.getBoundingClientRect().right ) - (scrollOffset.right - groupWidth) + (scroll.offsetWidth - groupWidth) / 2 - todayDivtext.getBoundingClientRect().width/2 ;
						this.prevScroll += scrollLeft;
						scroll.scrollLeft += scrollLeft;
					}else{
						var scrollLeft =  (todayDivtext.getBoundingClientRect().left + todayDivtext.offsetWidth/2) - (scrollOffset.left + groupWidth) - ((scrollOffset.width - groupWidth) / 2) ;
						this.prevScroll += scrollLeft;
						scroll.scrollLeft += scrollLeft;
					}
					setTimeout(function(){
						if(isRTL){
							var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().right - groupWidth - 3, $L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
						}else{
							var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().left + groupWidth + 3, $L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
						}
						this.setData('StartDateOfView',cur_date);
					}.bind(this),100)
					
				}else{
					_this.generateTodayTimeline(scroll,isRTL,groupWidth,prevScorllAnimation);
				}
			}else{
				_this.generateTodayTimeline(scroll,isRTL,groupWidth,prevScorllAnimation);
			}
			
		}
		this.$node.navLeft = function(){
			var scroll = $L('.lyteTimelineViewContentElem',_this.$node)[0];
			var view = _this.getData('ltPropView');
			var maxNoOfDate = _this.findNoOfDate(scroll,_this.getData('ltPropDateWidth')[view]);
			scroll.style.scrollBehavior = 'smooth';
			var timeline = _this.getData('timeline');
			var startDate = _this.getFirstDateOftheViewPort();
			var startDiv = $L("[data-date='"+startDate+"']",_this.$node)[0];
			var groupWidth = $L('.lyteTimelineViewGroupbyElementHeader',_this.$node)[0];
			groupWidth = groupWidth ? groupWidth.offsetWidth : 0;
			if(!startDiv){
				return;
			}
			var startOffset = startDiv.getBoundingClientRect();
			var scrollOffset = scroll.getBoundingClientRect();
			var isRTL = _lyteUiUtils.getRTL();
			if((startOffset.left + startOffset.width/2) > scrollOffset.left){
				startDiv = startDiv.previousElementSibling;
				startOffset = startDiv.getBoundingClientRect();
			}
			if((parseInt(startDiv.style.getPropertyValue("--lyte-timelineview-col-number")) - maxNoOfDate) > 0   ){
				if(isRTL){
					scroll.scrollLeft -= scrollOffset.left - startOffset.left;
				}else{
					scroll.scrollLeft -= scrollOffset.right - startOffset.right + 1;
				}
			}else{
				scroll.style.scrollBehavior = '';
				var leftObserver = _this.getData('leftIntersectionObserver');
				if(leftObserver){
					var StartOfView = $L('[data-date="'+timeline[0].format('DD-MM-YYYY')+'"]',_this.$node)[0]
					leftObserver.observer.unobserve(StartOfView);
				}
				_this.UpdateOnLeft(scroll,_this.getData('ltPropView'));
				setTimeout(function(){
					startOffset = startDiv.getBoundingClientRect();
					scroll.style.scrollBehavior = 'smooth';
					if(isRTL){
						scroll.scrollLeft -= scrollOffset.left - startOffset.left;
						var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().right - groupWidth - 3, $L('.lyteTimelineViewHeaderElem',_this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
					}else{
						scroll.scrollLeft -= scrollOffset.right - startOffset.right + 1;
						var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().left + groupWidth + 3, $L('.lyteTimelineViewHeaderElem',_this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
					}
					_this.setData('StartDateOfView',cur_date);
				},100)
			}
			
		}
		this.$node.navRight = function(){
			var scroll = $L('.lyteTimelineViewContentElem',_this.$node)[0];
			var view = _this.getData('ltPropView');
			scroll.style.scrollBehavior = 'smooth';
			var maxNoOfDate = _this.findNoOfDate(scroll,_this.getData('ltPropDateWidth')[view]);
			var timeline = _this.getData('timeline');
			var endDate = _this.getLastDayOftheViewPort();
			var endDiv = $L("[data-date='"+endDate+"']",_this.$node)[0];
			var groupWidth = $L('.lyteTimelineViewGroupbyElementHeader',_this.$node)[0];
			groupWidth = groupWidth ? groupWidth.offsetWidth : 0;
			if(!endDiv){
				return;
			}
			var endOffset = endDiv.getBoundingClientRect();
			var scrollOffset = scroll.getBoundingClientRect();
			var isRTL = _lyteUiUtils.getRTL();
			if((endOffset.left + endOffset.width/2) < scrollOffset.right ){
				endDiv = endDiv.nextElementSibling;
				endOffset = endDiv.getBoundingClientRect();
			}
			if((timeline.length - 1) > (maxNoOfDate + parseInt(endDiv.style.getPropertyValue("--lyte-timelineview-col-number")) ) ){
				if(isRTL){
					scroll.scrollLeft -= scrollOffset.right - endOffset.right;
				}else{
					scroll.scrollLeft -= scrollOffset.left - endOffset.left;
				}
			}else{
				var rightObserver = _this.getData('rightIntersectionObserver');
				if(rightObserver){
					var StartOfView = $L('[data-date="'+timeline[timeline.length-1].format('DD-MM-YYYY')+'"]',_this.$node)[0]
					rightObserver.observer.unobserve(StartOfView);
				}
				_this.UpdateOnRight(scroll,_this.getData('ltPropView'));
				setTimeout(function(){
					endOffset = endDiv.getBoundingClientRect();
					scroll.style.scrollBehavior = 'smooth';
					if(isRTL){
						scroll.scrollLeft -= scrollOffset.right - endOffset.right;
						var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().right - groupWidth - 3, $L('.lyteTimelineViewHeaderElem',_this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
					}else{
						scroll.scrollLeft -= scrollOffset.left - endOffset.left;
						var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().left + groupWidth + 3, $L('.lyteTimelineViewHeaderElem',_this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
					}
					_this.setData('StartDateOfView',cur_date);
				},100)
			}
		}
		this.$node.eventPlacement = function(event){
			_this.setEventPosition(event);
		}
		this.$node.onViewResize = function(){;
			var currDate = _this.getData('StartDateOfView');
			_this.setArrowAndEventPosition(true,true);
			_this.callOnViewDateChange(currDate)
		} 
		this.$node.UpdateGroupHeader = function( groupHead , key , value ){
			var groupArr = _this.getData('ltPropGroupby');
			var RendergroupArr = _this.getData('groupByData');
			var index = _this.groupIndex( groupHead );
			if(groupArr[index]){
				Lyte.objectUtils(groupArr[index],'add',key,value);
				Lyte.objectUtils(RendergroupArr[index],'add',key,value);
			}
			_this.setTodayPosition();
		}
		this.$node.renderTimeline = function( group, events, workingOnly ){
			var startDate = $L.moment(_this.getFirstDateOftheViewPort(),"DD-MM-YYYY");
			while(!_this.isWorkingDayOnly(startDate.getDObj())){
				startDate.add(1,'date');
			}
			_this.data.ltPropEvent = events;
			_this.data.ltPropWorkingDay = workingOnly;
			_this.data.ltPropGroup = group;
			_this.setData('enableGroup', group);
			_this.generateHolidayList();
			_this.setData('timeline',[]);
			_this.$node.preventScroll = true;
			_this.setTimeline(startDate.getDObj());
			_this.setData('groupByData',[]);
		    if(_this.getData('ltPropGroup')){
				_this.addGroupByUser(0);
			}
			setTimeout(function(){
				if(_this.$node.scrolled){
					_this.setTimelineView(startDate.getDObj());
					_this.generateEvent();
					_this.dragDrop()
				}else{
					_this.intializeTimeline(true,_this.$node.scrolled);
				}
			},10);

		}
		this.generateHolidayList();
	},
	didConnect : function(){
		this.$node.classList.add('lyteTimelineViewFixedContainerHeight');
		if(this.getData('ltPropGroup')){
			this.setData('enableGroup',this.getData('ltPropGroup'));
		}
		this.intializeTimeline(true);
		if(this.getData('ltPropGroup')){
			this.addGroupByUser(0);
		}
		this.$node.rendered = true;
		var compOffset = this.$node.getBoundingClientRect();
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0]
		this.$node.position = { left : compOffset.left , top : compOffset.top};
		this.$node.prevScrollTop = scroll.scrollTop;
		this.rendered = true;
	},
	weekStartObserver : function(){
		$L.moment.setWod(this.getData('ltPropWeekStart'));
	}.observes('ltPropWeekStart').on('init'),
	onHolidayListGenerate : function(){
		var startDate = $L.moment(this.getFirstDateOftheViewPort(),"DD-MM-YYYY");
		while(!this.isWorkingDayOnly(startDate.getDObj())){
			startDate.add(1,'date');
		}
		this.generateHolidayList();
		this.setData('timeline',[]);
		this.setTimeline(startDate.getDObj());
		this.setData('prevScroll',undefined)
		setTimeout(function(){
			if(this.$node.scrolled){
				this.setTimelineView(startDate.getDObj());
				this.generateEvent();
				this.dragDrop()
			}else{
				this.intializeTimeline(false,this.$node.scrolled);
			}
		}.bind(this),10);
		
	}.observes('ltPropHolidaylist','ltPropWorkingDay','ltPropHolidaylist.[]','ltPropHolidayFormat'),
	onHeightChange : function(){
		this.$node.style.height = this.getData('ltPropMaxHeight') + 'px';
		if(this.$node.rendered){
			this.setTodayPosition();
		}
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
		if( scroll && this.lastaccordion && this.lastaccordion.getBoundingClientRect().bottom - 50  <= (scroll.getBoundingClientRect().top + this.getData('ltPropMaxHeight'))){
			this.lastaccordion = null;
			this.addGroupByUser( this.getData('groupByData').length );
			this.setTodayPosition();
		}
	}.observes('ltPropMaxHeight').on('init'),
	intializeEvent : function(){
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
		if(scroll.classList.contains('lyteTimelineViewNoScroll')){
			scroll.scrollTop = 0;
		}
		this.setData('prevScroll',-1);
		this.setData('populateObject',{});	
		this.generateEvent();
		this.dragDrop();
	}.observes('ltPropEvent.[]'),
	OnToggleGroup : function(){
		var startDate = this.getFirstDateOftheViewPort();
		this.setData('enableGroup',this.getData('ltPropGroup'));
		this.setData('groupByData',[]);
		if(this.getData('ltPropGroup')){
			this.addGroupByUser(0);
		}
		setTimeout(function(){
			if(this.$node.scrolled){
				this.setTimelineView(startDate);
				this.generateEvent(true);
			}else{
				this.setData('timeline',[]);
				this.intializeTimeline(true,this.$node.scrolled);
			}
			this.setTodayPosition()
		}.bind(this),10)
				
	}.observes('ltPropGroup'),
	OnToggleDragDrop : function(){
		if(this.getData('ltPropDraggable')){
			this.dragDrop();
		}else{
			var event = $L('.lyteTimelineViewEvent',this.$node);
			$L(event).draggable('destroy');
		}
	}.observes('ltPropDraggable'),
	onGroupbyDataChange : function(){
		this.setData('groupByData',[]);		
		this.addGroupByUser(0);	
	}.observes('ltPropGroupby'),
	onViewChange : function(){
		this.setData('timeline',[]);
		this.intializeTimeline();
		$L('.lyteTimelineViewContentElem',this.$ndoe)[0].scrollTop = 0;
		if(this.getMethods('onViewChange')){
			this.executeMethod('onViewChange',this.$node);
		}
	}.observes('ltPropView','ltPropDateWidth'),
	onHoverCardDataChange : function(){
		if(this.data.ltPropHoverCardData){
			var hoverCardDiv = $L('.lyteTimelineViewHoverCardDiv',this.$node)[0];
			var hoverCard = $L('.lyteTimelineViewHoverCard',hoverCardDiv)[0];
			hoverCard.classList.remove('lyteTimelineViewHoverCardHide');
		}	
	}.observes('ltPropHoverCardData'),
	updateValue : function(eventId,value,events,key,container){
		var delIdx = events.findIndex(function( elem ){
			return elem.id === eventId ? true : false;
		});
		Lyte.objectUtils(events[delIdx],'add',key,value);
		var updateObj = this.getData('populateObject');
		var flag  = false;
		for (const key in updateObj) {
			if(updateObj[key].id == events[delIdx].id){
				flag = true;
				break;
			}
		}
		if(events[delIdx] && flag){
			this.setEventPosition(events[delIdx],undefined,container);
			this.setarrowPosition(events[delIdx],undefined,container);
		}
	},
	setTimelineView : function(startDate){
		var view = this.getData('ltPropView');
		var groupWidth = this.getData('ltPropGroup') ? parseInt(this.getData('ltPropGroupbyPanelWidth')) : 0;
		var startOfView = $L.moment(startDate,'DD-MM-YYYY').getDObj();
		if(view !== 'quarter'){
			startOfView = this.findNextworkingDay(startOfView);
		}
		startOfView = $L.moment(startOfView);
		startOfView = $L('[data-date="'+  startOfView.format('DD-MM-YYYY') +'"]',this.$node)[0];
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0],
		scrollOffset = scroll.getBoundingClientRect();
		
		if(_lyteUiUtils.getRTL()){
			this.prevScroll +=  startOfView.getBoundingClientRect().right - (scrollOffset.right - groupWidth);
			scroll.scrollLeft +=  startOfView.getBoundingClientRect().right - (scrollOffset.right - groupWidth);
		}else{
			this.prevScroll += startOfView.getBoundingClientRect().left - (scrollOffset.left + groupWidth);
			scroll.scrollLeft += startOfView.getBoundingClientRect().left - (scrollOffset.left + groupWidth);
		}
		this.intializeInfinteScroll(view,true);
	},
	generateTodayTimeline : function(scroll,isRTL,groupWidth,prevScorllAnimation){
		scroll.style.scrollBehavior = '';
		var endOfView = $L.moment(this.getLastDayOftheViewPort(),'DD-MM-YYYY');
		this.setData('timeline',[]);
		var scrolledLeft = true;
		if(endOfView.fromNow($L.moment(new Date())).past){
			scrolledLeft = false
		}
		this.setTimeline(new Date());
		this.setTodayPosition();
		var todayDiv = $L('.lyteTimelineViewTodayText',this.$node)[0];
		this.prevScroll = 0;
		if(!scrolledLeft){
			scroll.scrollLeft += todayDiv.getBoundingClientRect().right - scroll.getBoundingClientRect().left + 500;
		}else{
			scroll.scrollLeft +=  todayDiv.getBoundingClientRect().left - scroll.getBoundingClientRect().right - 500;
		}
		$L.fastdom.mutate(function(){
			if(!prevScorllAnimation){
				scroll.style.scrollBehavior = 'smooth';
			}
			var current_date = $L.moment(new Date());
			while(!this.isWorkingDayOnly(current_date.getDObj())){
				current_date.add(1, 'date');
			}
			var date = current_date.format('DD-MM-YYYY');	
			var Date_div = $L('[data-date="'+ date +'"]',this.$node)[0];
			if(this.getData('ltPropView') == 'quarter'){
				current_date.startOf('month');
			}
			date = current_date.format('DD-MM-YYYY');
			Date_div = $L('.lyteTimelineViewTodayText',this.$node)[0];
			var subGroupHeader = groupWidth;
			var scrollLeft = scroll.scrollLeft;
			if(isRTL){
				this.prevScroll += Date_div.getBoundingClientRect().right - (scroll.getBoundingClientRect().right - subGroupHeader) + (scroll.offsetWidth - subGroupHeader)/2 - Date_div.offsetWidth/2; 
				scrollLeft += Date_div.getBoundingClientRect().right  - (scroll.getBoundingClientRect().right - subGroupHeader) + (scroll.offsetWidth - subGroupHeader)/2 - Date_div.offsetWidth/2 ;
			}else{
				this.prevScroll += Date_div.getBoundingClientRect().left - (scroll.getBoundingClientRect().left + subGroupHeader) - (scroll.offsetWidth - subGroupHeader)/2 + Date_div.offsetWidth/2;
				scrollLeft += Date_div.getBoundingClientRect().left  - (scroll.getBoundingClientRect().left + subGroupHeader) - (scroll.offsetWidth - subGroupHeader)/2 + Date_div.offsetWidth/2;
			}
			this.intializeInfinteScroll(this.getData('ltPropView'));
			this.setArrowAndEventPosition(true,true);
			this.prevScroll = scrollLeft;
			scroll.scrollLeft = scrollLeft;
			setTimeout(function(){
				if(isRTL){
					var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().right - subGroupHeader - 3, $L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
				}else{
					var cur_date = $L.moment(document.elementFromPoint(scroll.getBoundingClientRect().left + subGroupHeader + 3, $L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top).dataset.date,'DD-MM-YYYY');
				}
				this.setData('StartDateOfView',cur_date);
				this.callOnViewDateChange(cur_date);
			}.bind(this),100)
		}.bind(this));
	},
	generateHolidayList : function(){
		var holidayObj = {};
		var holidayList = this.getData('ltPropHolidaylist');
		var format = this.getData('ltPropHolidayFormat')
		holidayList && holidayList.forEach(function(date){
			date = $L.moment(date,format).getDObj();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var dateNo = date.getDate();
			holidayObj[year] = holidayObj[year] ? holidayObj[year] : {};
			holidayObj[year][month] = holidayObj[year][month] ? holidayObj[year][month] : {};
			holidayObj[year][month][dateNo] = true;
		});
		this.setData('ltPropHolidayObject',holidayObj);
	},
	intializeTimeline : function(init,isScrolled){
		var view = this.getData('ltPropView');
		var _this = this;
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
		var isRTL = _lyteUiUtils.getRTL();
		var currentDate = $L.moment( new Date(this.getData('ltPropCurrentDate').toString()) );
		this.setTimeline(undefined,undefined,init);
		if(view == 'quarter'){
			currentDate = currentDate.startOf('month');
		}else{
			while(!this.isWorkingDayOnly(currentDate.getDObj())){
				currentDate.add(1, 'date')
			}	
		}
		if(!isScrolled){
			_this.$node.preventScroll = true;
		}	
		currentDate = currentDate.format('DD-MM-YYYY');
		_this.prevScroll = undefined;
		if(_this.rendered){
			scroll.scrollLeft = 0;
		}
		var intersectionMonth =  $L('.lyteTimelineViewTodayText',_this.$node)[0];
		this.setTodayPosition();
		var subGroupHeader = parseInt( this.getData('ltPropGroupbyPanelWidth'));
		subGroupHeader = this.getData('ltPropGroup') ? subGroupHeader : 0;
		if(isRTL){
			var scrollLeft =   intersectionMonth.getBoundingClientRect().right - (scroll.getBoundingClientRect().right - subGroupHeader) + (scroll.offsetWidth - subGroupHeader)/2 - intersectionMonth.offsetWidth/2 ; 
		}else{
			var scrollLeft =   intersectionMonth.getBoundingClientRect().left - (scroll.getBoundingClientRect().left + subGroupHeader) - (scroll.offsetWidth - subGroupHeader)/2 + intersectionMonth.offsetWidth/2 ; 
		}
		scroll.scrollLeft = scrollLeft;
		var groupWidth = $L('.lyteTimelineViewGroupbyElementHeader',_this.$node)[0];
		groupWidth = groupWidth ? groupWidth.offsetWidth : 0;
		setTimeout(function(){
			if(isRTL){
				var currDate = $L.moment(document.elementFromPoint((scroll.getBoundingClientRect().right - 20 - subGroupHeader),$L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top + 5).dataset.date,'DD-MM-YYYY');
				var Current_div = $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0];
				if(Current_div){
					_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().right - groupWidth - Current_div.getBoundingClientRect().right);
				}
			}else{
				var currDate = $L.moment(document.elementFromPoint((scroll.getBoundingClientRect().left + 20 + subGroupHeader),$L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top + 5).dataset.date,'DD-MM-YYYY');
				var Current_div = $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0];
				if(Current_div){
					_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().left + groupWidth - Current_div.getBoundingClientRect().left);
				}
			}
			_this.callOnViewDateChange(currDate);
			_this.setData('StartDateOfView',currDate);
			_this.$node.preventScroll = false;
			_this.intializeInfinteScroll(view,init);
			_this.setArrowAndEventPosition(true,true);
			if(_this.getData('ltPropDraggable')){
				_this.dragDrop();
			}
		},10)
		this.generateEvent(init,scroll);
		
	},
	isHasScroll : function(){
		var container = this.$node.querySelector('.lyteTimelineViewContentElem');
		var lyteTimelineViewLastAccordion = $L('.lyteTimelineViewLastAccordion .lyteTimelineViewGroupbyAccordionBody',this.$node);
		var Accordion = $L('lyte-timeline-view-accordion',this.$node);
		var heightCheck = true;
		if(Accordion.length){
			var height = Accordion[Accordion.length-1].getBoundingClientRect().bottom - Accordion[0].getBoundingClientRect().top;
			var maxHeight = this.getData('ltPropMaxHeight');
			heightCheck = height < maxHeight;
		}
		var marginBottom = 0;
		if(lyteTimelineViewLastAccordion[0]){
			marginBottom = parseInt(window.getComputedStyle(lyteTimelineViewLastAccordion[0]).marginBottom);
		}
		if(lyteTimelineViewLastAccordion[0] &&  lyteTimelineViewLastAccordion[0].getBoundingClientRect().bottom + marginBottom <= (container.getBoundingClientRect().top + maxHeight) && heightCheck ){
			container.classList.add('lyteTimelineViewNoScroll');
		}else{
			container.classList.remove('lyteTimelineViewNoScroll');
		}
	},
	getLastDayOftheViewPort : function(){
		if(_lyteUiUtils.getRTL()){
			var endDate = document.elementFromPoint($L('.lyteTimelineViewContentElem',this.$node)[0].getBoundingClientRect().left + _lyteUiUtils.getScrollBarWidth() + 20 ,$L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top);
		}else{
			var endDate = document.elementFromPoint($L('.lyteTimelineViewContentElem',this.$node)[0].getBoundingClientRect().right - _lyteUiUtils.getScrollBarWidth() - 20 ,$L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top);
		}
		if(endDate){
			endDate = endDate.dataset.date;
		}
		return endDate;
	},
	getFirstDateOftheViewPort : function(){
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0]
		var subGroupHeader =  $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0];
		subGroupHeader = subGroupHeader ?  subGroupHeader.offsetWidth : 0;
		if(_lyteUiUtils.getRTL()){
			var startDate = document.elementFromPoint(scroll.getBoundingClientRect().right - subGroupHeader - 3, $L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top)
		}else{
			var startDate = document.elementFromPoint(scroll.getBoundingClientRect().left + subGroupHeader + 3, $L('.lyteTimelineViewHeaderElem',this.$node)[0].getBoundingClientRect().top);
		}
		if(startDate){
			startDate = startDate.dataset.date;
		}
		return startDate;
	},
	callOnViewDateChange : function(currDate){
		var endDate = this.getLastDayOftheViewPort();
		endDate = $L.moment(endDate,'DD-MM-YYYY');
		if(this.getMethods('onViewDateChange')){
			this.executeMethod('onViewDateChange',currDate.format('DD-MM-YYYY'),endDate.format('DD-MM-YYYY'));
		}
	},
	addDate : function(date,count,include){
		while(count > 0){
			date.add(1, 'date')
			while(!this.isWorkingDayOnly(date.getDObj())){
				date.add(1, 'date');
				if(include){
					count--;
				}
			}
			count--;
		}
		return date;

	},
	subtractDate : function(date,count){
		while(count !== 0){
			date.subtract(1, 'date')
			while(!this.isWorkingDayOnly(date.getDObj())){
				date.subtract(1, 'date')
			}
			count--;
		}
		return date;
	},
	UpdateEventPosition : function(eventData,useOriginal,count,draggable,callDrag,callDragStop,Usergroup,originalData){
		var endDate;
		if(eventData.end){
			endDate = $L.moment($u.clone(this.$node.startDate.getDObj().toString()));
			this.addDate(endDate,count); 
		}
		var format = this.getData('ltPropFormat');
		var copyEvent = {};
		if(useOriginal){
			copyEvent = eventData;
		}else{
			copyEvent.index = eventData.index;
			copyEvent.id = 'lyteTimelineViewDragPlaceholder';
		}
		copyEvent.start = this.$node.startDate.format(format)
		
		if(endDate){
			var originalDate = $L.moment(eventData.end,format);
			endDate.set('hours',originalDate.get('hours'));
			endDate.set('minutes',originalDate.get('minutes'));
			endDate.set('seconds',originalDate.get('seconds'));
			copyEvent.end = endDate.format(format);
		}
		if(callDrag){
			this.callOnDragNextDate(this.$node.startDate,endDate,eventData,draggable);
		}
		
		this.setEventPosition(copyEvent);
		if(this.getMethods('onEventDragStop') && callDragStop){
			return this.executeMethod('onEventDragStop',this.$node.startDate,endDate,this.$node,originalData,Usergroup) == false ? false : undefined;
		}
		return copyEvent;
	},
	dragDrop : function(){
		var _this = this;
		var event = $L('.lyteTimelineViewEvent',this.$node).not('.draggable-element').toArray();
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
		var ScrollRect = scroll.getBoundingClientRect();
		var scrollLeft = ScrollRect.left;
		var scrollRight = ScrollRect.right;
		var headerElem =  $L('.lyteTimelineViewHeaderElem',this.$node)[0];
		var placeholder;
		var events;
		var timelineDateDivWidth;
		if(headerElem){
			timelineDateDivWidth = headerElem.offsetWidth;
		}	 
		var prevClientX;
		this.$node.dragprevScroll = scroll.scrollLeft;
		var parent;
		var animationFrame;
		var groupName;
		var Usergroup;
		var DragElemWidth;
		var isRTL = _lyteUiUtils.getRTL();
		var navSpeed =  _this.getData('ltPropDateWidth')[_this.getData('ltPropView')];
		if(isRTL){
			scrollRight -= this.getData('ltPropGroup') ? parseInt(this.getData('ltPropGroupbyPanelWidth')) : 0;
		}else{
			scrollLeft += this.getData('ltPropGroup') ? parseInt(this.getData('ltPropGroupbyPanelWidth')) : 0;
		}
		var headerElem = $L('.lyteTimelineViewSecondaryHeaderElem',_this.$node);
		if(event.length){
			var dragCondition = function(prevClientX,clientX,eventData,minWidth,placeholder,draggable,isKeyboardNav){
				var minW = minWidth;
				if(!isKeyboardNav){
					minW = minWidth/2;
				}
				if( ( prevClientX - clientX ) >= ( minW ) ){
					var diff = parseInt((prevClientX - clientX)/(minW)) ;
					if(isRTL){
						_this.addDate(_this.$node.startDate,diff);
					}else{
						_this.subtractDate(_this.$node.startDate,diff);
					}
					if(!isKeyboardNav){
						prevClientX = clientX + ((prevClientX - clientX) % (minWidth / 2)) - (diff) * (minWidth/2);
					}else{
						prevClientX = clientX + ((clientX - prevClientX) % (minWidth));
					}
				}else if( ( clientX - prevClientX ) >= ( minW)){
					var diff = parseInt((clientX - prevClientX)/(minW));
					if(isRTL){
						_this.subtractDate(_this.$node.startDate,diff);
					}else{
						_this.addDate(_this.$node.startDate,diff);
					}
					if(!isKeyboardNav){
						prevClientX = clientX - ((clientX - prevClientX) % (minWidth / 2)) + (diff) * (minWidth/2);
					}else{
						prevClientX = clientX - ((clientX - prevClientX) % (minWidth))
					}
				}				
				_this.$node.dummyEvent = _this.UpdateEventPosition(events,false,count,draggable,true);
				return prevClientX;
			}
			var scrollAnimation = function(clientX,scroll,scrollLeft,scrollRight,eventData,minWidth,prevScroll,placeholder,draggable){
				if( clientX >= (scrollRight - 50) ){
					scroll.scrollLeft +=  10;
					if( (placeholder.getBoundingClientRect().right < draggable.getBoundingClientRect().right)  && !_this.$node.preventResize){
						_this.$node.dragprevScroll = dragCondition(_this.$node.dragprevScroll,scroll.scrollLeft,eventData,minWidth,placeholder,draggable);
					}
					else if(!isRTL){
						_this.$node.dragprevScroll += (scroll.scrollLeft - _this.$node.dragprevScroll);
					}	
				}
				else if( (clientX) <= ( scrollLeft + 50) ){
					scroll.scrollLeft -= 10;
					if((placeholder.getBoundingClientRect().left) > draggable.getBoundingClientRect().left && !_this.$node.preventResize){
						_this.$node.dragprevScroll = dragCondition(_this.$node.dragprevScroll,scroll.scrollLeft,eventData,minWidth,placeholder,draggable);
					}else if(isRTL){
						_this.$node.dragprevScroll -= (_this.$node.dragprevScroll - scroll.scrollLeft);
					}
				}
				else{
					cancelAnimationFrame(animationFrame);
					return;
				} 
				
				animationFrame = window.requestAnimationFrame(scrollAnimation.bind(this,clientX,scroll,scrollLeft,scrollRight,eventData,minWidth,_this.$node.dragprevScroll,placeholder,draggable))
			}
			var count;
			$L(event).draggable({
				cancel : '.lyteTimelineViewEventResizeHandler',
				aria : true,
				scrollDivY : '',
				onStart : function ( element , event) {
					timelineDateDivWidth = $L('.lyteTimelineViewHeaderElem',this.$node)[0].offsetWidth;
					var elem = event.target;
					while(!elem.classList.contains('lyteTimelineViewEvent') && elem.tagName !== 'LYTE-YIELD'){
						elem = elem.parentElement;
					}
					if(elem.tagName == 'LYTE-YIELD' && window.getComputedStyle(elem).position == 'absolute'){
						return false;
					}
					prevClientX = event.clientX;
				},
				helper : function(elem){
					var cloneNode = elem.cloneNode(true);
					cloneNode.style.right = '';
					if( _this.getData('ltPropGroup') ){
						var accordion = elem.closest('lyte-timeline-view-accordion');
						var container = $L('.lyteTimelineViewEventsContainer',accordion)[0];
					}else{
						var container = $L('.lyteTimelineViewEventsContainer',this.$node)[0];
					}
					cloneNode.style.height = elem.offsetHeight +'px';
					cloneNode.style.width = elem.offsetWidth + 'px';
					placeholder = elem.parentElement.cloneNode();
					var css = window.getComputedStyle(elem.parentElement);
					placeholder.id = 'lyteTimelineViewDragPlaceholder';
					placeholder.style.gridRow = css.gridRow;
					placeholder.classList.remove('lyteTimeLineViewNoEnd');
					var placeholder_child = elem.cloneNode();
					placeholder_child.classList.add('lyteTimelineViewDragPlaceholder');
					placeholder_child.style.setProperty('--lyte-timelineview-eventbg','transparent');
					placeholder.style.gridColumnStart = '';
					placeholder.style.gridColumnEnd = '';
					placeholder.style.height = elem.offsetHeight +'px';
					
					if(_this.getData('ltPropView') == 'quarter'){
						placeholder_child.style.position = 'absolute';
					}
					placeholder.appendChild(placeholder_child);
					container.appendChild(placeholder);

					if( elem.closest('.lyteTimelineViewEventDiv') && elem.closest('.lyteTimelineViewEventDiv').classList.contains('lyteTimeLineViewNoEnd')){
						cloneNode.classList.add('lyteTimeLineViewNoEnd');
					}
					if(elem.closest('.lyteTimelineViewEventDiv') && elem.closest('.lyteTimelineViewEventDiv').classList.contains('lyteTimelineViewAbsoluteEvent') ){
						cloneNode.classList.add('lyteTimelineViewAbsoluteEvent');
					}
					_this.$node.placeholder = placeholder;
					cloneNode.classList.add('lyteTimelineViewEventDrag');
					return cloneNode;
				},
				restrict : '.lyteTimelineViewDragRestrict',
				appendTo : '.lyteTimelineViewTable',
				onDragStart : function(draggableElement,handleElement,placeholder,event,originelem){
					parent = originelem.parentElement;
					originelem.parentElement.classList.add('lyteTimelineViewDragSourceElem');
					var id = originelem.parentElement.getAttribute('id');
					DragStartLeft = originelem.offsetLeft;
					events = $u.findWhere(_this.getData('ltPropManipulatedEvent'),{'id':id});
					$L('body').addClass('lyteTimelineViewDisableUserSelect')
					if(_this.data.ltPropGroup){
						var groupArr = _this.getData('ltPropGroupby');
						groupName = originelem.closest('lyte-timeline-view-accordion').getAttribute('group');
						var index = _this.groupIndex( groupName );
						Usergroup = groupArr[index];
						events = $u.findWhere(groupArr[index].children,{'id':id});
					}
					var startDate = $L.moment(events.start,_this.getData('ltPropFormat'));
					while(!_this.isWorkingDayOnly(startDate.getDObj())){
						startDate.add(1, 'date')
					}
					_this.$node.startDate = $L.moment(startDate.getDObj().toString());
					if(events.end){
						var endDate = $L.moment(events.end,_this.getData('ltPropFormat'));
						while(!_this.isWorkingDayOnly(endDate.getDObj())){
							endDate.subtract(1, 'date')
						}
						_this.$node.endDate = $L.moment(endDate.getDObj().toString());;
						count = _this.findNoOfworkingDay($L.moment(events.start,_this.getData('ltPropFormat')).getDObj(), $L.moment(events.end,_this.getData('ltPropFormat')).getDObj(),true) - 1
					}else{
						count = 0;
					}
					DragElemWidth = draggableElement.offsetWidth;
					_this.$node.dragprevScroll = scroll.scrollLeft;
					_this.$node.DragEvent = events.id;
					_this.$node.draggableDiv = originelem.closest('.lyteTimelineViewEventDiv');
					if(_this.getMethods('onEventDragStart')){
						_this.executeMethod('onEventDragStart',_this.$node,events,groupName,draggableElement,event);
					}
				},
				onDrag: function (draggableElement,handleElement,event,originelem){
					if(_this.$node.preventResize){
						return;
					}
					headerElem = $L('.lyteTimelineViewSecondaryHeaderElem',_this.$node);
					timelineDateDivWidth = headerElem[0].offsetWidth;
					var clientX = event.clientX;
					var view = _this.getData('ltPropView');
					var minWidth = _this.getData('ltPropDateWidth')[view];
					if(animationFrame){
						prevScroll = scroll.scrollLeft;
						cancelAnimationFrame(animationFrame);
					}
					var isKeyboardNav;
					if(event.type == 'keydown'){
						isKeyboardNav = true;
					}else{
						animationFrame = window.requestAnimationFrame(scrollAnimation.bind(this,clientX,scroll,scrollLeft,scrollRight,events,minWidth,_this.$node.dragprevScroll,placeholder.children[0],draggableElement))
					}
					prevClientX = dragCondition(prevClientX,clientX,events,minWidth,placeholder.children[0],draggableElement,isKeyboardNav);
					if(clientX < scrollLeft){
						scroll.scrollLeft -= navSpeed;
						prevClientX = draggableElement.getBoundingClientRect().left;
						return false;
					}else if((clientX+DragElemWidth) > scrollRight){
						scroll.scrollLeft += navSpeed;
						prevClientX = draggableElement.getBoundingClientRect().left;
						return false;
					}
					if(_this.boundaryCondition(headerElem,draggableElement,isRTL) ){
						return true;
					}
					return false;
				},
				onStop : function(draggableElement,destination,belowEle,Event,index,originelem){
					$L('body').removeClass('lyteTimelineViewDisableUserSelect')
					if(animationFrame){
						cancelAnimationFrame(animationFrame);
					}
					parent.classList.remove('lyteTimelineViewDragSourceElem');
					_this.$node.draggableDiv = null;
					_this.$node.placeholderLeft = undefined;
					_this.$node.placeholder = null;
					_this.$node.DragEvent = null;
					var clone_data = $u.clone(events);
					var value = _this.UpdateEventPosition(clone_data,true,count,draggableElement,false,true,Usergroup,events)
					placeholder.remove();
					draggableElement.style.zIndex = ''; 
					if(value == false){
						_this.setArrowAndEventPosition(true,true,scroll)
					}
					draggableElement.remove();
				},
				keyNavSpeed : navSpeed
			})	
		}

	},
	boundaryCondition : function(headerElem,draggable,isRTL){
		var firstHeaderRect =  headerElem[0].getBoundingClientRect();
		var draggableRect = draggable.getBoundingClientRect();
		var lastHaerderRect =  headerElem[headerElem.length - 1].getBoundingClientRect();
		if(isRTL){
			return firstHeaderRect.left > draggableRect.right || lastHaerderRect.left < draggableRect.right;
		}else{
			return firstHeaderRect.left < draggableRect.left || lastHaerderRect.right > draggableRect.right;
		}
	},
	callOnDragNextDate : function(startDate,endDate,eventData,draggableElement){
		if(this.getMethods('onEventDrag')){
			this.executeMethod('onEventDrag',startDate,endDate,eventData,draggableElement);
		}
	},
	generateEvent : function(init,scroll){
		var events = $u.clone(this.getData('ltPropEvent'));
		var group = this.getData('ltPropGroup');	
		if(!group){	
			this.setIndex( events );
			this.setData('ltPropManipulatedEvent',events);
			this.intializeVerticalScroll(init);
			this.setArrowAndEventPosition(true,true,scroll)
		}
		if(init){
			this.addEventForVerticalScroll();
		}
	},
	groupIndex : function(event){
		var groupArr = this.getData('groupByData');
		var returnVal = -1;
		groupArr.forEach(function(group, index){
			if( event ===  group.systemValue ){
				returnVal = index;
			}
		});
		return returnVal;
	},
	removerIntersectionObserver : function(){
		var leftObserver = this.getData('leftIntersectionObserver');
		if( leftObserver && leftObserver.observer){
			leftObserver.observer.unobserve(leftObserver.target);
			leftObserver.observer.disconnect()
		}
		var rightObserver = this.getData('rightIntersectionObserver');
		if( rightObserver && leftObserver.observer ){
			rightObserver.observer.unobserve(rightObserver.target);
			rightObserver.observer.disconnect();
		}
	},
	sortEvents: function( events ){
		var key = this.getData('ltPropSortKey');
		
		if( this.getMethods('sortFn') ){	//user should return a fn inside their callback fn
			var _this = this;
			events.sort( function(eventA, eventB){
				return _this.executeMethod('sortFn',eventA,eventB); 
			});
		}
		else if( key === 'start' || key === 'end' ){
			events.sort( this.sortFnBasedOnTime.bind(this) );
		}
		else{
			events.sort( this.sortFnBasedOnNumbers.bind(this) );
		}
		return events;
	},
	sortFnBasedOnTime: function( evtA, evtB ){
		var key = this.getData('ltPropSortKey');
		var format = this.getData('ltPropFormat');
		
		var objA = $L.moment( evtA[key], format );
		var objB = $L.moment( evtB[key], format );
		
		if( objA && objB ){
			if( objA.isSame( objB ) ){ 
				return 0;
			}
			if( !objA.fromNow( objB ).past ) {
				return -1;
			}
			else{
				return 1;
			}
		  
		}
		
		return 0;
	},
	sortFnBasedOnNumbers: function( evtA, evtB ){
		var key = this.getData('ltPropSortKey');
		
		var objA = evtA[key];
		var objB = evtB[key];
		
		if( objA && objB ){
			if( objA === objB ){ 
				return 0;
			}
			if( objA < objB ) {
				return -1;
			}
			else{
				return 1;
			}
		  
		}
		
		return 0;
	},
	setIndex: function( events ){
		var value = 3;
		if( this.getData('ltPropGroup') ){
			value = 1;
		}
		for( var ind=0;ind<events.length;ind++ ){
			Lyte.objectUtils( events[ind], 'add', 'index', value++);
		}
	},
	setTimeline : function( date ,fromArrow ,init ){
		var view = this.getData('ltPropView');
		var currentDate = date ? new Date(date.toString()) : new Date(this.getData('ltPropCurrentDate').toString());
		var outerDiv = $L('.lyteTimelineViewContentElem',this.$node)[0];
		var maxNoOfDate = this.findNoOfDate(outerDiv,this.getData('ltPropDateWidth')[view]);
		var isweek = false;
		var isQuarterView = false;
		this.setData('StartDateOfView',$L.moment(new Date(currentDate.toString())));
		if( view == 'month' ){
			maxNoOfDate *= 6;
			currentDate = this.subtractDate($L.moment(currentDate),(maxNoOfDate / 2))
			var startDate = new Date( currentDate.getDObj().toString() );
			currentDate.set('month',currentDate.getDObj().getMonth()-1);
			currentDate = $L.moment(currentDate).startOf('month').getDObj();
			maxNoOfDate += this.daysInBetween(startDate,currentDate);
		}else if(view == 'day'){
			maxNoOfDate *= 6;
			currentDate = this.subtractDate($L.moment(currentDate),(maxNoOfDate / 2))
			var startDate = new Date( currentDate.getDObj().toString() );
			currentDate.set('month',currentDate.getDObj().getMonth()-1);
			currentDate = $L.moment(currentDate).startOf('month').getDObj();
			maxNoOfDate += this.daysInBetween(startDate,currentDate);
		}
		else if( view == 'week' ){
			maxNoOfDate *= 6;
			currentDate = this.subtractDate($L.moment(currentDate),(maxNoOfDate / 2))
			var startDate = new Date( currentDate.getDObj().toString() );
			isweek = true;
			currentDate = this.startOfWeek(currentDate.getDObj());
			maxNoOfDate += this.daysInBetween(startDate,currentDate);
		}else if(view == 'quarter'){
			maxNoOfDate *= 6;
			currentDate.setMonth( currentDate.getMonth() - ( maxNoOfDate / 2  ) );
			var startDate = new Date( currentDate.toString() );
			isQuarterView = true;
			currentDate = new Date(currentDate.getFullYear(),0,1);
			maxNoOfDate += startDate.getMonth() - currentDate.getMonth();
		}
		var timelineHeader = this.generateTimeline( currentDate , maxNoOfDate , view , isweek  , isQuarterView ,'',fromArrow);
		this.setData('headerArray',timelineHeader.headerArray);
		this.setData('timeline',timelineHeader.timeline);
		if(!init){
			this.setTodayPosition();
		}
	},
	intializeVerticalScroll : function(init){
		var event =  this.getData('ltPropManipulatedEvent');
		var populateObject = {};
		var scroll =  $L('.lyteTimelineViewContentElem',this.$node)[0];
		var primaryHeader = $L('.lyteTimelineViewHeaderMonthElem',this.$node)[0];
		var secondartyHeader = $L('.lyteTimelineViewHeaderElem',this.$node)[0];
		var eventShowed = Math.round((scroll.offsetHeight - primaryHeader.offsetHeight - secondartyHeader.offsetHeight)/ 40) + 3;
		this.setData('populateObject',{});
		var prevIndex = 0;
		var index = 0;
		if(scroll.scrollTop){
			this.updatePopulateObj(scroll.scrollTop);
		}else{
			prevIndex = 0;
			for(; index < eventShowed && index < event.length ;index++){
				if( event[index]){
					populateObject['elemt'+(index - prevIndex)] = event[index]; 
				}	
			}
			this.setData('populateObject',populateObject);
			this.setData('EventIndex',index);
			this.setData('TotalRow',index);
		}
		
		if(!init){
			this.setTodayPosition();
		}
	},
	mousemove : function(event){
		if(this.$node){
			this.$node.position = {
				left : event.clientX,
				top : event.clientY
			}
		}
	},
	intializeInfinteScroll : function( view , init ){	
		var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
		var _this = this;
		var timeline = this.getData('timeline');
		var group = this.getData('ltPropGroup') ? $L('.lyteTimelineViewGroupbyElementHeader',_this.$node)[0].offsetWidth : 0;
		var isRTL = _lyteUiUtils.getRTL();
		var clearsetTimeout;
		if(init){
			scroll.addEventListener('mousemove',this.mousemove.bind(this))
			scroll.addEventListener('mouseleave',function(){
				_this.$node.position = {
					left : 0,
					top : 0 
				}
			})
			scroll.addEventListener('scroll',function(ev){	
				if(_this.$node.preventScroll){
					return;
				}
				scroll.style.scrollBehavior = '';
				var view = _this.getData('ltPropView');
				var widthDiv = _this.getData('ltPropDateWidth')[view];
				var maxScrollHeight = scroll.scrollHeight - scroll.offsetHeight;
				var scrollLeft = scroll.scrollLeft;
				var currDate = _this.getData('StartDateOfView');	
				_this.$node.scrolled = true;	
				if(currDate){
					widthDiv = $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',this.$node)[0];
					if(!widthDiv){
						widthDiv = $L('[data-date="'+_this.getFirstDateOftheViewPort()+'"]',this.$node)[0];
						_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().left + group - widthDiv.getBoundingClientRect().left )
						_this.callOnViewDateChange(currDate)
					}
					
					widthDiv = widthDiv ? widthDiv.offsetWidth : 0;
				}
				if(_this.prevScroll !== undefined && widthDiv){
					if(isRTL){	
						if( (scrollLeft - (_this.prevScroll - widthDiv)  ) >=  widthDiv  && widthDiv ){
							var diff = parseInt((scrollLeft - (_this.prevScroll - widthDiv)) / widthDiv)
							if(view == 'quarter'){
								currDate.subtract(diff,'month');
							}else{
								currDate.subtract(diff,'date');
								while(!_this.isWorkingDayOnly(currDate.getDObj())){
									currDate.subtract(1,'date');
								}
							}
							if($L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0]){
								_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().right - group - $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0].getBoundingClientRect().right)
								_this.callOnViewDateChange(currDate)
							}
						}
						else if(((_this.prevScroll) - scrollLeft ) >=  widthDiv && widthDiv){
							var diff =( (_this.prevScroll - scrollLeft) / widthDiv);
							if(view == 'quarter'){
								diff = Math.round(diff)
								currDate.add(diff,'month');
							}else{
								currDate.add(diff,'date');
								while(!_this.isWorkingDayOnly(currDate.getDObj())){
									currDate.add(1,'date');
								}
							}
							if($L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0]){
								_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().right - group - $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0].getBoundingClientRect().right)
								_this.callOnViewDateChange(currDate)
							}
						}
					}else{
						if((scrollLeft - _this.prevScroll) >= widthDiv ){
							var diff = (scrollLeft - _this.prevScroll) / widthDiv;
							if(view == 'quarter'){
								diff = Math.round(diff)
								currDate.add(diff,'month');
							}else{
								currDate.add(diff,'date');
								while(!_this.isWorkingDayOnly(currDate.getDObj())){
									currDate.add(diff,'date');
								}
							}
							if($L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0]){
								_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().left + group - $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0].getBoundingClientRect().left )
								_this.callOnViewDateChange(currDate)
							}
						}
						else if((_this.prevScroll - scrollLeft) >= widthDiv ){
							var diff =  parseInt((_this.prevScroll  - scrollLeft) / widthDiv);
							if(view == 'quarter'){
								diff = Math.round(diff)
								currDate.subtract(diff,'month');
							}else{
								currDate.subtract(diff,'date');
								while(!_this.isWorkingDayOnly(currDate.getDObj())){
									currDate.subtract(diff,'date');
								}
							}
							if($L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0]){
								_this.prevScroll = scroll.scrollLeft - ( scroll.getBoundingClientRect().left + group - $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',_this.$node)[0].getBoundingClientRect().left )
								_this.callOnViewDateChange(currDate)
							}
						}
					}
				}
				
				
				if(_this.getData('ltPropGroup')){
					if( _this.lastaccordion && (_this.lastaccordion.getBoundingClientRect().bottom - 50 ) <= scroll.getBoundingClientRect().bottom && _this.getData('groupByData').length <= _this.getData('ltPropGroupby').length){
						_this.lastaccordion = null;
						_this.addGroupByUser( _this.getData('groupByData').length );
						_this.setTodayPosition();
					}else if( _this.getMethods('onEventScrollEnd')  && (maxScrollHeight - 50) < scroll.scrollTop){
						_this.executeMethod('onEventScrollEnd',_this.$node,_this.getData('ltPropGroup'));
					}
					if(scroll.scrollTop == _this.$node.prevScrollTop){
						_this.setArrowAndEventPosition(true,false,scroll);
					}else{
						_this.setArrowAndEventPosition(true,true,scroll);
					}
					
				}else{
					if( _this.getMethods('onEventScrollEnd')  && scroll.scrollTop && (maxScrollHeight - 50) < scroll.scrollTop && !_this.enableScroll && scroll.scrollTop !== _this.$node.prevScrollTop){
						var loading_icon = $L('.lyteTimelineViewLoading',this.$node)[0];
						var loader = $L('lyte-loader',loading_icon)[0];
						loading_icon.classList.remove('lyteTimelineViewHideLoadmore');
						if(loader){
							loader.setData('ltPropShow',true);
						}
						_this.enableScroll = true;
						var promise =  _this.executeMethod('onEventScrollEnd',_this.$node,_this.getData('ltPropGroup'));
						if(promise && promise.then){
							promise.then(function(){
								loading_icon.classList.add('lyteTimelineViewHideLoadmore');
								if(loader){
									loader.setData('ltPropShow',false);
								}
								
								_this.enableScroll = false;
							});
						}else{
							loading_icon.classList.add('lyteTimelineViewHideLoadmore');
							if(loader){
								loader.setData('ltPropShow',false);
							}
							_this.enableScroll = false;
						}
					}
					_this.setArrowAndEventPosition(true,false,scroll);
				}
				_this.HideHoverCard();
				if(clearsetTimeout){
					clearTimeout(clearsetTimeout);
					clearsetTimeout = setTimeout(function(){
						_this.showHoverCard(document.elementFromPoint(_this.$node.position.left,_this.$node.position.top))
					},100);
				}else{
					clearTimeout(clearsetTimeout);
					clearsetTimeout = setTimeout(function(){
						_this.showHoverCard(document.elementFromPoint(_this.$node.position.left,_this.$node.position.top))
					},100);
				}
				_this.$node.prevScrollTop = scroll.scrollTop;
				
			});
		}
		$L.fastdom.mutate(function(){
			_this.removerIntersectionObserver();
			var leftHead  = $L('[data-date="'+ timeline[ 0 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
			var rightHead  = $L('[data-date="'+ timeline[ timeline.length - 1 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
			_this.rightIntersectionObserver(rightHead,view);
			_this.leftIntersectionObserver(leftHead,view);
		});
	},
	leftIntersectionObserver : function(leftHead,view){
		let options = {
			root: this.$node,
			thershold : 1.0
		  };
		var observer = new IntersectionObserver(handleIntersect, options);
		observer.observe(leftHead);
		if(leftHead){
			this.setData('leftIntersectionObserver',{'observer': observer,'target': leftHead});
		}
		var _this = this;
		function handleIntersect(entries, observer) {
			var scroll = $L('.lyteTimelineViewContentElem',_this.$node)[0];
			var entry = entries[0];
			if(entry.intersectionRatio > 0 || entry.isIntersecting){
				observer.unobserve(entry.target);
				_this.UpdateOnLeft(scroll,view,entry.target);
				
			}
		}
		return observer;
	},
	findNextworkingDay : function(date){
		while(!this.isWorkingDayOnly(date)){
			date.setDate(date.getDate()+1);
		}
		return date
	},
	UpdateOnRight : function(scroll,view){
		var view = this.getData('ltPropView');
		var timeline = this.getData('timeline');
		var headerArray = this.getData('headerArray');
		var rightheader = this.getData('rightIntersectionObserver').target;
		var date = new Date( timeline[ timeline.length - 1  ].getDObj().toString() );
		var maxNoOfDate = this.findNoOfDate(scroll,this.getData('ltPropDateWidth')[view]);
		var isWeek = false;
		var isQuarterView = false;
		var leftObserver = this.getData('leftIntersectionObserver');
		this.$node.preventResize = true;
		scroll.style.scrollBehavior = '';
		if(this.$node.resizeEvent){
			this.$node.currentEnd = this.getResizeDate(this.$node.placeholder,this.$node.resizeDirection,this.$node.resizeEvent).endDate;
		}
		if(leftObserver){
			leftObserver.observer.unobserve(leftObserver.target);
		}
		if( view == 'month'){
			date.setDate(date.getDate() +1);
			date = this.findNextworkingDay(date);
		}else if(view == 'day' ){
			date.setDate(date.getDate() +1);
			date = this.findNextworkingDay(date);
		}else if(view == 'week'){
			date.setDate(date.getDate() +1);
			date = this.findNextworkingDay(date);
			isWeek = true;
		}else{
			date.setMonth(date.getMonth() +1);
			isQuarterView = true;
		}
		var startIndex = parseInt(headerArray[ headerArray.length - 1  ].startColumn) + parseInt(headerArray[ headerArray.length - 1  ].endColumn) - 1;
		var timelineHeader = this.generateTimeline( date , maxNoOfDate , view, isWeek, isQuarterView , startIndex );
		Lyte.arrayUtils(timeline,'insertAt',timeline.length  ,timelineHeader.timeline);
		Lyte.arrayUtils(headerArray,'insertAt',headerArray.length ,timelineHeader.headerArray);
		var count = this.removeDateSection( 0 , view , maxNoOfDate );
		var _this = this;
		
		setTimeout(function(){
			_this.setArrowAndEventPosition(true,true);
			var headerElem = $L('.lyteTimelineViewHeaderElem',_this.$node);
			var width;
			if(_lyteUiUtils.getRTL()){
				width = headerElem[ headerElem.length - 1 ].getBoundingClientRect().left -  rightheader.getBoundingClientRect().right - 2;
			}else{
				width = headerElem[ headerElem.length - 1 ].getBoundingClientRect().right -  rightheader.getBoundingClientRect().right - 2;
			}
			_this.prevScroll -= width;
			scroll.scrollLeft -= width;
			_this.$node.dragprevScroll -= (_this.$node.dragprevScroll - scroll.scrollLeft);
			if(_this.$node.dummyEvent){
				_this.setEventPosition(_this.$node.dummyEvent,undefined,scroll);
			}
			_this.setTodayPosition();
			$L.fastdom.mutate(function(){
				var leftHead  = $L('[data-date="'+ timeline[ 0 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
				var rightHead  = $L('[data-date="'+ timeline[ timeline.length - 1 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
				_this.rightIntersectionObserver(rightHead,view);
				_this.leftIntersectionObserver(leftHead,view);
			});
			_this.$node.preventResize = false;
		},10);
	},
	rightIntersectionObserver : function(rightHead,view){
		
		let options = {
			root: this.$node,
			thershold : 1.0
		};
		var observer = new IntersectionObserver(handleIntersect, options);
		if(!rightHead){
			var timeline = this.getData('timeline');
			rightHead  = $L('[data-date="'+ timeline[ timeline.length - 1 ].format('DD-MM-YYYY') +'"]',this.$node)[0];
		}
		if(rightHead){
			observer.observe(rightHead);
			this.setData('rightIntersectionObserver',{'observer': observer,'target': rightHead});
		}
		var _this = this;
		function handleIntersect(entries, observer) {
			var scroll = $L('.lyteTimelineViewContentElem',_this.$node)[0];
			var entry = entries[0];
			if(entry.isIntersecting){
				observer.unobserve(entry.target);
				_this.UpdateOnRight(scroll);
				
			}
			
		}
		return observer;
	},
	UpdateOnLeft : function(scroll,view,target){
		var view = this.getData('ltPropView');
		var timeline = this.getData('timeline');
		var headerArray = this.getData('headerArray');
		var leftheader = this.getData('leftIntersectionObserver').target; 
		var date = new Date( timeline[ 0 ].getDObj().toString() );
		var maxNoOfDate = this.findNoOfDate(scroll,this.getData('ltPropDateWidth')[view]);
		var isWeek = false;
		var isQuarterView = false;
		var rightObserver = this.getData('rightIntersectionObserver');
		scroll.style.scrollBehavior = '';
		this.$node.preventResize = true;
		if(this.$node.resizeEvent){
			var DateObj = this.getResizeDate(this.$node.placeholder,this.$node.resizeDirection,this.$node.resizeEvent);
			if(DateObj){
				this.$node.currentStart = $L.moment(DateObj.startDate.getDObj().toString());
			}
		}
		if(rightObserver){
			rightObserver.observer.unobserve(rightObserver.target);
		}
		if( view == 'month' ){
			var count = maxNoOfDate;
			date = this.subtractDate($L.moment(date.toString()),count).getDObj();
			var startDate = new Date( date.toString() );
			date =  new Date(date.getFullYear(), date.getMonth(), 1);
			while(date.getTime() !== startDate.getTime()){
				if(!this.isWorkingDayOnly(startDate)){
					maxNoOfDate++;
				}
				startDate.setDate(startDate.getDate()-1);
			}
		}else if(view == 'day'){
			var count = maxNoOfDate;
			date = this.subtractDate($L.moment(date.toString()),count).getDObj();
			var startDate = new Date( date.toString() );
			date =  new Date(date.getFullYear(), date.getMonth(), 1);
			while(date.getTime() !== startDate.getTime()){
				if(!this.isWorkingDayOnly(startDate)){
					maxNoOfDate++;
				}
				startDate.setDate(startDate.getDate()-1);
			}
		}else if(view == 'week'){
			var count = maxNoOfDate;
			date = this.subtractDate($L.moment(date.toString()),count).getDObj();
			var startDate = new Date( date.toString() );
			date = this.startOfWeek(date);
			while(date.getTime() !== startDate.getTime()){
				if(!this.isWorkingDayOnly(startDate)){
					maxNoOfDate++;
				}
				startDate.setDate(startDate.getDate()-1);
			}
			isWeek = true;
		}else{
			var diff = 3 - (maxNoOfDate%3);
			maxNoOfDate += diff; 
			date.setMonth( date.getMonth() - (maxNoOfDate) );
			isQuarterView = true;
		}
		var timelineHeader = this.generateTimeline( date , maxNoOfDate , view, isWeek, isQuarterView  );
		var headerEndColumn = timelineHeader.headerArray;
		headerEndColumn = headerEndColumn[headerEndColumn.length - 1];
		
		headerArray.forEach(function(item ){
			Lyte.objectUtils( item,'add','startColumn', item.startColumn + timelineHeader.timeline.length );
		});
		Lyte.arrayUtils(headerArray,'insertAt',0,timelineHeader.headerArray);
		Lyte.arrayUtils(timeline,'insertAt',0,timelineHeader.timeline);
		this.removeDateSection(  headerArray.length - 1  , view , maxNoOfDate);
		var _this = this;
		setTimeout(function(){
			var headerElem =  $L('.lyteTimelineViewHeaderElem',_this.$node);
			var width =  leftheader.getBoundingClientRect().left - headerElem[0].getBoundingClientRect().left;
			_this.prevScroll += width;
			scroll.scrollLeft += width;
			_this.$node.dragprevScroll += width;
			if(_this.$node.dummyEvent){
				_this.setEventPosition(_this.$node.dummyEvent);
			}
			_this.setData('StartDateOfView',$L.moment(_this.getFirstDateOftheViewPort(),'DD-MM-YYYY'))
			_this.setTodayPosition();
			_this.setArrowAndEventPosition(true,true);
			$L.fastdom.mutate(function(){
				var leftHead  = $L('[data-date="'+ timeline[ 0 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
				var rightHead  = $L('[data-date="'+ timeline[ timeline.length - 1 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
				_this.rightIntersectionObserver(rightHead,view);
				_this.leftIntersectionObserver(leftHead,view);
			})

			_this.$node.preventResize = false;
		},10);
	},
	updatesubHeader : function(subheader,index){
		subheader.forEach(function(item ){
			Lyte.objectUtils( item ,'add','startColumn', item.startColumn - index );
		})
		return subheader;
	},
	removeDateSection : function(removePos , view, count ){
		var timeline = this.getData('timeline');
		var headerArray = this.getData('headerArray');
		if(removePos == 0){
			var index = 0;
			var headerCount = 0;
			while(index < count){
				var firstHeader = headerArray[headerCount];
				headerCount += 1;
				index += firstHeader.endColumn;
 			}
			Lyte.arrayUtils(timeline,'removeAt',0,index);
			Lyte.arrayUtils(headerArray,'removeAt',0,headerCount );
			if(view == 'quarter'){
				var endCount = 1;
				for(var Index = 0 ; Index < headerArray.length; Index++){
					Lyte.objectUtils( headerArray[Index] ,'add','startColumn', endCount );
					endCount += headerArray[Index].endColumn;
				}
			}else{
				firstHeader = headerArray[headerCount];
				headerArray.forEach(function(item ){
					Lyte.objectUtils( item ,'add','startColumn', item.startColumn - index );
				})
			}			
		}else{
			var index = 0 ;
			var headerCount = 0;
			var timelineRemoveStartpos = timeline.length;
			while(index < count){
				var lastHeader = headerArray[removePos];
				timelineRemoveStartpos -= lastHeader.endColumn;
				index += lastHeader.endColumn;
				headerCount += 1;
				removePos -= 1;
			}
			Lyte.arrayUtils(timeline,'removeAt', timelineRemoveStartpos , index );
			Lyte.arrayUtils(headerArray,'removeAt',removePos+1,headerCount);
		}
		return index ;
	},
	daysInBetween : function(startdate, endDate){
		return Math.ceil((startdate.getTime() - endDate.getTime()) / (1000 * 3600 * 24));
	},
	startOfWeek : function(date){
		var weekStart = this.getData('ltPropWeekStart');
		var start_diff = date.getDay()  - weekStart  ;
		if( date.getDay() > weekStart ){
			return new Date(date.setDate(date.getDate() - (start_diff)));
		}else{
			return new Date(date.setDate(date.getDate() - ((7 + start_diff) % 7)));
		}
  	},
	getDateSection : function( timeline, date, condition , view ){
		while( condition == this.getSectionMargin( date , view )  ){
			
			if(view == 'quarter'){
				timeline.push($L.moment(new Date( date.toString() )));	
				date.setMonth(date.getMonth()+1);
			}else{
				if(this.isWorkingDayOnly(date)){
					timeline.push($L.moment(new Date( date.toString() )));	
				}
				date.setDate(date.getDate()+1);
			}
		}
		return timeline;
	},
	isWorkingDayOnly : function(date){
		var holidayList = this.getData('ltPropHolidayObject')
		if(this.getData('ltPropWorkingDay')){
			return this.findDateinHolidayList(holidayList,date) && !this.getData('ltPropNonWorkingDays').includes(date.getDay());
		}else{
			return	true;
		}
	},
	findDateinHolidayList : function(holidayList, date){
		var flag = true;
		if(holidayList){
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var dateNumber = date.getDate();
			if(holidayList[year] && holidayList[year][month] && holidayList[year][month][dateNumber]){
				flag = false;
			}
		}
		return flag;
	},
	getSectionMargin : function( date , view ){
		if(view == 'month' || view == 'day'){
			return date.getMonth();
		}else if (view == 'week'){
			return this.findWeekoftheYear(date);
		}else if (view == 'quarter'){
			return this.findWhichQuarter(date);
		}
	},
	generateTimeline : function( date , maxNoOfDate , view ,isweek ,isQuarterView, startIndex,fromArrow ){
		var timeline = [];
		startIndex =  startIndex ? startIndex : 0;
		var index = startIndex;
		maxNoOfDate += startIndex;
		var headerArray = [];
		var headerIndex = 0;
		var condition ;
		condition = this.getSectionMargin( date , view );
		var year = date.getFullYear();
		while( index < maxNoOfDate  ){
			headerArray[headerIndex] = { month : date.getMonth(), year : date.getFullYear(), startColumn : ( index + 1 )}
			if(isweek){
				headerArray[headerIndex].week = this.findWeekoftheYear(date);
			}else if(isQuarterView){
				if(year !== date.getFullYear() ){
					year = date.getFullYear();
				}
				headerArray[headerIndex].quarter = this.findWhichQuarter(date);
			}
			timeline = this.getDateSection( timeline, date , condition , view );
			timeline[timeline.length - 1].isendOfView = 'true';
			index  = startIndex + timeline.length;
			var endColumn = (index + 1) - (headerArray[headerIndex].startColumn );
			endColumn = endColumn == 0   ? 1 : endColumn;
			headerArray[headerIndex].endColumn = endColumn ;
			condition = this.getSectionMargin( date , view );
			headerIndex++;
			if( this.data.timeline[0] && $L.moment(date).format('DD-MM-YYYY') == this.data.timeline[0].format('DD-MM-YYYY') && !fromArrow){
				break;
			}
		}	
		headerArray[ headerIndex - 1 ].endColumn = ( index + 1 ) - (headerArray[ headerIndex - 1 ].startColumn);
		return {'timeline' : timeline , 'headerArray' : headerArray };
	},
	findWhichQuarter : function(date){
		return 'Q' + $L.moment(date).format('Q');
	},
	findWeekoftheYear  : function(now){
		$L.moment.setWod(this.getData('ltPropWeekStart'));
		var week = $L.moment(now).format('w');
		return 'W'+week;
	},
	findNoOfDate : function(outerDiv,ColWidth){
		var view = this.getData('ltPropView');
		if(view == 'quarter'){
			ColWidth *= this.getCurrentMonthDays(2,2024);
		}
		return  Math.ceil(outerDiv.offsetWidth/ColWidth);
	},
	addEventForVerticalScroll: function(){
		var timelineDiv = this.$node.querySelector('div.lyteTimelineViewContentElem');
        timelineDiv.addEventListener('scroll', this.verticalScrollHandler.bind(this), {passive:true});
	},
	verticalScrollHandler : function( event ){
		this.updatePopulateObj( event.target.scrollTop );
	},
	updatePopulateObj : function( scrollTop ){
		if( scrollTop == undefined || scrollTop == this.getData('prevScroll')){
			return;
		}
		var eventIndex = Math.floor(scrollTop/40);
		var populateObject = this.getData('populateObject');
		var eventEvent = this.getData('ltPropManipulatedEvent');
		var objLen = this.getData('TotalRow');
		var ind = 0;
		if(eventEvent.length < (eventIndex + objLen+1) ){
			eventIndex = eventEvent.length - objLen ;
		}
		while( ind < objLen && eventEvent.length > eventIndex){
			if(eventEvent[eventIndex]){
				Lyte.objectUtils(populateObject, 'add', 'elemt'+ind, eventEvent[eventIndex]);
			}
			eventIndex++;
			ind++;
		}	
		this.setData('prevScroll',scrollTop);
		var _this = this;
		if(this.$node.intializeDragDrop){
			clearTimeout(this.$node.intializeDragDrop);
		}
		$L.fastdom.mutate(function(){
			_this.$node.intializeDragDrop = setTimeout(function(){
				
				var removeDraggable = $L('.lyteTimelineViewEvent.draggable-element',_this.$node);
				if(removeDraggable.length){
					removeDraggable.draggable('destroy');
				}
				_this.dragDrop();
			},100);
		})
		
	},
	findMonthAndYear : function(curr_month,year,which){
		curr_month = parseInt(curr_month);
		year = parseInt(year);
		if(which == 'next'){
			if(curr_month == 12){
				return {'month' : 1, 'year' : year+1};
			}else{
				return {'month' : curr_month + 1, 'year' : year};	
			}
		}else if(which == 'prev'){
			if(curr_month == 1){
				return {'month' : 12, 'year' : year-1};
			}else{
				return  {'month' : curr_month - 1, 'year' : year}; 				
			}
		}
	},
	getCurrentMonthDays : function(month,year){
		if(this.data.ltPropWorkingDay){
			return this.findNoOfworkingDay(new Date(year, month-1, 1),new Date(year, month, 0).getDate());
		}else{
			return new Date(year, month, 0).getDate();
		}
		
	},
	setQuarterEventPosition : function(start,end,eventTag,leftdirection,startOfView,event,endDate,callonResize){
			var eventTagOffsetLeft = eventTag.offsetLeft;
			var dateWidth = this.getData('ltPropDateWidth').quarter;
			eventTag.style.width = '';
			if(this.getData('ltPropWorkingDay')){
				var start_Date = this.findNoOfworkingDay(start.getDObj(),parseInt(start.format('DD')));
				var end_Date = this.findNoOfworkingDay(end.getDObj(),parseInt(end.format('DD')));
				var endMonthDay = this.findNoOfworkingDay(end.getDObj(),parseInt(end.endOf('month').format('DD')));
			}else{
				var start_Date = parseInt(start.format('DD'));
				var end_Date = parseInt(end.format('DD'));	
				var endMonthDay = parseInt(end.endOf('month').format('DD'));
			}
			
			var right = 0;
			if(!startOfView.fromNow(start).past){
				right = dateWidth * ( start_Date - 1 );
				eventTag.style[leftdirection] = dateWidth * ( start_Date - 1 ) + 'px';
			}else{
				eventTag.style[leftdirection] = 0;
			}
			eventTagOffseWidth = eventTag.offsetWidth;
			eventTagOffsetLeft = eventTag.offsetLeft;
			if(event.end && endDate){
				if(_lyteUiUtils.getRTL()){
					var width = eventTagOffseWidth - right -  dateWidth * (endMonthDay - end_Date );
					eventTag.style.width =  Math.abs(width) + 'px';
				}else{
					var width = eventTagOffseWidth - eventTagOffsetLeft -  dateWidth * ( endMonthDay - end_Date);
					eventTag.style.width = Math.abs(width) + 'px';
				}
				
			}else{
				if(_lyteUiUtils.getRTL()){
					var width =  eventTagOffsetLeft + eventTagOffseWidth - eventDivOffset.width +  dateWidth * ( (start_Date+2));
					eventTag.style.width = Math.abs(width) + 'px';
				}else{
					var width = eventTagOffseWidth - eventTagOffsetLeft -  dateWidth * ( endMonthDay - (start_Date+2));
					eventTag.style.width =  Math.abs(width) + 'px';
				}
			}
	},
	setEventPosition : function(event,eventDiv,scroll){
		var timeline = this.getData('timeline').length;
		var view = this.getData('ltPropView');
		var format = this.getData('ltPropFormat');
		var start = $L.moment(event.start,format);
		var end = $L.moment(event.end,format);
		var due = $L.moment(event.dueDate,format);
		if(!scroll){
			scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
		}
		var scrollOffset = scroll.getBoundingClientRect();
		var startOfView = $L.moment(this.getData('timeline')[ 0 ].getDObj().toString());
		var endOfView = $L.moment(this.getData('timeline')[ timeline - 1 ].getDObj().toString());
		var subgroup = $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0];
		var leftdirection = 'left';
		
		if(_lyteUiUtils.getRTL()){
			leftdirection = 'right';
		}
		while(!this.isWorkingDayOnly(start.getDObj())){
			start.add(1, 'date')
		}
		while( end && !this.isWorkingDayOnly(end.getDObj()) && !start.fromNow(end).past){
			end.subtract(1, 'date')
		}
		if(start.fromNow(end).past){
			end =  $L.moment(start.getDObj().toString());
		}
		var startDate = this.findEventPosition(start.format(format),this.data.ltPropView);
		var endDate = this.findEventPosition(end.format(format),this.data.ltPropView);
		
		if(!this.getData('ltPropGroup')){
			var prevScroll = scroll.scrollTop;
		}
		
		if(event.dueDate){
			var dueDate = this.findEventPosition(event.dueDate,this.data.ltPropView);
			if(!endOfView.fromNow(due).past){
				dueDate = timeline;
			}
		}
		var dateWidth = this.getData('ltPropDateWidth')[view];
		if(!eventDiv){
			eventDiv = $L('#'+event.id,this.$node)[0];
		}
		if(!eventDiv){
			return;
		}
		var eventTag = $L('.lyteTimelineViewEvent',eventDiv)[0];
		var leftResize = $L('.lyteTimelineViewLeft',eventDiv)[0];
		var rightResize = $L('.lyteTimelineViewRight',eventDiv)[0];
		eventTag.style[leftdirection] = '';
		eventTag.style.width = '';
		if(this.$node.resizeEvent && (event.id == this.$node.resizeEvent.id) ){
			var isQuarterView = view == 'quarter' ? true : false;
			if(this.$node.resizeDirection == 'left'){
				var placeholder_eventTag = 	$L('.lyteTimelineViewEvent',this.$node.placeholder)[0];
				placeholder_eventTag.style.left = '';
				placeholder_eventTag.style.width = '';
				if(!endDate){
					endDate = timeline + 1;
				}
				if(!startDate){
					if( (!endOfView.fromNow(end).past || (event.end && endDate)) && startOfView.fromNow(start).past){
						startDate = 1;
					}else{
						startDate = timeline + 1;
					}
					
				}
				if(isQuarterView){
					endDate += 1;
				}
				eventDiv.style.setProperty('--lyte-timelineview-column-end', endDate);
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-end', endDate);
				eventDiv.style.setProperty('--lyte-timelineview-column-start', startDate );
				var startDate = this.findEventPosition(this.$node.currentStart.format(format),this.data.ltPropView);
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-start', startDate);
				if(view == 'quarter'){
					var end_temp = $L.moment(end.getDObj().toString());
					this.setQuarterEventPosition(start,end,eventTag,leftdirection,startOfView,event,endDate);
					this.setQuarterEventPosition($L.moment(this.$node.currentStart.format(format),format),end_temp,placeholder_eventTag,leftdirection,startOfView,event,endDate,true);
					if(_lyteUiUtils.getRTL()){
						placeholder_eventTag.style.left = placeholder_eventTag.getBoundingClientRect().left - this.$node.placeholder.getBoundingClientRect().left + 'px';
						placeholder_eventTag.style.width = placeholder_eventTag.offsetWidth + 'px';
						placeholder_eventTag.style.right = '';
					}
				}
			}else{
				var placeholder_eventTag = 	$L('.lyteTimelineViewEvent',this.$node.placeholder)[0];
				if(view !== 'quarter'){
					placeholder_eventTag.style.left = '';
					placeholder_eventTag.style.width = '';
				}
				if(!startDate){
					startDate = 1;
				}
				if(!endDate){
					if( startDate && !endOfView.fromNow(end).past){
						endDate = timeline;
					}else{
						endDate = 1;
					}
				}
				eventDiv.style.setProperty('--lyte-timelineview-column-start', startDate);
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-start', startDate);
				eventDiv.style.setProperty('--lyte-timelineview-column-end', endDate);
				var endDate = this.findEventPosition(this.$node.currentEnd.format(format),this.data.ltPropView);
				endDate = endDate + 1;
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-end', endDate);
				if(isQuarterView){
					var start_temp = $L.moment(start.getDObj().toString());
					this.setQuarterEventPosition(start,end,eventTag,leftdirection,startOfView,event,endDate);
					this.setQuarterEventPosition(start_temp,$L.moment(this.$node.currentEnd.format(format),format),placeholder_eventTag,leftdirection,startOfView,event,endDate,true);
				}
			}
			return;
		}
		eventDiv.style.setProperty('--lyte-timelineview-row-number', event.index );
		if(!startDate){
			if(  ( (event.end && !endOfView.fromNow(end).past) || (event.end && endDate)) && startOfView.fromNow(start).past){
				startDate = 1;
			}
		}
		if( event.end ){
			if(!endDate){
				if( startDate && !endOfView.fromNow(end).past){
					endDate = timeline;
				}
			}
			eventDiv.style.setProperty('--lyte-timelineview-column-end', endDate + 1);
		}else{
			eventDiv.style.setProperty('--lyte-timelineview-column-end', startDate + 1);
		}
		eventDiv.style.setProperty('--lyte-timelineview-column-start', startDate);
		var eventTagOffseWidth = eventTag.offsetWidth;
		var eventyeild = $L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0];
		var eventDivOffset = eventDiv.getBoundingClientRect();
		var minResizeWidth = this.getData('ltPropMinResizeWidth');
		if(!startDate && !(endDate && event.end)){
			if(this.$node.draggableDiv == eventDiv){
				eventDiv.style.width = '0';
				eventDiv.style.visibility = '';
				if((!endOfView.fromNow(end).past || (event.end && endDate)) && startOfView.fromNow(start).past){
					eventDiv.style.setProperty('--lyte-timelineview-column-start', 1 );
					eventDiv.style.setProperty('--lyte-timelineview-column-end', 1);
				}else{
					eventDiv.style.setProperty('--lyte-timelineview-column-start', timeline );
					eventDiv.style.setProperty('--lyte-timelineview-column-end', timeline);
				}
				if(!this.getData('ltPropGroup')){
					eventTag.style[leftdirection] = scrollOffset.left - eventDivOffset.left + 'px';
				}else{
					eventTag.style[leftdirection] = subgroup.offsetWidth +  scrollOffset.left - eventDivOffset.left + 'px';
				}
				return;
			}else{
				eventDiv.style.width = '0';
				eventDiv.style.setProperty('--lyte-timelineview-column-start', 1 );
				eventDiv.style.setProperty('--lyte-timelineview-column-end', 1);
				eventDiv.style.visibility = 'hidden';		
			}	
		}else{
			eventDiv.style.width = '';
			eventDiv.style.visibility = '';
			if(view == 'quarter'){
				var eventTagOffsetLeft = eventTag.offsetLeft;
				var dateWidth = this.getData('ltPropDateWidth').quarter;
				eventTag.style.width = '';
				var start_Date = this.findNoOfworkingDay(start.getDObj(),parseInt(start.format('DD')));
				var end_Date = this.findNoOfworkingDay(end.getDObj(),parseInt(end.format('DD')));
				var endMonthDay = this.findNoOfworkingDay(end.getDObj(),parseInt(end.endOf('month').format('DD')));
				var right = 0;
				if(!startOfView.fromNow(start).past){
					right = dateWidth * ( start_Date - 1 );
					eventTag.style[leftdirection] = dateWidth * ( start_Date - 1 ) + 'px';
				}else{
					eventTag.style[leftdirection] = 0;
				}
				eventTagOffseWidth = eventTag.offsetWidth;
				eventTagOffsetLeft = eventTag.offsetLeft;
				if(event.end && endDate){
					if(_lyteUiUtils.getRTL()){
						var width = eventTagOffseWidth - right -  dateWidth * (endMonthDay - end_Date );
						eventTag.style.width =  Math.abs(width) + 'px';
					}else{
						var width = eventTagOffseWidth - eventTagOffsetLeft -  dateWidth * ( endMonthDay - end_Date);
						eventTag.style.width = Math.abs(width) + 'px';
					}
					
				}else{
					if(_lyteUiUtils.getRTL()){
						var width =  dateWidth * 2;
						eventTag.style.width = Math.abs(width) + 'px';
					}else{
						var width =  dateWidth * 2;
						eventTag.style.width =  Math.abs(width) + 'px';
					}
					
				}
				
			}	
			eventTagOffseWidth = eventTag.offsetWidth;
		}
		if(dueDate){
			var dueElem = $L('.lyteTimelineViewEvent .lyteTimelineViewDue',eventDiv)[0];
			dueElem.innerHTML = '';
			if(view == 'quarter'){
				var original_dueDate = due.getDObj().getDate();
				var dueDiv = $L("[data-date='"+due.startOf('month').format('DD-MM-YYYY')+"']")[0];
				if(dueDiv){
					var diff_width = (dueDiv.offsetWidth / due.endOf('month').getDObj().getDate()) * original_dueDate; 
					dueElem.style.width = dueDiv.getBoundingClientRect().left - eventTagOffset.right  + 20 + diff_width+ 'px';
				}
			}else{
				dueElem.style.width = ((dueDate - endDate) + 1) * this.getData('ltPropDateWidth')[view] + 20 + 'px';
			}
			var createNode = document.createElement('span');
			var textNode = document.createTextNode((dueDate - endDate));
			createNode.appendChild(textNode);
			dueElem.appendChild(createNode);
		}
		if(eventyeild){
			if( window.getComputedStyle(eventDiv).visibility !== 'hidden' && eventTagOffseWidth < eventyeild.offsetWidth ){
				eventDiv.classList.add('lyteTimelineViewAbsoluteEvent');
				eventyeild.style.position = 'absolute';
				eventyeild.style[leftdirection] = '100%';
				eventyeild.style.cursor = 'text';
			}else{
				eventDiv.classList.remove('lyteTimelineViewAbsoluteEvent');
				eventyeild.style.position = '';
				eventyeild.style[leftdirection] = '';
				eventyeild.style.cursor = '';
			}
		}
		
		if(eventTagOffseWidth <= minResizeWidth ){
			eventTag.classList.add('lyteTimelineViewResizeHandlerPosInCenter');
			if(leftResize && rightResize){
				leftResize.classList.add('lyteTimelineViewDisableResize');
				rightResize.classList.add('lyteTimelineViewSingleResizeHandler');
			}
		}else{
			eventTag.classList.remove('lyteTimelineViewResizeHandlerPosInCenter');
			if(leftResize ){
				leftResize.classList.remove('lyteTimelineViewDisableResize');
			}
			if(rightResize){
				rightResize.classList.remove('lyteTimelineViewDisableResize');
				rightResize.classList.remove('lyteTimelineViewSingleResizeHandler');
			}
		}
		if(!event.end){
			eventDiv.classList.add('lyteTimelineViewAbsoluteEvent');
			if(eventyeild){
				eventyeild.style.position = 'absolute';
				eventyeild.style[leftdirection] = eventTagOffseWidth + $L('.lyteTimeLineViewNoEndElem' ,eventDiv)[0].offsetWidth + 'px' ;
			}	
		}
		if(!this.getData('ltPropGroup')){
			scroll.scrollTop = prevScroll;
		}
		if(this.$node.draggableDiv == eventDiv){
			if(view =='quarter'){
				this.$node.placeholder.style.left = this.$node.placeholderLeft - eventDiv.getBoundingClientRect().left +'px';
			}
			this.$node.placeholderLeft = undefined;
		}
		
	},
	setarrowPosition : function(event,eventDiv,scrolloffsetLeft){
		var eventid = event.id;
		var eventDiv = $L('#'+event.id,this.$node)[0];
		var timeline =  this.getData('timeline');
		var view = this.getData('ltPropView');
		var format = this.getData('ltPropFormat');
		var startOfView = timeline[ 0 ];
		var endOfView =  timeline[ timeline.length - 1 ];
		var start = $L.moment( event.start ,format);
		var end = $L.moment( event.end ,format);
		while(!this.isWorkingDayOnly(start.getDObj())){
			start.add(1, 'date')
		}
		while( end && !this.isWorkingDayOnly(end.getDObj())){
			end.subtract(1, 'date')
		}
		var userDiv = $L('lyte-yield',eventDiv)[0];
		if(_lyteUiUtils.getRTL()){
			leftdirection = 'right';
		}
		if(this.$node.resizeEvent && this.$node.resizeEvent.id == event.id){
			return;
		}
		var tempStart = $L.moment(start.getDObj());
		var tempEnd = $L.moment(end.getDObj());
		if(view == 'quarter'){
			
			var startDate = $L('[data-date="'+	tempStart.startOf('month').format('DD-MM-YYYY') +'"]',this.$node)[0];
			if(event.end){
				var endDate = $L('[data-date="'+ tempEnd.startOf('month').format('DD-MM-YYYY') +'"]',this.$node)[0];
			}else{
				var endDate = undefined;
			}
		}else{
			var startDate = $L('[data-date="'+	tempStart.format('DD-MM-YYYY') +'"]',this.$node)[0];
			if(event.end){
				var endDate = $L('[data-date="'+ tempEnd.format('DD-MM-YYYY') +'"]',this.$node)[0];
			}else{
				var endDate = undefined;
			}
			
		}
		var arrowDiv = $L('[data-id="'+eventid +'"]',this.$node)[0];
		var leftArrow = $L('.lyteTimelineViewLeftArrow',arrowDiv)[0];
		var RightArrow = $L('.lyteTimelineViewRightArrow',arrowDiv)[0];
		var containmentOffset =  scrolloffsetLeft ;
		if(!containmentOffset){
			containmentOffset =  $L('.lyteTimelineViewContentElem',this.$node)[0].getBoundingClientRect() ;
		}
		if(this.$node.DragEvent == event.id){
			return;
		}
		if(!eventDiv){
			return;
		}
		var eventOffset = eventDiv.getBoundingClientRect();
		var isVisible = window.getComputedStyle(eventDiv).visibility == 'hidden' ? false : true;
		var TextNode = $L('.lyteTimelineViewArrowText',arrowDiv)[0];
		var containmentLeft = containmentOffset.left;
		var containmentRight = containmentOffset.right;
		var subGroupHeader =  $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0];
		var userDiv_width = userDiv.offsetWidth;
		var subGroupHeader_width = subGroupHeader ?  subGroupHeader.offsetWidth : 0;
		if(!eventDiv.classList.contains('lyteTimelineViewAbsoluteEvent')){
			if(_lyteUiUtils.getRTL()){
				if( ( containmentRight - eventOffset.left ) <= userDiv_width ){
					userDiv.classList.add('lyteTimelineViewEventAbsoluteText');
				}else{
					userDiv.classList.remove('lyteTimelineViewEventAbsoluteText')
				}
			}else{
				if( (eventOffset.right - containmentLeft) <= userDiv_width ){
					userDiv.classList.add('lyteTimelineViewEventAbsoluteText')
				}else{
					userDiv.classList.remove('lyteTimelineViewEventAbsoluteText')
				}
			}
		}
		var arrowOffset = $L('.lyteTimelineViewEvent',eventDiv)[0].getBoundingClientRect();
		var arrowOffsetLeft;
		var arrowOffsetRight;
		var noEnddiv = $L('.lyteTimeLineViewNoEndElem',eventDiv)[0];
		var isnoEndDiv = noEnddiv ? true : false;
		var isRTL = _lyteUiUtils.getRTL();
		if(_lyteUiUtils.getRTL()){
			arrowOffsetLeft = arrowOffset.left ;
			arrowOffsetRight = arrowOffset.right;
			var noEnddiv = $L('.lyteTimeLineViewNoEndElem',eventDiv)[0];
			arrowOffsetLeft -= noEnddiv ? noEnddiv.offsetWidth : 0;
			containmentRight -=  subGroupHeader_width;
			containmentLeft += _lyteUiUtils.getScrollBarWidth();
		}else{
			arrowOffsetRight = arrowOffset.right;
			arrowOffsetLeft = arrowOffset.left; 
			var noEnddiv = $L('.lyteTimeLineViewNoEndElem',eventDiv)[0];
			arrowOffsetRight += noEnddiv ? noEnddiv.offsetWidth : 0;
			containmentLeft +=  subGroupHeader_width;
			containmentRight -= _lyteUiUtils.getScrollBarWidth();
		}
		arrowOffsetRight = event.dueDate ? $L('.lyteTimelineViewDue',eventDiv)[0].getBoundingClientRect().right : arrowOffsetRight;
		if( isVisible &&  (arrowOffsetLeft > containmentRight)  ){
			RightArrow.classList.remove('lyteTimelineViewHideArrow');
			leftArrow.classList.add('lyteTimelineViewHideArrow');
			TextNode.classList.remove('lyteTimelineViewArrowTextHide');
			if(_lyteUiUtils.getRTL()){
				$L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0].style.visibility = 'hidden';
			}
		
		}else if( isVisible && ( arrowOffsetRight <  containmentLeft ) ){
			leftArrow.classList.remove('lyteTimelineViewHideArrow');
			RightArrow.classList.add('lyteTimelineViewHideArrow');
			TextNode.classList.remove('lyteTimelineViewArrowTextHide');
			if(!_lyteUiUtils.getRTL()){
				$L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0].style.visibility = 'hidden';
			}
		}else if(isVisible && (arrowOffsetLeft < containmentLeft && arrowOffsetRight >  containmentLeft ) ){
			$L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0].style.visibility = '';
			leftArrow.classList.remove('lyteTimelineViewHideArrow');
			RightArrow.classList.add('lyteTimelineViewHideArrow');
			TextNode.classList.add('lyteTimelineViewArrowTextHide');
			if(_lyteUiUtils.getRTL() && arrowOffsetRight >  containmentRight ){
				RightArrow.classList.remove('lyteTimelineViewHideArrow');
			}else if(!_lyteUiUtils.getRTL() && arrowOffsetRight >  containmentRight){
				RightArrow.classList.remove('lyteTimelineViewHideArrow');
			}
		}else if( isVisible &&  ((arrowOffsetRight > containmentRight))  && !isnoEndDiv){
			$L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0].style.visibility = '';
			if(!isnoEndDiv || isRTL){
				if(window.getComputedStyle(userDiv).position !== 'absolute'){
					RightArrow.classList.remove('lyteTimelineViewHideArrow');
				}else{
					if((arrowOffsetRight > containmentRight)){
						RightArrow.classList.remove('lyteTimelineViewHideArrow');
					}else{
						RightArrow.classList.add('lyteTimelineViewHideArrow');
					}
				}
			}else{
				RightArrow.classList.add('lyteTimelineViewHideArrow');
			}
			leftArrow.classList.add('lyteTimelineViewHideArrow');
			TextNode.classList.add('lyteTimelineViewArrowTextHide');
		}
		else if(!startDate && !endDate ){
			if(!event.end){
				end = start;				
			}
			if(_lyteUiUtils.getRTL()){
				if(!startOfView.fromNow(end).past){
					leftArrow.classList.remove('lyteTimelineViewHideArrow');
					RightArrow.classList.add('lyteTimelineViewHideArrow');
					TextNode.classList.remove('lyteTimelineViewArrowTextHide');
				}else if(endOfView.fromNow(start).past){
					leftArrow.classList.add('lyteTimelineViewHideArrow');
					RightArrow.classList.remove('lyteTimelineViewHideArrow');
					TextNode.classList.remove('lyteTimelineViewArrowTextHide');
				}
			}else{
				if(startOfView.fromNow(end).past){
					leftArrow.classList.remove('lyteTimelineViewHideArrow');
					RightArrow.classList.add('lyteTimelineViewHideArrow');
					TextNode.classList.remove('lyteTimelineViewArrowTextHide');
				}else if(!endOfView.fromNow(start).past){
					leftArrow.classList.add('lyteTimelineViewHideArrow');
					RightArrow.classList.remove('lyteTimelineViewHideArrow');
					TextNode.classList.remove('lyteTimelineViewArrowTextHide');
				}
			}
			$L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0].style.visibility = '';
		}else if(isVisible){
			leftArrow.classList.add('lyteTimelineViewHideArrow');
			RightArrow.classList.add('lyteTimelineViewHideArrow');
			TextNode.classList.add('lyteTimelineViewArrowTextHide');
			$L('.lyteTimelineViewEvent lyte-yield',eventDiv)[0].style.visibility = '';
		}
		if(!eventDiv.classList.contains('lyteTimelineViewAbsoluteEvent')){
			if(_lyteUiUtils.getRTL()){
				if( ( containmentRight - arrowOffsetLeft ) <= userDiv_width ){
					userDiv.classList.add('lyteTimelineViewEventAbsoluteText')
				}else{
					userDiv.classList.remove('lyteTimelineViewEventAbsoluteText')
				}
			}else{
				
				if( (arrowOffsetRight - containmentLeft) <= userDiv_width ){
					userDiv.classList.add('lyteTimelineViewEventAbsoluteText');
				}else{
					userDiv.classList.remove('lyteTimelineViewEventAbsoluteText')
				}
			}
		}

	},
	setArrowAndEventPosition : function(setArrow, setEvent,scroll){
		var group = this.getData('ltPropGroup');
		var _this = this;
		var scrollOffset;
		if(scroll){
			scrollOffset = scroll.getBoundingClientRect();
		}else{
			scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
			scrollOffset = scroll.getBoundingClientRect();
		}
		
		if(!group){
			var populateObject = this.getData('populateObject');
			for (const key in populateObject) {
				
				if (Object.hasOwnProperty.call(populateObject, key)) {
					
					const event = populateObject[key];
					var eventDiv = _this.$node.querySelector('#'+event.id);
					setEvent && _this.setEventPosition(event,eventDiv,scroll);
					setArrow && _this.setarrowPosition(event,eventDiv,scrollOffset);

				}
			}
		}else{
			var events = this.getData('ltPropGroupby');
			events.forEach(function(event,index){
				var child_events = event.children || [];
				for(var index = 0;index < child_events.length && !event.isclosed; index++){
					var eventDiv = _this.$node.querySelector('#'+child_events[index].id);
					if(eventDiv){
						var eventDivOffset = eventDiv.getBoundingClientRect();
						if(eventDivOffset.top >= scrollOffset.top && eventDivOffset.top < scrollOffset.bottom){
							setEvent && _this.setEventPosition(child_events[index],eventDiv,scroll);
							setArrow && _this.setarrowPosition(child_events[index],eventDiv,scrollOffset);
						}
					}
				}

			});
		}
	},
	findEventPosition : function(date,view){
		var format = this.getData('ltPropFormat');
		if(view == 'quarter'){
			var date =  $L.moment(date ,format).startOf('month').format('DD-MM-YYYY');
		}else{
			var date =  $L.moment(date ,format).format('DD-MM-YYYY');
		}
		var div = $L('[data-date="'+date+'"]',this.$node)[0];
		if(!div){
			return 0;
		}
		return parseInt(window.getComputedStyle(div).gridColumnStart);
	},
	setTodayPosition : function(){
		var today =  $L('.lyteTimelineViewToday',this.$node)[0];
		if(!today){
			return;
		}
		var startDate;
		if(this.data.ltPropView == 'quarter'){
			startDate = $L.moment(new Date()).startOf('month');
 		}else{
			startDate = $L.moment(new Date());
		}
		var CurrentDiv = this.$node.querySelector("[data-date='"+startDate.format('DD-MM-YYYY')+"']");
		var timeline = this.getData('timeline');
		var startVeiw = timeline[ 0 ];
		var endOfView = timeline[ timeline.length - 1 ];
		var todaynotinview = !this.isWorkingDayOnly(new Date());
		if(todaynotinview && !CurrentDiv && !startVeiw.fromNow(startDate).past && endOfView.fromNow(startDate).past){
			while(!this.isWorkingDayOnly(startDate.getDObj())){
				startDate.add(1,'date');
			}
			todaynotinview = true;
			CurrentDiv = this.$node.querySelector("[data-date='"+startDate.format('DD-MM-YYYY')+"']");
		}else{
			todaynotinview = false;
		}
		if(CurrentDiv){
			var dateWidth = CurrentDiv.getBoundingClientRect().width;
			var start_Date = parseInt($L.moment(new Date()).format('DD'));
			var startMonthDay = parseInt($L.moment(new Date()).endOf('month').format('DD'));
			right = (dateWidth / startMonthDay) * ( start_Date - 1 );
			var style = window.getComputedStyle(CurrentDiv);
			today.style.display = '';
			today.style.setProperty('--lyte-timelineview-today-column-start',parseInt(style.gridColumn));
			today.style.height = $L('.lyteTimelineViewContentElem',this.$node)[0].getBoundingClientRect().height - 1 - _lyteUiUtils.getScrollBarWidth() + 'px';
			var todayDiv = $L('.lyteTimelineViewTodayText',today)[0];
			var todayLineDiv = $L('.lyteTimelineViewTodayLineDiv',today)[0];
			var direction = 'left';
			if(_lyteUiUtils.getRTL()){
				direction = 'right';
			}
			if(this.getData('ltPropView') == 'quarter'){
				todaynotinview = !this.isWorkingDayOnly(new Date());
				todayDiv.style[direction] = (dateWidth / startMonthDay) * ( start_Date - 1 ) + (dateWidth / startMonthDay)/2 + 'px';
				todayLineDiv.style[direction] = (dateWidth / startMonthDay) * ( start_Date - 1 ) +  (dateWidth / startMonthDay)/2 + 'px';
			}else{
				todayDiv.style[direction] = '';
				todayLineDiv.style[direction] = '';
			}
			if(todaynotinview){
				today.classList.add('lyteTimelineViewTodayNotInView');
				var currDate = $L.moment(new Date());
				todayDiv.innerHTML = ' ';
				var createTextNode = document.createTextNode( _lyteUiUtils.i18n( 'today' ) + ' *' + currDate.format('DD') + ' ' + _lyteUiUtils.i18n( currDate.format('MMMM') ) + ' ' + currDate.format('YYYY') );
				todayDiv.appendChild(createTextNode);			
			}else{
				today.classList.remove('lyteTimelineViewTodayNotInView');
				todayDiv.innerHTML = ' ';
				var createTextNode = document.createTextNode( _lyteUiUtils.i18n( 'today' ) );
				todayDiv.appendChild(createTextNode);
			}
		}else{
			today.style.display = 'none';
		}
	},
	addGroupByUser : function(index){
		var userList = this.getData('ltPropGroupby');
		if(!userList[index]){
			this.isHasScroll();
			return;
		}
		Lyte.arrayUtils(this.getData('groupByData'),'push',userList[index]);
		var _this = this;
		$L.fastdom.mutate(function(){
			_this.setTodayPosition();
		})
	},
	findNoOfworkingDay : function(date,endDate,notfromStart){
		if(notfromStart){
			var startOfMonth = new Date(date.getFullYear(),date.getMonth(),date.getDate());
		}else{
			var startOfMonth = new Date(date.getFullYear(),date.getMonth(),1);
		}
		
		if(endDate && endDate.getFullYear){
			var endOfMonth = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate());
		}else{
			var endOfMonth = new Date(date.getFullYear(),date.getMonth(),endDate);
		}
		var weekdays = 0;
		while(startOfMonth.getTime() != endOfMonth.getTime()){
			if(this.isWorkingDayOnly(startOfMonth)){
				weekdays++;
			}
			startOfMonth.setDate(startOfMonth.getDate()+1);
		}
		if(this.isWorkingDayOnly(startOfMonth)){
			weekdays++;
		}
		return weekdays;
	},
	HideHoverCard : function(){
		var hoverCardDiv = $L('.lyteTimelineViewHoverCardDiv',this.$node)[0];
		hoverCardDiv.classList.add('lyteTimelineViewHoverCardHide');
		$L('.lyteTimelineViewHoverCard',hoverCardDiv)[0].classList.add('lyteTimelineViewHoverCardHide');
		var hoveredDiv = $L('.lyteTimelineViewTextHighlight',this.$node)[0];
		if(hoveredDiv){
			hoveredDiv.classList.remove('lyteTimelineViewTextHighlight');
		}
		if(this.getMethods('onDateLeave')){
			this.executeMethod('onDateLeave',hoveredDiv,this.$node);
		}
	},
	showHoverCard : function(target){
		if(!this.getData('ltPropGroup')){
			if((!this.getData('ltPropEvent') || !this.getData('ltPropEvent').length) ){
				return;
			}
		}else{
			if(!this.getData('groupByData')){
				return;
			}
		}
		var view = this.getData('ltPropView');
		var timeline = this.getData('timeline');
		var hoverCardDiv = $L('.lyteTimelineViewHoverCardDiv',this.$node)[0];
		var hoverDate;
		var width;
		var startDate;
		var endDate;
		var isMonthChild = target.closest('.lyteTimelineViewHeaderMonthElem');
		var isSecondary = target.closest('lyteTimelineViewSecondaryHeaderElem')
		var container = $L('.lyteTimelineViewContentElem',this.$node)[0];
		var DateDiv;
		var startColumn;
		if(view == 'day'){
			if(target.tagName !== 'HTML' && ( target.classList.contains('lyteTimelineViewHeaderElem') || target.parentElement.classList.contains('lyteTimelineViewHeaderElem') )){
				hoverDate = target;
				DateDiv = target;
				width = this.data.ltPropDateWidth[this.data.ltPropView] + 'px';
				startDate = target.dataset.date;
				endDate = target.dataset.date;
				startColumn = window.getComputedStyle(target).gridColumnStart;
				target.classList.add('lyteTimelineViewTextHighlight');
			}
		}else{
			var flag;
			if(target.tagName !== 'HTML' && ( target.classList.contains('lyteTimelineViewHeaderMonthElem') ||  isMonthChild )){
				target = isMonthChild ? isMonthChild : target;
				flag = true;
				DateDiv = target;
			}else if( target.tagName !== 'HTML' && target.classList.contains('lyteTimelineViewSecondaryHeaderElem') || isSecondary){
				target = isSecondary ? isSecondary : target;
				flag = true;
				DateDiv = target;
				target = document.elementFromPoint(target.getBoundingClientRect().left , container.getBoundingClientRect().top + 10);
				if(target && !target.classList.contains('lyteTimelineViewPrimaryHeaderElem')){
					target = target.closest('.lyteTimelineViewPrimaryHeaderElem');
				}
			}
			if(target && flag){
				target.classList.add('lyteTimelineViewTextHighlight');
				hoverDate = target;
				width =  target.offsetWidth + 'px';
				var startColumn = window.getComputedStyle(target);
				var endColumn = parseInt(startColumn.gridColumnEnd.split(' ')[1]);
				startColumn = parseInt(startColumn.gridColumnStart)
				startDate = timeline[startColumn - 1].format('DD-MM-YYYY');
				endDate = timeline[startColumn + endColumn - 2  ];
				if(view == 'quarter'){
					endDate = $L.moment(endDate.format('DD-MM-YYYY') , 'DD-MM-YYYY').endOf('month');
					endDate = endDate.format('DD-MM-YYYY');
				}else{
					endDate = endDate.format('DD-MM-YYYY');
				}
			}
			
		}
		if(hoverDate){
			hoverCardDiv.classList.remove('lyteTimelineViewHoverCardHide');
			hoverCardDiv.style.gridColumn = startColumn;
			hoverCardDiv.style.width = width;
			hoverCardDiv.style.top = hoverDate.getBoundingClientRect().top - hoverCardDiv.offsetParent.getBoundingClientRect().top + container.scrollTop + 'px';
			hoverCardDiv.style.height = this.$node.getBoundingClientRect().bottom - hoverCardDiv.getBoundingClientRect().top  - _lyteUiUtils.getScrollBarWidth() + 'px';
			if(this.getMethods('onDateHover')){
				this.executeMethod('onDateHover',startDate,endDate,DateDiv);
			}
		}
	},
	getResizeDate : function(eventDiv,direction,events){
		var isRTL = _lyteUiUtils.getRTL();
		var currentDiv = this.$node.currentDiv;
		var E = $L('.lyteTimelineViewEvent',eventDiv)[0];
		var headerElem = $L('.lyteTimelineViewHeaderElem',this.$node);
		if(this.getData('ltPropView') == 'quarter'){
			if(direction == 'left'){
				var endDate = $L.moment(events.end,this.getData('ltPropFormat'));
				var startDate = $L.moment(currentDiv.dataset.date,'DD-MM-YYYY');
				var dateWidth = this.getData('ltPropDateWidth').quarter;
				if(isRTL){
					var width_diff = parseInt((currentDiv.getBoundingClientRect().right - E.getBoundingClientRect().right)/dateWidth);
				}else{
					var width_diff = parseInt((E.getBoundingClientRect().left - currentDiv.getBoundingClientRect().left)/dateWidth);
				}
				while(!this.isWorkingDayOnly(startDate.getDObj())){
					startDate.add(1,'date');
				}
				if(width_diff > 0){
					var count = width_diff;
					this.addDate(startDate,count);
				}else if(width_diff < 0){
					var count = width_diff * -1;
					this.subtractDate(startDate,count);
				}else{
					while(!this.isWorkingDayOnly(startDate.getDObj())){
						startDate.subtract(1,'date');
					}
				}						
			}else{
				var startDate = $L.moment(events.start,this.getData('ltPropFormat'));
				var endDate = $L.moment(currentDiv.dataset.date,'DD-MM-YYYY');
				var dateWidth = this.getData('ltPropDateWidth').quarter;
				if(isRTL){
					var width_diff = Math.round((  currentDiv.getBoundingClientRect().right - E.getBoundingClientRect().left )/dateWidth);
				}else{
					var width_diff = Math.round(( E.getBoundingClientRect().right - currentDiv.getBoundingClientRect().left)/dateWidth);
				}
				while(!this.isWorkingDayOnly(endDate.getDObj())){
					endDate.add(1,'date');
				}
				if(width_diff){
					if(width_diff > 0){
						var count = width_diff - 1;
						this.addDate(endDate,count);
						while(!this.isWorkingDayOnly(endDate.getDObj())){
							endDate.add(1,'date');
						}
						if(!endDate.fromNow(startDate).past){
							endDate = startDate;
						}
					}else if(width_diff < 0){
						var count = (width_diff - 1) * -1;
						this.subtractDate(endDate,count);
						while(!this.isWorkingDayOnly(endDate.getDObj())){
							endDate.subtract(1,'date');
						}
					}
					if(!endDate.fromNow(startDate).past){
						endDate = startDate;
					}
				}else{
					while(!this.isWorkingDayOnly(endDate.getDObj())){
						endDate.add(1,'date');
					}
				}
			}
		}else{		
			if(direction == 'left' ){
				var startDate = parseInt(window.getComputedStyle(eventDiv).gridColumnStart);
				if(!headerElem[startDate-1]){
					return;
				}
				if(startDate){
					startDate = $L.moment(headerElem[startDate-1].dataset.date,'DD-MM-YYYY');
				}
				endDate = this.$node.currentEnd;
			}else if(direction == 'right'){
				var endDate = parseInt(window.getComputedStyle(eventDiv).gridColumnEnd);
				if(!headerElem[endDate-2]){
					return;
				}
				if(endDate){	
					endDate = $L.moment(headerElem[endDate-2].dataset.date,'DD-MM-YYYY');
				}
				startDate = this.$node.currentStart;
			}
		}
		
		return { 'startDate' : startDate , 'endDate' : endDate };
	},
	callonArrowTextClick : function(eventdata){
		if(this.getMethods('onTextArrowClick')){
			this.executeMethod('onTextArrowClick',eventdata)
		}
	},
	updateCurrentEnd : function(eventDiv,value,direction,eventData,event){
		var end = parseInt(window.getComputedStyle(eventDiv).gridColumnEnd);
		var eventTag = 	$L('.lyteTimelineViewEvent',eventDiv)[0];
		var prevLeft_pos = eventTag.getBoundingClientRect().left;
		var prev_width = eventTag.getBoundingClientRect().right;
		eventTag.style.left = '';
		eventTag.style.width = '';
		if(this.getData('ltPropView') !== 'quarter'){
			eventDiv.style.setProperty('--lyte-timelineview-column-end',end + value);
		}
		this.$node.currentEnd.add(value,'date');
		eventTag.style.left = prevLeft_pos -  eventDiv.getBoundingClientRect().left + 'px';
		eventTag.style.width = prev_width - prevLeft_pos + 'px';
		while(!this.isWorkingDayOnly(this.$node.currentEnd.getDObj())){
			if(value > 0){
				this.$node.currentEnd.add(1, 'date');
			}else{
				this.$node.currentEnd.subtract(1, 'date');
			}
		}
		var DateObj = this.getResizeDate(eventDiv,direction,eventData);
		if(DateObj){
			if(this.getMethods('onResizeDrag')){
				this.executeMethod('onResizeDrag',DateObj.startDate,DateObj.endDate,eventData,direction,eventDiv,event)
			}
		}
		
	},
	updateCurrentStart : function(eventDiv,value,direction,eventData,event){
		var start = parseInt(window.getComputedStyle(eventDiv).gridColumnStart);
		var eventTag = 	$L('.lyteTimelineViewEvent',eventDiv)[0];
		var prevLeft_pos = eventTag.getBoundingClientRect().left;
		var prev_width = eventTag.getBoundingClientRect().right;
		if(this.getData('ltPropView') !== 'quarter'){
			eventTag.style.left = '';
			eventTag.style.width = '';
			eventDiv.style.setProperty('--lyte-timelineview-column-start', start + value);
			eventTag.style.left = prevLeft_pos -  eventDiv.getBoundingClientRect().left + 'px';
			eventTag.style.width = prev_width - prevLeft_pos + 'px';
		}
		this.$node.currentStart.add(value,'date');
		
		while(!this.isWorkingDayOnly(this.$node.currentStart.getDObj())){
			if( value < 0 ){
				this.$node.currentStart.subtract(1, 'date')
			}else{
				this.$node.currentStart.add(1, 'date')
			}
		}
		var DateObj = this.getResizeDate(eventDiv,direction,eventData);
		if(DateObj){
			if(this.getMethods('onResizeDrag')){
				this.executeMethod('onResizeDrag',DateObj.startDate,DateObj.endDate,eventData,direction,eventDiv,event)
			}
		}
	},
	DateDivLeftGreaterthanEventTagLeft : function(currentDiv,EventTag,date,view,Minwidth){
		if(view == 'quarter'){
			date = date ? date : 0;
			var width = (date - 1) * this.getData('ltPropDateWidth')[view];
			if(_lyteUiUtils.getRTL()){
				return (currentDiv.getBoundingClientRect().right - width) > EventTag.getBoundingClientRect().left;
			}else{
				return (currentDiv.getBoundingClientRect().left + width) > EventTag.getBoundingClientRect().left;
			}
		}else{
			return ( currentDiv.getBoundingClientRect().left -  (Minwidth/2) )  > EventTag.getBoundingClientRect().left;
		}
		
	},
	DateDivRightLessthanEventTagLeft : function(currentDiv,EventTag,date,view){
		if(view == 'quarter'){
			date = date ? date : 0;
			var width = date * this.getData('ltPropDateWidth')[view];
			if(_lyteUiUtils.getRTL()){
				return (currentDiv.getBoundingClientRect().right - width) < EventTag.getBoundingClientRect().left;
			}else{
				return (currentDiv.getBoundingClientRect().right + width) > EventTag.getBoundingClientRect().left;
			}			
		}else{
			return currentDiv.getBoundingClientRect().right < EventTag.getBoundingClientRect().left;
		}
	},
	DateDivRightLessthanEventTagRight : function(currentDiv,EventTag,date,view,Minwidth){
		if(view == 'quarter'){
			date = date ? date : 0;
			var width = date * this.getData('ltPropDateWidth')[view];
			return (currentDiv.getBoundingClientRect().left + width) < EventTag.getBoundingClientRect().right;
		}else{
			return ( currentDiv.getBoundingClientRect().right + Minwidth/2 ) < EventTag.getBoundingClientRect().right;
		}
	},
	DateDivLeftGreaterthanEventTagRight : function(currentDiv,EventTag,date,view){
		if(view == 'quarter'){
			date = date ? date : 0;
			var width = date * this.getData('ltPropDateWidth')[view];
			return (currentDiv.getBoundingClientRect().left + width) > EventTag.getBoundingClientRect().right
		}else{
			return currentDiv.getBoundingClientRect().left > EventTag.getBoundingClientRect().right;
		}
	
	},
	DateDivLeftLessthanEventTagLeft : function(currentDiv,EventTag,date,view){
		if(view == 'quarter'){
			var width = date * this.getData('ltPropDateWidth')[view];
			return (currentDiv.getBoundingClientRect().left + width) < EventTag.getBoundingClientRect().left;
		}else{
			return currentDiv.getBoundingClientRect().right < EventTag.getBoundingClientRect().left;
		}
	},
	getRoundOffValue : function(value){
		return Math.round(value)
	},
	eventResizeCondition : function(event,E,direction,view,minWidth,placeholder,eventDiv,eventTag,color,eventData,isRTL,prevClientX,clientX,notabsoluteEvent){
        var eventDivOffset = eventTag.getBoundingClientRect();
        var placeholderoffSet = E.getBoundingClientRect();
        if(this.getRoundOffValue(eventDivOffset.left) > (this.getRoundOffValue(placeholderoffSet.left) + 1 ) || this.getRoundOffValue(eventDivOffset.right) < (this.getRoundOffValue(placeholderoffSet.right) - 1 )){
            E.style.backgroundColor = color;
            placeholder.style.zIndex = '';
			if(notabsoluteEvent){
				$L('lyte-yield',eventTag)[0].style.visibility = '';
				$L('lyte-yield',placeholder)[0].style.visibility = 'hidden';
			}
			if($L.colorManipulator(eventData.color_code).isDark()){
				E.style.setProperty('--lyte-timelineview-event-outline-color',eventData.color_code);
			}
            eventTag.style.backgroundColor = '';
        }else{
            E.style.backgroundColor = '';
            placeholder.style.zIndex = 5;
			E.style.color = '';
			if(notabsoluteEvent){
				$L('lyte-yield',eventTag)[0].style.visibility = 'hidden';
				$L('lyte-yield',placeholder)[0].style.visibility = '';
			}
			if($L.colorManipulator(eventData.color_code).isDark()){
				E.style.setProperty('--lyte-timelineview-event-outline-color',E.style.getPropertyValue('--lyte-timelineview-resize-color'));
			}
            eventTag.style.backgroundColor = color;
        }
        if(direction == 'right'){
            if(view == 'quarter'){
				var clone = $L.moment(this.$node.currentEnd.getDObj().toString()).startOf('month');
				var date = this.findNoOfworkingDay(clone.getDObj(),this.$node.currentEnd.get('date'));
                var currentDiv = $L( '[data-date="'+ clone.format('DD-MM-YYYY') + '"]', this.$node )[0];
            }else{
                var currentDiv = $L( '[data-date="'+ this.$node.currentEnd.format('DD-MM-YYYY') + '"]', this.$node )[0];
            }
			if(!currentDiv){
				return;
			}
            if(isRTL){
				if((E.offsetWidth + ( prevClientX - clientX )) < (minWidth/2)){
					E.style.width = minWidth/2 + 'px';
					E.style.left = eventDivOffset.right - E.offsetParent.getBoundingClientRect().left  - minWidth/2   + 'px';
				}else{
					E.style.left = E.getBoundingClientRect().left - E.offsetParent.getBoundingClientRect().left  + (clientX - prevClientX)  + 'px'; 
					E.style.width =  E.getBoundingClientRect().width + (prevClientX - clientX )  + 'px'; 
				}
                if( this.DateDivLeftGreaterthanEventTagLeft(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentEnd(placeholder,1,direction,eventData,event);
                }else if( this.DateDivRightLessthanEventTagLeft(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentEnd(placeholder,-1,direction,eventData,event);
                }
            }else{
				if((E.offsetWidth + (clientX - prevClientX)) < (minWidth/2)){
					E.style.width = minWidth/2 + 'px';
                }else{
					E.style.width = E.offsetWidth  + (clientX - prevClientX)  + 'px'; 
				}
                if( this.DateDivRightLessthanEventTagRight(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentEnd(placeholder,1,direction,eventData,event);
                }else if( this.DateDivLeftGreaterthanEventTagRight(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentEnd(placeholder,-1,direction,eventData,event);
                }
            }
        }else if(direction == 'left'){
            if(view == 'quarter'){
                var date = this.$node.currentStart.get('date');
				var clone = $L.moment(this.$node.currentStart.getDObj().toString()).startOf('month');
                var currentDiv = $L( '[data-date="'+ clone.format('DD-MM-YYYY') + '"]', this.$node )[0];
            }else{
                var currentDiv = $L( '[data-date="'+ this.$node.currentStart.format('DD-MM-YYYY') + '"]', this.$node )[0];
            }
			if(!currentDiv){
				return;
			}
            if(isRTL){
				if((E.offsetWidth + (clientX - prevClientX)) < minWidth/2){
					E.style.width = minWidth/2 + 'px';
				}else{
					E.style.width = E.offsetWidth + (  clientX - prevClientX )  + 'px'; 
				}
                if( this.DateDivRightLessthanEventTagRight(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentStart(placeholder,-1,direction,eventData);
                }else if( this.DateDivLeftGreaterthanEventTagRight(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentStart(placeholder,1,direction,eventData);
                }
            }else{
                if((E.offsetWidth + ( prevClientX - clientX )) < minWidth/2){
					E.style.width = minWidth/2 + 'px';
					if(view == 'quarter'){
						E.style.left = eventDivOffset.right - E.offsetParent.getBoundingClientRect().left  - minWidth/2   + 'px';
					}else{
						E.style.left = E.offsetParent.offsetWidth - minWidth/2 + 'px';
					}
                }else{
					E.style.width = E.offsetWidth  + ( prevClientX - clientX )  + 'px'; 
					E.style.left = E.getBoundingClientRect().left - E.offsetParent.getBoundingClientRect().left + ( clientX - prevClientX )  + 'px'; 
					
				}
                if( this.DateDivLeftGreaterthanEventTagLeft(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentStart(placeholder,-1,direction,eventData);
                }else if( this.DateDivLeftLessthanEventTagLeft(currentDiv,E,date,view,minWidth) ){
                    this.updateCurrentStart(placeholder,1,direction,eventData);
                }
            }
        }
        this.$node.currentDiv  = currentDiv;
       
    },
	mousePositionReset : function(eventTagOffset,minWidth,direction,isRTL){
		if(isRTL){
			if(direction == 'left'){
				this.$node._prevClientX = eventTagOffset.left + Math.round(minWidth/2);
			}else{
				this.$node._prevClientX = eventTagOffset.right - Math.round(minWidth/2);
			}
		}else{
			if(direction == 'left'){
				this.$node._prevClientX = eventTagOffset.right - Math.round(minWidth/2);
			}else{
				this.$node._prevClientX = eventTagOffset.left + Math.round(minWidth/2);
			}
		}
	},
    mouseMoveEvent : function(event,direction,placeholder,eventData,eventDiv,eventTag,color,minWidth,notabsoluteEvent,yieldDiv,handler){
		if(this.$node.preventResize){
			return;
		}
        event.preventDefault();
        var isRTL = _lyteUiUtils.getRTL();
        var view = this.getData('ltPropView');
        var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
        var Subheader = $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0];
        var scrollLeft;
		var scrollRight;
		var E = $L('.lyteTimelineViewEvent',placeholder)[0];
		var eventTagOffset = eventTag.getBoundingClientRect();
		if(handler.classList.contains('lyteTimelineViewSingleResizeHandler')){
			if((event.clientX < eventTagOffset.left  && direction == 'right' && !isRTL )  || ( isRTL && event.clientX > eventTagOffset.left  && direction == 'right') ){
				direction = 'left';
				this.$node.resizeDirection = 'left';
				this.resetStartAndEnd(eventData);
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-start',eventDiv.style.getPropertyValue('--lyte-timelineview-column-start'));
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-end',eventDiv.style.getPropertyValue('--lyte-timelineview-column-end'));
				if(!isRTL){
					E.style.left = (eventTagOffset.left - E.offsetParent.getBoundingClientRect().left ) + event.clientX - eventTagOffset.left  + 'px';
					E.style.width = eventTag.getBoundingClientRect().right - event.clientX  + 'px';
				}else{
					E.style.left = (eventTagOffset.left - E.offsetParent.getBoundingClientRect().left ) + 'px';
					E.style.width = Math.abs( event.clientX - eventTagOffset.left ) + 'px';
				}
				
				this.$node._prevClientX = event.clientX;
			}else if((event.clientX > eventTagOffset.left  && direction == 'left' && !isRTL ) || ( isRTL && event.clientX < eventTagOffset.left  && direction == 'left' ) ){
				direction = 'right';
				this.$node.resizeDirection = 'right';
				this.resetStartAndEnd(eventData);
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-start',eventDiv.style.getPropertyValue('--lyte-timelineview-column-start'));
				this.$node.placeholder.style.setProperty('--lyte-timelineview-column-end',eventDiv.style.getPropertyValue('--lyte-timelineview-column-end'));
				if(isRTL){
					E.style.left = eventTag.getBoundingClientRect().right - E.offsetParent.getBoundingClientRect().left - Math.abs( event.clientX - eventTagOffset.right ) + 'px';
					E.style.width =  eventTagOffset.right - event.clientX + 'px';
				}else{
					E.style.left = (eventTagOffset.left - E.offsetParent.getBoundingClientRect().left ) + 'px';
					E.style.width = Math.abs( event.clientX - eventTagOffset.left ) + 'px';
				}
				this.$node._prevClientX = event.clientX;
			}
		}
		if(isRTL){
			scrollLeft = scroll.getBoundingClientRect().left;
			scrollRight = Subheader ? ( scroll.getBoundingClientRect().right - Subheader.offsetWidth ) : (scroll.getBoundingClientRect().right);
		}else{
			scrollLeft = Subheader ? (Subheader.offsetWidth + scroll.getBoundingClientRect().left) : (scroll.getBoundingClientRect().left);
			scrollRight = scroll.getBoundingClientRect().right;
		}
        this.eventResizeCondition(event,E,direction,view,minWidth,placeholder,eventDiv,eventTag,color,eventData,isRTL,this.$node._prevClientX,event.clientX,notabsoluteEvent);
		if(E.offsetWidth <= Math.round(minWidth/2)){
			this.mousePositionReset(eventTagOffset,minWidth,direction,isRTL);
			return;
		}
		if(!E.classList.contains('lyteTimelineViewAbsoluteEvent') && yieldDiv){
			if(yieldDiv.getBoundingClientRect().width > E.getBoundingClientRect().width){
				yieldDiv.style.position ='absolute';
				if(direction == 'right'){
					if(isRTL){
						yieldDiv.style.left = '';
						yieldDiv.style.right = '0';
					}else{
						yieldDiv.style.left = '0';
						yieldDiv.style.right = '';
					}
				}else{
					if(isRTL){
						yieldDiv.style.left = '0';
						yieldDiv.style.right = 'unset';
					}else{
						yieldDiv.style.left = 'unset';
						yieldDiv.style.right = '0';
					}				
				}
			}else{
				yieldDiv.style.position ='';
				yieldDiv.style.left = '';
				yieldDiv.style.right ='';
			}
		}
		
        var scrollAnimation = function(event,scrollRight,scrollLeft,scroll){
			var prevScroll;
			var prev;
			var E_offset = E.getBoundingClientRect();
			if(direction == 'left'){
				if(isRTL){
					prev = E_offset.right;
				}else{
					prev = E_offset.left ;
				}
				
			}else{
				if(!isRTL){
					prev = E_offset.right;
				}else{
					prev = E_offset.left;
				}
			}
            if(event.clientX > (scrollRight - 50) && E_offset.right > (scrollRight - 50) && !this.$node.preventResize){
				prevScroll = scroll.scrollLeft;
                scroll.scrollLeft += 10;
				this.eventResizeCondition(event,E,direction,view,minWidth,placeholder,eventDiv,eventTag,color,eventData,isRTL,prev,event.clientX,notabsoluteEvent);
            }else if( event.clientX < ( scrollLeft + 50 ) && E_offset.left < ( scrollLeft + 50 ) && !this.$node.preventResize) {
				prevScroll = scroll.scrollLeft;
                scroll.scrollLeft -= 10;
				this.eventResizeCondition(event,E,direction,view,minWidth,placeholder,eventDiv,eventTag,color,eventData,isRTL,prev,event.clientX,notabsoluteEvent);
            }else if(!this.$node.preventResize){
				if(E.offsetWidth <= Math.round(minWidth/2)){
					this.mousePositionReset(E_offset,minWidth,direction,isRTL);
				}
                cancelAnimationFrame(this.$node.animationFrame);
                return;
            }               
            this.$node.animationFrame = window.requestAnimationFrame(scrollAnimation.bind(this,event,scrollRight,scrollLeft,scroll))
        }
        if(this.$node.animationFrame){
            cancelAnimationFrame(this.$node.animationFrame);
        }
		this.$node._prevClientX = event.clientX;
		this.$node.animationFrame = window.requestAnimationFrame(scrollAnimation.bind(this,event,scrollRight,scrollLeft,scroll))
        
    },
	resetStartAndEnd : function(events){
		this.$node.currentEnd =  $L.moment(events.end,this.getData('ltPropFormat'));
		this.$node.currentStart =  $L.moment(events.start,this.getData('ltPropFormat'));
		this.$node.classList.add('lyteTimelineViewOnEventResize');
		if(this.getData('ltPropView') !== 'quarter'){
			while(!this.isWorkingDayOnly(this.$node.currentStart.getDObj())){
				this.$node.currentStart.add(1, 'date')
			}
			while(!this.isWorkingDayOnly(this.$node.currentEnd.getDObj())){
				this.$node.currentEnd.subtract(1, 'date')
			}
		}
	},
	actions : {
		toggleAccordion : function(event,accordionHead,group){
			var accordion = accordionHead.closest('.lyteTimelineViewGroupbyAccordion');
			var accordionBody = $L('.lyteTimelineViewGroupbyAccordionBody',accordion)[0];
			var AccordionHead = $L('.lyteTimelineViewGroupbyElementLabelWrap',accordion)[0];
			var contianer = $L('.lyteTimelineViewContentElem',this.$node)[0];
			var maxHeight = this.getData('ltPropMaxHeight');
			var today =  $L('.lyteTimelineViewToday',this.$node)[0];
			var _this = this;
			if(!accordion.classList.contains('lyteTimelineViewHideAccordion')){
				var leftPanel = $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0].getBoundingClientRect();
				var todayLine = $L('.lyteTimelineViewTodayLineDiv',today)[0];
				var todayOffset = todayLine.getBoundingClientRect();
				if(todayOffset.left < leftPanel.right && todayOffset.left > leftPanel.left){
					todayLine.style.display = 'none';
				}else if(todayOffset.left > leftPanel.left && todayOffset.right < leftPanel.right){
					todayLine.style.display = 'none';
				}
				contianer.scrollTop -=  accordionBody.offsetHeight;
				accordionBody.style.height = 0  + 'px';
				today.style.height = contianer.offsetHeight +'px';
				this.isHasScroll();
				group.isclosed = true;
				if(this.getMethods('onGroupClose')){
					this.executeMethod('onGroupClose',group,this.$node);
				}
				accordion.classList.add('lyteTimelineViewHideAccordion');
				$L(accordionBody).one('transitionend',function(){
					todayLine.style.display = '';
					var container =  $L('.lyteTimelineViewGroupbyContainer',this.$node)[0];
					if(container.offsetHeight < maxHeight && !_this.stopRenderOnToggle){
						_this.addGroupByUser(_this.data.groupByData.length);
					}
					_this.setTodayPosition();
				})
			}else{
				isloadmore = group.loadmore ? 1 : 0;
				accordion.classList.remove('lyteTimelineViewHideAccordion');
				if(group.norecordfound){
					accordionBody.style.height = 30 + 'px';
				}else{
					accordionBody.style.height = (group.rowCount ) * 30 + (group.rowCount - 1 ) * 10 + 'px';
				}
				group.isclosed = false;				
				if(this.getMethods('onGroupOpen')){
					this.executeMethod('onGroupOpen',group,this.$node);
				}
				if(group.children && group.children.length){
					group.children.forEach(function(event){
						_this.setEventPosition(event,undefined,contianer);
						_this.setarrowPosition(event);
					})
				}				
				$L(accordionBody).one('transitionend',function(){
					_this.setArrowAndEventPosition(true,false,contianer);
					_this.setTodayPosition();
					_this.isHasScroll();
				})
				_this.setTodayPosition();
			}
		},
		loadmore : function(event,key,loadIcon){
			var promise;
			var parent = loadIcon.closest('.lyteTimelineViewGroupbyAccordionBody');
			var loading_icon = $L('.lyteTimelineViewLoading',parent)[0];
			loading_icon.classList.remove('lyteTimelineViewHideLoadmore');
			var _this = this;
			var loader = $L('lyte-loader',parent)[0]
			if(!this.getData('ltPropLoaderYield')){
				loader.setData('ltPropShow',true); 
			}
			loadIcon.style.display = 'none';
			if(this.getMethods('onLoadMore')){
				promise = this.executeMethod('onLoadMore',key,this.$node);
			}
			if(promise && promise.then){
				promise.then(function(value){
					loadIcon.style.display = '';
					loading_icon.classList.add('lyteTimelineViewHideLoadmore');
					if(!_this.getData('ltPropLoaderYield')){
						loader.setData('ltPropShow',false); 
					}
				})
			}else if(promise !== false){
				loadIcon.style.display = '';
				loading_icon.classList.add('lyteTimelineViewHideLoadmore');
				if(!this.getData('ltPropLoaderYield')){
					loader.setData('ltPropShow',false); 
				}
			}else{
				loadIcon.remove();
				loading_icon.classList.add('lyteTimelineViewHideLoadmore');
			}
		},
		onarrowclick : function(eve,curr_event,dir,group){
			var id = curr_event.id;
			var isRTL = _lyteUiUtils.getRTL();
            var arrow = eve.target.classList.contains('.lyteTimelineViewEventArrow') ? eve.target : eve.target.closest('.lyteTimelineViewEventArrow');
			var text = $L('.lyteTimelineViewArrowText',arrow)[0];
            if(group){
                var groupArr = this.getData('ltPropGroupby');
                var index = this.groupIndex(group);
                var events = groupArr[index].children;
            }else{
                var events = this.getData('ltPropManipulatedEvent');
            }
            var curr_event = $u.findWhere(events,{'id':id});
            var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
			scroll.style.scrollBehavior = '';
            var view = this.getData('ltPropView');
            var format = this.getData('ltPropFormat')
            var MoveToDate;
            var scrolloffsetLeft = scroll.getBoundingClientRect().left;
			var scrolloffsetRight = scroll.getBoundingClientRect().right;
			var currDate;
			if(isRTL && this.getData('ltPropGroup')){
				scrolloffsetRight -= $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0].offsetWidth; 
			}
            if(this.getData('ltPropGroup') && !_lyteUiUtils.getRTL()){
                scrolloffsetLeft +=  $L('.lyteTimeLineViewGroupbyDummyPanel',this.$node)[0].offsetWidth;
            }
			var event = $L('#'+id,this.$node);
			var user_div = $L('lyte-yield',event[0])[0];
			var direction_changed;
			if(dir == 'right' && !text.classList.contains('lyteTimelineViewArrowTextHide') && !isRTL){
				dir = 'left';
				direction_changed = true;
			}else if(dir == 'left' && !text.classList.contains('lyteTimelineViewArrowTextHide') && isRTL){
				dir = 'right';
				direction_changed = true;
			}
            if(dir == 'left'){
				if(isRTL){
					if(curr_event.end){
						MoveToDate = 'end';
					}else{
						MoveToDate = 'start';
					}
				}else{
					MoveToDate = 'start';
				}
               
            }else{
				if(isRTL){
					MoveToDate = 'start';
				}else{
					if(curr_event.end){
						MoveToDate = 'end';
					}else{
						MoveToDate = 'start';
					}
				}
            }
			
            if(view == 'quarter'){
				MoveToDate = curr_event[MoveToDate];
				currDate = $L.moment(MoveToDate,format);
                var eventDiv = $L('[data-date="'+currDate.startOf('month').format('DD-MM-YYYY')+'"]',this.$node);
            }else{
				if(MoveToDate == 'start'){
					MoveToDate = curr_event[MoveToDate];
					currDate = $L.moment(MoveToDate,format);
					while(!this.isWorkingDayOnly(currDate.getDObj())){
						currDate.add(1, 'date')
					}
				}else{
					MoveToDate = curr_event[MoveToDate];
					currDate = $L.moment(MoveToDate,format);
					while(!this.isWorkingDayOnly(currDate.getDObj())){
						currDate.subtract(1, 'date')
					}
				}
                var eventDiv = $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',this.$node);
            }
			var diff = 1;
			if(isRTL){
				diff = -1;
			}
			var flag = true;
            if(eventDiv.length){
				
				var EventTag = $L('.lyteTimelineViewEvent',event[0])[0];
				var scrollLeft = 0;
				var maxScrollWidth = scroll.scrollWidth - scroll.clientWidth;;
                if(dir == 'left'){
					if(_lyteUiUtils.getRTL()){
						if( window.getComputedStyle(user_div).position === 'absolute' ){
							scrollLeft += user_div.getBoundingClientRect().left - scrolloffsetLeft - 20;
						}else{
							scrollLeft -=  scrolloffsetLeft - EventTag.getBoundingClientRect().left + 20 ;
						}
					}else{
						if( EventTag.getBoundingClientRect().left > scrolloffsetLeft){
							scrollLeft += EventTag.getBoundingClientRect().left - scrolloffsetLeft - 20;
						}else{
							scrollLeft -=  scrolloffsetLeft - EventTag.getBoundingClientRect().left + 20 ;
						}
					}
				}else{
					if( window.getComputedStyle(user_div).position !== 'absolute' ){
						scrollLeft += (EventTag.getBoundingClientRect().right ) - scrolloffsetRight + 20;
					}else{
                    	scrollLeft += (EventTag.getBoundingClientRect().right ) - scrolloffsetRight + 20;
					}
                }
				if(maxScrollWidth > ( diff * (scroll.scrollLeft + scrollLeft)) && (diff * (scroll.scrollLeft + scrollLeft)) > 0){
					flag = false;
					scroll.style.scrollBehavior = 'smooth';
					setTimeout(function(){
						scroll.scrollLeft += scrollLeft;
					})					
					this.setArrowAndEventPosition(false,true,scroll);					
				}
            }
			if(flag){	
				
				scroll.style.scrollBehavior = '';
				if(view == 'quarter'){
                	this.setTimeline(currDate.startOf('month').getDObj(),true);
				}else{
					this.setTimeline(currDate.getDObj(),true);
				}
                var _this = this;
				_this.setArrowAndEventPosition(true,true,scroll);
                setTimeout(function(){
					scroll.scrollLeft = 0;
					var eventDivOffset = event[0].getBoundingClientRect();
					var EventTag = $L('.lyteTimelineViewEvent',event[0])[0];
					var scrollOffset = scroll.getBoundingClientRect();
					var secondartyHeader = $L('.lyteTimelineViewSecondaryHeaderElem');
					var timelineRight = secondartyHeader[secondartyHeader.length - 1 ].getBoundingClientRect().right;
					var timelineLeft = secondartyHeader[0].getBoundingClientRect().right;
					var timeline_width = Math.abs(timelineLeft - timelineRight);
					if(dir == 'left'){
						if(eventDivOffset.width >= (timeline_width/2) || timelineRight == eventDivOffset.right ){
							if(direction_changed){
								scroll.scrollLeft =  eventDivOffset.left - scrollOffset.right;
							}else{
								scroll.scrollLeft =  eventDivOffset.left - scrollOffset.left + (eventDivOffset.width)/2;
							}
							
						}else{
							if(direction_changed){
								scroll.scrollLeft = eventDivOffset.left - scrollOffset.right;
							}else{
								scroll.scrollLeft = eventDivOffset.right -  scrollOffset.left;
							}
						}	
					}else{
						if(eventDivOffset.width >= scrollOffset.width || timelineLeft == eventDivOffset.left){
							if(direction_changed){
								scroll.scrollLeft =  eventDivOffset.right - scrollOffset.left;
							}else{
								scroll.scrollLeft =  eventDivOffset.right - scrollOffset.right - (eventDivOffset.width)/2;
							}
						}else{
							if(direction_changed){
								scroll.scrollLeft = eventDivOffset.right -  scrollOffset.left;
							}else{
								
								if(!isRTL){
									scroll.scrollLeft = eventDivOffset.left - scrollOffset.right;
								}else{
									var NoEndWidth = 0;
									var NoEndDiv = $L('.lyteTimeLineViewNoEndElem',EventTag)[0];
									if(NoEndDiv){
										var user_div = $L('lyte-yield',event[0])[0];
										NoEndWidth = NoEndDiv.offsetWidth + user_div.offsetWidth;
									}
									scroll.scrollLeft = EventTag.getBoundingClientRect().left - NoEndWidth - scrollOffset.right;
								}
								
							}
						}
					}
					var left = 0;
					var currentDate;
					var scrollLeft = 0;
					if(view == 'quarter'){
						var start = $L.moment(curr_event.start,_this.data.ltPropFormat);
						while(!_this.isWorkingDayOnly(start.getDObj())){
							start.add(1, 'date')
						}
						var startDate = parseInt(start.format('DD'));
						var dateWidth = _this.getData('ltPropDateWidth')[view];
						if(startDate){
							var count = startDate;
							while(count > 0){
								while(!_this.isWorkingDayOnly(start.getDObj())){
									start.subtract(1, 'date');
									count--;
								}
								start.subtract(1, 'date');
								left += dateWidth;
								count--;
							}
						}
						currentDate = $L('[data-date="'+currDate.startOf('month').format('DD-MM-YYYY')+'"]',this.$node)[0];
					}else{	
						currentDate = $L('[data-date="'+currDate.format('DD-MM-YYYY')+'"]',this.$node)[0];
					}
					
                    if(dir == 'left'){
						var addWidth = 0;
                        var user_div = $L('lyte-yield',event[0])[0];
                        if(!curr_event.end){
                            addWidth = user_div.offsetWidth;
                        }
						if(isRTL){
							left = 0;
						}
                        if( currentDate.getBoundingClientRect().left > scrolloffsetLeft){
                            scrollLeft += currentDate.getBoundingClientRect().left + left - scrolloffsetLeft - 30;
                        }else{
							if(!isRTL){
								scrollLeft -=  scrolloffsetLeft - currentDate.getBoundingClientRect().left - left + 30 ;
							}else{
								scrollLeft -=  scrolloffsetLeft - (EventTag.getBoundingClientRect().left + addWidth) - left + 30;
							}
                        }
                    }else{
                        var addWidth = 0;
                        var user_div = $L('lyte-yield',event[0])[0];
                        if(!curr_event.end){
                            addWidth = user_div.offsetWidth;
                        }
						if(!isRTL){
							left = 0;
						}
                        if( currentDate.getBoundingClientRect().right < scrolloffsetRight){
							if(isRTL){
								scrollLeft += (currentDate.getBoundingClientRect().right - left) - scrolloffsetRight  + 30;
							}else{
								scrollLeft -= scrolloffsetRight - (EventTag.getBoundingClientRect().right + addWidth) + left - 30;
							}
                        }else{
							if(isRTL && scrolloffsetRight <= EventTag.getBoundingClientRect().left){
								scrollLeft += (currentDate.getBoundingClientRect().right - left) - scrolloffsetRight  + 30;
							}else{
								scrollLeft +=  (EventTag.getBoundingClientRect().right + addWidth) - scrolloffsetRight  + 30 ;
							}
                           
                        }
                        
                    }
					setTimeout(function(){
						scroll.style.scrollBehavior = 'smooth';
						scroll.scrollLeft += scrollLeft;
					},100)
					
                    var timeline = _this.getData('timeline');
                    var leftHead  = $L('[data-date="'+ timeline[ 0 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
                    var rightHead  = $L('[data-date="'+ timeline[ timeline.length - 1 ].format('DD-MM-YYYY') +'"]',_this.$node)[0];
                    _this.rightIntersectionObserver(rightHead,view);
                    _this.leftIntersectionObserver(leftHead,view);
                },10)
            }   
                
        },
		onTextclick : function(event,eventData){
			this.callonArrowTextClick(eventData);
		},
		onmousedownEvent : function(event,direction,eventDiv,events,group){
			event.preventDefault();
			event.stopPropagation();
			this.$node._prevClientX = event.clientX;
			eventDiv = eventDiv.closest('.lyteTimelineViewEventDiv');
			var scroll = $L('.lyteTimelineViewContentElem',this.$node)[0];
			var eventTag = $L('.lyteTimelineViewEvent',eventDiv)[0];
			var placeholder = eventDiv.cloneNode();
			var handler = event.target;
			placeholder.id = '';
			var placeholderEventTag;
			if(eventDiv.classList.contains('lyteTimelineViewAbsoluteEvent')){
				placeholderEventTag = eventTag.cloneNode();
			}else{
				placeholderEventTag = eventTag.cloneNode(true);
			}
			placeholderEventTag.classList.remove('draggable-element');
			placeholderEventTag.classList.remove('draggable-handle-element');
			var headerElem = $L('.lyteTimelineViewHeaderElem',this.$node);
			var colorManipulator;
			if(events.color_code){
				colorManipulator = $L.colorManipulator(events.color_code,'hex');
				if(colorManipulator.findhsl()[2] < 10){
					colorManipulator = $L.colorManipulator('#000');
				}
			}else{
				colorManipulator = $L.colorManipulator(window.getComputedStyle(eventTag).backgroundColor);
			}
			scroll.style.scrollBehavior = '';
			this.$node.resize  = true;
			this.$node.resizeEvent = events;
			this.$node.resizeDirection = direction;
			eventDiv.style.zIndex = 5;
			var notabsoluteEvent;
			if(!eventDiv.classList.contains('lyteTimelineViewAbsoluteEvent')){
				$L('lyte-yield',eventTag)[0].style.visibility = 'hidden';
				notabsoluteEvent = true;
			}
			placeholder.appendChild(placeholderEventTag);
			placeholder.style.zIndex = 5;
			placeholder.style.margin = "-1px";
			placeholderEventTag.classList.add('lyteTimelineViewOnResize');
			
			if(this.getData('ltPropGroup')){
				
				var groupDiv = $L("[group='"+group.systemValue+"'] .lyteTimelineViewGroupbyAccordionBody",this.$node)[0];
				groupDiv.appendChild(placeholder);
			}else{
				scroll.appendChild(placeholder);
			}
			
			this.$node.placeholder = placeholder;
			if(this.getData('ltPropView') == 'quarter'){
				if(direction == 'left'){
					var startDate = parseInt(window.getComputedStyle(eventDiv).gridColumnStart);
					this.$node.currentDiv = headerElem[startDate - 1];
				}else{
					var startDate = parseInt(window.getComputedStyle(eventDiv).gridColumnStart);
					var endDate = parseInt(window.getComputedStyle(eventDiv).gridColumnEnd);
					this.$node.currentDiv = headerElem[endDate - startDate - 1];
				}
			}
			this.resetStartAndEnd(events);
			var _this = this;
			this.$node._prevClientX = event.clientX;
			if(this.getMethods('onResizeStart')){
				_this.executeMethod('onResizeStart',events,direction,group,placeholder,event,this.$node.placeholder);
			}
			placeholderEventTag.style.left = eventTag.getBoundingClientRect().left - eventDiv.getBoundingClientRect().left + 'px';
			placeholderEventTag.style.width = eventTag.offsetWidth + 'px';
			placeholderEventTag.style.right = '';
			$L('body').addClass('lyteTimelineViewDisableUserSelect');
			var minWidth = this.getData('ltPropDateWidth')[this.getData('ltPropView')];
			var mouseMoveEvent = function(event){
				_this.mouseMoveEvent(event,_this.$node.resizeDirection,placeholder,events,eventDiv,eventTag,colorManipulator.findAccentColor({toneType:'lighten', tonePercent : '50'}),minWidth,notabsoluteEvent,$L('lyte-yield',placeholderEventTag)[0],handler)
			};
			_this.$node.addEventListener("mousemove",mouseMoveEvent,event);
			var mouseUpFunc = function(){
				$L('body').removeClass('lyteTimelineViewDisableUserSelect');
				direction = _this.$node.resizeDirection;
				_this.$node.resize  = false;
				_this.$node.resizeEvent = null;
				_this.$node.placeholder = null;
				_this.$node.resizeDirection = null;
				if(_this.$node.animationFrame){
					cancelAnimationFrame(_this.$node.animationFrame);
				}
				_this.$node.animationFrame = null;
				var eventbar = $L('.lyteTimelineViewEvent',eventDiv)[0];
				eventbar.style.right = '';
				eventbar.classList.remove('lyteTimelineViewOnResize');
				$L('.lyteTimelineViewContentElem',_this.$node)[0].style.cursor = '';
				eventbar.style.cursor = '';
				var placeholderendDate = parseInt(placeholder.style.getPropertyValue('--lyte-timelineview-column-end'));
				var placeholderstartDate =  parseInt(placeholder.style.getPropertyValue('--lyte-timelineview-column-start'));
				eventDiv.style.setProperty('--lyte-timelineview-column-start',placeholderstartDate);
				eventDiv.style.setProperty('--lyte-timelineview-column-end',placeholderendDate);
				
				if(_this.getData('ltPropView') == 'quarter'){
					if(minWidth > placeholderEventTag.offsetWidth){
						eventbar.style.width = minWidth  + 'px';
						eventbar.style.left = placeholderEventTag.offsetLeft - minWidth/2  + 'px';
					}else{
						eventbar.style.width =  placeholderEventTag.offsetWidth  + 'px';
						eventbar.style.left = placeholderEventTag.offsetLeft + 'px';
					}
				}else{
					if( (!_lyteUiUtils.getRTL() && direction == 'right') || (_lyteUiUtils.getRTL() && direction == 'left')){
						var diff = Math.abs(eventDiv.getBoundingClientRect().right - placeholderEventTag.getBoundingClientRect().right);
					}else{
						var diff = Math.abs(eventDiv.getBoundingClientRect().left - placeholderEventTag.getBoundingClientRect().left);
					}
					if(( diff ) > minWidth){
						if(direction == 'right'){
							eventDiv.style.setProperty('--lyte-timelineview-column-end',placeholderendDate+ parseInt(diff/minWidth))
						}else{
							eventDiv.style.setProperty('--lyte-timelineview-column-start',placeholderstartDate - parseInt(diff/minWidth))
						}
					}
				}
				eventDiv.style.zIndex = '';
				eventbar.style.backgroundColor = '';
				eventTag.style.color = '';
				$L('lyte-yield',eventTag)[0].style.visibility = '';
				_this.$node.classList.remove('lyteTimelineViewOnEventResize');
				var DateObj = _this.getResizeDate(placeholder,direction,events);
				var startDate = DateObj.startDate;
				var endDate = DateObj.endDate;
				var returnVal ;
				if(_this.getMethods('onResizeStop')){
					returnVal = _this.executeMethod('onResizeStop',startDate,endDate,events,direction,group,eventDiv);
				}
				if(returnVal == false){
					_this.setArrowAndEventPosition(false,true,scroll);
				}
				_this.$node.removeEventListener("mousemove",mouseMoveEvent);
				document.removeEventListener("mouseup",mouseUpFunc);
				placeholder.remove();
			}
			document.addEventListener("mouseup",mouseUpFunc);
		},
		onArrowhover : function(event,item,elem){
			if(this.getMethods('onArrowHover')){
				var title = this.executeMethod('onArrowHover',item,this.getData('ltPropFormat'),elem);
			}
			title = title ? title : '';
			elem.setAttribute('lt-Prop-title',title);
		},
		onEventHover : function(event,item,elem){
			if(this.$node.resizeEvent){
				return;
			}
			$L('.lyteTimelineViewShowResizeHandles',this.$node).removeClass('lyteTimelineViewShowResizeHandles');
			var target = event.target.tagName == 'LYTE-YIELD' ? event.target : event.target.closest('lyte-yield');
			if(target){
				if(window.getComputedStyle(target).position !== 'absolute'){
					target = target.closest('.lyteTimelineViewEvent');
					target.classList.add('lyteTimelineViewShowResizeHandles');
				}else{
					$L('.lyteTimelineViewShowResizeHandles',this.$node).removeClass('lyteTimelineViewShowResizeHandles');
				}	
			}else{
				target = event.target.classList.contains('.lyteTimelineViewEvent') ? event.target : event.target.closest('.lyteTimelineViewEvent');
				if(target){
					target.classList.add('lyteTimelineViewShowResizeHandles');
				}
			}
			if(this.getMethods('onEventHover') && target){
				var title = this.executeMethod('onEventHover',item,this.getData('ltPropFormat'));
			}
			title = title ? title : '';
			elem.setAttribute('lt-Prop-title',title);
		},
		onEventOut : function(event,item,elem){
			$L('.lyteTimelineViewShowResizeHandles',this.$node).removeClass('lyteTimelineViewShowResizeHandles');
		},
		onDateHover : function(event,DateDiv,data){
			var target = event.target;
			this.showHoverCard(target,DateDiv,data);
			
		},
		onDateMouseOut : function(){
			this.HideHoverCard();
		}
	}
});
Lyte.Component.registerHelper("lyteUiTimelineViewGetMonth", function(date,months){
	var curr_month;
	if(typeof date == 'number'){
		curr_month = months[date];
	}else{
		curr_month = months[date.getDObj().getMonth()];
	}
	var i18n = _lyteUiUtils.i18n(curr_month);
	if(i18n){
		return i18n;
	}
	return curr_month;
})
Lyte.Component.registerHelper("lyteUiTimelineViewGetDay",function( date , view){
	if(view == 'day'){
		var weekDay = _lyteUiUtils.i18n(date.format('ddd'));
		if(weekDay){
			return weekDay + ' ' + date.format('D');
		}
		return date.format('ddd D');
	}else{
		return date.format('D');
	}
	
});
Lyte.Component.registerHelper("lyteUiTimelineViewCss",function(event,eventDiv,timeline,view){
	var timeline = eventDiv.closest('lyte-timeline-view');
	if(timeline){
		$L.fastdom.mutate(function(){
			timeline.component.setEventPosition(event);
			timeline.component.setarrowPosition(event);
		})
	}	
});
Lyte.Component.registerHelper('lyteUiTimelineViewColorCode',function(colorCode,elem){
	if(colorCode){
		var colorManipulator = $L.colorManipulator(colorCode);
		var tone = colorManipulator.findhsl()[2];
		if(tone < 10){
			colorManipulator = $L.colorManipulator('#000');
		}
		var returnVal = '--lyte-timelineview-eventbg:' + colorCode +';';
		if(!colorManipulator.isDark()){
			var color = colorManipulator.findAccentColor({toneType:'draken', tonePercent : '50'});
			returnVal  = returnVal +' --lyte-timelineview-resize-color:' + color + ';' + '--lyte-timelineview-event-text-color: #313949; --lyte-timelineview-event-outline-color:'+ color;
		}else{
			elem.classList.add('lyteTimelineViewDrakColorEvent');
			returnVal  = returnVal +' --lyte-timelineview-resize-color:' + colorManipulator.findAccentColor({toneType:'lighten', tonePercent : '50'}) + '; ' + '--lyte-timelineview-event-text-color: #fff; --lyte-timelineview-event-outline-color:' + colorCode ;
		}
		return returnVal;
	}
})
Lyte.Component.registerHelper('lyteUiTimelineViewFindWeekend',function(date,view,NonWorkingDays,holidayList){
	if(view == 'day' ){
		var date = date.getDObj();
		if(NonWorkingDays.includes(date.getDay())){
			return 'lyteTimelineViewWeekEnd';
		}
		if(holidayList){
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var dateNumber = date.getDate();
			if(holidayList[year] && holidayList[year][month] && holidayList[year][month][dateNumber]){
				return 'lyteTimelineViewHoliday';
			}
		}
		return '';
	}
	return '';
})
Lyte.Component.registerHelper("lyteUiTimelineViewRowCount",function(eventArray,height){
	if( height && !eventArray.length || eventArray.length < parseInt((height/40) - 2)){
		return parseInt( (height/40) - 1 ) ;
	}
	return eventArray.length+1;
})
Lyte.Component.registerHelper("lyteUiTimelineViewAccordionClosed",function(group,accordion){
	if(group.isclosed){
		return 'lyteTimelineViewHideAccordion';
	}
});
Lyte.Component.registerHelper("lyteUiTimelineViewGetViewClass",function(view){

	return 'lyteTimelineView'+view.charAt(0).toUpperCase() + view.slice(1) +'wise';
});
Lyte.Component.registerHelper("lyteUiTimelineViewGridCol",function(date,elem,view){
	$L.fastdom.mutate(function(){
		var timeline = elem.closest('lyte-timeline-view');
		var element = $L('[data-date="'+date.format('DD-MM-YYYY')+'"]',timeline)[0];
		var style = getComputedStyle(element);
		elem.style.setProperty('--lyte-timelineview-col-number',style.getPropertyValue('--lyte-timelineview-col-number'));
	})
})
Lyte.Component.registerHelper("lyteUiTimelineViewAddClass",function(classList,elem){
	var ElemclassList = elem.classList;
	if(!classList){
		classList = '';
	}
	if(ElemclassList.contains('lyteTimelineViewDrakColorEvent')){
		classList +=  ' lyteTimelineViewDrakColorEvent';
	}
	if(ElemclassList.contains('draggable-element') && ElemclassList.contains('draggable-handle-element') ){
		if(classList.includes('lyteTimelineViewDragRestrict')){
			$L(elem).draggable('destroy');
			return  classList;
		}else{
			return classList + ' draggable-element draggable-handle-element lyteTimelineViewEvent';
		}
	}
	return  classList;
})
Lyte.Component.registerHelper("lyteUiTimelineGridOverlay",function(date,view,NonworkingDay,holidayList){
	if(view == 'day' ){
		var date = date.getDObj();
		if(NonworkingDay.includes(date.getDay())){
			return true;
		}else{
			if(holidayList){
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var dateNumber = date.getDate();
				if(holidayList[year] && holidayList[year][month] && holidayList[year][month][dateNumber]){
					return true;
				}
			}
			return false;
		}
	}else if(view == 'month' ){
		return (date.month+1) % 2 == 0 ? true : false;
	}else if(view == 'week' && date && date.week ){
		var week = parseInt(date.week.split('W')[1])
		return (week % 2) == 0 ? true : false; 
		
	}	
})
Lyte.Component.registerHelper("lyteUiTimelineViewHasScroll",function(eventArray,height){
	if( height && !eventArray.length || eventArray.length < parseInt((height/40)-2)){
		return 'lyteTimelineViewNoScroll';
	}
})
Lyte.Component.registerHelper("lyteUiTimelineViewMonthClass",function(date){
	var quarter = parseInt(date.format('Q'));
	var quarterClass ;
	if(quarter%2 == 0){
		quarterClass = 'lyteTimelineViewEvenQuarter';
	}else{
		quarterClass = 'lyteTimelineViewOddQuarter';
	}
	return quarterClass;
})
Lyte.Component.registerHelper("lyteUiTimelineViewLineCount",function(date,drawLine,elem,view){
	if(view !== 'quarter'){
		return;
	}
	date = new Date(date.getDObj().toString() );
	var startOfMonth = new Date(date.getFullYear(),date.getMonth()+1,0);
	var lineCount = 0;
	if(drawLine){
		var startOfMonth = new Date(date.getFullYear(),date.getMonth(),1);
		var month = date.getMonth();
		var year = date.getFullYear();
		if(startOfMonth.getDay() !== this.component.getData('ltPropWeekStart')){
			var weeklast = (( startOfMonth.getDay() - this.component.getData('ltPropWeekStart') ) % 7) + 1;
			startOfMonth.setDate(startOfMonth.getDate() + 7 - weeklast + 1 );
		}
		var lastOfMonth = new Date(date.getFullYear(),date.getMonth()+1,0);
		while( startOfMonth.getFullYear()  == year ){
			
			if( startOfMonth.getMonth() === month ){
				if(startOfMonth.getDate()  !== 1 && startOfMonth.getDate() !== lastOfMonth.getDate()){
					lineCount = this.component.findNoOfworkingDay(date,startOfMonth.getDate());
					var div = document.createElement('div');
					div.classList.add('lyteTimelineQuarterViewLines');
					div.style.setProperty('--lyte-timelineView-count',lineCount)
					elem.appendChild(div);
					weeklast = 0;
				}
			}else{
				break;
			}
			startOfMonth.setDate( startOfMonth.getDate() + 7 );
		}
		startOfMonth.setDate( startOfMonth.getDay() - 7 );
		
		lineCount = this.component.findNoOfworkingDay(new Date(date.toString()),lastOfMonth.getDate());
	}else{
		var lineCount = this.component.findNoOfworkingDay(new Date(date.toString()),startOfMonth.getDate());
	}
	
	return lineCount;
})
if( !_lyteUiUtils.registeredCustomElements[ 'lyte-timeline-view-accordion' ] ) {
	_lyteUiUtils.registeredCustomElements[ 'lyte-timeline-view-accordion' ] = true; 
	
	Lyte.createCustomElement( "lyte-timeline-view-accordion", {
		"connectedCallback": function() {
			var timelineView = this.closest('lyte-timeline-view');
			var container = $L('.lyteTimelineViewContentElem',timelineView)[0];
			if(timelineView.getMethods('onGroupRender')){
				timelineView.component.stopRenderOnToggle = true;
				var userList = timelineView.getData('ltPropGroupby');
				var groupData = timelineView.getData('groupByData');
				var scroll = $L('.lyteTimelineViewTable',timelineView)[0];
				var promise = timelineView.component.executeMethod('onGroupRender',groupData[groupData.length - 1],timelineView,this);
				var _this = this;
				if(promise && promise.then){
					promise.then(function(value){
						if(value && _this.getBoundingClientRect().bottom <= (scroll.getBoundingClientRect().top + timelineView.getData('ltPropMaxHeight'))  ){
							var cs = parseInt(window.getComputedStyle(container).getPropertyValue('--lyte-timelineview-row-end'));
							container.style.setProperty('--lyte-timelineview-row-end',cs+groupData.length)
							timelineView.component.addGroupByUser(groupData.length );
						}else{
							timelineView.component.lastaccordion = _this;
							timelineView.component.stopRenderOnToggle = false;
						}
					})
				}else{
					timelineView.component.setTodayPosition();
					if( this.getBoundingClientRect().bottom <= (scroll.getBoundingClientRect().top + timelineView.getData('ltPropMaxHeight')) ){
						var cs = parseInt(window.getComputedStyle(container).getPropertyValue('--lyte-timelineview-row-end'));
						container.style.setProperty('--lyte-timelineview-row-end',cs+groupData.length)
						timelineView.component.addGroupByUser(groupData.length );
					}else{
						timelineView.component.stopRenderOnToggle = false;
						timelineView.component.lastaccordion = this;
					}
				}
			}
		}
	});
}