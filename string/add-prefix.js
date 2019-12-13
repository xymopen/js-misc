/**
 * [List of SI prefixes](https://en.wikipedia.org/wiki/Metric_prefix#List_of_SI_prefixes "Metric prefix - Wikipedia")
 *
 *  SI Name | SI Symbol |    1000^m   | 10^n
 * :-------:|:---------:|:-----------:|:----:
 *   yotta  |     Y     |    1000^8   | 10^24
 *   zetta  |     Z     |    1000^7   | 10^21
 *    exa   |     E     |    1000^6   | 10^18
 *    peta  |     P     |    1000^5   | 10^15
 *    tera  |     T     |    1000^4   | 10^12
 *    giga  |     G     |    1000^3   |  10^9
 *    mega  |     M     |    1000^2   |  10^6
 *    kilo  |     k     |    1000^1   |  10^3
 *   hecto  |     h     |  1000^(2/3) |  10^2
 *    deca  |     da    |  1000^(1/3) |  10^1
 *    N/A   |    N/A    |    1000^0   |  10^0
 *    deci  |     d     | 1000^−(1/3) |  10^−1
 *   centi  |     c     | 1000^−(2/3) |  10^−2
 *   milli  |     m     |   1000^−1   |  10^−3
 *   micro  |     μ     |   1000^−2   |  10^−6
 *    nano  |     n     |   1000^−3   |  10^−9
 *    pico  |     p     |   1000^−4   | 10^−12
 *   femto  |     f     |   1000^−5   | 10^−15
 *    atto  |     a     |   1000^−6   | 10^-18
 *   zepto  |     z     |   1000^−7   | 10^−21
 *   yocto  |     y     |   1000^−8   | 10−^24
 *
 * @type {Prefix[]}
 */
export const SI_PREFIXES = [
	{ multiple: 1e24,	symbol: "Y"  },
	{ multiple: 1e21,	symbol: "Z"  },
	{ multiple: 1e18,	symbol: "E"  },
	{ multiple: 1e15,	symbol: "P"  },
	{ multiple: 1e12,	symbol: "T"  },
	{ multiple: 1e9,	symbol: "G"  },
	{ multiple: 1e6,	symbol: "M"  },
	{ multiple: 1e3,	symbol: "k"  },
	{ multiple: 1e2,	symbol: "h"  },
	{ multiple: 1e1,	symbol: "da" },
	{ multiple: 1,		symbol: ""   },
	{ multiple: 1e-1,	symbol: "d"  },
	{ multiple: 1e-2,	symbol: "c"  },
	{ multiple: 1e-3,	symbol: "m"  },
	{ multiple: 1e-6,	symbol: "μ"  },
	{ multiple: 1e-9,	symbol: "n"  },
	{ multiple: 1e-12,	symbol: "p"  },
	{ multiple: 1e-15,	symbol: "f"  },
	{ multiple: 1e-18,	symbol: "a"  },
	{ multiple: 1e-21,	symbol: "z"  },
	{ multiple: 1e-24,	symbol: "y"  }
];

/**
 * [Specific units of IEC 60027-2 A.2 and ISO/IEC 80000](
 * https://en.wikipedia.org/wiki/Binary_prefix#Adoption_by_IEC.2C_NIST_and_ISO
 * "Binary prefix - Wikipedia")
 *
 *  IEC Name | IEC Symbol | JEDEC Name | JEDEC Symbol | 1024^m | 2^n
 * :--------:|:----------:|:----------:|:------------:|:------:|:---:
 *    kibi   |     Ki     |    kilo    |       K      | 1024^1 | 2^10
 *    mebi   |     Mi     |    mega    |       M      | 1024^2 | 2^20
 *    gibi   |     Gi     |    giga    |       G      | 1024^3 | 2^30
 *    tebi   |     Ti     |     N/A    |      N/A     | 1024^4 | 2^40
 *    pebi   |     Pi     |     N/A    |      N/A     | 1024^5 | 2^50
 *    exbi   |     Ei     |     N/A    |      N/A     | 1024^6 | 2^60
 *    zebi   |     Zi     |     N/A    |      N/A     | 1024^7 | 2^70
 *    yobi   |     Yi     |     N/A    |      N/A     | 1024^8 | 2^80
 *
 * @type {Prefix[]}
 */
export const BINARY_PREFIXES = [
	{ multiple: Math.pow( 2, 80 ),	symbol: "Yi" },
	{ multiple: Math.pow( 2, 70 ),	symbol: "Zi" },
	{ multiple: Math.pow( 2, 60 ),	symbol: "Ei" },
	{ multiple: Math.pow( 2, 50 ),	symbol: "Pi" },
	{ multiple: Math.pow( 2, 40 ),	symbol: "Ti" },
	{ multiple: Math.pow( 2, 30 ),	symbol: "Gi" },
	{ multiple: Math.pow( 2, 20 ),	symbol: "Mi" },
	{ multiple: Math.pow( 2, 10 ),	symbol: "Ki" }
];

/**
 * @param {number} n
 * @param {number} [fractionDigits]
 */
export const toTrimmedFixed = ( n, fractionDigits = 0 ) =>
	n.toFixed( fractionDigits ).replace( /\.?0+$/, "" );

/**
 * @param {number} n
 * @param {Iterable<Prefix>} [prefixes] - Ascending prefixes
 * @param {number} [ratio]
 * @param {ToFixed} [toFixed]
 */
export function addPrefix( n, prefixes = SI_PREFIXES, ratio = 0.8, toFixed = n => toTrimmedFixed( n, 2 ) ) {
	for ( const { multiple, symbol } of prefixes ) {
		if ( n >= ratio * multiple ) {
			return `${ toFixed( n / multiple ) }${ symbol }`;
		}
	}

	return toFixed( n );
};

/**
 * @typedef Prefix
 * @property {number} multiple
 * @property {string} symbol
 */

/**
 * @callback ToFixed
 * @param {number} n
 * @param {number} [fractionDigits]
 * @returns {string}
 */
