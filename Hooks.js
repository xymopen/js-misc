var Hooks = {
	"fn": function fn( $fn, onInvoke ) {	// parameter fn refers to function fn( $fn, onInvoke ) itself
		"use strict";

		return function() {
			return onInvoke.call( this, $fn, arguments );
		};
	},

	"property": function property( object, propertyName, onGet, onSet ) {
		"use strict";

		var descriptor, oldValue;

		if ( Object.prototype.hasOwnProperty.call( object, propertyName ) ) {
			descriptor = Object.getOwnPropertyDescriptor( object, propertyName );

			if ( Object.prototype.hasOwnProperty.call( descriptor, "value" ) ) {
				oldValue = descriptor.value;

				delete descriptor.value;
				delete descriptor.writable;
			} else if ( Object.prototype.hasOwnProperty.call( descriptor, "get" ) ) {
				oldValue = descriptor.get.call( object );
			} else {
				oldValue = undefined;
			}

			descriptor.get = function get() {
				return onGet.call( this, oldValue );
			};

			descriptor.set = function set( newValue ) {
				oldValue = onSet.call( this, oldValue, newValue );
				return oldValue;
			};

			Object.defineProperty( object, propertyName, descriptor );
		} else {
			throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
		}
	},

	"getter": function getter( object, propertyName, onGet ) {
		"use strict";

		var descriptor, $getter;	// variable getter refers to function getter( object, propertyName, onGet ) itself

		if ( Object.prototype.hasOwnProperty.call( object, propertyName ) ) {
			descriptor = Object.getOwnPropertyDescriptor( object, propertyName );
			$getter = descriptor.get;

			if ( Object.prototype.hasOwnProperty.call( descriptor, "get" ) &&
				typeof $getter === "function" ) {
				descriptor.get = Hooks.fn( $getter, onGet );
			} else {
				throw new Error( "ERR_NOT_A_GETTER" );
			}

			Object.defineProperty( object, propertyName, descriptor );
		} else {
			throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
		}
	},

	"setter": function setter( object, propertyName, onSet ) {
		"use strict";

		var descriptor, $setter;	// variable setter refers to function setter( object, propertyName, onSet ) itself

		if ( Object.prototype.hasOwnProperty.call( object, propertyName ) ) {
			descriptor = Object.getOwnPropertyDescriptor( object, propertyName );
			$setter = descriptor.set;

			if ( Object.prototype.hasOwnProperty.call( descriptor, "set" ) &&
				typeof $setter === "function" ) {
				descriptor.set = Hooks.fn( $setter, onSet );
			} else {
				throw new Error( "ERR_NOT_A_SETTER" );
			}

			Object.defineProperty( object, propertyName, descriptor );
		} else {
			throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
		}
	},

	"method": function method( object, methodName, onInvoke ) {
		"use strict";

		var $method;	// variable method refers to function method( object, methodName, onInvoke ) itself

		if ( Object.prototype.hasOwnProperty.call( object, methodName ) ) {
			$method = object[ methodName ];

			if ( typeof $method === "function" ) {
				object[ methodName ] = Hooks.fn( $method, onInvoke );
			} else {
				throw new Error( "ERR_NOT_A_METHOD" );
			}
		} else {
			throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
		}
	}
};