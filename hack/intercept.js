/**
 * Returns a function which traps `target` function calls
 *
 * Practically it should be typed as `FunctionInterceptor & ConstructorInterceptor`.
 *
 * However the same type parameter of overloads cannot have different boundaries.
 *
 * As a result it is defined as such.
 *
 * @template {FunctionInterceptee | ConstructorInterceptee} F
 * @template R
 * @param {F} target
 * @param {OnApplyType<F, R>} onApply
 * @returns {InterceptReturnType<F, R>}
 */
export const intercept = ( target, onApply ) => {
	const fn = /** @type  {InterceptReturnType<F, R>} */(
		/** @type { unknown } */(
			/**
			 * @param {any[]} args
			 */
			function ( ...args ) {
				// @ts-ignore
				return onApply( target, this, args );
			}
		)
	);

	fn.prototype = target.prototype;

	return fn;
};

/**
 * Call `target` function as it should have
 *
 * @template {FunctionInterceptee | ConstructorInterceptee} F
 * @param  {F} target
 * @param  {OnApplyThisParameterType<F>} thisArg
 * @param  {...OnApplyParameterType<F>} args
 * @returns {OnApplyReturnType<F>}
 */
export const invoke = ( target, thisArg, args ) => {
	// @ts-ignore
	return target.apply( thisArg, args );
};

/**
 * @callback FunctionInterceptee
 * @param {...any[]} args
 * @returns {any}
 */

/**
 * @template {FunctionInterceptee} F
 * @template R
 * @callback FunctionIntercepted
 * @param {...Parameters<F>} args
 * @returns {R}
 */

/**
 * @template {FunctionInterceptee} F
 * @template R
 * @callback onFunctionApply
 * @param {F} target - Function should have invoked
 * @param {ThisParameterType<F>} thisArg - Used as `this` to the target
 * @param {Parameters<F>} args - Arguments passed to the target.
 * @returns {R}
 */

/**
 * @template {FunctionInterceptee} F
 * @template R
 * @callback FunctionInterceptor
 * @param {F} target
 * @param {onFunctionApply<F, R>} onApply
 * @returns {FunctionIntercepted<F, R>}
 */

/**
* @typedef {new (...args: any[]) => any} ConstructorInterceptee
*/

/**
 * @template {ConstructorInterceptee} F
 * @template R
 * @typedef {new (...args: ConstructorParameters<F>) => R} ConstructorIntercepted
 */

/**
 * @template {ConstructorInterceptee} F
 * @template R
 * @callback onConstructorApply
 * @param {F} target - Function should have invoked
 * @param {Partial<InstanceType<F>>} thisArg - Used as `this` to the target
 * @param {ConstructorParameters<F>} args - Arguments passed to the target.
 * @returns {R}
 */

/**
 * @template {ConstructorInterceptee} F
 * @template R
 * @callback ConstructorInterceptor
 * @param {F} target
 * @param {onConstructorApply<F, R>} onApply
 * @returns {ConstructorIntercepted<F, R>}
 */

/**
 * @template {FunctionInterceptee | ConstructorInterceptee} F
 * @template R
 * @typedef {F extends FunctionInterceptee ?
// @ts-ignore
 * 	onFunctionApply<F, R> :
 * 	F extends ConstructorInterceptee ?
// @ts-ignore
 * 	onConstructorApply<F, R> :
 * 	never} OnApplyType
 */

/**
 * @template {FunctionInterceptee | ConstructorInterceptee} F
 * @typedef {F extends FunctionInterceptee ?
// @ts-ignore
 * 	ThisParameterType<F> :
 * 	F extends ConstructorInterceptee ?
// @ts-ignore
 * 	Partial<InstanceType<F>> :
 * 	unknown} OnApplyThisParameterType
 */

/**
 * @template {FunctionInterceptee | ConstructorInterceptee} F
 * @typedef {F extends FunctionInterceptee ?
// @ts-ignore
 * 	Parameters<F> :
 * 	F extends ConstructorInterceptee ?
// @ts-ignore
 * 	ConstructorParameters<F> :
 * 	any[]} OnApplyParameterType
 */

/**
 * @template {FunctionInterceptee | ConstructorInterceptee} F
// @ts-ignore
 * @typedef {F extends FunctionInterceptee ?
// @ts-ignore
 * 	ReturnType<F> :
 * 	F extends ConstructorInterceptee ?
// @ts-ignore
 * 	InstanceType<F> :
 * 	never} OnApplyReturnType
 */

/**
 * @template {FunctionInterceptee | ConstructorInterceptee} F
 * @template R
// @ts-ignore
 * @typedef {F extends FunctionInterceptee ?
// @ts-ignore
 * 	FunctionIntercepted<F, R> :
 * 	F extends ConstructorInterceptee ?
// @ts-ignore
 * 	ConstructorIntercepted<F, R> :
 * 	never} InterceptReturnType
 */
