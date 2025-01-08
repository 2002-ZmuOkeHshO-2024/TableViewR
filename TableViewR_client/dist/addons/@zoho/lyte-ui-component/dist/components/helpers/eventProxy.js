// ;if( document != window.document ){
	// cloning the event
    ;[ Element.prototype, HTMLDocument.prototype, ShadowRoot.prototype ].forEach( function( __proto ){
        if( __proto.override_added ){
            return;
        }
        
        __proto.override_added = true;

		var __add = __proto.addEventListener,
		__remove = __proto.removeEventListener,
		clone_evt = function( evt ){
			var obj = {};

			for( var key in evt ){
				var value = evt[ key ];

				if( typeof value == "function" ){
					if( key == "preventDefault" ){
						value = function(){
							obj.defaultPrevented = true;
							return evt.preventDefault();	
						};
					} else {
						value = value.bind( evt );
					}
				}

				obj[ key ] = value;
			}

			// var target = obj.target,
			// currentTarget = obj.currentTarget;

			// if( !currentTarget.contains( target ) ){
			// 	obj.target = window.document.body;
			// }

			// obj.originalEvent = evt;

			return obj;
		},
		add_fn = function( name, __fn, capture ){
			if( !__fn ){
				return;
			}

			var fn = __fn.__original_fn || function( evt ){
				try{
					var cloned_evt = clone_evt( evt ),
					ret =  __fn.call( this, cloned_evt );

					if( ret == false ){
						clone_evt.defaultPrevented = true;
					}

					return ret;
				} catch( e ){
					console.error( e );
				}
			};

			__fn.__original_fn = fn;
			__add.call( this, name, fn, capture )
		},
		remove_fn = function( name, __fn, capture ){
			if( !__fn ){
				return;
			}
			
			try{
				return __remove.call( this, name, __fn.__original_fn, capture );
			} catch( e ){
				console.error( e );
			}
		};

		__proto.addEventListener = add_fn;
		__proto.removeEventListener = remove_fn; 
    } ); 