/**
 * Returns variables declared globally
 */
export const variables = () => {
	const frame = document.createElement( "iframe" ),
		vars = {};

	frame.style.display = "none";
	document.body.appendChild( frame );

	const emptyWindow = frame.contentWindow;

	Reflect.ownKeys( window )
		.filter( name => !emptyWindow.hasOwnProperty( name ) )
		.reduce( ( map, name ) => {
			map[ name ] = window[ name ];
			return map;
		}, vars );

	document.body.removeChild( frame );

	return vars;
};
