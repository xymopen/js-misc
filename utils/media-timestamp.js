/// <reference lib="es2017.string" />

/**
 * Convert [HH:]mm:ss[.SSS] to number
 *
 * @param {string} tag
 */
export const parse = tag => {
	if ( /(\d{1,}:)?\d{1,2}:\d{1,2}(\.\d{1,3})?/.test( tag ) ) {
		// split time into [ s.mm, m, h ]
		return tag.split( ":" ).reverse().reduce( ( time, i, index ) =>
			time + parseFloat( i ) * Math.pow( 60, index ), 0 );
	} else {
		return NaN;
	}
};

/**
 * Convert number to HH:mm:ss.SSS
 *
 * @param {number} time
 */
export const stringify = time => {
	if ( time < 0 ) {
		throw new TypeError( "Invalid number to convert" );
	} else {
		const times = [];

		for ( let i = 0; i < 3; i += 1 ) {
			times.push( time % 60 );
			time = Math.floor( time / 60 );
		}

		const sec = times[ 0 ].toFixed( 3 );

		return `${
			times[ 2 ].toString().padStart( 2, "0" )
			}:${
			times[ 1 ].toString().padStart( 2, "0" )
			}:${
			time[ 0 ] < 10 ? `0${ sec }` : sec
			}`;
	}
};
