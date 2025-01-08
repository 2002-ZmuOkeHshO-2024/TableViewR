(function () {
    if ($L) {
        $L.prototype.horizontalInfiniteScroll = function (param) {
            let table = this[0],
                tableWidth = getBCR(table).width, extraDivs;
            setSelector();
            
            function setSelector() { 
                if (!param.nonTable) { 
                    selector = "th";
                } else { selector = param.selector }
                if (!param.nonTable) { 
                    colSelector = "tr";
                } else { colSelector = param.colSelector}
            }
            for (var i = 0; i < param.displayElem; i++) {
                updatePopulateObject([i], i);
            }

            var colWidth = getBCR($L(selector)[0]).width;
            let elementThres = Math.floor(tableWidth / colWidth), totalElementCount;

            if (param.displayElem >= elementThres + 4) { extraDivs = 0; }
            else { extraDivs = 4; }

            totalElementCount = param.displayElem + extraDivs;

            for (var i = 0; i < totalElementCount; i++) {
                updatePopulateObject([i], i);
            }
            let tableCols = Array.from($L(colSelector)), rowWidth = getBCR(tableCols[0]).width,
                totalXShift = Number((rowWidth * totalElementCount).toFixed(2));
            
            setTransformProperty();

            var index = 0, indexLimit = tableCols.length, counter = totalElementCount;
            let prevScroll = 0, difference = 0;

            const leftObserver = new IntersectionObserver(function (entry) {
                if (!entry[0].isIntersecting && counter <= param.dataArray.length - 1) {
                    let elem = tableCols[index]
                    updatePopulateObject(index,counter)
                    $L(elem).css("transform", "translateX(" + Math.max((getXTransform($L(elem)) + totalXShift),0) + "px)");
                    leftObserver.unobserve(tableCols[index]);
                    index++;
                    counter++;
                    checkIndex();
                    leftObserver.observe(tableCols[index]);
                }
            }, {
                threshold: 0,
                root: table,
                rootMargin: colWidth * 0.75 + "px"
            })

            const rightObserver = new IntersectionObserver(function (entry) {
                if (entry[0].isIntersecting) {
                    rightObserver.unobserve(tableCols[index]);
                    index--;
                    counter--
                    checkIndex();
                    let elem = tableCols[index];
                    updatePopulateObject(index,counter)
                    $L(elem).css("transform", "translateX(" + Math.max((getXTransform($L(elem)) - totalXShift),0) + "px)");

                    rightObserver.observe(tableCols[index]);
                }
            }, {
                threshold: 0,
                root: table,
                rootMargin: colWidth * 0.75 + "px"
            })

            table.addEventListener('scroll', function (e) { 
                let currentScroll = $L(table).scrollLeft();
                difference = prevScroll - currentScroll;

                if (difference > 0) {
                    rightObserver.observe(tableCols[index]);
                    leftObserver.disconnect();
                } else if (difference < 0) { 
                    leftObserver.observe(tableCols[index]);
                    rightObserver.disconnect();
                }
                if (table.scrollLeft === 0) {
                    resetTable();
                }
                prevScroll = currentScroll;
            })

            function setTransformProperty() { 
                tableCols.forEach((element) => {
                        if ($L(element).css("transform") === "none") {
                            $L(element).css("transform", "translateX(0px)");
                          }
                    });
            }
            
            function getXTransform(elem) {
                try {
                  var XTranslate = elem[0].style.transform;
                  XTranslate = Number(/translateX\(([0-9\.]+)px\)/g.exec(XTranslate)[1]);
                  return XTranslate;
                }catch (e){ 
                  console.error(e);
                }
              }

            function updatePopulateObject(index, counter) { 
                Lyte.objectUtils(param.populateObject, "add", "elem" + index, param.dataArray[counter]);
            }

            function getBCR(element) { 
                return element.getBoundingClientRect();
            }
            function checkIndex() { 
                if (index === indexLimit) { index = 0 }
                else if (index === -1) { index = indexLimit - 1 }
            }
            // function checkIndex(ind) { 
            //     if (ind === indexLimit) { ind = 0 }
            //     else if (ind === -1) { index = indexLimit - 1 }
            //     return ind;
            // }
            function resetTable() {
                for (var i = 0; i < totalElementCount; i++) {
                    updatePopulateObject(i, i);
                }
                }
       };
    }
})();