/**
 * @param {string} url
 * @param {string} filename - Only effective when url is from same origin to document
 */
export const download = ( url, filename = new URL( url ).pathname.split( "/" ).pop() ) => {
	const a = document.createElement( "a" );

	a.download = filename;
	a.href = url;
	a.rel = "noopener"
	a.target = "_blank";

	a.click();
};
