; Lyte.Mixin.register("lyte-advanced-breadcrumb", {

	compRender: function () {
		if (this.getData('ltPropType') == "advanced") {
			this.refreshBreadcrumbSize();
			this.$node.refreshBreadcrumbSize = this.refreshBreadcrumbSize.bind(this);
			this.advEventFunctions = this.refreshBreadcrumbSize.bind(this);
			window.addEventListener('resize', this.advEventFunctions);
			window.addEventListener('orientationchange', this.advEventFunctions);
		}
	}.on('didConnect'),

	refreshBreadcrumbSize: function () {

		if (this.getData('ltPropType') == "advanced") {

			clearTimeout(this._stepresize);
			this._stepresize = setTimeout(function () {

				var data = this.getData('ltPropData');

				this.setData('advMiddleButtonShow', true);
				this.setData('advContent', { first: [], middle: [], last: data });//added to last becasue in css margin-right for last elem in last is set to 0

				var $node = this.$node,
					items = $L('lyte-breadcrumb-item', $node),
					elemDim = { left: $node.offsetLeft, right: $node.offsetLeft + $node.offsetWidth },
					totalWidth = (elemDim.right <= 0 || elemDim.left >= window.innerWidth) ? 0 : Math.min(window.innerWidth, elemDim.right) - Math.max(0, elemDim.left),
					buttonWidth = $node.querySelector('.lyteBreadcrumbCollapseShowElem').offsetWidth,
					len = data.length,
					hide = false,
					retData = { first: [], middle: [], last: [] },
					middleFirst = [],
					middleLast = [],
					criticalList = { first: 0, last: 0 },
					allow = 1;

				for (var i = 0, j = len - 1; i <= j; i++, j--) {
					var first = items.get(i),
						last = (i != j) && items.get(j),
						override = i < allow;

					if (!hide) {
						var style1 = getComputedStyle(first),
							elem1 = first.offsetWidth + parseFloat(style1.marginLeft) + parseFloat(style1.marginRight),
							style2 = last && getComputedStyle(last),
							elem2 = last ? last.offsetWidth + parseFloat(style2.marginLeft) + parseFloat(style2.marginRight) : 0,
							bothWidth = elem1 + elem2,
							balanceWidth = totalWidth - (elem1 + elem2);

						if (balanceWidth < 0 && !override) {
							for (var k = 0, l = 0; ; k++, l++) {
								var cond = true;
								if (k < criticalList.first) {
									middleFirst.push(retData.first.pop());
									cond = false;
								}
								if (l < criticalList.last) {
									middleLast.unshift(retData.last.pop());
									cond = false;
								}
								if (cond) {
									break;
								}
							}
							hide = true;
						} else {
							if (balanceWidth < buttonWidth && !override) {//adding which item should be hidden, when shrink button is needed
								criticalList.first++;
								last && criticalList.last++;
							}
							retData.first.push(data[i]);
							last && retData.last.push(data[j]);
							totalWidth -= bothWidth;
						}
					}
					hide && (middleFirst.push(data[i]), last && middleLast.unshift(data[j]));
				}
				retData.middle = middleFirst.concat(middleLast);
				retData.last.reverse();
				this.setData('advMiddleButtonShow', !!retData.middle.length);
				this.setData('advContent', retData);

			}.bind(this), 0);
		}
	}
});