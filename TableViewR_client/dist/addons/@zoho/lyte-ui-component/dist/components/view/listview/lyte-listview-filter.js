Lyte.Component.register("lyte-listview-filter", {
_template:"<template tag-name=\"lyte-listview-filter\"> <div class=\"lyteListViewFilterWrapper\"> <div class=\"lyteListViewFilters\" lt-prop-node=\"{{lbind(some)}}\" onkeydown=\"{{action('keyDownOnFilter',this,event)}}\"> <template is=\"for\" items=\"{{ltPropSearchContent}}\" item=\"item\" index=\"index\"> <div class=\"lyteFilterSearchWrap\" index=\"{{index}}\"> <span class=\"lyteInputFilterLabel\">{{item.name}}</span> <template is=\"if\" value=\"{{item.column}}\"><template case=\"true\"> <span class=\"lyteFilterColumnName\" oninput=\"{{action('spanInputChange',this)}}\" onfocus=\"{{action('setFocusedElem',this)}}\" onblur=\"{{action('onFilterBlur',this)}}\"> {{item.column}} </span> </template></template> <template is=\"if\" value=\"{{item.condition}}\"><template case=\"true\"> <span class=\"lyteFilterCondition\" oninput=\"{{action('spanInputChange',this)}}\" onfocus=\"{{action('setFocusedElem',this)}}\" onblur=\"{{action('onFilterBlur',this)}}\"> {{item.condition}} </span> </template></template> <template is=\"if\" value=\"{{item.conditionValue}}\"><template case=\"true\"> <span class=\"lyteFilterConditionValue\" onfocus=\"{{action('setFocusedElem',this)}}\" onblur=\"{{action('onFilterBlur',this)}}\"> {{item.conditionValue}} </span> </template><template case=\"false\"><template is=\"if\" value=\"{{shouldRenderInput(item)}}\"><template case=\"true\"> <template value=\"{{getType(item)}}\" is=\"switch\"> <template case=\"text\"> <lyte-input lt-prop-appearance=\"box\" lt-prop-update-delay=\"\" class=\"lyteTextFilterElement lyteInputFilterName\" lt-prop-value=\"{{lbind(customValue)}}\" onblur=\"{{action('onFilterBlur',this)}}\"></lyte-input> </template> <template case=\"number\"> <lyte-number lt-prop-appearance=\"box\" lt-prop-update-delay=\"\" class=\"lyteNumberFilterElement lyteInputFilterName\" lt-prop-value=\"{{lbind(customValue)}}\" onblur=\"{{action('onFilterBlur',this)}}\"></lyte-number> </template> <template case=\"date\"> <lyte-datetime-input lt-prop-appearance=\"box\" class=\"lyteDateFilterElement lyteInputFilterName\" lt-prop-dropdown=\"true\" lt-prop-value=\"{{lbind(customValue)}}\" onblur=\"{{action('onFilterBlur',this)}}\" on-calendar-close=\"{{method('onFilterBlur',this,true)}}\"> </lyte-datetime-input> </template> <template case=\"dateTime\"> <lyte-datetime-input lt-prop-appearance=\"box\" class=\"lyteDateTimeFilterElement lyteInputFilterName\" lt-prop-dropdown=\"true\" lt-prop-value=\"{{lbind(customValue)}}\" onblur=\"{{action('onFilterBlur',this)}}\"> </lyte-datetime-input> </template> <template case=\"Date\"> <lyte-input lt-prop-type=\"date\" lt-prop-appearance=\"box\" lt-prop-update-delay=\"\" class=\"lyteDateFilterElement lyteInputFilterName\" lt-prop-value=\"{{lbind(customValue)}}\" onblur=\"{{action('onFilterBlur',this)}}\" on-calendar-close=\"{{method('onFilterBlur',this,true)}}\"></lyte-input> </template> <template case=\"time\"> <lyte-time-picker lt-prop-inline=\"false\" class=\"lyteTimeFilterElement lyteInputFilterName\" lt-prop-value=\"{{lbind(customValue)}}\" lt-prop-time-format=\"{{ltPropTimeFormat}}\" lt-prop-aria-attributes=\"{&quot;input&quot;:&quot;Time Picker&quot;}\" lt-prop-id=\"time\" lt-prop-class=\"time\" lt-prop-name=\"time\" on-close=\"{{method('onFilterBlur',this)}}\"></lyte-time-picker> </template> <template case=\"boolean\"> <lyte-dropdown class=\"lyteBooleanFilterElement lyteInputFilterName\" lt-prop-selected=\"{{lbind(customValue)}}\" lt-prop-is-open=\"{{lbind(isOpen)}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-drop-box class=\"lyteEditElementDropdown\"> <lyte-drop-body> <lyte-drop-item data-value=\"true\">True</lyte-drop-item> <lyte-drop-item data-value=\"false\">False</lyte-drop-item> </lyte-drop-body> </lyte-drop-box> </template> </lyte-dropdown> </template> <template case=\"multiselect\"> <lyte-dropdown class=\"lyteMultiselectFilterElement lyteInputFilterName\" lt-prop-selected=\"{{lbind(customValue)}}\" lt-prop-is-open=\"{{lbind(isOpen)}}\" on-option-selected=\"{{method('dropSelected')}}\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-drop-button> <span class=\"lyteMarginRight lyteDropdownLabel\">{{displayValue}}</span> </lyte-drop-button> <lyte-drop-box class=\"lyteEditElementDropdown\"> <template is=\"if\" value=\"{{expHandlers(ltPropOptions.length,'>',8)}}\"><template case=\"true\"> <lyte-drop-head> <lyte-search lt-prop-placeholder=\"Search here...\" lt-prop-query-selector=\"{&quot;scope&quot; : &quot;.lyteEditElementDropdown:not(.lyteDropdownHidden)&quot;,&quot;search&quot; : &quot;lyte-drop-item&quot;}\" on-search=\"{{method('search')}}\"></lyte-search> </lyte-drop-head> </template></template> <lyte-drop-body> <template is=\"for\" items=\"{{ltPropOptions}}\" item=\"item\" index=\"index\"> <lyte-drop-item data-label=\"{{item.label}}\" data-value=\"{{item.value}}\"> <lyte-drop-label>{{item.label}}</lyte-drop-label> <template is=\"if\" value=\"{{item.email}}\"><template case=\"true\"> <lyte-drop-email>{{item.email}}</lyte-drop-email> </template></template> </lyte-drop-item> </template> </lyte-drop-body> <lyte-drop-footer class=\"{{noResult}}\">{{ltPropNoResult}}</lyte-drop-footer> </lyte-drop-box> </template> </lyte-dropdown> </template> <template case=\"custom\"> <lyte-yield yield-name=\"lyte-custom-edit-yield\" lt-prop-cell-data=\"{{ltPropCellData}}\" lt-prop-row-data=\"{{ltPropRowData}}\" lt-prop-value=\"{{lbind(ltPropValue)}}\"></lyte-yield> </template> <template default=\"\"> <lyte-input lt-prop-appearance=\"box\" lt-prop-update-delay=\"\" class=\"lyteDefaultFilterElement lyteInputFilterName\" lt-prop-class=\"lyteInputFilterName\" onfocus=\"{{action('setFocusedElem',this)}}\" onblur=\"{{action('onFilterBlur',this)}}\" oninput=\"{{action('onInputChange',this,index)}}\"></lyte-input>  </template> </template> </template></template></template></template> <span class=\"lyteListViewFilterClearIcon\" onclick=\"{{action('removeFilter',this)}}\"></span> </div> </template> <input class=\"lyteListViewFilterInput\" placeholder=\"{{inputPlaceHolder}}\" onfocus=\"{{action('setFocusedElem',this)}}\" onblur=\"{{action('onFilterBlur',this)}}\" oninput=\"{{action('inputChange',this)}}\" value=\"{{lbind(inputValue)}}\">  </div> <div class=\"lyteListViewDropdown lyteListViewDropdownHidden\"> <ul class=\"lyteListViewDropdownUl\" onmouseover=\"{{action('listHover',event,this)}}\"> <template is=\"for\" items=\"{{renderContent}}\" item=\"item\" index=\"index\"> <template is=\"if\" value=\"{{expHandlers(index,'==',0)}}\"><template case=\"true\"> <li class=\"lyteListViewDropdownLi lyteListViewDropdownHighlighted\" row=\"{{index}}\">{{item}}</li> </template><template case=\"false\"> <li class=\"lyteListViewDropdownLi\" row=\"{{index}}\">{{item}}</li> </template></template> </template> <template is=\"if\" value=\"{{noResultMessage}}\"><template case=\"true\"> <li class=\"lyteNoResultMessage\">No Match Found</li> </template></template> </ul> </div> </div> <lyte-icon class=\"lyteAccordionC\"></lyte-icon> </template>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}]}},"default":{}},{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}]}},"default":{}},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"switch","position":[1],"cases":{"text":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"number":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"date":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"dateTime":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"Date":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"time":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},"boolean":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"componentDynamic","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,3]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]},"multiselect":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1]},{"type":"if","position":[3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3,3,1]},{"type":"for","position":[3,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3,3]},{"type":"attr","position":[3,5]},{"type":"text","position":[3,5,0]},{"type":"componentDynamic","position":[3,5]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[1]}]},"custom":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]}},"default":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,9]}]},{"type":"attr","position":[1,1,3]},{"type":"attr","position":[1,3,1]},{"type":"attr","position":[1,3,1,1]},{"type":"for","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}}]},{"type":"attr","position":[1,3,1,3]},{"type":"if","position":[1,3,1,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"componentDynamic","position":[3]}],
_observedAttributes :["ltPropHeader","ltPropContent","ltPropRenderContent","ltPropFilteredContent","ltPropGroupedRow","ltPropCondition","ltPropPlaceHolder","ltPropTriggerEvent","ltPropNavigator","ltPropFilterContent","ltPropFormat","heading","inputPlaceHolder","ltPropSearchContent","renderContent","currentContent","currentFilterCount","focusedElem","showInput","containsSortBy","containsGroupBy","containsContains","conditions","curDate","inputValue","hideInput","ltPropFilterGrouped","sortBy","filterBy","textFilter","numberFilter","booleanFilter","dateFilter","timeFilter","dateTimeFilter","multiselectFilter","noResultMessage","headingsRemoved","ltPropPrevGroupIndex","headerMap","renderCustom","customValue"],

	data: function () {
		return {
			ltPropHeader: Lyte.attr('array', { default: [] }),
			ltPropContent: Lyte.attr('array', { default: [] }),
			ltPropRenderContent: Lyte.attr('array', { default: [] }),
			ltPropFilteredContent: Lyte.attr('array', { default: [] }),
			ltPropGroupedRow: Lyte.attr('boolean'),
			ltPropCondition: Lyte.attr('object', { default: {}, watch: true }),
			ltPropPlaceHolder : Lyte.attr( 'string' , { default: 'Filters' } ),
			ltPropTriggerEvent : Lyte.attr( 'boolean'),
			ltPropNavigator : Lyte.attr( 'boolean' , { default : false } ),
			ltPropFilterContent: Lyte.attr('array'),
			ltPropFormat : Lyte.attr( 'string' ),

			heading: Lyte.attr('array', { default: [] }),
			inputPlaceHolder: Lyte.attr('string', { default: "Filters" }),

			ltPropSearchContent: Lyte.attr('array', { watch: true, default: [] }),
			renderContent: Lyte.attr('array', { default: [] }),
			currentContent: Lyte.attr('array', { default: [] }),
			currentFilterCount: Lyte.attr('number', { default: 0 }),
			focusedElem: Lyte.attr('object', { default: undefined }),
			showInput: Lyte.attr('boolean', { default: true }),
			containsSortBy: Lyte.attr('boolean', { default: false }),
			containsGroupBy: Lyte.attr('boolean', { default: false }),
			containsContains : Lyte.attr('boolean', { default : false } ),
			conditions: Lyte.attr('object', { default: [] }),
			curDate: Lyte.attr('string', { default: '' }),

			inputValue: Lyte.attr('string', { default: "" }),
			hideInput: Lyte.attr('boolean', { default: false }),
			ltPropFilterGrouped: Lyte.attr('boolean', { default: false }),
			sortBy: Lyte.attr('array', {
				default: [
					_lyteUiUtils.i18n('ascending', 'listview.filter', 'Ascending'),
					_lyteUiUtils.i18n('descending', 'listview.filter', 'Descending')]
			}),
			filterBy: Lyte.attr('array', { default: ["= Equal to", "< Less than", "> Greater than", "= Not Equal to"] }),

			textFilter: Lyte.attr('array', {
				default: [
					_lyteUiUtils.i18n('equal.to', 'listview.filter', 'Equal to'),
					_lyteUiUtils.i18n('not.equal.to', 'listview.filter', 'Not equal to'),
					_lyteUiUtils.i18n('starts.with', 'listview.filter', 'Starts with'),
					_lyteUiUtils.i18n('contains', 'listview.filter', 'Contains'),
					_lyteUiUtils.i18n('does.not.contains', 'listview.filter', 'Does not contains')]
			}),
			numberFilter: Lyte.attr('array', {
				default: [
					_lyteUiUtils.i18n("less.than", 'listview.filter', 'Less than'),
					_lyteUiUtils.i18n("greater.than", 'listview.filter', "Greater than"),
					_lyteUiUtils.i18n("less.than.or.equal.to", 'listview.filter', "Less than or equal to"),
					_lyteUiUtils.i18n("greater.than.or.equal.to", "listview.filter", "Greater than or equal to"),
					_lyteUiUtils.i18n("is.empty", "listview.filter", "Is empty"),
					_lyteUiUtils.i18n("is.not.empty", "listview.filter", "Is not empty")]
			}),
			booleanFilter: Lyte.attr('array', {
				default: [
					_lyteUiUtils.i18n("selected", "listview.filter", "Selected"),
					_lyteUiUtils.i18n("not.selected", "listview.filter", "Not selected")
				]
			}),
			dateFilter: Lyte.attr('array', {
				default: [
					_lyteUiUtils.i18n("today", 'listview.filter', 'Today'),
					_lyteUiUtils.i18n("till.yesterday", 'listview.filter', "Till yesterday"),
					_lyteUiUtils.i18n("unscheduled", 'listview.filter', "Unscheduled"),
					_lyteUiUtils.i18n("yesterday", 'listview.filter', 'Yesterday'),
					_lyteUiUtils.i18n("tomorrow", 'listview.filter', 'Tomorrow'),
					_lyteUiUtils.i18n("next.7.days", 'listview.filter', 'Next 7 days'),
					_lyteUiUtils.i18n("this.week", "listview.filter", 'This week'),
					_lyteUiUtils.i18n("this.month", 'listview.filter', 'This month'),
					_lyteUiUtils.i18n("is", 'listview.filter', 'Is'),
					_lyteUiUtils.i18n("is.not", 'listview.filter', "Is not"),
					_lyteUiUtils.i18n("less.than", 'listview.filter', "Less than"),
					_lyteUiUtils.i18n("greater.than", 'listview.filter', "Greater than"),
					_lyteUiUtils.i18n("less.than.or.equal", 'listview.filter', "Less than or equal"),
					_lyteUiUtils.i18n("greater.than.or.equal", 'listview.filter', "Greater than or equal"),
					_lyteUiUtils.i18n("is.empty", 'listview.filter', "Is empty"),
					_lyteUiUtils.i18n("is.not.empty", 'listview.filter', "Is not empty")]
			}),
			timeFilter : Lyte.attr( 'array', {
				default : [
					_lyteUiUtils.i18n( 'equal', 'listview.filter', "Equals to" ),
					_lyteUiUtils.i18n( 'not.equal', 'listview.filter', "Not equals to" ),
					_lyteUiUtils.i18n( "less.than", "listview.filter", "Less than" ),
					_lyteUiUtils.i18n( "greater.than", "listview.filter", "Greater than" ),
					_lyteUiUtils.i18n( "less.than.or.equal", "listview.filter", "Less than or equal" ),
					_lyteUiUtils.i18n( "greater.than.or.equal", "listview.filter", "Greater than or equal" ),
					_lyteUiUtils.i18n( 'is.empty', 'listview.filter', "Is empty" ),
					_lyteUiUtils.i18n( 'is.not.empty', 'listview.filter', "Is not empty" )
				]
			} ),
			dateTimeFilter : Lyte.attr('array', {
				default : [
					_lyteUiUtils.i18n( 'today', 'listview.filter', "Today" ),
					_lyteUiUtils.i18n( 'till.yesterday', 'listview.filter', "Till yesterday" ),
					_lyteUiUtils.i18n( 'unscheduled', 'listview.filter', "Unscheduled" ),
					_lyteUiUtils.i18n( 'yesterday', 'listview.filter', "Yesterday" ),
					_lyteUiUtils.i18n( 'tomorrow', 'listview.filter', "Tomorrow" ),
					_lyteUiUtils.i18n( 'next.7.days', 'listview.filter', "Next 7 days" ),
					_lyteUiUtils.i18n( 'this.week', 'listview.filter', "This week" ),
					_lyteUiUtils.i18n( 'this.month', 'listview.filter', "This month" ),
					_lyteUiUtils.i18n( 'last.week', 'listview.filter', "Last week" ),
					_lyteUiUtils.i18n( 'last.month', 'listview.filter', "Last month" ),
					_lyteUiUtils.i18n( 'is', 'listview.filter', "Is" ),
					_lyteUiUtils.i18n( 'not.is', 'listview.filter', "Is not" ),
					_lyteUiUtils.i18n( 'less.than', 'listview.filter', "Less than" ),
					_lyteUiUtils.i18n( 'greater.than', 'listview.filter', "Greater than" ),
					_lyteUiUtils.i18n( "less.than.or.equal", "listview.filter", "Less than or equal" ),
					_lyteUiUtils.i18n( "greater.than.or.equal", "listview.filter", "Greater than or equal" ),
					_lyteUiUtils.i18n( "is.empty", "listview.filter", "Is empty" ),
					_lyteUiUtils.i18n( "is.not.empty", "listview.filter", "Is not empty" )
				]
			}),
			multiselectFilter: Lyte.attr('array', { default: [] }),
			noResultMessage: Lyte.attr('boolean', { default: false }),
			headingsRemoved: Lyte.attr('array' , { default : [] } ),
			ltPropPrevGroupIndex : Lyte.attr( 'object' , { default : {} } ),
			headerMap : Lyte.attr( 'object', { default : {} } ),
			renderCustom : Lyte.attr( 'string', { default : "" } ),
			customValue : Lyte.attr( 'string', { default : "" } )

		}
	},

	init: function () {
		let headerContent = this.data.ltPropHeader, final = [], condition_obj = {}, isMultiple = this.data.ltPropMultipleFilter;

		// creating a heading array for filter and creating the structure of condition based on prop.
		headerContent.forEach(function (item) {
			let _item = item;
			item.children.forEach(function (rows) {
				if (rows.prop != "") {
					final.push(rows.name);
					condition_obj[rows.prop] = isMultiple ? [] : {};
				}
			});
		})

		this.setData('ltPropCondition', condition_obj);
		this.setData('heading', final);
		this.setData('containsGroupBy' , this.data.ltPropGroupedRow );
		this.data.DateFilter = this.data.dateFilter.slice();
	},

	didConnect: function () {
		this._editDiv = $L(this.$node).find('.lyteListViewFilters')[0];
		this._input = $L(this.$node).find('.lyteListViewFilterInput')[0];
		this._dropDown = $L(this.$node).find('.lyteListViewDropdown')[0];
		this.setData('renderContent', this.data.ltPropFilterContent);
		this.setData('currentContent', this.data.ltPropFilterContent);

		let obj = {}
		this.data.ltPropHeader.forEach( function( item ){
			item.children.forEach( function(child){
				obj[ child.name ] = child.prop;
			} )
		} );
		this.setData( 'headerMap' , obj );

		setTimeout( function(){
			if(this.data.ltPropSearchContent.length != 0 ){
				this.insertCondition( this.data.ltPropSearchContent );
			}
		}.bind(this), 0 );

		this.$node.updateConditions = function(condition){
			this.insertCondition( condition );
		}.bind(this);
		
	},

	cond_obs: function () {

		// calling the filter function from list-view comp 
		var cb = "onConditionChange";

		if (this.getMethods(cb)) {
			clearTimeout(this.__timeout);
			this.__timeout = setTimeout(function () {
				this.executeMethod(cb, this.data.ltPropCondition, false, this.$node);
			}.bind(this), 0);
		}
	}.observes('ltPropCondition.*'),

	trigger_obs : function ( ){
		if( this.data.ltPropTriggerEvent ){
			this.updateConditions();
		}
	}.observes('ltPropTriggerEvent'),

	actions: {
		// Functions for event handling

		focusInput: function (_this) {
			this._input.focus();
			this._dropDown.classList.remove('lyteListViewDropdownHidden');
		},

		closeDropDown: function () {
			// this._dropDown.classList.add('lyteListViewDropdownHidden');
		},

		inputChange: function (_this) {
			// change the dropdown down content based on the input (default input tag)
			var value = _this.value.toLowerCase()
			if (document.activeElement.classList.contains('lyteListViewFilterInput')) {
				var filteredData = this.filterData(this.data.currentContent, value);
				this.setData('renderContent', filteredData);
			}
		},

		onInputChange: function (_this, index) {
			//( for input tag inside filter div )
			let currentContent = this.data.currentContent;
			if (_this.type != 'date' && currentContent) {
				let renderContent = this.filterData(currentContent, _this.component.data.ltPropValue.toLowerCase());
				this.setData('renderContent', renderContent);
			}
		},

		keyDownOnFilter: function (_this, event) {
			let keyCode = event.keyCode,
				target = event.target,
				activeElement = document.activeElement,
				data = this.data,
				highlightClass = "lyteListViewDropdownHighlighted";

			if (keyCode != undefined) {
				switch (keyCode) {
					case 13: // ENTER
						var filterIndex = data.currentFilterCount == void 0 ? this.getIndex(target) : data.currentFilterCount;
						this.processSelection(filterIndex, event);
						break;
					case 40: // DOWN ARROW
						event.preventDefault();
						if (data.renderContent.length != 0) {
							let currentHighlight = $L(this._dropDown).find("." + highlightClass),
								nextElement = currentHighlight[0].nextElementSibling;
							currentHighlight[0].classList.remove(highlightClass);
							if (nextElement) {
								nextElement.classList.add(highlightClass)
							} else {
								this._dropDown.children[0].children[0].classList.add(highlightClass);
							}
						}
						break;
					case 38: // UP ARROW
						event.preventDefault();
						if (data.renderContent.length != 0) {
							let currentHighlight = $L(this._dropDown).find(".lyteListViewDropdownHighlighted"),
								prevElement = currentHighlight[0].previousElementSibling;
							currentHighlight[0].classList.remove('lyteListViewDropdownHighlighted');
							if (prevElement) {
								prevElement.classList.add('lyteListViewDropdownHighlighted')
							} else {
								this._dropDown.children[0].lastElementChild.classList.add('lyteListViewDropdownHighlighted');
							}
						}
						break;
					case 37: // LEFT ARROW

						activeElement = this.data.focusedElem || document.activeElement;
						var searchContent = this.data.ltPropSearchContent,
							index, prevElement;

						if (this._editDiv.contains(activeElement)) {
							if (activeElement.classList.contains('lyteListViewFilterInput')) {
								event.preventDefault();
								index = searchContent.length - 1;
								var	element = this.getElement(index, Object.keys(searchContent[index]).length - 1);
								if (element.classList.contains('lyteFilterCondition')) {
									this.conditionClick(element);
								} else if (element.classList.contains('lyteFilterConditionValue')) {
									this.conditionValueClick(element);
								}
								this.focus(index, void 0, Object.keys(searchContent[index]).length - 1);
								this.cursorAtEndOfNode(element);
							} else {
								let selection, offset, textNode;

								if (activeElement.classList.contains('lyteInputFilterName')) {
									index = this.getIndex(activeElement),
										prevElement = this.getElement(index, Object.keys(searchContent[index]).length - 1);
									offset = 0;
								} else {
									prevElement = activeElement.previousElementSibling;
									index = this.getIndex(activeElement);

									selection = window.getSelection();
									offset = selection.baseOffset;
									textNode = selection.baseNode;
								}


								//change the prev element to the prior filter if the cur node is the label element
								if ((!prevElement || prevElement.classList.contains("lyteInputFilterLabel")) && offset == 0) {
									if (index > 0) {
										--index;
										prevElement = this.getElement(index, Object.keys(searchContent[index]).length - 1);

									}
								}

								if (prevElement && offset == 0) {
									event.preventDefault();
									let className = prevElement.classList[0];
									switch (className) {
										case 'lyteInputFilterLabel':

											break;
										case 'lyteFilterColumnName':
											this.columnNameClick(prevElement);
											break;
										case 'lyteFilterCondition':
											this.conditionClick(prevElement);
											break;
										case 'lyteFilterConditionValue':
											this.conditionValueClick(prevElement);
											break;

									}
									this.cursorAtEndOfNode(prevElement);
								}

							}
						}
						break;

					case 39: // RIGHT ARROW
						activeElement = this.data.focusedElem || document.activeElement;
						var searchContent = this.data.ltPropSearchContent,
							index, nextElement,
							filterLength = searchContent.length;

						if (this._editDiv.contains(activeElement)) {
							if (activeElement.classList.contains('lyteListViewFilterInput')) {
								event.preventDefault();
								index = searchContent.length - 1;

								this.focus(index, void 0, Object.keys(searchContent[index].length - 1));
							} else {
								index = this.getIndex(activeElement);
								nextElement = activeElement.nextElementSibling;
								let selection = window.getSelection(),
									offset = selection.baseOffset,
									textNode = selection.baseNode;

								if (!nextElement && offset == textNode.length) {
									if (index != filterLength - 1) {
										index++;
										let objectKeys = Object.keys(searchContent[index]).length;
										nextElement = objectKeys >= 2 ? this.getElement(index, 1) : undefined;
									}
								}

								if (nextElement && offset == textNode.length) {
									event.preventDefault();
									let className = nextElement.classList[0];
									switch (className) {
										case 'lyteInputFilterLabel':

											break;
										case 'lyteFilterColumnName':
											this.columnNameClick(nextElement);
											break;
										case 'lyteFilterCondition':
											this.conditionClick(nextElement);
											break;
										case 'lyteFilterConditionValue':
											this.conditionValueClick(nextElement);
											break;
									}
								}

							}
						}


				}
			}
		},

		removeFilter: function (_this) {
			let index = this.getIndex(_this),
				content = this.data.ltPropSearchContent,
				cur = content[index];

			if (cur.name) {
				if (cur.name == 'Sort by') {
					this.setData('containsSortBy', false);
					// this.setData('containsGroupBy' , this.data.ltPropGroupedRow );
					let ret = cur.column ? this.getIndexOfHeader(cur) : {};
					if (ret.columnIndex) {
						Lyte.objectUtils(this.getData('ltPropHeader')[ret.columnIndex].children[ret.rowIndex], 'add', "sortStatus", "");
						// this.throwEvent('sort', this.data.heading.indexOf(cur.column), true);
					}
				}else if ( cur.name == 'Group by' ){
					this.data.containsGroupBy = false;
				}else if( cur.name == 'Contains' ){
					this.setData('containsContains', false);
					this.setData( 'ltPropSearchValue', '' );
				}
			}

			Lyte.arrayUtils(this.data.ltPropSearchContent, 'removeAt', index, 1);
			this.updateConditions(this.data.ltPropSearchContent , false , true);
			this.setFilterContent();
			if( this.data.ltPropSearchContent.length == 0 ){
				this.setData('inputPlaceHolder', this.data.ltPropPlaceHolder);
			}
		},

		spanInputChange: function (_this) {
			let renderContent = this.filterData(this.data.currentContent, _this.innerText.replaceAll(' ', ' ').toLowerCase());
			this.setData('renderContent', renderContent);
		},

		setFocusedElem: function (_this) {
			this.setData('focusedElem', _this); let index = this.getIndex(_this);
			if (!isNaN(index)) {
				this.setData('currentFilterCount', index)
			}else {
				this.setData('currentFilterCount', undefined);
			}
		},

		onFilterBlur: function (_this, focus) {
			
			this.onFilterBlur( _this, focus );
			// if( this.data.focusedElem == _this ){
			// 	this.setData( 'focusedElem' , undefined );
			// }
		},

		listHover: function (evt, _this) {
			var highlight = "lyteListViewDropdownHighlighted",
				currentHighlight = $L(this._dropDown).find("." + highlight),
				target = evt.target;

			if (target.classList.contains('lyteListViewDropdownLi')) {
				currentHighlight[0].classList.remove(highlight);
				target.classList.add(highlight);
			}
		}

	},
	methods: {
		// Functions which can be used as callback in the component
		onFilterBlur : function(_this, focus){
			this.onFilterBlur( _this, focus);
		}
	},

	onFilterBlur : function(_this, focus){
		_this.setAttribute('contenteditable', false);
		let index,
		searchContent = this.data.ltPropSearchContent,
		customVal = this.data.customValue,
		curContent;

		if (_this.classList.contains("lyteInputFilterName")) {
			if (_this.type === "date" && _this.value) {
				index = this.getIndex(_this);
				curContent = searchContent[index];

				Lyte.objectUtils(curContent,'add', 'conditionValue', _this.value);
				Lyte.arrayUtils(searchContent, 'replaceAt', index, curContent);
			}else if( _this.classList.contains( 'lyteDateFilterElement' ) && customVal ){
				index = this.getIndex(_this);
				curContent = searchContent[index];
				Lyte.objectUtils(curContent,'add', 'conditionValue', this.data.customValue);

				Lyte.arrayUtils(searchContent, 'replaceAt', index, curContent);
				
			}else if( _this.classList.contains( 'lyteTimeFilterElement' ) && customVal){
				index = this.getIndex(_this);
				curContent = searchContent[index];
				Lyte.objectUtils(curContent,'add', 'conditionValue', this.data.customValue);

				Lyte.arrayUtils(searchContent, 'replaceAt', index, curContent);
			
			}else if( _this.classList.contains( 'lytedateTimeFilterElement' ) && customVal){
				index = this.getIndex(_this);
				curContent = searchContent[index];
				Lyte.objectUtils(curContent,'add', 'conditionValue', this.data.customValue);
				Lyte.arrayUtils(searchContent, 'replaceAt', index, curContent);
			}
		}

		this.setData("renderCustom", "");
		this.setData("customValue", "");


		if(focus){
			this._input.focus();
			this.updateConditions(this.data.ltPropContent , true);
		}
	},

	processSelection: function (filterIndex, event) {
		// var filterIndex = this.getIndex( target ) , 
		var data = this.data,
			searchContent = data.ltPropSearchContent,
			currentCount = data.currentFilterCount || searchContent.length - 1,
			content = searchContent[filterIndex] || searchContent[currentCount],
			currentHighlight = $L(this._dropDown).find(".lyteListViewDropdownHighlighted")[0],
			isFullySpecified = currentCount >= 0 ? this.isFilterFullySpecified(this.data.ltPropSearchContent[currentCount], true) : false,
			target = event ? event.target : undefined,
			focused = this.data.focusedElem,
			currentHighlight = currentHighlight != undefined ? currentHighlight.innerText : undefined;
		var isParentInput , isFilterInput , isColumnSpan , isConditionSpan , isConditionValueSpan;

		if (focused) {
			let classList = focused.classList;

			if (classList.contains('lyteInputFilterName')) {
				isFilterInput = true;
			} else if (classList.contains('lyteFilterCondition')) {
				isConditionSpan = true;
			} else if (classList.contains('lyteFilterConditionValue')) {
				isConditionValueSpan = true;
			} else if (classList.contains('lyteFilterColumnName')) {
				isColumnSpan = true;
			} else if (classList.contains('lyteListViewFilterInput')) {
				isFullySpecified ? null : filterIndex++;
				isParentInput = true;
			}

		}
		if (isFilterInput || (((event && target.classList.contains('lyteInputFilterName'))) && !isFullySpecified)) {
			let isDate = false;
			let dataType, isCustomType;

			if (content.hasOwnProperty('condition') && event) {
				if (target.type === 'date') { isDate = true; }
				content.conditionValue = target.value;
				this.setData('showInput', false);
				this.setFilterContent();
			} else if (content.hasOwnProperty('column')) {
				//for inserting the condition
				if (data.renderContent.length != 0) {
					content.condition = currentHighlight;
					dataType = this.getDataType(content.column);
					isCustomType = dataType === 'date' || dataType === 'time' || dataType == 'dateTime' || dataType == "Date";
					if (content.name == "Sort by") {
						this.setData("showInput", false);
						this.data.containsSortBy = true; this.setFilterContent();
					} else if (content.name == "Filter by" && isCustomType ) {
						this.renderOtherFilter(content.condition, false, filterIndex, dataType);
					} else if (content.name == "Filter by" && (this.getDataType(content.column) === "multiselect" || this.getDataType(content.column) === "boolean")) {
						this.setFilterContent();
					} else if( content.name == "containes" ){
						debugger
					}else {
						this.removeDropDownContent(false); // simply removing the li to condition value
					}
				}
			} else {
				// for selecting the heading content
				this.insertConditionList(currentHighlight, content, filterIndex, target);
				if( content.name == "Group by" ){ this.data.containsGroupBy = true; }

			}
			Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'replaceAt', filterIndex, content);
			let input = this.getInput(filterIndex);
			
			if( isCustomType ){
				this.setData( 'renderCustom', dataType );
			}

			input ? input.focus() : null;
			isFullySpecified = currentCount >= 0 ? this.isFilterFullySpecified(this.data.ltPropSearchContent[filterIndex], true ) : false;
			if (isFullySpecified) {
				this.updateConditions(content , true);
			}

		} else if (isConditionSpan || (event && target.classList.contains('lyteFilterCondition'))) { // condition span 
			if (data.renderContent[0].length != 0) {
				content.condition = currentHighlight;
				if (this.getDataType(content.column) == 'date') {
					this.changeInputType(currentCount, 'date');
				}
				
				let conditionValue = content.conditionValue;
				if (conditionValue != void 0) { // if the condition value is already present 
					delete content.conditionValue;
					isFullySpecified = currentCount >= 0 ? this.isFilterFullySpecified(content, true) : false;
					if (isFullySpecified) {
						this.updateConditions(content , true);
					} else {
						content.conditionValue = conditionValue;
						Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'replaceAt', filterIndex, content);
						let span = this._editDiv.children[currentCount].children[3];
						span.setAttribute('contenteditable', true);
						span.focus();
					}
				} else {
					isFullySpecified = currentCount >= 0 ? this.isFilterFullySpecified(this.data.ltPropSearchContent[filterIndex], true) : false;
					if (isFullySpecified) {
						this.updateConditions(content , true);
						this.setFilterContent();
					} else {
						this.setListContent([]);
						this.focus(currentCount);
					}
					Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'replaceAt', filterIndex, content);
					this.focus(filterIndex);
					// this._editDiv.children[filterIndex].lastElementChild.focus();
				}
			}
		} else if (isConditionValueSpan || (event && target.classList.contains('lyteFilterConditionValue'))) { // condition value span 

			let prevContent = content.conditionValue;
			content.conditionValue = target.innerText;
			if (prevContent != target.innerText) {
				Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'replaceAt', filterIndex, content);
				isFullySpecified = currentCount >= 0 ? this.isFilterFullySpecified(this.data.ltPropSearchContent[filterIndex], true) : false;
				if (isFullySpecified) {
					this.updateConditions(content , true);
					this.setFilterContent();
				}
			}

		} else if (isColumnSpan || (event && target.classList.contains('lyteFilterColumnName'))) { // column name span
			if (data.renderContent[0].length != 0) {
				let prevContent = content.column;
				content.column = currentHighlight;
				if (prevContent != currentHighlight) {
					delete content.condition; delete content.conditionValue;
					this.insertConditionList(currentHighlight, content, filterIndex);

				} else {
					Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'replaceAt', filterIndex, content);
					this.insertConditionList(currentHighlight, content, filterIndex);
					this.focus(currentCount);
				}
				isFullySpecified = currentCount >= 0 ? this.isFilterFullySpecified(this.data.ltPropSearchContent[filterIndex], true) : false;
				if (isFullySpecified) {
					this.updateConditions(content , true);
				}
			}
		} else if ((event && target.classList.contains("lyteListViewFilterInput"))) {
			if (this.data.renderContent.length != 0) {
				this.insertFilter(this.getHighlightedLi().innerText);
			}
			event != void 0 ? event.preventDefault() : null;
			this._editDiv.children[this.data.ltPropSearchContent.length - 1].children[1].focus();
			//  this._editDiv.children[0].children[1].focus();
		} else if (currentCount == -1 || isFullySpecified || isParentInput) {
			// initial object of new filter
			if (currentHighlight) {
				if (currentHighlight == 'Sort by') { this.setData('containsSortBy', true); }
				else if (currentHighlight == 'Group by') { this.setData('containsGroupBy', true); }
				else if (currentHighlight == 'Contains') { this.setData('containsContains', true); }

				Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'push', { name: currentHighlight });

				if( currentHighlight == 'Contains' ){
					this.removeDropDownContent();
				}else{
					this.setData( {
						renderContent: this.data.heading,
						currentContent: this.data.heading
					} )
				}

				this.setData({
					inputPlaceHolder: "",
					currentFilterCount: searchContent.length - 1
				});
				
				this._input.value = "";
				this.focus(searchContent.length - 1);
			}
		}
	},

	insertFilter: function (fName) {
		let content = this.getData('ltPropSearchContent'),
			curFilterCount = this.data.currentFilterCount,
			currentCount = curFilterCount != void 0 ? curFilterCount : content.length - 1;

		this.processSelection(currentCount);
	},

	constructCondition: function () {
		let conditionObj = (this.data.ltPropCondition || {});
		for (let key in conditionObj) {
			conditionObj[key] = []
		}
		return conditionObj;
	},

	getIndexOfHeader: function (filter) {
		let rowIndex, columnIndex , heading = this.data.headerMap[ filter.column ];
		this.data.ltPropHeader.some(function (items, cIndex) {
			return items.children.some(function (rows, index) {
				if (rows.prop === heading) {
					rowIndex = index, columnIndex = cIndex;
					return true;
				}
				return false;
			});
		});

		return { rowIndex: rowIndex, columnIndex: columnIndex };
	},

	updateConditions: function (_filter , forApplying , forRemoving ) {
		let conditions = this.constructCondition(),
			_this = this,
			filterContent = this.data.ltPropSearchContent ,
			header = this.data.heading , 
			trigger = this.data.ltPropTriggerEvent ;
		// this.data.ltPropPrevGroupIndex = undefined;
		// this.setData('ltPropPrevGroupIndex', undefined );
		!trigger ? this.setData('ltPropFilterGrouped', false) : null;	
		!trigger ? this.setData('ltPropFilteredContent', undefined) : null;
		// _this.throwEvent('construct_content');


		filterContent.forEach(function (filter) {
			var filterName = filter.name || "",
				isFullySpecified = _this.isFilterFullySpecified(filter, true);
			if (isFullySpecified) {
				switch (filterName) {
					case 'Sort by':
						var className = filter.condition == 'Ascending' ? 'lyteListDesc' : 'lyteListAsc';

						// to find the index values of the header 
						var ret = _this.getIndexOfHeader(filter);
						Lyte.objectUtils(_this.getData('ltPropHeader')[ret.columnIndex].children[ret.rowIndex], 'add', "sortStatus", className);
						_this.throwEvent('sort', _this.data.heading.indexOf(filter.column), true);
						break;
					case 'Filter by':
						var datatype = _this.getDataType(filter.column) , condition;
						switch (datatype) {
							case 'number':
								condition = _this.numberCondition(filter);
								break;
							case 'text':
								condition = _this.textCondition(filter);
								break;
							case 'boolean':
								condition = _this.booleanCondition(filter);
								break;
							case 'multiselect':
								condition = _this.multiselectCondition(filter);
								break;
							case 'Date':
							case 'date':
								condition = _this.dateCondition(filter);
								break;
							case 'time':
								condition = _this.timeCondition(filter);
								break;
						}
						break;
					case 'Group by':
						// for non-grouped content 
						if( !_this.data.ltPropTriggerEvent ){
							_this.setData('ltPropFilterGrouped', true);
							
							var heading = _this.getHeaderValue( header.findIndex( function(item){ return item == filter.column } ) ).prop;
							var groupedObj = _this.data.ltPropContent.reduce((acc, curr) => {
								const key = curr[heading];
								if (acc[key]) {
									let index = acc[key].length;
									acc[key].push({data : curr, index : index});
								} else {
									acc[key] = [{data : curr, index : 0}];
								}
								return acc;
							}, {});
							var final = [];
							for (let key in groupedObj) {
								final.push({ name: key, rows: groupedObj[key] });
							};
							_this.setData('ltPropFilteredContent', final);
	
							// if(_this.data.ltPropNavigator ){
							// 	_this.throwEvent( 'construct_group' );
							// }
						}
						break;
					case 'Contains':
						_this.setData( 'ltPropSearchValue', filter.condition );
						break;
				}
			}


			if (filterName === "Filter by" && condition) {
				let heading = _this.data.headerMap[ filter.column ];
				if (_this.data.ltPropMultipleFilter) {
					let arr = conditions[heading].slice();
					arr.push(condition);
					Lyte.objectUtils(conditions, 'add', heading, arr);
				} else {
					Lyte.objectUtils(conditions, 'add', heading, condition);
				}
			}
		});

		if( forApplying ){
			var cb = "onInlineFilterApply";
			if (this.getMethods(cb)) {
				setTimeout( function(){
					_this.executeMethod(cb, _this.data.ltPropSearchContent);
				} , 0 );
			}
		}else if( forRemoving ){
			var cb = "onInlineFilterRemove";
			if (this.getMethods(cb)) {
				setTimeout( function(){
					_this.executeMethod(cb, _this.data.ltPropSearchContent);
				} , 0 );
			}
		}

		if( filterContent.length == 0 ){
		  _this.throwEvent('construct_content');
		}
		// this.setData( 'ltPropCondition' , conditions );
	},

	numberCondition: function (filter) {
		//start_diff : 0 , end_diff : 0
		let dictionary = {
			'Equals to': { value: "is" }, 'Not equals to': { value: "is_not" }, // start , end  == input
			'Less than': { suffix: "< ", end_diff: -1, start: -Infinity, value: 'less_than' },
			'Greater than': { suffix: "> ", start_diff: -1, end: Infinity, value: 'greater_than' },
			'Less than or equal to': { suffix: "<= ", start: -Infinity, value: 'less_than_or_equal' },
			'Greater than or equal to': { suffix: ">= ", end: Infinity, value: "greater_than_or_equal" },
			'Is empty': { value: "is_empty", start: -Infinity, end: Infinity, isNeg: false },
			'Is not empty': { value: "is_not_empty", start: -Infinity, end: Infinity }
		},
			conditionParam = dictionary[filter.condition],
			// default value if the property is missing in operator object
			defaultValues = {
				start: filter.conditionValue, end: filter.conditionValue, start_diff: 0, end_diff: 0,
				isValid: true, isNeg: false, input: (conditionParam.suffix || "") + filter.conditionValue, type: "number",
				label: filter.condition, value: filter.condition
			},
			final_obj = {};

		for (let keys in defaultValues) {
			final_obj[keys] = conditionParam[keys] || defaultValues[keys]
		}

		return final_obj;
	},

	timeCondition : function(filter){
		let dictionary = {
			'Equals to': { value: "is" }, 'Not equals to': { value: "is_not" }, // start , end  == input
			'Less than': { suffix: "< ", end_diff: -1, start: -Infinity, value: 'less_than' },
			'Greater than': { suffix: "> ", start_diff: -1, end: Infinity, value: 'greater_than' },
			'Less than or equal to': { suffix: "<= ", start: -Infinity, value: 'less_than_or_equal' },
			'Greater than or equal to': { suffix: ">= ", end: Infinity, value: "greater_than_or_equal" },
			'Is empty': { value: "is_empty", start: -Infinity, end: Infinity, isNeg: false },
			'Is not empty': { value: "is_not_empty", start: -Infinity, end: Infinity }
		},
			conditionParam = dictionary[filter.condition],
			defaultValues = {
				start: filter.conditionValue, end: filter.conditionValue, start_diff: 0, end_diff: 0,
				isValid: true, isNeg: false, input: (conditionParam.suffix || "") + filter.conditionValue, type: "time",
				label: filter.condition, value: filter.condition
			},
			final_obj = {};

			for (let keys in defaultValues) {
				final_obj[keys] = conditionParam[keys] || defaultValues[keys]
			}
	
			return final_obj;
	},

	textCondition: function (filter) {
		let dictionary = {
			"Equal to": { value: "equal", isNeg: false },
			"Not equal to": { value: "not_equal", isNeg: true },
			"Starts with": { value: "begins_with", isNeg: false },
			"Contains": { value: "contains", isNeg: false },
			"Does not contains": { value: "does_not_contains", isNeg: true }
		},
			conditionParam = dictionary[filter.condition],
			defaultValues = {
				input: filter.conditionValue, isNeg: false, isValid: true, label: filter.condition, type: "text"
				, value: filter.condition
			},
			final_obj = {};

		for (let keys in defaultValues) {
			final_obj[keys] = conditionParam[keys] || defaultValues[keys];
		}

		return final_obj;
	},

	booleanCondition: function (filter) {
		let dictionary = {
			"Selected": { value: "is", isNeg: false },
			"Not Selected": { value: "is_not", isNeg: true }
		},
		conditionParam = dictionary[filter.condition],
			defaultValues = { type: 'boolean', isNeg: false, isValid: true, label: filter.condition, value: filter.condition },
			final_obj = {};

		for (let keys in defaultValues) {
			final_obj[keys] = conditionParam[keys] || defaultValues[keys];
		}

		return final_obj;
	},

	multiselectCondition: function (filter) {
		let email_rgx = /^([^@]*)@.*$/,
			user_name = filter.condition.match(email_rgx)[1],
			multiselectCondition = this.data.ltPropCondition[filter.column],
			selected_obj = { value: filter.condition, label: user_name, email: filter.condition, checked: true };

		if (!this.data.ltPropMultipleFilter || Object.keys(multiselectCondition).length === 0) {
			return {
				isValid: true, value: [filter.condition], type: 'multiselect',
				selected: [selected_obj]
			};
		} else {
			multiselectCondition[0].selected.push(selected_obj);
			multiselectCondition[0].value.push(filter.condition);
		}

		return multiselectCondition;
	},

	dateCondition: function (filter) {
		let dictionary = {},
			conditionParam = dictionary[filter.condition] || {},
			heading = this.toSnakeCase( filter.condition ),
			first = [ 'Is' , 'Is not' , 'Less than' , 'Greater than' , 'Less than or equal' , 'Greater than or equal' ],
			isNeg = [ 'Is not' , 'Is empty' ],
			defaultValues = {
				start: Infinity, end: -Infinity, input: "", isNeg: isNeg.indexOf(filter.condition) != -1 ? true : false,
				isValid: true, label: filter.condition, type: 'date', value: heading
			},
			isFirst = first.indexOf(filter.condition),
			conditionValue = $L.moment( filter.conditionValue , this.data.ltPropFormat ).format(),
			returned_obj = _lyteUiUtils.dateFilterValue( isFirst ? conditionValue : -Infinity, isFirst ? Infinity : conditionValue , heading , this.data.ltPropFormat),
			final_obj = {};
			
		for (let keys in defaultValues) {
			final_obj[keys] = returned_obj[keys] || conditionParam[keys] || defaultValues[keys]
		};
		return final_obj;
	},
	filterData: function (arr, value ,filter) { 
		let exisHeading = [] ; // get all the previously applied conditions
		if( filter && filter.column ){
			if( this.data.ltPropMultipleFilter ){
				(this.data.ltPropCondition[ this.data.headerMap[filter.column] ] || []).forEach( function(item){
					exisHeading.push( item.label || item.value);
				});
			}
		}
		arr = arr.filter(function(element) {
			return !exisHeading.includes(element);
		});
		
		if( value ){
			let res = arr.filter(function (item) {
				return item.toLowerCase().includes(value)
			});
			res.length == 0 && this.data.currentContent.length != 0 ? this.setData('noResultMessage', true) : this.setData('noResultMessage', false);
			return res;
		}  
		arr.length == 0 && this.data.currentContent.length != 0 ? this.setData('noResultMessage', true) : this.setData('noResultMessage', false);
		return arr;
	},

	renderOtherFilter: function (value, isInputRequired, count, type) {
		var content = this.data[ type + 'Filter'],
			obj = {
				dateInputNum : "0000000011111100",
				DateInputNum : "0000000011111100",
				timeInputNum : "11111100",
				dateTimeInputNum : "000000000000111100"
			},
			index = content.indexOf(value);

		if (index != -1) {
			let isInput = Boolean( obj[type + 'InputNum'].charAt(index) * 1);
			if (isInputRequired) { return isInput; } // for updating the condition variable

			if (isInput) {
				this.changeInputType(count, type);
				this.removeDropDownContent(false);
				return true;
			} else {
				// move to next filter 
				this._input.focus();
				this.setFilterContent();
				return false;
			}
		} else {
			console.error("invalid");
			return false;
		}
	},

	renderMultiselectFilter: function (heading) {
		var content = this.setMultiselectContent(heading);
		this.setListContent(content);
	},

	pushIfNot : function( arr, value ){
		if( this.get_index( arr, value ) == -1 ){
			arr.push( value );
		}
	},

	get_index : function( array, value ){
		return array ? array.indexOf( value ) : -1;
	},

	setMultiselectContent: function ( heading ) {
		heading = this.data.headerMap[heading];

		let _this = this;

		let content = [];
		if (this.data.ltPropGroupedRow) {
			this.data.ltPropContent.forEach(function (parent) {
				(parent.rows || []).forEach(function (item) {
					_this.pushIfNot( content, item[heading] );
				});
			})
		} else {
			this.data.ltPropContent.forEach(function (item) {
				_this.pushIfNot(content, item[heading]);
			})
		}
		this.setData('multiselectFilter', content);
	},

	cursorAtEndOfNode: function (end) {
		var len = end.innerText.length;

		let range = document.createRange(),
			selection = window.getSelection();

		range.setStart(end, end.childNodes.length);
		range.setEnd(end, end.childNodes.length);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		// selection.removeAllRanges();
		// selection.addRange( range );

	},

	columnNameClick: function (_this) {
		_this.setAttribute('contenteditable', true);
		this.hideInput(_this);
		_this.focus();
		let index = parseInt(_this.parentElement.getAttribute('index')),
			content = this.getData('ltPropSearchContent'),
			value = content[index].column;

		this.setListContent(this.data.heading , _this.innerText.toLowerCase());
	},

	conditionClick: function (_this) {
		_this.setAttribute('contenteditable', true);
		_this.focus();

		let index = parseInt(this.getIndex(_this)),
			content = this.getData('ltPropSearchContent'),
			currentContent = content[index];

		if (currentContent.name == 'Sort by') {
			this.setListContent(this.data.sortBy, _this.innerText.toLowerCase());
		} else {
			let contentIndex = this.data.heading.indexOf(currentContent.column),
				dataType = this.data.ltPropHeader[contentIndex].children[0].dataType;
			this.setListContent(this.data[dataType + "Filter"], _this.innerText.toLowerCase());
		}
	},

	conditionValueClick: function (_this) {
		let index = parseInt(_this.parentElement.getAttribute('index')),
			content = this.data.ltPropSearchContent,
			cur_content = content[index],
			curType = this.getDataType(cur_content.column);
			this.setData('customValue', cur_content.conditionValue );
			delete cur_content.conditionValue;
			Lyte.arrayUtils(content, 'replaceAt', index, cur_content);
			this.setData('renderCustom', curType );
		
		// switch( curType ){
		// 	case 'date':
		// 	case 'Date':
		// 		delete cur_content.conditionValue;
		// 		Lyte.arrayUtils(content, 'replaceAt', index, cur_content);
		// 		this.setData('renderCustom', curType );
		// 		// this.changeInputType(index, 'date', value, true);
		// 		break;
		// 	case 'Time':
				
		// }

		_this.setAttribute('contenteditable', true);
		_this.focus();
		this.setListContent([]);
	},

	focus: function (index, value, particularIndex) {
		let elem = particularIndex ? this._editDiv.children[index].children[particularIndex] :
			$L(this._editDiv.children[index]).find('.lyteInputFilterName')[0];
		if (elem) {
			elem.setAttribute('contenteditable', true);
			elem.focus();
		}
		if (value) {
			elem.value = value;
		}
	},

	setListContent: function (content, value , filterContent) {
		var modifiedContent = this.filterData(content, value , filterContent);
		this._dropDown.classList.remove( 'lyteListViewDropdownHidden' );
		this.setData({
			renderContent: modifiedContent || content,
			currentContent: content
		})
		if( content.length == 0 ){
			this._dropDown.classList.add('lyteListViewDropdownHidden');
		}
	},

	getElement: function (filterIndex, contentIndex) {
		return this._editDiv.children[filterIndex].children[contentIndex];
	},

	inputFocus: function (_this) {
		let index = this.getIndex(_this),
			content = this.data.ltPropSearchContent[index],
			length = Object.keys(content).length,
			dataType;

		

			switch (length) {
				case 1: // column
					if( content.name === 'Contains' ){
						this.removeDropDownContent();
					}else{
						this.setListContent(this.data.heading, _this.value.toLowerCase());
					}
					break;
				case 2: // condition
					if(content.name === 'Sort by'){
						this.setListContent(this.data.sortBy);
					}else{
						dataType = this.getDataType(content.column);
						this.setListContent(this.data[dataType + "Filter"]);
					}
					break;
				case 3: // condition value
					this.setListContent([]);
					this.setDataType(content);
					break;
			}
		

	},

	setDataType : function(content){

		let type = this.getDataType( content.column );
		let isCustomType = ['data', 'Date', 'time', 'dateTime'].indexOf(type || "");
		let _this = this; 

		if( isCustomType ){
			// setTimeout( function(){
				_this.setData( 'renderCustom', type );
				_this.setData( 'customValue', content.conditionValue );
			// } , 100)
		}

	},

	changeInputType: function (count, type, value, isFocus) {
		let input = this.getInput(count);
		if(input){
			input.type = type;
			value != void 0 ? input.value = value : null;
		}
		isFocus ? input.focus() : null;
	},

	hideInput: function (_this) {
		let inputNode = $L(_this.parentElement).find('.lyteInputFilterName')[0];
		if (inputNode) { inputNode.style.display = 'none'; }
	},

	getIndex: function (element) {

		if( !element.classList.contains('lyteListViewFilterInput') ){
			if( element.tagName === 'INPUT' ){
				let input = $L(element).closest('lyte-input')[0];
				let index = input && input.parentElement.getAttribute('index'); 
				return parseInt(index);
			}else{
				return parseInt( element.parentElement.getAttribute('index') );
			}
		}

	},

	getInput: function (index) {
		return $L(this._editDiv.children[index]).find('.lyteInputFilterName')[0];
	},

	getDataType: function (heading) {
		return this.data.ltPropHeader[this.data.heading.indexOf(heading)].children[0].dataType;
	},

	isFilterFullySpecified: function (content, isEqual) {
		const keyLength = Object.keys(content).length;

		switch (content.name) {
			case 'Sort by':
				return isEqual ? keyLength === 3 : keyLength < 3;

			case 'Filter by':
				var totalLength = 4;
				if (content.condition) {
					let type = this.getDataType(content.column);
					switch (type) {
						case 'date':
							totalLength = this.renderOtherFilter(content.condition, true, 'date') ? 4 : 3;
							break;
						case 'boolean':
							totalLength = 3;
							break;
						case 'multiselect':
							totalLength = 3;
							break;
						default:
							totalLength = 4;
					}
				}
				return isEqual ? keyLength === totalLength : keyLength < totalLength;

			case 'Group by':
				return isEqual ? keyLength === 2 : keyLength < 2;
			
			case 'Contains':
				return isEqual ? keyLength === 2 : keyLength < 2;

			default:
				return false;
		}
	},

	insertConditionList: function (filterName, content, index, target) {

		// for selecting the heading content
		let headingIndex = this.data.heading.indexOf(filterName)
		if (headingIndex != -1) {

			if (content.name == "Sort by") {
				content.column = filterName;
				this.setListContent(this.data.sortBy);
			} else if (content.name == "Filter by") {
				let dataType = this.data.ltPropHeader[headingIndex].children[0].dataType;
				if (dataType == "multiselect") { this.setMultiselectContent(filterName); }
				content.column = filterName;
				target != undefined ? target.value = '' : null;
				// inserting the corresponding filter conditions
				this.setListContent(this.data[dataType + "Filter"], undefined , content);
				// this.setData({
				// 	renderContent: this.data[dataType + "Filter"],
				// 	currentContent: this.data[dataType + "Filter"]
				// })
			} else if (content.name == "Group by") {
				content.column = filterName;
				this.setFilterContent(filterName);
			}
		}

		if( content.name == 'Contains' ){
			if( target != void 0 ){
				content.condition = target.value;
				target.value = "";
				this.setFilterContent(filterName);
			}
		}
		
		Lyte.arrayUtils(this.getData('ltPropSearchContent'), 'replaceAt', index, content);
		if (content.name != "Group by") {
			this.focus(index);
		}
	},

	removeDropDownContent: function (noResultMessage) {
		this.setData({
			renderContent: [],
			currentContent: []
		});
		this._dropDown.classList.add("lyteListViewDropdownHidden");
		noResultMessage ? this.setData("noResultMessage", true) : null;
	},

	removeFromArray : function(array, content){
		let index = array.indexOf( content );
		index != -1 && array.splice( index , 1 );
	},

	getHighlightedLi: function () {
		return $L(this._dropDown).find(".lyteListViewDropdownHighlighted")[0];
	},

	setFilterContent: function () {
		let content = this.data.ltPropFilterContent;
		if (this.data.containsSortBy || this.data.containsGroupBy || this.data.containsContains ) { 
			let data = this.data.ltPropFilterContent.slice();
			
			this.data.containsSortBy && this.removeFromArray( data, 'Sort by' );
			this.data.containsGroupBy && this.removeFromArray( data, 'Group by' );
			this.data.containsContains && this.removeFromArray( data, 'Contains' );

			this.setListContent( data ); 
			// content.slice( content.indexOf('Sort by') )
		}
		else { this.setListContent(this.data.ltPropFilterContent); }
		this._input.focus();
	},

	toSnakeCase : function (str) {
		return str.replace(/\s+/g, '_').toLowerCase();
	},

	getHeaderValue : function( index ){
		
		let header = this.data.ltPropHeader;
		let k = 0;

		for( let i = 0 ; i < header.length ; i++ ){
			let children = header[i].children;
			for( let j = 0 ; j < children.length ; j++ ){
				if( index == ( k++ ) ){
					return children[ j ];
				}
			}
		}

	},

	insertCondition : function( condition ){
		var _this = this;
		_this.setData( "ltPropSearchContent" , condition );
		if( condition.length != 0){
			_this.setData('inputPlaceHolder', "");
		}
		condition.forEach( function( item ){

			item.name === 'Sort by' && _this.setData( 'containsSortBy', true );
			item.name === 'Group by' && _this.setData( 'containsGroupBy', true );

		} );
		this.setData( 'currentFilterCount' , condition.length - 1);
		this.updateConditions();
	}

});

