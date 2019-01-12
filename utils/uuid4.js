/// <reference lib="es2017" />

export const UUID4 = () => {
	/**
	 * @param {Uint8Array | Uint8ClampedArray} bin
	 */
	const hex = bin =>
		Array.from( bin ).map( b => b.toString( 16 ).padStart( 2, "0" ) ).join( "" );

	let bin = crypto.getRandomValues( new Uint8Array( 16 ) );

	return `${
		hex( bin.slice( 0, 4 ) )
	}-${
		hex( bin.slice( 4, 6 ) )
	}-${
		hex( bin.slice( 6, 8 ) )
	}-${
		hex( bin.slice( 8, 10 ) )
	}-${
		hex( bin.slice( 10, 16 ) )
	}`;
};
