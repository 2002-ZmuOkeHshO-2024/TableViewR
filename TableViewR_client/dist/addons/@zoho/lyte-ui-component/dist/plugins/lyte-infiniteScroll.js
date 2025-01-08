(function () {
  if (lyteDomObj) {
    lyteDomObj.prototype.infiniteScroll = function (param) {
      var table = this[0];
      if (param === "destroy" || param === "Destroy") { 
        Array.from($L(table.selector)).forEach(function(elem){
          $L(elem).css("transform","")
        })
        table.removeEventListener("scroll", table.scrollFn)
        table.scrollToRecord ? delete table.scrollToRecord : undefined;
        table.rePopulate ? delete table.rePopulate : undefined;
        table.selector ? delete table.selector : undefined;
        delete table.scrollFn
      }
      // else if (param === "stop" || param === "Stop") {
      //   Array.from($L(table.selector)).forEach(function(elem){
      //     $L(elem).attr("style","")
      //   })
      //   table.removeEventListener("scroll", table.scrollFn)
      // }
      else {
        var tableBCR = table.getBoundingClientRect();
        var tableHeight = tableBCR.height, extraDivs;
        var downResetFlag = true, onScrollStartCheck = false;
        var scrollTimer = null, setTimer = false;
        var isLastSet = false, lastSetOnce = true;
        var lastSetMinIndex, lastSetCurrentNum, lastSetCallback;
        var browserName, isSafari, selector, selectorNodeName;
        var onScrollStart = function () { },
            onScrolling = function () { },
            onScrollStop = function () { },
            onObjectUpdate = function () { },
            onLastSet = function () { };
        
        // function to set the table selector
        function setSelector() {
          if (param && param.rowSelector) {
            selector = param.rowSelector;
          } else { selector = "tr" }
          if (param && !param.populateObject) {
            console.warn("Provide an empty object to populate the dataArray")
          }
        }
        //function to check the browser
        function checkBrowser() {
          var uA = navigator.userAgent;
          if ((isBrowser = uA.indexOf("OPR")) != -1) {
            browserName = "Opera";
          }
          else if ((isBrowser = uA.indexOf("Edg")) != -1) {
            browserName = "Microsoft Edge";
          }
          else if ((isBrowser = uA.indexOf("MSIE")) != -1) {
            browserName = "Microsoft Internet Explorer";
          }
          else if ((isBrowser = uA.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
          }
          else if ((isBrowser = uA.indexOf("Safari")) != -1) {
            browserName = "Safari";
          }
          else if ((isBrowser = uA.indexOf("Firefox")) != -1) {
            browserName = "Firefox";
          }
        }
        setSelector();
        checkBrowser();
        if(!table.selector){table.selector = selector}

        // Safari browser cond. checking
        if (browserName === "Safari") {
          $L(table).css("overscroll-behavior-y", "none")
          isSafari = true;
        }
        function setCallbacks() {
          if (param.onScrollStart) {
            onScrollStart = param.onScrollStart;
            setTimer = true;
            onScrollStartCheck = true;
          }
          if (param.onScrolling) {
            onScrolling = param.onScrolling;
          }
          if (param.onScrollStop) {
            setTimer = true;
            onScrollStop = param.onScrollStop;
          }
          if (param.onObjectUpdate) {
            onObjectUpdate = param.onObjectUpdate;
          }
          if (param.onLastSet) {
            onLastSet = param.onLastSet;
          }
          
        }
        setCallbacks();
        // initializing the populateObject for DOM rendering 
        for (var i = 0; i < param.displayElem; i++) {
          updatePopulateObject([i], i, param.dataArray[i]);
        }
        // checking the sufficiency of extraElems adding it if required
        var rowHeight = $L(selector)[0].getBoundingClientRect().height;
        var downElemThres = Math.floor(tableHeight / rowHeight);
  
        function setExtraDivs() {
          if (param.displayELem >= downElemThres + 4) { extraDivs = 0; }
          else { extraDivs = 4; }
        }
        setExtraDivs();

        // reinitializing the populateObject
        var totalElementCount = param.displayElem + extraDivs;
        for (var i = 0; i < totalElementCount; i++) {
          updatePopulateObject([i], i, param.dataArray[i]);
        }
        // setting the CSS transform property if not present
        var children = $L(selector);
        Array.from(children).forEach((element) => {
          if ($L(element).css("transform") === "none") {
            $L(element).css("transform", "translateY(0px)");
          }
        });


        for (let index = 0; index < children.length; index++) {
          $L(children[index]).addClass("lyteInfiniteScrollElem-" + index);
        }
        selectorNodeName = $L(selector)[0].nodeName;
        // holding elements for CSS and render-data manipulation
        var firstElem, lastElem, up1 = undefined, up2 = undefined, currentElem;
        var down1 = $L(selector + ":nth-child(" + (downElemThres + 3) + ")"),
          down2 = $L(selector + ":nth-child(" + (downElemThres + 2) + ")"),
          downCurrentElem = $L(selector + ":nth-child(" + (downElemThres + 1) + ")");
        
        //total height of the overall elements
        var totalYShift = totalElementCount * rowHeight;
        totalYShift = Number(totalYShift.toFixed(2));
        var dataArrayLength;
        setDataArrayLength();
  
        firstElem = $L(selector + ":first-child");
        lastElem = $L(selector + ":last-child");
        currentElem = firstElem;
  
        // "index" to track the index in populateObject
        // "counter"  to track the index in dataArray
        var index = 0, counter = totalElementCount;
        var prevScroll = 0, difference = 0;
  
        // toggled when the direction of scrolling changes
        var firstCheckScrollDown = false, firstCheckScrollUp = true;
        var once = true, dummyDiv, dummyTr;

        table.scrollFn = function (e) {
          e.preventDefault();
          if (isSafari && once) {
            // creating and appending a dummy TR to the table
            dummyTr = document.createElement(selectorNodeName),
              parentNode = $L(table).find(selectorNodeName)[0].parentNode;
            parentNode.appendChild(dummyTr);
            $L(dummyTr).addClass('dummy');
            $L(dummyTr).css("transform", "translateY(0px)");
            $L(dummyTr).css("height", "0px");
            dummyTr = $L(dummyTr);
            // creating and appending a dummy DIV to the parent Div
            dummyDiv = document.createElement('DIV');
            table.appendChild(dummyDiv);
            $L(dummyDiv).addClass('dummy');
            $L(dummyDiv).css("transform", "translateY(0px)");
            $L(dummyDiv).css("height", "0.5px");
            once = false;
            dummyDiv = $L(dummyDiv);
          }
          //scroll start callback
          if (onScrollStartCheck) {
            onScrollStart();
            onScrollStartCheck = false;
          }
          // on Scroll callback
          onScrolling();
          if (setTimer) {
            if (scrollTimer)
              clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(scrollFinished, 100);
            // scroll end callback
            function scrollFinished() {
              onScrollStartCheck = true;
              onScrollStop();
            }
          }
          var currentScroll = $L(table).scrollTop();
          
          if (currentScroll >= 0) {
            // to find whether the scrolling is in down or up direction
            difference = prevScroll - currentScroll;
            //top first visible element
            if (currentElem) {
              var currentElemBCR = currentElem[0].getBoundingClientRect();
              var currentTop = currentElemBCR.top;
              var currentBottom = currentElemBCR.bottom;
            }
            tableBCR = table.getBoundingClientRect();
            var tableTop = tableBCR.top;
            if (difference > 0 && difference < 1) {
              difference = -1;
            }
            
            //if Scroll Down happens
            if (difference < 0) {
              firstCheckScrollUp = true;
              if (firstCheckScrollDown) {
                lastSetOnce = true;
                index += 1;
                checkUpIndex();
                counter += totalElementCount + 1;
                checkCounter()
                firstCheckScrollDown = false;
              }
              //checks whether an element has passed
              if (currentBottom < tableTop) {
                diff = Math.max(Math.abs(difference) / rowHeight, 1);
                for (let i = 0; i < Math.round(diff) + 1; i++) { 
                    // transfer of upper elements
                    up1 = up2;
                    up2 = currentElem;
                    if (isSafari) {
                      if ($L(currentElem).next()[0] === dummyTr[0]) {
                        currentElem = firstElem;
                      } else {
                        currentElem = $L(currentElem).next();
                      }
                    } else {
                      if ($L(currentElem).next().length === 0) {
                        currentElem = firstElem;
                      } else {
                        currentElem = $L(currentElem).next();
                      }
                    }
                    //transfer of lower elements
                    downCurrentElem = down2;
                    down2 = down1;
                    if (isSafari) {
                      if ($L(down1).next()[0] === dummyTr[0]) {
                        down1 = firstElem;
                      } else {
                        down1 = $L(down1).next();
                      }
                    } else {
                      if ($L(down1).next().length === 0) {
                        down1 = firstElem;
                      } else {
                        down1 = $L(down1).next();
                      }
                    }
                    if (up1) {
                      //alteration in populateObject and CSS of the elements
                      if (counter <= param.dataArray.length - 1) {
                        updatePopulateObject(index, counter, param.dataArray[counter])
                        var YTranslate = getYTransform(up1);
                        if (up1) {
                          $L(up1[0]).css("transform", "translateY(" + (YTranslate + totalYShift) + "px)");
                        }
                        if (isSafari) {
                          var dumTrYTransform = getYTransform(dummyTr);
                          var dumDivYTransform = getYTransform(dummyDiv);
                          // var dumTrHeight = parseInt($L(dummyTr).css("height"));
                          $L(dummyDiv).css("transform", "translateY(" + (dumDivYTransform + rowHeight) + "px)");
                          $L(dummyTr).css("transform", "translateY(" + (dumTrYTransform + rowHeight) + "px)");
                          // $L(dummyTr).css("height", dumTrHeight - 40 +"px")
                        }
                        index++;
                        counter++;
                        isLastSet = false;
                        lastSetCallback = true;
                        checkCounter()
                      } else {
                        isLastSet = true;
                        if (lastSetCallback) { 
                          downResetFlag = false;
                          onLastSet().then( 
                            lastSetCallback = false
                          )
                        }

                      }
                    }
                  checkUpIndex();
                }
              }
              function checkUpIndex() {
                if (index >= totalElementCount) {
                  index = 0;
                }
              }
              checkAndDownReset();
            }
            // if Scroll Up happens
            else if (difference > 0) {
              firstCheckScrollDown = true;
              if (firstCheckScrollUp) {
                downResetFlag = true;
                index -= 1;
                checkDownIndex();
                counter -= totalElementCount + 1;
                checkCounter()
                firstCheckScrollUp = false;
              }
              diff = Math.max(Math.abs(difference) / rowHeight, 1);
              if (currentTop > tableTop) {
                if (isLastSet) {
                  let transformedElems = getDifferentTransformElems();
                  let lowerTransformElems = transformedElems[0], higherTransformElems = transformedElems[1];
                  if (lastSetOnce) {
                    for (let i = 0; i < lowerTransformElems.length; i++) {
                      if (lowerTransformElems[i][0] === currentElem[0]) {
                        lastSetCurrentNum = i;
                      } 
                      if (!lastSetCurrentNum) {
                        lastSetCurrentNum = 0;
                      }
                    }
                    lastSetMinIndex = lastSetCurrentNum - 2;
                    smallCounter = lastSetCurrentNum
                    lastSetOnce = false;
                  }
                  if (smallCounter <= lastSetMinIndex) {
                    isLastSet = false;
                    lastSetOnce = true;
                    lastSetCurrentNum = undefined;
                  }
                  smallCounter--;
                  //up1
                  up1 = higherTransformElems.length > 0 ? higherTransformElems[higherTransformElems.length - 1] : lowerTransformElems[lowerTransformElems.length - 1];
                  //up2
                  if (higherTransformElems.indexOf(up1) !== -1 && higherTransformElems.indexOf(up1) !== 0) {
                    up2 = higherTransformElems[higherTransformElems.length - 2];
                  } else if (higherTransformElems.indexOf(up1) === 0) {
                    up2 = lowerTransformElems[higherTransformElems.length - 1]
                  } else {
                    let indexOfUp1 = lowerTransformElems.indexOf(up1);
                    up2 = lowerTransformElems[indexOfUp1 - 1];
                  }
                  //currentElem
                  currentElem = getPrevElem(currentElem);
                } else {
                  lastSetOnce = true;
                  for (let i = 0; i < Math.round(diff) + 1; i++) {
                    //alteration in populateObject and CSS of the elements
                    updatePopulateObject(index, counter, param.dataArray[counter])
                    var YTranslate = getYTransform(up1);
                    if (up1) {
                      $L(up1[0]).css("transform", "translateY(" + (YTranslate - totalYShift) + "px)");
                    }
                    if (isSafari) {
                      var dumTrYTransform = getYTransform(dummyTr);
                      var dumDivYTransform = getYTransform(dummyDiv);
                      // var dumTrHeight = parseInt($L(dummyTr).css("height"));
                      $L(dummyDiv).css("transform", "translateY(" + Math.max((dumDivYTransform - rowHeight), 0) + "px)");
                      $L(dummyTr).css("transform", "translateY(" + Math.max((dumTrYTransform - rowHeight), 0) + "px)");
                      // $L(dummyTr).css("height", dumTrHeight + 40 + "px");
                    }
                    index--;
                    counter--;
                    checkCounter()
                    //transfer of lower elements
                    down1 = down2;
                    down2 = downCurrentElem;
                    if ($L(downCurrentElem).prev().length === 0) {
                      downCurrentElem = lastElem;
                    } else {
                      downCurrentElem = $L(downCurrentElem).prev();
                    }
                    // transfer of upper elements
                    currentElem = up2;
                    up2 = up1;
                    if ($L(up1).prev().length === 0) {
                      up1 = lastElem;
                    } else {
                      up1 = $L(up1).prev();
                    }
                    checkDownIndex();
                  }
                }
              }
              
              // checks if the table has reached its utmost top
              if (this.scrollTop <= 0) {
                resetFunction();
              }
              function checkDownIndex() {
                if (index < 0) {
                  index = totalElementCount - 1;
                }
              }
            }
            // to maintain the previous state
            prevScroll = currentScroll;
          }
        }
        table.addEventListener('scroll', table.scrollFn)
        //function to get the Y-Transform of the element 
        function getYTransform(elem) {
          try {
            // var YTranslate = $L(elem).css("transform");
            var YTranslate = elem[0].style.transform;
            // regex to get the Y translate of the elements
            YTranslate = Number(/translateY\(([0-9\.]+)px\)/g.exec(YTranslate)[1]);
            return YTranslate;
          } catch (e) {
            // console.log(e);
          }
        }
        // function to update the populateObject
        function updatePopulateObject(index, counter, data) {
          // if(!data){debugger} 
          Lyte.objectUtils(param.populateObject, "add", "lyteInfiniteScrollElem-" + index, {
            "data": data,
            "index": counter
           })
          // onObjectUpdate(counter, param.dataArray[counter])
        }

        function checkCounter() {
          if (counter < 0) { 
            counter = totalElementCount - 1;
          }
        }

        // function to reset the variables when the table has reaches its top
        function resetFunction() {
          $L(table).find(selector).css("transform", "translateY(0px)");
          // initializing the table to its initial position
          for (var i = 0; i < totalElementCount; i++) {
            updatePopulateObject(i, i,  param.dataArray[i])
          }
          // reinitailizing the variabales
          index = 0;
          counter = totalElementCount;
          checkCounter()
          up1 = up2 = undefined;
          currentElem = firstElem;
          firstCheckScrollDown = false;
        }
        // function to reset the variables when the table has reaches its bottom
        function downResetFunction() {
          // to get the greater Y-Transform when the table has reached bottom
          var prevTempTransform = 0;
          for (var i = 0; i < totalElementCount; i++) {
            var tempTransform = getYTransform($L(selector).eq(i));
            if (tempTransform > prevTempTransform) {
              prevTempTransform = tempTransform;
            }
          }
          // to get the last elem (also the Last Element of the data) from the array of higher matching Y-Transform elements
          var lastElement, matchingArray = [];
          for (var i = 0; i < totalElementCount; i++) {
            if ($L(selector).eq(i).css("transform") === "matrix(1, 0, 0, 1, 0, " + prevTempTransform + ")") {
              matchingArray.push($L(selector).eq(i));
            }
          }
          lastElement = matchingArray.at(-1);
          // assigning all the handling variables with respect to the lastElement;
          up1 = lastElement;
          if ($L(up1).next().length === 0) up2 = firstElem;
          else up2 = $L(up1).next();
          if ($L(up2).next().length === 0) currentElem = firstElem;
          else currentElem = $L(up2).next();
          down1 = down2 = undefined;
          downCurrentElem = lastElement;
        }
        function checkAndDownReset() { 
          //checks if the table has reched its most bottom
          if (table.scrollTop + tableHeight >= param.dataArray.length * rowHeight && downResetFlag) {
            downResetFlag = false;
            downResetFunction();
            return true
          } else { 
            return false
          }
        }
        function getNextElem(elem) {
          return nextElem = $L(elem).next().length === 0 ? firstElem : $L(elem).next()
        }
        function getPrevElem(elem) {
          return nextElem = $L(elem).prev().length === 0 ? lastElem : $L(elem).prev()
        }
        function getIndexWithinRange(number, range) {
          if (number < 0) {
            number = number + range + 1;
          } else if (number > range) {
            number = number - range - 1;
          }
          return number
        }
        function findYshift(num) {
          return Math.max(totalYShift * (Math.ceil((num + 1) / totalElementCount) - 1), 0)
        }
        function findElemNum(num) {
          return num % totalElementCount
        }
        function setDataArrayLength() { 
          dataArrayLength = param.dataArray.length;
        }
        function rePopulateObject() {
          let count = Math.max(counter - totalElementCount, 0)
          
          let transformOfElems = getDifferentTransformElems();
          let lowerTransformElems = transformOfElems[0],
            higherTransformElems = transformOfElems[1];
          if (isLastSet) { 
            if (dataArrayLength < param.dataArray.length) {
              table.scrollTop -= 0.1;
              if (downResetFlag) {
                count = param.dataArray.length - totalElementCount;
                counter = param.dataArray.length - 1;
              } else if (!downResetFlag && lastSetCallback) { 
                reverseElementTransferDown();
              }
            }
            else { 
              count--;
              counter--;
            }
          }

          // if (count + totalElementCount >= param.dataArray.length - 1) { 
          //   table.scrollTop -= rowHeight;
          //   count++;
          // }
        
          let lowerElemNum = children.indexOf(lowerTransformElems[0][0])
          for (let i = lowerElemNum; i < lowerElemNum + lowerTransformElems.length; i++) {
            updatePopulateObject(i, count, param.dataArray[count]);
            count++;
          }
          if (higherTransformElems.length > 0) { 
            let higherElemNum = children.indexOf(higherTransformElems[0][0])
            for (let i = higherElemNum; i < higherElemNum + higherTransformElems.length; i++) {
              updatePopulateObject(i, count, param.dataArray[count]);
              count++;
            }
          }
          setDataArrayLength();
        }
        function getDifferentTransformElems() {
          let lowerYTransform = undefined, higherYTransform = undefined;
          let lowerTransformElems = [], higherTransformElems = [];
  
          for (var i = 0; i < totalElementCount; i++) {
            let tempTransform = getYTransform($L(selector).eq(i));
            if (lowerYTransform && lowerYTransform > tempTransform) {
              higherYTransform = lowerYTransform;
              lowerYTransform = tempTransform;
              break;
            }
            lowerYTransform = tempTransform;
          }
          for (let i = 0; i < totalElementCount; i++) {
            if ($L(selector).eq(i).css("transform") === "matrix(1, 0, 0, 1, 0, " + lowerYTransform + ")") {
              lowerTransformElems.push($L(selector).eq(i));
            } else {
              higherTransformElems.push($L(selector).eq(i));
            }
          }
          return [lowerTransformElems, higherTransformElems]
        }
        function elementTransferDown() { // transfer of elements while scrolling down
          // transfer of upper elements
          up1 = up2;
          up2 = currentElem;
          if (isSafari) {
            if ($L(currentElem).next()[0] === dummyTr[0]) {
              currentElem = firstElem;
            } else {
              currentElem = $L(currentElem).next();
            }
          } else {
            if ($L(currentElem).next().length === 0) {
              currentElem = firstElem;
            } else {
              currentElem = $L(currentElem).next();
            }
          }
          //transfer of lower elements
          downCurrentElem = down2;
          down2 = down1;
          if (isSafari) {
            if ($L(down1).next()[0] === dummyTr[0]) {
              down1 = firstElem;
            } else {
              down1 = $L(down1).next();
            }
          } else {
            if ($L(down1).next().length === 0) {
              down1 = firstElem;
            } else {
              down1 = $L(down1).next();
            }
          }
        }
        function reverseElementTransferDown() { 

          currentElem = up2;
          up2 = up1;
          if (isSafari) {
            if ($L(up1).prev()[0] === dummyTr[0]) {
              up1 = lastElem;
            } else {
              up1 = $L(up1).prev();
            }
          } else {
            up1 = getPrevElem(up1);
          }

          down1 = down2;
          down2 = downCurrentElem;

          if (isSafari) {
            if ($L(downCurrentElem).prev()[0] === dummyTr[0]) {
              downCurrentElem = lastElem;
            } else {
              downCurrentElem = $L(downCurrentElem).prev();
            }
          } else {
            downCurrentElem = getPrevElem(downCurrentElem);
          }
        }
        function elementTransferUp() { // Transfer of elements while scrolling up
          //transfer of lower elements
          down1 = down2;
          down2 = downCurrentElem;
          if ($L(downCurrentElem).prev().length === 0) {
            downCurrentElem = lastElem;
          } else {
            downCurrentElem = $L(downCurrentElem).prev();
          }
          // transfer of upper elements
          currentElem = up2;
          up2 = up1;
          if ($L(up1).prev().length === 0) {
            up1 = lastElem;
          } else {
            up1 = $L(up1).prev();
          }
        }
        function reverseElementTransferUp() {
          downCurrentElem = down2;
          down2 = down1;
          down1 = getNextElem(down1);

          up1 = up2;
          up2 = currentElem;
          currentElem = getNextElem(currentElem);

        }
        table.scrollToRecord = function (ind) {

          // add Max Y translate and calculate based on that ++>>
  
          let visibleElemNum = Math.ceil(tableHeight / rowHeight), lastSet = false;
          if (!ind) {
            console.error("Please provide a index value to scroll to.")
            return
          } else if (ind && typeof ind !== "number") { 
            console.error("Please provide an integer value as index value.")
            return
          } else if (ind < 0) {
            console.error("Please provide a index greater than or equal to 0.")
            return
          } else if (ind >= param.dataArray.length) { 
            console.error("Please provide a index lesser than dataArray's length.")
            return
          } else if (ind >= (param.dataArray.length - 1) - (visibleElemNum-1)) {
            ind = (param.dataArray.length - 1) - (visibleElemNum - 1);
            lastSet = true;
          }
          let count = ind, elemNum = findElemNum(ind);
          count -= 2;
          let maxIndex = totalElementCount - 1,
              Yshift = findYshift(ind),
              variable = Math.trunc(ind / maxIndex);
          
          iOneMinus = elemNum - 1 > -1 ? elemNum - 1 : elemNum - 1 + totalElementCount
          iTwoMinus = elemNum - 2 >= 0 ? elemNum - 2 : elemNum - 2 + totalElementCount;
          if (!lastSet) {
            for (let i = 0; i < children.length; i++) {
              if (elemNum === 0) {
                if (i < iTwoMinus) {
                  updatePopulateObject(i, ind + i, param.dataArray[ind + i])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i === iTwoMinus) {
                  updatePopulateObject(i, ind - 2, param.dataArray[ind - 2])
                  $L(children[i]).css("transform", "translateY(" + (Yshift - totalYShift) + "px)");
                } else if (i === iOneMinus) {
                  updatePopulateObject(i, ind - 1, param.dataArray[ind - 1])
                  $L(children[i]).css("transform", "translateY(" + (Yshift - totalYShift) + "px)");
                } else if (i === elemNum) {
                  updatePopulateObject(i, ind, param.dataArray[ind])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i > elemNum) {
                  updatePopulateObject(i, ind + (Math.abs(elemNum - i)), param.dataArray[ind + (Math.abs(elemNum - i))])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                }
              } else if (elemNum === 1) {
                if (i < iTwoMinus) {
                  updatePopulateObject(i, ind + (Math.abs((totalElementCount - elemNum) + i)), param.dataArray[ind + (Math.abs((totalElementCount - elemNum) + i))])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i === iTwoMinus) {
                  updatePopulateObject(i, ind - 1, param.dataArray[ind - 1])
                  $L(children[i]).css("transform", "translateY(" + (Yshift - totalYShift) + "px)");
                } else if (i === elemNum) {
                  updatePopulateObject(i, ind, param.dataArray[ind])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i > elemNum) {
                  updatePopulateObject(i, ind + (Math.abs(elemNum - i)), param.dataArray[ind + (Math.abs(elemNum - i))])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                }
              } else {
                if (i < iTwoMinus) {
                  updatePopulateObject(i, ind + (Math.abs((totalElementCount - elemNum) + i)), param.dataArray[ind + (Math.abs((totalElementCount - elemNum) + i))])
                  $L(children[i]).css("transform", "translateY(" + (Yshift + totalYShift) + "px)");
                } else if (i === iTwoMinus) {
                  updatePopulateObject(i, ind - 2, param.dataArray[ind - 2])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i === iOneMinus) {
                  updatePopulateObject(i, ind - 1, param.dataArray[ind - 1])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i === elemNum) {
                  updatePopulateObject(i, ind, param.dataArray[ind])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                } else if (i > elemNum) {
                  updatePopulateObject(i, ind + (Math.abs(elemNum - i)), param.dataArray[ind + (Math.abs(elemNum - i))])
                  $L(children[i]).css("transform", "translateY(" + Yshift + "px)");
                }
              }
            }
            currentElem = getPrevElem(children[elemNum]);
            up2 = getPrevElem(currentElem);
            up1 = getPrevElem(up2);
            downElemCount = getIndexWithinRange(elemNum + Math.round(tableHeight / rowHeight) - 1, maxIndex);
            downCurrentElem = children[downElemCount];
            down1 = getNextElem(downCurrentElem);
            down2 = getNextElem(down1);
          } else { 
              let lastIndex = param.dataArray.length - 1,
                  lastElemNum = findElemNum(lastIndex),
                  lastElemYshift = findYshift(lastIndex);
            for (let i = 0; i < children.length; i++) {
              if (i <= lastElemNum) {
                $L(children[i]).css("transform", "translateY(" + lastElemYshift + "px)");
                Lyte.objectUtils(param.populateObject.data, "add", "lyteInfiniteScrollElem-" + i, param.dataArray[(lastIndex - (lastElemNum - i))]);
              } else { 
                $L(children[i]).css("transform", "translateY(" + (lastElemYshift - totalYShift) + "px)");
                Lyte.objectUtils(param.populateObject.data, "add", "lyteInfiniteScrollElem-" + i, param.dataArray[lastIndex - (totalElementCount - i) - lastElemNum]);
              }
              // downResetFunction();
            }
           }
          table.scrollTop = ind * rowHeight;
          index = iTwoMinus;
          // index = (ind - 1) % totalElementCount - 1;
          // index = Math.trunc(Number("." + (ind / maxIndex + "").split(".")[1]) * maxIndex) - (2 + variable);
          counter = ind + (maxIndex - 1);
          checkCounter()
          
          prevScroll = ind * rowHeight - 1;
          firstCheckScrollDown = false;
        }
        table.rePopulate = function () { 
          // param.dataArray.splice(args.index + 1, 0, args.value)
          rePopulateObject();
        }
      }
    };
  }
})();