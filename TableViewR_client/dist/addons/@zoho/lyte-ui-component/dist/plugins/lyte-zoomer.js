(function () {
    $L.zoomer = function (params) {
        var body = $L("body")[0];
        if (params !== "destroy") {
            if (!body.controlKeyPressed && !body.insideOutFlag && !body.ignoreParentELems &&
                !body.prevFlagVal && !body.currentValue && !body.currentCoord && !body.previousCoord &&
                !body.controlKey && !body.altControl && !body.metaControl && !body.shiftControl &&
                !body.windowWidth && !body.isInside && !body.container) { 
                    body.container = document.createElement("DIV");
                    body.controlKeyPressed = false;
                    body.insideOutFlag = false;
                    body.ignoreParentELems = [];
                    body.prevFlagVal = undefined;
                    body.currentValue;
                    body.currentCoord = {};
                    body.isInside = false; 
                    body.previousCoord = {
                        x: 0,
                        y: 0
                    };
                    body.altControl = false;
                    body.metaControl = false;
                    body.shiftControl = false;
                    body.windowWidth = window.innerWidth;
                }
            
            $L(body.container).addClass("lyteZoomContainer");

            //  params : controlKey,className
            if (!body.setControlKey) { 
                body.setControlKey = function () {
                    if (params && params.controlKey) {
                        body.controlKey = params.controlKey; // altKey, metaKey, shiftKey
                    } else {
                        body.controlKey = "altKey";
                    }
                    if (body.controlKey === "altKey") { body.altControl = true; }
                    else if (body.controlKey === "shiftKey") { body.shiftControl = true; }
                    else if (body.controlKey === "metaKey") { body.metaControl = true; }
                }
            }
            if (!body.setContainerCSS) {
                body.setContainerCSS = function () {
                    let maxWidth = body.windowWidth * (3 / 4);
                    body.container.style.maxWidth = maxWidth + "px";
    
                    if (params && params.className) {
                        $L(body.container).addClass(params.className)
                    }
                    $L("body")[0].appendChild(body.container);
                }
            }
            if (!body.getIgnoreParentElems) { 
                body.getIgnoreParentElems = function (){
                    body.ignoreParentELems = $L("[ignore-parent]:not([ignore-parent = 'false'])");
                }
                    
            }
            if (!body.resetContainer) { 
                body.resetContainer = function () { 
                    $L(body.container).removeClass("showZoomContainer")
                    body.container.style.removeProperty("top");
                    body.container.style.removeProperty("right");
                    body.container.style.removeProperty("left");
                }
            } 

            body.setControlKey();
            body.setContainerCSS();
            body.getIgnoreParentElems();
        
            if (!body.mouseMove) { 
                body.mouseMove = function(e){
                    body.getIgnoreParentElems();
    
                    if (body.altControl && e.altKey) { renderContainer(); }
                    else if (body.shiftControl && e.shiftKey) { renderContainer(); }
                    else if (body.metaControl && e.metaKey) { renderContainer(); }

                    function renderContainer() {
                        body.controlKeyPressed = true;
                        let range, foundNodeObj;
                    
                        // range = getRange(e.clientX, e.clientY);

                        let checkObj = checkIfOverText(e);
                        let check = checkObj[0], targetRect = checkObj[1]
                        if (check) {
                            foundNodeObj = $L(e.target).nodeFinder();
                        } else {
                            body.resetContainer();
                            return
                        }
                        let target, targetTop, targetLeft, targetBottom, targetRight, targetHeight;
                        for (let index = 0; index < body.ignoreParentELems.length; index++) {
                            if (e.target === body.ignoreParentELems[index]) {
                                return;
                            }
                        }
                        try {
                            let target = foundNodeObj.finalTarget[0]
                            foundNodeObj.finalTargetContext = foundNodeObj.finalTargetContext ? foundNodeObj.finalTargetContext.trim() : "",
                                isInsideCalc(target);
                            
                            let containerText = foundNodeObj.finalTargetContext;
                            
                            body.container.style.fontSize = "60px"

                            if (foundNodeObj.finalTargetContext && foundNodeObj.finalTargetContext.length !== 0) {
                                $L(body.container).addClass('showZoomContainer')
    
                                body.container.innerText = containerText;
                                setPositionOfContainer(target, targetRect);
                            }
                        } catch (e) {
                            // console.error(e)
                        }
                    }
                    function setPositionOfContainer(target, targetRect) { 
                        if (targetRect) {
                            let windowScrollY = window.scrollY,
                            windowScrollX = window.scrollX;
                        
                        let thresholdFontSize = parseInt(window.getComputedStyle(target).fontSize) + 10,
                            targetTop = targetRect.top,
                            targetLeft = targetRect.left,
                            targetBottom = targetRect.bottom,
                            containerRect = body.container.getBoundingClientRect(),
                            containerHeight = containerRect.height,
                            containerWidth = containerRect.width;
                        
                        if ((window.innerWidth - targetLeft) > containerWidth) { 
                            if (body.container.style.hasOwnProperty("right")) { 
                                body.container.style.right = "unset"
                            }
                            body.container.style.left = targetLeft + windowScrollX + "px";
                        } else if ((window.innerWidth - targetLeft) < containerWidth) {
                            if (body.container.style.hasOwnProperty("left")) { 
                                body.container.style.left = "unset"
                            }
                            body.container.style.right = "5px";
                        }
                        if ((window.innerHeight - targetBottom) > containerHeight) { 
                            if (body.container.style.hasOwnProperty("bottom")) { 
                                body.container.style.bottom = "unset"
                            }
                            body.container.style.top = targetBottom + windowScrollY  + "px";
                        } else if (targetTop > containerHeight) {
                            if (body.container.style.hasOwnProperty("top")) { 
                                body.container.style.top = "unset"
                            }
                            body.container.style.bottom = window.innerHeight - targetTop - windowScrollY + "px";
                        }
                        else {
                            currentContFontSize = parseInt(window.getComputedStyle(body.container).fontSize);
                            if (currentContFontSize >= thresholdFontSize) {
                                body.container.style.fontSize = currentContFontSize - 2 + "px";
                                setPositionOfContainer(target, targetRect)
                            }
                        }
                        if (parseInt(body.container.style.left) === 0) { 
                            body.container.style.left = "5px";
                        }
                        }
                    }
                    function getRange(xPos, yPos) {
                        let range;
                        if (checkBrowser() === "Firefox") {
                            range = document.caretpositionFromPoint(xPos, yPos)
                        } else {
                            range = document.caretRangeFromPoint(xPos, yPos)
                        }
                        return range;
                    }
                    function changeCoords() {
                        body.previousCoord.x = body.currentCoord.x;
                        body.previousCoord.y = body.currentCoord.y;
                    }
                    function changePrevFlag() {
                        body.prevFlagVal = body.insideOutFlag;
                    }
                    // function checkIfOverText(range, eve) {
                    //     // if (range.commonAncestorContainer.nodeValue === null) {
                    //     //     // return false;
                    //     // }
                    //     if (range.commonAncestorContainer.length === 1) {
                    //         return true
                    //     }
                    //     if (range.commonAncestorContainer.nodeValue !== null) {
                    //         currentValue = range.startOffset;
                    //         body.currentCoord.x = eve.clientX;
                    //         body.currentCoord.y = eve.clientY;
    
                    //     let Xdiff = Math.abs(body.previousCoord.x - body.currentCoord.x),
                    //         Ydiff = Math.abs(body.previousCoord.y - body.currentCoord.y);
                    //     let fontSize = parseInt(getComputedStyle(range.commonAncestorContainer.parentNode).fontSize),
                    //         subtractValue = fontSize / 1.5;
                    //         minValue = 0, maxValue = range.commonAncestorContainer.nodeValue.length;
                    //     if(maxValue > 1) {
                    //         fontSize -= subtractValue;
                    //     }
                    
                    //     if (Ydiff > Xdiff) {
                    //         if (body.currentCoord.x === body.previousCoord.x && body.currentCoord.y < body.previousCoord.y) {
                    //             if (currentValue > minValue && currentValue < maxValue && range.commonAncestorContainer.parentNode === eve.target) {
                    //                 direction = "up";
                    //                 body.insideOutFlag = true;
                    //             } else {
                    //                 body.insideOutFlag = false;
                    //                 isOut = true;
                    //             }
                    //         } else if (body.currentCoord.x === body.previousCoord.x && body.currentCoord.y > body.previousCoord.y) {
                    //             if (currentValue > minValue && currentValue < maxValue && range.commonAncestorContainer.parentNode === eve.target) {
                    //                 direction = "down";
                    //                 body.insideOutFlag = true;
                    //             } else {
                    //                 body.insideOutFlag = false;
                    //                 isOut = true;
                    //             }
                    //         }
                    //     } else {
                    //         if (body.currentCoord.x > body.previousCoord.x && body.currentCoord.y === body.previousCoord.y) {
                    //             if (currentValue > minValue && currentValue < maxValue && range.commonAncestorContainer.parentNode === eve.target) {
                    //                 direction = "right";
                    //                 body.insideOutFlag = true;
                    //             } else {
                    //                 body.insideOutFlag = false;
                    //                 isOut = true;
                    //             }
                    //         } else if (body.currentCoord.x < body.previousCoord.x && body.currentCoord.y === body.previousCoord.y) {
                    //             if (currentValue > minValue && currentValue < maxValue && range.commonAncestorContainer.parentNode === eve.target) {
                    //                 direction = "left";
                    //                 body.insideOutFlag = true;
                    //             } else {
                    //                 body.insideOutFlag = false;
                    //                 isOut = true;
                    //             }
                    //         }
                    //     }
    
                    //     changeCoords();
                    //     if (body.prevFlagVal === false && body.insideOutFlag === true) {
                    //         if (currentValue === minValue) {
                    //             let currentX = eve.clientX, currentY = eve.clientY,
                    //                 rangeAtPoint = getRange(currentX + fontSize, currentY);
                            
                    //             if (rangeAtPoint.startOffset > minValue && rangeAtPoint.startOffset < maxValue && range.commonAncestorContainer.parentNode === rangeAtPoint.commonAncestorContainer.parentNode) {
                    //                 changePrevFlag()
                    //                 return true;
                    //             } else {
                    //                 rangeAtPoint = getRange(currentX, currentY + fontSize);
                    //                 if (rangeAtPoint.startOffset > minValue && rangeAtPoint.startOffset < maxValue && range.commonAncestorContainer.parentNode === rangeAtPoint.commonAncestorContainer.parentNode) {
                    //                     changePrevFlag()
                    //                     return true;
                    //                 } else {
                    //                     changePrevFlag()
                    //                     return false;
                    //                 }
                    //             }
                    //         } else if (currentValue === maxValue) {
                    //             let currentX = eve.clientX, currentY = eve.clientY,
                    //                 rangeAtPoint = getRange(currentX - fontSize, currentY);
                    //             if (rangeAtPoint.startOffset > minValue && rangeAtPoint.startOffset < maxValue && range.commonAncestorContainer.parentNode === rangeAtPoint.commonAncestorContainer.parentNode) {
                    //                 changePrevFlag()
                    //                 return true;
                    //             } else {
                    //                 rangeAtPoint = getRange(currentX, currentY - fontSize);
                    //                 if (rangeAtPoint.startOffset > minValue && rangeAtPoint.startOffset < maxValue && range.commonAncestorContainer.parentNode === rangeAtPoint.commonAncestorContainer.parentNode) {
                    //                     changePrevFlag()
                    //                     return true;
                    //                 } else {
                    //                     changePrevFlag()
                    //                     return false;
                    //                 }
                    //             }
                    //         } else if (currentValue > minValue && currentValue < maxValue) {
                    //             changePrevFlag()
                    //             return true;
                    //         }
                    //         // console.log("going in")
                    //     } else if (body.prevFlagVal === false && body.insideOutFlag === true) {
                    //         changePrevFlag()
                    //         return true;
                    //     } else if (body.prevFlagVal === true && body.insideOutFlag === false) {
                    //         changePrevFlag()
                    //         return false;
                    //     } else if (body.prevFlagVal === false && body.insideOutFlag === false) {
                    //         // if (!body.isInside) { body.resetContainer(); }
                    //         body.resetContainer();
                    //         changePrevFlag();
                    //         return false;
                    //     }
                    //     changePrevFlag();
                    //     } else if (checkForLtPropTitle(eve.target)){
                    //         return true;
                    //     }
                        
                    // }
                    function checkIfOverText(e) { 
                        let range = document.createRange()
                        range.selectNode(e.target);
                        let rects = range.getClientRects(), suitableRect;
                        if (rects.length > 150) {
                            return [false, e.target.getBoundingClientRect()]
                        } else if (rects.length == 1) { 
                            return [true, e.target.getBoundingClientRect()]
                        }
                        for (let i = 1; i < rects.length; i++) { 
                            if (e.clientY >= rects[i].top && e.clientY <= rects[i].bottom &&
                                e.clientX >= rects[i].left && e.clientX <= rects[i].right) {
                                suitableRect = rects[i];
                                break;
                            }
                        }
                        if (suitableRect && e.clientY >= suitableRect.top && e.clientY <= suitableRect.bottom &&
                            e.clientX >= suitableRect.left && e.clientX <= suitableRect.right) {
                                return [true,suitableRect]
                        } else {
                                return [false,suitableRect]
                        }
                    }
                    function checkBrowser() {
                        var uA = navigator.userAgent;
                        if ((isBrowser = uA.indexOf("OPR")) != -1) {
                            return "Opera";
                        }
                        else if ((isBrowser = uA.indexOf("Edg")) != -1) {
                            return "Microsoft Edge";
                        }
                        else if ((isBrowser = uA.indexOf("MSIE")) != -1) {
                            return "Microsoft Internet Explorer";
                        }
                        else if ((isBrowser = uA.indexOf("Chrome")) != -1) {
                            return "Chrome";
                        }
                        else if ((isBrowser = uA.indexOf("Safari")) != -1) {
                            return "Safari";
                        }
                        else if ((isBrowser = uA.indexOf("Firefox")) != -1) {
                            return "Firefox";
                        }
                    }
                    function isInsideCalc(target) { 
                        if (target.nodeName === "SPAN") { 
                            let nearestCalc = $L(configObj.target).closest('lyte-calculator');
                            if (nearestCalc.length > 0) {
                                body.isInside = true;
                            }
                        }
                    }
                    function checkForLtPropTitle(node) {
                            if ((node.hasAttribute('lt-prop-title'))) {
                                return true
                            } else { 
                                if ($L(node).closest('[lt-prop-title]').length > 0) { 
                                    return true;
                                }
                            }
                    }
                }
            }
            if (!body.keyUp) { 
                body.keyUp = function (ev){
                    let keyName;
                    if (body.controlKey === "altKey") { keyName = "Alt"; }
                    else if (body.controlKey === "shiftKey") { keyName = "Shift"; }
                    else if (body.controlKey === "metaKey") { keyName = "Meta"; }
                    if (ev.key === keyName && body.controlKeyPressed) {
                        body.controlKeyPressed = false;
                        body.insideOutFlag = false;
                        isOut = false;
                        body.resetContainer();
                    }
                }
            }
            $L(document).mousemove(body.mouseMove)
            $L(document).keyup(body.keyUp)
            window.addEventListener("blur", function (e) { 
                body.resetContainer();
            })
        } else if (params === "destroy") { 
            $L(document).off('mousemove', body.mouseMove);
            $L(document).off('keyup', body.keyUp);
            document.querySelector('.lyteZoomContainer').remove();
            body.container = body.controlKeyPressed = body.insideOutFlag = body.ignoreParentELems = 
            body.prevFlagVal = body.currentValue = body.currentCoord = body.isInside =
            body.previousCoord = body.altControl = body.metaControl = body.shiftControl =
            body.windowWidth = body.setControlKey = body.setContainerCSS = body.getIgnoreParentElems =
            body.resetContainer = body.mouseMove = body.keyUp = body.controlKey = null
        }
    };
})();