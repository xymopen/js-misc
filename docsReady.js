function domReady( onReady, contextWindow ) {
	var excuted = false;

	function onDelayedReady( event ) {
		if ( !excuted ) {
			excuted = true;
			onReady( event );
		}
	}

	if ( !contextWindow ) {
		contextWindow = window;
	}

	if ( "interactive" == contextWindow.document.readyState ) {
		onReady();
	} else {
		contextWindow.document.addEventListener( "DOMContentLoaded", onDelayedReady );
	}

	// In case DOMContentLoaded was not supported or not emitted or missed
	allReady( onDelayedReady, contextWindow );
}

function allReady( onReady, contextWindow ) {
	if ( !contextWindow ) {
		contextWindow = window;
	}

	if ( "complete" == contextWindow.document.readyState ) {
		onReady();
	} else {
		contextWindow.addEventListener( "load", onReady );
	}
}

function frameReady( onReady, contextFrame ) {
	if ( "complete" == contextFrame.contentDocument.readyState ) {
		onReady();
	}

	contextFrame.addEventListener( "load", onReady );
}