(function () {
	_lyteUiUtils.addEvent(document, 'click', function (evt) {
		let target = evt.target,
			targetClass = target.classList,
			$node = $L(target).closest('lyte-listview-filter')[0],
			_this = $node ? $node.component : undefined,
			data = _this ? _this.data : undefined;


		if (targetClass.contains('lyteListViewFilterInput')) {
			_this.setFilterContent();
			_this._dropDown.classList.remove('lyteListViewDropdownHidden');
		} else if (targetClass.contains('lyteInputFilterName')) {
			_this.inputFocus(target);
		} else if (target.classList.contains('lyteListViewFilters')) {
			_this._input.focus();
			_this.setFilterContent();
			_this._dropDown.classList.remove('lyteListViewDropdownHidden');
		} else if (targetClass.contains('lyteListViewDropdownLi')) {
			_this.insertFilter(target.innerText);
		} else if (target.classList.contains('lyteFilterColumnName')) {
			_this.columnNameClick(target);
		} else if (target.classList.contains('lyteFilterCondition')) {
			_this.conditionClick(target);
		} else if (target.classList.contains('lyteFilterConditionValue')) {
			_this.conditionValueClick(target);
		}

		if( !$node ){
			let array = Array.from($L('lyte-listview-filter'));

			array.forEach(function(element){
				element.component._dropDown.classList.add('lyteListViewDropdownHidden');
			});
		}

	})
})();

Lyte.Component.registerHelper("shouldRenderInput", function (content) {
	return this.component.isFilterFullySpecified(content);
});

Lyte.Component.registerHelper("getType", function (filter) {
	if ( filter.condition ) {
		return this.component.getDataType(filter.column);
	}
});





