// (function () {
//     if (lyteDomObj) {
//         lyteDomObj.prototype.ariaKeyNav = function (params) {
//             var parent = this[0], orientation, selector = params.itemsSelector,
//                 className = selector.slice(1),
//                 tabElements = Array.from($L(selector)), index = 0;
            
//             if ($L(parent).attr('aria-orientation') === "vertical") {
//                 orientation = "vertical";
//             } else { orientation = "horizontal"; }
                
//             function setTabIndex(ignoreElem) {
//                     tabElements.forEach( function(element) {
//                         if (element !== ignoreElem) {
//                             element.tabIndex = -1;
//                         } else { ignoreElem.tabIndex = 0; }
//                     });
//             }
//             function decreaseIndex() {
//                 if (index === 0) {
//                     index = tabElements.length - 1;
//                 } else { index -= 1; }
//             }
//             function increaseIndex() {
//                 if (index === (tabElements.length - 1)) {
//                     index = 0;
//                 } else { index += 1; }
//             }
//             function setFocus() {
//                 setTabIndex(tabElements[index]);
//                 tabElements[index].focus();
//             }
//             setTabIndex(tabElements[0]);

//             $L(parent).click(function (e) {
//                 if (tabElements.includes($L(e.target).closest(selector)[0]) || $L(e.target).hasClass(className)) {
//                     let elem = $L(e.target).closest(selector)[0];
//                     elem.focus();
//                     index = tabElements.indexOf(elem);
//                     setTabIndex(elem);
//                 }
//                 else if (!tabElements.includes(e.target)) {
//                     tabElements[0].focus();
//                     index = 0;
//                     setTabIndex(tabElements[0]);
//                 }
//             })
//             $L(parent).keydown(function (e) {
//                 if (orientation === "horizontal") {
//                     if (e.key === "ArrowLeft") {
//                         e.preventDefault();
//                         decreaseIndex();
//                         setFocus();

//                     }
//                     else if (e.key === "ArrowRight") {
//                         e.preventDefault();
//                         increaseIndex();
//                         setFocus();
//                     }
//                 }
//                 else if (orientation === "vertical") {
//                     if (e.key === "ArrowUp") {
//                         e.preventDefault();
//                         decreaseIndex();
//                         setFocus();
//                     }
//                     else if (e.key === "ArrowDown") {
//                         e.preventDefault();
//                         increaseIndex();
//                         setFocus();
//                     }
//                 }
//                 if (e.key === "Home") {
//                     e.preventDefault();
//                     index = 0;
//                     setFocus();
//                 }
//                 else if (e.key === "End") {
//                     e.preventDefault();
//                     index = tabElements.length-1;
//                     setFocus();
//                  }
//             })
//         };

// })();
