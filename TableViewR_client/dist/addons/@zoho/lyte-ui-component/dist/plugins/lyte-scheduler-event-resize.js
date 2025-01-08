//cloneTag is manually created, check if all setted attributes are enough(eventPlacement)
//css for dragCursorGrab,dragCursorGrabbing,dragCursorDown,dragCursorLeft,dragCursorRight
//css for stopUserSelect ( set user-select to none )
//should eventlisteners be removed at last?

;(function(){
    var intervalId, boundedMouseUp;

    var mouseMoveHandler = function( e ){
        var int = this.getData('ltPropMultiUserView') && this.getData('ltPropSchedulerView')==='day' ? 10 : Math.ceil(this.getData('ltPropTimeLine')/4);
        // checkAndAddCursorClass( this, e, 5 );
        checkAndIncreaseScrollY( this, e, mouseMoveHandler, int );

        if( !this.getData('isResizing') ){
            return;
        }
        if(e.preventDefault){
            e.preventDefault();
        }
        this.$node.classList.add('lyteSchedulerStopUserSelect');

        var dragDir = this.getData('dragDir');
        if( !dragDir ){
            return;
        }

        var format = this.getData('ltPropFormat');
        var tagDivId = this.getData( 'currEventTag' );
        var view = this.getData('ltPropSchedulerView');
        var isMultiUserView = this.getData('ltPropMultiUserView');

        if( !tagDivId ){
            return;
        }
        var tagDiv = $L("[data-id='"+tagDivId+"']")[0];
        var eventObj = tagDiv.component.getData('ltPropEvent');
        var type = this.getData('ltPropSchedulerView');
        var interval = this.getData('ltPropTimeLine');
        var int = isMultiUserView && type==='day' ? 10 : Math.ceil(interval/4);
        var wrapper = $L('div.lyteSchedulerViewWrapper')[0];
        var arr = Array.prototype.slice.call( document.elementsFromPoint(e.pageX-window.scrollX, e.pageY-window.scrollY) );
        var resTd = findResultTd( arr, type, tagDiv, this ); //instead of checking innerHTML, can lookup for a particular class by adding it in html
        if( !resTd ){
            return;
        }
        
        var parentTr;
        var newParentTr;

        if( view === 'day' && isMultiUserView ){
            parentTr = resTd;
        }
        else{
            parentTr = resTd.closest('.lyteSchedulerDate');
        }

        if( !parentTr ){
            return;
        }
        var retParTr;

        if( dragDir === 'left' || dragDir === 'right'){
            var newTdArr = document.elementsFromPoint(e.pageX, e.pageY);
            var newTd = newTdArr.find(function( elem ){
                if( elem.tagName === 'TD' && elem.classList.contains('lyteSchedulerDate')){
                    return true;
                }
            });
            var curTdArr = document.elementsFromPoint(tagDiv.getBoundingClientRect().left,tagDiv.getBoundingClientRect().top);
            var curTd = curTdArr.find(function( elem ){
                if( elem.tagName === 'TD' && elem.classList.contains('lyteSchedulerDate')){
                    return true;
                }
            });

            var curEvent = tagDiv;
            var newEvent = curTdArr.find(function( elem ){
                if( elem.tagName === 'lyte-scheduler-event-tag' ){
                    return true;
                }
            });
            if(  newTd === curTd && curEvent === newEvent ){
                return false;
            }
            newParentTr = newTd;
        }
        else{
            retParTr = getNextOrPrevToBreakPoint( e, eventObj, parentTr, this );
            if( !retParTr || ( typeof retParTr === 'object' && retParTr.length === 0 ) ){
                return;
            }
            else{
                newParentTr = getTrOfCurDate( e, eventObj, retParTr, this, tagDiv );
            }   
        }
         
        if( !newParentTr ){
            return;
        }

        if( dragDir === 'top' ){
            var oldStartDate = $L.moment( eventObj.start, format );
            var newStartDate;
            
            if( type === 'day' || type === 'week' && (!isAllDayEvent( tagDiv )&&!this.getData('ltPropMultiUserView'))){
                newStartDate = $L.moment( eventObj.start, format );
                if(newParentTr === 'next'){
                    newStartDate.add(int,'minutes');
                }
                else if(newParentTr === 'prev'){
                    newStartDate.subtract(int,'minutes');
                    //corner case
                    if(newStartDate.format('DD-MM-YYYY') !== oldStartDate.format('DD-MM-YYYY')){
                        oldStartDate.set('hours',0);
                        oldStartDate.set('minutes',0);
                        newStartDate = oldStartDate;
                    }
                }
            }
            else{
                if(  !checkIfValidTr( newParentTr, dragDir ) || !checkIfValidTr( newParentTr.nextElementSibling, dragDir ) ){    //checking if currTr is last tr in the scheduler order
                    return;
                }
                newStartDate = $L.moment( oldStartDate.format('DD-MM-YYYY') + ' ' + newParentTr.getAttribute('data-time') , format);
            }

            var isUpdated = updateEventObj( tagDiv, eventObj, newStartDate, this );
            if( !isUpdated ){
                return;
            }
        }
        else if( dragDir === 'bottom' ){
            var oldEndDate = $L.moment( eventObj.end, format );
            var newEndDate;

            if( type === 'day' || type === 'week' && (!isAllDayEvent( tagDiv )||!this.getData('ltPropMultiUserView'))){
                newEndDate = $L.moment( eventObj.end, format );
                if(newParentTr === 'next'){
                    if( e.preventDefault ){
                        newEndDate.add(int,'minutes');
                    }
                    else{
                        newEndDate.add(int,'minutes');
                    }
                      //corner case
                      if(newEndDate.format('DD-MM-YYYY') !== oldEndDate.format('DD-MM-YYYY')){
                        oldEndDate.set('hours',23);
                        oldEndDate.set('minutes',59);
                        newStartDate = oldStartDate;
                    }
                }
                else if(newParentTr === 'prev'){
                    newEndDate.subtract(int,'minutes');
                }
            }
            else{
                newEndDate = $L.moment( oldEndDate.format('DD-MM-YYYY') + ' ' + newParentTr.getAttribute('data-time') , format);
            }

            var isUpdated = updateEventObj( tagDiv, eventObj, newEndDate, this );
            if( !isUpdated ){
                return;
            }
        }
        else if( dragDir === 'left' ){
            var oldStartDate = $L.moment( eventObj.start, format );
            oldStart = oldStartDate.format("DD-MM-YYYY");
            var oldTime = oldStartDate.format('hh:mm A') ? oldStartDate.format('hh:mm A'): "12:00 AM" ;
            var elem =  newParentTr.querySelector('.scheduler-event-div');
            if( !elem ){return;}
            var newStartDate = $L.moment(elem.getAttribute('data-date') + ' ' + oldTime , format);
            var isUpdated = updateEventObj( tagDiv, eventObj, newStartDate, this );
            if( !isUpdated ){
                return;
            }
        }
        else if( dragDir === 'right' ){
            var oldEndDate = $L.moment( eventObj.end, format );
            var oldTime = oldEndDate.format('hh:mm A') ? oldEndDate.format('hh:mm A'): "12:00 AM" ;
            var elem = newParentTr.querySelector('.scheduler-event-div');
            if( !elem ){return;}
            var newEndDate = $L.moment( elem.getAttribute('data-date') + ' ' + oldTime, format);
            var isUpdated = updateEventObj( tagDiv, eventObj, newEndDate, this );
            if( !isUpdated ){
                return;
            }
        }

        var eventTagHeight;

        if( eventObj.allDayEvent || type === 'month' || (type === 'week' && isMultiUserView)){
            if( type === 'month'){
                if( dragDir === 'left' ){
                    _lyteUiUtils.eventPlacement.addOrRemoveTagsLeft(eventObj, this, tagDiv);
                }
                else{
                    _lyteUiUtils.eventPlacement.addOrRemoveTagsRight(eventObj, this, tagDiv);
                }
                var eventArr = $L('lyte-scheduler-event-tag[data-id=' + tagDiv.getAttribute('data-id') + ']');
                var lastStartDiv;
                for( var i=0;i<eventArr.length;i++ ){
                    var isCurrTag = false;
                    if( tagDiv === eventArr[i] ){
                        isCurrTag = true;
                    }
                    lastStartDiv = _lyteUiUtils.eventPlacement.setAllDayPosition(eventObj, this, eventArr[i], dragDir, isCurrTag, lastStartDiv);
                }
            }
            else{
                _lyteUiUtils.eventPlacement.setAllDayPosition(eventObj, this, tagDiv, dragDir, true);
            }
        }
        else if( type === 'day' && isMultiUserView ){
            if( eventObj.allDayEvent ){
                _lyteUiUtils.eventPlacement.setAllDayPosition(eventObj, this, tagDiv, dragDir, true);
            }
            else{
                _lyteUiUtils.eventPlacement.setDayMultiUserPosition(eventObj, this, tagDiv);
            }
        }
        else{
            eventTagHeight = _lyteUiUtils.eventPlacement.setTimelinePosition(eventObj, this, tagDiv);
        }

        if( this.getMethods('onEventResizeMove') ){
            this.executeMethod('onEventResizeMove', e, this, tagDiv, tagDiv.getData('ltPropEvent'), eventTagHeight);
        }

        this.setData('curPgX',e.pageX);
        this.setData('curPgY',e.pageY);

    };

    var mouseUpHandler = function( e ){
        var eventTagid = this.getData('currEventTag');
        var eventTag = $L('lyte-scheduler-event-tag[data-id="' + eventTagid + '"]')[0];
        var isResizing = this.getData('isResizing');
        eventTag && eventTag.classList.remove('lyteSchedulerOnResize');

        this.setData('isResizing',false);
        this.setData('dragDir','');
        this.setData('currEventTag','');
        this.$node.classList.remove('lyteSchedulerStopUserSelect');

        if( isResizing ){
            if( this.getMethods('onEventResizeEnd') ){
                this.executeMethod('onEventResizeEnd', e, this, eventTag, eventTag.getData('ltPropEvent'));
            }
        }
       

    };

    $L.schedulerEventResize = function( event, _this, eventObj, eventTag ){

        if( event === 'destroy' && _this.getData('isEventAdded') ){
            _this.setData('isEventAdded',false);
            if( boundedMouseUp ){
                document.removeEventListener('mouseup', boundedMouseUp );
            }

            boundedMouseUp = null;
            return;
        }

        if( event === 'connect' && ! _this.getData('isEventAdded')){
            if( !boundedMouseUp ){
                boundedMouseUp = mouseUpHandler.bind( _this );
            }

            var wrapper = $L(_this.$node).find('div.lyteSchedulerViewWrapper')[0];

            _this.setData('isEventAdded',true);
            wrapper.addEventListener('mousemove', mouseMoveHandler.bind(_this) );
            document.addEventListener('mouseup', boundedMouseUp );  //registered this event in document to grab the mouseUp even outside the scheduler
            return;
        }

        if( event === 'destroy' || event === 'connect' ){
            return;
        }

        var format = _this.getData('ltPropFormat');
        var type = _this.getData('ltPropSchedulerView');
        var startX = event.pageX;
        var startY = event.pageY;
        var boundRect = eventTag.getBoundingClientRect();
        var top = boundRect.top + window.scrollY, bottom = boundRect.bottom + window.scrollY, left = boundRect.left + window.scrollX, right = boundRect.right + window.scrollX;
        var diff = 12;   //if changing the value -> also change in checkAndAddCursorClass()'s argument
        var id = eventTag.getAttribute('data-id');

        _this.setData('dragDir','');
       
        if( type === 'day' && eventTag.getData('ltPropEvent').allDayEvent){ //restricting resize for day-allday events
            return;
        }

        if( type === 'month' || ( type === 'week' && (isAllDayEvent( eventTag )||_this.getData('ltPropMultiUserView')) ) ){
            var tags = $L('lyte-scheduler-event-tag[data-id="'+ id + '"]');
            if( Math.abs(startX - right ) < diff ){
                if( eventTag === tags[tags.length-1] ){
                    _this.setData('dragDir','right');
                }
            }
            else if( Math.abs(startX - left-5) < diff ){ //-5 to extend grip for resize
                if( eventTag === tags[0] ){
                    _this.setData('dragDir','left');
                }
            }
            
        }
        else if( type === 'day' || type === 'week' ){
            if( type === 'day' && _this.getData('ltPropMultiUserView')){
                if( Math.abs(startX - right ) < diff ){
                    _this.setData('dragDir','bottom');
                }
                else if( Math.abs(startX - left ) < diff ){
                    _this.setData('dragDir','top');
                }
            }
            else{
                //if( Math.abs(startY - bottom ) < diff ){
                    _this.setData('dragDir','bottom');
                //}
                // else{                                 //draggable will handle this
                //     _this.setData('dragDir','top');
                // }
            }
        }
        
        // if( !_this.getData('dragDir') ){ //if i return here, event.preventDefault won't happen during hover, 
        //     return;                          //so weird ui behaviour happens
        // }

        _this.setData('isResizing',true);
        _this.setData('currEventTag',eventTag.getAttribute('data-id'));

        var firstTr;
       
        if( type === 'month' || ( type === 'week' && (isAllDayEvent( eventTag )||_this.getData('ltPropMultiUserView')) ) ){
            firstTr = _this.$node.querySelector('td.lyteSchedulerDate');
            firstTrBound = firstTr.getBoundingClientRect();
            _this.setData('breakpoint',firstTrBound.width/2);
            _this.setData('ybreakpoint',firstTrBound.height/2);//used when dragged diagonally(both brkpoints are used)
        }
        else if( type === 'day' || type === 'week' ){
            if( type === 'day' && _this.getData('ltPropMultiUserView')){
                firstTr = _this.$node.querySelector('td.lyteSchedulerTimeLineEvent');
                firstTrBound = firstTr.getBoundingClientRect();
                _this.setData('breakpoint',firstTrBound.width/2);
                _this.setData('quadrant',firstTrBound.width/4);
            }
            else{
                firstTr = _this.$node.querySelector('tr.lyteSchedulerDate');
                firstTrBound = firstTr.getBoundingClientRect();
                _this.setData('breakpoint',firstTrBound.height/2);
                _this.setData('quadrant',firstTrBound.height/4);
            }
         
        }
        
        _this.setData('curPgX',event.pageX);
        _this.setData('curPgY',event.pageY);

    }

    function isAllDayEvent( tag ){
        var td = $L( tag ).closest('td.lyteSchedulerDate')[0];
        if( !td ){return;}
        var tr = $L( td ).closest('tr')[0];
        if( !tr ){return;}

        return tr.classList.contains('lyteSchedulerWeekViewAllDayRow')
    }

    function checkAndIncreaseScrollY( _this, event, mouseMoveHandler, int ){
        if( event.clientY ){
            _this.setData('tempResizeClientY',event.clientY);//rename this temp and check othersssss!!!
        }
        if( !_this.getData('isResizing') || intervalId ){
            return;
        }

        var wrapper = $L(_this.$node).find('div.lyteSchedulerViewWrapper')[0];
        var wrapperBound = wrapper.getBoundingClientRect();
        var pageX, pageY;
        var scrollDiff = int;//30
        var checkDiff = 20;
        var intervalDuration = 200;

        if( event.clientY >=  wrapperBound.bottom - checkDiff ){
            intervalId = setInterval(function(){    //need to change this to requestAnimationFrame method!
                
                if( !pageY ){
                    pageX = event.pageX;
                    pageY = event.pageY// + scrollDiff;
                }
             
                if( (_this.getData('tempResizeClientY') <  wrapperBound.bottom - checkDiff ) || !_this.getData('isResizing') || !intervalId ){
                    clearInterval( intervalId );
                    intervalId = null;
                    return;
                }

                wrapper.scrollTop += scrollDiff;

                var eveSim = {
                    pageX: pageX,
                    pageY: pageY
                };

                _this.setData('curPgY',_this.getData('curPgY')-int); 
                mouseMoveHandler( eveSim );
               
            }, intervalDuration);
        }
        
            
    }

    function checkAndAddCursorClass( _this, event, diff ){
        //event.target or find 'eventTag' by looping through elementsFromPoint(e.pgx,e.pgy) ??
        var eventTag = $L(event.target).closest('lyte-scheduler-event-tag')[0];
        if( !eventTag || eventTag.classList.contains('lyteSchedulerNoDrag') || eventTag.classList.contains('lyteSchedulerParticipantEvent')){
            return;
        }

        var startY = event.pageY;
        var startX = event.pageX;
        var type = _this.getData('ltPropSchedulerView');
        var isMultiUserView = _this.getData('ltPropMultiUserView');
        var isResizing = _this.getData('isResizing');

        if( type === 'day' && eventTag.getData('ltPropEvent').allDayEvent){
            return;
        }

        if( type === 'month' || ( type === 'week' && (isAllDayEvent( eventTag )||_this.getData('ltPropMultiUserView')) ) || ( type === 'day' && isMultiUserView ) ){
            var givenLen = startX;
            var rightLen = eventTag.getBoundingClientRect().right + window.scrollX;
            var leftLen = eventTag.getBoundingClientRect().left + window.scrollX;

            var id = eventTag.getAttribute('data-id');
            var tags = $L('lyte-scheduler-event-tag[data-id="'+ id + '"]');

            if( Math.abs( givenLen - rightLen ) < diff && eventTag === tags[tags.length-1]){
                if( type === 'week' && (isAllDayEvent( eventTag ) || _this.getData('ltPropMultiUserView')) ){  //check to restrict resize where orig start in some other week, but visually start in currWeek
                    var rect = eventTag.getBoundingClientRect();
                    var arr = document.elementsFromPoint( rect.right, rect.top);
                    var td = arr.find(function(elem){
                        return elem.nodeName === 'TD' && elem.classList.contains('lyteSchedulerDate');
                    });
                    if( td ){
                        td = td.querySelector('div.scheduler-event-div');
                        var given = td.getAttribute('data-date');
                        var check = eventTag.getData('ltPropEvent').end.split(" ")[0];
                        if( given !== check){
                            return;
                        }
                    }
                }
               
                eventTag.classList.remove('lyteSchedulerDragCursorLeft');
                eventTag.classList.add('lyteSchedulerDragCursorRight');
            }
            else if( Math.abs( givenLen - leftLen ) < diff && eventTag === tags[0]){
                if( type === 'week' && (isAllDayEvent( eventTag ) ||_this.getData('ltPropMultiUserView')) ){
                    var rect = eventTag.getBoundingClientRect();
                    var arr = document.elementsFromPoint( rect.left, rect.top);
                    var td = arr.find(function(elem){
                        return elem.nodeName === 'TD' && elem.classList.contains('lyteSchedulerDate');
                    });
                    if( td ){
                        td = td.querySelector('div.scheduler-event-div');
                        var given = td.getAttribute('data-date');
                        var check = eventTag.getData('ltPropEvent').start.split(" ")[0];
                        if( given !== check){
                            return;
                        }
                    }
                }
              
                eventTag.classList.remove('lyteSchedulerDragCursorRight');
                eventTag.classList.add('lyteSchedulerDragCursorLeft');
            }
            else{
                eventTag.classList.remove('lyteSchedulerDragCursorRight');
                eventTag.classList.remove('lyteSchedulerDragCursorLeft');
            }
        }
        else if( type === 'day' ||  type === 'week' ){
            var givenLen = startY;
            var checkLen = eventTag.getBoundingClientRect().bottom + window.scrollY;

            // if( Math.abs( givenLen - checkLen ) < diff ){
            if( event.target.tagName === 'SPAN' && event.target.classList.contains('lyteSchedulerGrabResize') ){
                // eventTag.classList.remove('lyteSchedulerDragCursorGrab'); //since draggable gonna handle these
                eventTag.classList.add('lyteSchedulerDragCursorDown');
            }
            else{
                eventTag.classList.remove('lyteSchedulerDragCursorDown');
                // if( isResizing ){
                //     eventTag.classList.remove('lyteSchedulerDragCursorGrab');
                //     eventTag.classList.add('lyteSchedulerDragCursorGrabbing');
                // }
                // else{
                //     eventTag.classList.remove('lyteSchedulerDragCursorGrabbing');
                //     eventTag.classList.add('lyteSchedulerDragCursorGrab');
                // }
            }
        }
    }

    function updateEventObj( eventTag, eventObj, newDate, _this ){

        var format = _this.getData( 'ltPropFormat' );
        var key = _this.getData( 'dragDir' );
        var isMultiUserView = _this.getData( 'ltPropMultiUserView' );
        var type = _this.getData( 'ltPropSchedulerView' );
        var interval = isMultiUserView && type==='day' ?  60 : _this.getData('ltPropTimeLine');

        if( !(eventObj && key && newDate) ){
            return false;
        }
        if( key === 'top' ){         
            if( type === 'day' && isMultiUserView ){
                var endDate = $L.moment( eventObj.end, format );

                if( endDate.isSame( newDate ) || ifStartMoreThanEnd( endDate, newDate ) ){   
                    return false;       
                } 
                Lyte.objectUtils( eventObj, "add" , 'start' , newDate.format('DD-MM-YYYY hh:mm A') );
                return true;
            }
            else{
                var oldStartDate = $L.moment( eventObj.start, format );
                var oldEndDate = $L.moment( eventObj.end, format );
                var diff = oldStartDate.fromNow( oldEndDate );
                var cloneStartDate = $L.moment( newDate.format('DD-MM-YYYY hh:mm A'),format);
    
                newDate.add(diff.timestamp,'milliseconds');
    
                var lastTr = getLastTr( _this, eventTag );
    
                if( !lastTr ){
                    return false;
                }
                var lastTrDate = $L.moment( oldStartDate.format('DD-MM-YYYY') + ' ' + lastTr.getAttribute('data-time') , format);
                lastTrDate.add(interval-1,'minutes');
    
                var diffFromLastTr = newDate.fromNow( lastTrDate );
    
                if( diffFromLastTr.past ){ //reducing height when dragged down from already at rock bottom 
                    Lyte.objectUtils( eventObj, "add" , 'start' , cloneStartDate.format('DD-MM-YYYY hh:mm A') );
                    Lyte.objectUtils( eventObj, "add" , 'end' , lastTrDate.format('DD-MM-YYYY hh:mm A') );
                    return true;
                }
                else{
                    Lyte.objectUtils( eventObj, "add" , 'start' , cloneStartDate.format('DD-MM-YYYY hh:mm A') );
                    Lyte.objectUtils( eventObj, "add" , 'end' , newDate.format('DD-MM-YYYY hh:mm A') );
                    return true;
                }
            }      
        }
        else if( key === 'bottom' ){       
            var startDate = $L.moment( eventObj.start, format );

            if( startDate.isSame( newDate ) || ifEndLessThanStart( startDate, newDate ) ){   
                return false;       
            } 
            Lyte.objectUtils( eventObj, "add" , 'end' , newDate.format('DD-MM-YYYY hh:mm A') );
            return true;
        }
        else if( key === 'left' ){
            // var oldStartDate = $L.moment( eventObj.start, format );
            // var oldEndDate = $L.moment( eventObj.end, format );
            // var diff = oldStartDate.fromNow( oldEndDate );
            // var cloneStartDate = $L.moment( newDate.format('DD-MM-YYYY hh:mm A'),format);

            // newDate.add(diff.timestamp,'milliseconds');

            // var lastTr = getLastTr( _this, eventTag );

            // if( !lastTr ){
            //     return false;
            // }
            // var lastTrDate = $L.moment( lastTr.querySelector('.scheduler-event-div').getAttribute('data-date') + ' ' + "12:00 AM" , format);
            // var diffFromLastTr = newDate.fromNow( lastTrDate );

            // if( diffFromLastTr.past ){ 
            //     //reducing height when dragged down from pos which is already at rock bottom 
            //     Lyte.objectUtils( eventObj, "add" , 'start' , cloneStartDate.format('DD-MM-YYYY hh:mm A') );
            //     Lyte.objectUtils( eventObj, "add" , 'end' , lastTrDate.format('DD-MM-YYYY hh:mm A') );
            //     return true;
            // }
            // else{
            //     Lyte.objectUtils( eventObj, "add" , 'start' , cloneStartDate.format('DD-MM-YYYY hh:mm A') );
            //     Lyte.objectUtils( eventObj, "add" , 'end' , newDate.format('DD-MM-YYYY hh:mm A') );
            //     return true;
            // }

            //commented above coz, draggable will be done through plugin
            var endDate = $L.moment( eventObj.end, format );

            if( ifStartMoreThanEnd( endDate, newDate ) ){ 
                return false;       
            } 
            Lyte.objectUtils( eventObj, "add" , 'start' , newDate.format('DD-MM-YYYY hh:mm A') );
            return true;
        
        }
        else if( key === 'right' ){
            var startDate = $L.moment( eventObj.start, format );

            //removed for monthview ( coz startDate can be same as endDate in monthView but not in dayView )
            if( /*startDate.isSame( newDate ) ||*/ ifEndLessThanStart( startDate, newDate ) ){ 
                return false;       
            } 
            Lyte.objectUtils( eventObj, "add" , 'end' , newDate.format('DD-MM-YYYY hh:mm A') );
            return true;
        }

    }

    function getLastTr( scheduler, tag ) {
        var type = scheduler.getData('ltPropSchedulerView');
        var arr;
        if( isAllDayEvent( tag )){
            arr = scheduler.$node.querySelectorAll('td.lyteSchedulerAllDayEvent');
        }
        else if( type !== 'month' ){
            arr = scheduler.$node.querySelectorAll('tr.lyteSchedulerDate.lyteSchedulerTimeLineEvent');
        }
        else{
            arr = scheduler.$node.querySelectorAll('td.lyteSchedulerDate');
        }

        if( arr.length == 0){
            return false;
        }
        return arr[arr.length-1];
    }

    function getFirstTr( scheduler ) {
        var arr = scheduler.$node.querySelectorAll('tr.lyteSchedulerDate.lyteSchedulerTimeLineEvent');

        if( arr.length == 0){
            return false;
        }
        return arr[0];
    }

    function checkIfValidTr( currTr, dragDir ){
        var check = currTr;
        if( check ){
            if( ( dragDir === 'top' || dragDir === 'bottom' ) && check.nodeName == 'TR' && 
                  check.classList.contains('lyteSchedulerDate') && 
                  check.classList.contains('lyteSchedulerTimeLineEvent')){

                return true;
            }
            else if( ( dragDir === 'left' || dragDir === 'right' ) && check.nodeName == 'TR' && 
                  check.classList.contains('lyteSchedulerDate') ){

                return true;
            }
        }
        return false;
    }

    function ifEndLessThanStart( start, end ){
        var diff = start.fromNow( end );
        if( diff.past ){
            return true;
        }

        return false;
    }

    function ifStartMoreThanEnd( end, start ){
        var diff = start.fromNow( end );
        if( diff.past ){
            return true;
        }

        return false;
    }

    function findResultTd( arr, type, tag, _this ){

        if( type === 'month' || type === 'week' && (isAllDayEvent( tag )||_this.getData('ltPropMultiUserView')) ){
            for( ind=0;ind<arr.length;ind++ ){  //instead of checking innerHTML, can lookup for a particular class by adding it in html
                var elem = arr[ind];
                if( elem.nodeName === 'TD' &&
                    elem.classList.contains('lyteSchedulerDate') ){
                    
                    return elem;
                }
            }
        }

        if( type === 'day' && _this.getData('ltPropMultiUserView') ){
            for( ind=0;ind<arr.length;ind++ ){  //instead of checking innerHTML, can lookup for a particular class by adding it in html
                var elem = arr[ind];
                if( elem.nodeName === 'TD' &&
                    elem.classList.contains('lyteSchedulerTimeLineEvent') ||
                    elem.classList.contains('lyteSchedulerDate') ||
                    elem.classList.contains('lyteSchedulerUserCol') ){
                    
                    return elem;
                }
            }
        }

        if( type === 'day' || type === 'week' ){
            for( ind=0;ind<arr.length;ind++ ){  //instead of checking innerHTML, can lookup for a particular class by adding it in html
                var elem = arr[ind];
                if( elem.nodeName === 'TD' && 
                    elem.parentElement && 
                    elem.parentElement.nodeName === 'TR' && 
                    elem.parentElement.classList.contains('lyteSchedulerDate') && 
                    elem.parentElement.classList.contains('lyteSchedulerTimeLineEvent') ){
                    //apparently tr is not found directly in the array
                    return elem;
                }
            }
        }
       

        return false;
    }

    function getTrOfCurDate( e, eventObj, retParTr, _this, tagDiv ){
        var format = _this.getData('ltPropFormat');
        var dragDir = _this.getData('dragDir');
        var currDate, currTr,currQuad;
        var type = _this.getData('ltPropSchedulerView');
        var isMultiUserView = _this.getData('ltPropMultiUserView');
        var interval = isMultiUserView && type==='day' ?  60 : _this.getData('ltPropTimeLine');
        var quad;

        if( dragDir === 'top' || dragDir === 'left' ){
            currDate = $L.moment( eventObj.start , format );
        }
        else if( dragDir === 'bottom' || dragDir === 'right' ){
            currDate = $L.moment( eventObj.end , format );
        }

        if( dragDir === 'top' || dragDir === 'bottom' ){
            var min = parseInt(currDate.format('mm'));
            var res = min - min % interval;
            res = String(res).padStart(2, '0');
            var format = currDate.format('hh') + ':' + res + currDate.format(' A');

            if( type === 'day' && isMultiUserView ){
                currTr = _this.$node.querySelector('td>div[data-time="' + format + '"]');
            }
            else{
                currTr = _this.$node.querySelector('tr[data-time="' + format + '"]');
            }
            // quad = Math.floor(Math.abs(currTr.getBoundingClientRect().top + window.scrollY - e.pageY) / _this.getData('quadrant'));
        }
        else if( dragDir === 'left' || dragDir === 'right' ){
            var d = _this.$node.querySelector('td>div[data-date="' + currDate.format('DD-MM-YYYY') + '"]');
            if( !d ){ return; }
            currTr = d.parentElement;
        }

        var oldCurrTr = currTr;
        if( typeof retParTr === 'object' ){
            if( retParTr.includes('top') ){
                var parCurrTr = $L(currTr).closest('tr')[0];
                if( parCurrTr.previousElementSibling ){
                    var temp = parCurrTr.previousElementSibling;
                    var ind = Array.from( parCurrTr.children ).indexOf( currTr );
                    if( ind != -1){
                        currTr = temp.children[ind];
                    }
                }
            }
            else if( retParTr.includes('bottom') ){
                var parCurrTr = $L(currTr).closest('tr')[0];
                if( parCurrTr.nextElementSibling ){
                    var temp = parCurrTr.nextElementSibling;
                    var ind = Array.from( parCurrTr.children ).indexOf( currTr );
                    if( ind != -1){
                        currTr = temp.children[ind];
                    }
                }
            }
            if( retParTr.includes('next')){
                retParTr = 'next';
            }
            else if( retParTr.includes('prev')){
                retParTr = 'prev';
            }
        }

        if( currTr && retParTr == 'next'  ){
            if( type === 'day' || (type === 'week' && (!isAllDayEvent( tagDiv )&&!_this.getData('ltPropMultiUserView'))) ){
                return retParTr;
            }

            if( currTr.nextElementSibling && currTr.nextElementSibling.classList.contains('lyteSchedulerDate') ){
                return currTr.nextElementSibling;
            }
            else if( type!=='week' && currTr.parentElement.nodeName === 'TR' && currTr.parentElement.nextElementSibling ){  //added that !=week check to tackle this issue://week-multiview: keep event in last 3 days, drag from left to right side beyond last day, //event grows to 4days left side
                var arr = Array.prototype.slice.call( currTr.parentElement.nextElementSibling.children );
                var filteredArr = arr.filter( function( elem ){
                    return elem.nodeName === 'TD' && elem.classList.contains('lyteSchedulerDate');
                });
                return filteredArr[0];
            }
        }
        else if( currTr && retParTr == 'prev' ){
            if( type === 'day' || type === 'week' && (!isAllDayEvent( tagDiv )&&!_this.getData('ltPropMultiUserView')) ){
                return retParTr;
            }

            if( currTr.previousElementSibling && currTr.previousElementSibling.classList.contains('lyteSchedulerDate') ){
                return currTr.previousElementSibling;
            }
            else if( type!=='week' && currTr.parentElement.nodeName === 'TR' && currTr.parentElement.previousElementSibling ){
                var arr = Array.prototype.slice.call( currTr.parentElement.previousElementSibling.children )
                var filteredArr = arr.filter( function( elem ){
                    return elem.nodeName === 'TD' && elem.classList.contains('lyteSchedulerDate');
                });
                return filteredArr[filteredArr.length - 1];
            }
        }

        if( type != 'month' && currTr && retParTr == 'prev' && getFirstTr( _this ) == currTr ){
            _this.setData('dragDir','bottom');
            return getTrOfCurDate( e, eventObj, 'prev', _this, tagDiv );
            //return end time if the corner case is true

        } //reducing height when dragged prev from first tr

        if( oldCurrTr != currTr ){
            return currTr;
        }

        return false;
    }

    function getNextOrPrevToBreakPoint( e, eventObj, parentTr, _this ){
        var pgX = e.pageX;
        var pgY = e.pageY;
        var brkPt = _this.getData('breakpoint');
        var yBrkPt = _this.getData('ybreakpoint');
        var curX = _this.getData('curPgX');
        var curY = _this.getData('curPgY');
        var dragDir = _this.getData('dragDir');
        var format = _this.getData('ltPropFormat');
        var quadrant = _this.getData('quadrant');
        var isMultiUserView = _this.getData('ltPropMultiUserView');
        var view = _this.getData('ltPropSchedulerView');
      
        if( dragDir === 'top' ){
            if (view === 'day' && isMultiUserView){
                if( Math.abs( pgX - curX ) > quadrant ){
                    return pgX - curX > 0 ? 'next' : 'prev';
                }
            }
            else{
                if( Math.abs( pgY - curY ) > quadrant ){
                    return pgY - curY > 0 ? 'next' : 'prev';
                }
            }
        }
        else if( dragDir === 'bottom' ){

            // var currDate = $L.moment( eventObj.end , format );
            // var tempTr = parentTr.nextElementSibling ? parentTr.nextElementSibling : parentTr;
            // var newDate = $L.moment( currDate.format("DD-MM-YYYY") + ' ' + tempTr.getAttribute('data-time'), format);
            // var diff = currDate.fromNow( newDate );
            // // if( currDate.format("hh:mm A") === parentTr.getAttribute('data-time')){
            // //     return false;
            // // }
            // if( diff && diff.timestamp == 0 ){
            //     return false;
            // }

            // return diff.past ? 'prev' : 'next';
            if (view === 'day' && isMultiUserView){
                if( Math.abs( pgX - curX ) > quadrant ){
                    return pgX - curX > 0 ? 'next' : 'prev';
                }
            }
            else{
                if( Math.abs( pgY - curY ) > quadrant ){
                    return pgY - curY > 0 ? 'next' : 'prev';
                }
            }
        }
        else if( dragDir === 'left'){
            var ret = [];

            if( Math.abs( pgY - curY ) > yBrkPt ){
                ret.push( pgY - curY > 0 ? 'bottom' : 'top' );
            }
            if( Math.abs( pgX - curX ) > brkPt ){
                ret.push( pgX - curX > 0 ? 'next' : 'prev' );
            }

            if( ret[0] === 'next' || ret[0]==='prev' ){
                return ret[0];
            }

            return ret;
        }
        else if( dragDir === 'right' ){
            var currDate = $L.moment( eventObj.end , format );
            var oldTime = currDate.format('hh:mm A') ? currDate.format('hh:mm A') : "12:00 AM";
            var div = parentTr.querySelector('.scheduler-event-div');
            if( !div ){
                return false;
            }
            var newDate = $L.moment( div.getAttribute('data-date') + ' ' + oldTime, format);
            var diff = currDate.fromNow( newDate );
            // if( currDate.format("hh:mm A") === parentTr.getAttribute('data-time')){
            //     return false;
            // }
            if( diff && diff.timestamp == 0 ){
                return false;
            }
            return diff.past ? 'prev' : 'next';
        }

        return false;
    }

})();
