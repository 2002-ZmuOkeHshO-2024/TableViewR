Lyte.Component.register("lyte-scheduler-event-tag", {
_template:"<template tag-name=\"lyte-scheduler-event-tag\"> <lyte-yield yield-name=\"scheduler-event-badge\"> </lyte-yield> </template>",
_dynamicNodes : [{"type":"insertYield","position":[1]}],
_observedAttributes :["ltPropEvent"],

    data : function(){
        return {
            'ltPropEvent' : Lyte.attr('object',{default: {}})
        }       
    },
    isinBetween : function( curr_date, divPostion, endDate, scheduler ){
        var eventManipulator = new _lyteUiUtils.eventManipulator( scheduler.getData('ltPropFormat') );
        return eventManipulator.isinBetween(curr_date, divPostion, endDate, scheduler.getData('ltPropFormat'));
    },
    didConnect: function () {
        var scheduler  =  $L(this.$node).closest('lyte-scheduler')[0].component;
        var view = scheduler.getData('ltPropSchedulerView');
        var id = this.$node.dataset.id;
        var isMultiView = scheduler.getData('ltPropMultiUserView');
        if(isMultiView && view =='month'){
            return;
        }
        var events = scheduler.getData('ltPropManipulatedEvent');
        var eventData = this.getData('ltPropEvent');
        var format = scheduler.getData('ltPropFormat');
        var startDate = $L.moment(eventData.start, format);
        var event_tag  = this.$node;
        var startDiv =  $L(event_tag).closest('.scheduler-event-div')[0];
        this.$node.dataset.date = startDate.format('DD-MM-YYYY HH:mm')
        if(eventData.allDayEvent){
            this.$node.classList.add('lyteSchedulerAllDayEventTag');
        }
        if(startDiv){
            var curr_date = $L.moment(startDiv.dataset.date,'DD-MM-YYYY');
        }
        if(eventData.participantEvent){
            this.$node.classList.add('lyteSchedulerParticipantEvent')
        }
        var _this = this;
        if( !scheduler.getData('ltPropMultiUserView')){
            _this.$node.style.position ='absolute';
            if( eventData.allDayEvent || view === 'month' ){
                _this.setSchedulerEvents(_this.$node,scheduler,eventData,format,startDiv,curr_date,isMultiView,view);
            }else{
                _this.fixTimeLineEvent(eventData,startDate,format,scheduler,view,startDiv);
            }
        }else if(view === 'day' && scheduler.getData('ltPropMultiUserView')){
            if(eventData.allDayEvent ){
                _this.setSchedulerEvents(_this.$node,scheduler,eventData,format,startDiv,curr_date,isMultiView,view);
            }else{
                var endDate = $L.moment(eventData.end,format);
                var start_time = startDate.format('hh') + ':00 ' + startDate.format('A');
                var end_time = endDate.format('hh') + ':00 ' + endDate.format('A');
                var user = scheduler.$node.querySelector('[data-userid="'+eventData.userid+'"]');
                if(eventData.participantId && eventData.participantEvent){
                    user = scheduler.$node.querySelector('[data-userid="'+eventData.participantId+'"]');

                }
                var time_division = 60 / scheduler.getData('ltPropTimeLine');
                var startTimeDiv = $L('[data-time="'+ start_time +'"]',user)[0];
                if(startTimeDiv){
                    var startTimeDiv_width = startTimeDiv.offsetWidth / time_division;                                  
                    var parent_div = user.querySelector('[data-time="'+start_time+'"]');
                    var starttimeDivision = startDate.get('minutes') / scheduler.getData('ltPropTimeLine');
                    if(!parent_div.contains(_this.$node)){
                        Lyte.Component.appendChild( parent_div, _this.$node);
                    }
                    _this.$node.style.top = startTimeDiv.offsetHeight +'px';
                    _this.$node.style.left = starttimeDivision * startTimeDiv_width + 'px';
                    var endTimeDiv =user.querySelector('[data-time="'+end_time+'"]')
                    _this.$node.style.width =  ( endTimeDiv.getBoundingClientRect().left - _this.$node.getBoundingClientRect().left ) +  (endDate.get('minutes') / scheduler.getData('ltPropTimeLine')  ) * startTimeDiv_width + 'px';
                    var events = $L('lyte-scheduler-event-tag',scheduler.$node);
                    var cs =  window.getComputedStyle(startTimeDiv);
                    var startDiv = this.$node.closest('.lyteSchedulerMultiUserViewEventElem');
                    this.addHeightToDate(Math.round((starttimeDivision * startTimeDiv_width+_this.$node.offsetWidth)/startDiv.offsetWidth),event_tag.offsetHeight + parseInt(window.getComputedStyle(event_tag).marginTop),startDiv.dataset.time,user,'time',scheduler,isMultiView,view);
                }
            }
        }else if(view == 'week'){
            _this.$node.style.position ='absolute';
            _this.setSchedulerEvents(_this.$node,scheduler,eventData,format,startDiv,curr_date,isMultiView,view);
        }else{
            var date_td = scheduler.$node.querySelector('.lyteSchedulerDate').children[0];
            var cs =  window.getComputedStyle(date_td);
        }
        if(!_this.$node.dataset.id){
            _this.$node.dataset.id = _this.$node.getAttribute('id');
        }
        if(this.getMethods('eventRender')){
            this.executeMethod('eventRender',this.$node);
        }
    },
    fixTimeLineEvent : function(eventData,startDate,format,scheduler,view,startDiv){
        var endDate = $L.moment(eventData.end,format);
        var start_time = startDate.format('hh:mm A');
        var end_time = endDate.format('hh:mm A');
        var start_min = scheduler.getData('ltPropTimeLine') * parseInt((startDate.format('mm')/scheduler.getData('ltPropTimeLine')));
        var start_time = startDate.format('hh') +  ":" + ('0' + start_min).slice(-2) + " " + startDate.format('A');
        var startTimeDiv =  scheduler.$node.querySelector('[data-time="'+start_time+'"]');
        var timelineInterval = scheduler.getData('ltPropTimeLine');
        if(startTimeDiv){
            var stratminDiff =  (startTimeDiv.offsetHeight / scheduler.getData('ltPropTimeLine')) * ( startDate.format('mm') % scheduler.getData('ltPropTimeLine') );
            var header_height = 0;
            if(view == 'day'){
                header_height = scheduler.$node.querySelector('.lyteSchedulerDayViewAllDayRow').offsetHeight;
            }
            var min = endDate.format('mm');
            var hour = parseInt(endDate.format('hh'));
            var timelineMin = parseInt( min / timelineInterval );
            min = timelineInterval * timelineMin;
            end_time = ("0" + hour).slice(-2) + ":" + ("0" + min).slice(-2) + ' ' + endDate.format('A');
            var endMin = parseInt(endDate.format('mm'));
            if(scheduler.getTimediff(eventData.start,eventData.end) < (timelineInterval/4)){
                endMin = timelineInterval/4;
            }
            var endminDiff =  (startTimeDiv.offsetHeight / scheduler.getData('ltPropTimeLine')) * ( min - endMin );
            var endTimeDiv = scheduler.$node.querySelector('[data-time="'+end_time+'"]');
            this.$node.style.top =  startTimeDiv.getBoundingClientRect().top + stratminDiff - startTimeDiv.offsetParent.getBoundingClientRect().top + parseInt(window.getComputedStyle(startTimeDiv.querySelector('td')).borderTopWidth) - header_height + 'px';
            this.$node.style.position = 'absolute';
            this.$node.style.height = (endTimeDiv.getBoundingClientRect().top )  - startTimeDiv.getBoundingClientRect().top - parseInt(window.getComputedStyle(endTimeDiv.querySelector('td')).borderTopWidth) - stratminDiff - endminDiff+ 'px';
        }

        if( startDiv.querySelectorAll('lyte-scheduler-event-tag') ){
            this.setWidthForTimeLine(startDiv.querySelectorAll('lyte-scheduler-event-tag'),this.$node,startDiv,scheduler);
        }
    },
    setSchedulerEvents : function(event_tag,scheduler,eventData,format,startDiv,curr_date,isMultiView,view){
        var user;
        event_tag  = this.$node;
        var curr_pos = $L(event_tag).closest('.scheduler-event-div')[0];
        var startDiv =  $L(event_tag).closest('.scheduler-event-div')[0];
        if(view == 'week' || (view == 'day' && isMultiView)){
            user = scheduler.$node.querySelector('[data-userid="'+eventData.userid+'"]');
            if(eventData.participantId && eventData.participantEvent){
                user = scheduler.$node.querySelector('[data-userid="'+eventData.participantId+'"]');
            }
            event_tag.style.top = startDiv.offsetHeight +  parseInt(window.getComputedStyle(event_tag).marginTop) +'px';
        }
        var divPosition = $L(event_tag).closest('.scheduler-event-div')[0].dataset.date;
        if(eventData.end){
            var endDate = $L.moment(eventData.end, format);
            var cs = window.getComputedStyle(event_tag);
        
            var isinBetween = this.isinBetween(curr_date.format('DD-MM-YYYY'),divPosition,endDate.format('DD-MM-YYYY'), scheduler);
            var date_td =  $L(event_tag).closest('.lyteSchedulerDate')[0];
            var paddingTop = parseInt(window.getComputedStyle(event_tag.offsetParent).paddingTop);
            var number_height = $L('.lyteSchedulerDayNumber')[0] ? $L('.lyteSchedulerDayNumber')[0].offsetHeight + paddingTop : paddingTop;
            if(isinBetween  && (view !== 'day')){
                var cs = window.getComputedStyle(date_td);
                var interval = scheduler.getEventInterval(divPosition,endDate.format('DD-MM-YYYY')) + 1 ;
                var width = (interval * date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
                if( view !== 'day' ){
                    width = (interval * date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
                    if( (width + event_tag.getBoundingClientRect().left)  > (scheduler.$node.getBoundingClientRect().left + scheduler.$node.offsetWidth) ){
                        width =   ( scheduler.$node.getBoundingClientRect().right - parseInt(cs.paddingRight) - event_tag.getBoundingClientRect().left) ;
                    }
                }else{
                    width = (date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
                }
                
                event_tag.style.top = number_height + this.getData('eventIndex') *  ( event_tag.offsetHeight + parseInt(window.getComputedStyle(event_tag).marginTop) ) + 'px';
                event_tag.style.width = ( width  /  date_td.offsetWidth) * 100 + '%';
            }else{
                var width = event_tag.offsetWidth;
                if((view !== 'day')){
                    event_tag.style.top = number_height + this.getData('eventIndex') *  ( event_tag.offsetHeight + parseInt(window.getComputedStyle(event_tag).marginTop) ) + 'px';
                }else{
                    event_tag.style.top = startDiv.offsetHeight +  parseInt(window.getComputedStyle(event_tag).marginTop) + parseInt(window.getComputedStyle(date_td).paddingTop)   + 'px';
                }
            }
        }
        event_tag.style.left = parseInt(window.getComputedStyle(date_td).paddingLeft) +'px';
        var cs =  window.getComputedStyle(curr_pos);
        this.addHeightToDate(Math.round(width/startDiv.offsetWidth),event_tag.offsetHeight + parseInt(window.getComputedStyle(event_tag).marginTop),divPosition,user,undefined,scheduler,isMultiView,view);
    },
    addHeightToDate : function( interval, event_height, startDay, user ,selector, scheduler,isMultiView,view){
        var curr_date = startDay;
        var format =  scheduler.getData('ltPropFormat');
        format = (format.split(' '))[0];
        for(var index = 0; index < (interval); index++){
            user =  user ? user : $L('.lyteSchedulerViewMainTable',scheduler.$node)[0];
            selector = selector ? selector : 'date';
            var date_div = user.querySelector('[data-'+ selector +'="'+curr_date+'"]');
            if(date_div){
                date_div.style.height = date_div.getBoundingClientRect().height + event_height + 'px';
                if(!isMultiView && view !== "month"){
                    var shadow_div = document.querySelectorAll('.lyteSchedulerAllDayEvent .scheduler-event-div')[1];
                    if(shadow_div){
                        shadow_div.style.height = date_div.getBoundingClientRect().height + 'px';
                    }
                }
            }
            if(selector == 'date'){
                curr_date = $L.moment(startDay,format).add((index+1),"date").format(format);
            }else{
                curr_date = $L.moment(startDay,'hh:mm A').add((index+1),'hours').format('hh:mm A');
            }
        }
    },
    findIntersect  : function(interset,event_div,date_div,index){
        interset = interset ? interset : [];
        var intersetindex = index;
		if(!interset.includes(event_div)){
			interset[intersetindex] = event_div;
		}
        for(var Iindex = 0 ; Iindex < date_div.length ; Iindex++){
            if(date_div[Iindex] !== event_div && this.isTimeOverlap(date_div[Iindex],event_div) && !interset.includes(date_div[Iindex])){
				if(date_div[Iindex]){
					interset = this.findIntersect(interset,date_div[Iindex],date_div,Iindex);
				}
            }
        } 
        return interset;
    },
    
    setWidthForTimeLine: function (date_div, event_div, parent, scheduler) {
        let intersect = [];
        var dateDivArray;
        var view = scheduler.getData('ltPropSchedulerView');
        var gap = scheduler.getData('ltPropEventGap');
        if(view == 'week'){
            dateDivArray = parent.querySelectorAll('lyte-scheduler-event-tag[data-group="'+event_div.dataset.group+'"]');
        }else{
            dateDivArray =  date_div;
        }
        dateDivArray = Array.from(dateDivArray);
        intersect = dateDivArray;
        let LastEnd = intersect[intersect.length - 1];
        if(LastEnd !== event_div){
            return;
        }
        const _this = this;
        let depthArray = [[]];
        const parentElement = intersect[0].offsetParent;
        const parentWidth = parentElement.offsetWidth - parseInt(window.getComputedStyle(parentElement).paddingRight);
        const gapBetweenEvents = gap; 
        intersect.forEach(function(event){
            let placed = false;
            for (let depth = 0; depth < depthArray.length; depth++) {
                const column = depthArray[depth];
                if (!column.some(prevEvent => _this.isTimeOverlap(prevEvent, event))) {
                    event.dataset.col = depth + 1;
                    column.push(event);
                    placed = true;
                    break;
                }
            }
    
            if (!placed) {
                event.dataset.col = depthArray.length + 1;
                depthArray.push([event]);
            }
        });
        const numColumns = depthArray.length;
        const columnWidth = (parentWidth - (gapBetweenEvents * (numColumns - 1))) / numColumns;
        var minWidth = parentWidth/ depthArray.length;
        intersect.forEach(function(event){
            const colNumber = parseInt(event.dataset.col, 10) - 1;
            let prevElem = colNumber > 0 ? colNumber - 1  : null;
            if(prevElem !== null){
                depthArray[colNumber - 1].forEach(function(depthevent){
                    if(_this.isTimeOverlap(depthevent, event)){
                        prevElem = depthevent;
                    }
                } )
            }
            if(!scheduler.getData('ltPropWeekEventOverlap') || view !== 'week'){
                event.style.width = columnWidth + 'px';
            }else{
                event.style.zIndex = colNumber;
            }
            if (prevElem) {
                var perv_intersect = $L('.lyteSchedulerTimelineEvent',prevElem)[0];
                if(scheduler.getData('ltPropWeekEventOverlap') && view == 'week'){
                    if( scheduler.getData('ltPropWeekEventOverlap') && perv_intersect.getBoundingClientRect().bottom < event.getBoundingClientRect().top){
                        event.style.left = prevElem.offsetLeft + (prevElem.offsetWidth * 0.10) + 'px';
                    }else{
                        event.style.left = prevElem.offsetLeft + (prevElem.offsetWidth * 0.5) + 'px';
                    }
                }else{
                    event.style.left = colNumber * minWidth + gapBetweenEvents + 'px';
                }
                
            } else {
                event.style.left = gapBetweenEvents + 'px';
            }

            event.dataset.initialLeft = event.style.left;
            event.dataset.initialWidth = event.style.width;
            if(colNumber == depthArray.length - 1){
                event.style.width = 'auto';
            }
        });
        var nmore = $L('.lyteSchedulerEventMoreBtn[data-group="'+ event_div.dataset.group +'"]',parent)[0];
        if (nmore) {
            nmore.style.height = 'fit-content';
            nmore.style.top = LastEnd.offsetTop + LastEnd.offsetHeight - nmore.offsetHeight + 'px';
        }
    },
    ResetWidth : function(prevSetted, scheduler){
        var keys = Object.keys(prevSetted);
        for(var index = 0 ; index < keys.length; index++){
            var interset = $L('[data-id="'+ keys[index] +'"]',scheduler.$node)[0];
            var events = prevSetted[keys[index]];
            var related =  interset;
            var precentage = ( interset.offsetWidth / interset.parentElement.offsetWidth ) * 100;
            for(var _index = 0 ; _index < events.length; _index++){
                var event = events[_index];
                event.style.left =  related.offsetLeft + related.offsetWidth + gap + 'px';
                event.style.width = 'calc(' + (100 - precentage)/ events.length + '% - '+ ( gap + gap /(events.length+1) ) + 'px)';
                related = event;
            }
        } 
    },
    isTimeOverlap : function(item,event_div){
        var item_offset = item.getBoundingClientRect();
        var event_offset = event_div.getBoundingClientRect();
        if((item_offset.top <= event_offset.top && item_offset.bottom >= event_offset.top)  || 
            (event_offset.bottom >= item_offset.top && event_offset.bottom <= item_offset.bottom) ){
            return true;
        }
    },
    actions : {
        // Functions for event handling
    },
    methods : {
        // Functions which can be used as callback in the component.
    }
});

var _lyteSchedulerNavId = 0;
Lyte.Component.register("lyte-scheduler", {
_template:"<template tag-name=\"lyte-scheduler\"> <lyte-scheduler-header class=\"{{if(ltPropShowWeekNumber,'lyteSchedulerWeekNumberShown','')}}\"> <template is=\"if\" value=\"{{ltPropSchedulerHeaderYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"scheduler-header\"></lyte-yield> </template><template case=\"false\"> <div class=\"lyteSchedulerDefaultHeader\"> <lyte-scheduler-view> <lyte-button-group lt-prop-selected=\"{{ltPropSchedulerView}}\" lt-prop-type=\"radiobutton\" lt-prop-appearance=\"fill\" on-select=\"{{method(&quot;ChangeSchedulerView&quot;)}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-button lt-prop-value=\"day\"> <template is=\"registerYield\" yield-name=\"text\"> {{lyteUiI18n(\"Day\")}} </template> </lyte-button> <lyte-button lt-prop-value=\"week\"> <template is=\"registerYield\" yield-name=\"text\"> {{lyteUiI18n(\"Week\")}} </template> </lyte-button> <lyte-button lt-prop-value=\"month\"> <template is=\"registerYield\" yield-name=\"text\"> {{lyteUiI18n(\"Month\")}} </template> </lyte-button> </template> </lyte-button-group> </lyte-scheduler-view> <div class=\"lyteSchedulerDateNavigator\"> <lyte-scheduler-icon class=\"lyteSchedulerStartIcon\" onclick=\"{{action(&quot;hideandShowCalender&quot;,event)}}\" tabindex=\"0\" role=\"button\" lt-prop-aria-keydown=\"true\"> <template is=\"if\" value=\"{{ltPropyieldNav}}\"><template case=\"true\"> <lyte-yield yield-name=\"scheduler-nav-icon\"></lyte-yield> </template></template> </lyte-scheduler-icon> <scheduler-start-date class=\"lyteSchedulerStartDate\" tabindex=\"-1\" aria-hidden=\"true\"> {{ltCurrStartDate}} </scheduler-start-date> <template is=\"if\" value=\"{{expHandlers(ltPropSchedulerView,'==','week')}}\"><template case=\"true\"> <span class=\"lyteSchedulerTitleSeparator\" tabindex=\"-1\" aria-hidden=\"true\">To</span> <scheduler-end-date class=\"lyteSchedulerEndDate\" tabindex=\"-1\" aria-hidden=\"true\"> {{ltCurrEndDate}} </scheduler-end-date> </template></template> </div> <lyte-scheduler-title tabindex=\"0\"> <span class=\"lyteSchedulerTitleDate\">{{ltdisplayCurrDate}}</span> <span class=\"lyteSchedulerTitleDay\">{{lyteUiI18n(ltPropCurDay)}}</span> <template is=\"if\" value=\"{{expHandlers(ltPropSchedulerView,'==','day')}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropShowWeekNumber}}\"><template case=\"true\"><span class=\"lyteSchedulerWeekNumber lyteSchedulerDayView\"> {{lyteSchedulerUiFindWeek(startDateOfView,ltPropSchedulerView)}} </span></template></template> </template></template> </lyte-scheduler-title> <lyte-scheduler-nav tabindex=\"-1\"> <span role=\"button\" class=\"lyteSchedulerNavLeft\" tabindex=\"0\" lt-prop-aria-keydown=\"true\"> <span class=\"lyteVisuallyHidden\"> Previous {{ltPropSchedulerView}} </span> </span> <lyte-button onclick=\"{{action('today',event)}}\" class=\"schedulerToday\"> <template is=\"registerYield\" yield-name=\"text\"> {{lyteUiI18n(todayButton)}} </template> </lyte-button> <span role=\"button\" class=\"lyteSchedulerNavRight\" tabindex=\"0\" lt-prop-aria-keydown=\"true\"> <span class=\"lyteVisuallyHidden\"> Next {{ltPropSchedulerView}} </span> </span> </lyte-scheduler-nav> <lyte-yield yield-name=\"scheduler-selected-User\"></lyte-yield> </div> </template></template> <template is=\"if\" value=\"{{expHandlers(ltPropMultiUserView,'&amp;&amp;',expHandlers(ltPropSchedulerSearchYield,'!'))}}\"><template case=\"true\"> <template is=\"if\" value=\"{{expHandlers(selectedUserArr.length,'>',0)}}\"><template case=\"true\"> <div> <div> <template is=\"for\" items=\"{{selectedUserArr}}\" item=\"item\" index=\"index\"> <div> <lyte-yield yield-name=\"scheduler-user-icon\" scheduler-user=\"{{ltPropSchedulerUser[item]}}\"> </lyte-yield> </div> </template> </div> <div onclick=\"{{action('clearSelection')}}\"> clear </div> </div> </template></template> </template></template> </lyte-scheduler-header> <lyte-scheduler-body> <div class=\"lyteSchedulerWrapperClass\"><template value=\"{{ltPropSchedulerView}}\" is=\"switch\"><template case=\"month\"><lyte-scheduler-month> <div class=\"{{if(ltPropMultiUserView,'lyteSchedulerMultiUserView','')}} lyteSchedulerMonthViewWrapper lyteSchedulerViewWrapper\"> <table class=\"lyteSchedulerViewMainTable lyteSchedulerMonthView\"> <tbody is=\"if\" lyte-if=\"true\" value=\"{{expHandlers(ltPropMultiUserView,'!')}}\"></tbody> <tbody class=\"lyteSchedulerMonthViewBody\"> <tr is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray}}\" item=\"week\" index=\"index\" depth=\"2\"></tr> </tbody> </table> </div> </lyte-scheduler-month></template><template case=\"week\"><lyte-scheduler-week> <template is=\"if\" value=\"{{ltPropMultiUserView}}\"><template case=\"true\"> <div class=\"lyteSchedulerMultiUserView lyteSchedulerWeekViewWrapper lyteSchedulerViewWrapper {{if(ltPropWorkingDayOnly,'lyteSchedulerBusinessDayOnly','')}} \"> <table class=\"lyteSchedulerViewMainTable lyteSchedulerWeekView \"> <thead> <tr class=\"lyteSchedulerWeekViewHeader\"> <th class=\"lyteSchedulerFirstColHeader\"> <template is=\"if\" value=\"{{ltPropSchedulerSearch}}\"><template case=\"true\"> <lyte-search lt-prop-query-selector=\"{&quot;scope&quot; : &quot;lyte-popover-content&quot;, &quot;search&quot; : &quot;.lyteSchedulerUserSearch&quot;}\" on-focus=\"{{method('openUserSearch')}}\"> </lyte-search> </template><template case=\"false\"><template is=\"if\" value=\"{{ltPropSchedulerSearchYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"lyteSchedulerSearchYield\"> </lyte-yield> </template></template></template></template> </th> <td is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </thead> <tbody> <tr is=\"for\" lyte-for=\"true\" items=\"{{ltPropSchedulerUser}}\" item=\"user\" index=\"index\" depth=\"2\"></tr> </tbody> </table> </div> </template><template case=\"false\"> <div class=\"lyteSchedulerWeekViewWrapper lyteSchedulerViewWrapper {{if(ltPropWorkingDayOnly,'lyteSchedulerBusinessDayOnly','')}}\"> <div class=\"lyteSchedulerAllDayHighlight\"></div> <div class=\"lyteSchedularWeekViewInnerWrapper\"> <table class=\"lyteSchedulerViewMainTable lyteSchedulerWeekView \"> <thead> <tr class=\"lyteSchedulerWeekViewHeader\"> <th class=\"lyteSchedulerWeekTh\"></th> <td is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> <tr class=\"lyteSchedulerWeekViewAllDayRow\"> <td> <div class=\"lyteSchedulerSingleUserAllDay\"> All-Day ({{lyteUiSchedulerAllDayCount(ltPropProcessedData,hiddenObj,startDateOfView,ltPropSchedulerView,ltPropMultiUserView)}}) </div> </td> <td is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </thead> <tbody> <tr is=\"for\" lyte-for=\"true\" items=\"{{timeLine}}\" item=\"time\" index=\"index\" depth=\"2\"></tr> </tbody> </table> <div class=\"lyteSchedulerOverlay\"> <table class=\"lyteSchedulerWeekOverlayTable\" cellpadding=\"0\"> <tbody> <tr> <td style=\"width:100px\"></td> <td is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </tbody> </table> </div> </div> </div> </template></template> </lyte-scheduler-week></template><template case=\"day\"><lyte-scheduler-day> <template is=\"if\" value=\"{{ltPropMultiUserView}}\"><template case=\"true\"> <div class=\"scrollContainer lyteSchedulerMultiUserView lyteSchedulerDayViewWrapper lyteSchedulerViewWrapper\"> <table> <thead> <tr class=\"lyteSchedulerMultiUserRow\"> <th class=\"lyteSchedulerFirstColHeader lyteSchedulerFixedCol\"> <template is=\"if\" value=\"{{ltPropSchedulerSearch}}\"><template case=\"true\"> <lyte-search lt-prop-query-selector=\"{&quot;scope&quot; : &quot;lyte-popover-content&quot;, &quot;search&quot; : &quot;.lyteSchedulerUserSearch&quot;}\" on-focus=\"{{method('openUserSearch')}}\"> </lyte-search> </template><template case=\"false\"><template is=\"if\" value=\"{{ltPropSchedulerSearchYield}}\"><template case=\"true\"> <lyte-yield yield-name=\"lyteSchedulerSearchYield\"> </lyte-yield> </template></template></template></template> </th> <th class=\"lyteSchedulerAllDayTh\"> <div class=\"lyteSchedulerMultiUserAllDay\">All-Day ({{lyteUiSchedulerAllDayCount(ltPropProcessedData,hiddenObj,startDateOfView,ltPropSchedulerView,ltPropMultiUserView)}}) </div> </th> <td is=\"for\" lyte-for=\"true\" items=\"{{timeLine}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </thead> <tbody> <tr is=\"for\" lyte-for=\"true\" items=\"{{ltPropSchedulerUser}}\" item=\"user\" index=\"index\" depth=\"2\"></tr> </tbody> </table> </div> <div class=\"lyteSchedulerAllDayHighlight\"></div> <scheduler-scroll-nav class=\"lyteSchedulerLeftNav\" onclick=\"{{action('scrollnav',event)}}\"></scheduler-scroll-nav> <scheduler-scroll-nav class=\"lyteSchedulerRightNav\" onclick=\"{{action('scrollnav',event)}}\"></scheduler-scroll-nav> </template><template case=\"false\"> <div class=\"lyteSchedulerDayViewWrapper lyteSchedulerViewWrapper\"> <div class=\"lyteSchedularDayViewInnerWrapper\"> <table class=\"lyteSchedulerViewMainTable lyteSchedulerDayView\"> <tbody><tr class=\"lyteSchedulerDayViewAllDayRow\"> <td is=\"if\" lyte-if=\"true\" value=\"{{ltPropMultiUserView}}\"></td> <td class=\"lyteSchedulerDate lyteSchedulerMenuQuerySelector lyteSchedulerAllDayEvent\"> <div class=\"scheduler-event-div\" data-date=\"{{startDateOfView}}\"> <template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"event\" index=\"index\"> <template is=\"if\" value=\"{{event.allDayEvent}}\"><template case=\"true\"> <template is=\"if\" value=\"{{lyteUiSchedulerEvent(event)}}\"><template case=\"true\"><lyte-scheduler-event-tag event-index=\"{{index}}\" class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> </lyte-scheduler-event-tag></template></template> </template></template> </template> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide \" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj,startDateOfView,undefined,undefined,ltPropSchedulerView)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj,startDateOfView,this,user.id)}} </div> </div> </td> </tr> <tr is=\"for\" lyte-for=\"true\" items=\"{{timeLine}}\" item=\"time\" index=\"index\" depth=\"2\"></tr> </tbody></table> <div class=\"lyteSchedulerOverlay\"> <table class=\"lyteSchedulerDayOverlayTable\"> <thead> <tr class=\"lyteSchedulerDayViewAllDayRow\"> <td><div class=\"lyteSchedulerSingleUserAllDay\">all-day</div></td> <td class=\"lyteSchedulerDate lyteSchedulerAllDayEvent\"> <div class=\"scheduler-event-div\"> <div></div> </div> </td> </tr> </thead> <tbody> <tr> <td></td> <td class=\"lyteSchedulerDate\"> <div class=\"scheduler-event-div\" data-date=\"{{startDateOfView}}\"> <template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"event\" index=\"index\"> <template is=\"if\" value=\"{{expHandlers(event.allDayEvent,'!')}}\"><template case=\"true\"> <lyte-scheduler-event-tag event-index=\"{{index}}\" class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> <template is=\"if\" value=\"{{event.editable}} &amp;&amp; {{ltPropMultiUserView}}\"><template case=\"true\"><span class=\"lyteSchedulerGrabResize\"></span></template></template> </lyte-scheduler-event-tag> </template></template> </template> </div> </td> </tr> </tbody> </table> </div> <div class=\"lyteschedulerCurrentTimeLine\"> <div class=\"lyteschedulerLine\"></div> </div> </div> <div class=\"lyteSchedulerAllDayHighlight\"></div> </div> </template></template> </lyte-scheduler-day></template></template></div> </lyte-scheduler-body> <lyte-beta-popover id=\"lyteSchedulerHiddenEvent\" lt-prop-allow-multiple=\"{{ltPropPopoverAllowMultiple}}\" lt-prop-origin-elem=\"#schedulerPopover\" lt-prop-header-padding=\"\" lt-prop-content-padding=\"\" lt-prop-freeze=\"false\" lt-prop-wrapper-class=\"lyteSchedulerMoreEventsPopupWrapper {{if(ltPropUserHiddenEvent,'lyteSchedulerUsersMoreEventsPopupWrapper','')}} {{ltPropHiddenPopoverWrapper}}\" on-close=\"{{method(&quot;closeschedulerpopover&quot;)}}\" lt-prop-allow=\"\" lt-prop-scrollable=\"true\"> <template is=\"registerYield\" yield-name=\"popover\"> <lyte-popover-header> <div class=\"lyteSchedulerMoreEventsPopTitleMonthVal\"></div> <div class=\"lyteSchedulerMoreEventsPopTitleDayVal\"></div> <template is=\"if\" value=\"{{hiddenUser}}\"><template case=\"true\"><lyte-yield yield-name=\"scheduler-header-hidden-event\" scheduler-hidden-user=\"{{hiddenUser}}\"> </lyte-yield></template></template> </lyte-popover-header> <lyte-popover-content> <lyte-yield yield-name=\"scheduler-hidden-event\" scheduler-hidden-event=\"{{hiddenEvent}}\"> </lyte-yield> </lyte-popover-content> </template> </lyte-beta-popover> <lyte-beta-popover lt-prop-content-padding=\"0px\" lt-prop-allow-multiple=\"{{ltPropPopoverAllowMultiple}}\" lt-prop-freeze=\"false\" lt-prop-type=\"box\" lt-prop-show-close-button=\"false\" id=\"calendarPopover\" lt-prop-bind-to-body=\"true\" lt-prop-placement=\"bottomLeft\" on-close=\"{{method(&quot;closeCalender&quot;)}}\" lt-prop-wrapper-class=\"{{ltPropCalendarPopoverWrapper}}\"> <template is=\"registerYield\" yield-name=\"popover\"> <lyte-popover-content style=\"padding: 0px;\"> <lyte-calendar lt-prop-header-type=\"drilldown\" on-month-selected=\"{{method(&quot;monthSelected&quot;)}}\" on-week-selected=\"{{method(&quot;weekSelected&quot;)}}\" lt-prop-selection-type=\"{{selectionType}}\" on-date-selected=\"{{method(&quot;dateselect&quot;)}}\" lt-prop-format=\"DD-MM-YYYY\" lt-prop-start-week-day=\"{{if(ifEquals(ltPropWeekStart,undefined),0,ltPropWeekStart)}}\" class=\"lyteSchedulerCalendar\"></lyte-calendar> </lyte-popover-content> </template> </lyte-beta-popover> <lyte-beta-popover id=\"usersreachPopover\" lt-prop-origin-elem=\"lyte-search\" lt-prop-allow-multiple=\"{{ltPropPopoverAllowMultiple}}\" lt-prop-close-on-body-click=\"true\" on-before-close=\"{{method('onUserSearchClose')}}\" lt-prop-freeze=\"false\" lt-prop-type=\"box\" lt-prop-show-close-button=\"false\" lt-prop-placement=\"bottomLeft\"> <template is=\"registerYield\" yield-name=\"popover\"> <lyte-popover-content> <template is=\"for\" items=\"{{ltPropSchedulerUser}}\" item=\"user\" index=\"index\"> <div class=\"lyteSchedulerUserSearch\"> <lyte-checkbox lt-prop-name=\"checkbox\" lt-prop-val=\"{{index}}\" on-checked=\"{{method('boxChecked')}}\" on-unchecked=\"{{method('boxUnchecked')}}\"></lyte-checkbox> <lyte-yield yield-name=\"scheduler-user-search\" scheduler-user=\"{{user}}\"></lyte-yield> </div> </template> </lyte-popover-content> <lyte-popover-footer style=\"padding: 10px 25px 25px;\"> <lyte-button onclick=\"{{action('cancelUserSelect')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Cancel </template> </lyte-button> <lyte-button lt-prop-appearance=\"primary\" onclick=\"{{action('SelectUserSelect')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Done </template> </lyte-button> </lyte-popover-footer> </template> </lyte-beta-popover> <template is=\"if\" value=\"{{ltPropSchedulerMenu}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropSchedulerMenuYeild}}\"><template case=\"true\"> <lyte-menu lt-prop-yield=\"{{ltPropSchedulerMenuYield}}\" lt-prop-event=\"click\" lt-prop-query=\".lyteSchedulerMenuQuerySelector\" lt-prop-user-value=\"{{ltPropSchedulerMenuUserValue}}\" lt-prop-content=\"{{ltPropSchedulerMenuContent}}\" lt-prop-system-value=\"{{ltPropSchedulerMenuSystemValue}}\" lt-prop-description=\"{{ltPropScheluerMenuDescription}}\" lt-prop-id=\"{{ltPropSchedulerMenuId}}\" lt-prop-class=\"{{ltPropSchedulerMenuClass}}\" lt-prop-position=\"{{ltPropSchedulerMenuPosition}}\" lt-prop-width=\"{{ltPropSchedulerMenuWidth}}\" lt-prop-height=\"{{ltPropSchedulerMenuHeight}}\" lt-prop-callout=\"{{ltPropSChedulerMenuCallout}}\" lt-prop-freeze=\"{{ltPropSchedulerMenuFreeze}}\" lt-prop-query-class=\"{{ltPropSchedulerMenuQueryClass}}\" lt-prop-animate=\"{{ltPropSchedulerMenuAnimate}}\" lt-prop-wrapper-class=\"{{ltPropSchedulerMenuWrapperClass}}\" lt-prop-bind-to-body=\"{{ltPropSchedulerMenuBindToBody}}\" on-before-open=\"{{method('menuonbeforeopen')}}\" on-open=\"{{method('menuonopen')}}\" on-before-close=\"{{method('menuonbeforeclose')}}\" on-close=\"{{method('menuonclose')}}\" on-menu-click=\"{{method('menuonclick')}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-yield yield-name=\"scheduler-menu\"></lyte-yield> </template> </lyte-menu> </template><template case=\"false\"> <lyte-menu lt-prop-yield=\"{{ltPropSchedulerMenuYield}}\" lt-prop-set-css=\"false\" lt-prop-event=\"click\" lt-prop-query=\".lyteSchedulerMenuQuerySelector\" lt-prop-user-value=\"{{ltPropSchedulerMenuUserValue}}\" lt-prop-content=\"{{ltPropSchedulerMenuContent}}\" lt-prop-system-value=\"{{ltPropSchedulerMenuSystemValue}}\" lt-prop-description=\"{{ltPropScheluerMenuDescription}}\" lt-prop-id=\"{{ltPropSchedulerMenuId}}\" lt-prop-class=\"{{ltPropSchedulerMenuClass}}\" lt-prop-position=\"{{ltPropSchedulerMenuPosition}}\" lt-prop-width=\"{{ltPropSchedulerMenuWidth}}\" lt-prop-height=\"{{ltPropSchedulerMenuHeight}}\" lt-prop-callout=\"{{ltPropSChedulerMenuCallout}}\" lt-prop-freeze=\"{{ltPropSchedulerMenuFreeze}}\" lt-prop-query-class=\"{{ltPropSchedulerMenuQueryClass}}\" lt-prop-animate=\"{{ltPropSchedulerMenuAnimate}}\" lt-prop-wrapper-class=\"{{ltPropSchedulerMenuWrapperClass}}\" lt-prop-bind-to-body=\"{{ltPropSchedulerMenuBindToBody}}\" on-before-open=\"{{method('menuonbeforeopen')}}\" on-open=\"{{method('menuonopen')}}\" on-before-close=\"{{method('menuonbeforeclose')}}\" on-close=\"{{method('menuonclose')}}\" on-menu-click=\"{{method('menuonclick')}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-yield yield-name=\"scheduler-menu\"></lyte-yield> </template> </lyte-menu> </template></template> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"registerYield","position":[1,1,1,1],"dynamicNodes":[{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"text","position":[1]}]},{"type":"componentDynamic","position":[1]},{"type":"registerYield","position":[3,1],"dynamicNodes":[{"type":"text","position":[1]}]},{"type":"componentDynamic","position":[3]},{"type":"registerYield","position":[5,1],"dynamicNodes":[{"type":"text","position":[1]}]},{"type":"componentDynamic","position":[5]}]},{"type":"componentDynamic","position":[1,1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3,1]},{"type":"attr","position":[1,3,1,1]},{"type":"if","position":[1,3,1,1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1,3,1]},{"type":"text","position":[1,3,3,1]},{"type":"componentDynamic","position":[1,3,3]},{"type":"attr","position":[1,3,5]},{"type":"if","position":[1,3,5],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[3,1]},{"type":"componentDynamic","position":[3]}]}},"default":{}},{"type":"text","position":[1,5,1,0]},{"type":"text","position":[1,5,3,0]},{"type":"attr","position":[1,5,5]},{"type":"if","position":[1,5,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,1]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1,5]},{"type":"text","position":[1,7,1,1,1]},{"type":"attr","position":[1,7,3]},{"type":"registerYield","position":[1,7,3,1],"dynamicNodes":[{"type":"text","position":[1]}]},{"type":"componentDynamic","position":[1,7,3]},{"type":"text","position":[1,7,5,1,1]},{"type":"componentDynamic","position":[1,7]},{"type":"insertYield","position":[1,9]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]}]},{"type":"attr","position":[1,3]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1,0]},{"type":"switch","position":[3,1,0],"cases":{"month":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"attr","position":[0,1,1,1]},{"type":"if","position":[0,1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray[0]}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <th class=\"lyteSchedulerMonthTh {{item.buisness}}\"> {{lyteUiI18n(lyteUiSchedulerLabelFormat('ddd',item.month,item.date,ltPropDisplayYear))}} </th> </tr></tbody></table></template>","tagName":"TR"}]}},"default":{},"actualTemplate":"<template is=\"if\" value=\"{{!ltPropMultiUserView}}\"><template case=\"true\" depth=\"1\"><table> <thead> <tr class=\"lyteSchedulerMonthViewHead\"> <td is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray[0]}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </thead> </table></template></template>"},{"type":"attr","position":[0,1,1,3,1]},{"type":"for","position":[0,1,1,3,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[3]},{"type":"text","position":[3,1,0]},{"type":"text","position":[3,3,0]},{"type":"attr","position":[5]},{"type":"text","position":[5,1,0]},{"type":"text","position":[5,3,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[1,1,3]},{"type":"if","position":[1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,1]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,1,5]},{"type":"insertYield","position":[1,1,5]},{"type":"attr","position":[1,1,7]},{"type":"if","position":[1,1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"forIn","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[3]},{"type":"text","position":[3,1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"if","position":[0,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,5]},{"type":"if","position":[0,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}}]},{"type":"attr","position":[3]},{"type":"text","position":[3,1]}]}},"default":{}}]}},"default":{}}],"actualTemplate":"<template is=\"for\" items=\"{{week}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <td class=\"lyteSchedulerDate lyteSchedulerMenuQuerySelector {{if(ifEquals(item.current_month,true),&quot;lyteSchedulerCurrentMonthDate&quot;,&quot;lyteSchedulerOtherMonthDate&quot;)}} lyteSchedulerAllDayEvent {{item.buisness}} {{if(ifEquals(item.currentDate,true),&quot;lyteSchedulerCurrDate&quot;,&quot;&quot;)}}\"> <div class=\"lyteSchedulerMonthEventsWrap scheduler-event-div\" data-date=\"{{lyteUiSchedulerGetDate(item.val)}}\"> <template is=\"if\" value=\"{{ltPropMultiUserView}}\"><template case=\"true\"> <template is=\"if\" value=\"{{item.currentDate}}\"><template case=\"true\"><div class=\"lyteSchedulerMonthTodayLabel\">Today</div></template></template> <div class=\"lyteSchedulerMonthYearLabel\" onclick=\"{{action('onDateClick',event,item.val)}}\"> <span>{{lyteUiSchedulerMonthshortForm(item.month)}}</span> <span>{{item.year}}</span> </div> <div class=\"lyteSchedulerMultiUserMonthViewDateDayLabel\" onclick=\"{{action('onDateClick',event,item.val)}}\"> <span class=\"lyteSchedulerMultiUserMonthViewDateLabel\">{{item.date}}</span> <span class=\"lyteSchedulerMultiUserMonthViewDayLabel\">{{lyteUiSchedulerLabelFormat('ddd',item.month,item.date,ltPropDisplayYear)}}</span> </div> </template><template case=\"false\"> <span class=\"lyteSchedulerDayNumber\" onclick=\"{{action('onDateClick',event,item.val)}}\">{{item.date}}</span> </template></template> <template is=\"if\" value=\"{{expHandlers(index,'!')}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropShowWeekNumber}}\"><template case=\"true\"><div class=\"lyteSchedulerWeekNumber\"> {{lyteSchedulerUiFindWeek(item.val)}} </div></template></template> </template></template> <lyte-yield yield-name=\"scheduler-date\" scheduler-date=\"{{item.val}}\"></lyte-yield> <template is=\"if\" value=\"{{item.events}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropMultiUserView}}\"><template case=\"true\"> <template is=\"forIn\" object=\"{{item.events}}\" value=\"value\" key=\"key\"> <lyte-scheduler-event-tag class=\"{{value.class}} {{if(expHandlers(item.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{value}}\" data-id=\"{{value.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',value,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',value,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-user=\"{{lyteUiSchedulergetUserData(key,ltPropSchedulerUser)}}\" scheduler-event=\"{{value}}\"> </lyte-yield> <template is=\"if\" value=\"{{expHandlers(value.length,'>',1)}}\"><template case=\"true\"> <template is=\"yield\" yield-name=\"scheduler-event-badge\"> <div onclick=\"{{action(&quot;hiddenUserEvent&quot;,event,value,key)}}\" class=\"lyteSchedulerEventMoreBtn lyteSchedulerUserMoreBtn\"> {{value.length}} </div> </template> </template></template> </lyte-scheduler-event-tag> </template> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj,item.val)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj,lyteUiSchedulerGetDate(item.val),this)}} </div> </template><template case=\"false\"> <template is=\"for\" items=\"{{item.events}}\" item=\"event\" index=\"index\"> <template is=\"if\" value=\"{{lyteUiSchedulerEvent(event)}}\"><template case=\"true\"><lyte-scheduler-event-tag class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-index=\"{{index}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> <template is=\"if\" value=\"{{lyteUiSchedulerIsResize(week,event,ltPropFormat,'start')}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalLeftResize\"></span></template></template> <template is=\"if\" value=\"{{lyteUiSchedulerIsResize(week,event,ltPropFormat,'end')}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalRightResize\"></span></template></template> </lyte-scheduler-event-tag></template></template> </template> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj,item.val)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj,lyteUiSchedulerGetDate(item.val),this)}} </div> </template></template> </template></template> </div> </td> </tr></tbody></table></template>","tagName":"TR"}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"week\" index=\"index\" depth=\"2\"><table><tbody> <tr> <td is=\"for\" lyte-for=\"true\" items=\"{{week}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </tbody></table></template>","tagName":"TBODY"},{"type":"componentDynamic","position":[0]}]},"week":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1,1,1,1]},{"type":"if","position":[1,1,1,1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,1,1,1,3]},{"type":"for","position":[1,1,1,1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,1]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"text","position":[3,1,0]},{"type":"text","position":[3,3,0]}]}},"default":{}}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <th class=\"lyteSchedulerWeekTh {{item.buisness}} {{if(ifEquals(item.currentDate,true),&quot;lyteSchedulerCurrDate&quot;,&quot;&quot;)}}\" onclick=\"{{action('onDateClick',event,item.val)}}\"> <template is=\"if\" value=\"{{expHandlers(index,'!')}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropShowWeekNumber}}\"><template case=\"true\"><span class=\"lyteSchedulerWeekNumber\"> {{lyteSchedulerUiFindWeek(item.val)}} </span></template></template> </template></template> <template is=\"if\" value=\"{{ltPropSchedulerLabelFormat}}\"><template case=\"true\"> <div> {{lyteUiSchedulerLabelFormat(ltPropSchedulerLabelFormat,item.month,item.date,ltPropDisplayYear)}} </div> </template><template case=\"false\"> <div class=\"lyteSchedulerMonthLabel\">{{lyteUiI18n(month[item.month])}} </div> <div> <span class=\"lyteSchedulerDateLabel\">{{lyteUiI18n(item.date)}}</span> <span class=\"lyteSchedulerDayLabel\">{{lyteUiI18n(label[index])}}</span> </div> </template></template> </th> </tr></tbody></table></template>","tagName":"TR"},{"type":"attr","position":[1,1,3,1]},{"type":"for","position":[1,1,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"attr","position":[1,1,1,1]},{"type":"insertYield","position":[1,1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"if","position":[0,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,5]},{"type":"if","position":[0,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}}]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"text","position":[1,3,1]}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <td class=\"{{item.buisness}} {{if(ifEquals(item.currentDate,true),&quot;lyteSchedulerCurrDate&quot;,&quot;&quot;)}} lyteSchedulerDate lyteSchedulerMenuQuerySelector lyteSchedulerAllDayEvent\"> <div class=\"scheduler-event-div\" data-date=\"{{lyteUiSchedulerGetDate(item.val)}}\"> <template is=\"if\" value=\"{{item.events}}\"><template case=\"true\"> <template is=\"for\" items=\"{{item.events[user.id]}}\" item=\"event\" index=\"index\"> <template is=\"if\" value=\"{{lyteUiSchedulerEvent(event)}}\"><template case=\"true\"><lyte-scheduler-event-tag event-index=\"{{index}}\" class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> <template is=\"if\" value=\"{{lyteUiSchedulerIsResize(ltPropDateArray,event,ltPropFormat,'start')}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalLeftResize\"></span></template></template> <template is=\"if\" value=\"{{lyteUiSchedulerIsResize(ltPropDateArray,event,ltPropFormat,'end')}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalRightResize\"></span></template></template> </lyte-scheduler-event-tag></template></template> </template> </template></template> </div> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj,item.val,user.id)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj,lyteUiSchedulerGetDate(item.val),this,user.id)}} </div> </td> </tr></tbody></table></template>","tagName":"TR"}]}},"default":{},"actualTemplate":"<template is=\"if\" value=\"{{lyteUiSchedulerisSearch(selectedUserArr,index)}}\"><template case=\"true\" depth=\"2\"><table><tbody> <tr data-userid=\"{{user.id}}\" class=\"lyteSchedulerMultiUserRow\"> <td class=\"lyteSchedulerUserCol\"> <lyte-scheduler-user lt-prop-userid=\"{{user.id}}\"> <lyte-yield yield-name=\"scheduler-user\" scheduler-user=\"{{user}}\" scheduler-event-count=\"{{lyteUiSchedulerEventCount(ltPropDateArray,user,hiddenObj)}}\"> </lyte-yield> </lyte-scheduler-user> </td> <td is=\"for\" lyte-for=\"true\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"></td> </tr> </tbody></table></template></template>"}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropSchedulerUser}}\" item=\"user\" index=\"index\" depth=\"2\"><table><tbody> <tr is=\"if\" lyte-if=\"true\" value=\"{{lyteUiSchedulerisSearch(selectedUserArr,index)}}\"></tr> </tbody></table></template>","tagName":"TBODY"}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,3,1,1,1,3]},{"type":"for","position":[1,3,1,1,1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,1]}]}},"default":{}}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"text","position":[3,1,0]},{"type":"text","position":[3,3,0]},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,1]}]}},"default":{}}]}},"default":{}}]}},"default":{}}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <th class=\"lyteSchedulerWeekTh {{if(ifEquals(item.currentDate,true),&quot;lyteSchedulerCurrDate&quot;,&quot;&quot;)}} {{item.buisness}}\" onclick=\"{{action('onDateClick',event,item.val)}}\"> <template is=\"if\" value=\"{{ltPropSchedulerLabelFormat}}\"><template case=\"true\"> <div> {{lyteUiSchedulerLabelFormat(ltPropSchedulerLabelFormat,item.month,item.date,ltPropDisplayYear,item)}} </div> <template is=\"if\" value=\"{{expHandlers(index,'!')}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropShowWeekNumber}}\"><template case=\"true\"><span class=\"lyteSchedulerWeekNumber\"> {{lyteSchedulerUiFindWeek(item.val)}} </span></template></template> </template></template> </template><template case=\"false\"> <div class=\"lyteSchedulerMonthLabel\"> {{lyteUiI18n(month[item.month])}} </div> <div> <span class=\"lyteSchedulerDateLabel\">{{item.date}}</span> <span class=\"lyteSchedulerDayLabel\">{{lyteUiI18n(label[index])}}</span> </div> <template is=\"if\" value=\"{{expHandlers(index,'!')}}\"><template case=\"true\"> <template is=\"if\" value=\"{{ltPropShowWeekNumber}}\"><template case=\"true\"><span class=\"lyteSchedulerWeekNumber\"> {{lyteSchedulerUiFindWeek(item.val)}} </span></template></template> </template></template> </template></template> </th> </tr></tbody></table></template>","tagName":"TR"},{"type":"text","position":[1,3,1,1,3,1,1,1]},{"type":"attr","position":[1,3,1,1,3,3]},{"type":"for","position":[1,3,1,1,3,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"insertYield","position":[0,1]},{"type":"attr","position":[0,3]},{"type":"if","position":[0,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,5]},{"type":"if","position":[0,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}}]}},"default":{}}]},{"type":"attr","position":[3]},{"type":"text","position":[3,1]}]}},"default":{}}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <td class=\"lyteSchedulerDate lyteSchedulerMenuQuerySelector lyteSchedulerAllDayEvent {{item.buisness}}\" data-index=\"{{index}}\"> <div class=\"scheduler-event-div\" data-date=\"{{lyteUiSchedulerGetDate(item.val)}}\"> <template is=\"if\" value=\"{{item.allDay}}\"><template case=\"true\"> <template is=\"for\" items=\"{{item.allDay}}\" item=\"event\" index=\"index\"> <template is=\"if\" value=\"{{event}}\"><template case=\"true\"> <template is=\"if\" value=\"{{lyteUiSchedulerEvent(event)}}\"><template case=\"true\"><lyte-scheduler-event-tag event-index=\"{{index}}\" class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" data-group=\"{{key}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> <template is=\"if\" value=\"{{lyteUiSchedulerIsResize(ltPropDateArray,event,ltPropFormat,'start')}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalLeftResize\"></span></template></template> <template is=\"if\" value=\"{{lyteUiSchedulerIsResize(ltPropDateArray,event,ltPropFormat,'end')}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalRightResize\"></span></template></template> </lyte-scheduler-event-tag></template></template> </template></template> </template> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj.allDay,item.val,undefined,undefined,ltPropSchedulerView,true)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj.allDay,lyteUiSchedulerGetDate(item.val),this)}} </div> </template></template> </div> </td> </tr></tbody></table></template>","tagName":"TR"},{"type":"attr","position":[1,3,1,3,1]},{"type":"for","position":[1,3,1,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1,1]},{"type":"attr","position":[1,13]},{"type":"if","position":[1,13],"cases":{"true":{"dynamicNodes":[]}},"default":{},"actualTemplate":"<template is=\"if\" value=\"{{!ltPropWorkingDayOnly}}\"><template case=\"true\" depth=\"3\"><table><tbody><tr> <td data-index=\"5\" class=\"lyteSchedulerMenuQuerySelector\"></td> <td data-index=\"6\" class=\"lyteSchedulerMenuQuerySelector\"></td> </tr></tbody></table></template></template>"}],"actualTemplate":"<template is=\"for\" items=\"{{timelineArray}}\" item=\"min\" index=\"index\" depth=\"2\"><table><tbody> <tr data-time=\"{{lyteUiSchedulerTimeFormat(time,min,null,false)}}\" class=\"lyteSchedulerDate lyteSchedulerTimeLineEvent {{lyteUiSchedulerBusinessHour(ltPropBusinessHour,this)}}\"> <td style=\"width: 100px;\"> <div class=\"lyteSchedulerHourLabel\"> {{lyteUiSchedulerTimeFormat(time,min,ltPropContinentalTimeFormat,true)}}</div> <div class=\"lyteSchedulerHourQuarterLine\"></div> <div class=\"lyteSchedulerHourHalfLine\"></div> <div class=\"lyteSchedulerHourQuarterLine\"></div> </td> <td data-index=\"0\" class=\"lyteSchedulerMenuQuerySelector\"></td> <td data-index=\"1\" class=\"lyteSchedulerMenuQuerySelector\"></td> <td data-index=\"2\" class=\"lyteSchedulerMenuQuerySelector\"></td> <td data-index=\"3\" class=\"lyteSchedulerMenuQuerySelector\"></td> <td data-index=\"4\" class=\"lyteSchedulerMenuQuerySelector\"></td> <td is=\"if\" lyte-if=\"true\" value=\"{{expHandlers(ltPropWorkingDayOnly,'!')}}\"></td> </tr> </tbody></table></template>","tagName":"TBODY"}],"actualTemplate":"<template is=\"for\" items=\"{{timeLine}}\" item=\"time\" index=\"index\" depth=\"2\"><table><tbody> <tr is=\"for\" lyte-for=\"true\" items=\"{{timelineArray}}\" item=\"min\" index=\"index\" depth=\"2\"></tr> </tbody></table></template>","tagName":"TBODY"},{"type":"attr","position":[1,3,3,1,1,1,3]},{"type":"for","position":[1,3,3,1,1,1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"forIn","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[2]},{"type":"text","position":[2,1]}]}},"default":{}}]}]}},"default":{}}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropDateArray}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <td class=\"lyteSchedulerDate {{if(ifEquals(item.currentDate,true),&quot;lyteSchedulerCurrDate&quot;,&quot;&quot;)}} {{item.buisness}}\"> <div class=\"scheduler-event-div\" data-date=\"{{lyteUiSchedulerGetDate(item.val)}}\"> <template is=\"if\" value=\"{{item.events}}\"><template case=\"true\"> <template is=\"forIn\" object=\"{{item.events}}\" value=\"events\" key=\"key\"> <template is=\"if\" value=\"{{expHandlers(key,'!==','allDayEvent')}}\"><template case=\"true\"><template is=\"for\" items=\"{{events}}\" item=\"event\" index=\"index\"> <lyte-scheduler-event-tag class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" data-group=\"{{key}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> <template is=\"if\" value=\"{{event.editable}}\"><template case=\"true\"><span class=\"lyteSchedulerGrabResize\"></span></template></template> </lyte-scheduler-event-tag> </template> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" data-group=\"{{key}}\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj,item.val)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj,lyteUiSchedulerGetDate(item.val),this,'',key)}} </div> </template></template> </template> </template></template> </div> </td> </tr></tbody></table></template>","tagName":"TR"}]}},"default":{}},{"type":"componentDynamic","position":[0]}]},"day":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1,1,1,1]},{"type":"if","position":[1,1,1,1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"text","position":[1,1,1,1,3,1,1]},{"type":"attr","position":[1,1,1,1,5]},{"type":"for","position":[1,1,1,1,5],"dynamicNodes":[{"type":"text","position":[1,1]}],"actualTemplate":"<template is=\"for\" items=\"{{timeLine}}\" item=\"item\" index=\"index\" depth=\"3\"><table><tbody><tr> <th> {{lyteUiSchedulerTimeFormat(item,0,ltPropContinentalTimeFormat,true)}} <div class=\"lyteSchedulerHourSplitLineWrap\"> <span class=\"lyteSchedulerHourSplitLine\"></span> <span class=\"lyteSchedulerHourSplitLine\"></span> <span class=\"lyteSchedulerHourSplitLine\"></span> <span class=\"lyteSchedulerHourSplitLine\"></span> <span class=\"lyteSchedulerHourSplitLine\"></span> </div> <div class=\"lyteSchedulerHourSeparatorLine\"></div> </th> </tr></tbody></table></template>","tagName":"TR"},{"type":"attr","position":[1,1,3,1]},{"type":"for","position":[1,1,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"attr","position":[1,1,1,1]},{"type":"insertYield","position":[1,1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"attr","position":[1,3,1,1]},{"type":"for","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[1,3,1,3]},{"type":"text","position":[1,3,1,3,1]},{"type":"attr","position":[1,5]},{"type":"for","position":[1,5],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"text","position":[1,3,1]}],"actualTemplate":"<template is=\"for\" items=\"{{timeLine}}\" item=\"time\" index=\"index\" depth=\"3\"><table><tbody><tr> <td class=\"lyteSchedulerTimeLineEvent lyteSchedulerDate lyteSchedulerMenuQuerySelector\"> <div data-time=\"{{lyteUiSchedulerTimeFormat(time,null,null,false)}} \" class=\"lyteSchedulerMultiUserViewEventElem scheduler-event-div\"> <template is=\"if\" value=\"{{ltPropDateObj[user.id][time]}}\"><template case=\"true\"> <template is=\"for\" items=\"{{ltPropDateObj[user.id][time]}}\" item=\"event\" index=\"index\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsEmptyObject(event),'!')}}\"><template case=\"true\"> <lyte-scheduler-event-tag class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{event}}\" data-group=\"{{schedulerGroup}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> <template is=\"if\" value=\"{{event.editable}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalLeftResize\"></span></template></template> <template is=\"if\" value=\"{{event.editable}}\"><template case=\"true\"><span class=\"lyteSchedulerHorizontalResizeIcon lyteSchedulerHorizontalRightResize\"></span></template></template> </lyte-scheduler-event-tag> </template></template></template> </template></template> </div> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj[startDateOfView][user.id],startDateOfView,user,time,ltPropSchedulerView)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj,startDateOfView,this,user.id,null,time,ltPropSchedulerView)}} </div> </td> </tr></tbody></table></template>","tagName":"TR"}]}},"default":{},"actualTemplate":"<template is=\"if\" value=\"{{lyteUiSchedulerisSearch(selectedUserArr,index)}}\"><template case=\"true\" depth=\"2\"><table><tbody> <tr class=\"lyteSchedulerMultiUserRow\" data-userid=\"{{user.id}}\"> <td class=\"lyteSchedulerUserCol lyteSchedulerFixedCol\"> <lyte-scheduler-user lt-prop-user=\"{{user.id}}\"> <lyte-yield yield-name=\"scheduler-user\" scheduler-user=\"{{user}}\" scheduler-event-count=\"{{lyteUiSchedulerEventCount(ltPropDateObj,user,hiddenObj,startDateOfView)}}\"> </lyte-yield> </lyte-scheduler-user> </td> <td class=\"lyteSchedulerDate lyteSchedulerMenuQuerySelector lyteSchedulerAllDayEvent\"> <div class=\"scheduler-event-div \" data-date=\"{{startDateOfView}}\"> <template is=\"for\" items=\"{{ltPropDateObj.allDay[user.id]}}\" item=\"event\" index=\"index\"> <lyte-scheduler-event-tag event-index=\"{{index}}\" class=\"{{event.class}} {{if(expHandlers(event.editable,'!'),'lyteSchedulerNoDrag','')}}\" lt-prop-event=\"{{event}}\" data-id=\"{{event.id}}\" event-render=\"{{method('eventRender')}}\" onclick=\"{{action('onSchedulerEventClick',event,this)}}\" onmouseover=\"{{action('onSchedulerEventHover',event,this)}}\" onmousedown=\"{{action('onSchedulerEventMouseDown',event,this)}}\"> <lyte-yield yield-name=\"scheduler-event\" scheduler-event=\"{{event}}\"> </lyte-yield> </lyte-scheduler-event-tag> </template> <div class=\"lyteSchedulerEventMoreBtn lyteSchedulerEventMoreBtnHide\" onclick=\"{{action(&quot;hiddenEvent&quot;,event,hiddenObj.allDay,startDateOfView,user.id,null,ltPropSchedulerView,true)}}\"> {{lyteUiSchedulerhiddenEvent(hiddenObj.allDay,startDateOfView,this,user.id)}} </div> </div> </td> <td is=\"for\" lyte-for=\"true\" items=\"{{timeLine}}\" item=\"time\" index=\"index\" depth=\"3\"></td> </tr> </tbody></table></template></template>"}],"actualTemplate":"<template is=\"for\" items=\"{{ltPropSchedulerUser}}\" item=\"user\" index=\"index\" depth=\"2\"><table><tbody> <tr is=\"if\" lyte-if=\"true\" value=\"{{lyteUiSchedulerisSearch(selectedUserArr,index)}}\"></tr> </tbody></table></template>","tagName":"TBODY"},{"type":"attr","position":[5]},{"type":"componentDynamic","position":[5]},{"type":"attr","position":[7]},{"type":"componentDynamic","position":[7]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,1,1,1,0,1]},{"type":"if","position":[1,1,1,1,0,1],"cases":{"true":{"dynamicNodes":[]},"false":{"dynamicNodes":[{"type":"text","position":[0,1,1]}]}},"default":{},"actualTemplate":"<template is=\"if\" value=\"{{ltPropMultiUserView}}\"><template case=\"true\" depth=\"3\"><table><tbody><tr><td>all-day</td></tr></tbody></table></template><template case=\"false\" depth=\"3\"><table><tbody><tr><td> <div class=\"lyteSchedulerSingleUserAllDay\"> All-Day ({{lyteUiSchedulerAllDayCount(ltPropProcessedData,hiddenObj,startDateOfView,ltPropSchedulerView,ltPropMultiUserView)}}) </div> </td></tr></tbody></table></template></template>"},{"type":"attr","position":[1,1,1,1,0,3,1]},{"type":"attr","position":[1,1,1,1,0,3,1,1]},{"type":"for","position":[1,1,1,1,0,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"insertYield","position":[0,1]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]}},"default":{}}]},{"type":"attr","position":[1,1,1,1,0,3,1,3]},{"type":"text","position":[1,1,1,1,0,3,1,3,1]},{"type":"attr","position":[1,1,1,1,2]},{"type":"for","position":[1,1,1,1,2],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,1,1]}],"actualTemplate":"<template is=\"for\" items=\"{{timelineArray}}\" item=\"min\" index=\"index\" depth=\"2\"><table><tbody> <tr data-time=\"{{lyteUiSchedulerTimeFormat(time,min,null,false)}}\" class=\"lyteSchedulerDate lyteSchedulerMenuQuerySelector lyteSchedulerTimeLineEvent {{lyteUiSchedulerBusinessHour(ltPropBusinessHour,this)}}\"> <td> <div class=\"lyteSchedulerHourLabel\"> {{lyteUiSchedulerTimeFormat(time,min,ltPropContinentalTimeFormat,true)}} </div> <div class=\"lyteSchedulerHourQuarterLine\"></div> <div class=\"lyteSchedulerHourHalfLine\"></div> <div class=\"lyteSchedulerHourQuarterLine\"></div> </td> <td>&nbsp;</td> </tr> </tbody></table></template>","tagName":"TBODY"}],"actualTemplate":"<template is=\"for\" items=\"{{timeLine}}\" item=\"time\" index=\"index\" depth=\"2\"><table><tbody> <tr is=\"for\" lyte-for=\"true\" items=\"{{timelineArray}}\" item=\"min\" index=\"index\" depth=\"2\"></tr> </tbody></table></template>","tagName":"TBODY"},{"type":"attr","position":[1,1,3,1,3,1,3,1]},{"type":"attr","position":[1,1,3,1,3,1,3,1,1]},{"type":"for","position":[1,1,3,1,3,1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"insertYield","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}]}},"default":{}},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"componentDynamic","position":[3]},{"type":"attr","position":[5]},{"type":"registerYield","position":[5,1],"dynamicNodes":[{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"insertYield","position":[0]}]}},"default":{}},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1]},{"type":"insertYield","position":[3,1]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[5]},{"type":"attr","position":[7]},{"type":"registerYield","position":[7,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[7]},{"type":"attr","position":[9]},{"type":"registerYield","position":[9,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"insertYield","position":[1,3]}]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1]},{"type":"registerYield","position":[3,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[3,1]},{"type":"attr","position":[3,3]},{"type":"registerYield","position":[3,3,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[3,3]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[9]},{"type":"attr","position":[11]},{"type":"if","position":[11],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"insertYield","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"insertYield","position":[1]}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}],
_observedAttributes :["ltPropEvent","ltPropFormat","ltPropDraggable","ltPropMaxAllDayEvent","ltPropMaxTimelineEvent","ltPropMultiUserView","ltPropSchedulerUser","ltPropBusinessDays","ltPropBusinessHour","ltPropSchedulerView","ltPropSchedulerHeaderYield","ltPropCalendarHeaderType","ltPropHideCalendarNav","ltPropWeekEventOverlap","ltPropEventGap","ltPropTimelineNmore","ltPropHiddenPopoverWrapper","ltPropCalendarPopoverWrapper","ltPropDragThershold","ltPropContinentalTimeFormat","ltPropyieldNav","ltPropTitleYield","ltPropShowWeekNumber","ltPropPopoverAllowMultiple","ltPropWorkingDayOnly","ltPropSchedulerLabelFormat","ltPropShowCurrentTime","ltPropManipulatedEvent","ltPropLabel","ltPropCurrMonth","ltdisplayCurrDate","ltPropCurDay","ltPropDisplayYear","ltPropWeekStart","openSchedulerPopover","ltPropTimeLine","timeLine","timelineArray","currDay","ltCurrStartDate","ltCurrEndDate","ltPropCurrentDate","labelFF","label","month","montharray","DateArray","days","startDateOfView","hiddenObj","eventArr","todayButton","ltPropSchedulerSearch","ltPropSchedulerSearchYield","selectionType","ltPropSortUser","checkboxArr","selectedUserArr","ltPropSchedulerMenu","ltPropSchedulerMenuYield","ltPropSchedulerMenuContent","ltPropSchedulerMenuUserValue","ltPropSchedulerMenuSystemValue","ltPropSchedulerMenuDescription","ltPropSchedulerMenuId","ltPropSchedulerMenuClass","ltPropSchedulerMenuPosition","ltPropSchedulerMenuWidth","ltPropSchedulerMenuHeight","ltPropSchedulerMenuCallout","ltPropSchedulerMenuFreeze","ltPropSchedulerMenuQueryClass","ltPropSchedulerMenuBindToBody","ltPropSchedulerMenuAnimate","ltPropSchedulerMenuWrapperClass","ltPropSchedulerMenuAria","ltPropSchedulerMenuAriaAttribute","dropData","isEventAdded","isResizing","dragDir","currEventTag","breakpoint","ybreakpoint","curPgX","curPgY","quadrant","ltPropEventResize","tempResizeClientY","hiddenUser"],

	data : function(){
		return {
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {array} ltPropEvent
             */
			'ltPropEvent' : Lyte.attr('array' ,{ default : [] } ),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {string} ltPropFormat
             */
			'ltPropFormat' : Lyte.attr('string',{ default : 'DD-MM-YYYY HH:mm A'}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {boolean} ltPropDraggable
			 * @default false
             */
			'ltPropDraggable' : Lyte.attr('boolean',{default:false}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {number} ltPropMaxAllDayEvent
			 * @default 5
             */
			'ltPropMaxAllDayEvent' : Lyte.attr('number',{default: 5}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {number} ltPropMaxTimelineEvent
			 * @default 2
             */
			'ltPropMaxTimelineEvent' : Lyte.attr('number',{default: 2}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {boolean} ltPropMultiUserView
			 * @default false
             */
			'ltPropMultiUserView' : Lyte.attr('boolean',{default: false}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {array} ltPropSchedulerUser
             */
			'ltPropSchedulerUser' : Lyte.attr('array',{default:[]}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {array} ltPropBusinessDays
             */
			'ltPropBusinessDays' : Lyte.attr('array',{default:[1,2,3,4,5]}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {array} ltPropBusinessHour
             */
			'ltPropBusinessHour' : Lyte.attr('array',{default:['09:00 AM','06:00 PM']}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {string} ltPropSchedulerView
			 * @default month
             */
			'ltPropSchedulerView' : Lyte.attr('string',{default:'month'}),
			/**
             * This specifies the type of the scheduler.
             * @componentProperty {boolean} ltPropSchedulerHeaderYield
			 * @default false
             */
			'ltPropSchedulerHeaderYield' : Lyte.attr('boolean',{ default : false }),
			'ltPropCalendarHeaderType' : Lyte.attr('boolean',{default : false}),
			'ltPropHideCalendarNav' : Lyte.attr('boolean',{default : false}),
			'ltPropWeekEventOverlap' : Lyte.attr('boolean',{default : false}),
			'ltPropEventGap' : Lyte.attr('number',{default : 5}),
			'ltPropTimelineNmore' : Lyte.attr('boolean',{default: true}),
			"ltPropHiddenPopoverWrapper" : Lyte.attr('string',{default : ''}),
			'ltPropCalendarPopoverWrapper' : Lyte.attr('string',{default : ''}),
			'ltPropDragThershold' : Lyte.attr('number',{default : 5}),
			'ltPropContinentalTimeFormat' : Lyte.attr('boolean',{default : false}),
			'ltPropyieldNav' : Lyte.attr('boolean',{default : false}),
			'ltPropTitleYield' : Lyte.attr('boolean',{ default : false }),
			'ltPropShowWeekNumber' : Lyte.attr('boolean',{dafault: false}),
			'ltPropPopoverAllowMultiple' : Lyte.attr('boolean',{default: false}),
			'ltPropWorkingDayOnly' : Lyte.attr('boolean',{default: false}),
			'ltPropSchedulerLabelFormat' : Lyte.attr('string'),	
			'ltPropShowCurrentTime' : Lyte.attr('boolean',{default : true}),
			'ltPropManipulatedEvent' : Lyte.attr('array',{ default : [] }),
			'ltPropLabel' :  Lyte.attr('array',{default : ['SUN','MON','TUE','WED','THU','FRI','SAT']}),
			'ltPropCurrMonth' : Lyte.attr('number'),
			'ltdisplayCurrDate' : Lyte.attr('string'),
			'ltPropCurDay' :Lyte.attr('string'),
			'ltPropDisplayYear' : Lyte.attr('number'),
			'ltPropWeekStart' : Lyte.attr('number'),
			'openSchedulerPopover' : Lyte.attr('boolean',{default: false}),
			'ltPropTimeLine' : Lyte.attr('number',{default : 30}),
			'timeLine' : Lyte.attr('array',{ default:['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm']}),
			'timelineArray' : Lyte.attr('array',{default:[]}),
			'currDay' : Lyte.attr('string'),
			'ltCurrStartDate' : Lyte.attr('string'),
			'ltCurrEndDate' : Lyte.attr('string'),
			'ltPropCurrentDate' : Lyte.attr('object',{default : new Date()}),
			'labelFF' :  Lyte.attr('array',{default : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']}),
			'label' : Lyte.attr('array',{default : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']}),
			'month' :  Lyte.attr( 'array', { default : [ 'January', 'February', 'March', 'April', 'May','June' ,'July','August','September','October','November','December' ] } ),
			'montharray' : Lyte.attr('array', { default : [] } ),
			'DateArray' : Lyte.attr('array', { default : [] } ),
			"days" : Lyte.attr('array',{default:['sunday','monday','tuesday','wednesday','thursday','friday','saturday']}),
			"startDateOfView" : Lyte.attr('string',{default : ''}),
			"hiddenObj" : Lyte.attr('object',{default:{}}),
			"eventArr" : Lyte.attr('object',{default:{}}),
			"todayButton": Lyte.attr('string',{default:_lyteUiUtils.i18n('today')}),
			'ltPropSchedulerSearch': Lyte.attr('boolean',{default : false}),
			'ltPropSchedulerSearchYield' : Lyte.attr('boolean',{default : false}),
			"selectionType" : Lyte.attr('string',{default:''}),
			'ltPropSortUser' : Lyte.attr('boolean',{default: false}),
			'checkboxArr' : Lyte.attr('array',{default:[]}),
			"selectedUserArr" : Lyte.attr('array',{default:[]}),
			 //lyte-menu data
			"ltPropSchedulerMenu" : Lyte.attr('boolean',{default: false}),
			"ltPropSchedulerMenuYield" : Lyte.attr('boolean',{default: false}),
			"ltPropSchedulerMenuContent" : Lyte.attr('array',{default:[]}),
			"ltPropSchedulerMenuUserValue" : Lyte.attr('string'),
			"ltPropSchedulerMenuSystemValue" : Lyte.attr('string'),
			"ltPropSchedulerMenuDescription" : Lyte.attr('string'),
			"ltPropSchedulerMenuId" : Lyte.attr('string'),
			"ltPropSchedulerMenuClass" : Lyte.attr('string'),
			"ltPropSchedulerMenuPosition" : Lyte.attr('string'),
			"ltPropSchedulerMenuWidth" : Lyte.attr('string',{default:'auto'}),
			"ltPropSchedulerMenuHeight" : Lyte.attr('string',{default:'auto'}),
			"ltPropSchedulerMenuCallout" : Lyte.attr('boolean', {default : false}),
			"ltPropSchedulerMenuFreeze" : Lyte.attr('boolean',{default : false}),
			"ltPropSchedulerMenuQueryClass" : Lyte.attr('string',{default: 'lyteMenuSelected'}),
			"ltPropSchedulerMenuBindToBody" : Lyte.attr('boolean',{default : true}),
			"ltPropSchedulerMenuAnimate" : Lyte.attr('boolean',{default : false}),
			"ltPropSchedulerMenuWrapperClass" : Lyte.attr('string'),
			"ltPropSchedulerMenuAria" : Lyte.attr('boolean', { default : false}),
			"ltPropSchedulerMenuAriaAttribute" : Lyte.attr('object' , { default : { role : 'menu'} }) ,
			"dropData" : Lyte.attr('array',{default:[ {
				'name': 'Tamilnadu',
				'value': 'TN'
			}, {
				'name': 'Kerala',
				'value': 'KL'
			} ]}),
			"isEventAdded" : Lyte.attr('boolean', { default : false}),
			"isResizing" : Lyte.attr('boolean', { default : false}),
			"dragDir" : Lyte.attr('string', { default : ''}),
			"currEventTag": Lyte.attr('string', { default : ''}),
			"breakpoint": Lyte.attr('number', { default : 0}),
			"ybreakpoint": Lyte.attr('number', { default : 0}),
			"curPgX": Lyte.attr('number', { default : 0}),
			"curPgY": Lyte.attr('number', { default : 0}),
			"quadrant": Lyte.attr('number', { default : 0}),
			"ltPropEventResize": Lyte.attr('boolean', { default : false}),
			"tempResizeClientY": Lyte.attr('number'),
			"hiddenUser" : Lyte.attr('object',{default: {}})
		}		
	},
	init : function(){
		this.generateTimeLine();
		var date = this.getData('ltPropCurrentDate');
		if(!date){
			date = new Date();
			this.data.ltPropCurrentDate = new Date();
		}
		this.setData('ltdisplayCurrDate',date.getDate() + ' ' + _lyteUiUtils.i18n(this.data.month[date.getMonth()]) + ' ' + date.getFullYear());
		this.setData('ltPropCurDay', _lyteUiUtils.i18n( this.data.days[date.getDay()] ) );
		this.setData('ltPropCurrMonth',date.getMonth());
		this.setData('ltPropDisplayYear',date.getFullYear());	
	},
	didConnect : function(){
		var _this = this;
		this.$node.addEvent = function(event){
			if(event.start){
				var events  = this.getData('ltPropEvent');
				
				if(!$u.findWhere(events,{'id':event.id})){
					Lyte.arrayUtils( events , 'push' , event );
				}
			}
		}
		this.$node.deleteEvent = function(event_id){
			if(event_id){
				var events  = this.getData('ltPropEvent');
				var event_data = $u.findWhere(events,{'id':event_id});

				if(event_data){
					Lyte.arrayUtils( events , 'removeObjects' , event_data );
				}

			}
		}
		this.$node.today = function(){
			_this._navigated = false;
			_this.ResetTimeLine();
			$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',true);
			var date = _this.getData('ltPropCurrentDate') || new Date();
			_this.setData('ltPropCurrMonth',date.getMonth());
			_this.setData('ltPropDisplayYear',date.getFullYear());
			_this.callCurrentView(date,false,_this.getData('ltPropWeekStart'));
			
			if(_this.getMethods('onTodayClick')){
				_this.executeMethod('onTodayClick',$L.moment(date),_this.$node);
			}
		}
		this.$node.moveTo = function(date){
			_this._navigated =  true;
			var day = $L.moment(date,'DD-MM-YYYY');
			if(_this.getData('ltPropSchedulerView') == 'month'){
				day.startOf('month');
			}
			_this.callCurrentView(day.getDObj(),false,_this.getData('ltPropWeekStart'));
		}
		this.$node.moveToDay = function(date){		
			date = $L.moment(date,'DD-MM-YYYY').getDObj();
			var view = _this.getData('ltPropSchedulerView');
			_this.ResetTimeLine();
			if($L.moment(date,'DD-MM-YYYY').format('DD-MM-YYYY') ===  $L.moment(new Date()).format('DD-MM-YYYY')){
				_this._navigated = false;
				$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',true)
			}else{
				_this._navigated = true;
				$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false)
			}
			if(view !== 'day'){
				_this.moveToDay = date;
				_this.setData('ltPropSchedulerView','day');
			}else{
				_this.callCurrentView(date,false,_this.getData('ltPropWeekStart'));
			}
		}
		this.$node.selectUser = function(userid){
			if(typeof userid == 'string'){
				_this.adduser(userid);
			}else if(Array.isArray(userid)){
				userid.forEach(function(user){
					_this.adduser(user);
				})
			}
		}
		this.$node.unselectUser = function(userid){
			if(typeof userid == 'string'){
				_this.removeUser(userid);
			}else if(Array.isArray(userid)){
				userid.forEach(function(user){
					_this.removeUser(user);
				})
			}
		}
		this.$node.clearSelectedUser = function(){
			_this.clearUser();
		}
		this.addEventForNav();
		this.callCurrentView(undefined,false,this.getData('ltPropWeekStart'));
		this.addScroll();
		this.MultiDayViewNav();
		this.findActiveKeys( $L.moment(this.getData('startDateOfView'),'DD-MM-YYYY') );
		this.$node.rendered = true;
	},
	didDestroy: function(){
		if( $L && $L.schedulerEventResize ){
			$L.schedulerEventResize( "destroy", this );
		}
	},
	adduser : function(userid){
		var selectedList = $u.clone(this.getData('selectedUserArr'));
		var users  = this.getData('ltPropSchedulerUser');
		var userData = $u.findWhere(users,{'id':userid});
		var index = users.indexOf(userData);
		if(!selectedList.includes(index) && index !== -1 ){
			selectedList.push(users.indexOf(userData))
			this.setData('selectedUserArr',selectedList);
		}
	},
	removeUser : function(userid){
		var selectedList = $u.clone(this.getData('selectedUserArr'));
		var users  = this.getData('ltPropSchedulerUser');
		var userData = $u.findWhere(users,{'id':userid});
		var index = users.indexOf(userData);
		var SelectedUserIndex = selectedList.indexOf(index);
		if(SelectedUserIndex !== -1 && index !== -1 ){
			selectedList.splice( SelectedUserIndex, 1 );
			this.setData('selectedUserArr',selectedList);
		}
	},
	addEventForNav : function(){
		var leftNav = $L('.lyteSchedulerNavLeft',this.$node)[0];
		var rightNav = $L('.lyteSchedulerNavRight',this.$node)[0];
		if(leftNav){
			leftNav.addEventListener('click', this.schedulerNav.bind(this));
		}
		if(rightNav){
			rightNav.addEventListener('click', this.schedulerNav.bind(this));
		}
	},
	addScroll : function(){
		var _this = this;
		var isMultiView = this.getData('ltPropMultiUserView');
		var view = this.getData('ltPropSchedulerView');
		if(isMultiView && (view == 'week' || view == 'day')){
			var prevScroll;
			$L('.lyteSchedulerMultiUserView',this.$node)[0].addEventListener('scroll',function(){
				var scrollTop = this.scrollTop;
				if((this.scrollHeight - scrollTop) <= this.offsetHeight && prevScroll !== scrollTop){
					if(_this.getMethods('onScrollEnd')){
						_this.executeMethod('onScrollEnd',_this.$node);
					}
				}
				prevScroll = scrollTop;
			});
		}
	},
	eventResize: function(){
		this.toggleEventResize();
	}.observes('ltPropEventResize').on('didConnect'),
	toggleEventResize : function(){
		if( this.getData('ltPropEventResize') ){
			if(this.getData('ltPropSchedulerView') === 'month' && this.getData('ltPropMultiUserView') === true) {
				return;
			}
			if( $L && $L.schedulerEventResize ){
				$L.schedulerEventResize( "connect", this );
			}
		}
		else{
			this.destoryEventResize();
		}
	},
	destoryEventResize: function(){
		if( $L && $L.schedulerEventResize ){
			$L.schedulerEventResize( "destroy", this );
		}
	},
	userSortable : function(){
		var view = this.getData('ltPropSchedulerView');
		var sortableCol = $L('.lyteSchedulerViewMainTable tbody',this.$node);
		if( (view == 'week'|| view == 'day') && this.getData('ltPropMultiUserView') ){
			if(this.getData('ltPropSortUser')){
				sortableCol.sortable({
					onDragStart:function(){
					},helper: function(elem){
						var table_td = elem.querySelector('.UserCol lyte-scheduler-user');
						var clone_tr = document.createElement('lyte-tr');
						var clone_td  = document.createElement('lyte-td');
						clone_td.appendChild(table_td.cloneNode(true));
						clone_tr.appendChild(clone_td);
						clone_tr.appendChild(document.createElement('lyte-td'));
						return clone_tr;
					},onBeforeDrop: function( dragElem , bellowElem , placeholder, from, to, soruce ){
						var table_tr = soruce.querySelectorAll('tr');
						dragElem.remove();
						bellowElem.parentNode.insertBefore(table_tr[from],bellowElem.nextSibling);
					},onDrop : function(dragElem){
						dragElem.remove();
					},placeholder : "lyteSchdeulerPlaceholder",
					threshold: '10'
				});
			}else {
				if(sortableCol[0]){
					sortableCol.sortable("destroy");
				}
			}
		}
	}.observes('ltPropSortUser').on('didConnect'),
	ChangeWeekOrder : function(){
		var start_day = this.getData('ltPropWeekStart');
		if(start_day){
			var dayLabel = this.getData('ltPropLabel');
			var split = dayLabel.slice(start_day);
			dayLabel = split.concat( dayLabel.slice(0,start_day));
			this.setData('label',dayLabel);
			var dayfullform = this.getData('days');
			split = dayfullform.slice(start_day);
			dayfullform = split.concat( dayfullform.slice(0,start_day));
			this.setData('labelFF',dayfullform);
		}
		
	}.observes('ltPropWeekStart').on('init'),
	changeEvent : function(){
		var eventManipulator = new _lyteUiUtils.eventManipulator( this.getData('ltPropFormat') );
		eventManipulator.addEvents( this.data.ltPropEvent );
		this.ResetTimeLine();
		this.setData('ltPropManipulatedEvent',eventManipulator.events);
	}.observes('ltPropEvent.[]').on('init'),
	schedulerView : function(){
		var date = null;
		var view = this.getData('ltPropSchedulerView');
		if(this.moveToDay && view == 'day'){
			date = this.moveToDay;
			this.callCurrentView(date , false ,this.getData('ltPropWeekStart'));
		}else{
			this.callCurrentView(null , !this.$node.rendered ,this.getData('ltPropWeekStart'));
		}	
		var startView;
		if(view == 'month'){
			var current_date = this.getData('ltPropCurrentDate');
			var date;
			if(current_date.getMonth() == this.data.ltPropCurrMonth && this.data.ltPropDisplayYear == current_date.getFullYear()){
				date = new Date( current_date.toString() );
			}else{
				date =  new Date(this.data.ltPropDisplayYear,this.data.ltPropCurrMonth,1);
			}
			startView = $L.moment(date);
		}else{
			startView = $L.moment(this.getData('startDateOfView'),'DD-MM-YYYY')
		}
		if(this.getMethods('onViewChange')){
			this.executeMethod('onViewChange',startView,this.getData('ltPropSchedulerView'));
		}
		this.$node.rendered = true;
		this.addScroll();
		this.destoryEventResize();
		this.toggleEventResize();
	}.observes('ltPropSchedulerView'),
	toggleMultiUserView : function(){
		this.callCurrentView(undefined,undefined,this.getData('ltPropWeekStart'));
		this.addScroll();
	}.observes('ltPropMultiUserView'),
	changeCurrentDate : function(){
		this.callCurrentView(null , !this.$node.rendered ,this.getData('ltPropWeekStart'));
	}.observes('ltPropCurrentDate'),
	callDragDrop : function(){
		this.addDragAndDrop();
	}.observes('ltPropDraggable').on('didConnect'),
	addSchedulerEvent: function(){
		var view = this.getData('ltPropSchedulerView');
		var date = undefined;
		if(view == 'month'){
			date  =  new Date(this.getData('ltPropDisplayYear'),this.getData('ltPropCurrMonth'),1);
		}
		this.callCurrentView(date,undefined,this.getData('ltPropWeekStart'));
		this.addDragAndDrop();
	}.observes('ltPropManipulatedEvent'),
	onWorkingViewChange : function(){
		this.ResetTimeLine();
		this.callCurrentView(null , !this.$node.rendered ,this.getData('ltPropWeekStart'));
	}.observes('ltPropWorkingDayOnly'),
	findWeekoftheYear  : function(now){
		const onejan = new Date(now.getFullYear(), 0, 1);
		var week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1 ) / 7);
		if(week == 53){
			var lastdate = new Date(now.getFullYear(),11,31);
			if(lastdate.getDay() != 6){
				week = 1;
			}			
		}
		return week;
	},
	findActiveKeys : function(startDate){
		// var startDate = $L.moment(this.getData('startDateOfView'),'DD-MM-YYYY');
		var today_btn = $L('.schedulerToday',this.$node)[0];
		var today = $L.moment(new Date());
		if(today_btn.getData('ltPropDisabled')){
			today_btn.classList.add('lyteSchedulerActiveBtn');
			$L('.lyteSchedulerNavRight')[0].classList.remove('lyteSchedulerActiveBtn');
			$L('.lyteSchedulerNavLeft')[0].classList.remove('lyteSchedulerActiveBtn');
		}else if(today.fromNow(startDate).past){
			today_btn.classList.remove('lyteSchedulerActiveBtn');
			$L('.lyteSchedulerNavRight')[0].classList.remove('lyteSchedulerActiveBtn');
			$L('.lyteSchedulerNavLeft')[0].classList.add('lyteSchedulerActiveBtn');
		}else{
			today_btn.classList.remove('lyteSchedulerActiveBtn');
			$L('.lyteSchedulerNavLeft')[0].classList.remove('lyteSchedulerActiveBtn');
			$L('.lyteSchedulerNavRight')[0].classList.add('lyteSchedulerActiveBtn');
		}
	},
	schedulerNav : function(event){

		var schedulerView =  this.getData('ltPropSchedulerView');	
		this._navigated = true;	
		var weekStart = this.getData('ltPropWeekStart');
		weekStart = weekStart === undefined ? 0 : weekStart;
		var _this = this;
		var isMultiView = this.getData('ltPropMultiUserView');
		switch(schedulerView){
			case 'month':
				if(event.target.classList.contains('lyteSchedulerNavLeft')){
					var displayMonth = this.data.ltPropCurrMonth - 1;
				}else{
					var displayMonth = this.data.ltPropCurrMonth + 1;
				}
				var date = new Date(this.data.ltPropDisplayYear,displayMonth);
				this.setData('startDateOfView',$L.moment(date).format('DD-MM-YYYY'));
				this.monthView($L.moment(date).getDObj());
				if(displayMonth ===  $L.moment(this.getData('ltPropCurrentDate')).getDObj().getMonth() && this.data.ltPropDisplayYear ===  $L.moment(this.getData('ltPropCurrentDate')).getDObj().getFullYear()){
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',true);
				}else{
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false);
				}
				break;
			case 'week':
				var start_date = this.getData('ltPropDateArray')[0].date;
				var date =  new Date(this.data.ltPropDisplayYear,this.data.ltPropCurrMonth,start_date);
				var dayCount = this.data.ltPropWorkingDayOnly ? 7 : 7;
				if(event.target.classList.contains('lyteSchedulerNavLeft')){
					date.setDate(date.getDate()-dayCount);
				}else{
					date.setDate(date.getDate()+dayCount);
				}
				if(this.findWeekoftheYear(date) == this.findWeekoftheYear($L.moment(this.getData('ltPropCurrentDate')).getDObj())){
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',true);	
				}else{
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false);
				}
				this.weekView($L.moment(date).getDObj(),this.getData('ltPropWeekStart'));
				break;
			case 'day':
				if(isMultiView){
					var events = $L('lyte-scheduler-event-tag');
					for(var index =0 ;index < events.length;index++){
						events[index].remove();
					}
				}
				var curr_date = $L.moment(this.getData('startDateOfView'),'DD-MM-YYYY').getDObj();
				var date =  new Date(curr_date.getFullYear(),curr_date.getMonth(),curr_date.getDate());
				if(event.target.classList.contains('lyteSchedulerNavLeft')){
					date.setDate(date.getDate()-1);
				}else{
					date.setDate(date.getDate()+1);
				}
				if($L.moment(date).format('DD-MM-YYYY') ===  $L.moment(this.getData('ltPropCurrentDate')).format('DD-MM-YYYY')){
					this._navigated = false;
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',true);
				}else{
					this._navigated = true;
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false);
				}
				this.ResetTimeLine();
				var start_date = $L.moment(date);
				this.setCurrentTimeLine(start_date)
				start_date = start_date.getDObj();
				this.dayView(start_date);
				this.setData('startDateOfView',$L.moment(date).format('DD-MM-YYYY'));
				break;
		}
		this.findActiveKeys($L.moment(date));
		this.setData( 'ltdisplayCurrDate', date.getDate() + ' ' + _lyteUiUtils.i18n(this.data.month[ date.getMonth() ])  );
		this.setData('ltPropCurDay',_lyteUiUtils.i18n(this.data.days[date.getDay()]));
		$L.fastdom.mutate(function(){
			_this.addDragAndDrop();
			_this.destoryEventResize();
			_this.toggleEventResize();
		})
		if(this.getMethods('onNavClick')){
			this.executeMethod('onNavClick',$L.moment(date));
		}
	},
	generateTimeLine : function() {
		var timeLine = this.$node.getData('ltPropTimeLine');
		var timelineArray = [];
		var index = 0;
		var mins = 60 - timeLine;
		timelineArray[index++] = 0; 
		while(mins){
			timelineArray[index] =  timelineArray[ index - 1 ] + timeLine;
			mins -= timeLine;		
			index++;
			
		}
		this.setData('timelineArray',timelineArray);
	},	
	callCurrentView : function( date , init , weekStart){
		var schedulerView = this.getData('ltPropSchedulerView');
		var _this = this;
		weekStart = weekStart === undefined ? 0 : weekStart;
		var isMultiView = this.getData('ltPropMultiUserView');
		var AllDayMaxEvent = this.getData('ltPropMaxAllDayEvent');
		var TimelineMaxEvent;
		if(this.getData('ltPropTimelineNmore')){
			TimelineMaxEvent = this.getData('ltPropMaxTimelineEvent')
		}else{
			TimelineMaxEvent = Infinity;
		}
		
		var format = this.getData('ltPropFormat');
		var eventManipulator = new _lyteUiUtils.eventManipulator( format );
		var businessDays = this.getData('ltPropBusinessDays');
		var isWorkingOnly = this.getData('ltPropWorkingDayOnly');
		var popover = $L('#calendarPopover',this.$node)[0];
		switch(schedulerView){
			case 'month':
				if( this._navigated && this.data.startDateOfView){
					var start_date = $L.moment( this.data.startDateOfView,'DD-MM-YYYY');
					date = date ? date :  new Date(start_date.format('YYYY'),start_date.format('MM') - 1,start_date.format('DD'));
				}else if( !date ){
					date = this.getData('ltPropCurrentDate');
				}
				if(popover.component.actualModalDiv){
					this.setData('selectionType','month');
					var calendar = $L('lyte-calendar',popover.component.actualModalDiv)[0];
					$L('lyte-calendar',popover.component.actualModalDiv)[0].setData('ltPropSelectionType','month');
					if(calendar.getAttribute('view-type') == 'dateView'){
						$L('.lyteDrillCalHeaderButton',popover.component.actualModalDiv)[0].click();
					}
				}else{
					this.setData('selectionType','month');
				}
				
				this.setData('todayButton','thisMonth');
				var eventManipulator = new _lyteUiUtils.eventManipulator( format );
				if(isMultiView){
					var event = eventManipulator.generateEventObjArrNmore( this.getData('ltPropManipulatedEvent'), format, schedulerView,  weekStart , isMultiView ,AllDayMaxEvent);
				}else{	
					var event = eventManipulator.generateEventObjArr( this.getData('ltPropManipulatedEvent'), format, schedulerView,  weekStart , isMultiView , AllDayMaxEvent);
				}
				
				this.setData('ltPropProcessedData',event.eventObj);
				this.setData('hiddenObj',event.hiddenObj);
				this.monthView($L.moment( date,'DD-MM-YYYY').getDObj() );
				break;
			case 'week':
				if(isMultiView){
					var event = eventManipulator.generateEventObjArr( this.getData('ltPropManipulatedEvent'), format, schedulerView,  weekStart , isMultiView ,AllDayMaxEvent,businessDays,isWorkingOnly);
				}else{	
					var event = eventManipulator.generateEventObjArrNmore( this.getData('ltPropManipulatedEvent'), format, schedulerView,  weekStart , isMultiView , AllDayMaxEvent ,TimelineMaxEvent, businessDays, isWorkingOnly);
				}
				
				if( this._navigated && this.data.startDateOfView){
					var start_date = $L.moment( this.data.startDateOfView,'DD-MM-YYYY');
					date = date ? date :  new Date(start_date.format('YYYY'),start_date.format('MM') - 1,start_date.format('DD'));
				}else if( !date ){
					date = this.getData('ltPropCurrentDate');
				}
				this.setData('ltPropProcessedData',event.eventObj);
				this.setData('hiddenObj',event.hiddenObj);
				this.weekView($L.moment( date,'DD-MM-YYYY').getDObj(),weekStart);
				if(this.getData('ltPropWeekStart') !== undefined){
					this.setData('selectionType','week');
				}else{
					this.setData('selectionType','day');
				}
				this.setData('todayButton','thisWeek');
				break;
			case 'day':	
				if( this._navigated && this.data.startDateOfView){
					var start_date = $L.moment( this.data.startDateOfView,'DD-MM-YYYY');
					date = date ? date :  new Date(start_date.format('YYYY'),start_date.format('MM') - 1,start_date.format('DD'));
				}else if( !date ){
					date = this.getData('ltPropCurrentDate');
				}
				if(!this.getData('ltPropMultiUserView')){
					var event = eventManipulator.generateEventObjArr( this.getData('ltPropManipulatedEvent'), format, schedulerView,  weekStart , isMultiView ,AllDayMaxEvent);
				}else{	
					var event = eventManipulator.generateEventObjArrNmore( this.getData('ltPropManipulatedEvent'), format, schedulerView,  weekStart , isMultiView ,AllDayMaxEvent,TimelineMaxEvent);
				}
				this.MultiDayViewNav();
				this.setCurrentTimeLine($L.moment( date ).getDObj());
				this.setData('ltPropProcessedData',event.eventObj);
				this.setData('hiddenObj',event.hiddenObj);
				this.dayView($L.moment( date ).getDObj());
				this.setData('startDateOfView',$L.moment( date ).format('DD-MM-YYYY'));
				this.setData('selectionType','day');
				this.setData('todayButton',_lyteUiUtils.i18n('today'));
				break;
		}
		if(!init){
			this.isToday(new Date());
		}
		var isToday = $L('.schedulerToday',this.$node)[0].getData('ltPropDisabled');
		date = (init ||isToday ) ? new Date() : $L.moment(this.data.startDateOfView,'DD-MM-YYYY').getDObj();
		if(schedulerView ==  'month' && !(init ||isToday ) ){
			date.setMonth(this.data.ltPropCurrMonth);
			date.setDate(1);
			date.setYear(this.data.ltPropDisplayYear)
		}
		this.setData('ltdisplayCurrDate',date.getDate() + ' ' + _lyteUiUtils.i18n(this.data.month[date.getMonth()]) + ' ' + date.getFullYear());
		this.setData('ltPropCurDay',_lyteUiUtils.i18n(this.data.days[date.getDay()]));
		$L.fastdom.mutate(function(){
			_this.addDragAndDrop();
		})
	},
	isToday : function(date){
		var view = this.getData('ltPropSchedulerView');
		var dateArray = this.getData('ltPropDateArray');
		var startDate;
		var end_date;
		if(view == 'month'){
			startDate = dateArray[0][0].val;
			if(startDate.get('date') !== 1){
				startDate.startOf('month');
				startDate.add(1,'month');
			}
			end_date = dateArray[dateArray.length - 1][6].val;
		}else if(view == 'week'){
			startDate = dateArray[0].val;
			end_date = dateArray[dateArray.length-1].val;
		}else{
			startDate = $L.moment(this.getData('startDateOfView'),'DD-MM-YYYY');
			end_date = $L.moment(this.getData('startDateOfView'),'DD-MM-YYYY');
		}
		if(this.isDateEqual(startDate.getDObj()) || (!startDate.fromNow($L.moment(date)).past && end_date.fromNow($L.moment(date)).past) || this.isDateEqual(end_date.getDObj())){
			$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',true)
		 }else{
			$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false)
		 }
	},
	monthView : function(date){
		var date = date || new Date();
		var displayHead = date.getMonth();
		this.setData('ltPropCurrMonth', displayHead);
		this.setData('ltdisplayHead',this.data.month[displayHead] +  ' ' + date.getFullYear());
		this.setData('ltPropDisplayYear', date.getFullYear());
		this.generateMonth(new Date(date.getFullYear(), date.getMonth(), 1));
	},
	generateMonth : function(startOfMonth){
		var result=[];
		var current_month = startOfMonth.getMonth();
		var eventArr  = this.getData('ltPropProcessedData');
		var businessDay = this.getData('ltPropBusinessDays');
		var date = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), 1); 
		var weekstart = this.getData('ltPropWeekStart') === undefined ? 0 : this.getData('ltPropWeekStart');
		var cur_Month = date.getMonth();
		var start_diff = date.getDay()  - weekstart ;
		if( date.getDay() > weekstart ){
			date.setDate(date.getDate() - (start_diff));
		}else{
			date.setDate(date.getDate() - ((7 + start_diff) % 7));
		}
		for(var row = 0 ; row < 6; row++ ){
			var week = new Array(7);
			for(index = 0 ; index < 7 ; index++){
				var year = date.getFullYear();
				var month = ( date.getMonth() + 1 );
				var curr_date = ('0' + date.getDate()).slice(-2) + '-' + ('0' + month).slice(-2) + '-' + year;

				var is_business = businessDay.includes(date.getDay()) ? 'lyteSchedulerBusinessDay' : 'lyteSchedulerNonBusinessDay' ;
				week[ index ] = {'val' : $L.moment(curr_date,'DD-MM-YYYY') ,'date' : date.getDate(), 'buisness' : is_business,'events' : eventArr[curr_date] , 'currentDate' : this.isDateEqual( curr_date ),'month' :month-1,'year': year};
				if(current_month == date.getMonth()){
					week[index].current_month = true;
				}
				date.setDate( date.getDate() + 1 );
			}
			result.push( week );
			if(cur_Month != date.getMonth()){
				break;
			}
		}
		var startDate = result[0][0].val;
		this.setData('startDateOfView',startDate.format('DD-MM-YYYY'));
		startDate = startDate.getDObj(); 
		var _this = this;
		$L.fastdom.mutate( function(){
			_this.setDisplayDate($L("scheduler-start-date",this.$node)[0],startOfMonth);
		});
		this.setData('ltPropDateArray', result);
	},
	weekView : function(date , weekStart){
		weekStart = weekStart ? weekStart : 0;
		var date = date || new Date();
		this.generateWeek(date, weekStart);
		if(!this.getData('ltPropMultiUserView')){
			var _this = this;
			setTimeout(function(){
				var allDayline = $L('.lyteSchedulerAllDayHighlight',_this.$node)[0];
				var alldayth = $L('.lyteSchedulerSingleUserAllDay',_this.$node)[0];
				if(allDayline && alldayth){
					allDayline.style.top =  alldayth.getBoundingClientRect().bottom - allDayline.offsetParent.getBoundingClientRect().top - 1 + 'px';
					allDayline.style.right = _lyteUiUtils.getScrollBarWidth() + 'px';
				}
			},10)
		}
	},
	generateWeek : function( date , weekStart ){
		var startofWeek = new Date(date.getFullYear(),date.getMonth(), date.getDate() );
		var start_diff = date.getDay()  - weekStart  ;
		var isWorkingOnly = this.getData('ltPropWorkingDayOnly');
		if( date.getDay() > weekStart ){
			startofWeek.setDate(startofWeek.getDate() - (start_diff));
		}else{
			startofWeek.setDate(startofWeek.getDate() - ((7 + start_diff) % 7));
		}
		var result = [];
		var businessDay = this.getData('ltPropBusinessDays');

		var eventArr  = this.getData('ltPropProcessedData');
		var nxt_date = new Date(startofWeek);
		
		var count = 7;
		for ( var index = 0; index < count; index++ ) {
			var year = nxt_date.getFullYear();
			var month = ( nxt_date.getMonth() + 1 );
			var curr_date = ('0' + nxt_date.getDate()).slice(-2) + '-' + ('0' + month).slice(-2) + '-' + year;
			if(isWorkingOnly && !businessDay.includes(nxt_date.getDay())){
				nxt_date.setDate(nxt_date.getDate()+1);
				count--;
				index--;
				continue;
			}
			var is_business = businessDay.includes(nxt_date.getDay()) ? 'lyteSchedulerBusinessDay' : 'lyteSchedulerNonBusinessDay' ;
			result[index] = {'val' : $L.moment(curr_date,'DD-MM-YYYY') ,'date' : nxt_date.getDate(),'month' : nxt_date.getMonth(),'day' : nxt_date.getDay(),'buisness': is_business,'events' : eventArr[curr_date], 'currentDate' : this.isDateEqual(curr_date)};
			if(eventArr.allDay && eventArr.allDay[curr_date]){
				result[index].allDay = eventArr.allDay[curr_date];
			}
			nxt_date.setDate(nxt_date.getDate()+1);
		}
		startofWeek = new Date(result[0].val.getDObj().toString());
		var lastofweek = nxt_date.setDate(nxt_date.getDate()-1);
		this.setData('ltPropCurrMonth',startofWeek.getMonth());
		this.setData('ltPropDisplayYear', startofWeek.getFullYear());
		this.setData('startDateOfView',result[0].val.format('DD-MM-YYYY'));
		var _this = this;
		$L.fastdom.mutate( function(){
			var startofWeek = $L.moment(_this.getData('startDateOfView'),'DD-MM-YYYY').getDObj();
			_this.setDisplayDate($L("scheduler-start-date",this.$node)[0],startofWeek);
			_this.setDisplayDate($L("scheduler-end-date",this.$node)[0],result[result.length-1].val.getDObj());
		});	
		startofWeek = new Date( startofWeek.setDate(startofWeek.getDate() + 6) );
		this.setData('ltPropDateArray',result);
	},
	generateTimeLine : function() {
		var timeLine = this.$node.getData('ltPropTimeLine');
		var timelineArray = [];
		var index = 0;
		var mins = 60 - timeLine;
		timelineArray[index++] = 0; 
		while(mins){
			timelineArray[index] =  timelineArray[ index - 1 ] + timeLine;
			mins -= timeLine;		
			index++;
			
		}
		
		this.$node.setData('timelineArray',timelineArray);
	},
	MultiDayViewNav : function(){
		var scrollLeftNav = this.$node.querySelector('.lyteSchedulerLeftNav');
		var fixedCol = this.$node.querySelector('.lyteSchedulerFixedCol');
		if(scrollLeftNav){
			scrollLeftNav.style.left = fixedCol.offsetWidth + 'px';
			scrollLeftNav.classList.add('lyteSchedulerhideScrollNav');
			var scrollRightNav = this.$node.querySelector('.lyteSchedulerRightNav');
			var scrollDiv = this.$node.querySelector('.lyteSchedulerViewWrapper');
			var _this = this;
			scrollDiv.addEventListener('scroll',function(event){
				
				var MaxScrollWidth = this.scrollWidth - this.offsetWidth;
				if(this.scrollLeft == 0){
					scrollLeftNav.classList.add('lyteSchedulerhideScrollNav');
				}
				if(this.scrollLeft !== 0){
					scrollLeftNav.classList.remove('lyteSchedulerhideScrollNav');
				}
				if(this.scrollLeft == MaxScrollWidth){
					scrollRightNav.classList.add('lyteSchedulerhideScrollNav');
				}
				if(this.scrollLeft !== MaxScrollWidth){
					scrollRightNav.classList.remove('lyteSchedulerhideScrollNav');
				}
			});
		}
		var schedulerEventDiv = $L('scheduler-event-div');
	}, 
	showCurrentTimeObserver: function(){
		this.setCurrentTimeLine(this.getData('ltPropCurrentDate'));
	}.observes('ltPropShowCurrentTime'),
	ResetTimeLine : function(){
		var allDay = $L('.lyteSchedulerAllDayEvent .scheduler-event-div');
		for(var index = 0; index < allDay.length;index++){
			var div = allDay[index];
			if(div){
				div.style.height = '0px';
			}
		}
		var timeline = $L('.lyteSchedulerMultiUserViewEventElem',this.$node);
		for(var index = 0 ; index < timeline.length ; index++){
			timeline[index].style.height = '0px';
		}
	},
	dayView : function(date){
		var date =  date || new Date();
		this.generateDay(date);
		var _this = this;
		if(!this.getData('ltPropMultiUserView')){
			setTimeout(function(){
				var allDayline = $L('.lyteSchedulerAllDayHighlight',_this.$node)[0];
				var alldayth = $L('.lyteSchedulerSingleUserAllDay',_this.$node)[1];
				if(allDayline && alldayth){
					allDayline.style.top =  alldayth.getBoundingClientRect().bottom - allDayline.offsetParent.getBoundingClientRect().top + 'px';
					allDayline.style.right = _lyteUiUtils.getScrollBarWidth() + 'px';
				}
			},10)
		}else{	
			var allDayline = $L('.lyteSchedulerAllDayHighlight',this.$node)[0];
			var fixedTh = $L('.lyteSchedulerAllDayTh',this.$node)[0];
			var fixedHeaderCs = window.getComputedStyle(fixedTh)
			if(allDayline && fixedTh && $L('.lyteSchedulerAllDayEvent',this.$node)[0]){
				allDayline.style.left = fixedTh.getBoundingClientRect().left - allDayline.offsetParent.getBoundingClientRect().left + 'px';
				allDayline.style.width = $L('.lyteSchedulerAllDayEvent',this.$node)[0].offsetWidth - parseInt(fixedHeaderCs.borderRight) + 'px';
				allDayline.style.bottom = _lyteUiUtils.getScrollBarWidth() + 'px';
			}			
		}
	},
	generateDay :function(date){
		this.setData('ltPropDisplayYear',date.getFullYear());
		var Day = this.data.days[date.getDay()];
		this.setData('currDay',Day);
		var events = this.getData('ltPropProcessedData');
		var month = date.getMonth()+1;
		var curr_date = ('0' + date.getDate()).slice(-2) + '-' + ('0' + month).slice(-2) + '-' + date.getFullYear();
		var _this = this;
		if(this.getData('ltPropMultiUserView')){
			var array = {};
			array =  events[curr_date] || {};
			if(events.allDay && events.allDay[curr_date]){
				array.allDay = events.allDay[curr_date];
			}
			this.setData('ltPropDateObj',array);
		}else{
			var array = [];
			array =  events[curr_date] || [];
			this.setData('ltPropDateArray',array);
		}
		$L.fastdom.mutate( function(){
			_this.setDisplayDate($L("scheduler-start-date",$L(_this.$node).closest('lyte-scheduler')[0])[0],date);
		});

		$L('.lyteSchedulerDate').addClass(this.isDateEqual(curr_date) ? 'lyteSchedulerCurrDate' : '');
	},
	setCurrentTimeLine : function(date){
		if(this.getData('ltPropShowCurrentTime')){
			if($L.moment(date).format('DD-MM-YYYY') ===  $L.moment(this.getData('ltPropCurrentDate')).format('DD-MM-YYYY') ){
				this._navigated = false;
				if($L('.lyteschedulerCurrentTimeLine',this.$node)[0]){
					$L('.lyteschedulerCurrentTimeLine',this.$node)[0].style.display = 'flex';
					var currentLine = $L('.lyteschedulerCurrentTimeLine',this.$node)[0];
					if(this.currentTimeout){
						clearTimeout(this.currentTimeout);
					}
					if(currentLine){
						var current_Time = $L.moment(new Date());
						var min = current_Time.get('minutes');
						var Div_min = this.getData('ltPropTimeLine') * parseInt((min/this.getData('ltPropTimeLine')));
						var timeformat  = '[data-time="' + current_Time.format('hh:') + ('0' + Div_min).slice(-2) + ' ' +  current_Time.format('A') +  '"]';
						var div = $L(timeformat,this.$node)[0];
						currentLine.style.top =  div.getBoundingClientRect().top - currentLine.offsetParent.getBoundingClientRect().top + (div.offsetHeight/this.getData('ltPropTimeLine')) * (min - Div_min)  + 'px';
						if($L('.lyteSchedulerCurrentTime',this.$node)[0]){
							$L('.lyteSchedulerCurrentTime',this.$node)[0].remove();
						} 
						if(this.getData('ltPropContinentalTimeFormat')){
							currentLine.insertBefore(this.createTextNode(current_Time.format('HH:mm'),'lyteSchedulerCurrentTime'),currentLine.firstChild)
						}else{
							currentLine.insertBefore(this.createTextNode(current_Time.format('hh:mm') + ' ' + _lyteUiUtils.i18n(current_Time.format('A')),'lyteSchedulerCurrentTime'),currentLine.firstChild)
						}
						var _this = this;
						this.currentTimeout = setTimeout(function(){
							_this.removeCurrentTimeline();
							_this.setCurrentTimeLine($L.moment(_this.getData('startDateOfView'),"DD-MM-YYYY"));
						},(60 - parseInt(current_Time.get('seconds')))*1000)
					}
				}
			}else{
				if(this.currentTimeout){
					clearTimeout(this.currentTimeout);
				}
				if($L('.schedulerToday',this.$node).length){
					$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false)
				}
				this.removeCurrentTimeline();
			}
			
		}else{
			if(this.currentTimeout){
				clearTimeout(this.currentTimeout);
			}
			this.removeCurrentTimeline();
		}	
		
	},
	removeCurrentTimeline : function(){
		if($L('.lyteschedulerCurrentTimeLine',this.$node)[0]){
			$L('.lyteschedulerCurrentTimeLine',this.$node)[0].style.display = 'none';
			if($L('.lyteSchedulerCurrentTime',this.$node)[0]){
				$L('.lyteSchedulerCurrentTime',this.$node)[0].remove();
			} 
		}
	},
	isDateEqual : function( date ){
		var curr_date = this.getData( 'ltPropCurrentDate' );
		date = $L.moment( date , 'DD-MM-YYYY' ).getDObj();
		return curr_date.getDate() === date.getDate() && curr_date.getMonth() === date.getMonth() && curr_date.getFullYear() === date.getFullYear();
	},
	getTimediff : function(start,end){
		var timeDiff =  $L.moment(end,this.getData('ltPropFormat')).fromNow($L.moment(start,this.getData('ltPropFormat')));
		if(timeDiff.hours){
			timeDiff = timeDiff.hours.value * 60;
		}else{
			timeDiff = timeDiff.value;
		}
		return timeDiff;
	},
	findEndDate : function(newStartDate,eventData){
		var diff = this.getTimediff(eventData.start,eventData.end);
		return $L.moment( newStartDate.getDObj().toString() ).add(diff,'minutes');
	},
	addDragAndDrop: function(){
		if(!this.getData('ltPropDraggable')){
			return;
		}
		var _this = this;
		var  allDayEvent = false;
		var diff = 0,first = true;
		var total_length;
		var returnval = true;
		var isMultiView  = this.getData('ltPropMultiUserView');
		var view = this.getData('ltPropSchedulerView');
		var userdata_width = $L('.lyteSchedulerFixedCol').length && $L('.lyteSchedulerFixedCol')[0].offsetWidth;
		var _eventData;
		var width;
		var _animationFrame;
		var _eventList = this.getData('ltPropEvent');
		var prevScrollTop;
		var timelineInterval = this.getData('ltPropTimeLine');
		if(!isMultiView){
			var header_height = _this.$node.querySelector('.lyteSchedulerViewMainTable thead') ;
			header_height = header_height ? header_height.offsetHeight : _this.$node.querySelector('.lyteSchedulerDayViewAllDayRow').offsetHeight;
		}
		if((view == 'week' || view == 'day') && !isMultiView){
			var height = this.$node.querySelector("[data-time='12:00 AM']").getBoundingClientRect().height / 4;
			var scrollDiv =  this.$node.querySelector(".lyteSchedulerViewWrapper");
			if($L('.lyteSchedulerDate')[0]){
				width = $L('.lyteSchedulerDate')[0].offsetWidth;
			}
			var MaxScrollHeight =  scrollDiv.scrollHeight - (scrollDiv.offsetHeight );
 			var first_tdWidth =  scrollDiv.querySelector('td').getBoundingClientRect().width;
 		}else if(view == 'day'){
 			var height = $L('.lyteSchedulerTimeLineEvent')[0].offsetHeight;
 			var scrollDiv =  this.$node.querySelector(".lyteSchedulerViewWrapper");
 			width = $L('.lyteSchedulerTimeLineEvent')[0].offsetWidth / (60/this.getData('ltPropTimeLine'));
 			var MaxScrollWidth =  scrollDiv.scrollWidth - ( scrollDiv.offsetWidth );
 		}	
		var scrollAnimation = function(scrollDiv,element,MaxScrollHeight,event,height){
			var scrollTop = scrollDiv.scrollTop;
			element.style.left = offsetLeft + 'px';
        	element.style.top = offsetTop  + 'px';
			var timelineBOttom = $L('.lyteSchedulerViewMainTable',this.$node)[0].getBoundingClientRect().bottom;
			var elementOffset = element.getBoundingClientRect();
			var scrollClientRect = scrollDiv.getBoundingClientRect();
			var current_pos = elementOffset.top;
			if(event.clientY >= (scrollClientRect.bottom - 50) && scrollDiv.scrollTop <= MaxScrollHeight){
				scrollDiv.scrollTop += 10;
			}
			if((scrollClientRect.top + header_height - 20 ) >= (event.clientY ) &&  (scrollTop > 0)){
				scrollDiv.scrollTop -= 10;
			}
		
			if( (event.clientY - current_pos) >= height &&  scrollTop <= MaxScrollHeight ){
				if((elementOffset.bottom + height) < timelineBOttom){
					var count = parseInt((event.clientY - current_pos)/height);
					offsetTop = offsetTop + count * height;
					_this.StartDate.add(count * (timelineInterval/4),'minutes')
				}
				prevScrollTop = scrollDiv.scrollTop;
			} 
			if( (current_pos - event.clientY) >= height && scrollTop > 0 && ( elementOffset.top - height ) >= ( scrollClientRect.top + header_height )){
				var count = parseInt((current_pos - event.clientY)/height);
				offsetTop = offsetTop - count * height;
				_this.StartDate.subtract(count * (timelineInterval/4),'minutes')
				prevScrollTop = scrollDiv.scrollTop;
			}
			if(_animationFrame){
				cancelAnimationFrame(_animationFrame);
			}
			_animationFrame = requestAnimationFrame(scrollAnimation.bind(this,scrollDiv,element,MaxScrollHeight,event,height))
		}
		var event_tag = this.$node.querySelectorAll('lyte-scheduler-event-tag');
		event_tag.length && $L(event_tag).draggable({
			restrict : '.lyteSchedulerNoDrag',
			threshold : _this.getData('ltPropDragThershold'),
			cancel : ".lyteSchedulerDragCancel, .lyteSchedulerGrabResize",
			onStart : function(element, event){
				_eventData = $u.findWhere(_eventList,{id: element.dataset.id});
				startTop = event.clientY;
            	startLeft = event.clientX;
				var id =  element.dataset.id;
            	var scheduler = $L(element).closest('lyte-scheduler')[0];
            	var disable_elem = scheduler.querySelectorAll('[data-id ="'+ id +'"]');
            	$L(disable_elem).not(element).addClass('hideSchedulerEvent');
            	offsetTop = element.offsetTop - parseInt(window.getComputedStyle(element).marginTop) - 0.5;
            	offsetLeft = element.offsetLeft;
            	element.style.zIndex = 10000;
				allDayEvent = element.classList.contains('all-day-event') ? true  : false;
				
			},
			onDragStart : function ( element, event) {
            	if(!isMultiView){
					if(!element.parent){
						element.parent = $L(element).closest('td')[0];
						element.style.left = '5px';
						offsetLeft = 5;
					}else{
						element.style.left =  element.offsetParent.getBoundingClientRect().left - element.getBoundingClientRect().left   +"px";
						offsetLeft = element.offsetLeft;
					}
				}else{
					if(!element.parent){
						element.parent = $L(element).closest('tr')[0];
					}
				}
            	if(!isMultiView && !_eventData.allDayEvent ){
            		element.style.right =  '5px';
            	}   
				_this.StartDate = $L.moment(_eventData.start,_this.getData('ltPropFormat'));  
			},
			onDrag : function( element ,dragElem,event ){
				var x = event.clientX,
            		y = event.clientY,
            		elem_offset = element.getBoundingClientRect();
            	if((view == 'week' ||  view == 'day') && !element.classList.contains('lyteSchedulerAllDayEventTag') && !isMultiView){
            		if( (elem_offset.left + elem_offset.width) <= x  &&(elem_offset.left + elem_offset.width ) <= (scrollDiv.getBoundingClientRect().left + scrollDiv.getBoundingClientRect().width) && element.parent.nextElementSibling){
            			offsetLeft = offsetLeft + width ;
            			if(!allDayEvent){
							_this.StartDate.add(1,'date')
            				element.parent = element.parent.nextElementSibling ? element.parent.nextElementSibling : element.parent;
            			}
            		}
            		if( x < (elem_offset.left) && (elem_offset.left ) > (scrollDiv.getBoundingClientRect().left + first_tdWidth) && element.parent.previousElementSibling  ){
            			offsetLeft = offsetLeft - width ;
            			if(!allDayEvent){
							_this.StartDate.subtract(1,'date')
            				element.parent = element.parent.previousElementSibling ? element.parent.previousElementSibling : element.parent;
            			}
            		}
           			if(!allDayEvent){
	            		if( (y - startTop) > height && (element.getBoundingClientRect().bottom + height) < ( scrollDiv.getBoundingClientRect().top + scrollDiv.getBoundingClientRect().height )){
							var count = parseInt((y - startTop)/height);
							_this.StartDate.add((count * (timelineInterval/4)),'minutes')
	            			offsetTop = offsetTop + count * height;
	            			startTop = y;
	            		}

	            		if( (startTop - y) > height && (element.getBoundingClientRect().top - height ) >= ( scrollDiv.getBoundingClientRect().top + header_height )){
							var count =  parseInt((startTop - y)/height);
							_this.StartDate.subtract((count * (timelineInterval/4)),'minutes')
	            			offsetTop = offsetTop - count * height;
	            			startTop = y;
	            		}
	            	}
					if(_animationFrame){
						cancelAnimationFrame(_animationFrame);
					}
					mouseposition = event.clientY - element.getBoundingClientRect().top;
					prevScrollTop = scrollDiv.scrollTop;
					_animationFrame = window.requestAnimationFrame(scrollAnimation.bind(this,scrollDiv,element,MaxScrollHeight,event,height))
					return false;
				}else if(view === 'day' && !element.classList.contains('lyteSchedulerAllDayEventTag')){
					var scrollLeft = scrollDiv.scrollLeft;
					if( (element.parent.getBoundingClientRect().top + element.parent.getBoundingClientRect().height) <= y  && ( element.getBoundingClientRect().top + element.getBoundingClientRect().height + height) < (scrollDiv.getBoundingClientRect().top + scrollDiv.getBoundingClientRect().height)){
            			offsetTop = offsetTop + height ;
            			if(element.parent.nextElementSibling){
            				element.parent = element.parent.nextElementSibling ? element.parent.nextElementSibling : element.parent;
            			}
            		}
            		if( y < (elem_offset.top) && (elem_offset.top - height) > (scrollDiv.getBoundingClientRect().top + element.offsetHeight  ) ){
            			offsetTop = offsetTop - height;
            			if(element.parent.previousElementSibling){
            				element.parent = element.parent.previousElementSibling ? element.parent.previousElementSibling : element.parent;
            			}
            		}
					if( (x - startLeft) > width && (element.getBoundingClientRect().left + element.offsetWidth  ) < (element.parent.getBoundingClientRect().left + element.parent.getBoundingClientRect().width ) ){
						
	            		offsetLeft = offsetLeft + width;
	            		startLeft = x;
	            	}
	            	if( (startLeft - x) > width   && ( element.getBoundingClientRect().left  - width) > (element.parent.getBoundingClientRect().left + userdata_width) ){

	            		
	            		offsetLeft = offsetLeft - width;
	            		startLeft = x;
	            	}
        			if(scrollDiv.getBoundingClientRect().right <= (element.getBoundingClientRect().right) &&  (scrollLeft < MaxScrollWidth)){
        				scrollDiv.scrollLeft += width;
        				if((offsetLeft + element.offsetWidth ) < (element.offsetParent.offsetLeft + element.offsetParent.offsetWidth) ){
        					offsetLeft = offsetLeft + width;
        				}
        			}
        			if((scrollDiv.getBoundingClientRect().left + userdata_width) >= (element.getBoundingClientRect().left) &&  (scrollLeft > 0)){
        				scrollDiv.scrollLeft -= width;
        				
        				if((element.getBoundingClientRect().left  - width) > (element.parent.getBoundingClientRect().left + userdata_width) ){
        					offsetLeft = offsetLeft - width;
        				}
        			}
        			element.style.top = offsetTop + 'px';
	            	element.style.left = offsetLeft + 'px';
					return false;
        		}
				if(_this.getMethods('onDragEvent')){
					_this.executeMethod('onDragEvent',_eventData,_this.StartDate,_this.findEndDate(_this.StartDate,_eventData),_this.$node);
				}
				
			},
			onStop : function(){
				cancelAnimationFrame(_animationFrame);
				return returnval;
			}
		});
	 	var allDayEvent = this.$node.querySelectorAll('.lyteSchedulerAllDayEvent');

		allDayEvent.length && $L(allDayEvent).droppable({
			onLeave : function () {
				var hoverDiv = _this.$node.querySelectorAll('.lyteSchedulerhoverDate');
				$L(hoverDiv).removeClass('lyteSchedulerhoverDate');
			},
			onDrag : function( draggableElem, droppableElem ){
				var startDate =  draggableElem.parentElement.dataset.date;
				var id =  draggableElem.dataset.id;
				var view = _this.getData('ltPropSchedulerView');
				if(view == 'week' ){
					var curr_row = droppableElem.parentElement;
					var date_div = curr_row.querySelectorAll('.lyteSchedulerAllDayEvent');
				}else{
					var date_div = _this.$node.querySelectorAll('.lyteSchedulerAllDayEvent');
				}	
				var events = _this.data.ltPropManipulatedEvent;
				var event =  $u.findWhere(events,{'id': id});
				var org_start = (event.start.split(' '))[0];
				
				if(event ){
					
					var drop_pos = _this.getEventInterval(date_div[0].children[0].dataset.date,droppableElem.children[0].dataset.date);
					if((org_start !== startDate) && first){
						diff =  _this.getEventInterval((event.start.split(' '))[0] , startDate);
						first = false;
					}
					total_length = _this.getEventInterval(event.start,event.end);	
					for(var index = diff ; index >= 0; index--){
						if(date_div[ drop_pos - index ]){
							date_div[ drop_pos - index ].classList.add('lyteSchedulerhoverDate');
						}
					}

					for(var index = 0; index < ( ( total_length + 1 ) - diff)  ; index++){
						if(date_div[ drop_pos + index ]){
							date_div[ drop_pos + index ].classList.add('lyteSchedulerhoverDate');
						}
					}
				}
				return true;
			},
			onDrop : function( draggedElem, droppableElem ){
				
				var date_div = _this.$node.querySelectorAll('.lyteSchedulerDropPlaceholder');
				$L(date_div).removeClass('lyteSchedulerDropPlaceholder');
				var user = droppableElem.parentElement.dataset.userid;
				var format = (_this.getData('ltPropFormat').split(' '))[0];
				var start_date = $L.moment(droppableElem.children[0].dataset.date,format).subtract((( diff - 1 ) >= 0 ? diff : 0),'date',true);

				var end_date = $L.moment(start_date.format('DD-MM-YYYY'),format).modify(( total_length ),'date',true);
				var events  = _this.getData('ltPropManipulatedEvent');
				var event_data = $u.findWhere(events,{id: draggedElem.dataset.id});
				var orginalStart =  $L.moment(event_data.start,_this.data.ltPropFormat);
				var originEnd =  $L.moment(event_data.end,_this.data.ltPropFormat);
				start_date.set('hours',orginalStart.get('hours'));
				start_date.set('minutes',orginalStart.get('minutes'));
				end_date.set('hours',originEnd.get('hours'));
				end_date.set('minutes',originEnd.get('minutes'));
				if(_this.getMethods('onDropEvent')){
					returnVal = _this.executeMethod('onDropEvent',event_data,start_date,end_date,user);
				}
				return returnVal;

			},
			tolerance :"touch"
		});
		
		var timeLineEvent = this.$node.querySelectorAll('.lyteSchedulerTimeLineEvent');
		if( timeLineEvent.length ){

 			$L(timeLineEvent).droppable({
				onDrop : function(draggedElem,droppableElem){
					if(draggedElem.classList.contains('all-day-event')){
						return;	
					}
					var start_time ;
					var end_time;
					if(!isMultiView){
						var events  = _this.getData('ltPropManipulatedEvent');
						var event_data = $u.findWhere(events,{id: draggedElem.dataset.id});
						var start_date = draggedElem.parent.children[0].dataset.date;	
						start_time = droppableElem.dataset.time;
						if(start_time){
							start_time = _this.StartDate;
							var timeDiff = _this.getTimediff(event_data.start,event_data.end);
							if(( timeDiff ) ){
								var date = $L.moment(start_time.format(_this.getData('ltPropFormat')),_this.getData('ltPropFormat')).add( timeDiff,'minutes',true);
								end_time = date;
							}
						}
					}else{
						var user = draggedElem.parent.dataset.userid;
						var start_date = _this.getData('startDateOfView');
						start_time = droppableElem.children[0].dataset.time;
						var time_division = 60 / _this.getData('ltPropTimeLine');
						if(start_time){

							var interval = Math.round( draggedElem.offsetWidth / ( droppableElem.offsetWidth / time_division ) );
							var date = start_date + ' ' + start_time;
							date = $L.moment(date,_this.getData('ltPropFormat'));
							start_time = $L.moment(start_date + ' ' + start_time,_this.getData('ltPropFormat'));
							
							var start_time_min = parseInt((draggedElem.getBoundingClientRect().left - droppableElem.getBoundingClientRect().left) / (droppableElem.offsetWidth / time_division));
							start_time_min *=  _this.getData('ltPropTimeLine');
							if(start_time_min){
								date.add(start_time_min,'minutes',true);
								start_time = $L.moment(date.format(_this.getData('ltPropFormat')),_this.getData('ltPropFormat'));
							}
							if(interval){

								end_time = date.add( ( parseInt(interval)  ) * _this.getData('ltPropTimeLine') ,'minutes',true);
							}
							var events  = _this.getData('ltPropManipulatedEvent');
							var event_data = $u.findWhere(events,{id: draggedElem.dataset.id});
						}


					}
					_this.StartDate = null;
					if(_this.getMethods('onDropEvent')){

						_this.executeMethod('onDropEvent',event_data,start_time,end_time,user);
					}
					return false;
				},
				tolerance :"touch",
				restrict : ".lyteSchedulerEventTimelinetag"
			});
 		}
	},
	getEventInterval: function(start , end){
		var start_date = $L.moment(start.split(' ')[0], this.getData('ltPropFormat').split(' ')[0])._dateObj;
		var end_date = $L.moment(end.split(' ')[0] ,this.getData('ltPropFormat').split(' ')[0])._dateObj;
		var difference = end_date.getTime() - start_date.getTime();
    	var TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
		return TotalDays;
	},
	hide : function(position_elem,event_div){
		if((position_elem.offsetHeight + event_div.getBoundingClientRect().height) >= position_elem.parentElement.offsetHeight){
			event_div.classList.add('schedulerhide');
			event_div.style.top = 0;
			event_div.style.left = 0; 
			return true;
		}
	},
	hideUsers : function( hideuserarray ){
		var userList =  this.getData('ltPropSchedulerUser');
		var table_tr = this.$node('.UserCol');
		hideuserarray.forEach(function(index){
			table_tr[index].classList.add('LyteSchdeulerHideUser');
		});
	},
	setDisplayDate : function( dateDiv, date ,showdate ,popover){
		if(!dateDiv){
			return;
		}
		if( dateDiv.children.length){
		
			while(dateDiv.children.length){
				dateDiv.children[0].remove();
			}		
		}
		var tempMoment = $L.moment(date.toString());
		if(this.getData('ltPropSchedulerView') !== 'month' || showdate){
			dateDiv.appendChild(this.createTextNode(tempMoment.get('date'), 'lyteSchNavigatorDateLabel'));
		}
		if(this.getData('ltPropSchedulerView') == 'month'){
			dateDiv.appendChild(this.createTextNode(_lyteUiUtils.i18n(tempMoment.format('MMMM')), 'lyteSchNavigatorMonthLabel'));
		}else{
			dateDiv.appendChild(this.createTextNode(_lyteUiUtils.i18n(tempMoment.format('MMM')), 'lyteSchNavigatorMonthLabel'));
		}
		dateDiv.appendChild(this.createTextNode(date.getFullYear(), 'lyteSchNavigatorYearLabel'));
		if(this.getData('ltPropSchedulerView') == 'day' && !popover){
			dateDiv.appendChild(this.createTextNode(_lyteUiUtils.i18n(tempMoment.format('dddd').toLowerCase()), 'lyteSchNavigatorDayLabel'));
		}
	},
	createTextNode : function(text, className) {
		var span = document.createElement('span');
		if(className) {
			span.classList.add(className);
		}
		var textnode =  document.createTextNode(text);
		span.appendChild(textnode);
		return span; 
	},
	clearUser : function(){
		this.setData('selectedUserArr',[]);
		var search_popover = $L('#usersreachPopover',this.$node)[0];
		var userlist = $L('.lyteSchedulerUserSearch', search_popover.actualModalDiv);
		for(index = 0; index < userlist.length; index++){
			var checkbox = $L('lyte-checkbox',userlist[index])[0];
			checkbox.setData('ltPropChecked',false);
		}
		var  schedulerUser = $L('[data-userid]');
		schedulerUser.removeClass('lyteSchedulerUserHide');
		schedulerUser.removeClass('lyteSchedulerUserSelected');
	},
	findDateonMenuClick : function(originElem,view){
		var isMultiUser = this.getData('ltPropMultiUserView')
		var date;
		if(view == 'day'){
			date = this.getData('startDateOfView');
		}else if(view == 'week' && !isMultiUser){
			date = parseInt(originElem.dataset.index);
			date = this.data.ltPropDateArray[date].val.format('DD-MM-YYYY');
		}else{
			date = originElem.querySelector('.scheduler-event-div').dataset.date;
		}
		return date;
	},
	actions : {
		onSchedulerEventHover : function(event,eventTag){
			var eventObj = eventTag.getData('ltPropEvent');
			if(this.getMethods('onEventHover')){
				this.executeMethod('onEventHover',event,eventObj,eventTag);
			}
		},
		onSchedulerEventClick : function(event,eventTag){
			var eventObj = eventTag.getData('ltPropEvent');
			if(this.getMethods('onEventClick')){
				this.executeMethod('onEventClick',event,eventObj,eventTag);
			}
		},
		onSchedulerEventMouseDown : function(event,eventTag){
            if( !this.getData('isEventAdded')|| !event.target.closest('.lyteSchedulerGrabResize') || eventTag.classList.contains('lyteSchedulerParticipantEvent')  || eventTag.classList.contains('lyteSchedulerNoDrag') || ( this.getData('ltPropSchedulerView') === 'month' && this.getData('ltPropMultiUserView') === true ) ){
                return;
            }
			eventTag.classList.add('lyteSchedulerOnResize');
            var view = this.getData('ltPropSchedulerView');
			var isMultiUser = this.getData('ltPropMultiUserView');
            this.setData('dragDir','');
            var eventObj = eventTag.getData('ltPropEvent');
            if( $L && $L.schedulerEventResize ){
                if( (view === 'day' && !isMultiUser) ||
                 (view === 'week' && !isMultiUser && !event.allDayEvent)  ) {
                    if( event.target.tagName === 'SPAN' && event.target.classList.contains('lyteSchedulerGrabResize')){
                        event.target.classList.add('lyteSchedulerGrabResizeShow');
                        $L.schedulerEventResize( event, this, eventObj, eventTag );
                    }
                }
                if( (view === 'day' && isMultiUser )  ||
                 ( view === 'week' && !isMultiUser && event.allDayEvent ) || 
                 ( view === 'week' && isMultiUser ) || 
                 ( view === 'month' && !isMultiUser ) ) {

                    if( event.target.tagName === 'SPAN' && event.target.classList.contains('lyteSchedulerHorizontalResizeIcon')){
                        event.target.classList.add('lyteSchedulerLeftOrRightResizeIcon');
                        $L.schedulerEventResize( event, this, eventObj, eventTag );
                    }
                }
                else{
                    $L.schedulerEventResize( event, this, eventObj, eventTag );
                }
            }
        },
		clearSelection : function(){
			this.clearUser();
		},
		cancelUserSelect : function(){
			var popover = $L('#usersreachPopover',this.$node)[0];
			popover.ltProp('show',false);
			this.setData('checkboxArr',[]);
		},
		SelectUserSelect : function(){
			var popover = $L('#usersreachPopover',this.$node);
			popover[0].ltProp('show',false);
			var user_tr = $L('[data-userid]');
			var selectedUser = $L('[data-userid]:not(.lyteSchedulerUserSelected)');
			selectedUser.addClass('lyteSchedulerUserHide');	
			var cloneArr = $u.clone(this.getData('checkboxArr'));
			this.setData('selectedUserArr',cloneArr);
		},
		hideandShowCalender : function( event  ){
			var originElem;
			originElem = event.target.closest('lyte-scheduler-icon').getAttribute('id');
			var startDateOfView = this.getData('startDateOfView');
			var view = this.getData('ltPropSchedulerView');
			var isMonth = view == 'month';
			if(isMonth){
				startDateOfView = $L('.lyteSchedulerCurrentMonthDate .lyteSchedulerMonthEventsWrap',this.$node)[0].dataset.date;
			}
			if(!this.getData('ltPropHideCalendarNav')){
				$L('#'+originElem).addClass('lyteSchNavigatorCalOpened');
				var popover = $L('#calendarPopover',this.$node)[0];
				popover.setData('ltPropOriginElem','#'+originElem);
				var calendar = $L('lyte-calendar',popover.component.actualModalDiv)[0];
				calendar.setData('ltPropCurrentDate',startDateOfView);
				calendar.setData('viewType','dateView');
				if(view == 'week'){
					var dateArray = this.data.ltPropDateArray;
					calendar.setData('ltPropCurrentWeek',[startDateOfView,dateArray[dateArray.length - 1].val.format('DD-MM-YYYY')])
				}
				if(isMonth){
					calendar.setData('ltPropHeaderType','drilldown');
					var drilldownSpan = $L('.lyteCalsCalMon .lyteDrillCalHeaderButton',popover.component.actualModalDiv)[0];
					if(calendar && calendar.getAttribute('view-type') == 'dateView' && drilldownSpan){
						drilldownSpan.click();
					}
				}else{
					if(this.getData('ltPropCalendarHeaderType')){
						calendar.setData('ltPropHeaderType','dropdown');
					}
				}
				$L('#calendarPopover')[0].setData('ltPropShow',true);
			}
			if(this.getMethods('onCalendarIconClick')){
				this.executeMethod('onCalendarIconClick',originElem,event.target,startDateOfView)
			}
		},
		scrollnav : function(event){
			var scroll_width = this.$node.querySelector('.lyteSchedulerTimeLineEvent').offsetWidth;
			var scrollDiv = this.$node.querySelector('.scrollContainer');
			if(event.target.classList.contains('lyteSchedulerLeftNav')){
				scrollDiv.scrollLeft -= scroll_width; 
			}else{
				scrollDiv.scrollLeft += scroll_width;
			}
		},
		today : function(event){
			this.$node.today();
			this.findActiveKeys($L.moment(new Date()));
		},
		hiddenUserEvent : function(event,UserEvent,user){
			var userDetails =  $u.clone($u.findWhere(this.getData('ltPropSchedulerUser'),{'id':user}));
			userDetails.eventCount = UserEvent.length;
			this.setData('hiddenUser',userDetails);
			this.setData('hiddenEvent',$u.clone(UserEvent));
			this.setData('ltPropUserHiddenEvent',true);
			$L('#schedulerPopover',this.$node)[0] && $L('#schedulerPopover',this.$node)[0].setAttribute('id',0);
			event.target.setAttribute('id','schedulerPopover');
			var popover = this.$node.querySelector('#lyteSchedulerHiddenEvent');
			popover.setData('ltPropPlacement','right');
			popover.setData('ltPropType','box');	
			popover.setData('ltPropShow',true);			
			var poptitle = $L('.lyteSchedulerMoreEventsPopTitleMonthVal',popover.component.actualModalDiv)[0];
			var popDay = $L('.lyteSchedulerMoreEventsPopTitleDayVal',popover.component.actualModalDiv)[0];
			poptitle.innerHTML = ' ';
			popDay.innerHTML = ' ';
			var year = this.data.ltPropDisplayYear;
			var month = this.data.ltPropCurrMonth;
			popDay.appendChild( document.createTextNode(_lyteUiUtils.i18n(this.data.month[month]) + ' ' + year ));
			if(this.getMethods('openHiddenUserEvent')){
				this.executeMethod('openHiddenUserEvent',event.target);
			}
		},
		hiddenEvent : function(event,hiddenObj,date,user,time,view,isAllDay){
			var group = event.target.dataset.group;
			var displayEvent = this.getData('ltPropProcessedData');
			var isMultiUser = this.getData('ltPropMultiUserView');
			this.setData('ltPropUserHiddenEvent',false);
			this.setData('hiddenUser',undefined);
			if(isAllDay){
				displayEvent = displayEvent.allDay;
			}
			if(time){
				date = typeof date == 'string' ? $L.moment(date,'DD-MM-YYYY') : date; 
				if(view == 'day' && isMultiUser && displayEvent[date.format('DD-MM-YYYY')] && displayEvent[date.format('DD-MM-YYYY')][user.id]){
					var hiddenEvent = hiddenObj[time];
					var eventData = displayEvent[date.format('DD-MM-YYYY')][user.id][time];
				}else{
					var hiddenEvent = hiddenObj[time];
					var eventData = displayEvent[time];
				}
			}else{
				date = typeof date == 'string' ? $L.moment(date,'DD-MM-YYYY') : date; 
				var hiddenEvent = hiddenObj[date.format('DD-MM-YYYY')];
				var eventData = displayEvent[date.format('DD-MM-YYYY')];
				if(user){
					hiddenEvent = hiddenEvent[user];
					eventData = eventData[user];
				}
			}
			if(group){
				hiddenEvent = hiddenEvent[group];
				eventData = eventData[group];
			}
			if(view == 'day' ){
				var tempArr = [];
				if(eventData){
					if(isMultiUser){
						eventData.forEach(function(event){
							tempArr.push(event)
						})
					}else{
						eventData.forEach(function(event){
							if( event.allDayEvent ){
								tempArr.push(event)
							}
						})
					}
					
					this.setData('hiddenEvent',tempArr.concat(hiddenEvent));
				}
			}else{
				if(Array.isArray(eventData)){
					this.setData('hiddenEvent',eventData.concat(hiddenEvent));
				}else{
					var userData = this.getData('ltPropSchedulerUser');
					var objectToArray = {...eventData,...hiddenEvent};
					var ArrayFormat = [];
					for(let user in objectToArray){
						var obj = $u.clone($u.findWhere(userData,{id: user}));
						if(obj.events){
							obj.events.push(objectToArray[user])
						}else{
							obj.events = [];
							obj.events.push(objectToArray[user])
						}
						ArrayFormat.push(obj);
					}
					this.setData('hiddenEvent',ArrayFormat);
				}
				
			}
			
			$L('#schedulerPopover',this.$node)[0] && $L('#schedulerPopover',this.$node)[0].setAttribute('id',0);
			event.target.setAttribute('id','schedulerPopover');
			var popover = this.$node.querySelector('#lyteSchedulerHiddenEvent');
			popover.setData('ltPropPlacement','bottom');	
			popover.setData('ltPropType','callout');
			popover.setData('ltPropShow',true);
			var poptitle = $L('.lyteSchedulerMoreEventsPopTitleMonthVal',popover.component.actualModalDiv);
			date =  date.getDObj();
			var popDay = $L('.lyteSchedulerMoreEventsPopTitleDayVal',popover.component.actualModalDiv);
			this.setDisplayDate(poptitle[0],date,true,true);
			popDay[0].innerHTML = '';
			popDay[0].appendChild(document.createTextNode(_lyteUiUtils.i18n(this.data.days[date.getDay()])));
			if(this.getMethods('openHiddenEvent')){
				this.executeMethod('openHiddenEvent',event.target);
			}
		},
		onDateClick : function(event,item){
			if(this.getMethods('onDateClick')){
				this.executeMethod('onDateClick',item);
			}
		},
	},
	methods : {
		eventRender : function(event_div){
			if(this.getMethods('afterEventRender')){
				this.executeMethod('afterEventRender',event_div,this.$node);
			}
		},
		onUserSearchClose : function(event){
			var search = $L('.lyteSchedulerFirstColHeader',this.$node)[0];
			if(event.target === search || search.contains(event.target)){
				return false;
			}else{
				return true;
			}

		},
		boxUnchecked : function(input, component, event, useraction){
			var arr = this.getData('checkboxArr');
			var val = component.getData('ltPropVal');
			var index =  arr.indexOf(val);
			if(index > -1){
				arr.splice( index, 1 );
			}
			this.setData('checkboxArr', arr);
		},
		boxChecked : function(input, component, event, useraction){
			var arr = this.getData('checkboxArr');
			var val = component.getData('ltPropVal');
			arr.push(val);
			this.setData('checkboxArr', arr);
		},
		weekSelected : function(event,week){
			if(this.getData('ltPropSchedulerView') == 'week'){
				$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false)
				var popover = $L('#calendarPopover')[0];
				this._navigated =  true;
				var date = $L.moment(week,'DD-MM-YYYY');
				this.callCurrentView(date.getDObj(),false,this.getData('ltPropWeekStart'));
				this.setData('selectionType','');
				this.setData('selectionType','week');
				popover.setData('ltPropShow',false);
				if(this.getMethods('onCalendarNav')){
					this.executeMethod('onCalendarNav',date);
				}
			}
		},
		monthSelected : function(event,month,cal){
			if(this.getData('ltPropSchedulerView') == 'month'){
				$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false)
				var popover = $L('#calendarPopover')[0];
				popover.setData('ltPropShow',false);
				this._navigated =  true;
				var date = $L.moment('01-'+month+'-'+cal.getData('viewDate').getFullYear(),'DD-MM-YYYY');
				this.callCurrentView(date.getDObj(),false,this.getData('ltPropWeekStart'));
				this.setData('selectionType','');
				this.setData('selectionType','month');
				// popover.setData('ltPropShow',false);
				if(this.getMethods('onCalendarNav')){
					this.executeMethod('onCalendarNav',date);
				}
			}
		},
		dateselect : function(event,date,component){
			
			$L('.schedulerToday',this.$node)[0].setData('ltPropDisabled',false);
			var originElm = $L('.lyteSchNavigatorCalOpened',this.$node);
			var date_obj =  $L.moment(date,'DD-MM-YYYY').getDObj();
			var popover = $L('#calendarPopover')[0];
			popover.setData('ltPropShow',false);
			this._navigated =  true;
			var start_day;
			
			if(this.getData('ltPropSchedulerView') == 'week'){
				if(originElm.hasClass('lyteSchedulerStartDate')){
					start_day = date_obj.getDay();
				}else{
					start_day = date_obj.getDay() + 1;
				}
				var dayLabel = this.getData('ltPropLabel');
				var split = dayLabel.slice(start_day);
				dayLabel = split.concat( dayLabel.slice(0,start_day));
				this.setData('label',dayLabel);
				this.callCurrentView($L.moment(date,'DD-MM-YYYY').getDObj(),false,start_day);
			}else{
				this.ResetTimeLine();
				this.callCurrentView($L.moment(date,'DD-MM-YYYY').getDObj());
			}
			if(this.getMethods('onCalendarNav')){
				this.executeMethod('onCalendarNav',date);
			}
		},
		menuonclick : function( value , event , element , menuOriginElem , clickedItemAndSubmenu_detail){
			var view = this.getData('ltPropSchedulerView');
			var isMultiView = this.getData('ltPropMultiUserView');
			var time;
			if(!isMultiView && view !== 'month'){
				var table = $L('.lyteSchedulerViewMainTable tbody',this.$node)[0];
				var tr = $L('.lyteSchedulerViewMainTable tbody .lyteSchedulerTimeLineEvent',this.$node);
				var AllDay_tr = 0;
				if(view == 'day'){
					AllDay_tr = $L('.lyteSchedulerAllDayEvent',this.$node)[0].offsetHeight;
				}
				
				var current_tr = (event.target.closest('lyte-menu-body').getBoundingClientRect().top - (table.getBoundingClientRect().top + AllDay_tr)) / tr[0].offsetHeight;
				if(current_tr >= 0){
					time = tr[parseInt(current_tr)].dataset.time;
				}else{
					time = undefined;
				}
			}else if(isMultiView && view == 'day'){
				if(menuOriginElem.classList.contains('lyteSchedulerTimeLineEvent')){
					time = menuOriginElem.querySelector('.lyteSchedulerMultiUserViewEventElem').dataset.time;
				}
			}
			var date = this.findDateonMenuClick(menuOriginElem,view);
			if(this.getMethods('onMenuClick')){
				this.executeMethod('onMenuClick',date,value , event , element , menuOriginElem , clickedItemAndSubmenu_detail,time);
			}
		},
		menuonbeforeopen : function( menu , event , originElem ){
			var event_tag = event.target;
			var flag = true;
			var view = this.getData('ltPropSchedulerView');
			while(event_tag && event_tag.tagName !== 'TR'){
				if(event_tag.tagName === "LYTE-SCHEDULER-EVENT-TAG"){
					flag = false;
					break;
				}
				event_tag = event_tag.parentElement;
				if(!event_tag){
					return false;
				}
			}
			if(event.which == 1 && !event.target.classList.contains("lyteSchedulerEventMoreBtn") && !event.target.classList.contains("lyteSchedulerDayNumber") && flag){
				var date = this.findDateonMenuClick(originElem,view);
				if(this.getMethods('onBeforeMenuOpen')){
					this.executeMethod('onBeforeMenuOpen',date,event);
				}
			}else{
				return false;
			}
		},
		menuonopen : function( menu , event , originElem ){
		
			var menu_width =  menu.component.childComp.getBoundingClientRect().width;
			var menu_height =  menu.component.childComp.getBoundingClientRect().height;
			var Leftboundaries =  window.innerWidth;
			var Topboundaries = window.innerHeight;
			if(Topboundaries < event.clientY + document.documentElement.scrollTop + menu_height){
				menu.component.childComp.style.top = Topboundaries + document.documentElement.scrollTop - menu_height  + 'px';
			}else{
				menu.component.childComp.style.top = event.clientY + document.documentElement.scrollTop + 'px';
			}			
			if(_lyteUiUtils.getRTL()){
				menu.component.childComp.style.right = 'unset' ;	
			}
			if(Leftboundaries < event.clientX + menu_width ){
				menu.component.childComp.style.left = Leftboundaries - menu_width + 'px';
			}else{
				menu.component.childComp.style.left = event.clientX + 'px';
			}
			var view = this.getData('ltPropSchedulerView');
			var date = this.findDateonMenuClick(originElem,view);
			var user;
			if(this.getData('ltPropMultiUserView')  && view !== 'month' ){
				var userid = originElem.closest('tr').dataset.userid;
				var userData = $u.findWhere(this.getData('ltPropSchedulerUser'),{'id':userid});
				userData = $u.clone(userData);
			}
			if(this.getMethods('onMenuOpen')){
				this.executeMethod('onMenuOpen',date,event,userData);
			}
		},
		menuonbeforeclose : function ( menu , event  ) {
			if(this.getMethods('onBeforeMenuClose')){
				this.executeMethod('onBeforeMenuClose', menu , event );
			}
		},
		menuonclose: function( menu , event  ){
			if(this.getMethods('onMenuClose')){
				this.executeMethod('onMenuClose',menu , event);
			}
		},		
		ChangeSchedulerView: function(value){
			this.setData('ltPropDateArray',[]);
			this.setData('ltPropDateObj',{});
			this.setData('ltPropSchedulerView',value);
		},
		closeschedulerpopover : function(){
			var targetElem = this.$node.querySelector('#schedulerPopover');
			targetElem.setAttribute('id','');
		},
		closeCalender : function(event,popover){
			$L(popover.getData('ltPropOriginElem'),this.$node).removeClass('lyteSchNavigatorCalOpened');
		},
		openUserSearch : function( ){
			var popover = $L('#usersreachPopover',this.$node);
			if(!popover[0].getData('ltPropShow')){
				popover[0].ltProp('show',true);
			}
		}
				
	}
});
if(!_lyteUiUtils.registeredCustomElements['lyte-scheduler-icon']){
	_lyteUiUtils.registeredCustomElements['lyte-scheduler-icon'] = true;
	Lyte.createCustomElement("lyte-scheduler-icon", {
		static:{

		},
        connectedCallback: function () {
			this.setAttribute('id','SchedulerNavIcon_'+_lyteSchedulerNavId++);
		}
	})

}
Lyte.Component.registerHelper("lyteUiSchedulerhiddenEvent",function( hiddenObj , date , elem , user, group,time,view){
	if(view == 'day'){
		if(hiddenObj[date]){
			hiddenObj = hiddenObj[date];
			if(hiddenObj[user]){
				hiddenObj = hiddenObj[user];
			}
		}
	}
	var hiddenBtn =  $L(elem).closest('.lyteSchedulerEventMoreBtn')[0];
	if( hiddenObj && hiddenObj[time] ){
		if(hiddenBtn){
			hiddenBtn.classList.remove('lyteSchedulerEventMoreBtnHide');
		}
		return hiddenObj[time].length +' '+ _lyteUiUtils.i18n('more','note');
	}else if( hiddenObj && hiddenObj[date] ){
		var events = hiddenObj[date];
		if(user){
			events = events[user];
		}
		if(events && group){
			if(!events[group]){
				return ;
			}
			var hiddenBtn =  $L(elem).closest('.lyteSchedulerEventMoreBtnHide')[0];
			if(hiddenBtn){
				hiddenBtn.classList.remove('lyteSchedulerEventMoreBtnHide');
			}
			return events[group].length +' '+ _lyteUiUtils.i18n('more','note');
		}else if(events  && (events.length || Object.keys(events).length)){
			var length = events.length || Object.keys(events).length;
			var hiddenBtn =  $L(elem).closest('.lyteSchedulerEventMoreBtnHide')[0];
			if(hiddenBtn){
				hiddenBtn.classList.remove('lyteSchedulerEventMoreBtnHide');
			}
			return length +' '+_lyteUiUtils.i18n('more','note');
		}	
	}else{
		if(hiddenBtn){ 
			hiddenBtn.classList.add('lyteSchedulerEventMoreBtnHide');
		}
	}	
});
Lyte.Component.registerHelper("lyteUiSchedulerEvent",function( event ){
	
	if(event && Object.keys(event).length){
		return true;
	}
	return false;
});
Lyte.Component.registerHelper('lyteUiSchedulerLabelFormat',function(format,month,date,year){
	
	var D = new Date( year , month, date);
	return _lyteUiUtils.i18n($L.moment(D).format(format)); 
});
Lyte.Component.registerHelper('lyteUiSchedulerisSearch',function(array,index){
	if( !array.length || array.includes(index)){
		return true;
	}else{
		return false;
	}

})
Lyte.Component.registerHelper('lyteUiSchedulerEventCount',function(event,user,hiddenObj,startDateOfView){
	var count = 0;	
	if(Array.isArray(event)){
		event.forEach(function(date){
			if(!date.val){
				return;
			}
			if(date.events && date.events[user.id] ){
				count += date.events[user.id].count;
				
			}
			var formatedDate = date.val.format('DD-MM-YYYY');
			if(hiddenObj && hiddenObj[formatedDate] && hiddenObj[formatedDate][user.id]){
				count += hiddenObj[formatedDate][user.id].count;
			}
		});
	}else{
		if(!event || !Object.keys(event).length){
			return 0;
		}
		if(event[user.id]){
			count += event[user.id].count ;
		}
		if(event.allDay && event.allDay[user.id]){
			count += event.allDay[user.id].count ;
		}
		if(hiddenObj.allDay && hiddenObj.allDay[startDateOfView] && hiddenObj.allDay[startDateOfView][user.id] ){
			count += hiddenObj.allDay[startDateOfView][user.id].count ;
		}
	}	
	return count;
})


