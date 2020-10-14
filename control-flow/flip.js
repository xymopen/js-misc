/**
 * Returns a high order function that accepts tailing arguments first
 * and receive the first argument (`this`) later
 *
 * Helper the for [pipeline operator](
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator)
 *
 * @template {fn} F
 * @param {F} fn
 */
export const flip = fn => {
	if ( typeof fn !== "function" ) {
		throw new TypeError( "Fn must be a function" );
	} else {
		return /** @param {Tail<Parameters<F>>} tail */ ( ...tail ) =>
			/**
			 * @param {Parameters<F>[ 0 ]} first
			 * @returns {ReturnType<F>}
			 */ ( first ) =>
				fn( first, ...tail );
	}
};

/**
 * Convert a method (function on the prototype chain) to
 * be used standalone or with pipeline operator
 *
 * Accept `this` on the first argument
 *
 * @param {*} fn
 */
export const unthis = fn => {
	if ( typeof fn !== "function" ) {
		throw new TypeError( "Fn must be a function" );
	} else {
		return Function.prototype.call.bind( fn );
	}
};

/**
 * @template {any[]} T
 * @typedef {T extends [ any, ...infer P ] ? P : never} Tail
 */

 /**
  * @callback fn
  * @param {...any} args
  * @returns {any}
  */
