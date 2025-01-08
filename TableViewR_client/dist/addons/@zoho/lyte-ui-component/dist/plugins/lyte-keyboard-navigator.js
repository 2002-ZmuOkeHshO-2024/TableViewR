//subscope elements will not be selected by mousemove event, unless parent is focused (use globalScopeArr)
//temp.commented out globalScopeArr
//if  preventHighlightWhenResetted is true, then 'changeScope' won't be valid (idk why; need to check)
;(function(){

    var configurationObjects=[],parentArr=[],globalIdInd=0,globalScopeArr=[];
        
    var keyDownHandler = function(event){ 

        if(isConfigObjsEmpty()){
            return;
        }

        if(event.key==="ArrowUp"){

            let options=findOptions();
            if(options && !options.includes('ArrowUp')){
                return;
            }

            if(!checkForInverse()){
                if(isFocusOnConfigObjs()){
                    event.preventDefault();
                }
                moveToPrevious();     
            }
        }
        else if(event.key==="ArrowDown"){

            let options=findOptions();
            if(options && !options.includes('ArrowDown')){
                return;
            }


            if(!checkForInverse()){
                if(isFocusOnConfigObjs()){
                    event.preventDefault();
                }
                moveToNext();
            }
        }
        else if(event.key==="PageUp"){

            let options=findOptions();
            if(options && !options.includes('PageUp')){
                return;
            }

            if(isFocusOnConfigObjs()){
                event.preventDefault();
            }
            scrollPageUpKey();
        }
        else if(event.key==="PageDown"){

            let options=findOptions();
            if(options && !options.includes('PageDown')){
                return;
            }

            if(isFocusOnConfigObjs()){
                event.preventDefault();
            }
            scrollPageDownKey();
        }
        else if(event.key==="Home"){

            let options=findOptions();
            if(options && !options.includes('Home')){
                return;
            }

            scrollToHomeElement();
        }
        else if(event.key==="End"){

            let options=findOptions();
            if(options && !options.includes('End')){
                return;
            }

            scrollToEndElement();
        }
        else if(event.key=="ArrowLeft"){

            let options=findOptions();
            if(options && !options.includes('ArrowLeft')){
                return;
            }


            if(checkForInverse()){
                if(isFocusOnConfigObjs()){
                    event.preventDefault();
                }
                moveToPrevious();
            }
            else if(checkForRowInput()){
                if(isFocusOnConfigObjs()){
                    event.preventDefault();
                }
                moveToPrevious('row');
            }
        }
        else if(event.key=="ArrowRight"){

            let options=findOptions();
            if(options && !options.includes('ArrowRight')){
                return;
            }

            if(checkForInverse()){
                if(isFocusOnConfigObjs()){
                    event.preventDefault();
                }
                moveToNext();
            }
            else if(checkForRowInput()){
                if(isFocusOnConfigObjs()){
                    event.preventDefault();
                }
                moveToNext('row');
            }
        }
        else if(event.key=="Enter"){
            checkForTriggerProp()
        }

    }

    var mouseMoveHandler = function(event){
        if(isConfigObjsEmpty()){
            return;
        }
        moveToEventTarget(event);
    }; 

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler );
        
    $L.prototype.keyboardNavigator=function(configurationObject){

        if(configurationObject === "destroy"){
            removePlugIn(this[0]);
            return;
        }

        if(configurationObject === "presence"){
            return checkPresenceOfPlugIn(this[0]);
        }

        if(configurationObject === "reset"){  //this will removed the selected class (addn. of sel class will be done only in findUtilObj())
            return resetSelectedClass(this[0]);
        }

        if(configurationObject === "resetToFirst"){   //this will remove the selected class and add the same to first valid element
            return resetToFirstSelectedClass(this[0]);
        }

        configurationObjects.push(configurationObject);
        parentArr.push(this[0]);

        let parentBody=document.querySelector(configurationObject.scope);
        var firstElem;
        if(configurationObject.highlightValue){
            firstElem=parentBody.querySelector(configurationObject.highlightValue);
        }
        else{
            firstElem = findValidFirstElem( configurationObject );
        }
        // let scopeArr = configurationObject.scope.split(",");
        // parent=document.querySelector(scopeArr[0]);
        // for( let ind=0;ind<scopeArr.length;ind++ ){
        //     if(scopeArr[ind]){
        //         let temp = document.querySelector(scopeArr[ind]);
        //         globalScopeArr.push(temp);
        //     }
        // }

        removeSelectedClass( this[0], configurationObject.selectedClass, configurationObject.scope );
        firstElem.classList.add(configurationObject.selectedClass);
        let focusableElement=this[0];
        // focusableElement.setAttribute('aria-controls',configurationObject.scope.slice(1));
        let ariaId=firstElem.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            firstElem.id=ariaId;

        }
        focusableElement.setAttribute('aria-activedescendant',firstElem.id);

    }

    function removeSelectedClass( elem, className, scope ){
        var arr=[],arr2=[];
        if( !className ){return;}
        if( elem ){
            arr = $L(elem).find('.'+className);
        }
        if( scope ){
            arr2 = $L(scope).find('.'+className);
        }
        for(var ind = 0;ind<arr.length;ind++){
            arr[ind].classList.remove(className);
        }
        for(var ind = 0;ind<arr2.length;ind++){
            arr2[ind].classList.remove(className);
        }
    }

    function readdToFirstValidElement( elem, configurationObject ){
        var firstElem = findValidFirstElem( configurationObject );
        var parent = document.querySelector(configurationObject.scope);

        if( firstElem ){
            parent.scrollTop=0;
            firstElem.classList.add(configurationObject.selectedClass);
            return true;
        }

        return false;
    }

    function findValidFirstElem( configurationObject ){
        var parentBody=document.querySelector(configurationObject.scope);
        var child=configurationObject.child,skipElements=configurationObject.skipElements;
        var listOfChildren= Array.from(parentBody.querySelectorAll(child));
        var elementsToSkip= Array.from(parentBody.querySelectorAll(skipElements));
        firstElem=listOfChildren[0];
        if( configurationObject.standardNavigationOrder ){
            var ind=0;
            while(firstElem!=null && elementsToSkip && elementsToSkip.includes(firstElem)){
                if(ind>=listOfChildren.length){
                break;
                }
                firstElem=listOfChildren[++ind];
            }
        }
        else{
            var ind=0;
            while(firstElem!=null && ((elementsToSkip && elementsToSkip.includes(firstElem)) || firstElem.disabled )){
                if(ind>=listOfChildren.length){
                    break;
                }
                firstElem=listOfChildren[++ind];
            }
        }

        return firstElem;
    }

    function findNewCurrentElement( configObj ){
        var firstValidElem = findValidFirstElem( configObj );
        if( !firstValidElem ){
            return;
        }
        firstValidElem.classList.add( configObj.selectedClass );
        return firstValidElem;
    }

    function moveToPrevious( isRow ){

        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,configObj=utilObj.configObj,currentElement=utilObj.currentElement;   
        let previousElement;

        if(parent===undefined || parent===null ){
            return false;
        }
        if( utilObj && utilObj.configObj && utilObj.configObj.ariaExpand ){
            if( !isAriaExpanded( utilObj.parCalled, utilObj.configObj.ariaExpand )){
                return;
            }
        }
        if( utilObj && utilObj.configObj && utilObj.configObj.dropdown ){
            if( !isDropdownOpen( utilObj.configObj.dropdown )){
                return;
            }
        }
        if( utilObj && utilObj.configObj && utilObj.configObj.customDropdownSel && utilObj.configObj.customDropdownClass ){
            if( !isCustomDropdownOpen( utilObj.configObj.customDropdownSel, utilObj.configObj.customDropdownClass )){
                return;
            }
        }

        if( !currentElement ){
            currentElement = findNewCurrentElement( configObj );
            parent.scrollTop = 0;
            previousElement = currentElement;
        }
        else{
            previousElement = isRow && isRow==='row' ? findPreviousRowElement() : findPreviousElement();
        }

        if(previousElement===undefined){
            return;
        }
        let focusableElement=utilObj.parCalled;
        if( configObj && configObj.onBeforeHighlight ){ //beforeCallback
            if( configObj.comp ){
                configObj.onBeforeHighlight.call( configObj.comp, currentElement, previousElement, 'keyboard' );
            }
            else{
                configObj.onBeforeHighlight( currentElement, previousElement, 'keyboard' );
            }
        }
        currentElement.classList.remove(configObj.selectedClass);
        previousElement.classList.add(configObj.selectedClass);
        if( configObj && configObj.onAfterHighlight ){ //afterCallback
            if( configObj.comp ){
                configObj.onAfterHighlight.call( configObj.comp, currentElement, previousElement, 'keyboard' );
            }
            else{
                configObj.onAfterHighlight( currentElement, previousElement, 'keyboard' );
            }
        }
        scrollParentToUp(previousElement);
        let ariaId=previousElement.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            previousElement.id=ariaId

        }
        focusableElement.setAttribute('aria-activedescendant',previousElement.id);
    }

    function moveToNext(isRow){

        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,configObj=utilObj.configObj,currentElement=utilObj.currentElement;
        let nextElement;

        if(parent===undefined || parent===null ){
            return false;
        }

        if( utilObj && utilObj.configObj && utilObj.configObj.ariaExpand ){
            if( !isAriaExpanded( utilObj.parCalled, utilObj.configObj.ariaExpand )){
                return;
            }
        }
        if( utilObj && utilObj.configObj && utilObj.configObj.dropdown ){
            if( !isDropdownOpen( utilObj.configObj.dropdown )){
                return;
            }
        }
        if( utilObj && utilObj.configObj && utilObj.configObj.customDropdownSel && utilObj.configObj.customDropdownClass ){
            if( !isCustomDropdownOpen( utilObj.configObj.customDropdownSel, utilObj.configObj.customDropdownClass )){
                return;
            }
        }

        if( !currentElement ){
            currentElement = findNewCurrentElement( configObj );
            parent.scrollTop = 0;
            nextElement = currentElement;
        }
        else{
            nextElement= isRow && isRow==='row' ? findNextRowElement() : findNextElement();
        }
       
        if(nextElement===undefined){
            return;
        }
        let focusableElement=utilObj.parCalled;
        if( configObj && configObj.onBeforeHighlight ){
            if( configObj.comp ){
                configObj.onBeforeHighlight.call( configObj.comp, currentElement, nextElement, 'keyboard' );
            }
            else{
                configObj.onBeforeHighlight( currentElement, nextElement, 'keyboard' );
            }
        }
        currentElement.classList.remove(configObj.selectedClass);
        nextElement.classList.add(configObj.selectedClass);
        if( configObj && configObj.onAfterHighlight ){
            if( configObj.comp ){
                configObj.onAfterHighlight.call( configObj.comp, currentElement, nextElement, 'keyboard' );
            }
            else{
                configObj.onAfterHighlight( currentElement, nextElement, 'keyboard' );
            }
        }
        scrollParentToDown(nextElement);       
        let ariaId=nextElement.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            nextElement.id=ariaId
        }
        focusableElement.setAttribute('aria-activedescendant',nextElement.id);
    }

    function moveToEventTarget(event){
        let utilObj=findUtilObj(document.activeElement, 'mouse');

        if(!utilObj || !utilObj.configObj || !utilObj.listOfChildren.includes(event.target) ){
            utilObj=findUtilObj(event.target.parentElement, 'mouse');
            let instElement=event.target.parentElement;
            while(utilObj && (utilObj.configObj==null||utilObj.configObj==undefined )){
                if(instElement==null||instElement==undefined||instElement.tagName=="BODY"||instElement.tagName=="HTML"){
                    break;
                }
                utilObj=findUtilObj(instElement=instElement.parentElement, 'mouse');
            }
            if( !utilObj || !utilObj.configObj){
                    return false;
            }
        }
        
        if( utilObj.configObj.ignoreMouseMove ){
            return;
        }
        
        let parent=utilObj.parent,configObj=utilObj.configObj,listOfChildren=utilObj.listOfChildren,elementsToSkip=utilObj.elementsToSkip,currentElement=utilObj.currentElement,focusableElement;
        if(parent===undefined||parent===null){
            return false;
        }
        // if( !currentElement ){
        //     currentElement = findNewCurrentElement( configObj );
        // }
        focusableElement=utilObj.parCalled;
        if( !elementsToSkip.includes(event.target) &&
            listOfChildren.includes(event.target)  ){
            // currentElement=parent.querySelector('.'+configObj.selectedClass);
            for(let ind=0;ind<utilObj.parents;ind++){
                if(!currentElement){
                    currentElement = utilObj.parents[ind].querySelector('.'+configObj.selectedClass);
                }
            }
            if( !currentElement ){
                currentElement = findNewCurrentElement( configObj );
            }
            if( !currentElement ){
                return;
            }
            if( currentElement != event.target && configObj && configObj.onBeforeHighlight ){ //beforeCallback
                if( configObj.comp ){
                    configObj.onBeforeHighlight.call( configObj.comp, currentElement, event.target, 'mouse' );
                }
                else{
                    configObj.onBeforeHighlight( currentElement, event.target, 'mouse' );
                }
            }
            currentElement.classList.remove(configObj.selectedClass);
            event.target.classList.add(configObj.selectedClass);
            if( currentElement != event.target && configObj && configObj.onAfterHighlight ){  //afterCallback
                if( configObj.comp ){
                    configObj.onAfterHighlight.call( configObj.comp, currentElement, event.target, 'mouse' );
                }
                else{
                    configObj.onAfterHighlight( currentElement, event.target, 'mouse' );
                }
            }
            let ariaId=event.target.id;
            if(!ariaId){
                ariaId=`LyteHighlightElement_${globalIdInd++}`;
                event.target.id=ariaId;
            }
            focusableElement.setAttribute('aria-activedescendant',event.target.id);
        }
    }

    function removePlugIn(valueToBeRemoved){
        for (let i = 0; i < parentArr.length; i++) {
            if (parentArr[i] === valueToBeRemoved) {
                // removeScope(configurationObjects[i]);
                removeSelectedClass( parentArr[i],configurationObjects[i].selectedClass,configurationObjects[i].scope)
                parentArr.splice(i, 1);  
                configurationObjects.splice(i, 1);  
                i--; 
            }
        }
    }

    function checkPresenceOfPlugIn(valueToCheck){
        let index=0;
        for(let value of parentArr)
        {
            if(value===valueToCheck)
            {
                return true;
            }
            index+=1;
        }
        return false;
    }

    function resetSelectedClass( valueToCheck ){
        var index=0, configObj;
        for(let value of parentArr)
        {
            if(value===valueToCheck)
            {
                configObj = configurationObjects[index];
            }
            index+=1;
        }
        if( !configObj ){
            return false;
        }

        removeSelectedClass( valueToCheck, configObj.selectedClass, configObj.scope );
        return true;
    }

    function resetToFirstSelectedClass( valueToCheck ){
        var index=0, configObj;
        for(let value of parentArr)
        {
            if(value === valueToCheck)
            {
                configObj = configurationObjects[index];
            }
            index+=1;
        }

        if( !configObj ){
            return false;
        }
        var bool = resetSelectedClass( valueToCheck );

        return bool ? readdToFirstValidElement( valueToCheck, configObj ) : false;
    }

    function checkViewScroll( elem, parent ){
        if( !inView( elem, parent ) ){
            if( elem.offsetTop <= parent.scrollTop ){
                parent.scrollTop = elem.offsetTop;
            }
            else{
                parent.scrollTop = elem.offsetTop + elem.offsetHeight - parent.offsetHeight;
            }
        }
    }

    function inView( elem, parent ){
        if( elem.offsetTop >= parent.scrollTop && 
            elem.offsetTop + elem.offsetHeight <= parent.scrollTop + parent.offsetHeight ){
                return true;
        }

        return false;
    }

    function scrollParentToUp(previousElement){

        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,configObj=utilObj.configObj;
        let listOfChildren=Array.from(parent.querySelectorAll(configObj.child));
        if(previousElement==listOfChildren[0]){
            parent.scrollTop=0;
            return;
        }

        checkViewScroll( previousElement, parent );
    }

    function scrollParentToDown(nextElement){

        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent;

        checkViewScroll( nextElement, parent );
    }

    function isConfigObjsEmpty(){

        if(configurationObjects.length===0){
            return true;
        }
    }

    function isFocusOnConfigObjs(){
        
        for(let x of parentArr)
        {
            if(x==document.activeElement||x==document.activeElement.parentElement){
                return true;
            }
        }
        return false;
    }

    function findPreviousElement(){

        let utilObj=findUtilObj(document.activeElement);
        let configObj=utilObj.configObj,listOfChildren=utilObj.listOfChildren,elementsToSkip=utilObj.elementsToSkip,currentElement=utilObj.currentElement,previousElement;
        let currentElementIndex=listOfChildren.indexOf(currentElement);
        if(currentElementIndex>0 && currentElementIndex<listOfChildren.length){
             previousElement=listOfChildren[--currentElementIndex];
        }
        else if(currentElementIndex==0 && configObj.ifCycle===true)
        {
            previousElement=scrollToLastElement();
        }
        if(previousElement){
            if( configObj.standardNavigationOrder ){
                while(previousElement!=null && elementsToSkip && elementsToSkip.includes(previousElement)){
                    previousElement=listOfChildren[--currentElementIndex];
                }
            }
            else{
                while(previousElement!=null && ((elementsToSkip && elementsToSkip.includes(previousElement)) || previousElement.disabled )){
                    previousElement=listOfChildren[--currentElementIndex];
                }
            }
           
        }
        return previousElement;
    }

    function findPreviousRowElement(){

        let utilObj=findUtilObj(document.activeElement);
        let configObj=utilObj.configObj,listOfChildren=utilObj.listOfChildren,elementsToSkip=utilObj.elementsToSkip,currentElement=utilObj.currentElement,previousElement,previousRow;
        var listOfRows = utilObj.listOfRows;

        var currRow = $L(currentElement).closest(configObj.row)[0];
        var currentRowIndex = listOfRows.indexOf(currRow);
        var currRowChildren = Array.from($L(currRow).find(configObj.child));
        var currRowChildIndex = currRowChildren.indexOf(currentElement);

        if(currentRowIndex>0 && currentRowIndex<listOfRows.length){
             previousRow=listOfRows[--currentRowIndex];
        }
        else if(currentRowIndex==0 && configObj.ifCycle===true){
            previousRow=listOfRows[listOfRows.length-1];
        }
        if(previousRow){
            var previousRowChildren = $L(previousRow).find(configObj.child);
            previousElement = previousRowChildren[currRowChildIndex < previousRowChildren.length ? currRowChildIndex : previousRowChildren.length-1];
        }

        var currentElementIndex=listOfChildren.indexOf(previousElement);//overallIndex

        if(previousElement){
            if( configObj.standardNavigationOrder ){
                while(previousElement!=null && elementsToSkip && elementsToSkip.includes(previousElement)){
                    previousElement=listOfChildren[--currentElementIndex];
                }
            }
            else{
                while(previousElement!=null && ((elementsToSkip && elementsToSkip.includes(previousElement)) || previousElement.disabled )){
                    previousElement=listOfChildren[--currentElementIndex];
                }
            }
           
        }
        return previousElement;
    }

    function findNextRowElement(){

        let utilObj=findUtilObj(document.activeElement);
        let configObj=utilObj.configObj,listOfChildren=utilObj.listOfChildren,elementsToSkip=utilObj.elementsToSkip,currentElement=utilObj.currentElement,nextElement,nextRow;
        var listOfRows = utilObj.listOfRows;

        var currRow = $L(currentElement).closest(configObj.row)[0];
        var currentRowIndex = listOfRows.indexOf(currRow);
        var currRowChildren = Array.from($L(currRow).find(configObj.child));
        var currRowChildIndex = currRowChildren.indexOf(currentElement);

        if(currentRowIndex>=0 && currentRowIndex<listOfRows.length-1){
            nextRow=listOfRows[++currentRowIndex];
        }
        else if(currentRowIndex==0 && configObj.ifCycle===true){
            nextRow=listOfRows[0];
        }
        if(nextRow){
            var nextRowChildren = $L(nextRow).find(configObj.child);
            nextElement = nextRowChildren[currRowChildIndex < nextRowChildren.length ? currRowChildIndex : nextRowChildren.length-1];
        }
        
        var currentElementIndex=listOfChildren.indexOf(nextElement);//overallIndex

        if(nextElement){
            if( configObj.standardNavigationOrder ){
                while(nextElement!=null && elementsToSkip && elementsToSkip.includes(nextElement)){
                    nextElement=listOfChildren[++currentElementIndex];
                }
            }
            else{
                while(nextElement!=null && ((elementsToSkip && elementsToSkip.includes(nextElement)) || nextElement.disabled )){
                    nextElement=listOfChildren[++currentElementIndex];
                }
            }
           
        }
        return nextElement;
    }

    function findNextElement(){
    
        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,configObj=utilObj.configObj,listOfChildren=utilObj.listOfChildren,elementsToSkip=utilObj.elementsToSkip,currentElement=utilObj.currentElement,nextElement;
        let currentElementIndex=listOfChildren.indexOf(currentElement);
        if(currentElementIndex>=0 && currentElementIndex<listOfChildren.length-1) {
             nextElement=listOfChildren[++currentElementIndex];
        }
         else if(currentElementIndex==listOfChildren.length-1 && configObj.ifCycle===true)
         {
            nextElement=scrollToFirstElement();
         }
        if(nextElement){
            if(configObj.standardNavigationOrder){
                while(nextElement!=null && elementsToSkip &&elementsToSkip.includes(nextElement)){
                    nextElement=listOfChildren[++currentElementIndex];
                }
            }
            else{
                while(nextElement!=null && ((elementsToSkip && elementsToSkip.includes(nextElement)) || nextElement.disabled )){
                    nextElement=listOfChildren[++currentElementIndex];
                }
            }
                
        }
        return nextElement;
    }

    function findUtilObj( elementToCheck, typeOfEvent ){
        let index=0,parent,configObj,parCalled;
        for(let value of parentArr){
                if(elementToCheck && (elementToCheck === value ||
                     (elementToCheck.parentElement /*&& elementToCheck.parentElement.nodeName!=="BODY"*/ 
                        && elementToCheck.parentElement === value ))){        
                        parent=value;
                        parCalled=value;
                        configObj=configurationObjects[index];
                        break;
                }
                index+=1;
        }
        let listOfChildren=[],listOfRows=[],elementsToSkip=[],currentElement,parents=[];
        if(parent!=undefined) {
            if(configObj && configObj.changeScope){
                if(configObj.scope){
                    let scopeArr = configObj.scope.split(",");
                    let activeScope = document.querySelector('[lt-prop-active-scope="true"]');
                    let elemScopeArr = [];
                    scopeArr.forEach(function(elem){
                        elemScopeArr.push(document.querySelector(elem));
                    });
                    if(!activeScope || !elemScopeArr.includes(activeScope)){
                        return;
                    }
                    parent = activeScope;
                    listOfChildren = Array.from(activeScope.querySelectorAll(configObj.child));
                    if( configObj.row ){
                        listOfRows = Array.from(activeScope.querySelectorAll(configObj.row));
                    }
                    elementsToSkip = Array.from(activeScope.querySelectorAll(configObj.skipElements));
                    if(!currentElement){
                        currentElement= activeScope.querySelector('.'+configObj.selectedClass);
                    }
                    if(!currentElement){
                        if( !( configObj.preventHighlightWhenResetted ) ){    //(preventHighlightWhenResetted)[!don't expose this]: this is to prevent a weird case for a team where after 'reset'-ting the parent, the scope should not add the 'sel' class to any item
                                                                                    //unless mouseMove or keydown is pressed
                                                                            //this'll prevent automatic addition of sel class to items when there are no valid 'sel' item at that time
														                        //there can be no valid 'sel' item, if 'reset' util is called!!
                            listOfChildren[0].classList.add(configObj.selectedClass);
                            currentElement= activeScope.querySelector('.'+configObj.selectedClass);
                        }
                       
                    }
                }
            }
            else{
                if(configObj && configObj.scope){
                    let scopeArr = configObj.scope.split(",");
                    parent=document.querySelector(scopeArr[0]);
                    for( let ind=0;ind<scopeArr.length;ind++ ){
                        if(scopeArr[ind]){
                            let temp = document.querySelector(scopeArr[ind]);
                            parents.push(temp);
                            listOfChildren= listOfChildren.concat(Array.from(temp.querySelectorAll(configObj.child)));
                            if( configObj.row ){
                                listOfRows= listOfRows.concat(Array.from(temp.querySelectorAll(configObj.row)));
                            }
                            elementsToSkip= elementsToSkip.concat(Array.from(temp.querySelectorAll(configObj.skipElements)));
                            if(!currentElement){
                                currentElement= temp.querySelector('.'+configObj.selectedClass);
                            }
                        }
                    }
                   
                    if(!currentElement){
                        if( !( configObj.preventHighlightWhenResetted ) ){    //(preventHighlightWhenResetted)[!don't expose this]: this is to prevent a weird case for a team where after 'reset'-ting the parent, the scope should not add the 'sel' class to any item
                                                                                //unless mouseMove or keydown is pressed
                                                                            //this'll prevent automatic addition of sel class to items when there are no valid 'sel' item at that time
														                        //there can be no valid 'sel' item, if 'reset' util is called!!

                                var currentElementIndex = 0;
                                var nextElement = listOfChildren[currentElementIndex];

                                while(nextElement!=null && ((elementsToSkip && elementsToSkip.includes(nextElement)) || nextElement.disabled )){
                                    nextElement=listOfChildren[++currentElementIndex];
                                }
                                if( nextElement ){
                                    nextElement.classList.add(configObj.selectedClass);
                                    currentElement= parent.querySelector('.'+configObj.selectedClass);
                                }
                         }
                    }
                }
            }
           
        }
       
        return {
            parent: parent, //refers to scope
            parents: parents,
            configObj: configObj,
            listOfChildren: listOfChildren,
            listOfRows: listOfRows,
            elementsToSkip: elementsToSkip,
            currentElement: currentElement,
            parCalled: parCalled    //refers to og parent from where plugin was called
        };
    }

    function scrollToLastElement(){
        
        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,listOfChildren=utilObj.listOfChildren;
        let previousElement=listOfChildren[listOfChildren.length-1];
        parent.scrollTop=previousElement.offsetHeight*listOfChildren.length;
        return previousElement; 
            
    }

    function scrollToFirstElement(){
        
        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,listOfChildren=utilObj.listOfChildren;
        let nextElement=listOfChildren[0];
        parent.scrollTop=0;
        return nextElement;
    }
    function scrollPageDownKey(){

        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,listOfChildren=utilObj.listOfChildren,currentElement=utilObj.currentElement;

        if( !currentElement ){
            currentElement = findNewCurrentElement( configObj );
        }

        let configObj=utilObj.configObj,elementsToSkip=utilObj.elementsToSkip;
        let currentElementIndex=listOfChildren.indexOf(currentElement),nextElement;
        let focusableElement=utilObj.parCalled;

        if(parent===undefined || parent===null || currentElement ===undefined || currentElement === null){
            return false;
        }

        if(currentElementIndex<Math.floor(listOfChildren.length/2) && currentElementIndex>=0){
            nextElement=listOfChildren[Math.floor((listOfChildren.length)/2)];
        }
        else if(currentElementIndex>=Math.floor(listOfChildren.length/2) && currentElementIndex<listOfChildren.length){
            nextElement=listOfChildren[listOfChildren.length-1];
        }
        currentElementIndex=listOfChildren.indexOf(nextElement);
        if(nextElement){
            while(nextElement!=null && elementsToSkip &&elementsToSkip.includes(nextElement)){
                nextElement=listOfChildren[++currentElementIndex];
            }
        }

        if( !nextElement || !currentElement ){
            return false;
        }
        
        currentElement.classList.remove(configObj.selectedClass);
        nextElement.classList.add(configObj.selectedClass);    
        parent.scrollTop=nextElement.offsetTop; 
        let ariaId=nextElement.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            nextElement.id=ariaId

        }
        focusableElement.setAttribute('aria-activedescendant',nextElement.id);

    }
    function scrollPageUpKey(){
        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,listOfChildren=utilObj.listOfChildren,currentElement=utilObj.currentElement;

        if( !currentElement ){
            currentElement = findNewCurrentElement( configObj );
        }

        let configObj=utilObj.configObj,elementsToSkip=utilObj.elementsToSkip;
        let currentElementIndex=listOfChildren.indexOf(currentElement),previousElement;
        let focusableElement=utilObj.parCalled;

        if(parent===undefined || parent===null || currentElement ===undefined || currentElement === null){
            return false;
        }
        
        if(currentElementIndex>Math.floor(listOfChildren.length/2) && currentElementIndex<listOfChildren.length){
            previousElement=listOfChildren[Math.floor((listOfChildren.length)/2)];
        }
        else if(currentElementIndex<=Math.floor(listOfChildren.length/2) && currentElementIndex>=0){
            previousElement=listOfChildren[0];
            currentElementIndex=0;
            while(previousElement==null || elementsToSkip &&elementsToSkip.includes(previousElement)){
                previousElement=listOfChildren[++currentElementIndex];
            }
        }
        currentElementIndex=listOfChildren.indexOf(previousElement);
        if(previousElement){
            while(previousElement!=null && elementsToSkip &&elementsToSkip.includes(previousElement)){
                previousElement=listOfChildren[--currentElementIndex];
            }
        }

        if( !previousElement || !currentElement ){
            return false;
        }
        currentElement.classList.remove(configObj.selectedClass);
        previousElement.classList.add(configObj.selectedClass);    
        parent.scrollTop=previousElement.offsetTop; 
        let ariaId=previousElement.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            previousElement.id=ariaId

        }
        focusableElement.setAttribute('aria-activedescendant',previousElement.id);
    }

    function scrollToHomeElement(){

        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,listOfChildren=utilObj.listOfChildren,currentElement=utilObj.currentElement;

        if( !currentElement ){
            currentElement = findNewCurrentElement( configObj );
        }

        let configObj=utilObj.configObj,elementsToSkip=utilObj.elementsToSkip;
        let currentElementIndex=listOfChildren.indexOf(currentElement),previousElement;

        if(parent===undefined || parent===null || currentElement ===undefined || currentElement === null){
            return false;
        }

        let focusableElement=utilObj.parCalled;
        previousElement= scrollToFirstElement();
        currentElementIndex=listOfChildren.indexOf(previousElement);
        if(previousElement){
            while(previousElement!=null && elementsToSkip &&elementsToSkip.includes(previousElement)){
                previousElement=listOfChildren[++currentElementIndex];
            }
        }

        if( !previousElement || !currentElement ){
            return false;
        }

        currentElement.classList.remove(configObj.selectedClass);
        previousElement.classList.add(configObj.selectedClass);    
        parent.scrollTop=previousElement.offsetTop; 
        let ariaId=previousElement.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            previousElement.id=ariaId;
        }
        focusableElement.setAttribute('aria-activedescendant',previousElement.id);
    }

    function scrollToEndElement(){
        let utilObj=findUtilObj(document.activeElement);
        let parent=utilObj.parent,listOfChildren=utilObj.listOfChildren,currentElement=utilObj.currentElement;

        if( !currentElement ){
            currentElement = findNewCurrentElement( configObj );
        }

        let configObj=utilObj.configObj,elementsToSkip=utilObj.elementsToSkip;
        let currentElementIndex=listOfChildren.indexOf(currentElement),nextElement;

        if(parent===undefined || parent===null || currentElement ===undefined || currentElement === null){
            return false;
        }

        let focusableElement=utilObj.parCalled;
        nextElement=scrollToLastElement();
        currentElementIndex=listOfChildren.indexOf(nextElement);
        if(nextElement){
            while(nextElement!=null && elementsToSkip &&elementsToSkip.includes(nextElement)){
                nextElement=listOfChildren[--currentElementIndex];
            }
        }

        if( !nextElement || !currentElement ){
            return false;
        }
        
        currentElement.classList.remove(configObj.selectedClass);
        nextElement.classList.add(configObj.selectedClass);    
        parent.scrollTop=nextElement.offsetTop; 
        let ariaId=nextElement.id;
        if(!ariaId){
            ariaId=`LyteHighlightElement_${globalIdInd++}`;
            nextElement.id=ariaId;

        }
        focusableElement.setAttribute('aria-activedescendant',nextElement.id);

    }

    function checkForInverse(){
        let utilObj=findUtilObj(document.activeElement);
        if(utilObj && utilObj.configObj && (utilObj.configObj.orientation==='horizontal')){
            return true;  
        }
        return false;
    }

    function checkForRowInput(){
        let utilObj=findUtilObj(document.activeElement);
        if(utilObj && utilObj.configObj && utilObj.configObj.row ){
            return true;  
        }
        return false;
    }

    function findOptions(){
        let utilObj=findUtilObj(document.activeElement);
        if(utilObj && utilObj.configObj){
            return utilObj.configObj.options;
        }
        else{
            return undefined;
        }
    }
    function triggerClickEvent( utilObj ){
        var configObj = utilObj.configObj;

        if( configObj && configObj.onBeforeTriggerClick ){ //before click callback
            if( configObj.comp ){
                configObj.onBeforeTriggerClick.call( configObj.comp, utilObj.currentElement, 'keyboard' );
            }
            else{
                configObj.onBeforeTriggerClick( utilObj.currentElement, 'keyboard' );
            }
        }

        utilObj.currentElement.click();

        if( configObj && configObj.onAfterTriggerClick ){ //after click callback
            if( configObj.comp ){
                configObj.onAfterTriggerClick.call( configObj.comp, utilObj.currentElement, 'keyboard' );
            }
            else{
                configObj.onAfterTriggerClick( utilObj.currentElement, 'keyboard' );
            }
        }
    }
    function checkForTriggerProp(){
        let utilObj=findUtilObj(document.activeElement);
        if(utilObj && utilObj.configObj && utilObj.configObj.triggerClick){
            if(utilObj.currentElement){
                if( utilObj.configObj.ariaExpand ){
                    if( isAriaExpanded( utilObj.parCalled, utilObj.configObj.ariaExpand )){
                       triggerClickEvent( utilObj );
                    }
                }
                else if( utilObj.configObj.dropdown ){
                    if( isDropdownOpen( utilObj.configObj.dropdown )){
                        triggerClickEvent( utilObj );
                    }
                }
                else if( utilObj.configObj.customDropdownSel && utilObj.configObj.customDropdownClass ){
                    if( isCustomDropdownOpen( utilObj.configObj.customDropdownSel, utilObj.configObj.customDropdownClass )){
                        triggerClickEvent( utilObj );
                    }
                }
                else{
                    triggerClickEvent( utilObj );
                }
            }
        }
    }
    function removeScope( configObj ){
        if(!configObj){
            return;
        }
        let scopeArr =[];
        if(configObj.scope){
            scopeArr = configObj.scope.split(",");
        }
        let tempArr = [];
        for(let i=0;i<scopeArr.length;i++ ){
            let temp = document.querySelector(scopeArr[i]);
            tempArr.push(temp);
        }
        for( let ind=0;ind<globalScopeArr.length;ind++ ){
            if(tempArr.includes(globalScopeArr[ind])){
                globalScopeArr[ind] = null;
            }
        }
    }

    function isDropdownOpen( val ){
        if( val && $L(val).length > 0 && $L(val)[0].getData('ltPropIsOpen')){
            return true;
        }
        return false;

    }

    function isCustomDropdownOpen( val, classToCheck ){
        if( val && classToCheck && $L(val).length > 0 && $L(val)[0].classList.contains( classToCheck )){
            return true;
        }
        return false;

    }

    function isAriaExpanded( par, val ){
        if( par && val && $L(par).length > 0 && $L(par)[0].getAttribute(val)==='true'){
            return true;
        }
        return false;
    }
    
 })();

 