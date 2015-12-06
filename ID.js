var ID = {
	"IDs": Object.create( null ),
	
	"generate": function generate() {
		"use strict";
		
		var IDs = this.IDs, id;
		
		do {
			id = Math.round( Math.random() * 0xFFFFFFFF ).toString( 16 );
		} while ( Object.prototype.hasOwnProperty.call( IDs, id ) );
		
		IDs[ id ] = true;
		
		return id;
	},
	
	"release": function release( id ) {
		"use strict";
		
		var IDs = this.IDs;
		
		if ( Object.prototype.hasOwnProperty.call( IDs, id ) ) {
			delete IDs[ id ];
		}
	}
};