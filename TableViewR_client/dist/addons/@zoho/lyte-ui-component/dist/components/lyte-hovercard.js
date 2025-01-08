/**
 * Renders a hovercard
 * @component lyte-hovercard
 * @dependencies lyte-popover
 * /components/lyte-popover.js
 * /theme/compiledCSS/default/ltr/lyte-ui-popover.css
 * @version  3.1.0
 * @methods beforeRender,afterRender,onHovercardShow,onHovercardHide,onHovercardBeforeHide
 */
Lyte.Component.register( 'lyte-hovercard', {
_template:"<template tag-name=\"lyte-hovercard\"> <template is=\"if\" value=\"{{ltPropShow}}\"><template case=\"true\"> <lyte-wormhole case=\"{{ltPropShow}}\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"hoverCardWrapper {{ltPropClass}}\" id=\"{{ltPropId}}\"> <lyte-yield yield-name=\"hoverCardYield\"></lyte-yield> </div> </template> </lyte-wormhole> </template></template> <template is=\"if\" value=\"{{ltPropUseBetaPopover}}\"><template case=\"true\"> <lyte-beta-popover class=\"lyteHoverCard\" lt-prop=\"{{stringify(ltPropPopover)}}\" lt-prop-close-on-scroll=\"{{ltPropCloseOnScroll}}\" lt-prop-aria=\"{{ltPropAria}}\" lt-prop-aria-attributes=\"{{ltPropAriaAttributes}}\" lt-prop-wrapper-class=\"lyteHovercardPopover {{ltPropPopoverWrapperClass}} {{if(ltPropFollowCursor,'lyteHoverCardFollowCursor','')}}\" lt-prop-close-on-body-click=\"false\" lt-prop-type=\"{{ltPropType}}\" lt-prop-show-close-button=\"false\" lt-prop-bind-to-body=\"true\" lt-prop-placement=\"{{ltPropPlacement}}\" lt-prop-offset=\"{{ltPropOffset}}\" lt-prop-close-on-escape=\"{{ltPropCloseOnEscape}}\" lt-prop-prevent-focus=\"{{ltPropPreventFocus}}\" lt-prop-dimmer=\"{{ltPropDimmer}}\" lt-prop-animation=\"{{ltPropAnimation}}\" lt-prop-auto-align=\"{{ltPropAutoAlign}}\" on-before-close=\"{{method(&quot;onPopoverBeforeClose&quot;)}}\" on-close=\"{{method(&quot;onPopoverClose&quot;)}}\" on-before-show=\"{{method(&quot;onPopoverBeforeShow&quot;)}}\" on-show=\"{{method(&quot;onPopoverBeforeShow&quot;)}}\"> <template is=\"registerYield\" yield-name=\"popover\"> </template> </lyte-beta-popover> </template><template case=\"false\"> <lyte-popover class=\"lyteHoverCard\" lt-prop=\"{{stringify(ltPropPopover)}}\" lt-prop-close-on-scroll=\"{{ltPropCloseOnScroll}}\" lt-prop-aria=\"{{ltPropAria}}\" lt-prop-aria-attributes=\"{{ltPropAriaAttributes}}\" lt-prop-wrapper-class=\"lyteHovercardPopover {{ltPropPopoverWrapperClass}} {{if(ltPropFollowCursor,'lyteHoverCardFollowCursor','')}}\" lt-prop-close-on-body-click=\"false\" lt-prop-type=\"{{ltPropType}}\" lt-prop-show-close-button=\"false\" lt-prop-bind-to-body=\"true\" lt-prop-placement=\"{{ltPropPlacement}}\" lt-prop-offset=\"{{ltPropOffset}}\" lt-prop-close-on-escape=\"{{ltPropCloseOnEscape}}\" lt-prop-prevent-focus=\"{{ltPropPreventFocus}}\" lt-prop-dimmer=\"{{ltPropDimmer}}\" lt-prop-animation=\"{{ltPropAnimation}}\" lt-prop-auto-align=\"{{ltPropAutoAlign}}\" on-before-close=\"{{method(&quot;onPopoverBeforeClose&quot;)}}\" on-close=\"{{method(&quot;onPopoverClose&quot;)}}\" on-before-show=\"{{method(&quot;onPopoverBeforeShow&quot;)}}\" on-show=\"{{method(&quot;onPopoverBeforeShow&quot;)}}\"> <template is=\"registerYield\" yield-name=\"popover\"> </template> </lyte-popover> </template></template> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}}},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1,1]}]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropDisplay","ltPropShow","ltPropOriginElem","ltPropMaxHeight","ltPropWidth","ltPropHeight","ltPropPlacement","ltPropClass","ltPropId","ltPropShowDelay","ltPropHideDelay","ltPropMaxDisplayTime","ltPropKeepAlive","ltPropFollowCursor","ltPropPopoverWrapperClass","ltPropOffset","ltPropCloseOnEscape","ltPropAutoShow","ltPropHideOnClick","ltPropAria","ltPropAriaAttributes","ltPropPreventFocus","ltPropMaxWidth","ltPropType","ltPropDimmer","ltPropAnimation","ltPropAutoAlign","ltPropPopover","ltPropCloseOnScroll","ltPropUseBetaPopover","mousePosition","mouseover","originEle","popoverTagName"],

  data : function(){
    return {
      /** 
       * @componentProperty {boolean} ltPropDisplay=true
       * @version 3.1.0
       */
      'ltPropDisplay' : Lyte.attr( 'boolean', { 'default' : true } ),
      /** 
       * @componentProperty {boolean} ltPropShow=false
       * @version 3.1.0
       */
        'ltPropShow' : Lyte.attr( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {string} ltPropOriginElem=''
       * @version 3.1.0
       */
        'ltPropOriginElem' : Lyte.attr( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropMaxHeight=''
       * @version 3.1.0
       */
        'ltPropMaxHeight' : Lyte.attr( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropWidth=''
       * @version 3.1.0
       */
        'ltPropWidth' : Lyte.attr( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropHeight=auto
       * @version 3.1.0
       */
        'ltPropHeight' : Lyte.attr( 'string', { 'default' : 'auto' } ),
        /** 
       * @componentProperty {string} ltPropPlacement=''
       * @version 3.1.0
       */
        'ltPropPlacement' : Lyte.attr( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {number} ltPropClass=''
       * @version 3.1.0
       */
        'ltPropClass' : Lyte.attr( 'string', { 'default' : _lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'class', '' ) } ),
        /** 
       * @componentProperty {string} ltPropId=''
       * @version 3.1.0
       */
        'ltPropId' : Lyte.attr( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {number} ltPropShowDelay=0
       * @version 3.1.0
       */
        'ltPropShowDelay' : Lyte.attr( 'number', { 'default': 0 } ),
        /** 
       * @componentProperty {number} ltPropHideDelay=0
       * @version 3.1.0
       */
        'ltPropHideDelay' : Lyte.attr( 'number', { 'default': 0 } ),
        /** 
       * @componentProperty {number} ltPropMaxDisplayTime=5000
       * @version 3.1.0
       */
        'ltPropMaxDisplayTime' : Lyte.attr( 'number', { 'default' : 5000 } ),
        /** 
       * @componentProperty {boolean} ltPropKeepAlive=false
       * @version 3.1.0
       */
        'ltPropKeepAlive' : Lyte.attr( 'boolean', { 'default' : true } ),
        /** 
       * @componentProperty {boolean} ltPropFollowCursor=false
       * @version 3.1.0
       */
        'ltPropFollowCursor' : Lyte.attr( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {string} ltPropPopoverWrapperClass
       * @version 3.1.0
       */
        'ltPropPopoverWrapperClass' : Lyte.attr( 'string',{'default': _lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'popoverWrapperClass', '' ) }),
        /** 
       * @componentProperty {object} ltPropOffset={}
       * @version 3.1.0
       */
        'ltPropOffset' : Lyte.attr( 'object', { 'default' : {} } ),
        /** 
       * @componentProperty {boolean} ltPropCloseOnEscape=true
       * @version 3.1.0
       */
        'ltPropCloseOnEscape' : Lyte.attr( 'boolean', { 'default' : true } ),
        /** 
        * @componentProperty {boolean} ltPropAutoShow=false
        * @version 3.1.0
        */
        'ltPropAutoShow' : Lyte.attr( 'boolean', { 'default' : true}),
         /** 
        * @componentProperty {boolean} ltPropHideOnClick=false
        * @version 3.1.0
        */
        'ltPropHideOnClick' : Lyte.attr( 'boolean', { 'default' : _lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'hideOnClick', false ) } ),
         /**
          * @componentProperty {boolean} ltPropAria
          * @version 3.1.0
          * @default false
          *
          */
        "ltPropAria" : Lyte.attr( 'boolean', { default : false } ),
        /**
         * @componentProperty {object} ltPropAriaAttributes={}
         * @version 3.1.0
         */
        "ltPropAriaAttributes" : Lyte.attr( 'object', { default : {} } ),
         /**
         * @componentProperty {boolean} ltPropPreventFocus=true
         */
        "ltPropPreventFocus" : Lyte.attr('boolean', { default : true } ),
         /**
         * @componentProperty {string} ltPropMaxWidth
         */
        "ltPropMaxWidth" : Lyte.attr('string',{default:''}),
        "ltPropType" : Lyte.attr('string',{default :'callout'}),
        "ltPropDimmer":Lyte.attr("object",{"default":{"color":"black","opacity":"0.4"}}),
        "ltPropAnimation":Lyte.attr("string",{"default":"fade"}), //fade,zoom
        "ltPropAutoAlign" : Lyte.attr('boolean', {default : false}),
        "ltPropPopover" : Lyte.attr('object', { default : {} } ),
        "ltPropCloseOnScroll" : Lyte.attr('boolean', {default: true}),
        "ltPropUseBetaPopover" : Lyte.attr('boolean', { default : false}),
        'mousePosition' : Lyte.attr( 'array', { 'default' : [] } ),
        'mouseover' : Lyte.attr( 'boolean', { 'default' : false } ),
        'originEle' : Lyte.attr( 'string', { 'default' : ''}),
        'popoverTagName' : Lyte.attr('string', {'default':'lyte-popover'})
    }   
  },
  init : function() {
    if( this.getMethods( 'beforeRender' ) ){
            this.executeMethod( 'beforeRender', this.$node );
    }
    if(this.getData('ltPropUseBetaPopover')){
        this.setData('popoverTagName', 'lyte-beta-popover')
    }
 },
  didConnect : function(){
    
    this._popover = this.$node.getElementsByTagName( this.getData('popoverTagName') )[0]
   this._hovercardScroll = this.hovercardScroll.bind( this );
    this._hovercardHideOnClick = this.hovercardHideOnClick.bind(this)
    this._mousemove = this.mousemove.bind(this);
    this._oriEleMouseMove = this.oriEleMousemove.bind(this)
    this._originEleFocus = this.originEleFocus.bind(this)
    this._originEleBlur= this.originEleBlur.bind(this)
    if(this.getData('ltPropOriginElem')){
      try{
        const originElement = this.getOriginElement(this.getData('ltPropOriginElem'))
        if(!originElement){
          console.error("Provide a valid selector for 'ltPropOriginElem'; '"+this.getData('ltPropOriginElem') +"' is not a valid origin selector for the Hovercard component");
        }
        
      } catch(err){
        console.warn("Provide a valid selector for 'ltPropOriginElem'; '"+this.getData('ltPropOriginElem') +"' is not a valid origin element selector for the Hovercard component");
      }
    }
    if(this.getData('ltPropAutoShow') && this.getData('ltPropOriginElem')){
      this.setMouseMove()
      this.addMutationObserver()
      this.addFocusAndBlur()
    }
    $L.fastdom.measure( function() {
         var fg = window.getComputedStyle( this.$node ).getPropertyValue( 'direction' ) == 'rtl';
         $L.fastdom.mutate( function(){
           if( fg ) {
             this.direction = true;
           }
         }.bind( this ) )
    }.bind( this ) )
    _lyteUiUtils.dispatchEvent( 'afterrender', this.$node ); 

    if( this.getMethods( 'afterRender' ) ) {
       this.executeMethod('afterRender', this.$node);
    }
    this.$node.alignHovercard = function(){
      this._popover = this._popover || this.$node.getElementsByTagName( this.getData('popoverTagName'))[0]
      if(this._popover && this._popover.alignPopover){
        this._popover.alignPopover()
      }
    }.bind( this ) 
    this.$node.calculateOffset = function(){
      this._popover = this._popover || this.$node.getElementsByTagName( this.getData('popoverTagName'))[0]
      if(this._popover && this._popover.calculateOffset){
        this._popover.calculateOffset()
      }
    }.bind( this ) 
  },
  didDestroy : function(){
    this.$node.classList.remove('lyteActive')
    if( this.getData( 'ltPropHideOnClick') ){
      document.removeEventListener( 'click' , this._hovercardHideOnClick )
    }
    if(this.$node.ltProp( 'originElem' ) ){
      var originElem = this.getOriginElement( this.$node.ltProp( 'originElem' ) ) 

      if(originElem ){
        this._closeHoverCard && originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
        this.removeEventListenerForOriginElem(originElem)
        if(this.getData('ltPropAutoShow')){
          this.removeFocusAndBlur(originElem)
          this.removeMutationObserver()
          this.removeFocusAndBlur(originElem)
        }
      }
    }
   
    if(this._popover){
      this._popover.setData('ltPropShow',false)
    }
    if(_lyteUiUtils.lyteHovercard){
      delete _lyteUiUtils.lyteHovercard[this.$node.ltProp( 'originElem' ) ]

    }
    if( this._childComp ){
      this._childComp.remove()
    }
    if(this.getData('ltPropAutoShow')){
      var eventName = (window.document === document ? 'mousemove' : 'mouseover')

      document.removeEventListener(eventName,this._mousemove)
    }
    delete this.prevHoverCardNode;
    delete this._childComp;
    delete this._popover;
  },
  addFocusAndBlur : function(){
    const originElem = this.getOriginElement(this.getData('ltPropOriginElem'))
    if( originElem ){
      originElem.addEventListener('focus', this._originEleFocus)
      originElem.addEventListener('blur', this._originEleBlur)
    }
   
  },
  removeFocusAndBlur : function(originElem){
    if( originElem ){
      originElem.removeEventListener('focus', this._originEleFocus)
      originElem.removeEventListener('blur', this._originEleBlur)
    }
  },
  originEleFocus : function(event){
    if(!this.getData('ltPropShow')){
      this.setData('ltPropShow', true)
    }

  },
  originEleBlur : function(){
    if(this.getData('ltPropShow')){
      this.setData('ltPropShow', false)
    }
  },
  setMaxHeightAndWidth: function(div){
    if(this.getData('ltPropMaxWidth')){
      div.style.maxWidth = this.getData('ltPropMaxWidth')
      
    }
    if(this.getData('ltPropMaxHeight')){
      div.style.maxHeight = this.getData('ltPropMaxHeight')
      div.classList.add('lyteHovercardWithMaxHeight')
    }
  },
   isNode: function(target){
    return target instanceof HTMLElement || target instanceof Node;  

  },
  addEventListenerForOriginElem : function( originElem ) {
    if(originElem){
      originElem.addEventListener( 'mousemove', this._oriEleMouseMove )
    }
  },
  removeEventListenerForOriginElem : function(originElem ) {
    if(originElem){
      originElem.removeEventListener( 'mousemove', this._oriEleMouseMove )
    }
    this.setData( 'mousePosition', [] )
    this.setData( 'mouseover', false )

  },
  hovercardHideOnClick : function(event){
    var target = event.target,
    popoverWormhole = this._popover.component.actualModalDiv;
    if( this.getData( 'ltPropHideOnClick' ) && this.getData( 'ltPropShow' ) && this.isNode(target) && !( target === popoverWormhole || popoverWormhole.contains( target ) ) ){
          this.setData( 'ltPropShow', false )
      }
  },
  oriEleMousemove : function( eve ) {

    if( !this.getData( 'mouseover' ) ) {
        this.mouseovereve( eve )
        this.setData( 'mouseover', true )
    }
    var currMpos = [ eve.clientX, eve.clientY ];
    var mpos = this.getData( 'mousePosition' );
    var diff = [ currMpos[ 0 ] - ( mpos[ 0 ]? mpos[ 0 ] : 0 ), currMpos[ 1 ] - ( mpos[ 1 ] ? mpos[ 1 ] : 0 ) ];
    if( this._popover.ltProp( 'show' ) && this._popover.component.childComp) {
      var popupEle = $L( '.lyteHoverCardFollowCursor .lytePopover' ,this._popover.component.childComp)[ 0 ];
      var clientRect = popupEle.getBoundingClientRect();
      popupEle.style.top = clientRect.top + diff[ 1 ] + 'px';
      popupEle.style.left = clientRect.left + diff[ 0 ] + 'px';
    }
    this.setData( 'mousePosition', currMpos );
  },
  mouseovereve : function( eve ) {
    var mpos = [ eve.clientX, eve.clientY ];
    var pos = '';
    
    this._popover.ltProp( {
      offset : { left : mpos[ 0 ] - 9, top : mpos[ 1 ] - 9, height : 18, width : 18 }
    } )
    this.setData('ltPropOffset',{ left : mpos[ 0 ] , top : mpos[ 1 ] , height : 18, width : 18 })
    this.setData( 'mousePosition', mpos );
  },
  mousemove : function(event){
    var nodeName1 = event.target.correspondingElement || event.target;
    while(nodeName1 && nodeName1.tagName != 'BODY' && nodeName1 != document && nodeName1.tagName != 'HTML' && !( nodeName1 instanceof ShadowRoot )  ){
        var iHovercard = nodeName1.getAttribute( 'lyte-hovercard' );

        if( iHovercard ){
          var hovercard = this.findMatchingHoverCard(nodeName1);
          if( hovercard && !hovercard.getData('ltPropShow')){
             hovercard.setData('ltPropShow',true);
          } 
          break;
          
        }
        else {
            nodeName1 = nodeName1.parentNode;
        }  
    }
  
},
 findMatchingHoverCard : function(node){
   for(var item in _lyteUiUtils.lyteHovercard){
      if(node.matches(item)){
        return _lyteUiUtils.lyteHovercard[item];
      }
  }
 },
 setMouseMove : function(){
    var map = _lyteUiUtils.lyteHovercard ? _lyteUiUtils.lyteHovercard : []
    map[this.$node.ltProp( 'originElem' )] = this.$node;
    _lyteUiUtils.lyteHovercard = map;
    var eventName = (window.document === document ? 'mousemove' : 'mouseover')
    document.addEventListener(eventName,this._mousemove)
  },
  
  compouteOffset : function( popover ) {
      var arr = [ 'ltPropWidth', 'ltPropHeight' ];
      for( var i = 0; i < arr.length; i++ ) {
            if( this.getData( arr[ i ] ) ) {
                  popover.setData( arr[ i ], this.getData( arr[ i ] ) )
            }
       }
  },
  createHoverCard : function( event, popoverWormhole ) {
    var popover = this._popover
    if(popover){
      _lyteUiUtils.dispatchEvent( 'beforeshow', this.$node, { originalEvent: event } ); 
       var res = true;
        if( this.getMethods( 'onBeforeHovercardShow' ) ) {
          res = this.executeMethod('onBeforeHovercardShow', this.$node );
        }
        if(!res){
          this.setData('ltPropShow', false)
          return false
        }
        popover.ltProp( 'show', true )
        popover.ltProp( 'allowMultiple', true)
        this.$node.classList.add( 'lyteActive' )
        if( this.getMethods( 'onHovercardShow' ) ) {
                this.executeMethod('onHovercardShow', this.$node );
        }
    }
    if( !this.getData( 'ltPropKeepAlive' ) && !this.getData('ltPropFollowCursor')) {
          var originElem = this.getOriginElement( this.$node.ltProp( 'originElem' ) )

          popover._maxdisp = setTimeout( function() {
            this.removeHoverCard(popover, originElem, event, popoverWormhole)
          }.bind( this ), this.getData( 'ltPropMaxDisplayTime' ) );
    }
    
  },
  removeTimeout : function( popover ) {
        clearTimeout( popover._settime )
        clearTimeout( popover._maxdisp )
        clearTimeout( popover._bodyTimeout )
  },
  getOriginElement : function(selector){
    var originElem = (window.document === document ? document.querySelector(selector) : document.querySelectorGlobal(selector))
    return originElem
  },
  originEleObs : function(arg){
    if(this.getData('ltPropOriginElem')){
      try{
        const originElement = this.getOriginElement(this.getData('ltPropOriginElem'))
        if(!originElement){
          console.error("Provide a valid selector for 'ltPropOriginElem'; '"+this.getData('ltPropOriginElem') +"' is not a valid origin selector for the Hovercard component");
        }
        
      } catch(err){
        console.warn("Provide a valid selector for 'ltPropOriginElem'; '"+this.getData('ltPropOriginElem') +"' is not a valid origin element selector for the Hovercard component");
      }
    }
    if( arg.oldValue && _lyteUiUtils.lyteHovercard){
      var originElem = this.getOriginElement( arg.oldValue  )  
      if(originElem ){
        this._closeHoverCard && originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
        this.removeEventListenerForOriginElem(originElem)
        this.removeFocusAndBlur(originElem)
        arg.oldValue && this.removeMutationObserver(arg.oldValue)
        if(this.getData('ltPropAutoShow') && !this.getData('ltPropOriginElem')){
          var eventName = (window.document === document ? 'mousemove' : 'mouseover')

          document.removeEventListener(eventName,this._mousemove)
        }
      }
      delete _lyteUiUtils.lyteHovercard[ arg.oldValue ]
      this.getData('ltPropShow') && this.setData('ltPropShow', false)
      
      if(this.getData('ltPropOriginElem') ){
        _lyteUiUtils.lyteHovercard[this.getData( 'ltPropOriginElem' )] = this.$node
        this.addMutationObserver()
        this.addFocusAndBlur()
      }
    } else if(this.getData('ltPropAutoShow') && this.getData('ltPropOriginElem') ) {
       this.setMouseMove()
       this.addMutationObserver()
       this.addFocusAndBlur()
    }
  }.observes('ltPropOriginElem'),
  showToggled : function() {

      var popover = this._popover
      if( popover.component && !popover.getData( 'ltPropBindToBody' ) ) {
          popover.ltProp( 'bindToBody', true )
      }
      var wormHole = this._childComp.querySelector('.hoverCardWrapper' ),
       popoverWormhole = this._popover.component.actualModalDiv,
       originElem = this.getOriginElement( this.$node.ltProp( 'originElem' ) ) 
      if( this.getData( 'ltPropShow' ) && originElem ) {
          this.prevHoverCardNode = originElem;
          if( this.getData( 'ltPropHideOnClick') ){
              document.addEventListener( 'click' , this._hovercardHideOnClick )
          }
         
          _lyteUiUtils.appendChild( popoverWormhole, wormHole )

          popover.ltProp( 'originElem', this.getData( 'ltPropOriginElem' ) )
          popover.ltProp( 'freeze', false )
          popover.ltProp( 'duration', undefined )
          // popover.ltProp('offset',this.getData('ltPropOffset'))
          // popover.ltProp('preventFocus',this.getData('ltPropPreventFocus'))
          // popover.ltProp( 'closeOnEscape', this.getData( 'ltPropCloseOnEscape' ) )
          this.compouteOffset( popover );
          this.setMaxHeightAndWidth(wormHole)
          // if(this.getData('ltPropPopoverWrapperClass')){
          //    popover.setData( 'ltPropWrapperClass', popover.getData( 'ltPropWrapperClass' )+' '+ this.getData('ltPropPopoverWrapperClass'))
          // }
          if( this.getData( 'ltPropFollowCursor' ) ) {
              this.addEventListenerForOriginElem( originElem )
              // popover.setData( 'ltPropWrapperClass', popover.getData( 'ltPropWrapperClass' )+ ' lyteHoverCardFollowCursor' )
          }
        
          popover._settime = setTimeout( this.createHoverCard.bind( this ), this.getData( 'ltPropShowDelay' ), event, popoverWormhole );
          
          this._closeHoverCard = this.closeHoverCard.bind( this )
          originElem.addEventListener( 'mouseleave', this._closeHoverCard )
      }
      else{

          popover.ltProp( 'show', false )

          popover.ltProp( 'bindToBody', false )
          // popover.setData( 'ltPropWrapperClass', 'lyteHovercardPopover' )
          this.$node.classList.remove( 'lyteActive' )
          if(originElem){
            originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
          }
          if( this._popovermouseleave ){
              popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )

          }
           if( this.getData( 'ltPropHideOnClick') ){
            document.removeEventListener( 'click' , this._hovercardHideOnClick )
          }
          this.removeEventListenerForOriginElem( originElem )
          if( this.getMethods( 'onHovercardHide' ) ) {
              this.executeMethod( 'onHovercardHide', this.$node );
          }
          if( this.prevHoverCardNode ) {
              delete this.prevHoverCardNode
          }
          delete this._childComp;
          delete this._mousedownFlag;
          this.removeTimeout( popover )
      }
  }.observes( 'ltPropShow' ),
  addMutationObserver : function() {
    let self = this;
    
    const originElement = this.getOriginElement( this.getData('ltPropOriginElem') )
     this._observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for(let i =0; i < mutation.removedNodes.length; i++){
            const removedNode =  mutation.removedNodes[i]
            if (removedNode === originElement) {
                self.getData('ltPropShow') && self.setData('ltPropShow', false)
                _lyteUiUtils.lyteHovercard && _lyteUiUtils.lyteHovercard[ this.getData('ltPropOriginElem') ] && delete _lyteUiUtils.lyteHovercard[ this.getData('ltPropOriginElem') ]
                self._observer.disconnect()
                break
            }
          }
          mutation.removedNodes.forEach(removedNode => {
            
        });
        }
      }
    })
    const config = { childList: true};

    // Start observing the parent node
    originElement && this._observer.observe(originElement.parentElement, config);
  },
  removeMutationObserver : function(){
    this._observer && this._observer.disconnect()
    delete  this._observer
  },
  closeHoverCard : function( event ) {
      var wormHole = this._childComp,
       popoverWormhole = this._popover.component.actualModalDiv,
       popover = this._popover,
       originElem = this.getOriginElement( this.$node.ltProp( 'originElem' ) )
      if(  this.prevHoverCardNode && this.isNode(event.target) && ( this.getData('ltPropFollowCursor') || event.target == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.target ) ) && popoverWormhole && event.relatedTarget != popoverWormhole && !popoverWormhole.contains( event.relatedTarget )) {
                popover._bodyTimeout = setTimeout( this.removeHoverCard.bind( this ), this.getData( 'ltPropHideDelay' ), popover, originElem, event ) ;

          } else if( popoverWormhole  && this.isNode(event.relatedTarget ) && (event.relatedTarget == popoverWormhole || popoverWormhole.contains( event.relatedTarget )  )  ) {  
              this.removeTimeout( popover )
              this._popovermouseleave = this.popoverMouseLeave.bind( this )
              popoverWormhole.addEventListener( 'mouseleave', this._popovermouseleave )
              originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
  
           } 
  },
  removeHoverCard : function( popover, originElem, event, popoverWormhole ) {
    var res = true
    if(this.getMethods( 'onHovercardBeforeHide' ) ) {
          res = this.executeMethod( 'onHovercardBeforeHide', this.$node, event );
          if( !res && originElem){
              originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
              if( this._popovermouseleave && popoverWormhole ){
                popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
              }
          }
    }
    if( res && ( ( this.prevHoverCardNode  && this.isNode(event.target) && ( event.target == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.target ) ) ) || ( popoverWormhole  && this.isNode(event.target) && ( event.target == popoverWormhole || popoverWormhole.contains( event.target ) ) ) ) ){
            this.removeTimeout( popover )

            if( this.getData( 'ltPropShow' ) && popover ) {
                    this.setData( 'ltPropShow', false )
                    popover.setData( 'ltPropShow',false )
                }  
    }
  },
  popoverMouseLeave : function( event ) {
    var wormHole = this._childComp ,
    popoverWormhole = this._popover.component.actualModalDiv ,
    popover = this._popover ,
    originElem = this.getOriginElement( this.$node.ltProp( 'originElem' ) ),
    element =document.elementFromPoint(event.clientX, event.clientY)
   if( popoverWormhole  && this.isNode(event.target) && ( event.target == popoverWormhole || popoverWormhole.contains( event.target ) ) && event.relatedTarget != this.prevHoverCardNode && !this.prevHoverCardNode.contains( event.relatedTarget ) ) {
     popover._bodyTimeout = setTimeout( this.removeHoverCard.bind( this ), this.getData( 'ltPropHideDelay' ), popover, originElem, event, popoverWormhole );
   }
   else if( this.prevHoverCardNode  && this.isNode(event.relatedTarget) && ( event.relatedTarget == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.relatedTarget ) ) ) {
         popover._settime = setTimeout( this.createHoverCard.bind( this ), this.getData( 'ltPropShowDelay' ), event, popoverWormhole );
         this._closeHoverCard = this.closeHoverCard.bind( this )
         originElem.addEventListener( 'mouseleave', this._closeHoverCard )
         if( this._popovermouseleave ){
           popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
         }

   }
  }, 
  hovercardScroll : function( event ) {
    if($L(this.$node).hasClass("lyteActive")){
    var res = true
        var component = this,
            wormHole = component._childComp ,
            popoverWormhole = component._popover.component.actualModalDiv ,
            popover =component._popover ,
            originElem = this.getOriginElement( this.getData('ltPropOriginElem') )
            
        if(component.getMethods( 'onHovercardBeforeHide' ) ) {
            res = component.executeMethod( 'onHovercardBeforeHide', component.$node );
            if( !res && originElem){
                originElem.removeEventListener( 'mouseleave', component._closeHoverCard )
                if(  component._popovermouseleave && popoverWormhole ){
                    popoverWormhole.removeEventListener( 'mouseleave', component._popovermouseleave )
                  }
            }
        }
        if(res ){
            
            if( component.getData( 'ltPropShow' ) && popover ) {
                component.setData( 'ltPropShow', false )
                
            }
            if( component.prevHoverCardNode ) {
              delete component.prevHoverCardNode
            }
            component.removeTimeout( popover )
        }
      
      }
  },
  methods :{
    beforeWormholeAppend : function(args){
      this._childComp = args
    },
    onPopoverBeforeClose : function(event, element){
        if(event && event.type === 'scroll'){
            var res = true
            if(this.getMethods( 'onHovercardBeforeHide' ) ) {
              res = this.executeMethod( 'onHovercardBeforeHide', this.$node, event );
              const originElement = this.getOriginElement(this.getData('ltPropOriginElem')),
              popoverWormhole = this._popover.component.actualModalDiv
              if( !res && originElement){
                originElement.removeEventListener( 'mouseleave', this._closeHoverCard )
                  if( this._popovermouseleave && popoverWormhole ){
                    popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
                  }
                  return res;
              }
            }
            // if(res && this.getData( 'ltPropShow' )){
            //   this.setData( 'ltPropShow', false )
            // }
        }
    },
    onPopoverClose : function(event){
      if(this.getData('ltPropShow')){
        this.setData( 'ltPropShow', false )
      }
    },
    onPopoverBeforeShow : function(element){
      if(!this.getData('ltPropShow')){
        this.setData('ltPropShow', true)
      }
    }
  }
});


