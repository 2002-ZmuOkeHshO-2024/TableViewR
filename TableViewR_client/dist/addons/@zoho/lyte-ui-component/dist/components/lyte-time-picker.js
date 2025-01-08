Lyte.Component.register("lyte-time-picker", {
_template:"<template tag-name=\"lyte-time-picker\"> <div class=\"lyteTimePickerField\" onkeydown=\"{{action('inputKeyDown',event,this)}}\"> <input value=\"{{lbind(ltPropValue)}}\" placeholder=\"{{ltPropPlaceholder}}\" id=\"{{ltPropId}}\" class=\"lyteTimePickerInput {{ltPropClass}}\" name=\"{{ltPropName}}\" readonly=\"{{ltPropReadonly}}\" disabled=\"{{ltPropDisabled}}\" aria-label=\"{{ltPropAriaAttributes.input}}\" aria-invalid=\"{{invalidValue}}\" onfocus=\"{{action('inputFocus',event,this,true)}}\" onblur=\"{{action('inputFocus',false)}}\" oninput=\"{{action('inputVal',event)}}\"> <template is=\"if\" value=\"{{ltPropDropdown}}\"><template case=\"true\"> <button class=\"lytetimePickerButton\" aria-label=\"{{ltPropAriaAttributes.icon}}\" disabled=\"{{ltPropDisabled}}\" aria-expanded=\"false\" aria-haspopup=\"true\" aria-controls=\"{{randId}}\" tabindex=\"0\"> <span class=\"lyteTimePickerBtnIcon\"></span> </button> </template></template> <template is=\"if\" value=\"{{ltPropCounter}}\"><template case=\"true\"> <div class=\"lytetimePickerCounterButtons\"> <button class=\"lytetimePickerIncButton\" aria-label=\"{{ltPropAriaAttributes.inc}}\" disabled=\"{{ltPropDisabled}}\" onmousedown=\"{{action('counterKeys',true)}}\" ontouchstart=\"{{action('counterKeys',true,true)}}\" tabindex=\"0\" role=\"spinbutton\"> <span class=\"lyteTimePickerIncIcon\"></span> </button> <button class=\"lytetimePickerDecButton\" aria-label=\"{{ltPropAriaAttributes.dec}}\" disabled=\"{{ltPropDisabled}}\" onmousedown=\"{{action('counterKeys')}}\" ontouchstart=\"{{action('counterKeys',false,true)}}\" tabindex=\"0\" role=\"spinbutton\"> <span class=\"lyteTimePickerDecIcon\"></span> </button> </div> </template></template> </div> <lyte-time-picker-dropdown id=\"{{randId}}\" class=\"lyteTimePickerDropdownNone {{ltPropDropdownClass}}\" onkeydown=\"{{action('dropDownKeyDown',event,this)}}\"> <div class=\"lyteTimePickerDropdownValues\" onfocusin=\"{{action('dropDownValueFocus',event,true)}}\" onfocusout=\"{{action('dropDownValueFocus',event,false)}}\"> <template is=\"if\" value=\"{{hours.length}}\"><template case=\"true\"> <ul class=\"lyteTimePickerUl\" data-unit=\"hours\" aria-label=\"{{ltPropAriaAttributes.hour}}\"> <template is=\"for\" items=\"{{hours}}\" item=\"item\" index=\"index\"> <li class=\"{{item.class}}\" tabindex=\"0\" data-index=\"{{item.index}}\" data-unit=\"hours\" role=\"options\" aria-selected=\"{{item.selected}}\" aria-disabled=\"{{item.disabled}}\" aria-label=\"{{item.value}}\" data-value=\"{{item.value}}\">{{item.value}}</li> </template> </ul> </template></template> <template is=\"if\" value=\"{{minutes.length}}\"><template case=\"true\"> <ul class=\"lyteTimePickerUl\" data-unit=\"minutes\" aria-label=\"{{ltPropAriaAttributes.minute}}\"> <template is=\"for\" items=\"{{minutes}}\" item=\"item\" index=\"index\"> <li class=\"{{item.class}}\" tabindex=\"0\" data-index=\"{{item.index}}\" data-unit=\"minutes\" role=\"options\" aria-selected=\"{{item.selected}}\" aria-disabled=\"{{item.disabled}}\" aria-label=\"{{item.value}}\" data-value=\"{{item.value}}\">{{item.value}}</li> </template> </ul> </template></template> <template is=\"if\" value=\"{{seconds.length}}\"><template case=\"true\"> <ul class=\"lyteTimePickerUl\" data-unit=\"seconds\" aria-label=\"{{ltPropAriaAttributes.second}}\"> <template is=\"for\" items=\"{{seconds}}\" item=\"item\" index=\"index\"> <li class=\"{{item.class}}\" tabindex=\"0\" data-index=\"{{item.index}}\" data-unit=\"seconds\" role=\"options\" aria-selected=\"{{item.selected}}\" aria-disabled=\"{{item.disabled}}\" aria-label=\"{{item.value}}\" data-value=\"{{item.value}}\">{{item.value}}</li> </template> </ul> </template></template> <template is=\"if\" value=\"{{meridiems.length}}\"><template case=\"true\"> <ul class=\"lyteTimePickerUl\" data-unit=\"meridiems\" aria-label=\"{{ltPropAriaAttributes.meridiem}}\"> <template is=\"for\" items=\"{{meridiems}}\" item=\"item\" index=\"index\"> <li class=\"{{item.class}}\" tabindex=\"0\" data-index=\"{{item.index}}\" data-unit=\"meridiems\" role=\"options\" aria-selected=\"{{item.selected}}\" aria-disabled=\"{{item.disabled}}\" aria-label=\"{{item.value}}\" data-value=\"{{item.value}}\">{{item.value}}</li> </template> </ul> </template></template> </div> <div class=\"lyteTimePickerDropdownButton\"> <template is=\"for\" items=\"{{ltPropButton}}\" item=\"item\" index=\"index\"> <lyte-button class=\"lyteTimePickerDropdownButtonItem\" purpose=\"{{item.purpose}}\" lt-prop=\"{{stringify(item.properties)}}\" lt-prop-aria-button=\"{{item.properties.ariaButton}}\" onfocus=\"{{action('customButtonFocus',event,this)}}\"> <template is=\"registerYield\" yield-name=\"text\"> {{item.text}} </template> </lyte-button> </template> </div> </lyte-time-picker-dropdown> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]}]}},"default":{}},{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"attr","position":[3,1]},{"type":"attr","position":[3,1,1]},{"type":"if","position":[3,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]}},"default":{}},{"type":"attr","position":[3,1,3]},{"type":"if","position":[3,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]}},"default":{}},{"type":"attr","position":[3,1,5]},{"type":"if","position":[3,1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]}},"default":{}},{"type":"attr","position":[3,1,7]},{"type":"if","position":[3,1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]}},"default":{}},{"type":"attr","position":[3,3,1]},{"type":"for","position":[3,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"text","position":[1]}]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3]}],
_observedAttributes :["ltPropValue","ltPropTimeFormat","ltPropStartTime","ltPropEndTime","ltPropButton","ltPropInterval","ltPropId","ltPropClass","ltPropName","ltPropPlaceholder","ltPropDisabled","ltPropReadonly","ltPropAllowDropdown","ltPropInline","ltPropBindToBody","ltPropBoundary","ltPropI18n","ltPropConvertNumbers","ltPropConvertedValue","ltPropFreeze","ltPropAriaAttributes","ltPropValidate","ltPropValidateType","ltPropValidateOn","ltPropValid","ltPropDropdownMinHeight","ltPropDropdown","ltPropCounter","ltPropAllowCounter","ltPropInputInterval","ltPropInputIntervalSync","ltPropDropdownClass","ltPropDropdownAlignPosition","hours","minutes","seconds","meridiems","minutesHide","hoursHide","secondsHide","curFormat","randId","inBoundary","dropdownRefresh"],


	init: function () {
		var data = this.data,
			value = data.ltPropValue,
			timeFormat = data.ltPropTimeFormat,
			id = "time_picker" + Date.now() + parseInt(Math.random() * 1000),
			moment,
			time_to;
		switch (value) {
			case "now": {
				moment = $L.moment();
			}
				break;
			case "startOfDay": {
				moment = $L.moment().startOf('day');
			}
				break;
			default: {
				time_to = value;
			}
		}

		if (moment) {
			time_to = this.toOtherLang(moment, timeFormat);
		} else if (time_to) {
			time_to = this.toOtherLang($L.moment(this.toEng(time_to, timeFormat), timeFormat), timeFormat);
		}
		this.setData("randId", id);
		this.setData("ltPropValue", time_to);
		data.ltPropValidateOn.init && this.validateRefresh();
	},

	data: function () {
		return {
			ltPropValue: Lyte.attr("string", { default: "" }),
			ltPropTimeFormat: Lyte.attr("string", { default: "hh:mm A" }),
			ltPropStartTime: Lyte.attr("string", { default: undefined }),
			ltPropEndTime: Lyte.attr("string", { default: undefined }),
			ltPropButton: Lyte.attr("array", { default: [{ text: "Ok", purpose: "ok", properties: { appearance: "primary", ariaButton: {} } }] }),
			ltPropInterval: Lyte.attr("object", { default: {} }),
			ltPropId: Lyte.attr("string", { default: "" }),
			ltPropClass: Lyte.attr("string", { default: "" }),
			ltPropName: Lyte.attr("string", { default: "" }),
			ltPropPlaceholder: Lyte.attr("string", { default: "" }),
			ltPropDisabled: Lyte.attr("boolean", { default: false }),
			ltPropReadonly: Lyte.attr("boolean", { default: false }),
			ltPropAllowDropdown: Lyte.attr("boolean", { default: false }),
			ltPropInline: Lyte.attr("boolean", { default: true }),
			ltPropBindToBody: Lyte.attr("boolean", { default: true }),
			ltPropBoundary: Lyte.attr("object", { default: {} }),
			ltPropI18n: Lyte.attr("boolean", { default: false }),
			ltPropConvertNumbers: Lyte.attr("boolean", { default: false }),
			ltPropConvertedValue: Lyte.attr("string", { default: "" }),
			ltPropFreeze: Lyte.attr("boolean", { default: false }),
			ltPropAriaAttributes: Lyte.attr("object", { default: { input: "Time Picker", icon: "Choose Time", hour: "Select Hour", minute: "Select Minute", second: "Select Second", meridiem: "Select Meridiem", message: "Selected Time" } }),
			ltPropValidate: Lyte.attr("boolean", { default: false }),
			ltPropValidateType: Lyte.attr("object", { default: { minmax: true, mandatory: true } }),
			ltPropValidateOn: Lyte.attr("object", { default: { blur: true, init: false } }),
			ltPropValid: Lyte.attr("boolean", { default: true }),
			ltPropDropdownMinHeight: Lyte.attr("number"),
			ltPropDropdown: Lyte.attr("boolean", { default: true }),
			ltPropCounter: Lyte.attr("boolean", { default: false }),
			ltPropAllowCounter: Lyte.attr("boolean", { default: false }),
			ltPropInputInterval: Lyte.attr("object", { default: {} }),
			ltPropInputIntervalSync: Lyte.attr("boolean", { default: false }),
			ltPropDropdownClass: Lyte.attr("string", { default: "" }),
			ltPropDropdownAlignPosition: Lyte.attr("string", { default: "left" }),

			hours: Lyte.attr("array", { default: [] }),
			minutes: Lyte.attr("array", { default: [] }),
			seconds: Lyte.attr("array", { default: [] }),
			meridiems: Lyte.attr("array", { default: [] }),
			minutesHide: Lyte.attr("object"),
			hoursHide: Lyte.attr("object"),
			secondsHide: Lyte.attr("object"),
			curFormat: Lyte.attr("number"),
			randId: Lyte.attr("string"),
			inBoundary: Lyte.attr("boolean", { default: true }),
			dropdownRefresh: Lyte.attr("boolean", { default: true })
		}
	},

	valueChange: function (arg) {
		this.getMethods("onValueChange") && this.executeMethod("onValueChange", arg, this.$node);
	}.observes('ltPropValue'),

	formatChange: function (arg) {
		var oldFormat = arg.oldValue,
			newFormat = arg.newValue,
			changeFormat = function (data) {
				var value = this.data[data];
				value && ((data != 'ltPropValue') || this.isValid()) && this.setData(data, this.toOtherLang($L.moment($L.moment(this.toEng(value, oldFormat), oldFormat).format(newFormat), newFormat), newFormat));
			}.bind(this);
		changeFormat('ltPropValue');
		changeFormat('ltPropStartTime');
		changeFormat('ltPropEndTime');
		this.refreshDropdown();
	}.observes('ltPropTimeFormat'),

	rangeChange: function () {
		this.refreshDropdown();
		this.validateRefresh();
	}.observes('ltPropStartTime', 'ltPropEndTime'),

	disabled: function () {
		this.disableElem("ltPropDisabled", " lyteTimePickerDisabled")
	}.observes('ltPropDisabled').on('init'),

	readOnly: function () {
		this.disableElem("ltPropReadonly", " lyteTimePickerReadonly");
	}.observes('ltPropReadonly').on('init'),

	bindToBody: function () {
		var data = this.data;
		if (!data.ltPropInline) {//after setting inline to true it can't be set to false
			if (data.ltPropBindToBody) {
				var dropDown = this.dropDown;
				dropDown.parent = this.$node;
				this.dropDown = dropDown;
				_lyteUiUtils.appendChild(document.body, dropDown);
			} else if (!data.ltPropBindToBody && this.dropDown) {
				document.body.removeChild(this.dropDown);
				delete this.dropDown.parent;
				delete this.dropDown;
			}
		}

	}.observes('ltPropInline', 'ltPropBindToBody').on('didConnect'),

	actions: {

		dropDownKeyDown: function (evt, _this) {
			this.dropDownKeys(evt, _this)
		},

		inputKeyDown: function (evt, _this) {

			if (this.getMethods("onBeforeInputKeydown") && this.executeMethod("onBeforeInputKeydown", evt, _this, this.$node) == false) {
				evt.preventDefault();
				return;
			}

			this.isValid() && this.inputKeys(evt);

		},

		inputFocus: function (focusIn) {
			var $node = $L(this.$node);
			if (focusIn) {
				this.inputClick();
				$node.addClass('lyteTimePickerInputFocused');
			} else {
				if (this.data.ltPropValidateOn.blur) {
					this.validateRefresh();
				}
				$node.removeClass('lyteTimePickerInputFocused');
			}
		},

		dropDownValueFocus: function (evt, focusIn) {
			var item = evt.target,
				itemObj = this.data[item.getAttribute("data-unit")][item.getAttribute("data-index")],
				setVal;
			if (focusIn && itemObj.disabled == "false") {
				setVal = itemObj.class + " lyteTimePickerItemFocused";
			} else if (!focusIn) {
				setVal = itemObj.class.replace(" lyteTimePickerItemFocused", "");
			}
			setVal && this.alterObjUtils(itemObj, ["class"], [setVal]);
		},

		inputVal: function (evt) {
			this.setData("ltPropValue", evt.target.value);
		},

		customButtonFocus: function (evt, _this) {
			this.getMethods("onCustomButtonFocus") && this.executeMethod("onCustomButtonFocus", evt, _this, this.$node);
		},

		counterKeys: function (type, manual) {
			this.counterVal(type, manual);
		}

	},

	didConnect: function () {

		var $node = this.$node,
			data = this.data;

		this.dropDown = $node.getElementsByTagName("lyte-time-picker-dropdown")[0];
		this.inputField = $node.querySelector(".lyteTimePickerField");
		this.input = $node.querySelector(".lyteTimePickerInput");

		if (data.ltPropDropdown) {
			$node.open = function () {
				if ((data.ltPropReadonly && !data.ltPropAllowDropdown) || data.ltPropDisabled) {
					return;
				}
				if ($L(this.dropDown).hasClass("lyteTimePickerDropdownNone")) {
					Array.from(document.getElementsByTagName('lyte-time-picker')).forEach(item => {
						item.close();
					});
					this.dropDownButtonClick();
				}
			}.bind(this);

			$node.close = function () {
				var inBound = data.inBoundary;
				if (!$L(this.dropDown).hasClass("lyteTimePickerDropdownNone") || !inBound) {
					this.hideDropDownVal(true);
					if (!inBound) {
						this.setData("inBoundary", true);
					}
				}
			}.bind(this);
		}


		$node.validate = this.validateRefresh.bind(this);

	},

	didDestroy: function () {
		var data = this.data;
		if (!data.ltPropInline) {
			if (data.ltPropBindToBody && this.dropDown) {
				this.dropDown.remove();
				delete this.dropDown.parent;
				delete this.dropDown;
			}
		}
	},

	disableElem: function (data, _class) {
		if (this.data[data]) {
			$L(this.$node).addClass(_class);
		} else {
			$L(this.$node).removeClass(_class);
		}
	},

	toOtherLang: function (moment, format) {
		var i18n = this.data.ltPropI18n,
			convertNumbers = this.data.ltPropConvertNumbers,
			ns = i18n ? 'i18N' : "format";
		return moment[ns](format, convertNumbers);
	},

	toEng: function (time, format) {
		if (time) {
			var data = this.data;
			return $L.moment(time, format, { i18n: data.ltPropI18n, number_conversion: data.ltPropConvertNumbers }).format(format);
		}
	},

	alterObjUtils: function (obj, key, value) {
		key.forEach((item, index) => {
			Lyte.objectUtils(obj, "add", item, value[index]);
		});
	},

	setAriaTime: function (time) {
		(this.data.ltPropButton || []).forEach(item => {
			if (item.purpose == "ok") {
				if (item.properties == undefined) {
					this.alterObjUtils(item, ["properties"], [{}])
				}
				time = time ? (" " + time) : time;
				this.alterObjUtils(item.properties, ["ariaButton"], [{ "aria-label": (this.data.ltPropAriaAttributes.message || "") + time }]);
			}
		})
	},

	refreshDropdown: function () {
		["hours", "minutes", "seconds", "meridiems", "minutesHide", "hoursHide", "secondsHide", "curFormat"].forEach((unit, index) => {
			this.setData(unit, index < 4 ? [] : undefined);
		});
		this.setData("dropdownRefresh", true);
	},

	hideDropDownVal: function (close, evt, buttonType, boundary) {
		var button, beforeClass, onClass, noneClass, openClass, ariaExpand, freeze;
		if (close) {
			beforeClass = "onBeforeClose";
			onClass = "onClose";
			noneClass = "addClass";
			openClass = "removeClass";
			ariaExpand = false;
			freeze == false;
			$L(this.dropDown).removeClass("lyteDropdownSizeChange", "lyteDropdownTopSide");
			this.data.ltPropValidateOn.blur && this.validateRefresh();
		} else {
			beforeClass = "onBeforeOpen";
			onClass = "onOpen";
			noneClass = "removeClass";
			openClass = "addClass";
			ariaExpand = true;
			freeze = true;
		}
		if (this.getMethods(beforeClass) && this.executeMethod(beforeClass, evt, this.$node) == false) {
			return;
		}
		$L(this.dropDown)[noneClass]("lyteTimePickerDropdownNone");
		$L(this.$node)[openClass]("lyteTimePickerDropdownOpened");
		button = this.$node.querySelector(".lytetimePickerButton");
		if (buttonType == "ok" || document.activeElement == document.body) {
			button.focus({ preventScroll: true });
		};
		button.setAttribute("aria-expanded", ariaExpand);
		!boundary && this.setAriaTime("");
		this.freezeLayer(freeze);
		this.getMethods(onClass) && this.executeMethod(onClass, evt, this.$node);
	},

	getItemWithClass: function (dataUnit, _class) {
		var data = this.data,
			retVal;
		data[dataUnit].every(item => {
			if (item.class.includes(_class)) {
				retVal = item;
				return false;
			}
			return true;
		})
		return retVal;
	},

	blurItems: function (hideArr, _class) {
		if (hideArr) {
			var listElem = this.data[_class];
			for (var i = 0; i < listElem.length && hideArr.length; i++) {
				var curObj = listElem[i],
					curInd = hideArr.indexOf(curObj.engVal);
				if (curInd != -1) {
					this.alterObjUtils(curObj, ["class", "disabled"], [curObj.class + " lyteTimePickerBlur", "true"]);
					hideArr.splice(curInd, 1);
				}
			}
		}
	},

	setDropVal: function (onlyInfo, evt) {//set drop val to input || ltPropValue
		var data = this.data,
			curSetVal = data.ltPropValue,
			timeForm = data.ltPropTimeFormat,
			moment = $L.moment();
		["hours", "minutes", "seconds", "meridiems"].forEach(item => {
			var comp = this.getItemWithClass(item, "lyteTimePickerItemSelected"),
				compVal;
			if (comp) {
				compVal = comp.engVal;
				if (item == "meridiems") {
					curSetVal = (compVal != moment.format("A")) ? moment.add(12, "hours").format(timeForm) : curSetVal;
				} else {
					curSetVal = moment.set(item, parseInt(compVal)).format(timeForm);
				}
			}
		});
		curSetVal = this.toOtherLang($L.moment(curSetVal, timeForm), timeForm);
		if (onlyInfo) {
			return curSetVal;
		}
		this.setData("ltPropValue", curSetVal);
		$L.fastdom.mutate(function () {
			this.hideDropDownVal(true, evt, "ok");
		}.bind(this));
	},

	updDropVal: function (selected, unit, updUnit) {//updates values on refresh others in dropDown
		if (this.dropDownChanges(selected, unit, undefined, "scroll")) {
			return updUnit.length && this.setValuesManually(updUnit, false, "scroll") && false;
		} else {
			return false;
		}
	},

	isValid: function () {

		var data = this.data,
			invalid = true,
			value = data.ltPropValue,
			moment = $L.moment(value, data.ltPropTimeFormat, { i18n: data.ltPropI18n, number_conversion: data.ltPropConvertNumbers });
		if (value && moment.validate() && (this.toOtherLang(moment, data.ltPropTimeFormat) == value)) {
			invalid = false;
		}
		return !invalid;

	},

	validateRefresh: function () {

		var data = this.data,
			errorMsg = data.ltPropValidateType,
			val = data.ltPropValue,
			validate = false;

		if (!data.ltPropValidate) {
			return;
		}

		validate = !!((errorMsg.mandatory || val) && ((errorMsg.minmax && val && !this.validateTimeInterval(val)) || !this.isValid()));
		$L(this.$node)[validate ? 'addClass' : 'removeClass']("lyteTimePickerInvalidTime");
		this.setData('ltPropValid', !validate);

	},

	validateTimeInterval: function (curTime, getInfo) {
		var data = this.data,
			curFormat = data.ltPropTimeFormat,
			curTimeMoment = $L.moment(this.toEng(curTime, curFormat), curFormat),
			startMoment = data.ltPropStartTime && $L.moment(this.toEng(data.ltPropStartTime, curFormat), curFormat),
			endMoment = data.ltPropEndTime && $L.moment(this.toEng(data.ltPropEndTime, curFormat), curFormat),
			startTime = startMoment && startMoment.fromNow(curTimeMoment),
			endTime = endMoment && endMoment.fromNow(curTimeMoment),
			ret;
		if (startMoment && endMoment && startMoment.fromNow(endMoment).past) {
			if ((!startTime.past || startTime.value == 0) || (endTime.past || endTime.value == 0)) {
				ret = true;
			} else if (getInfo) {
				ret = data.ltPropStartTime;
			}
		} else {
			if ((startTime ? !startTime.past : true) && (endTime ? (endTime.past || endTime.value == 0) : true)) {
				ret = true;
			} else if (getInfo) {
				var retVal;
				if (startTime && startTime.past) {
					retVal = data.ltPropStartTime;
				} else if (endTime && !endTime.past) {
					retVal = data.ltPropEndTime;
				}
				ret = retVal;
			}
		}
		return ret;
	},

	inputKeys: function (evt, fromCounter) {
		var activeElement = document.activeElement,
			__this = this,
			data = __this.data,
			inputElem = this.input,
			curFormat = data.ltPropTimeFormat,
			interval = data.ltPropInputInterval,
			curTime = this.toEng(data.ltPropValue, curFormat),
			moment = curTime && curFormat && $L.moment(curTime, curFormat),
			split = moment && moment.parseFormat(curFormat),
			selectionStart = inputElem.selectionStart,
			selectionEnd = inputElem.selectionEnd,
			isButton = activeElement.closest(".lytetimePickerButton"),
			isCounterButton = activeElement.closest(".lytetimePickerCounterButtons"),
			keycode = evt.keyCode, key = evt.key, meta = (evt.ctrlKey || evt.metaKey),
			nextSelectionStart, nextNotAvail, prevSelectionStart, prevNotAvil, selectedFormat,
			selectedVal, meriAvail, updatedTime, curFormatType, preventAdj, hh, formatLimit, prvEvt = false,
			getCustomTime = function (value, invalid) {
				var time = invalid ? data.ltPropValue : curTime;
				return time.slice(0, selectionStart) + value + time.slice(selectionEnd, time.length);
			},
			getUpdVal = function (func, val, nearest) {
				var tempUpdatedTime, chng = 1, intervalRet;
				if (func == "set") {
					tempUpdatedTime = getCustomTime(val, false);
					if (!$L.moment(tempUpdatedTime, curFormat).validate()) {
						return false;
					}
					tempUpdatedTime = $L.moment(tempUpdatedTime, curFormat).format(curFormat);
				} else if (func == "fullset") {
					tempUpdatedTime = val;
				} else {
					if (interval) {
						var curInterval = interval[selectedFormat.slice(0, -1)];
						nearest = true;
						if (curInterval) {
							if (data.ltPropInputIntervalSync) {
								var limitControl = function () {
									if (chng > formatLimit) {
										chng = formatLimit;
										return true;
									}
								},
									inc = func == "add";
								//finds diff for nearest multiple
								chng = Math.abs(((Math[inc ? 'floor' : 'ceil'](selectedVal / curInterval) + (inc ? 1 : -1)) * curInterval) - selectedVal);
								if (inc) {//after limit goes to start
									if (parseInt(selectedVal) + chng >= (hh ? 13 : formatLimit)) {
										chng = (hh && parseInt(selectedVal) == 12) ? curInterval : formatLimit - selectedVal;
									}
								} else {//before limit goes to end
									if (!limitControl() && (selectedVal - chng < 0)) {
										chng = parseInt(selectedVal) + Math.abs(((Math.ceil(formatLimit / curInterval) - 1) * curInterval) - formatLimit);
									}
								}
								limitControl();
							} else {
								chng = curInterval;
							}
						}
					}
					tempUpdatedTime = selectedFormat && moment[func](meriAvail ? 12 : chng, meriAvail ? "hours" : selectedFormat).format(curFormat)
				}
				intervalRet = __this.validateTimeInterval(tempUpdatedTime, nearest);
				if (intervalRet == true) {
					updatedTime = tempUpdatedTime;
					return true;
				} else {
					if (nearest) {
						intervalRet = __this.toEng(intervalRet, curFormat);
						if (!getUpdVal("set", intervalRet[selectionStart] + intervalRet[selectionEnd - 1])) {
							getUpdVal("fullset", intervalRet);
						}
					}
					return false;
				}
			};

		if ((data.ltPropReadonly && (!(fromCounter && data.ltPropAllowCounter) && [38, 40, 65, 80].includes(keycode))) || (isCounterButton && ![' ', 'Enter'].includes(key))) {
			return;
		}

		if (!isButton && (selectionStart == undefined || selectionStart == selectionEnd)) {
			selectionEnd = (selectionStart = this.fixSelection(selectionEnd, true).index) + 2;
			if ([37, 39, 9].includes(keycode)) {
				preventAdj = true;
				evt.preventDefault();
			}
		}

		for (var i = 0; split && (i < split.length); i++) {
			if (selectionStart == split[i].index && selectionEnd == (split[i].index + 2)) {
				curFormatType = split[i].format.val;
				selectedVal = moment.format(curFormatType);
				selectedFormat = split[i].format.type + "s";
				meriAvail = selectedFormat == "meridians";
				if (split[i + 1]) {
					nextSelectionStart = split[i + 1].index;
				} else {
					nextSelectionStart = split[0].index;
					nextNotAvail = true;
				}
				if (split[i - 1]) {
					prevSelectionStart = split[i - 1].index;
				} else {
					prevNotAvil = true;
					prevSelectionStart = split[split.length - 1].index;
				}
				break;
			}
		}

		hh = curFormatType == 'hh';
		formatLimit = ((curFormatType == 'mm' || curFormatType == 'ss') && 60) || (hh && 12) || (curFormatType == 'HH' && 24);

		if (!preventAdj) {
			switch (key) {
				case 'ArrowUp': {
					prvEvt = true;
					getUpdVal("add");
					break
				}
				case 'ArrowDown': {
					prvEvt = true;
					getUpdVal("subtract");
					break
				}
				case 'ArrowRight': {
					prvEvt = true;
					selectionStart = nextSelectionStart;
					selectionEnd = nextSelectionStart + 2;
					break;
				}
				case 'ArrowLeft': {
					prvEvt = true;
					selectionStart = prevSelectionStart;
					selectionEnd = prevSelectionStart + 2;
					break;
				}
				// case 8: {
				// 	prvEvt = true;
				// 	this.setData("subValueAdded", true);
				// 	this.setData("ltPropValue", getCustomTime(curFormatType == "A" ? "aa" : curFormatType, true));
				// 	break;
				// }
				case 'Tab': {
					if (evt.shiftKey) {
						if (isButton) {
							var cur = split[split.length - 1];
							prvEvt = true;
							inputElem.focus();
							selectionStart = cur.index;
							selectionEnd = cur.index + 2;
						} else if (prevNotAvil) {
							return;
						} else {
							prvEvt = true;
							selectionStart = prevSelectionStart;
							selectionEnd = prevSelectionStart + 2;
						}
					} else {
						if (isButton || nextNotAvail) {//isbutton //input to button
							return;
						} else {//on input, has next input
							prvEvt = true;
							selectionStart = nextSelectionStart;
							selectionEnd = nextSelectionStart + 2;
						}
					}
					break;
				}
				case ' ':
				case 'Enter': {
					if (isButton) {
						return;
					} else if (isCounterButton) {
						var unitInd = {}, selInd;
						split.forEach(function (item) {
							unitInd[item.format.val] = item.index;
						});
						selInd = unitInd.ss ? unitInd.ss : unitInd.mm ? unitInd.mm : unitInd.hh ? unitInd.hh : unitInd.A;
						if (selInd) {
							inputElem.setSelectionRange(selInd, selInd + 2);
							inputElem.focus();
							this.inputKeys({ key: activeElement.closest(".lytetimePickerIncButton") ? 'ArrowUp' : 'ArrowDown', preventDefault: function () { } }, true);
							activeElement.focus();
						}
						prvEvt = true;
					}
					break;
				}
				case 'a':
				case 'p': {
					if (!meta && meriAvail) {
						var proc = keycode == 65 ? selectedVal != "AM" : selectedVal != "PM";
						proc && getUpdVal("add");
						prvEvt = true;
					}
					break;
				}
				case 'Home':
				case 'End': {
					prvEvt = true;
					if (curFormatType == 'A') {
						getUpdVal("add");
					} else {
						getUpdVal("set", key == 'Home' ? (hh ? '12' : '00') : formatLimit - 1, true);
					}
				}
			}
		}
		if (!data.ltPropReadonly && ((keycode >= 48 && keycode <= 57) || (keycode >= 96 && keycode <= 105))) {
			if (!getUpdVal("set", selectedVal[1] + key)) {
				if (!getUpdVal("set", selectedVal[0] + key)) {
					getUpdVal("set", 0 + key)
				}
			}
			prvEvt = true;
		}

		prvEvt && evt.preventDefault();

		updatedTime && this.setData("ltPropValue", this.toOtherLang($L.moment(updatedTime, curFormat), curFormat));

		inputElem.setSelectionRange(selectionStart, selectionEnd);
	},

	dropDownKeys: function (evt, dropDown) {
		if (!$L(dropDown).hasClass("lyteTimePickerDropdownNone")) {
			var selectedItem = evt.target,
				button = selectedItem.closest(".lyteTimePickerDropdownButton"),
				availableUnits = ["lyteTimePickerMeridiem", "lyteTimePickerHour", "lyteTimePickerMinute", "lyteTimePickerSecond"],
				setManArr = ["meridiems", "hours", "minutes", "seconds"],
				key = evt.key,
				data = this.data,
				selectedItemClass,
				curClassInd,
				setVertCorresValue = function (corres, atmost, onlyInfo) {
					var sib = selectedItem[corres];
					while (sib != selectedItem && !button) {
						if (!sib || sib && !$L(sib).hasClass(selectedItemClass)) {
							if (onlyInfo) {
								return true;
							}
							sib = selectedItem.parentNode[atmost];
						}
						if ($L(sib).hasClass("lyteTimePickerBlur")) {
							sib = sib[corres];
						} else {
							evt.preventDefault();
							sib.focus();
							break;
						}
					}
				},
				setHoriCorresValue = function (key, onlyInfo) {
					var corresClassInd,
						checkValid = function (value) {
							corresClassInd = (key == 'ArrowRight') ? ((value + 1) < 4 ? (value + 1) : 0) : ((value - 1) >= 0 ? (value - 1) : 3);
							if (onlyInfo && (key == 'ArrowRight' ? corresClassInd == 1 : corresClassInd == 0)) {// see availableUnits array // in here 1 is start and 0 is end 
								return true;
							}
						};
					if (checkValid(curClassInd)) {
						return true;
					}
					while (availableUnits[corresClassInd] || corresClassInd != curClassInd) {//available || end the loop
						var corres = dropDown.querySelector(".lyteTimePickerItemSelected." + availableUnits[corresClassInd]);
						if (corres) {
							evt.preventDefault();
							this.moveTop(dropDown.querySelector(".lyteTimePickerItemSelected." + availableUnits[curClassInd]));
							this.moveTop(corres);
							corres.focus();
							break;
						} else {
							if (checkValid(corresClassInd)) {
								return true;
							}
						}
					}
				}.bind(this),
				setTabCorresVal = function (corres, atmost, key) {
					// if (button || setVertCorresValue(corres, atmost, true)) {
					if (button || setHoriCorresValue(key, true)) {
						var focusButton;
						if (!button) {
							focusButton = dropDown.querySelector(".lyteTimePickerDropdownButton")[atmost];
						} else {
							focusButton = selectedItem.closest(".lyteTimePickerDropdownButtonItem")[corres];
							if (!focusButton) {
								curClassInd = (key == 'ArrowLeft') ? 1 : 0;
								setHoriCorresValue(key);
							}
						}
						if (focusButton) {
							focusButton.focus();
						}
					}
					// }
				}.bind(this),
				nearestAvail = function (parent, toStart) {
					var ret;
					if ((toStart && data.ltPropStartTime) || (!toStart && data.ltPropEndTime)) {
						var arr = this.data[parent.getAttribute('data-unit')],
							start = 0,
							end = arr.length,
							chng = 1;
						(!toStart) && (start = end - 1, end = 0, chng = -1);
						while (toStart ? start < end : end <= start) {
							if (arr[start].disabled == 'false') {
								ret = start;
								break;
							}
							start += chng;
						}
					}
					return parent.children[ret];
				};

			availableUnits.forEach((item, index) => {
				if ($L(selectedItem).hasClass(item)) {
					selectedItemClass = item;
					curClassInd = index;
				}
			});

			if (this.getMethods("onBeforeDropdownKeydown") && this.executeMethod("onBeforeDropdownKeydown", evt, dropDown, this.$node) == false) {
				evt.preventDefault();
				return;
			}

			switch (key) {
				case 'ArrowDown': {
					setVertCorresValue("nextElementSibling", "firstElementChild");
					break;
				}
				case 'ArrowUp': {
					setVertCorresValue("previousElementSibling", "lastElementChild");
					break;
				}
				case 'ArrowRight': {
					setHoriCorresValue('ArrowRight');
					break;
				}
				case 'ArrowLeft': {
					setHoriCorresValue('ArrowLeft');
					break;
				}
				case 'Enter':
				case ' ': {
					if (!button) {
						var selectedUnit = setManArr[curClassInd];
						this.updDropVal(this.data[selectedUnit][selectedItem.getAttribute("data-index")], selectedUnit, setManArr.slice(curClassInd + 1, setManArr.length));
						if (setHoriCorresValue('ArrowRight', true)) {//close drop on last
							evt.preventDefault();
							this.setDropVal(false, evt);
						};
					}
					break;
				}
				case 'Tab': {
					evt.preventDefault();
					if (evt.shiftKey) {
						setTabCorresVal("previousElementSibling", "lastElementChild", 'ArrowLeft');
					} else {
						setTabCorresVal("nextElementSibling", "firstElementChild", 'ArrowRight');
					}
					break;
				}
				case 'Escape': {
					this.hideDropDownVal(true, evt, "ok");
					break;
				}
				case 'End':
				case 'Home': {
					evt.preventDefault();
					var parent = selectedItem.parentElement,
						start = key == 'Home';
					this.moveTop(nearestAvail.call(this, parent, start) || (start ? parent.firstElementChild : parent.lastElementChild), "scroll", !start)
					break;
				}
				case 'PageDown':
				case 'PageUp': {
					evt.preventDefault();
					var parent = selectedItem.parentElement,
						chng = parent.clientHeight - 10;
					$L(parent).addClass('lyteTimePickerScrollBehavior');
					parent.scrollTop += key == 'PageDown' ? chng : -chng;
					setTimeout(function () {
						$L(parent).removeClass('lyteTimePickerScrollBehavior')
					}, 1000);
					break;
				}
			}
		}
	},

	moveTop: function (selectElem, from, down) {
		var parent = selectElem.parentElement,
			itemOffsetTop = selectElem.offsetTop,
			containerOffsetTop = parent.offsetTop,
			paddingTop = this.data.paddingTop,
			scrollPosition = itemOffsetTop - containerOffsetTop - paddingTop - (down ? parent.offsetHeight - selectElem.offsetHeight - (paddingTop * 2) : 0);
		if (Math.abs(parent.scrollTop - scrollPosition) >= 1) {
			if (from && from != "start") {
				$L(selectElem.parentElement).addClass('lyteTimePickerScrollBehavior');
			}
			parent.scrollTop = scrollPosition;
			setTimeout(function () {
				$L(selectElem.parentElement).removeClass('lyteTimePickerScrollBehavior')
			}, 1000);
		}
	},

	remSetSelected: function (curUnitObj, _class) {
		var prevUnitObj = this.getItemWithClass(_class, "lyteTimePickerItemSelected");
		if (curUnitObj == prevUnitObj || curUnitObj.disabled == "true") {
			return false
		}
		if (prevUnitObj) {
			this.alterObjUtils(prevUnitObj, ["class", "selected"], [prevUnitObj.class.replace(" lyteTimePickerItemSelected", ""), "false"]);
		}
		this.alterObjUtils(curUnitObj, ["class", "selected"], [curUnitObj.class + " lyteTimePickerItemSelected", "true"]);
		return true;
	},

	dropDownChanges: function (listComp, _class, overRide, from) {
		var retVal,
			_this = this;
		if ((listComp && !listComp.class.includes("lyteTimePickerBlur")) || overRide) {
			if (listComp) {
				retVal = _this.remSetSelected(listComp, _class);
				(from != "start") && this.setAriaTime(this.setDropVal(true));
				this.moveTop(_this.dropDown.getElementsByClassName(listComp.class)[0], from);
			}
			if (_class == "meridiems" || _class == "hours" || _class == "minutes") {//it is also used to hide min and sec (based on hour)
				var selectedMeridiem = _this.getItemWithClass("meridiems", "lyteTimePickerItemSelected"),
					selectedMeridiemVal = selectedMeridiem ? selectedMeridiem.engVal : undefined,
					selectedHour = _this.getItemWithClass("hours", "lyteTimePickerItemSelected"),
					value = listComp && parseInt(listComp.engVal),
					secVal = (_class == "minutes" && selectedHour) ? parseInt(selectedHour.engVal) : undefined,//only for setting seconds
					data = _this.data,
					minutesHide = data.minutesHide,
					secondsHide = data.secondsHide,
					hoursHide = data.hoursHide,
					timeFormat = data.ltPropTimeFormat,
					nextDay = data.ltPropStartTime && data.ltPropEndTime && $L.moment(this.toEng(data.ltPropStartTime, timeFormat), timeFormat).fromNow($L.moment(this.toEng(data.ltPropEndTime, timeFormat), timeFormat)).past,
					hideDropdownValues = function (start, end, minClass, limit) {
						var hideArr = [],
							startTime = start.value,
							endTime = end.value,
							meriStart = start.meridiem,
							meriEnd = end.meridiem;
						//       																																					it is minute used to select sec where min is available	//true=> startMin == endMin && start is >         // if not first cond find meri
						// if ( data.ltPropStartTime && data.ltPropEndTime && (_class == ".lyteTimePickerHour"?(start.hour==end.hour && start.hour==(secVal ? secVal : value)):startMoment > endMoment) && ((_class == ".lyteTimePickerMinute" && !overRide) ? (start.min == end.min && start.min == value && startMoment > endMoment) : startMoment > endMoment) && (_class == ".lyteTimePickerMeridiem"? (meriStart == meriEnd && (selectedMeridiemVal ? selectedMeridiemVal == start.meridiem : true) && startMoment > endMoment) : startMoment > endMoment)) {// not hour class
						// 	hideArr = _this.modifyVal(endTime, startTime);
						// }
						if (data.ltPropStartTime && data.ltPropEndTime && (selectedMeridiemVal ? selectedMeridiemVal == start.meridiem : true) && (nextDay) && ((_class == "hours" && !overRide) ? (start.hour == end.hour && start.hour == (secVal ? secVal : value)) : true) && ((_class == "minutes" && !overRide) ? (start.min == end.min && start.min == value && nextDay) : true) && (_class == ("meridiems" && !overRide) ? (meriStart == meriEnd) : true)) {
							hideArr = _this.modifyVal(endTime, startTime);
						} else {
							if ((start.hour ? start.hour == (secVal ? secVal : value) : true) && (start.min ? start.min == value : true) && (selectedMeridiemVal ? selectedMeridiemVal == start.meridiem : true)) {
								hideArr = _this.modifyVal(0, startTime);
								if (minClass == "hours" && hideArr.length) {
									hideArr.push("12");
								}
							}
							if ((end.hour ? end.hour == (secVal ? secVal : value) : true) && (end.min ? end.min == value : true) && (selectedMeridiemVal ? selectedMeridiemVal == end.meridiem : true)) {
								hideArr = hideArr.concat(_this.modifyVal(endTime, limit));
							}
						}
						data[minClass].forEach(item => {
							_this.alterObjUtils(item, ["class", "disabled"], [item.class.replace(" lyteTimePickerBlur", ""), "false"]);
						})
						_this.blurItems(hideArr, minClass);
					};
				hoursHide && _class == "meridiems" && hideDropdownValues(hoursHide.start, hoursHide.end, "hours", 11);
				minutesHide && _class == "hours" && hideDropdownValues(minutesHide.start, minutesHide.end, "minutes", 59);
				secondsHide && _class == "minutes" && hideDropdownValues(secondsHide.start, secondsHide.end, "seconds", 59);
			}
		}
		return retVal;
	},

	setValuesManually: function (activateUnits, overRide, from, manualValue) {
		var _this = this,
			data = _this.data,
			format = data.ltPropTimeFormat,
			time = manualValue || this.toEng(data.ltPropValue, format),
			moment = time ? $L.moment(time, format)/*$L.moment(time, format, { i18n: data.ltPropI18n, number_conversion: data.ltPropConvertNumbers })*/ : $L.moment().startOf('day'),
			split = moment.parseFormat(format),
			curFormat = data.curFormat,
			dispHour, dispMin, dispSec, dispMeri, focusElem, change, hh,
			getAvailComp = function (__class, cmpVal) {//input or first available li in ul
				var curData = data[__class].filter(item => { return (item.disabled == "false") }),
					prevSelected = curData.filter(item => { return (item.selected == "true") }),
					retVal;
				if (curData.length == 0) {
					return false
				}
				if (!manualValue && prevSelected.length) {
					retVal = prevSelected[0];
				} else {
					var curObj,
						retDiff = function (a, s) {
							return Math.abs(parseInt(a) - parseInt(s));
						};
					curData.every(item => {
						var curval = item.engVal;
						if (curval == cmpVal) {
							curObj = item;
							return
						} else if (data.ltPropInterval[__class.replace('s', '')] && __class != "meridiems" && (!curObj || retDiff(curval, cmpVal) < retDiff(cmpVal, curObj.engVal))) {
							curObj = item;
						}
						return true;
					});
					if (!curObj) {
						var start = curData[0].engVal;
						if (((hh && start == '12') ? 0 : start) > ((hh && cmpVal == '12') ? 0 : cmpVal)) {
							curObj = curData[0];
						} else {
							curObj = curData[curData.length - 1];
						}
					}
					retVal = curObj;
				}
				return retVal;
			};
		split.forEach(item => {
			var curForm = item.format.val,
				val = moment.format(curForm);
			switch (curForm) {
				case "HH":
				case "hh": {
					dispHour = val;
					hh = curForm == 'hh';
					break;
				}
				case "mm": {
					dispMin = val;
					break
				}
				case "ss": {
					dispSec = val;
					break;
				}
				case "A": {
					dispMeri = val;
					break
				}
			}
		});
		var hideCall = {
			meridiems: { curComp: dispMeri, overRide: (curFormat == 12 && !dispMeri) },
			hours: { curComp: dispHour, overRide: (!curFormat && dispMin) },
			minutes: { curComp: dispMin, overRide: (!dispMin && dispSec) },
			seconds: { curComp: dispSec, overRide: undefined }
		}
		activateUnits.forEach(item => {
			var getVal = hideCall[item],
				avail = getAvailComp(item, getVal.curComp);
			if (avail) {
				if (!this.dropDownChanges(avail, item, overRide && getVal.overRide, from)) {
					change = true;
				}
			}
		})
		focusElem = this.dropDown.querySelector(".lyteTimePickerItemSelected");
		(from == "start") && focusElem && focusElem.focus({ preventScroll: true });
		this.setAriaTime(this.setDropVal(true));
		return change;
	},

	dropDownValClick: function (button, curUnit, evt) {
		if (button) {
			this.getMethods("onCustomButtonClick") && this.executeMethod("onCustomButtonClick", evt, curUnit, this.$node);
			var purpose = curUnit.getAttribute("purpose");
			if (purpose == "ok") {
				this.setDropVal(false, evt);
			} else if (purpose == "cancel") {
				this.hideDropDownVal(true, evt, "ok");
			}
		} else {
			var setArr = ["meridiems", "hours", "minutes", "seconds"],
				_class = curUnit.getAttribute("data-unit"),
				selected = this.data[_class][curUnit.getAttribute("data-index")];
			setArr.splice(0, setArr.indexOf(_class) + 1);
			this.updDropVal(selected, _class, setArr);
			// this.dropDownChanges(selected, _class) && setArr.splice(0, setArr.indexOf(_class) + 1);
			// setArr.length != 4 && setArr.length != 0 && this.setValuesManually(setArr);
		}
	},

	fixSelection: function (start, return_field) {
		var _this = this,
			data = _this.data,
			format = data.ltPropTimeFormat,
			moment = $L.moment(this.toEng(data.ltPropValue, format), format),
			input = this.input,
			fn = function (moment, split) {
				var len = split.length,
					finished = 0,
					prev = 0;

				for (var i = 0; i < len; i++) {
					var cur = split[i],
						format = cur.format.val,
						// converted = moment[ns](format),
						__start = finished + cur.index - prev,
						__end = __start + /*converted.length*/2;

					if (__start <= start && start <= __end) {
						if (return_field) {
							return cur;
						}
						return {
							start: __start,
							end: __end
						}
					}

					finished = __end;
					prev = cur.index + format.length;
				}

			};

		// this.__start = this.__end = start;

		var split = moment.parseFormat(format),
			first_match = fn(moment, split);

		if (return_field) {
			return first_match;
		}

		if (first_match) {
			input.selectionStart = first_match.start;
			input.selectionEnd = first_match.end;
			return true;
		}

		return false;

	},

	freezeLayer: function (open) {
		if (this.data.ltPropFreeze) {
			var freezeElem = document.getElementById("lyteTimePickerFreezeLayer");
			if (!freezeElem) {
				freezeElem = document.createElement('div');
				freezeElem.setAttribute('id', 'lyteTimePickerFreezeLayer');
				_lyteUiUtils.appendChild(document.body, freezeElem);
			}
			document.body.classList[open ? "add" : "remove"]("lyteTimePickerOpenFreeze");
		}
	},

	setBoundary: function (inputDim, windowHeight, windowWidth) {
		var boundary = this.data.ltPropBoundary,
			inBoundary = this.data.inBoundary,
			top = boundary.top || 0,
			bottom = boundary.bottom || windowHeight,
			left = boundary.left || 0,
			right = boundary.right || windowWidth;
		if (inputDim.bottom < top || inputDim.top > bottom || inputDim.right < left || inputDim.left > right) {
			if (inBoundary) {
				this.hideDropDownVal(true, undefined, "ok", true);
				this.setData("inBoundary", false);
			}
		} else if (!inBoundary) {
			this.hideDropDownVal(false, undefined, undefined, true);
			this.setData("inBoundary", true);
		}
	},

	setDropdownDim: function (evt, start) {
		var dropDown = this.dropDown,
			dropDownField = dropDown.querySelector(".lyteTimePickerDropdownValues"),
			fastdom = $L.fastdom;
		if (evt && $L(evt.target).closest(".lyteTimePickerUl").length) {
			return;
		}
		dropDown.style.bottom = "";
		dropDownField.style.height = "";
		fastdom.measure(function () {
			var scrolledY = window.pageYOffset || document.documentElement.scrollTop,
				scrolledX = window.pageXOffset || document.documentElement.scrollLeft,
				elementBCR = this.$node.getBoundingClientRect(),
				dropDownTransf = getComputedStyle(dropDown).transform.match(/matrix\((.+)\)/),
				dropDownBCR = dropDown.getBoundingClientRect(),
				dropDownHeight = dropDownBCR.height + (Array.isArray(dropDownTransf) ? Math.abs(dropDownTransf[1].split(', ')[5]) : 0),
				dropDownFeildsBcr = getComputedStyle(dropDownField),
				dropDownFeildsHeight = dropDownField.offsetHeight - parseInt(dropDownFeildsBcr.paddingTop) - parseInt(dropDownFeildsBcr.paddingBottom),
				windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
				windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
				inputDim = this.inputField.getBoundingClientRect(),
				bottomAvailHeight = windowHeight - inputDim.bottom,
				data = this.data,
				minFeildHeight = (data.ltPropDropdownMinHeight == undefined && $L(dropDown).find('li')[0].offsetHeight) + data.paddingTop,
				inline = data.ltPropInline,
				bToBody = !inline && data.ltPropBindToBody,
				dropdownPositionLeft = data.ltPropDropdownAlignPosition == 'left',
				$dropDown = $L(dropDown);
			!start && this.setBoundary(inputDim, windowHeight, windowWidth)
			fastdom.mutate(function () {
				if (data.inBoundary) {
					var setToTop = function () {
						dropDown.style.top = "";
						if (bToBody) {
							dropDown.style.bottom = windowHeight - (scrolledY + inputDim.top) + "px";
						} else {
							dropDown.style.bottom = inputDim.height + "px";
						}
						topSide = true;
					},
						valChange,
						topSide;

					if (inline && !dropdownPositionLeft) {
						dropDown.style.left = elementBCR.width - dropDownBCR.width + "px";
					}

					if (bToBody) {
						dropDown.style.top = scrolledY + elementBCR.top + elementBCR.height + "px";
						dropDown.style.left = scrolledX + elementBCR.left + (dropdownPositionLeft ? 0 : elementBCR.width - dropDownBCR.width) + "px";
						valChange = true;
					}

					if (bottomAvailHeight < dropDownHeight) {
						if (inputDim.top > dropDownHeight) {
							$dropDown.removeClass("lyteDropdownSizeChange");
							setToTop();
						} else {//>=
							$dropDown.addClass("lyteDropdownSizeChange");
							if (bottomAvailHeight > inputDim.top) {
								var val = dropDownFeildsHeight - (dropDownHeight - bottomAvailHeight);
							} else {
								setToTop();
								var val = dropDownFeildsHeight - (dropDownHeight - inputDim.top);
							}
							dropDownField.style.height = (val > minFeildHeight ? val : minFeildHeight) + "px";
						}
						valChange = true;
					} else {
						$dropDown.removeClass("lyteDropdownSizeChange");
					}
					topSide ? $dropDown.addClass("lyteDropdownTopSide") : $dropDown.removeClass("lyteDropdownTopSide");
				}
			}.bind(this));
		}.bind(this));

	},

	inputClick: function () {
		if (this.isValid()) {
			$L.fastdom.mutate(function () {
				this.fixSelection(this.input.selectionStart);
			}.bind(this))
		}
	},

	counterVal: function (type, manual) {
		var data = this.data;
		if (this.isValid() && (manual ? event.touches.length == 1 : true) && (data.ltPropReadonly ? data.ltPropAllowCounter : true)) {
			var fn = function () {
				this.inputKeys({ key: type ? 'ArrowUp' : 'ArrowDown', preventDefault: function () { } }, true);
			}.bind(this);
			event.preventDefault();
			this.input.focus();
			this.inputClick();
			if (type == "stop") {
				clearInterval(this.counterTime);
				document.removeEventListener("mouseup", this.counterRef);
				delete this.counterRef;
				delete this.counterTime;
			} else {
				fn();
				if (!manual) {
					clearInterval(this.counterTime);
					document.removeEventListener("mouseup", this.counterRef);
					this.counterRef = this.counterVal.bind(this, "stop", false);
					document.addEventListener("mouseup", this.counterRef);
					this.counterTime = setInterval(fn, 500);
				}
			}
		}
	},

	modifyVal: function (start, end, range, type, __class, form, addUnit, ind) {
		var getConv = function (val) {
			var strVal = JSON.stringify(val);
			return (strVal.length == 1 ? "0" + strVal : strVal);
		},
			moment = $L.moment(getConv(start), form),
			retArr = [],
			inc = range ? range : 1;
		for (var i = start; i <= end; i += inc) {
			var cur_val = (type == "obj") ? this.toOtherLang(moment, form) : getConv(i),
				alt_val = (type == "obj") ? { index: ind++, value: cur_val, selected: "false", disabled: "false", class: __class, format: form, engVal: moment.format(form) } : cur_val;
			retArr.push(alt_val);
			moment.add(inc, addUnit);
		}
		return retArr;
	},

	setUnitValues: function () {
		var data = this.data,
			format = data.ltPropTimeFormat,
			curTime = this.toEng(data.ltPropValue, format),
			startTime = data.ltPropStartTime,
			endTime = data.ltPropEndTime,
			interval = data.ltPropInterval,
			i18n = data.ltPropI18n,
			refresh = data.dropdownRefresh,
			split = $L.moment(curTime, format).parseFormat(format),
			am = i18n ? _lyteUiUtils.i18n('AM') : 'AM',
			pm = i18n ? _lyteUiUtils.i18n('PM') : 'PM',
			startMoment,
			availTimeUnits = {},
			endMoment,
			hide = {},
			setHourData = function (curFormat, start, end, timeFormat, type) {
				startMoment = this.toEng(startTime, format) || $L.moment(start, curFormat);
				endMoment = this.toEng(endTime, format) || $L.moment(end, curFormat);
				startMoment = (typeof (startMoment) == "string") ? $L.moment(startMoment, format) : startMoment;
				endMoment = (typeof (endMoment) == "string") ? $L.moment(endMoment, format) : endMoment;
				availTimeUnits.hour = type;
				this.setData("curFormat", timeFormat);
			}.bind(this);
		if (refresh) {
			split.forEach(item => {
				var cur_form = item.format.val;
				switch (cur_form) {
					case "hh": {
						setHourData("hh:mm:ss A", "12:00:00 AM", "11:59:59 PM", 12, "hh");
						var tempArr = /*interval.hour ? (11 % interval.hour == 0) : true) ?*/ this.modifyVal(12, 12, interval.hour, "obj", "lyteTimePickerHour", "hh", "hours", 0) /*: []*/;
						this.setData("hours", tempArr.concat(this.modifyVal(interval.hour || 1, 11, interval.hour, "obj", "lyteTimePickerHour", "hh", "hours", tempArr.length ? 1 : 0)));
						break;
					}
					case "HH": {
						setHourData("HH:mm:ss", "00:00:00", "23:59:59", 24, "HH");
						this.setData("hours", this.modifyVal(0, 23, interval.hour, "obj", "lyteTimePickerHour", "HH", "hours", 0));
						break;
					}
					case "mm": {
						availTimeUnits.min = "mm";
						this.setData("minutes", this.modifyVal(0, 59, interval.minute, "obj", "lyteTimePickerMinute", "mm", "minutes", 0));
						break;
					}
					case "ss": {
						availTimeUnits.sec = "ss";
						this.setData("seconds", this.modifyVal(0, 59, interval.second, "obj", "lyteTimePickerSecond", "ss", "seconds", 0));
						break;
					}
					case "A": {
						availTimeUnits.meri = "A";
						break;
					}
				}
			});
			availTimeUnits.meri && (availTimeUnits.hour == "hh") && this.setData("meridiems", [{ index: 0, value: am, selected: "false", disabled: "false", class: "lyteTimePickerMeridiem", format: "A", engVal: "AM" }, { index: 1, value: pm, selected: "false", disabled: "false", class: "lyteTimePickerMeridiem", format: "A", engVal: "PM" }]);
			if (data.ltPropStartTime || data.ltPropEndTime) {
				var hourStart = availTimeUnits.hour && startMoment && parseInt(startMoment.format(availTimeUnits.hour)),
					minStart = availTimeUnits.min && startMoment && parseInt(startMoment.format("mm")),
					secStart = availTimeUnits.sec && startMoment && parseInt(startMoment.format("ss")),
					hourEnd = availTimeUnits.hour && endMoment && parseInt(endMoment.format(availTimeUnits.hour)),
					minEnd = availTimeUnits.min && endMoment && parseInt(endMoment.format("mm")),
					secEnd = availTimeUnits.sec && endMoment && parseInt(endMoment.format("ss")),
					minHideObj = { start: { hour: hourStart, value: minStart - 1 }, end: { hour: hourEnd, value: minEnd + 1 } },
					secHideObj = { start: { hour: hourStart, min: minStart, value: secStart - 1 }, end: { hour: hourEnd, min: minEnd, value: secEnd + 1 } },
					normRange = endMoment.fromNow(startMoment),
					hourHideObj;
				if (availTimeUnits.hour == "HH") {
					if (normRange.past || normRange.value == 0) {
						hide.arr = this.modifyVal(0, hourStart - 1).concat(this.modifyVal(hourEnd + 1, 23));
					} else if ((startMoment.fromNow(endMoment)).past) {
						hide.arr = this.modifyVal(hourEnd + 1, hourStart - 1);
					}
					hide.unit = "hours";
				} else if (availTimeUnits.hour == "hh") {
					var meriStart = startMoment.format("A") || 'AM',
						meriEnd = endMoment.format("A") || 'AM';
					secHideObj.start.meridiem = minHideObj.start.meridiem = meriStart;
					secHideObj.end.meridiem = minHideObj.end.meridiem = meriEnd;
					hourHideObj = { start: { meridiem: meriStart, value: (hourStart == 12) ? -1 : hourStart - 1 }, end: { meridiem: meriEnd, value: (hourEnd == 12) ? 1 : hourEnd + 1 } };
					if (meriStart == meriEnd && (normRange.past || normRange.value == 0)) {
						hide.arr = [(meriStart == 'AM') ? 'PM' : 'AM'];
					}
					hide.unit = "meridiems";
					availTimeUnits.hour && this.setData("hoursHide", hourHideObj);
				}
				availTimeUnits.min && this.setData("minutesHide", minHideObj)
				availTimeUnits.sec && this.setData("secondsHide", secHideObj)
				this.blurItems(hide.arr, hide.unit);//these are done here because these are not going to change until dropDown button is pressed// these are the start
			}
			this.setData("dropdownRefresh", false);
		} else {//unselect all item
			var unselect = function (obj) {
				obj.forEach(item => {
					item.selected = "false";
				});
			};
			["hours", "minutes", "seconds", "meridiems"].forEach(unit => {
				var unitData = this.data[unit];
				unitData.length && unselect(unitData);
			});
		}
		$L(this.dropDown).removeClass("lyteTimePickerDropdownNone");
		$L(this.$node).addClass("lyteTimePickerDropdownOpened");
		this.setDropdownDim(undefined, true);
		if (!data.paddingTop) {
			this.setData("paddingTop", parseFloat(getComputedStyle($L(this.dropDown).find('.lyteTimePickerUl')[0]).paddingTop));
		}
	},

	dropDownButtonClick: function (evt) {
		if (this.getMethods("onBeforeOpen") && this.executeMethod("onBeforeOpen", evt, this.$node) == false) {
			return;
		}
		this.setUnitValues();
		$L.fastdom.measure(function () {//fastdom is because updtDropDownDim called after setValuesManually, so that if the values are 59 and the dropdown is short, it is not in view
			$L.fastdom.mutate(function () {
				this.setValuesManually(["meridiems", "hours", "minutes", "seconds"], true, "start");
				this.$node.querySelector(".lytetimePickerButton").setAttribute("aria-expanded", true);
				this.freezeLayer(true);
				this.getMethods("onOpen") && this.executeMethod("onOpen", evt, this.$node);
			}.bind(this));
		}.bind(this));
	}

});

