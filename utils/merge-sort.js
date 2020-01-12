/**
 * `SortCompare()` abstract operation as defined in [Runtime Semantics: SortCompare ( x, y )](
 * https://www.ecma-international.org/ecma-262/10.0/index.html#sec-sortcompare
 * "ECMAScript® 2019 Language Specification")
 *
 * @param {any} x
 * @param {any} y
 * @returns {-1 | 0 | 1}
 */
const sortCompare = ( x, y ) => {
	if ( x === undefined && y === undefined ) {
		return +0;
	} else if ( x === undefined ) {
		return 1;
	} else if ( y === undefined ) {
		return -1;
	} else {
		const xString = String( x ),
			yString = String( y );

		if ( xString < yString ) {
			return -1;
		} else if ( yString < xString ) {
			return 1;
		} else {
			return +0;
		}
	}
};

/**
 * Concat two ordered array
 *
 * @template T
 * @param {Iterable<T>} left
 * @param {Iterable<T>} right
 * @param {Comparator<T>} compare
 * @returns {Generator<T>}
 */
function* merge( left, right, compare ) {
	const leftIt = left[ Symbol.iterator ](),
		rightIt = right[ Symbol.iterator ]();

	let leftResult = leftIt.next(),
		rightResult = rightIt.next();

	while ( !leftResult.done && !rightResult.done ) {
		if ( compare( leftResult.value, rightResult.value ) < 0 ) {
			yield leftResult.value;
			leftResult = leftIt.next();
		} else {
			yield rightResult.value;
			rightResult = rightIt.next();
		}
	}

	if ( !leftResult.done ) {
		yield leftResult.value;
		yield* { [ Symbol.iterator ]() { return leftIt; } };
	} else if ( !rightResult.done ) {
		yield rightResult.value;
		yield* { [ Symbol.iterator ]() { return rightIt; } };
	}
};

/**
 * Sort an array using merge sort algorithm
 *
 * @template T
 * @param {T[]} array
 * @param {Comparator<T>} [compare]
 * @returns {T[]}
 */
export const mergeSort = ( array, compare = sortCompare ) => {
	if ( array.length === 1 ) {
		return array;
	} else {
		let holder = array.map( e => [ e ] );

		for ( let i = 0, l = Math.log2( array.length ); i < l; i += 1 ) {
			const next = [];
			let i = 0;

			for ( let l = holder.length - 1; i < l; i += 2 ) {
				next.push( Array.from( merge( holder[ i ], holder[ i + 1 ], compare ) ) );
			}

			holder = i + 1 < holder.length ?
				next.concat( holder.slice( i + 1 ) ) :
				next;
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
