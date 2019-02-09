/**
 * @template {TypedEventTarget<"load" | "error">} T
 * @param {T} target
 * @return {Promise<T>}
 */
export const ready = target =>
	new Promise( ( resolve, reject ) => {
		/** @param {ErrorEvent} ev */
		const rejectHandler = ev => reject( ev.error );

		target.addEventListener( "load", () => resolve( target ) );
		target.addEventListener( "error", rejectHandler );
	} );

/**
 * @template E
 * @typedef TypedEventTarget
 * @property {(event: Event) => boolean} dispatchEvent
 * @property {(type: E, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => void} addEventListener
 * @property {(type: E, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => void} removeEventListener
 */
