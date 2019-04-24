/// <reference lib="es2015.iterable" />

/**
 * @template C, R
 * @param {C} context
 * @param {Iterator<Middleware<C, R>>} middles
 * @param {Bottomware<C, R>} bottom
 */
export const execute = ( context, middles, bottom ) => {
	/**
	 * @param {C} context
	 * @returns {R}
	 */
	const next = context => {
		const record = middles.next();

		if ( record.done ) {
			return bottom( context );
		} else {
			const middleware = record.value;

			return middleware( context, next );
		}
	};

	return next( context );
};

/**
 * `Koa`-style middleware API which implements
 * [chain of responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern
 * "Chain-of-responsibility pattern - Wikipedia") design pattern
 * 
 * @template C
 * @param {Bottomware<C, Promise<void>>} bottom
 */
export const app = bottom => {
	/** @type {Middleware<C, Promise<void>>[]} */
	const middlewares = [];
	/** @param {C} context */
	const exec = context =>
		execute( context, middlewares[ Symbol.iterator ](), bottom );

	/** @param {Middleware<C, Promise<void>>} middleware */
	exec.use = middleware => {
		if ( typeof middleware === "function" ) {
			middlewares.push( ( ctx, next ) => {
				try {
					return Promise.resolve( middleware( ctx, next ) );
				} catch ( error ) {
					return Promise.reject( error );
				}
			} );
		} else {
			throw new TypeError( "Middleware must be a function" );
		}
	};

	return exec;
};

/**
 * @template C, R
 * @callback Bottomware
 * @param {C} context
 * @returns {R}
 */

/**
 * @template C, R
 * @callback Middleware
 * @param {C} context
 * @param {Bottomware<C, R>} next
 * @returns {R}
 */
