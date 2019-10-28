/// <reference lib="es2015.promise" />
/// <reference lib="esnext.asynciterable" />

/**
 * @template T
 * @param {Iterator<T>} iterator
 * @param {onCallback<T>} callback
 */
export const forEachOf = ( iterator, callback ) => {
	for ( let cur = iterator.next(); !cur.done; cur = iterator.next() ) {
		callback( cur.value );
	}
};

/**
 * @template T
 * @param {AsyncIterator<T>} iterator
 * @param {onCallback<T>} callback
 * @returns {Promise<void>}
 */
export const forAwaitEachOf = ( iterator, callback ) =>
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
		} )( iterator );
	} );

/**
 * @template T
 * @callback onCallback
 * @param {T} value
 * @returns {void}
 */
