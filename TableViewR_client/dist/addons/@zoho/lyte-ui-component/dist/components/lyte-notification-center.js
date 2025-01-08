window.addEventListener('click', function (event) {
	if (_lyteUiUtils.notificationStack) {
		if (event.target === document.documentElement) {
			var parentNode = $L('.lyteNotificationCenterWrapper');
			parentNode.css('transform', 'translateX(120%)');
		}
	}
});

Lyte.Component.register("lyte-notification-center", {
_template:"<template tag-name=\"lyte-notification-center\"> <template is=\"if\" value=\"{{ltPropBindToBody}}\"><template case=\"true\"> <lyte-wormhole on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\" lt-prop-show=\"{{ltPropShowWormhole}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"lyteNotificationCenter\"> <div class=\"lyteNotificationPopDiv\"> <template is=\"for\" items=\"{{notificationStackArr}}\" item=\"array\" index=\"index\"> <template is=\"if\" value=\"{{expHandlers(array.length,'>',0)}}\"><template case=\"true\"> <template is=\"if\" value=\"{{expHandlers(array.length,'>',1)}}\"><template case=\"true\"> <lyte-button class=\"lyteNotificationPopCancelBtn\" onclick=\"{{action('cancelPopAction',event,this,index,ind)}}\"> <template is=\"registerYield\" yield-name=\"text\"> </template> </lyte-button> </template></template> <div class=\"lyteNotificationPopUpCenterWrapper\"> <template items=\"{{array}}\" item=\"item\" index=\"ind\" is=\"for\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <div class=\"lyteNotificationPopUpItem\"> <div class=\"lyteNotificationPopCloseIcon\" onclick=\"{{action('removePopItem',item,this,index,ind)}}\"> </div> <lyte-yield yield-name=\"notify\" list-value=\"{{item}}\"></lyte-yield> </div> </template></template> </template> </div> </template></template> </template> </div> <template is=\"if\" value=\"{{ltPropShowPanel}}\"><template case=\"true\"> <template is=\"for\" items=\"{{ltPropData}}\" item=\"array\" index=\"index\"> <template is=\"if\" value=\"{{expHandlers(array.length,'>',0)}}\"><template case=\"true\"> <div class=\"lyteNotificationParentContainer\"> <template is=\"if\" value=\"{{expHandlers(array.length,'>=',2)}}\"><template case=\"true\"><div class=\"lyteNotificationbtnWrapper\"> <template is=\"if\" value=\"{{ltPropActionBtn.showLess}}\"><template case=\"true\"> <lyte-button class=\"lyteNotificationShowLessBtn\" onclick=\"{{action('showLessAction',event,this)}}\"> <template is=\"registerYield\" yield-name=\"text\"> Show less </template> </lyte-button> </template></template> <template is=\"if\" value=\"{{ltPropActionBtn.cancelAll}}\"><template case=\"true\"> <lyte-button class=\"lyteNotificationCancelBtn\" onclick=\"{{action('cancelAction',event,this,index,ind)}}\"> <template is=\"registerYield\" yield-name=\"text\"> </template> </lyte-button> </template></template> </div></template></template> <div class=\"lyteNotificationClearWrapper\" onclick=\"{{action('clearClosedNotification',item,this,index)}}\"> <span class=\"lyteNotificationClosedClearIcon\"></span> </div> <div class=\"lyteNotificationCenterWrapper\" onclick=\"{{action('expandAction',event,this,array)}}\"> <template items=\"{{array}}\" item=\"item\" index=\"ind\" is=\"for\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <div class=\"lyteNotificationItem\"> <div class=\"lyteNotificationCloseIcon\" onclick=\"{{action('removeItem',item,this,index,ind)}}\"></div> <lyte-yield yield-name=\"notify\" list-value=\"{{item}}\"></lyte-yield> </div> </template></template> </template> </div> </div> </template></template> </template> </template></template> </div> </template> </lyte-wormhole> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3,1]},{"type":"for","position":[3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"insertYield","position":[1,3]}]}},"default":{}}]}]}},"default":{}}]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1]},{"type":"if","position":[0,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[0,3]},{"type":"if","position":[0,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,5]},{"type":"attr","position":[1,5,1]},{"type":"for","position":[1,5,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"insertYield","position":[1,3]}]}},"default":{}}]}]}},"default":{}}]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropShow","ltPropBindToBody","ltPropData","ltPropYield","ltPropDuration","ltPropCloseOnBodyClick","ltPropActionBtn","ltPropShowWormhole","notificationStackArr","ltPropShowPanel","ltPropDefaultState","ltPropAnimation","ltPropWrapperClass","ltPropPosition","timeoutActive"],

	// Lyte Attr
	data: function () {
		return {
			/**
			* @componentProperty {boolean} ltPropShow
			* @version 1.0.0
			* @default false
			*/
			ltPropShow: Lyte.attr('boolean', { default: false }),
			/**
			 * @componentProperty {boolean} ltPropBindToBody
			 * @version 1.0.0
			 * @default false
			 */
			ltPropBindToBody: Lyte.attr('boolean', { default: false }),
			/**
			 * @componentProperty {array} ltPropData
			 * @version 1.0.0
			 * @default []
			 */
			ltPropData: Lyte.attr('array', { default: [], watch: true }),
			/**
			 * @componentProperty {boolean} ltPropYield
			 * @version 1.0.0
			 * @default false
			 */
			ltPropYield: Lyte.attr("boolean", { "default": false }),
			/**
			 * @componentProperty {string} ltPropDuration
			 * @version 1.0.0
			 * @default 10ms
			 */
			ltPropDuration: Lyte.attr('string'),
			/**
			 * @componentProperty {boolean} ltPropCloseOnBodyClick
			 * @version 1.0.0
			 * @default false
			 */
			ltPropCloseOnBodyClick: Lyte.attr('boolean', { default: false }),
			/**
			 * @componentProperty {object} ltPropActionBtn
			 * @version 1.0.0
			 * @default {}
			 */
			ltPropActionBtn: Lyte.attr('object', { default: {} }),
			/**
			 * @componentProperty {boolean} ltPropShowWormhole
			 * @version 1.0.0
			 * @default false
			 */
			ltPropShowWormhole: Lyte.attr('boolean', { default: false }),
			/**
			 * @componentProperty {array} notificationStackArr
			 * @version 1.0.0
			 * @default false
			 */
			notificationStackArr: Lyte.attr('array', { default: [], watch: true }),
			/**
			 * @componentProperty {boolean} ltPropShowPanel
			 * @version 1.0.0
			 * @default false
			 */
			ltPropShowPanel: Lyte.attr('boolean', { default: false }),
			/**
			 * @componentProperty {boolean} ltPropDefaultState
			 * @version 1.0.0
			 * @default false
			 */
			ltPropDefaultState: Lyte.attr('boolean', { default: 'close' }),
			/**
			 * @componentProperty {string} ltPropAnimation
			 * @version 1.0.0
			 * @default false
			 */
			ltPropAnimation: Lyte.attr('string', { default: 'fade' }),
			/**
			 * @componentProperty {string} ltPropWrapperClass
			 * @version 1.0.0
			 * @default false
			 */
			ltPropWrapperClass: Lyte.attr('string'),
			/**
			 * @componentProperty {string} ltPropPosition
			 * @version 1.0.0
			 * @default false
			 */
			ltPropPosition: Lyte.attr('string', { default: "topRight" }),
			/**
			 * @componentProperty {boolean} timeoutActive
			 * @version 1.0.0
			 * @default false
			 */
			timeoutActive: Lyte.attr('boolean', { default: 'false' }),
		}
	},

	didConnect: function () {
		this.setData('notificationStackArr', Lyte.deepCopyObject(this.getData('ltPropData')));
		this.$node.showLess = this._showLess;
		this.$node.openAll = this._openAll;
		if (this.data.ltPropDuration) {
			this.setData('timeoutActive', true);
		}
	},

	actions: {
		showLessAction: function (evt, _this) {
			var parentNode = $L(_this).closest('.lyteNotificationParentContainer');
			parentNode.removeClass('lyteNotificationOpened');
			var notificationElements = parentNode.find('.lyteNotificationItem');

			if ($L('.lyteNotificationParentContainer').length > 1) {
				parentNode[0].style.height = notificationElements[0].getBoundingClientRect().height + 25 + 'px';
			}

			var scaleArr = [];
			var scale = 1;
			var firstItemHeight = notificationElements[0].getBoundingClientRect().height;

			for (let i = 0; i < notificationElements.length; i++) {
				scaleArr.push(Number(scale).toFixed(2));
				scale = scale - 0.04;
			}

			var calculatePositionPromise = new Promise((resolve, reject) => {
				try {
					$L(notificationElements).css('transition', 'unset');
					$L(notificationElements).css('transform', 'unset');
					var topValues = [];
					for (let i = 0; i < notificationElements.length; i++) {
						topValues.push(notificationElements[i].offsetTop);
					}
					for (let i = 0; i < notificationElements.length; i++) {
						notificationElements[i].style.position = 'absolute';
						notificationElements[i].style.top = topValues[i] + "px";
						notificationElements[i].style.width = '100%';
					}
					resolve();
				} catch (error) {
					reject(error);
				}
			});

			calculatePositionPromise.then(() => {
				$L(notificationElements).css('transform', '');
				setTimeout(function () {
					$L(notificationElements).css('transition', '0.3s');
					$L(notificationElements).css('top', '0px');
					$L(_this).closest('.lyteNotificationbtnWrapper').addClass('lyteNotificationHideBtnWrapper');
				}, 10)

				setTimeout(() => {
					parentNode.addClass('lyteNotificationClosed');
				}, 300);

				for (let i = 0; i < notificationElements.length; i++) {
					notificationElements[i].style.height = firstItemHeight + "px";
					if (i <= 2) {
						notificationElements[i].style.transform = "translateY(" + (i * 8) + "px) scaleX(" + scaleArr[i] + ")";
						notificationElements[i].style.zIndex = notificationElements.length - i;
					}
					else {
						notificationElements[i].style.height = '0px';
					}
				}
			}).catch((error) => {
				console.error('An error occurred: ', error);
			});
		},

		cancelAction: function (evt, _this, index) {
			if (this.getMethods('onCancelAll')) {
				this.executeMethod('onCancelAll', evt, _this);
			}

			if ($L(this.childComp).find('.lyteNotificationOpened')) {
				Lyte.arrayUtils(this.getData('ltPropData'), 'removeAt', index);
			}
		},

		expandAction: function (evt, _this, item) {
			var closeClass = $L(evt.target).hasClass("lyteNotificationCloseIcon");
			var checkClass = $L(_this).closest('.lyteNotificationParentContainer').hasClass('lyteNotificationClosed');
			if (closeClass) {
				evt.preventDefault();
			}

			else if (item.length > 1 || checkClass) {
				var closedParentEle = $L('.lyteNotificationClosed').find('.lyteNotificationbtnWrapper');

				if (closedParentEle) {
					closedParentEle.addClass('lyteNotificationHideBtnWrapper');
				}

				var notificationParentNode = $L(_this);
				var showLessBtn = notificationParentNode.closest('.lyteNotificationParentContainer').find('.lyteNotificationHideBtnWrapper');
				var parentNode = $L(_this).closest('.lyteNotificationParentContainer');
				var btnWrapper = notificationParentNode.closest('.lyteNotificationParentContainer').find('.lyteNotificationbtnWrapper');
				var notificationsElements = notificationParentNode[0].children;

				if (showLessBtn.length || !btnWrapper.length && parentNode) {
					this.setData('ltPropDefaultState', 'open');
					parentNode.find('.lyteNotificationbtnWrapper').removeClass('lyteNotificationHideBtnWrapper');
					notificationParentNode[0].style.height = '';
					parentNode[0].style.height = notificationsElements[0].getBoundingClientRect().height + 'px';

					if ($L(evt.target).hasClass('lyteNotificationCloseIcon')) {
						return;
					}

					parentNode.removeClass('lyteNotificationClosed');
					parentNode.addClass('lyteNotificationOpened');
					$L(notificationsElements).css('position', 'absolute');
					$L(notificationsElements).css('height', '');
					var gap = 10;
					var initialOffset = 37.5;
					let calculateHeight = [];
					let prevHeight = initialOffset;
					let totalHeight = initialOffset;
					var closedParentEle = $L('lyteNotificationClosed');

					for (let i = 0; i < notificationsElements.length; i++) {
						calculateHeight.push(prevHeight);
						prevHeight += notificationsElements[i].getBoundingClientRect().height + gap;
						totalHeight += notificationsElements[i].getBoundingClientRect().height + gap;
					}

					$L(notificationsElements).css('opacity', 'unset');
					$L(notificationsElements).css('height', '');
					$L(notificationParentNode).closest('.lyteNotificationParentContainer')[0].style.height = totalHeight + 'px';

					for (let i = 0; i < closedParentEle.length; i++) {
						closedParentEle[i].style.height = closedParentEle.getBoundingClientRect().height;
					}

					var setTop = new Promise((resolve, reject) => {
						for (let i = 0; i < notificationsElements.length; i++) {
							notificationsElements[i].style.transform = '';
							notificationsElements[i].style.height = '';
							notificationsElements[i].style.top = calculateHeight[i] + "px";
						}
						resolve(notificationsElements);
					});

					setTop.then((ele) => {
						setTimeout(() => {
							$L(ele).css('transition', 'unset');
							$L(ele).css('transform', 'unset');
							$L(ele).css('position', 'relative');
							$L(ele).css('top', '0');
						}, 300);
					});
				}
			}
		},

		clearClosedNotification: function (ele, _this, Arrindex, index) {
			$L(_this).addClass('lyteNotificationHideClear');
			var data = this.getData('ltPropData');
			var parentNode = $L(_this).closest('.lyteNotificationParentContainer');
			var parentNodeHeight = parentNode[0].getBoundingClientRect().height;
			var notificationParentNode = $L(_this).closest('.lyteNotificationParentContainer').find('.lyteNotificationCenterWrapper');
			var nextSibling = parentNode[0].nextElementSibling;
			new Promise((resolve) => {
				notificationParentNode.addClass('lyteNotificationClear');
				resolve();
			}).then(() => {
				setTimeout(() => {
					Lyte.arrayUtils(data[Arrindex], 'removeAt', index, data.length);
					if (nextSibling) {
						nextSibling.style.transition = 'none';
						nextSibling.style.marginTop = parentNodeHeight + 'px';
						setTimeout(() => {
							nextSibling.style.transition = '';
							nextSibling.style.marginTop = '';
						}, 10);
					}
				}, 200);
			})
		},
		removeItem: async function (ele, _this, Arrindex, index) {
			var parentNode = $L(_this).closest('.lyteNotificationParentContainer')[0];
			var buttonWrapper = $L(parentNode).find('.lyteNotificationbtnWrapper');
			parentNode.style.height = parentNode.getBoundingClientRect().height + 'px';
			$L(_this).closest('.lyteNotificationCenterWrapper')[0].style.height = '';
			let itemCount = $L(parentNode).find('.lyteNotificationItem').length;
			var removeEle = $L(_this).closest('.lyteNotificationItem')[0];
			var decreseHeight = removeEle.getBoundingClientRect().height;
			var nextSibling = removeEle.nextElementSibling;
			var _this = _this;
			var thisScope = this;

			try {
				await this.waitForTransition(removeEle, 'transform');

				if (nextSibling) {
					nextSibling.style.transition = 'none';
					nextSibling.style.marginTop = decreseHeight + "px";
					await thisScope.delay(10);
					nextSibling.style.transition = '';
					nextSibling.style.marginTop = '0px';
					if (itemCount == 2) {
						thisScope.hideButtonWrapper(buttonWrapper, parentNode, decreseHeight);
					} else {
						await thisScope.adjustParentHeight(parentNode, decreseHeight);
					}

				} else {
					var nextParentNode = parentNode.nextElementSibling;

					if (itemCount == 1 && nextParentNode) {
						await thisScope.handleSingleItem(parentNode, nextParentNode, decreseHeight);
					} else if (itemCount == 2 && nextParentNode) {
						nextParentNode.style.marginTop = decreseHeight + 'px';
						thisScope.hideButtonWrapper(buttonWrapper, parentNode, decreseHeight);
						await thisScope.delay(10);
						nextParentNode.style.marginTop = '0';
					} else if (itemCount > 2 && nextParentNode) {
						nextParentNode.style.transition = '';
						nextParentNode.style.marginTop = decreseHeight + 'px';
						await thisScope.delay(10);
						nextParentNode.style.marginTop = '0';
						await thisScope.adjustParentHeight(parentNode, decreseHeight);
					} else {
						if (itemCount == 2) {
							thisScope.hideButtonWrapper(buttonWrapper, parentNode, decreseHeight);
						}
					}

				}

			} catch (error) {
				console.error("Error during transition:", error);
			} finally {
				if (this.getMethods('onClose')) {
					this.executeMethod('onClose', ele, _this);
				}

				$L(_this).closest('.lyteNotificationCenterWrapper')[0].style.height = $L(_this).closest('.lyteNotificationCenterWrapper')[0].getBoundingClientRect().height + 'px';
				Lyte.arrayUtils(thisScope.getData('ltPropData')[Arrindex], 'removeAt', index);
			}
		},

		removePopItem: function (ele, _this, Arrindex, index) {
			var position = this.data.ltPropPosition;
			if (this.getMethods('onClose')) {
				this.executeMethod('onClose', ele, _this);
			}

			Lyte.arrayUtils(this.getData('notificationStackArr')[Arrindex], 'removeAt', index);
			var hiddenItem = $L('.lyteNotificationHidden');
			if (hiddenItem.length) {
				for (let i = 0; i < hiddenItem.length; i++) {
					if (position == 'topLeft' || position == 'topRight') {
						var lastEle = hiddenItem[0].previousElementSibling;
						var lastVisibleEle = innerHeight - lastEle.getBoundingClientRect().bottom;
						if (lastVisibleEle > lastEle.getBoundingClientRect().height) {
							$L(hiddenItem[0]).removeClass('lyteNotificationHidden');
						}
					}
				}
			}
		},

		cancelPopAction: function (ele, _this, Arrindex, index) {
			if (this.getMethods('onCancelAll')) {
				this.executeMethod('onCancelAll', ele, _this);
			}
			this.setData('timeoutActive', false);
			Lyte.arrayUtils(this.getData('notificationStackArr'), 'replaceAt', Arrindex, [[]]);
		}
	},

	methods: {
		beforeWormholeAppend: function (arg) {
			if (this.childComp) {
				delete this.childComp;
			}
			if (this.notificationWrapper) {
				delete this.notificationWrapper;
			}
			this.childComp = arg;
			this.notificationWrapper = $L(this.childComp).find(".lyteNotificationCenter")[0];
		}
	},

	delay: function (ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},

	waitForTransition: function (element, propertyName) {

		return new Promise((resolve, reject) => {
			element.style.transform = '';
			element.style.transition = '';
			var handleTransitionEnd = (event) => {
				if (event.target === element && event.propertyName === propertyName) {
					element.removeEventListener('transitionend', handleTransitionEnd);
					resolve();
				}
			};

			element.addEventListener('transitionend', handleTransitionEnd);
			$L(element).addClass('lyteNotificationSlideOut');
		});
	},

	adjustParentHeight: function (parentNode, decrease) {
		parentNode.style.height = parentNode.getBoundingClientRect().height - decrease + 'px';
	},

	hideButtonWrapper: function (buttonWrapper, parentNode, decreseHeight) {
		buttonWrapper[0].style.height = buttonWrapper[0].getBoundingClientRect().height + 'px';
		buttonWrapper[0].style.width = buttonWrapper[0].getBoundingClientRect().width + 'px';
		parentNode.style.gap = 'unset';

		setTimeout(() => {
			buttonWrapper.addClass('lyteNotificationBtnWrapperHidden');
			parentNode.style.height = decreseHeight + 15 + 'px';
		}, 100);
	},

	handleSingleItem: function (parentNode, nextParentNode, decreseHeight) {
		parentNode.style.position = 'absolute';
		nextParentNode.style.marginTop = decreseHeight + 'px';

		setTimeout(() => {
			nextParentNode.style.transition = '';
			nextParentNode.style.transform = '';
			nextParentNode.style.marginTop = '0';
			parentNode.style.height = decreseHeight + 15 + 'px';
		}, 10);
	},

	showMore: function () {
		var parentElement = $L(this.childComp).find('.lyteNotificationCenterWrapper');
		var wormholeNode = $L(this.childComp);
		parentElement.removeClass('lyteNotificationClosed');
		parentElement.closest('lyteNotificationParentContainer').addClass('lyteNotificationOpened');
		let notificationsElements = $L(this.childComp).find('.lyteNotificationItem');

		if (notificationsElements.length > 1) {
			wormholeNode.find('.lyteNotificationbtnWrapper').addClass('lyteNotificationHideBtnWrapper')
		}
		var calculateHeight = [];
		let prev = 0;

		for (let i = 0; i < notificationsElements.length; i++) {
			if (i == 0) {
				prev = notificationsElements[i].getBoundingClientRect().height;
				calculateHeight.push(prev);
			}
			else {
				prev += (notificationsElements[i].getBoundingClientRect().height + 15);
				calculateHeight.push(prev);
			}
		}

		for (let i = 0; i < notificationsElements.length; i++) {
			parentElement.closest('.lyteNotificationCenterWrapper')[0].style.height = calculateHeight[i] + 'px'
		}
	},

	_close: function () {
		if ($L(this.childComp).find('.lyteNotificationOpened')) {
			let removeEle = $L(this.childComp).find('.lyteNotificationItem');
			var j = 0;
			for (let i = 0; i < removeEle.length; i++) {
				setTimeout(() => {
					removeEle[i].style.transform = 'translateX(100%)';
					setTimeout(() => {
						if (i == removeEle.length - 1) {
							$L(this.childComp).find('.lyteNotificationbtnWrapper')[0].style.display = "none";
						}
						Lyte.arrayUtils(this.getData('ltPropData')[0], 'removeAt', i - j++);
					}, 300);
				}, i * 300);
			}
		}
	},

	disClose: function () {
		var actionBtn = this.getData('ltPropActionBtn');
		var wormholeNode = $L(this.childComp);
		wormholeNode.find(".lyteNotificationParentContainer").removeClass('lyteNotificationClosed');
		wormholeNode.find(".lyteNotificationParentContainer").addClass('lyteNotificationOpened');
		var notificationsElements = wormholeNode.find('.lyteNotificationItem');
		notificationsElements.css('position', 'absolute')
		if (notificationsElements.length == 1) {
			if (actionBtn == false) {
				wormholeNode.find('.lyteNotificationbtnWrapper').addClass('lyteNotificationHideBtnWrapper');
			}
		}
		else if (actionBtn == true) {
			wormholeNode.find('.lyteNotificationbtnWrapper').removeClass('lyteNotificationHideBtnWrapper');
		}
		var gap = 10;
		var initialOffset = 37.5;

		let calculateHeight = [];
		let prevHeight = initialOffset;

		for (let i = 0; i < notificationsElements.length; i++) {
			notificationsElements[i].style.height = 'auto';
			calculateHeight.push(prevHeight);
			prevHeight += notificationsElements[i].getBoundingClientRect().height + gap;
		}

		for (let i = 0; i < notificationsElements.length; i++) {
			notificationsElements[i].style.transform = '';
			notificationsElements[i].style.top = calculateHeight[i] + "px";
		}
	},


	showNotifications: function () {
		if (this.getData('ltPropShow')) {
			if (this.childComp) {
				$L(this.childComp).removeClass('lyteNotificationsHidden')
			}
			this.setData('ltPropBindToBody', true);
			this.setData('ltPropShowWormhole', true);
		} else {
			$L(this.childComp).addClass('lyteNotificationsHidden')
		}
	}.observes('ltPropShow'),

	showPanel: function (arg) {
		if (this.getMethods('onBeforeShowPanel')) {
			this.executeMethod('onBeforeShowPanel', arg);
		}
		this._toggleNotification();
	}.observes('ltPropShowPanel'),

	dataObserver: function (arg) {
		var position = this.data.ltPropPosition;
		if (arg.insertedItems) {
			var notificationArr = this.data.notificationStackArr[arg.path];
			if (notificationArr.length) {
				var allChildren = $L(this.childComp).find('.lyteNotificationPopUpCenterWrapper')[0].children;

				for (let i = allChildren.length - 1; i >= 0; i--) {
					var currentNode = allChildren[i];
					if (position == 'bottomRight' || position == 'bottomLeft') {
						if (currentNode.getBoundingClientRect().top < currentNode.getBoundingClientRect().height) {
							$L(currentNode).addClass('lyteNotificationHidden')
						}
					}
					else {
						var nodeBottom = innerHeight - currentNode.getBoundingClientRect().bottom
						if (nodeBottom < currentNode.getBoundingClientRect().height) {
							$L(currentNode).addClass('lyteNotificationHidden');
						}
					}
				}
			}
			Lyte.arrayUtils(notificationArr, 'insertAt', arg.index, arg.insertedItems);
		}
		if (this.getMethods('onBeforeShow')) {
			this.executeMethod('onBeforeShow', arg.insertedItems);
		}
		setTimeout(() => {
			if (this.getData('ltPropData').length === 0) {
				Lyte.arrayUtils(data, "insertAt", 0, [[]]);

			}
		}, 0);
	}.observes('ltPropData', "ltPropData.*"),

	popUpObserver: function (arg) {
		var cancelDuration = this.data.ltPropDuration;
		var animationType = this.data.ltPropAnimation;
		var wrapperClass = this.data.ltPropWrapperClass;
		var messageDisplayPosition = this.data.ltPropPosition;
		var timeoutFlag = this.data.timeoutActive;
		var _this = this;

		setTimeout(function () {
			var element = $L('.lyteNotificationPopUpItem');
			if (arg.insertedItems && arg.type == 'deepChange' && element) {
				this.setData('timeoutActive', true);
				var parentEle = $L(_this.childComp).find('.lyteNotificationCenter');
				while (animationType !== '' && element[0]) {
					if (messageDisplayPosition == 'topRight') {
						parentEle[0].style.top = '30px';
						parentEle[0].style.right = '15px';
						parentEle.find('.lyteNotificationPopUpCenterWrapper')[0].style.flexDirection = 'column';
					}
					if (messageDisplayPosition == 'bottomRight') {
						parentEle[0].style.bottom = '30px';
						parentEle[0].style.right = '15px';
						parentEle.find('.lyteNotificationPopUpCenterWrapper')[0].style.flexDirection = 'column-reverse';
					}
					if (messageDisplayPosition == 'topLeft') {
						parentEle[0].style.top = '30px';
						parentEle[0].style.left = '15px';
						parentEle.find('.lyteNotificationPopUpCenterWrapper')[0].style.flexDirection = 'column';
					}
					if (messageDisplayPosition == 'bottomLeft') {
						parentEle[0].style.bottom = '30px';
						parentEle[0].style.left = '15px';
						parentEle.find('.lyteNotificationPopUpCenterWrapper')[0].style.flexDirection = 'column-reverse';
					}
					if (wrapperClass) {
						$L(element[0]).closest('.lyteNotificationCenter').addClass(wrapperClass);
					}
					if (animationType == 'fade') {
						element[0].style.opacity = '1';
						break;
					}
					else if (animationType == 'pop') {
						$L(element[0]).addClass('lyteNotificationPopUpItemActive');
						setTimeout(() => {
							$L(element[0]).removeClass('lyteNotificationPopUpItemActive');
							element[0].style.opacity = '1';
						}, 100);
						break;
					}
					else if (animationType == 'slideFromRight') {
						if (messageDisplayPosition == 'topLeft' || messageDisplayPosition == 'bottomLeft') {
							element[0].style.transform = 'translateX(-120%)'
							setTimeout(() => {
								element[0].style.opacity = '1';
								element[0].style.transform = 'translateX(0)'
							}, 100);
						}
						else {
							$L(element[0]).addClass('lyteNotificationSlideItemActive');
							setTimeout(() => {
								element[0].style.opacity = '1';
								$L(element[0]).removeClass('lyteNotificationSlideItemActive');
							}, 100);
						}
						break;
					}
				}

				if (cancelDuration && timeoutFlag) {
					var element = $L('.lyteNotificationPopUpItem');
					for (let i = 0; i < element.length; i++) {
						setTimeout(function () {
							element[i].style.opacity = '0';
							element[i].addEventListener('transitionend', function (event) {
								if (event.propertyName == 'opacity') {
									let removeNode = _this.data.notificationStackArr[arg.index]
									Lyte.arrayUtils(removeNode, 'removeAt', removeNode.length - 1);
								}
							})
						}, cancelDuration * 1000);
					}
				}
	
				if (_this.getMethods('onShow')) {
					_this.executeMethod('onShow', element, arg.insertedItems);
				}

			}
		}.bind(this), 0)
	}.observes('notificationStackArr', 'notificationStackArr.*'),

	_toggleNotification: function () {
		var data = this.getData('ltPropData');

		if (data.length) {
			var parentContainer = $L('.lyteNotificationParentContainer');
			parentContainer.addClass('lyteNotificationClosed');
			$L('.lyteNotificationbtnWrapper').addClass('lyteNotificationHideBtnWrapper');

			for (let i = 0; i < parentContainer.length; i++) {
				let currentParentContainer = parentContainer[i];
				let notificationElements = $L(currentParentContainer).find('.lyteNotificationCenterWrapper').children();
				var centerWrapper = $L(currentParentContainer).find('.lyteNotificationCenterWrapper')[0];
				var scaleArr = [];
				var scale = 1;
				var firstItemHeight = notificationElements[0].getBoundingClientRect().height;
				centerWrapper.style.height = firstItemHeight + 25 + 'px';

				for (let i = 0; i < notificationElements.length; i++) {
					scaleArr.push(Number(scale).toFixed(2));
					scale = scale - 0.04;
				}

				$L('.lyteNotificationCenterWrapper').addClass('showPanelActive');
				$L('.lyteNotificationCenterWrapper')[0].addEventListener('transitionend', function (event) {
					if (event.propertyName == 'transform') {
						$L('.lyteNotificationCenterWrapper').removeClass('showPanelActive');
					}
				})

				for (let j = 0; j < notificationElements.length; j++) {
					notificationElements[j].style.transform = 'translateX(0)';
					notificationElements[j].style.opacity = 'unset';
					notificationElements[j].style.position = 'absolute';
					if (j <= 2) {
						notificationElements[j].style.height = firstItemHeight + "px";
						notificationElements[j].style.transform = " translateY(" + (j * 8) + "px) scaleX(" + scaleArr[j] + ")";
						notificationElements[j].style.zIndex = notificationElements.length - j;
					}
					else {
						notificationElements[j].style.height = '0px';
					}

				}

				if (this.getMethods('onShowPanel')) {
					this.executeMethod('onShowPanel', currentParentContainer, notificationElements)
				}

			}
		}
	},

	_showLess: function () {
		var parentNode = $L('.lyteNotificationParentContainer');
		if (parentNode) {
			var openedNodes = $L('.lyteNotificationOpened').find('.lyteNotificationItem');
			var scaleArr = [];
			var scale = 1;

			for (let i = 0; i < openedNodes.length; i++) {
				scaleArr.push(Number(scale).toFixed(2));
				scale = scale - 0.04;
			}

			var calculatePositionPromise = new Promise((resolve, reject) => {
				var openedNodes = $L('.lyteNotificationOpened').find('.lyteNotificationItem');
				try {
					$L(openedNodes).css('transition', 'unset');
					$L(openedNodes).css('transform', 'unset');
					var topValues = [];

					for (let i = 0; i < openedNodes.length; i++) {
						topValues.push(openedNodes[i].offsetTop);
					}

					for (let i = 0; i < openedNodes.length; i++) {
						openedNodes[i].style.position = 'absolute';
						openedNodes[i].style.top = topValues[i] + "px";
						openedNodes[i].style.width = '100%';
					}
					resolve();
				} catch (error) {
					reject(error);
				}
			});
			calculatePositionPromise.then(() => {
				var openedNodes = $L('.lyteNotificationOpened');
				for (let i = 0; i < openedNodes.length; i++) {
					var openedNodesEle = $L(openedNodes[i]).find('.lyteNotificationItem');
					var firstItemHeight = openedNodesEle[0].getBoundingClientRect().height;
					$L(openedNodesEle).css('transform', '');
					$L(openedNodesEle).css('transition', '0.3s');
					$L(openedNodesEle).css('top', '0px');
					$L(openedNodes[i]).find('.lyteNotificationbtnWrapper').addClass('lyteNotificationHideBtnWrapper');
					for (let i = 0; i < openedNodesEle.length; i++) {
						openedNodesEle[i].style.height = firstItemHeight + "px";
						if (i <= 2) {
							openedNodesEle[i].style.transform = "translateY(" + (i * 8) + "px) scaleX(" + scaleArr[i] + ")";
							openedNodesEle[i].style.zIndex = openedNodesEle.length - i;
						}
						else {
							openedNodesEle[i].style.height = '0px';
						}
					}
					openedNodes[i].style.height = firstItemHeight + 20 + 'px';
					$L(openedNodes[i]).removeClass('lyteNotificationOpened');
					$L(openedNodes[i]).addClass('lyteNotificationClosed');
				}
			}).catch((error) => {
				console.error('An error occurred: ', error);
			});
		}
	},

	didDestroy: function () {
		if (this.childComp) {
			this.childComp.remove()
			delete this.childComp
		}
		this.setData('ltPropShow', false)
		this.setData('ltPropBindToBody', false),
			this.setData('ltPropShowWormhole', false);
	}

});