// window.addEventListener( 'scroll', function(event) {
//     if($L(event.target).closest('.lytePopover')[0]){
//      return
//   }
//    window.clearTimeout( _lyteUiUtils._expressDebounce );

//   _lyteUiUtils._expressDebounce = setTimeout( function() {
//     // var activeHovercard = document.querySelector('lyte-hovercard.lyteActive')
//     // if(activeHovercard){
//     //    var popover = activeHovercard.component._popover
//     //    if(popover){
//     //     var childComp = popover.component.actualModalDiv
//     //     var target = arguments[0].target
//     //     if(childComp.contains(target)){
//     //       return;
//     //     }
//     //    }
//     // }

//     debugger
//       var hovercard = document.getElementsByTagName( 'lyte-hovercard' ),
//       i = 0;
     
//           for( ; i < hovercard.length; i++ ) {
//               if( hovercard[ i ] ){
//                   hovercard[ i ].component.hovercardScroll();
//               }
          
//       }   
//   }, 250,event );
  
// }, true );
/**
 * @syntax yielded
 * <lyte-hovercard>
 *     <template is = "registerYield" yield-name = "hoverCardYield">
 *         <lyte-hovercard-content>
 *             //Some Content
 *         </lyte-hovercard-content>
 *     </template>
 * </lyte-hovercard>
 */