/**
 * Calculate the position of an element in a flatten, row
 * major ordered(C style), 0-based, multi-dimensional array
 *
 * `0` is used if an index is missing in the `indices`
 *
 * For example, to address a value in an `ImageData`,
 * evaluate `( y * width + x ) * 3 + c`.
 *
 * @param {number[]} indices - Row major ordered array indices
 * @param {number[]} shape - Row major ordered array shape
 * @returns {number}
 */
export const addr = ( indices, shape ) =>
	shape.reduce(( offset, axis, i ) =>
			offset * axis + ( indices[ i ] ?? 0 ));

/**
 * Calculate the position of an element in a flatten, column
 * major ordered(Fortran style), 0-based, multi-dimensional array
 *
 * `0` is used if an index is missing in the `indices`
 *
 * For example, to address a value in an `ImageData`,
 * evaluate `y + height * ( x + width * c )`.
 *
 * @param {number[]} indices - Column major ordered array indices
 * @param {number[]} shape - Column major ordered array shape
 * @returns {number}
 */
export const addrTransposed = ( indices, shape ) =>
	shape.reduceRight(( offset, axis, i ) =>
			( indices[ i ] ?? 0 ) + offset * axis);
