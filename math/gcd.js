/**
 * euclidean algorithm to evaluate greatest common divisor
 *
 * @param {number} a
 * @param {number} b
 */
export const gcd = ( a, b ) => {
	while ( 0 !== b ) {
		let t = b;
		b = a % b;
		a = t;
	}

	return a;
};

/**
 * lowest common multiple
 * 
 * @param {number} a
 * @param {number} b
 */
export const lcm = ( a, b ) => a / gcd( a, b ) * b;
