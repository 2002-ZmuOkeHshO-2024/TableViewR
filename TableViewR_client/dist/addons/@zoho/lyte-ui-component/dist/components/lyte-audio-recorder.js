Lyte.Component.register("lyte-audio-recorder", {
_template:"<template tag-name=\"lyte-audio-recorder\"> <div class=\"lyteRecordingPreview\"> <canvas class=\"lyteRecordingCanvas\"></canvas> </div> <template is=\"if\" value=\"{{ltPropDisplayTime}}\"><template case=\"true\"> <div class=\"lyteTimePreview\">{{currentTime}}<template is=\"if\" value=\"{{ltPropTimeLimit}}\"><template case=\"true\">/{{totalTime}}</template></template></div> </template></template> <div class=\"lyteRecordingControlButtons\"> <template is=\"forIn\" object=\"{{ltPropButton}}\" value=\"value\" key=\"key\"> <div purpose=\"{{value.purpose}}\" class=\"{{value.class}}\" lt-prop-title=\"{{value.title}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;Bottom&quot;}\" disabled=\"{{value.disable}}\" onclick=\"{{action('controlButtons',this)}}\"></div> </template> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"attr","position":[1,2]},{"type":"if","position":[1,2],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[5,1]},{"type":"forIn","position":[5,1],"dynamicNodes":[{"type":"attr","position":[1]}]}],
_observedAttributes :["ltPropOptions","ltPropButton","ltPropWorkersPath","ltPropTimeLimit","ltPropCurrentTime","ltPropDisplayTime","ltPropDisplayRecord","recording","cancel","currentTime","totalTime","hourValid","multiKeyObj"],

	data: function () {
		return {
			ltPropOptions: Lyte.attr("object", { default: {} }),
			ltPropButton: Lyte.attr("object", {
				default: {
					multi: { purpose: "record", disable: false },
					cancel: { purpose: "cancel", disable: true, class: 'lyteAudioRecorderDisabled' },
					stop: { purpose: "stop", disable: true, class: 'lyteAudioRecorderDisabled' }
				}
			}),
			ltPropWorkersPath: Lyte.attr("string"),
			ltPropTimeLimit: Lyte.attr("number"),
			ltPropCurrentTime: Lyte.attr("number"),
			ltPropDisplayTime: Lyte.attr("boolean", { default: false }),
			ltPropDisplayRecord: Lyte.attr("boolean", { default: true }),


			recording: Lyte.attr("boolean", { default: false }),
			cancel: Lyte.attr("boolean", { default: false }),
			currentTime: Lyte.attr("string", { default: "00:00" }),
			totalTime: Lyte.attr("string"),
			hourValid: Lyte.attr("boolean", { default: false }),
			multiKeyObj: Lyte.attr("string")
		}
	},
	actions: {
		controlButtons: function (_this) {
			var button = _this.getAttribute('purpose');
			switch (button) {
				case 'record': {
					this.record();
					break;
				}
				case 'pause': {
					this.pause();
					break;
				}
				case 'resume': {
					this.resume();
					break;
				}
				case 'cancel': {
					this.stop(true);
					break;
				}
				case 'stop': {
					this.stop();
					break;
				}
			}
		}
	},
	didConnect: function () {

		var node = this.$node,
			data = this.data,
			button = data.ltPropButton;
			
		for (var key in button) {
			var purpose = button[key].purpose;
			if(purpose == 'record'){
				if(!data.ltPropDisplayRecord){
					Lyte.objectUtils(button,"add",key,{purpose: "pause", disable: true, class: 'lyteAudioRecorderDisabled'});
					purpose = 'pause';
				}
				this.setData('multiKeyObj',key);
			}
			this.setClass(key, purpose);
		}

		if (data.ltPropDisplayTime) {
			var limit = data.ltPropTimeLimit;
			if (limit) {
				var limitVal = this.getFormTime(limit);
				this.setData("totalTime", limitVal);
				if (limitVal.length > 6) {
					this.setData("hourValid", true);
					this.setData("currentTime", "00:00:00");
				}
			}
		}

		node.record = function () {
			new Promise((res)=>{
				this.res=res;
			}).then(()=>{
				this.res = undefined;
				this.record();
			})
			node.cancel();
		}.bind(this)

		node.pause = function () {
			this.pause();
		}.bind(this)

		node.resume = function () {
			this.resume();
		}.bind(this)

		node.cancel = function () {
			this.stop(true);
		}.bind(this)

		node.stop = function () {
			this.stop();
		}.bind(this)
	},
	record: function () {
		var _this = this,
			data = _this.data,
			callbackCount = 0,
			curDur = 0,
			hourValid = data.hourValid,
			dispRecord = data.ltPropDisplayRecord;
		if (data.ltPropWorkersPath) {
			if (this.callBacks("onBeforeRecord") == false) {
				return;
			}
			$L.media.record({
				workletBasePath: data.ltPropWorkersPath,
				workerBasePath: data.ltPropWorkersPath,
				onStop: function (blob, buffer) {
					_lyteUiUtils.generateThumb({
						stop: true
					});
					var options = data.ltPropOptions,
						setVal = dispRecord ? 'record' : 'pause';
					if (_this.getMethods("onStop")) {
						if (data.cancel) {
							_this.setData('cancel', false);
							_this.callBacks("onCancel");
						} else {
							_this.executeMethod("onStop", blob, buffer, _this.$node);
						}
					}
					_this.$node.querySelector(".lyteRecordingCanvas").getContext("2d").clearRect(0, 0, options.width || 350, options.height || 100);
					_this.setData('recording', false);
					_this.setData('currentTime', "00:00");
					_this.setDisable(true);
					$L(_this.$node).removeClass("lyteAudioRecording");
					$L(_this.$node).removeClass("lyteAudioPause");
					if(!_this.addRemoveClass('pause',setVal)){
						_this.addRemoveClass('resume',setVal)
					}
					_this.res && _this.res();
				},
				onProgress: function (buffer) {
					callbackCount++;
					curDur = Math.floor(callbackCount / 344);
					if (curDur != undefined && data.ltPropCurrentTime != curDur) {
						_this.setData("ltPropCurrentTime", curDur);
						if (data.ltPropDisplayTime) {
							_this.setData("currentTime", _this.getFormTime(curDur, hourValid));
						}
					}
					if (data.ltPropTimeLimit != undefined && curDur >= data.ltPropTimeLimit) {
						_this.stop();
						return;
					}
					_lyteUiUtils.generateThumb($L.extend({
						canvas: _this.$node.querySelector(".lyteRecordingCanvas"),
						buffer: buffer,
						type: "bar",
						recording: true,
						width: 350,
						height: 100,
						margin: 2,
						defaultHeight: 2,
						fillStyle: "#8AC0F2"
					}, data.ltPropOptions));
				}
			});
			$L(this.$node).addClass("lyteAudioRecording");
			this.setData('recording', true);
			this.setDisable(false);
			dispRecord && this.addRemoveClass('record','pause');
			this.callBacks("onRecord");
		}
	},
	stop: function (cancel) {//format time
		if (this.data.recording) {
			var callBack = cancel ? "Cancel" : "Stop";
			if (this.callBacks("onBefore" + callBack) == false) {
				return;
			}
			cancel && this.setData('cancel', true);
			$L.media.stop()
		}else{
			this.res && this.res();
		}
	},
	resume: function () {
		if (this.data.recording) {
			if (this.callBacks("onBeforeResume") == false) {
				return;
			}
			$L.media.resume();
			this.addRemoveClass("resume", "pause", "lyteAudioPause", "lyteAudioRecording");
			this.callBacks("onBeforeResume")
		}
	},
	pause: function () {
		if (this.data.recording) {
			if (this.callBacks("onBeforePause") == false) {
				return;
			}
			$L.media.pause();
			this.addRemoveClass("pause", "resume", "lyteAudioRecording", "lyteAudioPause");
			this.callBacks("onBeforePause")
		}
	},
	retForm: function (num) {
		return num.toString().length == 1 ? "0" + num : num
	},
	getFormTime: function (time, overRide) {
		var retTime = "",
			min = Math.floor(time / 60),
			hour = Math.floor(time / 3600);
		if (hour || overRide) {
			retTime += (this.retForm(hour) + ":")
		}
		retTime += (this.retForm(min - (hour * 60)) + ":");
		retTime += this.retForm(time - (min * 60));
		return retTime;
	},
	setDisable: function (value) {
		var button = this.data.ltPropButton;
		for (var object in button) {
			var objValue = button[object],
				__class = value ? objValue.class+' lyteAudioRecorderDisabled' : objValue.class.replace(' lyteAudioRecorderDisabled','');
			if(objValue.purpose == 'record'){
				continue;
			}
			Lyte.objectUtils(objValue, "add", "disable", value)
			Lyte.objectUtils(objValue, "add", "class", __class)
		}
	},
	setClass: function (key, value) {
		var buttons = this.data.ltPropButton,
			camelValue = value[0].toUpperCase() + value.slice(1),
			__class = "lyteAudioRecorder" + camelValue + "Button",
			buttonVal = buttons[key],
			disClass = buttonVal.class && buttonVal.class.includes('lyteAudioRecorderDisabled') ? ' lyteAudioRecorderDisabled' : '';
		Lyte.objectUtils(buttonVal, "add", "class", __class + disClass);
		Lyte.objectUtils(buttonVal, "add", "title", camelValue);
	},
	addRemoveClass: function (cur, to, addClass, remClass) {
		var node= this.$node,
		curButton = node.querySelector('[purpose=' + cur + ']')
		addClass && $L(node).removeClass(addClass);
		remClass && $L(node).addClass(remClass);
		if (curButton) {
			curButton.setAttribute("purpose", to);
			this.setClass(this.data.multiKeyObj, to);
			return true;
		}
	},
	callBacks: function (name) {
		if (this.getMethods(name)) {
			return this.executeMethod(name, this.$node)
		}
	}
});
