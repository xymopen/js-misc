/// <reference lib="dom" />

/**
 * Returns variables declared globally
 */
export const variables = () => {
	const frame = document.createElement( "iframe" );
	/** @type {Record<PropertyKey, any>} */
	const vars = {};

	frame.style.display = "none";
	document.body.appendChild( frame );


	const emptyWindow = /** @type {Window} */ ( frame.contentWindow );

	Reflect.ownKeys( window )
		.filter( name => !emptyWindow.hasOwnProperty( name ) )
		.reduce( ( map, name ) => {
			// @ts-ignore
			map[ name ] = window[ name ];
			
			return map;
		}, vars );

	document.body.removeChild( frame );

	return vars;
};
