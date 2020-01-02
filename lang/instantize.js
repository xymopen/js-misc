/**
 * @template {new (...args: any[]) => any} C
 * @param {C} constructor
 * @param  {ConstructorParameters<C>} args
 * @returns {InstanceType<C>}
 */
export const instantize = ( constructor, ...args ) => {
	/** @type {InstanceType<C>} */
	const newObject = Object.create( constructor.prototype );

	const result = /** @type {InstanceType<C> | undefined} */ (
		constructor.apply( newObject, args ) );

	return ( typeof result === "object" && result !== null ) ? result : newObject;
};
