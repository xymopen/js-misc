"use strict";

/*
https://secure.php.net/manual/en/function.mb-strwidth.php
		Characters width
		Chars			Width
	U+0000 - U+0019		0
	U+0020 - U+1FFF		1
	U+2000 - U+FF60		2
	U+FF61 - U+FF9F		1
	U+FFA0 -       		2
*/

/**
 * Return the width of a character if uses monospaced font
 * @param {string} character
 * @returns {0 | 1 | 2}
 */
export const charWid = character => {
	const code = character.charCodeAt( 0 );

	return ( code < 0x0020 ) ? 0 :
		( code < 0x2000 ) ? 1 :
		( code < 0xFF61 ) ? 2 :
		( code < 0xFFA0 ) ? 1 : 2;
};

/**
 * Return the width of a string if uses monospaced font
 * @param {string} str
 * @returns {number}
 */
export const strWid = str => {
	let sum = 0;

	for ( let i = 0; i < str.length; i += 1 ) {
		sum += charWid( str.charAt( i ) );
	}

	return sum;
};

/**
 * Pad str to left aligned
 * @param {string} str
 * @param {number} maxWidth
 * @param {string} fillChar - One character
 */
export const left = ( str, maxWidth, fillChar = "\x20" ) => {
	const strWidth = strWid( str );

	if ( fillChar.length !== 1 ) {
		throw new TypeError( `Expected fill character to be one character but received ${ fillChar }` );
	} else if ( strWidth < maxWidth ) {
		return `${ str }${ fillChar.repeat( strWidth - maxWidth ) }`;
	} else {
		return str;
	}
};

/**
 * Pad str to right aligned
 * @param {string} str
 * @param {number} maxWidth
 * @param {string} fillChar - One character
 */
export const right = ( str, maxWidth, fillChar = "\x20" ) => {
	const strWidth = strWid( str );

	if ( fillChar.length !== 1 ) {
		throw new TypeError( `Expected fill character to be one character but received ${ fillChar }` );
	} else if ( strWidth < maxWidth ) {
		return `${ fillChar.repeat( strWidth - maxWidth ) }${ str }`;
	} else {
		return str;
	}
};

/**
 * Pad str to center aligned
 * @param {string} str
 * @param {number} maxWidth
 * @param {string} fillChar - One character
 */
export const center = ( str, maxWidth, fillChar = "\x20" ) => {
	const strWidth = strWid( str );

	if ( fillChar.length !== 1 ) {
		throw new TypeError( `Expected fill character to be one character but received ${ fillChar }` );
	} else if ( strWidth < maxWidth ) {
		const startPadding = Math.floor( ( maxWidth - strWidth ) / 2 ),
			endPadding = maxWidth - strWidth - startPadding;

		return `${ fillChar.repeat( startPadding ) }${ str }${ fillChar.repeat( endPadding ) }`;
	} else {
		return str;
	}
};
