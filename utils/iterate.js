/// <reference lib="es2015.iterable" />
/// <reference lib="es2018.asynciterable" />

/**
 * @template T
 * @param {Iterator<T>} iterator
 * @returns {Iterable<T>}
 */
export const iterate = iterator => ( {
	[ Symbol.iterator ]() {
		return iterator;
	}
} );

/**
 * @template T
 * @param {AsyncIterator<T>} iterator
 * @returns {AsyncIterable<T>}
 */
export const asyncIterate = iterator => ( {
	[ Symbol.asyncIterator ]() {
		return iterator;
	}
} );
