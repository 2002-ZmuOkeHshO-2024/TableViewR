;(function(){
    var registered = false, boundedListener;

    if($L){

        var grpArr=[],groupNo,focArr=[];
  
    function keydownHandler( param, e ){
        focArr = document.querySelectorAll('[lyte-focus-after]');
        if(e.key=='Tab' && !e.shiftKey ){
            var currentActiveElement=document.activeElement, nextElementNfe=currentActiveElement.getAttribute('lyte-nfocus-name'),
            nextElementTabind=currentActiveElement.getAttribute('data-tabindex');

            var elemWithNfe = document.querySelector(`[lyte-focus-name=${nextElementNfe}]`);

            if(nextElementNfe!=null && elemWithNfe != null ){
                var ret = focusAndCheckForCallbacks( param, elemWithNfe, 'focus-name', e );
                if( ret === false ){
                    return;
                }
            }
            else if(nextElementTabind!=null && nextElementTabind!=undefined && nextElementTabind.includes('group')){
                var bool = true;
                groupNo= (currentActiveElement.getAttribute('data-tabindex').split('group')[1]);
                groupNo=Number.parseInt( groupNo.split('-')[0]);
                grpArr=document.querySelectorAll(`[data-tabindex^="group${groupNo}-"]`);
                grpArr=Array.from(grpArr);
                if(grpArr.length == 0){
                    return;
                }

                grpArr.sort(sortFn);
                curInd=grpArr.indexOf( currentActiveElement );
                        
                if(curInd<grpArr.length-1){
                    var instInd = curInd + 1;
                    var Elem = grpArr[instInd];
                    while(Elem && !isValid(Elem)){
                            Elem = grpArr[instInd];
                            instInd += 1;
                    }

                    if(Elem && isValid(Elem)){
                        var ret = focusAndCheckForCallbacks( param, Elem, 'data-tabindex', e );
                        if( ret === false ){
                            return;
                        }
                        bool = false;
                    }
                }

                if( bool ){
                    if(param && param.ltPropChangeFocus && param.ltPropChangeFocus != 'false'){
                        var old_elem = document.activeElement;
                        changeFocus(groupNo, e, param);
                        if( old_elem != document.activeElement ){
                            return ;
                        }
                    }
                    var nxtGrpArr = Array.from(document.querySelectorAll(`[data-tabindex^="group${groupNo+1}-"]`));
                    if(nxtGrpArr.length == 0){
                        return;
                    }
                    nxtGrpArr.sort(sortFn);
                    var instInd = 0;
                    var Elem = nxtGrpArr[instInd];
                    while(Elem && !isValid(Elem)){
                            Elem = nxtGrpArr[instInd];
                            instInd += 1;
                    }
                    if( Elem && isValid(Elem)){
                        var ret = focusAndCheckForCallbacks( param, Elem, 'data-tabindex', e );
                        if( ret === false ){
                            return;
                        }
                    }
                    else if(checkLoopNext()){
                        if( e.preventDefault ){
                            e.preventDefault();
                        }
                    }
                } 
            }
        }
        else if(e.key=='Tab' && e.shiftKey ){
            var currentActiveElement=document.activeElement, prevElementNfe=currentActiveElement.getAttribute('lyte-bfocus-name'),
            prevElementTabind=currentActiveElement.getAttribute('data-tabindex'),
            focusAfter = currentActiveElement.getAttribute('lyte-focus-after');

            var elemWithBfe = document.querySelector(`[lyte-focus-name=${prevElementNfe}]`);

            if(prevElementNfe!=null &&  elemWithBfe != null ){
                var ret = focusAndCheckForCallbacks( param, elemWithBfe, 'bfocus-name', e );
                if( ret === false ){
                    return;
                }
            }
            else if(prevElementTabind!=null && prevElementTabind!=undefined && prevElementTabind.includes('group')){
                var bool = true;
                if(grpArr.length == 0 || parseInt((currentActiveElement.getAttribute('data-tabindex').split('group')[1]).split('-')[0])!=groupNo){
                    groupNo= (currentActiveElement.getAttribute('data-tabindex').split('group')[1]);
                    groupNo=Number.parseInt( groupNo.split('-')[0]);
                    grpArr=document.querySelectorAll(`[data-tabindex^="group${groupNo}-"]`);
                    grpArr=Array.from(grpArr);
                    if(grpArr.length == 0){
                        return;
                    }
                    grpArr.sort(sortFn);
                }
                curInd=grpArr.indexOf( currentActiveElement );
                            
                if(curInd>0){
                    var instInd = curInd - 1;
                    var Elem = grpArr[instInd];
                    while(Elem && !isValid(Elem)){
                        Elem = grpArr[instInd];
                        instInd -= 1;
                    }

                    if(Elem && isValid(Elem)){
                        var ret = focusAndCheckForCallbacks( param, Elem, 'data-tabindex', e );
                        if( ret === false ){
                            return;
                        }
                        bool = false;
                    }
                }
                    
                if( bool ){
                    var nxtGrpArr = Array.from(document.querySelectorAll(`[data-tabindex^="group${groupNo-1}-"]`));
                    if(nxtGrpArr.length == 0){
                        return;
                    }
                    nxtGrpArr.sort(sortFn);
                    var instInd = nxtGrpArr.length - 1;
                    var Elem = nxtGrpArr[instInd];
                    while(Elem && !isValid(Elem)){
                            Elem = nxtGrpArr[instInd];
                            instInd -= 1;
                    }

                    if( Elem && isValid(Elem)){
                        var ret = focusAndCheckForCallbacks( param, Elem, 'data-tabindex', e );
                        if( ret === false ){
                            return;
                        }
                    }
                    else if(checkLoopPrev()){
                        if( e.preventDefault ){
                            e.preventDefault();
                        }
                    }
                }
            }
            else if( focusAfter ){
                var contArr=focusAfter.split(',');
                var grpNo = Number.parseInt(contArr[0]);
                var nxtGrpArr = Array.from(document.querySelectorAll(`[data-tabindex^="group${grpNo}-"]`));
                if(nxtGrpArr.length == 0){
                    return;
                }
                nxtGrpArr.sort(sortFn);
                var instInd = nxtGrpArr.length - 1;
                var Elem = nxtGrpArr[instInd];
                while(Elem && !isValid(Elem)){
                        Elem = nxtGrpArr[instInd];
                        instInd -= 1;
                }

                if( Elem && isValid(Elem)){
                    var ret = focusAndCheckForCallbacks( param, Elem, 'focus-after', e );
                    if( ret === false ){
                        return;
                    }
                }
            }
        }
    }

    $L.focusStack = function(param, eSim ){

        if( param == "destroy" ){
            document.removeEventListener('keydown', boundedListener);
            grpArr = [];
            groupNo = null;
            focArr = [];
            registered = false;
            return;
        } 

        if( param && param.callType === 'script' ){
            keydownHandler( param, eSim );
        }

        if( registered ){
            return;
        }

        boundedListener = keydownHandler.bind(this,param);
        registered = true;

        document.addEventListener('keydown', boundedListener );
    }

    function checkLoopNext(){
        var currentActiveElement=document.activeElement;

        groupNo= (currentActiveElement.getAttribute('data-tabindex').split('group')[1]);
        groupNo=Number.parseInt( groupNo.split('-')[0]);
        grpArr=document.querySelectorAll(`[data-tabindex^="group${groupNo}-"]`);
        grpArr=Array.from(grpArr);
        curInd=Number.parseInt(currentActiveElement.getAttribute('data-tabindex').split('-')[1]);
        var nextDomElement=grpArr[grpArr.indexOf(currentActiveElement)+1];
        if(nextDomElement==null) { 
            return false;
        }
        if( groupNo==Number.parseInt((nextDomElement.getAttribute('data-tabindex').split('group')[1]).split('-')[0])&& Number.parseInt(nextDomElement.getAttribute('data-tabindex').split('-')[1])<curInd){
            return true;
        }
        return false;

    }

    function checkLoopPrev(){
        var currentActiveElement=document.activeElement;

        groupNo= (currentActiveElement.getAttribute('data-tabindex').split('group')[1]);
        groupNo=Number.parseInt( groupNo.split('-')[0]);
        grpArr=document.querySelectorAll(`[data-tabindex^="group${groupNo}-"]`);
        grpArr=Array.from(grpArr);
        curInd=Number.parseInt(currentActiveElement.getAttribute('data-tabindex').split('-')[1]);
        var prevDomElement=grpArr[grpArr.indexOf(currentActiveElement)-1];
        if(prevDomElement==null) {return false;}
        if( groupNo==Number.parseInt((prevDomElement.getAttribute('data-tabindex').split('group')[1]).split('-')[0])&& Number.parseInt(prevDomElement.getAttribute('data-tabindex').split('-')[1])>curInd){
            return true;
        }
        return false;
    }

    function changeFocus(groupNo, e, param){
        var currentActiveElement = document.activeElement;

        focArr.forEach(function(ele){
            if(ele.getAttribute('lyte-focus-after')){
                    var contArr=ele.getAttribute('lyte-focus-after').split(',');
                    if(contArr.includes(groupNo.toString()) && isValid(ele)){
                        var ret = focusAndCheckForCallbacks( param, ele, 'focus-after', e );
                        if( ret === false ){
                            return;
                        }
                    }
            }
        });
    }
    
    function sortFn(a,b){
        curIndA=getInd(a);
        curIndB=getInd(b);

        if(curIndA != -1 && curIndB != -1){
            if(curIndA<curIndB) {
                return -1;
            }
            if(curIndA>curIndB){ 
                return 1;
            }
        }
        return 0;
    }

    function getInd( elem ){
        var curInd = -1,e;      
        
        if( elem ){
            e =  elem.getAttribute('data-tabindex') ;
            if( e ){
                curInd = Number.parseInt( e.split('-')[1] ) ;
            }
        }
        
        return isNaN( curInd ) ? -1 : curInd ;
    }

    function isValid( Elem ){
        return $L(Elem).is(":visible")
             && !Elem.disabled 
                && Elem.tabIndex > -1;

    }

    function checkIsCallback ( elem ){
        if( elem && elem.getAttribute( 'lyte-is-callback' ) === 'false' ){
            return false;
        }

        return true;
    }

    function focusAndCheckForCallbacks( param, elem, typeOfChange, e ){
        var currentActiveElement = document.activeElement;

        if( param && param.onBeforeChange && checkIsCallback( currentActiveElement )  ){
            var ret = param.onBeforeChange( elem, typeOfChange, e );
            if( ret === false ){
                return false;
            }
        }
        
        if( e && e.preventDefault ){
            e.preventDefault();
        }

        if( elem && elem.focus ){
            elem.focus();
        }

        //this is to mimic the default behaviour of input elements by the browser
        if( elem.nodeName === 'INPUT' ){
            var lInp = $L(elem).closest('lyte-input')[0];
            if( lInp ){
                var type = lInp.getData('ltPropType');
                if( type !== 'date' && type !== 'time' && type !== 'datetime' ){
                    elem.select();
                }
            }
            else{
                elem.select();
            }
        }

        if( param && param.onAfterChange && checkIsCallback( currentActiveElement ) ) {
            param.onAfterChange( elem, typeOfChange, e );
        }

        return true;
    }

  }

  } )();  
