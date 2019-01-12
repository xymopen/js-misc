/// <reference lib="es2017" />

/**
 * convert plain object to appendable data
 *
 * @template V
 * @template {Appendable<V>} T
 * @param {Record<string, V>} data
 * @param {T} struct
 * @returns {T}
 */
const toAppend = ( data, struct ) =>
	Object.entries( data ).reduce( ( struct, [ name, value ] ) => {
		struct.append( name, value );

		return struct;
	}, struct );

/**
 * convert plain object to FormData
 *
 * @param {Record<string, string | Blob>} data
 */
export const toFormData = data => toAppend( data, new FormData() );

/**
 * convert plain object to URLSearchParams
 * 
 * @param {Record<string, string>} data
 */
export const toSearchParams = data => toAppend( data, new URLSearchParams() );

/**
 *
 * @template V
 * @typedef Appendable
 * @property {(name: string, value: V) => void} append
 */
