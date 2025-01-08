/**
 * Issues
 * block it for mobiles
 * Valid cases
 * ("alt+enter", "shift+enter", "b", "B", "meta+l", "meta+y", ' a b c ', 'Meta', "z+?", 'x z',  "c+m", "c +r", "c",
 * 'q w r t', "meta+i", "control + j", "$", "k+₹", "₹", "›", "f5", "meta+f8", "plus", "space", "Shift+ArrowDown",
 *  "/\\d/i", "/[a-z]{4}/i", ["meta+k", "control+m", "shift+backspace", "n"], ["meta+c", "meta+v", "meta+a"], "Control+F5")
 * Invalid Cases
 * ("meta+shift+plus", "Control+arrowleft", "alt+3", "alt+o", "alt+£", "shift+P", "shift+$", "Shift+1", "Shift+[", "shift+alt+o")
 * On keydown of any letter after meta will only fire the alphabet in small letter,no matter shift or capslock is used
*/

/**
 * Intializes the shortcut library
 * @param {object} window - window object
 * @param {document} document - document object
 */

; (function (window, document) {
  // Private Variables
  var _registeredKeys = {};
  var _registeredKeyShortcuts = {};
  var _timeoutID;
  var _allPressed = []
  var _allCodePressed = []
  var _shortcutCounter = {}
  var _keyShortcutCounter = {}
  var codeShortcutCounter = {}
  var _funcId
  var _clickId
  var _shortcutEnabled = true;
  var _registeredWrappers = [];

  var _splittingKeys = new Map([
    [" ", "space"],
    [" ", "space"],
    ["+", "plus"]
  ]);
  var codeKeys = new Map([
    ["shiftleft", "shift"],
    ["shiftright", "shift"],
    ["metaleft", "meta"],
    ["metaright", "meta"],
    ["altleft", "alt"],
    ["altright", "alt"],
    ["controlleft", "control"],
    ["controlright", "control"]
  ]);

  var _specialKeys = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'control',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    91: 'meta',
    92: 'meta', // windows key
    93: 'meta',
    224: 'meta'
  }

  var _otherSpecialKeys = {
    48: ')',
    49: '!',
    50: '@',
    51: '#',
    52: '$',
    53: '%',
    54: '^',
    55: '&',
    56: '*',
    57: '(',
    187: 'plus',
    188: '<',
    190: '>',
    191: '?',
    192: '~',
    219: '{',
    220: '|',
    221: '}',
    222: '"'
  }

  // Private Methods

  /**
   * Checks whether the two array are equal or not
   * @param {Object} arr1
   * @param {Object} arr2
   * @returns boolean
   */
  function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) { return false; }
    return arr1.every(function (element, index) {
      return element === arr2[index];
    });
  }

  /**
   * Checks if the current key is a modifier
   * @param {string} string - The string which contains the currently processed key
   */
  function _checkIfModifier(string) {
    string = string.toLowerCase()
    return string === "control" || string === "command" || string === "alt" || string === "shift" || string === "meta"
  }

  /**
   * Checks if the character is a function key
   * @param {string} character - The character that should be checked
   */
  function _checkIfFunctionKey(character) {
    character = character.toLowerCase()
    if (character.includes('f')) {
      for (var i = 1; i <= 12; i++) {
        if (character === ('f' + i)) {
          return true
        }
      }
    }
    return false
  }

  /**
   * Checks if there are any alphanumeric charcters
   * @param {Object} shortcutKeys
   */
  function checkAlphaNumeric(shortcutKeys) {
    function checkLength(element) {
      return element.trim().length > 1;
    }
    var keys = shortcutKeys.slice()
    return (keys.every(checkLength))
  }

  /**
   * Check if _splittingKeys are included in keys to be registered
   * We only allow special keys to be combined with alt and plus, using length of keys.
   * But since plus and space are added in words, they have to be prevented from registering shortcut.
   * @param {object} shortcutKeys Array of keys
   */
  function checkForSeperators(shortcutKeys) {
    function checkSplittingKeys(element) {
      var splittingKeys = Array.from(_splittingKeys.values())
      return splittingKeys.some(function (splittingKey) { return (splittingKey === element.trim().toLowerCase()) })
    }
    var keys = shortcutKeys.slice()
    return keys.some(checkSplittingKeys)
  }

  /**
   * Checks whether the shortcut is valid or not
   * @param {object} shortcutKeys
   */

  // Applies to all underscored identifier names
  function checkValid(shortcutKeys) {
    if (shortcutKeys.includes('+')) {
      shortcutKeys = shortcutKeys.split('+');
    }
    else if (shortcutKeys.includes(' ')) {
      shortcutKeys = shortcutKeys.split(' ');
    }
    else {
      shortcutKeys = [shortcutKeys];
    }
    if (shortcutKeys.length === 1) {
      if (['meta', 'shift', 'alt', 'control'].includes(shortcutKeys[0])) {
        return false;
      }
    }

    var arrayLength = shortcutKeys.length;
    var element, i;
    for (i = 0; i < arrayLength; i++) {
      element = shortcutKeys[i].trim()
      if ("dead" === element.toLowerCase()) {
        return false;
      }
      if ("alt" === element.toLowerCase() || "shift" === element.toLowerCase()) {
        if (checkAlphaNumeric(shortcutKeys) && !checkForSeperators(shortcutKeys)) {
          return true;
        }
        else { return false; }
      }
    }
    return true
  }

  /**
   * Checks whether the keys in registerCode are in correct format
   * @param {string} shortcutKeys
   * @returns true if keys are properly added
   */
  function checkCodeKeys(shortcutKeys) {
    if (shortcutKeys.includes('+')) {
      shortcutKeys = shortcutKeys.split('+')
    }
    else if (shortcutKeys.includes(' ')) {
      shortcutKeys = shortcutKeys.split(' ')
    }
    else {
      shortcutKeys = [shortcutKeys]
    }

    var arrayLength = shortcutKeys.length;
    var element, i;
    for (i = 0; i < arrayLength; i++) {
      element = shortcutKeys[i].trim()
      if (element.length === 1) {
        return false;
      }
    }
    return true
  }

  /**
   * Checks if the shortcut to be registered is a valid shortcut
   * @param {string} character - The shortcut keys that should be checked
   */
  function removeWhiteSpace(shortcutKeys) {
    shortcutKeys = shortcutKeys.split('+');
    var arrayLength = shortcutKeys.length;
    for (let i = 0; i < arrayLength; i++) {
      shortcutKeys[i] = shortcutKeys[i].trim()
      // Case Insensitive
      shortcutKeys[i] = shortcutKeys[i].toLowerCase()
    }
    shortcutKeys = shortcutKeys.join("+");
    return (shortcutKeys);
  }

  /**
   * Split keys in modifiers and normal keys
   * @param {string} keys - The keys registered to shortcut
   */
  function segregateKeys(keys) {
    var keyArray = _splitArray(keys)
    var modifier = []
    for (var i = 0; i < keyArray.length; i++) {
      if (_checkIfModifier(keyArray[i])) {
        keyArray[i] = keyArray[i] === 'command' ? 'meta' : keyArray[i]
        if (keys.indexOf('+') != -1) {
          modifier.push(keyArray[i])
          keyArray.splice(i, 1)
          i--;
        }
      }
      else if (_checkIfFunctionKey(keyArray[i])) {
        keyArray[i] = keyArray[i].toLowerCase()
      }
    }
    var pressTogether
    if (keys.indexOf('+') !== -1) {
      keyArray = keyArray.join('+')
      pressTogether = true
    }
    else {
      keyArray = keyArray.join(' ')
      pressTogether = false
    }
    return {
      modifier: modifier,
      newKey: keyArray,
      pressTogether: pressTogether
    }
  }

  /**
   * Split keys and build an array
   * @param {string} keys - split between spaces or plus
   */
  function _splitArray(keys) {
    if (keys.indexOf('+') !== -1) {
      return keys.split('+')
    }
    else {
      return keys.split(' ')
    }
  }

  /**
   * @returns All the registered shortcuts
   */
  function getAllRegisteredShortcutKeys() {
    var allRegisteredShortcutKeys = Object.assign({}, _registeredKeys);
    Object.assign(allRegisteredShortcutKeys, _registeredKeyShortcuts)
    return allRegisteredShortcutKeys
  }

  /**
   *Check whether the shortcut is a regex method or not
   * @param {string} shortcutKey
   * @returns whether it is a REGEX shortcut or not
   */
  function isRegexKey(shortcutKey) {
    if (shortcutKey.indexOf('r:') !== -1) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * remove special keys before checking for a cross match for REGEX
   */
  function removeSpecialKeysFromAllPressedKeys() {
    var _specialKeys = ['backspace', "plus", 'tab', 'enter', 'shift', 'control', 'alt', 'capslock', 'escape', 'space', 'pageup', 'pagedown', 'end', 'home', 'arrowleft', 'arrowup', 'arrowright', 'arrowdown', 'insert', 'delete', 'meta', "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"]
    var pressedKeysWithoutSpecialKeys = _allPressed.filter(x => !_specialKeys.includes(x));
    return pressedKeysWithoutSpecialKeys
  }

  /**
   * Matches the input for regular expressions
   * @param {string} shortcutKey
   */
  function handleRegularExpressions(shortcutKey) {
    var pressedKeysWithoutSpecialKeys = removeSpecialKeysFromAllPressedKeys()
    var exp = shortcutKey.substring(2)
    var matches = exp.match(new RegExp('^/(.*?)/([gimy]*)$'))
    var regex = new RegExp(matches[1], matches[2])
    if (regex.test(pressedKeysWithoutSpecialKeys.join(''))) {
      _shortcutCounter[shortcutKey] = 1
      // return true
    }
    else {
      _shortcutCounter[shortcutKey] = 0
      // return false
    }
  }

  function getAllShortcutKeysWithCode() {
    var codeRegisteredKeys = {}
    for (var shortcutKey in _registeredKeyShortcuts) {
      var shortcutArray = []
      if (!isRegexKey(shortcutKey)) {
        for (var i = 0; i < _registeredKeyShortcuts[shortcutKey].length; i++) {
          var item = _registeredKeyShortcuts[shortcutKey][i]
          if (item.useCode) {
            shortcutArray.push(item)
          }
        }
        codeRegisteredKeys[shortcutKey] = shortcutArray
      }
    }
    return codeRegisteredKeys
  }
  function getAllShortcutKeysWithoutCode() {
    var codeRegisteredKeys = {}
    var allRegisteredShortcuts = getAllRegisteredShortcutKeys()
    for (var shortcutKey in allRegisteredShortcuts) {
      if (!isRegexKey(shortcutKey)) {
        var shortcutArray = []
        var flag = false
        for (var i = 0; i < allRegisteredShortcuts[shortcutKey].length; i++) {
          var item = allRegisteredShortcuts[shortcutKey][i]
          if (!(item.useCode)) {
            flag = true
            shortcutArray.push(item)
          }
        }
        if (flag) {
          codeRegisteredKeys[shortcutKey] = shortcutArray
        }
      }
      else {
        codeRegisteredKeys[shortcutKey] = allRegisteredShortcuts[shortcutKey]
      }
    }
    return codeRegisteredKeys
  }

  /**
   * Increase character pointer of all the registered keys if the match
   * @param {string} character - currently pressed character
   */
  function _increaseCharPointer(currentPressedCharacter) {
    var allRegisteredShortcutKeys = getAllRegisteredShortcutKeys();

    for (var shortcutKey in allRegisteredShortcutKeys) {
      if (isRegexKey(shortcutKey)) {
        handleRegularExpressions(shortcutKey)
        continue;
      }
      var keyArray = _splitArray(shortcutKey)
      var progress
      _shortcutCounter[shortcutKey] = progress = _shortcutCounter[shortcutKey] ? _shortcutCounter[shortcutKey] : 0
      var nextCharacterInShorcutKeySequence = (keyArray[progress] || "")
      if (currentPressedCharacter === nextCharacterInShorcutKeySequence) {
        _shortcutCounter[shortcutKey]++;
      }
      else {
        _shortcutCounter[shortcutKey] = 0
      }
    }
  }

  function increaseCharPointerCode(currentPressedCharacter) {
    var allShortcutKeys = getAllShortcutKeysWithCode();
    if (currentPressedCharacter !== "shift" && currentPressedCharacter !== "alt") {

      for (var shortcutKey in allShortcutKeys) {
        var keyArray = _splitArray(shortcutKey)
        var progress
        codeShortcutCounter[shortcutKey] = progress = codeShortcutCounter[shortcutKey] ? codeShortcutCounter[shortcutKey] : 0
        var nextCharacterInShorcutKeySequence = (keyArray[progress] || "")
        if (currentPressedCharacter === nextCharacterInShorcutKeySequence) {
          codeShortcutCounter[shortcutKey]++;
        }
        else {
          codeShortcutCounter[shortcutKey] = 0
        }
      }
    }
  }

  function increaseCharPointerKey(currentPressedCharacter) {
    var allRegisteredShortcutKeys = getAllShortcutKeysWithoutCode();
    if (currentPressedCharacter !== "shift" && currentPressedCharacter !== "alt") {
      for (var shortcutKey in allRegisteredShortcutKeys) {
        var keyArray = _splitArray(shortcutKey)
        var progress
        _keyShortcutCounter[shortcutKey] = progress = _keyShortcutCounter[shortcutKey] ? _keyShortcutCounter[shortcutKey] : 0
        var nextCharacterInShorcutKeySquence = (keyArray[progress] || "")
        if (nextCharacterInShorcutKeySquence.toLowerCase() === currentPressedCharacter.toLowerCase()) {
          _keyShortcutCounter[shortcutKey]++;
        }
        else {
          _keyShortcutCounter[shortcutKey] = 0
        }
      }
    }
  }

  // Checks if the active element is a input/select/textarea
  function _checkActiveElement() {
    var activeElement = document.activeElement
    var tagName = activeElement.tagName
    var classList = activeElement.classList
    var inputTypesAllowed = ['checkbox', 'radio', 'file', 'color', 'range']
    var unallowedClasses = ['lyteDummyEventContainer']
    if (((tagName === 'INPUT' && inputTypesAllowed.indexOf(activeElement.type) === -1)
      || activeElement.hasAttribute('contenteditable') || activeElement.getAttribute('contenteditable') === "true" || tagName === 'SELECT' || tagName === 'TEXTAREA')
      && !activeElement.classList.contains('lyte-shortcut')) {
      return true;
    }
    unallowedClasses.forEach(function (activeClass) {
      if (classList.contains(activeClass)) {
        return true
      }
    });
    return false
  }

  /**
   * Calls a the matched element which should be invoked.
   * @param {function} func - The callback that must be invoked
   * @param {number} wait - A wait period where a user can press a different key to invoke a different element
   * @param {object} event - The current keydown event
   */
  // return true - prevent default behaviour of the  shortcut
  // return false - not  prevent default behaviour of the  shortcut
  function _invokeFunction(func, wait, event, invokedKey, preventDefault) {
    if (wait) {
      _flushTimeout()
      if (preventDefault) {
        event.preventDefault()
      }

      _funcId = setTimeout(function () {
        var prevent
        if (preventDefault) {
          func.call(window, event, invokedKey)
        }
        else {
          prevent = func.call(window, event, invokedKey)
          prevent = prevent === false ? true : prevent
          if (prevent) {
            event.preventDefault()
          }
        }
        _shortcutCounter = {}
        _keyShortcutCounter = {}
        _allPressed = []

        _allCodePressed = []
        codeShortcutCounter = {}

      }, wait)

    }
    else {
      _flushTimeout()


      var prevent
      if (preventDefault) {
        event.preventDefault()
        func.call(window, event, invokedKey)
      }
      else {
        prevent = func.call(window, event, invokedKey)
        prevent = prevent === false ? true : prevent
        if (prevent) {
          event.preventDefault()
        }
      }
      _shortcutCounter = {}
      _keyShortcutCounter = {}
      _allPressed = []

      _allCodePressed = []
      codeShortcutCounter = {}
    }
  }

  // Get the parent dropdown
  function getDropdownFromItem(element) {
    while (element && element.tagName !== 'LYTE-DROP-BOX' && element.tagName !== 'BODY') {
      element = element.parentNode
    }

    if (!element || element.tagName == 'BODY') {
      return;
    }

    var drp = element.origindd;

    if (!drp) {
      while (element && element.tagName !== 'LYTE-DROPDOWN' && element.tagName !== 'BODY') {
        element = element.parentNode
      }
      drp = element;
    }
    var component = drp.component;
    return component;
  }

  function _isVisible(element) {
    var tagName = element.tagName
    var parent = element;
    switch (tagName) {
      case 'BUTTON':
      case 'LYTE-ACCORDION-ITEM':
      case 'LYTE-NAV-ITEM':
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        break;
      case 'LYTE-DROP-ITEM':
        var dropdown = getDropdownFromItem(element);
        if (dropdown) {
          dropdown = dropdown.$node;
          var disabled = dropdown.ltProp('disabled');
          if (disabled) {
            return false
          }
          else {
            return !!(dropdown.offsetWidth || dropdown.offsetHeight || dropdown.getClientRects().length);
          }
        }
        else {
          return false;
        }
      case 'LYTE-MENU-ITEM':
        while ( parent && parent.tagName !== 'LYTE-MENU-BODY' ) {
          parent = parent.parentNode
        }
        var menu = parent.parent
        var query = menu.ltProp('query')
        var all = document.querySelectorAll(query)
        for (var i = 0; i < all.length; i++) {
          var isVisible = !!(all[i].offsetWidth || all[i].offsetHeight || all[i].getClientRects().length);
          if (isVisible) {
            return true
          }
        }
        return false
    }
  }

  /**
   * Triggers a click event on the element that is matched
   * @param {HTMLElement} element - The HTMLElement that should be clicked
   * @param {number} wait - A wait period where a user can press a different key to invoke a different element
   */
  function _invokeClick(element, wait, preventDefault) {
    element = element.tagName === 'LYTE-BUTTON' ? element.querySelector('button') : element;
    var isVisible = _isVisible(element)
    if (!isVisible) {
      return;
    }
    if (preventDefault) {
      return;
    }
    if (wait) {
      _flushTimeout()
      _clickId = setTimeout(function () {
        element.click()
        _shortcutCounter = {}
        _keyShortcutCounter = {}
        _allPressed = []

        _allCodePressed = []
        codeShortcutCounter = {}
      }, wait)
    }
    else {
      _flushTimeout()
      element.click()
      _shortcutCounter = {}
      _keyShortcutCounter = {}
      _allPressed = []

      _allCodePressed = []
      codeShortcutCounter = {}
    }
  }

  /**
   * Clears the timeout in both the invoke functions
   */
  function _flushTimeout() {
    clearTimeout(_funcId)
    clearTimeout(_clickId)
  }

  /**
   * Callbacks/elements that need to be invoked/clicked
   * @param {array} matchedElements - all the keys that have matched the current sequence of characters
   */
  function _invokeMatchedElements(matchedElements, event) {
    for (var i = 0; i < matchedElements.length; i++) {

      var excludeElements = matchedElements[i].excludeElements

      var validate = matchedElements[i].validate

      // Validate Function decides the invocation of shortcut
      var isValid = validate.call(window, event, invokedKey)
      if (!isValid) {
        return;
      }

      //ExcludeElements starts
      var activeElement = document.activeElement
      var tagName = activeElement.tagName.toLowerCase()
      if (excludeElements) {
        // if (excludeElements && excludeElements.length) {
        for (let i = 0; i < excludeElements.length; i++) {
          const element = excludeElements[i];
          if (element.startsWith('[') && element.endsWith(']')) {
            var selector = element.substring(1, element.indexOf('='));
            var value = element.substring(element.indexOf('=') + 2, element.length - 2);
            var attributeValue = activeElement.getAttribute(selector);
            if (attributeValue && attributeValue.includes(value)) {
              return;
            }
          }
          else if (tagName === element) {
            return;
          }
        }
        // if (excludeElements.length === 0) {
        //   // Execute shortcut everywhere
        // }
      }
      else {
        var shouldReject = _checkActiveElement();
        if (shouldReject) {
          return;
        }
      }
      //ExcludeElements ends

      var value = matchedElements[i].value
      var wait = matchedElements[i].wait
      var preventDefault = matchedElements[i].preventDefault
      var invokedKey = matchedElements[i]._invokedKey
      if (typeof value === 'function') {
        _invokeFunction(value, wait, event, invokedKey, preventDefault)
      }
      else {
        _invokeClick(value, wait, preventDefault)
      }
    }
  }

  /**
   * get all the modifiers that are currently pressed
   * @param {object} event - the keydown event
   */
  function _getModifiers(event) {
    var modifier = []
    if (event.altKey) {
      modifier.push('alt')
    }
    if (event.ctrlKey) {
      modifier.push('control')
    }
    if (event.shiftKey) {
      modifier.push('shift')
    }
    if (event.metaKey) {
      modifier.push('meta')
    }
    return modifier
  }

  function _getFilteredModifiers(event) {
    var modifier = []
    if (event.ctrlKey) {
      modifier.push('control')
    }
    if (event.metaKey) {
      modifier.push('meta')
    }
    return modifier
  }
  /**
   * removes the smaller shortcut from the matched shortcuts
   * @param {object} foundMatches dictonary have all the matchedShortcuts
   * @param {object} allValues Array of matched shortcut entries
   * @remove the smaller matched shortcuts
   */
  function removeSmallShortcuts(foundMatches, allValues) {
    var allMatchedKeys = Object.keys(foundMatches);
    allMatchedKeys.sort((a, b) => b.length - a.length);
    var largest = "";
    for (var i = 0; i < allMatchedKeys.length; i++) {
      var currentKey = allMatchedKeys[i];
      for (var j = i + 1; j < allMatchedKeys.length; j++) {
        if (currentKey.includes(allMatchedKeys[j])) {
          // If the current string is a substring of another string,
          // check if it is larger than the current largest string
          if (largest.length < currentKey.length) {
            largest = currentKey;
          }
        }
      }
    }

    if (largest) {
      allMatchedKeys.forEach(element => {
        if (largest !== element) {
          delete foundMatches[element];
        }
      });
      for (var i = 0; i < allValues.length; i++) {
        var element = allValues[i];

        if (largest !== element._invokedKey) {
          allValues.splice(i, 1);
        }
      }
    }
    return [foundMatches, allValues];
  }

  /**
   * get all the matching elements for the current sequence
   * @param {object} event - the keydown event
   */
  function _getMatchedElements(event) {
    var allValues = [], foundMatches = {};
    var allModifier = _getModifiers(event)
    var filteredModifiers = _getFilteredModifiers(event)

    // _invokedKey writes in the global object but it won't cause problems i guess
    var allRegisteredShortcutKeys = getAllShortcutKeysWithoutCode();
    for (var keys in _shortcutCounter) {
      if (keys.indexOf('r:') !== -1 && _shortcutCounter[keys] > 0) {
        var item = allRegisteredShortcutKeys[keys]
        item._invokedKey = keys
        allValues.push(item)
        continue
      }
      if (allRegisteredShortcutKeys[keys]) {
        for (var i = 0; i < allRegisteredShortcutKeys[keys].length; i++) {
          var item = allRegisteredShortcutKeys[keys][i]
          if (item.modifier.length <= 0) {
            if (item.pressTogether) {
              if (_keyShortcutCounter[keys] === _splitArray(keys).length && _allPressed.join("+").includes(keys)) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
            else {
              if (_splitArray(keys).length !== 1 && _keyShortcutCounter[keys] === _splitArray(keys).length && _allPressed.length === _splitArray(keys).length && _allPressed.join(" ").includes(keys)) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }

              else if (!event.metaKey && !event.ctrlKey && _splitArray(keys).length === 1 && _keyShortcutCounter[keys] === _splitArray(keys).length && _allPressed.join(" ").includes(keys)) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
          }
          else {
            if (item.pressTogether) {
              if (!allModifier.includes('meta')) {
                if (_shortcutCounter[keys] === _splitArray(keys).length && item.modifier.sort().join('+') === allModifier.sort().join('+') && _allPressed.join("+").includes(keys)) {
                  item._invokedKey = item.modifier.sort().length !== 0 ? item.modifier.sort().join('+') + "+" + keys : keys
                  allValues.push(item)
                  foundMatches[keys] = true;
                }
                else if (_keyShortcutCounter[keys] === _splitArray(keys).length && item.modifier.sort().join('+') === filteredModifiers.sort().join('+') && _allPressed.join("+").includes(keys)) {
                  item._invokedKey = item.modifier.sort().length !== 0 ? item.modifier.sort().join('+') + "+" + keys : keys
                  allValues.push(item)
                  foundMatches[keys] = true;
                }
              }
              else {
                if (_shortcutCounter[keys] === _splitArray(keys).length && item.modifier.sort().join('+') === allModifier.sort().join('+') && _allPressed.join("+").includes(keys) && allModifier.length === item.modifier.length) {
                  item._invokedKey = item.modifier.sort().length !== 0 ? item.modifier.sort().join('+') + "+" + keys : keys
                  allValues.push(item)
                  foundMatches[keys] = true;
                }
                else if (_keyShortcutCounter[keys] === _splitArray(keys).length && item.modifier.sort().join('+') === filteredModifiers.sort().join('+') && _allPressed.join("+").includes(keys) && allModifier.length === item.modifier.length) {
                  item._invokedKey = item.modifier.sort().length !== 0 ? item.modifier.sort().join('+') + "+" + keys : keys
                  allValues.push(item)
                  foundMatches[keys] = true;
                }
              }
            }
            else {
              if (_shortcutCounter[keys] === _splitArray(keys).length && _allPressed.join(" ").includes(keys)) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
          }
        }
      }
    }
    for (var key in foundMatches) {
      if (foundMatches[key]) {
        _shortcutCounter[key] = 0;
      }
    }
    [foundMatches, allValues] = removeSmallShortcuts(foundMatches, allValues)
    return allValues
  }

  function getMatchedElementsCode(event) {
    var allValues = [], foundMatches = {};
    var allModifier = _getModifiers(event)
    // _invokedKey writes in the global object but it won't cause problems i guess
    var allRegisteredShortcutKeys = getAllShortcutKeysWithCode();

    for (var keys in codeShortcutCounter) {
      if (allRegisteredShortcutKeys[keys]) {
        for (var i = 0; i < allRegisteredShortcutKeys[keys].length; i++) {
          var item = allRegisteredShortcutKeys[keys][i]
          if (item.modifier.length <= 0) {
            if (item.pressTogether) {
              if (codeShortcutCounter[keys] === _splitArray(keys).length && _allCodePressed.join("+").includes(keys) && allModifier.length === 0) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
            else {
              if (_splitArray(keys).length !== 1 && codeShortcutCounter[keys] === _splitArray(keys).length && _allCodePressed.length === _splitArray(keys).length && _allCodePressed.join(" ").includes(keys) && allModifier.length === 0) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
              else if (!event.metaKey && !event.ctrlKey && _splitArray(keys).length === 1 && codeShortcutCounter[keys] === _splitArray(keys).length && _allCodePressed.join(" ").includes(keys) && allModifier.length === 0) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
          }
          else {
            if (item.pressTogether) {
              if (codeShortcutCounter[keys] === _splitArray(keys).length && item.modifier.sort().join('+') === allModifier.sort().join('+') && _allCodePressed.join("+").includes(keys)) {
                item._invokedKey = item.modifier.sort().length !== 0 ? item.modifier.sort().join('+') + "+" + keys : keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
            else {
              if (codeShortcutCounter[keys] === _splitArray(keys).length && _allCodePressed.join(" ").includes(keys) && item.modifier.sort().join('+') === allModifier.sort().join('+')) {
                item._invokedKey = keys
                allValues.push(item)
                foundMatches[keys] = true;
              }
            }
          }
        }
      }
    }
    for (var key in foundMatches) {
      if (foundMatches[key]) {
        codeShortcutCounter[key] = 0;
      }
    }
    [foundMatches, allValues] = removeSmallShortcuts(foundMatches, allValues)

    return allValues
  }

  // A timeout that refreshes the current pressed keys when no more keys are pressed
  function _createGracePeriod() {
    clearTimeout(_timeoutID)
    _timeoutID = setTimeout(function () {
      _shortcutCounter = {}
      _keyShortcutCounter = {}
      _allPressed = []

      _allCodePressed = []
      codeShortcutCounter = {}
    }, 1000)
  }



  /**
   * The callback for the keydown event
   * @param {object} event - the keydown event
   */
  function _handleKeyPress(event) {
    // var shouldReject = _checkActiveElement();
    // if (shouldReject) {
    //   return;
    // }
    if (!_shortcutEnabled) {
      return;
    }

    var codeAlpha = event.key;
    if (codeAlpha === undefined) {
      return;
    }
    if (codeAlpha.length >= 1) {
      codeAlpha = codeAlpha.toLowerCase()
    }

    var temp = codeAlpha.toLowerCase()
    //Special case for plus and space
    if (_splittingKeys.has(temp)) {
      codeAlpha = _splittingKeys.get(temp);
    }
    if (!(temp === "shift" || temp === "alt")) {
      _allPressed.push(codeAlpha)
    }

    var code = event.code;
    code = code.toLowerCase()
    if (codeKeys.has(code)) {
      code = codeKeys.get(code);
    }

    if (code !== "shift" && code !== "alt") {
      _allCodePressed.push(code)
    }
    increaseCharPointerCode(code)
    if (Object.keys(codeShortcutCounter).length) {
      var matchedElements = getMatchedElementsCode(event)
      _createGracePeriod()
      _invokeMatchedElements(matchedElements, event)
    }

    _increaseCharPointer(codeAlpha)
    increaseCharPointerKey(codeAlpha)
    var matchedElements = _getMatchedElements(event)
    _createGracePeriod()
    _invokeMatchedElements(matchedElements, event)
  }

  /**
   * Builds the registered keys from array
   * @param {array} keys - Array of keys
   * @param {function} callback - Function to be invoked for the keys
   */
  function _processObject(keys, callback, options) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      _processString(key, callback, options)
    }
  }

  /**
   * Builds the registered key from the string
   * @param {string} keys - String that represents the key
   * @param {function} callback - Function to be invoked for the key
   */
  function _processString(keys, callback, options) {
    var isValid;
    keys = removeWhiteSpace(keys)
    var useKey = options.useKey
    var useCode = options.useCode
    if (!useKey) {
      keys = userToBrowserKeys(keys)
    }
    if (useKey) {
      isValid = checkValid(keys)
    }
    else {
      isValid = true
    }
    if (useCode) {
      var checkCodeValid = checkCodeKeys(keys)
      if (checkCodeValid) {
        shortcut.pushKey({
          newKey: keys,
          oldKey: undefined,
          value: callback,
          options: options
        })
        return
      }
      else {
        console.error("Shortcut keys are in invalid format! Shortcut not added for", keys)
        return
      }
    }
    if (isValid && useKey) {
      shortcut.pushKey({
        newKey: keys,
        oldKey: undefined,
        value: callback,
        options: options
      })
    }
    else if (isValid && !useKey) {
      shortcut.push({
        newKey: keys,
        oldKey: undefined,
        value: callback,
        options: options
      })
    }
    else {
      console.error("Invalid Shortcut! Shortcut not added for", keys)
    }
  }

  /**
   * Adds the regex expression to the registeredKeys
   * @param {string} key - The regular expresssion
   * @param {function/HTMLElement} callback - The function or the HTMLElement that should be invoked
   * @param {object} options - Configuarion for this particular key
   */
  function _pushRegex(keys, callback, options, regKeys) {
    keys = 'r:' + keys
    var wait = options.wait ? options.wait : 0

    var preventDefault = options.preventDefault ? options.preventDefault : false
    var useCode = options.useCode ? options.useCode : false
    var useKey = options.useKey ? options.useKey : false
    var validate = options.validate ? options.validate : function () { return true; }
    var excludeElements = options.excludeElements ? options.excludeElements : undefined;


    var type = typeof callback
    regKeys[keys] = {
      type: type,
      value: callback,
      wait: wait,
      preventDefault: preventDefault,
      useCode: useCode,
      useKey: useKey,
      excludeElements: excludeElements,
      validate: validate
    }
  }

  /**
   * registers function keys and solves other cross browser issues
   */
  function _registerOtherKeys() {
    for (var i = 0; i <= 9; i++) {
      _specialKeys[i + 96] = i.toString()
    }
    for (var i = 1; i <= 12; i++) {
      _specialKeys[111 + i] = 'f' + i
    }
    var sniff = navigator.userAgent
    if (sniff.match('Firefox')) {
      _otherSpecialKeys[59] = ':'
      _otherSpecialKeys[173] = '_'
    }
    else {
      _otherSpecialKeys[186] = ':'
      _otherSpecialKeys[189] = '_'
    }
  }

  /**
   * Removing a single key and its functions
   * @param {string} keys - The key to remove
   */
  function _removeKey(keys, _regKeys) {
    var obj = segregateKeys(keys)
    var container = _regKeys[obj.newKey]
    if (!container) {
      return;
    }
    for (var i = 0; i < container.length; i++) {
      var item = container[i];
      if (obj.pressTogether === item.pressTogether && item.modifier.sort().join(' ') === obj.modifier.sort().join(' ')) {
        _regKeys[obj.newKey].splice(i, 1);
        break;
      }


      // if (obj.pressTogether && container[i].modifier.sort().join(' ') === obj.modifier.sort().join(' ')) {
      //   _regKeys[obj.newKey].splice(i, 1)
      //   break;
      // }
      // else if (!obj.pressTogether) {
      //   _regKeys[obj.newKey].splice(i, 1)
      //   break;
      // }
    }

    var parentObject = _registeredWrappers.find(wrapper =>
      wrapper.shortcutValues.some(shortcut => shortcut.shortcutKey === keys)
    );
    if (parentObject) {
      removeHoverCardEntry(keys, parentObject);
    }
  }

  /**
   * Replaces the substrings of keys to event.key
   * @param {string} keys
   * @returns the modified key containing "event.key" name
   */
  function userToBrowserKeys(keys) {
    //ctrl will be replaced by control
    if (keys.search("/ctrl/i")) {
      keys = keys.replaceAll("ctrl", "control")
    }
    //command will be replaced by meta
    if (keys.search("/command/i")) {
      keys = keys.replaceAll("command", "meta")
    }
    //command will be replaced by meta
    if (keys.search("/esc/i")) {
      keys = keys.replaceAll("esc", "escape")
    }
    //arrow keys will be replaced
    if (keys.search("/left/i")) {
      keys = keys.replaceAll("left", "arrowleft")
    }
    if (keys.search("/right/i")) {
      keys = keys.replaceAll("right", "arrowright")
    }
    if (keys.search("/up/i")) {
      keys = keys.replaceAll("up", "arrowup")
    }
    if (keys.search("/down/i")) {
      keys = keys.replaceAll("down", "arrowdown")
    }
    return keys;
  }

  /**
   * Removes the shortcut registered with oldKey
   * @param {object} entry
   */
  function removeFromCache(entry) {
    var oldkey = entry.oldKey
    if (oldkey) {
      shortcut.unregister(oldkey)
      shortcut.unregisterKey(oldkey)
    }
  }

  // Retrieves an array of all elementQuery strings from the shortcutValues in _registeredWrappers
  function fetchElementSelectors() {
    var elementQueries = _registeredWrappers.flatMap(wrapper =>
      wrapper.shortcutValues.flatMap(shortcut => shortcut.elementQuery)
    );
    return elementQueries;
  }

  // Retrieves an array of all elementQuery strings from the shortcutValues in _registeredWrappers
  function getMatchingQuery(lyteElem) {
    if (lyteElem) {
      var elementQueries = fetchElementSelectors();
      for (var query of elementQueries) {
        // var newElem = document.querySelector(query);
        if (lyteElem.matches(query)) {
          return query; // Return the query if a match is found
        }
      }
    }
    return false;
  }

  /**
   * The meta, shift, alt and control symbols are added to the shortcuts keys
   * @param {string} shortcutKey 
   * @returns the processed shortcut keys to display
   */
  function shortcutToDisplayKeys(shortcutKey) {
    var userAgent = window.navigator.userAgent;
    if (typeof shortcutKey === 'string') {
      if (userAgent.indexOf('Mac') !== -1) {
        shortcutKey = shortcutKey.replace(/meta/g, '\u2318 Command').replace(/control/g, '\u2303 Control').replace(/alt/g, '\u2325 Option').replace(/shift/g, '\u21E7 Shift');
      }
      else if (userAgent.indexOf('Win') !== -1) {
        shortcutKey = shortcutKey.replace(/meta/g, '\u229E').replace(/control/g, 'Ctrl').replace(/alt/g, 'Alt').replace(/shift/g, '\u21E7');;
      }
      shortcutKey = shortcutKey.replace(/\+/g, ' + ');
      return shortcutKey;
    }
    else if (typeof shortcutKey === 'object') {
      var keysToBeDisplayed = '';
      for (var i = 0; i < shortcutKey.length; i++) {
        var item = shortcutKey[i];
        if (item.key) {
          var key = item.key;
          key = this.shortcutToDisplayKeys(key);
          keysToBeDisplayed = keysToBeDisplayed + key;
          if (i !== shortcutKey.length - 1) {
            keysToBeDisplayed = keysToBeDisplayed + ', '
          }
        }
      }
      return keysToBeDisplayed;
    }
  }

  /**
   * Removes a shortcut entry with a given key from parentObject if multiple keys are added for same wrapper
   * or _registeredWrappers and resets the hover card attribute on the original button element if only one shortcut key is added for the wrapper.
   * @param {string} keys 
   * @param {object} parentObject 
   */
  function removeHoverCardEntry(keys, parentObject) {
    if (parentObject.shortcutValues.length > 1) {
      var matchingShortcut = parentObject.shortcutValues.find(shortcut => shortcut.shortcutKey === keys);
      matchingShortcut.elementQuery.forEach(query => {
        var originBtn = document.querySelector(query);

        if (originBtn) {
          originBtn.setAttribute('LYTE-HOVERCARD', '');
        }
      });

      _registeredWrappers.forEach(wrapper => {
        // Filter out the shortcut entries that match the provided key
        wrapper.shortcutValues = wrapper.shortcutValues.filter(shortcut => shortcut.shortcutKey !== keys);
      });
    }
    else {
      var wrapperQuery = parentObject.wrapperQuery;
      var originBtn = document.querySelector(parentObject.shortcutValues[0].elementQuery);
      if (originBtn) {
        originBtn.setAttribute('LYTE-HOVERCARD', '');
      }

      if ($L) {
        var wrapper = $L(wrapperQuery)[0];
        if (wrapper && _shortcutEnabled) {
          if (wrapper.component) {
            wrapper.component.setData('ltPropOriginElem', '');
          }
          else {
            wrapper.setAttribute('ltPropOriginElem', '');
          }
        }
      }
      else {
        var wrapper = document.querySelector(wrapperQuery);
        if (wrapper && _shortcutEnabled) {
          wrapper.setAttribute('ltPropOriginElem', '');
        }
      }
      _registeredWrappers = _registeredWrappers.filter(wrapper =>
        !wrapper.shortcutValues.some(shortcut => shortcut.shortcutKey === keys)
      );
    }
  }

  /**
   * Register a hovercardEntry
   * @param {string} keys 
   * @param {object/array} hovercard 
   */
  function registerHoverCardEntry(keys, hovercard) {
    if (Array.isArray(hovercard)) {
      for (var i = 0; i < hovercard.length; i++) {
        var element = hovercard[i];
        addHoverCardEntry(keys, element);
      }
    }
    else {
      addHoverCardEntry(keys, hovercard);
    }
  }
  /**
 * Adds a new hover card shortcut entry to an existing
 *  or new wrapper object in _registeredWrappers using the provided keys and hover card data.
 * @param {string} keys 
 * @param {object} hovercard 
 */
  function addHoverCardEntry(keys, hovercard) {
    var hoverQuery = hovercard.wrapperQuery;
    var originQuery = hovercard.originElement;
    var titleToDisplay = hovercard.titleToDisplay ? hovercard.titleToDisplay : '';
    var wrapperClass = hovercard.wrapperClass ? hovercard.wrapperClass : '';
    var yielded = hovercard.yielded ? hovercard.yielded : false;
    var hovercardPlacement = hovercard.hovercardPlacement ? hovercard.hovercardPlacement : '';
    var properties = hovercard.properties ? hovercard.properties : {};
    if (!(hoverQuery && originQuery)) {
      console.error('Error: Insufficient data for adding hovercard.');
    }
    if (typeof originQuery === 'string') {
      originQuery = [originQuery];
    }

    if (hoverQuery) {
      var isPresent = _registeredWrappers.some(wrapper => wrapper.wrapperQuery === hoverQuery);
      if (isPresent) {
        var newShortcut = {
          'shortcutKey': keys,
          'elementQuery': originQuery,
          'titleToDisplay': titleToDisplay,
          'wrapperClass': wrapperClass,
          'yielded': yielded,
          'hovercardPlacement': hovercardPlacement,
          'properties': properties
        };
        var wrapperObject = _registeredWrappers.find(wrapper => wrapper.wrapperQuery === hoverQuery);
        wrapperObject.shortcutValues.push(newShortcut);
      }
      else {
        var newWrapperObject = {
          'wrapperQuery': hoverQuery, 'shortcutValues': [{
            'shortcutKey': keys,
            'elementQuery': originQuery,
            'titleToDisplay': titleToDisplay,
            'wrapperClass': wrapperClass,
            'yielded': yielded,
            'hovercardPlacement': hovercardPlacement,
            'properties': properties
          }]
        };
        _registeredWrappers.push(newWrapperObject);
      }
    }
  }

  /**
   * Check whether a shortcut is registered in shortcut cache
   * @param {object} entry
   * @param {string} shortcutCache
   * @returns false if shortcut is not present in cache. the index if present
   */
  function isShortcutRegistered(entry, shortcutCache) {
    var returnedObject = segregateKeys(entry.newKey)
    var shortcutkey = returnedObject.newKey
    if (shortcutCache[shortcutkey] && shortcutCache[shortcutkey].length) {
      for (var i = 0; i < shortcutCache[shortcutkey].length; i++) {
        var item = shortcutCache[shortcutkey][i]
        if (item.pressTogether === returnedObject.pressTogether) {
          if (isEqual(item.modifier, returnedObject.modifier)) {
            return i;
          }
        }
      }
    }
    else {
      return false;
    }
    return false;
  }

  /**
   * Replaces the shortcut in the cache
   * @param {object} entry
   * @param {string} shortcutCache
   * @param {integer} index the position at which the shortcut is present in the array
   */
  function replaceShortcut(entry, shortcutCache, index) {
    var value = entry.value
    var returnedObject = segregateKeys(entry.newKey)
    var wait, preventDefault, useCode, excludeElements, validate, hovercard;
    if (entry.options) {
      wait = entry.options.wait ? entry.options.wait : 0
      preventDefault = entry.options.preventDefault ? entry.options.preventDefault : false
      useCode = entry.options.useCode ? entry.options.useCode : false
      excludeElements = entry.options.excludeElements ? entry.options.excludeElements : undefined;
      validate = entry.options.validate ? entry.options.validate : function () { return true }
      hovercard = entry.options.hovercard ? entry.options.hovercard : undefined;
    }
    else {
      wait = 0
      preventDefault = false;
      useCode = false;
      excludeElements = undefined;
      validate = function () { return true };
      hovercard = undefined;
    }
    var type = typeof value
    shortcutCache[returnedObject.newKey][index] = {
      type: type,
      value: value,
      modifier: returnedObject.modifier,
      pressTogether: returnedObject.pressTogether,
      wait: wait,
      useKey: entry.useKey,
      preventDefault: preventDefault,
      useCode: useCode,
      excludeElements: excludeElements,
      validate: validate
    }

    if (hovercard) {
      var keys = entry.newKey;
      var parentObject = _registeredWrappers.find(wrapper =>
        wrapper.shortcutValues.some(shortcut => shortcut.shortcutKey === keys)
      );
      if (parentObject) {
        removeHoverCardEntry(keys, parentObject);
      }
      registerHoverCardEntry(keys, hovercard);
    }
  }

  /**
   * Add new shortcut to the shortcut cache
   */
  function addNewShortcut(entry, shortcutCache) {
    var value = entry.value
    var returnedObject = segregateKeys(entry.newKey)
    var wait, preventDefault, useCode, excludeElements, validate, hovercard;
    if (entry.options) {
      wait = entry.options.wait ? entry.options.wait : 0;
      preventDefault = entry.options.preventDefault ? entry.options.preventDefault : false;
      useCode = entry.options.useCode ? entry.options.useCode : false;
      excludeElements = entry.options.excludeElements ? entry.options.excludeElements : undefined;
      validate = entry.options.validate ? entry.options.validate : function () { return true; };
      hovercard = entry.options.hovercard ? entry.options.hovercard : undefined;
    }
    else {
      wait = 0
      preventDefault = false;
      useCode = false;
      excludeElements = undefined;
      validate = function () { return true };
      hovercard = undefined;
    }
    var type = typeof value
    shortcutCache[returnedObject.newKey] = shortcutCache[returnedObject.newKey] || [];
    shortcutCache[returnedObject.newKey].push({
      type: type,
      value: value,
      modifier: returnedObject.modifier,
      pressTogether: returnedObject.pressTogether,
      wait: wait,
      useKey: entry.useKey,
      preventDefault: preventDefault,
      useCode: useCode,
      excludeElements: excludeElements,
      validate: validate
    })

    // Adding hovercard to the registry
    if (hovercard) {
      var keys = entry.newKey;
      registerHoverCardEntry(keys, hovercard);
    }
  }

  /**
   * based on the presece of the shortcut in the cache, the shortcut is added to cache
   */
  function storeToCache(entry, shortcutCache) {
    var index = isShortcutRegistered(entry, shortcutCache)
    if (typeof (index) === "number") {
      replaceShortcut(entry, shortcutCache, index)
    }
    else {
      addNewShortcut(entry, shortcutCache)
    }
  }

  /**
   * Validates if excludeElements is an array of non-empty, non-null, non-undefined, and non-boolean elements, 
   * ensuring that each element is a string containing alphabetical characters.
   * @param {array} excludeElements 
   * @returns true if excludeElements is a valid value
   */
  function checkExcludeElements(excludeElements) {
    if (!Array.isArray(excludeElements)) {
      return false;
    }
    for (let i = 0; i < excludeElements.length; i++) {
      const element = excludeElements[i];
      if (element && (/[a-zA-Z]/.test(element.join))) {
        if (element && element.length <= 0) {
          return false;
        }
        else if (element === null || element === undefined || element === true) {
          return false;
        }
      }
      else {
        return false
      }
    }
    return true;
  }

  /**
   *Checks whether the shortcut to be registered are of suggested types
   * @param {} keys
   * @param {function} callback - function to be invoked
   * @param {object} options - the attributes of shortcut(wait, type)
   * @param {boolean} useKey - defines the function used among (register() & registerKey())
   */
  function registerShortcut(keys, callback, options) {
    var type = typeof keys
    if (type !== 'string' && type !== 'object') {
      console.error("Invalid Type");
      return;
    }
    if (Array.isArray(options.excludeElements)) {
      var excludeElements = options.excludeElements;
      var excludeElementsValid = checkExcludeElements(excludeElements);
      if (!excludeElementsValid) {
        console.error("Invalid value for excludeElements. Shortcut not registered for ", keys);
        return;
      }
    }
    if (options.excludeElements && !(Array.isArray(options.excludeElements))) {
      console.error("Invalid value for excludeElements. Shortcut not registered for ", keys);
      return;
    }

    if (type === 'object') {
      _processObject(keys, callback, options)
    }
    else {
      _processString(keys, callback, options)
    }
  }

  // Constructor
  /**
   * Shortcut constructor
   * registers listeners
   */
  function shortcut(target) {
    _registerOtherKeys()
    target.addEventListener('keydown', _handleKeyPress)
  }
  /**
   * Find if any of the parent matches to the query registered
   * @param {HtmlElement} node 
   * @returns false if none of the tags matched
   * If matched: returns the matchedElement and Query
   */

  function findRelevantParentQuery(node) {
    var matchingQuery;
    while (node) {
      if (node.tagName === 'BODY') {
        return false; 
      }
      node = node.parentElement; // Move up the DOM
      matchingQuery = getMatchingQuery(node);
      if (matchingQuery) {
        return {
          'matchingQuery': matchingQuery,
          'node': node
        };
      }
    }
    return false; // Tag not found
  }

  /**
   * Handles the hovercard wrapper
   */
  document.addEventListener('mousemove', function (event) {
    if (_shortcutEnabled && _registeredWrappers.length) {
      var target = event.target;
      var matchingQuery, lyteElement;
      // if (target.tagName === 'BUTTON') {
      //   lyteElement = target.parentElement;
      //   matchingQuery = getMatchingQuery(lyteElement)
      // }
      // else if (target.tagName === 'LYTE-MENU-ITEM') {
      //   lyteElement = event.target
      //   matchingQuery = getMatchingQuery(lyteElement)
      // }
      // else {
      var matchingQueryObj = findRelevantParentQuery(event.target);
      if (matchingQueryObj) {
        matchingQuery = matchingQueryObj.matchingQuery;
        lyteElement = matchingQueryObj.node;
      }
      // }

      if (matchingQuery) {
        var parentObject = _registeredWrappers.find(wrapper =>
          wrapper.shortcutValues.some(shortcut =>
            shortcut.elementQuery.some(query => query === matchingQuery)
          )
        );
        var wrapperQuery = parentObject.wrapperQuery;
        lyteElement.setAttribute('LYTE-HOVERCARD', true);

        var wrapper = document.querySelector(wrapperQuery);
        var matchingShortcut = parentObject.shortcutValues.find(shortcut =>
          shortcut.elementQuery.includes(matchingQuery)
        );

        var keysToDisplay = shortcutToDisplayKeys(matchingShortcut.shortcutKey);
        if (wrapper && _shortcutEnabled) {
          if (wrapper.component) {
            wrapper.component.setData('ltPropOriginElem', matchingQuery);
            if (matchingShortcut.wrapperClass) {
              wrapper.component.setData('ltPropPopoverWrapperClass', matchingShortcut.wrapperClass);
            }
            wrapper.component.setData('ltPropPlacement', matchingShortcut.hovercardPlacement);
            wrapper.component.setData('ltPropYield', matchingShortcut.yielded);

            wrapper.component.setData('shortcutKeys', matchingShortcut.shortcutKey);
            wrapper.component.setData('shortcutKeysToDisplay', keysToDisplay);
            wrapper.component.setData('titleToDisplay', matchingShortcut.titleToDisplay);
            wrapper.component.setData('properties', matchingShortcut.properties);
          }
        }
      }
    }
  });

  // Public methods
  /**
   * Exposes the push function so that the custom elements register key presses
   */
  Object.defineProperty(shortcut, "push", {
    writable: false,
    value: function (entry) {
      removeFromCache(entry);
      // undefined or empty string cases or empty object
      if (!entry.newKey || entry.newKey === undefined || (typeof entry.newKey === "object" && Object.keys(entry.newKey).length === 0)) {
        // When UI components disconnect entry.oldKey will be having oldkey
        // If oldKey is not there, the warning has to be given
        if (!(entry.oldKey)) {
          console.error("Shortcut Not Registered: Trying to register shortcut for empty key combination.");
        }
        return;
      }
      entry.useKey = false;
      storeToCache(entry, _registeredKeys)
    }
  })

  Object.defineProperty(shortcut, "pushKey", {
    writable: false,
    value: function (entry) {
      removeFromCache(entry)
      // undefined or empty string cases or empty object
      if (!entry.newKey || entry.newKey === undefined || (typeof entry.newKey === "object" && Object.keys(entry.newKey).length === 0)) {
        // When UI components disconnect entry.oldKey will be having oldkey
        // If oldKey is not there, the warning has to be given
        if (!(entry.oldKey)) {
          console.error("Shortcut Not Registered: Trying to register shortcut for empty key combination.");
        }
        return;
      }
      if (entry.useKey === undefined) {
        entry.useKey = true
      }
      storeToCache(entry, _registeredKeyShortcuts)
    }
  })

  /**
   * Checks whether the shortcut is already registered for these keys.
   */
  Object.defineProperty(shortcut, "hasRegisteredShortcut", {
    writable: false,
    value: function (keys) {
      keys = removeWhiteSpace(keys)
      var processedKeys = segregateKeys(keys.trim())
      var allRegisteredShortcutKeys = getAllRegisteredShortcutKeys();
      if (Object.keys(allRegisteredShortcutKeys).length === 0) {
        return false;
      }
      for (var keys in allRegisteredShortcutKeys) {
        if ((keys === processedKeys.newKey)) {
          for (var i = 0; i < allRegisteredShortcutKeys[keys].length; i++) {
            var item = allRegisteredShortcutKeys[keys][i]
            if (item.pressTogether === processedKeys.pressTogether) {
              if (isEqual(item.modifier, processedKeys.modifier)) {
                return true;
                // console.error("The shortcut is already registered for ", processedKeys.newKey);
              }
            }
          }
        }
      }
      return false;
    }
  })

  /**
   * Exposes the register function so that developers can register key pressess
   */
  Object.defineProperty(shortcut, "registerKey", {
    writable: false,
    value: function (keys, callback, options) {
      if (options) {
        if (options.type) {
          options.type = options.type.trim()
        }
      }
      else {
        options = {}
      }
      options.useCode = false;
      options.useKey = true;

      if (options && options.type === 'regex') {
        _pushRegex(keys, callback, options, _registeredKeyShortcuts)
      }
      registerShortcut(keys, callback, options)
    }
  })
  Object.defineProperty(shortcut, "registerCode", {
    writable: false,
    value: function (keys, callback, options) {
      if (options) {
        if (options.type) {
          options.type = options.type.trim()
        }
      }
      else {
        options = {}
      }
      options.useCode = true
      options.useKey = true;
      registerShortcut(keys, callback, options)
    }
  })
  Object.defineProperty(shortcut, "register", {
    writable: false,
    value: function (keys, callback, options) {
      if (options) {
        if (options.type === 'regex') {
          options.useCode = false;
          options.useKey = false;
          _pushRegex(keys, callback, options, _registeredKeys)
        }
      }
      else {
        options = {}
      }
      options.useCode = false;
      options.useKey = false;
      registerShortcut(keys, callback, options)
    }
  })

  /**
   * Exposes the unregister function so that developers can unregister already registered keys
   */
  Object.defineProperty(shortcut, "unregister", {
    writable: false,
    value: function (keys) {
      if (typeof keys === 'object') {
        for (var i = 0; i < keys.length; i++) {
          var _key = userToBrowserKeys(keys[i])
          _key = removeWhiteSpace(_key)
          _removeKey(_key, _registeredKeys);
        }
      }
      else {
        keys = removeWhiteSpace(keys)
        _removeKey(keys, _registeredKeys);
      }
    }
  })

  Object.defineProperty(shortcut, "unregisterKey", {
    writable: false,
    value: function (keys) {
      if (typeof keys === 'object') {
        for (var i = 0; i < keys.length; i++) {
          var _key = keys[i]
          _key = removeWhiteSpace(_key)
          _removeKey(_key, _registeredKeyShortcuts);
        }
      }
      else {
        keys = removeWhiteSpace(keys)
        _removeKey(keys, _registeredKeyShortcuts);
      }
    }
  })

  Object.defineProperty(shortcut, "unregisterCode", {
    writable: false,
    value: function (keys) {
      if (typeof keys === 'object') {
        for (var i = 0; i < keys.length; i++) {
          var _key = keys[i]
          _key = removeWhiteSpace(_key)
          _removeKey(_key, _registeredKeyShortcuts);
        }
      }
      else {
        keys = removeWhiteSpace(keys)
        _removeKey(keys, _registeredKeyShortcuts);
      }
    }
  })

  /**
   * Exposes the unregisterAll function so developers can unregister all keys at once
   */
  Object.defineProperty(shortcut, "unregisterAll", {
    writable: false,
    value: function () {
      for (var key in _registeredKeys) {
        delete _registeredKeys[key]
      }
      for (var key in _registeredKeyShortcuts) {
        delete _registeredKeyShortcuts[key]
      }
    }
  })

  /**
   * All the shortcuts will be enabled
   * Now the shortcuts will be invoked 
   * All the shortcuts will be enabled initially on registering
   */
  Object.defineProperty(shortcut, "enable", {
    writable: false,
    value: function () {
      console.info("All the Shortcut has been enabled.");
      _shortcutEnabled = true;
      return true;
    }
  })

  /**
   * All the shortcuts will be disabled
   * The shortcuts will not be invoked when disabled 
   */
  Object.defineProperty(shortcut, "disable", {
    writable: false,
    value: function () {
      console.info("All the Shortcut has been disabled.");
      _shortcutEnabled = false;
      var elementQueries = fetchElementSelectors();
      elementQueries.forEach(element => {
        var queriedElement = document.querySelector(element);
        if (queriedElement) {
          queriedElement.setAttribute('lyte-hovercard', '');
        }
      });
      return true;
    }
  })

  // Intializing
  shortcut(document)
  window.shortcut = shortcut

})(window, document);