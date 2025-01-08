Lyte.Component.register( 'lyte-code-snippet', {
_template:"<template tag-name=\"lyte-code-snippet\"> <div class=\"lyteCSHeader\"> <template is=\"if\" value=\"{{ltPropTitle}}\"><template case=\"true\"> <div class=\"lyteCSTitle\"> {{ltPropTitle}} </div> </template></template> <template is=\"if\" value=\"{{expHandlers(ltPropCopyButtonAppearance,'===',&quot;text&quot;)}}\"><template case=\"true\"> <lyte-button class=\"lyteCSCopyButton\" onclick=\"{{action('copyCode')}}\"> <template is=\"registerYield\" yield-name=\"text\"> copy </template> </lyte-button> </template><template case=\"false\"> <span class=\"lyteCSCopyIcon\" onclick=\"{{action('copyCode')}}\" lt-prop-title=\"{{ltPropCopyTooltipText}}\" lt-prop-tooltip-config=\"{&quot;position&quot;: &quot;bottom&quot;}\"></span> </template></template> </div> <div class=\"lyteCSContainer\" style=\"height: 400px;\" onscroll=\"{{action('alignCodeAndLineContainer',event)}}\"> <template is=\"if\" value=\"{{ltPropShowLineNumber}}\"><template case=\"true\"> <div class=\"lyteCSLineNumberContainer\"> </div> </template></template> <div class=\"lyteCSCodeContainer\"></div> </div> </template>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"attr","position":[3,1]},{"type":"if","position":[3,1],"cases":{"true":{"dynamicNodes":[]}},"default":{}}],
_observedAttributes :["ltPropCode","ltPropType","ltPropInitialLineCount","ltPropLinesPerScroll","ltPropLazyLoading","ltPropShowLineNumber","ltPropTitle","ltPropCopyMessagePreview","ltPropCopyMessageOnSuccess","ltPropCopyMessageOnFailure","ltPropCopyButtonAppearance","ltPropCopyTooltipText"],

	data: function() {
		return {
			'ltPropCode': Lyte.attr( 'string', { 'default': '' } ),
			'ltPropType': Lyte.attr( 'string', { 'default': 'js' } ),
			'ltPropInitialLineCount': Lyte.attr( 'number', { 'default': 100 } ),
			'ltPropLinesPerScroll': Lyte.attr( 'number', { 'default': 100 } ),
			'ltPropLazyLoading': Lyte.attr( 'boolean', { 'default': false } ),
			'ltPropShowLineNumber': Lyte.attr( 'boolean', { 'default': true } ),
			'ltPropTitle': Lyte.attr( 'string', { 'default': '' } ),
			'ltPropCopyMessagePreview': Lyte.attr('boolean', { 'default': true }),
			'ltPropCopyMessageOnSuccess': Lyte.attr( 'string', { 'default': _lyteUiUtils.i18n( 'lyte.codesnippet.success.message' ) } ),
			'ltPropCopyMessageOnFailure': Lyte.attr( 'string', { 'default': _lyteUiUtils.i18n( 'lyte.codesnippet.failure.message' ) } ),
			'ltPropCopyButtonAppearance': Lyte.attr( 'string', { 'default': _lyteUiUtils.resolveDefaultValue( 'lyte-code-snippet', 'copyButtonAppearance', 'text' ) } ),
			'ltPropCopyTooltipText': Lyte.attr( 'string', { 'default': _lyteUiUtils.resolveDefaultValue( 'lyte-code-snippet', 'copyTooltipText', _lyteUiUtils.i18n( "lyte.codesnippet.copy" ) ) } )
		};
	},

	didConnect: function() {
		this.createMessageBox();
	},

	createMessageBox: function() {
		if( this.getMessageBox() ) {
			return ;
		}

		var messageBox = document.createElement( 'lyte-messagebox' );

		messageBox.setAttribute( 'id', 'lyteCSMessageBox' );

		if( _lyteUiUtils.appendLocation === 'first' ) {
			document.body.insertBefore( messageBox, document.body.children[ 0 ] );
		}
		else {
			document.body.appendChild( messageBox );
		}
	},

	tokenizeAndBuild: function() {
		var type = this.getData( 'ltPropType' ) || 'js',
		code = this.getData( 'ltPropCode' );

		if( !this.isContainerEmpty() ) {
			this.removeBuiltCode();
		}

		if( code ) {
			var builder = $L.snippets.getBuilder( type, code ),
			result = builder.build();
			this.fixDimensionsAndAppend( result.snippet );
			this.buildLineNumbers(result.lineCount);

		}

	}.observes(
		'ltPropCode'
	)
	.on( 'didConnect' ),

	buildLineNumbers: function( totalLines ) {
		var docFrag = document.createDocumentFragment(),
		showLineNumber = this.getData( 'ltPropShowLineNumber' );

		if( !showLineNumber ) {
			return ;
		}

		for( var i = 1; i <= totalLines; i++ ) {
			var line = document.createElement( 'span' );

			line.setAttribute( 'class', 'lyteCSLineNumber' );
			line.textContent = i;
			docFrag.appendChild( line );
		}

		this.getLineNumberContainer().appendChild( docFrag );
	},

	isContainerEmpty: function() {
		var children = this.getChildren();

		return children.length === 0;
	},

	getChildren: function() {
		var container = this.getSnippetContainer();

		return container.children;
	},

	removeBuiltCode: function() {
		var container = this.getSnippetContainer(),
		lineNumberContainer = this.getLineNumberContainer();

		container.innerHTML = '';

		if( lineNumberContainer ) {
			lineNumberContainer.innerHTML = '';
		}
	},

	fixDimensionsAndAppend: function( snippet, highlighterObj ) {
		var lazyLoading = this.getData( 'ltPropLazyLoading' ),
		container = this.getSnippetContainer(),
		lineCount = ( highlighterObj || {} ).lineCount;

		if( lazyLoading ) {
			totalHeight = height * lineCount;
			container.style.height = totalHeight + 'px';
		}

		container.appendChild( snippet );
	},

	getSnippetContainer: function() {
		return this.$node.querySelector( '.lyteCSCodeContainer' );
	},

	getLineNumberContainer: function() {
		return this.$node.querySelector( '.lyteCSLineNumberContainer' );
	},

	isEmpty: function( element ) {
		return !element.querySelector( '*' );
	},

	displaySuccessMessage: function() {
		var messageBox = this.getMessageBox();

		messageBox.ltProp( 'message', this.getData( 'ltPropCopyMessageOnSuccess' ) );
		messageBox.ltProp( 'type', 'success' );
		messageBox.ltProp( 'show', true );
	},

	getMessageBox: function() {
		return document.getElementById( 'lyteCSMessageBox' );
	},

	displayFailureMessage: function() {
		var messageBox = this.getMessageBox();

		messageBox.ltProp( 'message', this.getData( 'ltPropCopyMessageOnFailure' ) );
		messageBox.ltProp( 'type', 'error' );
		messageBox.ltProp( 'show', true );
	},

	actions: {
		alignCodeAndLineContainer: function( event ) {
			var codeContainer = event.target,
			scrollPosition = codeContainer.scrollTop,
			showLineNumber = this.getData( 'ltPropShowLineNumber' );

			if( !showLineNumber ) {
				return ;
			}

			this.getLineNumberContainer().scrollTop = scrollPosition;
		},

		copyCode: function () {

			if (this.getMethods('onBeforeCopy')) {
				this.executeMethod('onBeforeCopy', this);
			}
			var messagePreview = this.getData('ltPropCopyMessagePreview');
			// var text = this.getData('ltPropCode') || '';
			var text = this.$node.querySelector('.lyteCSCodeContainer').innerText || '';
			var that = this;
			if( _lyteUiUtils.copy2clip ) {
				_lyteUiUtils.copy2clip(text.replace(/&/g, '&amp;').replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/</g, '&lt;').replace(/>/g, '&gt;'),
					function () {
						if (messagePreview) {
							var messageBox = document.getElementById('lyteCSMessageBox');
							messageBox.ltProp('message', that.getData('ltPropCopyMessageOnSuccess'));
							messageBox.ltProp('type', 'success');
							messageBox.ltProp('show', true);
						}
					},
					function () {
						if (messagePreview) {
							var messageBox = document.getElementById('lyteCSMessageBox');
							messageBox.ltProp('message', that.getData('ltPropCopyMessageOnFailure'));
							messageBox.ltProp('type', 'error');
							messageBox.ltProp('show', true);
						}
				} )
			}
			else {
				if (messagePreview) {
					navigator.clipboard.writeText(text).then(function () {
						that.displaySuccessMessage();
					}, function (err) {
						that.displayFailureMessage();
					});
				}
			}
		}
	}
} );