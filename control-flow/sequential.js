/// <reference lib="es2018.promise" />

/**
 * Create a function which always calls `onFinally()` when `asyncFn()` finishes
 * @template {(...any: any[]) => Promise<any>} F
 * @param {F} asyncFn
 * @param {() => void} onFinally
 * @returns {F}
 */
const finallyAsync = ( asyncFn, onFinally ) =>
	// @ts-ignore
	function ( ...args ) {
		return asyncFn.apply( this, args ).finally( onFinally );
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

	let concurrency = 0;

	/** @type {[(value?: T | PromiseLike<T>) => void, any[], object | undefined][]} */
	const queue = [],
		composed = finallyAsync( asyncFn, onFinally );


	function onFinally() {
		if ( queue.length > 0 ) {
			const [ resolve, args, thisArg ] = queue.shift();

			resolve( composed.apply( thisArg, args ) );
		} else {
			concurrency -= 1;
		}
	};

	// @ts-ignore
	return function ( ...args ) {
		if ( concurrency < maxConcurrency ) {
			concurrency += 1;

			return composed.apply( this, args );
		} else {
			return new Promise( resolve => {
				queue.push( [ resolve, args, this ] );
			} );
		}
	};
};

/**
 * Create a function which always calls `onFinally()` when `callbackFn()` finishes
 * @template {(...any: any[]) => void} F
 * @param {F} callbackFn
 * @param {() => void} onFinally
 * @returns {F}
 */
const finallyCallback = ( callbackFn, onFinally ) =>
	// @ts-ignore
	function ( ...args ) {
		if ( "function" == typeof args[ args.length - 1 ] ) {
			/** @type {(...any: any[]) => void} */
			const callback = args[ args.length - 1 ];

			args[ args.length - 1 ] = function () {
				onFinally();

				return callback.apply( this, args );
			};
		} else {
			args.push( () => onFinally() );
		}

		callbackFn.apply( this, args );
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
	let concurrency = 0;

	/** @type {[any[], object | undefined][]} */
	const queue = [],
		composed = finallyCallback( callbackFn, onFinally );

	function onFinally() {
		if ( queue.length > 0 ) {
			const [ args, thisArg ] = queue.shift();

			composed.apply( thisArg, args );
		} else {
			concurrency -= 1;
		}
	};

	// @ts-ignore
	return function ( ...args ) {
		if ( concurrency < maxConcurrency ) {
			concurrency += 1;

			return composed.apply( this, args );
		} else {
			queue.push( [ args, this ] );
		}
	};
};

/**
 * Obtain the result type of a promise type
 * @template T
 // @ts-ignore
 * @typedef {T extends Promise<infer P> ? P : never} PromiseValueType
 */
