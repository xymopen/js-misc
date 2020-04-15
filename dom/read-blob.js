/// <reference lib="dom" />

/**
 * @param {Blob} blob
 * @param {KeyOfType<FileReader, (blob: Blob) => void>} method
 */
const readAs = ( blob, method ) => new Promise( ( resolve, reject ) => {
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
export const readBlob = blob => ( {
	/** @returns {Promise<ArrayBuffer>} */
	arrayBuffer() {
		return readAs( blob, "readAsArrayBuffer" );
	},

	/** @returns {Promise<string>} */
	binaryString() {
		return readAs( blob, "readAsBinaryString" );
	},

	/** @returns {Promise<string>} */
	dataURL() {
		return readAs( blob, "readAsDataURL" );
	},

	/** @returns {Promise<string>} */
	text() {
		return readAs( blob, "readAsText" );
	}
} );

/**
 * @template T, U
// @ts-ignore
 * @typedef {{ [ P in keyof T ]: T[ P ] extends U ? P : never }[ keyof T ]} KeyOfType
 * @see https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
 */
