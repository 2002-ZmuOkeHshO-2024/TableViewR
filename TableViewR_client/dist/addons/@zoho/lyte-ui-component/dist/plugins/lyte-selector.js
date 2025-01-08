;(function(){

  if($L){

  $L.prototype.selector = function(selections){

    // if(!selections){
    //   selections = {}
    // }

    var imageTagOriginal = this[0];
    var parentDiv = imageTagOriginal.parentElement;
    var scaleFactor = 1;
    if(selections === undefined){
      selections = {}
    }

    var selectionArray = [];
    selectionArray = $L(imageTagOriginal).data('classes');
    var currentClass = ''
    var wrapperDiv = document.createElement('DIV');
    var imageTag = document.createElement('IMG');
    imageTag.src = imageTagOriginal.src;
    imageTag.setAttribute('class' , 'lyteSelectorBackImage' )
    var selectionData = {};
    var maxCount
    var updateMaxCount = false
    var initialVals = {}
    var fromOnCreate
    var resizeThreshold = false;
    var oldThresholdEventVal = {clientX : 0 , clientY : 0}

    if(selections && selections.destroy){
      if($L(parentDiv).find('.lyteSelectionWrapperBox')[0]){
        parentDiv.removeChild($L(parentDiv).find('.lyteSelectionWrapperBox')[0])
        imageTagOriginal.style.display = "block"
        $L(imageTagOriginal).data('classes' , undefined)
        $L(imageTagOriginal).data('lyteSelector' , undefined)
        parentDiv.removeEventListener('mousedown' , parentDiv.mousedownFun)
        imageTagOriginal.removeEventListener('load' , originalImageLoadEventFunc)
        $L.removeData(imageTagOriginal)
      }
      return;
    }
  

    if(selections && selections.maxCount){
      maxCount = selections.maxCount
    } else {
      maxCount = 1
      updateMaxCount = true
    }

    var imageMinWidth,imageMinHeight;

    if(selections && selections.initWidth){
      imageMinWidth = selections.initWidth
    } else {
      imageMinWidth = 20
    }
    if(selections && selections.initHeight){
      imageMinHeight = selections.initHeight
    } else {
      imageMinHeight = 20
    }

    var imageTop,imageLeft,imageRight,imageBottom,imageHeight,imageWidth;

    var currentX , currentY;
    var prevLeft, prevTop, prevRight, prevBottom; // VARIABLES USED IN moveSelection FUNCTION
    var rpLeft, rpTop, rpRight, rpBottom, rpWidth, rpHeight; // VARIABLES USED IN resizeSelectionBox FUNCTION RESIZE PREVIOUS VALUES
    var currentHandle; // CURRENT HANDLE HOLDED FOR RESIZING THE SELECTION BOX
    var zoomEnabled = false;
    var stopOverlapClass ='lyteSelectionBox'

    var currentDeleteBtn; // CURRENT DELETE BTN
    var deleteAllButton={};
    // var selectionStart = selectionEnd = deleteSingle = deleteMul = function(){};

    var onBeforeCreate = function(){}
    ,onCreate = function(){}
    ,onDragStart = function(){}
    ,onDragEnd = function(){}
    ,onResizeStart = function(){}
    ,onResizeEnd = function(){}
    ,onSelectionLimitReached = function(){}
    ,onDeleteOne = function(){}
    ,onDeleteAll = function(){}
    ,onBeforeOverlap = function(){}
    ,onOverlap = function(){}
    ,onRenderComplete = function(){};

    // if(!preventEvent){
    // } else {
    //   preventEvent = true;
    // }

    if(selections){

      if(selections.onBeforeCreate){
        onBeforeCreate = selections.onBeforeCreate
      }
      if(selections.onCreate){
        onCreate = selections.onCreate
      }
      if(selections.onDragStart){
        onDragStart = selections.onDragStart
      }
      if(selections.onDragEnd){
        onDragEnd = selections.onDragEnd
      }
      if(selections.onResizeStart){
        onResizeStart = selections.onResizeStart
      }
      if(selections.onResizeEnd){
        onResizeEnd = selections.onResizeEnd
      }
      if(selections.onDeleteOne){
        onDeleteOne = selections.onDeleteOne
      }
      if(selections.onDeleteAll){
        onDeleteAll = selections.onDeleteAll
      }
      if(selections.onBeforeOverlap){
        onBeforeOverlap = selections.onBeforeOverlap
      }
      if(selections.onOverlap){
        onOverlap = selections.onOverlap
      }
      if(selections.onSelectionLimitReached){
        onSelectionLimitReached = selections.onSelectionLimitReached
      }
      if(selections.onRenderComplete){
        onRenderComplete = selections.onRenderComplete
      }
      
      if(selections.preventOverlap === undefined){
        selections.preventOverlap = false;
      }
      if(!selections.classAttr){
        selections.classAttr = ""
      }
      if(selections.preventOverlapClass){
        stopOverlapClass = selections.preventOverlapClass
      }
      if(!selections.classList){
        selections.classAttr = ""
      }
      if(selections.zoomEnabled){
        zoomEnabled = true;
      }

      if(selections.selections){

        // Predefined Selecitons creation

        var preDefselections = selections.selections;

        imageTag.onload = function(){

          if(!$L(parentDiv).find('.lyteSelectorBackImage')[0]){
            wrapperDiv.appendChild(imageTag);
            imageTag.style.height = imageTagOriginal.getBoundingClientRect().height + "px";
            imageTag.style.width = imageTagOriginal.getBoundingClientRect().width + "px";

            imageTagOriginal.style.display = "none"
          }

          if(!$L(parentDiv).find('.lyteSelectionWrapperBox')[0]){

            wrapperDiv.setAttribute('class' , 'lyteSelectionWrapperBox');
            parentDiv.appendChild(wrapperDiv);
            wrapperDiv.style.height = imageTag.getBoundingClientRect().height+"px";
            wrapperDiv.style.width = "auto";

            if(!($L(parentDiv).find('.lyteSelectionFreezeLayer')[0])){
              var freezeLayer = document.createElement('DIV');
              freezeLayer.setAttribute('class' , 'lyteSelectionFreezeLayer');
              wrapperDiv.appendChild(freezeLayer);
              freezeLayer.style.top = "0px";
              freezeLayer.style.left = "0px";
              freezeLayer.style.height = imageTag.getBoundingClientRect().height + "px";
              freezeLayer.style.width = imageTag.getBoundingClientRect().width + "px";
            }



            for(var i=0;i<preDefselections.length;i++){
              var dummyDiv = document.createElement('DIV');
              dummyDiv.classList.add('lyteSelector'+(i+1));
              currentClass = 'lyteSelector'+(i+1);
              dummyDiv.classList.add('lyteSelectionBox')

              if(!selectionArray){
                selectionArray = []
              }

              selectionArray.push(currentClass)
              $L(parentDiv).find(imageTagOriginal).data('classes' , selectionArray)

              var tlCorner = document.createElement('DIV');
              var trCorner = document.createElement('DIV');
              var brCorner = document.createElement('DIV');
              var blCorner = document.createElement('DIV');

              var tEdge = document.createElement('DIV');
              var bEdge = document.createElement('DIV');
              var rEdge = document.createElement('DIV');
              var lEdge = document.createElement('DIV');

              var deleteBtn = document.createElement('DIV');
              var workArea = document.createElement('DIV');

              var selectorLabelTop = document.createElement('DIV');
              var selectorLabelBottom = document.createElement('DIV');

              tlCorner.setAttribute('class' , 'lyteSelectorHandles lyteTLCorner')
              trCorner.setAttribute('class' , 'lyteSelectorHandles lyteTRCorner')
              brCorner.setAttribute('class' , 'lyteSelectorHandles lyteBRCorner')
              blCorner.setAttribute('class' , 'lyteSelectorHandles lyteBLCorner')
              tEdge.setAttribute('class' , 'lyteSelectorHandles lyteTEdge')
              bEdge.setAttribute('class' , 'lyteSelectorHandles lyteBEdge')
              rEdge.setAttribute('class' , 'lyteSelectorHandles lyteREdge')
              lEdge.setAttribute('class' , 'lyteSelectorHandles lyteLEdge')

              deleteBtn.setAttribute('class' , 'lyteSelectorDeleteBtn')
              workArea.setAttribute('class' , 'lyteSelectorWorkArea')

              selectorLabelTop.setAttribute('class' , 'lyteSelectorLabel')
              selectorLabelBottom.setAttribute('class' , 'lyteSelectorLabel')

              var onBeforeCreateVar = onBeforeCreate(dummyDiv , false)

              if(onBeforeCreateVar === false){
                return false
              }

              dummyDiv.appendChild(tlCorner)
              dummyDiv.appendChild(trCorner)
              dummyDiv.appendChild(brCorner)
              dummyDiv.appendChild(blCorner)
              dummyDiv.appendChild(tEdge)
              dummyDiv.appendChild(bEdge)
              dummyDiv.appendChild(rEdge)
              dummyDiv.appendChild(lEdge)
              dummyDiv.appendChild(deleteBtn)
              dummyDiv.appendChild(workArea)

              dummyDiv.appendChild(selectorLabelTop)
              dummyDiv.appendChild(selectorLabelBottom)


              if(preDefselections[i].borderColor){
                dummyDiv.style.borderColor = preDefselections[i].borderColor;
              }

              if(preDefselections[i].dataLabel){
                selectorLabelTop.classList.add('lyteSelectorLabelTop')
                selectorLabelBottom.classList.add('lyteSelectorLabelBottom')
                selectorLabelTop.classList.add(preDefselections[i].dataLabel[0].className)
                selectorLabelBottom.classList.add(preDefselections[i].dataLabel[1].className)
                selectorLabelTop.innerText = preDefselections[i].dataLabel[0].label;
                selectorLabelBottom.innerText = preDefselections[i].dataLabel[1].label;
              }

              wrapperDiv.appendChild(dummyDiv)

              $L(dummyDiv).data('index' , i);

              var ar = imageTag.naturalWidth / imageTag.getBoundingClientRect().width;

              $L(parentDiv).find('.'+currentClass)[0].style.width = preDefselections[i].width / ar + "px";
              $L(parentDiv).find('.'+currentClass)[0].style.height = preDefselections[i].height / ar + "px";
              $L(parentDiv).find('.'+currentClass)[0].style.top = preDefselections[i].top / ar + "px";
              $L(parentDiv).find('.'+currentClass)[0].style.left = preDefselections[i].left / ar + "px";

              $L(parentDiv).find('.'+currentClass)[0].style.backgroundImage = "url('"+ imageTag.src +"')"
              $L(parentDiv).find('.'+currentClass)[0].style.backgroundPosition = (-($L(parentDiv).find('.'+currentClass)[0].getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-($L(parentDiv).find('.'+currentClass)[0].getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"
              $L(parentDiv).find('.'+currentClass)[0].style.backgroundSize = imageTag.getBoundingClientRect().width + "px " + imageTag.getBoundingClientRect().height + "px";
              $L(parentDiv).find('.'+currentClass)[0].style.backgroundRepeat = "no-repeat";


              onCreate(dummyDiv , false , selections.selections[i])

              $L(dummyDiv).data().previousDim = {
                left : preDefselections[i].left,
                top : preDefselections[i].top,
                right : (preDefselections[i].left + dummyDiv.getBoundingClientRect().width-2),
                bottom : (preDefselections[i].top + dummyDiv.getBoundingClientRect().height-2),
                width : dummyDiv.getBoundingClientRect().width-2,
                height : dummyDiv.getBoundingClientRect().height-2
              }

              if(updateMaxCount){
                maxCount += 1;
              }

            }

          }
          onRenderComplete();
        }

        if(!preDefselections.classAttr){
          preDefselections.classAttr = ""
        }

      }
    }

    var mainFun = function(event){

      var imgDim = imageTag.getBoundingClientRect()

      imageTop = imgDim.top;
      imageLeft = imgDim.left;
      imageRight = imgDim.left + imgDim.width;
      imageBottom = imgDim.top + imgDim.height;
      imageHeight = imgDim.height;
      imageWidth = imgDim.width;

      // event.preventDefault();

      if((event.target.nodeName === 'IMG')||(event.target.className === 'lyteSelectionFreezeLayer')){

        currentX = event.clientX;
        currentY = event.clientY;

        if((!selectionArray) || (selectionArray.length < 1)){
          selectionArray = [];
          selectionArray.push('lyteSelector1')
          currentClass = 'lyteSelector1'
          $L(imageTagOriginal).data('classes' , selectionArray)
          // getSelectedData();
        } else {
          if(selections && ($L(parentDiv).find('.lyteSelectionBox').length < maxCount)){
            var arr = $L(imageTagOriginal).data('classes');
            var regex = /\d+/g
            var test = parseInt(arr[arr.length-1].match( regex )[0])
            test +=1
            var newClass = arr[arr.length-1].replace(regex , test);
            selectionArray.push(newClass)
            currentClass = newClass
            $L(imageTagOriginal).data('classes' , selectionArray)
          }
        }

        var createSelec = createSelection()

        if(createSelec === false){
          return;
        }
        fromOnCreate = true
        window.addEventListener('mousemove' , setDim);
        window.addEventListener('mouseup' , removeMoveEve)

      } else if($L(event.target).hasClass('lyteSelectionBox')) {

        var elem = event.target;

        fromOnCreate = false

        var ondragstartvar = onDragStart(elem , event);
        if($L(parentDiv).find('.lyteSelectorActiveBox')[0]){
          $L(parentDiv).find('.lyteSelectorActiveBox')[0].classList.remove('lyteSelectorActiveBox');
        }

        
        elem.classList.add('lyteSelectorActiveBox')
        if(ondragstartvar === false){
          return false
        }

        // Move selection function

        currentX = event.clientX;
        currentY = event.clientY;

        prevLeft = elem.getBoundingClientRect().left;
        prevTop = elem.getBoundingClientRect().top;
        prevRight = elem.getBoundingClientRect().left+elem.getBoundingClientRect().width;
        prevBottom = elem.getBoundingClientRect().top + elem.getBoundingClientRect().height;

        $L(elem).data().previousDim = {
          left : prevLeft,
          top : prevTop,
          right : prevRight,
          bottom : prevBottom,
          width : elem.getBoundingClientRect().width-2,
          height : elem.getBoundingClientRect().height-2
        }
        window.addEventListener('mousemove' , moveSelection);
        window.addEventListener('mouseup' , removeMoveEve)


      } else if($L(event.target).hasClass('lyteSelectorHandles')){

        fromOnCreate = false

        

        var acele = $L(parentDiv).find('.lyteSelectorActiveBox')[0]; // ACTIVE ELEMENT acele

        var onresizestartvar = onResizeStart(acele , event);
        if(onresizestartvar === false){
          oldThresholdEventVal.clientX = event.clientX
          oldThresholdEventVal.clientY = event.clientY
          window.addEventListener('mousemove' , resizeSelectionBox);
          window.addEventListener('mouseup' , removeReEve);
          return
        }

        var currentHold = event.target.className.split(' ');
        currentHandle = currentHold[1];

        currentX = event.clientX;
        currentY = event.clientY;

        rpLeft = acele.getBoundingClientRect().left;
        rpTop = acele.getBoundingClientRect().top;
        rpBottom = acele.getBoundingClientRect().top + acele.getBoundingClientRect().height;
        rpRight = acele.getBoundingClientRect().left + acele.getBoundingClientRect().width;

        rpWidth = acele.getBoundingClientRect().width;
        rpHeight = acele.getBoundingClientRect().height;

        $L(acele).data().previousDim = {
          left : rpLeft,
          top : rpTop,
          right : rpRight,
          bottom : rpBottom,
          width : rpWidth-2,
          height : rpHeight-2
        }
        oldThresholdEventVal.clientX = event.clientX
        oldThresholdEventVal.clientY = event.clientY
        window.addEventListener('mousemove' , resizeSelectionBox);
        window.addEventListener('mouseup' , removeReEve);

      } else if($L(event.target).hasClass('lyteSelectorDeleteBtn')){

        deleteOne();

      }



    }

    parentDiv.mousedownFun = mainFun
    parentDiv.addEventListener('mousedown' , parentDiv.mousedownFun)
    // window.addEventListener('mouseup' , removeAllFun);

    // function removeAllFun(){
    //   removeReEve()
    //   removeMoveEve()
    // }

    function originalImageLoadEventFunc(){
      if(zoomEnabled){

        if(!$L(parentDiv).find('.lyteSelectorBackImage')[0]){
          wrapperDiv.setAttribute('class' , 'lyteSelectionWrapperBox');
          parentDiv.appendChild(wrapperDiv);
          wrapperDiv.style.height = imageTagOriginal.getBoundingClientRect().height+"px";
          wrapperDiv.style.width = imageTagOriginal.getBoundingClientRect().width+"px";
        }
        if(!$L(parentDiv).find('.lyteSelectorBackImage')[0]){
          wrapperDiv.appendChild(imageTag);
          imageTag.style.height = imageTagOriginal.getBoundingClientRect().height + "px";
          imageTag.style.width = imageTagOriginal.getBoundingClientRect().width + "px";
  
          initialVals.imageDim = imageTagOriginal.getBoundingClientRect()
  
          imageTagOriginal.style.display = "none"
        }
      }
      imageTagOriginal.removeEventListener('load' , originalImageLoadEventFunc)
    }

    if(imageTagOriginal && !imageTagOriginal.complete){
      imageTagOriginal.addEventListener('load' , originalImageLoadEventFunc)
    }
    

    function createSelection(){

      var div = document.createElement('DIV');
      div.setAttribute('class' , currentClass);
      div.classList.add('lyteSelectionBox');

      if(!$L(parentDiv).find('.lyteSelectorBackImage')[0]){
        wrapperDiv.appendChild(imageTag);
        imageTag.style.height = imageTagOriginal.getBoundingClientRect().height + "px";
        imageTag.style.width = imageTagOriginal.getBoundingClientRect().width + "px";

        initialVals.imageDim = imageTagOriginal.getBoundingClientRect()

        imageTagOriginal.style.display = "none"
      }

      if($L(parentDiv).find('.lyteSelectionBox').length+1 > maxCount){
        onSelectionLimitReached()
        return true;
      }

      var tlCorner = document.createElement('DIV');
      var trCorner = document.createElement('DIV');
      var brCorner = document.createElement('DIV');
      var blCorner = document.createElement('DIV');

      var tEdge = document.createElement('DIV');
      var bEdge = document.createElement('DIV');
      var rEdge = document.createElement('DIV');
      var lEdge = document.createElement('DIV');

      var deleteBtn = document.createElement('DIV');
      var workArea = document.createElement('DIV');

      var selectorLabelTop = document.createElement('DIV');
      var selectorLabelBottom = document.createElement('DIV');
      tlCorner.setAttribute('class' , 'lyteSelectorHandles lyteTLCorner')
      trCorner.setAttribute('class' , 'lyteSelectorHandles lyteTRCorner')
      brCorner.setAttribute('class' , 'lyteSelectorHandles lyteBRCorner')
      blCorner.setAttribute('class' , 'lyteSelectorHandles lyteBLCorner')
      tEdge.setAttribute('class' , 'lyteSelectorHandles lyteTEdge')
      bEdge.setAttribute('class' , 'lyteSelectorHandles lyteBEdge')
      rEdge.setAttribute('class' , 'lyteSelectorHandles lyteREdge')
      lEdge.setAttribute('class' , 'lyteSelectorHandles lyteLEdge')

      selectorLabelTop.setAttribute('class' , 'lyteSelectorLabel')
      selectorLabelBottom.setAttribute('class' , 'lyteSelectorLabel')

      deleteBtn.setAttribute('class' , 'lyteSelectorDeleteBtn')
      workArea.setAttribute('class' , 'lyteSelectorWorkArea')

      var onBeforeCreateVar = onBeforeCreate(div , true)
      
      if(onBeforeCreateVar === false){
        return false
      }

      div.appendChild(tlCorner)
      div.appendChild(trCorner)
      div.appendChild(brCorner)
      div.appendChild(blCorner)
      div.appendChild(tEdge)
      div.appendChild(bEdge)
      div.appendChild(rEdge)
      div.appendChild(lEdge)

      div.appendChild(selectorLabelTop)
      div.appendChild(selectorLabelBottom)
      if($L(parentDiv).find('.lyteSelectionBox').length >= maxCount){
        window.removeEventListener('mousemove' , setDim);
        onSelectionLimitReached()
        return
      }
      wrapperDiv.appendChild(div)

      var arr = $L(imageTagOriginal).data('classes');
      $L(div).data('index' , parseInt(arr[arr.length-1].match( /\d+/g )[0]) - 1 );

      if(!$L(parentDiv).find('.lyteSelectionWrapperBox')[0]){
        wrapperDiv.setAttribute('class' , 'lyteSelectionWrapperBox');
        parentDiv.appendChild(wrapperDiv);
        wrapperDiv.style.height = imageTag.getBoundingClientRect().height+"px";
        wrapperDiv.style.width = imageTag.getBoundingClientRect().width+"px";
      }


      if($L(parentDiv).find('.lyteSelectorActiveBox')[0]){
        $L(parentDiv).find('.lyteSelectorActiveBox')[0].classList.remove('lyteSelectorActiveBox');
      }

      if(!($L(div).hasClass('lyteSelectorActiveBox'))){
        div.classList.add('lyteSelectorActiveBox');
      }

      if(!($L(parentDiv).find('.lyteSelectionFreezeLayer')[0])){
        var freezeLayer = document.createElement('DIV');
        freezeLayer.setAttribute('class' , 'lyteSelectionFreezeLayer');
        wrapperDiv.appendChild(freezeLayer);
        freezeLayer.style.height = imageTag.getBoundingClientRect().height + "px";
        freezeLayer.style.top = 0 + "px"
        freezeLayer.style.width = imageTag.getBoundingClientRect().width + "px";
      }

      $L(parentDiv).find('.'+currentClass)[0].style.backgroundImage = "url('"+ imageTag.src +"')"
      $L(parentDiv).find('.'+currentClass)[0].style.backgroundPosition = (-($L(parentDiv).find('.'+currentClass)[0].getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-($L(parentDiv).find('.'+currentClass)[0].getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"
      $L(parentDiv).find('.'+currentClass)[0].style.backgroundSize = imageTag.getBoundingClientRect().width + "px " + imageTag.getBoundingClientRect().height + "px";
      $L(parentDiv).find('.'+currentClass)[0].style.backgroundRepeat = "no-repeat";

      window.addEventListener('mouseup' , removeEve)

      function removeEve(event){
        if(updateMaxCount){
          maxCount+=1;
        }
        window.removeEventListener('mousemove' , setDim);
        window.removeEventListener('mouseup' , removeEve);
        window.removeEventListener('mousedown' , parentDiv.mousedownFun);
        var currentDiv = $L(parentDiv).find('.'+currentClass)[0]
        if(currentDiv){
          if((currentDiv.getBoundingClientRect().width<imageMinWidth)||(currentDiv.getBoundingClientRect().height<imageMinHeight)){
            currentDiv.style.width = imageMinWidth + 'px';
            currentDiv.style.height = imageMinHeight + 'px';
            if(currentY + imageMinHeight > (imageTag.getBoundingClientRect().top+imageTag.getBoundingClientRect().height)){
              currentDiv.style.top = (imageTag.getBoundingClientRect().bottom - imageTag.getBoundingClientRect().top) - imageMinHeight - 2 +'px';
            } else if(currentY - imageMinHeight < imageTag.getBoundingClientRect().top){
              currentDiv.style.top = "0px";
            } else {
              currentDiv.style.top = currentY - (imageMinHeight/2) - imageTag.getBoundingClientRect().top+'px';
            }
            if(currentX + imageMinWidth > (imageTag.getBoundingClientRect().left+imageTag.getBoundingClientRect().width)){
              currentDiv.style.left = (imageTag.getBoundingClientRect().right - imageTag.getBoundingClientRect().left) - imageMinWidth - 2 +'px';
            } else if(currentX - imageMinWidth < imageTag.getBoundingClientRect().left){
              currentDiv.style.left = "0px";
            } else {
              currentDiv.style.left = currentX - (imageMinWidth/2) -imageTag.getBoundingClientRect().left+'px';
            }
            currentDiv.style.backgroundImage = "url('"+ imageTag.src +"')"
            currentDiv.style.backgroundPosition = (-(currentDiv.getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-(currentDiv.getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"
            currentDiv.style.backgroundSize = imageTag.getBoundingClientRect().width + "px " + imageTag.getBoundingClientRect().height + "px";
            currentDiv.style.backgroundRepeat = "no-repeat";
          }
          var currentDivDim = currentDiv.getBoundingClientRect()
          $L(currentDiv).data().previousDim = {
            left : currentDivDim.left,
            top : currentDivDim.top,
            right : (currentDivDim.left + currentDivDim.width-2),
            bottom : (currentDivDim.top + currentDivDim.height-2),
            width : currentDivDim.width-2,
            height : currentDivDim.height-2
          }
        }
        div.appendChild(deleteBtn)
        div.appendChild(workArea)


        if(selections.preventOverlap){
          deleteOverlap()
          if(updateMaxCount){
            maxCount-=1
          }
        }

        onCreate(div , true,{})

      }

    }

    function deleteOverlap(node){
      var boxes = $L(parentDiv).find('.lyteSelectionBox')
      var remTotal = boxes.length;
      var newClasses = []
      $L(imageTagOriginal).data('classes' , [])
      for(var i=0;i<remTotal;i++){
        if(!$L(boxes[i]).attr(selections.classAttr)){
          $L(boxes[i]).addClass('lyteSelector'+(i+1)+' lyteSelectionBox '+selections.classList)  
        } else {
          $L(boxes[i]).addClass('lyteSelector'+(i+1)+' lyteSelectionBox '+selections.classList+' '+$L(boxes[i]).attr(selections.classAttr))
        }
        newClasses.push('lyteSelector'+(i+1))
        if(i+1 === remTotal){
          $L(boxes[i]).addClass('lyteSelectorActiveBox')
        }
      }
      $L(imageTagOriginal).data('classes',newClasses)

      var arr = $L(imageTagOriginal).data('classes');
      var selectionBoxes = $L(wrapperDiv).find('.lyteSelectionBox');
      var regex = /\d+/g
      var test = parseInt(arr[arr.length-1].match( regex )[0])
      var totalSelections = $L(imageTagOriginal).data().lyteSelector.getData().imageSelections
      var currentSelectionBox = $L(parentDiv).find('.lyteSelectorActiveBox')[0]
      var currentCreatedBox = totalSelections[test-1]
      var currentRight = currentCreatedBox.left + currentCreatedBox.width
      var currentLeft = currentCreatedBox.left
      var currentTop = currentCreatedBox.top
      var currentBottom = currentCreatedBox.top + currentCreatedBox.height
      var imageDatas = $L(imageTagOriginal).data().lyteSelector

      var selectorBorderSize = 1;

      selectorBorderSize = parseFloat(getComputedStyle(currentSelectionBox).borderWidth)

      if(totalSelections.length > 1){

        var mouseleavexpos = event.clientX - imageTag.getBoundingClientRect().left
        var mouseleaveypos = event.clientY - imageTag.getBoundingClientRect().top
        var flag = 0;

        for(var i=0;i<totalSelections.length;i++){

          // OVER LAP CHECK LOOP WHEN CREATING A NEW SELECTION BOX

          if(i === selectionBoxes.indexOf(currentSelectionBox)){
            continue
          }          

          if(
            ((currentRight > totalSelections[i].left - selectorBorderSize ) && ((currentRight < (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentBottom > totalSelections[i].top - selectorBorderSize ) && ((currentBottom < (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentLeft < totalSelections[i].left - selectorBorderSize ) && ((currentRight > (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentBottom > totalSelections[i].top - selectorBorderSize ) && ((currentBottom < (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentLeft < totalSelections[i].left - selectorBorderSize ) && ((currentRight > (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentTop < totalSelections[i].top - selectorBorderSize ) && ((currentBottom > (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentLeft > totalSelections[i].left - selectorBorderSize ) && ((currentLeft < (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentTop < totalSelections[i].top - selectorBorderSize ) && ((currentBottom > (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentRight > totalSelections[i].left - selectorBorderSize ) && ((currentRight < (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentTop < totalSelections[i].top - selectorBorderSize ) && ((currentBottom > (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentLeft < totalSelections[i].left - selectorBorderSize ) && ((currentRight > (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentTop > totalSelections[i].top - selectorBorderSize ) && ((currentTop < (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentRight > totalSelections[i].left - selectorBorderSize ) && ((currentRight < (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentTop > totalSelections[i].top - selectorBorderSize ) && ((currentTop < (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentLeft > totalSelections[i].left - selectorBorderSize ) && ((currentLeft < (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentTop > totalSelections[i].top - selectorBorderSize ) && ((currentTop < (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(
            ((currentLeft > totalSelections[i].left - selectorBorderSize ) && ((currentLeft < (totalSelections[i].left+totalSelections[i].width)))) &&
            ((currentBottom > totalSelections[i].top - selectorBorderSize ) && ((currentBottom < (totalSelections[i].top+totalSelections[i].height))))
          ){
            flag = 1;
          }

          if(flag){
            imageDatas.deleteSelection("."+currentClass)
            onOverlap()
            i = totalSelections.length
          }

        }

      }
    }

    function deleteOverlapMove(nodeSent , fromGetNodesUtil){

      var totalSelections = $L(imageTagOriginal).data().lyteSelector.getData().imageSelections

      var oldplace;
      var currentCreatedBox

      if($L(parentDiv).find('.lyteSelectorActiveBox')[0]){
        oldplace = $L(parentDiv).find('.lyteSelectorActiveBox').data().previousDim  
        currentCreatedBox = $L(parentDiv).find('.lyteSelectorActiveBox')[0]
      } else if(nodeSent){
        oldplace = $L(nodeSent).data().previousDim
        currentCreatedBox = nodeSent
      }

      var selectionBoxes = $L(wrapperDiv).find('.lyteSelectionBox');
      
      var currentRight = (currentCreatedBox.getBoundingClientRect().left + currentCreatedBox.getBoundingClientRect().width) - imageTag.getBoundingClientRect().left;
      var currentLeft = currentCreatedBox.getBoundingClientRect().left - imageTag.getBoundingClientRect().left;
      var currentTop = currentCreatedBox.getBoundingClientRect().top - imageTag.getBoundingClientRect().top;
      var currentBottom = (currentCreatedBox.getBoundingClientRect().top + currentCreatedBox.getBoundingClientRect().height) - imageTag.getBoundingClientRect().top;

      var selectorBorderSize = 1;
      var putBack = false;
      var intersectedNodes = []

      selectorBorderSize = parseFloat(getComputedStyle(currentCreatedBox).borderWidth)

      if(totalSelections.length > 1){

        var flag = 0;

        for(var i=0;i<totalSelections.length;i++){
          // OVER LAP CHECK LOOP WHEN MOVE AND RESIZE FUNCTIONS ARE MADE

          if(i === selectionBoxes.indexOf(currentCreatedBox)){
            continue
          } 
          
          if($L(totalSelections[i].node).hasClass(stopOverlapClass)){
            if(
              ((currentRight > totalSelections[i].left - selectorBorderSize) && ((currentRight < (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentBottom > totalSelections[i].top - selectorBorderSize) && ((currentBottom < (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentLeft < totalSelections[i].left - selectorBorderSize) && ((currentRight > (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentBottom > totalSelections[i].top - selectorBorderSize) && ((currentBottom < (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentLeft < totalSelections[i].left - selectorBorderSize) && ((currentRight > (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentTop < totalSelections[i].top - selectorBorderSize) && ((currentBottom > (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentLeft > totalSelections[i].left - selectorBorderSize) && ((currentLeft < (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentTop < totalSelections[i].top - selectorBorderSize) && ((currentBottom > (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentRight > totalSelections[i].left - selectorBorderSize) && ((currentRight < (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentTop < totalSelections[i].top - selectorBorderSize) && ((currentBottom > (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentLeft < totalSelections[i].left - selectorBorderSize) && ((currentRight > (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentTop > totalSelections[i].top - selectorBorderSize) && ((currentTop < (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentRight > totalSelections[i].left - selectorBorderSize) && ((currentRight < (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentTop > totalSelections[i].top - selectorBorderSize) && ((currentTop < (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentLeft > totalSelections[i].left - selectorBorderSize) && ((currentLeft < (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentTop > totalSelections[i].top - selectorBorderSize) && ((currentTop < (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
  
            if(
              ((currentLeft > totalSelections[i].left - selectorBorderSize) && ((currentLeft < (totalSelections[i].left+totalSelections[i].width)))) &&
              ((currentBottom > totalSelections[i].top - selectorBorderSize) && ((currentBottom < (totalSelections[i].top+totalSelections[i].height))))
            ){
              flag = 1;
            }
          }

          if(flag && oldplace){
            intersectedNodes.push(totalSelections[i].node)
            putBack = true
            flag = 0;
            // i = totalSelections.length
          }

        }

        if(fromGetNodesUtil){
          return intersectedNodes;
        }

        if(putBack){
          var onBeforeOverlapBoolean = onBeforeOverlap(intersectedNodes , currentCreatedBox);
          if(onBeforeOverlapBoolean !== false){
            currentCreatedBox.style.left = (oldplace.left - imageTag.getBoundingClientRect().left) +"px"
            currentCreatedBox.style.top = (oldplace.top - imageTag.getBoundingClientRect().top) +"px"
            currentCreatedBox.style.width = oldplace.width +"px"
            currentCreatedBox.style.height = oldplace.height +"px"
            currentCreatedBox.style.backgroundPosition = (-(currentCreatedBox.getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-(currentCreatedBox.getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"
            putBack = false
            onOverlap()
            intersectedNodes = []
          } else {
            putBack = false
            intersectedNodes = []
          }
        }

      }

    }

    function setDim(){

      var xChange = currentX - event.clientX;
      var yChange = currentY - event.clientY;
      if(xChange < 0){
        $L(parentDiv).find('.'+currentClass)[0].style.left = currentX - imageTag.getBoundingClientRect().left + 'px'
      } else {
        $L(parentDiv).find('.'+currentClass)[0].style.left = event.clientX - imageTag.getBoundingClientRect().left + 'px'
      }
      if(yChange < 0){
        $L(parentDiv).find('.'+currentClass)[0].style.top = currentY - imageTag.getBoundingClientRect().top + 'px'
      } else {
        $L(parentDiv).find('.'+currentClass)[0].style.top = event.clientY - imageTag.getBoundingClientRect().top + 'px'
      }


      $L(parentDiv).find('.'+currentClass)[0].style.width = Math.abs(xChange) + 'px'
      $L(parentDiv).find('.'+currentClass)[0].style.height = Math.abs(yChange) + 'px'

      if(event.clientX <= imageTag.getBoundingClientRect().left ){

        $L(parentDiv).find('.'+currentClass)[0].style.left = '0px';
        $L(parentDiv).find('.'+currentClass)[0].style.width = currentX - imageTag.getBoundingClientRect().left + 'px';

      }

      if(event.clientY <= imageTag.getBoundingClientRect().top ){

        $L(parentDiv).find('.'+currentClass)[0].style.top = '0px';
        $L(parentDiv).find('.'+currentClass)[0].style.height = currentY - imageTag.getBoundingClientRect().top + 'px';

      }

      if(event.clientX >= (imageTag.getBoundingClientRect().left + imageTag.getBoundingClientRect().width)){

        $L(parentDiv).find('.'+currentClass)[0].style.width = ( ( imageTag.getBoundingClientRect().left +  imageTag.getBoundingClientRect().width ) - currentX) + 'px';

      }

      if(event.clientY >= (imageTag.getBoundingClientRect().top + imageTag.getBoundingClientRect().height) ){

        $L(parentDiv).find('.'+currentClass)[0].style.height = ( (imageTag.getBoundingClientRect().top + imageTag.getBoundingClientRect().height) - currentY) + 'px';

      }

      $L(parentDiv).find('.'+currentClass)[0].style.backgroundPosition = (-($L(parentDiv).find('.'+currentClass)[0].getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-($L(parentDiv).find('.'+currentClass)[0].getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"

    }

    function moveSelection(){

      var imageGBCR = imageTag.getBoundingClientRect();
      var selectionWrapperBox = imageTag.parentElement;
      var selectionWrapperBoxGBCR = selectionWrapperBox.getBoundingClientRect();
      var leftVal = prevLeft - (currentX - event.clientX) - imageGBCR.left - (selectionWrapperBoxGBCR.left - imageGBCR.left);
      var topVal = prevTop - (currentY - event.clientY) - imageTag.getBoundingClientRect().top - (selectionWrapperBoxGBCR.top - imageGBCR.top);

      if(leftVal < 0){

        leftVal = 0;

      }

      if(topVal < 0){

        topVal = 0;

      }

      if((leftVal + $L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().width) >= imageTag.getBoundingClientRect().width){

        leftVal = imageTag.getBoundingClientRect().width - $L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().width

      }

      if((topVal + $L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().height) >= imageTag.getBoundingClientRect().height){

        topVal = imageTag.getBoundingClientRect().height - $L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().height

      }

      $L(parentDiv).find('.lyteSelectorActiveBox')[0].style.left = leftVal + "px";
      $L(parentDiv).find('.lyteSelectorActiveBox')[0].style.top = topVal + "px";

      $L(parentDiv).find('.lyteSelectorActiveBox')[0].style.backgroundPosition = (-($L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-($L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"


    }

    function removeMoveEve(){
      if(selections.preventOverlap && !fromOnCreate){
        deleteOverlapMove()
      }

      var curNode = event.target;
      if($L(event.target).hasClass('lyteSelectorHandles')){
        curNode = $L(event.target).closest('.lyteSelectionBox')[0]
      }
      
      if(!fromOnCreate){
        onDragEnd(curNode);
      }

      window.removeEventListener('mousemove' , moveSelection);
      window.removeEventListener('mouseup' , removeMoveEve);
      window.removeEventListener('mousedown' , parentDiv.mousedownFun);
    }

    function resizeSelectionBox(event){

      if(oldThresholdEventVal.clientX <= event.clientX+3 || oldThresholdEventVal.clientX >= event.clientX+3 ||
         oldThresholdEventVal.clientY <= event.clientY+3 || oldThresholdEventVal.clientY >= event.clientY+3 ){
          resizeThreshold = true
         }


      var th = $L(parentDiv).find('.lyteSelectorActiveBox')[0];

      switch (currentHandle) {

        case 'lyteTLCorner':
        th.style.height = rpHeight + (currentY - event.clientY) - 2 + "px";
        th.style.top = rpTop - (currentY - event.clientY) - imageTag.getBoundingClientRect().top + "px";
        th.style.width = rpWidth + (currentX - event.clientX) - 2 + "px";
        th.style.left = rpLeft - (currentX - event.clientX) - imageTag.getBoundingClientRect().left + "px";

        if(event.clientX <= imageLeft){
          th.style.width = rpRight - imageLeft - 2 + "px";
          th.style.left = imageLeft - imageTag.getBoundingClientRect().left + "px";
        }
        if(event.clientX >= rpRight){
          th.style.width = "1px";
          th.style.left = rpRight-3 - imageTag.getBoundingClientRect().left + "px";
        }
        if(event.clientY <= imageTop){
          th.style.height = rpBottom - imageTop - 2 + "px";
          th.style.top = imageTop - imageTag.getBoundingClientRect().top + "px";
        }
        if(event.clientY >= rpBottom){
          th.style.height = "1px";
          th.style.top = rpBottom-3 - imageTag.getBoundingClientRect().top + "px";
        }

        if((rpHeight + (currentY - event.clientY) - 2) <= imageMinHeight){
          th.style.height = imageMinHeight + "px";
          th.style.top = rpBottom - 2 - imageTag.getBoundingClientRect().top - imageMinHeight + "px";
        }

        if((rpWidth + (currentX - event.clientX) - 2) <= imageMinWidth){
          th.style.width = imageMinWidth + "px";
          th.style.left = rpRight - 2 - imageTag.getBoundingClientRect().left - imageMinWidth + "px";
        }

        break;
        case 'lyteTRCorner':
        th.style.height = rpHeight + (currentY - event.clientY) - 2 + "px";
        th.style.top = rpTop - (currentY - event.clientY) - imageTag.getBoundingClientRect().top + "px";
        th.style.width = rpWidth - (currentX - event.clientX) - 2 + "px";
        if(event.clientY <= imageTop){
          th.style.height = rpBottom - imageTop - 2 + "px";
          th.style.top = imageTop - imageTag.getBoundingClientRect().top + "px";
        }
        if(event.clientY >= rpBottom){
          th.style.height = "1px";
          th.style.top = rpBottom-3 - imageTag.getBoundingClientRect().top + "px";
        }
        if(event.clientX >= imageRight){
          th.style.width = imageRight - rpLeft + "px"
        }
        if(event.clientX <= rpLeft){
          th.style.width = "1px";
        }

        if((rpHeight + (currentY - event.clientY) - 2) <= imageMinHeight){
          th.style.height = imageMinHeight + "px";
          th.style.top = rpBottom - 2 - imageTag.getBoundingClientRect().top - imageMinHeight + "px";
        }
        if((rpWidth - (currentX - event.clientX)) <= imageMinWidth){
          th.style.width = imageMinWidth + "px";
        }

        break;


        case 'lyteBRCorner':
        th.style.width = rpWidth - (currentX - event.clientX) - 2 + "px";
        th.style.height = rpHeight - (currentY - event.clientY) - 2 + "px";
        if(event.clientY >= imageBottom){
          th.style.height = imageBottom - rpTop + "px";
        }
        if(event.clientY <= rpTop){
          th.style.height = '1px'
        }
        if(event.clientX >= imageRight){
          th.style.width = imageRight - rpLeft + "px"
        }
        if(event.clientX <= rpLeft){
          th.style.width = "1px";
        }

        if((rpHeight - (currentY - event.clientY)) <= imageMinHeight){
          th.style.height = imageMinHeight + "px";
        }

        if((rpWidth - (currentX - event.clientX)) <= imageMinWidth){
          th.style.width = imageMinWidth + "px";
        }

        break;
        case 'lyteBLCorner':
        th.style.width = rpWidth + (currentX - event.clientX) - 2 + "px";
        th.style.left = rpLeft - (currentX - event.clientX) - imageTag.getBoundingClientRect().left + "px";
        th.style.height = rpHeight - (currentY - event.clientY) + "px";
        if(event.clientX <= imageLeft){
          th.style.width = rpRight - imageLeft - 2 + "px";
          th.style.left = imageLeft - imageTag.getBoundingClientRect().left + "px";
        }
        if(event.clientX >= rpRight){
          th.style.width = "1px";
          th.style.left = rpRight-3 - imageTag.getBoundingClientRect().left + "px";
        }

        if(event.clientY >= imageBottom){
          th.style.height = imageBottom - rpTop + "px";
        }
        if(event.clientY <= rpTop){
          th.style.height = '1px'
        }

        if((rpHeight - (currentY - event.clientY)) <= imageMinHeight){
          th.style.height = imageMinHeight + "px";
        }
        if((rpWidth + (currentX - event.clientX) - 2) <= imageMinWidth){
          th.style.width = imageMinWidth + "px";
          th.style.left = rpRight - 2 - imageTag.getBoundingClientRect().left - imageMinWidth + "px";
        }

        break;
        case 'lyteTEdge':
        th.style.height = rpHeight + (currentY - event.clientY) - 2 + "px";
        th.style.top = rpTop - imageTag.getBoundingClientRect().top - (currentY - event.clientY) + "px";

        if(event.clientY <= imageTop){
          th.style.height = rpBottom - imageTop - 2 + "px";
          th.style.top = imageTop - imageTag.getBoundingClientRect().top + "px";
        }
        if(event.clientY >= rpBottom){
          th.style.height = "1px";
          th.style.top = rpBottom-3 - imageTag.getBoundingClientRect().top + "px";
        }

        if((rpHeight + (currentY - event.clientY) - 2) <= imageMinHeight){
          th.style.height = imageMinHeight + "px";
          th.style.top = rpBottom - 2 - imageTag.getBoundingClientRect().top - imageMinHeight + "px";
        }

        break;
        case 'lyteBEdge':
        th.style.height = rpHeight - (currentY - event.clientY) + "px";
        if(event.clientY >= imageBottom){
          th.style.height = imageBottom - rpTop + "px";
        }
        if(event.clientY <= rpTop){
          th.style.height = '1px'
        }
        if((rpHeight - (currentY - event.clientY)) <= imageMinHeight){
          th.style.height = imageMinHeight + "px";
        }
        break;

        case 'lyteREdge':
        th.style.width = rpWidth - (currentX - event.clientX) + "px";
        if(event.clientX >= imageRight){
          th.style.width = imageRight - rpLeft + "px"
        }
        if(event.clientX <= rpLeft){
          th.style.width = "1px";
        }
        if((rpWidth - (currentX - event.clientX)) <= imageMinWidth){
          th.style.width = imageMinWidth + "px";
        }
        break;
        case 'lyteLEdge':

        th.style.width = rpWidth + (currentX - event.clientX) - 2 + "px";
        th.style.left = rpLeft - (currentX - event.clientX) - imageTag.getBoundingClientRect().left + "px";

        if(event.clientX <= imageLeft){
          th.style.width = rpRight - imageLeft - 2 + "px";
          th.style.left = imageLeft - imageTag.getBoundingClientRect().left + "px";
        }
        if(event.clientX >= rpRight){
          th.style.width = "1px";
          th.style.left = rpRight-3 - imageTag.getBoundingClientRect().left + "px";
        }

        if((rpWidth + (currentX - event.clientX) - 2) <= imageMinWidth){
          th.style.width = imageMinWidth + "px";
          th.style.left = rpRight - 2 - imageTag.getBoundingClientRect().left - imageMinWidth + "px";
        }

        break;

      }

      $L(parentDiv).find('.lyteSelectorActiveBox')[0].style.backgroundPosition = (-($L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().left - imageTag.getBoundingClientRect().left)-1) + "px " + (-($L(parentDiv).find('.lyteSelectorActiveBox')[0].getBoundingClientRect().top - imageTag.getBoundingClientRect().top)-1) + "px"

      // window.addEventListener('mouseup' , removeReEve)

    }

    function removeReEve(event){
      var curNode = event.target;
      var targetNode = $L(parentDiv).find('.lyteSelectorActiveBox')[0]
      if($L(event.target).hasClass('lyteSelectorHandles')){
        curNode = $L(event.target).closest('.lyteSelectionBox')[0]
      }

      if(selections.preventOverlap){
        deleteOverlapMove()
      }
      
      if(resizeThreshold){
        onResizeEnd(targetNode)
      }

      resizeThreshold = false
      oldThresholdEventVal.clientX = 0
      oldThresholdEventVal.clientY = 0

      window.removeEventListener('mousemove' , resizeSelectionBox)
      window.removeEventListener('mouseup' , removeReEve)
      window.removeEventListener('mousedown' , parentDiv.mousedownFun);
    }

    function deleteOne(nodeToDelete){

      if(updateMaxCount){
        maxCount -= 1;
      }


      // if(event){
      //   event.preventDefault();
      // }

      onDeleteOne()


      if(nodeToDelete){
        delElem = $L(parentDiv).find(nodeToDelete)[0];
      } else {
        delElem = $L(parentDiv).find('.lyteSelectorActiveBox')[0];
      }

      if(!delElem){
        return
      }

      var index = $L(delElem).data().index;
      wrapperDiv.removeChild(delElem);


      var currentElemArr = $L(imageTagOriginal).data('classes');
      // Lyte.arrayUtils(currentElemArr , 'removeAt' , index , 1); 
      // var regex = /\d+/g
      // for (var i=index ; i<currentElemArr.length;i++){
      //   var curInd = parseInt(currentElemArr[i].match( regex )[0])
      //   var test = currentElemArr[i].replace( regex , curInd-1)
      //   $L('.'+currentElemArr[i]).addClass(test)
      //   $L('.'+currentElemArr[i]).removeClass(currentElemArr[i])

      //   Lyte.arrayUtils(currentElemArr , 'replaceAt' , i , test)
      // }

      // currentElemArr.splice( currentElemArr.indexOf(delElemClass) , 1 )

      if(currentElemArr.length <= 1){

        wrapperDiv.removeChild($L(parentDiv).find('.lyteSelectionFreezeLayer')[0]);
        selectionArray = [];
        parentDiv.removeChild(wrapperDiv)
        imageTagOriginal.style.display = "block";

      }
      var boxes = $L(parentDiv).find('.lyteSelectionBox')
      var remTotal = boxes.length;
      var newClasses = []
      $L(parentDiv).find('.lyteSelectionBox').attr('class' , '')
      $L(imageTagOriginal).data('classes' , [])
      for(var i=0;i<remTotal;i++){
        if(!$L(boxes[i]).attr(selections.classAttr)){
          $L(boxes[i]).addClass('lyteSelector'+(i+1)+' lyteSelectionBox '+selections.classList)  
        } else {
          $L(boxes[i]).addClass('lyteSelector'+(i+1)+' lyteSelectionBox '+selections.classList+' '+$L(boxes[i]).attr(selections.classAttr))
        }
        // $L(boxes[i]).addClass('lyteSelector'+(i+1)+' lyteSelectionBox '+selections.classList+' '+$L(boxes[i]).attr(selections.classAttr))
        newClasses.push('lyteSelector'+(i+1))
      }
      $L(imageTagOriginal).data('classes',newClasses)

    }

    function getSelectedData(){

      var returnData = {};

      returnData.imageNaturalWidth = imageTag.naturalWidth;
      returnData.imageNaturalHeight = imageTag.naturalHeight;

      returnData.imageWidth = imageTag.getBoundingClientRect().width;
      returnData.imageHeight = imageTag.getBoundingClientRect().height;

      if($L(parentDiv).find(imageTagOriginal).data('classes')){
        var totalBoxes = $L(parentDiv).find(imageTagOriginal).data('classes').length;
        var classesArr = $L(parentDiv).find(imageTagOriginal).data('classes');
        var imageSelections = [];


        for(var i=0;i<totalBoxes;i++){

          var dummy = {};

          var ratioChange = imageTag.naturalWidth / imageTag.getBoundingClientRect().width;
          var currentSelector = $L(parentDiv).find('.'+classesArr[i])[0]
          dummy.node = currentSelector
          dummy.creationIndex = i+1;
          dummy.width = currentSelector.getBoundingClientRect().width;
          dummy.height = currentSelector.getBoundingClientRect().height;
          dummy.left = currentSelector.getBoundingClientRect().left - imageTag.getBoundingClientRect().left;
          dummy.top = currentSelector.getBoundingClientRect().top - imageTag.getBoundingClientRect().top;
          dummy.naturalWidth = currentSelector.getBoundingClientRect().width * ratioChange;
          dummy.naturalHeight = currentSelector.getBoundingClientRect().height * ratioChange;
          dummy.naturalLeft = ( currentSelector.getBoundingClientRect().left - imageTag.getBoundingClientRect().left)*ratioChange;
          dummy.naturalTop = (currentSelector.getBoundingClientRect().top - imageTag.getBoundingClientRect().top)*ratioChange;

          imageSelections.push(dummy);

        }

        returnData.imageSelections = imageSelections;
      }

      return returnData;


    }

    selectionData.getData = function(){

      return getSelectedData()

    }

    selectionData.deleteSelection = function(arg){
      deleteOne(arg)
    }

    selectionData.deleteAll = function (){

      if(updateMaxCount){
        maxCount = 1;
      }

      onDeleteAll();

      var classArr = $L(imageTagOriginal).data().classes;

      for(var i=0;i<classArr.length;i++){
        wrapperDiv.removeChild( $L(parentDiv).find('.'+classArr[i])[0] )
      }

      wrapperDiv.removeChild($L(parentDiv).find('.lyteSelectionFreezeLayer')[0]);
      selectionArray = [];
      currentClass = '';

      parentDiv.removeChild(wrapperDiv)
      imageTagOriginal.style.display = "block";

    }

    function zoom(test){
      var transformVal = test;
      var scaleVal = 'scale('+test+')';
      var parentDivObj = $L(parentDiv);
      var selectionBox = parentDivObj.find('.lyteSelectionBox')[0];
      var freezeLayer = parentDivObj.find('.lyteSelectionFreezeLayer')[0];
    
      var wrapperBox = parentDivObj.find('.lyteSelectionWrapperBox')[0];
      var wrapperBoxParentNode = wrapperBox.parentNode;
      var wrapperBoxParentNodeGBCR = wrapperBoxParentNode.getBoundingClientRect();
      var wrapperBoxParentNodeComputedStyle = getComputedStyle(wrapperBoxParentNode);
      var wrapperBoxParentNodePaddingLeft = parseFloat(wrapperBoxParentNodeComputedStyle.paddingLeft);
      var wrapperBoxParentNodePaddingTop = parseFloat(wrapperBoxParentNodeComputedStyle.paddingTop);
      var HorizontalCenterOfWrapperBoxParentNode = wrapperBoxParentNodeGBCR.width / 2;
      var verticalCenterOfWrapperBoxParentNode = wrapperBoxParentNodeGBCR.height / 2;
      var selectorImage = parentDivObj.find('.lyteSelectorBackImage')[0];
      var imageGBCR = selectorImage.getBoundingClientRect();
      var imageLeftGapWithWrapperBoxParentNode = wrapperBoxParentNodeGBCR.left - imageGBCR.left;
      var imageTopGapWithWrapperBoxParentNode = wrapperBoxParentNodeGBCR.top - imageGBCR.top;
      var transformLeftOrigin = imageLeftGapWithWrapperBoxParentNode + HorizontalCenterOfWrapperBoxParentNode;
      var transformTopOrigin = imageTopGapWithWrapperBoxParentNode + verticalCenterOfWrapperBoxParentNode;
      var imageHeight = imageGBCR.height;
      var imageWidth = imageGBCR.width;

      var existingTransformVal = selectorImage.getAttribute('current-zoom');
      if(existingTransformVal == null) {
        existingTransformVal = 1;
      }
      existingTransformVal = parseFloat(existingTransformVal);
      transformLeftOrigin = transformLeftOrigin / existingTransformVal;
      transformTopOrigin = transformTopOrigin / existingTransformVal;
      var originalImageWidth = imageWidth / existingTransformVal;
      var originalImageHeight = imageHeight / existingTransformVal;
      if(transformVal > 1) {
		selectorImage.style.transformOrigin = transformLeftOrigin +'px ' + transformTopOrigin + 'px';
      }
      else {
        selectorImage.style.transformOrigin = '';
      }
      selectorImage.style.transform = scaleVal;
      selectorImage.setAttribute('current-zoom', transformVal);

      var newImageDim = selectorImage.getBoundingClientRect();
      var newImageHeight = newImageDim.height;
      var newImageWidth = newImageDim.width;
      var widthDifferenceFromOriginal = newImageWidth - originalImageWidth;
      var heightDifferenceFromOriginal = newImageHeight - originalImageHeight;
      
      var paddingLeft = (transformLeftOrigin / originalImageWidth) * widthDifferenceFromOriginal;
      var paddingRight = ((originalImageWidth - transformLeftOrigin) / originalImageWidth) * widthDifferenceFromOriginal;
      var paddingTop = (transformTopOrigin / originalImageHeight) * heightDifferenceFromOriginal;
      var paddingBottom = ((originalImageHeight - transformTopOrigin) / originalImageHeight) * heightDifferenceFromOriginal;
      var wrapperBoxGBCR;
      if(widthDifferenceFromOriginal < 0) {
        widthDifferenceFromOriginal = 0;
      }
      if(heightDifferenceFromOriginal < 0) {
        heightDifferenceFromOriginal = 0;
      }
      if(paddingRight < 0) {
        paddingRight = 0;
      }
      if(paddingLeft < 0) {
        paddingLeft = 0;
      }
      if(paddingTop < 0) {
        paddingTop = 0;
      }
      if(paddingBottom < 0) {
        paddingBottom = 0;
      }
      if(selectionBox) {
        freezeLayer.style.transform = scaleVal;
        var selectionBoxes = $L(parentDiv).find('.lyteSelectionBox');
        var numberOfSelections = selectionBoxes.length;
        for(var i = 0; i < numberOfSelections; i++) {
          var selectorElement = selectionBoxes[i];
          var selectorGBCR = selectorElement.getBoundingClientRect();
          var selectorLeft = selectorGBCR.x - imageGBCR.x;
          var selectorTop = selectorGBCR.y - imageGBCR.y;
          var selectorLeftInOriginalImage = selectorLeft / existingTransformVal;
          var selectorTopInOriginalImage = selectorTop / existingTransformVal;
          var selectorLeftInNewImage = (selectorLeftInOriginalImage * transformVal);
          var selectorTopInNewImage = (selectorTopInOriginalImage * transformVal);
          var selectorNewLeftInSelectionBox = selectorLeftInNewImage;
          var selectorNewTopInSelectionBox =  selectorTopInNewImage;

          var selectorCurrentWidth = parseFloat(selectorElement.style.width);
          var selectorCurrentHeight = parseFloat(selectorElement.style.height);
          var originalSelectorWidth = selectorCurrentWidth / existingTransformVal;
          var originalSelectorHeight = selectorCurrentHeight / existingTransformVal;
          selectorElement.style.width = (originalSelectorWidth * transformVal) + "px";
          selectorElement.style.height = (originalSelectorHeight * transformVal) + "px";

          selectorElement.style.backgroundSize = newImageDim.width + "px " + newImageDim.height +"px";
          selectorElement.style.left = selectorNewLeftInSelectionBox + "px";
          selectorElement.style.top = selectorNewTopInSelectionBox + "px";
          var selectorElementNewGBCR = selectorElement.getBoundingClientRect();
          wrapperBoxGBCR = wrapperBox.getBoundingClientRect();
          selectorElement.style.backgroundPosition = -(selectorElementNewGBCR.left - wrapperBoxGBCR.left + 1)+ "px " + -(selectorElementNewGBCR.top - wrapperBoxGBCR.top + 1) + "px";
        }
      }
      wrapperBox.style.padding = paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px';
      wrapperBoxParentNode.scrollLeft = (transformLeftOrigin * transformVal) - ( wrapperBoxParentNodeGBCR.width / 2) + wrapperBoxParentNodePaddingLeft;
      wrapperBoxParentNode.scrollTop = (transformTopOrigin * transformVal) -  (wrapperBoxParentNodeGBCR.height / 2) + wrapperBoxParentNodePaddingTop;

      wrapperBoxGBCR = wrapperBox.getBoundingClientRect();
      imageGBCR = selectorImage.getBoundingClientRect();
      var topAdjustment = imageGBCR.top - wrapperBoxGBCR.top;
      var leftAdjustment = imageGBCR.left - wrapperBoxGBCR.left;
      if(topAdjustment > 0 || leftAdjustment > 0) {
        for(var i = 0; i < numberOfSelections; i++) {
          var selectorElement = selectionBoxes[i];
          var curLeft = parseFloat(selectorElement.style.left);
          var curTop = parseFloat(selectorElement.style.top);
          var newLeft = curLeft + leftAdjustment;
          var newTop = curTop + topAdjustment;
          selectorElement.style.left = newLeft + "px";
          selectorElement.style.top = newTop + "px";
        }
      }
    }

    $L(parentDiv).find(imageTagOriginal)[0].deleteSelection = function(arg){
      deleteOne(arg)
    }

    $L(parentDiv).find(imageTagOriginal).data('lyteSelector' , selectionData);

    $L(parentDiv).find(imageTagOriginal).data('zoom' , zoom);


    function getIntersectedNodes(node){
      var intersectedNodes = deleteOverlapMove($L(node)[0] , true)
      return intersectedNodes
    }

    $L(parentDiv).find(imageTagOriginal).data('getIntersectedNodes' , getIntersectedNodes);


  }

}

}());
