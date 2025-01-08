(function () { 
  document.addEventListener("keydown",
    function (e) {
      var elem = document.activeElement, isKeyDownEvent, continuePropagation = false;
      var expandalbeRoles = ['listbox', 'combobox', 'menu']
      if (elem && elem.hasAttribute("aria-activedescendant") && elem.getAttribute("aria-activedescendant")) { 
        let element = document.querySelector("#" + elem.getAttribute("aria-activedescendant"))
        if (elem && element) {  
          elem = isVisible(element) ? element : elem;
        }
      }
      function checkForMenuItem(elem) { 
        if (elem && elem.hasAttribute("role") && elem.getAttribute("role").toLowerCase() === "menuitem"
          && (isKeyDownEvent = checkKeyDownEvent(elem)) && elem.hasAttribute("aria-activedescendant")) {
          let element = document.querySelector("#" + elem.getAttribute("aria-activedescendant"))
          if (element) {
            checkForMenuItem(element);
          } 
        } else { 
          return elem;
        }
      }
      if (elem && (isKeyDownEvent = checkKeyDownEvent(elem)) && elem.hasAttribute("role")) {
        if (elem.hasAttribute("continue-propagation")) { 
          continuePropagation = true;
        }
        if (e.key === "Enter" && elem.getAttribute("role").toLowerCase() !== "combobox") { 
          elem = checkForMenuItem(document.activeElement);
          if (!(expandalbeRoles.indexOf(elem.getAttribute("role")) > -1 && elem.getAttribute("aria-expanded") === "true")) {
            if (!continuePropagation) {
              e.stopImmediatePropagation();
            }
            e.preventDefault();
            elem.click();
            return;
          } else { 
            return
          }
        } 
        switch (elem.getAttribute("role").toLowerCase()) {
          // case "textbox":
          // 		if (e.code === "Enter") {
          // 			e.preventDefault();
          // 			if (elem.getAttribute("aria-multiline") === null ||
          // 				elem.getAttribute("aria-multiline") === "false") {
          // 				e.preventDefault();
          // 				document.querySelector("[type = 'submit']").click();
          // 			}
          // 		}
          // 	break;
          case "checkbox":
            if (e.key === " ") {
              if (!continuePropagation) { 
                e.stopImmediatePropagation();
              }
              e.preventDefault();
              elem.click();
            }
            break;
          case "button":
            if (e.key === " ") {
              if (!continuePropagation) { 
                e.stopImmediatePropagation();
              }
              e.preventDefault();
              elem.click();
            }
            break;
          case "radiogroup":
            {
              const options = Array.from(elem.querySelectorAll("[role='radio']"));
              var flag = false, idx;
              options.map(function (elem, index) {
                if (elem.getAttribute("aria-checked") === "true") {
                  flag = true;
                  idx = index;
                }
              })
              if (e.code === "ArrowDown" || e.code === "ArrowRight") {
                if (!continuePropagation) { 
                  e.stopImmediatePropagation();
                }
                e.preventDefault();
                if (flag) {
                  options[idx].setAttribute("aria-checked", "false");
                  if ((idx + 1) >= options.length) { idx = 0; }
                  else { idx = idx + 1; }
                  options[idx].setAttribute("aria-checked", "true");
                }
              }
              if (e.code === "ArrowUp" || e.code === "ArrowLeft") {
                if (!continuePropagation) { 
                  e.stopImmediatePropagation();
                }
                e.preventDefault();
                if (flag) {
                  options[idx].setAttribute("aria-checked", "false")
                  if ((idx - 1) < 0) { idx = (options.length - 1); }
                  else { idx = idx - 1; }
                  options[idx].setAttribute("aria-checked", "true");
                }
              }
              if (e.code === "Space") {
                if (!continuePropagation) { 
                  e.stopImmediatePropagation();
                }
                e.preventDefault();
                options[0].click();
              }
            }
            break;
          case "link":
            if (e.key === "Enter") {
              if (!continuePropagation) { 
                e.stopImmediatePropagation();
              }
              e.preventDefault();
              const ref = e.target;
              if (ref) {
                window.open(ref.getAttribute("data-href"));
              }
            }
            break;
          case "switch":
            if (e.key === " ") {
              if (!continuePropagation) { 
                e.stopImmediatePropagation();
              }
              e.preventDefault();
              elem.click();
            }
            break;
            case "menuitem":
              // if (e.key === " ") {
              //   e.preventDefault();
              //   elem.click();
              // } else
  
            let openingKey, closingKey, popOverQuery;
              if (elem.getAttribute("lt-prop-popup-position") === "right") { 
                openingKey = "ArrowRight"
                closingKey = "ArrowLeft"
              } else {
                openingKey = "ArrowLeft"
                closingKey = "ArrowRight"
              } 
  
              if (elem.hasAttribute("lt-prop-query")) { 
                popOverQuery = elem.getAttribute("lt-prop-query");
              }
            
              if (e.key === openingKey) {
                if (!continuePropagation) {
                  e.stopImmediatePropagation();
                }

                if (elem.hasAttribute("lt-prop-query")) { 
                  if ($L(popOverQuery)[0].tagName === 'LYTE-MENU' || $L(popOverQuery)[0].tagName === 'LYTE-POPOVER') { 
                    $L(popOverQuery)[0].getData("ltPropShow") === false ? $L(popOverQuery)[0].setData("ltPropShow", true) : undefined;
                  }
                } else if (elem.hasAttribute("lt-prop-aria-event") && elem.getAttribute("lt-prop-aria-event") === "click") { 
                  elem.click();
                } else if (elem.hasAttribute("aria-expanded")) { 
                  if (elem.getAttribute("aria-expanded") === "false") {
                    e.preventDefault();
                    elem.click();
                    elem.setAttribute("aria-expanded", "true")
  
                  }
                } 

                
              } else if (e.key === closingKey) { 
                if (!continuePropagation) {
                  e.stopImmediatePropagation();
                }
                  
                if (elem.hasAttribute("lt-prop-query")) { 
                  if ($L(popOverQuery)[0].tagName === 'LYTE-MENU' || $L(popOverQuery)[0].tagName === 'LYTE-POPOVER') { 
                    $L(popOverQuery)[0].getData("ltPropShow") === true ? $L(popOverQuery)[0].setData("ltPropShow", false) : undefined;
                  }
                } else if (elem.hasAttribute("lt-prop-aria-event") && elem.getAttribute("lt-prop-aria-event") === "click") { 
                  elem.click();
                } else if (elem.hasAttribute("aria-expanded")) { 
                    if (elem.getAttribute("aria-expanded") === "true") {
                      e.preventDefault();
                      elem.click();
                      elem.setAttribute("aria-expanded", "false")
                    }
                }
                  
                  
              }
              break;
          case "combobox":
            {
              if (e.key === "Enter" && elem.getAttribute("aria-expanded") === "false") {
                if (!continuePropagation) { 
                  e.stopImmediatePropagation();
                }
                e.preventDefault();
                elem.click();
              } else if (e.key === "Tab" && elem.getAttribute("aria-expanded") === "true") {
                if (elem.hasAttribute("lt-prop-tab-click") && elem.getAttribute("lt-prop-tab-click") === "false") {
                  break;
                }
                if (!continuePropagation) { 
                  e.stopImmediatePropagation();
                }
                e.preventDefault();
                elem.click();
              }
              if (e.key === " ") {
                if (!continuePropagation) { 
                  e.stopImmediatePropagation();
                }
                e.preventDefault();
                elem.click();
              }
            }
            break;
          case "option":
            {
              let options = Array.from($L($L(elem).parent()).children("[role=option]")), index,
              parentID = $L(elem).parent().attr("id"),
              inputField = document.querySelector("[aria-controls=" + parentID + "]");
              index = options.indexOf(elem);
              if (e.key === "ArrowDown") {
                index++;
                if (index === options.length) { index = 0 };
                $L(options[index]).focus();
              } else if (e.key === "ArrowUp") { 
                if (e.altKey) {
                  inputField.focus()
                } else { 
                  index--;
                  if (index === -1) { index = options.length - 1 };
                  $L(options[index]).focus();
                }
              }
            }
            break;
        }
      }
    }, true);
    function checkKeyDownEvent(elem){ 
      var isKeyDownEvent = elem.getAttribute("lt-prop-aria-keydown");
      if (isKeyDownEvent === null || isKeyDownEvent === "false") { isKeyDownEvent = false; }
      else if (isKeyDownEvent === "" || isKeyDownEvent === "true") { isKeyDownEvent = true; }
              return isKeyDownEvent;
    }
    function isVisible (item) {
      return !!( item.offsetWidth || item.offsetHeight || item.getClientRects().length );
    }
})();