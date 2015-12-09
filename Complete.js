/*
https://secure.php.net/manual/cn/function.mb-strwidth.php
		Characters width
		Chars			Width
	U+0000 - U+0019		0
	U+0020 - U+1FFF		1
	U+2000 - U+FF60		2
	U+FF61 - U+FF9F		1
	U+FFA0 -       		2
*/

function getCharWidth( character ) {
	"use strict";
	
	var code = character.charCodeAt( 0 );
	
	return ( code < 0x0020 ) ? 0 :
		( code < 0x2000 ) ? 1 :
		( code < 0xFF61 ) ? 2 :
		( code < 0xFFA0 ) ? 1 : 2;
};

function getStringWidth( str ) {
	"use strict";
	
	return str.split( "" ).map( getCharWidth ).reduce( function( a, b ) {
		return a + b;
	} );
}

var Complete = {
	"left": function left( str, width, fillChar ) {
		"use strict";
		
		var i, strWidth = getStringWidth( str );
		
		if ( strWidth > width ) {
			throw new Error( "ERR_STRING_TOO_WIDE_TO_COMPLETE" );
		} else {
			if ( !fillChar ) {
				fillChar = "\x20";
			}
			
			for ( i = strWidth; i < width; i += 1 ) {
				str += fillChar;
			}
			
			return str;
		}
	},
	
	"center": function center( str, width, fillChar ) {
		"use strict";
		
		var i, prefixFilling, suffixFilling,
			strWidth = getStringWidth( str );
		
		if ( strWidth > width ) {
			throw new Error( "ERR_STRING_TOO_WIDE_TO_COMPLETE" );
		} else {
			if ( !fillChar ) {
				fillChar = "\x20";
			}
			
			prefixFilling = Math.floor( ( width - strWidth ) / 2 );
			suffixFilling = width - strWidth - prefixFilling;
			
			for ( i = 0; i < prefixFilling; i += 1 ) {
				str += fillChar;
			}
			
			for ( i = 0; i < suffixFilling; i += 1 ) {
				str = fillChar + str;
			}
			
			return str;
		}
	},
	
	"right": function right( str, width, fillChar ) {
		"use strict";
		
		var i, strWidth = getStringWidth( str );
		
		if ( strWidth > width ) {
			throw new Error( "ERR_STRING_TOO_WIDE_TO_COMPLETE" );
		} else {
			if ( !fillChar ) {
				fillChar = "\x20";
			}
			
			for ( i = strWidth; i < width; i += 1 ) {
				str = fillChar + str;
			}
			
			return str;
		}
	}
};