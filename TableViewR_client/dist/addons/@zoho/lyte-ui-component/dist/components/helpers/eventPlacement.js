;( function(){
 var eventPlacement = {}
isinBetweens = function( curr_date, divPostion, endDate, scheduler ){
    var eventManipulator = new _lyteUiUtils.eventManipulator( scheduler.getData('ltPropFormat') );
    return eventManipulator.isinBetween(curr_date, divPostion, endDate, scheduler.getData('ltPropFormat'));
}
onSchedulerEventMouseDown = function( eventTag ){
    if( !event ){
        return;
    }
    if( !this.getData('isEventAdded') || this.getData('ltPropSchedulerView') === 'month' && this.getData('ltPropMultiUserView') === true ){
        return;
    }
    this.setData('dragDir','');
    var eventObj = eventTag.getData('ltPropEvent');
    if( $L && $L.schedulerEventResize ){
        $L.schedulerEventResize( event, this, eventObj, eventTag );
    }
}
onSchedulerEventHover = function(eventTag){
    var eventObj = eventTag.getData('ltPropEvent');
    if(this.getMethods('onEventHover')){
        this.executeMethod('onEventHover',event,eventObj,eventTag);
    }
}
onSchedulerEventClick = function(eventTag){
    var eventObj = eventTag.getData('ltPropEvent');
    if(this.getMethods('onEventClick')){
        this.executeMethod('onEventClick',event,eventObj,eventTag);
    }
}
var cloneEventTag = function( event_tag, scheduler ){
    var cloneTag = document.createElement('lyte-scheduler-event-tag');
    cloneTag.setAttribute('data-id',event_tag.getAttribute('data-id'));
    cloneTag.setData('ltPropEvent',event_tag.getData('ltPropEvent'));
    var yield = document.createElement('lyte-yield');
    yield.setAttribute('yield-name','scheduler-event');
    // yield.setData('schedulerEvent',event_tag.getData('ltPropEvent'));
    // var yield2 = event_tag.querySelector('lyte-yield[yield-name="scheduler-event-badge"]').cloneNode(true);
    var div = document.createElement('div');
    div.innerText = event_tag.innerText;

    cloneTag.setAttribute('style', event_tag.getAttribute('style'));//!!!adding this line over here, cause after this commit 
            //the top doesn't get retained when a tag is cloned or added suddenly (need to check this)
   
    yield.appendChild(div);
    cloneTag.appendChild(yield);
    // cloneTag.appendChild(yield2);
    
    return cloneTag;
}
var changeDivHeightOfTd = function( tr, event_tag, ind ){

    var cs = getComputedStyle(event_tag);
    var tdArr = tr.querySelectorAll('td.lyteSchedulerDate');
    for( var i=ind;i<tdArr.length;i++ ){
        var div = tdArr[i].querySelector('.scheduler-event-div');
        div.style.height = '';
    }
}
eventPlacement.addOrRemoveTagsRight = function( eventData, scheduler, event_tag, dragDir ){
    var dateArray = scheduler.getData('ltPropDateArray');
    var format = scheduler.getData('ltPropFormat');
    // var cloneTag = event_tag.cloneNode( true );
    var cloneTag;

    var currMonthEnd = dateArray[dateArray.length-1][dateArray[dateArray.length-1].length-1].val;
    var currMonthStart = dateArray[0][0].val;
    var startDateMoment = $L.moment(eventData.start, format);
    var endDateMoment = $L.moment(eventData.end, format);
    var endDate,startDate;

    if( currMonthEnd.fromNow( endDateMoment ).past ){
        endDate = endDateMoment;
    }
    else{
        endDate = currMonthEnd;
    }

    if( !currMonthStart.fromNow( startDateMoment ).past ){
        startDate = startDateMoment;
    }
    else{
        startDate = currMonthStart;
    }

    var end = endDate, start = startDate;
    var startEventTagRow = findRow( dateArray, start );
    var endEventTagRow = findRow( dateArray, end );

    if( startEventTagRow === -1 || endEventTagRow === -1 ){
        return;
    }

    var newNoRows = endEventTagRow - startEventTagRow + 1;
    var oldNoRows = $L('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length;

    if( newNoRows === oldNoRows ){
        return;
    }
    else{
        var tbody = $L('tbody.lyteSchedulerMonthViewBody')[0];
        var trArr = tbody.querySelectorAll('tr');
        for( var j=0;j<startEventTagRow;j++){
            var isEventTagPresent = trArr[j].querySelectorAll('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length > 0;
            if( isEventTagPresent ){
                var tag = trArr[j].querySelector('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']');
                var cur_td = $L(tag).closest('td')[0];
                var td_arr = trArr[j].querySelectorAll('td');
                var ind = Array.from(td_arr).indexOf(cur_td); 

                // if( ind !== -1 ){
                //     reduceDivHeightOfTd( trArr[j], event_tag, ind );    //this won't need as scheduler is going to re-render when mouseupped
                // }
                tag.remove();

            }
        }
        for( var j=startEventTagRow;j<=endEventTagRow;j++ ){
            var isEventTagPresent = trArr[j].querySelectorAll('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length > 0;
            if( !isEventTagPresent ){
                if( !cloneTag ){
                    cloneTag = cloneEventTag( event_tag, scheduler );
                }
                cloneTag.addEventListener('click',onSchedulerEventClick.bind(scheduler,cloneTag));
                cloneTag.addEventListener('mouseover',onSchedulerEventHover.bind(scheduler,cloneTag));
                cloneTag.addEventListener('mousedown',onSchedulerEventMouseDown.bind(scheduler,cloneTag));
                var div = trArr[j].querySelector('td>div.scheduler-event-div');
                // var yield = document.createElement('lyte-yield');yield.setAttribute('yield-name','lyteSchedulerEventYield');

                changeDivHeightOfTd( trArr[j], event_tag, 0 );
                div.appendChild(cloneTag);
                // div.appendChild(yield);
            }
        }
        for( var j=endEventTagRow+1;j<dateArray.length;j++){
            var isEventTagPresent = trArr[j].querySelectorAll('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length > 0;
            if( isEventTagPresent ){
                var tag = trArr[j].querySelector('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']');
                var cur_td = $L(tag).closest('td')[0];
                var td_arr = trArr[j].querySelectorAll('td');
                var ind = Array.from(td_arr).indexOf(cur_td); 

                // if( ind !== -1 ){
                //     reduceDivHeightOfTd( trArr[j], event_tag, ind );
                // }
                tag.remove();
            }
        }
    }
   
    cloneTag = null;
}
eventPlacement.addOrRemoveTagsLeft = function( eventData, scheduler, event_tag ){
    var dateArray = scheduler.getData('ltPropDateArray');
    var format = scheduler.getData('ltPropFormat');
    var cloneTag;
    // var start = $L.moment(eventData.start, format);
    // var end = $L.moment(eventData.end, format);
    var currMonthEnd = dateArray[dateArray.length-1][dateArray[dateArray.length-1].length-1].val;
    var currMonthStart = dateArray[0][0].val;
    var startDateMoment = $L.moment(eventData.start, format);
    var endDateMoment = $L.moment(eventData.end, format);
    var endDate,startDate;

    if( currMonthEnd.fromNow( endDateMoment ).past ){
        endDate = endDateMoment;
    }
    else{
        endDate = currMonthEnd;
    }

    if( !currMonthStart.fromNow( startDateMoment ).past ){
        startDate = startDateMoment;
    }
    else{
        startDate = currMonthStart;
    }
    var end = endDate, start = startDate;
    var startEventTagRow = findRow( dateArray, start );
    var endEventTagRow = findRow( dateArray, end );

    if( startEventTagRow === -1 || endEventTagRow === -1 ){
        return;
    }

    var newNoRows = endEventTagRow - startEventTagRow + 1;
    var oldNoRows = $L('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length;

    if( newNoRows === oldNoRows ){
        return;
    }
    else{
        var tbody = $L('tbody.lyteSchedulerMonthViewBody')[0];
        var trArr = tbody.querySelectorAll('tr');
        for( var j=0;j<startEventTagRow;j++){
            var isEventTagPresent = trArr[j].querySelectorAll('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length > 0;
            if( isEventTagPresent ){
                var tag = trArr[j].querySelector('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']');
                var cur_td = $L(tag).closest('td')[0];
                var td_arr = trArr[j].querySelectorAll('td');
                var ind = Array.from(td_arr).indexOf(cur_td); 

                // if( ind !== -1 ){
                //     reduceDivHeightOfTd( trArr[j], event_tag, ind );
                // }
                tag.remove();

            }
        }
        for( var j=startEventTagRow;j<=endEventTagRow;j++ ){
            var isEventTagPresent = trArr[j].querySelectorAll('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length > 0;
            var startDiv = trArr[j].querySelector('td>div.scheduler-event-div[data-date="' + eventData.start.split(" ")[0] + '"]');

            var tag = trArr[j].querySelector('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']');
            var cur_td = $L(tag).closest('td')[0];
            var td_arr = trArr[j].querySelectorAll('td');
            var ind = Array.from(td_arr).indexOf(cur_td); 
            
            if( isEventTagPresent ){ //&& !startDiv && ind !== 0 ){
                // if( ind !== -1 ){
                //     reduceDivHeightOfTd( trArr[j], tag, ind );
                // }
                tag.remove();
                isEventTagPresent = false;
            }

            if( !isEventTagPresent ){
                // if( !cloneTag ){
                    cloneTag = cloneEventTag( event_tag, scheduler );
                // }
                var div;
                cloneTag.addEventListener('click',onSchedulerEventClick.bind(scheduler,cloneTag));
                cloneTag.addEventListener('mouseover',onSchedulerEventHover.bind(scheduler,cloneTag));
                cloneTag.addEventListener('mousedown',onSchedulerEventMouseDown.bind(scheduler,cloneTag));
                if( startDiv ){
                    div = startDiv;
                }
                else{
                    div = trArr[j].querySelector('td>div.scheduler-event-div');
                }
                // var yield = document.createElement('lyte-yield');yield.setAttribute('yield-name','lyteSchedulerEventYield');

                changeDivHeightOfTd( trArr[j], event_tag, 0 );
                div.appendChild(cloneTag);
                // div.appendChild(yield);
            }
          
        }
        for( var j=endEventTagRow+1;j<dateArray.length;j++){
            var isEventTagPresent = trArr[j].querySelectorAll('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']').length > 0;
            if( isEventTagPresent ){
                var tag = trArr[j].querySelector('lyte-scheduler-event-tag[data-id=' + event_tag.getAttribute('data-id') + ']');
                var cur_td = $L(tag).closest('td')[0];
                var td_arr = trArr[j].querySelectorAll('td');
                var ind = Array.from(td_arr).indexOf(cur_td); 

                // if( ind !== -1 ){
                //     reduceDivHeightOfTd( trArr[j], event_tag, ind );
                // }
                tag.remove();
            }
        }
    }
   
    cloneTag = null;
}
var findRow = function( dateArray, curr ){
    for( var i=0;i<dateArray.length;i++ ){
        var start = dateArray[i][0].val;
        var end = dateArray[i][6].val;

        if( ( start.fromNow(curr).past  === false && end.fromNow(curr).past  === true ) ||
            start.format('DD-MM-YYYY') === curr.format('DD-MM-YYYY') ||
            end.format('DD-MM-YYYY') === curr.format('DD-MM-YYYY')){

           return i;
        }
    }
    return -1;
}
function isAllDayEvent( tag ){
    var td = $L( tag ).closest('td.lyteSchedulerDate')[0];
    if( !td ){return;}
    var tr = $L( td ).closest('tr')[0];
    if( !tr ){return;}

    return tr.classList.contains('lyteSchedulerWeekViewAllDayRow')
}
 eventPlacement.setTimelinePosition = function(eventData,scheduler,event_tag){
    var format = scheduler.getData('ltPropFormat');
    var view = scheduler.getData('ltPropSchedulerView');
    var endDate = $L.moment(eventData.end,format);
    var startDate = $L.moment(eventData.start,format);
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
        var endminDiff =  (startTimeDiv.offsetHeight / scheduler.getData('ltPropTimeLine')) * ( min - endDate.format('mm') );
        var endTimeDiv = scheduler.$node.querySelector('[data-time="'+end_time+'"]');
        event_tag.style.top =  startTimeDiv.getBoundingClientRect().top + stratminDiff - startTimeDiv.offsetParent.getBoundingClientRect().top + parseInt(window.getComputedStyle(startTimeDiv.querySelector('td')).borderTopWidth) - header_height + 'px';
        event_tag.style.position = 'absolute';
        var finalHeight = (endTimeDiv.getBoundingClientRect().top )  - startTimeDiv.getBoundingClientRect().top - parseInt(window.getComputedStyle(endTimeDiv.querySelector('td')).borderTopWidth) - stratminDiff - endminDiff;
        event_tag.style.height = finalHeight + 'px';

        return finalHeight;
    }
}
eventPlacement.setAllDayPosition = function(eventData,scheduler,event_tag,dragDir, isCurrTag, lastStartDiv){
    var format = scheduler.getData('ltPropFormat');
    var view = scheduler.getData('ltPropSchedulerView');
    var isMultiView = scheduler.getData('ltPropMultiUserView');

    var user,curr_date,arr,td;
    if( view === 'month'){
        if( !lastStartDiv ){
            arr = document.elementsFromPoint(event_tag.getBoundingClientRect().left + window.pageXOffset ,event_tag.getBoundingClientRect().top + window.pageYOffset );
            td = arr.find(function( elem ){
                return elem.nodeName === 'TD' && elem.classList.contains('lyteSchedulerDate');
            });
            lastStartDiv = td;
        }
        else{
            var lastStartTr = lastStartDiv.parentElement, nextSibling;
            if( lastStartTr ){
                nextSibling = lastStartTr.nextElementSibling;
            }
            if( nextSibling ){
                lastStartDiv = nextSibling.firstElementChild;
            }
            td = lastStartDiv;
        }
    }
    else{
        arr = document.elementsFromPoint(event_tag.getBoundingClientRect().left + window.pageXOffset ,event_tag.getBoundingClientRect().top + window.pageYOffset );
        td = arr.find(function( elem ){
            return elem.nodeName === 'TD' && elem.classList.contains('lyteSchedulerDate');
        });
    }

    var startDiv,divPosition;
        if( td ){
            startDiv = td.querySelector('div.scheduler-event-div');
        }
        else{
            return;
        }
    if(startDiv){
        curr_date = $L.moment(startDiv.dataset.date,'DD-MM-YYYY');
        divPosition = startDiv.dataset.date;
    }
  
    if((view === 'week' && !isAllDayEvent( event_tag )) && !isMultiView || (view == 'day' && isMultiView)){
        user = scheduler.$node.querySelector('[data-userid="'+eventData.userid+'"]');
        event_tag.style.top = startDiv.offsetHeight +  parseInt(window.getComputedStyle(event_tag).marginTop) +'px';
    }
    var dateArray = scheduler.getData('ltPropDateArray');

    if(eventData.end){
        var currMonthEnd = dateArray[dateArray.length-1][dateArray[dateArray.length-1].length-1].val;
        var currMonthStart = dateArray[0][0].val;
        var startDateMoment = $L.moment(eventData.start, format);
        var endDateMoment = $L.moment(eventData.end, format);
        var endDate,startDate;

        if( currMonthEnd.fromNow( endDateMoment ).past ){
            endDate = endDateMoment;
        }
        else{
            endDate = currMonthEnd;
        }

        if( !currMonthStart.fromNow( startDateMoment ).past ){
            startDate = startDateMoment;
        }
        else{
            startDate = currMonthStart;
        }

        var cs = window.getComputedStyle(event_tag);
        var isinBetween = isinBetweens(curr_date.format('DD-MM-YYYY'),divPosition,endDate.format('DD-MM-YYYY'), scheduler);
        var date_td =  $L(startDiv).closest('td')[0];
        if(isinBetween || (view !== 'day')){
            var cs = window.getComputedStyle(date_td);
            var interval = scheduler.getEventInterval(divPosition,endDate.format('DD-MM-YYYY')) + 1 ;
            var width = (interval * date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
            if( view !== 'day' ){
                width = (interval * date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
                if( (width + event_tag.getBoundingClientRect().left)  > (scheduler.$node.getBoundingClientRect().left + scheduler.$node.offsetWidth) ){
                    width =   (scheduler.$node.getBoundingClientRect().right) - ( event_tag.getBoundingClientRect().left) - parseInt(cs.paddingRight);
                }
            }else{
                width = (date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
            }

            if( dragDir === 'left' && isCurrTag ){
                if( startDiv ){
                    var left_interval = scheduler.getEventInterval(divPosition,startDate.format('DD-MM-YYYY')) ;
                    if( left_interval < 0 ){
                        left_interval *= -1;
                        var left = (left_interval * date_td.offsetWidth);
                        // if( ( event_tag.getBoundingClientRect().left - left )  < (scheduler.$node.getBoundingClientRect().left ) ){
                        //     left -= scheduler.$node.getBoundingClientRect().left + event_tag.getBoundingClientRect().left + left;
                        // }
                        event_tag.style.left = ( parseInt(event_tag.style.left) - left ) + 'px';
                        width = ((interval+left_interval) * date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
                        if( (width + event_tag.getBoundingClientRect().left)  > (scheduler.$node.getBoundingClientRect().left + scheduler.$node.offsetWidth) ){
                            width =   (scheduler.$node.getBoundingClientRect().right) - ( event_tag.getBoundingClientRect().left) - parseInt(cs.paddingRight);
                        }
                    }
                    else if( left_interval > 0 ){
                        var left = (left_interval * date_td.offsetWidth);
                        event_tag.style.left = parseInt(event_tag.style.left) + left + 'px';
                        width = ((interval-left_interval) * date_td.offsetWidth) - 2 * parseInt(cs.paddingRight);
                        if( (width + event_tag.getBoundingClientRect().left)  > (scheduler.$node.getBoundingClientRect().left + scheduler.$node.offsetWidth) ){
                            width =   (scheduler.$node.getBoundingClientRect().right) - ( event_tag.getBoundingClientRect().left) - parseInt(cs.paddingRight);
                        }
                    }
                }
            }
            // if( isCurrTag ){
                // checkAndIncreaseHeightIfEventOverLaps(event_tag, scheduler);
            // }
            event_tag.style.width = ( ( width ) /  date_td.offsetWidth) * 100 + '%';
        }
        else{
            var width = event_tag.offsetWidth;
            event_tag.style.top = startDiv.offsetHeight +  parseInt(window.getComputedStyle(event_tag).marginTop) + parseInt(window.getComputedStyle(date_td).paddingLeft)   + 'px';
        }
    }
    if(dragDir !== 'left' && !isCurrTag){
        event_tag.style.left = parseInt(window.getComputedStyle(date_td).paddingLeft) +'px';
    }

    return lastStartDiv;
}
eventPlacement.setDayMultiUserPosition = function(eventData,scheduler,event_tag){
        var format = scheduler.getData('ltPropFormat');
        var startDate = $L.moment(eventData.start, format);
        var endDate = $L.moment(eventData.end,format);
        var _this = event_tag.component;

        var start_time = startDate.format('hh') + ':00 ' + startDate.format('A');
        var end_time = endDate.format('hh') + ':00 ' + endDate.format('A');
        var user = scheduler.$node.querySelector('[data-userid="'+eventData.userid+'"]');
        var time_division = 60 / scheduler.getData('ltPropTimeLine');
        var startTimeDiv = $L('[data-time="'+ start_time +'"]',user)[0];
        if(startTimeDiv){
            var startTimeDiv_width = startTimeDiv.offsetWidth / time_division;                                  
            var parent_div = user.querySelector('[data-time="'+start_time+'"]');
            var starttimeDivision = startDate.get('minutes') / scheduler.getData('ltPropTimeLine');
            if(!parent_div.contains(_this.$node)){
                Lyte.Component.appendChild( parent_div, _this.$node);
            }
            // _this.$node.style.top = startTimeDiv.offsetHeight +'px';
            _this.$node.style.left = starttimeDivision * startTimeDiv_width + 'px';
            var endTimeDiv =user.querySelector('[data-time="'+end_time+'"]')
            _this.$node.style.width =  ( endTimeDiv.getBoundingClientRect().left - _this.$node.getBoundingClientRect().left ) +  (endDate.get('minutes') / scheduler.getData('ltPropTimeLine')  ) * startTimeDiv_width + 'px';
            // var events = $L('lyte-scheduler-event-tag',scheduler.$node);
            // var cs =  window.getComputedStyle(startTimeDiv);
            // var startDiv = _this.$node.closest('.lyteSchedulerMultiUserViewEventElem');
            // this.addHeightToDate(Math.round(_this.$node.offsetWidth/startDiv.offsetWidth),event_tag.offsetHeight + parseInt(window.getComputedStyle(event_tag).marginTop),startDiv.dataset.time,user,'time',scheduler,isMultiView,view);
        }
}
_lyteUiUtils.eventPlacement = eventPlacement;

})();