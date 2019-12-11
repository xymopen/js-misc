import { makePromise } from "../utils/make-promise.js";

/**
 * @template T
 * @template {NextResult<T>} F
 * @param {F} next
 * @param {PromiseResolver<T>} resolve
 * @param {PromiseRejecter} reject
 * @returns {SameFunction<F>}
 */
const makeNext = ( next, resolve, reject ) =>
	function ( ...args ) {
		/** @type {ReturnType<F>} */
		let result;

		try {
			result = next.apply( this, args );

			if ( result.done ) {
				resolve( result.value );
			}

			return result;
		} catch ( error ) {
			reject( error );

			throw error;
		}
	};

/**
 * Obtain the return value of an iterator
 * or capture its error
 *
 * @template {Iterator<any>} I
 * @param {I} it
 * @returns {Promisified<I>}
 */
export const promisifyIterator = it => {
	const { promise, resolve, reject } = makePromise();
	/** @type {Pick<I, keyof Iterator<any>>} */
	const iterator = {};

	iterator.next = makeNext( it.next.bind( it ), resolve, reject );

	if ( typeof it.return === "function" ) {
		iterator.return = makeNext( it.return.bind( it ), resolve, reject );
	}

	if ( typeof it.throw === "function" ) {
		iterator.throw =makeNext( it.throw.bind( it ), resolve, reject );
	}

	return {
		promise,
		iterator
	};
};

/**
 * @template T
 * @typedef {import("../utils/make-promise.js").PromiseResolver<T>} PromiseResolver
 */

/**
 * @typedef {import("../utils/make-promise.js").PromiseRejecter} PromiseRejecter
 */

/**
 * @template T
// @ts-ignore
 * @typedef {T extends Iterator<any, infer P> ? P : never} IteratorReturnType
 */

/**
 * @template {Function} F
 * @callback SameFunction
 * @param {...Parameters<F>} args
 * @returns {ReturnType<F>}
 */

/**
 *
 * @template T
 * @callback NextResult
 * @param {...any[]} args
 * @returns {IteratorResult<any, T>}
 */

/**
 * @template {Iterator<any>} I
 * @typedef Promisified
 * @property {Promise<IteratorReturnType<I>>} promise
 * @property {Pick<I, keyof Iterator<any>>} iterator
 */
