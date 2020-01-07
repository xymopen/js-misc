/**
 * @see [Protobuf Encoding](https://developers.google.com/protocol-buffers/docs/encoding
 * "Encoding | Protocol Buffers | Google Developers")
 */

"break jsdoc";

/** @param {number} n */
export function* encode( n ) {
	// Bitwise causes number to be int32
	// Assume numbers are little endian
	if ( !Number.isFinite( n ) ) {
		throw new RangeError( "Cannot encode infinite or nan" );
	} else if ( n < 0 ) {
		throw new RangeError( "Cannot encode number less than 0" );
	} else if ( n > 0xFFFFFFFF ) {
		throw new RangeError( "Cannot encode number greater than 4294967295" );
	} else {
		while ( n > 0b01111111 ) {
			yield n & 0b01111111;
			// Do right unsigned shift
			// so all 32 bits are usable
			n >>>= 7;
		}

		yield n | 1 << 7;
	}
};

/** @param {Iterable<number>} input */
export function decode( input ) {
	let n = 0, i = 0;

	for ( const m of input ) {
		const end = m >>> 7 === 1,
			data = m & 0b01111111;

		if ( !end ) {
			n |= data << ( i * 7 );
			i += 1;
		// If the last uses no more than 4 bits
		// then n has 28 bits left for other 4 bytes
		// Otherwisw it only accounts for 3
		} else if ( i <= ( data >>> 4 === 0 ? 4 : 3 ) ) {
			const p = n | data << ( i * 7 );

			return p < 0 ?
				// Reinterpret int32 as uint32
				0x100000000 + p :
				p;
		} else {
			throw new RangeError( "Cannot decode number greater than 4294967295" );
		}
	}

	throw new RangeError( "Insufficient input" );
};
