/**
 * convert from kebab-case to camelCase
 *
 * @param {string} str
 */
const camelCase = str => str.replace( /-[a-z]/g, $0 => $0.charAt( 1 ).toUpperCase() );

/**
 * convert from camelCase to kebab-case
 * 
 * @param {string} str
 */
const kebabCase = str => str.replace( /[A-Z]/g, $0 => `-${ $0.toLowerCase() }` );
