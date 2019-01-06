/**
 * returns a function which can trap `target` function calls
 *
 * @param {Function} target
 * @param {onApply} onApply
 */
export const intercept = ( target, onApply ) => {
	return function ( ...args ) {
		return onApply( target, this, args );
	}
}

/**
 * call `target` function as it should have
 * 
 * @type {onApply}
 */
export const invoke = ( target, thisArg, args ) => {
	return target.apply( thisArg, args )
}

/**
 * @callback onApply
 * @param {Function} target - The function should have invoked
 * @param {any} thisArg - The object used as `this` to the target
 * @param {any[]} args - A list of arguments passed to the target.
 * @returns {any}
 */
