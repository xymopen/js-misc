/**
 * @template T
 * @param {string} title
 * @param {T} node
 * @param {Deepener<T>} deepen
 * @param {string} ps1 - prompt string for first line of normal entry
 * @param {string} ps2 - prompt string for normal line of normal entry
 * @param {string} ps3 - prompt string for first line of last entry
 * @param {string} ps4 - prompt string for normal line of last entry
 * @param {string} is1 - indent string for normal entry
 * @param {string} is2 - indent string for last entry
 * @returns {Generator<string, void>}
 */
function* treeNode(
	title, node, deepen,
	ps1, ps2,
	ps3, ps4,
	is1, is2
) {
	yield `${ is1 }${ title }`;

	if ( node !== undefined ) {
		const children = deepen( node );
		const result = children.next();

		if ( !result.done ) {
			let lastValue = /** @type {[string] | [string, T]} */
				( result.value );

			while ( true ) {
				const result = children.next();
				const [ title, child ] = lastValue;

				if ( result.done ) {
					yield* treeNode(
						title,
						/** @type {T} */( child ),
						deepen,
						ps1, ps2,
						ps3, ps4,
						`${ is2 }${ ps3 }`,
						`${ is2 }${ ps4 }`
					);

					break;
				} else {
					yield* treeNode(
						title,
						/** @type {T} */( child ),
						deepen,
						ps1, ps2,
						ps3, ps4,
						`${ is2 }${ ps1 }`,
						`${ is2 }${ ps2 }`
					);

					lastValue = /** @type {[string] | [string, T]} */
						( result.value );
				}
			}
		}
	}
};

/**
 * List contents in a tree-like format
 *
 * @template T
 * @param {string} title
 * @param {T} node
 * @param {Deepener<T>} deepen
 * @param {string} ps1 - prompt string for first line of normal entry
 * @param {string} ps2 - prompt string for normal line of normal entry
 * @param {string} ps3 - prompt string for first line of last entry
 * @param {string} ps4 - prompt string for normal line of last entry
 * @example
 * // Shell TREE(1)
 * for ( const line of tree( process.cwd(), process.cwd(), function* ( dirname ) {
 * 	for ( const filename of fs.readdirSync( dirname ) ) {
 * 		const pathname = path.join( dirname, filename );
 *
 * 		if ( fs.statSync( pathname ).isDirectory() ) {
 * 			yield [ filename, pathname ];
 * 		} else {
 * 			yield [ filename ];
 * 		}
 * 	}
 * } ) ) {
 * 	console.log( line );
 * }
 */
export function* tree(
	title, node, deepen,
	ps1 = "+-- ", ps2 = "|   ",
	ps3 = "`-- ", ps4 = "    "
) {
	yield* treeNode(
		title,
		node,
		deepen,
		ps1, ps2,
		ps3, ps4,
		"",
		""
	);
};

/**
 * @template T
 * @callback Deepener
 * @param {T} context
 * @returns {Iterator<[string] | [string, T], void>}
 */
