/*
 * Put <script src="egdod.js" data-scriptid="YOURINITSCRIPTID"></script> before your createCindy.
 */
(function(){
	var code = document.createTextNode(`

	// ************************************************************************************************
	// Gets the current time from the computer clock converted to seconds.
	// ************************************************************************************************
	computerSeconds() := (
		regional(actualTime);

		actualTime = time();

		actualTime_1 * 3600 + actualTime_2 * 60 + actualTime_3 + actualTime_4 * 0.001;
	);

	// ************************************************************************************************
	// Sets up time-keeping variables. Will be automatically called when included.
	// ************************************************************************************************
	setupTime() := (
		timeBufferEABOW = computerSeconds();
	);
	setupTime();

	// ************************************************************************************************
	// Returns the duration ofthe last frame/tick in seconds.
	// ************************************************************************************************
	deltaTime() := (
		regional(result);

		result = computerSeconds() - timeBufferEABOW;
		timeBufferEABOW = computerSeconds();

		result;
	);

	// ************************************************************************************************
	// Returns the current FPS with a given precision.
	// ************************************************************************************************
	fps(digits) := (
		0.1^digits * round(10^digits / deltaTime());
	);
	fps() := fps(0);

`);


	var scriptId = document.currentScript.dataset.scriptid;
	if (!scriptId) scriptId = 'csinit';

	var scriptElement = document.getElementById(scriptId);
	if (!scriptElement) {
		scriptElement = document.createElement("script");
		scriptElement.id = scriptId;
		scriptElement.type = "text/x-cindyscript";
		document.head.appendChild(scriptElement);
	}
	if (scriptElement.firstChild) {
		scriptElement.insertBefore(code, scriptElement.firstChild);
	} else {
		scriptElement.appendChild(code);
	}

})();
