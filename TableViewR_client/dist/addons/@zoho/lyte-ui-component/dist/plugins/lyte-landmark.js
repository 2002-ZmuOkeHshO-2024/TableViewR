//the values which are not present in menuOptionsOrder will not be considered for landmark as well as for menu
//then don't give menuOptionsOrder in the obj for normal behaviour
;(function(){
    
    if ($L) {

        $L.landmark = {};
        var divsCreated = false;
        var parDiv = null; 
        var selectButton;
        var selectElement;
        var spanElement;
        var dupInd = 0;

        $L.landmark.enable = function ( obj ) {
            if( parDiv ){
                $L.landmark.disable();
            }      

            var borderSize = 3;
            if(obj && obj.borderSize && !isNaN(obj.borderSize)){
                borderSize = parseInt(obj.borderSize);
            }

            parDiv = document.createElement("div");
            parDiv.id = "aria-landmark-dropdown";
            parDiv.classList.add('lyteLandmarkMenuButtonWrap');

            //these classes are added for custom use case of client team
            spanElement = document.createElement("span");
            spanElement.id = "aria-landmark-span";
            spanElement.classList.add("lyteLandmarkDragIcon");
            
            if( obj && obj.spanClass && Array.isArray( obj.spanClass ) ){
                spanElement.classList.add( ...obj.spanClass );
            }

            selectButton = createButton( obj );
            selectElement = document.createElement("lyte-menu");

            var options = pushValuesToOption( obj );

            selectElement.setData({"ltPropQuery":'lyte-button#lyteLandmarkButton', "ltPropEvent":"click", "ltPropContent":options, "ltPropUserValue":"name" });
            selectElement.setMethods( {"onMenuClick" : focusOnRoleElement, "onBeforeOpen" : menuOnBeforeOpen } );

            _lyteUiUtils.appendChild(parDiv, spanElement);
            _lyteUiUtils.appendChild(parDiv, selectButton);
            _lyteUiUtils.appendChild(parDiv, selectElement);

            if( options.length !== 0 ){
                _lyteUiUtils.appendChild(document.body, parDiv);
            }


            if( shortcut ){
                if( obj && obj.shortcutKey ){
                    shortcut.registerKey( ( obj.shortcutKey ), function() { 
                        var elem = document.querySelector('#lyteLandmarkButton');
    
                        if( elem ){
                            elem.classList.add('lyteLandmarkButtonHighlight')
                            elem.focus();
                        }
                    });
                }
                else if( obj && obj.shortcutCode ){
                    shortcut.registerCode( ( obj.shortcutCode ), function() { 
                        var elem = document.querySelector('#lyteLandmarkButton');
    
                        if( elem ){
                            elem.classList.add('lyteLandmarkButtonHighlight')
                            elem.focus();
                        }
                    });
                }
                else{
                    shortcut.registerCode( 'shift + keyl', function() { //used registerCode here instead of registerKey to accomodate 'shift + keyl' alone
                        var elem = document.querySelector('#lyteLandmarkButton');
    
                        if( elem ){
                            elem.classList.add('lyteLandmarkButtonHighlight')
                            elem.focus();
                        }
                    });//, { excludeElements: [] } );   //exclude elements to make the shortcut work even when any form fields are focused
    
                }
              
                var parButton = document.querySelector('#lyteLandmarkButton>button');

                if( parButton ){
                    parButton.addEventListener('blur',function(event){
                        var button = $L(event.target).closest('lyte-button')[0];
                        if( button && button.classList.contains('lyteLandmarkButtonHighlight')){
                            button.classList.remove('lyteLandmarkButtonHighlight');
                        }
                    });
                }
              
            }

            function focusOnRoleElement( selected ) {
                if (selected.value) {
                    var selectedRole = selected.value;
                    var selKey = 'role';
                    var temp = checkForExtrAttr( obj );
                    if( temp ){
                        selKey = temp;
                    }

                    if(selectedRole.includes(":")){
                        var arr = selectedRole.split(":");
                        var elementWithRole = document.querySelector('['+ selKey +'="' + arr[0].trim() + '"][lt-prop-landmark="true"][lt-landmark-label="'+ arr[1].trim() +'"]');
                    }
                    else {
                        var elementWithRole = document.querySelector('['+ selKey +'="' + selectedRole + '"][lt-prop-landmark="true"]');
                    }
                    if (elementWithRole) {
                        var elem = document.querySelector('.landmarkActiveElement');
                        if( elem ){
                            elem.classList.remove('landmarkActiveElement');
                        }
                        
                        elementWithRole.classList.add('landmarkActiveElement');

                        if( elementWithRole ){
                            if( !elementWithRole.disabled && $L(elementWithRole).is(":visible")){
                                elementWithRole.focus();
                            }
                            else if( obj && obj.standardNavigationOrder ){
                                elementWithRole.focus();
                            }
                        }
                    }
                }
            }

            function menuOnBeforeOpen( menu , event , originElem ){
                if( obj && !obj.observeMenuBeforeOpen ){
                    return;
                }
                var options = pushValuesToOption( obj );
                var oldOptions = menu.component.getData('ltPropContent');

                if( oldOptions.length === options.length ){
                    return;
                }
                menu.component.setData('ltPropContent',options);
            }

            if (!divsCreated) {
                
                var selKey = 'role';
                var temp = checkForExtrAttr( obj );
                if( temp ){
                    selKey = temp;
                }

                var elementsWithRole = document.querySelectorAll('[' + selKey + '][lt-prop-landmark="true"]');

                if( !obj || !obj.elemProps ){
                    var elemColor = {
                        'banner': {'color':'grey'},
                        'complementary': {'color':'#E74C3C'},
                        'contentinfo': {'color':'#F2A62E'},
                        'form': {'color':'brown'},
                        'main': {'color':'#0984E3'},
                        'navigation': {'color':'green'},
                        'region': {'color':'violet'},
                        'search': {'color':'darkcyan'}
                    };
                    $L.landmark.setColor( null, '3' )
                }
                else{
                    var elemColor = obj.elemProps;
                    $L.landmark.setColor( obj.elemProps, '3' );
                }

                elementsWithRole.forEach(function (element) {

                    var roleName = element.getAttribute('role') ;
                    var temp = checkForExtrAttr( obj );
                    if( temp ){
                        roleName = element.getAttribute(temp);
                    }

                    if ( elemColor.hasOwnProperty(roleName) ) {
                        var roleColor = elemColor[roleName].color;
                        if( !roleColor ){
                            roleColor = "black";
                        }
                        var highlightDiv = document.createElement("div");
                        var roleIndicator = document.createElement("div");
                    
                        roleIndicator.style.position = "absolute";
                        roleIndicator.style.top = "0";
                        roleIndicator.style.right = "0";
                        roleIndicator.style.border = "1px solid " + roleColor;
                        roleIndicator.style.color = "white";
                        roleIndicator.style.backgroundColor = roleColor;
                        roleIndicator.innerHTML = roleName;

                        highlightDiv.style.position = "absolute";

                        // if( compStyle && compStyle.position == 'static' ){
                        //     element.style.position = 'relative';
                        // }
                    
                        highlightDiv.style.top = ( ((element.offsetTop - borderSize < 0) ? 0 : (element.offsetTop - borderSize)) + "px" ) ;
                        // highlightDiv.style.top = boundRect.top + ( document.body.scrollTop ) + 2*borderSize +"px";
                        highlightDiv.style.left = ( element.offsetLeft < 0 ) ? 0 : element.offsetLeft + "px";
                        highlightDiv.style.width = ( ((element.offsetWidth - 2*borderSize < 0) ? 0 : (element.offsetWidth - 2*borderSize)) + "px" ) ;
                        highlightDiv.style.height = ( ((element.offsetHeight - borderSize < 0) ? 0 : (element.offsetHeight - borderSize )) + "px" ) ;
                        highlightDiv.style.border = `${borderSize}px solid ` + roleColor; 
                        highlightDiv.style.pointerEvents = "none";
                        highlightDiv.style.zIndex = "14";

                        if( element.offsetParent && element.offsetParent.offsetParent && window.getComputedStyle( element.offsetParent.offsetParent ).position == 'relative'){
                            highlightDiv.style.top = "0px";
                            highlightDiv.style.left = "0px";
                        }

                        highlightDiv.classList.add('lytelandmarkhighlightdiv');

                        // element.style.setProperty("--lyte-landmark-role-color", roleColor);
                        // element.style.setProperty("--lyte-landmark-border-size", borderSize+'px');
                        element.classList.add('ltCustomLandmark');

                        // _lyteUiUtils.appendChild(highlightDiv, roleIndicator);
                        // _lyteUiUtils.appendChild(element, highlightDiv);
                        // // _lyteUiUtils.appendChild(document.body, highlightDiv);
                        highlightDiv = null;
                        roleIndicator = null;
                        
                    }
                });

                divsCreated = true; 
            }

            if( parDiv && $L(parDiv).length>0 ){
                $L(parDiv).draggable({
                    containment : "body" , hasContainment: true,
                    onDragStart: function( element ){
                        element.style.top = parseFloat(element.style.top ? element.style.top : 0) + parseFloat(document.documentElement.scrollTop ? document.documentElement.scrollTop : 0) + 'px';
                    },
                    onStop : function ( element ) {
                        element.style.position = 'fixed';
                        element.style.top = parseFloat(element.style.top ? element.style.top : 0) - parseFloat(document.documentElement.scrollTop ? document.documentElement.scrollTop : 0) + 'px';
                        element.style.zIndex = 20;
                    },
                    handle : [ "#aria-landmark-span" ]
                });
            }

        }

        $L.landmark.disable = function () {
            if( shortcut ){
                shortcut.unregisterAll();
            }

            if ( parDiv && $L(parDiv).length>0 ) {
                $L(parDiv).draggable("destroy");
                parDiv.remove(); 
                parDiv = null;
                selectButton = null;
                selectElement = null;
                spanElement = null;
            }

            if ( divsCreated ) {
        
                var divElements = document.querySelectorAll("div.lytelandmarkhighlightdiv");
                var newDivElements = document.querySelectorAll(".ltCustomLandmark");

                divElements.forEach(function (divElement) {
                    divElement.remove(); 
                });

                newDivElements.forEach( function( elem ){
                    elem.classList.remove('ltCustomLandmark');
                    // elem.style.outline='';
                });

                divsCreated = false; 
            }

            var elem = document.querySelector('.landmarkActiveElement');
            if( elem ){
                elem.classList.remove('landmarkActiveElement');
            }
        }

        $L.landmark.setColor = function( elemProps, borderSize ){
            var html = document.documentElement;
            if( elemProps ){

                for( var x in elemProps ){
                    html.style.setProperty( `--lyte-landmark-${x}-role-color`,`${elemProps[x].color}`);
                }
            }
            if( borderSize ){
                html.style.setProperty( `--lyte-landmark-border-size`,`${borderSize}px`);
            }
        }

        function getLabelByText( sel, element ){
            var elemAriaBy = document.querySelector(`#${sel}`);
            var valToSet = elemAriaBy.innerText || elemAriaBy.textContent || "" ;
            setAriaAttribute( element,  valToSet);
            return valToSet ;
        }

        function getLabelText( ariaLabel, element ){
            setAriaAttribute( element, ariaLabel );
            return ariaLabel ;
        }

        function setAriaAttribute( elem, text ){
            if( elem.getAttribute('lt-landmark-label') ){
                return elem.getAttribute('lt-landmark-label');
            }
            var valToSet = text || `${dupInd++}`;
            elem.setAttribute("lt-landmark-label",valToSet);
            return valToSet;
        }

        function createButton( obj ){
            if( obj ){
                var text = obj.displayValue;
            }
            var button = document.createElement("lyte-button");
            button.setAttribute("id",'lyteLandmarkButton');
            button.classList.add('lyteLandmarkButton');

            var template = document.createElement("template");
            template.setAttribute("is","registerYield");
            template.setAttribute("yield-name","text");
            template.innerHTML = text || 'Select Landmark';
            template.innerHTML += "<lyte-icon class='dropdown'></lyte-icon>";

            if( obj && !isNaN(obj.tabindex) ){
                button.setData('lt-prop-tabindex',  obj.tabindex );
            }

            button.appendChild( template );

            return button;
        }

        function checkForExtrAttr( obj ){
            var temp;
            if( obj && obj.extraAttributes && obj.extraAttributes[0] ){
                temp = obj.extraAttributes[0];
            }
            return temp;
        }

        function pushValuesToOption( obj ){
            var options = [];
            var uniqueRoleValues = [];

            if( obj && obj.menuOptionsOrder && obj.menuOptionsOrder.length > 0 ){
                obj.menuOptionsOrder.forEach( function( item ){
                    var elementsWithRole = Array.from( document.querySelectorAll("[role='"+item+"'][lt-prop-landmark='true']") );
                    menuSortFn( options, elementsWithRole, uniqueRoleValues, obj );
                });
            }
            else {
                var elementsWithRole = Array.from( document.querySelectorAll('[role][lt-prop-landmark="true"]') );
                menuSortFn( options, elementsWithRole, uniqueRoleValues, obj );
            }
      
            return options;
        }

        function menuSortFn( options, elementsWithRole, uniqueRoleValues, obj ){
            elementsWithRole = elementsWithRole.filter(function( elem ){
                return $L( elem ).is(":visible");
            });
            
            elementsWithRole.forEach(function (element) {
                var value = element.getAttribute('role') ;
                var temp = checkForExtrAttr( obj );
                if( temp ){
                    value = element.getAttribute(temp);
                }
                uniqueRoleValues.push(value); 
            });

            let duplicateValues = new Set( uniqueRoleValues.filter((e, i, a) =>  a.indexOf(e) !== i ));

            elementsWithRole.forEach(function ( element ) {

                var roleValue = element.getAttribute('role') ;
                var temp = checkForExtrAttr( obj );
                var label = roleValue;
                if( temp ){
                    roleValue = element.getAttribute(temp);
                    label = roleValue;
                }
                if ( obj && obj.elemProps && obj.elemProps.hasOwnProperty(roleValue) ) {
                    label = obj.elemProps[roleValue].label;
                    if( !label ){
                        label = roleValue;
                    }
                }

                var option = {};

                if( duplicateValues.has( roleValue )){
                    var ariaLabel = element.getAttribute('aria-label');
                    var ariaLabelledby = element.getAttribute('aria-labelledby');

                    var subLabel = ( ariaLabel ? getLabelText( ariaLabel, element ) : (ariaLabelledby ? getLabelByText( ariaLabelledby, element ) : setAriaAttribute(  element ) ) ) ;
                    label = label.trim() + ": " + subLabel ;
                    roleValue = roleValue.trim() + ": " +  subLabel ;

                }
                if( element.getAttribute('lt-prop-landmark-label') === null ){
                    element.setAttribute('lt-prop-landmark-label',label);
                }


                option.value = roleValue;
                option.name = label;

                if( roleValue && label ){
                    options.push( option );
                }
            });
        }

    }
} )();
