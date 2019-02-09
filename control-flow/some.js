/**
 * Resolves when some promise resolved,
 * rejects when all promises rejected
 * @template T
 * @param {(T | PromiseLike<T>)[]} promises
 */
export const some = async promises => {
	/** @type {any[]} */
	const reasons = [];
	/** @type {T[] & {errors?: any[]}} */
	let values = [];

	for ( let promise of promises ) {
		try {
			values.push( await promise );
		} catch ( error ) {
			reasons.push( error );
		}
	}

	if ( values.length > 0 ) {
		if ( reasons.length > 0 ) {
			values.errors = reasons;
		}

		return values;
	} else {
		throw reasons;
	}
};
