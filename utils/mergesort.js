/**
 * Join two ordered array into one ordered array
 * @param {Array<any>} left 
 * @param {Array<any>} right 
 * @param {( any, any )=>Number} compareFunction 
 */
function merge( here, there, compareFunction = ( a, b ) => a - b ) {
	var result = [];

	while ( here.length > 0 && there.length > 0 ) {
		if ( compareFunction( here[ 0 ], there[ 0 ] ) > 0 ) {
			[ here, there ] = [ there, here ];
		}

		result.push( here.shift() );
	}

	if ( here.length > 0 ) {
		result = result.concat( here );
	} else if ( there.length > 0 ) {
		result = result.concat( there );
	}

	return result;
};

/**
 * Sort an array using merge sort algorithm
 * @param {Array<any>} array 
 * @param {(any,any)=>Number} compareFunction 
 */
function mergesort( array, compareFunction = ( a, b ) => a - b ) {
	if ( array.length === 1 ) {
		return array;
	} else {
		let holder = array.map( e => [ e ] );

		for ( let i = 0, l = Math.log2( array.length ); i < l; i += 1 ) {
			let next = [], len = holder.length;

			for ( let i = 0; i < len; i += 2 ) {
				let left = holder.shift(),
					right = holder.shift();

				next.push( merge( left, right, compareFunction ) );
			}

			holder = next.concat( holder );
		}

		return holder[ 0 ];
	}
};
