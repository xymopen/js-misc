/**
 * @see [Protobuf Encoding](https://developers.google.com/protocol-buffers/docs/encoding
 * "Encoding | Protocol Buffers | Google Developers")
 */

"break jsdoc";


/** @param {number} n */
export const encode = n => n < 0 ? -n * 2 - 1 : n * 2;

/** @param {number} n */
export const decode = n => n % 2 === 0 ? n / 2 : -Math.ceil( n / 2 );
