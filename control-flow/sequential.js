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
			/** @type {D} */ ( queue.shift() )( onFinally );
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
	 * @callback Deferer
	 * @param {Executor<R>} onFinally
	 * @returns {DefererReturnType<R>}
	 */

	/**
	 * @template R
	 * @param {Executor<R>} execute
	 * @param {Deferer<R>} defer
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
		return /** @type {ReturnType<F>} */ ( asyncFn
			.apply(
				// @ts-ignore
				this,
				args
			)
			.finally( onFinally ) );
	};

	return function ( ...args ) {
		const executor = () =>
			composed.apply(
				// @ts-ignore
				this,
				args
			);

		return /** @type {ReturnType<F>} */ ( sequenced( executor, () => {
			const { promise: placeholder, resolve } = makePromise(),
				resolver = () => resolve( executor() );

			return {
				resolve: resolver,
				placeholder
			};
		} ) );
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
			/** @type {F} */
			const callback = ( args[ lastIdx ] );

			args[ lastIdx ] = function () {
				onFinally();

				return callback.apply( this, args );
			};
		} else {
			args.push( onFinally );
		}

		callbackFn.apply(
			// @ts-ignore
			this,
			args
		);
	};

	return function ( ...args ) {
		const execute = () =>
			composed.apply(
				// @ts-ignore
				this,
				args
			);

		return sequenced( execute, () => ( {
			resolve: () => execute(),
			placeholder: undefined
		} ) );
	};
};

/**
 * @template T
 * @typedef {import("../utils/make-promise").PromiseValueType<T>} PromiseValueType
 */

/**
 * @callback ParamAsyncFunction
 * @param {...any[]} args
 * @returns {Promise<any>}
 */

/**
 * @template {ParamAsyncFunction} F
 * @typedef {(...args: Parameters<F>) => ReturnType<F>} ReturnAsyncFunction
 */

/**
 * @callback ParamCallbackFunction
 * @param {...any[]} args
 * @returns {void}
 */

/**
 * @template {ParamCallbackFunction} F
 * @typedef {(...args: Parameters<F>) => void} ReturnCallbackFunction
 * @returns {void}
 */
