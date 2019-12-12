/// <reference lib="es2015.iterable" />
/// <reference lib="es2018.asynciterable" />
/// <reference lib="es2019.object" />

/**
 * @template T
 * @param {T} object
 * @param {keyof T} key
 * @returns {boolean}
 */
const hasKey = ( object, key ) =>
	Object.prototype.hasOwnProperty.call( object, key );

/**
 * @param {any} value
 * @returns {value is object}
 */
const isObject = value =>
	typeof value === "object" &&
	value !== null;

/**
 * @param {any} newValue
 * @param {PropertyKey} key
 * @param {object | Array} parent
 * @param {PropertyKey[]} path
 * @param {object | Array} root
 * @param {Merger} merge
 * @param {ResetParent} resetParent
 */
const setNewValue = ( newValue, key, parent, path, root, merge, resetParent ) => {
	if ( typeof key === "number" && key >= 0 && key % 1 === 0 ) {
		if ( !Array.isArray( parent ) && 0 === Object.keys( parent ).length ) {
			parent = [];
			resetParent( parent );
		}
	} else if ( Array.isArray( parent ) ) {
		parent = Object.fromEntries( Object.entries( parent ) );
		resetParent( parent );
	}

	if ( hasKey( parent, key ) ) {
		parent[ key ] = merge( newValue, parent[ key ], key, parent, path, root );
	} else {
		parent[ key ] = newValue;
	}
};

/**
 * Convert `[ [ "foo", "bar" ], "baz" ]` to `{ "foo": { "bar": "baz" } }`
 *
 * @param {Iterable<[PropertyKey[], any]>} iterable
 * @param {Merger} [merge]
 */
export const fromDeepEntries = ( iterable, merge = newValue => newValue ) => {
	/** @type {object | Array} */
	let root = {};

	for ( const [ path, value ] of iterable ) {
		if ( path.length > 0 ) {
			/** @type {PropertyKey} */
			let parentKey;
			/** @type {object | Array} */
			let grandparent = null,
				parent = root;
			const lastKeyIdx = path.length - 1;

			/** @type {ResetParent} */
			const resetParent = newParent => {
				parent = newParent;

				if ( null === grandparent ) {
					root = newParent;
				} else {
					grandparent[ parentKey ] = newParent;
				}
			};

			for ( let i = 0; i < lastKeyIdx; i += 1 ) {
				const key = path[ i ];
				setNewValue(
					{}, key, parent, path.slice( 0, i ), root,
					( newValue, oldValue, ...args ) =>
						isObject( oldValue ) ?
							oldValue :
							merge( newValue, oldValue, ...args ),
					resetParent
				);

				parentKey = key;
				grandparent = parent;
				parent = parent[ key ];
			}

			setNewValue(
				value, path[ lastKeyIdx ], parent, path, root,
				merge, resetParent
			);
		}
	}

	return root;
};

/**
 * @param {any} object
 * @param {Key[]} ancestors
 * @returns {Generator<[Key[], any], void>}
 */
function* innerDeepEntries( object, ancestors ) {
	if ( Array.isArray( object ) ) {
		for ( let index = 0; index < object.length; index += 1 ) {
			if ( hasKey( object, index ) ) {
				const path = ancestors.concat( index ),
					value = object[ index ];

				yield* innerDeepEntries( value, path );
			}
		}
	} else if ( isObject( object ) ) {
		for ( const [ name, value ] of Object.entries( object ) ) {
			const path = ancestors.concat( name );

			yield* innerDeepEntries( value, path );
		}
	} else {
		yield [ ancestors, object ];
	}
};

/**
 * Convert `{ "foo": { "bar": "baz" } }` to `[ [ "foo", "bar" ], "baz" ]`
 * @param {object} object
 * @returns {Generator<[Key[], any], void>}
 */
export const deepEntries = ( object ) => {
	if ( Array.isArray( object ) || isObject( object ) ) {
		return innerDeepEntries( object, [] );
	} else {
		throw new TypeError();
	}
};

/**
 * @typedef {Exclude<PropertyKey, symbol>} Key
 */

/**
 * @callback ResetParent
 * @param {any} newParent
 * @returns {void}
 */

/**
 * @callback Merger
 * @param {any} newValue
 * @param {any} oldValue
 * @param {PropertyKey} key
 * @param {object | Array} parent
 * @param {PropertyKey[]} path
 * @param {object | Array} root
 * @returns {any}
 */
