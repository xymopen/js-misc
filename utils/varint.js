/**
 * @see [Protobuf Encoding](https://developers.google.com/protocol-buffers/docs/encoding
 * "Encoding | Protocol Buffers | Google Developers")
 */

"break jsdoc";

/** @param {number} n */
export const encode = function* ( n ) {
	while ( n > 0b01111111 ) {
		yield n & 0b01111111 | 0 << 8;
		n >>>= 7;
	}

	yield n | 1 << 7;
};

export const decode = function* () {
	/** @type {number} n */
	let n = 0, i = 0;

	while ( true ) {
		const m = yield;

		n |= ( m & 0b01111111 ) << ( i * 7 );
		i += 1;

		if ( m >>> 7 === 1 ) {
			return n;
		}
	}
};
