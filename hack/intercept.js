/**
 * returns a function which can trap `target` function calls
 *
 * @param {Function} target
 * @param {onApply} onApply
 */
export const intercept = ( target, onApply ) => {
	const fn = function ( ...args ) {
		return onApply( target, this, args );
	};

	fn.prototype = target.prototype;

	return fn;
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
 * @param {object | undefined} thisArg - The object used as `this` to the target
 * @param {any[]} args - A list of arguments passed to the target.
 * @returns {any}
 */