Lyte.Component.registerHelper('lyteUiSchedulerAllDayCount',function(eventData,hiddenObj,startDateOfView,view,isMultiView){
	var count = 0;
	if(eventData ){
		if(view == 'day' ){
			if(isMultiView && eventData.allDay && eventData.allDay[startDateOfView]){
				var events = eventData.allDay[startDateOfView];
				var keys = Object.keys(events);
				keys.forEach(function(user){
					count += events[user].length;
					if(hiddenObj && hiddenObj.allDay && hiddenObj.allDay[startDateOfView] && hiddenObj.allDay[startDateOfView][user]){
						count += hiddenObj.allDay[startDateOfView][user].length;
					}
				})
			}else if(eventData[startDateOfView]){
				var events = eventData[startDateOfView];
				for(var Iindex = 0;events && Iindex < events.length;Iindex++){
					if(events[Iindex] && events[Iindex].allDayEvent && !events[Iindex].overdue){
						count++;
					}
				}
				if(hiddenObj && hiddenObj && hiddenObj[startDateOfView]){
					var events = hiddenObj[startDateOfView];
					for(var Iindex = 0;events && Iindex < events.length;Iindex++){
						if(events[Iindex] && events[Iindex].allDayEvent){
							count++;
						}
					}
				}
			}
		}else if(!isMultiView && view == 'week' && eventData.allDay){			
			for(var index = 0; index < 7; index++){
				var events = eventData.allDay[startDateOfView];
				for(var Iindex = 0;events && Iindex < events.length;Iindex++){
					if(events[Iindex] && Object.keys(events[Iindex]).length && !events[Iindex].overdue){
						count++;
					}
				}
				if(hiddenObj && hiddenObj.allDay && hiddenObj.allDay[startDateOfView]){
					count += hiddenObj.allDay[startDateOfView].length;
				}
				startDateOfView = $L.moment(startDateOfView,'DD-MM-YYYY').add(1,'date').format('DD-MM-YYYY');
			}
		}
	}
	return count;
});
Lyte.Component.registerHelper('lyteUiSchedulergetUserData',function(userid,userData){
	var User = $u.findWhere(userData,{'id':userid});
	return User; 
});
Lyte.Component.registerHelper('lyteSchedulerUiFindWeek',function(date,view){
	var now;
	if(!date){
		return;
	}
	if(typeof date == 'string'){
		now  = $L.moment(date,'DD-MM-YYYY');
	}else{
		now = date;
	}
	now = now.getDObj();
	const onejan = new Date(now.getFullYear(), 0, 1);
	var week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() -6  ) / 7);
	if(week == 53){
		var lastdate = new Date( now.getFullYear() , 11 , 31 );
		if(lastdate.getDay() != 6){
			week = 1;
		}			
	}
	if(view && view == 'day'){
		return _lyteUiUtils.i18n('week')+ ' ' +week;
	}
	return 'W '+week;
});
Lyte.Component.registerHelper('lyteUiSchedulerIsResize',function(week,event,format,position){
	var lastdate;
	var firstDate;
	if(!event.editable){
		return false;
	}
	lastdate = week[week.length - 1].val;
	firstDate = week[0].val;
	if(position == 'end'){
		var currDate = $L.moment(event.end,format);
	}else{
		var currDate = $L.moment(event.start,format);
	}
	if(lastdate.fromNow(currDate).past && !firstDate.fromNow(currDate).past){
		return true;
	}
	return false;
})