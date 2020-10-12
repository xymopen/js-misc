/**
 * If a `value` is present, and the `value` matches the given predicate, return the `value`, otherwise return `undefined`.
 *
 * @template T, U
 * @param {T} value
 * @param {BoundMapper<Exclude<T, undefined | null>, U | undefined, boolean>} predicate
 * @param {U} [thisArg] - An object to which the this keyword can refer inside the new function.
 * @returns {T | undefined}
 */
export const filter = ( value, predicate, thisArg ) =>
	value != undefined &&
		predicate.call( thisArg, /** @type {Exclude<T, undefined | null>} */( value ) ) ?
		value :
		undefined;

/**
 * If a `value` is present, apply the provided mapping function to it, return the result.
 *
 * @template T, U, V
 * @param {T} value
 * @param {BoundMapper<Exclude<T, undefined | null>, U | undefined, V>} mapper
 * @param {U} [thisArg] - An object to which the this keyword can refer inside the new function.
 * @returns {V | undefined}
 */
export const map = ( value, mapper, thisArg ) =>
	value != undefined ?
		mapper.call( thisArg, /** @type {Exclude<T, undefined | null>} */( value ) ) :
		undefined;

/**
 * If a `value` is present, invoke the specified consumer with the `value`, otherwise do nothing.
 *
 * @template T, U
 * @param {T} value
 * @param {BoundMapper<Exclude<T, undefined | null>, U | undefined, void>} consumer
 * @param {U} [thisArg] - An object to which the this keyword can refer inside the new function.
 */
export const call = ( value, consumer, thisArg ) =>
	void map( value, consumer, thisArg );

/**
 * Return the `value` if present, otherwise throw `err`.
 *
 * @template T
 * @param {T} value
 * @param {any} err
 * @returns {Exclude<T, undefined | null>}
 */
export const orThrow = ( value, err ) => {
	if ( value != undefined ) {
		return /** @type {Exclude<T, undefined | null>} */ ( value );
	} else {
		throw err;
	}
};

/**
 * @template T, U, V
 * @callback BoundMapper
 * @param {U} this
 * @param {T} value
 * @returns {V}
 */
