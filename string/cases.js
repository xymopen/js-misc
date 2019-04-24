/**
 * Convert from kebab-case to camelCase
 *
 * @param {string} str
 */
export const camelCase = str => str.replace( /-[a-z]/g, $0 => $0.charAt( 1 ).toUpperCase() );

/**
 * Convert from camelCase to kebab-case
 * 
 * @param {string} str
 */
export const kebabCase = str => str.replace( /[A-Z]/g, $0 => `-${ $0.toLowerCase() }` );
