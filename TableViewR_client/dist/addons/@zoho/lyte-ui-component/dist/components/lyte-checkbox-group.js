/**
 * Renders a checkbox-group
 * @component lyte-checkbox-group
 * @version 1.0.0
 * @methods onBeforeChecked,onChecked,onChanged,onBeforeUnchecked,onUnchecked
 */

Lyte.Component.register( 'lyte-checkbox-group', {
_template:"<template tag-name=\"lyte-checkbox-group\" role=\"group\"> <template is=\"if\" value=\"{{ltPropLegend}}\"><template case=\"true\"> <fieldset class=\"lyteCBoxGroupFieldSet\"> <legend class=\"lyteCBoxGroupLegend {{ltPropLegendClass}}\">{{ltPropLegend}}</legend> <div class=\"{{alignmentClass}}\" role=\"list\" id=\"{{lyteUiGetChkboxGrpId()}}\"> <template is=\"for\" items=\"{{ltPropOptions}}\" item=\"item\" index=\"index\"> <lyte-checkbox role=\"listitem\" lt-prop-type=\"{{ltPropType}}\" lt-prop-name=\"{{ltPropName}}\" lt-prop-label=\"{{item[ltPropUserValue]}}\" lt-prop-value=\"{{item[ltPropSystemValue]}}\" lt-prop-fire-on-init=\"{{ltPropFireOnInit}}\" lt-prop-label-class=\"{{ltPropLabelClass}}\" lt-prop-yield=\"{{ltPropYield}}\" lt-prop-prevent-callback-observers=\"true\" lt-prop-checked=\"{{unbound(lyteUiIsInArray(item,ltPropSelected,ltPropSystemValue))}}\" lt-prop-class=\"{{ltPropClass}}\" lt-prop-disabled=\"{{lyteUiIsInArray(item,ltPropDisabledList,ltPropSystemValue)}}\" on-checked=\"{{method('fireCallback','onChecked',item)}}\" ,=\"\" on-unchecked=\"{{method('fireCallback','onUnchecked',item)}}\" on-before-checked=\"{{method('fireCallback','onBeforeChecked',item)}}\" on-before-unchecked=\"{{method('fireCallback','onBeforeUnchecked',item)}}\" on-changed=\"{{method('fireCallback','onChanged',item)}}\" data-value=\"{{item[ltPropSystemValue]}}\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-yield yield-name=\"yield\" lyte-item=\"{{item}}\"></lyte-yield> </template> </template></template> </lyte-checkbox> </template> </div> </fieldset> </template><template case=\"false\"> <div class=\"{{alignmentClass}}\" role=\"list\" id=\"{{lyteUiGetChkboxGrpId()}}\"> <template is=\"for\" items=\"{{ltPropOptions}}\" item=\"item\" index=\"index\"> <lyte-checkbox role=\"listitem\" lt-prop-type=\"{{ltPropType}}\" lt-prop-name=\"{{ltPropName}}\" lt-prop-label=\"{{item[ltPropUserValue]}}\" lt-prop-value=\"{{item[ltPropSystemValue]}}\" lt-prop-fire-on-init=\"{{ltPropFireOnInit}}\" lt-prop-label-class=\"{{ltPropLabelClass}}\" lt-prop-yield=\"{{ltPropYield}}\" lt-prop-prevent-callback-observers=\"true\" lt-prop-checked=\"{{unbound(lyteUiIsInArray(item,ltPropSelected,ltPropSystemValue))}}\" lt-prop-class=\"{{ltPropClass}}\" lt-prop-disabled=\"{{lyteUiIsInArray(item,ltPropDisabledList,ltPropSystemValue)}}\" on-checked=\"{{method('fireCallback','onChecked',item)}}\" ,=\"\" on-unchecked=\"{{method('fireCallback','onUnchecked',item)}}\" on-before-checked=\"{{method('fireCallback','onBeforeChecked',item)}}\" on-before-unchecked=\"{{method('fireCallback','onBeforeUnchecked',item)}}\" on-changed=\"{{method('fireCallback','onChanged',item)}}\" data-value=\"{{item[ltPropSystemValue]}}\"> <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> <template is=\"registerYield\" yield-name=\"yield\"> <lyte-yield yield-name=\"yield\" lyte-item=\"{{item}}\"></lyte-yield> </template> </template></template> </lyte-checkbox> </template> </div> </template></template> <lyte-hovercard lt-prop-origin-elem=\"#{{lyteUiGetChkboxGrpId()}}\" lt-prop-max-width=\"250px\" lt-prop-auto-show=\"true\" lt-prop-placement=\"top bottom\" lt-prop-hide-on-click=\"true\" lt-prop=\"{{ltPropHoverCard}}\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content> {{ltPropMessage}} </lyte-hovercard-content> </template> </lyte-hovercard> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,3,1]},{"type":"for","position":[1,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"registerYield","position":[3,1],"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3]}],
_observedAttributes :["ltPropType","ltPropName","ltPropUserValue","ltPropSystemValue","ltPropFireOnInit","ltPropClass","ltPropOptions","ltPropSelected","ltPropAlignment","ltPropFocus","ltPropDisabledList","ltPropYield","ltPropMaxCount","ltPropShowMessage","ltPropMessage","ltPropLegend","ltPropLegendClass"],

	data: function() {
		return {

			/**
			 * @componentProperty {default | primary | switch | slider} ltPropType=default
			 */

			'ltPropType': Lyte.attr( 'string', { 
				'default': _lyteUiUtils.resolveDefaultValue( 'lyte-checkbox-group', 'type', 'default' )
			} ),

			/**
			 * @componentProperty {string} ltPropName
			 */

			'ltPropName': Lyte.attr( 'string', { 
				'default': undefined 
			} ),

			/**
			 * @componentProperty {string} ltPropUserValue=name
			 * 
			 */

			'ltPropUserValue': Lyte.attr( 'string', { 
				'default': 'name' 
			} ),

			/**
			 * @componentProperty {string} ltPropSystemValue=value
			 * 
			 */

			'ltPropSystemValue': Lyte.attr( 'string', { 
				'default': 'value' 
			} ),

			/**
			 * @componentProperty {boolean} ltPropFireOnInit=false
			 */

			'ltPropFireOnInit': Lyte.attr( 'boolean', { 
				'default': _lyteUiUtils.resolveDefaultValue( 'lyte-checkbox-group', 'fireOnInit', false ) 
			} ),

			/**
			 * @componentProperty {string} ltPropClass
			 */

			'ltPropClass': Lyte.attr( 'string', { 
				'default': _lyteUiUtils.resolveDefaultValue( 'lyte-checkbox-group', 'class', '' ) 
			} ),

			/**
			 * @componentProperty {array} ltPropOptions=[]
			 */

			'ltPropOptions': Lyte.attr( 'array', { 'default': [] } ),

			/**
			 * @componentProperty {array} ltPropSelected=[]
			 */

			'ltPropSelected': Lyte.attr( 'array', { 
				'default': [] 
			} ),

			/**
			 * @componentProperty {horizontal | vertical} ltPropAlignment=horizontal
			 */

			'ltPropAlignment': Lyte.attr( 'string', { 
				'default': _lyteUiUtils.resolveDefaultValue( 'lyte-checkbox-group', 'alignment', 'horizontal' )  
			} ),

			/**
			 * @componentProperty {boolean} ltPropFocus=false
			 * 
			 */

			'ltPropFocus': Lyte.attr( 'boolean', { 
				'default': false 
			} ),

			/**
			 * @componentProperty {array} ltPropDisabledList=[]
			 * 
			 */

			'ltPropDisabledList': Lyte.attr( 'array', { 
				'default': [] 
			} ),

			/**
			 * @componentProperty {boolean} ltPropYield=false
			 * 
			 */

			'ltPropYield': Lyte.attr( 'boolean', { 
				'default': false 
			}),
			/**
			 * @componentProperty {number} ltPropMaxCount
			 */
			'ltPropMaxCount': Lyte.attr('number', { 'default': 0 }),
			/**
			 * @componentProperty {boolean} ltPropShowMessage
			 */
			'ltPropShowMessage': Lyte.attr('boolean', { 'default': true }),
			/**
			 * @componentProperty {string} ltPropMessage
			 */
			'ltPropMessage': Lyte.attr('string', { 'default': 'Maximum number of options selected.' }),
			/**
			 * @componentProperty {string} ltPropLegend
			 */
			'ltPropLegend': Lyte.attr('string', { 'default': '' }),
			/**
			 * @componentProperty {string} ltPropLegendClass
			 */
			'ltPropLegendClass': Lyte.attr('string', { 'default': '' })
		}
	},

	init: function () {
		var alignment = this.getData('ltPropAlignment');
		this.setData('alignmentClass', 'lyteCBoxGroup' + alignment[0].toUpperCase() + alignment.substring(1));
		if (!_lyteUiUtils.chkboxGrp) {
			_lyteUiUtils.chkboxGrp = { 'ind': 0 };
		}
		else {
			_lyteUiUtils.chkboxGrp.ind += 1;
		}
	},

	methods: {
		fireCallback: function( callbackName, item ) {

			if(!this.preventMutation) {

				if( callbackName === 'onChecked' ) {
					this.add( item );
				}
				else if( callbackName === 'onUnchecked' ) {
					this.remove( item );
				}
			}

			if( this.getMethods( callbackName ) ) {
				return this.executeMethod.apply( this, this.constructArgs(callbackName, item, arguments ) );
			}
		}
	},

	add: function( item ) {
		this.preventObserver = true;
		Lyte.arrayUtils( this.getData( 'ltPropSelected' ), 'push', item );
		this.preventObserver = false;
	},

	getIndex : function(array, item) {
		var sysValue = this.getData( 'ltPropSystemValue' );
		for(var index=0; index < array.length; index++) {
			if(array[index][sysValue] ===  item[sysValue]) {
				return index;
			}
		}
	},

	remove: function( item ) {
		this.preventObserver = true;

		var sel = this.getData( 'ltPropSelected' ) || [],
		ind = this.getIndex(sel, item);

		if( ind !== -1 ) {
			Lyte.arrayUtils( sel, 'removeAt', ind, 1 );
		}

		this.preventObserver = false;
	},

	maxCountObserver: function () {
		this.manageOptionAvailability();
		this.renderHoverCard();
		this.updateSelectionsWithMaxLimit();
	}.observes('ltPropMaxCount'),

	selectedObserver: function (changeObj) {
		this.renderHoverCard();
		this.manageOptionAvailability();
		if (this.preventObserver) {
			return;
		}
		this.preventMutation = true;
		this.updateSelectionsWithMaxLimit(changeObj);
		this.preventMutation = false;
	}.observes('ltPropSelected.[]').on('didConnect'),

	getAddedValues: function( oldValue, newValue ) {
		return this.setSubtract( newValue, oldValue );
	},

	getRemovedValues: function( oldValue, newValue ) {
		return this.setSubtract( oldValue, newValue );
	},

	setSubtract: function( arrA, arrB ) {
		var sysValue = this.getData( 'ltPropSystemValue' );

		arrA = arrA || [];
		arrB = arrB || [];

		return arrA.filter( function( obj ) {
			for( var i = 0; i < arrB.length; i++ ) {
				if( obj[ sysValue ] === arrB[ i ][ sysValue ] ) {
					return false;
				}
			}

			return true;
		} );
	},

	constructArgs: function( methodName, item, args ) {
		var arr = [].slice.call( args );

		arr.shift();
		arr.shift();
		arr.unshift( methodName );
		arr.push(item);

		return arr; 
	},

	check: function( item ) {
		this.changeToState( item, true );
	},

	uncheck: function( item ) {
		this.changeToState( item, false );
	},

	changeToState: function( item, newState ) {
		var sysValue = this.getData( 'ltPropSystemValue' ),
		dataValue = item[ sysValue ],
		checkbox = this.$node.querySelector( '[data-value="' + dataValue + '"]' );

		if( checkbox ) {
			checkbox.ltProp( 'checked', newState );
		}
	},

	focusObserver: function() {
		var focus = this.getData( 'ltPropFocus' );

		if( focus ) {
			this.focusCBox();
		}
	}.observes( 'ltPropFocus' ).on( 'didConnect' ),

	focusCBox: function() {
		var cbox;

		this.setData( 'ltPropFocus', false );
		cbox = this.getFirstEnabledCheckbox();

		if( cbox ) {
			cbox.ltProp( 'focus', true );
		}
	},

	getFirstEnabledCheckbox: function() {
		var cboxes = this.$node.querySelectorAll( 'lyte-checkbox' );

		for( var i = 0; i < cboxes.length; i++ ) {
			if( !cboxes[ i ].ltProp( 'disabled' ) ) {
				return cboxes[ i ];
			}
		}
	},
	/**
	 * Check if the number of selected items has crossed the limit
	 * @param {Number} extra - The extra items to be added to the selected list
	 * @returns {Boolean} - true if it does
	 */

	checkLimit: function (extra) {
		var max = this.getData('ltPropMaxCount'),
			sel = this.getData('ltPropSelected'), count;
		count = sel.length + extra;
		if (max > 0 && count > max) {
			return true;
		}
	},

	manageOptionAvailability: function () {
		var selectedList = this.getData('ltPropSelected');
		var disabledList = this.getData('ltPropDisabledList');
		var selectedLength = this.getData('ltPropSelected').length;
		var allOptions = this.getData('ltPropOptions');
		var maxCount = this.getData('ltPropMaxCount');
		var sysValue = this.getData('ltPropSystemValue');
		if (selectedLength > 0 && selectedLength === maxCount) {
			var toBeDisabled = allOptions.filter(option =>
				!selectedList.some(selected => selected[sysValue] === option[sysValue])
			);
			for (i = 0; i < toBeDisabled.length; i++) {
				var item = toBeDisabled[i],
					dataValue = item[sysValue],
					checkbox = this.$node.querySelector('[data-value="' + dataValue + '"]');
				if (checkbox) {
					checkbox.ltProp('disabled', true);
				}
			}
		}
		else if (selectedLength < maxCount) {
			var toBeEnabled = allOptions.filter(option =>
				!disabledList.some(selected => selected[sysValue] === option[sysValue])
			);
			for (i = 0; i < toBeEnabled.length; i++) {
				var item = toBeEnabled[i],
					dataValue = item[sysValue],
					checkbox = this.$node.querySelector('[data-value="' + dataValue + '"]');
				if (checkbox) {
					checkbox.ltProp('disabled', false);
				}
			}
		}
		var toBeEnabled = selectedList.filter(selected =>
			!disabledList.some(disabled => disabled[sysValue] === selected[sysValue])
		);
		for (i = 0; i < toBeEnabled.length; i++) {
			var item = toBeEnabled[i],
				dataValue = item[sysValue],
				checkbox = this.$node.querySelector('[data-value="' + dataValue + '"]');
			if (checkbox) {
				checkbox.ltProp('disabled', false);
			}
		}
	},

	renderHoverCard: function () {
		var maxCount = this.getData('ltPropMaxCount');
		var selectedLength = this.getData('ltPropSelected').length;
		var div = $L(this.$node).find('div')[0];
		if (maxCount && this.getData('ltPropShowMessage') && maxCount === selectedLength) {
			div.setAttribute('lyte-hovercard', true);
		} else {
			div.removeAttribute('lyte-hovercard');
		}
	},

	updateSelectionsWithMaxLimit: function (changeObj) {
		var maxCount = this.getData('ltPropMaxCount');
		if (changeObj === undefined) {
			addedValues = this.getData('ltPropSelected');
		}
		else {
			var oldValue = changeObj.oldValue,
				newValue = changeObj.newValue,
				addedValues = this.getAddedValues(oldValue, newValue),
				removedValues = this.getRemovedValues(oldValue, newValue)
		}
		var that = this;
		if (addedValues) {
			var limitExceeded = this.checkLimit(addedValues.length);
			if (!limitExceeded) {
				addedValues.forEach(function (cbox) {
					that.check(cbox);
				});
			}
			else {
				var selectedList = this.getData('ltPropSelected');
				var valuesToBeAdded = selectedList.slice(0, maxCount);
				/*
				 * When the ltPropSelected is modified by the didConnect 
				the observer will be fired again, this has to be prevented.
				 */
				if (changeObj === undefined) {
					this.preventObserver = true;
				}
				this.setData('ltPropSelected', valuesToBeAdded);
				this.preventObserver = false;
				valuesToBeAdded.forEach(function (cbox) {
					that.check(cbox);
				});
				// Remaining elements
				var valuesToBeRemoved = selectedList.slice(maxCount);
				valuesToBeRemoved.forEach(function (cbox) {
					that.uncheck(cbox);
				});
			}
		}
		if (removedValues) {
			removedValues.forEach(function (cbox) {
				that.uncheck(cbox);
			});
		}
	}
} );

/**
 * @syntax nonYielded
 * <lyte-checkbox-group lt-prop-options='[{"name": "Option 1", "value": "1"}, {"name": "Option 2", "value": "2"}]' lt-prop-user-value="name" lt-prop-system-value="value"></lyte-checkbox-group>
 */