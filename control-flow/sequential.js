/// <reference lib="es2018.promise" />

import { makePromise } from "../utils/make-promise.js";

/** @param {number} maxConcurrency */
const sequential = maxConcurrency => {
	/**
	 * @callback F
	 * @returns {void}
	 */

	/**
	 * @callback D
	 * @param {F} onFinally
	 * @returns {void}
	 */

	let concurrency = 0;

	/** @type {D[]} */
	const queue = [];

	const onFinally = () => {
		if ( queue.length > 0 ) {
			queue.shift()( onFinally );
		} else {
			concurrency -= 1;
		}
	};

	/**
	 * @template R
	 * @callback Executor
	 * @param {F} onFinally
	 * @returns {R}
	 */

	/**
	 * @template R
	 * @typedef DefererReturnType
	 * @property {D} resolve
	 * @property {R} placeholder
	 * @returns {void}
	 */

	/**
	 * @template R
	 * @template {Executor<R>} E
	 * @callback Deferer
	 * @param {E} onFinally
	 * @returns {DefererReturnType<R>}
	 */

	/**
	 * @template R
	 * @template {Executor<R>} E
	 * @param {E} execute
	 * @param {Deferer<R, E>} defer
	 */
	const sequenced = ( execute, defer ) => {
		if ( concurrency < maxConcurrency ) {
			concurrency += 1;

			return execute( onFinally );
		} else {
			const { resolve, placeholder } = defer( execute );

			queue.push( resolve );

			return placeholder;
		}
	};

	return { sequenced, onFinally };
};

/**
 * Create a function which limits how many operations can be pendding
 *
 * `maxConcurrency = 1` causes operations to be done sequentially
 *
 * @template {ParamAsyncFunction} F
 * @param {F} asyncFn
 * @param {number} maxConcurrency
 * @returns {ReturnAsyncFunction<F>}
 */
export const sequentialAsync = ( asyncFn, maxConcurrency = 1 ) => {
	/**  @typedef {PromiseValueType<ReturnType<F>>} T */

	const { sequenced, onFinally } = sequential( maxConcurrency );

	/**
	 * A function which always calls `onFinally()` when `callbackFn()` finishes
	 *
	 * @param {Parameters<F>} args
	 * @returns {ReturnType<F>}
	 */
	const composed = function ( ...args ) {
		return asyncFn.apply( this, args ).finally( onFinally );
	};

	return function ( ...args ) {
		const executor = () =>
			composed.apply( this, args );

		return sequenced( executor, () => {
			const { promise: placeholder, resolve } = makePromise(),
				resolver = () => resolve( executor() );

			return {
				resolve: resolver,
				placeholder
			};
		} );
	};
};

/**
 * Create a function which limits how many operations can be pendding
 *
 * `maxConcurrency = 1` causes operations to be done sequentially
 *
 * @template {ParamCallbackFunction} F
 * @param {F} callbackFn
 * @param {number} maxConcurrency
 * @returns {ReturnCallbackFunction<F>}
 */
export const sequentialCallback = ( callbackFn, maxConcurrency = 1 ) => {
	const { sequenced, onFinally } = sequential( maxConcurrency );

	/**
	 * A function which always calls `onFinally()` when `callbackFn()` finishes
	 *
	 * @param {Parameters<F>} args
	 * @returns {void}
	 */
	const composed = function ( ...args ) {
		const lastIdx = args.length - 1;

		if ( "function" == typeof args[ lastIdx ] ) {
			const callback = args[ lastIdx ];

			args[ lastIdx ] = function () {
				onFinally();

				return callback.apply( this, args );
			};
		} else {
			args.push( onFinally );
		}

		callbackFn.apply( this, args );
	};

	return function ( ...args ) {
		const execute = () =>
			composed.apply( this, args );

		return sequenced( execute, () => ( {
			resolve: () => execute(),
			placeholder: undefined
		} ) );
	};
};

/**
 * Obtain the result type of a promise type
 * 
 * @template T
// @ts-ignore
 * @typedef {T extends Promise<infer P> ? P : never} PromiseValueType
 */

/**
 * @callback ParamAsyncFunction
 * @param {...any[]} args
 * @returns {Promise<any>}
 */

/**
 * @template {ParamAsyncFunction} F
 * @callback ReturnAsyncFunction
 * @param {...Parameters<F>} args
 * @returns {Promise<PromiseValueType<ReturnType<F>>>}
 */

/**
 * @callback ParamCallbackFunction
 * @param {...any[]} args
 * @returns {void}
 */

/**
 * @template {ParamCallbackFunction} F
 * @callback ReturnCallbackFunction
 * @param {...Parameters<F>} args
 * @returns {void}
 */
