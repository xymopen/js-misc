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
		resolve,
		reject
	};
};

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
