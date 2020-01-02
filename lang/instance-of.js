/**
 * @template T
 * @param {any} instance
 * @param {new (...args: any[]) => T} constructor
 * @returns {instance is T}
 */
export const instanceOf = ( instance, constructor ) => {
	let cur = instance;
	const proto = constructor.prototype;

	// Prototype chain terminated at `null`
	while ( cur !== null ) {
		cur = Object.getPrototypeOf( cur );

		// If the prototype is `constructor.prototype`
		// then `instance` is an instance of `constructor`
		if ( cur === proto ) {
			return true;
		}
	};

	// All prototypes are tested
	return false;
};
