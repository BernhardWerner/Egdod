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


	// ************************************************************************************************
	// Easing functions.
	// ************************************************************************************************
	easeInSine(x)        := 1 - cos((x * pi) / 2);
	easeOutSine(x)       := sin((x * pi) / 2);
	easeInOutSine(x)     := -(cos(pi * x) - 1) / 2;
   
	easeInQuad(x)        := x^2;
	easeOutQuad(x)       := 1 - (1 - x)^2;
	easeInOutQuad(x)     := if(x < 0.5, 2 * x^2, 1 - (-2 * x + 2)^2 / 2);
	   
	easeInCubic(x)       := x^3;
	easeOutCubic(x)      := 1 - (1 - x)^3;
	easeInOutCubic(x)    := if( x < 0.5, 4 * x^3, 1 - (-2 * x + 2)^3 / 2);
	   
	easeInQuart(x)       := x^4;
	easeOutQuart(x)      := 1 - (1 - x)^4;
	easeInOutQuart(x)    := if(x < 0.5, 8 * x^4, 1 - (-2 * x + 2)^4 / 2);
	   
	easeInQuint(x)       := x^5;
	easeOutQuint(x)      := 1 - (1 - x)^5;
	easeInOutQuint(x)    := if(x < 0.5, 16 * x^5, 1 - (-2 * x + 2)^5 / 2);
   
	easeInExpo(x)        := if(x == 0, 0, 2^(10 * x - 10));
	easeOutExpo(x)       := if(x == 1, 1, 1 - 2^(-10 * x));
	easeInOutExpo(x)     := if(x == 0, 0, if(x == 1, 1, if(x < 0.5, 2^(20 * x - 10) / 2, (2 - 2^(-20 * x + 10)) / 2)));
   
	easeInCirc(x)        := 1 - sqrt(1 - x^2);
	easeOutCirc(x)       := sqrt(1 - (x - 1)^2);
	easeInOutCirc(x)     := if(x < 0.5, (1 - sqrt(1 - 4 * x^2)) / 2, (sqrt(1 - (-2 * x + 2)^2) + 1) / 2);

	easeInBack(x)        := 2.70158 * x^3 - 1.70158 * x^2;
	easeOutBack(x)       := 1 - easeInBack(1 - x);
	easeInOutBack(x)     := if(x < 0.5, 4 * x^2 * ((1.70158 * 1.525 + 1) * 2 * x - 1.70158 * 1.525) / 2, ((2 * x - 2)^2 * ((1.70158 * 1.525 + 1) * (2 * x - 2) + 1.70158 * 1.525) + 2) / 2);

	easeInElastic(x)     := if(x == 0, 0, if(x == 1, 1, -2^(10 * x - 10) * sin(2 * pi / 3 * (10 * x - 10.75))));
	easeOutElastic(x)    := 1 - easeInElastic(1 - x);
	easeInOutElastic(x)  := if(x == 0, 0, if(x == 1, 1, if(x < 0.5, -2^(20 * x - 10) * sin(4 * pi / 9 * (20 * x - 11.125)) / 2, 2^(-20 * x + 10) * sin(4 * pi / 9 * (20 * x - 11.125)) / 2 + 1)));






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
