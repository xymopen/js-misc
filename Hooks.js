// ==UserScript==
// @name			Hooks
// @namespace		xuyiming.open@outlook.com
// @description		A JavaScript hook/reply ultility
// @author			xymopen
// @version			1.1.3
// @grant			none
// @license			BSD 2-Clause
// @homepageURL		https://github.com/xymopen/JS_Misc/blob/master/Hooks.js
// @updateURL		https://raw.githubusercontent.com/xymopen/JS_Misc/master/Hooks.js
// ==/UserScript==

// TODO: JsDoc
// TODO: Unit test

var Hooks = ( function() {
	"use strict";
	
	/**
	 * Hooks functions or properties, getters/setters
	 * and methods of an object you are intrested in
	 */
	var Hooks = {
		/**
		 * hook a function
		 * @function apply
		 * @param {function} target				- a function to be hook
		 * @param {onApply} onApply				- the hook
		 */
		"apply": function apply( target, onApply ) {
			if ( "function" === typeof target && "function" === typeof onApply ) {
				return function() {
					return onApply.call( this, target, this, arguments );
				};
			} else {
				throw new TypeError();
			}
		},
		/**
		 * @callback onApply the hook
		 * @param {function} target				- the function hooked
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} argv				- the arguments pass to the target
		 */

		/**
		 * hook a property of an object
		 * @function property
		 * @param {object} target				- an object having or to have the property to be hooked
		 * @param {string} propertyName			- the name of the property to be hooked
		 * @param {onGet} onGet					- the hook call when about to get the property
		 * @param {onSet} onSet					- the hook call when about to set the property
		 */
		"property": function property( target, propertyName, onGet, onSet ) {
			var descriptor, oldValue;

			if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
				descriptor = Object.getOwnPropertyDescriptor( target, propertyName );

				if ( Object.prototype.hasOwnProperty.call( descriptor, "value" ) ) {
					oldValue = descriptor.value;

					delete descriptor.value;
					delete descriptor.writable;
				} else if ( Object.prototype.hasOwnProperty.call( descriptor, "get" ) ) {
					oldValue = descriptor.get.call( target );
				} else {
					oldValue = undefined;
				}
			} else {
				descriptor = {
					"configurable": true,
					"enumerable": true,
				};
				
				oldValue = undefined;
			}

			descriptor.get = function get() {
				return onGet.call( this, target, propertyName, oldValue );
			};

			descriptor.set = function set( newValue ) {
				oldValue = onSet.call( this, target, propertyName, oldValue, newValue );
				return oldValue;
			};

			Object.defineProperty( target, propertyName, descriptor );
		},
		/**
		 * the hook call when about to get the property
		 * @callback onGet
		 * @param {object} target				- the object having the property hooked
		 * @param {string} propertyName			- the name of the property hooked
		 * @param {any} oldValue				- the current value of the property
		 */

		/**
		 * the hook call when about to set the property
		 * @callback onSet
		 * @param {object} target				- the object having the property hooked
		 * @param {string} propertyName			- the name of the property hooked
		 * @param {any} oldValue				- the current value of the property
		 * @param {any} newValue				- the value about to be set to the property
		 */

		/**
		 * alias of #property but fill the #onSet automatically
		 * @function get
		 * @param {object} target				- an object having or to have the property to be hooked
		 * @param {string} propertyName			- he name of the property to be hooked
		 * @param {onGet} onGet					- the hook call when about to get the property
		 */
		"get": function get( target, propertyName, onGet ) {
			return Hooks.property( target, propertyName, onGet, function( target, propertyName, oldValue, newValue ) {
				return Hooks.Reply.get( arguments );
			} );
		},
		/**
		 * the hook call when about to get the property
		 * @callback onGet
		 * @param {object} target				- the object having the property hooked
		 * @param {string} propertyName			- the name of the property hooked
		 * @param {any} oldValue				- the current value of the property
		 */

		/**
		 * alias of #property but fill the #onGet automatically
		 * @function set
		 * @param {object} target				- an object having or to have the property to be hooked
		 * @param {string} propertyName			- the name of the property to be hooked
		 * @param {onSet} onSet					- the hook call when about to set the property
		 */
		"set": function set( target, propertyName, onSet ) {
			return Hooks.property( target, propertyName, function( target, propertyName, oldValue ) {
				return Hooks.Reply.set( arguments );
			}, onSet );
		},
		/**
		 * the hook call when about to set the property
		 * @callback onSet
		 * @param {object} target				- the object having the property hooked
		 * @param {string} propertyName			- he name of the property hooked
		 * @param {any} oldValue				- the current value of the property
		 * @param {any} newValue				- the value about to be set to the property
		 */

		/**
		 * hook a method of an object
		 * @function method
		 * @param {object} target				- an object having or to have the method to be hooked
		 * @param {string} methodName			- the name of the method to be hooked
		 * @param {onApply} onApply				- the hook replace the method
		 */
		"method": function method( target, methodName, onApply ) {
			var method = target[ methodName ], descriptor;
			
			function hookMethod( method, onApply ) {
				return Hooks.apply( method, function( method, thisArg, argv ) {
					return onApply.call( this, target, methodName, method, thisArg, argv );
				} );
			};
			
			if ( "function" === typeof method ) {
				target[ methodName ] = hookMethod( method, onApply );
			} else {
				if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
					throw new Error( "ERR_PROPERTY_EXISTS_NOT_METHOD" );
				} else {
					Hooks.set( target, methodName, function onSet( target, propertyName, oldValue, newValue ) {
						Object.defineProperty( target, methodName, {
							"configurable": true,
							"enumerable": true,
							"value": "function" === typeof newValue ? hookMethod( newValue, onApply ) : newValue,
							"writable": true,
						} );
					} );
				}
			}
		},
		/**
		 * the hook replace the method
		 * @callback onApply
		 * @param {object} target				- the object having the method hooked
		 * @param {string} methodName			- the name of the method hooked
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} argv				- the arguments pass to the method
		 */
		
		/**
		 * hook a getter property of an object
		 * @function getter
		 * @param {object} target				- an object having the getter property to be hooked
		 * @param {string} propertyName			- the name of the getter property to be hooked
		 * @param {onGetter} onGetter				- the hook replace the getter
		 */
		"getter": function getter( target, propertyName, onGetter ) {
			return trap( target, propertyName, onGetter, "get", "ERR_NOT_A_GETTER" );
		},
		/**
		 * the hook replace the getter
		 * @callback onSetter
		 * @param {object} target				- the object having the getter property hooked
		 * @param {string} propertyName			- he name of the getter property hooked
		 * @param {function} getter				- the getter replaced
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} argv				- the arguments pass to the getter, should be #undefined
		 */

		/**
		 * hook a setter property of an object
		 * @function setter
		 * @param {object} target				- an object having the setter property to be hooked
		 * @param {string} propertyName			- the name of the setter property to be hooked
		 * @param {onSetter} onSetter				- the hook replace the setter
		 */
		"setter": function setter( target, propertyName, onSetter ) {
			return trap( target, propertyName, onSetter, "set", "ERR_NOT_A_SETTER" );
		},
		/**
		 * the hook replace the setter
		 * @callback onSetter
		 * @param {object} target				- the object having the setter property hooked
		 * @param {string} propertyName			- he name of the setter property hooked
		 * @param {function} setter				- the setter replaced
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} argv				- the arguments pass to the setter, should be a right value
		 */
	};
	
	var Reply = {
		"apply": function apply( param ) {
			var target = param[ 0 ],
				thisArg = param[ 1 ],
				argv = param[ 2 ];
			
			return target.apply( thisArg, argv );
		},
		
		"get": function( param ) {
			var target = param[ 0 ],
				propertyName = param[ 1 ],
				oldValue = param[ 2 ],
				newValue = param[ 3 ];
			
			return param[ param.length - 1 ];
		},
		
		"getter": function( param ) {
			var target = param[ 0 ],
				propertyName = param[ 1 ],
				fn = param[ 2 ],
				thisArg = param[ 3 ],
				argv = param[ 4 ];
			
			return fn.apply( thisArg, argv );
		},
		
		"method": function method( param ) {
			var target = param[ 0 ],
				methodName = param[ 1 ],
				method = param[ 2 ],
				thisArg = param[ 3 ],
				argv = param[ 4 ];
			
			return method.apply( thisArg, argv );
		},
	};
	
	Reply.set = Reply.get;
	Reply.setter = Reply.getter;
	
	Hooks.Reply = Reply;

	return Hooks;
} )();
