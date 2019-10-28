/// <reference lib="es2018.promise" />

import { makePromise } from "../utils/make-promise.js";

/** @param {number} maxConcurrency */
const sequential = maxConcurrency => {
	/**
	 * @typedef {() => void} F
	 * @typedef {(onFinally: F) => void} D
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
	 * @template {(onFinally: F) => R} E
	 * @param {E} execute
	 * @param {(execute: E) => { resolve: D, placeholder: R }} defer
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
 * @template {(...any: any[]) => Promise<any>} F
 * @param {F} asyncFn
 * @param {number} maxConcurrency
 * @returns {F}
 */
export const sequentialAsync = ( asyncFn, maxConcurrency = 1 ) => {
	/**  @typedef {PromiseValueType<ReturnType<F>>} T */

	const { sequenced, onFinally } = sequential( maxConcurrency );
	/** A function which always calls `onFinally()` when `callbackFn()` finishes */
	const composed = function ( ...args ) {
		return asyncFn.apply( this, args ).finally( onFinally );
	};

	// @ts-ignore
	return function ( ...args ) {
		const executor = () =>
			composed.apply( this, args );

		return sequenced( executor, () => {
			const { promise: placeholder, resolve } = makePromise(),
				resolver = () => resolve( executor() );

			return { resolve: resolver, placeholder };
		} );
	};
};

/**
 * Create a function which limits how many operations can be pendding
 *
 * `maxConcurrency = 1` causes operations to be done sequentially
 *
 * @template {(...any: any[]) => void} F
 * @param {F} callbackFn
 * @param {number} maxConcurrency
 * @returns {F}
 */
export const sequentialCallback = ( callbackFn, maxConcurrency = 1 ) => {
	const { sequenced, onFinally } = sequential( maxConcurrency );
	/** A function which always calls `onFinally()` when `callbackFn()` finishes */
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

	// @ts-ignore
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
 * @template T
// @ts-ignore
 * @typedef {T extends Promise<infer P> ? P : never} PromiseValueType
 */
