/// <reference lib="es2015.promise" />
/// <reference lib="esnext.asynciterable" />

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {onCallback<T>} callback
 */
export const forEachOf = ( iterable, callback ) => {
	for (
		let iterator = iterable[ Symbol.iterator ](),
			cur = iterator.next();
		!cur.done;
		cur = iterator.next()
	) {
		callback( cur.value );
	}
};

/**
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {onCallback<T>} callback
 * @returns {Promise<void>}
 */
export const forAwaitEachOf = ( iterable, callback ) =>
	new Promise( ( resolve, reject ) => {
		( function iterate( iterator ) {
			iterator.next().then( cur => {
				if ( cur.done ) {
					resolve();
				} else {
					callback( cur.value );
					iterate( iterator );
				}
			}, reject );
		} )( iterable[ Symbol.asyncIterator ]() );
	} );

/**
 * @template T
 * @callback onCallback
 * @param {T} value
 * @returns {void}
 */
