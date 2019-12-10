
/**
 * `Array.prototype.indexOf()` with
 * [`SameValueZero`](https://www.ecma-international.org/ecma-262/index.html#sec-samevaluezero
 * "ECMAScript® 2018 Language Specification#7.2.11 SameValueZero(x, y)") comparsion
 *
 * @template T
 * @param {T[]} array
 * @param {T} value
 */
const indexOf = ( array, value ) =>
	Number.isNaN( /** @type {number} */( /** @type {unknown} */ ( value ) ) ) ?
		array.findIndex( el => Number.isNaN(
			/** @type {number} */( /** @type {unknown} */ ( el ) )
		) ) :
		array.indexOf( value );

/**
 * Returns two arrays with their distinct
 * elements and one for their common ones
 *
 * @template T
 * @param {T[]} left
 * @param {T[]} right
 * @returns {[T[], T[], T[]]}
 */
export const distinct = ( left, right ) => {
	const intersection = [],
		complementRight = right.slice();

	const complementLeft = left.filter( el => {
		const i = indexOf( complementRight, el );

		if ( i >= 0 ) {
			complementRight.splice( i, 1 );
			intersection.push( el );

			return false;
		} else {
			return true;
		}
	} );

	return [ complementLeft, complementRight, intersection ];
};
