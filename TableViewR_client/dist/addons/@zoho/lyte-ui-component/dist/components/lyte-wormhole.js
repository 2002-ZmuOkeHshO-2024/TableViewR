/**
 * This component is used to append a dom anywhere in the document
 * @component lyte-wormhole
 * @version 2.2.6
 * @methods onBeforeAppend,onAppend
 */


Lyte.Component.register("lyte-wormhole",{
_template:"<template tag-name=\"lyte-wormhole\"> <lyte-yield yield-name=\"lyte-content\"></lyte-yield> </template>",
_dynamicNodes : [{"type":"insertYield","position":[1]}],
_observedAttributes :["ltPropQuery","ltPropAppendOnCreation","ltPropAppend","ltPropShow","ltPropFocusOnClose","stackMap"],


	data : function(){
		return {
			/**
			 * @componentProperty {string} ltPropQuery
			 * @version 2.2.6
			 */
			'ltPropQuery' : Lyte.attr( 'string' ),

			'ltPropAppendOnCreation': Lyte.attr( 'boolean', { 'default': true } ),

			'ltPropAppend': Lyte.attr( 'boolean', { 'default': false } ),

			'ltPropShow' : Lyte.attr('boolean' , {	'default' : false }),

			'ltPropFocusOnClose':  Lyte.attr('boolean' , {	'default' : false }),

			'stackMap': Lyte.attr('object',{ default: {
				'LYTE-MODAL': 'modalStack',
				'LYTE-BETA-MODAL': 'betaModalStack',
				'LYTE-BETA-POPOVER': 'betaPopoverStack',
				'LYTE-POPOVER': 'popoverStack',
				'LYTE-MESSAGEBOX': 'messageboxStack',
				'LYTE-ALERT': 'alertStack',
				'LYTE-COLORBOX': 'colorboxStack'
			}})
		}
	},

	didDestroy: function() {
		var utilObj = this.createUtilObj(this);
		this.handleRemovalFromStack( utilObj );

		this.parent = null;
		if( _lyteUiUtils && 
				_lyteUiUtils.popupStack && 
					_lyteUiUtils.popupStack.globalStack && 
						_lyteUiUtils.popupStack.globalStack.length <= 0 ){
						
			_lyteUiUtils.popupStack=null;
		}
	},

	initFunc: function() {

		if(!_lyteUiUtils.popupStack){
            _lyteUiUtils.popupStack = {
				globalStack:[],
				modalStack:[],
				betaModalStack:[],
				betaPopoverStack:[],
				popoverStack:[],
				alertStack:[],
				messageboxStack:[],
				colorboxStack:[]
			};
        }

		var utilObj = this.createUtilObj(this);

		if(this.$node.getData('ltPropShow')){
			this.handleInsertionIntoStack( utilObj );
		}
		else {
			this.handleRemovalFromStack( utilObj );
		}

	}.observes( 'ltPropQuery','ltPropShow' ).on('init'),

	didConnectFunc :function(){
		var appendOnCreation = this.getData( 'ltPropAppendOnCreation' );

		if( !appendOnCreation ) {
			return ;
		}

		// this.appendContent();
		this.$node.ltProp( 'append', true );
	}.observes( 'ltPropQuery' ).on( 'didConnect' ),

	appendObserver: function() {
		var append = this.getData( 'ltPropAppend' );

		if( append ) {
			this.appendContent();
		}
		else {
			this.bringContentBack();
		}
	}.observes( 'ltPropAppend' ),

	appendContent: function() {
		var ret, 
		outlet = this.data.ltPropQuery ? document[  _lyteUiUtils.isWidget ? "querySelectorGlobal" : 'querySelector' ]( this.data.ltPropQuery ) : document.body;

		if( !outlet ) {
			console.error( 'Provide valid outlet to append' );
			return;
		}

		if( this.getMethods( 'onBeforeAppend' ) && this.executeMethod( 'onBeforeAppend', this.$node, outlet ) == false ) {
			return;
		}
		this.parent = this.$node.parentElement;
		_lyteUiUtils.appendChild( outlet, this.$node );
		this.appended = true;

		if( this.getMethods( 'onAppend' ) ) {
			this.executeMethod( 'onAppend', this.$node, outlet )
		}
	},

	bringContentBack: function() {
		_lyteUiUtils.appendChild( this.parent, this.$node );
	},

	createUtilObj: function( wormhole ){
		var utilObj={};

		if(wormhole.parent){
			utilObj.parentElement=wormhole.parent;
		} else {
			utilObj.parentElement=wormhole.$node.parentElement;
		}
		utilObj.focusedElement=document.activeElement;
		utilObj.childElement = wormhole.$node;

		return utilObj;
	},

	popUtilObj: function( utilObj, stackName, wormhole ){
		if( !utilObj || !_lyteUiUtils || !_lyteUiUtils.popupStack || !_lyteUiUtils.popupStack[stackName]){
			return;
		}

		if( _lyteUiUtils.popupStack[stackName].length>=1){
			_lyteUiUtils.popupStack[stackName].forEach(function(ele,ind){
					if(ele.parentElement==utilObj.parentElement){
						Lyte.arrayUtils( _lyteUiUtils.popupStack[stackName], 'removeAt' , ind , 1 );
						return;
					}
			}.bind(wormhole));
		}
	},

	handleInsertionIntoStack: function( utilObj ){

			if( !utilObj || !utilObj.parentElement || !utilObj.parentElement.tagName ){
				return;
			}
			var tagName = utilObj.parentElement.tagName;
			var stackName = this.getData('stackMap')[tagName];

			Lyte.arrayUtils( _lyteUiUtils.popupStack.globalStack, 'push', utilObj);

			if( stackName ){
				Lyte.arrayUtils( _lyteUiUtils.popupStack[stackName], 'push', utilObj);
			}
	},

	handleRemovalFromStack: function( utilObj ){

		if( !_lyteUiUtils || !_lyteUiUtils.popupStack || !_lyteUiUtils.popupStack.globalStack ){
			return;
		}
		if( !utilObj || !utilObj.parentElement || !utilObj.parentElement.tagName ){
			return;
		}

		var tagName = utilObj.parentElement.tagName;
		var stackName = this.getData('stackMap')[tagName];
		var lastActiveElement;

		if(_lyteUiUtils.popupStack.globalStack.length >= 1){

			if( stackName ){
				this.popUtilObj( utilObj, stackName, this );
			}

			var focusElement, changeFocus=true;
			_lyteUiUtils.popupStack.globalStack.forEach(function(ele,ind){
				if(ele.parentElement==utilObj.parentElement){
					if(ind<_lyteUiUtils.popupStack.globalStack.length-1){
						changeFocus=false;
						_lyteUiUtils.popupStack.globalStack[ind+1].focusedElement =	_lyteUiUtils.popupStack.globalStack[ind].focusedElement;
					}
					focusElement=Lyte.arrayUtils( _lyteUiUtils.popupStack.globalStack , 'removeAt' , ind , 1 );
					return;
				}
			}.bind(this));

			if(focusElement && focusElement[0]){
				lastActiveElement= focusElement[0].focusedElement;
			}
			if(changeFocus && lastActiveElement && this.getData('ltPropFocusOnClose')){
					lastActiveElement.focus();	
			}
		}
	}
});

/**
 * @syntax yielded
 * <lyte-wormhole>
 * 	  <template is = "registerYield" yield-name = "lyte-content">
 * 		 Some wormhole content
 *	  </template>
 * </lyte-wormhole>
 */