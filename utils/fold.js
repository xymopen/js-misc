/// <reference lib="es2017.object" />

/**
 * @template T
 * @param {T} object
 * @param {keyof T} key
 * @returns {boolean}
 */
const hasKey = ( object, key ) => Object.prototype.hasOwnProperty.call( object, key );

/**
 * @param {any} value
 * @returns {value is object}
 */
const isObject = value => typeof value === "object" && null !== value;

/**
 * @param {any} value
 * @returns {value is number}
 */
const isIndex = value => typeof value === "number" && value >= 0;

/**
 * @param {PropertyKey} nextKey
 * @param {object | array | undefined} parent
 */
const makeChild = ( nextKey, parent ) => {
	if ( isIndex( nextKey ) ) {
		if ( !isObject( parent ) ) {
			return [];
		}
	} else {
		if ( Array.isArray( parent ) ) {
			return parent.reduce( ( object, value, index ) =>
				( object[ index ] = value, object ), {} );
		} else if ( !isObject( parent ) ) {
			return {};
		}
	}

	return parent;
};

/** @type {(object: object, anonymity: any) => void} */
const defaultInsert = ( object, anonymity ) =>
	object._default = anonymity;

/**
 * Convert `[ [ "foo", "bar" ], "baz" ]` to `{ "foo": { "bar": "baz" } }`
 * @param {Iterable<[PropertyKey[], any]>} iterable
 * @param {(object: object, anonymity: any) => void} insert - insert the value which is at the
 * 	same lave of the object. For example `[ [ [ "foo" ], "bar" ], [ [ "foo", "bar" ], "baz" ] ]`
 */
export const fold = ( iterable, insert = defaultInsert ) => {
	const anonymities = [];
	let object;

	for ( const [ path, value ] of iterable ) {
		if ( path.length > 0 ) {
			object = makeChild( path[ 0 ], object );

			let i = 0, parent = object;

			for ( const l = path.length - 1; i < l; i += 1 ) {
				const key = path[ i ];
				const current = makeChild( path[ i + 1 ], parent[ key ] );

				if ( hasKey( parent, key ) && !isObject( parent[ key ] ) ) {
					anonymities.push( [ current, parent[ key ] ] );
				}

				parent = parent[ key ] = current;
			}

			const key = path[ i ];

			if ( hasKey( parent, key ) && isObject( parent[ key ] ) ) {
				anonymities.push( [ parent[ key ], value ] );
			} else {
				parent[ key ] = value;
			}
		}
	}

	anonymities.forEach( ( [ object, anonymity ] ) =>
		insert( object, anonymity ) );

	return object;
};

/**
 * @template {object} T
 * @param {T} object
 * @param {PropertyKey[]} ancestors
 * @param {(object: T) => any} extract
 * @returns {IterableIterator<[PropertyKey[], any]>}
 */
const unfoldObject = function* ( object, ancestors, extract ) {
	const anonymity = extract( object );

	if ( undefined !== anonymity ) {
		yield [ ancestors, anonymity ];
	}

	for ( const [ name, value ] of Object.entries( object ) ) {
		const path = ancestors.concat( name );

		if ( Array.isArray( value ) ) {
			yield* unfoldArray( value, path, extract );
		} else if ( typeof value === "object" && null !== value ) {
			yield* unfoldObject( value, path, extract );
		} else {
			yield [ path, value ];
		}
	}
};

/**
 * @template {object} T
 * @param {any[]} array
 * @param {PropertyKey[]} ancestors
 * @param {(object: T) => any} extract
 * @returns {IterableIterator<[PropertyKey[], any]>}
 */
const unfoldArray = function* ( array, ancestors, extract ) {
	for ( let index = 0; index < array.length; index += 1 ) {
		if ( hasKey( array, index ) ) {
			const path = ancestors.concat( index );
			const value = array[ index ];

			if ( Array.isArray( value ) ) {
				yield* unfoldArray( value, path, extract );
			} else if ( typeof value === "object" && null !== value ) {
				yield* unfoldObject( value, path, extract );
			} else {
				yield [ path, value ];
			}
		}
	}
};

/** @type {(object: any) => any} */
const defaultExtract = object => {
	const defaultValue = object._default;

	delete object._default;

	return defaultValue;
};

/**
 * Convert `{ "foo": { "bar": "baz" } }` to `[ [ "foo", "bar" ], "baz" ]`
 * @template {object} T
 * @param {T} object
 * @param {(object: T) => any} extract - extract a value which is at the same level of object.
 * 	For example `[ [ [ "foo" ], "bar" ], [ [ "foo", "bar" ], "baz" ] ]`
 * @returns {IterableIterator<[PropertyKey[], any]>}
 */
export const unfold = function* ( object, extract = defaultExtract ) {
	if ( Array.isArray( object ) ) {
		yield* unfoldArray( object, [], extract );
	} else if ( typeof object === "object" && null !== object ) {
		yield* unfoldObject( object, [], extract );
	} else {
		throw new TypeError();
	}
};
