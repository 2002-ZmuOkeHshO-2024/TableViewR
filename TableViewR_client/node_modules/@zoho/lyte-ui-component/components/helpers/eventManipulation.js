( function() {
	var eventManipulator = function( format ) {
		this.events = [];
		this.format = format;
	};
	var hiddenObj;
	var allDayHidden = {};
	eventManipulator.prototype.addEvents = function( events ) {
		this.events = this.events.concat( events );
		this.sortEvents();
	}
	eventManipulator.prototype.removeEvents = function( eventsToRemove ) {
		var that = this;

		this.events.filter( function( event ) {
			return that.shouldRemoveEvent( eventsToRemove, event );
		} );
	}
	eventManipulator.prototype.shouldRemoveEvent = function( eventsToRemove, event ) {
		for( var i = 0; i < eventsToRemove.length; i++ ) {
			if( event.id === eventsToRemove[ i ].id ) {
				return false;
			}
		}

		return true;
	}
	eventManipulator.prototype.sortEvents = function() {
		var that = this;
		this.events.sort( function( eventA, eventB ) {
			if(eventA.overdue){
				return -1;
			} 
			if(eventB.overdue){
				return 1;
			}
			const sortBAfterA = -1,
			sortAAfterB = 1;
			var format = that.format,
			eventAStartDate = eventA.start,
			eventBStartDate = eventB.start,
			dateCompareObj = $L.moment( eventAStartDate, format ).fromNow( $L.moment( eventBStartDate, format ) ),
			differenceBetweenDates = dateCompareObj.timestamp;

			if( differenceBetweenDates != 0 ) {
				return differenceBetweenDates > 0 ? sortBAfterA : sortAAfterB;
			}
			else {
				return that.compareEndDates( eventA, eventB );
			}
		} );
	}
	eventManipulator.prototype.compareEndDates = function( eventA, eventB ) {
		const sortBAfterA = -1,
		sortAAfterB = 1;

		var eventAEndDate = eventA.end || '',
		eventBEndDate = eventB.end || '',
		format = this.format,
		dateCompareObj = $L.moment( eventAEndDate, format ).fromNow( $L.moment( eventBEndDate, format ) ),
		differenceBetweenDates = dateCompareObj.timestamp;

		return differenceBetweenDates >= 0 ? sortAAfterB : sortBAfterA;
		
	}
	eventManipulator.prototype.generateEventObjArr = function( event , format, view , weekStart , isMultiUser , maxEvent , businessDays, isWorkingOnly){
		var schedulerevent =  event;
		var eventObj = {};
		hiddenObj = {};
		schedulerevent.forEach(function(item){
			var start_date = $L.moment(item.start,format);
			var end_date =  $L.moment(item.end,format);
			item.allDayEvent = true;
			if( start_date.format('DD-MM-YYYY') === end_date.format('DD-MM-YYYY') && !this.isAllDay(start_date,end_date) ){
				item.allDayEvent = false;
			}
			var start_format = start_date.format('DD-MM-YYYY');
			eventObj = addEventObj(start_date,eventObj,item,start_format,view,format , weekStart, isMultiUser , maxEvent, null ,businessDays, isWorkingOnly);
		});
		return {'eventObj': eventObj, 'hiddenObj': hiddenObj};
	}

	eventManipulator.prototype.generateEventObjArrNmore = function( event, format, view, weekStart, isMultiUser, AllDayMaxEvent , TimelineMaxEvent, businessDays, isWorkingOnly){	
		var schedulerevent =  event;
		var eventObj = {}, eventObjInfo = {};
		var hiddenObj = {};
		var allDay = {};
		schedulerevent.forEach(function(item){
			var start_date = $L.moment(item.start,format);
			var end_date =  $L.moment(item.end,format);
			var start_format = start_date.format('DD-MM-YYYY');
			item.allDayEvent = true;
			if( view === 'month' && isMultiUser ){
				var loop_date = $L.moment(item.start,format), loop_format;
				while( loop_date.fromNow( end_date ).past === false ) {
					loop_format = loop_date.format('DD-MM-YYYY');
					pushToEventObjWithoutGrp( hiddenObj, eventObj, item, loop_format, AllDayMaxEvent );
					loop_date.add(1,'day');
				}
			}else if( start_date.format('DD-MM-YYYY') === end_date.format('DD-MM-YYYY') && !this.isAllDay(start_date,end_date) ){
				item.allDayEvent = false;
				if(view == 'day'){
					eventObj = pushToTimeline( hiddenObj, eventObj, eventObjInfo, item, isMultiUser, view, format, start_format, TimelineMaxEvent );
				}else{
					pushToEventObj( hiddenObj, eventObj, eventObjInfo, item, isMultiUser, view, format, start_format, TimelineMaxEvent );
				}
			}else{
				allDay = addEventObj(start_date,allDay,item,start_format,view,format , weekStart, isMultiUser , AllDayMaxEvent, true ,businessDays, isWorkingOnly);
			}

		});
		eventObj.allDay = allDay;
		hiddenObj.allDay = allDayHidden;
		allDayHidden = {};
		return {'eventObj': eventObj, 'hiddenObj': hiddenObj};
	}
	isAllDay = function(start_date,end_date){
		if(start_date.format('DD-MM-YYYY') === end_date.format('DD-MM-YYYY' )){
			if(end_date.format('HH:mm A') == '23:59 PM' && start_date.format('HH:mm A') == '00:00 AM'){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	}
	pushToEventObjWithoutGrp = function( hiddenObj, eventObj, event, date, maxEvent , userid ,isparticipant){
		var user = userid ? userid : event.userid;
		if( !eventObj[date] || !eventObj[date][user] ){
			eventObj[date] = eventObj[date] ? eventObj[date] : {};
			
		}
		
		var objLen = Object.keys(eventObj[date]).length;
		if( objLen >= maxEvent && !eventObj[date][user] ){
			hiddenObj[date] = hiddenObj[date] ? hiddenObj[date] : {};
			hiddenObj[date][user] = hiddenObj[date][user] ? hiddenObj[date][user] : [];
			hiddenObj[date][user].push( event );
			return;
		}
		if(!eventObj[date][user]){
			eventObj[date][user] = eventObj[date][user] ? eventObj[date][user] : [];
		}
		if(event.participantId && !isparticipant){
			event.participantId.forEach(function(participantEvent){
				var clonedEvent = $u.clone(event);
				clonedEvent.participantEvent = true;
				clonedEvent.participantId = participantEvent.id;
				pushToEventObjWithoutGrp(hiddenObj,eventObj,clonedEvent,date,maxEvent,participantEvent.id,true);
			})
		}
		eventObj[date][user].push(event);
	}
	pushToTimeline = function( hiddenObj, eventObj, eventObjInfo, event, isMultiUser, view, format, date, maxEvent, userid, isparticipant){
		var user = userid ? userid : event.userid;
		var start = $L.moment(event.start,format);
		var end = $L.moment(event.end,format)
		var startDate = start.format('DD-MM-YYYY');
	 	var start_time = start.format('h') + start.format('a');
		var end_time = end.format('h') + start.format('a');
		 if(!eventObj[startDate]){
			eventObj[startDate] = {};
		}
		if(!eventObj[startDate][user]){
			eventObj[startDate][user] = {};
			eventObj[startDate][user].count = 0;
		}
		if(event.participantId && !isparticipant){
			event.participantId.forEach(function(participantEvent){
				var clonedEvent = $u.clone(event);
				clonedEvent.participantEvent = true;
				clonedEvent.participantId = participantEvent.id;
				eventObj = pushToTimeline(hiddenObj,eventObj,eventObjInfo,clonedEvent,isMultiUser,view,format,date,maxEvent,participantEvent.id,true)
			})
		}
		if(!eventObj[startDate][user][start_time] || maxEvent > eventObj[startDate][user][start_time].length){
			if(!eventObj[startDate][user][start_time]){
				eventObj[startDate][user][start_time] = [];
			}

			eventObj[startDate][user][start_time].push(event);
			end.add(1,'hours');
			end_time = end.format('h') + start.format('a');
			var end_min = parseInt(end.format('m'));
			while(start_time !== end_time && startDate == start.format('DD-MM-YYYY') && end_min){
				start.add(1,'hours');
				start_time = start.format('h') + start.format('a');
				eventObj[startDate][user][start_time] = eventObj[startDate][user][start_time] ? eventObj[startDate][user][start_time] : [];
				eventObj[startDate][user][start_time].push({});
			}
			eventObj[startDate][user].count += 1; 
			
		}else{
			hiddenObj[startDate] = hiddenObj[startDate] ? hiddenObj[startDate] : {};
			if(!hiddenObj[startDate][user]){
				hiddenObj[startDate][user] = {};
			}
			hiddenObj[startDate][user] = hiddenObj[startDate][user] ? hiddenObj[startDate][user] : [];
			if(!hiddenObj[startDate][user][start_time]){
				hiddenObj[startDate][user][start_time] = [];
			}
			eventObj[startDate][user].count += 1; 
			hiddenObj[startDate][user][start_time].push(event);
		}
		return eventObj;
	}
	pushToEventObj = function( hiddenObj, eventObj, eventObjInfo, event, isMultiUser, view, format, date, maxEvent ){
		var user = event.userid;
		if( isMultiUser && view !== 'month' ){
			if( !eventObj[date] || !eventObjInfo[date] || !eventObj[date][user] || !eventObjInfo[date][user] ){
				eventObj[date] = eventObj[date] ? eventObj[date] : {};
				eventObjInfo[date] = eventObjInfo[date] ? eventObjInfo[date] : {};
				eventObj[date][user] = eventObj[date][user] ? eventObj[date][user] : {}
				eventObjInfo[date][user] = eventObjInfo[date][user] ? eventObjInfo[date][user] : {}

				createNewGrp( event, eventObj[date][user], eventObjInfo[date][user]);
			}
			else{
				var ret = isEventIntersect( event, eventObjInfo[date][user], format );
				if( ret !== false ){
					var objLen = eventObj[date][user]['grp'+ret].length;
					
					if( objLen >= maxEvent ){
							hiddenObj[date] = hiddenObj[date] ? hiddenObj[date] : {};
							hiddenObj[date][user] = hiddenObj[date][user] ? hiddenObj[date][user] : {};
							hiddenObj[date][user]['grp'+ret] = hiddenObj[date][user]['grp'+ret] ? hiddenObj[date][user]['grp'+ret] : [];

							hiddenObj[date][user]['grp'+ret].push( event );
							return;
					}
					
					eventObj[date][user]['grp'+ret].push(event);

					var oldStart = $L.moment(eventObjInfo[date][user]['grp'+ret].start,format), oldEnd = $L.moment(eventObjInfo[date][user]['grp'+ret].end,format);
					var newStart = $L.moment(event.start,format), newEnd = $L.moment(event.end,format);

					if( oldStart.fromNow(newStart).past ){
						eventObjInfo[date][user]['grp'+ret].start = event.start;
					}
					if( !(oldEnd.fromNow(newEnd).past) ){
						eventObjInfo[date][user]['grp'+ret].end = event.end;
					}
				}
				else{
					createNewGrp( event, eventObj[date][user], eventObjInfo[date][user]);
				}
			}
		}
		else{
			if( !eventObj[date] || !eventObjInfo[date] ){
				eventObj[date] = {};
				eventObjInfo[date] = {};
				createNewGrp( event, eventObj[date], eventObjInfo[date] );
			}
			else{
				var ret = isEventIntersect( event, eventObjInfo[date], format );
				if( ret !== false ){
					var objLen = eventObj[date]['grp'+ret].length;

					if( objLen >= maxEvent ){
							hiddenObj[date] = hiddenObj[date] ? hiddenObj[date] : {};
							hiddenObj[date]['grp'+ret] = hiddenObj[date]['grp'+ret] ? hiddenObj[date]['grp'+ret] : [];

							hiddenObj[date]['grp'+ret].push( event );
							return;
					}

					eventObj[date]['grp'+ret].push(event);

					var oldStart = $L.moment(eventObjInfo[date]['grp'+ret].start,format), oldEnd = $L.moment(eventObjInfo[date]['grp'+ret].end,format);
					var newStart = $L.moment(event.start,format), newEnd = $L.moment(event.end,format);

					if( oldStart.fromNow(newStart).past ){
						eventObjInfo[date]['grp'+ret].start = event.start;
					}
					if( !(oldEnd.fromNow(newEnd).past) ){
						eventObjInfo[date]['grp'+ret].end = event.end;
					}
				}
				else{
					createNewGrp( event, eventObj[date], eventObjInfo[date]);
				}
			}
		}
	}

	isEventIntersect = function( event, eventObjInfo, format){
		var ind = 0;
		if(Object.keys(eventObjInfo).length === 0){
			return false;
		}

		for( var key in eventObjInfo ){
			var cur = eventObjInfo[key];

			if( isBetweenEvents( cur.start, event.start, cur.end, format ) || isBetweenEvents( cur.start, event.end, cur.end, format ) ){
				return ind;
			}
			ind += 1;
		}
		return false;
	}

	createNewGrp = function( event, eventObj, eventObjInfo ){
		var len = Object.keys(eventObj).length;
		eventObj['grp'+len] = [];
		eventObjInfo['grp'+len] = {
			start: event.start,
			end: event.end
		};
		eventObj['grp'+len].push(event);
	}

	isBetweenEvents = function( start, curr_date, end, format ) {
		return $L.moment(start,format).fromNow($L.moment( curr_date,format )).past  === false && $L.moment(end,format).fromNow($L.moment( curr_date,format )).past  === true
			|| $L.moment(start,format).isSame($L.moment( curr_date,format )) || $L.moment(end,format).isSame($L.moment( curr_date,format ));
	}

	eventManipulator.prototype.isinBetween = function(date,eventObj,event,indexDate,view,format , weekStart, isMultiUser , maxEvent){
		return isinBetween(date,eventObj,event,indexDate,view,format , weekStart, isMultiUser , maxEvent);
	}
	addEventObj = function(date,eventObj,event,indexDate,view,format , weekStart, isMultiUser , maxEvent,isallDay, businessDays, isWorkingOnly){
		var start_format = date.format('DD-MM-YYYY');
		var start_date =  $L.moment(event.start,format);
		var cloneObject = $u.clone(event);
		var weekstart = weekStart === undefined ? 0 : weekStart;
		if(start_format == start_date.format('DD-MM-YYYY')){
			cloneObject.StartOfEvent = true;
		}else{
			delete cloneObject.middleofevent;
			cloneObject.endOfevent  =true;
		}
		if( isexceedMaxevent(eventObj,indexDate,event,isMultiUser,view,maxEvent) && (cloneObject.allDayEvent || view == 'month' || (isMultiUser && view == 'week'))  ){
			addHiddenObj(indexDate,cloneObject,event,isMultiUser,view,isallDay,maxEvent, businessDays, isWorkingOnly,undefined,format,eventObj);
			if(view == 'month' && !isMultiUser){
				return eventObj;
			}
		}else{
			eventObj = pushEvent(eventObj,event.userid,indexDate,cloneObject,isMultiUser,view, businessDays, isWorkingOnly,maxEvent,false,format)
		}	
		var end_date = $L.moment(event.end,format);
		if(( view !== 'week' )  && ( isMultiUser || ( view== 'day' && !isMultiUser))){
			if(start_format !== end_date.format('DD-MM-YYYY') ){
				date.add(1,'date',true);
				indexDate = date.format('DD-MM-YYYY');
				eventObj = addEventObj(date,eventObj,event,indexDate,view,format,weekStart, isMultiUser ,maxEvent,isallDay,businessDays, isWorkingOnly);
			}
		}
		else{
			if(isWorkingOnly && view == 'week'){
				date = findStartOfWorkingDay(date,businessDays);
			}
			var curr_date = ((6 - weekstart   ) + date.get('day') + 1) % 7;
			var EndOftheWeek  = $L.moment(date).add((6 - curr_date),'date',true);
			var start = start_format;
			if( isinBetween( start_format, EndOftheWeek.format('DD-MM-YYYY'), end_date.format('DD-MM-YYYY'), format )){
				if( !cloneObject.StartOfEvent ){
					delete cloneObject.endOfevent;
					cloneObject.middleofevent = true;
				}
				if(cloneObject.allDayEvent){
					eventObj = addDummyEvent(start,EndOftheWeek.format('DD-MM-YYYY'),event,eventObj,date,isMultiUser,view,maxEvent,businessDays, isWorkingOnly,format);
				}

				eventObj = addEventObj(EndOftheWeek.add(1,'date',true),eventObj,event,EndOftheWeek.format('DD-MM-YYYY'),view,format,weekStart, isMultiUser ,maxEvent,isallDay,businessDays, isWorkingOnly);
			}else{
				if(cloneObject.allDayEvent){
					eventObj = addDummyEvent(start,end_date.format('DD-MM-YYYY'),event,eventObj,date,isMultiUser,view,maxEvent, businessDays, isWorkingOnly,format);
				}
			}

		}	
		return eventObj;
	}
	isinBetween =  function(start , curr_date, end, format){
		format = (format.split(' '))[0];
		return $L.moment(start, format).fromNow($L.moment( curr_date, format )).past  === false && $L.moment(end,format).fromNow($L.moment( curr_date, format )).past  === true;
	}
	pushEvent =  function(eventObj,user,date,event,isMultiUser,view, businessDays, isWorkingOnly,maxEvent,isparticipant,format,rowIndex,Og_eventObj){
		if(view == 'week' && isWorkingOnly ){
			var newStart = $L.moment( date, 'DD-MM-YYYY' );
			while( !businessDays.includes(newStart.get('day')) ){
				newStart.add(1,'date');
			}
			if(!$L.moment(event.end,format).fromNow(newStart).past && $L.moment(event.end,format).format('DD-MM-YYYY') !== newStart.format('DD-MM-YYYY')){
				return eventObj;
			}
			date = newStart.format('DD-MM-YYYY');
			if( isexceedMaxevent(eventObj,date,event,isMultiUser,view,maxEvent,user) ){
				addHiddenObj(date,event,event,isMultiUser,view,false, maxEvent,businessDays, false,user,format);
				return eventObj;
			}
		}
		if(isMultiUser && !isparticipant && event.participantId){
			event.participantId.forEach(function(participantEvent){
				var clonedEvent = $u.clone(event);
				clonedEvent.participantEvent = true;
				clonedEvent.participantId = participantEvent.id;
				Og_eventObj = Og_eventObj ? Og_eventObj : eventObj;
				if(isexceedMaxevent(Og_eventObj,date,event,isMultiUser,view,maxEvent,participantEvent.id)){
					addHiddenObj(date,hiddenObj,clonedEvent,isMultiUser,view,false, maxEvent,businessDays, isWorkingOnly,user,format);
				}else{
					pushEvent(Og_eventObj,participantEvent.id,date,clonedEvent,isMultiUser,view, businessDays, isWorkingOnly,maxEvent,true,format)
				}
			});
		}
		if(isMultiUser && view !== 'month' ){
			eventObj[date] = eventObj[date] ? eventObj[date] : [];
			eventObj[date][user] = eventObj[date][user] ? eventObj[date][user] : [];
			var findEmptySpace = findEmpty(eventObj[date][user]);
			if(!eventObj[date][user].count){
				eventObj[date][user].count = 0;
			}
			if(findEmptySpace !== undefined){
				eventObj[date][user][findEmptySpace] = event;
			}else{
				eventObj[date][user].push(event);
			}
			
			if(Object.keys(event).length){
				eventObj[date][user].count += 1;		
			}
				
		}else{
			eventObj[date] = eventObj[date] ? eventObj[date] : [];
			if(rowIndex !== undefined){
				eventObj[date][rowIndex] = event;
			}else{
				var Dummy_event = eventObj[date] ;
				var findEmptySpace = findEmpty(Dummy_event,date);
				var pos = findOverdueActivity(eventObj,event,date,format);
				if(pos){
					pos = pos > Dummy_event.length ? pos : Dummy_event.length;
					Dummy_event[pos] = event;
				}else if(findEmptySpace !== undefined){
					Dummy_event[findEmptySpace] = event;
				}else{
					Dummy_event.push(event)
				}
			}
			
		}
		return eventObj;
	}
	findOverdueActivity = function(eventObj,event,start,format){
		var startDate= $L.moment(start,'DD-MM-YYYY');
		var endDate = $L.moment(event.end,format);
		var count = 0
		for( const dateObj in eventObj){
			var curDate = $L.moment(dateObj,'DD-MM-YYYY');
			if(endDate.fromNow(curDate).past && !startDate.fromNow(curDate).past){
				for(var index = 0 ; index < eventObj[dateObj].length ; index++){
					var event = eventObj[dateObj][index];
					if(event && event.overdue){
						count = eventObj[dateObj].length;
					}
				}
			}
			
		}
		return count;

	}
	findEmpty = function(eventObj){
		for(var index = 0 ; index < eventObj.length ; index++){
			var event = eventObj[index];
			if(!event){
				return index;
			}
		}
		return undefined;
	}
	isexceedMaxevent = function(eventObj,indexDate,event,isMultiUser,view,MaxEvent,userid){
		var maxEvent = MaxEvent;
		var userid = userid ? userid : event.userid;
		if(isMultiUser  && view !== 'month' ){
			eventObj[indexDate] = eventObj[indexDate] ? eventObj[indexDate] : [];
			eventObj[indexDate][userid] = eventObj[indexDate][userid] ? eventObj[indexDate][userid] : [];
			var length;
			length = eventObj[indexDate][userid].length;
			return length >= maxEvent;
		}else{
			eventObj[indexDate] = eventObj[indexDate] ? eventObj[indexDate] : [];
			var length;
			if(view !== 'month' ){
				length = $u.groupBy(eventObj[indexDate],'allDayEvent').true;
				length = length ? length.length : 0;
			}else{
				length = eventObj[indexDate].length;
			}
			return length >= maxEvent;
		}
	}
	addHiddenObj = function(indexDate,cloneObject,event,isMultiUser,view,isallDay,maxEvent, businessDays, isWorkingOnly,user,format,eventObj){
		user = user ? user : event.userid; 
		if(isallDay){
			allDayHidden = this.pushEvent(allDayHidden,user,indexDate,cloneObject,isMultiUser,view, businessDays, isWorkingOnly,maxEvent,false,format,undefined,eventObj);
		}else{
			hiddenObj = this.pushEvent(hiddenObj,user,indexDate,cloneObject,isMultiUser,view, businessDays, isWorkingOnly,maxEvent,false,format,undefined,eventObj);
		}
		
	}
	addDummyEvent = function(start,end,event,eventObj,StartDate,isMultiUser,view,MaxEvent,businessDays, isWorkingOnly,format){
		while($L.moment(end,'DD-MM-YYYY').fromNow( $L.moment(start,'DD-MM-YYYY') ).past){
			var rowIndex =  findIndex(eventObj[StartDate.format('DD-MM-YYYY')],event.id);
			start = StartDate.add(1, 'date').format('DD-MM-YYYY');
			if( !isexceedMaxevent(eventObj,start,event,isMultiUser,view,MaxEvent) ){
				eventObj = pushEvent(eventObj,event.userid,start,{},isMultiUser,view,businessDays,false,MaxEvent,undefined,format,rowIndex);
			}
		}
		return eventObj;
	}
	findStartOfWorkingDay = function(date,businessDays){
		var newStart = $L.moment( date );
		while( !businessDays.includes(newStart.get('day')) ){
			newStart.set('date',newStart.get('date')+1);
		}
		return newStart;
	} 
	findIndex = function(eventArray,id){
		var index = 0;
		for(; index < eventArray.length ; index++){
			if(eventArray[index] && eventArray[index].id == id){
				return index;
			}
		}
		return index - 1;

	}
	_lyteUiUtils.eventManipulator = eventManipulator;
} )();
