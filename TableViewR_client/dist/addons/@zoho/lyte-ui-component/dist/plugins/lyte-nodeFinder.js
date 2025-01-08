(function () {
    if ($L) {
        $L.prototype.nodeFinder = function (params) {
            let lyteTag = "LYTE-", lyteCheck = true;
            let areAnyCalc = false, isInside = false, integrationCase = false;
            let customNode = [], customFunction = function () { }, customNodeElements = [], isChildNode = false;
            let ignoreElements, obj;
                configObj = {
                    target: this[0]
                },
                priorityArray = [
                    ['P'],
                    ['INPUT', 'LABEL', 'TEXTAREA', 'BUTTON', 'LEGEND', 'SELECT', 'OPTION', 'OUTPUT', 'IMG'],
                    ['EM','B', 'I', 'CITE', 'Q', 'SMALL', 'SPAN', 'STRONG', 'U', 'WBR', 'label','textarea', "CRUX-TEXT-COMPONENT"],
                    ['LYTE-ACCORDION-HEADER', 'LYTE-ACCORDION-BODY', 'LYTE-ALERT-HEADER', 'LYTE-ALERT-CONTENT', 'LYTE-MODAL-CONTENT', 'LYTE-AUTOCOMPLETE-DESCRIPTION', 'LYTE-AUTOCOMPLETE-LABEL',
                        'LYTE-BREADCRUMB-BODY', 'LYTE-BREADCRUMB-ITEM', 'LYTE-YIELD', 'LYTE-DRAWER-LABEL', 'LYTE-DRAWER-ITEM', 'LYTE-DROP-ITEM', 'LYTE-DROP-BUTTON','LYTE-DROP-LABEL', 'LYTE-EXPTABLE-TD', 'LYTE-EXPTABLE-TH', 'LYTE-GRID-CONTENT',
                        'LYTE-MENU-ITEM','LYTE-MENU-LABEL', 'LYTE-MENU-DESCRIPTION', 'LYTE-MODAL-HEADER', 'LYTE-NAV-ITEM', 'LYTE-POPOVER-HEADER', 'LYTE-STEP-HEAD','LYTE-STEP-BODY', 'LYTE-TAB-TITLE', 'LYTE-TAB-CONTENT', 'LYTE-TH', 'LYTE-TD','LYTE-TEXT', 'LYTE-TOUR-STEP-HEAD', 'LYTE-TOUR-STEP-CONTENT'],
                    ['DIV', 'A'],
                    []
                ]; 
            // parameters setting
            function setParams() { 
                if (params) { 
                    if (params.customNodes) { 
                        customNode = params.customNodes
                    } if (params.contextFunction) {
                        customFunction = params.contextFunction;
                    }
                }
            }
            function addCustomElements() {
                    customNode.forEach(function (element) {
                    if ($L(element).length > 1) {
                        Array.from($L(element)).forEach(function (elem) {
                            customNodeElements.push(elem);
                        })
                    } else if ($L(element).length === 1){ 
                        customNodeElements.push(element);
                    }
                });
            }
            // to map all the elems in the priority array with an index value
            function mapElements() { 
                configObj.mapObjects = new Map();
                for (let i = 0; i < priorityArray.length; i++) { 
                    for (let j = 0; j < priorityArray[i].length; j++) { 
                        configObj.mapObjects.set(priorityArray[i][j],[i,priorityArray[i].indexOf(priorityArray[i][j])])
                    }
                }
            }
            // to get the index value of the current target element
            function getIndex() {
                configObj.index = configObj.mapObjects.get(configObj.target.nodeName)
            }
            // to filter out unwanted lyte tags 
            function checkLyteTag(){
                let slicedTag = configObj.target.nodeName.slice(0, 5);
                if (slicedTag === lyteTag) { 
                    for (let i = 0; i < priorityArray[3].length; i++){
                        if (configObj.target.nodeName === priorityArray[3][i]) {
                            break;
                        } else if (i === priorityArray[3].length - 1) { 
                            lyteCheck = false;
                        }
                    }
                }
            }
            // to get all the nodes containing ignoreContext
            function getIgnoreElements() { 
                ignoreElements = Array.from(document.querySelectorAll('[ignore-context]') || document.querySelectorAll('[ignore-context = "true"]'));
                for (let i = 0; i < ignoreElements.length; i++) {
                    if ($L(ignoreElements[i]).attr('ignore-context') === "false") { 
                        ignoreElements.splice(i, 1);
                        if (ignoreElements.length > 1) { 
                            i--;
                        }
                    }
                };
            }
            // to ignore if the target contains ignoreContext
            function checkForIgnore() { 
                let elseCase = true;
                ignoreElements.forEach( function(parentElem) {
                    if (configObj.target === parentElem) {
                        elseCase = false;
                    } else if (isParent(parentElem, configObj.target)) {
                        elseCase = false;
                    }
                });
                if (elseCase) {
                    obj = new findRelevantElement();
                    obj.findNode();
                    isChild();
                    if (customNodeElements.indexOf(configObj.target) > -1 || isChildNode) { customFunction(); }
                    else { obj.findContext(); }
                } else { return; }
      
            }
            // to check if the DOM has any calculator component or not
            function checkforCalc(){ 
                let calObj = $L('lyte-calculator');
                // for (let i = 0; i < calObj.length; i++) { 
                //     Calcs.push(calObj[i]);
                // }
                if (calObj.length > 0) { areAnyCalc = true; }
            }
            // to check if the SPAN tag is inside a calculator component
            function isInsideCalc() { 
                if (configObj.target.nodeName === "SPAN") { 
                    let nearestCalc = $L(configObj.target).closest('lyte-calculator');
                    if (nearestCalc.length > 0) {
                        isInside = true;
                    }
                }
            }
            // to check if a node is a child of an element
            function isParent(parentElem, element) { 
                if ($L(parentElem).find(element).length > 0) { return true; }
                else if ($L(parentElem)[0] === element) { return true; }
                else { return false; }
            }
            function isChild() { 
                customNodeElements.forEach(function(element) {
                    if (isParent(element, configObj.target)) { isChildNode = true; }
                });
            }
            function isVisible (item) {
                return !!( item.offsetWidth || item.offsetHeight || item.getClientRects().length );
            }
            function getVisibleChildren(parent) { 
                let children = Array.from(parent.children);
                for (let i = 0; i < children.length; i++) {
                    if (!isVisible(children[i])) {
                        children.splice(i, 1);
                    }
                }
                return children;
            }
            function filterText(text) {
                if (text && text !== "") { 
                    text = text.replaceAll("\n", " ");
                    text = text.replaceAll("\t", "    ");
                    return text.trim();
                } else { return "" }
            }
            function checkForLtPropTitle() {
                if ((obj.finalTargetContext === "" || !obj.finalTargetContext)) {
                    if ((configObj.target.hasAttribute('lt-prop-title'))) {
                        obj.finalTargetContext = filterText(configObj.target.getAttribute('lt-prop-title'))
                    } else { 
                        if ($L(configObj.target).closest('[lt-prop-title]').length > 0) { 
                            obj.finalTargetContext = filterText($L(configObj.target).closest('[lt-prop-title]')[0].getAttribute('lt-prop-title'))
                        }
                    }
                }
            }
            // class containing the final element, context and methods to find those
            class findRelevantElement {
                    constructor() {
                        this.finalTarget = [];
                        this.finalTargetContext = undefined;
                        // to find the relevant node of the element
                        this.findNode = function () { 
                            let index = configObj.index;
                            // if the target is P tag:
                            function firstPriorityNode(that) {
                                that.finalTarget.push(configObj.target);
                            };
                            // if the target is a form element
                            function formElementsNode(that) { 
                                // for input andd textarea to return the node along with label if any
                                if (configObj.target.nodeName === "INPUT" || configObj.target.nodeName === "TEXTAREA") {
                                    if ($L(configObj.target).siblings('label').length > 0 || configObj.target.value != "") {
                                        let labelSiblings = $L(configObj.target).siblings('label');
                                        for (let i = 0; i < labelSiblings.length; i++) {
                                            if ($L(labelSiblings[i]).attr('for') === $L(configObj.target).attr("id")) {
                                                that.finalTarget.push(configObj.target, labelSiblings[i])
                                            }
                                        }
                                        if (that.finalTarget.length === 0) {
                                            that.finalTarget.push(configObj.target);
                                        }
                                    } else { that.finalTarget.push(configObj.target); }
                                } else { 
                                    that.finalTarget.push(configObj.target);
                                }
                            }
                            // for elements that gets covered or enveloped by P tag
                            function pConsumables(that) {
                                let targetParent = $L(configObj.target).parent()[0];
                                let siblings = $L(configObj.target).siblings(), defaultcase = true;
                                if (siblings.length > 0 && !isInside) {
                                    integrationCase = true;
                                    that.finalTarget[0] = (targetParent);
                                    // for (let i = 0; i < siblings.length; i++) {
                                    //     if (priorityArray[2].indexOf(siblings[i].nodeName) !== -1 || priorityArray[2].indexOf((siblings[i].nodeName).toLowerCase()) !== -1) {
                                    //         defaultcase = false;
                                    //         that.finalTarget[0] = (targetParent);
                                    //    }
                                    //     else { 
                                    //         defaultcase = false;
                                    //         that.finalTarget[0] = (configObj.target);
                                    //         break;
                                    //     }
                                    //     if (i === (siblings.length - 1)) { 
                                    //         let children = getVisibleChildren(targetParent);
                                    //         that.finalTarget[1] = children;
                                    //     }
                                    // }
                                } if ((targetParent.nodeName === "P" || targetParent.nodeName === "DIV") && !isInside) {
                                    defaultcase = false;
                                    that.finalTarget[0] = (targetParent);
                                } else { defaultcase = true; }
                                if (defaultcase) {
                                    that.finalTarget[0] = (configObj.target);
                               }
                            };
                            // for lyte elements
                            function lyteTags(that) {
                                that.finalTarget.push(configObj.target);
                            };
                            // for DIV tag
                            function lowPriority (that) {
                                that.finalTarget.push(configObj.target);
                            }
                            // for rest all elements
                            function normalTags(that) {
                                if (lyteCheck) { 
                                    that.finalTarget.push(configObj.target);
                                }
                            };
                            if (index && isVisible(configObj.target)) {
                                if (index[0] === 0) { firstPriorityNode(this); }
                                else if (index[0] === 1) { formElementsNode(this); }
                                else if (index[0] === 2) { pConsumables(this); }
                                else if (index[0] === 3) { lyteTags(this); }
                                else if (index[0] === 4) { lowPriority(this); }
                            } else { 
                                normalTags(this);
                            }
                        };
                    
                        this.findContext = function () {
                            let index = configObj.index;
                            function firstPriorityNodeContext(that) { 
                                that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                            };
                            function formElementsNodeContext(that) {
                                if (configObj.target.nodeName === "INPUT" || configObj.target.nodeName === "TEXTAREA") {
                                    let labelContext, value, placeHolderContent, ariaLabelValue;
                                    value = that.finalTarget[0].value;
                                    ariaLabelValue = $L(that.finalTarget[0]).attr('aria-label');
                                    placeHolderContent = $L(that.finalTarget[0]).attr('placeholder');
                                    // if there is a label 
                                    if (that.finalTarget[1]) {
                                        labelContext = filterText(that.finalTarget[1].innerText);
                                    } else { labelContext = undefined; }
                                    // if the finalTarget has aria-label
                                    if (ariaLabelValue && ariaLabelValue != "") {
                                        if (value != "") { that.finalTargetContext = ariaLabelValue + '(' + value + ')' }
                                        else { that.finalTargetContext = ariaLabelValue; }
                                    }
                                    // else if the finalTarget has label
                                    else if (labelContext && labelContext != "") {
                                        if (value != "") { that.finalTargetContext = labelContext + '(' + value + ')' }
                                        else { that.finalTargetContext = labelContext; }
                                    }
                                    // else if the finalTarget has placeHolder
                                    else if (placeHolderContent && placeHolderContent != "") {
                                        if (value != "") { that.finalTargetContext = placeHolderContent + '(' + value + ')' }
                                        else { that.finalTargetContext = placeHolderContent; }
                                    }
                                    // if it has value
                                    else if (value != "") {
                                        that.finalTargetContext = value;
                                    }
                                    // if it has value
                                    else if (value === "" && placeHolderContent === undefined &&
                                        labelContext === undefined && ariaLabelValue === undefined) { 
                                        that.finalTargetContext = "";
                                    }
                                } else if (configObj.target.nodeName === "IMG") {
                                    let value = $L(configObj.target).attr('alt'),
                                        source = $L(configObj.target).attr('src');
                                    if (value) { that.finalTargetContext = value; }
                                    // else { that.finalTargetContext = source; }
                                } else if (configObj.target.nodeName === "SELECT") {
                                    let firstOptionContent = filterText($L(configObj.target).children('option')[0].innerText);
                                    if ($L(configObj.target).siblings('label').length > 0) {
                                        let labelSiblings = $L(configObj.target).siblings('label');
                                        for (let i = 0; i < labelSiblings.length; i++) {
                                            if ($L(labelSiblings[i]).attr('for') === $L(configObj.target).attr("id")) {
                                               that.finalTargetContext = filterText(labelSiblings[i].innerText);
                                           }
                                       }
                                        that.finalTargetContext = that.finalTargetContext + '(' + firstOptionContent + ')'; 
                                    } else { 
                                        that.finalTargetContext = firstOptionContent;
                                    }
                                } else { 
                                    that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                                }
                            };
                            function pConsumablesContext(that) {
                                if (integrationCase) { 
                                    that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                                    // that.finalTargetContext = "";
                                    // for (let i = 0; i < that.finalTarget[1].length; i++) {
                                    //     that.finalTargetContext += filterText(that.finalTarget[1][i].innerText + " ");
                                    // }
                                } else {
                                    that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                                }
                            };
                            function lyteTagsContext(that) {
                                that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                            };
                            function lowPriorityContext(that) {
                                let divChildren = that.finalTarget[0].children;
                                if (divChildren.length !== 0) {
                                    let divContent = filterText(that.finalTarget[0].innerText),
                                        firstChildContent = filterText(divChildren[0].innerText), index;
                                    for (let i = 0; i < divChildren.length; i++){
                                        if (priorityArray[2].indexOf(divChildren[i].nodeName) === -1) {
                                            index = divContent.match(firstChildContent).index - 1;
                                            that.finalTargetContext = divContent.slice(0,index)
                                        }
                                        else {
                                            that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                                        }
                                    }
                                } else {
                                    that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                                }
                            };
                            function normalTagsContext(that) {
                                if (lyteCheck) { 
                                    that.finalTargetContext = filterText(that.finalTarget[0].innerText);
                                }
                            };
                            try {
                                if (index && isVisible(configObj.target)) {
                                    if (index[0] === 0) { firstPriorityNodeContext(this); }
                                    else if (index[0] === 1) { formElementsNodeContext(this); }
                                    else if (index[0] === 2) { pConsumablesContext(this); }
                                    else if (index[0] === 3) { lyteTagsContext(this); }
                                    else if (index[0] === 4) { lowPriorityContext(this); }
                                } else {
                                    normalTagsContext(this);
                                }
                                if ($L(configObj.target).attr("lt-prop-title")) { 
                                    this.finalTargetContext = this.finalTargetContext + $L(configObj.target).attr("lt-prop-title");
                                } 
                                if (this.finalTargetContext === "" || this.finalTargetContext === undefined) { 
                                    if ($L(configObj.target).attr("aria-label")) {
                                        this.finalTargetContext = $L(configObj.target).attr("aria-label");
                                    } else if ($L(configObj.target).attr("aria-labelledby")) { 
                                        this.finalTargetContext = $L("#" + $L(configObj.target).attr("aria-labelledby")).innerText;
                                    }
                                }
                            } catch (e) {
                                // console.error(e);
                            }
                        };                        
                    }
            }
            setParams();
            getIgnoreElements();
            addCustomElements();
            checkLyteTag();
            checkforCalc();
            if (areAnyCalc) { isInsideCalc(); }
            mapElements(); 
            getIndex();
            checkForIgnore();
            checkForLtPropTitle();

            return obj;
        };
    }
})();