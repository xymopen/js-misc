/**
 * returns a function which traps `target` function calls
 * 
 * @template {{(...any: any[]): any; prototype: any}} T
 * @param {T} target
 * @param {onApply} onApply
 * @returns {T}
 */
export const intercept = ( target, onApply ) => {
	const fn = function ( ...args ) {
		return onApply( target, this, args );
	};

	fn.prototype = target.prototype;

	// @ts-ignore
	return fn;
};

/**
 * call `target` function as it should have
 *
 * @type {onApply}
 */
export const invoke = ( target, thisArg, args ) => {
	return target.apply( thisArg, args )
};

/**
 * @callback onApply
 * @param {Function} target - function should have invoked
 * @param {object | undefined} thisArg - used as `this` to the target
 * @param {any[]} args - arguments passed to the target.
 * @returns {any}
 */
