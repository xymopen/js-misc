/**
 * Concat two ordered array
 *
 * @template T
 * @param {T[]} left
 * @param {T[]} right
 * @param {Comparator<T>} compare
 * @returns {T[]}
 */
const merge = ( left, right, compare ) => {
	/** @type {T[]} */
	var result = [];

	while ( left.length > 0 && right.length > 0 ) {
		result.push( /** @type {T} */( ( compare( left[ 0 ], right[ 0 ] ) > 0 ? left : right ).shift() ) );
	}

	if ( left.length > 0 ) {
		result = result.concat( left );
	} else if ( right.length > 0 ) {
		result = result.concat( right );
	}

	return result;
};

/**
 * Sort an array using merge sort algorithm
 *
 * @template T
 * @param {T[]} array
 * @param {Comparator<T>} [compare]
 * @returns {T[]}
 */
export const mergeSort = ( array, compare = ( a, b ) => a - b ) => {
	if ( array.length === 1 ) {
		return array;
	} else {
		let holder = array.map( e => [ e ] );

		for ( let i = 0, l = Math.log2( array.length ); i < l; i += 1 ) {
			const next = [];

			for ( let i = 0; i < holder.length; i += 2 ) {
				next.push( merge( holder[ i ], holder[ i + 1 ], compare ) );
			}

			holder = next.concat( holder );
		}

		return holder[ 0 ];
	}
};

/**
 * @template T
 * @callback Comparator
 * @param {T} left
 * @param {T} right
 * @returns {number}
 */
