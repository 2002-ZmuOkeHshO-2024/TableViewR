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
