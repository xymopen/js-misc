/// <reference lib="es2015.iterable" />
/// <reference lib="es2018.asynciterable" />

/**
 * @template T, TR, TN
 * @param {Iterator<T, TR, TN>} iterator
 * @returns {Iterable<T, TR, TN>}
 */
export const iterate = iterator => ( {
	[ Symbol.iterator ]() {
		return iterator;
	}
} );

/**
 * @template T, TR, TN
 * @param {AsyncIterator<T, TR, TN>} iterator
 * @returns {AsyncIterable<T, TR, TN>}
 */
export const asyncIterate = iterator => ( {
	[ Symbol.asyncIterator ]() {
		return iterator;
	}
} );
