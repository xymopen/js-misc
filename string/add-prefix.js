/*
https://en.wikipedia.org/wiki/Metric_prefix
			List of SI prefixes
		SI			1000^m			10^n
	Name	Symbol
	yotta	Y		1000^8			10^2
	zetta	Z		1000^7			10^2
	exa		E		1000^6			10^18
	peta	P		1000^5			10^15
	tera	T		1000^4			10^12
	giga	G		1000^3			10^9
	mega	M		1000^2			10^6
	kilo	k		1000^1			10^3
	hecto	h		1000^(2/3)		10^2
	deca	da		1000^(1/3)		10^1
					1000^0			10^0
	deci	d		1000^−(1/3)		10^−1
	centi	c		1000^−(2/3)		10^−2
	milli	m		1000^−1			10^−3
	micro	μ		1000^−2			10^−6
	nano	n		1000^−3			10^−9
	pico	p		1000^−4			10^−12
	femto	f		1000^−5			10^−15
	atto	a		1000^−6			10^-18
	zepto	z		1000^−7			10^−21
	yocto	y		1000^−8			10−^24
*/

/*
https://en.wikipedia.org/wiki/Binary_prefix
						List of Binary prefixes
		IEC					JEDEC			1024^m		2^n
	Name	Symbol		Name	Symbol
	kibi	Ki			kilo	K			1024^1		2^10
	mebi	Mi			mega	M			1024^2		2^20
	gibi	Gi			giga	G			1024^3		2^30
	tebi	Ti								1024^4		2^40
	pebi	Pi								1024^5		2^50
	exbi	Ei								1024^6		2^60
	zebi	Zi								1024^7		2^70
	yobi	Yi								1024^8		2^80
*/

var SCALE = 1, FIXED = 2;

var SI_PREFIXES = [
	{ "multiple": 1e24,		"symbol": "Y"  },
	{ "multiple": 1e21,		"symbol": "Z"  },
	{ "multiple": 1e18,		"symbol": "E"  },
	{ "multiple": 1e15,		"symbol": "P"  },
	{ "multiple": 1e12,		"symbol": "T"  },
	{ "multiple": 1e9,		"symbol": "G"  },
	{ "multiple": 1e6,		"symbol": "M"  },
	{ "multiple": 1e3,		"symbol": "k"  },
	{ "multiple": 1e2,		"symbol": "h"  },
	{ "multiple": 1e1,		"symbol": "da" },
	{ "multiple": 1,		"symbol": ""   },
	{ "multiple": 1e-1,		"symbol": "d"  },
	{ "multiple": 1e-2,		"symbol": "c"  },
	{ "multiple": 1e-3,		"symbol": "m"  },
	{ "multiple": 1e-6,		"symbol": "μ"  },
	{ "multiple": 1e-9,		"symbol": "n"  },
	{ "multiple": 1e-12,	"symbol": "p"  },
	{ "multiple": 1e-15,	"symbol": "f"  },
	{ "multiple": 1e-18,	"symbol": "a"  },
	{ "multiple": 1e-21,	"symbol": "z"  },
	{ "multiple": 1e-24,	"symbol": "y"  }
];

var BINARY_PREFIXES = [
	{ "multiple": Math.pow( 2, 80 ),	"symbol": "Yi" },
	{ "multiple": Math.pow( 2, 70 ),	"symbol": "Zi" },
	{ "multiple": Math.pow( 2, 60 ),	"symbol": "Ei" },
	{ "multiple": Math.pow( 2, 50 ),	"symbol": "Pi" },
	{ "multiple": Math.pow( 2, 40 ),	"symbol": "Ti" },
	{ "multiple": Math.pow( 2, 30 ),	"symbol": "Gi" },
	{ "multiple": Math.pow( 2, 20 ),	"symbol": "Mi" },
	{ "multiple": Math.pow( 2, 10 ),	"symbol": "Ki" }
];

function toTrimmedFixed( f, n ) {
	"use strict";

	return f.toFixed( n ).replace( /0+$/, "" ).replace( /\.$/, "" );
};

function addPrefix( n, prefixes ) {
	"use strict";

	var i, prefix, multiple;

	for ( i = 0; i < prefixes.length; i += 1 ) {
		prefix = prefixes[ i ];
		multiple = prefix.multiple;

		if ( n >= SCALE * multiple ) {
			return toTrimmedFixed( n / multiple, FIXED ) + prefix.symbol;
		}
	}

	return toTrimmedFixed( n, FIXED );
};