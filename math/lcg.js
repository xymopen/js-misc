/**
 * Linear congruential generator
 * 
 * @param {number} x
 * @param {number} a - Multiplier
 * @param {number} c - Increment
 * @param {number} m - Modulus
 * @yields {number} - Positive number less than modulus(m)
 * @see [Wikipedia](https://en.wikipedia.org/wiki/Linear_congruential_generator)
 * @see [C++ Reference](https://en.cppreference.com/w/cpp/numeric/random/linear_congruential_engine)
 */
export function* lcg( x = Date.now(), a = 1103515245, c = 12345, m = 0x80000000 ) {
	if ( !( a > 0 ) ) {
		throw new TypeError( "Multiplier(a) must greater than 0" );
	} else if ( !( c >= 0 ) ) {
		throw new TypeError( "Increment(c) must greater than or equal to 0" );
	} else if ( !( m > 0 ) ) {
		throw new TypeError( "Modulus(m) must greater than 0" );
	} else if ( !( a < m ) ) {
		throw new TypeError( "Multiplier(a) must less than modulus(m)" );
	} else if ( !( c < m ) ) {
		throw new TypeError( "Increment(c) must less than modulus(m)" );
	} else {
		x = Math.abs( x ) % m;

		while ( true ) {
			x = ( a * x + c ) % m;

			yield x;
		}
	}
};

/** @type {typeof lcg} */
export function* intLcg( x, m, a, c ) {
	for ( let y of lcg( x, m, a, c ) ) {
		yield ( y >> 16 ) & 0x7FFF;
	}
};
