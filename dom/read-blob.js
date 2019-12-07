/// <reference lib="dom" />

/**
 * @param {Blob} blob
 * @param {KeyOfType<FileReader, (blob: Blob) => void>} method
 */
const read = ( blob, method ) => new Promise( ( resolve, reject ) => {
	const reader = new FileReader();

	reader.addEventListener( "load", () => resolve( reader.result ) );
	reader.addEventListener( "error", () => reject( reader.error ) );
	reader[ method ]( blob );
} );

/**
 * Provide `Body`-like consumption API for `Blob`s
 *
 * @param {Blob} blob
 */
export const readBlob = blob => {
	const returns = {};

	if ( typeof FileReader.prototype.readAsArrayBuffer === "function" ) {
		/** @returns {Promise<ArrayBuffer>} */
		returns.arrayBuffer = () => read( blob, "readAsArrayBuffer" );
	}

	if ( typeof FileReader.prototype.readAsBinaryString === "function" ) {
		/** @returns {Promise<ArrayBuffer>} */
		returns.binaryString = () => read( blob, "readAsBinaryString" );
	}

	if ( typeof FileReader.prototype.readAsDataURL === "function" ) {
		/** @returns {Promise<ArrayBuffer>} */
		returns.dataURL = () => read( blob, "readAsDataURL" );
	}

	if ( typeof FileReader.prototype.readAsText === "function" ) {
		/** @returns {Promise<ArrayBuffer>} */
		returns.text = () => read( blob, "readAsText" );
	}

	return returns;
};

/**
 * @template T, U
// @ts-ignore
 * @typedef {{ [ P in keyof T ]: T[ P ] extends U ? P : never }[ keyof T ]} KeyOfType
 * @see https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
 */
