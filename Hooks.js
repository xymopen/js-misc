// ==UserScript==
// @name			Hooks
// @namespace		xuyiming.open@outlook.com
// @description		A JavaScript hook/proxy/reflect ultility
// @author			xymopen
// @version			1.1.0
// @grant			none
// @license			BSD 2-Clause
// @homepageURL		https://github.com/xymopen/JS_Utilities/blob/master/Hooks.js
// ==/UserScript==

// TODO: JsDoc

var Hooks = ( function() {
    "use strict";

	var Hooks = {
        "apply": function apply( target, onApply ) {
			return function() {
                return onApply.call( this, target, this, arguments );
            };
        },

        "property": function get( target, propertyName, onGet, onSet ) {
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

                descriptor.get = function get() {
                    return onGet.call( this, target, propertyName, oldValue );
                };

                descriptor.set = function set( newValue ) {
                    oldValue = onSet.call( this, target, propertyName, oldValue, newValue );
                    return oldValue;
                };

                Object.defineProperty( target, propertyName, descriptor );
            } else {
                throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
            }
        },

        "get": function get( target, propertyName, onGet ) {
            return Hooks.property( target, propertyName, onGet, function( target, propertyName, oldValue, newValue ) {
                return newValue;
            } );
        },

        "set": function set( target, propertyName, onSet ) {
            return Hooks.property( target, propertyName, function( target, propertyName, oldValue ) {
                return oldValue;
            }, onSet );
        },

        "getter": function getter( target, propertyName, onGetter ) {
            var descriptor, getter;

            if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
                descriptor = Object.getOwnPropertyDescriptor( target, propertyName );
                getter = descriptor.get;

                if ( Object.prototype.hasOwnProperty.call( descriptor, "get" ) &&
                    "function" === typeof getter ) {
                    descriptor.get = Hooks.apply( getter, function( getter, thisArg, argv ) {
                        return onGetter.call( this, target, propertyName, getter, thisArg, argv );
                    } );
                } else {
                    throw new Error( "ERR_NOT_A_GETTER" );
                }

                Object.defineProperty( target, propertyName, descriptor );
            } else {
                throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
            }
        },

        "setter": function setter( target, propertyName, onSetter ) {
            var descriptor, setter;	// variable setter refers to setter( target, propertyName, onSetter ) itself

            if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
                descriptor = Object.getOwnPropertyDescriptor( target, propertyName );
                setter = descriptor.set;

                if ( Object.prototype.hasOwnProperty.call( descriptor, "set" ) &&
                    "function" === typeof setter ) {
                    descriptor.set = Hooks.apply( setter, function( setter, thisArg, argv ) {
                        return onSetter.call( this, target, propertyName, setter, thisArg, argv );
                    } );
                } else {
                    throw new Error( "ERR_NOT_A_SETTER" );
                }

                Object.defineProperty( target, propertyName, descriptor );
            } else {
                throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
            }
        },

        "method": function method( target, methodName, onApply ) {
            var method;

            if ( Object.prototype.hasOwnProperty.call( target, methodName ) ) {
                method = target[ methodName ];

                if ( "function" === typeof method ) {
                    target[ methodName ] = Hooks.apply( method, function( method, thisArg, argv ) {
                        return onApply.call( this, target, methodName, method, thisArg, argv );
                    } );
                } else {
                    throw new Error( "ERR_NOT_A_METHOD" );
                }
            } else {
                throw new Error( "ERR_PROPERTY_NOT_DEFINED" );
            }
        }
    };

    return Hooks;
} )();
