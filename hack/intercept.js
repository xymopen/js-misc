/**
 * Returns a function which traps `target` function calls
 *
 * @template {{(...any: any[]): any; prototype: any}} T
 * @param {T} target
 * @param {onApply<T>} onApply
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
 * Call `target` function as it should have
 * 
 * @type {onApply<Function>}
 */
export const invoke = ( target, thisArg, args ) => {
	return target.apply( thisArg, args )
};

/**
 * @template {Function} T
 * @callback onApply
 * @param {T} target - Function should have invoked
 * @param {object | undefined} thisArg - Used as `this` to the target
 * @param {any[]} args - Arguments passed to the target.
 * @returns {any}
 */
