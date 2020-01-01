// Row major order, 0 indexed, C
// ( ( y ) * width + x ) * channels + c
const addr = ( indexes, shape ) =>
	indexes.reduce(
		( offset, index, i ) =>
			offset * shape[ i ] + index
	);

// Column major order, 0 indexed, Fortran
// y + height * ( x + width * ( c ) )
const addrCMO = ( indexes, shape ) =>
	indexes.reduceRight(
		( offset, index, i ) =>
			index + shape[ i ] * offset
	);
