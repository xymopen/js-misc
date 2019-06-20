/// <reference lib="dom" />

/**
 * Parse HTML Document for `fetch()`
 */
// @ts-ignore
Response.prototype.document = function document() {
	return this.blob().then(
		/** @returns {Promise<Document>} */ blob =>
			new Promise( ( resolve, reject ) => {
				var url = URL.createObjectURL( blob ),
					xhr = new XMLHttpRequest();

				xhr.responseType = "document";

				xhr.addEventListener( "load", () => {
					URL.revokeObjectURL( url );
					resolve( xhr.response );
				} );

				xhr.addEventListener( "error", event => {
					URL.revokeObjectURL( url );
					reject( event );
				} );

				xhr.open( "GET", url );
				xhr.send();
			} )
	);
};
