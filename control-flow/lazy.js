/**
 * Create a [lazy evaluated](https://en.wikipedia.org/wiki/Lazy_evaluation "Lazy evaluation - Wikipedia") promise
 *
 * @template T
 * @param {(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void} executor
 * @param {boolean} [sideEffect] - Whether `executor` has side effect
 * @returns {Promise<T>}
 */
export const lazy = ( executor, sideEffect = true ) => {
	let resolve, reject;

	/** @type {Promise<T>} */
	const promise = new Promise( ( _resolve, _reject ) => {
		resolve = _resolve;
		reject = _reject;
	} );

	const execute = ( () => {
		let executed = false;

		return () => {
			if ( !executed ) {
				executed = true;

				try {
					executor( resolve, reject );
				} catch ( error ) {
					reject( error );
				}
			}
		};
	} )();

	promise.then = function then( onFulfilled, onRejected ) {
		// onFulfilled === undefined => catch()
		// onFulfilled === onRejected => finally()
		if ( ( "function" === typeof onFulfilled ||
			( sideEffect && "function" === typeof onRejected ) ) &&
			// @ts-ignore
			onFulfilled !== onRejected ) {
			execute();
		}

		return Object.getPrototypeOf( this ).then.call( this, onFulfilled, onRejected );
	};

	return promise;
};

/**
 * @see https://stackoverflow.com/questions/48158730/extend-javascript-promise-and-resolve-or-reject-it-inside-constructor
 * `lazy()` cannot be provided as a subclass to `Promise()`
 * because `executor()` must be called during Promise construction
 */
