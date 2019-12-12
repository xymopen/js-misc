/**
 * @template T
 */
export const makePromise = () => {
	/** @type {PromiseResolver<T>} */
	let resolve;
	/** @type {PromiseRejecter} */
	let reject;

	/** @type {Promise<T>} */
	const promise = new Promise( ( _resolve, _reject ) => {
		resolve = _resolve;
		reject = _reject;
	} );

	return {
		promise,
		// Executor should be called during Promise
		// construction thus they should be initialized
		// @ts-ignore
		resolve, reject
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
 * @template T
 * @callback PromiseResolver
 * @param {T | PromiseLike<T>} [value]
 * @returns {void}
 */

/**
 * @callback PromiseRejecter
 * @param {any} [reason]
 * @returns {void}
 */

/**
 * @template T
 * @callback PromiseExecutor
 * @param {PromiseResolver<T>} resolve
 * @param {PromiseRejecter} reject
 * @returns {void}
 */
