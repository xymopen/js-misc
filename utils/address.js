/**
 * @see [Row- and column-major order](
 * https://en.wikipedia.org/wiki/Row-_and_column-major_order
 * "Row- and column-major order - Wikipedia")
 */

"break jsdoc";

/**
 * Calculate the position of an element in a flatten, row-
 * major ordered(C style), 0-based, multi-dimensional array
 *
 * `0` is used if an index is missing in the `indices`
 *
 * For example, to address a value in an `ImageData`,
 * evaluate `( y * width + x ) * 4 + c`.
 *
 * @param {number[]} indices
 * @param {number[]} shape
 * @returns {number}
 * @example addr( [ y, x, c ], [ height, width, 4 ] );
 */
export const addr = ( indices, shape ) =>
	shape.slice( 1 ).reduce( ( offset, axis, i ) =>
		offset * axis + ( indices[ i + 1 ] ?? 0 ), indices[ 0 ] ?? 0 );

/**
 * Calculate the position of an element in a flatten, column-
 * major ordered(Fortran style), 0-based, multi-dimensional array
 *
 * `0` is used if an index is missing in the `indices`
 *
 * For example, to address a value in an `ImageData`,
 * evaluate `y + height * ( x + width * c )`.
 *
 * @param {number[]} indices
 * @param {number[]} shape
 * @returns {number}
 * @example addrTransposed( [ y, x, c ], [ height, width, 4 ] );
 */
export const addrTransposed = ( indices, shape ) =>
	shape.slice( 0, -1 ).reduceRight( ( offset, axis, i ) =>
		( indices[ i ] ?? 0 ) + axis * offset, indices[ indices.length - 1 ] ?? 0 );
