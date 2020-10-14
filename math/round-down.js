/**
 * Returns a supplied numeric expression rounded down to precision and multiple.
 *
 * @param {number} x
 * @param {number} precision
 * @param {Round} [round]
 * @param {number} [multiple]
 */
export const roundDown = ( x, precision, round = Math.round, multiple = 10 ) => {
	const k = Math.pow( multiple, precision );

	return round( x * k ) / k;
};

/**
 * @callback Round
 * @param {number} n
 * @returns {number}
 */