(function () {
	var updtDropDownDim = function (evt) {
		Array.from(document.getElementsByTagName("lyte-time-picker-dropdown")).forEach(dropItem => {
			var dropDown = (dropItem.closest("lyte-time-picker") || dropItem.parent).component;
			if ((!$L(dropItem).hasClass("lyteTimePickerDropdownNone")) || !dropDown.data.inBoundary) {
				dropDown.setDropdownDim(evt);
			}
		})
	};

	['scroll', 'resize', 'orientationchange'].forEach(item => {
		_lyteUiUtils.addEvent(window, item, function (evt) {
			item == "orientationchange" ? setTimeout(updtDropDownDim(evt), 500) : updtDropDownDim(evt);
		})
	})

	_lyteUiUtils.addEvent(document, 'click', function (evt) {
		var target = evt.target,
			retClosest = function (ref) {
				return target.closest(ref);
			},
			dropDown = retClosest("lyte-time-picker-dropdown"),
			mainComp = ((dropDown && dropDown.parent) || retClosest("lyte-time-picker") || {}).component,
			hideDropDown = function (type) {
				Array.from(document.getElementsByTagName('lyte-time-picker')).forEach(item => {
					item.close();
				});
			};
		if (retClosest(".lyteTimePickerInput")) {
			hideDropDown();
			mainComp.inputClick();
		} else if (retClosest(".lytetimePickerButton")) {//if hide DropDown is given out it makes first cond always true
			var data = mainComp.data;
			if ((data.ltPropReadonly && !data.ltPropAllowDropdown) || data.ltPropDisabled) {
				return;
			}
			if ($L(mainComp.dropDown).hasClass("lyteTimePickerDropdownNone")) {
				hideDropDown();
				mainComp.dropDownButtonClick(evt);
			} else {
				hideDropDown();
			}
		} else if (dropDown) {
			[".lyteTimePickerDropdownButtonItem", ".lyteTimePickerMeridiem", ".lyteTimePickerHour", ".lyteTimePickerMinute", ".lyteTimePickerSecond"].every((item, index) => {
				var closest = retClosest(item);
				if (closest) {
					mainComp.dropDownValClick((index == 0) && true, closest, evt);
					return;
				}
				return true;
			});
		} else {
			hideDropDown();
		}
	})
})();