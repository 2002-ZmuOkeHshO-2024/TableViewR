(function () {
    if ($L) {
        $L.prototype.listSelection = function (params) {
            var wrapperDiv = this[0]
            if (params === "destroy" || params === "Destroy") {
                document.removeEventListener("mousedown", wrapperDiv.mouseDownFn, wrapperDiv.capturingPhase);
                document.removeEventListener("mouseup", wrapperDiv.mouseUpFn, wrapperDiv.capturingPhase)
                delete wrapperDiv.capturingPhase
                delete wrapperDiv.mouseDownFn
                delete wrapperDiv.mouseUpFn
            } else { 
                var onSelect = function () {},
                    onDeselect = function () {},
                    onBeforeDeselect = function () {};
                var selector, deselectOnExternalClick = true;
                wrapperDiv.capturingPhase = false;

                if (params.selector) {
                selector = params.selector;
                } else {
                    console.error( "Provide a selector class or attribute for listSelection");
                    return;
                }
                if (params.onSelect) {
                onSelect = params.onSelect;
                }
                if (params.onBeforeDeselect) {
                onBeforeDeselect = params.onBeforeDeselect;
                }
                if (params.onDeselect) {
                onDeselect = params.onDeselect;
                }
                if (!params.deselectOnExternalClick) {
                deselectOnExternalClick = params.deselectOnExternalClick;
                }
                if (params.capturingPhase) {
                    wrapperDiv.capturingPhase = true;
                } 
              
                var target, nextTarget, currentTarget, mainKey, previousTarget;
                var shiftFlag = true, metaFlag = true, afterShift = false, afterMeta = false;
                var mainKeyIndex, previousIndex, currentIndex,  elemArr;
        
                var className = params.toAppendClass;
                var ignoreElements = [];
                if (params.ignoreItems) {
                ignoreElements = Array.from($L(params.ignoreItems));
                }
                const config = { attributes: true, childList: true, subtree: true };
        
                var getElemArr = function () {
                elemArr = Array.from($L(selector));
                }
                
                const observer = new MutationObserver(getElemArr);
                observer.observe(wrapperDiv, config);
                getElemArr();
        
                //to disable the default text selection in the browser
                if (!params.disableUserSelect) {
                        elemArr.forEach(function (element) {
                            $L(element).css("user-select", "none");
                        });
                }
        
                var checkForInsideWrappers = function () {
                    if (getParentElem(elemArr[0]) === wrapperDiv) {
                        return false;
                    } else {
                        return wrapperDiv;
                    }
                }
                //indices of the mainKey, previous, current targets
                var getIndex = function (mainKey, previousTarget, currentTarget) {
                    mainKeyIndex = elemArr.indexOf($L(mainKey).closest(selector)[0]);
                    previousIndex = elemArr.indexOf($L(previousTarget).closest(selector)[0]);
                    currentIndex = elemArr.indexOf($L(currentTarget).closest(selector)[0]);
                    return mainKeyIndex, previousIndex, currentIndex;
                }
                var getParentElem = function (elem) {
                    if (elem) { 
                        while (!elem.parentNode) {
                            elem = $L(selector)[0];
                        }
                        if ($L(elem).closest(selector)[0]) {
                            return $L(elem).parent()[0];
                        } else {
                            return undefined;
                        }
                    }
                }
                wrapperDiv.mouseDownFn = function (e) {
                currentTarget = $L(e.target).closest(selector);
                if (elemArr.length <= 0) {
                    return;
                }
                    
                if (!checkForInsideWrappers()) {
                    if ($L(e.target).closest(wrapperDiv)[0] && currentTarget != wrapperDiv) {

                        e.preventDefault();
                        //reinitialze shiftFlag for shift key
                        if (!e.shiftKey) {
                            target = e.target;
                            shiftFlag = true;
                        }
                        if (!e.metaKey && !metaFlag) { 
                            afterMeta = true;
                        }
                        //single click --> deselect all,select target
                        if (!(e.metaKey || e.ctrlKey) && !e.shiftKey) {
                            if(!((afterShift || afterMeta) && $L(e.target).closest(selector).hasClass(className))){ 
                                if (!params.toggleSingleSelection) {
                                    $L("." + className).closest(selector).removeClass(className);
                                    if (!ignoreElements.includes($L(target).closest(selector)[0])) {
                                        $L(target).closest(selector).addClass(className);
                                    }
                                    onSelect($L(currentTarget).closest(selector));
                                }
            
                                // toggle single selection
                                else if (params.toggleSingleSelection) {
                                    if (ignoreElements.includes($L(target).closest(selector)[0])) {
                                        return;
                                    }
                                    $L("." + className).not($L(currentTarget)).removeClass(className);
                                    if ($L(currentTarget).closest(selector).hasClass(className)) {
                                        $L(currentTarget).closest(selector).removeClass(className);
                                        onDeselect($L(currentTarget).closest(selector));
                                    } else {
                                        $L(currentTarget).closest(selector).addClass(className);
                                        onSelect($L(currentTarget).closest(selector));
                                    }
                                }
                            }
                        }

                        // control / meta key function
                        if (e.metaKey || e.ctrlKey) {
                            metaFlag = false;
                            afterShift = false
                            mainKey = previousTarget;
                            if (!$L(target).closest(selector).hasClass(className) && !ignoreElements.includes($L(target).closest(selector)[0])) {
                                $L(target).closest(selector).addClass(className);
                                onSelect($L("." + className, wrapperDiv));
                            } else {
                                $L(target).closest(selector).removeClass(className);
                            }
                        }

                        // shift key function
                        else if (e.shiftKey) {
                            if (shiftFlag && previousTarget) {
                                mainKey = previousTarget;
                                mainKeyIndex = elemArr.indexOf(mainKey[0]);
                                shiftFlag = false;
                                afterShift = true
                            }
                            afterMeta = false;
                            nextTarget = e.target;

                            getIndex(mainKey, previousTarget, currentTarget);

                            // clicked double times below the main key, one below other
                            if (currentIndex - mainKeyIndex > 0 &&
                                currentIndex - previousIndex > 0 &&
                                mainKeyIndex - previousIndex < 0 &&
                                previousIndex - mainKeyIndex > 0 &&
                                !ignoreElements.includes($L(currentTarget).closest(selector)[0])) {
                                    Array.from($L(mainKey).nextUntil(currentTarget)).map(function (elem) {
                                    $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                });
                            }

                            // clicked first time below the main key, second time in between the main and first
                            else if (currentIndex - mainKeyIndex > 0 &&
                                    currentIndex - previousIndex < 0 &&
                                    mainKeyIndex - previousIndex < 0 &&
                                    previousIndex - mainKeyIndex > 0) {
                                        Array.from($L(mainKey).nextUntil(currentTarget)).map( function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                                        Array.from($L(currentTarget).nextUntil(previousTarget)).map( function (elem) {
                                            $L(elem).closest(selector).removeClass(className);
                                            }
                                        );
                                        $L(previousTarget).closest(selector).removeClass(className);
                            }

                            //clicked first below the main key, second above the main key
                            else if (currentIndex - mainKeyIndex < 0 &&
                                    currentIndex - previousIndex < 0 &&
                                    mainKeyIndex - previousIndex < 0 &&
                                    previousIndex - mainKeyIndex > 0) {
                                        Array.from($L(mainKey).prevUntil(currentTarget)).map( function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                                        Array.from($L(mainKey).nextUntil(previousTarget)).map( function (elem) {
                                            $L(elem).closest(selector).removeClass(className);
                                        });
                                        $L(previousTarget).closest(selector).removeClass(className);
                            }

                            //clicked double times above the main key, one above other
                            else if (currentIndex - mainKeyIndex < 0 &&
                                    currentIndex - previousIndex < 0 &&
                                    mainKeyIndex - previousIndex > 0 &&
                                    previousIndex - mainKeyIndex < 0) {
                                        Array.from($L(mainKey).prevUntil(currentTarget)).map(function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                            }

                            //clicked first time above the main key, second time in between the main and first
                            else if (currentIndex - mainKeyIndex < 0 &&
                            currentIndex - previousIndex > 0 &&
                            mainKeyIndex - previousIndex > 0 &&
                            previousIndex - mainKeyIndex < 0
                            ) {
                            Array.from($L(mainKey).prevUntil(currentTarget)).map(function (elem) {
                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                            });
                            Array.from($L(currentTarget).prevUntil(previousTarget)).map(function (elem) {
                                $L(elem).closest(selector).removeClass(className);
                            });
                            $L(previousTarget).closest(selector).removeClass(className);
                            }

                            //clicked first above the main key, second below the main key
                            else if (currentIndex - mainKeyIndex > 0 &&
                                    currentIndex - previousIndex > 0 &&
                                    mainKeyIndex - previousIndex > 0 &&
                                    previousIndex - mainKeyIndex < 0) {
                                        Array.from($L(mainKey).nextUntil(currentTarget)).map(function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                                        Array.from($L(mainKey).prevUntil(previousTarget)).map(function (elem) {
                                            $L(elem).closest(selector).removeClass(className);
                                        });
                                        $L(previousTarget).closest(selector).removeClass(className);
                            }

                            //clicked single time below the main key
                            else if (currentIndex - mainKeyIndex > 0 &&
                                    currentIndex - previousIndex > 0 &&
                                    mainKeyIndex === previousIndex) {
                                        Array.from($L(mainKey).nextUntil(currentTarget)).map(function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                            }

                            //clicked single time above the main key
                            else if (currentIndex - mainKeyIndex < 0 &&
                                    currentIndex - previousIndex < 0 &&
                                    mainKeyIndex === previousIndex) {
                                        Array.from($L(mainKey).prevUntil(currentTarget)).map(function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                            }

                            if (!ignoreElements.includes($L(nextTarget).closest(selector)[0])) {
                                $L(nextTarget).closest(selector).addClass(className);
                            }
                            onSelect($L("." + className, wrapperDiv));
                            //
                        }
                    } else {
                        if (deselectOnExternalClick) {
                            var node = $L("." + className);
                            if (node[0]) {
                                var onbeforedeselect = onBeforeDeselect(node);
                                    if (onbeforedeselect !== false) {
                                        node.removeClass(className);
                                        onDeselect(node);
                                    }
                            }
                        }
                            mainKey = previousTarget = currentTarget = undefined;
                    }
                } else {
                    let insideWrappers = [];
                    insideWrappers = Array.from(wrapperDiv.children);
        
                    if ($L(e.target).closest(wrapperDiv)[0] && !insideWrappers.includes(currentTarget)) {
                        let pinnedWrapper;
                        if (params.pinnedWrapper) {
                        pinnedWrapper = $L(params.pinnedWrapper)[0];
                        }
                        Array.from(pinnedWrapper.children).forEach(function (element) {
                        $L(element).addClass("pinned");
                        });
                        e.preventDefault();
        
                        //reinitialze shiftFlag for shift key
                        if (!e.shiftKey) {
                            target = e.target;
                            shiftFlag = true;
                        }
                        if (!e.metaKey && !metaFlag) { 
                            afterMeta = true;
                        }
                        //single click --> deselect all,select target
                        if (!(e.metaKey || e.ctrlKey) && !e.shiftKey) {
                            if (!((afterShift || afterMeta) && $L(e.target).closest(selector).hasClass(className))) { 
                                if (!params.toggleSingleSelection) {
                                    $L("." + className).closest(selector).removeClass(className);
                                    if (!ignoreElements.includes($L(target).closest(selector)[0])) {
                                        $L(target).closest(selector).addClass(className);
                                    }
                                    onSelect($L(currentTarget).closest(selector));
                                }
            
                                // toggle single selection
                                else if (params.toggleSingleSelection) {
                                    if (ignoreElements.includes($L(target).closest(selector)[0])) {
                                        return;
                                    }
                                    $L("." + className).not($L(currentTarget)).removeClass(className);
                                    if ($L(currentTarget).closest(selector).hasClass(className)) {
                                        $L(currentTarget).closest(selector).removeClass(className);
                                        onDeselect($L(currentTarget).closest(selector));
                                    } else {
                                        $L(currentTarget).closest(selector).addClass(className);
                                        onSelect($L(currentTarget).closest(selector));
                                    }
                                }
                            }
                        }
        
                    // control / meta key function
                        if (e.metaKey || e.ctrlKey) {
                            metaFlag = false;
                            afterShift = false
                            mainKey = previousTarget ? previousTarget : currentTarget;

                            getIndex(mainKey, previousTarget, currentTarget);
                            let currentkeyWrapper = getParentElem(currentTarget[0]),
                                previousKeyWrapper = previousTarget ? getParentElem(previousTarget[0]) : currentkeyWrapper,
                                mainKeyWrapper = mainKey ? getParentElem(mainKey[0]) : currentkeyWrapper;
                            
                            if (currentkeyWrapper !== previousKeyWrapper) { 
                                let classRemovableElems = [];
                                for (let i = 0; i < insideWrappers.length; i++) {
                                    if (!(insideWrappers[i] === currentkeyWrapper)) { 
                                        classRemovableElems.push(Array.from($L("."+className, insideWrappers[i])))
                                    }
                                }
                                classRemovableElems.flat();
                                classRemovableElems.forEach(function (elem) { 
                                    $L(elem).closest(selector).removeClass(className);
                                })
                            }
                            $L(currentTarget).closest(selector).hasClass(className) ? $L(currentTarget).closest(selector).removeClass(className) : $L(currentTarget).closest(selector).addClass(className) 
                        }
        
                        // shift key function
                        else if (e.shiftKey) {
                            if (shiftFlag && previousTarget) {
                                mainKey = previousTarget;
                                mainKeyIndex = elemArr.indexOf(mainKey[0]);
                                shiftFlag = false;
                                afterShift = true;
                            }
                            afterMeta = false;
                            nextTarget = e.target;
        
                            getIndex(mainKey, previousTarget, currentTarget);
                            let currentkeyWrapper = getParentElem(currentTarget[0]),
                                previousKeyWrapper = previousTarget ? getParentElem(previousTarget[0]) : currentkeyWrapper,
                                mainKeyWrapper = mainKey ? getParentElem(mainKey[0]) : currentkeyWrapper;

                            if (mainKeyWrapper === currentkeyWrapper && mainKeyWrapper === previousKeyWrapper) {
                                // clicked double times below the main key, one below other
                                if (currentIndex - mainKeyIndex > 0 &&
                                    currentIndex - previousIndex > 0 &&
                                    mainKeyIndex - previousIndex < 0 &&
                                    previousIndex - mainKeyIndex > 0 &&
                                    !ignoreElements.includes(currentTarget)) {
                                        Array.from($L(mainKey).nextUntil(currentTarget)).map( function (elem) {
                                            $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                        });
                                    }
            
                                // clicked first time below the main key, second time in between the main and first
                                else if (currentIndex - mainKeyIndex > 0 &&
                                        currentIndex - previousIndex < 0 &&
                                        mainKeyIndex - previousIndex < 0 &&
                                        previousIndex - mainKeyIndex > 0) {
                                            Array.from($L(mainKey).nextUntil(currentTarget)).map( function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            });
                                            Array.from($L(currentTarget).nextUntil(previousTarget)).map( function (elem) {
                                                $L(elem).closest(selector).removeClass(className);
                                            });
                                            $L(previousTarget).closest(selector).removeClass(className);
                                        }
            
                                //clicked first below the main key, second above the main key
                                else if (currentIndex - mainKeyIndex < 0 &&
                                        currentIndex - previousIndex < 0 &&
                                        mainKeyIndex - previousIndex < 0 &&
                                        previousIndex - mainKeyIndex > 0) {
                                            Array.from($L(mainKey).prevUntil(currentTarget)).map( function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            });
                                            Array.from($L(mainKey).nextUntil(previousTarget)).map( function (elem) {
                                                $L(elem).closest(selector).removeClass(className);
                                            });
                                            $L(previousTarget).closest(selector).removeClass(className);
                                        }
            
                                //clicked double times above the main key, one above other
                                else if (currentIndex - mainKeyIndex < 0 &&
                                        currentIndex - previousIndex < 0 &&
                                        mainKeyIndex - previousIndex > 0 &&
                                        previousIndex - mainKeyIndex < 0) {
                                            Array.from($L(mainKey).prevUntil(currentTarget)).map( function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            });
                                }
            
                                //clicked first time above the main key, second time in between the main and first
                                else if (currentIndex - mainKeyIndex < 0 &&
                                        currentIndex - previousIndex > 0 &&
                                        mainKeyIndex - previousIndex > 0 &&
                                        previousIndex - mainKeyIndex < 0) {
                                            Array.from($L(mainKey).prevUntil(currentTarget)).map( function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            }
                                            );
                                            Array.from($L(currentTarget).prevUntil(previousTarget)).map( function (elem) {
                                                $L(elem).closest(selector).removeClass(className);
                                            }
                                            );
                                            $L(previousTarget).closest(selector).removeClass(className);
                                        }
            
                                //clicked first above the main key, second below the main key
                                else if (currentIndex - mainKeyIndex > 0 &&
                                        currentIndex - previousIndex > 0 &&
                                        mainKeyIndex - previousIndex > 0 &&
                                        previousIndex - mainKeyIndex < 0) {
                                            Array.from($L(mainKey).nextUntil(currentTarget)).map( function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            });
                                            Array.from($L(mainKey).prevUntil(previousTarget)).map( function (elem) {
                                                $L(elem).closest(selector).removeClass(className);
                                            });
                                            $L(previousTarget).closest(selector).removeClass(className);
                                        }
            
                                //clicked single time below the main key
                                else if (currentIndex - mainKeyIndex > 0 &&
                                        currentIndex - previousIndex > 0 &&
                                        mainKeyIndex === previousIndex) {
                                            Array.from($L(mainKey).nextUntil(currentTarget)).map(function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            });
                                        }
            
                                //clicked single time above the main key
                                else if (currentIndex - mainKeyIndex < 0 &&
                                        currentIndex - previousIndex < 0 &&
                                        mainKeyIndex === previousIndex ) {
                                            Array.from($L(mainKey).prevUntil(currentTarget)).map( function (elem) {
                                                $L(elem).closest(selector).not(params.ignoreItems).addClass(className);
                                            });
                                        }
                                    
                                if (!ignoreElements.includes($L(nextTarget).closest(selector)[0])) {
                                    $L(nextTarget).closest(selector).addClass(className);
                                }
                                onSelect($L("." + className, wrapperDiv));
                            } else {
                                if (currentIndex > mainKeyIndex) {
                                    $L(currentTarget).prevAll().not(params.ignoreItems).addClass(className)
                                    $L(currentTarget).not(params.ignoreItems).addClass(className)
                                    $L(mainKey).hasClass(className) ? $L(mainKey).removeClass(className) : undefined;
                                    onSelect($L("." + className, wrapperDiv));
                                } else {
                                    $L(currentTarget).nextAll().not(params.ignoreItems).addClass(className)
                                    $L(currentTarget).not(params.ignoreItems).addClass(className)
                                    $L(mainKey).hasClass(className) ? $L(mainKey).removeClass(className) : undefined;
                                    onSelect($L("." + className, wrapperDiv));
                                }
                            }
                        }
                    }
                    ///
                    else {
                        if (deselectOnExternalClick) {
                            var node = $L("." + className);
                            if (node[0]) {
                                var onbeforedeselect = onBeforeDeselect(node);
                                if (onbeforedeselect !== false) {
                                    node.removeClass(className);
                                    onDeselect(node);
                                }
                            }
                        }
                        mainKey = previousTarget = currentTarget = undefined;
                    }
                }
        
                previousTarget = currentTarget;
                activeElems = Array.from($L("." + params.toAppendClass));
                }
                wrapperDiv.mouseUpFn = function (e) { 
                    let target = e.target;
                    if ($L(target).closest(wrapperDiv).length > 0 && ((afterShift && shiftFlag) || afterMeta)) { 
                        $L("." + className).closest(selector).removeClass(className);
                        if (!ignoreElements.includes($L(target).closest(selector)[0])) {
                            $L(target).closest(selector).addClass(className);
                        }
                        afterShift ? afterShift = false : afterMeta = false;
                    }
                }
                document.addEventListener("mousedown", wrapperDiv.mouseDownFn, wrapperDiv.capturingPhase);
                document.addEventListener("mouseup", wrapperDiv.mouseUpFn, wrapperDiv.capturingPhase)
            }
          
        };
    }
})();